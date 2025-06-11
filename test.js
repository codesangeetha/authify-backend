import bcrypt from "bcrypt";

const password = "adminpwd";
bcrypt.hash(password, 10).then(console.log);
