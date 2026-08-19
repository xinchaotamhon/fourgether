import { FLASHCARDS } from './data/flashcards.js';
import { TEAM_MEMBERS, TEAM_ROLES } from './data/teamRoles.js';

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE (ĐỘC LẬP THEO TỪNG THÀNH VIÊN + CRUD)
// ==========================================================================

const STORAGE_KEYS = {
  HAS_CHOSEN: 'fourgether_has_chosen_member',
  ACTIVE_MEMBER: 'fourgether_active_member_id',
  MASTERED_PREFIX: 'fourgether_mastered_', // fourgether_mastered_member-1
  ROLE_ASSIGNMENTS: 'fourgether_role_assignments',
  ROLE_CHECKLIST: 'fourgether_role_checklist',
  MEMBER_NAMES: 'fourgether_member_names',
  CUSTOM_CARDS: 'fourgether_custom_flashcards',
};

// Khởi tạo danh sách thẻ (Ưu tiên đọc từ LocalStorage nếu người dùng đã thêm/sửa/xóa)
function loadInitialCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...FLASHCARDS];
}

const state = {
  activeTab: 'tab-flashcards',
  activeMemberId: localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER) || 'member-1',
  currentIndex: 0,
  isFlipped: false,
  cards: loadInitialCards(),
  roleAssignments: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_ASSIGNMENTS) || '{}'),
  roleChecklist: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_CHECKLIST) || '{}'),
  memberNames: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBER_NAMES) || '{}'),
};

function saveCardsToStorage() {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(state.cards));
}

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
  flashcardStage: document.getElementById('flashcardStage'),
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
  
  // Controls
  prevCardBtn: document.getElementById('prevCardBtn'),
  nextCardBtn: document.getElementById('nextCardBtn'),
  toggleMasteredBtn: document.getElementById('toggleMasteredBtn'),
  
  // Toolbar CRUD buttons
  addCardBtn: document.getElementById('addCardBtn'),
  editCardBtn: document.getElementById('editCardBtn'),
  deleteCardBtn: document.getElementById('deleteCardBtn'),
  resetCardsBtn: document.getElementById('resetCardsBtn'),
  
  // CRUD Modal
  cardModal: document.getElementById('cardModal'),
  cardModalTitle: document.getElementById('cardModalTitle'),
  closeCardModalBtn: document.getElementById('closeCardModalBtn'),
  cancelCardModalBtn: document.getElementById('cancelCardModalBtn'),
  cardForm: document.getElementById('cardForm'),
  editCardId: document.getElementById('editCardId'),
  cardCategoryInput: document.getElementById('cardCategoryInput'),
  cardQuestionInput: document.getElementById('cardQuestionInput'),
  cardAnswerInput: document.getElementById('cardAnswerInput'),
  
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
  initTouchSwipeEvents();
  initCrudEvents();
  renderFlashcard();
  renderRoles();
  initKeyboardShortcuts();
}

// ==========================================================================
// WELCOME ONBOARDING MODAL
// ==========================================================================

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

  const hasChosen = localStorage.getItem(STORAGE_KEYS.HAS_CHOSEN);
  if (!hasChosen) {
    openWelcomeModal();
  }
}

function openWelcomeModal() {
  initWelcomeModal(); // Cập nhật lại số lượng câu hỏi mới nhất
  dom.welcomeModal.classList.add('is-open');
}

function closeWelcomeModal() {
  dom.welcomeModal.classList.remove('is-open');
  localStorage.setItem(STORAGE_KEYS.HAS_CHOSEN, 'true');
}

function selectMember(memberId) {
  state.activeMemberId = memberId;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER, memberId);
  
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
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) targetPanel.classList.add('active');
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

function updateMemberBadges() {
  TEAM_MEMBERS.forEach((m) => {
    const count = getMemberMasteredSet(m.id).size;
    const badge = document.getElementById(`badge-${m.id}`);
    if (badge) badge.textContent = `${count}/${state.cards.length}`;
  });
}

// ==========================================================================
// FLASHCARDS CORE MODULE
// ==========================================================================

function renderFlashcard() {
  const total = state.cards.length;
  dom.deckCountBadge.textContent = `${total} thẻ`;

  if (total === 0) {
    dom.cardDeckTag.textContent = '✨ Trống';
    dom.cardQuestionText.textContent = 'Chưa có câu hỏi nào. Bấm "+ Thêm câu hỏi" để bắt đầu!';
    dom.cardDeckTagBack.textContent = '✨ Trống';
    dom.cardAnswerText.innerHTML = '<p>Hãy thêm câu hỏi mới để ôn tập.</p>';
    dom.cardCounter.textContent = 'Thẻ 0 / 0';
    dom.masteryCounter.textContent = 'Đã thuộc: 0 / 0';
    dom.progressFill.style.width = '0%';
    return;
  }

  // Đảm bảo currentIndex hợp lệ
  if (state.currentIndex >= total) state.currentIndex = 0;
  if (state.currentIndex < 0) state.currentIndex = total - 1;

  const card = state.cards[state.currentIndex];
  const activeMember = TEAM_MEMBERS.find((m) => m.id === state.activeMemberId) || TEAM_MEMBERS[0];
  const memberMasteredSet = getMemberMasteredSet(state.activeMemberId);
  const isMastered = memberMasteredSet.has(card.id);

  // Update Header Name
  dom.currentUserName.textContent = activeMember.defaultName;

  // Front Face
  dom.cardDeckTag.textContent = card.category || 'Nội thất & AI';
  dom.cardQuestionText.textContent = card.question;

  // Back Face
  dom.cardDeckTagBack.textContent = card.category || 'Đáp án';
  
  const formattedAnswer = (card.answer || '')
    .split('\n\n')
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
  
  dom.cardAnswerText.innerHTML = formattedAnswer || '<p>Chưa có câu trả lời.</p>';

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

// ==========================================================================
// TOUCH SWIPE GESTURES (VUỐT ĐỂ CHUYỂN CÂU TRÊN ĐIỆN THOẠI)
// ==========================================================================

function initTouchSwipeEvents() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwiping = false;

  const stage = dom.flashcardStage;

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    isSwiping = true;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Nếu vuốt ngang dứt khoát (> 40px và theo phương ngang nhiều hơn dọc)
    if (absDeltaX > 40 && absDeltaX > absDeltaY * 1.2 && deltaTime < 600) {
      if (deltaX < 0) {
        // Vuốt sang trái -> Thẻ tiếp theo
        nextCard();
      } else {
        // Vuốt sang phải -> Thẻ trước đó
        prevCard();
      }
    } else if (absDeltaX < 12 && absDeltaY < 12) {
      // Chạm nhẹ không di chuyển -> Lật thẻ
      flipCard();
    }
  }, { passive: true });

  // Click chuột trên Desktop
  dom.flashcardElement.addEventListener('click', (e) => {
    // Tránh click kép nếu vừa vuốt
    if (Date.now() - touchStartTime < 300) return;
    flipCard();
  });

  if (dom.prevCardBtn) dom.prevCardBtn.addEventListener('click', (e) => { e.stopPropagation(); prevCard(); });
  if (dom.nextCardBtn) dom.nextCardBtn.addEventListener('click', (e) => { e.stopPropagation(); nextCard(); });
}

function initFlashcardEvents() {
  dom.toggleMasteredBtn.addEventListener('click', toggleMastered);
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'tab-flashcards') return;
    // Không bắt phím nếu đang gõ trong modal CRUD
    if (dom.cardModal.classList.contains('is-open')) return;

    if (e.code === 'Space') {
      e.preventDefault();
      flipCard();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      nextCard();
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      prevCard();
    }
  });
}

// ==========================================================================
// CRUD FLASHCARD MODULE (THÊM / SỬA / XÓA / RESET)
// ==========================================================================

function initCrudEvents() {
  // Mở modal Thêm câu hỏi
  dom.addCardBtn.addEventListener('click', () => {
    dom.cardModalTitle.textContent = '➕ Thêm câu hỏi Flashcard mới';
    dom.editCardId.value = '';
    dom.cardCategoryInput.value = '🧠 Room Studio & AI';
    dom.cardQuestionInput.value = '';
    dom.cardAnswerInput.value = '';
    openCardModal();
  });

  // Mở modal Sửa câu hỏi hiện tại
  dom.editCardBtn.addEventListener('click', () => {
    if (state.cards.length === 0) return;
    const card = state.cards[state.currentIndex];
    dom.cardModalTitle.textContent = '✏️ Chỉnh sửa câu hỏi Flashcard';
    dom.editCardId.value = card.id;
    dom.cardCategoryInput.value = card.category || '🧠 Room Studio & AI';
    dom.cardQuestionInput.value = card.question || '';
    dom.cardAnswerInput.value = card.answer || '';
    openCardModal();
  });

  // Xóa câu hỏi hiện tại
  dom.deleteCardBtn.addEventListener('click', () => {
    if (state.cards.length === 0) return;
    const card = state.cards[state.currentIndex];
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa câu hỏi này?\n\n"${card.question}"`);
    if (!confirmDelete) return;

    state.cards.splice(state.currentIndex, 1);
    saveCardsToStorage();
    if (state.currentIndex >= state.cards.length && state.cards.length > 0) {
      state.currentIndex = state.cards.length - 1;
    }
    state.isFlipped = false;
    dom.flashcardElement.classList.remove('is-flipped');
    renderFlashcard();
  });

  // Reset về 32 câu mặc định
  dom.resetCardsBtn.addEventListener('click', () => {
    const confirmReset = confirm('Bạn có muốn khôi phục lại trọn bộ 32 câu hỏi mặc định của đồ án FurneeHome không?');
    if (!confirmReset) return;

    state.cards = [...FLASHCARDS];
    saveCardsToStorage();
    state.currentIndex = 0;
    state.isFlipped = false;
    dom.flashcardElement.classList.remove('is-flipped');
    renderFlashcard();
  });

  // Đóng modal
  dom.closeCardModalBtn.addEventListener('click', closeCardModal);
  dom.cancelCardModalBtn.addEventListener('click', closeCardModal);

  // Submit Form Lưu Thẻ
  dom.cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = dom.editCardId.value;
    const category = dom.cardCategoryInput.value.trim();
    const question = dom.cardQuestionInput.value.trim();
    const answer = dom.cardAnswerInput.value.trim();

    if (!question || !answer) {
      alert('Vui lòng nhập đầy đủ câu hỏi và câu trả lời!');
      return;
    }

    if (id) {
      // Update
      const index = state.cards.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.cards[index] = { ...state.cards[index], category, question, answer };
      }
    } else {
      // Create
      const newCard = {
        id: `custom-card-${Date.now()}`,
        category,
        question,
        answer,
        fileRef: '',
      };
      state.cards.push(newCard);
      state.currentIndex = state.cards.length - 1;
    }

    saveCardsToStorage();
    closeCardModal();
    state.isFlipped = false;
    dom.flashcardElement.classList.remove('is-flipped');
    renderFlashcard();
  });
}

function openCardModal() {
  dom.cardModal.classList.add('is-open');
}

function closeCardModal() {
  dom.cardModal.classList.remove('is-open');
}

// ==========================================================================
// TEAM ROLES & CHECKLIST MODULE
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

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', init);
