const sceneryList = [
  {
    name: "冰岛极光",
    country: "冰岛",
    category: "欧洲",
    img: "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg",
    detail: "detail-iceland.html"
  },
  {
    name: "瑞士雪山",
    country: "瑞士",
    category: "雪山",
    img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    detail: "detail-switzerland.html"
  },
  {
    name: "马尔代夫",
    country: "马尔代夫",
    category: "海岛",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    detail: "detail-maldives.html"
  },
  {
    name: "富士山",
    country: "日本",
    category: "亚洲",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    detail: "detail-fuji.html"
  },
  {
    name: "巴黎铁塔",
    country: "法国",
    category: "欧洲",
    img: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
    detail: "detail-paris.html"
  },
  {
    name: "大峡谷",
    country: "美国",
    category: "美洲",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    detail: "detail-canyon.html"
  }
];

const cards = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");
let currentCategory = "全部";

function renderCards(list) {
  cards.innerHTML = "";

  if (list.length === 0) {
    cards.innerHTML = `
      <div class="no-results">
        <h3>🔍 没有找到匹配的景点</h3>
        <p>尝试使用其他关键词搜索，或者选择不同的分类</p>
      </div>
    `;
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.cursor = "pointer";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p class="location">${item.country}</p>
        <p class="category">${item.category}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = item.detail;
    });
    cards.appendChild(card);
  });
}

function filterAndSearch() {
  let result = sceneryList;

  if (currentCategory !== "全部") {
    result = result.filter(item => item.category === currentCategory);
  }

  const keyword = searchInput.value.toLowerCase().trim();
  if (keyword) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.country.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    );
  }

  renderCards(result);
}

searchInput.addEventListener("input", filterAndSearch);

function filterCategory(type) {
  currentCategory = type;

  filterButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === (type === "全部" ? "全部" : type)) {
      btn.classList.add("active");
    }
  });

  filterAndSearch();
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.textContent;
    filterCategory(type);
  });
});

renderCards(sceneryList);
filterCategory("全部");

// 添加页面加载动画
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});