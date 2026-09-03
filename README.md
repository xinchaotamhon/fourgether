# Fourgether 🎓 — Ôn tập & Chia việc nhóm FurneeHome

> **Fourgether** là trang web phụ giúp 4 thành viên nhóm (**Hiệp, Phúc, Triều, Dũng**) ôn tập các câu hỏi để hiểu rõ 100% dự án **FurneeHome** và phân chia công việc rõ ràng cho từng bạn.

---

## 📱 Cách học tối giản

- Trang đầu là **cây kiến thức FurneeHome**: nút gốc là dự án chung, bốn nhánh là Hiệp, Phúc, Triều và Dũng. Mỗi nhánh có các chủ đề liên quan đến phần bạn phụ trách.
- Bấm vào tên thành viên để học các chủ đề của bạn, hoặc bấm thẳng vào một chủ đề để vào flashcard ngay. Hiệp học phần khó nhất, sau đó lần lượt Phúc, Triều và Dũng.
- Trong flashcard: tự nói câu trả lời, bấm thẻ hoặc phím **Space** để lật, dùng **← / →** chuyển câu, rồi đánh dấu đã thuộc. Phím **Esc** quay lại cây kiến thức.
- Đây là trang tĩnh phục vụ ôn tập. Không có cache, service worker, localStorage, sessionStorage hay IndexedDB; tải lại trang sẽ bắt đầu một phiên học mới.

---

## 🚀 Hướng dẫn Deploy lên Cloudflare Pages (30 giây):

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Chọn Repo `xinchaotamhon/furneeHome`.
3. Điền cấu hình:
   - **Framework preset:** `None`
   - **Build command:** *(Để trống)*
   - **Build output directory:** `fourgether`
4. Bấm **Save and Deploy**.
