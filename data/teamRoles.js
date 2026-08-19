// Dữ liệu nhiệm vụ cào dữ liệu Shopee & Decor phòng trọ cho 4 thành viên nhóm FurneeHome

export const TEAM_MEMBERS = [
  { id: 'member-1', defaultName: 'Hiệp', nickname: 'Hiệp "Gánh Team"', icon: '🦁', color: '#10b981' },
  { id: 'member-2', defaultName: 'Phúc', nickname: 'Phúc "Chiến Thần"', icon: '⚡', color: '#3b82f6' },
  { id: 'member-3', defaultName: 'Triệu', nickname: 'Triệu "Siêu Cấp"', icon: '🦊', color: '#ec4899' },
  { id: 'member-4', defaultName: 'Dũng', nickname: 'Dũng "Bá Đạo"', icon: '🐼', color: '#f59e0b' },
];

export const TEAM_ROLES = [
  {
    id: 'role-hiep',
    title: '🦁 Hiệp "Gánh Team"',
    tagline: 'Săn tìm nội thất thông minh & Bàn ghế học tập tiện ích cho sinh viên',
    color: '#10b981',
    assignedMemberId: 'member-1',
    keyFiles: [
      'tools/importProducts.js',
      'client/public/data_import/data_import.json',
      'README.md',
    ],
    checklist: [
      { id: 'c-hiep-1', text: 'Tìm 5 link Shopee: Bàn học gấp gọn, ghế xoay công thái học giá sinh viên.', done: true },
      { id: 'c-hiep-2', text: 'Dán link vào tools/importProducts.js và chạy cào dữ liệu tự động.', done: true },
      { id: 'c-hiep-3', text: 'Kiểm tra ảnh tách nền hiển thị rõ ràng và giá tiền chính xác.', done: true },
      { id: 'c-hiep-4', text: 'Xem thử sản phẩm trong Room Studio AI xem có khớp phòng không.', done: true },
    ],
  },
  {
    id: 'role-phuc',
    title: '⚡ Phúc "Chiến Thần"',
    tagline: 'Săn tìm kệ sách, tủ để đồ đa năng & Thiết bị lưu trữ phòng trọ',
    color: '#3b82f6',
    assignedMemberId: 'member-2',
    keyFiles: [
      'tools/importProducts.js',
      'client/public/data_import/data_import.json',
      'README.md',
    ],
    checklist: [
      { id: 'c-phuc-1', text: 'Tìm 5 link Shopee: Kệ sách mini, tủ vải, giá treo quần áo thông minh.', done: true },
      { id: 'c-phuc-2', text: 'Dán link vào tools/importProducts.js và chạy node tools/importProducts.js.', done: true },
      { id: 'c-phuc-3', text: 'Kiểm tra mô tả sản phẩm và đường link dẫn sang Shopee chuẩn xác.', done: true },
      { id: 'c-phuc-4', text: 'Lưu thử vào Bộ sưu tập (Collection) để kiểm tra tính năng lưu đồ yêu thích.', done: true },
    ],
  },
  {
    id: 'role-trieu',
    title: '🦊 Triệu "Siêu Cấp"',
    tagline: 'Săn tìm đồ Decor phòng trọ, Đèn bàn, Thảm trải sàn & Tranh trang trí',
    color: '#ec4899',
    assignedMemberId: 'member-3',
    keyFiles: [
      'tools/importProducts.js',
      'client/public/data_import/data_import.json',
      'README.md',
    ],
    checklist: [
      { id: 'c-trieu-1', text: 'Tìm 5 link Shopee: Đèn bàn chống cận, thảm lót sàn, cây cảnh mini decor.', done: true },
      { id: 'c-trieu-2', text: 'Dán link vào tools/importProducts.js và nạp trực tiếp vào MongoDB.', done: true },
      { id: 'c-trieu-3', text: 'Kiểm tra phân loại danh mục Đèn học và Decor hiển thị đúng trang.', done: true },
      { id: 'c-trieu-4', text: 'Tải ảnh phòng ngủ thực tế và xem thử hiệu ứng AI ghép tranh/đèn.', done: true },
    ],
  },
  {
    id: 'role-dung',
    title: '🐼 Dũng "Bá Đạo"',
    tagline: 'Săn tìm phụ kiện tiện ích, Móc treo thông minh & Đồ gia dụng phòng nhỏ',
    color: '#f59e0b',
    assignedMemberId: 'member-4',
    keyFiles: [
      'tools/importProducts.js',
      'client/public/data_import/data_import.json',
      'README.md',
    ],
    checklist: [
      { id: 'c-dung-1', text: 'Tìm 5 link Shopee: Móc dán tường chịu lực, giỏ đựng đồ, kệ gia vị mini.', done: true },
      { id: 'c-dung-2', text: 'Dán link vào tools/importProducts.js và đồng bộ dữ liệu với server.', done: true },
      { id: 'c-dung-3', text: 'Kiểm tra file backup client/public/data_import/data_import.json.', done: true },
      { id: 'c-dung-4', text: 'Kiểm thử thao tác trên điện thoại xem giao diện có mượt mà không.', done: true },
    ],
  },
];
