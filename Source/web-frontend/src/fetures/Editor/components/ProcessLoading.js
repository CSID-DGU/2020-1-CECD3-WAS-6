import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactLoading from 'react-loading';

function ProcessLoading(props) {
    return (
        <Wrraper>
            <div>
                <ReactLoading type='cylon' color='#fff' height={'100px'} width={'100px'} />
            </div>
        </Wrraper>
    )
}
const Wrraper = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;

    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    > div{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`
export default ProcessLoading

