const sceneryList = [
  {
    id: 1,
    name: "冰岛极光",
    country: "冰岛",
    category: "欧洲",
    img: "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg",
    detail: "detail-iceland.html"
  },
  {
    id: 2,
    name: "瑞士雪山",
    country: "瑞士",
    category: "雪山",
    img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    detail: "detail-switzerland.html"
  },
  {
    id: 3,
    name: "马尔代夫",
    country: "马尔代夫",
    category: "海岛",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    detail: "detail-maldives.html"
  },
  {
    id: 4,
    name: "富士山",
    country: "日本",
    category: "亚洲",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    detail: "detail-fuji.html"
  },
  {
    id: 5,
    name: "巴黎铁塔",
    country: "法国",
    category: "欧洲",
    img: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
    detail: "detail-paris.html"
  },
  {
    id: 6,
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
const favoriteCount = document.getElementById("favoriteCount");
let currentCategory = "全部";
let isShowingFavorites = false;

function getFavorites() {
  const favorites = localStorage.getItem("sceneryFavorites");
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("sceneryFavorites", JSON.stringify(favorites));
  updateFavoriteCount();
}

function updateFavoriteCount() {
  const favorites = getFavorites();
  favoriteCount.textContent = favorites.length;
}

function isFavorited(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  
  saveFavorites(favorites);
  updateFavoriteCount();
  
  if (!isShowingFavorites) {
    filterAndSearch();
  } else {
    showFavorites();
  }
}

function renderCards(list) {
  cards.innerHTML = "";

  if (list.length === 0) {
    cards.innerHTML = `
      <div class="empty-favorites">
        <h3>${isShowingFavorites ? "💔 还没有收藏任何景点" : "🔍 没有找到匹配的景点"}</h3>
        <p>${isShowingFavorites ? "点击景点卡片右上角的心形按钮添加收藏" : "尝试使用其他关键词搜索，或者选择不同的分类"}</p>
        ${isShowingFavorites ? '<button class="favorite-badge" onclick="showAll()">← 返回全部景点</button>' : ""}
      </div>
    `;
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.1}s`;
    
    const favorited = isFavorited(item.id);
    
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <button class="favorite-btn${favorited ? ' favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
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

function filterCategory(type) {
  currentCategory = type;
  isShowingFavorites = false;

  filterButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === (type === "全部" ? "全部" : type)) {
      btn.classList.add("active");
    }
  });

  filterAndSearch();
}

function showFavorites() {
  isShowingFavorites = true;
  
  filterButtons.forEach(btn => {
    btn.classList.remove("active");
  });

  searchInput.value = "";
  
  const favorites = getFavorites();
  const favoriteItems = sceneryList.filter(item => favorites.includes(item.id));
  renderCards(favoriteItems);
}

function showAll() {
  isShowingFavorites = false;
  filterCategory("全部");
}

searchInput.addEventListener("input", filterAndSearch);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.textContent;
    filterCategory(type);
  });
});

updateFavoriteCount();
renderCards(sceneryList);
filterCategory("全部");

window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});