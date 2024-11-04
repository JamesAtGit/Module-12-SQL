const inquirer = require('inquirer');
const db = require('./db');

const mainMenu = async () => {

		const { action } = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				'View all employees',
				'Add an employee',
				'Update an employee role',
				'View all roles',
				'Add a role',
				'View all departments',
				'Add a department',
				'Exit'
			],

});

	switch (action) {
		case 'View all employees':
			await viewEmployees();
			break;
		case 'Add an employee':
			await addEmployee();
			break;
		case 'Update an employee role':
			await updateEmployeeRole();
			break;
		case 'View all roles':
			await viewRoles();
			break;
		case 'Add a role':
			await addRole();
			break;
		case 'View all departments':
			await viewDepartments();
			break;
		case 'Add a department':
			await addDepartment();
			break;
		case 'Exit':
			db.end();
			return;
		}
	mainMenu(); // Return to main menu

};
// View all employees
const viewEmployees = async () => {
    const res = await db.query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id;
    `);
    console.table(res.rows);
};

// Add an employee
const addEmployee = async () => {
    const roles = await db.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const { first_name, last_name, role_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter first name:' },
        { type: 'input', name: 'last_name', message: 'Enter last name:' },
        { type: 'list', name: 'role_id', message: 'Select role:', choices: roleChoices },
    ]);

    await db.query('INSERT INTO employees (first_name, last_name, role_id) VALUES ($1, $2, $3)', [first_name, last_name, role_id]);
    console.log(`Added ${first_name} ${last_name} to the database.`);
};

// Update an employee role
const updateEmployeeRole = async () => {
    const employees = await db.query('SELECT id, first_name, last_name FROM employees');
    const employeeChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const roles = await db.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const { employeeId, roleId } = await inquirer.prompt([
        { type: 'list', name: 'employeeId', message: 'Select employee to update:', choices: employeeChoices },
        { type: 'list', name: 'roleId', message: 'Select new role:', choices: roleChoices },
    ]);

    await db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    console.log(`Updated employee's role.`);
};

// View all roles
const viewRoles = async () => {
    const res = await db.query('SELECT r.id, r.title, r.salary, d.name AS department FROM roles r JOIN department d ON r.department_id = d.id;');
    console.table(res.rows);
};

// Add a role
const addRole = async () => {
    const departments = await db.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));

    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter role title:' },
        { type: 'input', name: 'salary', message: 'Enter role salary:' },
        { type: 'list', name: 'department_id', message: 'Select department:', choices: departmentChoices },
    ]);

    await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role ${title}.`);
};

// View all departments
const viewDepartments = async () => {
    const res = await db.query('SELECT * FROM department;');
    console.table(res.rows);
};

// Add a department
const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter department name:',
    });

    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department ${name}.`);
};

// Start the application
mainMenu();
