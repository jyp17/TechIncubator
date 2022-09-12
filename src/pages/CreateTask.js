import React, { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { Label, Input, Button, Row, Col } from 'reactstrap';

function CreateTask({ isAuth }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const tasksCollectionRef = collection(db, "tasks");
  let navigate = useNavigate();
 
  const handleSubmit = async () => {
    await addDoc(tasksCollectionRef, {title, description, isClaimed: false, claimedBy: {id:"", name: ""}, progress: "Not Started", finishedBy: null, isComplete: false, submissionLink: "", author: {name: auth.currentUser.displayName, logo: auth.currentUser.photoURL, id: auth.currentUser.uid } });
    navigate("/");
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  });

  return (
    <div className="ctPage">
      <div className="ctContainer">
        <h1>Create A Task</h1>
        <br />
        <Row className="inputGroup">
          <Col md={6}>
            <Label for="titleInput"><h3>Title:</h3></Label>
            <Input id="titleInput" type="text" onChange={(e) => {setTitle(e.target.value)}}/>
          </Col>
        </Row>
        <br />
        <Row className="inputGroup">
          <Col md={6}>
            <Label for="descriptionInput"><h3>Description:</h3></Label>
            <Input id="descriptionInput" type="textarea" placeholder="Enter a short summary of your task" onChange={(e) => {setDescription(e.target.value)}}/>
          </Col>
        </Row>
        <br />
        <Button color="primary" size="lg" outline onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}

export default CreateTask;
