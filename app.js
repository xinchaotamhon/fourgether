import { FLOW_NODES, FLASHCARDS, COURSES } from './data/flashcards.js';

// Intentionally memory-only. Reloading begins a new study session.
const state = { view: 'tree', nodeId: null, courseId: null, index: 0, revealed: false, details: new Set(), mastered: new Set(), expanded: new Set(['project', 'journey']), query: '' };
const app = document.getElementById('app');
const byId = new Map(FLOW_NODES.map((node) => [node.id, node]));
const childrenOf = (id) => FLOW_NODES.filter((node) => node.parent === id);
const cardsFor = (id) => FLASHCARDS.filter((card) => card.nodeId === id);
const courseFor = (id) => COURSES.find((course) => course.id === id);
const activeCards = () => state.courseId ? courseFor(state.courseId).nodeIds.flatMap(cardsFor) : cardsFor(state.nodeId);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function validateCurriculum() {
  const ids = new Set(FLOW_NODES.map((node) => node.id)); const cardIds = new Set(); const errors = [];
  FLOW_NODES.forEach((node) => {
    if (node.parent && !ids.has(node.parent)) errors.push(`Node ${node.id} thiếu parent`);
    (node.prerequisiteNodeIds || []).forEach((id) => { if (!ids.has(id)) errors.push(`Node ${node.id} thiếu prerequisite ${id}`); });
    if (!cardsFor(node.id).length) errors.push(`Node ${node.id} chưa có thẻ trực tiếp`);
  });
  FLASHCARDS.forEach((card) => {
    if (cardIds.has(card.id)) errors.push(`Trùng card id ${card.id}`); cardIds.add(card.id);
    if (!ids.has(card.nodeId)) errors.push(`Card ${card.id} trỏ node thiếu`);
    ['type', 'prompt', 'modelAnswer', 'explanation', 'misconception', 'status'].forEach((key) => { if (!card[key]) errors.push(`Card ${card.id} thiếu ${key}`); });
    if (!card.transfer?.prompt || !card.transfer?.answer) errors.push(`Card ${card.id} thiếu transfer`);
    if (!Array.isArray(card.sourceRefs) || !card.sourceRefs.length || card.sourceRefs.some((source) => !source.path)) errors.push(`Card ${card.id} thiếu sourceRef`);
  });
  COURSES.forEach((course) => course.nodeIds.forEach((id) => { if (!ids.has(id)) errors.push(`Course ${course.id} trỏ node thiếu ${id}`); }));
  if (errors.length) console.error('[Fourgether] Curriculum không hợp lệ:', errors);
  return errors;
}

function matchingNodeIds() {
  const query = state.query.trim().toLocaleLowerCase('vi'); if (!query) return null;
  const matches = new Set();
  FLOW_NODES.forEach((node) => {
    const haystack = [node.id, node.label, node.shortLabel, ...cardsFor(node.id).flatMap((card) => [card.prompt, card.modelAnswer, card.explanation, ...card.sourceRefs.map((source) => `${source.path} ${source.symbol || ''}`)])].join(' ').toLocaleLowerCase('vi');
    if (haystack.includes(query)) { matches.add(node.id); let parent = node.parent ? byId.get(node.parent) : null; while (parent) { matches.add(parent.id); parent = parent.parent ? byId.get(parent.parent) : null; } }
  });
  return matches;
}

function nodeButton(node, matches) {
  const children = childrenOf(node.id); const expanded = state.expanded.has(node.id); const count = cardsFor(node.id).length;
  return `<div class="tree-card-wrap ${matches?.has(node.id) ? 'is-match' : ''}"><button class="node-card tone-${escapeHtml(node.tone)}" data-action="node" data-node-id="${escapeHtml(node.id)}" aria-label="Học ${escapeHtml(node.label)}"><span class="node-top"><span class="node-kicker">${escapeHtml(node.kicker || node.order)}</span>${children.length ? `<span class="child-count">${children.length} nhánh</span>` : ''}</span><h2>${escapeHtml(node.label)}</h2><p>${escapeHtml(node.shortLabel)}</p><div class="node-bottom"><span>Học thẻ của node này</span><b>${count} thẻ</b></div></button>${children.length ? `<button class="toggle-node" data-action="toggle" data-node-id="${escapeHtml(node.id)}" aria-expanded="${expanded}" aria-label="${expanded ? 'Thu gọn' : 'Mở rộng'} ${escapeHtml(node.label)}">${expanded ? '−' : '+'}</button>` : ''}</div>`;
}

function renderNode(node, matches) {
  const children = childrenOf(node.id); const visible = matches ? children.filter((child) => matches.has(child.id)) : children; const expanded = state.expanded.has(node.id) || Boolean(state.query.trim());
  return `<li class="tree-item ${children.length ? 'has-children' : 'is-leaf'}">${nodeButton(node, matches)}${expanded && visible.length ? `<ul class="tree-level">${visible.map((child) => renderNode(child, matches)).join('')}</ul>` : ''}</li>`;
}

function renderTree() {
  state.view = 'tree'; state.courseId = null; const root = byId.get('project'); const matches = matchingNodeIds(); const rootExpanded = state.expanded.has(root.id) || Boolean(state.query.trim()); const roots = rootExpanded ? childrenOf(root.id).filter((node) => !matches || matches.has(node.id)) : [];
  app.innerHTML = `<section class="tree-heading"><div><p class="eyebrow">BẢN ĐỒ HỌC THEO LUỒNG</p><h1>Hiểu FurneeHome từ trải nghiệm đến hàm thật</h1><p class="lead">Học theo luồng để đi hết dự án, hoặc bấm node để chỉ học thẻ trực tiếp của node đó.</p></div><div class="session-score"><strong>${state.mastered.size}/${FLASHCARDS.length}</strong><span>thẻ đã thuộc<br>trong phiên này</span></div></section><section class="course-launch" aria-label="Bắt đầu course"><div><strong>${escapeHtml(COURSES[0].title)}</strong><span>${escapeHtml(COURSES[0].description)}</span></div><button data-action="course" data-course-id="${COURSES[0].id}" type="button">Học theo luồng →</button></section><section class="finder-bar" aria-label="Tìm trong cây học"><label for="node-finder">Tìm node, hàm hoặc file</label><div class="finder-input"><span aria-hidden="true">⌕</span><input id="node-finder" type="search" value="${escapeHtml(state.query)}" placeholder="Ví dụ: OTP, reuse, cameraSolver…"><button data-action="clear-search" type="button" aria-label="Xóa tìm kiếm">×</button></div><span class="finder-result">${matches ? `${matches.size} node liên quan` : 'Gõ / để tìm nhanh'}</span></section><section class="tree-toolbar"><div><span class="legend-dot coral"></span> Trục người dùng</div><div><span class="legend-dot blue"></span> Frontend / API</div><div><span class="legend-dot teal"></span> Dữ liệu / bằng chứng</div><div class="toolbar-actions"><button data-action="expand-all" type="button">Mở toàn cây</button><button data-action="collapse-all" type="button">Thu gọn</button></div></section><section class="tree-shell" aria-label="Cây kiến thức FurneeHome"><div class="tree-root">${nodeButton(root, matches)}${rootExpanded ? '<span class="root-connector" aria-hidden="true"></span>' : ''}</div>${rootExpanded ? `<ul class="tree-level top-level">${roots.map((node) => renderNode(node, matches)).join('')}</ul>` : '<p class="collapsed-note">Cây đang thu gọn. Bấm + trên FurneeHome để mở các luồng.</p>'}</section><section class="tree-guidance"><strong>Cách dùng</strong><span>1. Học theo luồng để đi đủ dự án</span><span>2. Hoặc mở node để ôn đúng chủ đề</span><span>3. Tự trả lời rồi xem đáp án</span><span>4. Tiến độ chỉ tồn tại trong phiên</span></section>`;
  bindTreeEvents();
}

function renderSources(card) { return `<div class="card-sources"><b>Bằng chứng</b>${card.sourceRefs.map((source) => `<span>${escapeHtml(source.path)}${source.symbol ? ` · ${escapeHtml(source.symbol)}` : ''}</span>`).join('')}</div>`; }
function detailButton(key, label) { return `<button class="detail-button ${state.details.has(key) ? 'is-open' : ''}" data-action="detail" data-detail="${key}" type="button">${label}</button>`; }
function renderDeck() {
  const cards = activeCards(); const card = cards[state.index]; if (!card) return renderTree(); const node = byId.get(card.nodeId); const course = state.courseId ? courseFor(state.courseId) : null; const mastered = state.mastered.has(card.id);
  const answer = state.revealed ? `<span class="answer-text">${escapeHtml(card.modelAnswer)}</span><div class="detail-actions">${detailButton('explanation', 'Vì sao')}${detailButton('misconception', 'Dễ nhầm')}${detailButton('transfer', 'Thử tình huống mới')}</div>${state.details.has('explanation') ? `<section class="card-detail"><h3>Vì sao</h3><p>${escapeHtml(card.explanation)}</p></section>` : ''}${state.details.has('misconception') ? `<section class="card-detail"><h3>Dễ nhầm</h3><p>${escapeHtml(card.misconception)}</p></section>` : ''}${state.details.has('transfer') ? `<section class="card-detail"><h3>Thử tình huống mới</h3><p>${escapeHtml(card.transfer.prompt)}</p><h3>Lời giải</h3><p>${escapeHtml(card.transfer.answer)}</p></section>` : ''}${renderSources(card)}` : `<span class="question-text">${escapeHtml(card.prompt)}</span>`;
  const title = course ? course.title : node.label;
  const flashcard = state.revealed
    ? `<section class="flashcard is-flipped"><span class="card-side-label">ĐÁP ÁN</span><div class="card-content">${answer}</div><button class="card-foot" data-action="flip" type="button">Bấm để xem lại câu hỏi</button></section>`
    : `<button class="flashcard" data-action="flip" type="button" aria-label="Xem đáp án"><span class="card-side-label">CÂU HỎI</span><div class="card-content">${answer}</div><span class="card-foot">Bấm thẻ hoặc Space để lật</span></button>`;
  app.innerHTML = `<div class="deck-topbar"><button class="back-button" data-action="back" type="button">← Cây kiến thức</button><div class="deck-node"><span class="node-number">${escapeHtml(node.order)}</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(node.label)} · ${escapeHtml(card.type)}</small></span></div><span class="deck-count">${state.index + 1} / ${cards.length}</span></div><div class="deck-progress"><span style="width:${((state.index + 1) / cards.length) * 100}%"></span></div><section class="study-layout"><div class="study-intro"><span class="eyebrow">${escapeHtml(card.type).toUpperCase()}</span><h1>${state.revealed ? 'Đối chiếu và mở rộng' : 'Bạn biết câu này đến đâu?'}</h1><p>${state.revealed ? 'Mở từng phần khi cần; câu trả lời chính vẫn ngắn và rõ.' : 'Nói câu trả lời trước rồi lật thẻ.'}</p><button class="keyboard-hint" data-action="flip" type="button">${state.revealed ? 'Space · Xem lại câu hỏi' : 'Space · Xem đáp án'}</button></div>${flashcard}</section><div class="study-actions"><button class="nav-button" data-action="previous" type="button" ${state.index === 0 ? 'disabled' : ''}>← Câu trước</button><button class="master-button ${mastered ? 'done' : ''}" data-action="mastered" type="button">${mastered ? '✓ Đã thuộc câu này' : '☆ Đánh dấu đã thuộc'}</button><button class="nav-button" data-action="next" type="button">${state.index === cards.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} →</button></div><p class="study-note">Không có localStorage, sessionStorage, IndexedDB hay service worker cho cây học. Tải lại trang sẽ mở phiên mới.</p>`;
  bindDeckEvents();
}

function openDeck(nodeId) { state.view = 'deck'; state.nodeId = nodeId; state.courseId = null; state.index = 0; state.revealed = false; state.details.clear(); renderDeck(); }
function openCourse(courseId) { state.view = 'deck'; state.courseId = courseId; state.nodeId = null; state.index = 0; state.revealed = false; state.details.clear(); renderDeck(); }
function resetFace() { state.revealed = false; state.details.clear(); }
function bindTreeEvents() {
  app.querySelectorAll('[data-action="node"]').forEach((button) => button.addEventListener('click', () => openDeck(button.dataset.nodeId)));
  app.querySelector('[data-action="course"]')?.addEventListener('click', (event) => openCourse(event.currentTarget.dataset.courseId));
  app.querySelectorAll('[data-action="toggle"]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const id = button.dataset.nodeId; state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id); renderTree(); }));
  const finder = app.querySelector('#node-finder'); finder?.addEventListener('input', (event) => { state.query = event.target.value; renderTree(); app.querySelector('#node-finder')?.focus(); });
  app.querySelector('[data-action="clear-search"]')?.addEventListener('click', () => { state.query = ''; renderTree(); });
  app.querySelector('[data-action="expand-all"]')?.addEventListener('click', () => { FLOW_NODES.forEach((node) => state.expanded.add(node.id)); renderTree(); });
  app.querySelector('[data-action="collapse-all"]')?.addEventListener('click', () => { state.expanded = new Set(['project']); renderTree(); });
}
function bindDeckEvents() {
  app.querySelectorAll('[data-action="flip"]').forEach((element) => element.addEventListener('click', () => { state.revealed = !state.revealed; if (!state.revealed) state.details.clear(); renderDeck(); }));
  app.querySelectorAll('[data-action="detail"]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const key = button.dataset.detail; state.details.has(key) ? state.details.delete(key) : state.details.add(key); renderDeck(); }));
  app.querySelector('[data-action="back"]')?.addEventListener('click', renderTree);
  app.querySelector('[data-action="previous"]')?.addEventListener('click', () => { if (state.index) { state.index -= 1; resetFace(); renderDeck(); } });
  app.querySelector('[data-action="next"]')?.addEventListener('click', () => { if (state.index < activeCards().length - 1) { state.index += 1; resetFace(); renderDeck(); } else renderTree(); });
  app.querySelector('[data-action="mastered"]')?.addEventListener('click', () => { const card = activeCards()[state.index]; state.mastered.has(card.id) ? state.mastered.delete(card.id) : state.mastered.add(card.id); renderDeck(); });
}
document.addEventListener('keydown', (event) => {
  if (state.view === 'tree' && event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); app.querySelector('#node-finder')?.focus(); return; }
  if (state.view !== 'deck') return; if (event.code === 'Space') { event.preventDefault(); state.revealed = !state.revealed; if (!state.revealed) state.details.clear(); renderDeck(); }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click(); if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click(); if (event.key === 'Escape') renderTree();
});
validateCurriculum(); renderTree();
