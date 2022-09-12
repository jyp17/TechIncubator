import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, updateDoc, where, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Input, Label, Button, Card, CardGroup, CardTitle, CardBody, CardSubtitle, CardFooter } from 'reactstrap';

function ManageTask () {
    const [claimedTaskList, setClaimedTaskList] = useState([]);
    const [uploadedLink, setUploadedLink] = useState("");
    const [progressStatus, setProgressStatus] = useState("");
    const [estimatedDate, setEstimatedDate] = useState(null);
    
    const getTasks = async () => {
        const taskQuery = query(collection(db, "tasks"), where("isComplete", "==", false), where("claimedBy.id", "==", auth.currentUser.uid));
        const data = await getDocs(taskQuery);
        setClaimedTaskList(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };

    const handleProgress = async (id, status) => {
        if (status === "") {
            alert("Nothing was selected.")
            return;
        }
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, {
            progress: status
        });
        alert("Updated progress.");
    };

    const handleDate = async (id, date) => {
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, {
            finishedBy: date
        });
        alert("Updated deadline.");
    };

    const handleUpload = async (id, link) => {
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, {
            isComplete: true,
            submissionLink: link
        });
        alert("Upload successful!");
        getTasks();
    };

    useEffect(() => {
        if (auth.currentUser) {
            getTasks();
        }
    }, []);
      
    return (
        <div className="mtPage">
            <CardGroup>
                {claimedTaskList.map((task) => {
                    return (
                        <Card className="task">
                            <div className="taskHeader">
                                <CardTitle className="title">
                                    <h1>{task.title}</h1>
                                </CardTitle>
                                <CardSubtitle className="mb-2 text-muted" tag="h6">
                                    Posted by: {task.author.name}
                                </CardSubtitle>
                            </div>
                            <CardBody className="taskDescription">
                                {task.description}
                            </CardBody>
                            <CardFooter>
                                <form>
                                    <div className="updateProgress">
                                        <Label for="selectProgress">
                                            Update Progress:
                                        </Label>
                                        <Input id="selectProgress" name="select" type="select" onChange={(e) => {setProgressStatus(e.target.value)}}>
                                        <option disabled selected value>
                                        </option>
                                        <option>
                                            Getting Started
                                        </option>
                                        <option>
                                            Partly Done
                                        </option>
                                        <option>
                                            Nearly Done
                                        </option>
                                        </Input>
                                        <Button size="sm" outline onClick={() => {handleProgress(task.id, progressStatus)}}>Update</Button>
                                    </div>
                                    <br />
                                    <div className="estimatedDate">
                                        <Label for="estDate">Estimated Date of Completion:</Label>
                                        <Input id="estDate" type="date" onChange={(e) => {setEstimatedDate(e.target.value)}}/>
                                        <Button size="sm" outline onClick={() => {handleDate(task.id, estimatedDate)}}>Set Deadline</Button>
                                    </div>
                                    <br />
                                    <div className="upload">
                                        <Label for="uploadLink">Upload Your Submission:</Label>
                                        <Input id="uploadLink" name="link" type="url" placeholder="Enter your link here" onChange={(e) => {setUploadedLink(e.target.value)}}/>
                                        <Button size="sm" outline onClick={() => {handleUpload(task.id, uploadedLink)}}>Upload</Button>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>
                    );
                })}
            </CardGroup>
        </div>
    );
}

export default ManageTask;