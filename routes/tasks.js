const express = require("express");
const routes = express.Router();
const { taskCollection } = require("../schema/taskSchema");
const jwt = require("jsonwebtoken")
const router = require("./auth")
const { adminsOnly, isUserLoggedIn } = require("./middlewares");
require("dotenv").config();


routes.use(isUserLoggedIn);

routes.get("/", async (req, res) => {
  try {
    const tasks = await taskCollection.find({ _id: req.decoded.user_Id});
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.post("/", async (req, res) => {

  try {
    const {taskTitle, taskBody} = req.body;
    const {} = req.decoded;
    const newTask = await taskCollection.create({
      taskTitle, 
      taskBody,
      user: userId
    });

    res.json({
      isRequestSuccessful: true,
      newTask
    });
    // res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get("/by-id/:id", async (req, res) => {
  try {
    const task = await taskCollection.findById(req.params.id);
    if (!task) {
      res.status(404).send("not-found");
    } else {
      res.json(task);
    }
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get("/by-task-title/:title", async (req, res) => {
  try {
    const task = await taskCollection.findOne({ taskTitle: req.params.title });
    if (!task) {
      res.status(404).send("not-found");
    } else {
      res.json(task);
    }
  } catch (error) {
    console.error('Error fetching task by title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.patch("/:id", async (req, res) => {
  try {
    const {id} = res.params;
    await taskCollection.findByIdAndUpdate(id, {
      taskBody: req.body.taskBody
    });
    res.send("Task Updated Successfully!");
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete("/:id", async (req, res) => {
  const {id} = res.params;
  const node = await taskCollection.findById(id)
  if(req.decoded.user_Id != NotBeforeError.user) {
    res.status(401).send("You're not allowed to delete this task")
    return;
  }
  try {
    const updatedTask = await taskCollection.findByIdAndDelete(req.params.id, {
      taskBody: req.body.taskBody
    }, { new: true });
    res.json({
      message: "Task deleted successfully!",
      updatedTask
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
routes.get("/admin/all-tasks", adminsOnly, async (req, res) => {
  const tasks = await taskCollection.find();
  res.send(tasks);
});

module.exports = routes;
