// Ngân hàng Flashcards ôn tập bảo vệ đồ án FurneeHome
// Được biên soạn bám sát theo các câu hỏi vấn đáp thực tế của giảng viên

export const FLASHCARD_DECKS = [
  {
    id: 'ai-studio',
    name: '🧠 Tính năng AI Room Studio (Tính năng cốt lõi & Tốn công nhất)',
    color: '#10b981',
    description: 'Bản chất luồng 1-chạm, xử lý Crop cục bộ, kết nối Cloudflare Workers AI Flux-2 và Composite ảnh.',
  },
  {
    id: 'backend-mvc',
    name: '🛠️ Backend Express & MongoDB (Kiến trúc MVC trực diện)',
    color: '#3b82f6',
    description: 'Mô hình Controller trực diện, Mongoose Schema 2D, quản lý bảo mật .env và seed data.',
  },
  {
    id: 'frontend-css',
    name: '🎨 Frontend React 19 & 100% CSS thuần',
    color: '#ec4899',
    description: 'React Context quản lý state, hệ thống CSS Variables theme, router fallback và responsive.',
  },
  {
    id: 'tool-data',
    name: '📦 Tool cào dữ liệu Shopee & Database Seeding',
    color: '#f59e0b',
    description: 'Tool import 1 file JavaScript duy nhất, bóc tách JSON-LD, phân loại category và upsert MongoDB.',
  },
  {
    id: 'defence-qna',
    name: '❓ Câu hỏi vấn đáp "Tại sao / Bỏ đi thì sao / Thêm thì sao"',
    color: '#8b5cf6',
    description: 'Các tình huống thầy cô xoáy sâu vào quyết định kỹ thuật và lý do chuyển dịch dự án.',
  },
];

export const FLASHCARDS = [
  // --- DECK 1: AI ROOM STUDIO ---
  {
    id: 'ai-1',
    deckId: 'ai-studio',
    question: 'Tính năng nào là hay nhất và tốn nhiều thời gian nghiên cứu nhất trong đồ án FurneeHome?',
    answer: {
      summary: 'Tính năng "Phòng thử 1-chạm" (Room Studio) sử dụng Cloudflare Workers AI (model Flux-2 Klein) kết hợp kỹ thuật Crop cục bộ và Composite ảnh ở Canvas.',
      sourceLocation: 'client/src/utils/roomPreviewCanvas.js & server/src/services/cloudflareImageService.js',
      difficulty: '⭐⭐⭐⭐⭐ (Rất cao)',
      whatIfRemoved: 'Dự án sẽ chỉ còn là web xem sản phẩm và gắn link Shopee bình thường, mất hoàn toàn giá trị cốt lõi giải quyết bài toán xem thử nội thất phòng trọ.',
      howToExtend: 'Có thể mở rộng thêm tính năng chọn góc chiếu sáng, hoặc hỗ trợ đặt nhiều sản phẩm cùng lúc trong 1 phòng.',
      keyPoints: [
        'Người dùng chỉ cần chấm 1 vị trí đáy sản phẩm duy nhất.',
        'Hệ thống tự động tính vùng crop nhỏ (editRegion) để tối ưu độ phân giải và giảm thời gian render (~7.9s).',
        'Ảnh kết quả từ AI được tự động ghép ngược lại vào ảnh phòng gốc, giữ nguyên 100% các đồ đạc và không gian bên ngoài vùng crop.',
      ],
    },
  },
  {
    id: 'ai-2',
    deckId: 'ai-studio',
    question: 'Luồng kỹ thuật của Room Studio One-touch được thực hiện cụ thể qua những bước nào trong code?',
    answer: {
      summary: 'Gồm 4 bước: 1. Tạo Crop hướng dẫn (Frontend) -> 2. Gửi API qua Backend -> 3. Cloudflare Workers AI xử lý -> 4. Ghép Composite ảnh (Frontend).',
      sourceLocation: 'client/src/pages/RoomStudioPage.jsx (hàm previewRoom)',
      difficulty: '⭐⭐⭐⭐ (Cao)',
      whatIfRemoved: 'Nếu thiếu bước Crop, gửi cả ảnh phòng to vào AI sẽ bị mờ chi tiết sản phẩm và AI sẽ tự ý vẽ lại toàn bộ căn phòng làm mất tính chân thực.',
      howToExtend: 'Thêm thanh điều chỉnh độ rộng của vùng crop để người dùng linh hoạt với các đồ vật lớn.',
      keyPoints: [
        'Bước 1: roomPreviewCanvas.js tạo input_image_0 (crop phòng) và input_image_1 (sản phẩm PNG tách nền).',
        'Bước 2: Gửi multipart/form-data tới backend qua POST /api/room-previews.',
        'Bước 3: cloudflareImageService.js gọi model @cf/black-forest-labs/flux-2-klein-4b.',
        'Bước 4: Canvas frontend nhận ảnh crop AI trả về, vẽ đè đúng vị trí editRegion lên ảnh gốc và tự lưu vào CollectionContext.',
      ],
    },
  },
  {
    id: 'ai-3',
    deckId: 'ai-studio',
    question: 'Tại sao vị trí ghim của sản phẩm lại được lưu dưới dạng số chuẩn hóa (Normalized 0 đến 1) mà không lưu pixel (px)?',
    answer: {
      summary: 'Để vị trí sản phẩm chính xác tuyệt đối trên mọi kích thước màn hình (Desktop, Tablet, Mobile) và không phụ thuộc vào độ phân giải ảnh gốc.',
      sourceLocation: 'client/src/pages/RoomStudioPage.jsx (hàm updateTargetFromPointer) & server/src/controllers/roomPreviewController.js',
      difficulty: '⭐⭐⭐ (Trung bình - Thầy cô rất thích hỏi)',
      whatIfRemoved: 'Nếu lưu bằng pixel (ví dụ: x=300px, y=400px), khi xem trên điện thoại hoặc màn hình nhỏ hơn ảnh sẽ bị đặt lệch hoàn toàn khỏi vị trí ban đầu.',
      howToExtend: 'Lưu thêm góc xoay normalized hoặc tỷ lệ chiều cao tương đối của trần nhà.',
      keyPoints: [
        'target.x = (clientX - rect.left) / rect.width (cho ra giá trị từ 0 đến 1).',
        'Lấy góc trên bên trái ảnh làm gốc (0, 0).',
        'Anchor được chốt là bottom-center (đáy sản phẩm tiếp xúc mặt sàn).',
      ],
    },
  },

  // --- DECK 2: BACKEND MVC TRỰC DIỆN ---
  {
    id: 'be-1',
    deckId: 'backend-mvc',
    question: 'Tại sao Backend FurneeHome lại thiết kế theo mô hình Controller trực diện (Direct MVC) mà không chia nhiều tầng Service phức tạp?',
    answer: {
      summary: 'Để code trực diện, trong sáng, dễ hiểu, mỗi hàm chỉ 10-15 dòng, tránh over-engineering và giúp toàn bộ thành viên trong nhóm đều hiểu và làm chủ code.',
      sourceLocation: 'server/src/controllers/productController.js, authController.js, roomDesignController.js',
      difficulty: '⭐⭐⭐ (Trung bình)',
      whatIfRemoved: 'Nếu tạo quá nhiều tầng service trung gian chỉ để bọc 1 dòng Mongoose query sẽ làm tăng độ phức tạp không cần thiết và khó debug khi bảo vệ đồ án.',
      howToExtend: 'Chỉ tách Service khi có logic bên thứ 3 phức tạp như cloudflareImageService.js.',
      keyPoints: [
        'Controller nhận req -> Validate -> Gọi Mongoose Model trực tiếp (find, create, findByIdAndUpdate) -> Trả về res.json().',
        'Mô hình chuẩn mực giống bài thực hành SDN (pretest2).',
        'Dễ dàng giải trình từng dòng code cho giảng viên chấm bài.',
      ],
    },
  },
  {
    id: 'be-2',
    deckId: 'backend-mvc',
    question: 'Bảo mật biến môi trường (.env) trong dự án được tổ chức như thế nào và tại sao?',
    answer: {
      summary: 'Dự án dùng duy nhất 1 file .env đặt tại thư mục gốc, được .gitignore bảo vệ tuyệt đối không bao giờ push lên GitHub.',
      sourceLocation: 'server/src/config/env.js & .gitignore',
      difficulty: '⭐⭐ (Cơ bản nhưng bắt buộc phải nắm)',
      whatIfRemoved: 'Nếu commit .env lên Git, các token Cloudflare API và connection string MongoDB sẽ bị lộ ra ngoài, có thể bị tấn công hoặc trừ tiền tài khoản.',
      howToExtend: 'Dùng Doppler hoặc HashiCorp Vault nếu triển khai môi trường doanh nghiệp quy mô lớn.',
      keyPoints: [
        'env.js tự động đọc .env ở root (../../../.env).',
        'Cung cấp .env.example ở thư mục gốc để thành viên mới clone về chỉ cần điền key cá nhân.',
        'Frontend client không lưu token bí mật nào cả.',
      ],
    },
  },
  {
    id: 'be-3',
    deckId: 'backend-mvc',
    question: 'Schema RoomDesign trong MongoDB lưu trữ những thông tin gì cho mẫu phòng 2D?',
    answer: {
      summary: 'Lưu thông tin mẫu phòng đã ghép AI gồm: user, tên mẫu, productId, productName, tọa độ normalized target (x, y, anchor), ảnh composite resultImage, model AI và thời gian xử lý.',
      sourceLocation: 'server/src/models/RoomDesign.js',
      difficulty: '⭐⭐⭐ (Trung bình)',
      whatIfRemoved: 'Nếu giữ schema 3D cũ (x, y, z, rotationY), dữ liệu sẽ không khớp với giao diện 2D Studio và Collection.',
      howToExtend: 'Thêm mảng nhiều sản phẩm trong 1 phòng hoặc liên kết chia sẻ công khai (public shareable link).',
      keyPoints: [
        'target: { x: Number (0..1), y: Number (0..1), anchor: "bottom-center" }.',
        'resultImage: lưu data URL hoặc CDN link của ảnh ghép hoàn chỉnh.',
        'timestamps: tự động tạo createdAt và updatedAt.',
      ],
    },
  },

  // --- DECK 3: FRONTEND REACT & PURE CSS ---
  {
    id: 'fe-1',
    deckId: 'frontend-css',
    question: 'Tại sao nhóm quyết định gỡ bỏ Tailwind CSS và sử dụng 100% CSS thuần (Pure CSS + CSS Variables)?',
    answer: {
      summary: 'Để tối ưu tốc độ build (chỉ mất 224ms), giảm tải dung lượng, độc lập thư viện và giúp tất cả thành viên trong nhóm đều dễ đọc hiểu và chỉnh sửa CSS.',
      sourceLocation: 'client/src/styles/theme.css & client/src/styles/global.css',
      difficulty: '⭐⭐⭐ (Rất hay được hỏi)',
      whatIfRemoved: 'Nếu giữ Tailwind nửa vời mà không dùng utility classes trong JSX sẽ làm nặng package.json và dễ gây xung đột phiên bản Tailwind v4 giữa máy các bạn.',
      howToExtend: 'Dễ dàng thêm chế độ Dark Mode chỉ bằng cách thay đổi các biến màu sắc trong :root của theme.css.',
      keyPoints: [
        'theme.css: Chứa toàn bộ Design Tokens (CSS Variables: --color-primary, --color-accent, --radius-small...).',
        'global.css: Chứa các class giao diện ngữ nghĩa chuẩn (.product-card, .room-stage, .button, .saved-card...).',
        'Không phụ thuộc bất kỳ build plugin CSS nặng nề nào.',
      ],
    },
  },
  {
    id: 'fe-2',
    deckId: 'frontend-css',
    question: 'Trạng thái dữ liệu ở Frontend (Bộ sưu tập & Đăng nhập) được quản lý như thế nào trong giai đoạn MVP?',
    answer: {
      summary: 'Được quản lý thông qua React Context API (CollectionContext và AuthContext) và tự động đồng bộ hóa xuống localStorage của trình duyệt.',
      sourceLocation: 'client/src/context/CollectionContext.jsx & client/src/context/AuthContext.jsx',
      difficulty: '⭐⭐⭐ (Trung bình)',
      whatIfRemoved: 'Nếu không dùng Context, người dùng load lại trang sẽ bị mất danh sách sản phẩm yêu thích và các ảnh phòng AI đã tạo.',
      howToExtend: 'Khi kết nối MongoDB chính thức, chỉ cần thay thế hàm gọi localStorage bằng các hàm gọi API axios trong client/src/services.',
      keyPoints: [
        'CollectionContext: Hỗ trợ lưu cả sản phẩm thả tim (type: "product") và mẫu phòng AI (type: "room-template").',
        'AuthContext: Quản lý modal đăng nhập dùng chung (LoginModal.jsx), chuyển đổi vai trò customer/admin.',
        'Tuân thủ Single Source of Truth cho toàn bộ ứng dụng.',
      ],
    },
  },

  // --- DECK 4: TOOL SHOPEE & DATABASE ---
  {
    id: 'tool-1',
    deckId: 'tool-data',
    question: 'Tool cào dữ liệu Shopee (tools/importProducts.js) hoạt động như thế nào và đem lại lợi ích gì?',
    answer: {
      summary: 'Là một script Node.js độc lập: đọc danh sách link Shopee -> gửi HTTP request bóc tách JSON-LD & meta tags -> tự động tạo Category -> upsert trực tiếp vào MongoDB collection products.',
      sourceLocation: 'tools/importProducts.js',
      difficulty: '⭐⭐⭐⭐ (Cao - Thể hiện năng lực tự động hóa)',
      whatIfRemoved: 'Nhóm sẽ phải nhập tay từng sản phẩm vào database, mất rất nhiều thời gian và dễ sai sót về giá/kích thước.',
      howToExtend: 'Tích hợp thêm tự động gọi API tách nền ảnh (rembg) cho sản phẩm cào về.',
      keyPoints: [
        'Chạy 1 lệnh duy nhất: node tools/importProducts.js.',
        'Bóc tách: Tên SP, giá bán (VND), ảnh thumbnail, mô tả, tên shop bán.',
        'Tự động phân loại danh mục (Bàn học, Ghế, Đèn, Tủ...) dựa trên phân tích từ khóa tên sản phẩm.',
        'Tự động xuất 1 bản backup offline tại client/public/data_import/data_import.json.',
      ],
    },
  },

  // --- DECK 5: CÂU HỎI VẤN ĐÁP NÂNG CAO ---
  {
    id: 'qna-1',
    deckId: 'defence-qna',
    question: 'Tại sao nhóm quyết định chuyển hướng (Pivot) từ Mô hình phòng 3D (Three.js) sang 2D Room Studio + AI?',
    answer: {
      summary: 'Vì phòng 3D đòi hỏi người dùng phải tự dựng kích thước phòng và tải file 3D .glb phức tạp, không thực tế với sinh viên. Trải nghiệm chụp ảnh phòng thật rồi nhờ AI 2D gắn sản phẩm vào tự nhiên hơn rất nhiều.',
      sourceLocation: 'README.md (Mục Lịch sử chuyển dịch kiến trúc) & client/src/pages/RoomStudioPage.jsx',
      difficulty: '⭐⭐⭐⭐⭐ (Câu hỏi chiến lược cốt lõi)',
      whatIfRemoved: 'Nếu cố làm 3D nửa vời không có thư viện model chuẩn, giao diện sẽ thô cứng và người dùng không thấy được sự chân thực của căn phòng thật.',
      howToExtend: 'Có thể kết hợp AR xem trước không gian nếu phát triển trên Mobile App.',
      keyPoints: [
        'Khách hàng mục tiêu là sinh viên, người thuê phòng nhỏ: chỉ cần chụp 1 tấm ảnh phòng.',
        'AI tạo bóng đổ (contact shadow) và ánh sáng hài hòa với bối cảnh phòng thật.',
        'Đơn giản hóa thao tác: Tải ảnh -> Chọn đồ -> Chấm điểm đặt -> Xem kết quả.',
      ],
    },
  },
  {
    id: 'qna-2',
    deckId: 'defence-qna',
    question: 'Nếu hệ thống AI của Cloudflare bị lỗi hoặc mất mạng thì giao diện người dùng hiển thị như thế nào?',
    answer: {
      summary: 'Hệ thống có cơ chế Fallback an toàn: Vẫn hiển thị ảnh sản phẩm 2D overlay tại đúng vị trí chấm ghim trên ảnh phòng của người dùng và thông báo lỗi thân thiện, không làm sập ứng dụng.',
      sourceLocation: 'client/src/pages/RoomStudioPage.jsx (khối try/catch trong previewRoom)',
      difficulty: '⭐⭐⭐⭐ (Độ chịu lỗi & UX)',
      whatIfRemoved: 'Nếu không có fallback, khi API lỗi màn hình sẽ bị trắng xóa hoặc mất ảnh, người dùng không biết sản phẩm nằm ở đâu.',
      howToExtend: 'Thêm cơ chế tự động thử lại (retry with exponential backoff) ở backend service.',
      keyPoints: [
        'Dùng room-product-preview hiển thị tạm thời trên Canvas.',
        'Thông báo rõ: "Ảnh AI chưa tạo được. Vẫn giữ bản xem sản phẩm đúng vị trí; bạn có thể thử lại."',
        'Backend trả mã HTTP 502/503 kèm diagnostic an toàn (đã redact token bí mật).',
      ],
    },
  },
  {
    id: 'qna-3',
    deckId: 'defence-qna',
    question: 'Nếu muốn thêm một tính năng mới (ví dụ: chia sẻ mẫu phòng qua mạng xã hội), cần sửa ở những file nào?',
    answer: {
      summary: 'Chỉ cần sửa 3 nơi: 1. Thêm endpoint Backend (roomDesignRoutes.js) -> 2. Viết hàm Controller (roomDesignController.js) -> 3. Thêm nút Copy Link/Share tại CollectionPage.jsx.',
      sourceLocation: 'server/src/routes/roomDesignRoutes.js, server/src/controllers/roomDesignController.js, client/src/pages/CollectionPage.jsx',
      difficulty: '⭐⭐⭐ (Kiểm tra độ hiểu kiến trúc mở rộng)',
      whatIfRemoved: 'Chứng minh kiến trúc phân lớp của dự án rất linh hoạt và dễ bảo trì.',
      howToExtend: 'Tạo mã QR dẫn trực tiếp đến mẫu phòng.',
      keyPoints: [
        'Backend: Thêm route GET /api/room-designs/public/:id trả về dữ liệu mẫu phòng.',
        'Frontend: Tạo trang /share/:id hoặc modal hiển thị link rút gọn.',
        'Không ảnh hưởng đến các màn hình Room Studio hay Product List hiện có.',
      ],
    },
  },
];
