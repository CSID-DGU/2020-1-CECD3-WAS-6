var express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path');
const tarantula = require('../modules/tarantula.js');
var fse = require('fs-extra');
const moment = require('moment')
const db = require('../modules/db-connection');
const sql = require('../sql')
const zipFolder = require('zip-a-folder');
const fileController = require('../modules/file-controller')

const { authorizationAPI } = require('../modules/check-middleware')

const ROOT = process.env.ROOT;
const PROJECTS = process.env.PROJECTS;
const SAMPLECODE= process.env.samplecode;

router.use(authorizationAPI)
router.post('/compile', async function(req, res, next){
    try {
        const { id, name } = req.user._user[0] 
        const { project_id, code, testCase } = req.body;

        const [project] = await db.query(sql.user.selectProject, [project_id]);
        if(project.length !== 1)
        {
            res.status(400).send({
                result: true,
                data: [],
                message: '컴파일 성공'
            })
            return;
        }

        //Copy source for user file
        var today = moment(); 
        var folderBuild = `${today.toDate().getTime()}`.replace(/\s/g, '');
        const buildFile = path.resolve(PROJECTS, `${name}/${project[0].project_name}/build/${folderBuild}`);
        const userProjectPathSource = path.resolve(PROJECTS, `${name}/${project[0].project_name}`);
        if (!fs.existsSync(buildFile)) { 
            fs.mkdirSync(buildFile)
            fs.copyFileSync(`${userProjectPathSource}/main.py`, `${buildFile}/original.py`, async (err) => {
            if (err) 
                throw err;
            });
        }

        if (fs.existsSync(userProjectPathSource)) 
        { 
            fs.writeFileSync(`${userProjectPathSource}/main.py`, code ,function(err) {
                if(err) return console.error('Source write error' + err);
            })

            fs.copyFileSync(`${userProjectPathSource}/main.py`, `${buildFile}/modified.py`, async (err) => {
                if (err) 
                    throw err;
            });
        }
        await db.query(sql.user.insertHistoryBuild, [project[0].id, id, folderBuild]);


        const codeFileCompile = path.resolve(ROOT, 'max.py')
        fs.writeFileSync(codeFileCompile, code ,function(err) {
            if(err) return console.error('Source write error' + err);
        })


        const testcaseFileCompile = path.resolve(ROOT, 'testcase')
        fs.writeFileSync(testcaseFileCompile, testCase ,function(err) {
            if(err) return console.error('Source write error' + err);
        })
        const pathOutput = path.resolve(ROOT, 'output.txt');
        const python = tarantula.compileTarantula('max.py');
        
        python.on('close', (code) => {
            // console.log(`child process close all stdio with code ${code}`);
            const outputCode = fs.readFileSync(pathOutput, {encoding: 'utf-8', flag: 'r'})
                res.status(200).send({
                result: true,
                data: outputCode,
                message: '컴파일 성공'
            })
        });
        
    } catch (error) {
        console.log(error)
    }
})
router.post('/creatproject',async  function(req, res, next){
    try {
        const { name, language } = req.body;
        const { id, name : userName } = req.user._user[0] 
        const [temp] = await db.query(sql.user.insertProject,[name, id, language])
        const [row] = await db.query(sql.user.selectProject, [temp.insertId])
        
        //user project
        const userProjectPath = path.resolve(PROJECTS, `${userName}`);
        if (!fs.existsSync(userProjectPath)) { 
            fs.mkdirSync(userProjectPath)
        }

        //project source
        const userProjectPathSource = path.resolve(PROJECTS, `${userName}/${name}`);
        if (!fs.existsSync(userProjectPathSource)) { 
            fs.mkdirSync(userProjectPathSource)

            const sampleCode = path.resolve(SAMPLECODE);
            fse.copy(sampleCode, userProjectPathSource);
        }


        //project build
        const userProjectPathSourceBuild = path.resolve(PROJECTS, `${userName}/${name}/build`);
        if (!fs.existsSync(userProjectPathSourceBuild)) { 
            fs.mkdirSync(userProjectPathSourceBuild)
        }
        
        res.status(200).send({
            result: true,
            data: row[0],
            message: '프로젝트 생성 성공'
        })
    } catch (error) {
        console.log(error)
    }
})
router.delete('/delete', async function(req, res, next){
    const { id : userId, name } = req.user._user[0] 
    const { projectId } = req.query;
    const [row] = await db.query(sql.user.selectProjectByAllId, [userId, projectId])
    
    try {
        if(row.length === 1) {
            await db.query(sql.user.deleteProject, [projectId])
            await db.query(sql.user.deleteHistoryProject, [projectId])
            res.status(200).send({
                result: true,
                data: [],
                message: '프로젝트 성공'
            })
        }else{
            res.status(200).send({
                result: false,
                data: [],
                message: '프로젝트 실패'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(200).send({
            result: false,
            data: [],
            message: '프로젝트 실패'
        })
        
    }
})
router.get('/getprojectbyid',async  function(req, res, next){
    try {
        const { id : userId, name } = req.user._user[0] 
        const { project_id } = req.query;
        const [row] = await db.query(sql.user.selectProjectByAllId, [userId, project_id])
        if(row.length === 1){
            const userProjectPathSource = path.resolve(PROJECTS, `${name}/${row[0].project_name}`);
            if (fs.existsSync(userProjectPathSource)) { 
                const sourceFile =  path.resolve(userProjectPathSource, 'main.py');
                const outputCode = fs.readFileSync(sourceFile, {encoding: 'utf-8', flag: 'r'})
                    res.status(200).send({
                    result: true,
                    project: row[0],
                    data: outputCode,
                    message: '컴파일 성공'
                })
                
            }else{
                res.status(400).send({
                    result: true,
                    data: [],
                    message: '프로젝트 생성 성공'
                })
            }
    
        }else{
            res.status(200).send({
                result: true,
                data: row,
                message: '프로젝트 생성 성공'
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/getproject',async  function(req, res, next){
    try {
        const { id } = req.user._user[0] 
        const [rows] = await db.query(sql.user.selectProjectByUserId, [id])
        res.status(200).send({
            result: true,
            data: rows,
            message: '프로젝트 생성 성공'
        })

    } catch (error) {
        console.log(error)
    }
})

//!수정
router.get('/download', async function(req, res){
    try {
            const { projectId } = req.query;
            const { id } = req.user._user[0];

            const [row] = await db.query(sql.user.selectProjectByAllId, [id, projectId])
        
            const { name } = req.user._user[0];
            const { project_name : userProjectPath } = row[0];
            
            const public = `public/${name}`;
            const zipProjectPath = path.resolve(public,`${userProjectPath}`)

            const projectPath = `${PROJECTS}/${name}/${userProjectPath}`;

            path.resolve(public, "")
	
            if (!fs.existsSync(public)) {
                fs.mkdirSync(public);
            }
        
            await fileController.copyFolderRecursiveSync(projectPath, public)

            zipFolder.zipFolder(zipProjectPath, `${zipProjectPath}.zip`, function(err) {
                if(err) {
                    console.log('Something went wrong!', err);
                }
            });
            
           //30s delete
            setTimeout(async () => {
                await fileController.removeFolderNoRec(path.resolve(public, ''));
            }, 30 * 1000); //30s delete

            res.status(200).send({
                result: true,
                data: [
                    {path: `${name}/${userProjectPath}.zip`}
                ],
                message: '프로젝트 다운로드 성공'
            })  

    } catch (error) {
        console.log('프로젝트 다운로드 API',error) 
        res.status(400).send({
            result: true,
            data: [],
            message: '프로젝트 다운로드 권한이 없읍'
        })   
    }

})

router.get('/gethistory',async  function(req, res, next){
    try {
        const { id, name } = req.user._user[0] 
        const { project_id } = req.query;
        const [project] = await db.query(sql.user.selectProject, [project_id])

        let [rows] = await db.query(sql.user.selectHistoryBuildProject, [project_id, id])
        rows.map(row => {
            const { build_path } = row;
            const pathOriginal = path.resolve(PROJECTS, `${name}/${project[0].project_name}/build/${build_path}/original.py`);
            const pathModified = path.resolve(PROJECTS, `${name}/${project[0].project_name}/build/${build_path}/modified.py`);
            const originalCode = fs.readFileSync(pathOriginal, {encoding: 'utf-8', flag: 'r'})
            const modifiedCode = fs.readFileSync(pathModified, {encoding: 'utf-8', flag: 'r'})
            row["original"] = originalCode;
            row["modified"] = modifiedCode;
            return row;
        })
        res.status(200).send({
            result: true,
            data: rows,
            message: '프로젝트 Build History'
        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/modify', async function(req, res, next){
    const { selectLine, project_id } = req.query;
    
    const pathOutput = path.resolve(ROOT, 'output.txt');
    const modifyCode = await tarantula.modifyLine(selectLine, pathOutput);
    // const { name } = req.user._user[0] 

    // const [project] = await db.query(sql.user.selectProject, [project_id]);
    // const [buildProject] = await db.query(sql.user.selectProjectBuild, [project_id]);
    // const buildFile = path.resolve(PROJECTS, `${name}/${project[0].project_name}/build/${buildProject[0].build_path}/modified.py`);

    // if (fs.existsSync(buildFile)) 
    // { 
    //     fs.writeFileSync(buildFile, modifyCode ,function(err) {
    //         if(err) return console.error('Source write error' + err);
    //     })
    // }

    res.status(200).send({
        result: true,
        data: modifyCode,
        message: '컴파일 성공'
    })
})  


router.post('/scalacompile', async function(req, res, next){
    try {
        const { code, project_id } = req.body;
        var codeString = JSON.stringify(code)
        var stringifyCode = codeString
    
        // var indexOfNewLine = getIndicesOf("\n", codeString)
        //Xóa các khoảng trắng thành 1 khoảng
        codeString = codeString.replace(/\\n/g, '');
        codeString = codeString.replace(/\\r/g, '');
    
        var notMulSpace = codeString.replace(/  +/g, ' ');
        
        //Scale 코드를 컴파일해서 결과 출력함 
        const modifyFinalCode = await tarantula.compileScale(codeString);
        var formatCode = (str, result) => {
            str = str.substring(1, str.length - 1)
            var splitStr = str.split("\\n")
            let index
            for(let i = 0; i < splitStr.length; i++){ 
                let str = splitStr[i]
                str = str.replace(/  +/g, ' ');
            
                let tempIndex = index
                index = result.indexOf(str);
                if(Number(index) == -1){
                    let strTo = splitStr[i+1]
                    strTo = strTo.replace(/  +/g, ' ');
                    
                    let strFrom = splitStr[i-1]
                    strFrom = strFrom.replace(/  +/g, ' ');

                    let modifiedCode = ""
                    if(str.includes("!!")){
                        modifiedCode = result.substring((tempIndex + strFrom.length), result.indexOf(strTo)) 
                        temp = modifiedCode.substring(modifiedCode.indexOf("(") + 1, modifiedCode.indexOf(")"))
                        splitStr[i]=splitStr[i].replace("!!",temp)
                        
                    }else{
                        modifiedCode = result.substring((tempIndex + strFrom.length), result.indexOf(strTo))
                        splitStr[i] = splitStr[i].replace("??",modifiedCode)
                    }
                    splitStr[i] = splitStr[i].replace("??",modifiedCode)
                }
            }
            var resultCode = ""
            for(let i =0 ; i < splitStr.length; i++){
                if(i === splitStr.length - 1){
                    resultCode += splitStr[i]
                }else{
                    resultCode += splitStr[i] + "\n"
                }
            }
            return resultCode
        }
        let remoteFirstLastSpace = stringifyCode.substring(1, stringifyCode.length - 1).trim()
        stringifyCode = `"${remoteFirstLastSpace}"`
        // console.log("remote", remoteFirstLastSpace)
        // console.log("befor", stringifyCode.charAt(stringifyCode.length - 1))
        // if(stringifyCode.charAt(stringifyCode.length - 2) !== ` `){
        //     console.log("remove")
        //     stringifyCode = stringifyCode.substr(0, stringifyCode.length - 2)
        //     stringifyCode = `${stringifyCode}"`
        // }
        const codeAfterFormat = formatCode(stringifyCode, modifyFinalCode)
        const { name } = req.user._user[0] 
        const [project] = await db.query(sql.user.selectProject, [project_id]);
        const [buildProject] = await db.query(sql.user.selectProjectBuild, [project_id]);
        const buildFile = path.resolve(PROJECTS, `${name}/${project[0].project_name}/build/${buildProject[0].build_path}/modified.py`);
    
        if (fs.existsSync(buildFile)) 
        { 
            fs.writeFileSync(buildFile, codeAfterFormat ,function(err) {
                if(err) return console.error('Source write error' + err);
            })
            const mainCode = path.resolve(PROJECTS, `${name}/${project[0].project_name}/main.py`);
            fs.writeFileSync(mainCode, codeAfterFormat ,function(err) {
                if(err) return console.error('Source write error' + err);
            })
        }
    
        res.status(200).send({
            result: true,
            data: codeAfterFormat,
            message: '컴파일 성공'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            result: [],
            data: [],
            message: '컴파일 실패함'
        })
    }
})  

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
module.exports = router