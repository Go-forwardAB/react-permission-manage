import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type User } from '@/types/user'

const initialState: User = {
  username: '',
  password: '',
  nickname: '',
  roleIds: [1, 2, 3],
  isLoaded: false,
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<User>) {
      return {
        ...state,
        ...action.payload,
        isLoaded: true,
      }
    },
    resetUserInfo() {
      return { ...initialState }
    },
  },
})

export const { setUserInfo, resetUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
