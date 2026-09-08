const lines = (text) => text.split('|');
const source = (path, symbol) => ({ path, symbol });
const functionInfo = (name, path, symbol, purpose) => ({ name, path, symbol, purpose });
const juryQuestion = (question, answer, owner) => ({ question, answer, owner });
const flashcard = (question, answer, mistake, sources) => ({ question, answer, mistake, sources });

export const PROJECT = {
  name: 'FurneeHome',
  promise: 'Mua nội thất trực tuyến và xem thử từ một đến ba sản phẩm trong ảnh phòng trước khi quyết định.',
  audience: 'Sinh viên, học sinh, công nhân và gia đình phổ thông.',
  wow: 'Phòng thử AI: chọn từ một đến ba sản phẩm, tải ảnh phòng, nhập vị trí và tạo ảnh.',
};

export const MEMBERS = [
  { id: 'hiep', name: 'Hiệp', difficulty: 1, label: 'Khó nhất', mission: 'Kiến trúc, dữ liệu, bảo mật, Phòng thử AI và triển khai.', lessonIds: ['architecture', 'ai-room', 'quality'], handoff: 'Kết luận giá trị, giới hạn thật và cách hệ thống được triển khai.' },
  { id: 'phuc', name: 'Phúc', difficulty: 2, label: 'Khó thứ hai', mission: 'Tài khoản, OTP, đơn hàng, MongoDB và quyền quản trị.', lessonIds: ['account', 'order', 'admin'], handoff: 'Bàn giao cho Hiệp giải thích pipeline AI và vận hành.' },
  { id: 'trieu', name: 'Triều', difficulty: 3, label: 'Khó thứ ba', mission: 'Chi tiết sản phẩm, giỏ hàng và trải nghiệm sau mua.', lessonIds: ['product', 'cart', 'after-sale'], handoff: 'Bàn giao cho Phúc giải thích xác thực, tạo đơn và quản trị.' },
  { id: 'dung', name: 'Dũng', difficulty: 4, label: 'Dễ nhất', mission: 'Bài toán, người dùng, trang chủ và hành trình tìm sản phẩm.', lessonIds: ['pitch', 'journey', 'catalog'], handoff: 'Bàn giao cho Triều khi khách đã tìm được sản phẩm.' },
];

export const LESSONS = [
  {
    id: 'pitch',
    number: '01',
    owner: 'Dũng',
    title: 'Bài toán và giá trị',
    route: '/',
    summary: 'Vì sao FurneeHome tồn tại và điểm wow phục vụ việc mua hàng thế nào?',
    keyPoints: lines('Khách phổ thông khó hình dung món nội thất có hợp phòng thật hay không.|FurneeHome gom xem sản phẩm, giá, tồn kho, giỏ, đặt COD và theo dõi đơn vào một nơi.|Điểm khác biệt là tạo ảnh thử từ một đến ba sản phẩm trong phòng trước khi mua.|AI hỗ trợ quyết định; nghiệp vụ chính vẫn là bán hàng.'),
    sequence: lines('Nhu cầu thật|Chọn nội thất|Mua hàng|Theo dõi đơn|Ảnh thử AI'),
    rules: lines('Giá và tồn kho thuộc FurneeHome.|Thanh toán chốt là COD.|Không gọi ảnh AI là bản vẽ kỹ thuật chính xác.'),
    demo: {
      actions: lines('Mở Trang chủ.|Chỉ hai lối vào: Sản phẩm và Phòng thử.|Nói khách hàng mục tiêu trong một câu.'),
      expected: 'Giám khảo hiểu đề tài trước khi nghe tên công nghệ.',
      fallback: 'Nếu ảnh hero chậm, dùng tiêu đề và hai nút điều hướng để tiếp tục.',
    },
    functions: [
      functionInfo('HomePage', 'client/src/pages/HomePage.jsx', 'HomePage', 'Ghép lời giới thiệu, sản phẩm nổi bật và lối vào Phòng thử.'),
      functionInfo('router', 'client/src/router.jsx', 'createBrowserRouter', 'Ánh xạ URL tới các trang.'),
    ],
    questions: [
      juryQuestion('Điểm mới của đề tài là gì?', 'Website bán nội thất hoàn chỉnh có thêm bước xem thử sản phẩm trong ảnh phòng bằng AI.', 'Dũng'),
      juryQuestion('AI có phải chức năng chính không?', 'Bán hàng là nghiệp vụ chính; AI là điểm wow hỗ trợ quyết định.', 'Hiệp'),
      juryQuestion('Vì sao chọn COD?', 'COD đủ cho đặt và quản lý đơn mà không phụ thuộc cổng thanh toán.', 'Dũng'),
    ],
    cards: [
      flashcard('Nói FurneeHome trong một câu.', 'Website bán nội thất có giá, giỏ hàng, đơn COD và ảnh thử AI.', 'Kể thư viện nhưng không nói giá trị.', [source('README.md', 'FurneeHome')]),
      flashcard('Khách hàng chính là ai?', 'Người học, công nhân và gia đình phổ thông cần nội thất dễ chọn, giá rõ.', 'Nói chung chung là mọi người.', [source('README.md', 'Người sử dụng')]),
    ],
  },
  {
    id: 'journey',
    number: '02',
    owner: 'Dũng',
    title: 'Bức tranh toàn hệ thống',
    route: '/',
    summary: 'Một giao dịch hoàn chỉnh và trách nhiệm của từng vai trò.',
    keyPoints: lines('Khách xem catalog mà chưa cần đăng nhập.|Khách mở chi tiết, chọn số lượng và thêm giỏ.|Checkout yêu cầu đăng nhập, địa chỉ và COD.|Backend đọc lại giá và tồn kho rồi tạo đơn MongoDB.|Admin xử lý đơn; Orchestra Admin quản lý quyền.|Phòng thử AI hỗ trợ trước quyết định mua.'),
    sequence: lines('Khám phá|Chọn món|Giỏ hàng|Đặt COD|Admin xử lý|Khách nhận hàng'),
    rules: lines('Customer chỉ xem đơn của mình.|Admin vận hành cửa hàng.|Orchestra Admin mới thay đổi quyền.|Backend quyết định quyền cuối cùng.'),
    demo: {
      actions: lines('Đi nhanh Home → Sản phẩm → Chi tiết → Giỏ.|Chỉ đường dẫn Đơn hàng và Quản trị.|Mở Phòng thử để nối điểm wow.'),
      expected: 'Các trang tạo thành một câu chuyện thống nhất.',
      fallback: 'Nếu chưa đăng nhập, dừng ở giỏ và giải thích checkout sẽ yêu cầu đăng nhập.',
    },
    functions: [
      functionInfo('Header', 'client/src/components/layout/Header.jsx', 'Header', 'Điều hướng theo vai trò và hiển thị số lượng giỏ.'),
      functionInfo('MainLayout', 'client/src/components/layout/MainLayout.jsx', 'MainLayout', 'Giữ Header, trang, Footer và modal dùng chung.'),
    ],
    questions: [
      juryQuestion('Có những vai trò nào?', 'Customer, Admin và Orchestra Admin.', 'Dũng'),
      juryQuestion('Vì sao checkout yêu cầu đăng nhập?', 'Để gắn đơn đúng chủ và bảo vệ lịch sử/hủy đơn.', 'Phúc'),
      juryQuestion('Ẩn nút admin đã đủ an toàn?', 'Chưa; backend vẫn kiểm tra JWT và role.', 'Phúc'),
    ],
    cards: [
      flashcard('Hành trình mua hàng là gì?', 'Khám phá → chọn món → giỏ → đặt COD → xử lý → nhận hàng.', 'Học từng trang nhưng không nối được câu chuyện.', [source('client/src/router.jsx', 'router')]),
      flashcard('Ai quyết định quyền admin?', 'Middleware backend dựa trên user đã xác thực.', 'Cho rằng ẩn menu là đủ.', [source('server/src/middleware/authMiddleware.js', 'requireAdmin')]),
    ],
  },
  {
    id: 'catalog',
    number: '03',
    owner: 'Dũng',
    title: 'Tìm và chọn sản phẩm',
    route: '/products',
    summary: 'Từ danh sách lớn đến món phù hợp, còn hàng và có giá rõ.',
    keyPoints: lines('ProductContext tải danh sách và giữ loading, error, data.|Khách tìm tên, lọc danh mục và sắp xếp giá.|Card hiển thị ảnh, tên, giá, tồn kho và hành động chính.|Sản phẩm ngừng bán hoặc hết hàng không được checkout.'),
    sequence: lines('API sản phẩm|Tìm và lọc|Danh sách|Mở chi tiết'),
    rules: lines('Giá là số VND hợp lệ.|MongoDB là nguồn giao dịch.|JSON chỉ dùng seed hoặc demo.'),
    demo: {
      actions: lines('Nhập từ khóa.|Chọn danh mục.|Đổi sắp xếp giá.|Mở một món còn hàng.'),
      expected: 'Danh sách và trang chi tiết giữ đúng sản phẩm.',
      fallback: 'API lỗi thì báo rõ và không checkout bằng dữ liệu cũ.',
    },
    functions: [
      functionInfo('fetchProducts', 'client/src/context/ProductContext.jsx', 'fetchProducts', 'Tải sản phẩm và cập nhật trạng thái.'),
      functionInfo('list', 'server/src/controllers/productController.js', 'async function list', 'Đọc sản phẩm đang bán từ MongoDB.'),
      functionInfo('ProductCard', 'client/src/components/product/ProductCard.jsx', 'ProductCard', 'Trình bày thông tin mua hàng của một món.'),
    ],
    questions: [
      juryQuestion('Tìm kiếm nằm ở đâu?', 'Bản nhỏ lọc ở React; khi dữ liệu lớn sẽ đưa search và pagination về API.', 'Dũng'),
      juryQuestion('Hết hàng xử lý sao?', 'UI khóa mua; cart và order vẫn kiểm tra lại stock.', 'Phúc'),
      juryQuestion('MongoDB lỗi có checkout bằng JSON?', 'Không; giao dịch cần một nguồn giá và kho duy nhất.', 'Hiệp'),
    ],
    cards: [
      flashcard('Card sản phẩm tối thiểu có gì?', 'Ảnh, tên, giá, tồn kho và hành động xem/mua.', 'Đưa thông số AI lên trước thông tin mua.', [source('client/src/components/product/ProductCard.jsx', 'ProductCard')]),
      flashcard('Vì sao backend vẫn kiểm tra stock?', 'Request có thể bị sửa hoặc stock đã đổi.', 'Tin trạng thái UI cũ.', [source('server/src/controllers/orderController.js', 'createOrder')]),
    ],
  },
  {
    id: 'product',
    number: '04',
    owner: 'Triều',
    title: 'Chi tiết và quyết định mua',
    route: '/products/:id',
    summary: 'Khách hiểu món đồ, chọn số lượng và cho vào giỏ.',
    keyPoints: lines('Trang hiển thị ảnh, mô tả, giá, kích thước và tồn kho.|Số lượng từ 1 đến stock.|Thêm giỏ chưa tạo đơn và chưa giảm kho.|Đánh giá và báo nội dung có mục đích khác nhau.'),
    sequence: lines('Xem thông tin|Chọn số lượng|Thêm giỏ|Tiếp tục mua'),
    rules: lines('Inactive hoặc không tồn tại trả 404.|Giá client không phải giá chốt.|Đánh giá gắn user và product.'),
    demo: {
      actions: lines('Mở chi tiết.|Tăng hoặc giảm số lượng.|Thêm giỏ.|Xem đánh giá hoặc báo nội dung.'),
      expected: 'Badge giỏ tăng và đúng món xuất hiện.',
      fallback: 'Ảnh lỗi thì hiện ảnh thay thế nhưng tên, giá và nút vẫn dùng được.',
    },
    functions: [
      functionInfo('ProductDetailPage', 'client/src/pages/ProductDetailPage.jsx', 'ProductDetailPage', 'Trình bày quyết định mua.'),
      functionInfo('addToCart', 'client/src/context/CartContext.jsx', 'addToCart', 'Thêm hoặc cộng số lượng món đã có.'),
      functionInfo('getByProduct', 'server/src/controllers/reviewController.js', 'getByProduct', 'Đọc đánh giá đúng sản phẩm.'),
    ],
    questions: [
      juryQuestion('Thêm giỏ có giảm stock?', 'Không; stock chỉ đổi khi backend tạo đơn.', 'Triều'),
      juryQuestion('Giá đổi sau khi đặt?', 'Order giữ snapshot nên đơn cũ không đổi.', 'Phúc'),
      juryQuestion('Review khác report?', 'Review chia sẻ trải nghiệm; report tạo ticket cho admin.', 'Triều'),
    ],
    cards: [
      flashcard('Thêm giỏ khác đặt hàng?', 'Giỏ còn sửa; order là giao dịch đã lưu MongoDB.', 'Nói thêm giỏ đã bán được hàng.', [source('server/src/models/Cart.js', 'cartSchema'), source('server/src/models/Order.js', 'orderSchema')]),
      flashcard('Vì sao order giữ snapshot?', 'Để lịch sử không đổi khi admin sửa sản phẩm.', 'Dùng giá Product hiện tại cho đơn cũ.', [source('server/src/models/Order.js', 'orderItemSchema')]),
    ],
  },
  {
    id: 'cart',
    number: '05',
    owner: 'Triều',
    title: 'Giỏ hàng',
    route: '/cart',
    summary: 'Gom lựa chọn, sửa số lượng và chuẩn bị checkout.',
    keyPoints: lines('Khách có giỏ tạm để không bị ép đăng nhập sớm.|Mỗi dòng có món, đơn giá, số lượng và thành tiền.|Có tăng, giảm, xóa món và xóa toàn bộ.|Khi đăng nhập, giỏ được đồng bộ MongoDB.|Tổng ở Cart chỉ để hiển thị; createOrder tính lại.'),
    sequence: lines('Thêm món|Sửa số lượng|Kiểm tra stock|Tạm tính|Sang checkout'),
    rules: lines('Không vượt stock.|Giỏ rỗng dẫn về mua hàng.|Không tin giá cũ khi tạo đơn.'),
    demo: {
      actions: lines('Thêm hai món.|Tăng một món.|Xóa món còn lại.|Tải lại trang.|Bấm Đặt hàng.'),
      expected: 'Số lượng, tạm tính và badge luôn khớp.',
      fallback: 'Đồng bộ lỗi thì giữ lựa chọn và báo chưa thể checkout.',
    },
    functions: [
      functionInfo('CartProvider', 'client/src/context/CartContext.jsx', 'CartProvider', 'Giữ items và thao tác giỏ toàn ứng dụng.'),
      functionInfo('addToCart', 'server/src/controllers/cartController.js', 'addToCart', 'Kiểm tra sản phẩm và cập nhật giỏ user.'),
      functionInfo('updateQuantity', 'server/src/controllers/cartController.js', 'updateQuantity', 'Đổi số lượng hoặc xóa món.'),
    ],
    questions: [
      juryQuestion('Vì sao giỏ khách dùng localStorage?', 'Đó là lựa chọn tạm; giao dịch vẫn qua backend.', 'Triều'),
      juryQuestion('Đăng nhập máy khác thì sao?', 'Giỏ MongoDB có thể tải lại; giỏ khách chỉ ở máy cũ.', 'Phúc'),
      juryQuestion('Client gửi giá 1 đồng thì sao?', 'Order controller bỏ qua và đọc Product.price.', 'Phúc'),
    ],
    cards: [
      flashcard('Giỏ có phải đơn?', 'Không; giỏ còn sửa, đơn là snapshot.', 'Dùng một model cho cả hai vòng đời.', [source('server/src/models/Cart.js', 'cartSchema')]),
      flashcard('Ai tính tổng cuối?', 'Backend trong createOrder.', 'Tin totalPrice từ React.', [source('server/src/controllers/orderController.js', 'createOrder')]),
    ],
  },
  {
    id: 'after-sale',
    number: '06',
    owner: 'Triều',
    title: 'Sau mua và chăm sóc khách',
    route: '/feedback',
    summary: 'Theo dõi đơn, đánh giá, góp ý và báo nội dung để được quản trị viên xử lý.',
    keyPoints: lines('Lịch sử đơn lấy MongoDB theo đúng user.|Review gắn trải nghiệm với một sản phẩm.|Liên hệ hoặc báo nội dung tạo phiếu để admin xử lý.|Profile chỉ lưu thông tin cá nhân được phép sửa.'),
    sequence: lines('Xem đơn|Nhận hàng|Đánh giá|Gửi liên hệ|Admin xử lý'),
    rules: lines('Không xem đơn của người khác.|Order, Review và Feedback là ba dữ liệu có mục đích khác nhau.|Báo nội dung không tự xóa sản phẩm.'),
    demo: {
      actions: lines('Mở lịch sử đơn.|Mở chi tiết sản phẩm và gửi đánh giá.|Bấm Báo nội dung.|Mở Liên hệ và gửi góp ý.'),
      expected: 'Đơn, đánh giá và phiếu liên hệ đều hiện đúng người và đúng mục đích.',
      fallback: 'Nếu chưa có đơn Delivered, chỉ demo liên hệ và giải thích điều kiện gửi review.',
    },
    functions: [
      functionInfo('OrderHistoryPage', 'client/src/pages/OrderHistoryPage.jsx', 'OrderHistoryPage', 'Hiển thị đơn của user.'),
      functionInfo('createReview', 'server/src/controllers/reviewController.js', 'createReview', 'Kiểm tra quyền đánh giá và cập nhật điểm.'),
      functionInfo('createFeedback', 'server/src/controllers/feedbackController.js', 'async function create', 'Tạo góp ý hoặc báo nội dung.'),
    ],
    questions: [
      juryQuestion('Review khác liên hệ?', 'Review chia sẻ trải nghiệm sản phẩm; liên hệ tạo phiếu để admin xử lý.', 'Triều'),
      juryQuestion('Báo nội dung có xóa ngay sản phẩm?', 'Không; admin phải kiểm tra rồi mới quyết định.', 'Triều'),
      juryQuestion('Người chưa nhận hàng có đánh giá được không?', 'Không; backend yêu cầu đơn Delivered chứa sản phẩm đó.', 'Phúc'),
    ],
    cards: [
      flashcard('Order history lưu ở đâu?', 'MongoDB và được lọc theo user đăng nhập.', 'Lưu lịch sử chỉ trong trình duyệt.', [source('server/src/models/Order.js', 'orderSchema')]),
      flashcard('Báo nội dung tạo gì?', 'Một Feedback có loại, mục tiêu, nội dung và trạng thái xử lý.', 'Đồng nhất báo nội dung với xóa sản phẩm.', [source('server/src/models/Feedback.js', 'feedbackSchema')]),
    ],
  },
  {
    id: 'account',
    number: '07',
    owner: 'Phúc',
    title: 'Tài khoản, hồ sơ và OTP',
    route: '/profile',
    summary: 'Xác định đúng người trước khi xem dữ liệu riêng hoặc đặt hàng.',
    keyPoints: lines('Đăng ký xác minh email bằng OTP rồi mới tạo mật khẩu.|Login so sánh password hash và trả JWT.|Hồ sơ chỉ sửa field cho phép, không sửa role.|Quên mật khẩu tạo OTP ngắn hạn và chỉ lưu hash.|Production gửi OTP qua SMTP Gmail và không trả OTP ra giao diện.'),
    sequence: lines('Nhập email|Nhận OTP|Tạo tài khoản|Đăng nhập|JWT|Sửa hồ sơ hoặc đặt lại mật khẩu'),
    rules: lines('Password dùng bcrypt.|OTP hết hạn sau 10 phút và không lưu dạng rõ.|Route riêng nạp lại user active.|Response quên mật khẩu không làm lộ email có tồn tại.'),
    demo: {
      actions: lines('Đăng ký bằng email.|Đăng xuất rồi đăng nhập.|Sửa hồ sơ.|Thử luồng quên mật khẩu.'),
      expected: 'OTP đến đúng email, phiên đúng user và mật khẩu mới đăng nhập được.',
      fallback: 'Local có thể dùng devOtp; production dùng SMTP Gmail và tắt devOtp.',
    },
    functions: [
      functionInfo('registerRequest', 'server/src/controllers/authController.js', 'async function registerRequest', 'Tạo và gửi OTP đăng ký.'),
      functionInfo('completeRegistration', 'server/src/controllers/authController.js', 'completeRegistration', 'Kiểm tra OTP rồi hash mật khẩu.'),
      functionInfo('login', 'server/src/controllers/authController.js', 'async function login', 'Xác minh tài khoản rồi tạo JWT.'),
      functionInfo('requestPasswordReset', 'server/src/controllers/authController.js', 'requestPasswordReset', 'Tạo OTP đặt lại mật khẩu và gửi email.'),
    ],
    questions: [
      juryQuestion('JWT có chứa mật khẩu không?', 'Không; token chỉ chứa userId cần thiết và chữ ký.', 'Phúc'),
      juryQuestion('Xem database có thấy OTP không?', 'Không thấy mã rõ; chỉ có hash và thời hạn.', 'Phúc'),
      juryQuestion('User gửi role admin trong profile thì sao?', 'Controller không nhận field role; quyền chỉ đổi trong nghiệp vụ quản trị.', 'Phúc'),
      juryQuestion('OTP Gmail hoạt động thế nào?', 'Nodemailer đăng nhập SMTP bằng Gmail App Password rồi gửi mã 6 số.', 'Phúc'),
    ],
    cards: [
      flashcard('Password kiểm tra thế nào?', 'bcrypt.compare so mật khẩu nhập với hash.', 'So hai chuỗi plaintext.', [source('server/src/controllers/authController.js', 'bcrypt.compare')]),
      flashcard('OTP local khác production?', 'Local có thể hiện devOtp; production gửi SMTP và không trả mã.', 'Bật devOtp trên Render.', [source('server/src/controllers/authController.js', 'devOtp')]),
      flashcard('Ai được sửa role?', 'Chỉ Orchestra Admin thông qua updateUser.', 'Cho phép profile tự gửi role.', [source('server/src/controllers/adminController.js', 'updateUser')]),
    ],
  },
  {
    id: 'order',
    number: '08',
    owner: 'Phúc',
    title: 'Checkout và vòng đời đơn',
    route: '/checkout',
    summary: 'Biến giỏ thành giao dịch COD đúng giá, đúng kho và truy vết được.',
    keyPoints: lines('Checkout cần người nhận, điện thoại và địa chỉ.|Client gửi productId và quantity, không quyết định giá.|Server đọc Product, kiểm tra stock và chốt snapshot.|Stock giảm có điều kiện; lỗi giữa chừng phải rollback.|Tạo Order xong mới xóa giỏ.|Hủy đúng giai đoạn và hoàn kho đúng một lần.'),
    sequence: lines('Nhận địa chỉ|Đọc giá thật|Giữ kho|Tạo snapshot|Xóa giỏ|Theo dõi trạng thái'),
    rules: lines('Không tin price, total hoặc owner từ client.|Đơn cũ không đổi theo Product.|Trạng thái đi theo bước hợp lệ.|Không hoàn kho hai lần.'),
    demo: {
      actions: lines('Điền checkout COD.|Mở Đơn của tôi.|Admin đổi trạng thái.|Customer tải lại.|Thử hủy đơn Pending.'),
      expected: 'Có mã đơn, tổng đúng, stock đúng và trạng thái đồng bộ.',
      fallback: 'Hết hàng thì giữ giỏ và báo đúng món cần sửa.',
    },
    functions: [
      functionInfo('createOrder', 'server/src/controllers/orderController.js', 'createOrder', 'Đọc giá thật, giữ stock và tạo snapshot.'),
      functionInfo('getMyOrders', 'server/src/controllers/orderController.js', 'getMyOrders', 'Chỉ trả đơn của user.'),
      functionInfo('cancelMyOrder', 'server/src/controllers/orderController.js', 'cancelMyOrder', 'Hủy đúng quyền và hoàn stock một lần.'),
      functionInfo('updateOrderStatus', 'server/src/controllers/orderController.js', 'updateOrderStatus', 'Admin chuyển trạng thái hợp lệ.'),
    ],
    questions: [
      juryQuestion('Hai khách mua món cuối cùng?', 'Giảm stock với điều kiện stock đủ; chỉ request hợp lệ thành công.', 'Phúc'),
      juryQuestion('Món sau lỗi khi món trước đã giảm?', 'Controller rollback phần đã giảm.', 'Hiệp'),
      juryQuestion('COD sao có paymentStatus?', 'Để biết chưa thu hay đã thu khi giao.', 'Phúc'),
      juryQuestion('Ai được hủy?', 'Chủ đơn ở giai đoạn cho phép; admin theo quyền.', 'Phúc'),
    ],
    cards: [
      flashcard('Order nhận gì từ client?', 'ProductId, quantity và địa chỉ; không nhận giá làm sự thật.', 'Tin totalAmount từ CheckoutPage.', [source('server/src/controllers/orderController.js', 'createOrder')]),
      flashcard('Snapshot gồm gì?', 'Id, tên, ảnh, đơn giá và số lượng.', 'Chỉ lưu productId.', [source('server/src/models/Order.js', 'orderItemSchema')]),
      flashcard('Hủy bảo vệ gì?', 'Đúng chủ, đúng trạng thái, hoàn kho một lần.', 'Mỗi lần Cancelled lại cộng stock.', [source('server/src/controllers/orderController.js', 'cancelMyOrder')]),
    ],
  },
  {
    id: 'admin',
    number: '09',
    owner: 'Phúc',
    title: 'Quản trị cửa hàng',
    route: '/admin',
    summary: 'Quản lý sản phẩm, kho, đơn, người dùng và phản hồi.',
    keyPoints: lines('Admin quản lý Sản phẩm: giá, tồn kho, ảnh và thông tin AI.|Admin quản lý Khách hàng: xem trạng thái và khóa hoặc mở tài khoản.|Admin quản lý Đơn hàng: xem và cập nhật trạng thái.|Admin quản lý Liên hệ: đọc và đổi trạng thái xử lý.|Orchestra Admin có thêm quyền cấp hoặc thu hồi quyền admin cấp dưới.|Tên hiển thị là Orchestra Admin; giá trị role trong code là superadmin.|Dữ liệu thay đổi được lưu MongoDB rồi giao diện tải lại.'),
    sequence: lines('Sản phẩm và kho|Khách hàng|Đơn hàng|Liên hệ|Admin cấp dưới'),
    rules: lines('Mật khẩu tài khoản demo có thể đổi bằng biến môi trường trước khi seed.|Backend kiểm tra role.|Ưu tiên isActive thay vì xóa món đã bán.'),
    demo: {
      actions: lines('Sửa giá hoặc stock sản phẩm.|Kiểm tra danh sách Khách hàng.|Đổi trạng thái Đơn hàng.|Xử lý Liên hệ.|Dùng Orchestra Admin quản trị admin cấp dưới.'),
      expected: 'Customer thấy dữ liệu mới; gọi API admin bằng customer nhận 403.',
      fallback: 'Seed sẵn bốn tài khoản quản trị và catalog; tạo trước một đơn cùng một liên hệ để demo.',
    },
    functions: [
      functionInfo('productData', 'server/src/controllers/productController.js', 'productData', 'Làm sạch field create hoặc update.'),
      functionInfo('updateOrderStatus', 'server/src/controllers/orderController.js', 'updateOrderStatus', 'Chuyển trạng thái đơn.'),
      functionInfo('updateUser', 'server/src/controllers/adminController.js', 'updateUser', 'Thay role và trạng thái đúng quyền.'),
      functionInfo('seedAccounts', 'server/src/utils/seedData.js', 'seedAccounts', 'Tạo một Orchestra Admin và ba admin cấp dưới.'),
    ],
    questions: [
      juryQuestion('Vì sao không xóa sản phẩm đã bán?', 'isActive ngừng bán mà không phá lịch sử.', 'Phúc'),
      juryQuestion('Admin tự cấp quyền cao nhất được không?', 'Không; controller chỉ cho Orchestra Admin đổi giữa customer và admin, không tạo thêm Orchestra Admin.', 'Phúc'),
      juryQuestion('Đổi giá có đổi đơn cũ?', 'Không vì order giữ snapshot.', 'Phúc'),
    ],
    cards: [
      flashcard('CRUD sản phẩm gồm gì?', 'Thêm, xem, sửa và ngừng bán hoặc xóa theo quy tắc.', 'Form mở được đã gọi là CRUD xong.', [source('server/src/controllers/productController.js', 'module.exports')]),
      flashcard('401 khác 403?', '401 chưa xác thực; 403 thiếu quyền.', 'Dùng một lỗi cho mọi trường hợp.', [source('server/src/middleware/authMiddleware.js', 'requireAdmin')]),
    ],
  },
  {
    id: 'architecture',
    number: '10',
    owner: 'Hiệp',
    title: 'Code, API và MongoDB',
    route: '/api/health',
    summary: 'Một cú bấm đi qua hàm nào và dữ liệu được giữ ở đâu?',
    keyPoints: lines('MongoDB furneeHome dùng 7 collection thật: users, products, categories, carts, orders, reviews và feedbacks.|MongoDB là nguồn dữ liệu đang chạy; data_import.json chỉ thêm dữ liệu lần đầu và không ghi đè sản phẩm đã sửa.|Luồng code là Page → Context hoặc Service → Express Route → Middleware → Controller → Model → MongoDB.|Controller giữ business rule; schema giữ kiểu và ràng buộc dữ liệu.|Response từ API quay lại React để cập nhật giao diện.'),
    sequence: lines('Page|Context hoặc Service|Route|Middleware|Controller|Model và MongoDB|Response'),
    rules: lines('Route định tuyến, controller xử lý, model định nghĩa dữ liệu.|Backend là trust boundary.|Secret chỉ ở biến môi trường backend.'),
    demo: {
      actions: lines('Tạo một order.|Mở Network xem request và response.|Mở route, createOrder và Order model.'),
      expected: 'Kể được đường đi cụ thể thay vì chỉ đọc folder.',
      fallback: 'Dùng bài học và mở ba hàm đã ghi nếu DevTools khó nhìn.',
    },
    functions: [
      functionInfo('apiClient', 'client/src/services/apiClient.js', 'apiClient', 'Đặt base URL và gắn token.'),
      functionInfo('authenticate', 'server/src/middleware/authMiddleware.js', 'authenticate', 'Xác minh JWT.'),
      functionInfo('errorHandler', 'server/src/middleware/errorHandler.js', 'errorHandler', 'Chuẩn hóa lỗi.'),
      functionInfo('orderSchema', 'server/src/models/Order.js', 'orderSchema', 'Định nghĩa đơn hàng.'),
    ],
    questions: [
      juryQuestion('Business logic ở đâu?', 'Controller và middleware giữ quy tắc; schema giữ ràng buộc.', 'Hiệp'),
      juryQuestion('Vì sao cần service frontend?', 'Để page tập trung UI và request dùng chung token/base URL.', 'Hiệp'),
      juryQuestion('Lưu ảnh base64 lâu dài?', 'Đủ demo nhỏ; production nên lưu storage và URL.', 'Hiệp'),
      juryQuestion('Collection roomdesigns có còn dùng không?', 'Không. Bộ sưu tập thiết kế phòng đã bỏ nên code hiện tại không đọc hoặc ghi collection này.', 'Hiệp'),
    ],
    cards: [
      flashcard('Kể đường createOrder.', 'CheckoutPage → orderService → route → authenticate → createOrder → models → response.', 'Chỉ đọc folder.', [source('client/src/services/orderService.js', 'createOrder'), source('server/src/controllers/orderController.js', 'createOrder')]),
      flashcard('Frontend validate rồi cần backend?', 'Có; client có thể bị sửa hoặc bỏ qua.', 'Tin form React là bảo mật.', [source('server/src/controllers/orderController.js', 'createOrder')]),
      flashcard('Bảy collection đang dùng?', 'users, products, categories, carts, orders, reviews và feedbacks.', 'Kể roomdesigns là chức năng đang chạy.', [source('server/src/routes/index.js', "router.use('/products'")]),
    ],
  },
  {
    id: 'ai-room',
    number: '11',
    owner: 'Hiệp',
    title: 'Điểm wow: Phòng thử AI',
    route: '/room-studio',
    summary: 'Chọn từ một đến ba sản phẩm, tải ảnh phòng, tùy chọn vị trí rồi tạo ảnh.',
    keyPoints: lines('Bước 1 cho khách chọn từ một đến ba sản phẩm có ảnh tham chiếu.|Bước 2 nhận ảnh phòng JPG, PNG hoặc WebP dưới giới hạn kích thước.|Bước 3 có một ô vị trí tùy chọn cho từng sản phẩm: để trống thì AI tự bố trí, có nội dung thì gửi kèm prompt.|Request luôn có ảnh phòng, ảnh sản phẩm và mô tả sản phẩm.|Client chuyển ảnh URL thành data URL trước khi gửi.|Backend ghép prompt, thử provider theo thứ tự và trả ảnh đầu tiên thành công.'),
    sequence: lines('Chọn 1–3 sản phẩm|Tải ảnh phòng|Có thể ghi vị trí|Gửi ảnh và prompt|Provider tạo ảnh|So sánh'),
    rules: lines('Giới hạn tối đa ba sản phẩm và không gửi món thiếu ảnh tham chiếu.|Không kéo, đặt góc, xoay hoặc dựng 3D.|Prompt giữ kiến trúc phòng, đúng sản phẩm và vị trí người dùng ghi.|API key chỉ ở backend.'),
    demo: {
      actions: lines('Ở Bước 1 chọn một đến ba món rồi quay lại Phòng thử.|Ở Bước 2 tải ảnh phòng.|Ở Bước 3 để trống vị trí để AI tự bố trí hoặc ghi vị trí mong muốn.|Bấm Tạo ảnh và so sánh với ảnh gốc.'),
      expected: 'Ảnh mới hiện đúng vùng và có trạng thái tải rõ.',
      fallback: 'Dùng ảnh kết quả đã chuẩn bị trước và mở request để giải thích đúng pipeline; không giả ảnh gốc là kết quả AI.',
    },
    functions: [
      functionInfo('generate', 'client/src/pages/RoomStudioPage.jsx', 'const generate', 'Kiểm tra input, gọi API và đặt kết quả.'),
      functionInfo('createRoomPreview', 'client/src/services/roomPreviewService.js', 'createRoomPreview', 'Gửi ảnh và sản phẩm tới backend.'),
      functionInfo('create', 'server/src/controllers/roomPreviewController.js', 'async function create', 'Kiểm tra rồi gọi dịch vụ AI.'),
      functionInfo('generateRoomPreview', 'server/src/services/cloudflareImageService.js', 'generateRoomPreview', 'Thử provider và trả ảnh thành công.'),
    ],
    questions: [
      juryQuestion('Vì sao bỏ đặt góc?', 'Không tăng độ tin cậy đủ nhiều nhưng làm code và demo phức tạp.', 'Hiệp'),
      juryQuestion('AI đúng kích thước tuyệt đối?', 'Không; kết quả dùng để hình dung.', 'Hiệp'),
      juryQuestion('Hết quota thì sao?', 'Backend thử provider kế tiếp; nếu tất cả lỗi thì trả lỗi rõ để người dùng thử lại.', 'Hiệp'),
      juryQuestion('Vì sao không gọi AI từ React?', 'Sẽ lộ key và bỏ qua kiểm soát backend.', 'Hiệp'),
      juryQuestion('Không nhập vị trí thì API nhận gì?', 'API vẫn nhận ảnh phòng, ảnh và mô tả sản phẩm; prompt yêu cầu AI tự chọn vị trí tự nhiên.', 'Hiệp'),
    ],
    cards: [
      flashcard('Ba bước Phòng thử?', 'Chọn 1–3 sản phẩm → tải ảnh phòng → có thể ghi vị trí → Tạo ảnh và so sánh.', 'Nói vị trí là bắt buộc.', [source('client/src/pages/RoomStudioPage.jsx', 'const generate')]),
      flashcard('Provider lỗi thì giao diện làm gì?', 'Giữ ảnh phòng, bỏ kết quả lỗi và báo người dùng thử lại; không dùng ảnh gốc giả làm ảnh AI.', 'Hiển thị ảnh gốc như một kết quả AI thành công.', [source('client/src/pages/RoomStudioPage.jsx', "setResultImage('')")]),
      flashcard('Ảnh AI có ý nghĩa gì?', 'Gợi ý trực quan trước mua.', 'Gọi là mô phỏng chính xác.', [source('server/src/services/cloudflareImageService.js', 'buildPrompt')]),
    ],
  },
  {
    id: 'quality',
    number: '12',
    owner: 'Hiệp',
    title: 'Kiểm thử, triển khai và cứu demo',
    route: '/api/health',
    summary: 'Chứng minh hệ thống chạy và biết xử lý khi dịch vụ ngoài lỗi.',
    keyPoints: lines('Client build tĩnh lên Cloudflare Pages.|Express chạy Render và MongoDB Atlas giữ dữ liệu chung.|Secret đặt trong Environment Variables.|Trước bảo vệ phải thử luồng customer, admin, stock, order, quyền và AI.|Seed tạo catalog, một customer, một Orchestra Admin và ba admin cấp dưới.'),
    sequence: lines('Build client|Kiểm tra backend|Seed dữ liệu|Thử customer|Thử admin|Thử AI|Chuẩn bị phương án dự phòng'),
    rules: lines('Không commit .env.|Build pass chưa chứng minh business logic.|Cloudflare dùng client/dist và _redirects.'),
    demo: {
      actions: lines('Mở health.|Tạo order customer.|Admin xử lý.|Tạo ảnh AI.|Tải lại URL sâu.'),
      expected: 'Local và deploy có cùng hành vi chính.',
      fallback: 'Chuẩn bị ảnh hoặc video nhưng vẫn giải thích code thật.',
    },
    functions: [
      functionInfo('connectDatabase', 'server/src/config/db.js', 'async function connectDatabase', 'Kết nối MongoDB trước khi mở server.'),
      functionInfo('seed', 'server/src/utils/seedData.js', 'seed', 'Tạo dữ liệu demo.'),
      functionInfo('errorHandler', 'server/src/middleware/errorHandler.js', 'errorHandler', 'Trả lỗi an toàn.'),
    ],
    questions: [
      juryQuestion('Cloudflare chạy Express?', 'Không; Pages chạy client, Render chạy server.', 'Hiệp'),
      juryQuestion('Secret ở đâu?', 'Biến môi trường hoặc .env local đã gitignore.', 'Hiệp'),
      juryQuestion('AI lỗi lúc bảo vệ?', 'Dùng ảnh đã chuẩn bị và vẫn trình bày request, prompt, provider fallback cùng lỗi trả về.', 'Hiệp'),
      juryQuestion('Build thành công đã đủ chưa?', 'Chưa; phải tự thử MongoDB, quyền, tồn kho, đơn hàng, OTP và AI.', 'Hiệp'),
    ],
    cards: [
      flashcard('Ba nơi triển khai?', 'Cloudflare Pages, Render và MongoDB Atlas.', 'Nói Cloudflare chạy toàn bộ.', [source('README.md', 'Cloudflare')]),
      flashcard('Kiểm tra tối thiểu trước bảo vệ?', 'Health → đăng nhập → mua → order → admin xử lý → OTP → AI → tải lại.', 'Chỉ mở Trang chủ.', [source('README.md', 'Tải và chạy')]),
    ],
  },
];

export const PRESENTATION_FLOW = ['dung', 'trieu', 'phuc', 'hiep'].map((memberId, index) => {
  const member = MEMBERS.find((item) => item.id === memberId);
  return {
    order: index + 1,
    memberId,
    name: member.name,
    difficulty: member.label,
    mission: member.mission,
    handoff: member.handoff,
    lessonIds: member.lessonIds,
  };
});

export const TRACKS = [
  { id: 'common', tab: 'Toàn dự án', name: 'Câu chuyện FurneeHome', owner: 'Cả nhóm', description: 'Đi từ bài toán đến giao dịch, quản trị, AI và triển khai.', lessonIds: LESSONS.map((item) => item.id) },
  ...['dung', 'trieu', 'phuc', 'hiep'].map((id) => {
    const member = MEMBERS.find((item) => item.id === id);
    return { id, tab: member.name, name: `Phần của ${member.name}`, owner: member.name, description: member.mission, lessonIds: member.lessonIds };
  }),
];

export const ALL_FLASHCARDS = LESSONS.flatMap((lesson) => lesson.cards.map((item, index) => ({ ...item, id: `${lesson.id}-card-${index + 1}`, lessonId: lesson.id })));
export const ALL_QUESTIONS = LESSONS.flatMap((lesson) => lesson.questions.map((item, index) => ({ ...item, id: `${lesson.id}-jury-${index + 1}`, lessonId: lesson.id })));
