require('dotenv').config();
const express = require('express');
const { getAllTasks, getTaskById, addTask } = require('./tasks');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Node Tasks API is running!',
    version: APP_VERSION
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(getAllTasks());
});

// Get task by id
app.get('/tasks/:id', (req, res) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

// Add new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const newTask = addTask(title);
  res.status(201).json(newTask);
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`App version: ${APP_VERSION}`);
  });
}

module.exports = app;
