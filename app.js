import { FLOW_NODES, FLASHCARDS } from './data/flashcards.js';

// Viewer state is intentionally in memory only. Reloading starts a clean study session.
const state = {
  view: 'tree',
  nodeId: null,
  index: 0,
  flipped: false,
  mastered: new Set(),
  expanded: new Set(['project', 'journey']),
  query: '',
};

const app = document.getElementById('app');
const byId = new Map(FLOW_NODES.map((node) => [node.id, node]));
const childrenOf = (id) => FLOW_NODES.filter((node) => node.parent === id);

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function descendantIds(id) {
  return childrenOf(id).flatMap((child) => [child.id, ...descendantIds(child.id)]);
}

function cardsFor(id) {
  const ids = new Set([id, ...descendantIds(id)]);
  return FLASHCARDS.filter((card) => ids.has(card.node));
}

function validateTree() {
  const ids = new Set(FLOW_NODES.map((node) => node.id));
  const seenCards = new Set();
  const errors = [];
  FLOW_NODES.forEach((node) => {
    if (node.parent && !ids.has(node.parent)) errors.push(`Node ${node.id} thiếu parent ${node.parent}`);
  });
  FLASHCARDS.forEach((card) => {
    if (!ids.has(card.node)) errors.push(`Thẻ ${card.id} trỏ tới node không tồn tại: ${card.node}`);
    if (seenCards.has(card.id)) errors.push(`Trùng id thẻ: ${card.id}`);
    seenCards.add(card.id);
  });
  FLOW_NODES.forEach((node) => {
    const trail = new Set(); let current = node;
    while (current) {
      if (trail.has(current.id)) errors.push(`Chu trình parent tại ${node.id}`);
      trail.add(current.id); current = current.parent ? byId.get(current.parent) : null;
    }
  });
  if (errors.length) console.error('[Fourgether] Cấu trúc cây không hợp lệ:', errors);
  return errors;
}

function matchingNodeIds() {
  const query = state.query.trim().toLocaleLowerCase('vi');
  if (!query) return null;
  const matches = new Set();
  FLOW_NODES.forEach((node) => {
    const haystack = [node.id, node.label, node.shortLabel, node.description, ...cardsFor(node.id).map((card) => `${card.question} ${card.answer} ${card.source}`)].join(' ').toLocaleLowerCase('vi');
    if (haystack.includes(query)) {
      matches.add(node.id);
      let parent = node.parent ? byId.get(node.parent) : null;
      while (parent) { matches.add(parent.id); parent = parent.parent ? byId.get(parent.parent) : null; }
    }
  });
  return matches;
}

function nodeButton(node, matchingIds) {
  const children = childrenOf(node.id);
  const expanded = state.expanded.has(node.id);
  const matches = matchingIds?.has(node.id);
  const count = cardsFor(node.id).length;
  return `<div class="tree-card-wrap ${matches ? 'is-match' : ''}">
    <button class="node-card tone-${escapeHtml(node.tone)}" data-action="node" data-node-id="${escapeHtml(node.id)}" aria-label="Học ${escapeHtml(node.label)}">
      <span class="node-top"><span class="node-kicker">${escapeHtml(node.kicker || node.order)}</span>${children.length ? `<span class="child-count">${children.length} nhánh</span>` : ''}</span>
      <h2>${escapeHtml(node.label)}</h2><p>${escapeHtml(node.shortLabel)}</p>
      <div class="node-bottom"><span>${escapeHtml(node.description)}</span><b>${count} thẻ</b></div>
    </button>
    ${children.length ? `<button class="toggle-node" data-action="toggle" data-node-id="${escapeHtml(node.id)}" aria-expanded="${expanded}" aria-label="${expanded ? 'Thu gọn' : 'Mở rộng'} ${escapeHtml(node.label)}">${expanded ? '−' : '+'}</button>` : ''}
  </div>`;
}

function renderNode(node, matchingIds) {
  const children = childrenOf(node.id);
  const visibleChildren = matchingIds ? children.filter((child) => matchingIds.has(child.id)) : children;
  const expanded = state.expanded.has(node.id) || Boolean(state.query.trim());
  return `<li class="tree-item ${children.length ? 'has-children' : 'is-leaf'}">${nodeButton(node, matchingIds)}${expanded && visibleChildren.length ? `<ul class="tree-level">${visibleChildren.map((child) => renderNode(child, matchingIds)).join('')}</ul>` : ''}</li>`;
}

function renderTree() {
  state.view = 'tree';
  const root = byId.get('project');
  const matchingIds = matchingNodeIds();
  const rootExpanded = state.expanded.has(root.id) || Boolean(state.query.trim());
  const roots = rootExpanded ? childrenOf(root.id).filter((node) => !matchingIds || matchingIds.has(node.id)) : [];
  const learned = state.mastered.size;
  const visibleCount = matchingIds ? roots.reduce((total, node) => total + (matchingIds.has(node.id) ? 1 : 0), 0) : FLOW_NODES.length - 1;
  app.innerHTML = `<section class="tree-heading">
    <div><p class="eyebrow">BẢN ĐỒ HỌC THEO LUỒNG</p><h1>Hiểu FurneeHome từ trải nghiệm đến hàm thật</h1><p class="lead">Mở một nhánh để xem cấu trúc. Bấm vào thẻ để học; nút <span class="inline-key">+</span> chỉ mở rộng cây.</p></div>
    <div class="session-score"><strong>${learned}/${FLASHCARDS.length}</strong><span>thẻ đã thuộc<br>trong phiên này</span></div>
  </section>
  <section class="finder-bar" aria-label="Tìm trong cây học"><label for="node-finder">Tìm node, hàm hoặc file</label><div class="finder-input"><span aria-hidden="true">⌕</span><input id="node-finder" type="search" value="${escapeHtml(state.query)}" placeholder="Ví dụ: reuse, RoomStudioPage, MongoDB…"><button data-action="clear-search" type="button" aria-label="Xóa tìm kiếm">×</button></div><span class="finder-result">${matchingIds ? (matchingIds.size ? `${matchingIds.size} node liên quan` : 'Không tìm thấy node') : 'Gõ / để tìm nhanh'}</span></section>
  <section class="tree-toolbar"><div><span class="legend-dot coral"></span> Trục người dùng</div><div><span class="legend-dot blue"></span> Frontend / API</div><div><span class="legend-dot teal"></span> Dữ liệu / bằng chứng</div><div class="toolbar-actions"><button data-action="expand-all" type="button">Mở toàn cây</button><button data-action="collapse-all" type="button">Thu gọn</button></div></section>
  <section class="tree-shell" aria-label="Cây kiến thức FurneeHome"><div class="tree-root">${nodeButton(root, matchingIds)}${rootExpanded ? '<span class="root-connector" aria-hidden="true"></span>' : ''}</div>${rootExpanded ? `<ul class="tree-level top-level">${roots.map((node) => renderNode(node, matchingIds)).join('')}</ul>` : '<p class="collapsed-note">Cây đang thu gọn. Bấm + trên FurneeHome để mở các luồng.</p>'}${matchingIds && !roots.length ? '<p class="empty-state">Không có node phù hợp. Hãy thử tên hàm, route hoặc file.</p>' : ''}</section>
  <section class="tree-guidance"><strong>Cách dùng</strong><span>1. Đọc nhánh Luồng người dùng trước</span><span>2. Mở chi tiết implementation khi cần</span><span>3. Nói câu trả lời rồi lật thẻ</span><span>4. Tiến độ chỉ tồn tại trong phiên</span></section>`;
  bindTreeEvents();
}

function renderFacts(card) {
  if (!card.facts?.length) return '';
  return `<dl class="answer-facts">${card.facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
}

function renderDeck() {
  const node = byId.get(state.nodeId); const cards = cardsFor(state.nodeId); const card = cards[state.index];
  if (!node || !card) return renderTree();
  const mastered = state.mastered.has(card.id);
  app.innerHTML = `<div class="deck-topbar"><button class="back-button" data-action="back" type="button">← Cây kiến thức</button><div class="deck-node"><span class="node-number">${escapeHtml(node.order)}</span><span><strong>${escapeHtml(node.label)}</strong><small>${escapeHtml(node.shortLabel)}</small></span></div><span class="deck-count">${state.index + 1} / ${cards.length}</span></div><div class="deck-progress"><span style="width:${((state.index + 1) / cards.length) * 100}%"></span></div><section class="study-layout"><div class="study-intro"><span class="eyebrow">${escapeHtml(node.kicker || node.order)}</span><h1>${state.flipped ? 'Đối chiếu với source' : 'Bạn biết câu này đến đâu?'}</h1><p>${state.flipped ? 'Đọc input → process → output, tên hàm và lỗi. Đây là phần dùng để bảo vệ.' : `${escapeHtml(node.lesson || 'Hãy nói thành tiếng trước khi lật thẻ.')}`}</p><button class="keyboard-hint" data-action="flip" type="button">${state.flipped ? '↩ Xem lại câu hỏi' : 'Space · Lật thẻ'}</button></div><button class="flashcard ${state.flipped ? 'is-flipped' : ''}" data-action="flip" type="button" aria-label="${state.flipped ? 'Quay lại câu hỏi' : 'Lật xem đáp án'}"><span class="card-side-label">${state.flipped ? 'ĐÁP ÁN / BẰNG CHỨNG' : 'CÂU HỎI'}</span><span class="card-content">${state.flipped ? `<span class="answer-text">${escapeHtml(card.answer)}</span>${renderFacts(card)}${card.source ? `<span class="card-source"><b>Source</b> ${escapeHtml(card.source)}</span>` : ''}` : `<span class="question-text">${escapeHtml(card.question)}</span>`}</span><span class="card-foot">${state.flipped ? 'Bấm để xem lại câu hỏi' : 'Bấm thẻ hoặc phím Space để lật'}</span></button></section><div class="study-actions"><button class="nav-button" data-action="previous" type="button" ${state.index === 0 ? 'disabled' : ''}>← Câu trước</button><button class="master-button ${mastered ? 'done' : ''}" data-action="mastered" type="button">${mastered ? '✓ Đã thuộc câu này' : '☆ Đánh dấu đã thuộc'}</button><button class="nav-button" data-action="next" type="button">${state.index === cards.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} →</button></div><p class="study-note">Không có localStorage, sessionStorage, IndexedDB hay service worker cho cây học. Tải lại trang sẽ mở phiên mới.</p>`;
  bindDeckEvents();
}

function openDeck(nodeId) { state.view = 'deck'; state.nodeId = nodeId; state.index = 0; state.flipped = false; renderDeck(); }

function bindTreeEvents() {
  app.querySelectorAll('[data-action="node"]').forEach((button) => button.addEventListener('click', () => openDeck(button.dataset.nodeId)));
  app.querySelectorAll('[data-action="toggle"]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const id = button.dataset.nodeId; if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id); renderTree(); }));
  const finder = app.querySelector('#node-finder');
  finder?.addEventListener('input', (event) => { state.query = event.target.value; renderTree(); app.querySelector('#node-finder')?.focus(); });
  app.querySelector('[data-action="clear-search"]')?.addEventListener('click', () => { state.query = ''; renderTree(); app.querySelector('#node-finder')?.focus(); });
  app.querySelector('[data-action="expand-all"]')?.addEventListener('click', () => { FLOW_NODES.forEach((node) => state.expanded.add(node.id)); renderTree(); });
  app.querySelector('[data-action="collapse-all"]')?.addEventListener('click', () => { state.expanded = new Set(['project']); renderTree(); });
}

function bindDeckEvents() {
  app.querySelectorAll('[data-action="flip"]').forEach((element) => element.addEventListener('click', () => { state.flipped = !state.flipped; renderDeck(); }));
  app.querySelector('[data-action="back"]')?.addEventListener('click', renderTree);
  app.querySelector('[data-action="previous"]')?.addEventListener('click', () => { if (state.index > 0) { state.index -= 1; state.flipped = false; renderDeck(); } });
  app.querySelector('[data-action="next"]')?.addEventListener('click', () => { if (state.index < cardsFor(state.nodeId).length - 1) { state.index += 1; state.flipped = false; renderDeck(); } else renderTree(); });
  app.querySelector('[data-action="mastered"]')?.addEventListener('click', () => { const card = cardsFor(state.nodeId)[state.index]; if (state.mastered.has(card.id)) state.mastered.delete(card.id); else state.mastered.add(card.id); renderDeck(); });
}

document.addEventListener('keydown', (event) => {
  if (state.view === 'tree' && event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); app.querySelector('#node-finder')?.focus(); return; }
  if (state.view !== 'deck') return;
  if (event.code === 'Space') { event.preventDefault(); state.flipped = !state.flipped; renderDeck(); }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click();
  if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click();
  if (event.key === 'Escape') renderTree();
});

validateTree();
renderTree();
