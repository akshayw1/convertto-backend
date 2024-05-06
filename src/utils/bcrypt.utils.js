import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const pasSalt = await bcrypt.genSalt(10);
  console.log(pasSalt);
  return bcrypt.hashSync(pasSalt, password);
};

export const comparePassword = async (userPass, hashpass) =>
bcrypt.compare(userPass, hashpass);
