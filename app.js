import {
  ALL_FLASHCARDS,
  ALL_QUESTIONS,
  LESSONS,
  MEMBERS,
  PRESENTATION_FLOW,
  PROJECT,
  TRACKS,
} from './data/flashcards.js';

const state = {
  view: 'map',
  trackId: 'common',
  lessonId: null,
  deck: [],
  deckTitle: '',
  cardIndex: 0,
  presentationIndex: 0,
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

function renderPresentationFlow() {
  return `<ol class="presentation-flow">
    ${PRESENTATION_FLOW.map((part, index) => `
      <li class="presentation-part">
        <header>
          <span>PHẦN ${part.order} · ${escapeHtml(part.difficulty)}</span>
          <h3>${escapeHtml(part.name)}</h3>
          <p>${escapeHtml(part.mission)}</p>
        </header>
        ${renderJourney(part.lessonIds.map(lessonById).filter(Boolean))}
        <p class="presentation-handoff"><b>Bàn giao:</b> ${escapeHtml(part.handoff)}</p>
      </li>
      ${index < PRESENTATION_FLOW.length - 1 ? '<li class="presentation-connector" aria-hidden="true">↓</li>' : ''}
    `).join('')}
  </ol>`;
}

function renderTeam() {
  return `
    <section class="team-section">
      <div class="section-title">
        <p>PHÂN CÔNG HỌC VÀ TRÌNH BÀY</p>
        <h2>Mỗi người có phần chính, cả nhóm vẫn học luồng chung</h2>
      </div>
      <div class="team-grid">
        ${[...MEMBERS].sort((left, right) => left.difficulty - right.difficulty).map((member) => `
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
  const handoff = next ? `Tiếp tục với “${next.title}”.` : memberByName(lesson.owner)?.handoff;

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
          <h3>Cách dùng và demo trên web</h3>
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
        <h3>Code cần trình bày</h3>
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

      <section class="study-options" aria-label="Flashcard của chặng">
        <article>
          <span>HỌC SÂU</span>
          <h3>Flashcard hiểu bài</h3>
          <p>Tự nói lại khái niệm, quy tắc và hàm quan trọng của chặng này.</p>
          <button class="secondary" data-action="cards-lesson" type="button">Học ${lesson.cards.length} thẻ</button>
        </article>
        <article>
          <span>PHẢN BIỆN</span>
          <h3>Flashcard giám khảo</h3>
          <p>Tự trả lời tình huống “vì sao”, “ở đâu” và “nếu lỗi thì sao”.</p>
          <button class="secondary" data-action="jury-lesson" type="button">Luyện ${lesson.questions.length} câu</button>
        </article>
      </section>

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
        <button class="secondary" data-action="present" type="button">Chế độ cầm tay</button>
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
        <p>${state.trackId === 'common' ? 'LUỒNG THUYẾT TRÌNH CHÍNH' : 'LỘ TRÌNH CỦA THÀNH VIÊN'}</p>
        <h2>${state.trackId === 'common' ? 'Dũng → Triều → Phúc → Hiệp' : 'Bấm từng chặng để học và tập nói'}</h2>
        <span>Mỗi chặng mở ra ý chính để nói, demo, hàm quan trọng, flashcard học sâu và câu hỏi phản biện.</span>
      </div>
      ${state.trackId === 'common' ? renderPresentationFlow() : renderJourney(lessons)}
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

function renderPresenter() {
  const lessons = lessonsInTrack();
  const lesson = lessons[state.presentationIndex] || lessons[0];
  state.view = 'presenter';
  app.innerHTML = `
    <section class="presenter">
      <header class="presenter-header">
        <button data-action="back" type="button">← Lộ trình</button>
        <b>${state.presentationIndex + 1}/${lessons.length}</b>
      </header>
      <p class="eyebrow">${escapeHtml(lesson.owner)} · CHẶNG ${escapeHtml(lesson.number)}</p>
      <h1>${escapeHtml(lesson.title)}</h1>
      <p class="presenter-route">Mở: <code>${escapeHtml(lesson.route)}</code></p>
      <section>
        <h2>Ba ý cần nói</h2>
        ${renderList(lesson.keyPoints.slice(0, 3), true)}
      </section>
      <section>
        <h2>Trình tự</h2>
        <p class="presenter-sequence">${lesson.sequence.map(escapeHtml).join(' → ')}</p>
      </section>
      <details class="presenter-extra">
        <summary>Cách dùng trên web</summary>
        ${renderList(lesson.demo.actions.slice(0, 3), true)}
      </details>
      <details class="presenter-extra">
        <summary>Code cần nhớ</summary>
        ${renderList(lesson.functions.slice(0, 2).map((item) => `${item.name}() — ${item.path}`))}
      </details>
      <details class="presenter-extra">
        <summary>Câu giám khảo dễ hỏi</summary>
        <p><b>${escapeHtml(lesson.questions[0].question)}</b></p>
        <p>${escapeHtml(lesson.questions[0].answer)}</p>
      </details>
      <p class="presenter-handoff"><b>Chuyển ý:</b> ${escapeHtml(state.presentationIndex < lessons.length - 1 ? `Tiếp theo là ${lessons[state.presentationIndex + 1].title}.` : memberByName(lesson.owner)?.handoff)}</p>
      <nav class="presenter-actions">
        <button data-action="previous-present" type="button" ${state.presentationIndex ? '' : 'disabled'}>← Trước</button>
        <button data-action="open-present-lesson" data-id="${escapeHtml(lesson.id)}" type="button">Xem chi tiết</button>
        <button data-action="next-present" type="button">${state.presentationIndex === lessons.length - 1 ? 'Kết thúc' : 'Tiếp →'}</button>
      </nav>
    </section>
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
  if (action === 'present') {
    state.presentationIndex = 0;
    renderPresenter();
  }
  if (action === 'previous-present' && state.presentationIndex > 0) {
    state.presentationIndex -= 1;
    renderPresenter();
  }
  if (action === 'next-present') {
    if (state.presentationIndex === lessonsInTrack().length - 1) renderMap();
    else {
      state.presentationIndex += 1;
      renderPresenter();
    }
  }
  if (action === 'open-present-lesson') {
    state.lessonId = button.dataset.id;
    renderMap();
    document.getElementById('lesson-detail')?.scrollIntoView({ block: 'start' });
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
