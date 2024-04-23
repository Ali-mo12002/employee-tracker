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
        'Delete a department',
        'Add a role',
        'Delete a role',
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
        case 'Delete a department':
          try {
            const departments = await db.getAllDepartments();
            const departmentToDelete = await inquirer.prompt({
              type: 'list',
              name: 'departmentId',
              message: 'Select a department to delete:',
              choices: departments.map(department => ({
                name: department.name,
                value: department.id
              }))
            });
        
            await db.deleteDepartment(departmentToDelete.departmentId);
            console.log('Department deleted successfully!');
          } catch (error) {
            console.error('Error deleting department:', error.message);
          }
          break;
        
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

        case 'Delete a role':
            try {
              const roles = await db.getAllRoles();
              const roleToDelete = await inquirer.prompt({
                type: 'list',
                name: 'roleId',
                message: 'Select a role to delete:',
                choices: roles.map(role => ({
                  name: role.title,
                  value: role.id
                }))
              });

              await db.deleteRole(roleToDelete.roleId);
              console.log('Role deleted successfully!');
            } catch (error) {
              console.error('Error deleting role:', error.message);
            }
            break;

      case 'Add an employee':
        try {
          const employeeDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'Enter the first name of the employee:'
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'Enter the last name of the employee:'
            },
            {
              type: 'number',
              name: 'roleId',
              message: 'Enter the role ID for the employee:'
            },
            {
              type: 'number',
              name: 'managerId',
              message: 'Enter the manager ID for the employee:'
            }
          ]);
        
          await db.addEmployee(employeeDetails.firstName, employeeDetails.lastName, employeeDetails.roleId, employeeDetails.managerId);

            console.log('Employee added successfully!');
         }
        catch (error) {
            console.error('Failed to add employee.' , error.message);
        }
          break;

        case 'Update an employee role':
        console.log('hello');
        try {
          // Fetch all employees to display for selection
          const employees = await db.getAllEmployees();
  
          // Prompt user to select an employee to update
          const { employeeId } = await inquirer.prompt({
              type: 'list',
              name: 'employeeId',
              message: 'Select an employee to update:',
              choices: employees.map(employee => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id
              }))
          });
  
          // Fetch all roles to display for selection
          const roles = await db.getAllRoles();
  
          // Prompt user to select a new role for the employee
          const { roleId } = await inquirer.prompt({
              type: 'list',
              name: 'roleId',
              message: 'Select a new role for the employee:',
              choices: roles.map(role => ({
                  name: role.title,
                  value: role.id
              }))
          });
  
          // Update the employee's role in the database
          await db.updateEmployeeRole(employeeId, roleId);
          console.log('Employee role updated successfully!');
      } catch (error) {
          console.error('Error updating employee role:', error);
      }
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
