const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');

init();

function init() {
    const logoText = logo({ name: "Workers at Factory Inc." }).render();
    console.log(logoText);
    loadMainPrompts();
}

function loadMainPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to view first?",
            choices: [
                { name: "View all departments?", value: "View_Departments" },
                { name: "View all roles?", value: "View_Roles" },
                { name: "View all employees?", value: "View_Employees" },
                { name: "Add a department?", value: "Add_Department" },
                { name: "Add a role?", value: "Add_Role" },
                { name: "Add an employee?", value: "Add_Employee" },
                { name: "Update an employee role?", value: "Update_EmployeeRole" },
                { name: "END", value: "END" }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        switch (choice) {
            case "View_Departments":
                viewDepartments();
                break;
            case "View_Roles":
                viewRoles();
                break;
            case "View_Employees":
                viewEmployees();
                break;
            case "Add_Department":
                addDepartment();
                break;
            case "Add_Role":
                addRole();
                break;
            case "Add_Employee":
                addEmployee();
                break;
            case "Update_EmployeeRole":
                updateEmployeeRole();
                break;
            default:
                end();
        }
    });
}

// be able to update employee's role
function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Select an employee to update their role",
                    choices: employeeChoices
                }
            ]).then(res => {
                let employeeId = res.employeeId;
                db.findAllRoles()
                    .then(([rows]) => {
                        let roles = rows;
                        const roleChoices = roles.map(({ id, title }) => ({
                            name: title,
                            value: id
                        }));

                        prompt([
                            {
                                type: "list",
                                name: "roleId",
                                message: "Select the new role for the employee",
                                choices: roleChoices
                            }
                        ]).then(res => db.updateEmployeeRole(employeeId, res.roleId))
                        .then(() => console.log("Employee's role has been updated!!"))
                        .then(() => loadMainPrompts());
                    });
            });
        });
}

// see all departments
function viewDepartments() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadMainPrompts());
}

// see all roles
function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => loadMainPrompts());
}

// see all employees
function viewEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadMainPrompts());
}

// add another department
function addDepartment() {
    prompt([
        {
            name: "name",
            message: "Please type the name of the department!"
        }
    ]).then(res => {
        let name = res;
        db.createDepartment(name)
            .then(() => console.log(`Added ${name.name} to the database`))
            .then(() => loadMainPrompts());
    });
}

// be able to create a new role
function addRole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "Please type the name of new role!"
                },
                {
                    name: "salary",
                    message: "How much will the salary be for the new role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "The new role should be placed under what department?",
                    choices: departmentChoices
                }
            ]).then(role => {
                db.createRole(role)
                    .then(() => console.log(`Added ${role.title} to the database`))
                    .then(() => loadMainPrompts());
            });
        });
}

// be able to add an employee
function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "Please type employee's first name!"
        },
        {
            name: "last_name",
            message: "Please type employee's last name!"
        }
    ]).then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findAllRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                prompt({
                    type: "list",
                    name: "roleId",
                    message: "Please select from list the new employee's role!",
                    choices: roleChoices
                }).then(res => {
                    let roleId = res.roleId;

                    db.findAllEmployees()
                        .then(([rows]) => {
                            let employees = rows;
                            const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            managerChoices.unshift({ name: "None", value: null });

                            prompt({
                                type: "list",
                                name: "managerId",
                                message: "Please select from list the new employee's manager",
                                choices: managerChoices
                            }).then(res => {
                                let employee = {
                                    manager_id: res.managerId,
                                    role_id: roleId,
                                    first_name: firstName,
                                    last_name: lastName
                                };

                                db.createEmployee(employee)
                                    .then(() => console.log(`Added ${firstName} ${lastName} to the employee's database`))
                                    .then(() => loadMainPrompts());
                            });
                        });
                });
            });
    });
}

function end() {
    console.log("Your application has ended. Thank you.");
    process.exit();
}
