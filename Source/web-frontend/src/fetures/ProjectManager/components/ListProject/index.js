import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import mm from 'moment'
import { ContainerOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import EditorAPI from '../../../../api/EditorAPI'
function ListProject({listProject}) {
    console.log(listProject)
    const handleDownload = async (id) => {
        try{
            const params = {
                projectId: id
            }
            const response = await EditorAPI.downloadProject(params);
            console.log(response)
            const { data } = response;
            const { path } = data[0];
            const link = document.createElement('a');
            link.href = `${process.env.REACT_APP_SERVER_API}/${path}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }catch(error){
            alert('서버 연결 오류 발생했으니 다시 시도 해주세요. 프로젝트 다운로드 실패합니다.')
            console.log(error)
        }
    }
    return (
        listProject.length !== 0 &&
        listProject.map((item, idx) => 
            <WrapperProject>
                <Link to = {`/editor?p=${item.id}`} >
                    <p>{item.project_name}</p>
                    <span>{item.language} {mm(item.created).format('l')} </span>
                </Link>
                <div>
                    <ul>
                    <Tooltip placement="bottomRight" title="에디터">
                        <li><Link to = {`/editor?p=${item.id}`}><ExportOutlined /></Link></li>
                    </Tooltip>
                    <Tooltip placement="bottomRight" title="다운로드">
                        <li><Link onClick={() => handleDownload(item.id)}><DownloadOutlined /></Link></li>
                    </Tooltip>
                    <Tooltip placement="bottomRight" title="빌드 히스토리">
                        <li><Link to= {`/history?p=${item.id}`}><ContainerOutlined /></Link></li>
                    </Tooltip>

                    </ul>
                </div>
            </WrapperProject>
        )
    )
}
const WrapperProject = styled.div`
    /* max-height: 200px; */
    max-width: 300px;
    /* padding: 20px; */
    background: white;
    text-align: center;
    cursor: pointer;
    > a{
        /* width: 100%;
        height: 100%; */
        display: block;
        padding: 20px;
        /* background: blue; */
        border-bottom: 2px #ddd solid;
    }
    div{
        ul{
            display: flex;
            justify-content: space-between;
            padding: 5px 5px;
            margin-bottom: 0px;
            li{
                /* background: red; */
                width: 40px;
                height: 40px;
                border-radius: 50%;
                a{
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                }
                :hover{
                    box-shadow:0px 0px 2px 2px #ddd;
                }
            }
        }
    }
    :hover{
        -webkit-box-shadow: 0px 0px 15px 7px rgba(0,0,0,0.38);
        -moz-box-shadow: 0px 0px 15px 7px rgba(0,0,0,0.38);
        box-shadow: 0px 0px 15px 7px rgba(0,0,0,0.38);
    }
`
const WrapperListProjects = styled.div`
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    // grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 1.5rem;
    // background: blue;
    grid-row-gap: 24px;
    width: 80%; */
`
export default ListProject

