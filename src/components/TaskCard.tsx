import { useState } from "react";
import { Task } from "../types";
import { DeleteIcon } from "../assets/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { deleteTaskState, updateTaskState } from "../redux/tasksSlice";

type Props = {
  task: Task;
};

export const TaskCard = ({ task }: Props) => {
  const [mouseHover, setMouseHover] = useState(false);
  const [editMode, setEditMode] = useState(false);

  //redux
  const dispatch = useDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
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
        style={style}
        className="bg-mainBgColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left
             rounded-xl border-2 border-rose-500 cursor-grab opacity-50"
      ></div>
    );
  }

  const ToggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseHover(false);
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="bg-mainBgColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left
             rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative transition-all duration-300 task-scrollbar"
      >
        {editMode && (
          <textarea
            className="h-[90%] w-full resize-none border-none rounded bg-mainBgColor text-white focus:outline-none"
            value={task.content}
            autoFocus
            placeholder="Task Contene here"
            onBlur={ToggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) ToggleEditMode();
            }}
            onChange={(e) =>
              dispatch(
                updateTaskState({ id: task.id, content: e.target.value })
              )
            }
          ></textarea>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={ToggleEditMode}
      className="bg-mainBgColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left
     rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative transition-all duration-300"
      onMouseEnter={() => {
        setMouseHover(true);
      }}
      onMouseLeave={() => {
        setMouseHover(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseHover && (
        <button
          onClick={() => dispatch(deleteTaskState({ id: task.id }))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-columnBgColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};
