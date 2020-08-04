import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from 'styled-components'
import { withRouter } from "react-router-dom";
import ProjectInfo from '../../components/ProjectInfo'
import Images from '../../contans/Image'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import Icon from '@ant-design/icons'
import { loginUser } from '../../_actions/userAction'

const { Title } = Typography;

function Login(props) {
    const dispatch = useDispatch();

    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
    
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(rememberMeChecked);

    const handleRememberMe = () => {
        setRememberMe(!rememberMe)
    }
    const initialEmail = localStorage.getItem("rememeberMe") ? localStorage.getItem("rememberMe") : '';
    return (
        <Formik
            //init data
            initialValues={{
                email: '',
                password: ''
            }}

            //set input rules            
            validationSchema={Yup.object().shape({
                email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),

                password: Yup.string()
                .min(6, 'Password must be at least 6 character')
                .required('Password is required')
            })}
            
            onSubmit={(values, { setSubmitting}) => {
                //set time out 
                setTimeout(() => {
                    let dataSubmit = {
                        email: values.email,
                        password: values.password
                    };
                    //send acction for react-redux
                    dispatch(loginUser(dataSubmit))
                        .then(response => {
                            const { result, message  } = response.payload;
                            if(result){
                                console.log(rememberMe)
                                const { user, jwt } = response.payload;
                                localStorage.setItem('token',jwt);
                                if(rememberMe === true)
                                {
                                    window.localStorage.setItem('rememberMe', JSON.stringify(rememberMe))
                                }else{
                                    window.localStorage.removeItem('rememberMe');
                                }
                                props.history.push('/');
                            }else{
                                setFormErrorMessage('Check out for Account or Password again')
                            }
                        })
                        .catch(err => {
                            setFormErrorMessage('Check out for Account or Password again');

                            setTimeout(() => {
                                setFormErrorMessage("")
                            }, 3000);
                        })
                    setSubmitting(false);
                }, 500)
            }}
        >
            {props => {

                //get value and fuction from redux
                const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    } = props; 

                return (
                    <Wrapper>
                        <div className="app-text">
                            <div className="wrapper-form">
                                <Title level={2}>Log In</Title>
                                <form onSubmit={handleSubmit}>
                                    <Form.Item required>
                                        <Input
                                            id="email"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Enter your email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.email && touched.email ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        {errors.email && touched.email && (
                                            <div className="input-feedback">{errors.email}</div>
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Input 
                                            id="password"
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Enter your password"
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.password && touched.password ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        {errors.password && touched.password && (
                                            <div className="input-feedback">{errors.password}</div>
                                        )}
                                    </Form.Item>

                                    {formErrorMessage && (
                                        <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                                    )}    

                                    <Form.Item>
                                        <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>Remember me</Checkbox>
                                        <a className="login-form-forgot" href="/reset_user" style={{float: 'right'}}>
                                        Forgot Password 
                                        </a>
                                        <div style= {{margin: '10px 0'}}>
                                            <Button type="primary" htmlType="submit" className="login-form-btn" disabled={isSubmitting} onSubmit={handleSubmit}>
                                                Log in
                                            </Button>
                                        </div>
                                        Or <a href="signup">register now!</a>
                                    </Form.Item>
                                </form>
                            </div>
                        </div>
                        <div className="app-picture">
                            <img src= {Images.devImage}/>
                        </div>
                        <div className="app-page">
                            <ProjectInfo />
                        </div>
                    </Wrapper>
                )
            }}
        </Formik>
    )
}
const Wrapper = styled.div`
    width: 80%;
    height: 70%;

    position: absolute;
    top: 25%;
    left: 130px;

    transition: var(--transition);

    .app-text{
        width: 50%;
        float: left;
        .wrapper-form{
            margin: 0 auto;
            width: 50%;
            padding: 20px;
            background: #fff;

            .input-feedback{
                color: red;
            }
        }
    }

    .app-picture{
        width: 50%;
        float: right;
        img{
            width: 100%;
            margin-left: 50px;
        }
    }
`

export default withRouter(Login)

