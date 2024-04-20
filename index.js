const inquirer = require('inquirer');
const db = require('./db');

startApp();

async function startApp() {
  try {
    const { userChoice } = await inquirer.prompt({
      type: 'list',
      name: 'userChoice',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    });

    switch (userChoice) {
      case 'View all departments':
        const departments = await db.getAllDepartments();
        console.table(departments);
        break;
      case 'View all roles':
        const roles = await db.getAllRoles();
        console.table(roles);
        break;
      case 'View all employees':
        const employees = await db.getAllEmployees();
        console.table(employees);
        break;
      case 'Add a department':
        const departmentNameInput = await inquirer.prompt({
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department:'
        });
      

        const departmentName = departmentNameInput.departmentName;
      
        try {
          await db.addDepartment(departmentName);
          console.log('Department added successfully!');
        } catch (error) {
          console.error('Error adding department:', error.message);
        }        break;
      case 'Add a role':
        try {
          const roleDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Enter the title of the role:'
            },
            {
              type: 'number',
              name: 'salary',
              message: 'Enter the salary for the role:'
            },
            {
              type: 'number',
              name: 'departmentId',
              message: 'Enter the department ID for the role:'
            }
          ]);
          await db.addRole(roleDetails.title, roleDetails.salary, roleDetails.departmentId);
          console.log('Role added successfully!');
        } catch (error) {
          console.error('Error adding role:', error.message);
        }
        break;
      case 'Add an employee':
     
        break;
    }
    const { userReturn} = await inquirer.prompt({
      type: 'list',
      name: 'userReturn',
      message: 'Do you want to return to main menu?',
      choices:[
        'yes',
        'no'
      ]
    });

    switch (userReturn) {
      case 'yes':
        startApp()
        break;
        case 'no':
          console.log('thanks for using.');
          break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
