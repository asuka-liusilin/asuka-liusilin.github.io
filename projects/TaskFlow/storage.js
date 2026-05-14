const STORAGE_KEY = 'taskflow_tasks';
const THEME_KEY = 'taskflow_theme';
let tasks = [];

function getTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  updateStats();
  renderTasks();
}

function loadTasks() {
  tasks = getTasks();
  if (tasks.length === 0) {
    initSampleTasks();
  }
  updateStats();
  renderTasks();
}

function initSampleTasks() {
  const today = new Date().toISOString().split('T')[0];
  tasks = [
    {
      id: Date.now(),
      title: '完成项目报告',
      description: '整理Q1季度数据，撰写项目进度报告',
      category: '工作',
      completed: false,
      favorite: true,
      dueDate: today,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 1,
      title: '学习 JavaScript',
      description: '学习ES6+新特性，练习Promise和async/await',
      category: '学习',
      completed: false,
      favorite: false,
      dueDate: today,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 2,
      title: '健身锻炼',
      description: '跑步30分钟，做力量训练',
      category: '个人',
      completed: true,
      favorite: false,
      dueDate: today,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 3,
      title: '阅读技术文档',
      description: '阅读React官方文档，学习新的Hooks',
      category: '学习',
      completed: false,
      favorite: true,
      dueDate: today,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 4,
      title: '团队会议',
      description: '下午3点参加项目复盘会议',
      category: '工作',
      completed: false,
      favorite: false,
      dueDate: today,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 5,
      title: '购买生活用品',
      description: '购买牛奶、面包、鸡蛋',
      category: '其他',
      completed: false,
      favorite: false,
      dueDate: today,
      createdAt: Date.now()
    }
  ];
  saveTasks();
}

function addTask(taskData) {
  const newTask = {
    id: Date.now(),
    title: taskData.title,
    description: taskData.description || '',
    category: taskData.category || '其他',
    completed: false,
    favorite: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };
  tasks.push(newTask);
  saveTasks();
  return newTask;
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    saveTasks();
  }
}

function toggleFavorite(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.favorite = !task.favorite;
    saveTasks();
  }
}

function getTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed).length;
  const favorites = tasks.filter(t => t.favorite).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    todayTasks,
    favorites,
    rate
  };
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
  const theme = getTheme();
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  setTheme(isDark ? 'dark' : 'light');
}