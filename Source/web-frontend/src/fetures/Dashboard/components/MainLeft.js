import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function MainLeft(props) {

    const user = useSelector(state => state.user);
    return (
        <Wrapper className="main-page-left">
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
                        <Link to="/editor"><i className="fa fa-keyboard-o"></i>start coding <i className="fa fa-code"></i></Link>
                    }
                </div>
                {/* <small><b>for Code</b></small> */}
            </div> 
        </Wrapper>
    )
}
const Wrapper = styled.div`
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
                background: #b2b1b1;
                color: black;
            }
        }
`
export default MainLeft

