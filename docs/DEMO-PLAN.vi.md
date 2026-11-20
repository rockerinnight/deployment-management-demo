# Deployment Management System - Kế hoạch demo phỏng vấn

Để xem bản tiếng Anh, truy cập [DEMO-PLAN.en.md](./DEMO-PLAN.en.md).

## Mục đích và giới hạn

Xây dựng một bản tái hiện frontend độc lập để trình bày khi phỏng vấn, lấy cảm hứng
từ kinh nghiệm làm việc với Deployment Management System. Thể hiện các quyết định
kỹ thuật thông qua một quy trình triển khai hoàn chỉnh, thay vì xây dựng lại toàn bộ
tính năng của dự án doanh nghiệp.

Đây là mã nguồn demo được viết mới, không phải ứng dụng gốc của công ty. Sử dụng
tổ chức, người dùng, ứng dụng, máy chủ, môi trường, phiên bản và log giả lập.
Không sao chép mã nguồn, thương hiệu, địa chỉ nội bộ, thông tin xác thực hoặc
quy tắc nghiệp vụ độc quyền của công ty.

Phân biệt rõ kinh nghiệm thực tế ở dự án cũ với các tính năng mới của bản demo.
Không đưa ra kết quả kinh doanh hoặc cải thiện hiệu năng chưa được kiểm chứng.

## Kết quả hướng tới

- Demo ổn định trong 5-10 phút trên máy local, không phụ thuộc dịch vụ bên ngoài.
- Quy trình triển khai chỉn chu: phân quyền, kiểm tra dữ liệu, theo dõi tiến trình,
  xử lý thất bại và rollback.
- Ranh giới tính năng rõ ràng và phân định có chủ đích nơi quản lý từng loại state.
- Kiểm thử tự động tập trung vào hành vi quan trọng, kịch bản demo có thể lặp lại.
- README mô tả kiến trúc, quyết định kỹ thuật, giới hạn và lệnh chạy local.

## Công nghệ sử dụng

| Hạng mục | Lựa chọn | Mục đích |
| --- | --- | --- |
| UI | React + TypeScript + Vite | Frontend có kiểu dữ liệu rõ ràng, dễ bảo trì, phát triển local nhanh |
| Thành phần giao diện | Ant Design | Bảng, biểu mẫu, bố cục, phản hồi và chỉ báo trạng thái nhất quán |
| Styling | CSS Modules + stylesheet toàn cục nhỏ | Tùy chỉnh có phạm vi và dùng chung design token |
| Routing | React Router | Route theo tính năng, bảo vệ route và điều hướng trang chi tiết |
| Server state | TanStack Query | Lấy dữ liệu, cache, mutation, invalidation và polling tiến trình |
| Global state | Zustand | Chỉ quản lý danh tính giả lập và vai trò được chọn |
| Biểu mẫu | React Hook Form + Zod | Kiểm tra dữ liệu có kiểu và xử lý các trường phụ thuộc nhau |
| Mock API | Mock Service Worker (MSW) | Mô phỏng hành vi API qua HTTP mà không cần backend thật |
| Kiểm thử unit/component | Vitest + React Testing Library | Quy tắc phân quyền, validation và hành vi tương tác |
| Kiểm thử end-to-end | Playwright | Kiểm chứng quy trình demo trên trình duyệt |
| Chất lượng mã nguồn | ESLint + Prettier + TypeScript strict | Mã nguồn nhất quán và kiểm tra kiểu dữ liệu |

Khi khởi tạo dự án, chọn các phiên bản thư viện tương thích và còn được duy trì.
Không dùng lại phiên bản cũ chỉ vì chúng xuất hiện trong README gốc.

## Phạm vi MVP

### Bao gồm

- Khung ứng dụng xuyên suốt với điều hướng và nhãn "Interview demo" rõ ràng.
- Bộ chuyển danh tính/vai trò giả lập: Admin, Operator và Developer.
- Kiểm tra quyền truy cập route và thực hiện thao tác bằng một chính sách dùng chung.
- Dashboard nhỏ: tổng quan triển khai và hoạt động gần đây.
- Danh sách triển khai: lọc theo môi trường/trạng thái và phân trang.
- Biểu mẫu yêu cầu triển khai: ứng dụng, môi trường và phiên bản phát hành.
- Trang chi tiết: timeline vòng đời và log giả lập không chứa thông tin nhạy cảm.
- Kịch bản thành công và thất bại có kết quả xác định.
- Operator/Admin rollback một bản phát hành thất bại đủ điều kiện.
- Trạng thái tải, dữ liệu rỗng, validation, không đủ quyền và lỗi API rõ ràng.
- Thao tác reset demo khôi phục dữ liệu mẫu và xóa kết quả cache.

### Để sau

- CRUD người dùng/nhóm, quản trị dự án và giám sát máy chủ đầy đủ.
- Xác thực thật, phân quyền tại backend và thực thi triển khai production.
- Tích hợp CI/CD, SSH, container, tài khoản cloud và hạ tầng thực tế.
- Truyền log trực tiếp, observability production và cộng tác nhiều người dùng.

Không thao tác nào trong demo triển khai phần mềm hoặc thay đổi máy chủ thật.

## Kiến trúc và phân định nơi quản lý state

Tổ chức module theo tính năng:

```text
src/
  app/                 # Provider, router, khung ứng dụng, store danh tính giả lập
  features/
    dashboard/
    deployment/        # Hàm API, model, hook, schema, component, trang
  shared/              # Chính sách phân quyền, API client, UI dùng chung
  mocks/               # MSW handler, dữ liệu mẫu giả lập, bộ mô phỏng kịch bản
```

- TanStack Query quản lý bản ghi triển khai và dữ liệu dashboard.
- Zustand quản lý danh tính demo được chọn, không lưu bản sao dữ liệu server.
- React Hook Form quản lý dữ liệu nhập và trạng thái validation của biểu mẫu.
- Search parameter trên URL quản lý bộ lọc và phân trang danh sách.
- State cục bộ của component quản lý các chi tiết giao diện tạm thời.
- Tách hàm API khỏi mock handler để sau này có thể thay MSW bằng API thật mà
  không cần viết lại giao diện tính năng.
- Đặt tên file theo kebab-case, component theo PascalCase, hàm theo camelCase,
  hằng số theo UPPER_SNAKE_CASE.

## Chính sách phân quyền của demo

Bảng này là thiết kế cho demo, không khẳng định chính sách của công ty cũ.

| Khả năng | Admin | Operator | Developer |
| --- | --- | --- | --- |
| Xem dashboard, các lần triển khai và log | Có | Có | Có |
| Yêu cầu triển khai staging | Có | Có | Có |
| Yêu cầu triển khai production | Có | Có | Không |
| Rollback bản phát hành thất bại đủ điều kiện | Có | Có | Không |

Dùng cùng một chính sách cho điều hướng, quyền truy cập route và khả năng thực hiện
thao tác. Mock API handler cũng từ chối mutation không đủ quyền để thể hiện
hợp đồng request/response mong đợi.

Chuyển vai trò demo không phải xác thực. Route guard phía frontend và mock handler
trong trình duyệt đều không cung cấp bảo mật thực sự. Backend production phải
tự xác thực người dùng và thực thi phân quyền một cách độc lập.

## Kịch bản end-to-end

### Bối cảnh giả lập

- Dự án: Aurora Commerce.
- Ứng dụng: Orders API.
- Môi trường: Staging và Production.
- Phiên bản staging hoạt động tốt gần nhất: 1.8.0.
- Phiên bản mới cần triển khai: 1.9.0.
- Nhân vật: một Developer, một Operator và một Admin.

### Luồng demo chính: triển khai thất bại và khôi phục

1. Reset demo và chọn Developer.
2. Mở dashboard, xem hoạt động triển khai gần đây.
3. Mở danh sách triển khai; lọc Orders API trong môi trường Staging.
4. Yêu cầu triển khai 1.9.0 bằng kịch bản được gắn nhãn mô phỏng thất bại.
5. Thử gửi biểu mẫu chưa đầy đủ để thể hiện thông báo validation hữu ích.
6. Gửi yêu cầu hợp lệ; ngăn gửi trùng trong lúc đang xử lý.
7. Chuyển đến trang chi tiết lần triển khai mới.
8. Quan sát Queued -> Running -> Failed, với lỗi health check trong log giả lập.
9. Thể hiện Developer không thể yêu cầu production hoặc thực hiện rollback.
10. Chuyển sang Operator mà không mất ngữ cảnh lần triển khai đang xem.
11. Xác nhận rollback về phiên bản 1.8.0 đã biết là hoạt động tốt.
12. Quan sát Rolling back -> Rolled back và phiên bản đang chạy trở về 1.8.0.
13. Hiển thị lịch sử triển khai và số liệu dashboard đã cập nhật.

### Luồng thành công bổ trợ

Yêu cầu triển khai staging bằng kịch bản thành công và quan sát:
Queued -> Running -> Succeeded.

### Quy tắc vòng đời

- Bản phát hành thất bại trong demo là phiên bản mới đã được kích hoạt trước khi
  health check thất bại; rollback tường minh khôi phục phiên bản tốt gần nhất.
- Chỉ cho phép rollback lần triển khai thất bại mới nhất đủ điều kiện, có phiên bản
  trước đó hoạt động tốt và không có thao tác đang chạy gây xung đột.
- Từ chối chuyển trạng thái không hợp lệ, thao tác không đủ quyền và yêu cầu đang
  chạy bị trùng bằng lỗi API rõ ràng và phản hồi nhìn thấy được trên UI.
- Dùng thời gian kịch bản xác định, không tạo lỗi ngẫu nhiên.
- Tính tiến trình từ timestamp khi đọc bản ghi; thao tác đọc hoặc polling
  không được tự làm tiến trình triển khai chuyển sang bước tiếp theo.
- Dừng polling tiến trình khi thao tác đạt trạng thái kết thúc.
- Reset hủy hoạt động mô phỏng, khôi phục dữ liệu mẫu và xóa query state.

## Checklist triển khai

### 1. Khởi tạo và quy trình phát triển

- [x] Tạo tài liệu kế hoạch và khởi tạo Git repository local.
- [ ] Khởi tạo React + TypeScript bằng Vite.
- [ ] Cấu hình TypeScript strict, path alias, ESLint và Prettier.
- [ ] Thêm script dev, build, type-check, lint, test và test:e2e.
- [ ] Cấu hình Vitest/Testing Library và Playwright.
- [ ] Thêm README mô tả cách cài đặt, kiến trúc và giới hạn demo.

### 2. Domain model và mock API

- [ ] Định nghĩa kiểu cho ứng dụng, môi trường, phiên bản, lần triển khai và log.
- [ ] Tạo dữ liệu mẫu giả lập, gồm phiên bản hoạt động tốt và lịch sử gần đây.
- [ ] Định nghĩa endpoint cho dashboard, danh sách/chi tiết, yêu cầu, rollback và reset.
- [ ] Triển khai tiến trình thành công/thất bại xác định và điều kiện rollback.
- [ ] Triển khai phân trang, bộ lọc và thứ tự sắp xếp ổn định.
- [ ] Thêm độ trễ demo có thể cấu hình và kịch bản lỗi API một lần có nhãn rõ ràng.
- [ ] Trả lỗi validation, phân quyền, xung đột và không tìm thấy một cách tường minh.
- [ ] Xác định hành vi reload: khôi phục dữ liệu mẫu giả lập và ghi rõ trong tài liệu.

### 3. Khung ứng dụng và phân quyền

- [ ] Thêm khung ứng dụng, route dashboard/danh sách/chi tiết và trang không tìm thấy.
- [ ] Thêm bộ chuyển danh tính demo và nhãn không phải production.
- [ ] Tập trung logic kiểm tra quyền và áp dụng guard cho route/thao tác.
- [ ] Xóa query state phụ thuộc danh tính khi chuyển vai trò.
- [ ] Giữ ngữ cảnh điều hướng an toàn khi thay đổi vai trò.
- [ ] Thêm nhãn hỗ trợ tiếp cận, điều hướng bàn phím và chữ trạng thái dễ đọc.

### 4. Quy trình triển khai

- [ ] Xây dựng tổng quan dashboard và hoạt động gần đây.
- [ ] Xây dựng bảng triển khai với bộ lọc và phân trang lưu trên URL.
- [ ] Xây dựng biểu mẫu có validation với trường ứng dụng/môi trường/phiên bản phụ thuộc nhau.
- [ ] Ngăn gửi trùng và hiển thị lỗi mutation.
- [ ] Xây dựng timeline chi tiết, log và polling biết dừng ở trạng thái kết thúc.
- [ ] Thêm xác nhận rollback, phản hồi về điều kiện thực hiện và hiển thị tiến trình.
- [ ] Invalidate query chi tiết/danh sách/dashboard liên quan sau mutation.
- [ ] Thêm UI tải, dữ liệu rỗng, không đủ quyền, yêu cầu thất bại và thử lại.
- [ ] Thêm điều khiển reset đưa ứng dụng về trạng thái trình bày đã biết.

### 5. Kiểm chứng tập trung

- [ ] Kiểm thử từ chối triển khai production và rollback, kể cả request đến mock API.
- [ ] Kiểm thử giá trị trường phụ thuộc được xóa khi lựa chọn ở trường nguồn thay đổi.
- [ ] Kiểm thử validation yêu cầu và từ chối thao tác trùng/xung đột.
- [ ] Kiểm thử điều kiện rollback bản thất bại và khôi phục phiên bản hoạt động tốt.
- [ ] Kiểm thử lần triển khai đã kết thúc không tiếp tục tiến triển/polling.
- [ ] Kiểm thử reset khôi phục dữ liệu mẫu và loại bỏ dữ liệu cũ đang hiển thị.
- [ ] E2E: Developer gặp thất bại -> Operator rollback -> dashboard/lịch sử cập nhật.
- [ ] E2E: triển khai thành công và các thao tác Developer bị cấm.
- [ ] E2E: lỗi API được hiển thị, thử lại thành công mà không tạo bản ghi trùng.
- [ ] Chạy type-check, lint, kiểm thử tập trung, E2E và production build.
- [ ] Diễn tập trên production preview, không chỉ trên dev server.

### 6. Sẵn sàng phỏng vấn

- [ ] Thay nội dung chờ điền của case study bằng kinh nghiệm cá nhân đúng thực tế.
- [ ] Chuẩn bị sơ đồ kiến trúc ngắn và ghi chú quyết định trong README.
- [ ] Luyện demo trong 5-10 phút.
- [ ] Chụp ảnh màn hình dự phòng sau khi triển khai UI.
- [ ] Kiểm tra toàn bộ dữ liệu hiển thị là giả lập và log không chứa chi tiết nhạy cảm.
- [ ] Kiểm tra toàn bộ luồng demo chạy được mà không kết nối hệ thống công ty/cloud.

## Case study

Đây là các chủ đề đề xuất. Chỉ trình bày như kinh nghiệm dự án cũ sau khi xác nhận
chúng đúng với trách nhiệm thực tế; nếu không, ghi rõ là bài tập thiết kế cho demo.

### Case study 1: hành vi nhất quán theo vai trò

- Vấn đề: người dùng cần thao tác khác nhau mà UI không có hành vi mâu thuẫn.
- Trách nhiệm cá nhân: [Điền chính xác phạm vi bạn phụ trách.]
- Phương án: điều kiện kiểm tra vai trò rải rác hoặc chính sách khả năng dùng chung.
- Quyết định demo: dùng chung chính sách route/thao tác, mock từ chối request không hợp lệ.
- Minh chứng: Developer bị từ chối production và rollback; Operator có thể khôi phục.
- Khác biệt với production: backend thật phải thực thi phân quyền.
- Kết quả hoặc bài học thực tế: [Dùng minh chứng đã kiểm chứng; không bịa số liệu.]

### Case study 2: quản lý state và tính nhất quán của cache

- Vấn đề: thay đổi triển khai phải xuất hiện nhất quán ở trang chi tiết, lịch sử và
  tổng quan, không sao chép bản ghi server vào global state.
- Trách nhiệm cá nhân: [Điền.]
- Phương án: sao chép vào global store/lấy dữ liệu thủ công hoặc để query quản lý server state.
- Quyết định demo: TanStack Query quản lý bản ghi, Zustand quản lý danh tính demo,
  URL quản lý bộ lọc, React Hook Form quản lý dữ liệu nhập.
- Minh chứng: phản hồi mutation, các trang cập nhật, reset và chuyển vai trò.
- Đánh đổi: polling đơn giản cho demo; streaming có thể phù hợp với log production.
- Kết quả hoặc bài học thực tế: [Điền một ví dụ có thật.]

### Case study 3: UX xử lý thất bại bất đồng bộ và khôi phục

- Vấn đề: người dùng cần hiểu trạng thái triển khai đang chạy và khôi phục an toàn
  sau một bản phát hành thất bại.
- Trách nhiệm cá nhân: [Điền.]
- Phương án: một spinner duy nhất hoặc vòng đời, timeline và log rõ ràng.
- Quyết định demo: chuyển trạng thái xác định, lỗi nhìn thấy được, kiểm tra điều kiện
  và xác nhận rollback.
- Minh chứng: thất bại -> đổi vai trò -> rollback -> khôi phục phiên bản hoạt động tốt.
- Đánh đổi: ý nghĩa rollback phụ thuộc backend triển khai; kịch bản đơn giản này
  không mô hình hóa migration cơ sở dữ liệu hoặc khôi phục hệ thống phân tán.
- Kết quả hoặc bài học thực tế: [Điền, không khẳng định tính năng demo từng được phát hành.]

## Thứ tự trình bày và thời lượng

| Thời gian | Phần | Nội dung trình bày |
| --- | --- | --- |
| 0:00-0:45 | Bối cảnh và trách nhiệm | Bài toán nghiệp vụ, đóng góp thực tế, lưu ý đây là bản tái hiện |
| 0:45-1:30 | Kiến trúc | Module theo tính năng, nơi quản lý state, ranh giới mock API |
| 1:30-4:30 | Quy trình chính | Developer gửi yêu cầu, validation, tiến trình, health check thất bại |
| 4:30-6:00 | Khôi phục và phân quyền | Chuyển Operator, xác nhận rollback, state được cập nhật |
| 6:00-7:30 | Minh chứng kỹ thuật | Chính sách dùng chung, query hook, form schema, kiểm thử tập trung |
| 7:30-8:30 | Đánh đổi và bài học | Mock so với production, polling, phân quyền backend, bài học thực tế |
| 8:30-10:00 | Hỏi đáp hoặc luồng thành công | Kịch bản thành công tùy chọn và trao đổi với người phỏng vấn |

Nếu chỉ có năm phút, bỏ phần xem code trực tiếp và luồng thành công tùy chọn.
Trình bày bối cảnh, triển khai thất bại, giới hạn vai trò, rollback và một đánh đổi chính.

## Kế hoạch demo

### Trước buổi phỏng vấn

1. Cài dependency và các thành phần cần thiết cho kiểm thử trình duyệt từ trước.
2. Chạy các bước kiểm tra đã ghi trong tài liệu và build bản production.
3. Khởi chạy production preview bằng lệnh local đã ghi trong tài liệu.
4. Xác nhận mock service worker chặn và xử lý request trong bản preview.
5. Xác nhận không cần API bên ngoài và không sử dụng endpoint triển khai thật.
6. Reset và diễn tập toàn bộ kịch bản chính.
7. Mở ứng dụng cùng một vài tab code/kiểm thử liên quan.
8. Chuẩn bị sẵn ảnh màn hình dự phòng và dàn ý trình bày.

### Trong buổi phỏng vấn

- Bắt đầu bằng bài toán nghiệp vụ và đóng góp của bạn, không liệt kê công nghệ trước.
- Nói rõ một lần rằng dữ liệu, xác thực và thực thi triển khai đều được mô phỏng.
- Giải thích quyết định đồng thời minh họa tác động nhìn thấy được trên giao diện.
- Giữ nhãn kịch bản thất bại; không làm người xem hiểu đó là sự cố bất ngờ.
- Chỉ trình bày một lượng code nhỏ, gắn trực tiếp với các case study.
- Kết thúc bằng đánh đổi, bài học thực tế và điều cần thay đổi khi đưa lên production.

## Ghi chú demo và phương án dự phòng

- Vai trò là điều khiển phục vụ trình bày; không gọi bộ chuyển vai trò là đăng nhập an toàn.
- Màu trạng thái phải đi kèm chữ; không chỉ dựa vào màu.
- Dùng thời gian ngắn, có thể dự đoán để demo không phụ thuộc may rủi.
- Phân biệt rõ thất bại triển khai với lỗi request API/mạng.
- Không âm thầm thay lỗi API bằng dữ liệu trông như thành công.
- Tránh cập nhật lạc quan trạng thái kết thúc; hiển thị kết quả được API xác nhận.
- Reload khôi phục dữ liệu mẫu; reset còn xóa kịch bản/cache đang hoạt động trong bộ nhớ.
- Nếu demo trình duyệt gặp lỗi, dùng ảnh dự phòng và giải thích đường đi của code
  trung thực, không giả vờ quy trình đã hoàn tất.
- Tránh cài package trực tiếp, phụ thuộc dịch vụ ngoài hoặc thay đổi hạ tầng
  trong buổi phỏng vấn.
- Không tuyên bố mô phỏng chỉ chạy trong trình duyệt có bảo mật hoặc độ tin cậy
  vận hành đạt mức "production-ready".

## Tiêu chí hoàn thành

- Toàn bộ kịch bản chính vượt qua kiểm thử trình duyệt tự động và diễn tập thủ công.
- Production preview chạy local với dữ liệu giả lập và kết quả xác định.
- Phân quyền, validation, thất bại, rollback, cập nhật cache và reset hoạt động
  đúng như mô tả phía trên.
- Type-check, lint, kiểm thử và production build đều thành công.
- README cung cấp cách cài đặt, kiến trúc, hướng dẫn demo và giới hạn.
- Các tuyên bố trong case study phân biệt rõ kinh nghiệm cũ đã kiểm chứng
  với phần bổ sung cho demo.
