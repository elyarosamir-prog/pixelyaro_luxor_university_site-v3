// ---------- reveal on scroll ----------
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

// ---------- top progress bar + pixel rail ----------
const fill = document.getElementById('topbar-fill');
const railCount = 7;
const rail = document.getElementById('pixel-rail');
for (let i = 0; i < railCount; i++) {
  const d = document.createElement('div');
  d.className = 'rail-px';
  rail.appendChild(d);
}
const railPx = document.querySelectorAll('.rail-px');

function updateProgress() {
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  fill.style.width = pct + '%';
  const onCount = Math.round((pct / 100) * railCount);
  railPx.forEach((el, i) => el.classList.toggle('on', i < onCount));
}
window.addEventListener('scroll', updateProgress);
updateProgress();

// ---------- lightbox gallery ----------
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
let currentGroup = [];
let currentIndex = 0;

function openLightbox(group, index) {
  currentGroup = group;
  currentIndex = index;
  lbImg.src = currentGroup[currentIndex];
  lightbox.classList.add('open');
}
function closeLightbox() { lightbox.classList.remove('open'); }
function nav(delta) {
  currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
  lbImg.src = currentGroup[currentIndex];
}

document.querySelectorAll('.gallery').forEach(gallery => {
  const items = Array.from(gallery.querySelectorAll('.gitem img'));
  const srcs = items.map(img => img.getAttribute('data-full') || img.src);
  items.forEach((img, idx) => {
    img.parentElement.addEventListener('click', () => openLightbox(srcs, idx));
  });
});

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => nav(-1));
document.getElementById('lb-next').addEventListener('click', () => nav(1));
// close on any tap that isn't the image itself or a nav/close button (robust on touch too)
lightbox.addEventListener('click', (e) => {
  if (e.target.closest('#lb-img, #lb-close, #lb-prev, #lb-next')) return;
  closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nav(1);
  if (e.key === 'ArrowLeft') nav(-1);
});
