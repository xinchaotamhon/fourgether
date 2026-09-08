# Fourgether

Trang học và luyện bảo vệ cho nhóm FurneeHome.

## Cách học

1. Mở tab **Toàn dự án** và nhìn toàn bộ 12 chặng.
2. Bấm từng chặng, đọc **Bạn cần hiểu** rồi tự kể lại theo trình tự.
3. Làm đúng các bước trong **Demo trực tiếp**.
4. Mở **Hàm quan trọng** để biết code làm gì và nằm ở đâu.
5. Tự trả lời câu giám khảo trước khi mở đáp án.
6. Sau khi hiểu luồng chung, mỗi thành viên học tab tên mình.

Phòng thử được học theo đúng ba bước của bản mới: tích từ một đến ba sản phẩm rồi quay lại Phòng thử, tải ảnh phòng, nhập vị trí riêng cho từng món và bấm Tạo ảnh để so sánh với ảnh gốc. Hành trình mua hàng vẫn là Sản phẩm → Giỏ hàng → Checkout tạo đơn COD. Khu quản trị tách rõ Sản phẩm, Khách hàng, Đơn hàng và Liên hệ; superadmin có thêm quyền quản trị admin cấp dưới.

Flashcard chỉ dùng để tự kiểm tra sau bài học. Trang không lưu cache, `localStorage`, `sessionStorage` hoặc tiến độ; tải lại là một phiên học mới.

## Phân công

- Dũng: bài toán, hành trình và catalog.
- Triều: chi tiết sản phẩm, giỏ hàng và sau mua.
- Phúc: tài khoản, đơn hàng và quản trị.
- Hiệp: kiến trúc, Phòng thử AI, kiểm thử và triển khai.

Độ khó từ cao xuống thấp: Hiệp → Phúc → Triều → Dũng.

## Chạy và kiểm tra

Mở `index.html` hoặc chạy một static server bất kỳ. Trước khi deploy:

```powershell
node --test smoke.cjs
```

Cloudflare Pages:

- Framework preset: `None`
- Build command: để trống
- Output directory: `.`

Sau khi FurneeHome đổi route, hàm hoặc business rule, cập nhật `data/flashcards.js` và chạy lại smoke test.
