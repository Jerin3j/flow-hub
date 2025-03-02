import { Column } from "../types";
import { DeleteIcon } from "../assets/DeleteIcon";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { PlusIcon } from "../assets/PlusIcon";
import { TaskCard } from "./TaskCard";
import { useDispatch } from "react-redux";
import { addTaskState, selectTasksByColumnId } from "../redux/tasksSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { deleteColumn, updateColumn } from "../redux/columnSlice";
import { Dots } from "../assets/Dots";

interface Props {
  column: Column;
}

export const ColumnContainer = ({column} : Props) => {
  
  const tasks = useSelector((state: RootState) => selectTasksByColumnId(state, column.id));

  const [editMode, setEditMode] = useState(false);
  const taskId = useMemo(() => tasks.map((task) => task.id), [tasks]);
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

  const dispatch = useDispatch();

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="bg-columnBgColor opacity-25 border-2 border-red-400 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  console.log("current tasks", tasks)
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
          <div className="flex justify-center items-center fill-columnBgColor px-2 py-1 text-sm">
            <Dots/>
          </div>
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
              onChange={(e) =>
                dispatch(updateColumn({ id: column.id, title: e.target.value }))
              }
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => dispatch(deleteColumn({ id: column.id }))}
        >
          <DeleteIcon />
        </div>
      </div>
      <div className="col-body flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskId}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() =>
          dispatch(addTaskState({ columnId: column.id, title: column.title }))
        }
        className="flex gap-2 border-columnBgColor items-center border-2 rounded-lg p-4 border-x-columnBgColor hover:bg-mainBgColor hover:text-rose-500 active:bg-black "
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
};
