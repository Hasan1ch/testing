const bcrypt = require('bcryptjs');
const db = require('../services/db');

class User {
  constructor(email) {
    this.email = email;
  }

  async getIdFromEmail() {
    const sql = 'SELECT id FROM Users WHERE email = ?';
    const result = await db.query(sql, [this.email]);
    if (result.length > 0) {
      this.id = result[0].id;
      return this.id;
    } else {
      return false;
    }
  }

  async setUserPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE Users SET password = ? WHERE id = ?';
    await db.query(sql, [hashedPassword, this.id]);
    return true;
  }

  async addUser(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO Users (email, password) VALUES (?, ?)';
    const result = await db.query(sql, [this.email, hashedPassword]);
    this.id = result.insertId;
    return true;
  }

  async authenticate(submittedPassword) {
    const sql = 'SELECT password FROM Users WHERE id = ?';
    const result = await db.query(sql, [this.id]);
    const match = await bcrypt.compare(submittedPassword, result[0].password);
    return match;
  }
}

module.exports = { User };