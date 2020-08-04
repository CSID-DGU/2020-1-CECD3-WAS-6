import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactLoading from 'react-loading';

function Loading(props) {
    return (
        <Wrraper>
            <ReactLoading type='cylon' color='#fff' height={'10%'} width={'10%'} />
        </Wrraper>
    )
}
const Wrraper = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
`

Loading.propTypes = {

}

export default Loading

