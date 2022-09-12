import React, { useState, useEffect } from 'react';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Card, CardGroup, CardTitle, CardBody, CardFooter, CardSubtitle } from 'reactstrap';

function ViewSubmissions() {
    const [submissions, setSubmissions] = useState([]);

    const getTasks = async () => {
        const taskQuery = query(collection(db, "tasks"), where("author.id", "==", auth.currentUser.uid), where("isComplete", "==", true));
        const data = await getDocs(taskQuery);
        setSubmissions(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };

    useEffect(() => {
        if (auth.currentUser) {
            getTasks();
        }
    }, []);

    return (
        <div className="submissionsPage">
            <CardGroup>
                {submissions.map((task) => {
                    return (
                        <Card className="task">
                            <div className="taskHeader">
                                <CardTitle tag="h2">
                                    <h1>{task.title}</h1>
                                </CardTitle>
                                <CardSubtitle className="mb-2 text-muted" tag="h6">
                                    Completed by: {task.claimedBy.name}
                                </CardSubtitle>
                            </div>
                            <CardBody className="taskDescription">
                                {task.description}
                            </CardBody>
                            <CardFooter>
                                Submission link: {task.submissionLink}
                            </CardFooter>
                        </Card>
                    );
                })}
            </CardGroup>
        </div>
    );
}

export default ViewSubmissions;