import type { ApiResponse } from '../../types/common'
import { addDays, toISODate } from '../../utils/date'
import { isAssignment, type Assignment } from './types'

/** API giả lập: chờ `ms` mili-giây rồi trả về dữ liệu (generic) */
function mockRequest<T>(data: T, ms = 800): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data, status: 200, message: 'OK' }), ms)
  })
}

/** Dữ liệu mẫu, hạn nộp tính tương đối so với hôm nay để luôn có đủ các trạng thái */
const buildSeedData = (): unknown[] => {
  const today = new Date()
  const d = (offset: number) => toISODate(addDays(today, offset))
  const createdAt = today.toISOString()

  return [
    { id: 'a1', subject: 'Lập trình Web nâng cao', title: 'Bài thực hành 01 - Deadline Tracker', deadline: d(3), priority: 'high', completed: false, createdAt },
    { id: 'a2', subject: 'Cơ sở dữ liệu', title: 'Thiết kế ERD hệ thống thư viện', deadline: d(-2), priority: 'high', completed: false, createdAt },
    { id: 'a3', subject: 'Mạng máy tính', title: 'Báo cáo mô phỏng Packet Tracer', deadline: d(7), priority: 'medium', completed: false, createdAt },
    { id: 'a4', subject: 'Toán rời rạc', title: 'Bài tập chương 3 - Đồ thị', deadline: d(-5), priority: 'low', completed: true, createdAt },
    { id: 'a5', subject: 'Tiếng Anh chuyên ngành', title: 'Viết essay về AI', deadline: d(0), priority: 'medium', completed: false, createdAt },
    { id: 'a6', subject: 'Hệ điều hành', title: 'Lab 2 - Lập lịch CPU', deadline: d(14), priority: 'low', completed: false, createdAt },
    { id: 'a7', subject: 'Lập trình Web nâng cao', title: 'Quiz Redux Toolkit', deadline: d(-1), priority: 'medium', completed: true, createdAt },
    // Bản ghi lỗi để minh hoạ type guard lọc dữ liệu không hợp lệ
    { id: 'broken', subject: '', title: 'Dữ liệu hỏng', deadline: 'not-a-date', priority: 'urgent' },
  ]
}

export const assignmentApi = {
  async fetchAll(): Promise<ApiResponse<Assignment[]>> {
    const response = await mockRequest(buildSeedData())
    // Dữ liệu từ "server" là unknown -> dùng type guard để thu hẹp kiểu an toàn
    return { ...response, data: response.data.filter(isAssignment) }
  },
}
