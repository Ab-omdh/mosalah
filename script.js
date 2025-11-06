/* script.js - shared by all pages */

/* ---------- simple auth (JS-only) ---------- */
function validateLogin(e){
  e && e.preventDefault && e.preventDefault();
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  const remember = document.getElementById('rememberMe').checked;
  const msg = document.getElementById('loginMsg');

  if (!u || !p) {
    msg.textContent = 'All fields are required.';
    return false;
  }
  if (u.length < 4) {
    msg.textContent = 'Username must be at least 4 characters.';
    return false;
  }
  if (p.length < 6) {
    msg.textContent = 'Password must be at least 6 characters.';
    return false;
  }

  // store session data
  sessionStorage.setItem('loggedIn', 'true');
  sessionStorage.setItem('username', u);

  if (remember) {
    localStorage.setItem('rememberedUser', u);
  } else {
    localStorage.removeItem('rememberedUser');
  }

  // redirect to home page
  window.location.href = 'home.html';
  return false;
}

/* Keep user logged in for page navigation (simple check) */
(function checkLoginOnLoad(){
  const path = location.pathname.split('/').pop();
  // allow index.html always
  if (path !== 'index.html' && path !== '' ) {
    const logged = sessionStorage.getItem('loggedIn');
    if (!logged) {
      // if not in session but remembered in localStorage, restore session
      const remembered = localStorage.getItem('rememberedUser');
      if (remembered) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', remembered);
      } else {
        // redirect to login
        window.location.href = 'index.html';
      }
    }
  }
})();

/* ---------- logout ---------- */
function logout(){
  sessionStorage.removeItem('loggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}

/* ---------- homepage initialization ---------- */
function initHome(){
  const name = sessionStorage.getItem('username') || localStorage.getItem('rememberedUser') || 'Student';
  document.getElementById('displayName').textContent = name;
  // profile bio short
  const bio = document.getElementById('bio');
  if (bio) bio.textContent = 'Welcome to my world! My name is Abdullahi Omar, Tech enthusiast. Final-year student at Unilus. Click view profile to know more about myself ';

  // date/time
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // slideshow
  initSlideshow();
  renderDots();
  updateYearInFooter();
}

/* ---------- profile page init ---------- */
function populateProfilePage(){
  const name = sessionStorage.getItem('username') || localStorage.getItem('rememberedUser') || 'Student';
  document.getElementById('profileName').textContent = "Abdullahi Omar";
  // sample results
  const subjects = [
    {sub:'Networking', marks:82},
    {sub:'Data Structures', marks:76},
    {sub:'Web Development', marks:88},
    {sub:'Databases', marks:80},
    {sub:'Java Programming', marks:85}
  ];
  const tbody = document.getElementById('profileResults');
  tbody.innerHTML = '';
  subjects.forEach(s=>{
    const tr = document.createElement('tr');
    const grade = computeGrade(s.marks);
    tr.innerHTML = `<td>${s.sub}</td><td>${s.marks}</td><td>${grade}</td>`;
    tbody.appendChild(tr);
  });
  updateYearInFooter();
}

/* ---------- year results populate ---------- */
function populateYearResults(year){
  const dataByYear = {
  };
  const list = dataByYear[year] || dataByYear[1];
  const tbody = document.getElementById('yearResultsBody');
  if(!tbody) return;
  tbody.innerHTML = '';
  list.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.sub}</td><td>${item.marks}</td><td>${computeGrade(item.marks)}</td>`;
    tbody.appendChild(tr);
  });
  updateYearInFooter();
}

/* helper grade */
function computeGrade(m){
  if (m >= 80) return 'A';
  if (m >= 70) return 'B';
  if (m >= 60) return 'C';
  return 'D';
}

/* ---------- date & time ---------- */
function updateDateTime(){
  const el = document.getElementById('currentDateTime');
  const d = new Date();
  const s = d.toLocaleString();
  if(el) el.textContent = s;
}

/* ---------- slideshow ---------- */
let slideIndex = 0;
let slideTimer = null;

function initSlideshow(){
  const slides = document.querySelectorAll('.slide');
  if(!slides || slides.length===0) return;
  slideIndex = 0;
  showSlide(slideIndex);
  slideTimer && clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 4000);
}

function showSlide(n){
  const slides = document.querySelectorAll('.slide');
  if(!slides || slides.length===0) return;
  slides.forEach(s => s.classList.remove('active'));
  const idx = (n + slides.length) % slides.length;
  slides[idx].classList.add('active');
  slideIndex = idx;
  updateDots();
}

function nextSlide(){ showSlide(slideIndex + 1); }
function prevSlide(){ showSlide(slideIndex - 1); }

function renderDots(){
  const dotsWrap = document.getElementById('slideDots');
  if(!dotsWrap) return;
  dotsWrap.innerHTML = '';
  const slides = document.querySelectorAll('.slide');
  slides.forEach((_,i)=>{
    const d = document.createElement('span');
    d.className = 'dot' + (i===slideIndex ? ' active' : '');
    d.onclick = ()=>{ showSlide(i); clearInterval(slideTimer); slideTimer = setInterval(nextSlide,4000); };
    dotsWrap.appendChild(d);
  });
}
function updateDots(){
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot,i)=> dot.classList.toggle('active', i===slideIndex));
}
// Toggle main menu
function toggleMenu() {
  const nav = document.getElementById("navlist");
  if (nav.style.display === "flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";
  }
}

// Make dropdown clickable on mobile
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(drop => {
    drop.querySelector('.dropbtn').addEventListener('click', (e) => {
      e.preventDefault();            // prevent default link action
      drop.classList.toggle('active'); // toggle submenu
    });
  });
});


/* ---------- helpers ---------- */
function updateYearInFooter(){
  const y = new Date().getFullYear();
  ['year','year2','year3'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = y;
  });
}
