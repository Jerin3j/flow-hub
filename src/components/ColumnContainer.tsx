import { Column, Id, Task } from "../types";
import { DeleteIcon } from "../assets/DeleteIcon";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { PlusIcon } from "../assets/PlusIcon";
import { TaskCard } from "../assets/TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  addTask: (id: Id, title: string) => void;
  tasks: Task[];
  deleteTask : (id: Id) => void;
  updateTask : (id: Id, content: string) => void;
}

export const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  addTask,
  tasks,
  deleteTask,
  updateTask
}: Props) => {

  const [editMode, setEditMode] = useState(false);
   const taskId = useMemo(()=> tasks.map((task)=> task.id), [tasks])
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="bg-columnBgColor opacity-25 border-2 border-red-400 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-columnBgColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div className="col-head bg-mainBgColor text-base h-[60px] rounded-md rounded-b-none p-3 font-bold border-mainBgColor border-4 flex items-center justify-between cursor-paw">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBgColor px-2 py-1 text-sm">
            0
          </div>
          {/* column title edit || display*/}
          {editMode != true ? (
            <h1 key={column.id} onClick={() => setEditMode(true)}>
              {column.title}
            </h1>
          ) : (
            <input
              type="text"
              autoFocus
              className="text-white focus:border-rose-700 border bg-mainBgColor"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div className="cursor-pointer" onClick={() => deleteColumn(column.id)}>
          <DeleteIcon />
        </div>
      </div>
      <div className="col-body flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskId}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
        ))}
        </SortableContext>
      </div>
      <button
        onClick={() => addTask(column.id, column.title)}
        className="flex gap-2 border-columnBgColor items-center border-2 rounded-lg p-4 border-x-columnBgColor hover:bg-mainBgColor hover:text-rose-500 active:bg-black "
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
};
