// 景点数据
const sceneryData = [
    { name: '埃菲尔铁塔', country: '法国', lat: 48.8584, lng: 2.2945, img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600', desc: '作为巴黎的标志，这座铁塔见证了近一个半世纪的浪漫与历史变革。' },
    { name: '富士山', country: '日本', lat: 35.3606, lng: 138.7274, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', desc: '日本最高峰，不仅是地理上的象征，更是大和民族精神的依托。' },
    { name: '马丘比丘', country: '秘鲁', lat: -13.1631, lng: -72.5450, img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600', desc: '失落的印加城市，云雾缭绕中的古代文明遗迹。' }
];

const world = Globe()(document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    
    // 国家边界配置
    .polygonCapColor(() => 'rgba(79, 172, 254, 0.05)')
    .polygonSideColor(() => 'rgba(255, 255, 255, 0.05)')
    .polygonStrokeColor(() => '#3e4a5b')
    .polygonLabel(({ properties: d }) => `<b>${d.NAME}</b>`)
    .onPolygonHover(hoverD => world
        .polygonCapColor(d => d === hoverD ? 'rgba(79, 172, 254, 0.25)' : 'rgba(79, 172, 254, 0.05)')
    )

    // 标记点配置
    .pointsData(sceneryData)
    .pointColor(() => '#4facfe')
    .pointRadius(0.6)
    .pointAltitude(0.02)
    .pointLabel(d => `
        <div class="scene-tooltip">
            <div style="font-size:14px; font-weight:bold">${d.name}</div>
            <img src="${d.img}">
        </div>
    `)
    .onPointClick(d => openDetail(d));

// 获取国家边界 GeoJSON 数据
fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => {
        world.polygonsData(countries.features);
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => document.getElementById('loading').style.display = 'none', 1000);
    });

// 自动旋转与视角控制
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.8;
world.controls().enableDamping = true;

function openDetail(data) {
    const panel = document.getElementById('detail-panel');
    const content = document.getElementById('detail-content');
    
    world.controls().autoRotate = false; // 点击时停止旋转
    content.innerHTML = `
        <h2 class="detail-title">${data.name}</h2>
        <p style="color: #4facfe;">${data.country} · Landmark</p>
        <img src="${data.img}" class="detail-img">
        <p class="detail-text">${data.desc}</p>
        <div style="margin-top:30px">
             <small style="color:#666">地理坐标: ${data.lat.toFixed(2)}, ${data.lng.toFixed(2)}</small>
        </div>
    `;
    panel.classList.add('active');
    world.pointOfView({ lat: data.lat, lng: data.lng, altitude: 1.2 }, 1000);
}

function closeDetail() {
    document.getElementById('detail-panel').classList.remove('active');
    world.controls().autoRotate = true;
    world.pointOfView({ altitude: 2.5 }, 1000);
}