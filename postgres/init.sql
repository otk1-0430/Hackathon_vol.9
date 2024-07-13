CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS task_tree;

CREATE TABLE task_tree (
    user_id UUID,
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    parent_id UUID,
    children UUID[],
    root_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    completed BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- add user
INSERT INTO users (user_id, username, password)
    VALUES ('349a345e-10bf-4208-b8fd-0e9b94a12b35', 'testuser', 'password');

-- add root task 1
INSERT INTO task_tree (user_id, task_id, root_id, description, deadline, completed)
    VALUES ('d03cc72c-a129-49a2-a7b7-fa9097bab9e6', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'this is a test root1', '2024-06-10', false);

-- add child task 1 to root task 1
INSERT INTO task_tree (user_id, task_id, parent_id, root_id, description, deadline, completed)
    VALUES ('d03cc72c-a129-49a2-a7b7-fa9097bab9e6', '8ee874e6-a5c7-4b4e-83ea-b5a7a4bd2904', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'this is a test children1', '2024-06-10', false);
UPDATE task_tree SET children = COALESCE(children, ARRAY[]::UUID[]) || '{8ee874e6-a5c7-4b4e-83ea-b5a7a4bd2904}'
WHERE user_id = 'd03cc72c-a129-49a2-a7b7-fa9097bab9e6' AND task_id = 'ed011eb7-bcca-4746-a739-4979eafed2b9';

-- add child task 2 to root task 1
INSERT INTO task_tree (user_id, task_id, parent_id, root_id, description, deadline, completed)
    VALUES ('d03cc72c-a129-49a2-a7b7-fa9097bab9e6', 'c583ee3f-616a-4ea2-b6d4-0c4df790ae5e', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'ed011eb7-bcca-4746-a739-4979eafed2b9', 'this is a test children2', '2024-06-10', false);
UPDATE task_tree SET children = COALESCE(children, ARRAY[]::UUID[]) || '{c583ee3f-616a-4ea2-b6d4-0c4df790ae5e}'
WHERE user_id = 'd03cc72c-a129-49a2-a7b7-fa9097bab9e6' AND task_id = 'ed011eb7-bcca-4746-a739-4979eafed2b9';

-- add root task 2
INSERT INTO task_tree (user_id, task_id, root_id, description, deadline, completed)
    VALUES ('d03cc72c-a129-49a2-a7b7-fa9097bab9e6', '4c46160e-2874-4f8f-99b2-1b4dd3b3e89a', '4c46160e-2874-4f8f-99b2-1b4dd3b3e89a', 'this is a test root2', '2024-06-10', false);