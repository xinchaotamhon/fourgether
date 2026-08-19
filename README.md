# Fourgether 🎓 — Ôn tập & Chia việc nhóm FurneeHome

> **Fourgether** là trang web phụ giúp 4 thành viên nhóm (**Hiệp, Phúc, Triệu, Dũng**) ôn tập các câu hỏi để hiểu rõ 100% dự án **FurneeHome** và phân chia công việc rõ ràng cho từng bạn.

---

## 📱 Cấu trúc đơn giản gồm đúng 2 phần:

1. **🗂️ Phần 1: Flashcards Ôn tập dự án FurneeHome**
   - Lật thẻ đơn giản để học hiểu toàn bộ dự án: Luồng AI 1-chạm (One-touch), tại sao bỏ 3D sang 2D, tại sao lưu tọa độ chuẩn hóa (0..1), kiến trúc MVC trực diện, bảo mật .env, và tool cào Shopee.
   - Thao tác: Bấm vào thẻ để lật xem đáp án (hoặc phím Space), bấm ⬅️ / ➡️ để chuyển câu.

2. **👥 Phần 2: Phân chia công việc 4 người**
   - 4 vai trò cụ thể: Trưởng nhóm & AI, Frontend UI, Backend DB, Data Shopee & QA.
   - Mỗi bạn chọn tên mình vào vai trò và tích danh sách công việc cần làm.

---

## 🚀 Hướng dẫn Deploy lên Cloudflare Pages (30 giây):

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Chọn Repo `xinchaotamhon/furneeHome`.
3. Điền cấu hình:
   - **Framework preset:** `None`
   - **Build command:** *(Để trống)*
   - **Build output directory:** `fourgether`
4. Bấm **Save and Deploy**.
