const db = require('../config/database');

class Service {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM services ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(serviceData) {
    const { name, description, price, duration_minutes, category } = serviceData;
    const [result] = await db.execute(
      'INSERT INTO services (name, description, price, duration_minutes, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, duration_minutes, category]
    );
    return this.findById(result.insertId);
  }

  static async update(id, serviceData) {
    const { name, description, price, duration_minutes, category } = serviceData;
    await db.execute(
      'UPDATE services SET name = ?, description = ?, price = ?, duration_minutes = ?, category = ? WHERE id = ?',
      [name, description, price, duration_minutes, category, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM services WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Service;