import mongoose from "mongoose";
import Task from "../models/taskModel.js";

export const getTasksByUserAndDate = async (req, res) => {
  try {
    let { partner, selectedDate } = req.query;

    if (!selectedDate) {
      selectedDate = new Date();
    }

    const { title, description, date, scope } = req.body;

    const userId = scope === "partner" ? req.user.partnerId : req.user._id;
    const partnerId = req.user.partnerId;

    let requireId;

    if (partner === "true") {
      requireId = partnerId;
    } else {
      requireId = userId;
    }

    // Validate input
    if (!requireId || !selectedDate) {
      return res.status(400).json({
        success: false,
        message: "userId and date are required",
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(requireId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Validate date
    const startOfDay = new Date(selectedDate);

    if (isNaN(startOfDay.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Start of selected day
    startOfDay.setHours(0, 0, 0, 0);

    // Start of next day
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Find tasks
    const tasks = await Task.find({
      userId: requireId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Delete task
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTaskState = async (req, res) => {
  //complete wala
  try {
    const { taskId, state } = req.params;
    console.log(taskId);
    console.log(state);

    // Validate taskId
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Convert and validate state
    if (state !== "true" && state !== "false") {
      return res.status(400).json({
        success: false,
        message: "State must be true or false",
      });
    }

    const taskState = state === "true";

    // Update task state
    const task = await Task.findByIdAndUpdate(
      taskId,
      { state: taskState },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: taskState
        ? "Task marked as completed"
        : "Task marked as incomplete",
      task,
    });
  } catch (error) {
    console.error("Update task state error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, date, createdBy, scope } = req.body;
    var userId = req.user._id;
    var createdByPartner = false;

    if (scope == "partner") {
      userId = req.user.partnerId;
      createdByPartner = true;
    }
    // Validate required fields
    if (!title || !userId || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, userId and date are required",
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Validate date
    const taskDate = new Date(date);

    if (isNaN(taskDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Create task
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      userId,
      date: taskDate,
      dateOfcreation: new Date(),
      createdByPartner: createdByPartner,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, date } = req.body;

    // Validate taskId
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Validate at least one field
    if (
      title === undefined &&
      description === undefined &&
      date === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    // Prepare update data
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (date !== undefined) {
      const taskDate = new Date(date);

      if (isNaN(taskDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date",
        });
      }

      updateData.date = taskDate;
    }

    // Update task
    const task = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Edit task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
