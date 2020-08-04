import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function Footer(props) {
    return (
        <Wrapper>
            <p> develop by was team of dongguk uni.</p>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    position: absolute;
    bottom: 0px;
    width: 100%;
    text-align: center;
    p{
        text-transform: capitalize;
        color: #fff;
    }

`
export default Footer

