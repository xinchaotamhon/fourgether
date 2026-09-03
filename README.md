# Fourgether 🎓 — Cây học chung FurneeHome

> **Fourgether** là trang web tĩnh giúp cả nhóm (**Hiệp, Phúc, Triều, Dũng**) học cùng một lộ trình để hiểu đầy đủ dự án **FurneeHome**. Đây là công cụ học chung, không chia theo thành viên hoặc độ khó.

---

## 📱 Cách học tối giản

- Trang đầu là **cây kiến thức FurneeHome**: đi theo luồng từ mục tiêu → kiến trúc → frontend → Room Studio → backend → dữ liệu → AI → collection → deploy → vấn đáp.
- Bấm vào bất kỳ node nào để mở flashcard của node đó ngay. Tất cả mọi người học cùng một luồng và có thể quay lại node bất kỳ để ôn.
- Trong flashcard: tự nói câu trả lời, bấm thẻ hoặc phím **Space** để lật, dùng **← / →** chuyển câu, rồi đánh dấu đã thuộc. Phím **Esc** quay lại cây kiến thức.
- Đây là trang tĩnh phục vụ ôn tập. Không có cache, service worker, localStorage, sessionStorage hay IndexedDB; tải lại trang sẽ bắt đầu một phiên học mới.

---

## 🚀 Hướng dẫn Deploy lên Cloudflare Pages (30 giây):

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Chọn Repo `xinchaotamhon/fourgether` (hoặc repo FurneeHome nếu nhóm đặt folder này bên trong repo chính).
3. Điền cấu hình:
   - **Framework preset:** `None`
   - **Build command:** *(Để trống)*
   - **Build output directory:** `.`
4. Bấm **Save and Deploy**.
