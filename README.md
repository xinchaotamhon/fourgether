# Fourgether 🎓 — Cây học chung FurneeHome

Fourgether là một trang tĩnh để cả nhóm học cùng một câu chuyện về FurneeHome. Cây được tổ chức theo luồng, không chia theo thành viên hay mức độ khó:

`Mục tiêu dự án → Luồng người dùng → Frontend → Backend/AI → Dữ liệu/vận hành → Bảo vệ`

## Cách sử dụng

- Nhánh **Luồng người dùng** được mở sẵn để người mới đi từ khám phá, chọn món, Room Studio, kết quả, collection đến public/reuse.
- Bấm `+` hoặc `−` để mở/thu một node. Bấm vào nội dung node để mở flashcard; hai hành động này tách biệt để không gây mở bài học ngoài ý muốn.
- Ô tìm kiếm tìm được tên node, route, hàm, file hoặc từ khóa. Phím `/` đặt con trỏ vào ô tìm kiếm.
- Trong flashcard, tự nói câu trả lời rồi bấm thẻ hoặc phím **Space** để xem input → process → output, caller/callee, source và trường hợp lỗi. Phím **← / →** chuyển thẻ; **Esc** quay lại cây.
- Nút **Mở toàn cây** và **Thu gọn** dùng khi cần xem tổng quan hoặc tập trung một luồng.

## Nguyên tắc nội dung

Nội dung được đối chiếu với source FurneeHome hiện tại: route, component, service, controller, model và tool. Các câu hỏi về prompt/bố cục nhấn mạnh điều người dùng cần nhập cụ thể — ví dụ “bàn thấp dùng ngồi bệt, không ghế cao” — thay vì để model tự suy đoán chiều cao.

Ý tưởng trình bày tham khảo Archify ở `D:/mydata/new-git-3/test_git/archify`: một trục kể chuyện chính trước, progressive disclosure, tìm kiếm node, trạng thái không bịa topology, nhãn semantic rõ ràng và hỗ trợ bàn phím/reduced motion. Fourgether chỉ dùng các ý tưởng đó bằng HTML/CSS/JS thuần, không sao chép app hay thêm dependency.

## Trạng thái và triển khai

- `data/flashcards.js` hiện có 35 node và 40 flashcard; `app.js` kiểm tra parent/card references khi khởi động.
- Cây không dùng `localStorage`, `sessionStorage`, IndexedDB, service worker hay cache để lưu tiến độ. Tải lại trang sẽ tạo phiên học mới.
- Deploy Cloudflare Pages: chọn repo/folder `fourgether`, Framework preset **None**, để trống build command và dùng `.` làm output directory.

## Phạm vi

Đây là công cụ học tĩnh, không phải runtime FurneeHome. Khi app chính đổi hợp đồng, cần cập nhật card/source tương ứng trước khi dùng cây làm tài liệu bảo vệ.
