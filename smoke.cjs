const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = __dirname;
const appRoot = [
  process.env.FURNEEHOME_ROOT && path.resolve(process.env.FURNEEHOME_ROOT),
  path.resolve(root, '..', '..', 'furneehome - Copy'),
  path.resolve(root, '..'),
].filter(Boolean).find((candidate) => (
  fs.existsSync(path.join(candidate, 'client', 'src'))
  && fs.existsSync(path.join(candidate, 'server', 'src'))
));

async function curriculum() {
  const code = fs.readFileSync(path.join(root, 'data', 'flashcards.js'));
  return import(`data:text/javascript;base64,${code.toString('base64')}`);
}

test('curriculum tells one complete ecommerce story', async () => {
  const {
    LESSONS,
    TRACKS,
    MEMBERS,
    ALL_FLASHCARDS,
    ALL_QUESTIONS,
    SEQUENCE_FLOWS,
  } = await curriculum();

  assert.equal(LESSONS.length, 12);
  assert.equal(new Set(LESSONS.map((item) => item.id)).size, LESSONS.length);
  assert.deepEqual(
    LESSONS.map((item) => item.number),
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  );
  assert.deepEqual(TRACKS.map((item) => item.id), ['common', 'dung', 'trieu', 'phuc', 'hiep']);
  assert.deepEqual(MEMBERS.map((item) => item.difficulty), [1, 2, 3, 4]);
  assert.deepEqual(
    [...MEMBERS].sort((left, right) => right.difficulty - left.difficulty).map((item) => item.name),
    ['Dũng', 'Triều', 'Phúc', 'Hiệp'],
  );
  assert.ok(ALL_FLASHCARDS.length >= 24);
  assert.ok(ALL_QUESTIONS.length >= 36);

  for (const lesson of LESSONS) {
    for (const key of ['id', 'number', 'owner', 'title', 'summary', 'route']) {
      assert.ok(lesson[key], `${lesson.id} has ${key}`);
    }
    for (const key of ['keyPoints', 'sequence', 'rules', 'functions', 'questions', 'cards']) {
      assert.ok(Array.isArray(lesson[key]) && lesson[key].length, `${lesson.id} has ${key}`);
    }
    assert.ok(lesson.demo.actions.length && lesson.demo.expected && lesson.demo.fallback);
  }

  const common = TRACKS.find((item) => item.id === 'common');
  assert.deepEqual(common.lessonIds, LESSONS.map((item) => item.id));
  const assigned = new Set(MEMBERS.flatMap((item) => item.lessonIds));
  assert.deepEqual(assigned, new Set(LESSONS.map((item) => item.id)));

  const room = LESSONS.find((item) => item.id === 'ai-room');
  assert.deepEqual(room.sequence.slice(0, 3), ['Chọn 1–3 sản phẩm', 'Tải ảnh phòng', 'Nhập vị trí từng món']);
  assert.match(room.keyPoints.join(' '), /data URL/i);
  assert.doesNotMatch(room.keyPoints.join(' '), /Collection|Bộ sưu tập/i);

  const admin = LESSONS.find((item) => item.id === 'admin');
  for (const label of ['Sản phẩm', 'Khách hàng', 'Đơn hàng', 'Liên hệ', 'admin cấp dưới']) {
    assert.match(admin.keyPoints.join(' '), new RegExp(label, 'i'));
  }

  const curriculumText = JSON.stringify(LESSONS);
  assert.doesNotMatch(curriculumText, /Collection|Bộ sưu tập/i);
  assert.match(curriculumText, /Liên hệ/i);

  assert.deepEqual(
    SEQUENCE_FLOWS.map((flow) => flow.id),
    ['purchase', 'account', 'room-studio', 'contact', 'admin', 'superadmin'],
  );
  for (const flow of SEQUENCE_FLOWS) {
    assert.ok(flow.nodes.length >= 4, `${flow.id} has sequence nodes`);
    for (const node of flow.nodes) {
      assert.ok(node.label && node.lessonId && node.route && node.number, `${flow.id} node is complete`);
      assert.ok(LESSONS.some((lesson) => lesson.id === node.lessonId), `${flow.id} node points to a lesson`);
    }
  }
});

test('important functions stay traceable to the final project', async () => {
  const { LESSONS } = await curriculum();
  if (!appRoot) return;

  for (const lesson of LESSONS) {
    for (const item of lesson.functions) {
      const target = path.resolve(appRoot, item.path);
      assert.ok(target.startsWith(appRoot), `${item.path} stays inside app`);
      assert.ok(fs.existsSync(target), `${item.path} exists`);
      assert.ok(fs.readFileSync(target, 'utf8').includes(item.symbol), `${item.name} symbol exists`);
    }
    for (const item of lesson.cards) {
      for (const reference of item.sources) {
        const target = path.resolve(appRoot, reference.path);
        assert.ok(fs.existsSync(target), `${reference.path} exists`);
        assert.ok(fs.readFileSync(target, 'utf8').includes(reference.symbol), `${reference.symbol} exists`);
      }
    }
  }
});

test('learning UI is detailed and does not persist progress', () => {
  const code = ['app.js', 'data/flashcards.js', 'index.html', 'style.css']
    .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
    .join('\n');
  const appCode = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.doesNotMatch(appCode, /(?:localStorage|sessionStorage|indexedDB)\s*\./);
  assert.doesNotMatch(code, /Input\s*→\s*Process\s*→\s*Output/i);
  for (const label of [
    'BỨC TRANH TOÀN DỰ ÁN',
    'Bạn cần hiểu',
    'Kể lại theo trình tự',
    'Demo trực tiếp',
    'Quy tắc nghiệp vụ',
    'Hàm quan trọng',
    'Giám khảo có thể hỏi',
  ]) {
    assert.match(code, new RegExp(label, 'i'));
  }
  assert.match(code, /data-action="lesson"/);
  assert.match(appCode, /renderSequenceFlows/);
  assert.match(code, /sequence-flow-nodes/);
  assert.match(code, /@media \(max-width: 640px\)/);
});
