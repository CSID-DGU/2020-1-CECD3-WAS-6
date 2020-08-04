import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from 'styled-components'
import { withRouter } from "react-router-dom";
import ProjectInfo from '../../components/ProjectInfo'
import Images from '../../contans/Image'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Typography } from 'antd';
import Icon from '@ant-design/icons'
import { registerUser } from '../../_actions/userAction'

const { Title } = Typography;

function Register(props) {
    const dispatch = useDispatch();
    return (
        <Formik
            //init data
            initialValues={{
                email: '',
                name: '',
                password: '',
                confirmPassword: ''
            }}

            //set input rules            
            validationSchema={Yup.object().shape({
                email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),

                name: Yup.string()
                .required('Name is reqired'),

                password: Yup.string()
                .min(6, 'Password must be at least 6 character')
                .required('Password is required'),

                confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password must be at least 6 character')
                .required('Confrim password is required')
            })}
            
            onSubmit={(values, { setSubmitting}) => {
                console.log(process.env.REACT_APP_SERVER_API)
                //set time out 
                setTimeout(() => {
                    let dataSubmit = {
                        email: values.email,
                        name: values.name,
                        password: values.password,
                    };

                    //send acction for react-redux
                    dispatch(registerUser(dataSubmit))
                        .then(response => {
                            console.log(response)
                            const { result, message } = response.payload;
                            if(result){
                                if(message === '회원 가입 성곡')
                                    props.history.push("/signin");
                                else{
                                    alert('회원 가입 실패합니다. ' + message)
                                }
                            }else{
                                alert(response.payload.err.errmsg)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    setSubmitting(false);
                }, 500)
            }}
        >
            {props => {
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
                                <Title level={2}>Register</Title>
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

                                    <Form.Item required>
                                        <Input
                                            id="name"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Enter your name"
                                            type="text"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.name && touched.name ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        {errors.name && touched.name && (
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

                                    <Form.Item>
                                        <Input 
                                            id="confirmPassword"
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Enter your confirm password"
                                            type="password"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.password && touched.password ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <div className="input-feedback">{errors.password}</div>
                                        )}
                                    </Form.Item>

                                    <Form.Item>
                                        <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                                            Submit
                                        </Button>
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

export default withRouter(Register)

