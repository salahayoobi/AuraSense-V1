import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import '../styles/loginScreenStyle.css'; // Import your custom CSS file

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) =>{
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            dispatch(setCredentials({...res}))
            navigate('/')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (  
        <Container className="login-screen">
            <FormContainer >
                <h1 className="login-title">Sign In</h1>
                <Form onSubmit={ submitHandler }>
                    <Form.Group className="my-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter Email"
                            value={ email } 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="login-input"
                        />
                    </Form.Group>

                    <Form.Group className="my-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter Password"
                            value={ password } 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="login-input"
                        />
                    </Form.Group>
                    { isLoading && <Loader /> }
                    <Button type="submit" variant="primary" className="mt-3 login-button">
                        Sign In
                    </Button>
                    <Row className="py-3">
                        <Col>
                            New Customer? <Link to='/register' className="login-link">Register</Link>
                        </Col>
                    </Row>
                </Form>
            </FormContainer>
        </Container>
    );
}

export default LoginScreen;
