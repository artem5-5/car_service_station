const db = require('../config/database');

class Client {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM clients ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(clientData) {
    const { first_name, last_name, phone, email, car_model, car_year, license_plate } = clientData;
    const [result] = await db.execute(
      'INSERT INTO clients (first_name, last_name, phone, email, car_model, car_year, license_plate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, phone, email, car_model, car_year, license_plate]
    );
    return this.findById(result.insertId);
  }

  static async update(id, clientData) {
    const { first_name, last_name, phone, email, car_model, car_year, license_plate } = clientData;
    await db.execute(
      'UPDATE clients SET first_name = ?, last_name = ?, phone = ?, email = ?, car_model = ?, car_year = ?, license_plate = ? WHERE id = ?',
      [first_name, last_name, phone, email, car_model, car_year, license_plate, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM clients WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Client;