import { useRef, useState } from "react";

export function useTaskTree(init) {
    const [taskTree, setTaskTrees] = useRef(init);
    function addTask(parentTask, task){
        setTaskTrees((parentTask, task) => {
            parentTask.children.append(task);
        })
    }
    return [taskTree, setTaskTrees];
}