/*
**********
These are all notes, not for use in deployment
**********
*/

USE management_db;

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

DELETE FROM department WHERE name = "IT";


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

/* get managers */
SELECT CONCAT(first_name, last_name) FROM employee WHERE id = manager_id;

/* update employee manager */

/* view managers employees */
SELECT * FROM employee;
SELECT * FROM employee 
WHERE id != manager_id AND manager_id = 1;

/* view departments employees */
SELECT employee.id, employee.first_name, employee.last_name, role.title
FROM employee
JOIN role
	ON role.id = employee.role_id
JOIN department
	ON department.id = role.department_id
WHERE department.name = "sales";

/* view utilized budget */
SELECT department.name, sum(ALL role.salary) as "Utilized Budget"
FROM employee
JOIN role
	ON role.id = employee.role_id
JOIN department
	ON department.id = role.department_id
WHERE department.name = "sales";

SELECT name FROM department;