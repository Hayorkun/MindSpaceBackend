import Tasks from "../models/Tasks.js";

export const createTask = async (request, response) => {
  const { title, description, category, status, priority, dueDate } =
    request.body;

  if (!title) {
    return response.status(400).json({
      ok: false,
      message: "Title is required",
    });
  }

  const taskSaved = await Tasks.create({
    user: request.user.id,
    title,
    description,
    category,
    priority,
    status,
    dueDate,
  });

  if (taskSaved) {
    console.log("task created");
  }

  return response.status(201).json({
    ok: true,
    message: "Task Created",
    data: {
      id: taskSaved.id,
      user: taskSaved.user,
      title: taskSaved.title,
      description: taskSaved.description,
      category: taskSaved.category,
      priority: taskSaved.priority,
      status: taskSaved.status,
      dueDate: taskSaved.dueDate,
    },
  });
};

export const getTasks = async (request, response) => {
  try {
    const userTask = await Tasks.find({ user: request.user.id });

    return response.status(200).json({
      ok: true,
      message: "Tasks fetched successfully",
      data: userTask
    });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return response.status(500).json({
      ok: false,
      message: "Error fetching tasks",
    });
  }
};

export const updateTasks = async (request, response) => {
  
}
