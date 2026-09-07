const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const fourgetherRoot = __dirname;
const furneehomeRoot = [
  process.env.FURNEEHOME_ROOT && path.resolve(process.env.FURNEEHOME_ROOT),
  path.resolve(fourgetherRoot, '..'),
].filter(Boolean).find((root) => (
  fs.existsSync(path.join(root, 'START_HERE.md'))
  && fs.existsSync(path.join(root, 'client', 'src'))
  && fs.existsSync(path.join(root, 'server', 'src'))
));
const loadCurriculum = async () => {
  const source = fs.readFileSync(path.join(fourgetherRoot, 'data', 'flashcards.js'));
  return import(`data:text/javascript;base64,${source.toString('base64')}`);
};
const hasCycle = (items, next) => {
  const done = new Set(); const visiting = new Set();
  const visit = (item) => {
    if (visiting.has(item)) return true;
    if (done.has(item)) return false;
    visiting.add(item);
    const result = next(item).some(visit);
    visiting.delete(item); done.add(item); return result;
  };
  return items.some(visit);
};

test('Fourgether curriculum is complete and traceable', async () => {
  const {
    FLOW_NODES,
    FLASHCARDS,
    DEFENSE_QUESTIONS,
    COURSES,
  } = await loadCurriculum();
  const nodeIds = new Set(FLOW_NODES.map((node) => node.id));
  assert.equal(nodeIds.size, FLOW_NODES.length, 'node IDs must be unique');
  assert.deepEqual(FLOW_NODES.filter((node) => !node.parent).map((node) => node.id), ['project'], 'project must be the only root');
  assert.ok(FLASHCARDS.length > 0, 'curriculum must contain cards');
  const cardIds = new Set();
  for (const node of FLOW_NODES) {
    if (node.parent) assert.ok(nodeIds.has(node.parent), `${node.id} parent exists`);
    for (const prerequisite of node.prerequisiteNodeIds || []) assert.ok(nodeIds.has(prerequisite), `${node.id} prerequisite exists`);
    assert.ok(FLASHCARDS.some((card) => card.nodeId === node.id), `${node.id} has a direct card`);
  }
  assert.equal(hasCycle(FLOW_NODES.map((node) => node.id), (id) => {
    const node = FLOW_NODES.find((candidate) => candidate.id === id);
    return node.parent ? [node.parent] : [];
  }), false, 'tree parents must be acyclic');
  assert.equal(hasCycle(FLOW_NODES.map((node) => node.id), (id) => {
    const node = FLOW_NODES.find((candidate) => candidate.id === id);
    return node.prerequisiteNodeIds || [];
  }), false, 'prerequisites must be acyclic');
  for (const card of FLASHCARDS) {
    assert.ok(!cardIds.has(card.id), `unique card ${card.id}`); cardIds.add(card.id);
    assert.ok(nodeIds.has(card.nodeId), `${card.id} references a node`);
    for (const key of ['type', 'prompt', 'modelAnswer', 'explanation', 'misconception']) assert.ok(card[key], `${card.id} has ${key}`);
    assert.equal(card.status, 'verified', `${card.id} is verified`);
    assert.ok(card.transfer?.prompt && card.transfer?.answer, `${card.id} has a paired transfer`);
    assert.ok(Array.isArray(card.sourceRefs) && card.sourceRefs.length, `${card.id} has sources`);
    for (const source of card.sourceRefs) {
      assert.ok(source.path && source.symbol, `${card.id} source has path and symbol`);
      assert.equal(path.isAbsolute(source.path), false, `${card.id} source path is repository-relative`);
      if (furneehomeRoot) {
        const sourcePath = path.resolve(furneehomeRoot, source.path);
        const relativePath = path.relative(furneehomeRoot, sourcePath);
        assert.ok(relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath), `${card.id} source stays inside FurneeHome`);
        assert.ok(fs.existsSync(sourcePath), `${card.id} source path exists: ${source.path}`);
        assert.ok(fs.readFileSync(sourcePath, 'utf8').includes(source.symbol), `${card.id} source symbol exists: ${source.symbol}`);
      }
    }
  }
  assert.ok(COURSES.length, 'at least one course exists');
  for (const course of COURSES) {
    assert.ok(course.id && course.title && course.description, 'course is named and described');
    assert.ok(Array.isArray(course.cardIds) && course.cardIds.length, `${course.id} contains cards`);
    assert.equal(new Set(course.cardIds).size, course.cardIds.length, `${course.id} has no duplicate card`);
    course.cardIds.forEach((cardId) => assert.ok(cardIds.has(cardId), `${course.id} references existing card ${cardId}`));
    if (!course.nodeIds) continue;

    assert.equal(new Set(course.nodeIds).size, course.nodeIds.length, `${course.id} has no duplicate node`);
    course.nodeIds.forEach((nodeId) => assert.ok(nodeIds.has(nodeId), `${course.id} references existing node ${nodeId}`));
    const position = new Map(course.nodeIds.map((nodeId, index) => [nodeId, index]));
    for (const node of FLOW_NODES) {
      if (node.parent) assert.ok(position.get(node.parent) < position.get(node.id), `${course.id} teaches parent ${node.parent} before ${node.id}`);
      for (const prerequisite of node.prerequisiteNodeIds || []) {
        assert.ok(position.get(prerequisite) < position.get(node.id), `${course.id} teaches ${prerequisite} before ${node.id}`);
      }
    }
  }

  const commonCourse = COURSES.find((course) => course.kind === 'common');
  const supplementalIds = new Set(DEFENSE_QUESTIONS.map((card) => card.id));
  assert.ok(commonCourse, 'one common course exists');
  assert.equal(commonCourse.nodeIds.length, FLOW_NODES.length, 'common course covers every node');
  assert.equal(commonCourse.cardIds.length, FLASHCARDS.length - DEFENSE_QUESTIONS.length, 'common course contains every core card');
  commonCourse.cardIds.forEach((cardId) => assert.equal(supplementalIds.has(cardId), false, 'common course excludes supplemental examiner questions'));
});

test('Fourgether divides presentation paths and examiner questions safely', async () => {
  const {
    FLOW_NODES,
    FLASHCARDS,
    DEFENSE_QUESTIONS,
    DEFENSE_QUESTION_IDS,
    MEMBER_PATHS,
    COURSES,
  } = await loadCurriculum();
  const nodeIds = new Set(FLOW_NODES.map((node) => node.id));
  const cardsById = new Map(FLASHCARDS.map((card) => [card.id, card]));
  const commonCourse = COURSES.find((course) => course.kind === 'common');
  const commonPosition = new Map(commonCourse.nodeIds.map((nodeId, index) => [nodeId, index]));
  const supplementalIds = new Set(DEFENSE_QUESTIONS.map((card) => card.id));

  assert.deepEqual(MEMBER_PATHS.map((member) => member.name), ['Hiệp', 'Phúc', 'Triều', 'Dũng']);
  assert.deepEqual(MEMBER_PATHS.map((member) => member.difficultyRank), [1, 2, 3, 4]);
  assert.deepEqual([...MEMBER_PATHS].sort((a, b) => a.presentationOrder - b.presentationOrder).map((member) => member.name), ['Dũng', 'Triều', 'Phúc', 'Hiệp']);

  const assignedQuestions = [];
  for (const member of MEMBER_PATHS) {
    assert.ok(member.focus && member.presentation.length && member.handoff, `${member.name} has a presentation plan`);
    assert.equal(new Set(member.nodeIds).size, member.nodeIds.length, `${member.name} has no duplicate node`);
    member.nodeIds.forEach((nodeId) => assert.ok(nodeIds.has(nodeId), `${member.name} references existing node ${nodeId}`));
    member.nodeIds.slice(1).forEach((nodeId, index) => {
      assert.ok(commonPosition.get(member.nodeIds[index]) < commonPosition.get(nodeId), `${member.name} follows the common learning flow`);
    });

    const questionIds = [...member.questions.high, ...member.questions.medium];
    assert.equal(new Set(questionIds).size, questionIds.length, `${member.name} has no duplicate question`);
    questionIds.forEach((cardId) => assert.ok(cardsById.has(cardId), `${member.name} references existing question ${cardId}`));
    assignedQuestions.push(...questionIds);

    const memberCourse = COURSES.find((course) => course.memberId === member.id);
    assert.ok(memberCourse, `${member.name} has a course`);
    FLASHCARDS.filter((card) => member.nodeIds.includes(card.nodeId) && !supplementalIds.has(card.id))
      .forEach((card) => assert.ok(memberCourse.cardIds.includes(card.id), `${member.name} course contains core card ${card.id}`));
    questionIds.forEach((cardId) => assert.ok(memberCourse.cardIds.includes(cardId), `${member.name} course contains question ${cardId}`));
  }

  assert.equal(new Set(assignedQuestions).size, assignedQuestions.length, 'each examiner question has one main owner');
  assert.deepEqual(new Set(DEFENSE_QUESTION_IDS), new Set(assignedQuestions), 'defense deck matches all assigned questions');
  const defenseCourse = COURSES.find((course) => course.kind === 'defense');
  assert.deepEqual(new Set(defenseCourse.cardIds), new Set(DEFENSE_QUESTION_IDS), 'defense course contains the complete question bank');

  const memberIds = new Set(MEMBER_PATHS.map((member) => member.id));
  for (const card of DEFENSE_QUESTIONS) {
    assert.ok(memberIds.has(card.owner), `${card.id} has a known owner`);
    assert.ok(['cao', 'vừa'].includes(card.likelihood), `${card.id} has a supported likelihood`);
    assert.ok(DEFENSE_QUESTION_IDS.includes(card.id), `${card.id} appears in the defense deck`);
  }
});

test('Fourgether remains a no-storage static learning tool', () => {
  const code = ['app.js', 'data/flashcards.js', 'index.html', 'style.css'].map((file) => fs.readFileSync(path.join(fourgetherRoot, file), 'utf8')).join('\n');
  assert.doesNotMatch(code, /\b(?:localStorage|sessionStorage)\s*\./, 'Web Storage API is forbidden');
  assert.doesNotMatch(code, /\bindexedDB\s*\./, 'IndexedDB is forbidden');
  assert.doesNotMatch(code, /(?:navigator\.)?serviceWorker\s*\./, 'service worker is forbidden');
});
