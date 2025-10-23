const db = require('../config/database');

class Part {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT p.*, pc.name as category_name 
      FROM parts p 
      LEFT JOIN part_categories pc ON p.category_id = pc.id 
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT p.*, pc.name as category_name 
      FROM parts p 
      LEFT JOIN part_categories pc ON p.category_id = pc.id 
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async findLowStock() {
    const [rows] = await db.execute(`
      SELECT p.*, pc.name as category_name 
      FROM parts p 
      LEFT JOIN part_categories pc ON p.category_id = pc.id 
      WHERE p.quantity <= p.min_quantity 
      ORDER BY p.quantity ASC
    `);
    return rows;
  }

  static async create(partData) {
    const { name, category_id, part_number, manufacturer, price, quantity, min_quantity, location } = partData;
    const [result] = await db.execute(
      'INSERT INTO parts (name, category_id, part_number, manufacturer, price, quantity, min_quantity, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category_id, part_number, manufacturer, price, quantity, min_quantity, location]
    );
    return this.findById(result.insertId);
  }

  static async update(id, partData) {
    const { name, category_id, part_number, manufacturer, price, quantity, min_quantity, location } = partData;
    await db.execute(
      'UPDATE parts SET name = ?, category_id = ?, part_number = ?, manufacturer = ?, price = ?, quantity = ?, min_quantity = ?, location = ? WHERE id = ?',
      [name, category_id, part_number, manufacturer, price, quantity, min_quantity, location, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM parts WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Part;