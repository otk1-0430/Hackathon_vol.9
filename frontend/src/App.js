import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {dataToTaskTrees} from "./components/ConvertJsonToTaskTrees";
import Trees from "./components/Trees";
import ButtonAppBar from "./components/Header";
import "./css/App.css";
import { Button, Container, Checkbox, TextField, Box, Stack, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { jaJP } from "@mui/x-date-pickers/locales";
import axios from 'axios';

dayjs.locale(jaJP);

export class Task {
  constructor(id, text, deadline, completed, root, children) {
    this.id = id;
    this.text = text;
    this.deadline = deadline;
    this.completed = completed;
    this.root = root;
    this.children = children;
  };
};

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


/*
todo: add task finish animation
todo: implement backend
      - reflect changes on task trees
        - build api
          - add child task
            => add child task to DB
            => push back child's id to parent task's children[]

          - add root task
            => add root task to DB

          - delete leaf task
            => just delete
          - delete non-leaf task
            => show dialoge 'all child task will be deleted!!!'
            => delete recursively

          after each operation, reflesh data and render screen

*/

function App() {
  const [taskTrees, setTaskTrees] = useState([]);
  const [taskDate, setTaskDate] = useState(dayjs());
  const [taskText, setTaskText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskTrees = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasktrees`);
        console.log(response);
        const data = response.data;
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.log('data is not array', data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskTrees();
  }, []); // 空の依存配列により、コンポーネントのマウント時にのみ実行されます

  useEffect(() => {
    if (data.length !== 0) {
      const usersTaskTrees = dataToTaskTrees(data);
      setTaskTrees(usersTaskTrees);
      console.log(taskTrees);
    }
  }, [data]);



  // add root task
  const addRootTask = () => {
    console.log(taskText);
    const newTask = new Task(uuidv4(), taskText, taskDate, false, 0, []);
    newTask.root = newTask.id;
    setTaskTrees((parentTask) => {
      return [...parentTask, newTask]
    });
    setTaskText('');
  };

  // add child task
  const addChildTask = (parentId, newTask) => {
    let newTaskTrees = [...taskTrees];
    newTaskTrees = newTaskTrees.map((taskTree) => {
      return updateTaskTree(taskTree, parentId, newTask);
    });
    setTaskTrees(newTaskTrees);
    console.log(newTask);
  };

  const handleAddRootButtonClick = () => {
    setShowForm(!showForm);
  };
  
  const handleTestButtonClick = async () => {
    try {
      const query = {userId: 'testuserid', taskId: 'testtaskid'};
      const response = await axios.get(`http://localhost:5000/reqtest`, {params: query});
      console.log(response);
    } catch (error) {
      setError(error);
    }
  };


  // insert child task
  const updateTaskTree = (currentNode, id, newTask) => {
    if (currentNode.id === id) {
      console.log('fonud');
      currentNode.children.push(newTask);
    } else if (currentNode.children) {
      currentNode.children = currentNode.children.map((childNode) => {
        return updateTaskTree(childNode, id, newTask);
      });
    };
    return currentNode;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth='sm'>
        <ButtonAppBar />
        <Button onClick={handleTestButtonClick}>test</Button>
        <Stack direction='column' sx={{ my: 2 }} spacing={2}>
          <Button onClick={handleAddRootButtonClick}>親タスクを追加</Button>
          {showForm && (
            <Stack direction='row' sx={{ my: 2 }} spacing={1}>
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
              <Button onClick={addRootTask}>追加</Button>
            </Stack>
          )}
          <Trees taskTrees={taskTrees} addChildTask={addChildTask} />
        </Stack>
      </Container>
    </ThemeProvider>

  );

}

export default App;
