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
  { id: 'hiep', name: 'Hiệp', difficulty: 1, label: 'Khó nhất', mission: 'Kiến trúc, dữ liệu, bảo mật, Phòng thử AI và triển khai.', lessonIds: ['architecture', 'ai-room', 'quality'], handoff: 'Chốt điểm wow, giới hạn thật và bằng chứng kiểm thử.' },
  { id: 'phuc', name: 'Phúc', difficulty: 2, label: 'Khó thứ hai', mission: 'Tài khoản, OTP, đơn hàng, MongoDB và quyền quản trị.', lessonIds: ['account', 'order', 'admin'], handoff: 'Bàn giao cho Hiệp giải thích pipeline AI và vận hành.' },
  { id: 'trieu', name: 'Triều', difficulty: 3, label: 'Khó thứ ba', mission: 'Chi tiết sản phẩm, giỏ hàng và trải nghiệm sau mua.', lessonIds: ['product', 'cart', 'after-sale'], handoff: 'Bàn giao cho Phúc khi giỏ đã sẵn sàng đặt hàng.' },
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
      flashcard('Khách hàng chính là ai?', 'Người học, công nhân và gia đình phổ thông cần nội thất dễ chọn, giá rõ.', 'Nói chung chung là mọi người.', [source('START_HERE.md', 'Mục tiêu')]),
    ],
  },
  {
    id: 'journey',
    number: '02',
    owner: 'Dũng',
    title: 'Bức tranh toàn hệ thống',
    route: '/',
    summary: 'Một giao dịch hoàn chỉnh và trách nhiệm của từng vai trò.',
    keyPoints: lines('Khách xem catalog mà chưa cần đăng nhập.|Khách mở chi tiết, chọn số lượng và thêm giỏ.|Checkout yêu cầu đăng nhập, địa chỉ và COD.|Backend đọc lại giá và tồn kho rồi tạo đơn MongoDB.|Admin xử lý đơn; superadmin quản lý quyền.|Phòng thử AI hỗ trợ trước quyết định mua.'),
    sequence: lines('Khám phá|Chọn món|Giỏ hàng|Đặt COD|Admin xử lý|Khách nhận hàng'),
    rules: lines('Customer chỉ xem đơn của mình.|Admin vận hành cửa hàng.|Superadmin mới thay đổi quyền.|Backend quyết định quyền cuối cùng.'),
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
      juryQuestion('Có những vai trò nào?', 'Customer, admin và superadmin.', 'Dũng'),
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
    keyPoints: lines('Trang hiển thị ảnh, mô tả, giá, kích thước và tồn kho.|Số lượng từ 1 đến stock.|Thêm giỏ chưa tạo đơn và chưa giảm kho.|Yêu thích, đánh giá và báo xấu có mục đích khác nhau.'),
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
    id: 'account',
    number: '06',
    owner: 'Phúc',
    title: 'Tài khoản, hồ sơ và OTP',
    route: '/profile',
    summary: 'Xác định đúng người trước khi xem dữ liệu riêng hoặc đặt hàng.',
    keyPoints: lines('Register validate rồi hash password.|Login so sánh password và trả JWT.|Hồ sơ chỉ sửa field cho phép, không sửa role.|Quên mật khẩu tạo OTP ngắn hạn và chỉ lưu hash.|Production không trả OTP ra giao diện.'),
    sequence: lines('Đăng ký|Đăng nhập|JWT|Trang riêng|Đặt lại mật khẩu'),
    rules: lines('Password dùng bcrypt.|OTP hết hạn và dùng một lần.|Route riêng nạp lại user active.|Response không làm lộ email tồn tại.'),
    demo: {
      actions: lines('Đăng ký.|Đăng xuất rồi đăng nhập.|Sửa hồ sơ.|Thử quên mật khẩu.'),
      expected: 'Phiên đúng và mật khẩu cũ không dùng được sau reset.',
      fallback: 'Local dùng devOtp; production dùng SMTP và tắt devOtp.',
    },
    functions: [
      functionInfo('register', 'server/src/controllers/authController.js', 'async function register', 'Validate, hash và tạo customer.'),
      functionInfo('login', 'server/src/controllers/authController.js', 'async function login', 'Xác minh rồi tạo JWT.'),
      functionInfo('requestPasswordReset', 'server/src/controllers/authController.js', 'requestPasswordReset', 'Tạo OTP, hash, hạn dùng và gửi email.'),
      functionInfo('authenticate', 'server/src/middleware/authMiddleware.js', 'authenticate', 'Xác minh JWT và nạp user.'),
    ],
    questions: [
      juryQuestion('JWT có mật khẩu?', 'Không; chỉ có định danh cần thiết và chữ ký.', 'Phúc'),
      juryQuestion('Xem database có thấy OTP?', 'Chỉ thấy hash và hạn dùng.', 'Phúc'),
      juryQuestion('User gửi role admin trong profile?', 'Controller bỏ field đó; chỉ superadmin đổi role.', 'Phúc'),
    ],
    cards: [
      flashcard('Password kiểm tra thế nào?', 'bcrypt.compare so input với hash.', 'So hai chuỗi plaintext.', [source('server/src/controllers/authController.js', 'bcrypt.compare')]),
      flashcard('OTP local khác production?', 'Local có thể hiện devOtp; production gửi SMTP và không trả OTP.', 'Bật devOtp trên Render.', [source('server/src/controllers/authController.js', 'devOtp')]),
    ],
  },
  {
    id: 'order',
    number: '07',
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
    id: 'after-sale',
    number: '08',
    owner: 'Triều',
    title: 'Sau mua và chăm sóc khách',
    route: '/feedback',
    summary: 'Theo dõi đơn, đánh giá, góp ý và báo nội dung để được liên hệ xử lý.',
    keyPoints: lines('Order history lấy MongoDB theo user.|Review gắn trải nghiệm sản phẩm đã mua.|Liên hệ hoặc báo nội dung tạo phiếu để admin xử lý.|Profile lưu thông tin cá nhân được phép.|Khách nhận phản hồi theo đúng trạng thái ticket.'),
    sequence: lines('Xem đơn|Nhận hàng|Đánh giá|Gửi phản hồi|Admin xử lý'),
    rules: lines('Không xem đơn người khác bằng sửa URL.|Order, Review và Feedback là ba dữ liệu có mục đích khác nhau.|Report không tự xóa sản phẩm.'),
    demo: {
      actions: lines('Mở lịch sử và một đơn.|Gửi review hoặc liên hệ.|Báo nội dung nếu cần.|Đăng nhập admin để thấy ticket liên hệ.'),
      expected: 'Dữ liệu đúng sau tải lại và đúng chủ sở hữu.',
      fallback: 'Chưa có đơn Delivered thì dùng dữ liệu seed để demo validation.',
    },
    functions: [
      functionInfo('OrderHistoryPage', 'client/src/pages/OrderHistoryPage.jsx', 'OrderHistoryPage', 'Hiển thị đơn của user.'),
      functionInfo('createReview', 'server/src/controllers/reviewController.js', 'createReview', 'Kiểm tra đánh giá và cập nhật điểm.'),
      functionInfo('create', 'server/src/controllers/feedbackController.js', 'async function create', 'Tạo góp ý hoặc báo nội dung.'),
    ],
    questions: [
      juryQuestion('Review khác liên hệ?', 'Review chia sẻ trải nghiệm sản phẩm; liên hệ tạo ticket để admin phản hồi.', 'Triều'),
      juryQuestion('Report xóa ngay?', 'Không; admin phải xác minh.', 'Triều'),
      juryQuestion('Đánh giá khi chưa mua?', 'Bản chốt yêu cầu đã nhận hàng để tăng độ tin cậy.', 'Phúc'),
    ],
    cards: [
      flashcard('Order history lưu ở đâu?', 'MongoDB và lọc theo user.', 'Lưu lịch sử chỉ trong trình duyệt.', [source('server/src/models/Order.js', 'orderSchema')]),
      flashcard('Report tạo gì?', 'Feedback ticket có loại, nội dung và trạng thái.', 'Đồng nhất report với delete.', [source('server/src/models/Feedback.js', 'feedbackSchema')]),
    ],
  },
  {
    id: 'admin',
    number: '09',
    owner: 'Phúc',
    title: 'Quản trị cửa hàng',
    route: '/admin',
    summary: 'Quản lý sản phẩm, kho, đơn, người dùng và phản hồi.',
    keyPoints: lines('Admin quản lý Sản phẩm: giá, tồn kho, ảnh và thông tin AI.|Admin quản lý Khách hàng: xem trạng thái và xử lý tài khoản theo quyền.|Admin quản lý Đơn hàng: lọc và cập nhật trạng thái.|Admin quản lý Liên hệ: đọc và phản hồi ticket.|Superadmin có thêm quyền quản trị admin cấp dưới: cấp hoặc thu hồi quyền, khóa hoặc mở tài khoản.|Mọi thay đổi lưu MongoDB rồi giao diện tải lại.'),
    sequence: lines('Sản phẩm và kho|Khách hàng|Đơn hàng|Liên hệ|Admin cấp dưới'),
    rules: lines('Không hard-code mật khẩu admin.|Backend kiểm tra role.|Ưu tiên isActive thay vì xóa món đã bán.'),
    demo: {
      actions: lines('Sửa giá hoặc stock sản phẩm.|Kiểm tra danh sách Khách hàng.|Đổi trạng thái Đơn hàng.|Xử lý Liên hệ.|Dùng superadmin quản trị admin cấp dưới.'),
      expected: 'Customer thấy dữ liệu mới; gọi API admin bằng customer nhận 403.',
      fallback: 'Seed sẵn sản phẩm, đơn và feedback.',
    },
    functions: [
      functionInfo('productData', 'server/src/controllers/productController.js', 'productData', 'Làm sạch field create hoặc update.'),
      functionInfo('updateOrderStatus', 'server/src/controllers/orderController.js', 'updateOrderStatus', 'Chuyển trạng thái đơn.'),
      functionInfo('updateUser', 'server/src/controllers/adminController.js', 'updateUser', 'Thay role và trạng thái đúng quyền.'),
      functionInfo('requireSuperadmin', 'server/src/middleware/authMiddleware.js', 'requireSuperadmin', 'Chặn tài khoản không phải quyền cao nhất.'),
    ],
    questions: [
      juryQuestion('Vì sao không xóa sản phẩm đã bán?', 'isActive ngừng bán mà không phá lịch sử.', 'Phúc'),
      juryQuestion('Admin tự cấp superadmin?', 'Không; superadmin mới được quản trị admin cấp dưới, còn backend luôn chặn tự nâng quyền.', 'Phúc'),
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
    keyPoints: lines('Page nhận thao tác và gọi context hoặc service.|Service gửi HTTP tới Express route.|Route chạy middleware rồi controller.|Controller áp dụng business rule và gọi model.|MongoDB lưu rồi response quay lại React.|Model chính gồm User, Product, Cart, Order, Review, Feedback và RoomDesign.'),
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
    ],
    cards: [
      flashcard('Kể đường createOrder.', 'CheckoutPage → orderService → route → authenticate → createOrder → models → response.', 'Chỉ đọc folder.', [source('client/src/services/orderService.js', 'createOrder'), source('server/src/controllers/orderController.js', 'createOrder')]),
      flashcard('Frontend validate rồi cần backend?', 'Có; client có thể bị sửa hoặc bỏ qua.', 'Tin form React là bảo mật.', [source('server/src/controllers/orderController.js', 'createOrder')]),
    ],
  },
  {
    id: 'ai-room',
    number: '11',
    owner: 'Hiệp',
    title: 'Điểm wow: Phòng thử AI',
    route: '/room-studio',
    summary: 'Ba bước rõ ràng: chọn từ một đến ba sản phẩm, tải ảnh phòng, nhập vị trí từng món rồi tạo ảnh.',
    keyPoints: lines('Bước 1 cho khách tích từ một đến ba sản phẩm trong danh sách và có thể quay lại chọn tiếp.|Bước 2 nhận ảnh phòng JPG, PNG hoặc WebP dưới giới hạn kích thước.|Bước 3 tạo một ô vị trí riêng cho từng sản phẩm rồi mới gửi request.|Client chuyển ảnh sản phẩm URL thành data URL trước khi gọi API.|Giao diện hiển thị loading, kết quả và nút so sánh ảnh gốc.|Provider lỗi thì preview dự phòng giữ luồng demo.'),
    sequence: lines('Chọn 1–3 sản phẩm|Tải ảnh phòng|Nhập vị trí từng món|Tạo ảnh|Provider xử lý|So sánh'),
    rules: lines('Giới hạn tối đa ba sản phẩm và không gửi món thiếu ảnh tham chiếu.|Không kéo, đặt góc, xoay hoặc dựng 3D.|Prompt giữ kiến trúc phòng, đúng sản phẩm và vị trí người dùng ghi.|API key chỉ ở backend.'),
    demo: {
      actions: lines('Ở Bước 1 mở danh sách sản phẩm.|Tích một đến ba món rồi quay lại Phòng thử.|Ở Bước 2 tải ảnh phòng.|Ở Bước 3 ghi vị trí từng món và bấm Tạo ảnh.|So sánh ảnh gốc và kết quả.'),
      expected: 'Ảnh mới hiện đúng vùng và có trạng thái tải rõ.',
      fallback: 'Dùng preview hoặc ảnh seed và nói rõ dịch vụ ngoài đang lỗi.',
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
      juryQuestion('Hết quota?', 'Thử provider kế tiếp; tất cả lỗi thì giữ preview.', 'Hiệp'),
      juryQuestion('Vì sao không gọi AI từ React?', 'Sẽ lộ key và bỏ qua kiểm soát backend.', 'Hiệp'),
    ],
    cards: [
      flashcard('Ba bước Phòng thử?', 'Chọn 1–3 sản phẩm → tải ảnh phòng → ghi vị trí từng món → Tạo ảnh và so sánh.', 'Thêm lại 3D, kéo hoặc ép đặt góc.', [source('client/src/pages/RoomStudioPage.jsx', 'const generate')]),
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
    keyPoints: lines('Client build tĩnh lên Cloudflare Pages.|Express chạy Render và MongoDB Atlas giữ dữ liệu chung.|Secret đặt trong Environment Variables.|Smoke thử customer, admin, stock, order, quyền và AI.|Seed sẵn tài khoản, sản phẩm, đơn và ảnh phòng.'),
    sequence: lines('Build|Backend check|Seed|Smoke customer|Smoke admin|Smoke AI|Phương án dự phòng'),
    rules: lines('Không commit .env.|Build pass chưa chứng minh business logic.|Cloudflare dùng client/dist và _redirects.'),
    demo: {
      actions: lines('Mở health.|Tạo order customer.|Admin xử lý.|Tạo ảnh hoặc fallback.|Tải lại URL sâu.'),
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
      juryQuestion('AI lỗi lúc bảo vệ?', 'Dùng fallback và vẫn chứng minh request/validation.', 'Hiệp'),
      juryQuestion('Build pass đủ chưa?', 'Chưa; phải smoke với MongoDB, role, stock và order.', 'Hiệp'),
    ],
    cards: [
      flashcard('Ba nơi triển khai?', 'Cloudflare Pages, Render và MongoDB Atlas.', 'Nói Cloudflare chạy toàn bộ.', [source('README.md', 'Cloudflare')]),
      flashcard('Smoke tối thiểu?', 'Health → mua → order → admin xử lý → AI hoặc fallback → tải lại.', 'Chỉ mở Trang chủ.', [source('START_HERE.md', 'Kiểm tra')]),
    ],
  },
];

// Các sơ đồ này là đường đi để kể chuyện trong buổi bảo vệ; mỗi node mở về
// chặng học có đầy đủ ý chính, hàm/route và câu hỏi phản biện.
export const SEQUENCE_FLOWS = [
  {
    id: 'purchase',
    title: 'Khách mua hàng',
    summary: 'Từ lúc khám phá đến khi đơn COD được theo dõi.',
    nodes: [
      ['Mở trang chủ', 'pitch', '/'],
      ['Tìm sản phẩm', 'catalog', '/products'],
      ['Xem chi tiết', 'product', '/products/:id'],
      ['Thêm vào giỏ', 'cart', '/cart'],
      ['Đăng nhập', 'account', '/profile'],
      ['Đặt đơn COD', 'order', '/checkout'],
      ['Theo dõi đơn', 'after-sale', '/orders'],
    ],
  },
  {
    id: 'account',
    title: 'Đăng ký và xác thực tài khoản',
    summary: 'Tạo tài khoản an toàn, đăng nhập và khôi phục mật khẩu.',
    nodes: [
      ['Đăng ký email', 'account', '/profile'],
      ['Xác minh OTP', 'account', '/profile'],
      ['Tạo mật khẩu', 'account', '/profile'],
      ['Đăng nhập', 'account', '/profile'],
      ['Quên mật khẩu', 'account', '/profile'],
      ['Đặt lại bằng OTP', 'account', '/profile'],
    ],
  },
  {
    id: 'room-studio',
    title: 'Room Studio 3 bước',
    summary: 'Chọn 1–3 sản phẩm, tải ảnh phòng, khai báo vị trí rồi tạo ảnh.',
    nodes: [
      ['Bước 1 · Chọn 1–3 sản phẩm', 'ai-room', '/products'],
      ['Bước 2 · Tải ảnh phòng', 'ai-room', '/room-studio'],
      ['Bước 3 · Nhập vị trí từng món', 'ai-room', '/room-studio'],
      ['Tạo ảnh và so sánh', 'ai-room', '/room-studio'],
    ],
  },
  {
    id: 'contact',
    title: 'Liên hệ, báo xấu và bình luận',
    summary: 'Khách gửi review hoặc ticket; admin tiếp nhận và xử lý.',
    nodes: [
      ['Mở Liên hệ', 'after-sale', '/feedback'],
      ['Gửi góp ý', 'after-sale', '/feedback'],
      ['Báo nội dung xấu', 'after-sale', '/feedback'],
      ['Bình luận / đánh giá', 'after-sale', '/products/:id'],
      ['Admin phản hồi', 'admin', '/admin'],
    ],
  },
  {
    id: 'admin',
    title: 'Admin quản trị cửa hàng',
    summary: 'Một admin vận hành bốn khu vực nghiệp vụ bằng quyền thật.',
    nodes: [
      ['Quản lý Sản phẩm', 'admin', '/admin'],
      ['Quản lý Khách hàng', 'admin', '/admin'],
      ['Quản lý Đơn hàng', 'admin', '/admin/orders'],
      ['Quản lý Liên hệ', 'admin', '/admin'],
    ],
  },
  {
    id: 'superadmin',
    title: 'Superadmin quản trị admin',
    summary: 'Quyền cao nhất quản trị admin cấp dưới và trạng thái tài khoản.',
    nodes: [
      ['Xem danh sách admin', 'admin', '/admin'],
      ['Cấp hoặc thu hồi quyền', 'admin', '/admin'],
      ['Khóa hoặc mở tài khoản', 'admin', '/admin'],
      ['Backend kiểm tra Superadmin', 'admin', '/admin'],
    ],
  },
].map((flow) => ({
  ...flow,
  nodes: flow.nodes.map(([label, lessonId, route], index) => ({ label, lessonId, route, number: String(index + 1).padStart(2, '0') })),
}));

export const TRACKS = [
  { id: 'common', tab: 'Toàn dự án', name: 'Câu chuyện FurneeHome', owner: 'Cả nhóm', description: 'Đi từ bài toán đến giao dịch, quản trị, AI và triển khai.', lessonIds: LESSONS.map((item) => item.id) },
  ...['dung', 'trieu', 'phuc', 'hiep'].map((id) => {
    const member = MEMBERS.find((item) => item.id === id);
    return { id, tab: member.name, name: `Phần của ${member.name}`, owner: member.name, description: member.mission, lessonIds: member.lessonIds };
  }),
];

export const ALL_FLASHCARDS = LESSONS.flatMap((lesson) => lesson.cards.map((item, index) => ({ ...item, id: `${lesson.id}-card-${index + 1}`, lessonId: lesson.id })));
export const ALL_QUESTIONS = LESSONS.flatMap((lesson) => lesson.questions.map((item, index) => ({ ...item, id: `${lesson.id}-jury-${index + 1}`, lessonId: lesson.id })));
