import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function ProjectInfo(props) {
    return (
        <Wrraper>
            <h3>what is project?</h3>
                <p className="app-page-content">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap 
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum 
                passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </Wrraper>
    )
}
const Wrraper = styled.div`
    position: absolute;
    bottom: 0px;
    h3{
        color: #19dafa;
    }
    p{
        color: #fff;
    }
`

ProjectInfo.propTypes = {

}

export default ProjectInfo

