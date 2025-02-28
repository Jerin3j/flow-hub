import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import taskSlice from "./tasksSlice";
import columnSlice from "./columnSlice";


export const store = configureStore({
    reducer: {
      tasksReducer : taskSlice,
      columnReducer: columnSlice
    },
  })


  export const useAppDispatch = typeof store.dispatch 
  export type RootState = ReturnType<typeof store.getState>;