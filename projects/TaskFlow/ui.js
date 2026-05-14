let currentFilter = 'all';
let currentCategory = 'all';
let searchKeyword = '';

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

  taskList.innerHTML = filtered.map((task, index) => `
    <div class="task-card" data-id="${task.id}" style="animation-delay: ${index * 30}ms">
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
        <button class="action-btn delete" onclick="event.stopPropagation(); handleDeleteTask(${task.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.task-card').forEach(card => {
    card.classList.add('fade-in');
  });
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

function updateStats() {
  const stats = getTaskStats();

  document.getElementById('totalTasks').textContent = stats.total;
  document.getElementById('todayTasks').textContent = stats.todayTasks;
  document.getElementById('completedTasks').textContent = stats.completed;
  document.getElementById('completionRate').textContent = stats.rate + '%';
  document.getElementById('allCount').textContent = stats.total;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('todayCount').textContent = tasks.filter(t => t.dueDate === today).length;
  document.getElementById('completedCount').textContent = stats.completed;
  document.getElementById('favoriteCount').textContent = stats.favorites;
}

function handleDeleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && confirm(`确定要删除任务"${task.title}"吗？`)) {
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card) {
      card.classList.add('fade-out');
      setTimeout(() => {
        deleteTask(id);
      }, 300);
    } else {
      deleteTask(id);
    }
  }
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

document.addEventListener('DOMContentLoaded', function() {
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
});