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

  // add a department
  add = (name) => {
    db.query(`INSERT INTO department(name) VALUES ("${name}");`, function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("Department added!");
      }
    });
  };
}

class Role {
  viewAll = () => {
    db.query("SELECT role.title, role.id, department.name AS department, role.salary FROM department JOIN role ON department.id = role.id;", function (err, results) {
      console.table(results);
    });
  };

  // add a role to a department
  add = (title, salary, department) => {
    // get the department is using its names
    db.query(`SELECT id FROM department WHERE name = "${department}";`, function (err, results) {
      if (err) {
        console.error(err);
      }
      console.log(results);
      db.query(
        `INSERT INTO role(title, salary, department_id) VALUES ("${title}", ${salary}, ${results[0].id});`,
        function (err, results) {
          if (err) {
            console.error(err);
          } else {
            console.log("Role added!");
          }
        }
      );
    });
  };
}

class Employee {
  viewAll = () => {
    db.query("SELECT * FROM employee", function (err, results) {
      console.table(results);
    });
  };

  // add an employee
  add = (first_name, last_name, role, manager) => {
    // get the role id using the title
    let role_id = db.query(
      `SELECT id FROM role WHERE title = "${role}";`,
      function (err, results) {
        if (err) {
          console.error(err);
        }
      }
    );

    //get the managers id by spliting the last and first name for use in the query
    let manager_id = db.query(
      `SELECT id FROM employee WHERE first_name = "${manager.split(" ")[0]}" AND last_name = "${manager.split(" ")[1]}";`,
      function (err, results) {
        if (err) {
          console.error(err);
        }
      }
    );

    db.query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${first_name}","${last_name}",${role_id},${manager_id});`,
      function (err, results) {
       console.log("Employee added!");
      }
    );
  };

  // update an employee's role by using their id
  update = (first_name, last_name, role) => {
    // use the role name to get role id
    let role_id = db.query(
      `SELECT id FROM role WHERE title = "${role}";`,
      function (err, results) {
        if (err) {
          console.error(err);
        }
      }
    );

    // use the first and last names to get the id
    let id = db.query(
      `SELECT id FROM employee WHERE first_name = "${first_name}" AND last_name = "${last_name}";`,
      function (err, results) {
        if (err) {
          console.error(err);
        }
      }
    );

    db.query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${id};`, function (err, results) {
      console.log("Updated role!");
    });
  };
}

// const dp = new Department();
// dp.viewDp();

module.exports = { Department, Role, Employee };
