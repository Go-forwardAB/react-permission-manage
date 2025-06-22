import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { rolesList, roleMenu } from '@/api/roles'
import type { Role } from '@/types/role'
import type { RoleMenu } from '@/types/roleMenu'

interface RoleState {
  role: Role[]
  roleMenu: RoleMenu[]
  isLoaded: boolean
}

const initialState: RoleState = {
  role: [],
  roleMenu: [],
  isLoaded: false,
}

export const getRoleList = createAsyncThunk('roles/getRoleList', async () => {
  const res = await rolesList(1, 9999, '')
  return res.data as Role[]
})

export const getRoleMenu = createAsyncThunk('roles/getRoleMenu', async () => {
  const res = await roleMenu()
  return res.data as RoleMenu[]
})

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoleList.fulfilled, (state, action) => {
      state.role = action.payload
      state.isLoaded = true
    })
    builder.addCase(getRoleMenu.fulfilled, (state, action) => {
      state.roleMenu = action.payload
      state.isLoaded = true
    })
  },
})

export default roleSlice.reducer
