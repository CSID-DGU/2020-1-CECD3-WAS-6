import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactLoading from 'react-loading';

function Loading(props) {
    return (
        <WrapperContainer>
            <ReactLoading type='spinningBubbles' color='#fff' height={'3%'} width={'3%'} />
        </WrapperContainer>
    )
}
const WrapperContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10%;
    height: 100%;
`

export default Loading

