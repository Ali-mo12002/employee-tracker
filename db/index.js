const pool = require('./connection');

class DB {
  constructor() {}

  async getAllDepartments() {
    const result = await this.query('SELECT * FROM departments');
    return result.rows;
  }
  async getAllRoles() {
    const result = await this.query(`
      SELECT roles.id, roles.title, roles.salary, departments.name AS department
      FROM roles
     JOIN departments ON roles.department_id = departments.id
    `);
    return result.rows;
  }
  

  async getAllEmployees() {
    const result = await this.query('SELECT * FROM employees');
    return result.rows;
  }

  async addDepartment(name) {
    await this.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  }

  async addRole(title, salary, departmentId) {
    await this.query(
      'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, departmentId]
    );
  }

  async addEmployee(firstName, lastName, roleId, managerId) {
    await this.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, roleId, managerId]
    );
  }

  async updateEmployeeRole(employeeId, roleId) {
    await this.query('UPDATE employees SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }
}

module.exports = new DB();