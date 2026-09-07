# Fourgether — Luồng học FurneeHome

Fourgether là trang tĩnh giúp cả nhóm nhìn dự án theo cùng một trình tự:

`Đầu vào → Xử lý → Đầu ra`

## Cách sử dụng

- Mở **Toàn dự án** trước để hiểu hành trình chung từ nhu cầu, ảnh phòng và sản phẩm đến ảnh AI, Collection và Mẫu công khai.
- Chọn **Dũng, Triều, Phúc hoặc Hiệp** để học đúng luồng thuyết trình của từng người. Độ khó được chia từ cao xuống thấp: Hiệp → Phúc → Triều → Dũng; thứ tự thuyết trình là Dũng → Triều → Phúc → Hiệp.
- Bấm một bước trong sơ đồ để xem kiến thức và các câu phản biện gắn trực tiếp với bước đó.
- Chọn **Học bước này**, **Luyện câu hỏi** hoặc học toàn bộ luồng.
- Trong flashcard, tự trả lời rồi bấm thẻ hoặc nhấn **Space** để xem đáp án. Dùng **← / →** để chuyển thẻ và **Esc** để trở lại sơ đồ.

## Nguyên tắc nội dung

Nội dung được đối chiếu với source FurneeHome hiện tại: route, component, service, controller, model và tool. Mỗi thẻ có một câu hỏi chính, đáp án ngắn, phần giải thích, một nhầm lẫn gần nhất, câu hỏi tiếp theo và source refs có đường dẫn tương đối trong repo. Các câu hỏi về prompt/bố cục nhấn mạnh điều người dùng cần nhập cụ thể — ví dụ “bàn thấp dùng ngồi bệt, không ghế cao” — thay vì để model tự suy đoán chiều cao.

Fourgether dùng HTML, CSS và JavaScript thuần, không thêm dependency. Màn hình lớn hiển thị ba cột; điện thoại chuyển thành luồng dọc để không phải cuộn ngang.

## Trạng thái và triển khai

- `data/flashcards.js` chứa node, flashcard, câu hỏi, course và năm luồng học. `app.js` kiểm tra dữ liệu khi khởi động.
- Cây không dùng `localStorage`, `sessionStorage`, IndexedDB, service worker hay cache để lưu tiến độ. Tải lại trang sẽ tạo phiên học mới.
- Chạy `node --test smoke.cjs` trước khi phát hành. Gate kiểm tra dữ liệu thẻ, đủ năm luồng, đúng thứ tự Input–Process–Output, câu hỏi được gắn đúng bước và không dùng bộ nhớ đệm trình duyệt.
- Deploy Cloudflare Pages: chọn repo/folder `fourgether`, Framework preset **None**, để trống build command và dùng `.` làm output directory.

## Phạm vi

Đây là công cụ học tĩnh, không phải runtime FurneeHome. Khi app chính đổi hợp đồng, cần cập nhật card/source tương ứng trước khi dùng sơ đồ làm tài liệu bảo vệ.
