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

export const getTask = async (request, response) => {
  try {
    const userTask = await Tasks.find({ user: request.user.id });

    return response.status(200).json({
      ok: true,
      message: "Tasks fetched successfully",
      data: userTask,
    });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return response.status(500).json({
      ok: false,
      message: "Error fetching tasks",
    });
  }
};

export const updateTask = async (request, response) => {
  const { id } = request.params;

  const { title, priority, category, status, description, dueDate } =
    request.body;

  try {
    const task = await Tasks.findOneAndUpdate(
      { _id: id, user: request.user.id },
      {
        title,
        description,
        category,
        priority,
        status,
        dueDate,
      },
      { new: true },
    );

    if (!task) {
      return response.status(404).json({
        ok: false,
        message: "Task not found",
      });
    }

    return response.status(200).json({
      ok: true,
      message: "Tasks updated successfully",
      data: task
    });
  } catch (error) {
    console.log("Error fetching tasks");

    return response.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (request, response) => {
  const { id } = request.params

  try {
    const task = await Tasks.findOneAndDelete(
      {_id: id, user: request.user.id }
    )

    if(!task){
      return response.status(404).json({
        ok: false,
        message: "No task to delete"
      })
    }

    return response.status(200).json({
      ok: true,
      message: "Task deleted successfully"
    })
  } catch (error) {
    console.log("Error deleting task")

    return response.status(500).json({
      ok: false,
      message: "Internal server error"
    })
  }

}