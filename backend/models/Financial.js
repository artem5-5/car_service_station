const db = require('../config/database');

class Financial {
  static async findAll(params = {}) {
    let query = `
      SELECT fo.*, so.id as order_id
      FROM financial_operations fo
      LEFT JOIN service_orders so ON fo.related_order_id = so.id
      WHERE 1=1
    `;
    const queryParams = [];

    // Фильтр по дате начала
    if (params.startDate) {
      query += ' AND fo.operation_date >= ?';
      queryParams.push(params.startDate);
    }

    // Фильтр по дате окончания
    if (params.endDate) {
      query += ' AND fo.operation_date <= ?';
      queryParams.push(params.endDate);
    }

    // Фильтр по типу операции
    if (params.type) {
      query += ' AND fo.type = ?';
      queryParams.push(params.type);
    }

    query += ' ORDER BY fo.operation_date DESC, fo.created_at DESC';

    console.log('📋 SQL Query:', query);
    console.log('🔧 Query params:', queryParams);

    const [rows] = await db.execute(query, queryParams);
    return rows;
  }

  static async create(operationData) {
    const { type, amount, description, category, related_order_id } = operationData;
    const [result] = await db.execute(
      'INSERT INTO financial_operations (type, amount, description, category, related_order_id, operation_date) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [type, amount, description, category, related_order_id]
    );
    return result.insertId;
  }

  static async getSummary(params = {}) {
    let query = `
      SELECT 
        type,
        SUM(amount) as total
      FROM financial_operations 
      WHERE 1=1
    `;
    const queryParams = [];

    if (params.startDate) {
      query += ' AND operation_date >= ?';
      queryParams.push(params.startDate);
    }
    if (params.endDate) {
      query += ' AND operation_date <= ?';
      queryParams.push(params.endDate);
    }
    if (params.type) {
      query += ' AND type = ?';
      queryParams.push(params.type);
    }

    query += ' GROUP BY type';

    const [rows] = await db.execute(query, queryParams);
    
    const summary = {
      income: 0,
      expense: 0,
      balance: 0
    };

    rows.forEach(row => {
      if (row.type === 'income') {
        summary.income = parseFloat(row.total) || 0;
      } else if (row.type === 'expense') {
        summary.expense = parseFloat(row.total) || 0;
      }
    });

    summary.balance = summary.income - summary.expense;
    
    return summary;
  }
}

module.exports = Financial;