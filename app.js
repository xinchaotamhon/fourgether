import {
  COURSES,
  DEFENSE_QUESTION_IDS,
  FLASHCARDS,
  FLOW_NODES,
  MEMBER_PATHS,
} from './data/flashcards.js';

// Fourgether only keeps progress in memory. Reloading starts a new session.
const state = {
  view: 'tree',
  returnView: 'tree',
  nodeId: null,
  courseId: null,
  index: 0,
  revealed: false,
  details: new Set(),
  mastered: new Set(),
  expanded: new Set(['project', 'journey']),
  query: '',
};

const app = document.getElementById('app');
const nodesById = new Map(FLOW_NODES.map((node) => [node.id, node]));
const cardsById = new Map(FLASHCARDS.map((card) => [card.id, card]));

const childrenOf = (nodeId) => FLOW_NODES.filter((node) => node.parent === nodeId);
const cardsForNode = (nodeId) => FLASHCARDS.filter((card) => card.nodeId === nodeId);
const courseById = (courseId) => COURSES.find((course) => course.id === courseId);
const cardsFromIds = (cardIds = []) => cardIds.map((id) => cardsById.get(id)).filter(Boolean);
const escapeHtml = (value) => String(value ?? '').replace(
  /[&<>'"]/g,
  (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character],
);

function activeCards() {
  if (!state.courseId) return cardsForNode(state.nodeId);
  const course = courseById(state.courseId);
  if (!course) return [];
  if (course.cardIds) return cardsFromIds(course.cardIds);
  return course.nodeIds.flatMap(cardsForNode);
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

  for (const node of FLOW_NODES) {
    if (node.parent && !nodeIds.has(node.parent)) errors.push(`Node ${node.id} thiếu parent`);
    if (!cardsForNode(node.id).length) errors.push(`Node ${node.id} chưa có thẻ`);
  }

  for (const course of COURSES) {
    for (const cardId of course.cardIds || []) {
      if (!cardIds.has(cardId)) errors.push(`Course ${course.id} thiếu card ${cardId}`);
    }
  }

  for (const member of MEMBER_PATHS) {
    for (const nodeId of member.nodeIds) {
      if (!nodeIds.has(nodeId)) errors.push(`${member.name} thiếu node ${nodeId}`);
    }
  }

  if (errors.length) console.error('[Fourgether] Dữ liệu học không hợp lệ:', errors);
  return errors;
}

function matchingNodeIds() {
  const query = state.query.trim().toLocaleLowerCase('vi');
  if (!query) return null;

  const matches = new Set();
  for (const node of FLOW_NODES) {
    const cardText = cardsForNode(node.id).flatMap((card) => [
      card.prompt,
      card.modelAnswer,
      card.explanation,
      ...card.sourceRefs.map((source) => `${source.path} ${source.symbol}`),
    ]);
    const searchableText = [node.id, node.label, node.shortLabel, ...cardText]
      .join(' ')
      .toLocaleLowerCase('vi');

    if (!searchableText.includes(query)) continue;
    matches.add(node.id);
    let parent = node.parent ? nodesById.get(node.parent) : null;
    while (parent) {
      matches.add(parent.id);
      parent = parent.parent ? nodesById.get(parent.parent) : null;
    }
  }
  return matches;
}

function nodeButton(node, matches) {
  const children = childrenOf(node.id);
  const expanded = state.expanded.has(node.id);
  const count = cardsForNode(node.id).length;
  const highlighted = matches?.has(node.id) ? 'is-match' : '';

  return `
    <div class="tree-card-wrap ${highlighted}">
      <button class="node-card tone-${escapeHtml(node.tone)}" data-action="node" data-node-id="${escapeHtml(node.id)}" aria-label="Học ${escapeHtml(node.label)}">
        <span class="node-top">
          <span class="node-kicker">${escapeHtml(node.kicker || node.order)}</span>
          ${children.length ? `<span class="child-count">${children.length} nhánh</span>` : ''}
        </span>
        <h2>${escapeHtml(node.label)}</h2>
        <p>${escapeHtml(node.shortLabel)}</p>
        <div class="node-bottom"><span>Học thẻ của node này</span><b>${count} thẻ</b></div>
      </button>
      ${children.length ? `
        <button class="toggle-node" data-action="toggle" data-node-id="${escapeHtml(node.id)}" aria-expanded="${expanded}" aria-label="${expanded ? 'Thu gọn' : 'Mở rộng'} ${escapeHtml(node.label)}">
          ${expanded ? '−' : '+'}
        </button>
      ` : ''}
    </div>
  `;
}

function renderNode(node, matches) {
  const children = childrenOf(node.id);
  const visibleChildren = matches
    ? children.filter((child) => matches.has(child.id))
    : children;
  const expanded = state.expanded.has(node.id) || Boolean(state.query.trim());

  return `
    <li class="tree-item ${children.length ? 'has-children' : 'is-leaf'}">
      ${nodeButton(node, matches)}
      ${expanded && visibleChildren.length
        ? `<ul class="tree-level">${visibleChildren.map((child) => renderNode(child, matches)).join('')}</ul>`
        : ''}
    </li>
  `;
}

function renderTree() {
  state.view = 'tree';
  state.courseId = null;
  const commonCourse = COURSES.find((course) => course.kind === 'common');
  const root = nodesById.get('project');
  const matches = matchingNodeIds();
  const rootExpanded = state.expanded.has(root.id) || Boolean(state.query.trim());
  const visibleRoots = rootExpanded
    ? childrenOf(root.id).filter((node) => !matches || matches.has(node.id))
    : [];

  app.innerHTML = `
    <section class="tree-heading">
      <div>
        <p class="eyebrow">BẢN ĐỒ HỌC THEO LUỒNG</p>
        <h1>Hiểu FurneeHome từ trải nghiệm đến hàm thật</h1>
        <p class="lead">Cả nhóm học toàn dự án trước, sau đó mỗi người đào sâu phần mình thuyết trình.</p>
      </div>
      <div class="session-score">
        <strong>${state.mastered.size}/${FLASHCARDS.length}</strong>
        <span>thẻ đã thuộc<br>trong phiên này</span>
      </div>
    </section>

    <section class="course-launch" aria-label="Bắt đầu học">
      <div>
        <strong>${escapeHtml(commonCourse.title)}</strong>
        <span>${escapeHtml(commonCourse.description)}</span>
      </div>
      <div class="course-actions">
        <button data-action="course" data-course-id="${escapeHtml(commonCourse.id)}" type="button">Học toàn bộ →</button>
        <button class="secondary" data-action="roles" type="button">Lộ trình 4 người</button>
      </div>
    </section>

    <section class="finder-bar" aria-label="Tìm trong cây học">
      <label for="node-finder">Tìm node, hàm hoặc file</label>
      <div class="finder-input">
        <span aria-hidden="true">⌕</span>
        <input id="node-finder" type="search" value="${escapeHtml(state.query)}" placeholder="Ví dụ: OTP, reuse, cameraSolver…">
        <button data-action="clear-search" type="button" aria-label="Xóa tìm kiếm">×</button>
      </div>
      <span class="finder-result">${matches ? `${matches.size} node liên quan` : 'Gõ / để tìm nhanh'}</span>
    </section>

    <section class="tree-toolbar">
      <div><span class="legend-dot coral"></span> Trục người dùng</div>
      <div><span class="legend-dot blue"></span> Frontend / API</div>
      <div><span class="legend-dot teal"></span> Dữ liệu / bằng chứng</div>
      <div class="toolbar-actions">
        <button data-action="expand-all" type="button">Mở toàn cây</button>
        <button data-action="collapse-all" type="button">Thu gọn</button>
      </div>
    </section>

    <section class="tree-shell" aria-label="Cây kiến thức FurneeHome">
      <div class="tree-root">
        ${nodeButton(root, matches)}
        ${rootExpanded ? '<span class="root-connector" aria-hidden="true"></span>' : ''}
      </div>
      ${rootExpanded
        ? `<ul class="tree-level top-level">${visibleRoots.map((node) => renderNode(node, matches)).join('')}</ul>`
        : '<p class="collapsed-note">Cây đang thu gọn. Bấm + trên FurneeHome để mở các luồng.</p>'}
    </section>

    <section class="tree-guidance">
      <strong>Cách dùng</strong>
      <span>1. Học toàn bộ</span>
      <span>2. Chọn lộ trình cá nhân</span>
      <span>3. Luyện câu giám khảo</span>
      <span>4. Tiến độ chỉ trong phiên</span>
    </section>
  `;
  bindTreeEvents();
}

function renderMemberCard(member) {
  const course = courseById(`member-${member.id}`);
  const path = member.nodeIds.map((nodeId) => nodesById.get(nodeId)?.label).filter(Boolean);

  return `
    <article class="member-card member-${escapeHtml(member.id)}">
      <header>
        <div>
          <span class="member-order">MỨC ${member.difficultyRank} · THUYẾT TRÌNH THỨ ${member.presentationOrder}</span>
          <h2>${escapeHtml(member.name)}</h2>
        </div>
        <span class="difficulty-badge">${escapeHtml(member.difficultyLabel)}</span>
      </header>
      <p class="member-focus">${escapeHtml(member.focus)}</p>

      <h3>Học sâu theo luồng</h3>
      <div class="member-path">
        ${path.map((label, index) => `
          ${index ? '<span class="path-arrow">→</span>' : ''}
          <span class="path-step">${escapeHtml(label)}</span>
        `).join('')}
      </div>

      <h3>Phần thuyết trình chính</h3>
      <ol class="presentation-list">
        ${member.presentation.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>

      <p class="handoff"><strong>Câu chuyển:</strong> ${escapeHtml(member.handoff)}</p>
      <button class="role-course-button" data-action="course" data-course-id="${escapeHtml(course.id)}" type="button">
        Học phần của ${escapeHtml(member.name)} · ${course.cardIds.length} thẻ
      </button>
    </article>
  `;
}

function renderRoles() {
  state.view = 'roles';
  state.courseId = null;
  const commonCourse = COURSES.find((course) => course.kind === 'common');
  const defenseCourse = COURSES.find((course) => course.kind === 'defense');
  const presentationOrder = [...MEMBER_PATHS]
    .sort((a, b) => a.presentationOrder - b.presentationOrder)
    .map((member) => member.name)
    .join(' → ');

  app.innerHTML = `
    <div class="roles-topbar">
      <button class="back-button" data-action="back" type="button">← Cây kiến thức</button>
      <span>Thứ tự thuyết trình: <strong>${escapeHtml(presentationOrder)}</strong></span>
    </div>

    <section class="roles-intro">
      <p class="eyebrow">LỘ TRÌNH 4 THÀNH VIÊN</p>
      <h1>Học chung trước, đào sâu theo phần phụ trách</h1>
      <p>Mức độ từ khó đến dễ: Hiệp → Phúc → Triều → Dũng. Phân công chỉ xác định phần trình bày chính; mọi người vẫn cần hiểu toàn bộ luồng.</p>
    </section>

    <section class="shared-plan">
      <div>
        <strong>Bước 1 · Nền tảng chung</strong>
        <span>${commonCourse.cardIds.length} thẻ theo toàn bộ luồng dự án</span>
      </div>
      <button data-action="course" data-course-id="${escapeHtml(commonCourse.id)}" type="button">Học chung</button>
      <div>
        <strong>Bước 2 · Luyện phản biện</strong>
        <span>${DEFENSE_QUESTION_IDS.length} câu có khả năng giám khảo hỏi</span>
      </div>
      <button data-action="course" data-course-id="${escapeHtml(defenseCourse.id)}" type="button">Luyện câu hỏi</button>
    </section>

    <section class="role-grid" aria-label="Phân công học và thuyết trình">
      ${MEMBER_PATHS.map(renderMemberCard).join('')}
    </section>
  `;
  bindRoleEvents();
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

function renderDeck() {
  const cards = activeCards();
  const card = cards[state.index];
  if (!card) return state.returnView === 'roles' ? renderRoles() : renderTree();

  const node = nodesById.get(card.nodeId);
  const course = state.courseId ? courseById(state.courseId) : null;
  const meta = questionMeta(card.id);
  const mastered = state.mastered.has(card.id);
  const title = course ? course.title : node.label;
  const backLabel = state.returnView === 'roles' ? 'Lộ trình 4 người' : 'Cây kiến thức';
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
      <button class="back-button" data-action="back" type="button">← ${backLabel}</button>
      <div class="deck-node">
        <span class="node-number">${escapeHtml(node.order)}</span>
        <span>
          <strong>${escapeHtml(title)}</strong>
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

function openNode(nodeId) {
  state.view = 'deck';
  state.returnView = 'tree';
  state.nodeId = nodeId;
  state.courseId = null;
  state.index = 0;
  resetCardFace();
  renderDeck();
}

function openCourse(courseId, returnView) {
  state.view = 'deck';
  state.returnView = returnView;
  state.nodeId = null;
  state.courseId = courseId;
  state.index = 0;
  resetCardFace();
  renderDeck();
}

function returnFromDeck() {
  if (state.returnView === 'roles') renderRoles();
  else renderTree();
}

function resetCardFace() {
  state.revealed = false;
  state.details.clear();
}

function bindCourseButtons(containerView) {
  app.querySelectorAll('[data-action="course"]').forEach((button) => {
    button.addEventListener('click', () => openCourse(button.dataset.courseId, containerView));
  });
}

function bindTreeEvents() {
  app.querySelectorAll('[data-action="node"]').forEach((button) => {
    button.addEventListener('click', () => openNode(button.dataset.nodeId));
  });
  app.querySelectorAll('[data-action="toggle"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const nodeId = button.dataset.nodeId;
      if (state.expanded.has(nodeId)) state.expanded.delete(nodeId);
      else state.expanded.add(nodeId);
      renderTree();
    });
  });

  bindCourseButtons('tree');
  app.querySelector('[data-action="roles"]')?.addEventListener('click', renderRoles);

  const finder = app.querySelector('#node-finder');
  finder?.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderTree();
    app.querySelector('#node-finder')?.focus();
  });
  app.querySelector('[data-action="clear-search"]')?.addEventListener('click', () => {
    state.query = '';
    renderTree();
  });
  app.querySelector('[data-action="expand-all"]')?.addEventListener('click', () => {
    FLOW_NODES.forEach((node) => state.expanded.add(node.id));
    renderTree();
  });
  app.querySelector('[data-action="collapse-all"]')?.addEventListener('click', () => {
    state.expanded = new Set(['project']);
    renderTree();
  });
}

function bindRoleEvents() {
  app.querySelector('[data-action="back"]')?.addEventListener('click', renderTree);
  bindCourseButtons('roles');
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
  app.querySelector('[data-action="back"]')?.addEventListener('click', returnFromDeck);
  app.querySelector('[data-action="previous"]')?.addEventListener('click', () => {
    if (state.index === 0) return;
    state.index -= 1;
    resetCardFace();
    renderDeck();
  });
  app.querySelector('[data-action="next"]')?.addEventListener('click', () => {
    if (state.index >= activeCards().length - 1) return returnFromDeck();
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
  if (state.view === 'tree' && event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    event.preventDefault();
    app.querySelector('#node-finder')?.focus();
    return;
  }
  if (state.view === 'roles' && event.key === 'Escape') {
    renderTree();
    return;
  }
  if (state.view !== 'deck') return;

  if (event.code === 'Space') {
    event.preventDefault();
    state.revealed = !state.revealed;
    if (!state.revealed) state.details.clear();
    renderDeck();
  }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click();
  if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click();
  if (event.key === 'Escape') returnFromDeck();
});

validateCurriculum();
renderTree();
