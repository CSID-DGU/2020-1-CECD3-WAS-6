import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import Editor from "@monaco-editor/react";
import Images from '../../contans/Image'
import SourceEditor from './components/SourceEditor'
import sampleCode from '../../contans/sampleCode'
import TestCaseEditor from './components/TestCaseEditor'
import sampleTestCase from '../../contans/sampleTestCase'
import Loading from '../../components/Loading'
import { Steps } from 'antd';
import ProcessLoading from './components/ProcessLoading'
import EditorAPI from '../../api/EditorAPI'
import $ from 'jquery';
import { MonacoDiffEditor } from 'react-monaco-editor';

function EditorPage(props) {

    const [editor1Content, setContentEditor1] = useState(sampleCode["c"]);
    const [editor2Content, setContentEditor2] = useState('');
    
    //basic format 
    const [viewEditor, setViewEditor] = useState('code');
    const [formatEditor1, setFormatEditor1] = useState('c');
    
    //file code
    const [listFile, setListFile] = useState([]); 
    const [codeContent, setCodeContent] = useState('');

    //file test case
    const [listFileTestCase, setListFileTestCase] = useState([]);
    const [testCaseContent, setTestCaseContent] = useState('');

    const fileHandlerCode = (event) => {
        setListFile([...listFile, event.target.files[0]])
        var fr=new FileReader();
        fr.onload = function() { 
            setContentEditor1(fr.result); 
            setCodeContent(fr.result);
        } 
        fr.readAsText(event.target.files[0]);
    }

    const fileHandlerTestCase = (event) => {
        setListFileTestCase([...listFileTestCase, event.target.files[0]])
        var fr=new FileReader();
        fr.onload = function() { 
            setContentEditor1(fr.result); 
            setTestCaseContent(fr.result)
        } 
        fr.readAsText(event.target.files[0]);
    }


    const [process, setProcess] = useState('false');
    const [selectLine, setSelectLine] = useState();
    const [step, setStep] = useState(0);

    const onSubmit = async () => {

        setProcess(!process);
        
        const params = {
            code: codeContent ? codeContent : sampleCode["c"],
            testCase: testCaseContent ? testCaseContent : sampleTestCase["base"],
            selectLine: selectLine
        }
        const response = await EditorAPI.compile(params);
        const { data } = response;

        setContentEditor2(data);

        setTimeout(() => {
            setProcess(true);
            let nextStep = step + 1;
            console.log(nextStep)
            setStep(nextStep);
            // alert("구현중입니다....^^!")
        }, 1000);
    }

    const options = {
        suggestLineHeight: 10,
        selectOnLineNumbers: true,
    };

    useEffect(() => {
        $(".modified ").on('dblclick',".view-line",function (event) {
            Array.from(document.querySelectorAll(".modified .view-line"))
                .forEach(function(val) {
                    val.style.background="transparent";
            });
            var target = event.target;
            target.style.background = "blue";
            var line = (Number(target.style.top.replace(/[^0-9]/g, '')) / 19 ) + 1;
            setSelectLine(line)
        })
    }, [])
    const { Step } = Steps;
    return (
        <Wrapper>
            <Row className="header__step">
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Steps size="small" current={step}>
                        <Step title="코드 제출" />
                        <Step title="코드 수정" />
                        <Step title="제출 결과" />
                    </Steps>
                </Col>
            </Row>
            <Row className="editor__container">
            <Col xs={0} sm={0} md={0} lg={1} style={{background: ''}}>
                <nav className="nav-task">
                    <ul>
                        <li onClick={() => {
                            setViewEditor('code')
                            setContentEditor1(sampleCode["c"])
                            setFormatEditor1('c')
                    }}
                        ><i className="fa fa-clipboard"></i></li>
                        <li onClick={() => {
                            setViewEditor('testcase')
                            setContentEditor1(sampleTestCase["base"])
                            setFormatEditor1('json')
                    }}><i className="fa fa-code-fork"></i></li>
                    </ul>
                </nav>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}style={{background: ''}} >
                {
                    viewEditor === 'code' ?
                    <SourceEditor 
                        listFile = {listFile}
                        fileHandler = {fileHandlerCode}
                    /> :
                    <TestCaseEditor 
                        listFileTestCase = {listFileTestCase}
                        fileHandler = {fileHandlerTestCase}
                    />
                }
            </Col>
            <Col xs={0} sm={4} md={3} lg={2} style={{background: ''}}>
                <Button type="primary" style={{width:'100%'}} onClick = {onSubmit}> Run </Button>
                {
                    !process && <ProcessLoading /> 
                }
            </Col>
            <Col xs={12} sm={10} md={9} lg={18} style={{background: ''}}>
                <MonacoDiffEditor
                    language= "c"
                    original={
                        viewEditor === 'code' ? 
                        codeContent ?  codeContent : editor1Content : 
                        testCaseContent ? testCaseContent : editor1Content
                    }
                    theme="vs-dark"
                    value={editor2Content}
                    options={options}
                />
            </Col>
            </Row>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    height: 80vh;
    .header__step{
        min-height: 5%;
        color: white;
        background: white;
        padding: 0 20px;
        display: flex;
        align-content: center;
    }
    .editor__container{
        background: rgb(22, 25, 39);
        color: white;
        min-height: 95%;
        .ant-row{
            height: 100%;
        }
        .nav-task{
            border-right: 2px solid #fff;
            height: 100%;
            text-align: center;
            ul li{
                font-size: 30px;
                border-bottom: 1px solid #fff;
                cursor: pointer;
            }
        }
    
        .file-list{
            border-right: 2px solid #fff;
            height: 100%;
    
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
    
        .line-numbers{
            /* background: red; */
            z-index: 99 !important;
            /* cursor: pointer !important; */
            /* display: block; */
    
            &:hover{
                /* background: blue; */
            }
        }
    }
`


export default EditorPage

