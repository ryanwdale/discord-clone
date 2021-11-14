\connect cmpt_470_project;

-- Password is bcrypt with cost of 12
-- Pre-seeded users have same password as username (user1:user1, user2:user2)
INSERT INTO account (id, username, password) VALUES
(1, 'user1', '$2b$12$A1Kb8xnZeFmrAQCEJzml5OexhZcJIvs/ULnBoWMx1gX9mEcf97lFO'),
(2, 'user2', '$2b$12$PKe76Ojz0mmmRsNkRdMa0eBmMWmtJr0BGsJPQ0XC9AoVewsiuUfzW');

ALTER SEQUENCE account_id_seq RESTART WITH 3;
