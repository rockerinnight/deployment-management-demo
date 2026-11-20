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

Hệ thống gốc là ứng dụng full-stack tích hợp Jenkins; demo chỉ tái hiện luồng
tương tác frontend. Không đưa tài liệu lưu trữ gốc vào bản demo chia sẻ công khai.

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
| Server state | TanStack Query | Lấy snapshot, cache, mutation và invalidation |
| Tiến trình triển khai | EventSource (SSE) | Nhận cập nhật được đẩy theo deployment ID, không polling |
| Global state | Zustand | Chỉ quản lý danh tính giả lập và vai trò được chọn |
| Biểu mẫu | React Hook Form + Zod | Kiểm tra dữ liệu có kiểu và xử lý các trường phụ thuộc nhau |
| Mock API | Mock Service Worker (MSW) | Mô phỏng API snapshot, mutation và luồng SSE qua HTTP |
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
- Biểu mẫu yêu cầu triển khai mở trong dialog từ nút **Thêm mới** trên danh sách,
  với các trường ứng dụng, môi trường, phiên bản và kịch bản mô phỏng.
- Trang chi tiết: timeline vòng đời và log giả lập không chứa thông tin nhạy cảm.
- Dashboard, danh sách và chi tiết kết hợp snapshot với cập nhật từ EventSource
  cho job đang chạy hoặc thao tác cần theo dõi.
- Kịch bản thành công và thất bại có kết quả xác định.
- Operator/Admin rollback một bản phát hành thất bại đủ điều kiện.
- Trạng thái tải, dữ liệu rỗng, validation, không đủ quyền và lỗi API rõ ràng.
- Thao tác reset demo khôi phục dữ liệu mẫu và xóa kết quả cache.

### Để sau

- CRUD người dùng/nhóm, quản trị dự án và giám sát máy chủ đầy đủ.
- Xác thực thật, phân quyền tại backend và thực thi triển khai production.
- Tích hợp CI/CD, SSH, container, tài khoản cloud và hạ tầng thực tế.
- Reject, Re-deploy và các quy tắc approve/complete đầy đủ của hệ thống gốc.
- Truyền log trực tiếp, observability production và cộng tác nhiều người dùng.

Không thao tác nào trong demo triển khai phần mềm hoặc thay đổi máy chủ thật.

### Tham chiếu giao diện

- Dùng bố cục thanh điều hướng trên, bảng, nhãn trạng thái và trang chi tiết
  từ các ảnh tham chiếu tông xanh lam/teal. Không sao chép nhận diện, tên
  người dùng hoặc dữ liệu của hệ thống gốc. Ảnh đăng nhập chỉ tham chiếu màu
  sắc; demo dùng bộ chuyển vai trò, không có màn hình đăng nhập.
- Ảnh số 5 tham chiếu bố cục dialog tạo yêu cầu, không tham chiếu màu đỏ cũ.
  Áp dụng cùng theme xanh lam/teal cho tiêu đề và nút chính, giữ màu đỏ cho
  lỗi hoặc thất bại. Không mở rộng form sang các trường ngoài MVP chỉ vì
  chúng xuất hiện trong ảnh.
- Ảnh số 6 chỉ tham chiếu bố cục dashboard: tổng số job, số job đang chạy,
  thành công và thất bại ở trên; hoạt động gần đây với liên kết chi tiết ở dưới.
  Dùng theme xanh lam/teal và nội dung tiếng Anh. Bỏ bộ lọc dashboard, tỷ lệ
  thành công và số liệu tổng hợp về nhóm, dự án, ứng dụng.

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
- Dashboard, danh sách và chi tiết lấy snapshot riêng. Snapshot và API theo dõi
  tiến trình trả dữ liệu độc lập; frontend ghép theo deployment ID. Khi snapshot
  có job `in-progress`, gửi các deployment ID chưa được theo dõi lên API tiến
  trình, không cần đợi người dùng thao tác. Approve, Rollback và Complete cũng
  có thể bắt đầu theo dõi. Với rollback, lấy ID job mới từ payload SSE để chèn
  hàng và áp dụng các cập nhật tiếp theo.
- UI hiển thị ngay khi có snapshot, kể cả với job `in-progress`. Ghép cập nhật
  SSE theo deployment ID vào dữ liệu đang hiển thị; nếu SSE đến trước snapshot,
  giữ cập nhật đó để ghép khi snapshot về. Không chờ SSE để hiển thị và không
  chủ động lấy lại snapshot khi nhận sự kiện, kể cả sự kiện kết thúc job.
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
| Approve yêu cầu đang pending | Có | Có | Không |
| Rollback bản phát hành thất bại đủ điều kiện | Có | Có | Không |
| Complete job thành công đủ điều kiện | Có | Có | Không |

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
3. Mở danh sách triển khai và lọc theo môi trường Staging.
4. Chọn **Thêm mới** để mở dialog, chọn Orders API và thử gửi khi còn thiếu dữ
   liệu để minh họa validation.
5. Hoàn tất biểu mẫu cho phiên bản 1.9.0 và chọn kịch bản có nhãn mô phỏng thất bại.
6. Gửi yêu cầu hợp lệ; ngăn gửi trùng trong lúc request đang xử lý.
7. Mở chi tiết job `pending`; minh họa Developer không thể Approve hoặc yêu
   cầu Production. Chuyển sang Operator mà không mất ngữ cảnh job.
8. Chọn Approve để bắt đầu triển khai và mở EventSource. Theo dõi tiến trình
   từ 0% đến 100% và trạng thái `in-progress` -> `done`; kết quả là thất bại do
   health check, thể hiện trong log giả lập.
9. Xác nhận Rollback. Job mới triển khai lại build 1.8.0, xuất hiện đầu bảng
   Staging từ sự kiện SSE và được theo dõi theo ID mới. Job 1.9.0 vẫn giữ kết
   quả thất bại và liên kết đến job rollback.
10. Kiểm tra build đang chạy là 1.8.0 và dashboard/lịch sử đã cập nhật. Nếu còn
    thời gian, chọn Complete trên job khôi phục thành công để xác nhận đã kiểm
    tra và khóa các thao tác thay đổi job; vẫn xem được log.

### Luồng thành công bổ trợ

Tạo yêu cầu staging với kịch bản thành công; Operator Approve rồi theo dõi
`pending` -> `in-progress` -> `done`, với kết quả thành công.

### Quy tắc vòng đời

- Tạo yêu cầu chỉ ghi job `pending`. Approve bắt đầu chạy và theo dõi tiến độ
  0–100%; `done` nghĩa là thực thi đã kết thúc, không đồng nghĩa với thành công
  hay đã Complete. Kết quả thành công/thất bại và xác nhận được lưu riêng.
- Complete là bước xác nhận sau khi kiểm tra, không chạy lại job. Demo chỉ cho
  Complete job đã chạy thành công; sau xác nhận, API từ chối các thao tác thay
  đổi trên job đó, nhưng log vẫn đọc được.

- Bản phát hành thất bại trong demo là phiên bản mới đã được kích hoạt trước khi
  health check thất bại. Rollback tạo job riêng, có ID mới, liên kết với job thất
  bại và triển khai lại bản build thành công gần nhất, không triển khai lại bản
  thất bại. Chỉ khi job rollback thành công mới ghi nhận đã khôi phục.
- Trên trang đầu của bảng sắp mới nhất trước, chèn job rollback từ sự kiện lên
  đầu danh sách đang hiển thị nếu khớp bộ lọc. Chỉ bỏ các hàng vượt `pageSize`
  ở cuối bảng; nếu trang còn chỗ thì không bỏ hàng nào. Sự kiện lặp cập nhật
  theo ID, không chèn hoặc cắt thêm hàng; không xóa bản ghi khỏi dữ liệu nguồn.
- Chỉ cho phép rollback lần triển khai thất bại mới nhất đủ điều kiện, có phiên bản
  trước đó hoạt động tốt và không có thao tác đang chạy gây xung đột.
- Từ chối chuyển trạng thái không hợp lệ, thao tác không đủ quyền và yêu cầu đang
  chạy bị trùng bằng lỗi API rõ ràng và phản hồi nhìn thấy được trên UI.
- Bộ mô phỏng chuyển trạng thái theo lịch xác định và phát sự kiện khi trạng
  thái đổi, kể cả khi không có màn hình theo dõi. Đọc snapshot hoặc đăng ký SSE
  không làm tiến trình tiến thêm một bước.
- Sau khi mở, giữ stream tới khi người dùng rời trang, kể cả khi job đã kết
  thúc. Không có sự kiện mới là bình thường khi dữ liệu không thay đổi.
- Reset đóng stream, hủy hoạt động mô phỏng và request đang chờ, khôi phục dữ
  liệu mẫu và xóa query state; phản hồi cũ không được cập nhật lại cache.

## Checklist triển khai

### 1. Khởi tạo và quy trình phát triển

- [x] Tạo tài liệu kế hoạch và khởi tạo Git repository local.
- [x] Khởi tạo React + TypeScript bằng Vite.
- [x] Cấu hình TypeScript strict, path alias, ESLint và Prettier.
- [x] Thêm script dev, build, preview, type-check, lint, test và test:e2e.
- [x] Cấu hình Vitest và Playwright.
- [ ] Cấu hình React Testing Library cho kiểm thử component.
- [x] Thêm README mô tả cách cài đặt, kiến trúc và giới hạn demo.

### 2. Domain model và mock API

- [x] Định nghĩa kiểu cho ứng dụng, môi trường, phiên bản, lần triển khai và log.
- [x] Tạo dữ liệu mẫu giả lập, gồm phiên bản hoạt động tốt và lịch sử gần đây.
- [x] Thêm endpoint snapshot cho dashboard và danh sách/chi tiết, endpoint SSE,
  cùng endpoint tạo yêu cầu, Approve, Rollback và reset.
- [ ] Thêm endpoint Complete.
- [x] Mô phỏng tiến trình thất bại và khôi phục thành công với điều kiện rollback.
- [ ] Thêm kịch bản triển khai thành công độc lập.
- [x] Triển khai phân trang, bộ lọc và thứ tự sắp xếp ổn định.
- [ ] Thêm độ trễ demo có thể cấu hình và kịch bản lỗi API một lần có nhãn rõ ràng.
- [x] Trả lỗi validation, phân quyền, xung đột và không tìm thấy một cách tường minh.
- [x] Xác định hành vi reload: khôi phục dữ liệu mẫu giả lập và ghi rõ trong tài liệu.

### 3. Khung ứng dụng và phân quyền

- [x] Thêm khung ứng dụng, route dashboard/danh sách/chi tiết và trang không tìm thấy.
- [x] Thêm bộ chuyển danh tính demo và nhãn không phải production.
- [x] Tập trung logic kiểm tra quyền và áp dụng guard cho route/thao tác.
- [ ] Xóa query state phụ thuộc danh tính khi chuyển vai trò nếu có; snapshot hiện dùng chung giữa các vai trò.
- [x] Giữ ngữ cảnh điều hướng an toàn khi thay đổi vai trò.
- [x] Thêm nhãn hỗ trợ tiếp cận, điều hướng bàn phím và chữ trạng thái dễ đọc.

### 4. Quy trình triển khai

- [x] Xây dựng tổng quan dashboard và hoạt động gần đây.
- [x] Xây dựng bảng triển khai với bộ lọc và phân trang lưu trên URL.
- [x] Xây dựng biểu mẫu tạo yêu cầu có validation.
- [ ] Xử lý các trường ứng dụng/môi trường/phiên bản phụ thuộc nhau.
- [x] Ngăn gửi trùng và hiển thị lỗi mutation.
- [x] Hiển thị timeline và log ở trang chi tiết, phần trăm tiến độ trên cả ba màn hình.
- [x] Theo dõi EventSource từ snapshot trên cả ba màn hình và từ thao tác Approve/Rollback.
- [x] Thêm thao tác Approve.
- [ ] Thêm xác nhận Complete.
- [x] Thêm xác nhận rollback, theo dõi ID mới và cập nhật đầu bảng theo bộ lọc.
- [ ] Invalidate query liên quan cho mutation không được cập nhật qua SSE.
- [x] Với thao tác có SSE, cập nhật dữ liệu đang hiển thị mà không lấy lại snapshot.
- [x] Thêm UI tải, dữ liệu rỗng, không đủ quyền, yêu cầu thất bại và thử lại.
- [x] Thêm điều khiển reset đưa ứng dụng về trạng thái trình bày đã biết.

### 5. Kiểm chứng tập trung

- [x] Kiểm thử Developer bị từ chối khi yêu cầu triển khai Production qua mock API.
- [x] Kiểm thử bộ mô phỏng từ chối Rollback của Developer.
- [ ] Kiểm thử Developer bị từ chối khi gọi endpoint Rollback của mock API.
- [ ] Kiểm thử giá trị trường phụ thuộc được xóa khi lựa chọn ở trường nguồn thay đổi.
- [x] Kiểm thử validation trên biểu mẫu và bộ mô phỏng từ chối thao tác trùng/xung đột.
- [x] Kiểm thử Rollback tạo job mới, chèn đúng một hàng khi nhận lại sự kiện và
  giữ kết quả thất bại của job gốc.
- [ ] Kiểm thử Complete chặn thao tác thay đổi nhưng vẫn cho xem log.
- [x] Kiểm thử với `pageSize = 10`: 10 hàng + 1 job rollback thì bỏ đúng 1
  hàng cuối; 9 hàng + 1 job thì không bỏ hàng nào. SSE không gọi lại snapshot.
- [x] Kiểm thử tự theo dõi đúng ID từ snapshot có job `in-progress` và theo dõi khi thao tác Approve/Rollback.
- [ ] Kiểm thử không đăng ký trùng và stream vẫn mở khi job kết thúc.
- [ ] Kiểm thử stream đóng khi rời trang.
- [ ] Kiểm thử UI hiển thị snapshot khi chưa có SSE và ghép đúng với cả hai thứ tự dữ liệu đến.
- [x] Kiểm thử reset khi còn kết nối SSE: stream đóng và dữ liệu cũ không xuất hiện lại.
- [ ] Kiểm thử reset khi request đang chờ: phản hồi cũ không ghi lại vào cache.
- [x] E2E: Developer tạo yêu cầu -> Operator Approve -> thất bại -> Rollback ->
  job mới xuất hiện và dashboard/lịch sử cập nhật.
- [ ] E2E: triển khai thành công và các thao tác Developer bị cấm.
- [ ] E2E: lỗi API được hiển thị, thử lại thành công mà không tạo bản ghi trùng.
- [x] Kiểm chứng SSE sớm trên Vite production preview local ngay khi luồng
  Approve → thất bại → Rollback chạy được. Kiểm tra tiến trình cập nhật khi
  job đang chạy, job rollback xuất hiện đầu bảng đúng `pageSize`, và sự kiện
  SSE không kích hoạt request snapshot.
- [x] Chạy type-check, lint, kiểm thử tập trung, E2E và production build.
- [ ] Diễn tập thủ công trên production preview, không chỉ trên dev server.

### 6. Sẵn sàng phỏng vấn

- [ ] Rà soát lời trình bày case study để tách rõ kinh nghiệm thực tế và thiết kế demo.
- [ ] Chuẩn bị sơ đồ kiến trúc ngắn và ghi chú quyết định trong README.
- [ ] Luyện demo trong 5-10 phút.
- [ ] Chụp ảnh màn hình dự phòng sau khi triển khai UI.
- [ ] Kiểm tra toàn bộ dữ liệu hiển thị là giả lập và log không chứa chi tiết nhạy cảm.
- [ ] Kiểm tra toàn bộ luồng demo chạy được mà không kết nối hệ thống công ty/cloud.

## Case study

Các mục trách nhiệm và kết quả mô tả dự án gốc. Quyết định và minh chứng demo
được ghi riêng; không suy rộng từ mô phỏng sang hệ thống thật.

### Case study 1: hành vi nhất quán theo vai trò

- Vấn đề: người dùng cần thao tác khác nhau mà UI không có hành vi mâu thuẫn.
- Trách nhiệm cá nhân: lưu quyền của người dùng đã xác thực trong `authStore`
  để ẩn/hiện các chức năng tương tác theo quyền ở frontend.
- Phương án: điều kiện kiểm tra vai trò rải rác hoặc chính sách khả năng dùng chung.
- Quyết định demo: dùng chung chính sách route/thao tác, mock từ chối request không hợp lệ.
- Minh chứng: Developer bị từ chối production và rollback; Operator có thể khôi phục.
- Ranh giới trách nhiệm: backend xác thực Bearer access token trong header
  `Authorization` và kiểm tra quyền với từng request; phần này không do mình đảm nhận.
- Kết quả thực tế: UI chỉ đưa ra các thao tác người dùng có quyền thực hiện;
  backend là lớp ngăn request vượt quyền.

### Case study 2: quản lý state và tính nhất quán của cache

- Vấn đề: thay đổi triển khai phải xuất hiện nhất quán ở trang chi tiết, lịch sử và
  tổng quan, không sao chép bản ghi server vào global state.
- Trách nhiệm cá nhân: trên dashboard, danh sách và chi tiết, gọi API snapshot
  riêng của mỗi màn hình. Theo dõi job `in-progress` từ snapshot bằng
  `EventSource`; Approve, Reject, Rollback và Complete cũng có thể bắt đầu
  theo dõi. API theo dõi tiến trình không phụ thuộc response snapshot.
  Ghép dữ liệu hai API để hiển thị. Với rollback trên bảng, chèn record mới từ
  response theo dõi lên đầu danh sách và chỉ bỏ hàng cuối nếu vượt `pageSize`.
- Phương án: sao chép vào global store/lấy dữ liệu thủ công hoặc để query quản lý server state.
- Quyết định demo: TanStack Query giữ snapshot và dữ liệu hợp nhất từ SSE; Zustand
  giữ danh tính demo, URL giữ bộ lọc, React Hook Form giữ dữ liệu nhập.
- Minh chứng: Approve cập nhật % tiến trình; job rollback xuất hiện đầu bảng
  mà không cần tải lại trang.
- Đánh đổi: SSE đưa cập nhật đến UI nhưng cần quản lý vòng đời kết nối và đồng bộ
  lại sau gián đoạn. Demo chỉ stream tiến trình, không stream log.
- Kết quả thực tế: tiến trình và trạng thái triển khai cập nhật theo thời gian
  thực thay vì chỉ hiển thị snapshot ban đầu.

### Case study 3: UX xử lý thất bại bất đồng bộ và khôi phục

- Vấn đề: người dùng cần hiểu trạng thái triển khai đang chạy và khôi phục an toàn
  sau một bản phát hành thất bại.
- Trách nhiệm cá nhân: trên bảng deployment, hiển thị trạng thái tổng thể
  (thành công, thất bại, đang chạy) và các nút xem Jenkins log, Approve, Reject,
  Complete, Rollback và Re-deploy ở cột cuối. Cả ba vai trò đều xem được log;
  các thao tác còn lại phụ thuộc quyền và điều kiện của job. Tiến trình được
  cập nhật như CS2.
- Hành vi hệ thống gốc: rollback tạo một job triển khai mới để triển khai lại
  bản build thành công trước đó, không phải bản build của job được chọn rollback.
- Approve bắt đầu job (`pending` -> `in-progress` -> `done`) và theo dõi tiến
  độ 0–100%; Complete xác nhận job sau khi kiểm tra và khóa các thao tác khác.
- Phương án: một spinner duy nhất hoặc vòng đời, timeline và log rõ ràng.
- Quyết định demo: giữ log giả lập, Approve, Rollback và Complete với quy tắc
  đơn giản; không thêm nút hoặc API cho Reject và Re-deploy. Rollback tạo
  job mới triển khai lại bản build thành công trước đó.
- Minh chứng: thất bại -> đổi vai trò -> rollback -> khôi phục phiên bản hoạt động tốt.
- Đánh đổi: ý nghĩa rollback phụ thuộc backend triển khai; kịch bản đơn giản này
  không mô hình hóa migration cơ sở dữ liệu hoặc khôi phục hệ thống phân tán.
- Kết quả thực tế: người dùng theo dõi được tiến trình và đọc Jenkins log để
  biết lỗi là gì, từ đó chọn thao tác tiếp theo khi job thất bại.

## Thứ tự trình bày và thời lượng

| Thời gian | Phần | Nội dung trình bày |
| --- | --- | --- |
| 0:00-0:45 | Bối cảnh và trách nhiệm | Bài toán nghiệp vụ, đóng góp thực tế, lưu ý đây là bản tái hiện |
| 0:45-1:30 | Kiến trúc | Module theo tính năng, nơi quản lý state, ranh giới mock API |
| 1:30-4:30 | Quy trình chính | Developer gửi yêu cầu, validation, chuyển Operator, Approve và health check thất bại |
| 4:30-6:00 | Khôi phục | Rollback tạo job mới đầu bảng, kiểm tra bản đã khôi phục; Complete nếu còn thời gian |
| 6:00-7:30 | Minh chứng kỹ thuật | Chính sách dùng chung, query hook, form schema, kiểm thử tập trung |
| 7:30-8:30 | Đánh đổi và bài học | Mock so với production, vòng đời SSE, phân quyền backend, bài học thực tế |
| 8:30-10:00 | Hỏi đáp hoặc luồng thành công | Kịch bản thành công tùy chọn và trao đổi với người phỏng vấn |

Nếu chỉ có năm phút, bỏ phần xem code trực tiếp, Complete và luồng thành công tùy chọn.
Trình bày bối cảnh, triển khai thất bại, giới hạn vai trò, rollback và một đánh đổi chính.

## Kế hoạch demo

### Trước buổi phỏng vấn

1. Cài dependency và các thành phần cần thiết cho kiểm thử trình duyệt từ trước.
2. Chạy các bước kiểm tra đã ghi trong tài liệu và build bản production.
3. Chạy `npm run build`, rồi `npm run preview` khi dự án đã có các script Vite.
   Mở URL localhost mà Vite in ra để thử bản build, không cần deploy hay domain.
4. Xác nhận mock service worker xử lý request và trình duyệt nhận từng sự kiện
   SSE trước khi luồng kết thúc trong bản preview.
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
