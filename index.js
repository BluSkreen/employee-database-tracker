require("dotenv").config();
const { Department, Role, Employee } = require("./entities/entities");

const department = new Department();
const role = new Role();
const employee = new Employee();

// department.viewAll();
// role.viewAll();
// employee.viewAll();

// department.add("service");
// role.add("Customer Service", 80000, 5);
// employee.add("Darth", "Vader", 5, 1);