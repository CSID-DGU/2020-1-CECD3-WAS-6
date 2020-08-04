import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function Error(props) {
    return (
        <Wrapper>
            <div>
                <h1>404</h1>
                <h3>sorry, the page you tried cannot be found</h3>
                <Link to ="/" className="btn">back home</Link>
            </div>
        </Wrapper>
    )
}
const Wrapper = styled.section`
    display: grid;
    place-items: center;
    /* background: var(--clr-primary-10); */
    text-align: center;
    h1{
        color: #fff;
        font-size: 10rem;
    }
    h3{
        color: var(--clr-grey-3);
        color: #fff;
        margin-bottom: 1.5rem;
    }
`
Error.propTypes = {

}

export default Error

