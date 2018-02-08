DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    picture VARCHAR(255),
    favoritecolor VARCHAR(255),
    hashedpassword VARCHAR(255) NOT NULL,
    bio TEXT,
    created TIMESTAMP
);
