import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter'

import userInfoReducer from './userInfoSlice'
import menuReducer from './menuSlice'
import roleReducer from './roleSlice'
import tabsReducer from './tabSlice'

const menuFilter = createFilter('menus', ['menus', 'init_menus', 'btns', 'isLoaded', 'filterMenu'])

const userInfoPersistConfig = {
  key: 'userInfo',
  storage,
}

const menusPersistConfig = {
  key: 'menus',
  storage,
  transforms: [menuFilter],
}

const btnsPersistConfig = {
  key: 'btns',
  storage,
}

const rootReducer = combineReducers({
  userInfo: persistReducer(userInfoPersistConfig, userInfoReducer),
  menu: persistReducer(menusPersistConfig, menuReducer),
  tabs: persistReducer(btnsPersistConfig, tabsReducer),
  role: roleReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
