
/* view all departments */
SELECT * FROM department;

/* view all roles - title, role id, department, salary */
SELECT role.title, role.id, department.name AS department, role.salary 
FROM department
INNER JOIN role ON department.id = role.id;

/* view all employees*/
SELECT * FROM employee;

/* add department */
SELECT id FROM department WHERE name = "Sales";

/* add a role */
SELECT id FROM department WHERE name = "service";

/* add an employee */
SELECT id FROM employee WHERE first_name = "han" AND last_name = "solo";

/* update an employee role */
UPDATE employee SET role_id = 2 WHERE id = 4;