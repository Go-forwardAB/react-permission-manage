import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PURGE } from 'redux-persist'
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

const appReducer = combineReducers({
  userInfo: persistReducer(userInfoPersistConfig, userInfoReducer),
  menu: persistReducer(menusPersistConfig, menuReducer),
  tabs: persistReducer(btnsPersistConfig, tabsReducer),
  role: roleReducer,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STATE') {
    storage.removeItem('persist:root')
    storage.removeItem('persist:userInfo')
    storage.removeItem('persist:menus')
    storage.removeItem('persist:btns')

    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PURGE],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
