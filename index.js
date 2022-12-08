// import database credentials, entity classes, the database connection object, inquirer
require("dotenv").config();
const { Department, Role, Employee, db } = require("./entities/entities");
const inquirer = require("inquirer");
// create objects for each entity
const department = new Department();
const role = new Role();
const employee = new Employee();

// department.add("service");
// role.add("Customer Service", 80000, "service");
// employee.add("Darth", "Vader", "service", "han solo");


const getAction = async () => {
  const nextAction = await inquirer.prompt([
    {
      type: "list",
      name: "input",
      message: "What would you like to do?",
      choices: ["View All Employees", "View Manager's Employees", "View Department's Employees", "Add Employee", "Update Employee's Role", "Update Employee's Manager", "Delete Employee", "View All Roles", "Add Role", "Delete Role", "View All Departments", "Add Department", "Delete Department", "View Department's Utalized Budget", "Quit",],
      pageSize: 6,
      loop: true,
    },
  ]);
  return nextAction.input;
}

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
  employee.viewManagerEmployees(managerEmployees.choice);
}

// console.log(department.getDepartments());

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
  employee.viewDepartmentEmployees(departmentEmployees.choice);
}

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

const updateEmployeeRole = async () => {
  let dbEmployees = await employee.getEmployees();
  let dbRoles = await role.getRoles();
  await console.log(dbEmployees + "\n" + dbRoles);
  const newEmployee = await inquirer.prompt([
    {
      type: "list",
      name: "employeeChoice",
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
  await employee.updateRole(newEmployee.employeeChoice, newEmployee.role);
};

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

//"View All Employees", "View Manager's Employees", "View Department's Employees", "Add Employee", "Update Employee's Role", "Update Employee's Manager", "Delete Employee", "View All Roles", "Add Role", "Delete Role", "View All Departments", "Add Department", "Delete Department", "View Department's Utalized Budget", "Quit"

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
        break
      case "View Department's Employees":
        await viewDepartmentEmployees();
        await new Promise(res => setTimeout(res, 100));
        break;;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update Employee Role":
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
      case "Quit":
        running = false;
        db.end();
        break;
    }
  }
}

init();