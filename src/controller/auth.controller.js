import prisma from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils.js";
import { createError } from "../utils/createError.utils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const bsalt = bcrypt.genSaltSync(10);
    const encodePassword = bcrypt.hashSync(req.body.password, bsalt);

    // const encodePassword = await hashPassword(password);

    if (user) {
      return res
        .status(400)
        .json({ message: `${email} is Already Registered` });
    }

    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: encodePassword,
      },
    });

    console.log(newUser);

    return res.status(201).json({ message: "You are succesfully registered" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while register user" });
  }
};

export const loginUser = async (req,res) =>{
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
    .status(404)
    .json({ error: "User not found" });
   
  }

  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  
  if (!isPasswordCorrect) {
    return res
    .status(404)
    .json({ error: "Wrong Password" });
  }

  const cookie_age = 1000 * 60 * 60 * 24 * 7;
  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: cookie_age,
    }
  );

  const { password: _, isAdmin: isAdminUser, ...otherDetails } = user;

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: cookie_age,
      secure: false,
      sameSite: "strict",
    })
    .status(200)
    .json({
      data: {
        ...otherDetails,
      },
      isAdmin: isAdminUser,
    });
}

export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Succesfull" });
};

//login done
//register done
//change password
//update profile
//email template verfication
//logout

//jwt based
