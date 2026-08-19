// Dữ liệu phân chia công việc cho 4 thành viên nhóm FurneeHome

export const TEAM_MEMBERS = [
  { id: 'member-1', defaultName: 'Hiệp', label: 'Thành viên 1' },
  { id: 'member-2', defaultName: 'Phúc', label: 'Thành viên 2' },
  { id: 'member-3', defaultName: 'Triệu', label: 'Thành viên 3' },
  { id: 'member-4', defaultName: 'Dũng', label: 'Thành viên 4' },
];

export const TEAM_ROLES = [
  {
    id: 'role-leader',
    title: '👑 Trưởng nhóm & AI Architecture',
    tagline: 'Phụ trách tổng thể, tích hợp Cloudflare AI Flux-2 & Quản trị Git',
    color: '#10b981',
    assignedMemberId: 'member-1',
    keyFiles: [
      'server/src/services/cloudflareImageService.js',
      'client/src/utils/roomPreviewCanvas.js',
      'START_HERE.md',
      'README.md',
    ],
    checklist: [
      { id: 'c-lead-1', text: 'Quản lý Git: duyệt và merge code của các bạn vào main.', done: true },
      { id: 'c-lead-2', text: 'Cấu hình Cloudflare AI token và kết nối model Flux-2 Klein.', done: true },
      { id: 'c-lead-3', text: 'Tối ưu thuật toán crop cục bộ và composite trên Canvas.', done: true },
      { id: 'c-lead-4', text: 'Nắm chắc kiến trúc tổng thể và luồng One-touch của dự án.', done: true },
    ],
  },
  {
    id: 'role-frontend',
    title: '🎨 Frontend & Giao diện người dùng',
    tagline: 'Phụ trách toàn bộ giao diện React SPA, CSS thuần & Màn hình Studio',
    color: '#ec4899',
    assignedMemberId: 'member-2',
    keyFiles: [
      'client/src/pages/RoomStudioPage.jsx',
      'client/src/pages/ProductListPage.jsx',
      'client/src/pages/CollectionPage.jsx',
      'client/src/styles/theme.css',
      'client/src/styles/global.css',
    ],
    checklist: [
      { id: 'c-fe-1', text: 'Xây dựng giao diện danh sách sản phẩm và tìm kiếm có/không dấu.', done: true },
      { id: 'c-fe-2', text: 'Thiết kế giao diện Room Studio (tải ảnh, chấm điểm đặt đáy).', done: true },
      { id: 'c-fe-3', text: 'Xây dựng trang Bộ sưu tập (Collection) lưu mẫu phòng và đồ đã thích.', done: true },
      { id: 'c-fe-4', text: 'Hiểu rõ hệ thống biến màu CSS thuần trong theme.css và Context state.', done: true },
    ],
  },
  {
    id: 'role-backend',
    title: '🛠️ Backend API & Cơ sở dữ liệu',
    tagline: 'Phụ trách Express API, MVC trực diện, Models & MongoDB',
    color: '#3b82f6',
    assignedMemberId: 'member-3',
    keyFiles: [
      'server/src/controllers/productController.js',
      'server/src/controllers/authController.js',
      'server/src/controllers/roomDesignController.js',
      'server/src/models/Product.js',
      'server/src/models/RoomDesign.js',
    ],
    checklist: [
      { id: 'c-be-1', text: 'Khởi tạo Express server và kết nối MongoDB Atlas an toàn.', done: true },
      { id: 'c-be-2', text: 'Viết các Controller trực diện, ngắn gọn 10-15 dòng theo phong cách pretest2.', done: true },
      { id: 'c-be-3', text: 'Định nghĩa Schema Product và RoomDesign 2D chuẩn hóa.', done: true },
      { id: 'c-be-4', text: 'Hiểu rõ cơ chế bảo mật biến môi trường .env duy nhất ở thư mục gốc.', done: true },
    ],
  },
  {
    id: 'role-data',
    title: '📦 Dữ liệu Shopee & Kiểm thử chất lượng',
    tagline: 'Phụ trách Tool cào Shopee, nạp dữ liệu MongoDB & Test ảnh phòng thật',
    color: '#f59e0b',
    assignedMemberId: 'member-4',
    keyFiles: [
      'tools/importProducts.js',
      'client/src/data/sampleProducts.js',
      'client/public/data_import/data_import.json',
    ],
    checklist: [
      { id: 'c-data-1', text: 'Sử dụng tool cào Shopee (importProducts.js) để nạp sản phẩm vào MongoDB.', done: true },
      { id: 'c-data-2', text: 'Tìm kiếm thêm các link đồ nội thất sinh viên giá rẻ trên Shopee.', done: true },
      { id: 'c-data-3', text: 'Kiểm thử chất lượng ảnh AI trên nhiều điều kiện phòng chụp khác nhau.', done: true },
      { id: 'c-data-4', text: 'Hiểu rõ cách tool bóc tách JSON-LD và phân loại danh mục tự động.', done: true },
    ],
  },
];
