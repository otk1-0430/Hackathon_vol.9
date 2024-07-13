import React from 'react'
import Task from './Task';
import "../App";

//親タスクの配列を読み込む
const Trees = ({taskTrees, addChildTask}) => {
    return (
        <div>
            {taskTrees.map((task) => (
                <Task key={task.id} task={task} addChildTask={addChildTask} />
            ))}
        </div>  
    );
    
};

export default Trees