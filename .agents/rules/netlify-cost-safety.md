---
name: netlify-cost-safety
description: Hard rule bắt buộc — không tự động dùng dịch vụ Netlify/cloud có tính phí, luôn ưu tiên free tier
---

# Netlify / Cloud Cost Safety (Hard Rule)

Rule này bắt buộc với AI agent (Claude Code) khi thao tác trong repo — không phải quy ước code style, mà là ràng buộc hành vi khi động tới Netlify, Resend hoặc bất kỳ dịch vụ cloud nào.

## Đang dùng (free tier)
- **Netlify Free plan**: static hosting (`dist/`), Functions (`netlify/functions/`), Edge Functions (`netlify/edge-functions/`), Blobs (store `auth` lưu OTP tạm).
- **Resend Free**: gửi email OTP (giới hạn 100 mail/ngày, 3.000 mail/tháng).
- Deploy production tự động khi push lên `master` (Netlify Git integration). Deploy preview cho branch/PR khác cũng được gate bởi login.

## Cấm tuyệt đối
- **Không được tự động** bật, nâng cấp hoặc cấu hình bất kỳ dịch vụ/tính năng nào có khả năng phát sinh phí, bao gồm nhưng không giới hạn:
  - Nâng cấp plan Netlify (Free → Personal/Pro), mua thêm credit, bật add-on trả phí (Analytics, Background Functions, Scheduled Functions vượt quota, v.v.).
  - Nâng plan Resend hoặc thêm dịch vụ gửi mail/SMS có tính phí.
  - Thay đổi billing, thêm payment method.
  - Thêm tính năng mới vào `netlify.toml` (plugin, function loại mới, integration) mà chưa xác nhận có nằm trong free tier hay không.
- Code không được tạo vòng lặp gọi function/edge/email không giới hạn (vd: gửi OTP không có cooldown) — dễ đốt quota.
- Nếu một thao tác có khả năng đụng tới billing hoặc không chắc có nằm trong free tier hay không → **dừng lại, hỏi người dùng xác nhận trước**.

## Được phép không cần hỏi lại
- Build local (`npm run build`), chạy `npm run dev:netlify`.
- Push lên branch feature. Push/merge vào `master` (trigger deploy production) chỉ khi người dùng yêu cầu.
