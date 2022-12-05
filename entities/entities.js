const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("Connected")
);

class Department {
  viewAll = () => {
    db.query("SELECT * FROM department", function (err, results) {
      console.table(results);
    });
  };
  add = (name) => {
    db.query(`INSERT INTO department(name) VALUES ("${name}");`, function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.table(results);
      }
    });
  };
}

class Role {
  viewAll = () => {
    db.query("SELECT * FROM role", function (err, results) {
      console.table(results);
    });
  };
  add = (title, salary, department_id) => {
    db.query(
      `INSERT INTO role(title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id});`,
      function (err, results) {
        console.table(results);
      }
    );
  };
}

class Employee {
  viewAll = () => {
    db.query("SELECT * FROM employee", function (err, results) {
      console.table(results);
    });
  };
  add = (first_name, last_name, role_id, manager_id) => {
    db.query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${first_name}","${last_name}",${role_id},${manager_id});`,
      function (err, results) {
        console.table(results);
      }
    );
  };
}

// const dp = new Department();
// dp.viewDp();

module.exports = { Department, Role, Employee };
