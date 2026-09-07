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
  const { FLOW_NODES, FLASHCARDS, COURSES } = await loadCurriculum();
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
        assert.ok(fs.existsSync(sourcePath), `${card.id} source path exists: ${source.path}`);
        assert.ok(fs.readFileSync(sourcePath, 'utf8').includes(source.symbol), `${card.id} source symbol exists: ${source.symbol}`);
      }
    }
  }
  assert.ok(COURSES.length, 'at least one course exists');
  for (const course of COURSES) {
    assert.ok(course.id && course.title && course.nodeIds.length, 'course is named and non-empty');
    assert.equal(new Set(course.nodeIds).size, course.nodeIds.length, `${course.id} has no duplicate node`);
    course.nodeIds.forEach((nodeId) => assert.ok(nodeIds.has(nodeId), `${course.id} references existing node ${nodeId}`));
    assert.equal(course.nodeIds.length, FLOW_NODES.length, `${course.id} covers every node`);
    const position = new Map(course.nodeIds.map((nodeId, index) => [nodeId, index]));
    for (const node of FLOW_NODES) {
      for (const prerequisite of node.prerequisiteNodeIds || []) {
        assert.ok(position.get(prerequisite) < position.get(node.id), `${course.id} teaches ${prerequisite} before ${node.id}`);
      }
    }
  }
});

test('Fourgether remains a no-storage static learning tool', () => {
  const code = ['app.js', 'data/flashcards.js', 'index.html', 'style.css'].map((file) => fs.readFileSync(path.join(fourgetherRoot, file), 'utf8')).join('\n');
  assert.doesNotMatch(code, /\b(?:localStorage|sessionStorage)\s*\./, 'Web Storage API is forbidden');
  assert.doesNotMatch(code, /\bindexedDB\s*\./, 'IndexedDB is forbidden');
  assert.doesNotMatch(code, /(?:navigator\.)?serviceWorker\s*\./, 'service worker is forbidden');
  assert.doesNotMatch(code, /teamRoles/, 'member-assignment data must not return to the shared learning tool');
});
