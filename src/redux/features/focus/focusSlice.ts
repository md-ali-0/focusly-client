import { createSlice } from '@reduxjs/toolkit'

interface FocusState {
  totalSessions: number
}

const initialState: FocusState = {
  totalSessions: 0,
}

export const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    completeFocusSession: (state) => {
      state.totalSessions += 1
    },
  },
})

export const { completeFocusSession } = focusSlice.actions

export default focusSlice.reducer

