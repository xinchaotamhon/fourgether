// Ngân hàng Flashcards hỏi đáp Source Code & Kiến trúc dự án FurneeHome
// Câu hỏi và câu trả lời trực diện: Vị trí file, hàm xử lý, ý nghĩa code & kiến trúc README

export const FLASHCARDS = [
  // =========================================================================
  // NHÓM 1: KIẾN TRÚC TỔNG THỂ & THIẾT KẾ HỆ THỐNG (THEO README & START_HERE)
  // =========================================================================
  {
    id: 'arch-1',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Cấu trúc tổng thể của dự án FurneeHome được chia thành những phần nào trong README?',
    answer: '👉 Thư mục dự án: Gồm 3 phần chính:\n1. client/: Frontend React 19 SPA (Vite + 100% CSS thuần, Port 5173).\n2. server/: Backend Node.js Express 5 (Direct MVC + MongoDB Atlas, Port 5000).\n3. tools/: Tool cào dữ liệu Shopee độc lập (importProducts.js).',
  },
  {
    id: 'arch-2',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Tại sao nhóm quyết định chuyển hướng (Pivot) từ mô hình 3D (Three.js) sang 2D Room Studio + AI?',
    answer: '👉 Giải thích kiến trúc:\nMô hình 3D (trong bản phác thảo furniture-store.txt cũ) đòi hỏi người dùng tự vẽ phòng và tải model 3D .glb phức tạp, không thực tế với sinh viên. Nhóm chuyển sang 2D AI (Cloudflare Flux-2) để người dùng chỉ cần chụp 1 tấm ảnh phòng thật là xem thử được ngay.',
  },
  {
    id: 'arch-3',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Tại sao dự án không làm giỏ hàng/thanh toán (Cart/Checkout) mà điều hướng sang Shopee?',
    answer: '👉 Định hướng sản phẩm (README & START_HERE):\nFurneeHome là nền tảng AI hỗ trợ xem trước không gian phòng trọ sinh viên, không phải sàn thương mại điện tử. Người dùng xem thử ưng ý sẽ bấm link điều hướng mua trực tiếp trên Shopee để có giá rẻ nhất.',
  },
  {
    id: 'arch-4',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Tại sao dự án chỉ dùng duy nhất 1 file .env ở thư mục gốc mà không chia nhỏ ra các thư mục con?',
    answer: '👉 Quản lý cấu hình (README Mục 6):\nĐể tập trung toàn bộ biến môi trường (PORT, MONGO_URI, CLOUDFLARE_API_TOKEN) tại một nơi duy nhất. Cả Backend và Tool cào Shopee đều đọc chung từ root, tránh phân mảnh và tránh lộ secret lên Git.',
  },
  {
    id: 'arch-5',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Tại sao các thành viên nhóm phải làm việc trên nhánh riêng (feature/phuc, trieu, dung) mà không commit vào main?',
    answer: '👉 Quy trình Git (README Mục 4):\nĐể tránh xung đột code (conflict). Mỗi thành viên code trên nhánh riêng, test hoàn chỉnh rồi tạo Pull Request để trưởng nhóm review và merge vào nhánh main.',
  },
  {
    id: 'arch-6',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'Quy trình 3 bước làm việc hàng ngày với Git của nhóm gồm những lệnh gì?',
    answer: '👉 Lệnh Git (README Mục 4):\n1. Đầu ngày kéo code mới: git switch feature/ten-ban -> git pull origin main.\n2. Sau khi code xong: git add . -> git commit -m "Mô tả" -> git push origin feature/ten-ban.\n3. Báo trưởng nhóm merge vào main.',
  },
  {
    id: 'arch-7',
    category: '🏛️ Kiến trúc & Thiết kế hệ thống',
    question: 'File start-furneehome.bat ở thư mục gốc hoạt động như thế nào?',
    answer: '👉 File: start-furneehome.bat (README Mục 1).\n\nLà script tự động mở 2 cửa sổ cmd độc lập: 1 cửa sổ chạy Frontend (cd client && npm run dev) và 1 cửa sổ chạy Backend (cd server && npm run dev) chỉ bằng 1 cú click đúp.',
  },

  // =========================================================================
  // NHÓM 2: ROOM STUDIO & CLOUDFLARE AI FLUX-2
  // =========================================================================
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

  // =========================================================================
  // NHÓM 3: BACKEND MVC & CƠ SỞ DỮ LIỆU MONGODB
  // =========================================================================
  {
    id: 'code-6',
    category: '🛠️ Backend & Database',
    question: 'Tại sao Backend được thiết kế theo mô hình Controller trực diện giống bài thực hành pretest2?',
    answer: '👉 File: server/src/controllers/productController.js, authController.js.\n\nController thao tác trực tiếp với Mongoose Model (find, create, findByIdAndUpdate), mỗi hàm 10-15 dòng, không bọc qua nhiều tầng service thừa giúp code trong sáng và dễ giải trình.',
  },
  {
    id: 'code-7',
    category: '🛠️ Backend & Database',
    question: 'File kết nối MongoDB và bắt lỗi kết nối CSDL nằm ở đâu?',
    answer: '👉 File: server/src/config/db.js — Hàm connectDatabase().\n\nSử dụng mongoose.connect(env.mongoUri) và in log "Connected to MongoDB" hoặc bắt lỗi nếu sai connection string.',
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
    answer: '👉 File: server/src/middleware/authMiddleware.js — Hàm requireAuth và requireAdmin.\n\nĐọc header Authorization: Bearer <token>, dùng jwt.verify() để xác thực quyền truy cập.',
  },
  {
    id: 'code-13',
    category: '🛠️ Backend & Database',
    question: 'Tất cả các route của Backend được gom lại ở file nào trước khi nạp vào server?',
    answer: '👉 File: server/src/routes/index.js.\n\nGom các route con: /auth, /products, /room-designs, /room-previews, /admin và route kiểm tra hệ thống /health.',
  },

  // =========================================================================
  // NHÓM 4: FRONTEND REACT 19 & 100% CSS THUẦN
  // =========================================================================
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
    answer: '👉 File: client/src/context/CollectionContext.jsx — Hàm toggleSaved() và saveRoomTemplate().\n\nQuản lý state mảng savedItems và tự động đồng bộ hóa xuống localStorage trình duyệt.',
  },
  {
    id: 'code-16',
    category: '🎨 Frontend React & CSS',
    question: 'Cấu hình các trang (Routes) của ứng dụng Frontend nằm ở file nào?',
    answer: '👉 File: client/src/router.jsx (README Mục 3).\n\nDùng createBrowserRouter gồm các đường dẫn: / (Home), /products (Danh sách), /room-studio (Phòng thử), /collection (Bộ sưu tập), /admin (Quản trị).',
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
    question: 'Toàn bộ biến màu sắc, font chữ tiếng Việt (Design Tokens) của web nằm ở file CSS nào?',
    answer: '👉 File: client/src/styles/theme.css.\n\nKhai báo trong :root gồm: --color-primary (#205c46), --color-accent (#d97745), --color-background (#f7f5ef), --font-main (Be Vietnam Pro).',
  },
  {
    id: 'code-19',
    category: '🎨 Frontend React & CSS',
    question: 'Tại sao nhóm gỡ bỏ Tailwind CSS và chuyển sang 100% CSS thuần?',
    answer: '👉 Thiết kế CSS (theme.css & global.css):\nĐể tối ưu tốc độ build siêu nhanh (chỉ 224ms), giảm dung lượng package, và giúp mọi thành viên trong nhóm mở code ra là hiểu và sửa CSS được ngay.',
  },
  {
    id: 'code-20',
    category: '🎨 Frontend React & CSS',
    question: 'Hàm xử lý tìm kiếm sản phẩm hỗ trợ gõ có dấu hoặc không dấu tiếng Việt nằm ở đâu?',
    answer: '👉 File: client/src/utils/normalizeText.js — Hàm normalizeText().\n\nXóa toàn bộ dấu tiếng Việt và đưa về chữ thường (ví dụ: "Bàn học" -> "ban hoc") để so sánh tìm kiếm.',
  },
  {
    id: 'code-21',
    category: '🎨 Frontend React & CSS',
    question: 'Hàm định dạng giá tiền Việt Nam Đồng (VND) hiển thị trên giao diện nằm ở đâu?',
    answer: '👉 File: client/src/utils/formatPrice.js — Hàm formatVnd().\n\nSử dụng Intl.NumberFormat("vi-VN") để chuyển số thành chuỗi có dấu chấm phân cách (ví dụ: 99000 -> "99.000 ₫").',
  },

  // =========================================================================
  // NHÓM 5: TOOL CÀO SHOPEE & DATABASE SEEDING
  // =========================================================================
  {
    id: 'code-22',
    category: '📦 Tools & Khởi động',
    question: 'Tool cào dữ liệu Shopee và tự nạp vào MongoDB nằm ở file nào và chạy bằng lệnh gì?',
    answer: '👉 File: tools/importProducts.js — Lệnh chạy: node tools/importProducts.js (README Mục 5).\n\nĐọc link Shopee trong DEFAULT_URLS, bóc tách JSON-LD và upsert trực tiếp vào MongoDB collection products.',
  },
  {
    id: 'code-23',
    category: '📦 Tools & Khởi động',
    question: 'Tool importProducts.js lưu bản sao lưu dữ liệu JSON offline ở đường dẫn nào?',
    answer: '👉 File: client/public/data_import/data_import.json.\n\nMỗi lần chạy cào Shopee, tool vừa lưu vào MongoDB vừa ghi đè file JSON này để frontend có thể đọc offline.',
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

  // =========================================================================
  // NHÓM 6: CÂU HỎI TÌNH HUỐNG & VẤN ĐÁP NÂNG CAO CỦA HỘI ĐỒNG
  // =========================================================================
  {
    id: 'deep-1',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Nếu Cloudflare AI bị lỗi hoặc hết quota thì Room Studio xử lý thế nào?',
    answer: '👉 File: client/src/pages/RoomStudioPage.jsx & client/src/services/roomPreviewService.js.\n\nHệ thống có cơ chế Fallback: Tự động hiển thị lớp phủ sản phẩm trực tiếp (Canvas 2D Overlay) lên ảnh phòng thật để người dùng vẫn xem trước được bố cục mà không bị gián đoạn.',
  },
  {
    id: 'deep-2',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Tại sao API gửi ảnh /api/room-previews dùng multipart/form-data mà không gửi Base64?',
    answer: '👉 Tối ưu hiệu năng mạng:\nChuỗi Base64 làm phình to 33% kích thước ảnh, gây tốn RAM server và chậm mạng. Gửi multipart/form-data (Multer) truyền file nhị phân trực tiếp nhanh hơn và tiết kiệm tài nguyên server.',
  },
  {
    id: 'deep-3',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Cơ chế xác thực đăng nhập (Auth Flow) hoạt động thế nào từ Frontend đến Backend?',
    answer: '👉 Flow đăng nhập:\nFrontend gọi POST /api/auth/login -> Backend so sánh mật khẩu bcrypt, tạo JWT -> Frontend lưu token vào localStorage -> File client/src/services/apiClient.js tự động gắn Authorization: Bearer <token> cho các request tiếp theo.',
  },
  {
    id: 'deep-4',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Nếu muốn thêm một trường mới cho sản phẩm (ví dụ trường material - chất liệu), ta phải sửa những file nào?',
    answer: '👉 Cần sửa 3 file:\n1. Model: server/src/models/Product.js (khai báo trường material).\n2. Controller: server/src/controllers/productController.js (nhận dữ liệu tạo/sửa).\n3. Giao diện: client/src/pages/ProductListPage.jsx (hiển thị thông tin).',
  },
  {
    id: 'deep-5',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Tại sao trong tool cào Shopee lại dùng findOneAndUpdate({ slug }, ..., { upsert: true })?',
    answer: '👉 File: tools/importProducts.js.\n\nCơ chế upsert: Nếu sản phẩm đã tồn tại (trùng slug) thì cập nhật giá và thông tin mới nhất; nếu chưa có thì tự động tạo mới. Giúp chạy tool nhiều lần mà không bao giờ bị trùng lặp dữ liệu.',
  },
  {
    id: 'deep-6',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Tại sao chỉ có 1 file .env duy nhất ở thư mục gốc mà server và tool vẫn đọc được?',
    answer: '👉 File: server/src/config/env.js & tools/importProducts.js.\n\nSử dụng dotenv.config({ path: path.resolve(__dirname, "../../../.env") }) để trỏ trực tiếp ra thư mục gốc, giúp bảo mật và quản trị token tập trung một nơi.',
  },
  {
    id: 'deep-7',
    category: '🎯 Vấn đáp nâng cao (Giảng viên hỏi)',
    question: 'Mô hình triển khai Online (Deployment Architecture) của dự án gồm những dịch vụ nào?',
    answer: '👉 3 dịch vụ chính:\n1. Frontend: Deploy Cloudflare Pages (tốc độ cao qua CDN).\n2. Backend: Deploy Render Web Service (Node.js + Express).\n3. Database: MongoDB Atlas Cloud (Cơ sở dữ liệu đám mây).',
  },
];

