import React from 'react'

function ProjectLayout(props) {
    const { children } = props;
    return (
        <div className="row">
            <div className="body-container">
                { children }
            </div>
        </div>
    )
}


export default ProjectLayout

