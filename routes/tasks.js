const express = require("express");
const router = express.Router();
const passport = require("passport");
// const jwt = require("jsonwebtoken");

const config = require("../config/app");
const User = require("../models/user");
const Task = require("../models/task");

router.get("/", (req, res, next) => {
  User.getTasks(req.user._id, (tasks) => {
    res.send(tasks);
  })
});

router.post("/save", (req, res, next) => {
  if (req.body.id) {
    const updatedTask = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'new',
      labels: req.body.labels || [],
      dueDate: req.body.dueDate || '',
    };
    Task.updateTask(updatedTask, (err, task) => {
      if (err) throw err;
      if (task) {
        res.json({ success: true, message: "Task updated successfully", task: task.toJSON() });
      } else {
        res.json({ success: false, message: "Failed to update task" });
      }
    })
  } else {
    const userId = req.user._id;
    const task = new Task({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'new',
      labels: req.body.labels || [],
      dueDate: req.body.dueDate || '',
      user: userId,
    });
    User.addTask(userId, task, (err, task) => {
      if(err) throw err;
      if (task) {
        res.json({ success: true, message: "Task added successfully", task: task.toJSON() });
      } else {
        res.json({ success: false, message: "Failed to add task" });
      }
    });
  }
});

router.delete('/:taskId', (req, res, next) => {
  User.deleteTask(req.user._id, req.params.taskId, (err, deleted) => {
    if (err) throw err;
    if (deleted) {
      res.json({ success: true, message: "Task deleted" });
    } else {
      res.json({ success: false, message: "Failed to delete task" });
    }
  })
});

router.post('/change-status', (req, res, next) => {
  Task.updateStatus(req.body.id, req.body.newStatus, (err, task) => {
    if (err) throw err;
    if (task) {
      res.json({ success: true, message: "Task's status updated", task: task });
    } else {
      res.json({ success: false, message: "Failed to update status" });
    }
  })
});

module.exports = router;