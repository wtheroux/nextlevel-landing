'use strict';

const reelVideo = document.getElementById('reelVideo');
const reelMuteBtn = document.getElementById('reelMuteBtn');

if (reelVideo && reelMuteBtn) {
  const iconMuted = reelMuteBtn.querySelector('.icon-muted');
  const iconUnmuted = reelMuteBtn.querySelector('.icon-unmuted');

  reelMuteBtn.addEventListener('click', () => {
    reelVideo.muted = !reelVideo.muted;
    iconMuted.style.display = reelVideo.muted ? '' : 'none';
    iconUnmuted.style.display = reelVideo.muted ? 'none' : '';
    reelMuteBtn.setAttribute('aria-label', reelVideo.muted ? 'Включить звук' : 'Выключить звук');
  });
}

const GYM_PHOTOS = {
  'м. Шоссе Энтузиастов': 'gym-shosse.png',
  'м. Нижегородская':     'gym-nizh.png',
  'м. Кожуховская':       'gym-kozh.png',
};

const PRICES = {
  'м. Шоссе Энтузиастов': 700,
  'м. Нижегородская':     900,
  'м. Кожуховская':       900,
};

const SESSIONS = [
  { id: 1, dayIndex: 0, day: 'Пн', dayFull: 'Понедельник', time: '21:00 – 23:00', location: 'м. Шоссе Энтузиастов', comingSoon: false },
  { id: 4, dayIndex: 1, day: 'Вт', dayFull: 'Вторник',     time: '20:00 – 22:00', location: 'м. Нижегородская',     comingSoon: false, price: 1300, badge: 'С тренером', desc: 'Тренировка с тренером — Дмитрий Стеблев, МС по волейболу, экс-игрок ВК «Парма». Разбор техники и игровые связки, любой уровень.' },
  { id: 5, dayIndex: 3, day: 'Чт', dayFull: 'Четверг',     time: '20:00 – 22:00', location: 'м. Нижегородская',     comingSoon: false },
  { id: 6, dayIndex: 6, day: 'Вс', dayFull: 'Воскресенье', time: '18:00 – 20:00', location: 'м. Нижегородская',     comingSoon: false },
  { id: 7, dayIndex: 6, day: 'Вс', dayFull: 'Воскресенье', time: '20:00 – 22:00', location: 'м. Нижегородская',     comingSoon: false, desc: 'Уровень средний/средний+. Работаем в расстановках 5/1 и 4/2 — системный приём, атаки из нескольких зон и командная тактика без скидок на уровень.' },
  { id: 8, dayIndex: 4, day: 'Пт', dayFull: 'Пятница',     time: '19:00 – 21:00', location: 'м. Кожуховская',       comingSoon: false, desc: 'Игра для тех, кто знает счёт очкам. Работаем в расстановках 5/1 и 4/2 — системный приём, атаки из нескольких зон и командная тактика без скидок на уровень.' },
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

let weekOffset = 0;

function getWeekDates(offset = 0) {
  const today = new Date();
  const dow = today.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMon + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fmtDate(d) {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace(/\.$/, '');
}

function fmtRange(dates) {
  const m = dates[0], s = dates[6];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const sameMonth = m.getMonth() === s.getMonth();
  return sameMonth
    ? `${m.getDate()} – ${s.getDate()} ${months[s.getMonth()]}`
    : `${m.getDate()} ${months[m.getMonth()]} – ${s.getDate()} ${months[s.getMonth()]}`;
}

const header = document.getElementById('header');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 20);
      ticking = false;
    });
    ticking = true;
  }
});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('active');
  mobileMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

setTimeout(() => {
  document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
}, 100);

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${Math.random()>.5?'#F5A623':'rgba(255,255,255,0.3)'};animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*8}s;`;
    container.appendChild(p);
  }
}
createParticles();

function renderUpcomingCards() {
  const container = document.getElementById('upcomingCards');
  if (!container) return;

  const dates = getWeekDates(0);

  const targetDays = [0, 1, 3, 4];
  const cards = targetDays.map(di =>
    SESSIONS.find(s => s.dayIndex === di && !s.comingSoon)
  ).filter(Boolean);

  container.innerHTML = cards.map((s, i) => {
    const dateStr = fmtDate(dates[s.dayIndex]);
    const photo = GYM_PHOTOS[s.location];
    return `
      <article class="training-card" data-id="${s.id}" style="transition-delay:${i * 0.1}s">
        <div class="training-card__img">
          ${photo
            ? `<picture>
                <source srcset="${photo.replace('.png', '.webp')}" type="image/webp">
                <img src="${photo}" alt="Зал ${s.location}" class="training-card__photo" loading="lazy">
              </picture>`
            : `<div class="training-card__img-bg"></div>`
          }
          <div class="training-card__img-overlay"></div>
        </div>
        <div class="training-card__body">
          ${s.badge ? `<div class="training-card__badge">${s.badge}</div>` : ''}
          <div class="training-card__day">${s.dayFull}</div>
          <div class="training-card__date">${dateStr}</div>
          <div class="training-card__meta">
            <div class="training-card__meta-row">${iconClock()} ${s.time}</div>
            <div class="training-card__meta-row">${iconLocation()} ${s.location}${s.locationNote ? ` <span class="location-note">${s.locationNote}</span>` : ''}</div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.training-card').forEach(card => {
    revealObserver.observe(card);
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('badge--available')) return;
      const session = SESSIONS.find(s => s.id === parseInt(card.dataset.id));
      if (session) openSessionDetail(session);
    });
  });
}
renderUpcomingCards();

function getFilteredSessions() {
  const metro = document.getElementById('filterMetro')?.value || '';
  const day   = document.getElementById('filterDay')?.value || '';

  const metroMap = { shosse: 'м. Шоссе Энтузиастов', nizh: 'м. Нижегородская', kozh: 'м. Кожуховская' };
  const dayMap   = { mon:0, tue:1, wed:2, thu:3, fri:4, sat:5, sun:6 };

  return SESSIONS.filter(s => {
    if (metro && s.location !== metroMap[metro]) return false;
    if (day !== '' && s.dayIndex !== dayMap[day]) return false;
    return true;
  });
}

function renderScheduleGrid() {
  const grid = document.getElementById('scheduleGrid');
  if (!grid) return;

  const dates   = getWeekDates(weekOffset);
  const sessions = getFilteredSessions();

  document.getElementById('weekRange').textContent = fmtRange(dates);

  grid.innerHTML = DAY_NAMES.map((day, di) => {
    const daySessions = sessions.filter(s => s.dayIndex === di);
    const dateStr = fmtDate(dates[di]);
    return `
      <div class="schedule-col">
        <div class="schedule-col__header">
          <div class="schedule-col__day">${day}</div>
          <div class="schedule-col__date">${dateStr}</div>
        </div>
        ${daySessions.length === 0 ? '' : daySessions.map(s => {
          if (s.comingSoon) return `
            <div class="schedule-session schedule-session--soon">
              <div class="schedule-session__time schedule-session__time--soon">Скоро</div>
              <div class="schedule-session__location">${iconLocationSm()} ${s.location}${s.locationNote ? `, ${s.locationNote}` : ''}</div>
              <div class="schedule-session__soon-badge">запуск</div>
            </div>
          `;
          return `
            <div class="schedule-session" data-id="${s.id}" role="button" tabindex="0" aria-label="${s.dayFull} ${s.time} ${s.location}">
              ${s.badge ? `<div class="schedule-session__badge">${s.badge}</div>` : ''}
              <div class="schedule-session__time">${s.time}</div>
              <div class="schedule-session__location">${iconLocationSm()} ${s.location}${s.locationNote ? `, <em>${s.locationNote}</em>` : ''}</div>
              <div class="schedule-session__btn">Записаться</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.schedule-session:not(.schedule-session--soon)').forEach(el => {
    const open = () => {
      const session = SESSIONS.find(s => s.id === parseInt(el.dataset.id));
      if (session) openSessionDetail(session);
    };
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}
renderScheduleGrid();

document.getElementById('prevWeek')?.addEventListener('click', () => { weekOffset--; renderScheduleGrid(); });
document.getElementById('nextWeek')?.addEventListener('click', () => { weekOffset++; renderScheduleGrid(); });

document.getElementById('filterMetro')?.addEventListener('change', renderScheduleGrid);
document.getElementById('filterDay')?.addEventListener('change', renderScheduleGrid);

const sessionDetail = document.getElementById('sessionDetail');
const sessionDetailContent = document.getElementById('sessionDetailContent');
const closeDetail = document.getElementById('closeDetail');

const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

function openSessionDetail(session) {
  const dates = getWeekDates(weekOffset);
  const dateStr = fmtDate(dates[session.dayIndex]);

  sessionDetailContent.innerHTML = `
    <div class="session-detail__date">${session.dayFull}, ${dateStr}</div>
    <div class="session-detail__time">${session.time}</div>
    <div class="session-detail__info">
      <div class="session-detail__info-row">
        ${iconLocation()} ${session.location}${session.locationNote ? ` — <span style="color:var(--accent)">${session.locationNote}</span>` : ''}
      </div>
    </div>
    <div class="session-detail__section">
      <p class="session-detail__section-title">О тренировке</p>
      <p class="session-detail__section-text">${session.desc || 'Играем в классический волейбол. Разминка, игра 6×6 — для всех, кто любит игру и движение.'}</p>
    </div>
    <div class="session-detail__section">
      <p class="session-detail__section-title">Что взять с собой?</p>
      <ul class="session-detail__checklist">
        <li>Спортивная форма</li>
        <li>Сменная обувь</li>
        <li>Хорошее настроение</li>
      </ul>
    </div>
    <div class="session-detail__section">
      <p class="session-detail__section-title">Стоимость</p>
      <div class="session-detail__price">${session.price || PRICES[session.location] || 800} ₽</div>
    </div>
    <div class="session-detail__actions">
      <button class="btn btn--primary" onclick="openSignup(event)">Записаться</button>
      <a href="https://t.me/fusion_1" target="_blank" rel="noopener noreferrer" class="btn btn--outline" onclick="closeSessionDetail()">Есть вопрос?</a>
    </div>
  `;
  sessionDetail.classList.add('open');
  sessionDetail.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSessionDetail() {
  sessionDetail.classList.remove('open');
  sessionDetail.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

closeDetail.addEventListener('click', closeSessionDetail);
overlay.addEventListener('click', closeSessionDetail);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSessionDetail(); });

document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

function openSignup(e) {
  e && e.stopPropagation();
  closeSessionDetail();
  window.open('https://t.me/next_level_volley', '_blank', 'noopener,noreferrer');
}
window.openSignup = openSignup;
window.closeSessionDetail = closeSessionDetail;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

function iconClock() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}
function iconLocation() {
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1a6 6 0 016 6c0 4-6 10-6 10S3 11 3 7a6 6 0 016-6z" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/></svg>`;
}
function iconLocationSm() {
  return `<svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1a6 6 0 016 6c0 4-6 10-6 10S3 11 3 7a6 6 0 016-6z" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="7" r="2" stroke="currentColor" stroke-width="1.5"/></svg>`;
}
