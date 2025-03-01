import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import {  Id, Task } from "../types";
import { RootState } from "./store";
import { arrayMove } from "@dnd-kit/sortable";

type TaskState = {
  tasks: Task[]; // Store multiple tasks
};

const initialState: TaskState = {
  tasks: [], 
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTaskDetails: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    addTaskState: (
      state,
      action: PayloadAction<{ columnId: Id; title: string }>
    ) => {
      const newTask: Task = {
        id: Math.floor(Math.random() * 9000) + 1000, 
        columnId: action.payload.columnId, 
        content: `Task ${state.tasks.length + 1}`,
      };
      state.tasks.push(newTask);
    },

    deleteTaskState: (state, action: PayloadAction<{ id: Id }>) => {
      state.tasks = state.tasks.filter(
        (tasks) => tasks.id !== action.payload.id
      );
    },

    updateTaskState: (
      state,
      action: PayloadAction<{ id: Id; content: string }>) => {
        state.tasks = state.tasks.map((task) =>
          task.id !== action.payload.id ? task : { ...task, content: action.payload.content }
        );
    },
    
    reorderTask: (
      state,
      action: PayloadAction<{ activeId: Id; overId: Id }>
    ) => {
      const { activeId, overId } = action.payload;
      const activeIndex = state.tasks.findIndex((t) => t.id === activeId);
      const overIndex = state.tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        state.tasks = arrayMove(state.tasks, activeIndex, overIndex);
      }
    },
    // Move a task to another column
    moveTaskWithinColumn: (
      state,
      action: PayloadAction<{ activeId: Id; overId: Id }>
    ) => {
      const activeIndex = state.tasks.findIndex(
        (t) => t.id === action.payload.activeId
      );
      const overIndex = state.tasks.findIndex(
        (t) => t.id === action.payload.overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        state.tasks = arrayMove(state.tasks, activeIndex, overIndex);
      }
    },

    moveTaskToAnotherColumn: (
      state,
      action: PayloadAction<{ activeId: Id; newColumnId: Id }>
    ) => {
      const taskIndex = state.tasks.findIndex(
        (t) => t.id === action.payload.activeId
      );

      if (taskIndex !== -1) {
        state.tasks[taskIndex].columnId = action.payload.newColumnId;
      }
    },
  },
});

export default taskSlice.reducer;
export const {
  setTaskDetails,
  addTaskState,
  deleteTaskState,
  updateTaskState,
  moveTaskToAnotherColumn,
  moveTaskWithinColumn,
  reorderTask,
} = taskSlice.actions;

export const selectTasksByColumnId = createSelector(
  [
    (state: RootState) => state.tasksReducer.tasks, // Get all tasks
    (_state: RootState, columnId: Id) => columnId, // Get columnId as argument
  ],
  (tasks, columnId) => tasks.filter((task) => task.columnId === columnId)
);
