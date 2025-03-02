import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { Column, Id } from "../types";
import { RootState } from "./store";
import { arrayMove } from "@dnd-kit/sortable";

export type ColumnState = {
  columns: Column[];
};
const initialState: ColumnState = {
  columns: [],
};

console.log("redux column: ", initialState);

export const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    createNewColumn: (state) => {
      const newColumn: Column = {
        id: Math.floor(Math.random() * 1000) + 100,
        title: `Enter Column Name`,
      };
      state.columns.push(newColumn);
    },
    deleteColumn: (state, action: PayloadAction<{ id: Id }>) => {
      state.columns = state.columns.filter(
        (col) => col.id !== action.payload.id
      );
    },
    updateColumn: (state, action: PayloadAction<{ id: Id; title: string }>) => {
      const columnToUpdate = state.columns.find(
        (col) => col.id === action.payload.id
      );
      if (columnToUpdate) {
        columnToUpdate.title = action.payload.title;
      }
    },

    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    
    reorderColumns: (
      state,
      action: PayloadAction<{ activeId: Id; overId: Id }>
    ) => {
      const activeIndex = state.columns.findIndex(
        (col) => col.id === action.payload.activeId
      );
      const overIndex = state.columns.findIndex(
        (col) => col.id === action.payload.overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        state.columns = arrayMove(state.columns, activeIndex, overIndex);
      }
    },
  },
});

export default columnSlice.reducer;
export const {
  createNewColumn,
  deleteColumn,
  updateColumn,
  setColumns,
  reorderColumns,
} = columnSlice.actions;

const selectColumnState = (state: RootState) => state.columnsReducer.columns;
export const selectColumns = createSelector(
  [selectColumnState],
  (columns) => [...columns] // Creating a new reference ensures proper memoization
);
