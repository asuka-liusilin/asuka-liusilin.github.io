const AI_TEMPLATES = {
  exam: {
    keywords: ['考试', '期末', '期中', '测验', '复习'],
    tasks: ['整理知识点', '制定复习计划', '重点内容标注', '刷题训练', '模拟考试', '错题整理', '薄弱点突破']
  },
  project: {
    keywords: ['项目', '开发', '做', '完成'],
    tasks: ['需求分析', '技术选型', '架构设计', '模块开发', '测试调试', '文档编写', '部署上线']
  },
  travel: {
    keywords: ['旅行', '旅游', '出行', '游玩'],
    tasks: ['目的地调研', '制定行程', '预订交通', '预订住宿', '准备行李', '景点打卡', '美食探索']
  },
  study: {
    keywords: ['学习', '学', '课程', '读书'],
    tasks: ['制定学习计划', '收集学习资料', '观看教程', '做笔记', '实践练习', '总结归纳', '复习巩固']
  },
  fitness: {
    keywords: ['健身', '运动', '减肥', '锻炼', '跑步'],
    tasks: ['热身拉伸', '有氧训练', '力量训练', '核心训练', '放松拉伸', '记录数据', '调整计划']
  },
  cooking: {
    keywords: ['做饭', '烹饪', '做菜', '下厨'],
    tasks: ['确定菜谱', '采购食材', '处理食材', '开始烹饪', '摆盘装饰', '清洁厨房', '总结经验']
  },
  clean: {
    keywords: ['打扫', '清洁', '整理', '收纳'],
    tasks: ['客厅整理', '卧室清洁', '厨房油污', '卫生间消毒', '地面清扫', '物品收纳', '空气净化']
  },
  work: {
    keywords: ['工作', '报告', '方案', '汇报'],
    tasks: ['收集资料', '数据分析', '撰写初稿', '优化完善', '审核校对', '提交汇报']
  },
  daily: {
    keywords: ['日常', '习惯', '早起'],
    tasks: ['制定计划', '执行任务', '记录进展', '总结复盘', '调整优化']
  }
};

function splitTaskWithAI(taskTitle) {
  const title = taskTitle.toLowerCase();
  let matchedTemplate = null;
  let maxScore = 0;

  for (const [key, template] of Object.entries(AI_TEMPLATES)) {
    let score = 0;
    for (const keyword of template.keywords) {
      if (title.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matchedTemplate = template;
    }
  }

  if (matchedTemplate) {
    return {
      success: true,
      subtasks: matchedTemplate.tasks,
      reason: `根据"${taskTitle}"生成了 ${matchedTemplate.tasks.length} 个子任务`
    };
  }

  return {
    success: false,
    subtasks: [],
    reason: '未识别到相关任务模板，请尝试更具体的描述'
  };
}

function openAISplitModal() {
  const modal = document.getElementById('aiSplitModal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('aiTaskInput').focus();
  }
}

function closeAISplitModal() {
  const modal = document.getElementById('aiSplitModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('aiTaskInput').value = '';
    document.getElementById('aiResult').innerHTML = '';
  }
}

function handleAISplit() {
  const input = document.getElementById('aiTaskInput').value.trim();
  if (!input) return;

  const result = splitTaskWithAI(input);
  const resultDiv = document.getElementById('aiResult');

  if (result.success) {
    resultDiv.innerHTML = `
      <div class="ai-result-card">
        <div class="ai-result-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span>AI 智能拆分结果</span>
        </div>
        <p class="ai-result-reason">${result.reason}</p>
        <div class="ai-subtasks">
          ${result.subtasks.map((task, i) => `
            <div class="ai-subtask-item" style="animation-delay: ${i * 50}ms">
              <span class="ai-subtask-num">${i + 1}</span>
              <span class="ai-subtask-text">${task}</span>
            </div>
          `).join('')}
        </div>
        <button class="ai-add-all-btn" onclick="addSubtasksFromAI('${input}', ${JSON.stringify(result.subtasks).replace(/"/g, '&quot;')})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          一键添加所有子任务
        </button>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="ai-result-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>${result.reason}</p>
        <p class="ai-hint">尝试输入：准备期末考试、开发网站、健身计划等</p>
      </div>
    `;
  }
}

function addSubtasksFromAI(mainTask, subtasks) {
  const category = detectCategory(mainTask);
  subtasks.forEach((subtask, index) => {
    setTimeout(() => {
      addTask({
        title: subtask,
        description: `📌 ${mainTask} 的第 ${index + 1} 步`,
        category: category
      });
    }, index * 100);
  });

  setTimeout(() => {
    closeAISplitModal();
    showToast(`已添加 ${subtasks.length} 个子任务`);
  }, subtasks.length * 100 + 200);
}

function detectCategory(taskTitle) {
  const title = taskTitle.toLowerCase();
  if (/考试|复习|学习|课程|读书/.test(title)) return '学习';
  if (/健身|运动|跑步|减肥/.test(title)) return '个人';
  if (/工作|报告|方案|汇报/.test(title)) return '工作';
  return '其他';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3000);
  setTimeout(() => toast.remove(), 3500);
}

document.addEventListener('DOMContentLoaded', function() {
  const aiSplitBtn = document.getElementById('aiSplitBtn');
  if (aiSplitBtn) {
    aiSplitBtn.addEventListener('click', openAISplitModal);
  }

  const aiCloseBtn = document.getElementById('aiCloseBtn');
  if (aiCloseBtn) {
    aiCloseBtn.addEventListener('click', closeAISplitModal);
  }

  const aiModal = document.getElementById('aiSplitModal');
  if (aiModal) {
    aiModal.addEventListener('click', function(e) {
      if (e.target === aiModal) closeAISplitModal();
    });
  }

  const aiInput = document.getElementById('aiTaskInput');
  if (aiInput) {
    aiInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAISplit();
      }
    });
  }

  const aiSubmitBtn = document.getElementById('aiSubmitBtn');
  if (aiSubmitBtn) {
    aiSubmitBtn.addEventListener('click', handleAISplit);
  }
});