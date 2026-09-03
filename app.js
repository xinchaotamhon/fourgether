import { FLOW_NODES, FLASHCARDS } from './data/flashcards.js';

const state = { view: 'tree', nodeId: null, index: 0, flipped: false, mastered: new Set(), zoom: 1 };
const app = document.getElementById('app');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function cardsFor(nodeId) { return FLASHCARDS.filter((card) => card.node === nodeId); }
function nodeById(nodeId) { return FLOW_NODES.find((node) => node.id === nodeId); }

function renderTree() {
  state.view = 'tree';
  const learned = state.mastered.size;
  app.innerHTML = `
    <section class="map-toolbar">
      <div class="map-help"><span>BẤM MỘT NÚT ĐỂ HỌC</span><span class="legend-line solid"></span><span>LUỒNG DỰ ÁN</span><span class="legend-line dashed"></span><span>CẦN NẮM TRƯỚC</span></div>
      <div class="map-score"><strong>${learned}/${FLASHCARDS.length}</strong><span>thẻ đã thuộc trong phiên</span></div>
    </section>
    <section class="map-shell" aria-label="Cây kiến thức FurneeHome">
      <div class="map-controls"><button data-action="zoom-out" aria-label="Thu nhỏ">−</button><button data-action="zoom-in" aria-label="Phóng to">＋</button><button data-action="zoom-reset" aria-label="Đặt lại kích thước">⌗</button></div>
      <div class="map-viewport"><div class="map-canvas" style="--map-zoom:${state.zoom}">
        <button class="map-root node-card tone-coral" data-action="node" data-node-id="project">
          <span class="node-kicker">GỐC DỰ ÁN</span><h1>FurneeHome</h1><p>Thử nội thất trên ảnh phòng thật bằng AI</p><span class="node-meta">${cardsFor('project').length} thẻ · bắt đầu từ đây</span>
        </button>
        <div class="branch-line vertical"></div>
        <div class="flow-list">
          ${FLOW_NODES.slice(1).map((node, index) => {
            const previous = FLOW_NODES[index];
            return `<div class="flow-step"><div class="flow-connector"><span></span></div><button class="node-card tone-${node.tone}" data-action="node" data-node-id="${node.id}"><span class="node-kicker">LUỒNG ${node.order}</span><h2>${escapeHtml(node.label)}</h2><p>${escapeHtml(node.description)}</p><div class="node-bottom"><span>${escapeHtml(node.shortLabel)}</span><b>${cardsFor(node.id).length} thẻ</b></div></button></div>`;
          }).join('')}
        </div>
        <div class="map-end"><span>✓</span><p>Học xong một vòng<br><small>quay lại node bất kỳ để ôn lại</small></p></div>
      </div></div>
    </section>
    <section class="map-tip"><strong>Luồng học chung</strong><span>① Đi từ trái sang phải</span><span>② Tự trả lời trước khi lật thẻ</span><span>③ Không lưu tiến độ sau khi tải lại</span></section>`;
  bindTreeEvents();
}

function bindTreeEvents() {
  app.querySelectorAll('[data-action="node"]').forEach((button) => button.addEventListener('click', () => openDeck(button.dataset.nodeId)));
  app.querySelector('[data-action="zoom-in"]').addEventListener('click', () => { state.zoom = Math.min(1.22, +(state.zoom + 0.08).toFixed(2)); renderTree(); });
  app.querySelector('[data-action="zoom-out"]').addEventListener('click', () => { state.zoom = Math.max(.72, +(state.zoom - 0.08).toFixed(2)); renderTree(); });
  app.querySelector('[data-action="zoom-reset"]').addEventListener('click', () => { state.zoom = 1; renderTree(); });
}

function openDeck(nodeId) {
  state.view = 'deck'; state.nodeId = nodeId; state.index = 0; state.flipped = false; renderDeck();
}

function renderDeck() {
  const node = nodeById(state.nodeId);
  const cards = cardsFor(state.nodeId);
  const card = cards[state.index];
  if (!node || !card) { renderTree(); return; }
  const answer = escapeHtml(card.answer).replace(/\n/g, '<br>');
  const mastered = state.mastered.has(card.id);
  app.innerHTML = `
    <div class="deck-topbar"><button class="back-button" data-action="back">← Cây kiến thức</button><div class="deck-node"><span class="node-number">${node.order}</span><span><strong>${escapeHtml(node.label)}</strong><small>${escapeHtml(node.shortLabel)}</small></span></div><span class="deck-count">${state.index + 1} / ${cards.length}</span></div>
    <div class="deck-progress"><span style="width:${((state.index + 1) / cards.length) * 100}%"></span></div>
    <section class="study-layout"><div class="study-intro"><span class="eyebrow">LUỒNG ${node.order} · ${escapeHtml(node.label)}</span><h1>${state.flipped ? 'Đối chiếu câu trả lời' : 'Bạn biết câu này đến đâu?'}</h1><p>${state.flipped ? 'Đọc đáp án, chú ý tên file, dữ liệu và lý do thiết kế.' : 'Hãy nói thành tiếng trước khi lật thẻ. Mọi thành viên học cùng một luồng.'}</p><button class="keyboard-hint" data-action="flip">${state.flipped ? '↩ Xem lại câu hỏi' : 'Space · Lật thẻ'}</button></div><button class="flashcard ${state.flipped ? 'is-flipped' : ''}" data-action="flip" aria-label="${state.flipped ? 'Quay lại câu hỏi' : 'Lật xem đáp án'}"><span class="card-side-label">${state.flipped ? 'ĐÁP ÁN' : 'CÂU HỎI'}</span><span class="card-content">${state.flipped ? `<span class="answer-text">${answer}</span>` : `<span class="question-text">${escapeHtml(card.question)}</span>`}</span><span class="card-foot">${state.flipped ? 'Bấm để xem lại câu hỏi' : 'Bấm thẻ hoặc phím Space để lật'}</span></button></section>
    <div class="study-actions"><button class="nav-button" data-action="previous" ${state.index === 0 ? 'disabled' : ''}>← Câu trước</button><button class="master-button ${mastered ? 'done' : ''}" data-action="mastered">${mastered ? '✓ Đã thuộc câu này' : '☆ Đánh dấu đã thuộc'}</button><button class="nav-button" data-action="next">${state.index === cards.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} →</button></div><p class="study-note">Tiến độ chỉ tồn tại trong phiên học này. Tải lại trang sẽ bắt đầu buổi học mới.</p>`;
  bindDeckEvents();
}

function bindDeckEvents() {
  app.querySelectorAll('[data-action="flip"]').forEach((element) => element.addEventListener('click', () => { state.flipped = !state.flipped; renderDeck(); }));
  app.querySelector('[data-action="back"]').addEventListener('click', renderTree);
  app.querySelector('[data-action="previous"]').addEventListener('click', () => { if (state.index > 0) { state.index -= 1; state.flipped = false; renderDeck(); } });
  app.querySelector('[data-action="next"]').addEventListener('click', () => { if (state.index < cardsFor(state.nodeId).length - 1) { state.index += 1; state.flipped = false; renderDeck(); } else renderTree(); });
  app.querySelector('[data-action="mastered"]').addEventListener('click', () => { const card = cardsFor(state.nodeId)[state.index]; if (state.mastered.has(card.id)) state.mastered.delete(card.id); else state.mastered.add(card.id); renderDeck(); });
}

document.addEventListener('keydown', (event) => {
  if (state.view !== 'deck') return;
  if (event.code === 'Space') { event.preventDefault(); state.flipped = !state.flipped; renderDeck(); }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click();
  if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click();
  if (event.key === 'Escape') renderTree();
});

renderTree();
