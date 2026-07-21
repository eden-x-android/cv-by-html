---
name: react-conventions
description: React/JSX component, state, và naming convention cho project cv-by-html
---

# React / JSX Conventions

## Component declaration
- Luôn khai báo component bằng **arrow-function const**, kể cả component gốc (`App`). Không dùng `function Component() {}`.
  ```jsx
  const CVForm = ({ data, onChange }) => {
    // ...
  };
  ```
- Mỗi file chỉ chứa **1 component**. Tên file PascalCase trùng tên component (`CVForm.jsx` → `CVForm`).
- `export default ComponentName;` đặt ở **cuối file**, không dùng `export default function` hay named export cho component chính.

## State management
- State phức tạp (toàn bộ dữ liệu CV) đặt ở component cha bằng `useState`, truyền xuống con qua props (prop drilling). Chưa cần Context/Redux ở quy mô hiện tại — chỉ cân nhắc Context khi prop drilling vượt quá 2-3 cấp.
- Update state lồng nhau qua callback + spread, không mutate trực tiếp:
  ```js
  const handleDataChange = (section, field, value) => {
      setCvData(prevData => {
          if (field === null) return { ...prevData, [section]: value };
          return { ...prevData, [section]: { ...prevData[section], [field]: value } };
      });
  };
  ```
- Khi update mảng object lồng nhau, phải copy đúng cả object bên trong, **không** mutate phần tử đã copy nông:
  ```js
  // Sai — mutate object gốc dù mảng ngoài đã copy
  const newArray = [...data[section]];
  newArray[index][field] = value;

  // Đúng
  const newArray = data[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
  );
  ```

## Naming
- Hàm xử lý sự kiện/thao tác người dùng luôn có tiền tố `handleX` — kể cả thêm/xóa item (`handleAddItem`, `handleRemoveItem`, không dùng `addItem`/`removeItem` trần).
- Biến/props: camelCase. Boolean: tiền tố `is`/`has` (`isUploading`, `hasError`).
- Field boolean trong data model không được trùng lặp ý nghĩa (tránh kiểu `pageBreak` và `pageBreakAfter` cùng tồn tại) — chỉ giữ 1 field cho 1 khái niệm.
- Array item trong list có thể thêm/xóa/sắp xếp lại (drag-and-drop) nên có `id` ổn định (uuid hoặc timestamp), không chỉ dựa vào index.

## JSX patterns
- Conditional render dùng `&&`, tránh ternary lồng sâu cho render block:
  ```jsx
  {personalInfo.address && (
      <div className="contact-info">...</div>
  )}
  ```
- List render dùng `.map()`. Nếu list **có thể reorder/thêm/xóa**, `key` phải là id ổn định của item, không dùng `key={index}`. Chỉ dùng index làm key cho list tĩnh, không đổi thứ tự.
- Inline style chỉ dùng cho giá trị phụ thuộc state/props động (vd: opacity khi đang kéo-thả). Styling tĩnh luôn đưa vào class CSS, không viết `style={{ ... }}` cho giá trị cố định.
- Không để lại `console.log`/`console.error` trong render path hoặc trong code merge vào nhánh chính. Nếu cần debug tạm, xóa trước khi commit.
- Cân nhắc kỹ trước khi dùng `dangerouslySetInnerHTML`, đặc biệt với dữ liệu có thể đến từ file JSON người dùng import — ưu tiên sanitize hoặc parse thành JSX thay vì chèn HTML thô nếu có thể.
