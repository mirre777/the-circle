CREATE TABLE friendrequests(
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    status INTEGER
);
