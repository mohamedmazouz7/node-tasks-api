const tasks = [
  { id: 1, title: "Learn Jenkins", done: true },
  { id: 2, title: "Learn Docker", done: true },
  { id: 3, title: "Learn AWS", done: false },
  { id: 4, title: "Learn Kubernetes", done: false }
];

const getAllTasks = () => tasks;

const getTaskById = (id) => {
  return tasks.find(task => task.id === parseInt(id));
};

const addTask = (title) => {
  const newTask = {
    id: tasks.length + 1,
    title,
    done: false
  };
  tasks.push(newTask);
  return newTask;
};

module.exports = { getAllTasks, getTaskById, addTask };
