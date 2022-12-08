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
  viewAll = async () => {
    await db.promise().query("SELECT * FROM department")
    .then(([rows]) => console.table(rows));
  };

  // add a department
  add = async (name) => {
    await db.promise().query(`INSERT INTO department(name) VALUES ("${name}");`)
    .then(() => console.log("Department added!"));     
  };

  delete = async (name) => {
    await db.promise().query(
      `DELETE FROM role WHERE title = ${name};`)
      .then(() => {
        console.log("Deleted Department!");
      });
  };

  getDepartments = async () => {
    let departments;
    await db.promise().query(`SELECT name FROM department;`)
    .then(([rows]) => {
      departments = rows.map(obj => obj['name']);
    });
    return departments;
  };
}

class Role {
  viewAll = async () => {
    await db.promise().query("SELECT role.title, role.id, department.name AS department, role.salary FROM department JOIN role ON department.id = role.id;")
    .then(([rows]) => {
      console.table(rows);
    });
  };

  // add a role to a department
  add = async (title, salary, department) => {
    // get the department is using its names
    let department_id;
    await db.promise().query(`SELECT id FROM department WHERE name = "${department}";`)
      .then (([rows]) => {
        department_id = rows[0].id;
      })
    await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id});`)
      .then(() => {
        console.log("Role added!");
      });
    };

  delete = async (title) => {
    await db.promise().query(
      `DELETE FROM role WHERE title = ${title};`)
      .then(() => {
        console.log("Deleted Role!");
      });
  };

  getRoles = async () => {
    let roles;
    await db.promise().query(`SELECT title FROM role;`)
    .then(([rows]) => {
      // console.log([rows]);
      roles = rows.map(obj => obj['title']);
    });
    return roles;
  };
}

class Employee {
  // view each employee's id, name, role, department, salary, and manager
  viewAll = async () => {
    await db.promise().query(
      `SELECT user.id, user.first_name, user.last_name, role.title, department.name AS department, role.salary, 
	CONCAT(manager.first_name, " ", manager.last_name) AS manager
FROM employee user
JOIN employee manager
	ON user.manager_id = manager.id
JOIN role
	ON role.id = user.id
JOIN department
	ON department.id = role.id`)
    .then(([rows]) => {
        console.table(rows);
    });
  };

  viewManagerEmployees = async (manager) => {
    let manager_id;
    await db.promise()
      .query(`SELECT id FROM employee WHERE first_name = "${manager.split(" ")[0]}" AND last_name = "${manager.split(" ")[1]}";`
      )
      .then(([rows]) => {
        manager_id = rows[0].id;
      });
    await db.promise()
      .query(`SELECT * FROM employee WHERE id != manager_id AND manager_id = ${manager_id};`)
      .then(([rows]) => {
        console.table(rows);
      });
  };

  viewDepartmentEmployees = async (department) => {
    await db.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title
FROM employee
JOIN role
	ON role.id = employee.role_id
JOIN department
	ON department.id = role.department_id
WHERE department.name = "${department}";`)
    .then(([rows]) => console.table(rows));
  };

  viewUtilizedBudget = async (department) => {
    await db.promise().query(
      `SELECT department.name, sum(ALL role.salary) as "Utilized Budget"
FROM employee
JOIN role
	ON role.id = employee.role_id
JOIN department
	ON department.id = role.department_id
WHERE department.name = "${department}";`)
    .then(([rows]) => console.table(rows));
  };

  // add an employee
  add = async (first_name, last_name, role, manager) => {
    // get the role id using the title
    let role_id
    await db.promise().query(`SELECT id FROM role WHERE title = "${role}";`)
      .then(([rows]) => {
        role_id = rows[0].id;
      });

    //get the managers id by spliting the last and first name for use in the query
    let manager_id;
    await db.promise().query(
      `SELECT id FROM employee WHERE first_name = "${manager.split(" ")[0]}" AND last_name = "${
        manager.split(" ")[1]
      }";`)
      .then(([rows]) => {
        manager_id = rows[0].id;
      });

    await db.promise().query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${first_name}","${last_name}",${role_id},${manager_id});`)
      .then(() => {
        console.log("Added Employee!");
      });
  };

  // update an employee's role by using their id
  updateRole = async (name, role) => {
    // use the role name to get role id
    let role_id
    await db.promise().query(`SELECT id FROM role WHERE title = "${role}";`)
      .then(([rows]) => {
        role_id = rows[0].id;
      });

    // use the first and last names to get the id
    let id;
    await db.promise().query(
      `SELECT id FROM employee WHERE first_name = "${name.split(" ")[0]}" AND last_name = "${
        name.split(" ")[1]
      }";`)
      .then(([rows]) => {
        id = rows[0].id;
      });

    await db.promise().query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${id};`)
      .then(() => {
        console.log("Updated Role!");
      });
  };

  // update an employee's manager by using their id
  updateManager = async (name, manager) => {
    //get the managers id by spliting the last and first name for use in the query
    let manager_id;
    await db.promise().query(
      `SELECT id FROM employee WHERE first_name = "${manager.split(" ")[0]}" AND last_name = "${
        manager.split(" ")[1]
      }";`)
      .then(([rows]) => {
        manager_id = rows[0].id;
      });

    // use the first and last names to get the id
    let id;
    await db.promise().query(
      `SELECT id FROM employee WHERE first_name = "${name.split(" ")[0]}" AND last_name = "${
        name.split(" ")[1]
      }";`)
      .then(([rows]) => {
        id = rows[0].id;
      });

    await db.promise().query(
      `UPDATE employee SET manager_id = ${manager_id} WHERE id = ${id};`)
      .then(() => {
        console.log("Updated Employee!");
      });
  };

  delete = async (name) => {
    let id;
    await db.promise().query(
      `SELECT id FROM employee WHERE first_name = "${name.split(" ")[0]}" AND last_name = "${
        name.split(" ")[1]
      }";`)
      .then(([rows]) => {
        id = rows[0].id;
      });

    await db.promise().query(
      `DELETE FROM employee WHERE id = ${id};`)
      .then(() => {
        console.log("Deleted Employee!");
      });
  };

  // gets
  getManagers = async () => {
    let managers;
    await db
      .promise()
      .query(`SELECT CONCAT(first_name, " ", last_name) FROM employee WHERE id = manager_id;`)
      .then(([rows]) => {
        managers = rows.map((obj) => obj['CONCAT(first_name, " ", last_name)']);
        // console.log(managers);
      });
    return managers;
  };

  getEmployees = async () => {
    let employees;
    await db
      .promise()
      .query(`SELECT CONCAT(first_name, " ", last_name) FROM employee;`)
      .then(([rows]) => {
        employees = rows.map((obj) => obj['CONCAT(first_name, " ", last_name)']);
        // console.log(employees);
      });
    return employees;
  };
}

module.exports = { Department, Role, Employee, db };
