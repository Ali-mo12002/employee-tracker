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
    const result = await this.query(`
      SELECT 
        employees.id, 
        employees.first_name, 
        employees.last_name, 
        roles.title AS role,
        departments.name AS department,
        roles.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM 
        employees 
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS manager ON employees.manager_id = manager.id;
    `);
    return result.rows;
  }
  

  async addDepartment(name) {
    await this.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  }

  async deleteDepartment(departmentId) {
    await this.query('DELETE FROM departments WHERE id = $1', [departmentId]);
  }

  async addRole(title, salary, departmentId) {
    await this.query(
      'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, departmentId]
    );
  }
  async deleteRole(roleId) {
    await this.query('DELETE FROM roles WHERE id = $1', [roleId]);
  }
  

  async addEmployee(firstName, lastName, roleId, managerId) {
    await this.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, roleId, managerId]
    );
  }
  async deleteEmployee(employeeId) {
    await this.query('DELETE FROM employees WHERE id = $1', [employeeId]);
  }
  
  async updateEmployeeRole(employeeId, roleId) {
    await this.query('UPDATE employees SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }
  async TotalBudgetByDepartment(departmentId) {
    const result = await this.query(
      'SELECT SUM(roles.salary) AS total_budget FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = $1',
      [departmentId]
    );
    return result.rows[0].total_budget || 0; // Return 0 if no employees or budget found
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