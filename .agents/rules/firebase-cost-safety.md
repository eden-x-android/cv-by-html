---
name: firebase-cost-safety
description: Hard rule bắt buộc — không tự động dùng dịch vụ Firebase/cloud có tính phí, luôn ưu tiên free tier
---

# Firebase / Cloud Cost Safety (Hard Rule)

Rule này bắt buộc với AI agent (Claude Code) khi thao tác trong repo — không phải quy ước code style, mà là ràng buộc hành vi khi động tới Firebase hoặc bất kỳ dịch vụ cloud nào.

## Cấm tuyệt đối
- **Không được tự động** bật, nâng cấp hoặc cấu hình bất kỳ dịch vụ/tính năng Firebase nào có khả năng phát sinh phí, bao gồm nhưng không giới hạn:
  - Nâng cấp plan Spark (free) → Blaze (pay-as-you-go).
  - Bật Cloud Functions, Cloud Storage vượt quota free tier, Firestore vượt giới hạn miễn phí.
  - Bật/thay đổi billing account, thêm payment method.
  - Thêm service mới vào `firebase.json` mà chưa xác nhận service đó có tính phí hay không.
- Nếu một thao tác được yêu cầu có khả năng đụng tới billing hoặc không chắc chắn có nằm trong free tier hay không → **dừng lại, hỏi người dùng xác nhận trước**, không tự suy đoán và thực hiện.

## Luôn ưu tiên
- Ưu tiên cấu hình/dịch vụ nằm trong giới hạn free tier. Firebase Hosting (đang dùng cho project `edenlabcvbuilder`, plan Spark) là ví dụ chuẩn cần giữ nguyên.
- Trước khi chạy các lệnh có khả năng ảnh hưởng billing hoặc project khác (`firebase deploy` kèm Cloud Functions, `firebase use <project khác>`, thay đổi `.firebaserc`/`firebase.json` thêm service mới), phải xác nhận với người dùng nếu chưa rõ hậu quả chi phí.
- Lệnh `firebase deploy --only hosting` (deploy tĩnh lên Hosting free tier) là thao tác an toàn, được phép thực hiện khi người dùng yêu cầu build/deploy — không cần hỏi lại mỗi lần, trừ khi cấu hình `firebase.json` đã thay đổi để bao gồm service khác ngoài `hosting`.
