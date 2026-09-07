# Fourgether 🎓 — Cây học chung FurneeHome

Fourgether là một trang tĩnh để cả nhóm học cùng một câu chuyện về FurneeHome. Cây chung vẫn đi theo luồng; lộ trình cá nhân chỉ xác định phần mỗi người cần đào sâu và thuyết trình chính:

`Mục tiêu dự án → Luồng người dùng → Frontend → Backend/AI → Dữ liệu/vận hành → Bảo vệ`

## Cách sử dụng

- Nút **Học toàn bộ** mở toàn bộ thẻ nền tảng theo thứ tự từ trải nghiệm người dùng tới API, dữ liệu, deploy và phần bảo vệ.
- Nút **Lộ trình 4 người** chia phần đào sâu từ khó đến dễ: Hiệp → Phúc → Triều → Dũng. Thứ tự thuyết trình theo câu chuyện là Dũng → Triều → Phúc → Hiệp.
- Nút **Luyện câu hỏi** mở ngân hàng câu hỏi giám khảo, ưu tiên cách hệ thống hoạt động, vị trí xử lý, business logic và các tình huống “nếu… thì sao?”.
- Nhánh **Luồng người dùng** được mở sẵn để người mới đi từ khám phá, chọn món, Room Studio, kết quả, collection đến public/reuse.
- Bấm `+` hoặc `−` để mở/thu một node. Bấm vào nội dung node để học **chỉ các thẻ trực tiếp của node đó**; hai hành động này tách biệt để không gây mở bài học ngoài ý muốn.
- Ô tìm kiếm tìm được tên node, route, hàm, file hoặc từ khóa. Phím `/` đặt con trỏ vào ô tìm kiếm.
- Trong flashcard, tự nói câu trả lời rồi bấm thẻ hoặc phím **Space** để xem đáp án. Sau đó có thể mở **Vì sao**, **Dễ nhầm** và **Nếu… thì sao?** theo nhu cầu. Phím **← / →** chuyển thẻ; **Esc** quay lại màn hình trước.
- Nút **Mở toàn cây** và **Thu gọn** dùng khi cần xem tổng quan hoặc tập trung một luồng.

## Nguyên tắc nội dung

Nội dung được đối chiếu với source FurneeHome hiện tại: route, component, service, controller, model và tool. Mỗi thẻ có một câu hỏi chính, đáp án ngắn, phần giải thích, một nhầm lẫn gần nhất, câu hỏi tiếp theo và source refs có đường dẫn tương đối trong repo. Các câu hỏi về prompt/bố cục nhấn mạnh điều người dùng cần nhập cụ thể — ví dụ “bàn thấp dùng ngồi bệt, không ghế cao” — thay vì để model tự suy đoán chiều cao.

Fourgether dùng một trục kể chuyện chính, progressive disclosure, tìm kiếm node, nhãn semantic rõ ràng và hỗ trợ bàn phím/reduced motion bằng HTML/CSS/JS thuần; không thêm dependency.

## Trạng thái và triển khai

- `data/flashcards.js` chứa node, flashcard và course path; số lượng hiện tại được hiển thị ngay trong ứng dụng. `app.js` kiểm tra dữ liệu khi khởi động.
- Cây không dùng `localStorage`, `sessionStorage`, IndexedDB, service worker hay cache để lưu tiến độ. Tải lại trang sẽ tạo phiên học mới.
- Chạy `node --test smoke.cjs` trước khi phát hành. Gate luôn kiểm tra ID, parent, prerequisite, course, transfer và cấm Web Storage/IndexedDB/service worker. Khi repo nằm tại `furneehome/fourgether`, gate kiểm tra thêm source path/symbol trong FurneeHome.
- Deploy Cloudflare Pages: chọn repo/folder `fourgether`, Framework preset **None**, để trống build command và dùng `.` làm output directory.

## Phạm vi

Đây là công cụ học tĩnh, không phải runtime FurneeHome. Khi app chính đổi hợp đồng, cần cập nhật card/source tương ứng trước khi dùng cây làm tài liệu bảo vệ.
