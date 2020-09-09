import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function ProjectInfo(props) {
    return (
        <Wrraper>
            <h3>what is project?</h3>
                <p className="app-page-content">
                Hello! Everyone, This project is about an Automated Debugger which automatically find lines of erroneous code and correct them
                satisfying given specification. The debugger made of some techniques. First technique that we use is Fault Localization. 
                This technique find lines that is likely to occur fault in execution. To be specific, in our project, 
                we implements Coverage-based Fault Localization. Also, The Fault Localization calculates suspiciouness of error-prone code with some 
                formulas such as Tarantula, Ochiai, etc. Second, Program Synthesis is one of automated programming and generates code that satisfies given specification. 
                In this project, this technique corrects error code which is specified by Fault Localization. As a result, this system will be served as a web application.
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

