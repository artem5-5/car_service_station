const db = require('../config/database');

class Order {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT so.*, 
             c.first_name as client_first_name, 
             c.last_name as client_last_name,
             c.phone as client_phone,
             e.first_name as employee_first_name,
             e.last_name as employee_last_name
      FROM service_orders so
      LEFT JOIN clients c ON so.client_id = c.id
      LEFT JOIN employees e ON so.employee_id = e.id
      ORDER BY so.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT so.*, 
             c.first_name as client_first_name, 
             c.last_name as client_last_name,
             c.phone as client_phone,
             e.first_name as employee_first_name,
             e.last_name as employee_last_name
      FROM service_orders so
      LEFT JOIN clients c ON so.client_id = c.id
      LEFT JOIN employees e ON so.employee_id = e.id
      WHERE so.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(orderData) {
    const { client_id, employee_id, vehicle_info, problem_description } = orderData;
    const [result] = await db.execute(
      'INSERT INTO service_orders (client_id, employee_id, vehicle_info, problem_description) VALUES (?, ?, ?, ?)',
      [client_id, employee_id, vehicle_info, problem_description]
    );
    return result.insertId;
  }

  static async updateStatus(id, status) {
    await db.execute(
      'UPDATE service_orders SET status = ?, completed_at = ? WHERE id = ?',
      [status, status === 'completed' ? new Date() : null, id]
    );
    return this.findById(id);
  }
}

module.exports = Order;