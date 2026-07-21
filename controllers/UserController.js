import User from "../models/User.js";

export const getUser = async (request, response) => {
  console.log("the request to the controller", request);

  response.json({
    message: "you have successfully gotten the user",
  });
};

// export const createUser = async () => {};
