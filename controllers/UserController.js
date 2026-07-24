import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/PasswordManager.js";
import { verifyToken, generateToken } from "../utils/TokenManager.js";
import axios from "axios";

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

export const getUser = async (request, response) => {
  const user = await User.findById(request.user.id);
  return response.json({
    ok: true,
    data: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

export const googleAuth = async (request, response) => {
  const { access_token } = request.body;

  if (!access_token) {
    return response.status(400).json({
      ok: false,
      message: "Access token is required",
    });
  }

  try {
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const { email, name, picture } = googleRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        provider: "google",
      });
    }

    const token = await generateToken(user.id);

    return response.status(200).json({
      ok: true,
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.log("Google authentication failed", error);

    return response.status(401).json({
      ok: false,
      message: "Google authentication failed",
    });
  }
};

export const githubAuth = async (request, response) => {
  const { code } = request.body;

  if (!code) {
    return response.status(400).json({
      ok: false,
      message: "Code is required",
    });
  }

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const { access_token } = tokenRes.data;

    const githubRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, avatar_url } = githubRes.data;

    let userEmail = email;

    if (!userEmail) {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const primaryEmail = emailRes.data.find((e) => e.primary);
      userEmail = primaryEmail?.email;
    }

    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await User.create({
        fullName: name,
        email: userEmail,
        provider: "github",
      });
    }

    const token = await generateToken(user.id);

    return response.status(200).json({
      ok: true,
      message: "Github user created successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.log("Githhub authentication failed", error);

    return response.status(401).json({
      ok: false,
      message: "Github authentication failed",
    });
  }
};
