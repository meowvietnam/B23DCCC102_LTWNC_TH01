import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { AsyncStatus } from '../../types/common'
import { assignmentApi } from './assignmentApi'
import type { Assignment, FilterStatus, NewAssignmentInput } from './types'

export interface AssignmentsState {
  items: Assignment[]
  status: AsyncStatus
  error: string | null
  filter: FilterStatus
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
}

/* ------------------------------ Async thunk ------------------------------ */

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { state: RootState; rejectValue: string }
>(
  'assignments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.fetchAll()
      return response.data
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Không thể tải danh sách bài tập')
    }
  },
  {
    // Chỉ gọi khi chưa tải hoặc tải lỗi (tránh gọi 2 lần do StrictMode / ghi đè dữ liệu đã sửa)
    condition: (_, { getState }) => {
      const { status } = getState().assignments
      return status === 'idle' || status === 'failed'
    },
  },
)

/* --------------------------------- Slice --------------------------------- */

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.push(action.payload)
      },
      prepare(input: NewAssignmentInput) {
        return {
          payload: {
            ...input,
            id: nanoid(),
            completed: false,
            createdAt: new Date().toISOString(),
          } satisfies Assignment,
        }
      },
    },
    toggleAssignment(state, action: PayloadAction<string>) {
      const item = state.items.find((a) => a.id === action.payload)
      if (item) item.completed = !item.completed
    },
    deleteAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.id !== action.payload)
    },
    setFilter(state, action: PayloadAction<FilterStatus>) {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Giữ lại các bài người dùng đã thêm trong lúc chờ API
        const ids = new Set(action.payload.map((a) => a.id))
        state.items = [...action.payload, ...state.items.filter((a) => !ids.has(a.id))]
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi'
      })
  },
})

export const { addAssignment, toggleAssignment, deleteAssignment, setFilter } =
  assignmentsSlice.actions

export default assignmentsSlice.reducer
