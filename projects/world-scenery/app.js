const sceneryList = [
  {
  name: "冰岛极光",
  country: "冰岛",
  category:"欧洲",
  img: "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg"
  },
  {
  name: "瑞士雪山",
  country: "瑞士",
  category:"雪山",
  img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
  },
  {
    name: "马尔代夫",
    country: "马尔代夫",
    category:"海岛",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    name: "富士山",
    country: "日本",
    category:"亚洲",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
  },
  {
    name: "巴黎铁塔",
    country: "法国",
    category:"欧洲",
    img: "https://images.unsplash.com/photo-1431274172761-fca41d930114"
  },
  {
    name: "大峡谷",
    country: "美国",
    category:"美洲",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  }
];

const cards = document.getElementById("cards");

function renderCards(list) {
  cards.innerHTML = "";

  list.forEach(item => {
    cards.innerHTML += `
      <div class="card">
        <img src="${item.img}">
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.country}</p>
        </div>
      </div>
    `;
  });
}

renderCards(sceneryList);
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filteredList = sceneryList.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.country.toLowerCase().includes(keyword)
  );

  renderCards(filteredList);
});
function filterCategory(type){
  if(type === "全部"){
    renderCards(sceneryList);
    return;
  }

  const result = sceneryList.filter(item => item.category === type);
  renderCards(result);
}