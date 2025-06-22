// menuSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { menusList } from '@/api/menus'
import type { MenuItem } from '@/types/menu'

// 递归构造菜单树
function menuTree(menuList: MenuItem[], parentId: number = 0): MenuItem[] {
  return menuList
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: menuTree(menuList, item.id).length > 0 ? menuTree(menuList, item.id) : null,
    })) as MenuItem[]
}

interface MenusState {
  menus: MenuItem[]
  init_menus: MenuItem[]
  filterMenu: MenuItem[]
  btns: string[]
  loading: boolean
  error: string | null
  isLoaded: boolean
}

const initialState: MenusState = {
  menus: [],
  init_menus: [],
  filterMenu: [],
  btns: [],
  loading: false,
  error: null,
  isLoaded: false,
}

export const getMenuList = createAsyncThunk('menus/getMenuList', async (_, thunkAPI) => {
  try {
    const res = await menusList()
    return res.data as MenuItem[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch menus')
  }
})

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setFilterMenu(state, action: PayloadAction<MenuItem[]>) {
      state.filterMenu = action.payload
    },
    setFilterButton(state, action: PayloadAction<number[]>) {
      state.btns = state.init_menus
        .filter((item) => item.type === 'button')
        .filter((item) => action.payload.includes(item.id))
        .map((item) => item.code)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMenuList.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false
        const data = action.payload
        state.isLoaded = true
        state.menus = menuTree(data, 0)
        state.init_menus = data
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

export const { setFilterMenu, setFilterButton } = menusSlice.actions
export default menusSlice.reducer
