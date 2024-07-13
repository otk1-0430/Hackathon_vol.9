import dayjs from "dayjs";
import { jaJP } from "@mui/x-date-pickers/locales";
import { Task } from "../App.js"

dayjs.locale(jaJP);

/*
   fetch user's data(json) from DB
-> find root task(json data): findRootData()
-> for all root, find children recursively: getChildTasksFromId()
->  for all children, find children...
->    convert child data to task
-> return task trees: rootDatasToTaskTrees()
*/

// convert json to single task
const dataToSingleTask = (data, children) => {
  return new Task(
    data.task_id,
    data.description,
    dayjs(data.deadline),
    data.completed,
    data.root_id,
    children
  )
}

// find task data from id
const findDataFromId = (datas, task_id) => {
  return datas.find(data => data.task_id === task_id);
}

// convert json to root tasks
const findRootDatas = (datas) => {
  const rootDatas = datas.filter(data => {
      return data.task_id === data.root_id; // filter root task
    })
  return rootDatas;
};



// recursively find children(array of task) and convert json data to Task
const getChildTasksFromData = (parentData, datas) => {
  console.log(parentData);
  if(!parentData.children){
    console.log('children not found');
    return []; // when parent has no child, return empty array
  }
  const childTasks = parentData.children.map(childId => {
    const childData = findDataFromId(datas, childId);
    return dataToSingleTask(childData, getChildTasksFromData(childData, datas))
  });
  return childTasks;
};

// get children tasks and build task tree
const rootDatasToTaskTrees = (rootDatas, allDatas) => {
  const taskTrees = rootDatas.map(rootData => {
    console.log(rootData);
    if(!rootData) {
      console.log('root data not found');
      return null;
    }
    // find children recursively and convert json to Task
    const singleTree = dataToSingleTask(rootData, getChildTasksFromData(rootData, allDatas));
    console.log(singleTree);
    return singleTree;
  })
  console.log(taskTrees);
  return taskTrees;
};

// convert user's data to task trees
export function dataToTaskTrees(data){
  const rootDatas = findRootDatas(data);
  const taskTrees = rootDatasToTaskTrees(rootDatas, data);
  return taskTrees;
};