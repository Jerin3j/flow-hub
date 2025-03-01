import { useMemo, useState } from "react";
import { PlusIcon } from "../assets/PlusIcon";
import { Column, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor,useSensor, useSensors,} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";
import { useDispatch, useSelector } from "react-redux";
import { createNewColumn, reorderColumns } from "../redux/columnSlice";
import { selectColumns } from "../redux/columnSlice";
import { moveTaskToAnotherColumn, moveTaskWithinColumn } from "../redux/tasksSlice";

export const KanbanBoard = () => {
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Get columns from Redux
  const columns = useSelector(selectColumns);
  const dispatch = useDispatch();

  // Memoized column IDs for sorting
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  
    if (active.data.current?.type === "column") {
      setActiveColumn(active.data.current.column);
    }
  };

 const onDragEnd = (event: DragEndEvent) => {
  setActiveColumn(null);
  setActiveTask(null);

  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  dispatch(reorderColumns({ activeId, overId }));
};



  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const activeTask = active.data.current?.type === "task";
    const overTask = over.data.current?.type === "task";
  
    if (!activeTask) return;
  
    if (activeTask && overTask) {
      dispatch(moveTaskWithinColumn({ activeId, overId }));
    } else if (activeTask && over.data.current?.type === "column") {
      dispatch(moveTaskToAnotherColumn({ activeId, newColumnId: overId }));
    }
  };



  return (
    <div className=" m-auto flex flex-col min-h-screen w-full items-center overflow-x-visible overflow-y-hidden px-[40px]">
    <h1 className="font-jolly text-center mt-2 text-2xl sm:mt-1 sm:text-5xl underline decoration-wavy"> FlowHub </h1>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="m-auto flex flex-col sm:flex-row gap-4">
          <div className="flex gap-6">
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => dispatch(createNewColumn())} // Dispatch Redux action
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBgColor border-2 border-columnBgColor p-4 ring-rose-500 hover:ring-2 flex items-center justify-center gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
