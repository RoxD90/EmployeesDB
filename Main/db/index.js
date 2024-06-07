const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findAllEmployees() {
    return this.connection.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
              department.name AS department, role.salary, 
              CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
       FROM employee 
       LEFT JOIN role ON employee.role_id = role.id 
       LEFT JOIN department ON role.department_id = department.id 
       LEFT JOIN employee manager ON manager.id = employee.manager_id;`
    ).catch(error => {
      console.error("Error finding all employees:", error);
    });
  }

  findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      [employeeId]
    ).catch(error => {
      console.error("Error finding all possible managers:", error);
    });
  }

  createEmployee(employee) {
    return this.connection.promise().query(
      "INSERT INTO employee SET ?",
      employee
    ).catch(error => {
      console.error("Error creating employee:", error);
    });
  }

  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    ).catch(error => {
      console.error("Error updating employee role:", error);
    });
  }

  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    ).catch(error => {
      console.error("Error updating employee manager:", error);
    });
  }

  findAllRoles() {
    return this.connection.promise().query(
      `SELECT role.id, role.title, department.name AS department, role.salary 
       FROM role 
       LEFT JOIN department ON role.department_id = department.id;`
    ).catch(error => {
      console.error("Error finding all roles:", error);
    });
  }

  createRole(role) {
    return this.connection.promise().query(
      "INSERT INTO role SET ?",
      role
    ).catch(error => {
      console.error("Error creating role:", error);
    });
  }

  findAllDepartments() {
    return this.connection.promise().query(
      "SELECT department.id, department.name FROM department;"
    ).catch(error => {
      console.error("Error finding all departments:", error);
    });
  }

  viewDepartmentBudgets() {
    return this.connection.promise().query(
      `SELECT department.id, department.name, SUM(role.salary) AS utilized_budget 
       FROM employee 
       LEFT JOIN role ON employee.role_id = role.id 
       LEFT JOIN department ON role.department_id = department.id 
       GROUP BY department.id, department.name;`
    ).catch(error => {
      console.error("Error viewing department budgets:", error);
    });
  }

  createDepartment(department) {
    return this.connection.promise().query(
      "INSERT INTO department SET ?",
      department
    ).catch(error => {
      console.error("Error creating department:", error);
    });
  }

  findAllEmployeesByDepartment(departmentId) {
    return this.connection.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title 
       FROM employee 
       LEFT JOIN role ON employee.role_id = role.id 
       LEFT JOIN department ON role.department_id = department.id 
       WHERE department.id = ?;`,
      [departmentId]
    ).catch(error => {
      console.error("Error finding all employees by department:", error);
    });
  }

  findAllEmployeesByManager(managerId) {
    return this.connection.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title 
       FROM employee 
       LEFT JOIN role ON role.id = employee.role_id 
       LEFT JOIN department ON department.id = role.department_id 
       WHERE manager_id = ?;`,
      [managerId]
    ).catch(error => {
      console.error("Error finding all employees by manager:", error);
    });
  }
}

module.exports = new DB(connection);
