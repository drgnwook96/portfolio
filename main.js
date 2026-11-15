/* =========================================================
 *  설정값 - 연락처와 주소가 정해지면 여기만 채우면 됩니다.
 * ========================================================= */
const CONFIG = {
  contact: {
    email: "drgn_uk@naver.com",
    phone: "",      // 공개 웹이므로 비워두는 것을 권장
    github: "",     // 예: "https://github.com/아이디"
    linkedin: "",   // 예: "https://www.linkedin.com/in/아이디"
    blog: "",       // 예: "https://blog.naver.com/아이디"
  },
  location: {
    name: "경희대학교 국제캠퍼스 멀티미디어교육관",
    address: "경기 용인시 기흥구 덕영대로 1732 (서천동 1)",
    lat: 37.2441216,   // 카카오맵 기준 좌표
    lng: 127.07655002,
  },
  // 카카오 developers 에서 발급받은 JavaScript 키 (페이지 안 지도 표시용, 없으면 길찾기 버튼만 동작)
  KAKAO_JS_KEY: "",
};

/* =========================================================
 *  프로젝트 데이터 (이력서 기반)
 * ========================================================= */
const PROJECTS = [
  { cat: "strategy", title: "EV 스마트 충전 플랫폼 혁신연구센터 중장기 전략 수립", client: "산업통상부 · 한양대학교" },
  { cat: "strategy", title: "미래자동차 부품산업 기본계획 수립", client: "산업통상부 · 한국자동차연구원" },
  { cat: "strategy", title: "전라남도 수소생산클러스터 조성계획 수립", client: "전라남도청 · (재)녹색에너지연구원" },
  { cat: "strategy", title: "에트리홀딩스 중장기 발전계획 수립", client: "과학기술정보통신부 · ETRI" },
  { cat: "strategy", title: "국립 나주 에너지 전문과학관 건립 고도화 기획", client: "중소벤처기업부 · 전남테크노파크" },
  { cat: "performance", title: "규제샌드박스융합신제품인증기술개발사업 성과 조사·분석 및 후속사업 기획", client: "산업통상부 · 한국산업기술기획평가원" },
  { cat: "performance", title: "연구산업 및 학연플랫폼 효과성·효율성 분석을 통한 개선방안 연구", client: "과학기술정보통신부 · 과학기술사업화진흥원" },
  { cat: "survey", title: "에너지인력양성사업 인력수급조사 등 정책기반 구축", client: "기후에너지환경부 · 한국에너지기술평가원" },
  { cat: "survey", title: "에너지혁신벤처 실태조사 관련 자문", client: "기후에너지환경부 · 한국에너지기술평가원" },
  { cat: "survey", title: "철도산업 분류체계 고도화 및 실태조사 방안 연구", client: "과학기술정보통신부 · 한국철도기술연구원" },
  { cat: "survey", title: "국내 시스템반도체 산업 생태계 실태조사 및 상생파운드리 구축 수요 분석", client: "산업통상부 · 한국산업기술기획평가원" },
  { cat: "survey", title: "에너지 인력양성사업 현황 조사, 에너지 클러스터 현황 조사", client: "기후에너지환경부 · 한국에너지기술평가원" },
  { cat: "survey", title: "첨단에너지 분야 기술인력 수요변화 실태조사", client: "과학기술정책연구원(STEPI)" },
  { cat: "valuation", title: "B4C 세라믹 기술 특허 분석", client: "(주)삼양컴텍" },
  { cat: "valuation", title: "페이스메이커 시스템 연구과제 기술가치평가 및 사업화 타당성 분석 (B/C 분석)", client: "(주)래도" },
];
const CAT_LABEL = {
  strategy: "전략·계획 수립",
  survey: "실태조사·분류체계",
  performance: "성과분석",
  valuation: "기술가치·특허",
};

/* ---------- 프로젝트 렌더링 + 필터 ---------- */
const grid = document.getElementById("projectGrid");
function renderProjects(filter = "all") {
  grid.innerHTML = PROJECTS.filter(p => filter === "all" || p.cat === filter)
    .map(p => `
      <article class="project">
        <span class="cat">${CAT_LABEL[p.cat]}</span>
        <h3>${p.title}</h3>
        <p class="client">${p.client}</p>
      </article>`).join("");
}
renderProjects();
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#filters button").forEach(b => b.classList.toggle("active", b === btn));
  renderProjects(btn.dataset.filter);
});

/* ---------- 연락처 ---------- */
const c = CONFIG.contact;
const contacts = [
  { ic: "✉️", label: "Email", value: c.email, href: c.email && `mailto:${c.email}` },
  { ic: "📞", label: "Phone", value: c.phone, href: c.phone && `tel:${c.phone.replace(/-/g, "")}` },
  { ic: "💻", label: "GitHub", value: c.github, href: c.github },
  { ic: "🔗", label: "LinkedIn", value: c.linkedin, href: c.linkedin },
  { ic: "📝", label: "Blog", value: c.blog, href: c.blog },
];
const filled = contacts.filter(x => x.value);
const shown = filled.length ? filled : contacts.slice(0, 3);
document.getElementById("contactGrid").innerHTML = shown.map(x => `
  <a class="contact-item ${x.value ? "" : "pending"}" ${x.value ? `href="${x.href}" target="_blank" rel="noopener"` : ""}>
    <span class="ic">${x.ic}</span>
    <span><small>${x.label}</small><b>${x.value || "추후 공개 예정"}</b></span>
  </a>`).join("");

/* ---------- 찾아오는 길 (카카오 / 네이버 길찾기) ---------- */
const loc = CONFIG.location;
if (loc.name) {
  document.getElementById("placeName").textContent = loc.name;
  if (loc.address) document.getElementById("placeAddr").textContent = loc.address;

  const kakao = document.getElementById("kakaoRoute");
  const naver = document.getElementById("naverRoute");
  const name = encodeURIComponent(loc.name);

  if (loc.lat && loc.lng) {
    // 카카오맵: 목적지 지정 길찾기
    kakao.href = `https://map.kakao.com/link/to/${name},${loc.lat},${loc.lng}`;
    // 네이버 지도: 목적지 지정 길찾기 (대중교통). 새 네이버 지도는 웹 메르카토르(EPSG:3857) 좌표를 사용
    const R = 20037508.34;
    const x = (loc.lng * R / 180).toFixed(2);
    const y = (Math.log(Math.tan((90 + loc.lat) * Math.PI / 360)) / (Math.PI / 180) * R / 180).toFixed(2);
    naver.href = `https://map.naver.com/p/directions/-/${x},${y},${name},,ADDRESS_POI/-/transit`;
  } else {
    // 좌표가 없으면 장소명 검색으로 대체
    kakao.href = `https://map.kakao.com/link/search/${name}`;
    naver.href = `https://map.naver.com/p/search/${name}`;
  }
  kakao.classList.remove("disabled");
  naver.classList.remove("disabled");

  // 카카오 지도 임베드 (키 + 좌표가 있을 때). 키가 없으면 지도 칸을 숨기고 길찾기 카드만 보여줌
  if (!CONFIG.KAKAO_JS_KEY) {
    document.getElementById("map").remove();
    document.querySelector(".location-wrap").classList.add("no-map");
  } else if (loc.lat && loc.lng) {
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${CONFIG.KAKAO_JS_KEY}&autoload=false`;
    s.onload = () => kakao_maps_init();
    document.head.appendChild(s);
  }
}
function kakao_maps_init() {
  window.kakao.maps.load(() => {
    const el = document.getElementById("map");
    el.innerHTML = "";
    const pos = new kakao.maps.LatLng(loc.lat, loc.lng);
    const map = new kakao.maps.Map(el, { center: pos, level: 3 });
    const marker = new kakao.maps.Marker({ position: pos, map });
    new kakao.maps.InfoWindow({ content: `<div style="padding:6px 10px;font-size:13px;color:#111">${loc.name}</div>` }).open(map, marker);
  });
}

/* ---------- 내비게이션 ---------- */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
document.getElementById("navToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", e => { if (e.target.tagName === "A") navLinks.classList.remove("open"); });
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10));

// 현재 섹션 하이라이트
const sections = [...document.querySelectorAll("section[id]")];
const linkMap = Object.fromEntries([...navLinks.querySelectorAll("a")].map(a => [a.getAttribute("href").slice(1), a]));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    Object.values(linkMap).forEach(a => a.classList.remove("active"));
    if (linkMap[en.target.id]) linkMap[en.target.id].classList.add("active");
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => sectionObserver.observe(s));

/* ---------- 스크롤 등장 애니메이션 + 숫자 카운트 ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    revealObs.unobserve(en.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

document.querySelectorAll("[data-count]").forEach(el => {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 1000 / target); };
  setTimeout(step, 400);
});
