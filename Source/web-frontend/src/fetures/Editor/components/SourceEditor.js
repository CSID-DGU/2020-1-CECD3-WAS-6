import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { UploadOutlined } from '@ant-design/icons';
import Images from '../../../contans/Image';

function SourceEditor({listFile, fileHandler}) {

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
        <Wrraper className="file-list">
            <label style={{paddingLeft: '5px',fontSize: '20px'}}>Files</label>
            <button style={{paddingRight: '5px', fontSize: '20px', outline: 'none'}} className="upload-btn" onClick={onCLickOpenFile}>
                <UploadOutlined /> 
            </button>
            <ul>
                {
                    listFile.length !== 0 ?
                        listFile.map((item, idx) => (
                            <li><img src = {Images.cImage}/>{item.name}</li>
                        )) :
                    <li><img src = {Images.cImage}/>main.c</li>
                }
            </ul>
        </Wrraper>
    )
}
const Wrraper = styled.div`
    .file-list{
        .upload-btn{
            float: right;
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
        }
        ul{
            border-top: 2px solid #fff;
            li{
                padding-left: 10px;
                display: flex;
                img{
                    margin-top: 5px;
                    margin-right: 5px;
                    width: 15px;
                    height: 15px;
                }
    
                cursor: pointer;
                &:hover{
                    background: #42455A;
                }
            }
        }
    }
`
export default SourceEditor

