import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function Footer(props) {
    return (
        <Wrapper>
            <p> Developed by WAS Team, Dongguk univ.</p>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    position: absolute;
    bottom: 0px;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(33, 46, 68);
    p{
        color: #fff;
    }

`
export default Footer

