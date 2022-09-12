import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Button, CardGroup, Card, CardBody, CardTitle, CardSubtitle, CardFooter } from 'reactstrap';

function Home({ isAuth }) {
  const [taskList, setTaskList] = useState([]);

  const getTasks = async () => {
    const data = await getDocs(collection(db, "tasks"));
    setTaskList(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
  };

  const claimTask = async (taskId, userId, userName) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, {
      isClaimed: true,
      claimedBy: {id: userId, name: userName}
    });
    getTasks();
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="homePage">
      <CardGroup>
      {taskList.map((task) => {
        if(task.isComplete) {
          return;
        }
        return (<Card className="task">
          <div className="taskHeader">
            <CardTitle tag="h2">
              <div className="deleteTask">
                {isAuth && task.author.id === auth.currentUser.uid && <Button color="danger" size="sm" outline onClick={() => {deleteTask(task.id)}}>Delete</Button>}
              </div>
              {task.title}
            </CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {task.isClaimed ?
                ( <>
                    Claimed
                    <br/>
                    Progress: {task.progress}
                    <br/>
                    Estimated Date of Completion: {task.finishedBy !== null? task.finishedBy : "N/A"}
                  </>) : (
                  <>
                    Unclaimed
                    {isAuth && task.author.id !== auth.currentUser.uid &&  
                    <Button className="claimButton" color="success" size="sm" outline onClick={() => {claimTask(task.id, auth.currentUser.uid, auth.currentUser.displayName)}}>Claim Task</Button>}
                  </>)
              }
            </CardSubtitle>
          </div>
          <CardBody className="taskDescription">
            {task.description}
          </CardBody>
          <CardFooter>
            Posted by: {task.author.logo !== null? <img src={task.author.logo} width="50" height="50" /> : <></>} {task.author.name}
          </CardFooter>
        </Card>);
      })}
      </CardGroup>
    </div>
  );
}

export default Home
