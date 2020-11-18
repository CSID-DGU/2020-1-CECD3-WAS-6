import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Timeline } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, NodeExpandOutlined, ShrinkOutlined } from '@ant-design/icons'
import { DiffEditor } from "@monaco-editor/react";
import Loading from '../../components/Loading'
import EditorAPI from '../../api/EditorAPI'
import qs from 'query-string'
import mm from 'moment'

function ProjectBuildHistory(props) {
    
    
   
    const [listHistory, setListHistory] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const params = {
                project_id : qs.parse(props.location.search).p
            }
            const res = await EditorAPI.getHistoryByProjectId(params);
            const { data } = res;
            console.log(data)
            setListHistory(data)
        }
        fetchData();
    }, [])
    return (
        <ProjectBuildWrapper>
            <div className="container">
                <h3>{qs.parse(props.location.search).p}. Hello</h3>
                <div className="timeline">
                {
                    setListHistory.length !== 0 &&
                    listHistory.map((item, idx) => (
                        <Timeline>
                            <TimeLineContainer item={item} key={idx}/>
                        </Timeline>
                    ))
                }
                </div>
            </div>
        </ProjectBuildWrapper>
    )
}

const TimeLineContainer = ({item}) => {
    const [openModal, setOpenModal] = useState(false)
    const options = {
        suggestLineHeight: 10,
        diffOverviewRuler: false
    };

    return(
        <>
            <Timeline.Item>
            <div className="log-wrapper">
                <p>{mm(item.time).format()}</p>
                <div className="log-wrapper__content">
                    <div className="log-wrapper__content--modal">
                        <span><NodeExpandOutlined /> Log {item.build_path}</span>
                        <ul>
                            <li onClick={() => setOpenModal(!openModal)}>{openModal ? <ArrowUpOutlined /> : <ArrowDownOutlined />}</li>
                        </ul>
                    </div>
                    {
                        openModal &&
                        <div className="log-wrapper__content--detail">
                            <DiffEditor
                                language= "python"
                                original={item.original}
                                theme="dark"
                                modified={item.modified}
                                options={options}
                                loading={Loading}
                            />
                        </div>
                    }
                </div>
            </div>
            </Timeline.Item>
        </>
    )
}
const ProjectBuildWrapper = styled.div`
    width: 90%;
    background: #fff; 
    height: 82vh;
    margin: 0 auto;
    overflow-y: auto;
    padding: 0 100px;

    h3{
        position: sticky;
        top: 0px;
        z-index: 10;
        padding: 10px 20px;
        background: white;
    }
    .timeline{
        margin-top: 20px;
    }
    .log-wrapper__content{
        background: #F6F8FA;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        /* background: red; */
        &--modal{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        &--detail{
            position: relative;
            width: 100%;
            height: 500px;
            transition: all 2s ease-in;
        }
        ul{
            display: flex;
            li{
                margin: 0 10px;
                padding: 6px;
                animation: all 0.5s ease-in;
                cursor: pointer;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: center;
                :hover{
                    color: #1890ff;
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

export default ProjectBuildHistory

