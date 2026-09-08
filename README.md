# Fourgether

Fourgether là trang học và luyện bảo vệ cho nhóm FurneeHome. Phần chính là một luồng thuyết trình gồm 12 chặng, chia liên tiếp cho 4 thành viên.

## Trình tự thuyết trình

1. Dũng: bài toán → bức tranh hệ thống → tìm sản phẩm.
2. Triều: chi tiết sản phẩm → giỏ hàng → sau mua và liên hệ.
3. Phúc: tài khoản và OTP → checkout và đơn hàng → quản trị.
4. Hiệp: kiến trúc và MongoDB → Phòng thử AI → kiểm thử và deploy.

Độ khó từ cao xuống thấp: Hiệp → Phúc → Triều → Dũng.

## Cách học

1. Mở tab **Toàn dự án** để nhìn thứ tự nói và phần bàn giao giữa 4 người.
2. Bấm một chặng để xem các ý chính và trình tự cần tự diễn đạt.
3. Tập đúng phần **Demo trực tiếp**.
4. Mở **Hàm quan trọng** để biết hàm làm gì và nằm ở đâu.
5. Học **Flashcard hiểu bài** để hiểu sâu chặng đó.
6. Học **Flashcard giám khảo** để luyện câu hỏi phản biện ngay trong cùng chặng.
7. Mỗi thành viên mở tab tên mình để tập riêng ba chặng được giao.

Nút **Chế độ cầm tay** chỉ hiện ba ý chính, trình tự và nút chuyển chặng lớn để thành viên có thể liếc nhanh khi thuyết trình bằng điện thoại.

Trang không lưu tiến độ, cache, `localStorage` hoặc `sessionStorage`. Tải lại trang sẽ bắt đầu một phiên học mới.

## Chạy và deploy

Mở `index.html` hoặc chạy bằng static server. Với Cloudflare Pages:

- Framework preset: `None`
- Build command: để trống
- Output directory: `.`
