import React, { useEffect, useState } from 'react'
import { ControlledEditor, DiffEditor } from "@monaco-editor/react";
import styled from 'styled-components'
import { Row, Col, Button } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined, IdcardFilled, UploadOutlined } from '@ant-design/icons'
import Images from '../../contans/Image'
import SourceEditor from './components/SourceEditor'
import sampleCode from '../../contans/sampleCode'
import TestCaseEditor from './components/TestCaseEditor'
import sampleTestCase from '../../contans/sampleTestCase'
import Loading from '../../components/Loading'
import { Steps } from 'antd';
import ProcessLoading from './components/ProcessLoading'
import EditorAPI from '../../api/EditorAPI'
import qs from 'query-string'
import $ from 'jquery';
// import { MonacoDiffEditor } from 'react-monaco-editor';


function EditorPage(props) {

    const [uploadLanguage, setUploadLanguage] = useState('python');

    const [editor1Content, setContentEditor1] = useState(sampleCode[uploadLanguage]);
    const [editor2Content, setContentEditor2] = useState('');
    
    //basic format 
    const [viewEditor, setViewEditor] = useState('code');
    const [formatEditor1, setFormatEditor1] = useState('python');
    
    //file code
    const [listFile, setListFile] = useState([]); 
    const [codeContent, setCodeContent] = useState(sampleCode[uploadLanguage]);

    //file test case
    const [listFileTestCase, setListFileTestCase] = useState([]);
    const [testCaseContent, setTestCaseContent] = useState(sampleTestCase["base"]);

    //project
    const [project, setProject] = useState();
    const [loading, setLoading] = useState(false);

    const fileHandlerCode = (event) => {
        let fileArray = new Array(event.target.files[0])
        setListFile(fileArray)
        
        let fileName = event.target.files[0].name;
        let indexOf = fileName.toString().indexOf(".");
        let language = fileName.substring(indexOf + 1, fileName.length)
        switch (language) {
            case "py":
                setUploadLanguage("python")
                break;
            default:
                setUploadLanguage(language)
                break;
        }

        var fr=new FileReader();
        fr.onload = function() { 
            setContentEditor1(fr.result); 
            setCodeContent(fr.result);
        } 
        fr.readAsText(event.target.files[0]);
    }

    const fileHandlerTestCase = (event) => {
        let fileArray = new Array(event.target.files[0])
        setListFileTestCase(fileArray)

        var fr=new FileReader();
        fr.onload = function() { 
            setContentEditor1(fr.result); 
            setTestCaseContent(fr.result)
        } 
        fr.readAsText(event.target.files[0]);
    }


    const [submit, setSubmit] = useState(false);
    const [process, setProcess] = useState(false);
    const [selectLine, setSelectLine] = useState(0);
    const [step, setStep] = useState(0);


    const onSubmit = async (type) => {
        setSubmit(true);
        setProcess(false)
        if(type === 'reset'){
            setStep(0);
            setSubmit(false);
            setContentEditor1(sampleCode["python"])
            return;
        }
        switch (step) {
            case 0:
                $(".view-line").on( "click", function() {
                    alert("hello")
                });
                setProcess(!process);
                setTimeout( async () => {
                    let params = {
                        project_id: qs.parse(props.location.search).p,
                        code: codeContent ? codeContent : sampleCode["python"],
                        testCase: testCaseContent ? testCaseContent : sampleTestCase["base"]
                    }

                    const response = await EditorAPI.compile(params);
                    const { data } = response;
                    
                    setContentEditor2(data);

                    setProcess(false);
                    let nextStep = step + 1;
                    setStep(nextStep);

                }, 1000);
                break;
            case 1:
                if(selectLine !== 0)
                {
                    setProcess(!process);
                    let params = {
                        selectLine: selectLine,
                        project_id: qs.parse(props.location.search).p,
                    }
                    try {
                        const response = await EditorAPI.modify(params);
                        const { data } = response;
                        
                        setTimeout( async () => {
                            setContentEditor2(data);
                            setProcess(false);
                            let nextStep = step + 1;
                            setStep(nextStep);
                        }, 2000);
                    } catch (error) {
                        alert("빌드 실패합니다. 다시 시도해주세요.")
                    }
                }else{
                    alert("수정한 라인을 선택하세요")
                }
                break;
            case 2: 
                try {
                    setProcess(!process);
                    let params = {
                        code: editor2Content,
                        project_id: qs.parse(props.location.search).p,
                    }
                    const response = await EditorAPI.compileScala(params);
                    console.log(response)
                    const { data } = response;
                    
                    setTimeout( async () => {
                        setContentEditor2(data);
                        setProcess(false);
                    }, 2000);
                } catch (error) {
                    setProcess(false);
                    console.log(error)
                    alert("빌드 실패합니다. 다시 시도해주세요.")
                }
                // setStep(0);
                // setSubmit(false);
                // setContentEditor1(sampleCode["python"])
                break;  
            default:
                alert("입력한 값을 다시 확인하여 클릭 하세요")
                break;
        }

        
    }

    const options = {
        suggestLineHeight: 10,
        diffOverviewRuler: false
    };
    const id  = qs.parse(props.location.search).p;
    useEffect(() => {
        setLoading(false)
        setTimeout(() => {
            const fetchData= async () => {
                const params = {
                    project_id : id 
                }
                const res = await EditorAPI.getProjectById(params);
                const { data } = res;

                setProject(res.project)
                setCodeContent(data)
                setLoading(true)
            }
            fetchData();
        }, 500);
    }, [id])

    function getDirectChildren(elm, sel){
        var l = elm.childNodes.length;
        for (var i = 0; i < l; ++i){
            if(i === sel)
            {
                return elm.childNodes[i]
            }
        }
    }

    useEffect(() => {
        $("body").on("dblclick", ".modified-in-monaco-diff-editor .view-line", function(event) {
            Array.from(document.querySelectorAll(".modified .view-line"))
            .forEach(function(val) {
                    val.style.background="transparent";
            });
            var target = event.target;
            
            if(event.target.nodeName === "DIV")
            target.style.background = "blue";
            else    
            target.parentNode.parentNode.style.background = "blue";
            
            var _line = (Number(target.style.top.replace(/[^0-9]/g, '')) / 19 ) + 1;
            setSelectLine(_line)
        })
    }, [])

    const handleClickViewCodeTask = () => {
        setViewEditor('code')
        // setContentEditor1(sampleCode["python"])
        setFormatEditor1('python')
    }

    const handleClickViewTestCase = () => {
        setViewEditor('testcase')
        // setContentEditor1(sampleTestCase["base"])
        setFormatEditor1('json')
    }
    const { Step } = Steps;
    const [ hiddenLeft, setHiddenLeft] = useState(false)
    if(!loading){
        return <Loading />
    }
    return (
        <Wrapper>
            <Row className="header__step">
                {
                    hiddenLeft ?
                    <>
                        <Col xs={1} sm={1} md={1} lg={1} style={{background: '', color: 'black', padding: '0px 10px', borderRight: '1px solid #ccc'}}>
                            <div style={{display: 'flex', justifyContent: 'center', transition: 'all 4s'}}>
                                <i onClick = {() => setHiddenLeft(!hiddenLeft)}style={{float: "right", cursor: 'pointer'}}>{hiddenLeft ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}</i>
                            </div>
                        </Col>
                        <Col xs={23} sm={23} md={23} lg={23} style={{padding: '0px 10px'}}>
                            <Steps size="small" current={step}>
                                <Step title="코드 제출" />
                                <Step title="코드 수정" />
                                <Step title="제출 결과" />
                            </Steps>
                        </Col>
                    </> :
                    <>
                        <Col xs={0} sm={0} md={1} lg={3} style={{background: '', color: 'black', padding: '0px 10px', borderRight: '1px solid #ccc'}}>
                            <div style={{textAlign: 'center'}}>
                                {project.project_name}<i onClick = {() => setHiddenLeft(!hiddenLeft)}style={{float: "right", cursor: 'pointer'}}>{hiddenLeft ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}</i>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={23} lg={21} style={{padding: '0px 10px'}}>
                            <Steps size="small" current={step}>
                                <Step title="코드 제출" />
                                <Step title="코드 수정" />
                                <Step title="제출 결과" />
                            </Steps>
                        </Col>
                    </>
                }
            </Row>
            <Row className="editor__container">
            <Col xs={0} sm={0} md={0} lg={1} style={{background: ''}}>
                <nav className="nav-task">
                    <ul>
                        <li onClick={() => handleClickViewCodeTask()}>
                            <i className="fa fa-clipboard" style={viewEditor === 'code' ? {color: '#fff'} : {color: '#b7b7b7'}}></i>
                        </li>
                        <li onClick={() => handleClickViewTestCase()}>
                            <i className="fa fa-sitemap" style={viewEditor === 'code' ? {color: '#b7b7b7'} : {color: '#fff'}}></i></li>
                    </ul>
                </nav>
            </Col>
            {
                !hiddenLeft ?
                <>
                    <Col xs={0} sm={0} md={1} lg={2}style={{background: ''}} >
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
                    <Col xs={24} sm={24} md={23} lg={21}>
                        <div style={{height: '90%'}}>
                            {
                                !submit ? 
                                <ControlledEditor
                                    language={"python"}
                                    theme="dark"
                                    value={
                                        viewEditor === 'code' ? 
                                        codeContent ?  codeContent : editor1Content : 
                                        testCaseContent ? testCaseContent : editor1Content
                                    }
                                    options={options}
                                    onChange={(e, value) => viewEditor === 'code' ? setTestCaseContent(value) : setCodeContent(value)}
                                /> : 
                                <DiffEditor
                                    theme="dark"
                                    language= "python"
                                    original={
                                        viewEditor === 'code' ? 
                                        codeContent ?  codeContent : editor1Content : 
                                        testCaseContent ? testCaseContent : editor1Content
                                    }
                                    modified={editor2Content}
                                    options={options}
                                    className="editor-container"
                                    loading={Loading}
                                />
        
                            }
                            {
                                process && <ProcessLoading /> 
                            }
                        </div>
                        <div className="container-task" style={{height: '10%'}}> 
                            <Button type="primary" onClick={()=> onSubmit("reset")} danger>초기화</Button>
                            <Button type="primary" onClick = {onSubmit}>제출</Button>
                        </div>
                    </Col>
                </> :
                <>
                    <Col xs={24} sm={24} md={24} lg={23} >
                        <div style={{height: '90%', transition: 'all 0.4s'}}>
                            {
                                !submit ? 
                                <ControlledEditor
                                    language={"python"}
                                    theme="dark"
                                    value={
                                        viewEditor === 'code' ? 
                                        codeContent ?  codeContent : editor1Content : 
                                        testCaseContent ? testCaseContent : editor1Content
                                    }
                                    options={options}
                                    onChange={(e, value) => setCodeContent(value)}
                                    loading={Loading}
                                /> : 
                                <DiffEditor
                                    theme="dark"
                                    language= "python"
                                    original={
                                        viewEditor === 'code' ? 
                                        codeContent ?  codeContent : editor1Content : 
                                        testCaseContent ? testCaseContent : editor1Content
                                    }
                                    modified={editor2Content}
                                    options={options}
                                    className="editor-container"
                                    loading={Loading}
                                />
        
                            }
                            {
                                process && <ProcessLoading /> 
                            }
                        </div>
                        <div className="container-task" style={{height: '10%'}}> 
                            <Button type="primary" onClick={()=> onSubmit("reset")} danger>초기화</Button>
                            <Button type="primary" onClick = {onSubmit}>제출</Button>
                        </div>
                    </Col>
                </>

            }
            {/* <Col xs={0} sm={4} md={3} lg={2} style={{background: ''}}>
                <Button type={ step === 2 ? "danger" : step === 1 ? "default" : "primary" } style={{width:'100%'}} onClick = {onSubmit}> { step === 2 ? "Reset" : step === 1 ? "Correct" : "Run"} </Button>
                {
                    !process && <ProcessLoading /> 
                }
            </Col> */}
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
        /* padding: 0 20px; */
        display: flex;
        align-content: center;
    }
    .editor__container{
        background: rgb(22, 25, 39);
        color: white;
        min-height: 97%;
        .ant-row{
            height: 100%;
        }
        .nav-task{
            border-right: 2px solid #363636;
            height: 100%;
            text-align: center;
            ul li{
                font-size: 20px;
                margin-bottom: 10px;
                cursor: pointer;
            }
        }
        .file-list{
            /* border-right: 2px solid #fff; */
            height: 100%;
    
            .upload-btn{
                float: right;
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
            }
            ul{
                /* border-top: 2px solid #fff; */
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
    }
    .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input{
        background: #202A33;
    }
    .monaco-editor .margin{
        background: #202A33;
    }
    /* .minimap-decorations-layer{
        background: #202A33;
    } */
    .container-task{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-end;
        padding-right: 50px;
        button{
            margin-right: 10px;
            width: 100px;
        }
        background: #161927;
    }
`


export default EditorPage

