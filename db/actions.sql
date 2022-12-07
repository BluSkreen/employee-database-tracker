USE management_db;

/* view all departments */
SELECT * FROM department;

/* view all roles - title, role id, department, salary */
SELECT role.title, role.id, department.name AS department, role.salary 
FROM department
INNER JOIN role ON department.id = role.id;

/* view all employees*/
SELECT user.id, user.first_name, user.last_name, role.title, department.name AS department, role.salary, 
	CONCAT(manager.first_name, " ", manager.last_name) AS manager
FROM employee user
JOIN employee manager
	ON user.manager_id = manager.id
JOIN role
	ON role.id = user.id
JOIN department
	ON department.id = role.id;

/* add department */
SELECT id FROM department WHERE name = "Sales";

/* add a role */
SELECT id FROM department WHERE name = "service";

/* add an employee */
SELECT id FROM employee WHERE first_name = "han" AND last_name = "solo";

/* update an employee role */
UPDATE employee SET role_id = 2 WHERE id = 4;