---
name: file-organization
description: Quy tắc tổ chức thư mục, đặt tên file và vị trí asset tĩnh cho project cv-by-html
---

# File & Folder Organization

## Cấu trúc `src/`
```
src/
  App.jsx / App.css      # root component + style toàn cục của app shell
  Global.css             # reset, @font-face, CSS variables (:root)
  main.jsx                # entry point, chỉ import Global.css ở đây
  components/
    CVForm.jsx / CVForm.css
    CVPreview.jsx / CVPreview.css
```
- Component con luôn đặt trong `components/`, không đặt lẫn ở `src/` gốc.
- `src/` gốc chỉ chứa: `App.jsx`, `main.jsx`, `Global.css` (style/biến toàn cục dùng chung).

## Co-location CSS
- Mỗi component có file CSS **cùng tên**, đặt cùng thư mục với component, import trực tiếp trong file component đó:
  ```jsx
  // components/CVPreview.jsx
  import './CVPreview.css';
  ```
- Không gộp style của nhiều component vào một file CSS chung (tránh lặp lại tình trạng style của `CVForm` nằm trong `App.css`).

## Asset tĩnh (ảnh, font)
- Đặt trong `public/images/` và `public/fonts/`, tham chiếu bằng đường dẫn tuyệt đối từ root: `/images/...`, `/fonts/...`.
- Không đặt asset dùng trong app vào `src/assets/` trừ khi asset đó cần qua Vite build pipeline (import trực tiếp trong JS/CSS để hash tên file).

## File naming
- Component: PascalCase, trùng tên component (`CVForm.jsx`).
- Util/hook (nếu phát sinh sau này): camelCase (`useCvData.js`, `formatDate.js`).
- CSS file: trùng tên với component/module mà nó style.
