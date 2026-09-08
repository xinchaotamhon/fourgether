import {
  ALL_FLASHCARDS,
  ALL_QUESTIONS,
  LESSONS,
  MEMBERS,
  PROJECT,
  SEQUENCE_FLOWS,
  TRACKS,
} from './data/flashcards.js';

const state = {
  view: 'map',
  trackId: 'common',
  lessonId: null,
  deck: [],
  deckTitle: '',
  cardIndex: 0,
  revealed: false,
};

const app = document.getElementById('app');
const lessonById = (id) => LESSONS.find((item) => item.id === id);
const trackById = (id) => TRACKS.find((item) => item.id === id) || TRACKS[0];
const memberByName = (name) => MEMBERS.find((item) => item.name === name);
const escapeHtml = (value) => String(value ?? '').replace(
  /[&<>'"]/g,
  (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character],
);

function renderList(items, ordered = false) {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`;
}

function lessonsInTrack() {
  return trackById(state.trackId).lessonIds.map(lessonById).filter(Boolean);
}

function renderTabs() {
  return `
    <nav class="track-tabs" aria-label="Chọn lộ trình">
      ${TRACKS.map((track) => `
        <button
          class="track-tab ${track.id === state.trackId ? 'is-active' : ''}"
          data-action="track"
          data-id="${escapeHtml(track.id)}"
          type="button"
        >${escapeHtml(track.tab)}</button>
      `).join('')}
    </nav>
  `;
}

function renderJourney(lessons) {
  return `
    <ol class="journey-map">
      ${lessons.map((lesson, index) => `
        <li class="journey-item">
          <button
            class="journey-button ${lesson.id === state.lessonId ? 'is-active' : ''}"
            data-action="lesson"
            data-id="${escapeHtml(lesson.id)}"
            type="button"
          >
            <span class="journey-number">${escapeHtml(lesson.number)}</span>
            <span>
              <b>${escapeHtml(lesson.title)}</b>
              <small>${escapeHtml(lesson.owner)} · ${escapeHtml(lesson.route)}</small>
            </span>
          </button>
          ${index < lessons.length - 1 ? '<span class="journey-arrow" aria-hidden="true">→</span>' : ''}
        </li>
      `).join('')}
    </ol>
  `;
}

function renderSequenceFlows() {
  return `<div class="sequence-flow-list">
    ${SEQUENCE_FLOWS.map((flow) => `
      <section class="sequence-flow" aria-labelledby="flow-${escapeHtml(flow.id)}">
        <header class="sequence-flow-header">
          <div><p class="eyebrow">LUỒNG THỰC TẾ</p><h3 id="flow-${escapeHtml(flow.id)}">${escapeHtml(flow.title)}</h3></div>
          <p>${escapeHtml(flow.summary)}</p>
        </header>
        <ol class="sequence-flow-nodes">
          ${flow.nodes.map((node, index) => `
            <li class="sequence-flow-item">
              <button class="sequence-node ${node.lessonId === state.lessonId ? 'is-active' : ''}" data-action="lesson" data-id="${escapeHtml(node.lessonId)}" type="button">
                <span class="sequence-node-number">${escapeHtml(node.number)}</span>
                <span><b>${escapeHtml(node.label)}</b><small>${escapeHtml(node.route)}</small></span>
              </button>
              ${index < flow.nodes.length - 1 ? '<span class="sequence-arrow" aria-hidden="true">→</span>' : ''}
            </li>
          `).join('')}
        </ol>
      </section>
    `).join('')}
  </div>`;
}

function renderTeam() {
  return `
    <section class="team-section">
      <div class="section-title">
        <p>PHÂN CÔNG HỌC VÀ TRÌNH BÀY</p>
        <h2>Mỗi người có phần chính, cả nhóm vẫn học luồng chung</h2>
      </div>
      <div class="team-grid">
        ${[...MEMBERS].sort((left, right) => right.difficulty - left.difficulty).map((member) => `
          <article class="member-card">
            <span>${escapeHtml(member.label)}</span>
            <h3>${escapeHtml(member.name)}</h3>
            <p>${escapeHtml(member.mission)}</p>
            <button data-action="track" data-id="${escapeHtml(member.id)}" type="button">
              Mở lộ trình ${escapeHtml(member.name)}
            </button>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLesson(lesson, lessons) {
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const handoff = memberByName(lesson.owner)?.handoff || 'Chuyển sang bước kế tiếp trong hành trình.';

  return `
    <article class="lesson-detail" id="lesson-detail">
      <header class="lesson-header">
        <div>
          <p class="eyebrow">BÀI ${escapeHtml(lesson.number)} · ${escapeHtml(lesson.owner)} PHỤ TRÁCH</p>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.summary)}</p>
        </div>
        <button class="icon-button" data-action="close" type="button" aria-label="Đóng">×</button>
      </header>

      <div class="lesson-grid">
        <section class="lesson-panel important">
          <h3>Bạn cần hiểu</h3>
          ${renderList(lesson.keyPoints)}
        </section>
        <section class="lesson-panel">
          <h3>Kể lại theo trình tự</h3>
          <div class="mini-flow">
            ${lesson.sequence.map((step, stepIndex) => `
              <span><i>${stepIndex + 1}</i>${escapeHtml(step)}</span>
            `).join('')}
          </div>
        </section>
      </div>

      <div class="lesson-grid">
        <section class="lesson-panel demo">
          <h3>Demo trực tiếp</h3>
          ${renderList(lesson.demo.actions, true)}
          <p><b>Kết quả phải thấy:</b> ${escapeHtml(lesson.demo.expected)}</p>
          <details>
            <summary>Nếu demo lỗi</summary>
            <p>${escapeHtml(lesson.demo.fallback)}</p>
          </details>
        </section>
        <section class="lesson-panel rules">
          <h3>Quy tắc nghiệp vụ</h3>
          ${renderList(lesson.rules)}
        </section>
      </div>

      <section class="lesson-panel">
        <h3>Hàm quan trọng và công việc thật</h3>
        <div class="code-grid">
          ${lesson.functions.map((item) => `
            <article class="code-card">
              <code>${escapeHtml(item.name)}()</code>
              <p>${escapeHtml(item.purpose)}</p>
              <small>${escapeHtml(item.path)} · ${escapeHtml(item.symbol)}</small>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="lesson-panel">
        <h3>Giám khảo có thể hỏi ngay tại đây</h3>
        <div class="question-list">
          ${lesson.questions.map((item) => `
            <details>
              <summary>${escapeHtml(item.question)}</summary>
              <p>${escapeHtml(item.answer)}</p>
              <small>${escapeHtml(item.owner)} trả lời chính</small>
            </details>
          `).join('')}
        </div>
      </section>

      <div class="lesson-actions">
        <button class="secondary" data-action="cards-lesson" type="button">
          Tự kiểm tra · ${lesson.cards.length} thẻ
        </button>
        <button class="secondary" data-action="jury-lesson" type="button">
          Luyện phản biện · ${lesson.questions.length} câu
        </button>
      </div>

      <footer class="lesson-navigation">
        <button data-action="lesson" data-id="${previous?.id || ''}" type="button" ${previous ? '' : 'disabled'}>
          ← Bài trước
        </button>
        <p><b>Bàn giao:</b> ${escapeHtml(handoff)}</p>
        <button data-action="lesson" data-id="${next?.id || ''}" type="button" ${next ? '' : 'disabled'}>
          Bài tiếp →
        </button>
      </footer>
    </article>
  `;
}

function renderMap() {
  state.view = 'map';
  const track = trackById(state.trackId);
  const lessons = lessonsInTrack();
  if (state.lessonId && !track.lessonIds.includes(state.lessonId)) state.lessonId = null;
  const lesson = lessonById(state.lessonId);

  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">HỌC ĐỂ THUYẾT TRÌNH · DEMO · PHẢN BIỆN</p>
        <h1>${escapeHtml(track.name)}</h1>
        <p>${escapeHtml(track.description)}</p>
      </div>
      <div class="hero-actions">
        <button class="secondary" data-action="all-jury" type="button">Luyện câu hỏi</button>
        <button class="primary" data-action="start" type="button">Học từ bài đầu</button>
      </div>
    </section>

    ${renderTabs()}

    <section class="project-summary">
      <div><span>KHÁCH HÀNG</span><b>${escapeHtml(PROJECT.audience)}</b></div>
      <div><span>GIÁ TRỊ</span><b>${escapeHtml(PROJECT.promise)}</b></div>
      <div><span>ĐIỂM WOW</span><b>${escapeHtml(PROJECT.wow)}</b></div>
    </section>

    <section class="map-section">
      <div class="section-title">
        <p>BỨC TRANH TOÀN DỰ ÁN</p>
        <h2>Bấm từng chặng để học đầy đủ</h2>
        <span>Mỗi node là một bước có thể bấm để mở ý chính, hàm/route quan trọng và câu hỏi phản biện.</span>
      </div>
      ${state.trackId === 'common' ? renderSequenceFlows() : renderJourney(lessons)}
    </section>

    ${lesson ? renderLesson(lesson, lessons) : `
      <section class="start-hint">
        <b>Bắt đầu từ đâu?</b>
        <p>Chọn một chặng ở sơ đồ, đọc phần cần hiểu, tự kể lại, demo rồi mở câu phản biện.</p>
      </section>
    `}

    ${state.trackId === 'common' ? renderTeam() : ''}
  `;
}

function openDeck(items, title) {
  if (!items.length) return;
  state.view = 'deck';
  state.deck = items;
  state.deckTitle = title;
  state.cardIndex = 0;
  state.revealed = false;
  renderDeck();
}

function renderDeck() {
  const item = state.deck[state.cardIndex];
  const lesson = lessonById(item.lessonId);
  app.innerHTML = `
    <section class="deck-header">
      <button data-action="back" type="button">← Quay lại lộ trình</button>
      <div>
        <p class="eyebrow">${escapeHtml(state.deckTitle)}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
      </div>
      <b>${state.cardIndex + 1}/${state.deck.length}</b>
    </section>

    <button class="flashcard ${state.revealed ? 'is-revealed' : ''}" data-action="flip" type="button">
      <span>${state.revealed ? 'CÂU TRẢ LỜI' : 'TỰ NÓI TRƯỚC KHI LẬT'}</span>
      <strong>${escapeHtml(state.revealed ? item.answer : item.question)}</strong>
      ${state.revealed && item.owner ? `<small>${escapeHtml(item.owner)} trả lời chính</small>` : ''}
      ${state.revealed && item.mistake ? `<em>Dễ nhầm: ${escapeHtml(item.mistake)}</em>` : ''}
      <i>Bấm thẻ hoặc phím Space để lật</i>
    </button>

    <nav class="deck-actions">
      <button data-action="previous-card" type="button" ${state.cardIndex ? '' : 'disabled'}>← Câu trước</button>
      <button data-action="next-card" type="button">
        ${state.cardIndex === state.deck.length - 1 ? 'Hoàn thành' : 'Câu tiếp →'}
      </button>
    </nav>
  `;
}

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'track') {
    state.trackId = button.dataset.id;
    state.lessonId = null;
    renderMap();
  }
  if (action === 'lesson' && button.dataset.id) {
    state.lessonId = button.dataset.id;
    renderMap();
    document.getElementById('lesson-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (action === 'close') {
    state.lessonId = null;
    renderMap();
  }
  if (action === 'start') {
    state.lessonId = lessonsInTrack()[0]?.id || null;
    renderMap();
  }
  if (action === 'cards-lesson') {
    openDeck(
      ALL_FLASHCARDS.filter((item) => item.lessonId === state.lessonId),
      'TỰ KIỂM TRA',
    );
  }
  if (action === 'jury-lesson') {
    openDeck(
      ALL_QUESTIONS.filter((item) => item.lessonId === state.lessonId),
      'LUYỆN PHẢN BIỆN',
    );
  }
  if (action === 'all-jury') {
    const lessonIds = new Set(lessonsInTrack().map((item) => item.id));
    openDeck(
      ALL_QUESTIONS.filter((item) => lessonIds.has(item.lessonId)),
      'CÂU HỎI GIÁM KHẢO',
    );
  }
  if (action === 'back') renderMap();
  if (action === 'flip') {
    state.revealed = !state.revealed;
    renderDeck();
  }
  if (action === 'previous-card' && state.cardIndex > 0) {
    state.cardIndex -= 1;
    state.revealed = false;
    renderDeck();
  }
  if (action === 'next-card') {
    if (state.cardIndex === state.deck.length - 1) renderMap();
    else {
      state.cardIndex += 1;
      state.revealed = false;
      renderDeck();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (state.view !== 'deck') return;
  if (event.code === 'Space') {
    event.preventDefault();
    state.revealed = !state.revealed;
    renderDeck();
  }
  if (event.key === 'ArrowRight') document.querySelector('[data-action="next-card"]')?.click();
  if (event.key === 'ArrowLeft') document.querySelector('[data-action="previous-card"]')?.click();
  if (event.key === 'Escape') renderMap();
});

renderMap();
