import React, { useState } from 'react';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Input, Label, Row, Col, Button } from 'reactstrap';

function Login({setIsAuth}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [logo, setLogo] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [hasAccount, setHasAccount] = useState(false);
    
    let navigate = useNavigate();

    const updateLogo = () => {
        if (logo == null) {
            return;
        }
        const logoRef = ref(storage, `images/${logo.name + v4()}`);
        uploadBytes(logoRef, logo).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
            updateProfile(auth.currentUser, {photoURL: url})
          });
        });
    };

    const updateName = () => {
        updateProfile(auth.currentUser, {
            displayName: firstName + " " + lastName
        });
    };

    const handleSignup = () => {
        setErrorMsg("");
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                updateName();
                updateLogo();
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.message);
                setErrorMsg(error.message);
            });
    };

    const handleLogin = () => {
        setErrorMsg("");
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.message);
                setErrorMsg(error.message);
            });
    };

    return (
        <div className="loginPage">
            <form>
            {hasAccount? (<></>) : (
                <>
                    <Row className="inputGroup">
                        <Col md={3}>
                            <Label for="firstNameInput">*First Name: </Label>
                            <Input id="firstNameInput" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        </Col>
                    </Row>
                    <br />
                    <Row className="inputGroup">
                        <Col md={3}>
                            <Label for="lastNameInput">*Last Name: </Label>
                            <Input id="lastNameInput" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        </Col>
                    </Row>
                    <br />
                    <Row className="inputGroup">
                        <Col md={3}>
                            <Label for="logoUpload">Logo: </Label>
                            <Input id="logoUpload" type="file" onChange={(e) => {setLogo(e.target.files[0])}}/>
                        </Col>
                    </Row>
                </>
            )}
            <br />
            <Row className="inputGroup">
                <Col md={3}>
                    <Label for="emailInput">*Email: </Label>
                    <Input id="emailInput" type="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Col>
            </Row>
            <br />
            <Row className="inputGroup">
                <Col md={3}>
                    <Label for="passwordInput">*Password: </Label>
                    <Input id="passwordInput" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Col>
            </Row>

            <p className="errorMsg">{errorMsg}</p>
            {hasAccount? (
                <>
                    <Button color="primary" outline onClick={handleLogin}>Sign In</Button>
                    <p>Don't have an account? 
                        <span onClick={() => setHasAccount(!hasAccount)}> <u>Sign up</u>.</span>
                    </p>
                </>
            ) : (
                <>
                    <Button color="primary" outline onClick={handleSignup}>Sign Up</Button>
                    <p>Have an account? 
                        <span onClick={() => setHasAccount(!hasAccount)}> <u>Sign in</u>.</span>
                    </p>
                </>
            )}
            </form>
        </div>
    );
};

export default Login;
