-- Users
INSERT INTO users (email, password, role) VALUES
  ('user1@demo.com', '$2b$10$6YRnPq37VmZnJ75HmNVQM.T4i8C.DHbXPHX4Wu25tVNh98JWE38Qq', 'operator'),
  ('user2@demo.com', '$2b$10$6YRnPq37VmZnJ75HmNVQM.T4i8C.DHbXPHX4Wu25tVNh98JWE38Qq', 'operator'),
  ('admin@demo.com', '$2b$10$6YRnPq37VmZnJ75HmNVQM.T4i8C.DHbXPHX4Wu25tVNh98JWE38Qq', 'admin');

-- Station access
INSERT INTO station_access (user_id, station_id ) VALUES
  (1, 'ST-10'),
  (2, 'ST-20');