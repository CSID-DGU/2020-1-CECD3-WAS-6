import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { UploadOutlined } from '@ant-design/icons'
import Images from '../../../contans/Image'

function TestCaseEditor({ listFileTestCase,fileHandler }) {

    function onCLickOpenFile(){
        const codeFile = document.createElement('input');
        codeFile.setAttribute('type','file');
        codeFile.setAttribute('name','file');
        codeFile.setAttribute('style','display: none');
        document.body.appendChild(codeFile);
        codeFile.click();
        codeFile.onchange = fileHandler;
    }
    return (
        <Wrapper className="file-list">
        <label style={{paddingLeft: '5px',fontSize: '20px'}}>Test Case</label>
        <button style={{paddingRight: '5px', fontSize: '20px', outline: 'none'}} className="upload-btn" onClick={onCLickOpenFile}>
            <UploadOutlined /> 
        </button>
        <ul>
            {
                listFileTestCase.length !== 0 ?
                    listFileTestCase.map((item, idx) => (
                        <li><img src = {Images.fileImage}/>{item.name}</li>
                    )) :
                <li><img src = {Images.fileImage}/>testcase.json</li>
            }
        </ul>
    </Wrapper>
    )
}
const Wrapper = styled.div`

`

export default TestCaseEditor

