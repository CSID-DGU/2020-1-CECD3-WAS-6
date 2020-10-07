import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactLoading from 'react-loading';

function ProcessLoading(props) {
    return (
        <Wrraper>
            <ReactLoading type='cylon' color='#fff' height={'100px'} width={'100px'} />
        </Wrraper>
    )
}
const Wrraper = styled.div`
    margin-top: 300px;
    display: flex;
    align-content: center;
    justify-content: center;
`
export default ProcessLoading

