import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Correct import for localStorage
import taskSlice from "./tasksSlice";
import columnSlice from "./columnSlice";

// Persist Config
const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["tasksReducer", "columnsReducer"], // Persist only these reducers
};

// Combine reducers
const rootReducer = combineReducers({
  tasksReducer: taskSlice,
  columnsReducer: columnSlice,
});

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use persistedReducer instead of individual reducers
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors with redux-persist
    }),
});

export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export type RootState = ReturnType<typeof store.getState>;
