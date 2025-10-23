const Order = require('../models/Order');
const db = require('../config/database');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { client_id, employee_id, vehicle_info, problem_description, services, parts } = req.body;
    
    // Create order
    const orderId = await Order.create({
      client_id, 
      employee_id, 
      vehicle_info, 
      problem_description
    });

    let totalAmount = 0;

    // Add services to order
    if (services && services.length > 0) {
      for (const service of services) {
        const [serviceData] = await connection.execute(
          'SELECT price FROM services WHERE id = ?',
          [service.service_id]
        );
        const servicePrice = serviceData[0].price;
        totalAmount += servicePrice * service.quantity;
        
        await connection.execute(
          'INSERT INTO order_services (order_id, service_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, service.service_id, service.quantity, servicePrice]
        );
      }
    }

    // Add parts to order
    if (parts && parts.length > 0) {
      for (const part of parts) {
        const [partData] = await connection.execute(
          'SELECT price, quantity FROM parts WHERE id = ?',
          [part.part_id]
        );
        const partPrice = partData[0].price;
        const currentQuantity = partData[0].quantity;
        
        if (currentQuantity < part.quantity) {
          throw new Error(`Not enough parts in stock: ${part.part_id}`);
        }

        totalAmount += partPrice * part.quantity;
        
        // Add to order
        await connection.execute(
          'INSERT INTO order_parts (order_id, part_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, part.part_id, part.quantity, partPrice]
        );

        // Update stock quantity
        await connection.execute(
          'UPDATE parts SET quantity = quantity - ? WHERE id = ?',
          [part.quantity, part.part_id]
        );
      }
    }

    // Update total amount
    await connection.execute(
      'UPDATE service_orders SET total_amount = ? WHERE id = ?',
      [totalAmount, orderId]
    );

    // Record financial operation
    await connection.execute(
      'INSERT INTO financial_operations (type, amount, description, category, related_order_id, operation_date) VALUES (?, ?, ?, ?, ?, CURDATE())',
      ['income', totalAmount, `Service order #${orderId}`, 'service_income', orderId]
    );

    await connection.commit();
    
    const order = await Order.findById(orderId);
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    connection.release();
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.updateStatus(req.params.id, status);
    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
};