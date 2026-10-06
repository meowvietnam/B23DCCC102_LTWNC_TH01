# B23DCCC102_LTWNC_TH01 – Student Deadline Tracker

Ứng dụng quản lý deadline bài tập cá nhân – **LTWNC Bài thực hành 01**.

## Chạy dự án

```bash
npm install
npm run dev      # chạy dev server
npm run build    # type-check + build production
npm run lint     # oxlint
```

## Chức năng

1. Hiển thị danh sách bài tập: môn học, tên bài, hạn nộp, độ ưu tiên, trạng thái hoàn thành
2. Thêm bài tập mới qua form (có validate)
3. Đánh dấu / bỏ đánh dấu hoàn thành
4. Xoá bài tập (có xác nhận)
5. Lọc theo trạng thái: Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành (kèm số lượng)
6. Mỗi bài hiển thị **"Còn X ngày"** hoặc **"Quá hạn Y ngày"**
7. Khi khởi động, lấy dữ liệu mẫu từ API giả lập (`createAsyncThunk`, có loading / lỗi / thử lại)

> "Chưa hoàn thành" = chưa xong và **chưa** quá hạn; bài chưa xong đã qua hạn nằm ở tab "Quá hạn".

## Cấu trúc (feature-based)

```
src/
├── app/
│   ├── store.ts                 # configureStore, RootState, AppDispatch
│   └── hooks.ts                 # useAppDispatch, useAppSelector (typed hooks)
├── components/
│   └── Tabs.tsx                 # Compound Component <Tabs> + <Tabs.Tab>
├── features/assignments/
│   ├── types.ts                 # Assignment, Priority, FilterStatus, type guards
│   ├── assignmentApi.ts         # API giả lập (generic mockRequest<T>)
│   ├── assignmentsSlice.ts      # createSlice + createAsyncThunk
│   ├── selectors.ts             # createSelector: tính số ngày, lọc, đếm, sắp xếp
│   ├── hooks/useAssignments.ts  # custom hook facade cho feature
│   └── components/              # AssignmentForm, AssignmentFilter, AssignmentList, AssignmentItem
├── hooks/
│   ├── useForm.ts               # custom hook generic quản lý form
│   └── useToday.ts              # ngày hiện tại, tự cập nhật qua nửa đêm
├── types/common.ts              # ApiResponse<T>, FormErrors<T>, StringifyFields<T>, type guards
└── utils/date.ts                # xử lý ngày, nhãn "Còn X ngày"/"Quá hạn Y ngày"
```

## Kiến thức vận dụng

| Buổi | Nội dung | Vị trí |
| --- | --- | --- |
| 1 – TypeScript nâng cao | **Generic**: `ApiResponse<T>`, `mockRequest<T>`, `useForm<T>`, `Tabs<T>`, `isOneOf<T>` | `types/common.ts`, `assignmentApi.ts`, `hooks/useForm.ts`, `components/Tabs.tsx` |
| | **Utility types**: `Omit`, `Partial`, `Record`, `Exclude`, mapped type `StringifyFields<T>`, `(typeof X)[number]` | `types/common.ts`, `features/assignments/types.ts` |
| | **Type guard**: `isAssignment`, `isPriority`, `isFilterStatus`, `isISODateString`… (lọc dữ liệu hỏng từ API, chuyển giá trị form sang đúng kiểu) | `features/assignments/types.ts`, `assignmentApi.ts`, `AssignmentForm.tsx` |
| 2 – Design pattern React | **Custom hook nâng cao**: `useForm<T>` (generic, validate, touched, `register`), `useAssignments` (facade che giấu Redux), `useToday` | `hooks/`, `features/assignments/hooks/` |
| | **Compound Component**: `<Tabs>` chia sẻ state qua Context cho `<Tabs.Tab>` | `components/Tabs.tsx`, `AssignmentFilter.tsx` |
| 3 – Redux Toolkit + TS | Feature-based structure, typed hooks (`withTypes`), `createSlice` (+ `prepare`), `createAsyncThunk` (generic `rejectValue`, `condition`), `createSelector` | `app/`, `features/assignments/` |
