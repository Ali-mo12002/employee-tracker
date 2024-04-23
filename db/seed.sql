\c employees

INSERT INTO departments (name) VALUES ('chefs');
INSERT INTO departments (name) VALUES ('front of house');
INSERT INTO departments (name) VALUES ('managers');

INSERT INTO roles (title, salary, department_id) VALUES ('server', 30000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('chef', 40000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('bar tender', 30000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('manager', 40000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('jack', 'smith', 3, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Ali', 'mohaned', 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('James', 'William', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Jordan', 2, 1);



