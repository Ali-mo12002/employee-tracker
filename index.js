const { prompt } = require('inquirer');
const db = require('./db');

mainPrompt();

function mainPrompt() {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Welcome to the Employee Tracker. What would you like to do?',
      choices: [
        { name: 'Add Employee', value: 'ADD_EMPLOYEE' },
        { name: 'View All Employees', value: 'VIEW_EMPLOYEES' },
        { name: 'View All Employees By Department', value: 'VIEW_EMPLOYEES_BY_DEPARTMENT' },
        { name: 'View All Employees By Manager', value: 'VIEW_EMPLOYEES_BY_MANAGER' },
        { name: 'Remove Employee', value: 'REMOVE_EMPLOYEE' },
        { name: 'Update Employee Role', value: 'UPDATE_EMPLOYEE_ROLE' },
        { name: 'Update Employee Manager', value: 'UPDATE_EMPLOYEE_MANAGER' },
        { name: 'View All Roles', value: 'VIEW_ROLES' },
        { name: 'Add Role', value: 'ADD_ROLE' },
        { name: 'Remove Role', value: 'REMOVE_ROLE' },
        { name: 'View All Departments', value: 'VIEW_DEPARTMENTS' },
        { name: 'Add Department', value: 'ADD_DEPARTMENT' },
        { name: 'Remove Department', value: 'REMOVE_DEPARTMENT' },
        { name: 'View Total Utilized Budget By Department', value: 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT' },
        { name: 'Quit', value: 'QUIT' }
      ],
    },
  ]).then(({ choice }) => {
    switch (choice) {
      case 'ADD_EMPLOYEE':
        addEmployee();
        break;
      case 'VIEW_EMPLOYEES':
        viewEmployees();
        break;
      case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
        viewEmployeesByDepartment();
        break;
      case 'VIEW_EMPLOYEES_BY_MANAGER':
        viewEmployeesByManager();
        break;
      case 'REMOVE_EMPLOYEE':
        removeEmployee();
        break;
      case 'UPDATE_EMPLOYEE_ROLE':
        updateEmployeeRole();
        break;
      case 'UPDATE_EMPLOYEE_MANAGER':
        updateEmployeeManager();
        break;
      case 'VIEW_ROLES':
        viewRoles();
        break;
      case 'ADD_ROLE':
        addRole();
        break;
      case 'REMOVE_ROLE':
        removeRole();
        break;
      case 'VIEW_DEPARTMENTS':
        viewDepartments();
        break;
      case 'ADD_DEPARTMENT':
        addDepartment();
        break;
      case 'REMOVE_DEPARTMENT':
        removeDepartment();
        break;
      case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
        viewUtilizedBudgetByDepartment();
        break;
      case 'QUIT':
        quit();
        break;
      default:
        console.log('Invalid choice');
    }
  });
}

function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function viewEmployeesByDepartment() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
      return prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select department:',
          choices: departmentChoices,
        },
      ]);
    })
    .then(({ departmentId }) => db.findAllEmployeesByDepartment(departmentId))
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const managerChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      return prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Select manager:',
          choices: managerChoices,
        },
      ]);
    })
    .then(({ managerId }) => db.findAllEmployeesByManager(managerId))
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function removeEmployee() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select employee to remove:',
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => db.removeEmployee(employeeId))
    .then(() => console.log('Employee removed'))
    .then(() => mainPrompt());
}

function updateEmployeeRole() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select employee to update role:',
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => {
      return db.findAllRoles()
        .then(({ rows }) => {
          const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
          return prompt([
            {
              type: 'list',
              name: 'roleId',
              message: 'Select new role:',
              choices: roleChoices,
            },
          ]);
        })
        .then(({ roleId }) => db.updateEmployeeRole(employeeId, roleId))
        .then(() => console.log('Employee role updated'));
    })
    .then(() => mainPrompt());
}

function updateEmployeeManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select employee to update manager:',
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => {
      return db.findAllEmployees()
        .then(({ rows }) => {
          const managerChoices = rows.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          }));
          managerChoices.unshift({ name: 'None', value: null });
          return prompt([
            {
              type: 'list',
              name: 'managerId',
              message: 'Select new manager:',
              choices: managerChoices,
            },
          ]);
        })
        .then(({ managerId }) => db.updateEmployeeManager(employeeId, managerId))
        .then(() => console.log('Employee manager updated'));
    })
    .then(() => mainPrompt());
}

function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function addRole() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
      return prompt([
        {
          name: 'title',
          message: 'Enter role name:',
        },
        {
          name: 'salary',
          message: 'Enter role salary:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select department for the role:',
          choices: departmentChoices,
        },
      ]);
    })
    .then((role) => db.createRole(role))
    .then(() => console.log('Role added'))
    .then(() => mainPrompt());
}

function removeRole() {
  db.findAllRoles()
    .then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
      return prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Select role to remove:',
          choices: roleChoices,
        },
      ]);
    })
    .then(({ roleId }) => db.removeRole(roleId))
    .then(() => console.log('Role removed'))
    .then(() => mainPrompt());
}

function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function addDepartment() {
  prompt([
    {
      name: 'name',
      message: 'Enter department name:',
    },
  ])
    .then((department) => db.createDepartment(department))
    .then(() => console.log('Department added'))
    .then(() => mainPrompt());
}

function removeDepartment() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
      return prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select department to remove:',
          choices: departmentChoices,
        },
      ]);
    })
    .then(({ departmentId }) => db.removeDepartment(departmentId))
    .then(() => console.log('Department removed'))
    .then(() => mainPrompt());
}

function viewUtilizedBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(() => mainPrompt());
}

function addEmployee() {
  prompt([
    {
      name: 'first_name',
      message: "Enter employee's first name:",
    },
    {
      name: 'last_name',
      message: "Enter employee's last name:",
    },
  ])
    .then(({ first_name, last_name }) => {
      return db.findAllRoles()
        .then(({ rows }) => {
          const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
          return prompt([
            {
              type: 'list',
              name: 'role_id',
              message: 'Select employee role:',
              choices: roleChoices,
            },
          ]);
        })
        .then(({ role_id }) => {
          return db.findAllEmployees()
            .then(({ rows }) => {
              const managerChoices = rows.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
              }));
              managerChoices.unshift({ name: 'None', value: null });
              return prompt([
                {
                  type: 'list',
                  name: 'manager_id',
                  message: 'Select employee manager:',
                  choices: managerChoices,
                },
              ]);
            })
            .then(({ manager_id }) => db.createEmployee({ first_name, last_name, role_id, manager_id }));
        });
    })
    .then(() => console.log('Employee added'))
    .then(() => mainPrompt());
}

function quit() {
  console.log('Thank you for using the Employee Tracker. Goodbye!');
  process.exit();
}
