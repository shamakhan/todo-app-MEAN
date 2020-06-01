const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  labels: { type: Object },
  status: {
    type: String,
    default: 'New'
  },
  dueDate: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
})

const Task = module.exports = mongoose.model("Task", taskSchema);

module.exports.getTasksByIds = (taskIds, callback) => {
  const query = { _id: { $in: taskIds }};
  Task.find(query, (err, tasks) => {
    if (err) throw err;
    callback(tasks);
  });
}

module.exports.addTask = (task, callback) => {
  task.save(callback);
}

module.exports.updateTask = (userTask, callback) => {
  Task.findById(userTask.id, (err, task) => {
    if (err) throw err;
    if(!task) {
      callback(null, false);
    } else {
      task.title = userTask.title;
      task.description = userTask.description;
      task.status = userTask.status;
      task.labels = userTask.labels;
      task.save(callback);
    }
  })
}

module.exports.delete = (taskId, callback) => {
  Task.findById(taskId).remove(callback);
}

module.exports.updateStatus = (taskId, newStatus, callback) => {
  Task.findById(taskId, (err, task) => {
    if (err) callback(err, null);
    if (task) {
      task.status = newStatus;
      task.save(callback);
    } else {
      callback(null, false);
    }
  })
}