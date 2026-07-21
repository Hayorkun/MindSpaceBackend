import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/PasswordManager.js";

export const getUser = async (request, response) => {
  console.log("the request to the controller", request);

  response.json({
    message: "you have successfully gotten the user",
  });
};

export const createUser = async (request, response) => {
  const { fullName, email, password } = request.body;

  if (!fullName || !password || !email) {
    return response.status(400).json({
      ok: false,
      message: "Invalid rquest: Check your full name, email and password",
    });
  }

  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    return response.status(409).json({
      ok: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const userSaved = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  if (userSaved) {
    console.log(
      `this user is the data is as follow ${fullName}, ${email}, ${password}`,
    );

    return response.status(201).json({
      ok: true,
      message: "User created",
      data: {
        id: userSaved.id,
        fullName: userSaved.fullName,
        email: userSaved.email,
      },
    });
  }
};
