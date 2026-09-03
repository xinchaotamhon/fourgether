import { FLASHCARDS } from './data/flashcards.js';
import { TEAM_MEMBERS, TEAM_ROLES } from './data/teamRoles.js';

const MEMBER_META = {
  'member-1': { level: 'Khó nhất', focus: 'Hiểu toàn bộ hệ thống, AI và quyết định kiến trúc', initials: 'H' },
  'member-2': { level: 'Khó thứ 2', focus: 'Nắm backend, MongoDB và API', initials: 'P' },
  'member-3': { level: 'Khó thứ 3', focus: 'Nắm frontend React, CSS và luồng người dùng', initials: 'T' },
  'member-4': { level: 'Khó thứ 4', focus: 'Nắm dữ liệu Shopee, tools và kiểm thử', initials: 'D' },
};

const state = { view: 'tree', memberId: null, topic: null, index: 0, flipped: false, mastered: new Set() };
const app = document.getElementById('app');

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function cardsFor(memberId, topic) {
  const memberTopics = {
    'member-1': ['🏛️ Kiến trúc & Thiết kế hệ thống', '🧠 Room Studio & AI', '🎯 Vấn đáp nâng cao (Giảng viên hỏi)'],
    'member-2': ['🛠️ Backend & Database', '🎯 Vấn đáp nâng cao (Giảng viên hỏi)', '🏛️ Kiến trúc & Thiết kế hệ thống'],
    'member-3': ['🎨 Frontend React & CSS', '🧠 Room Studio & AI', '🏛️ Kiến trúc & Thiết kế hệ thống'],
    'member-4': ['📦 Tools & Khởi động', '🏛️ Kiến trúc & Thiết kế hệ thống', '🎯 Vấn đáp nâng cao (Giảng viên hỏi)'],
  };
  const categories = topic ? [topic] : (memberTopics[memberId] || []);
  return FLASHCARDS.filter((card) => categories.includes(card.category));
}

function memberById(id) { return TEAM_MEMBERS.find((member) => member.id === id) || TEAM_MEMBERS[0]; }
function roleByMember(id) { return TEAM_ROLES.find((role) => role.assignedMemberId === id); }

function renderTree() {
  state.view = 'tree';
  const total = FLASHCARDS.length;
  app.innerHTML = `
    <section class="hero-block">
      <span class="eyebrow">BẢN ĐỒ ÔN TẬP · ${total} FLASHCARD</span>
      <h1>Chọn một nhánh để bắt đầu học</h1>
      <p>Cây này đi từ <strong>dự án chung</strong> đến phần mỗi bạn phụ trách. Bấm vào tên thành viên hoặc chủ đề; câu hỏi sẽ mở ngay, không cần tài khoản và không lưu trạng thái sau khi tải lại.</p>
    </section>
    <section class="knowledge-tree" aria-label="Cây kiến thức FurneeHome">
      <div class="tree-root"><span class="root-icon">⌂</span><div><strong>FurneeHome</strong><small>AI xem trước nội thất trên ảnh phòng thật</small></div><span class="root-count">${total} câu chung</span></div>
      <div class="tree-connector" aria-hidden="true"></div>
      <div class="tree-members">
        ${TEAM_MEMBERS.map((member) => {
          const meta = MEMBER_META[member.id];
          const role = roleByMember(member.id);
          const memberCards = cardsFor(member.id);
          return `<article class="member-node" style="--member-color:${member.color}">
            <button class="member-node-button" data-action="member" data-member-id="${member.id}" aria-label="Học phần của ${member.defaultName}">
              <span class="member-avatar">${meta.initials}</span><span class="member-node-copy"><strong>${member.defaultName}</strong><small>${meta.level}</small></span><span class="node-arrow">→</span>
            </button>
            <p class="member-focus">${meta.focus}</p>
            <div class="topic-list">
              ${[...new Set(memberCards.map((card) => card.category))].map((category) => {
                const count = FLASHCARDS.filter((card) => card.category === category).length;
                return `<button class="topic-node" data-action="topic" data-member-id="${member.id}" data-topic="${escapeHtml(category)}"><span class="topic-dot"></span><span>${escapeHtml(category)}</span><b>${count}</b></button>`;
              }).join('')}
            </div>
            <div class="role-hint"><span>Vai trò</span>${escapeHtml(role?.tagline || '')}</div>
          </article>`;
        }).join('')}
      </div>
    </section>
    <section class="how-to"><strong>Luồng học 3 bước</strong><span>① Chọn nhánh</span><span>② Tự trả lời</span><span>③ Lật thẻ để đối chiếu rồi đánh dấu đã thuộc</span></section>`;
  bindTreeEvents();
}

function bindTreeEvents() {
  app.querySelectorAll('[data-action="member"]').forEach((button) => button.addEventListener('click', () => openDeck(button.dataset.memberId)));
  app.querySelectorAll('[data-action="topic"]').forEach((button) => button.addEventListener('click', () => openDeck(button.dataset.memberId, button.dataset.topic)));
}

function openDeck(memberId, topic = null) {
  state.view = 'deck'; state.memberId = memberId; state.topic = topic; state.index = 0; state.flipped = false; state.mastered = new Set(); renderDeck();
}

function currentCards() { return cardsFor(state.memberId, state.topic); }

function renderDeck() {
  const cards = currentCards();
  const member = memberById(state.memberId);
  const card = cards[state.index];
  if (!card) { renderTree(); return; }
  const mastered = state.mastered.has(card.id);
  const answer = escapeHtml(card.answer).replace(/\n/g, '<br>');
  const topicLabel = state.topic ? escapeHtml(state.topic) : 'Tất cả phần của ' + escapeHtml(member.defaultName);
  app.innerHTML = `
    <div class="deck-topbar"><button class="back-button" data-action="back">← Cây kiến thức</button><div class="deck-person"><span class="member-avatar" style="--member-color:${member.color}">${MEMBER_META[member.id].initials}</span><span>Đang học: <strong>${member.defaultName}</strong><small>${topicLabel}</small></span></div><span class="deck-count">${state.index + 1} / ${cards.length}</span></div>
    <div class="deck-progress"><span style="width:${((state.index + 1) / cards.length) * 100}%"></span></div>
    <section class="study-layout">
      <div class="study-intro"><span class="eyebrow">${escapeHtml(card.category)}</span><h1>${state.flipped ? 'Đối chiếu câu trả lời' : 'Bạn biết câu này đến đâu?'}</h1><p>${state.flipped ? 'Đọc đáp án, chú ý vị trí file và lý do thiết kế.' : 'Hãy nói thành tiếng trước khi lật thẻ. Một câu trả lời tốt cần có file, hàm và mục đích.'}</p><button class="keyboard-hint" data-action="flip">${state.flipped ? '↩ Xem lại câu hỏi' : 'Space · Lật thẻ'}</button></div>
      <button class="flashcard ${state.flipped ? 'is-flipped' : ''}" data-action="flip" aria-label="${state.flipped ? 'Quay lại câu hỏi' : 'Lật xem đáp án'}">
        <span class="card-side-label">${state.flipped ? 'ĐÁP ÁN' : 'CÂU HỎI'}</span><span class="card-content">${state.flipped ? `<span class="answer-text">${answer}</span>` : `<span class="question-text">${escapeHtml(card.question)}</span>`}</span><span class="card-foot">${state.flipped ? 'Bấm để xem lại câu hỏi' : 'Bấm thẻ hoặc phím Space để lật'}</span>
      </button>
    </section>
    <div class="study-actions"><button class="nav-button" data-action="previous" ${state.index === 0 ? 'disabled' : ''}>← Câu trước</button><button class="master-button ${mastered ? 'done' : ''}" data-action="mastered">${mastered ? '✓ Đã thuộc câu này' : '☆ Đánh dấu đã thuộc'}</button><button class="nav-button" data-action="next">${state.index === cards.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} →</button></div>
    <p class="study-note">Tiến độ chỉ tồn tại trong phiên học hiện tại. Tải lại trang sẽ mở một buổi học mới.</p>`;
  bindDeckEvents();
}

function bindDeckEvents() {
  app.querySelectorAll('[data-action="flip"]').forEach((element) => element.addEventListener('click', () => { state.flipped = !state.flipped; renderDeck(); }));
  app.querySelector('[data-action="back"]').addEventListener('click', renderTree);
  app.querySelector('[data-action="previous"]').addEventListener('click', () => { if (state.index > 0) { state.index -= 1; state.flipped = false; renderDeck(); } });
  app.querySelector('[data-action="next"]').addEventListener('click', () => { if (state.index < currentCards().length - 1) { state.index += 1; state.flipped = false; renderDeck(); } else renderTree(); });
  app.querySelector('[data-action="mastered"]').addEventListener('click', () => { const card = currentCards()[state.index]; if (state.mastered.has(card.id)) state.mastered.delete(card.id); else state.mastered.add(card.id); renderDeck(); });
}

document.addEventListener('keydown', (event) => {
  if (state.view !== 'deck') return;
  if (event.code === 'Space') { event.preventDefault(); state.flipped = !state.flipped; renderDeck(); }
  if (event.key === 'ArrowRight') app.querySelector('[data-action="next"]')?.click();
  if (event.key === 'ArrowLeft') app.querySelector('[data-action="previous"]')?.click();
  if (event.key === 'Escape') renderTree();
});

renderTree();
