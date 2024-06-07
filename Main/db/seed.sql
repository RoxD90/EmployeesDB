use workers;

INSERT INTO department
    (name)
VALUES
    ('Account Staff'),
    ('Computers'),
    ('Store Staff'),
    ('Operations');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Accountant', 50000, 1),
    ('Accounts Supervisor', 30000, 1),
    ('Help Desk', 200000, 2),
    ('Software Engineer', 70000, 2),
    ('Store Clerk', 10000, 3),
    ('Store Manager', 25000, 3),
    ('Auditor', 40000, 4),
    ('Human Resource Admin', 80000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Sam', 'Mosley', 1, 1),
    ('Mike', 'Tyson', 2, 1),
    ('Carly', 'Simpson', 3, 3),
    ('Kevin', 'Hart', 4, 3),
    ('Taylor', 'Swift', 5, 5),
    ('David', 'Cloney', 6, 5),
    ('Drew', 'Brees', 7, 7),
    ('Tom', 'Brady', 8, 7);
