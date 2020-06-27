CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar(80),
    hash_password varchar(80)
);

CREATE TABLE notes (
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    note_name varchar(60),
    note_date date,
    contents varchar(500)
);

INSERT INTO notes (user_id, note_name, note_date, contents) VALUES (
    1, 'Get some milk', '5/12/2020', 'Remember to get some milk. My dad gets cranky when he cant have his morning cereal!');