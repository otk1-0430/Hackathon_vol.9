import { useRef, useState, React } from 'react';
import {v4 as uuidv4} from 'uuid'; 
import Trees from './Trees';
import "../css/App.css"
import { Button, Container, Checkbox, TextField, Box, Stack, Paper } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import axios from 'axios';

const Task = ({task, addChildTask}) => {
    const [taskDate, setTaskDate] = useState(dayjs());
    const [taskText, setTaskText] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        task.completed = event.target.checked;
      };

    const handleButtonClick = () => {
        setShowForm(!showForm);
    };

    const handleAddChildTask = () => {
        const newTask = {
            id: uuidv4(),
            description: taskText,
            deadline: taskDate,
            completed: false,
            root: task.root,
            children: []
        };
        addChildTask(task.id, newTask)
        setTaskText('')
    };

    return (
        <Container maxWidth='sm'>
            <Paper sx={{width:300}}>
                <Stack direction="row" spacing={2}>
                    <Checkbox checked={checked} onChange={handleChange} />
                    <div>
                        <div>締め切り: {task.deadline.format('YYYY/MM/DD')}</div>
                        <div>内容: {task.text}</div>
                    </div>
                    {task.completed && <Button>削除</Button>}
                </Stack>
                <Stack direction='column' sx={{my:2}} spacing={2}>
                    <Button onClick={handleButtonClick}>サブタスクを追加</Button>
                    {showForm && (
                    <Stack direction='row' sx={{my:2}} spacing={1}>
                        <TextField
                        label='内容'
                        varriant='standard-basic'
                        value={taskText}
                        onChange={(newText) => setTaskText(newText.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                        label='日付'
                        value={taskDate}
                        onChange={(newDate) => setTaskDate(newDate)}
                        />
                        </LocalizationProvider>
                        <Button onClick={handleAddChildTask}>追加</Button>
                    </Stack>
                    )}
                </Stack>
            </Paper>
            <div className="indentTask">
                <Trees taskTrees={task.children} addChildTask={addChildTask} />  
            </div>
        </Container>
      );
};

export default Task