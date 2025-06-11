import {pool} from "../config/db";

export const findAdminByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  return result.rows[0];
};
