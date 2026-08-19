// Ngân hàng Flashcards hỏi đáp Source Code FurneeHome
// Câu hỏi và câu trả lời trực diện: Vị trí file, hàm xử lý và ý nghĩa code

export const FLASHCARDS = [
  // --- 1. ROOM STUDIO & AI ---
  {
    id: 'code-1',
    category: '🧠 Room Studio & AI',
    question: 'Khi người dùng bấm nút "Xem thử AI vào phòng", luồng xử lý bắt đầu từ file nào và gọi hàm gì?',
    answer: '👉 File: client/src/pages/RoomStudioPage.jsx — Hàm previewRoom().\n\nHàm này lấy ảnh phòng và sản phẩm đã chọn, gọi createRoomPreviewComposite() từ utils/roomPreviewCanvas.js để tạo crop và gửi API sang backend.',
  },
  {
    id: 'code-2',
    category: '🧠 Room Studio & AI',
    question: 'Thuật toán cắt ảnh phòng cục bộ (editRegion) và ghép ảnh AI nằm ở file nào?',
    answer: '👉 File: client/src/utils/roomPreviewCanvas.js — Hàm cropRoomRegion() và createRoomPreviewComposite().\n\nNó vẽ ảnh lên thẻ <canvas>, cắt một vùng nhỏ quanh điểm ghim (target) để gửi vào AI, sau đó ghép đè ảnh AI trả về đúng vị trí cũ.',
  },
  {
    id: 'code-3',
    category: '🧠 Room Studio & AI',
    question: 'Code gọi trực tiếp tới Cloudflare Workers AI nằm ở file nào trong Backend?',
    answer: '👉 File: server/src/services/cloudflareImageService.js — Hàm runFlux2ImageToImage().\n\nHàm này nhận 2 file ảnh (crop phòng + sản phẩm PNG), đóng gói vào FormData và gửi tới model @cf/black-forest-labs/flux-2-klein-4b.',
  },
  {
    id: 'code-4',
    category: '🧠 Room Studio & AI',
    question: 'Tọa độ điểm đặt sản phẩm (target) được tính toán như thế nào để không bị lệch trên điện thoại?',
    answer: '👉 File: client/src/pages/RoomStudioPage.jsx — Hàm updateTargetFromPointer().\n\nCông thức: target.x = (clientX - rect.left) / rect.width và target.y = (clientY - rect.top) / rect.height. Tọa độ luôn chuẩn hóa từ 0.0 đến 1.0 theo tỷ lệ ảnh.',
  },
  {
    id: 'code-5',
    category: '🧠 Room Studio & AI',
    question: 'Endpoint API nhận yêu cầu tạo ảnh phòng của backend là gì và nằm ở route nào?',
    answer: '👉 File: server/src/routes/roomPreviewRoutes.js & server/src/controllers/roomPreviewController.js.\n\nEndpoint: POST /api/room-previews (nhận multipart/form-data gồm input_image_0, input_image_1 và target).',
  },

  // --- 2. BACKEND MVC & DATABASE ---
  {
    id: 'code-6',
    category: '🛠️ Backend & Database',
    question: 'Controller xử lý lấy danh sách, thêm, sửa, xóa sản phẩm nằm ở file nào?',
    answer: '👉 File: server/src/controllers/productController.js.\n\nGồm 4 hàm trực diện: list() (có tìm kiếm $text & lọc category), create(), update() (findByIdAndUpdate), remove() (findByIdAndDelete).',
  },
  {
    id: 'code-7',
    category: '🛠️ Backend & Database',
    question: 'File kết nối MongoDB và bắt lỗi kết nối CSDL nằm ở đâu?',
    answer: '👉 File: server/src/config/db.js — Hàm connectDatabase().\n\nSử dụng mongoose.connect(env.mongoUri) và in log "Connected to MongoDB" hoặc báo lỗi nếu sai chuỗi kết nối.',
  },
  {
    id: 'code-8',
    category: '🛠️ Backend & Database',
    question: 'File cấu hình đọc biến môi trường .env duy nhất của Backend nằm ở đâu?',
    answer: '👉 File: server/src/config/env.js.\n\nTự động tìm và đọc file .env ở thư mục gốc (../../../.env) để nạp PORT, MONGO_URI, JWT_SECRET, CLOUDFLARE_API_TOKEN.',
  },
  {
    id: 'code-9',
    category: '🛠️ Backend & Database',
    question: 'Xử lý đăng nhập, so sánh mật khẩu bcrypt và tạo JWT token nằm ở file nào?',
    answer: '👉 File: server/src/controllers/authController.js — Hàm login().\n\nTìm user theo email, so sánh bằng bcrypt.compare(password, user.password), nếu đúng thì tạo jwt.sign({ userId }, secret).',
  },
  {
    id: 'code-10',
    category: '🛠️ Backend & Database',
    question: 'Schema Mongoose lưu mẫu phòng đã tạo AI (RoomDesign) nằm ở đâu và lưu những trường gì?',
    answer: '👉 File: server/src/models/RoomDesign.js.\n\nLưu: user, title, productId, target: { x, y, anchor }, resultImage (ảnh ghép), model (tên AI), elapsedMs (thời gian render).',
  },
  {
    id: 'code-11',
    category: '🛠️ Backend & Database',
    question: 'Schema Mongoose của sản phẩm (Product) chứa những trường gì phục vụ Shopee?',
    answer: '👉 File: server/src/models/Product.js.\n\nLưu: name, slug, price, transparentImage (ảnh PNG tách nền), shopeeSearchUrl (link tìm kiếm), sourceUrl (link gốc), offers (danh sách shop bán).',
  },
  {
    id: 'code-12',
    category: '🛠️ Backend & Database',
    question: 'Middleware kiểm tra token đăng nhập và phân quyền Admin nằm ở đâu?',
    answer: '👉 File: server/src/middleware/authMiddleware.js — Hàm requireAuth và requireAdmin.\n\nĐọc Authorization: Bearer <token>, dùng jwt.verify() để xác thực người dùng.',
  },
  {
    id: 'code-13',
    category: '🛠️ Backend & Database',
    question: 'Tất cả các route của Backend được gom lại ở file nào trước khi nạp vào server?',
    answer: '👉 File: server/src/routes/index.js.\n\nGom các route con: /auth, /products, /room-designs, /room-previews, /admin và route kiểm tra /health.',
  },

  // --- 3. FRONTEND REACT & STYLING ---
  {
    id: 'code-14',
    category: '🎨 Frontend React & CSS',
    question: 'Dữ liệu 10 sản phẩm mẫu tạm thời khi chưa bật MongoDB được lưu ở file nào?',
    answer: '👉 File: client/src/data/sampleProducts.js.\n\nChứa mảng 10 sản phẩm nội thất mẫu (bàn học, ghế xoay, đèn bàn...) kèm kích thước cm và link Shopee.',
  },
  {
    id: 'code-15',
    category: '🎨 Frontend React & CSS',
    question: 'Toàn bộ danh sách sản phẩm yêu thích và mẫu phòng AI được lưu ở Context nào?',
    answer: '👉 File: client/src/context/CollectionContext.jsx — Hàm toggleSaved() và saveRoomTemplate().\n\nQuản lý state mảng savedItems và tự động lưu vào localStorage trình duyệt.',
  },
  {
    id: 'code-16',
    category: '🎨 Frontend React & CSS',
    question: 'Cấu hình các trang (Routes) của ứng dụng Frontend nằm ở file nào?',
    answer: '👉 File: client/src/router.jsx.\n\nDùng createBrowserRouter gồm các đường dẫn: / (Home), /products (Danh sách), /room-studio (Phòng thử), /collection (Bộ sưu tập), /admin (Quản trị).',
  },
  {
    id: 'code-17',
    category: '🎨 Frontend React & CSS',
    question: 'Hộp thoại đăng nhập nhanh dùng chung cho toàn bộ trang web nằm ở component nào?',
    answer: '👉 File: client/src/components/auth/LoginModal.jsx.\n\nCó 2 nút chọn nhanh tài khoản Customer và Admin để thầy cô và thành viên test ngay không cần gõ mật khẩu.',
  },
  {
    id: 'code-18',
    category: '🎨 Frontend React & CSS',
    question: 'Toàn bộ biến màu sắc, kích thước và font chữ (Design Tokens) của web nằm ở file CSS nào?',
    answer: '👉 File: client/src/styles/theme.css.\n\nKhai báo trong :root gồm: --color-primary (#205c46), --color-accent (#d97745), --color-background (#f7f5ef), --font-main (Be Vietnam Pro).',
  },
  {
    id: 'code-19',
    category: '🎨 Frontend React & CSS',
    question: 'Hàm xử lý tìm kiếm sản phẩm hỗ trợ gõ có dấu hoặc không dấu tiếng Việt nằm ở đâu?',
    answer: '👉 File: client/src/utils/normalizeText.js — Hàm normalizeText().\n\nXóa toàn bộ dấu tiếng Việt và đưa về chữ thường (ví dụ: "Bàn học" -> "ban hoc") để so sánh tìm kiếm.',
  },
  {
    id: 'code-20',
    category: '🎨 Frontend React & CSS',
    question: 'Hàm định dạng giá tiền Việt Nam Đồng (VND) hiển thị trên giao diện nằm ở đâu?',
    answer: '👉 File: client/src/utils/formatPrice.js — Hàm formatVnd().\n\nSử dụng Intl.NumberFormat("vi-VN") để chuyển số thành chuỗi có dấu chấm phân cách (ví dụ: 99000 -> "99.000 ₫").',
  },

  // --- 4. TOOLS & SCRIPTS ---
  {
    id: 'code-21',
    category: '📦 Tools & Khởi động',
    question: 'Tool cào dữ liệu Shopee và tự nạp vào MongoDB nằm ở file nào và chạy bằng lệnh gì?',
    answer: '👉 File: tools/importProducts.js — Lệnh chạy: node tools/importProducts.js.\n\nĐọc danh sách link Shopee trong DEFAULT_URLS, bóc tách JSON-LD và upsert vào MongoDB collection products.',
  },
  {
    id: 'code-22',
    category: '📦 Tools & Khởi động',
    question: 'Tool importProducts.js lưu bản sao lưu dữ liệu JSON offline ở đường dẫn nào?',
    answer: '👉 File: client/public/data_import/data_import.json.\n\nMỗi lần chạy cào Shopee, tool vừa lưu vào MongoDB vừa ghi đè file JSON này để frontend có thể đọc offline.',
  },
  {
    id: 'code-23',
    category: '📦 Tools & Khởi động',
    question: 'File script 1 cú click để bật cả Frontend (5173) và Backend (5000) cùng lúc nằm ở đâu?',
    answer: '👉 File: start-furneehome.bat (ở thư mục gốc).\n\nTự động mở 2 cửa sổ terminal: 1 cửa sổ chạy cd client && npm run dev và 1 cửa sổ chạy cd server && npm run dev.',
  },
  {
    id: 'code-24',
    category: '📦 Tools & Khởi động',
    question: 'File tạo sẵn tài khoản Admin và danh mục mẫu trong database nằm ở đâu?',
    answer: '👉 File: server/src/utils/seedData.js — Hàm seed().\n\nChạy kết nối DB, tạo danh mục "Bàn học", tạo sản phẩm mẫu và tạo tài khoản Admin theo ADMIN_EMAIL trong .env.',
  },
  {
    id: 'code-25',
    category: '📦 Tools & Khởi động',
    question: 'Cổng mặc định (Port) của Frontend và Backend là bao nhiêu?',
    answer: '👉 Frontend: Port 5173 (Vite dev server) | Backend: Port 5000 (Express server).\n\nFrontend gọi API backend thông qua URL cấu hình: http://localhost:5000/api.',
  },
];
