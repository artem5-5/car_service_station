const db = require('../config/database');

class Employee {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM employees ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(employeeData) {
    const { first_name, last_name, position, salary, phone, email } = employeeData;
    const [result] = await db.execute(
      'INSERT INTO employees (first_name, last_name, position, salary, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, position, salary, phone, email]
    );
    return this.findById(result.insertId);
  }

  static async update(id, employeeData) {
    const { first_name, last_name, position, salary, phone, email } = employeeData;
    await db.execute(
      'UPDATE employees SET first_name = ?, last_name = ?, position = ?, salary = ?, phone = ?, email = ? WHERE id = ?',
      [first_name, last_name, position, salary, phone, email, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Employee;