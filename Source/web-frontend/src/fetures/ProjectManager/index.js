import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ListProject from './components/ListProject'
import EditorAPI from '../../api/EditorAPI'
import { DownloadOutlined, PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'
import { Option } from 'antd/lib/mentions'
import './style.scss'

function ProjectManage(props) {

    const [listProject, setListProject] = useState([]);
    const [modal, setModal] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const res =  await EditorAPI.listProject();
            const { data } = res;
            setListProject(data)
        }
        fetchData();
    }, [])

    const handleSubmit =   (name, language) => {
        setTimeout( async () => {
            const params = {
                name,language
            }
            const res = await EditorAPI.createProject(params)
            const { data } = res;
            setModal(false)
            setListProject([...listProject, data])
        }, 500);
    }
    const handleDeleteProject = async(id) => {
        try{
            const params = {
                projectId: id
            }
            const response = await EditorAPI.deleteProject(params);
            const { result } = response
            if(result){
                let listProjectTemp = listProject.filter(project => project.id !== id)
                setListProject(listProjectTemp)
            }
        }catch(error){
            alert('서버 연결 오류 발생했으니 다시 시도 해주세요. 프로젝트 다운로드 실패합니다.')
            console.log(error)
        }
    }
    return (
        <WrapperDiv>
            <div className="nav-left">
                <ul style={{textAlign: 'center'}}>
                    <li><UnorderedListOutlined /> {"   "}프로젝트 목록</li>
                </ul>
            </div>
            <div className="nav-right">
                <div className="project-create"  onClick={() => setModal(!modal) } >
                    <PlusCircleOutlined /><span style={{marginLeft: '5px'}}>프로젝트 생성</span>
                </div>
                <ListProject 
                    listProject = {listProject}
                    handleDeleteProject={handleDeleteProject}
                />
            </div>
            {
                modal && <CreateProjectWrapper  handleSubmit={handleSubmit}/>
            }
        </WrapperDiv>
    )
}
const WrapperDiv = styled.div`
    display: flex;
    .nav-left{
        width: 10%;
        padding-top: 20px;
        ul li{
            margin-bottom: 10px;
            padding: 10px 0 10px 0px;
            font-size: 15px;
            background: white;
            cursor: pointer;
            font-weight: bold;
        }
    }
    .nav-right{
        width: 90%;
        position: relative;
        padding-top: 20px;
        padding-left: 20px;
        /* display: flex; */

        .project-create{
            background: white;
            min-height: 150px;
            max-width: 300px;

            display: flex;
            align-items: center;
            justify-content: center;


            transition: all .5s ease-in-out;
            cursor: pointer;
            &:hover{
                font-size: 20px;
            }
        }


        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-column-gap: 1.5rem;
        grid-row-gap: 24px;
        width: 80%;
    }
`

const CreateProjectWrapper = ({handleSubmit}) => {

    const [name, setName] = useState("")
    const [language, setLanguage] = useState("Python")
    const _handleSubmit = () => {
        handleSubmit(name, language)
    }
    return <div  className ="create__modal">
        <div>
            <p style={{fontSize: '20px', textAlign: "center"}}>프로젝트 정보</p>
            <form onSubmit={() => _handleSubmit(name, language)}>
                <div>
                    <label>이름 </label>
                    <Input placeholder="프로제트 이름"  onChange={(e) => setName(e.target.value)} value={name} />
                    {/* <input type="text" onChange={(e) => setName(e.target.value)}/> */}
                </div>
                <div style={{marginTop: '20px'}}>
                    <label>언어</label><br/>
                    <Select defaultValue={language} style={{ width: "100%" }} onChange={(value) => setLanguage(value) }>
                        <Option value="Python">Python</Option>
                        <Option value="C/C++">C/C++</Option>
                        <Option value="Java">Java</Option>
                    </Select>
                </div>
                <div style={{textAlign: "center", marginTop: '20px'}}>
                    <Button type="primary" size={'large'} onClick={() => _handleSubmit()}>
                        프로젝트 생성
                    </Button>
                </div>
            </form>
        </div>
    </div>
}
export default ProjectManage

