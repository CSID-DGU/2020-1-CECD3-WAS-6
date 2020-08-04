import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';
import Images from '../../contans/Image';
import MainLeft from './components/MainLeft';
import ProjectInfo from '../../components/ProjectInfo';
import { useSelector } from 'react-redux';

function Dashboard(props){
    const state = useSelector(state => state.user)
    return (
        <Wrrapper>
            <div className="app-text">
                <MainLeft/>
            </div>
            <div className="app-picture">
                <img src= {Images.devImage}/>
            </div>
            <div className="app-page">
                <ProjectInfo />
            </div>
        </Wrrapper>
    )
}

const Wrrapper = styled.div`
    width: 80%;
    height: 70%;

    position: absolute;
 

    top: 25%;
    left: 130px;

    .app-text{
        width: 50%;
        float: left;
    }

    .app-picture{
        width: 50%;
        float: right;
        img{
            width: 100%;
            margin-left: 50px;
        }
    }
`;

export default Dashboard;