import { verifyToken } from "../utils/TokenManager.js";

export const verifyUser = async (request, response, next) => {

  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return response.status(401).json({
      ok: false,
      message: "No header found",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};
