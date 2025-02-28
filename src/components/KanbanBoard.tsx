import React, { useMemo, useState } from "react";
import { PlusIcon } from "../assets/PlusIcon";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "../assets/TaskCard";
import { useDispatch } from "react-redux";
import { setTaskDetails } from "../redux/tasksSlice";
import { setColumnDetails } from "../redux/columnSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const KanbanBoard = () => {
  const [column, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const coloumnId = useMemo(() => column.map((col) => col.id), [column]);

  //tasks redux

  
  //redux storing
  const dispatch = useDispatch()
  dispatch(setTaskDetails(tasks))
  dispatch(setColumnDetails(column))

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: Math.floor(Math.random() * 1000) + 100,
      title: `Column ${column.length + 1}`,
    };
    setColumns([...column, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = column.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter(t  => t.columnId !== id);
    setTasks(newTasks)
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumn = column.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumn);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    console.log("Drag Start", event);
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null)
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((column) => {
      const activeColumnIndex = column.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = column.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(column, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent ) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    const activeTask = active.data.current?.type === 'Task';
    const overTask = over.data.current?.type === 'Task';

    if(!activeTask) return;

    //dragging inside column
    if(activeTask === overTask){
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)
        const overIndex = tasks.findIndex(t => t.id === overId)

        tasks[activeIndex].columnId = tasks[overIndex].columnId

        return( arrayMove(tasks, activeIndex, overIndex))
      })
    }

    //draggibg outside to a column 
    const overAColumn = over.data.current?.type == 'Column';

    if(activeTask && overAColumn){
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)

        tasks[activeIndex].columnId = overId
        return( arrayMove(tasks, activeIndex, activeIndex))
      })
    }
  }

  const addTask = (columnId: Id) => {
    const newTask: Task = {
      id: Math.floor(Math.random() * 9000) + 1000,
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };
  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((tasks) => tasks.id !== id);
    setTasks(newTasks);
  };
  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  console.log("Total Columns", column);
  console.log("Complete Tasks", tasks);
  

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-visible overflow-y-hidden px-[40px]">
      <h1 className="font-jolly">FlowHub</h1>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-6">
            <SortableContext items={coloumnId}>
              {column.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  addTask={addTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
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
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                addTask={addTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
                { activeTask && 
                <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
