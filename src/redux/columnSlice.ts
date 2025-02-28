import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Id, Task } from "../types";

  export type ColumnProps = {
      id: Id;
      title: string,
  }

 
  type ColumnState = {
    columns: ColumnProps[]; // Store multiple tasks

  };
  
  const initialState: ColumnState = {
    columns: []
  };


console.log("redux column: ",initialState);

export const columnSlice = createSlice({
    name: 'column',
    initialState,
    reducers:{
        setColumnDetails:(state, action: PayloadAction<ColumnProps[]>) =>{
            state.columns = action.payload
        },
      
    }
})


export default columnSlice.reducer; 

export const { setColumnDetails } = columnSlice.actions; 