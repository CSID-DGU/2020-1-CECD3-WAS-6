import React, { Component } from 'react'
import styled from 'styled-components';
import Images from '../../contans/Image';
// import ProjectInfo from './components/ProjectInfo';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Dashboard(props){
    const user = useSelector(state => state.user);
    return (
        <>
            <Wrrapper className="container-content">
                <div className="app-text">
                    <h2>A New Way to Learn.</h2>
                    <p>WAS is the best platform to help you enhance your skills, <br/>expand your knowledge and prepare for technical interviews.</p>
                    <div className="signup-btn">
                        <div className="signup-btn-inner">
                            {
                                user.userData && !user.userData.isAuth ?
                                    <>
                                    <Link to="signup"><i className="fa fa-user"></i>sign in</Link>
                                    <small><b>for code</b></small>
                                    </>
                                :
                                <Link className="startcoding-btn" to="/projectmanage"><i className="fa fa-keyboard-o"></i>start coding <i className="fa fa-code"></i></Link>
                            }
                        </div>
                        {/* <small><b>for Code</b></small> */}
                    </div> 
                </div>
                <div className="app-picture">
                    <img src= {Images.devImage}/>
                </div>
            </Wrrapper>
            {/* <ProjectInfo /> */}
        </>
    )
}

const Wrrapper = styled.div`
    width: 100%;
    display: flex;
    /* background: blue; */
    box-sizing: border-box;
    .app-text{
        margin-top: 300px;
        margin: 300px 0 0 100px;
        /* background: red; */
        width: 50%auto;
        h2{ 
            color: #fff;
            font-size: 40px;
            width: 640px;
            font-weight: bold;
            position: relative;
            margin-left: 40px;
        }
        p{
            width: 650px;
            font-size: 15px;
            margin: 30px 0 30px 40px;
            line-height: 30px;
            color: #919191;
        }
        .signup-btn{
            margin-left: 40px;
            display: inline-flex;

            border: 2px solid transparent;
            border-radius: 18px;
            background-image: linear-gradient(#42455a, #42445a), radial-gradient(circle at top left, #fd00da, #19d7f8);
            background-origin: border-box;
            background-clip: content-box, border-box;

            cursor: pointer;
            transition: var(--transition);

            .signup-btn-inner{
                padding: 10px;
                font-size: 20px;
                text-transform: capitalize;
                
                a{
                    color: #fff;
                }
                .fa{ 
                    margin-right: 5px;
                }
            }

            small{
                position: absolute;
                color: #19dafa;
                text-transform: uppercase;
                letter-spacing: 3px;

                margin-left: 50px;
                margin-top: 5px;
            }
            &:hover{
                background: #19d7f8;
                color: black;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
                a{
                    color: hsl(185, 91%, 17%);
                }
            }
        } 
    }
    .app-picture{
        width: 50%;
        /* padding: 100px; */
        img{
            margin: 210px 100px 0 250px;
            width: 70%;
            height: 70%;
            min-width: 350px;
            min-width: 150px;
        } 
    }
`;

export default Dashboard;