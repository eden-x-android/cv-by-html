---
name: css-conventions
description: CSS naming, biến, đơn vị và inline-style convention cho project cv-by-html
---

# CSS Conventions

## Class naming
- Kebab-case cho mọi class (`form-item`, `contact-info-item-vertical-align`). Không dùng BEM (`block__element--modifier`).

## Biến màu / spacing
- Mọi màu sắc và giá trị lặp lại phải khai báo qua CSS custom property trong `Global.css` (`:root { --blue: ...; --semi-black: ...; }`), không hardcode hex trực tiếp ở file CSS khác.
  ```css
  /* Global.css */
  :root {
      --blue: #1a73e8;
      --semi-black: #333;
  }

  /* Dùng ở file khác */
  color: var(--semi-black);
  ```
- Nếu cần thêm màu/spacing mới, thêm biến vào `Global.css` trước, không tự hardcode giá trị mới trong file component-specific.

## Đơn vị
- `rem` cho typography và spacing (padding, margin, font-size).
- `px` chỉ dùng cho border, box-shadow, hoặc giá trị cần chính xác tuyệt đối (vd: `border: 1px solid`).
- `mm` chỉ dùng cho kích thước trang in (`width: 210mm`).
- `%` cho layout tỉ lệ (flex-basis, width chia cột).

## Inline style vs class
- Inline style (`style={{...}}`) chỉ dùng cho giá trị **động, phụ thuộc state/props** (vd: `opacity` khi đang kéo-thả item).
- Mọi styling tĩnh (không đổi theo state) phải đưa vào class CSS, kể cả khi chỉ dùng ở một chỗ.

## Tổ chức file & print
- Biến toàn cục, reset, `@font-face` đặt ở `Global.css`, import một lần ở `main.jsx`.
- Mỗi component nên có file CSS riêng cùng tên, import ngay trong file component đó (xem `.agent/rules/file-organization.md`).
- Style cho chế độ in dùng `@media print`, theo pattern đã có (`.no-print` để ẩn khi in, `.page-break` để ngắt trang).
