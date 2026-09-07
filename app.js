import {
  COURSES,
  FLASHCARDS,
  FLOW_NODES,
  LEARNING_FLOWS,
  MEMBER_PATHS,
} from './data/flashcards.js';

// Progress lives only in memory. Reloading starts a new learning session.
const state = {
  view: 'flow',
  flowId: 'common',
  milestoneId: null,
  deckCardIds: [],
  deckTitle: '',
  index: 0,
  revealed: false,
  details: new Set(),
  mastered: new Set(),
};

const app = document.getElementById('app');
const nodesById = new Map(FLOW_NODES.map((node) => [node.id, node]));
const cardsById = new Map(FLASHCARDS.map((card) => [card.id, card]));

const flowById = (flowId) => LEARNING_FLOWS.find((flow) => flow.id === flowId);
const courseById = (courseId) => COURSES.find((course) => course.id === courseId);
const memberById = (memberId) => MEMBER_PATHS.find((member) => member.id === memberId);
const cardsFromIds = (cardIds = []) => cardIds.map((id) => cardsById.get(id)).filter(Boolean);
const milestonesOf = (flow) => flow.phases.flatMap((phase) => phase.milestones);
const milestoneById = (flow, milestoneId) => milestonesOf(flow).find((item) => item.id === milestoneId);
const escapeHtml = (value) => String(value ?? '').replace(
  /[&<>'"]/g,
  (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character],
);

function cardIdsForMilestone(flow, milestone) {
  const nodeIds = new Set(milestone.nodeIds);
  const course = courseById(flow.courseId);
  return course.cardIds.filter((cardId) => nodeIds.has(cardsById.get(cardId)?.nodeId));
}

function questionIdsForMilestone(flow, milestone) {
  const nodeIds = new Set(milestone.nodeIds);
  return flow.questionIds.filter((cardId) => nodeIds.has(cardsById.get(cardId)?.nodeId));
}

function questionMeta(cardId) {
  for (const member of MEMBER_PATHS) {
    if (member.questions.high.includes(cardId)) return { member, likelihood: 'Khả năng cao' };
    if (member.questions.medium.includes(cardId)) return { member, likelihood: 'Có thể hỏi' };
  }
  return null;
}

function validateCurriculum() {
  const errors = [];
  const nodeIds = new Set(FLOW_NODES.map((node) => node.id));
  const cardIds = new Set(FLASHCARDS.map((card) => card.id));

  for (const flow of LEARNING_FLOWS) {
    const course = courseById(flow.courseId);
    if (!course) errors.push(`Flow ${flow.id} thiếu course`);
    if (flow.phases.map((phase) => phase.id).join(',') !== 'input,process,output') {
      errors.push(`Flow ${flow.id} sai thứ tự phase`);
    }

    const seenNodes = new Set();
    for (const milestone of milestonesOf(flow)) {
      for (const nodeId of milestone.nodeIds) {
        if (!nodeIds.has(nodeId)) errors.push(`${milestone.id} thiếu node ${nodeId}`);
        if (seenNodes.has(nodeId)) errors.push(`${flow.id} lặp node ${nodeId}`);
        seenNodes.add(nodeId);
      }
    }

    for (const questionId of flow.questionIds) {
      if (!cardIds.has(questionId)) errors.push(`${flow.id} thiếu câu ${questionId}`);
      const mapped = milestonesOf(flow).filter((milestone) => (
        milestone.nodeIds.includes(cardsById.get(questionId)?.nodeId)
      ));
      if (mapped.length !== 1) errors.push(`${flow.id} chưa đặt ${questionId} vào đúng một bước`);
    }

    if (course) {
      for (const cardId of course.cardIds) {
        const mapped = milestonesOf(flow).some((milestone) => (
          milestone.nodeIds.includes(cardsById.get(cardId)?.nodeId)
        ));
        if (!mapped) errors.push(`${flow.id} chưa đặt thẻ ${cardId} vào luồng`);
      }
    }
  }

  if (errors.length) console.error('[Fourgether] Dữ liệu học không hợp lệ:', errors);
  return errors;
}

function renderFlowTabs() {
  return `
    <nav class="flow-tabs" role="tablist" aria-label="Chọn luồng học">
      ${LEARNING_FLOWS.map((flow) => `
        <button
          id="flow-tab-${escapeHtml(flow.id)}"
          class="flow-tab ${flow.id === state.flowId ? 'is-active' : ''}"
          data-action="flow"
          data-flow-id="${escapeHtml(flow.id)}"
          type="button"
          role="tab"
          aria-selected="${flow.id === state.flowId}"
          aria-controls="flow-overview"
        >${escapeHtml(flow.tab)}</button>
      `).join('')}
    </nav>
  `;
}

function renderMilestone(flow, milestone) {
  const cardIds = cardIdsForMilestone(flow, milestone);
  const questionIds = questionIdsForMilestone(flow, milestone);
  const learned = cardIds.filter((cardId) => state.mastered.has(cardId)).length;
  const active = milestone.id === state.milestoneId;

  return `
    <li>
      <button
        class="milestone ${active ? 'is-active' : ''}"
        data-action="milestone"
        data-milestone-id="${escapeHtml(milestone.id)}"
        type="button"
        aria-expanded="${active}"
        aria-controls="milestone-detail"
      >
        <span class="milestone-title">${escapeHtml(milestone.title)}</span>
        <span class="milestone-summary">${escapeHtml(milestone.summary)}</span>
        <span class="milestone-meta">
          <span>${learned}/${cardIds.length} thẻ</span>
          <span class="question-count">? ${questionIds.length} câu</span>
        </span>
      </button>
    </li>
  `;
}

function renderPhase(flow, phase, index) {
  return `
    <article class="phase-card phase-${escapeHtml(phase.id)}">
      <header class="phase-header">
        <span class="phase-number">0${index + 1}</span>
        <div>
          <span class="phase-label">${escapeHtml(phase.title)}</span>
          <p>${escapeHtml(phase.summary)}</p>
        </div>
      </header>
      <ol class="milestone-list">
        ${phase.milestones.map((milestone) => renderMilestone(flow, milestone)).join('')}
      </ol>
    </article>
  `;
}

function renderMilestoneDetail(flow) {
  const milestone = milestoneById(flow, state.milestoneId);
  if (!milestone) return '';

  const phase = flow.phases.find((item) => item.milestones.some((candidate) => candidate.id === milestone.id));
  const cardIds = cardIdsForMilestone(flow, milestone);
  const questionIds = questionIdsForMilestone(flow, milestone);
  const questionCards = cardsFromIds(questionIds);
  const nodeNames = milestone.nodeIds.map((nodeId) => nodesById.get(nodeId)?.label).filter(Boolean);

  return `
    <section id="milestone-detail" class="milestone-detail" tabindex="-1" aria-labelledby="milestone-detail-title">
      <header>
        <div>
          <span class="eyebrow">${escapeHtml(phase.title)} · ${cardIds.length} thẻ</span>
          <h2 id="milestone-detail-title">${escapeHtml(milestone.title)}</h2>
        </div>
        <button class="close-detail" data-action="close-detail" type="button" aria-label="Đóng chi tiết">×</button>
      </header>
      <p class="detail-summary">${escapeHtml(milestone.summary)}</p>
      <p class="node-route"><strong>Luồng kiến thức:</strong> ${nodeNames.map(escapeHtml).join(' → ')}</p>

      <div class="question-preview">
        <div class="question-preview-heading">
          <strong>Câu phản biện</strong>
          <span>${questionIds.length} câu trong bước này</span>
        </div>
        <ol>
          ${questionCards.slice(0, 2).map((card) => {
            const meta = questionMeta(card.id);
            return `
              <li>
                <span>${escapeHtml(card.prompt)}</span>
                ${meta ? `<small>${escapeHtml(meta.likelihood)} · ${escapeHtml(meta.member.name)}</small>` : ''}
              </li>
            `;
          }).join('')}
        </ol>
        ${questionIds.length > 2 ? `<span class="more-questions">+ ${questionIds.length - 2} câu khác</span>` : ''}
      </div>

      <div class="detail-actions-row">
        <button class="secondary-action" data-action="study-step" type="button">Học bước này · ${cardIds.length} thẻ</button>
        <button class="primary-action" data-action="questions-step" type="button">Luyện câu hỏi · ${questionIds.length} câu</button>
      </div>
    </section>
  `;
}

function renderFlow() {
  state.view = 'flow';
  const flow = flowById(state.flowId) || LEARNING_FLOWS[0];
  const course = courseById(flow.courseId);
  const member = flow.memberId ? memberById(flow.memberId) : null;
  const learned = course.cardIds.filter((cardId) => state.mastered.has(cardId)).length;
  const context = member
    ? `${member.difficultyLabel} · thuyết trình thứ ${member.presentationOrder}`
    : 'Luồng nền tảng cho cả 4 thành viên';

  app.innerHTML = `
    <section class="flow-heading">
      <div>
        <p class="eyebrow">SƠ ĐỒ HỌC THEO TRÌNH TỰ</p>
        <h1>${escapeHtml(flow.title)}</h1>
        <p class="lead">${escapeHtml(flow.summary)}</p>
      </div>
      <div class="session-score">
        <strong>${learned}/${course.cardIds.length}</strong>
        <span>thẻ đã thuộc<br>trong luồng này</span>
      </div>
    </section>

    ${renderFlowTabs()}

    <section class="flow-launch" aria-label="Bắt đầu học luồng hiện tại">
      <div>
        <span class="flow-owner">${escapeHtml(flow.owner)}</span>
        <strong>${escapeHtml(context)}</strong>
      </div>
      <div class="flow-actions">
        <button class="secondary-action" data-action="all-questions" type="button">Luyện tất cả · ${flow.questionIds.length} câu</button>
        <button class="primary-action" data-action="course" type="button">Học toàn luồng · ${course.cardIds.length} thẻ</button>
      </div>
    </section>

    <section
      id="flow-overview"
      class="flow-overview"
      role="tabpanel"
      aria-labelledby="flow-tab-${escapeHtml(flow.id)}"
      aria-label="${escapeHtml(flow.tab)}: Đầu vào, Xử lý, Đầu ra"
    >
      <div class="flow-board">
        ${renderPhase(flow, flow.phases[0], 0)}
        <span class="flow-arrow" aria-hidden="true"></span>
        ${renderPhase(flow, flow.phases[1], 1)}
        <span class="flow-arrow" aria-hidden="true"></span>
        ${renderPhase(flow, flow.phases[2], 2)}
      </div>
      ${renderMilestoneDetail(flow)}
    </section>
  `;
  bindFlowEvents();
}

function renderSources(card) {
  return `
    <div class="card-sources">
      <b>Bằng chứng</b>
      ${card.sourceRefs.map((source) => `
        <span>${escapeHtml(source.path)} · ${escapeHtml(source.symbol)}</span>
      `).join('')}
    </div>
  `;
}

function detailButton(key, label) {
  const open = state.details.has(key) ? 'is-open' : '';
  return `<button class="detail-button ${open}" data-action="detail" data-detail="${key}" type="button">${label}</button>`;
}

function activeCards() {
  return cardsFromIds(state.deckCardIds);
}

function renderDeck() {
  state.view = 'deck';
  const cards = activeCards();
  const card = cards[state.index];
  if (!card) return renderFlow();

  const node = nodesById.get(card.nodeId);
  const meta = questionMeta(card.id);
  const mastered = state.mastered.has(card.id);
  const questionBadge = meta
    ? `<span class="question-badge">${meta.likelihood} · ${escapeHtml(meta.member.name)} phụ trách</span>`
    : '';

  const answer = state.revealed ? `
    <span class="answer-text">${escapeHtml(card.modelAnswer)}</span>
    <div class="detail-actions">
      ${detailButton('explanation', 'Vì sao')}
      ${detailButton('misconception', 'Dễ nhầm')}
      ${detailButton('transfer', 'Nếu… thì sao?')}
    </div>
    ${state.details.has('explanation') ? `
      <section class="card-detail"><h3>Vì sao</h3><p>${escapeHtml(card.explanation)}</p></section>
    ` : ''}
    ${state.details.has('misconception') ? `
      <section class="card-detail"><h3>Dễ nhầm</h3><p>${escapeHtml(card.misconception)}</p></section>
    ` : ''}
    ${state.details.has('transfer') ? `
      <section class="card-detail">
        <h3>Câu hỏi tiếp theo</h3><p>${escapeHtml(card.transfer.prompt)}</p>
        <h3>Trả lời</h3><p>${escapeHtml(card.transfer.answer)}</p>
      </section>
    ` : ''}
    ${renderSources(card)}
  ` : `<span class="question-text">${escapeHtml(card.prompt)}</span>`;

  const flashcard = state.revealed
    ? `
      <section class="flashcard is-flipped">
        <span class="card-side-label">ĐÁP ÁN</span>
        <div class="card-content">${answer}</div>
        <button class="card-foot" data-action="flip" type="button">Bấm để xem lại câu hỏi</button>
      </section>
    `
    : `
      <button class="flashcard" data-action="flip" type="button" aria-label="Xem đáp án">
        <span class="card-side-label">CÂU HỎI</span>
        <div class="card-content">${answer}</div>
        <span class="card-foot">Bấm thẻ hoặc Space để lật</span>
      </button>
    `;

  app.innerHTML = `
    <div class="deck-topbar">
      <button class="back-button" data-action="back" type="button">← Sơ đồ ${escapeHtml(flowById(state.flowId)?.tab || '')}</button>
      <div class="deck-node">
        <span class="node-number">${escapeHtml(node.order)}</span>
        <span>
          <strong>${escapeHtml(state.deckTitle)}</strong>
          <small>${escapeHtml(node.label)} · ${escapeHtml(card.type)}</small>
        </span>
      </div>
      <span class="deck-count">${state.index + 1} / ${cards.length}</span>
    </div>
    <div class="deck-progress"><span style="width:${((state.index + 1) / cards.length) * 100}%"></span></div>

    <section class="study-layout">
      <div class="study-intro">
        <span class="eyebrow">${meta ? 'LUYỆN BẢO VỆ' : escapeHtml(card.type).toUpperCase()}</span>
        ${questionBadge}
        <h1>${state.revealed ? 'Đối chiếu câu trả lời' : 'Tự trả lời như khi bảo vệ'}</h1>
        <p>${state.revealed ? 'Mở từng phần nếu cần hiểu sâu hơn.' : 'Nói thành lời trước, sau đó mới lật thẻ.'}</p>
        <button class="keyboard-hint" data-action="flip" type="button">
          ${state.revealed ? 'Space · Xem lại câu hỏi' : 'Space · Xem đáp án'}
        </button>
      </div>
      ${flashcard}
    </section>

    <div class="study-actions">
      <button class="nav-button" data-action="previous" type="button" ${state.index === 0 ? 'disabled' : ''}>← Câu trước</button>
      <button class="master-button ${mastered ? 'done' : ''}" data-action="mastered" type="button">
        ${mastered ? '✓ Đã thuộc câu này' : '☆ Đánh dấu đã thuộc'}
      </button>
      <button class="nav-button" data-action="next" type="button">
        ${state.index === cards.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} →
      </button>
    </div>
  `;
  bindDeckEvents();
}

function resetCardFace() {
  state.revealed = false;
  state.details.clear();
}

function openCards(cardIds, title) {
  if (!cardIds.length) return;
  state.deckCardIds = [...cardIds];
  state.deckTitle = title;
  state.index = 0;
  resetCardFace();
  renderDeck();
}

function bindFlowEvents() {
  const flow = flowById(state.flowId);
  const course = courseById(flow.courseId);

  app.querySelectorAll('[data-action="flow"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.flowId = button.dataset.flowId;
      state.milestoneId = null;
      renderFlow();
    });
  });

  app.querySelectorAll('[data-action="milestone"]').forEach((button) => {
    button.addEventListener('click', () => {
      const opening = state.milestoneId !== button.dataset.milestoneId;
      state.milestoneId = opening ? button.dataset.milestoneId : null;
      renderFlow();
      if (opening) app.querySelector('#milestone-detail')?.scrollIntoView({ block: 'nearest' });
    });
  });

  app.querySelector('[data-action="close-detail"]')?.addEventListener('click', () => {
    state.milestoneId = null;
    renderFlow();
  });

  app.querySelector('[data-action="course"]')?.addEventListener('click', () => {
    openCards(course.cardIds, course.title);
  });
  app.querySelector('[data-action="all-questions"]')?.addEventListener('click', () => {
    openCards(flow.questionIds, `${flow.owner} · Câu phản biện`);
  });

  const milestone = milestoneById(flow, state.milestoneId);
  app.querySelector('[data-action="study-step"]')?.addEventListener('click', () => {
    openCards(cardIdsForMilestone(flow, milestone), milestone.title);
  });
  app.querySelector('[data-action="questions-step"]')?.addEventListener('click', () => {
    openCards(questionIdsForMilestone(flow, milestone), `${milestone.title} · Câu phản biện`);
  });
}

function bindDeckEvents() {
  app.querySelectorAll('[data-action="flip"]').forEach((element) => {
    element.addEventListener('click', () => {
      state.revealed = !state.revealed;
      if (!state.revealed) state.details.clear();
      renderDeck();
    });
  });
  app.querySelectorAll('[data-action="detail"]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.detail;
      if (state.details.has(key)) state.details.delete(key);
      else state.details.add(key);
      renderDeck();
    });
  });
  app.querySelector('[data-action="back"]')?.addEventListener('click', renderFlow);
  app.querySelector('[data-action="previous"]')?.addEventListener('click', () => {
    if (state.index === 0) return;
    state.index -= 1;
    resetCardFace();
    renderDeck();
  });
  app.querySelector('[data-action="next"]')?.addEventListener('click', () => {
    if (state.index >= activeCards().length - 1) return renderFlow();
    state.index += 1;
    resetCardFace();
    renderDeck();
  });
  app.querySelector('[data-action="mastered"]')?.addEventListener('click', () => {
    const card = activeCards()[state.index];
    if (state.mastered.has(card.id)) state.mastered.delete(card.id);
    else state.mastered.add(card.id);
    renderDeck();
  });
}

document.addEventListener('keydown', (event) => {
  if (state.view === 'flow' && event.key === 'Escape' && state.milestoneId) {
    state.milestoneId = null;
    renderFlow();
    return;
  }
  if (state.view !== 'deck') return;

  if (event.code === 'Space' && document.activeElement?.tagName !== 'BUTTON') {
    event.preventDefault();
    state.revealed = !state.revealed;
    if (!state.revealed) state.details.clear();
    renderDeck();
  }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click();
  if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click();
  if (event.key === 'Escape') renderFlow();
});

validateCurriculum();
renderFlow();
