import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Id, Task } from "../types";
import { useEffect } from "react";

  export type ColumnProps = {
      id: Id;
      title: string,
  }

  export type TaskProps = {
      id: Id | null;
      columnId: Id | null;
      content: string | null;
  }


  type TaskState = {
    tasks: TaskProps[]; // Store multiple tasks

  };
  
  const initialState: TaskState = {
    tasks: [],
  };



export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        setTaskDetails:(state, action: PayloadAction<TaskProps[]>) =>{
            state.tasks = action.payload
        }, 
       
      
    }
})


export default taskSlice.reducer; 

export const { setTaskDetails } = taskSlice.actions; 