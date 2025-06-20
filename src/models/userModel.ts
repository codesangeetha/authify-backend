import { pool } from "../config/db";

export const createUser = async (username: string, email: string, hashedPassword: string) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT id, username, email, password FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const findUserProfileById = async (id: string) => {
  const result = await pool.query(
    "SELECT username, email, profile_image FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const updateUserProfileById = async (
  id: string,
  username: string,
  email: string
) => {
  await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3",
    [username, email, id]
  );
};

export const updateUserProfileImage = async (id: string, filename: string) => {
  await pool.query("UPDATE users SET profile_image = $1 WHERE id = $2", [filename, id]);
};


export const deleteUserModel = async (id: string) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const updateUserPasswordById = async (userId: string, hashedPassword: string) => {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
};