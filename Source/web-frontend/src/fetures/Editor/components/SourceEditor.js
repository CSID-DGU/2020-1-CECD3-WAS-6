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
        <Wrapper className="file-list">
            <div className="file-list__header">
                <label style={{paddingLeft: '5px',fontSize: '10px'}}>EXPLORER FILES</label>
                <button style={{paddingRight: '5px', fontSize: '15px', outline: 'none'}} className="upload-btn" onClick={onCLickOpenFile}>
                    <UploadOutlined /> 
                </button>   
            </div>
            <ul>
                {
                    listFile.length !== 0 ?
                        listFile.map((item, idx) => (
                            <li><img src =
                            {
                                item.name.includes(".c") ? Images.cImage : item.name.includes(".cpp") ? Images.cppImage : Images.pyImage
                            }
                            />{item.name}</li>
                        )) :
                    <li><img src = {Images.pyImage}/>main.py</li>
                }
            </ul> 
        </Wrapper>
    )
}
const Wrapper = styled.div`
    .file-list{
        &__header{
            color: #b7b7b7;
            border-bottom: 2px solid #363636;
            padding: 5px 0px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
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

