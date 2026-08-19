// Dữ liệu nhiệm vụ Săn link Shopee theo từng dòng sản phẩm cho 4 thành viên (Mỗi mục tìm 10 link)

export const TEAM_MEMBERS = [
  { id: 'member-1', defaultName: 'Hiệp', icon: '👤', color: '#10b981' },
  { id: 'member-2', defaultName: 'Phúc', icon: '👤', color: '#3b82f6' },
  { id: 'member-3', defaultName: 'Triều', icon: '👤', color: '#ec4899' },
  { id: 'member-4', defaultName: 'Dũng', icon: '👤', color: '#f59e0b' },
];

export const TEAM_ROLES = [
  {
    id: 'role-hiep',
    title: '👤 Hiệp',
    tagline: 'Phụ trách: Bàn học, Bàn làm việc & Các loại Ghế học tập sinh viên',
    color: '#10b981',
    assignedMemberId: 'member-1',
    keyFiles: [
      'Bàn học & Bàn làm việc',
      'Ghế xoay & Ghế công thái học',
    ],
    checklist: [
      { id: 'c-hiep-1', text: 'Tìm 10 link Shopee: Bàn học gấp gọn sinh viên (loại có khe cắm iPad, chân chống trượt).', done: false },
      { id: 'c-hiep-2', text: 'Tìm 10 link Shopee: Bàn làm việc chân chữ K / chữ Z (kèm giá để sách hoặc kệ CPU).', done: false },
      { id: 'c-hiep-3', text: 'Tìm 10 link Shopee: Ghế xoay văn phòng / Ghế công thái học lưới thoáng khí giá rẻ.', done: false },
      { id: 'c-hiep-4', text: 'Tìm 10 link Shopee: Ghế bệt tựa lưng Tatami / Ghế lười thư giãn decor góc phòng.', done: false },
    ],
  },
  {
    id: 'role-phuc',
    title: '👤 Phúc',
    tagline: 'Phụ trách: Kệ sách, Tủ để đồ & Giá treo quần áo đa năng',
    color: '#3b82f6',
    assignedMemberId: 'member-2',
    keyFiles: [
      'Kệ sách & Kệ đa tầng',
      'Tủ đồ & Giá treo quần áo',
    ],
    checklist: [
      { id: 'c-phuc-1', text: 'Tìm 10 link Shopee: Kệ sách mini để bàn học / Kệ sách xương cá gỗ lắp ghép.', done: false },
      { id: 'c-phuc-2', text: 'Tìm 10 link Shopee: Giá treo quần áo chữ A khung gỗ / Giá treo kim loại 2 tầng.', done: false },
      { id: 'c-phuc-3', text: 'Tìm 10 link Shopee: Tủ vải đựng quần áo khung inox chịu lực cho phòng trọ.', done: false },
      { id: 'c-phuc-4', text: 'Tìm 10 link Shopee: Kệ để đồ đa tầng đa năng (để đồ nhà bếp, lò vi sóng hoặc gia vị).', done: false },
    ],
  },
  {
    id: 'role-trieu',
    title: '👤 Triều',
    tagline: 'Phụ trách: Đèn học, Thảm trải sàn & Đồ Decor không gian sống',
    color: '#ec4899',
    assignedMemberId: 'member-3',
    keyFiles: [
      'Đèn học & Ánh sáng',
      'Thảm sàn & Đồ Decor phòng',
    ],
    checklist: [
      { id: 'c-trieu-1', text: 'Tìm 10 link Shopee: Đèn bàn học LED bảo vệ mắt chống cận / Đèn học kẹp bàn tiện lợi.', done: false },
      { id: 'c-trieu-2', text: 'Tìm 10 link Shopee: Thảm trải sàn nỉ / Thảm lông loang màu decor phòng ngủ ấm cúng.', done: false },
      { id: 'c-trieu-3', text: 'Tìm 10 link Shopee: Tranh canvas treo tường / Tranh decor phòng tạo động lực học tập.', done: false },
      { id: 'c-trieu-4', text: 'Tìm 10 link Shopee: Đèn hoàng hôn Sunset / Cây cảnh mini nhân tạo trang trí bàn học.', done: false },
    ],
  },
  {
    id: 'role-dung',
    title: '👤 Dũng',
    tagline: 'Phụ trách: Kệ giày, Móc treo thông minh & Phụ kiện tiện ích',
    color: '#f59e0b',
    assignedMemberId: 'member-4',
    keyFiles: [
      'Kệ để giày dép',
      'Phụ kiện gia dụng thông minh',
    ],
    checklist: [
      { id: 'c-dung-1', text: 'Tìm 10 link Shopee: Kệ để giày dép gấp gọn thông minh 4 - 6 tầng cho phòng nhỏ.', done: false },
      { id: 'c-dung-2', text: 'Tìm 10 link Shopee: Móc dán tường siêu dính chịu lực / Móc treo sau cánh cửa.', done: false },
      { id: 'c-dung-3', text: 'Tìm 10 link Shopee: Khay giấu ổ cắm điện / Kẹp cố định dây sạc gọn gàng góc học tập.', done: false },
      { id: 'c-dung-4', text: 'Tìm 10 link Shopee: Hộp vải đựng đồ đa năng / Giỏ đựng quần áo gấp gọn tiết kiệm diện tích.', done: false },
    ],
  },
];
