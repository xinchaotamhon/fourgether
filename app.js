import { FLASHCARD_DECKS, FLASHCARDS } from './data/flashcards.js';
import { TEAM_MEMBERS, TEAM_ROLES } from './data/teamRoles.js';

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================

const STORAGE_KEYS = {
  THEME: 'fourgether_theme',
  MASTERED_CARDS: 'fourgether_mastered_cards',
  ROLE_ASSIGNMENTS: 'fourgether_role_assignments',
  ROLE_CHECKLIST: 'fourgether_role_checklist',
  MEMBER_NAMES: 'fourgether_member_names',
};

const state = {
  activeTab: 'tab-flashcards',
  currentDeckId: 'all',
  searchQuery: '',
  currentIndex: 0,
  isFlipped: false,
  cards: [...FLASHCARDS],
  masteredCardIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.MASTERED_CARDS) || '[]')),
  roleAssignments: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_ASSIGNMENTS) || '{}'),
  roleChecklist: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLE_CHECKLIST) || '{}'),
  memberNames: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBER_NAMES) || '{}'),
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================

const dom = {
  navTabs: document.querySelectorAll('.nav-tab'),
  tabPanels: document.querySelectorAll('.tab-panel'),
  deckFilterContainer: document.getElementById('deckFilterContainer'),
  searchInput: document.getElementById('searchInput'),
  deckCountBadge: document.getElementById('deckCountBadge'),
  cardCounter: document.getElementById('cardCounter'),
  masteryCounter: document.getElementById('masteryCounter'),
  progressFill: document.getElementById('progressFill'),
  flashcardElement: document.getElementById('flashcardElement'),
  
  // Card Front
  cardDeckTag: document.getElementById('cardDeckTag'),
  cardQuestionText: document.getElementById('cardQuestionText'),
  
  // Card Back
  cardDeckTagBack: document.getElementById('cardDeckTagBack'),
  cardDifficulty: document.getElementById('cardDifficulty'),
  cardSummary: document.getElementById('cardSummary'),
  cardSourceLocation: document.getElementById('cardSourceLocation'),
  cardWhatIfRemoved: document.getElementById('cardWhatIfRemoved'),
  cardHowToExtend: document.getElementById('cardHowToExtend'),
  cardKeyPoints: document.getElementById('cardKeyPoints'),
  
  // Buttons
  prevBtn: document.getElementById('prevBtn'),
  flipBtn: document.getElementById('flipBtn'),
  shuffleBtn: document.getElementById('shuffleBtn'),
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
  initDeckFilters();
  initFlashcardEvents();
  renderFlashcard();
  renderRoles();
  initKeyboardShortcuts();
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

// ==========================================================================
// FLASHCARDS MODULE
// ==========================================================================

function initDeckFilters() {
  const allDecks = [{ id: 'all', name: '✨ Tất cả câu hỏi', color: '#6366f1' }, ...FLASHCARD_DECKS];
  
  dom.deckFilterContainer.innerHTML = allDecks.map((deck) => `
    <button class="deck-pill ${state.currentDeckId === deck.id ? 'active' : ''}" data-deck="${deck.id}">
      ${deck.name}
    </button>
  `).join('');

  dom.deckFilterContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.deck-pill');
    if (!pill) return;
    state.currentDeckId = pill.dataset.deck;
    document.querySelectorAll('.deck-pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    filterCards();
  });

  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    filterCards();
  });
}

function filterCards() {
  let filtered = [...FLASHCARDS];

  if (state.currentDeckId !== 'all') {
    filtered = filtered.filter((c) => c.deckId === state.currentDeckId);
  }

  if (state.searchQuery) {
    filtered = filtered.filter((c) => 
      c.question.toLowerCase().includes(state.searchQuery) ||
      c.answer.summary.toLowerCase().includes(state.searchQuery) ||
      c.answer.sourceLocation.toLowerCase().includes(state.searchQuery)
    );
  }

  state.cards = filtered;
  state.currentIndex = 0;
  state.isFlipped = false;
  dom.flashcardElement.classList.remove('is-flipped');
  renderFlashcard();
}

function renderFlashcard() {
  const total = state.cards.length;
  dom.deckCountBadge.textContent = `${FLASHCARDS.length} thẻ`;

  if (total === 0) {
    dom.cardQuestionText.textContent = 'Không tìm thấy câu hỏi nào phù hợp với từ khóa.';
    dom.cardDeckTag.textContent = '🔍 Trống';
    dom.cardCounter.textContent = '0 / 0';
    dom.progressFill.style.width = '0%';
    return;
  }

  const card = state.cards[state.currentIndex];
  const deck = FLASHCARD_DECKS.find((d) => d.id === card.deckId);
  const isMastered = state.masteredCardIds.has(card.id);

  // Front
  dom.cardDeckTag.textContent = deck ? deck.name : 'Chung';
  dom.cardDeckTag.style.borderColor = deck ? deck.color : '#6366f1';
  dom.cardQuestionText.textContent = card.question;

  // Back
  dom.cardDeckTagBack.textContent = deck ? deck.name : 'Chung';
  dom.cardDifficulty.textContent = `Độ khó: ${card.answer.difficulty}`;
  dom.cardSummary.textContent = card.answer.summary;
  dom.cardSourceLocation.textContent = card.answer.sourceLocation;
  dom.cardWhatIfRemoved.textContent = card.answer.whatIfRemoved;
  dom.cardHowToExtend.textContent = card.answer.howToExtend;

  dom.cardKeyPoints.innerHTML = card.answer.keyPoints.map((point) => `
    <li>${point}</li>
  `).join('');

  // Counters & Progress
  dom.cardCounter.textContent = `Thẻ ${state.currentIndex + 1} / ${total}`;
  const masteredCount = Array.from(state.masteredCardIds).filter((id) => FLASHCARDS.some((c) => c.id === id)).length;
  const pct = Math.round((masteredCount / FLASHCARDS.length) * 100);
  dom.masteryCounter.textContent = `Đã thuộc: ${masteredCount} / ${FLASHCARDS.length} (${pct}%)`;
  dom.progressFill.style.width = `${((state.currentIndex + 1) / total) * 100}%`;

  // Mastery button
  if (isMastered) {
    dom.toggleMasteredBtn.classList.add('mastered');
    dom.toggleMasteredBtn.textContent = '✅ Đã thuộc bài';
  } else {
    dom.toggleMasteredBtn.classList.remove('mastered');
    dom.toggleMasteredBtn.textContent = '⭐ Đánh dấu đã thuộc';
  }
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

function shuffleCards() {
  state.cards.sort(() => Math.random() - 0.5);
  state.currentIndex = 0;
  state.isFlipped = false;
  dom.flashcardElement.classList.remove('is-flipped');
  renderFlashcard();
}

function toggleMastered() {
  if (state.cards.length === 0) return;
  const card = state.cards[state.currentIndex];
  if (state.masteredCardIds.has(card.id)) {
    state.masteredCardIds.delete(card.id);
  } else {
    state.masteredCardIds.add(card.id);
  }
  localStorage.setItem(STORAGE_KEYS.MASTERED_CARDS, JSON.stringify(Array.from(state.masteredCardIds)));
  renderFlashcard();
}

function initFlashcardEvents() {
  dom.flashcardElement.addEventListener('click', flipCard);
  dom.flipBtn.addEventListener('click', flipCard);
  dom.nextBtn.addEventListener('click', nextCard);
  dom.prevBtn.addEventListener('click', prevCard);
  dom.shuffleBtn.addEventListener('click', shuffleCards);
  dom.toggleMasteredBtn.addEventListener('click', toggleMastered);
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'tab-flashcards') return;
    if (e.target.tagName === 'INPUT') return;

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
    const memberName = getMemberName(assignedId);

    return `
      <div class="role-card" style="--role-color: ${role.color};">
        <div class="role-header">
          <div>
            <h3 class="role-title">${role.title}</h3>
            <p class="role-tagline">${role.tagline}</p>
          </div>
        </div>

        <div class="member-assign-box">
          <span class="member-assign-label">Phụ trách:</span>
          <select class="member-select" data-role-id="${role.id}">
            ${TEAM_MEMBERS.map((m) => `
              <option value="${m.id}" ${m.id === assignedId ? 'selected' : ''}>
                👤 ${getMemberName(m.id)} (${m.label})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="role-files-box">
          <div class="detail-label">📂 Các file phụ trách chính:</div>
          <ul class="role-files-list">
            ${role.keyFiles.map((file) => `<li><code>${file}</code></li>`).join('')}
          </ul>
        </div>

        <div class="checklist-box">
          <div class="checklist-title">Checklist nhiệm vụ:</div>
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

  // Attach event listeners for role assignments & checkboxes
  dom.rolesContainer.querySelectorAll('.member-select').forEach((select) => {
    select.addEventListener('change', (e) => {
      const roleId = e.target.dataset.roleId;
      state.roleAssignments[roleId] = e.target.value;
      localStorage.setItem(STORAGE_KEYS.ROLE_ASSIGNMENTS, JSON.stringify(state.roleAssignments));
    });
  });

  dom.rolesContainer.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const itemId = e.target.dataset.itemId;
      const isChecked = e.target.checked;
      state.roleChecklist[itemId] = isChecked;
      localStorage.setItem(STORAGE_KEYS.ROLE_CHECKLIST, JSON.stringify(state.roleChecklist));
      
      const parent = e.target.closest('.checklist-item');
      parent.classList.toggle('done', isChecked);
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
