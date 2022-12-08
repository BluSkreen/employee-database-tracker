// import database credentials, entity classes, the database connection object, inquirer
require("dotenv").config();
const { Department, Role, Employee, db } = require("./entities/entities");
const inquirer = require("inquirer");
// create objects for each entity
const department = new Department();
const role = new Role();
const employee = new Employee();

// main prompt to get users next action
const getAction = async () => {
  const nextAction = await inquirer.prompt([
    {
      type: "list",
      name: "input",
      message: "What would you like to do?",
      choices: ["View All Employees", "View Manager's Employees", "View Department's Employees", "Add Employee", "Update Employee's Role", "Update Employee's Manager", "View All Roles", "Add Role", "View All Departments", "Add Department", "Delete Employee", "Delete Role", "Delete Department", "View Department's Utalized Budget", "Quit",],
      pageSize: 6,
      loop: true,
    },
  ]);

  return nextAction.input;
}

// prompt to view employees of specific employee
const viewManagerEmployees = async () => {
  let dbManagers = await employee.getManagers();

  let managerEmployees = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Who's employees do you want to see?",
      choices: dbManagers,
    },
  ]);

  await employee.viewManagerEmployees(managerEmployees.choice);
}

// prompt to view employees of specific department
const viewDepartmentEmployees = async () => {
  let dbDepartments = await department.getDepartments();

  const departmentEmployees = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What department do you want to view?",
      choices: dbDepartments,
    },
  ]);

  await employee.viewDepartmentEmployees(departmentEmployees.choice);
}

// prompt to view utilized budget of specific department
const viewUtilizedBudget = async () => {
  let dbDepartments = await department.getDepartments();
  await new Promise(res => setTimeout(res, 100));

  const departmentUB = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Which department?",
      choices: dbDepartments,
    },
  ]);

  await employee.viewUtilizedBudget(departmentUB.choice);
}

// prompt to get employee info and add it to the data base
const addEmployee = async () => {
  let dbManagers = await employee.getManagers();
  let dbRoles = await role.getRoles();

  const newEmployee = await inquirer.prompt([
    {
      type: "input",
      name: "first",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: dbRoles,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: dbManagers,
    },
  ]);

  await employee.add(newEmployee.first, newEmployee.last, newEmployee.role, newEmployee.manager);
};

// prompt to get employee info and update it in the database
const updateEmployeeRole = async () => {
  let dbEmployees = await employee.getEmployees();
  let dbRoles = await role.getRoles();

  const update = await inquirer.prompt([
    {
      type: "list",
      name: "name",
      message: "Which employee's role do you want to update?",
      choices: dbEmployees,
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's new role?",
      choices: dbRoles,
    },
  ]);

  await employee.updateRole(update.name, update.role);
};

// prompt to get employee and new manager to update
const updateEmployeeManager = async () => {
  let dbEmployees = await employee.getEmployees();
  let dbManagers = await employee.getManagers();
  
  const newEmployee = await inquirer.prompt([
    {
      type: "list",
      name: "employeeChoice",
      message: "Which employee's manager do you want to update?",
      choices: dbEmployees,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's new manager?",
      choices: dbManagers,
    },
  ]);

  await employee.updateManager(newEmployee.employeeChoice, newEmployee.manager);
};

// prompt to get employee and new role to update
const addRole = async () => {
  let dbDepartments = await department.getDepartments();

  const newRole = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "number",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "assign",
      message: "What is the name of the role?",
      choices: dbDepartments,
    },
  ]);

  await role.add(newRole.title, newRole.salary, newRole.assign);
};

// prompt to get new department name and add it to the database
const addDepartment = async () => {
  const newDepartment = await inquirer.prompt([
    {
      type: "input",
      name: "input",
      message: "What is the name of the department?",
    },
  ]);
  await department.add(newDepartment.input);
}

const deleteEmployee= async () => {
  let dbEmployees = await employee.getEmployees();

  const dbDelete = await inquirer.prompt([
    {
      type: "list",
      name: "dbEmployee",
      message: "What employee do you want to delete?",
      choices: dbEmployees,
    },
  ]);

  await employee.delete(dbDelete.dbEmployee);
}

const deleteRole= async () => {
  let dbRoles = await role.getRoles();

  const dbDelete = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "What role do you want to delete?",
      choices: dbRoles,
    },
  ]);

  await role.delete(dbDelete.role);
}

const deleteDepartment= async () => {
  let dbDepartments = await department.getDepartments();

  const dbDelete = await inquirer.prompt([
    {
      type: "list",
      name: "dbDepartment",
      message: "What department do you want to delete?",
      choices: dbDepartments,
    },
  ]);

  await department.delete(dbDelete.dbDepartment);
}

async function init() {
  // this is the main loop for the prompts
  // if the user chooses "Quit" from the prompt in "getAction()", then the app will end
  let running = true;
  while (running) {
    const action = await getAction();
    // activate switch block based on users choice from the prompt in "getAction"
    switch (action) {
      // uses "setTimeout" to allow tables to display in the console
      case "View All Employees":
        await employee.viewAll();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "View Manager's Employees":
        await viewManagerEmployees();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "View Department's Employees":
        await viewDepartmentEmployees();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update Employee's Role":
        await updateEmployeeRole();
        break;
      case "Update Employee's Manager":
        await updateEmployeeManager();
        break;
      case "View All Roles":
        await role.viewAll();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "Add Role":
        await addRole();
        break;
      case "View All Departments":
        await department.viewAll();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "View Department's Utalized Budget":
        await viewUtilizedBudget();
        await new Promise(res => setTimeout(res, 100));
        break;
      case "Delete Employee":
        await deleteEmployee();
        break;
      case "Delete Role":
        await deleteRole();
        break;
      case "Delete Department":
        await deleteDepartment();
        break;
      case "Quit":
        running = false;
        db.end();
        break;
    }
  }
}

init();