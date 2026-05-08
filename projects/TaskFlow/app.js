const STORAGE_KEY = 'taskflow_tasks';
let tasks = [];
let currentFilter = 'all';
let currentCategory = 'all';
let searchKeyword = '';

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
      dueDate: today
    },
    {
      id: Date.now() + 1,
      title: '学习 JavaScript',
      description: '学习ES6+新特性，练习Promise和async/await',
      category: '学习',
      completed: false,
      favorite: false,
      dueDate: today
    },
    {
      id: Date.now() + 2,
      title: '健身锻炼',
      description: '跑步30分钟，做力量训练',
      category: '个人',
      completed: true,
      favorite: false,
      dueDate: today
    },
    {
      id: Date.now() + 3,
      title: '阅读技术文档',
      description: '阅读React官方文档，学习新的Hooks',
      category: '学习',
      completed: false,
      favorite: true,
      dueDate: today
    },
    {
      id: Date.now() + 4,
      title: '团队会议',
      description: '下午3点参加项目复盘会议',
      category: '工作',
      completed: false,
      favorite: false,
      dueDate: today
    },
    {
      id: Date.now() + 5,
      title: '购买生活用品',
      description: '购买牛奶、面包、鸡蛋',
      category: '其他',
      completed: false,
      favorite: false,
      dueDate: today
    }
  ];
  saveTasks();
}

function updateStats() {
  const total = tasks.length;
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const favorites = tasks.filter(t => t.favorite).length;

  document.getElementById('totalTasks').textContent = total;
  document.getElementById('todayTasks').textContent = todayTasks;
  document.getElementById('completedTasks').textContent = completed;
  document.getElementById('allCount').textContent = total;
  document.getElementById('todayCount').textContent = tasks.filter(t => t.dueDate === today).length;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('favoriteCount').textContent = favorites;
}

function filterTasks() {
  let filtered = [...tasks];

  if (currentFilter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (currentFilter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(t => t.dueDate === today);
  } else if (currentFilter === 'favorite') {
    filtered = filtered.filter(t => t.favorite);
  }

  if (currentCategory !== 'all') {
    filtered = filtered.filter(t => t.category === currentCategory);
  }

  if (searchKeyword) {
    const keyword = searchKeyword.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword)
    );
  }

  return filtered;
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  const filtered = filterTasks();

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <h3>暂无任务</h3>
        <p>点击右上角按钮添加新任务</p>
      </div>
    `;
    return;
  }

  taskList.innerHTML = filtered.map(task => `
    <div class="task-card" data-id="${task.id}">
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleComplete(${task.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="task-content">
        <h4 class="task-title ${task.completed ? 'completed' : ''}">${task.title}</h4>
        ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
        <div class="task-meta">
          <span class="task-category category-${task.category.toLowerCase()}">${task.category}</span>
          <span class="task-date">📅 ${formatDate(task.dueDate)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn ${task.favorite ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite(${task.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="action-btn delete" onclick="event.stopPropagation(); deleteTask(${task.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return '今天';
  } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
    return '明天';
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
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

function deleteTask(id) {
  if (confirm('确定要删除这个任务吗？')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  }
}

function addTask(taskData) {
  const newTask = {
    id: Date.now(),
    title: taskData.title,
    description: taskData.description,
    category: taskData.category,
    completed: false,
    favorite: false,
    dueDate: new Date().toISOString().split('T')[0]
  };
  tasks.push(newTask);
  saveTasks();
}

function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('taskTitle').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById('taskForm').reset();
}

function handleSearch(e) {
  searchKeyword = e.target.value;
  renderTasks();
}

function handleFilterClick(e) {
  const filter = e.target.dataset.filter;
  if (filter) {
    currentFilter = filter;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
    renderTasks();
  }
}

function handleCategoryClick(e) {
  const category = e.target.dataset.category;
  if (category) {
    currentCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTasks();
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
  const theme = localStorage.getItem('taskflow_theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
}

document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const taskData = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    category: document.getElementById('taskCategory').value
  };
  addTask(taskData);
  closeModal();
});

document.getElementById('addBtn').addEventListener('click', openModal);
document.getElementById('closeBtn').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.getElementById('searchInput').addEventListener('input', handleSearch);

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', handleFilterClick);
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', handleCategoryClick);
});

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  loadTasks();
});