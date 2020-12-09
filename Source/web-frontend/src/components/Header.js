import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import { GoTools, GoGrabber } from "react-icons/go";
import Images from '../contans/Image'
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import userAPI from '../api/UserAPI';

// import SubMenu from 'antd/lib/menu/SubMenu';
// const MenuItemGroup = Menu.ItemGroup;

function Header(props) {

    const user = useSelector(state => state.user)

    const logoutHandler = async () => {
        const request = await userAPI.logOutUser();
        localStorage.removeItem('token');
        if(request.result){
            props.history.push("/signup");
        }else{
            console.log('Log out failed, please do again')
        }
    }
    return (
        <Wrrapper className="menu">
            <ul>
                <li className="logo">
                    <img src= {Images.logoImage}  onClick={() => props.history.push("/")} />
                </li>
                <li><Link to="/projectmanage"><i className="fa fa-list-ul"></i>List Project</Link></li>
                <li><Link to="/work"><i className="fa fa-cogs"></i>how it works</Link></li>
                <li><Link to="/plans"><i className="fa fa-map-o"></i>future plans</Link></li>
                <li><Link to="/about"><i className="fa fa-group"></i>about us</Link></li>
                <li><a href="https://github.com/CSID-DGU/2020-1-CECD3-WAS-6" target="_blank"><i className="fa fa-github-square"></i>github</a></li>
                {
                    user.userData && !user.userData.isAuth ?
                    <>
                        <li><Link to="/signin" className="signin-btn"><span><i className="fa fa-user"></i>sign in</span></Link></li> 
                        <li><span className="sign-middle-btn">/</span></li> 
                        <li><Link to="/signup" className="signup-btn"><span><i className="fa fa-user-plus"></i>sign up</span></Link></li>
                    </> 
                    :
                    <>
                        <li><span className="user-name">{user.userData ? user.userData.data.name : ''}</span></li> 
                        <li><Link to="/" onClick={logoutHandler} className="signout-btn signin-btn"><span><i className="fa fa-user"></i>LogOut</span></Link></li> 
                    </> 
                }
            </ul>
        </Wrrapper>
    )
}

const Wrrapper = styled.div`
    /* border-bottom: 1px solid var(--clr-grey-1); */
    background: rgb(33, 46, 68);
    ul {
        display: inline-flex;
        margin: 50px;
    }
    ul li{
        list-style: none;
        margin: 0 20px;
        cursor: pointer;
        a {
            text-transform: capitalize;
            color: #b2b1b1;
            i{
                margin-right: 5px;
            }
        }
    }
    .logo img{
        width: 100px;
        margin-top: -20px;
    }

    .user-name{
        position: absolute;

        color: #19d7f8;
        font-size: 20px;
        top: 45px;
        right: 350px;
    }
    .signin-btn, .signup-btn{
        position: absolute;

        top: 40px;
        right: 80px;

        border: 2px solid transparent;
        border-radius: 20px;
        background-image: linear-gradient(#42455a, #42445a), radial-gradient(circle at top left, #fd00da, #19d7f8);
        background-origin: border-box;
        background-clip: content-box, border-box;


        transition: var(--transition);
        color: #fff;
        span{
            display: block;
            padding: 7px 15px;
        }

        &:hover{
            background: #b2b1b1;
            color: black;
        }
    }
    .signin-btn{
        right: 220px;
        background-image: linear-gradient(#42455a, #42445a), radial-gradient(circle at top left,#19d7f8,  #fd00da);
    }
    .sign-middle-btn{
        position: absolute;
        color: #19d7f8;
        top: 40px;
        right: 200px;
        font-size: 25px;
        z-index: 9;
    }
`;


export default withRouter(Header);
