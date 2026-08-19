import { FLASHCARDS } from './data/flashcards.js';
import { TEAM_MEMBERS, TEAM_ROLES } from './data/teamRoles.js';

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE (THEO TỪNG THÀNH VIÊN)
// ==========================================================================

const STORAGE_KEYS = {
  HAS_CHOSEN: 'fourgether_has_chosen_member',
  ACTIVE_MEMBER: 'fourgether_active_member_id',
  MASTERED_PREFIX: 'fourgether_mastered_', // fourgether_mastered_member-1
  ROLE_ASSIGNMENTS: 'fourgether_role_assignments',
  ROLE_CHECKLIST: 'fourgether_role_checklist',
  MEMBER_NAMES: 'fourgether_member_names',
};

const state = {
  activeTab: 'tab-flashcards',
  activeMemberId: localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER) || 'member-1',
  currentIndex: 0,
  isFlipped: false,
  cards: [...FLASHCARDS],
  roleAssignments: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_ASSIGNMENTS) || '{}'),
  roleChecklist: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_CHECKLIST) || '{}'),
  memberNames: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBER_NAMES) || '{}'),
};

// Lấy danh sách thẻ đã thuộc của từng người
function getMemberMasteredSet(memberId) {
  const raw = localStorage.getItem(`${STORAGE_KEYS.MASTERED_PREFIX}${memberId}`);
  return new Set(JSON.parse(raw || '[]'));
}

// Lưu danh sách thẻ đã thuộc của từng người
function saveMemberMasteredSet(memberId, set) {
  localStorage.setItem(`${STORAGE_KEYS.MASTERED_PREFIX}${memberId}`, JSON.stringify(Array.from(set)));
}

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================

const dom = {
  navTabs: document.querySelectorAll('.nav-tab'),
  tabPanels: document.querySelectorAll('.tab-panel'),
  deckCountBadge: document.getElementById('deckCountBadge'),
  cardCounter: document.getElementById('cardCounter'),
  masteryCounter: document.getElementById('masteryCounter'),
  progressFill: document.getElementById('progressFill'),
  flashcardElement: document.getElementById('flashcardElement'),
  memberPillsContainer: document.getElementById('memberPillsContainer'),
  currentUserName: document.getElementById('currentUserName'),
  switchUserBtn: document.getElementById('switchUserBtn'),
  welcomeModal: document.getElementById('welcomeModal'),
  modalMemberGrid: document.getElementById('modalMemberGrid'),
  
  // Card Front
  cardDeckTag: document.getElementById('cardDeckTag'),
  cardQuestionText: document.getElementById('cardQuestionText'),
  
  // Card Back
  cardDeckTagBack: document.getElementById('cardDeckTagBack'),
  cardAnswerText: document.getElementById('cardAnswerText'),
  
  // Buttons
  prevBtn: document.getElementById('prevBtn'),
  flipBtn: document.getElementById('flipBtn'),
  toggleMasteredBtn: document.getElementById('toggleMasteredBtn'),
  nextBtn: document.getElementById('nextBtn'),
  
  // Roles Tab
  rolesContainer: document.getElementById('rolesContainer'),
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function init() {
  initTabs();
  initWelcomeModal();
  initMemberBar();
  initFlashcardEvents();
  renderFlashcard();
  renderRoles();
  initKeyboardShortcuts();
}

// Modal hỏi bạn là ai khi mới vào web
function initWelcomeModal() {
  dom.modalMemberGrid.innerHTML = TEAM_MEMBERS.map((m) => {
    const masteredCount = getMemberMasteredSet(m.id).size;

    return `
      <button class="member-select-card" data-member-id="${m.id}" style="--accent-color: ${m.color}">
        <span class="member-select-icon">👤</span>
        <strong class="member-select-name">${m.defaultName}</strong>
        <small class="member-select-progress">Đã thuộc: ${masteredCount}/${state.cards.length} câu</small>
      </button>
    `;
  }).join('');

  dom.modalMemberGrid.querySelectorAll('.member-select-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectMember(btn.dataset.memberId);
      closeWelcomeModal();
    });
  });

  dom.switchUserBtn.addEventListener('click', openWelcomeModal);

  // Nếu người dùng chưa từng chọn bao giờ -> Mở Modal chào mừng
  const hasChosen = localStorage.getItem(STORAGE_KEYS.HAS_CHOSEN);
  if (!hasChosen) {
    openWelcomeModal();
  }
}

function openWelcomeModal() {
  dom.welcomeModal.classList.add('is-open');
}

function closeWelcomeModal() {
  dom.welcomeModal.classList.remove('is-open');
  localStorage.setItem(STORAGE_KEYS.HAS_CHOSEN, 'true');
}

function selectMember(memberId) {
  state.activeMemberId = memberId;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER, memberId);
  
  // Cập nhật giao diện thanh chọn người
  dom.memberPillsContainer.querySelectorAll('.member-pill').forEach((b) => {
    b.classList.toggle('active', b.dataset.memberId === memberId);
  });

  renderFlashcard();
}

// Navigation Tabs
function initTabs() {
  dom.navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.dataset.tab;
      dom.navTabs.forEach((t) => t.classList.remove('active'));
      dom.tabPanels.forEach((p) => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
      state.activeTab = targetTabId;
    });
  });
}

// Thanh chọn người học riêng biệt
function initMemberBar() {
  dom.memberPillsContainer.innerHTML = TEAM_MEMBERS.map((m) => {
    const masteredCount = getMemberMasteredSet(m.id).size;
    const isActive = m.id === state.activeMemberId;
    return `
      <button class="member-pill ${isActive ? 'active' : ''}" data-member-id="${m.id}">
        <span>${m.defaultName}</span>
        <small class="member-pill-count" id="badge-${m.id}">${masteredCount}/${state.cards.length}</small>
      </button>
    `;
  }).join('');

  dom.memberPillsContainer.querySelectorAll('.member-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectMember(btn.dataset.memberId);
    });
  });
}

// Cập nhật số thẻ đã thuộc trên badge từng thành viên
function updateMemberBadges() {
  TEAM_MEMBERS.forEach((m) => {
    const count = getMemberMasteredSet(m.id).size;
    const badge = document.getElementById(`badge-${m.id}`);
    if (badge) badge.textContent = `${count}/${state.cards.length}`;
  });
}

// ==========================================================================
// FLASHCARDS MODULE (ĐỘC LẬP THEO TỪNG THÀNH VIÊN)
// ==========================================================================

function renderFlashcard() {
  const total = state.cards.length;
  dom.deckCountBadge.textContent = `${total} thẻ`;

  if (total === 0) return;

  const card = state.cards[state.currentIndex];
  const activeMember = TEAM_MEMBERS.find((m) => m.id === state.activeMemberId) || TEAM_MEMBERS[0];
  const memberMasteredSet = getMemberMasteredSet(state.activeMemberId);
  const isMastered = memberMasteredSet.has(card.id);

  // Update Header Name
  dom.currentUserName.textContent = activeMember.defaultName;

  // Front
  dom.cardDeckTag.textContent = card.category;
  dom.cardQuestionText.textContent = card.question;

  // Back (Chỉ có đúng 1 đáp án duy nhất, rõ ràng)
  dom.cardDeckTagBack.textContent = card.category;
  
  const formattedAnswer = card.answer
    .split('\n\n')
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
  
  dom.cardAnswerText.innerHTML = formattedAnswer;

  // Counters & Progress
  dom.cardCounter.textContent = `Thẻ ${state.currentIndex + 1} / ${total}`;
  dom.masteryCounter.textContent = `${activeMember.defaultName} đã thuộc: ${memberMasteredSet.size} / ${total}`;
  dom.progressFill.style.width = `${((state.currentIndex + 1) / total) * 100}%`;

  // Mastery button cá nhân
  if (isMastered) {
    dom.toggleMasteredBtn.classList.add('mastered');
    dom.toggleMasteredBtn.textContent = `✅ ${activeMember.defaultName} đã thuộc`;
  } else {
    dom.toggleMasteredBtn.classList.remove('mastered');
    dom.toggleMasteredBtn.textContent = `⭐ Đánh dấu ${activeMember.defaultName} đã thuộc`;
  }

  updateMemberBadges();
}

function flipCard() {
  state.isFlipped = !state.isFlipped;
  dom.flashcardElement.classList.toggle('is-flipped', state.isFlipped);
}

function nextCard() {
  if (state.cards.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.cards.length;
  state.isFlipped = false;
  dom.flashcardElement.classList.remove('is-flipped');
  renderFlashcard();
}

function prevCard() {
  if (state.cards.length === 0) return;
  state.currentIndex = (state.currentIndex - 1 + state.cards.length) % state.cards.length;
  state.isFlipped = false;
  dom.flashcardElement.classList.remove('is-flipped');
  renderFlashcard();
}

// Bấm đánh dấu đã thuộc (CHỈ ẢNH HƯỞNG TỚI THÀNH VIÊN ĐANG CHỌN)
function toggleMastered() {
  if (state.cards.length === 0) return;
  const card = state.cards[state.currentIndex];
  const memberMasteredSet = getMemberMasteredSet(state.activeMemberId);

  if (memberMasteredSet.has(card.id)) {
    memberMasteredSet.delete(card.id);
  } else {
    memberMasteredSet.add(card.id);
  }

  saveMemberMasteredSet(state.activeMemberId, memberMasteredSet);
  renderFlashcard();
}

function initFlashcardEvents() {
  dom.flashcardElement.addEventListener('click', flipCard);
  dom.flipBtn.addEventListener('click', flipCard);
  dom.nextBtn.addEventListener('click', nextCard);
  dom.prevBtn.addEventListener('click', prevCard);
  dom.toggleMasteredBtn.addEventListener('click', toggleMastered);
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'tab-flashcards') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      flipCard();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      nextCard();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevCard();
    }
  });
}

// ==========================================================================
// TEAM ROLES MODULE
// ==========================================================================

function renderRoles() {
  dom.rolesContainer.innerHTML = TEAM_ROLES.map((role) => {
    const assignedId = state.roleAssignments[role.id] || role.assignedMemberId;

    return `
      <div class="role-card" style="--role-color: ${role.color};">
        <div class="role-header">
          <div>
            <h3 class="role-title">${role.title}</h3>
            <p class="role-tagline">${role.tagline}</p>
          </div>
        </div>

        <div class="member-assign-box">
          <span class="member-assign-label">Thực hiện:</span>
          <select class="member-select" data-role-id="${role.id}">
            ${TEAM_MEMBERS.map((m) => `
              <option value="${m.id}" ${m.id === assignedId ? 'selected' : ''}>
                👤 ${m.defaultName}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="role-files-box">
          <div class="detail-label">🏷️ Nhóm danh mục phụ trách:</div>
          <ul class="role-files-list">
            ${role.keyFiles.map((file) => `<li><code>${file}</code></li>`).join('')}
          </ul>
        </div>

        <div class="checklist-box">
          <div class="checklist-title">Checklist nhiệm vụ (Mỗi mục tìm 10 link Shopee):</div>
          <ul class="checklist-items">
            ${role.checklist.map((item) => {
              const isChecked = state.roleChecklist[item.id] !== undefined 
                ? state.roleChecklist[item.id] 
                : item.done;
              return `
                <li class="checklist-item ${isChecked ? 'done' : ''}">
                  <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} data-item-id="${item.id}">
                  <span>${item.text}</span>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  // Event listeners
  dom.rolesContainer.querySelectorAll('.member-select').forEach((select) => {
    select.addEventListener('change', (e) => {
      const roleId = e.target.dataset.roleId;
      state.roleAssignments[roleId] = e.target.value;
      localStorage.setItem(STORAGE_KEYS.ROLE_ASSIGNMENTS, JSON.stringify(state.roleAssignments));
    });
  });

  dom.rolesContainer.querySelectorAll('.checklist-item').forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });

  dom.rolesContainer.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const itemId = e.target.dataset.itemId;
      const isChecked = e.target.checked;
      state.roleChecklist[itemId] = isChecked;
      localStorage.setItem(STORAGE_KEYS.ROLE_CHECKLIST, JSON.stringify(state.roleChecklist));
      
      const parent = e.target.closest('.checklist-item');
      if (parent) parent.classList.toggle('done', isChecked);
    });
  });
}

function getMemberName(memberId) {
  if (state.memberNames[memberId]) return state.memberNames[memberId];
  const member = TEAM_MEMBERS.find((m) => m.id === memberId);
  return member ? member.defaultName : 'Thành viên';
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
