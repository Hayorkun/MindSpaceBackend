import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/PasswordManager.js";
import { verifyToken, generateToken } from "../utils/TokenManager.js";

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

  const token = await generateToken(userSaved.id);

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
        token,
      },
    });
  }
};

export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  try {
    if (!email || !password) {
      return response.status(401).json({
        ok: false,
        message: "Unauthorized user",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(409).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return response.status(401).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user.id);

    return response.status(200).json({
      ok: true,
      message: "Login successful ✅",
      token,
      userInfo: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.group("Error loggin in", error);

    return response.status(500).json({
      ok: false,

      message: "Internal server error",
    });
  }
};
