import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import '../styles/loginScreenStyle.css';

const RegisterScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [register, { isLoading }] = useRegisterMutation();

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password mismatch')
        } else {
            try {
                const res = await register({ name, email,mobile, password }).unwrap();
                dispatch(setCredentials({ ...res }))
                navigate('/')
            } catch (error) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <FormContainer>
            <h1 className="signUp-title">Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name"
                        value={name} onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="mobile">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter Mobile Number"
                        value={mobile} onChange={(e) => setMobile(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                { isLoading && <Loader /> }

                <Button type="submit" variant="primary" className="mt-3">
                    Sign Up
                </Button>
                <Row className="py-3">
                    <Col>
                        Already have an account? <Link to='/login'>Login</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    );
}

export default RegisterScreen;