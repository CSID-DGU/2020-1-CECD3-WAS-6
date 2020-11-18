// import React, { Component } from 'react';
// import clsx from 'clsx';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// import axios from 'axios';

// import * as monaco from 'monaco-editor';
// //import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import MonacoEditor from 'react-monaco-editor';
// import './secureCoding.css';
// import check_modal from '../images/check_modal.png';
// import error_modal from '../images/error_modal.png';
// import pdf from '../images/pdf.png';
// import CodeStepper from './CodeStepper';
// import DescAccordion from './Accordion';
// import SecVideo from './SecVideo';

// import Button from '@material-ui/core/Button';

// import Dialog from '@material-ui/core/Dialog';
// import TextField from '@material-ui/core/TextField';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogActions from '@material-ui/core/DialogActions';

// import { withStyles, withTheme } from '@material-ui/core/styles';


// var process = require('../myProcess.json');


// const drawerWidth = 380; // 왼쪽 학습창 너비
// var test = null;
// var modifiedModel;

// /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
// var step2GetLine;//2단계 라인 변환 체크
// var myScodeSecLine; //2단계 라인 고친곳
// /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////

// const useStyles = theme => ({
//     root: {
//         display: 'flex',
//         overflow: 'hidden',
//     },
//     appBar: {
//         transition: theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//     },
//     appBarShift: {
//         width: `calc(100% - ${drawerWidth}px)`,
//         marginLeft: drawerWidth,
//         transition: theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.easeOut,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     },

//     toolbar: {
//         position: 'relative',
//         backgroundColor: '#323232', //'#1b2b34', 
//         BorderBottom: '1px solid gray',
//     },
//     toolbar1: {
//         position: 'relative',
//         backgroundColor: '#323232', //'#1b2b34',
//         boxShadow: '0px 1px 4px 0px black',
//         width: '100%'
//     },
//     menuButton: {
//         marginRight: theme.spacing(2),
//     },
//     hide: {
//         display: 'none',
//     },
//     drawer: {
//         width: drawerWidth,
//         flexShrink: 0,

//     },
//     drawerPaper: {
//         width: drawerWidth,
//         BorderRight: '2px solid red',
//         backgroundColor: '#303030',
//         boxShadow: '0.5px 0px 2px 0px black',
//         overflow: 'hidden'
//     },
//     drawerHeader: {
//         display: 'flex',
//         alignItems: 'center',
//         padding: theme.spacing(0, 1),
//         // necessary for content to be below app bar
//         ...theme.mixins.toolbar,
//         justifyContent: 'flex-end',
//         backgroundColor: '#054A91',
//         // borderBottom: '1px solid black',

//     },
//     content: {
//         flexGrow: 1,
//         transition: theme.transitions.create('margin', {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//         marginLeft: -drawerWidth,
//         // backgroundColor: "red"

//     },
//     contentShift: {
//         transition: theme.transitions.create('margin', {
//             easing: theme.transitions.easing.easeOut,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//         marginLeft: 0,
//     },
// });

// const ColorButton = withStyles((theme) => ({
//     root: {
//         color: theme.palette.getContrastText("#607d8b"),
//         backgroundColor: "#607d8b",
//         '&:hover': {
//             backgroundColor: "#455a64",
//         },
//     },
// }))(Button);

// class Securecoding extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             // <Drawer> 서랍 여닫이 
//             open: true,
//             // Monaco editor 옵션 참고 : https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
//             options: {
//                 fontSize: "16px",
//                 readOnly: true, //true : 코드수정 불가 ,  false : 수정 가능
//                 automaticLayout: true, //true : 부모 div 크기에 맞춰서 자동으로 editor 크기 맞춰줌
//                 glyphMargin: true, //true: 체크 이미지 넣을 공간이 생김
//                 scrollBeyondLastLine: false, // true : 스크롤이 가능하게 
//             },
//             //Monaco diff 옵션 참고 : https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditoroptions.html#renderindicators
//             diffOptions: {
//                 fontSize: "16px",
//                 glyphMargin: true,
//                 renderIndicators: false,  //eidtor 두개 비교해서 달라진 부분 +/- 가리킴
//                 scrollBeyondLastLine: false,
//                 automaticLayout: true,
//             },
//             lineNumber: [],
//             correctLineOpen: false, //정답 모달창
//             wrongLineOpen: false, // 오답 모달창
//             step: 1, //문제 단계
//             width: "", //Monaco editor width 
//             language: "",
//             languageId: "",

//             //보안 약점 정보
//             secId: 1,
//             secName: "",
//             secPdf: "",
//             secVideo: "",
//             secCategory: "",

//             //코드 정보
//             scodeId: "",
//             scodeNum: 0,
//             scodeVulFile: "",
//             scodeVulCode: "",
//             scodeSecFile: "",
//             scodeSecCode: "",
//             scodeLineNum: "",
//             correctLine: [],

//             //문제선택 리스트
//             lists: [],

//             //1단계 정답 체크
//             scodeVulDesc: "",
//             scodeSecDesc: "",
//             tryNumFirst: 0,
//             tryNumSecond: 0,
//             scodeSecLine: "",

//             //페이지 오픈 시 문제 리스트 중 최근에 푼 문제 index
//             problemNumber: 1,

//             //2단계 정답 체크
//             step2Result: 0,
//             isError: 0,
//             // key: '',
//         };
//     };

//     //학습창 Open
//     handleDrawerOpen = () => {
//         document.getElementById("submit").style.left = "87%"; //제출버튼 위치 조절
//         document.getElementById("reset").style.left = "85%"; //초기화버튼 위치 조절
//         if (this.state.step === 1) {
//             this.setState({
//                 open: true,
//                 width: `${document.getElementById('editor').offsetWidth - drawerWidth}` + `px`
//             })
//             //console.log(this.props.test)

//         }
//         else {
//             this.setState({
//                 open: true,
//                 width: `${document.getElementById('editor').offsetWidth + drawerWidth}` + `px`
//             })
//             //console.log(this.props.test)
//             //에디터 크기 DIV 크기에 맞게 변환, 옵션 automaticLayout: true
//             setTimeout(() => test.layout(), 300);
//         }
//     }//handleDrawerOpen

//     //학습창 close
//     handleDrawerClose = () => {
//         document.getElementById("submit").style.left = "90.5%";
//         document.getElementById("reset").style.left = "88.5%";
//         if (this.state.step === 1) {
//             this.setState({
//                 open: false,
//                 width: `${document.getElementById('editor').offsetWidth + drawerWidth}` + `px`
//             })
//         }
//         else {
//             this.setState({
//                 open: false,
//                 width: `${document.getElementById('editor').offsetWidth - drawerWidth}` + `px`
//             })
//             //console.log(this.props.test)
//             setTimeout(() => test.layout(), 300);
//         }
//     }

//     editorDidMount = (editor) => {
//         this.editor = editor;
//         this.editor.onDidChangeModelDecorations(() => {
//             editor.layout(); // 변한 div에 맞게 자동으로 크기 맞춰줌
//         });

//         // editor쪽을 마우스 클릭 했을 때 해당 1.라인 하이라이팅 + 2.해당라인넘버값 저장(1단계 제출 누를 때 서버로 전달)
//         this.editor.onMouseDown(e => {

//             //마우스 클릭한 곳의 라인 가져오기
//             if (this.state.step === 1) {
//                 let line = e.target.position.lineNumber;
//                 //라인중복 삭제 필터
//                 function lineFilter(element, index, array) {
//                     return element !== line;
//                 }
//                 //선택 라인이 중복되면 삭제하고 하이라이팅 제거하고 return
//                 for (var i = 0; i < this.state.lineNumber.length; ++i) {
//                     // 중복 되는 값이 있으면
//                     if (this.state.lineNumber.indexOf(line) !== -1) {
//                         //해당 라인값 필터링해서 제거
//                         this.setState({ lineNumber: this.state.lineNumber.filter(lineFilter) })
//                         //해당 라인 찾아서 classname="" 표시 => 하이라이팅 제거
//                         for (let i = 0; i < Object.keys(editor.getModel().getAllDecorations()).length; i++) {
//                             if (editor.getModel().getAllDecorations()[i].range.startLineNumber === line)
//                                 editor.getModel().getAllDecorations()[i].options = [];
//                         }
//                         //에디터 화면 업데이트를 위해서 빈값 하나 넣어줌 
//                         editor.deltaDecorations(
//                             editor.getModel().getAllDecorations(),
//                             []
//                         );
//                         return true;
//                     }
//                 }//중복 제거 for문 끝

//                 //console.log(line);
//                 //console.log(editor.getModel().getAllDecorations());

//                 //선택 라인이 중복 안되면 추가
//                 this.setState({ lineNumber: this.state.lineNumber.concat(line) });

//                 //let text = editor.getModel().getLineContent(e.target.position.lineNumber); //마우스 클릭한 곳의 내용 가져오기

//                 //선택한 라인 하이라이팅
//                 editor.deltaDecorations(
//                     editor.getModel().getAllDecorations(),
//                     [
//                         {
//                             range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
//                             options: {
//                                 isWholeLine: true,
//                                 inlineClassName: 'myInlineDecoration', //글자색 
//                                 className: "lineDecoration",  //배경 하이라이팅
//                                 glyphMarginClassName: 'myGlyphMarginClass', // 라인번호 앞 표시
//                                 marginClassName: 'marginDecoration', //
//                             }
//                         },
//                     ]
//                 );//decoration 끝  
//             }//if문 끝


//         });//onMouse 끝



//     }//editormount 끝

//     componentWillMount = (editor) => {
//         this.editor = editor;


//         //에디터 테마 설정, 모나코에디터는 한 화면에 있는 두개의 에디터에 각자 다른 테마를 적용시킬 수 없다.
//         import('./Oceanic Next.json')
//             .then(data => {
//                 monaco.editor.defineTheme('OceanicNext', data);
//                 monaco.editor.setTheme('OceanicNext');
//             })

//         //url에서 secId 와 Language 추출
//         const info = document.location.href.split("?");
//         //Language
//         this.setState({ language: info[1].split("=")[1] })
//         //LanguageId
//         this.setState({ languageId: info[2].split("=")[1] })
//         const sendLanId = info[2].split("=")[1];

//         //secId
//         const sec_url = info[0].split("/");
//         const secId = sec_url[sec_url.length - 1];
//         this.setState({ secId: secId })
//         // console.log(info_url.split("=")[1])

//         const token = JSON.parse(localStorage.getItem('token'))
//         //보안 약점 정보    //비디오 확인은 10번으로 
//         const url = `http://${process.IP}:10000/sec/${secId}`;
//         axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => {
//                 //console.log(response.data);
//                 this.setState({
//                     // secId: response.data.secId,
//                     secName: response.data.secName,
//                     secPdf: response.data.secPdf,
//                     secVideo: response.data.secVideo,
//                     secCategory: response.data.secCategory,
//                 })

//             })
//             .catch(error => {
//                 //보통 로그인안하면 뜸
//                 alert('잘못된 접근입니다. 다시 로그인 해주세요')
//                 localStorage.removeItem('user');
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('uid');
//                 window.location.href = '/student';
//             })



//         //문제 선택 리스트
//         const userId = JSON.parse(localStorage.getItem('uid'))
//         let form = new URLSearchParams();
//         form.append('userId', userId);
//         form.append('secId', parseInt(secId));
//         form.append('languageId', sendLanId)

//         const url_problem = `http://${process.IP}:10000/sec/list`;
//         axios({
//             method: 'POST',
//             url: url_problem,
//             headers: {
//                 "Access-Control-Allow-Origin": '*',
//                 "Authorization": `Bearer ${token}`
//             },
//             data: form
//         })
//             .then(response => {
//                 //console.log(response)
//                 this.setState({ lists: response.data })

//                 // 최근에 푼 문제 불러오기
//                 //문제가 하나뿐이라면
//                 if (response.data.length === 1) {
//                     var url_code = `http://${process.IP}:10000/sec/code/${response.data[0].scodeId}`;
//                 }
//                 //문제가 여러개라면
//                 else if (response.data.length > 1) {

//                     //lastTryDate가 가장 최근인 index를 problemNumber에 담는다
//                     var lastTryDate = response.data[0].lastTryDate;
//                     var problemNumber = 1;
//                     for (let i = 1; i < response.data.length; i++) {
//                         if (response.data[i].lastTryDate != null) {
//                             if (lastTryDate >= response.data[i].lastTryDate) {
//                             }
//                             else {
//                                 lastTryDate = response.data[i].lastTryDate;
//                                 problemNumber = i + 1;
//                             }
//                         }
//                     }
//                     this.setState({ problemNumber: problemNumber })
//                     var url_code = `http://${process.IP}:10000/sec/code/${response.data[problemNumber - 1].scodeId}`;
//                 }// 최근에 푼 문제 불러오기 끝

//                 //코드 정보

//                 axios.get(url_code, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 })
//                     .then(response => {
//                         //console.log(response.data);
//                         this.setState({
//                             scodeId: response.data.scodeId,
//                             scodeNum: response.data.scodeNum,
//                             scodeVulFile: response.data.scodeVulFile,
//                             scodeVulCode: response.data.scodeVulCode,
//                             scodeSecFile: response.data.scodeSecFile,
//                             scodeSecCode: response.data.scodeSecCode,
//                             scodeLineNum: response.data.scodeLineNum,
//                             scodeSecLine: response.data.scodeSecLine
//                         })
//                         //단계 정보
//                         let form_step = new FormData();
//                         form_step.append('scodeId', response.data.scodeId);
//                         form_step.append('userId', userId);

//                         const url_step = `http://${process.IP}:10000/sec/step`;
//                         axios({
//                             method: 'POST',
//                             url: url_step,
//                             headers: {
//                                 "Access-Control-Allow-Origin": '*',
//                                 "Authorization": `Bearer ${token}`
//                             },
//                             data: form_step
//                         })
//                             .then(response => {
//                                 //console.log("여기는 스탭");
//                                 //console.log(response.data)

//                                 if (response.data.solvedDateSecond != null) { //2단계까지 다 풀었으면 step=3으로 표시
//                                     //console.log("스텝 3")
//                                     this.setState({ step: 3 });
//                                     this.handleModalNext();
//                                 }
//                                 else if (response.data.solvedDateFirst != null) {
//                                     this.setState({ step: 2 });
//                                     this.handleModalNext();
//                                 }
//                             }
//                             )
//                             .catch(error => {
//                                 //console.log(error);
//                             }) //단계정보 끝

//                     })
//                     // 응답(실패)
//                     .catch(function (error) {
//                         //console.log(error);
//                     })


//             }
//             )
//             .catch(error => {
//                 //console.log(error);
//             })



//     }



//     //라인번호 제출
//     handleSubmitStep1 = () => {


//         var submitLine = "";
//         for (let i = 0; i < this.state.lineNumber.length; i++) {
//             submitLine += this.state.lineNumber[i];
//             if (i != this.state.lineNumber.length - 1)
//                 submitLine += ",";
//         }
//         //console.log(submitLine)

//         const userId = JSON.parse(localStorage.getItem('uid'))
//         let form = new URLSearchParams();
//         form.append('userId', userId);
//         form.append('scodeId', this.state.scodeId);
//         form.append('scodeLineNum', submitLine)

//         const token = JSON.parse(localStorage.getItem('token'))
//         const url_comp = `http://${process.IP}:10000/comp/first`;
//         axios({
//             method: 'POST',
//             url: url_comp,
//             headers: {
//                 "Access-Control-Allow-Origin": '*',
//                 "Authorization": `Bearer ${token}`
//             },
//             data: form
//         })
//             .then(response => {
//                 //console.log(response.data);
//                 this.setState({
//                     scodeVulDesc: response.data.scodeVulDesc,
//                     scodeSecDesc: response.data.scodeSecDesc,
//                     tryNumFirst: response.data.tryNumFirst,
//                     tryNumSecond: response.data.tryNumSecond,
//                     isError: response.data.isError
//                 })
//                 if (response.data.scodeVulDesc != null) {
//                     this.setState({
//                         correctLineOpen: true,
//                         step: 2
//                     })
//                     return true;
//                 }
//                 else {
//                     this.setState({ wrongLineOpen: true })
//                 }

//             })
//             .catch(error => {
//                 //console.log(error)
//             })


//     }

//     handleSubmitStep2 = () => {
//         /*
//         첫번째로 만들어진 모나코 에디터 : monaco.editor.getModels()[0]
//         두번째로 만들어진 모나코 에디터 : monaco.editor.getModels()[1]
//         monaco.editor.getModels()[0].getValue() : monaco.editor.getModels()[0]의 전체 코드 값
//         diffEditor2.getLineChanges() : diffEditor2의 original 와 modified 를 비교해서 달라진 라인 값
//         monaco.editor.getModels()[0].getLineContent(1) : 첫번째 라인의 코드 값
    
    
    
//         모나코 플레이 그라운드 : https://microsoft.github.io/monaco-editor/playground.html
//         */

//         //console.log(monaco.editor.getModels()[1].getValue())
//         //monaco.editor.getModels()[0].dispose() //에디터 삭제 기능
//         var submit = [];
//         var diffString = "";

//         //코드 고친부분만 서버에 전달   //더 효율적인 방법이 있을지는 생각해봐야함
//         var modifiedModel2 = monaco.editor.createModel(this.state.scodeSecCode, this.state.language);
//         var modifiedModel3 = monaco.editor.createModel(monaco.editor.getModels()[1].getValue(), this.state.language);

//         var diffEditor2 = monaco.editor.createDiffEditor(document.getElementById("diffEditor_compare"), this.state.diffOptions);
//         diffEditor2.setModel({
//             original: modifiedModel2,
//             modified: modifiedModel3
//         });


//         setTimeout(() => {

//             // modifiedModel2와 modifiedModel3 사이의 달라진 라인넘버를 읽어서 해당 라인값을  submit 에 담아 놓는다.
//             for (var i = 0; i < diffEditor2.getLineChanges().length; i++) {
//                 for (var j = 0; j <= (diffEditor2.getLineChanges()[i].modifiedEndLineNumber - diffEditor2.getLineChanges()[i].modifiedStartLineNumber); j++) {
//                     diffString += monaco.editor.getModels()[1].getLineContent(diffEditor2.getLineChanges()[i].modifiedStartLineNumber + j) + ",";
//                     // console.log(monaco.editor.getModels()[1].getLineContent(diffEditor2.getLineChanges()[i].modifiedStartLineNumber + j))
//                     // console.log(diffString);
//                 }
//                 submit.push(diffString);
//                 // diffString = "";
//             }

//             //console.log(diffString)

//             const token = JSON.parse(localStorage.getItem('token'))
//             const url_step2 = `http://${process.IP}:10000/comp/second`;
//             const userId = JSON.parse(localStorage.getItem('uid'))
//             let form_step2 = new URLSearchParams();
//             form_step2.append('scodeId', this.state.scodeId);
//             form_step2.append('userId', userId);
//             form_step2.append('compileCode', monaco.editor.getModels()[1].getValue());
//             form_step2.append('scodeSecCode', diffString);

//             axios({
//                 method: 'POST',
//                 url: url_step2,
//                 headers: {
//                     "Access-Control-Allow-Origin": '*',
//                     "Authorization": `Bearer ${token}`
//                 },
//                 data: form_step2
//             })
//                 .then(response => {
//                     //console.log(response.data);
//                     this.setState({
//                         scodeVulDesc: response.data.scodeVulDesc,
//                         scodeSecDesc: response.data.scodeSecDesc,
//                         tryNumFirst: response.data.tryNumFirst,
//                         tryNumSecond: response.data.tryNumSecond,
//                         isError: response.data.isError
//                     })
//                     if (response.data.scodeSecDesc != null) {
//                         this.setState({
//                             correctLineOpen: true,
//                             step2Result: 1,
//                             step: 3
//                         })

//                         //문제 선택 리스트
//                         const info = document.location.href.split("?");
//                         const sendLanId = info[2].split("=")[1];

//                         const userId = JSON.parse(localStorage.getItem('uid'))
//                         let form = new URLSearchParams();
//                         form.append('userId', userId);
//                         form.append('secId', parseInt(this.state.secId));
//                         form.append('languageId', sendLanId)

//                         const url_problem = `http://${process.IP}:10000/sec/list`;
//                         axios({
//                             method: 'POST',
//                             url: url_problem,
//                             headers: {
//                                 "Access-Control-Allow-Origin": '*',
//                                 "Authorization": `Bearer ${token}`
//                             },
//                             data: form
//                         })
//                             .then(response => {
//                                 //console.log(response)
//                                 this.setState({ lists: response.data })
//                             })
//                             .catch(error => { })

//                         return true;
//                     }
//                     else {
//                         this.setState({
//                             wrongLineOpen: true,
//                             step2Result: 1
//                         })
//                     }

//                 })
//                 .catch(error => {//console.log(error)

//                 })


//         }, 100);

//         // 요것은 옆에 에디터와 비교해서 달라진 부분만 전달
//         /*
//         for (var i = 0; i < test.getLineChanges().length; i++) {
//           for (var j = 0; j <= (test.getLineChanges()[i].modifiedEndLineNumber - test.getLineChanges()[i].modifiedStartLineNumber); j++) {
//             diffString += monaco.editor.getModels()[1].getLineContent(test.getLineChanges()[i].modifiedStartLineNumber + j) + " ";
//             console.log(monaco.editor.getModels()[1].getLineContent(test.getLineChanges()[i].modifiedStartLineNumber + j))
//             console.log(diffString);
//           }
//           submit.push(diffString);
//           diffString = "";
//         }
//        */
//         //console.log(submit)
//     }


//     handleModalNext = () => {

//         // step1 에디터 숨기고 diffEditor 가져옴
//         document.getElementById("editor").style.display = "none"
//         document.getElementById("diffEditor").style.display = "block"
//         document.getElementById("diffEditor").style.height = "calc(100vh - 128px)"
//         if (test === null) {
//             this.handleDiff();
//         }
//         else {
//             test.getModifiedEditor().setValue(this.state.scodeSecCode);

//             /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//             {
//                 // step2GetLine = test.getModifiedEditor().getModel()._tokens._len;
//                 // setTimeout(() => {
//                 //   step2GetLine = monaco.editor.getModels()[1]._tokens._len
//                 // }, 1000);
//                 // myScodeSecLine = this.state.scodeSecLine.split(",").sort(function (left, right) {
//                 //   return left - right;
//                 // }).map(Number)
//             }
//             /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//         }

//         this.setState({
//             correctLineOpen: false, //모달창 닫기
//         })

//     }

//     handleModalNext_1 = () => {

//         // step1 에디터 숨기고 diffEditor 가져옴
//         document.getElementById("editor").style.display = "none"
//         document.getElementById("diffEditor").style.display = "block"
//         document.getElementById("diffEditor").style.height = "calc(100vh - 128px)"
//         if (test === null) {
//             this.handleDiff();
//         }
//         else {
//             test.getModifiedEditor().setValue(this.state.scodeSecCode);
//             /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//             {
//                 // step2GetLine = test.getModifiedEditor().getModel()._tokens._len;
//                 // setTimeout(() => {
//                 //   step2GetLine = monaco.editor.getModels()[1]._tokens._len
//                 // }, 1000);
//                 // myScodeSecLine = this.state.scodeSecLine.split(",").sort(function (left, right) {
//                 //   return left - right;
//                 // }).map(Number)
//             }
//             /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//         }

//         this.setState({
//             correctLineOpen: false, //모달창 닫기
//             step: 2,
//         })

//         //하이라이팅 업데이트
//         monaco.editor.getModels()[0].deltaDecorations(
//             monaco.editor.getModels()[0].getAllDecorations(),
//             []
//         );

//     }

//     handleModalRetry = (editor) => {

//         this.setState({ wrongLineOpen: false })

//         // 선택 라인 하이라이팅 초기화
//         for (let i = 0; i < Object.keys(monaco.editor.getModels()[0].getAllDecorations()).length; i++) {
//             monaco.editor.getModels()[0].getAllDecorations()[i].options = [];
//         }
//         // 선택 하이라이팅 초기화 - 하이라이팅 표시 업데이트
//         monaco.editor.getModels()[0].deltaDecorations(
//             monaco.editor.getModels()[0].getAllDecorations(),
//             []
//         );
//         // 선택 라인 번호 초기화
//         this.setState({ lineNumber: [] })
//         //console.log(monaco.editor.getModels()[0])

//     }

//     handleLineHightlight = (line) => {
//         let correctLine = line.split(",").sort(function (left, right) {
//             return left - right;
//         }).map(Number)


//         for (let i = 0; i < correctLine.length; i++) {
//             monaco.editor.getModels()[0].deltaDecorations(
//                 monaco.editor.getModels()[0].getAllDecorations(),
//                 [
//                     {
//                         range: { startLineNumber: correctLine[i], startColumn: 1, endLineNumber: correctLine[i], endColumn: 1 },
//                         options: {
//                             isWholeLine: true,
//                             inlineClassName: 'myDiffInlineDecoration', //글자색 
//                             className: "lineDecoration",  //배경 하이라이팅
//                             glyphMarginClassName: 'myGlyphMarginClass', // 라인번호 앞 표시
//                             marginClassName: 'marginDecoration',
//                         }
//                     },
//                 ]
//             );
//         }   //renderIndicators
//     }

//     handleDiff = () => {

//         let correctLine = this.state.scodeLineNum.split(",").sort(function (left, right) {
//             return left - right;
//         }).map(Number)

//         //var originalModel = monaco.editor.createModel(this.state.code, "java");
//         modifiedModel = monaco.editor.createModel(this.state.scodeSecCode, this.state.language);


//         // 1단계에 생성된 에디터( monaco.editor.getModels()[0] )의 정답라인을 하이라이팅한다.
//         for (let i = 0; i < correctLine.length; i++) {
//             monaco.editor.getModels()[0].deltaDecorations(
//                 monaco.editor.getModels()[0].getAllDecorations(),
//                 [
//                     {
//                         range: { startLineNumber: correctLine[i], startColumn: 1, endLineNumber: correctLine[i], endColumn: 1 },
//                         options: {
//                             isWholeLine: true,
//                             inlineClassName: 'myDiffInlineDecoration', //글자색 
//                             className: "lineDecoration",  //배경 하이라이팅
//                             glyphMarginClassName: 'myGlyphMarginClass', // 라인번호 앞 표시
//                             marginClassName: 'marginDecoration',
//                         }
//                     },
//                 ]
//             );
//         }

//         // 2단계 에디터 생성
//         var diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"), this.state.diffOptions);
//         diffEditor.setModel({
//             original: monaco.editor.getModels()[0], //기존의 1단계 에디터를 original로 설정
//             modified: modifiedModel  //scodeSecCode코드가 있는 에디터를 modified로 설정
//         });
//         test = diffEditor;

//         ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//         ////////////////////////////////////////////////////////////////////////////////////////////////////////////

//         ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//         ////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     }

//     handleExit = () => {
//         // window.location.href = `/student/securelist`;
//         this.props.history.goBack();
//     }

//     handleSelectProblem = (e) => {

//         //console.log(e.currentTarget.value)
//         this.setState({
//             scodeId: e.currentTarget.value.split(',')[0],
//             problemNumber: e.currentTarget.value.split(',')[1],
//             lineNumber: []
//         })

//         const token = JSON.parse(localStorage.getItem('token'))
//         const url_code = `http://${process.IP}:10000/sec/code/${e.currentTarget.value.split(',')[0]}`;
//         axios.get(url_code, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => {
//                 //console.log(response.data);
//                 this.setState({
//                     scodeId: response.data.scodeId,
//                     scodeNum: response.data.scodeNum,
//                     scodeVulFile: response.data.scodeVulFile,
//                     scodeVulCode: response.data.scodeVulCode,
//                     scodeSecFile: response.data.scodeSecFile,
//                     scodeSecCode: response.data.scodeSecCode,
//                     scodeLineNum: response.data.scodeLineNum,
//                     scodeSecLine: response.data.scodeSecLine,
//                 })
//                 var change_scodeSecCode = response.data.scodeSecCode;
//                 var change_scodeVulCode = response.data.scodeVulCode;
//                 var change_scodeLineNum = response.data.scodeLineNum;
//                 var chage_scodeSecLine = response.data.scodeSecLine;

//                 //단계 정보
//                 const userId = JSON.parse(localStorage.getItem('uid'))
//                 let form_step = new FormData();
//                 form_step.append('scodeId', response.data.scodeId);
//                 form_step.append('userId', userId);


//                 const url_step = `http://${process.IP}:10000/sec/step`;
//                 axios({
//                     method: 'POST',
//                     url: url_step,
//                     headers: {
//                         "Access-Control-Allow-Origin": '*',
//                         "Authorization": `Bearer ${token}`
//                     },
//                     data: form_step
//                 })
//                     .then(response => {
//                         // console.log("여기는 스탭");
//                         //console.log(response.data)
//                         if (response.data.solvedDateFirst != null) {  // solvedDateFirst에 데이터가 있다는 건 1단계는 풀었다는 뜻 -> step 2단계
//                             if (this.state.step === 1) {  // 기존의 step 1단계 문제에서 step 2단계 문제로 바꿀때
//                                 if (test === null) {
//                                     this.handleModalNext();
//                                     this.setState({ step: 2 })
//                                     if (response.data.solvedDateSecond != null) {
//                                         this.setState({ step: 3 });
//                                     }
//                                 }
//                                 else {    //step 2단계 문제에서 step 2단계 문제로 바꿀때
//                                     test.getModifiedEditor().setValue(change_scodeSecCode);
//                                     monaco.editor.getModels()[0].setValue(change_scodeVulCode);
//                                     this.handleLineHightlight(change_scodeLineNum);
//                                     document.getElementById("editor").style.display = "none";
//                                     document.getElementById("diffEditor").style.display = "block";
//                                     this.setState({ step: 2 })
//                                     if (response.data.solvedDateSecond != null) {
//                                         this.setState({ step: 3 });
//                                     }
//                                     /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//                                     {
//                                         // step2GetLine = test.getModifiedEditor().getModel()._tokens._len;
//                                         // setTimeout(() => {
//                                         //   step2GetLine = monaco.editor.getModels()[1]._tokens._len
//                                         // }, 1000);
//                                         // myScodeSecLine = chage_scodeSecLine.split(",").sort(function (left, right) {
//                                         //   return left - right;
//                                         // }).map(Number);
//                                     }
//                                     /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//                                 }
//                             }
//                             else {

//                                 test.getModifiedEditor().setValue(change_scodeSecCode);
//                                 monaco.editor.getModels()[0].setValue(change_scodeVulCode);
//                                 this.handleLineHightlight(change_scodeLineNum);
//                                 this.setState({ step: 2 });
//                                 if (response.data.solvedDateSecond != null) {
//                                     this.setState({ step: 3 });
//                                 }
//                                 /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//                                 {
//                                     // step2GetLine = test.getModifiedEditor().getModel()._tokens._len;
//                                     // setTimeout(() => {
//                                     //   step2GetLine = monaco.editor.getModels()[1]._tokens._len
//                                     // }, 1000);
//                                     // myScodeSecLine = chage_scodeSecLine.split(",").sort(function (left, right) {
//                                     //   return left - right;
//                                     // }).map(Number);
//                                 }
//                                 /////////////////////////////////////////// 부분적인 readonly 기능 //////////////////////////////////////////
//                             }


//                         }
//                         else { //step 1단계
//                             if (this.state.step === 1) {
//                                 monaco.editor.getModels()[0].setValue(change_scodeVulCode);
//                                 //this.handleLineHightlight(change_scodeLineNum);
//                                 this.setState({ step: 1 });
//                             }
//                             else {
//                                 monaco.editor.getModels()[0].setValue(change_scodeVulCode);
//                                 //this.handleLineHightlight(change_scodeLineNum);
//                                 document.getElementById("editor").style.display = "block";
//                                 document.getElementById("diffEditor").style.display = "none";
//                                 this.setState({ step: 1, width: `${document.getElementById('editor').offsetWidth}` + `px` });
//                             }
//                         }
//                     }
//                     )
//                     .catch(error => {
//                         //console.log(error);
//                     }) //단계정보 끝

//             })
//             // 응답(실패)
//             .catch(function (error) {
//                 //console.log(error);
//             })

//     }


//     handleModal2Finish = () => {
//         this.setState({
//             correctLineOpen: false,
//         })
//     }

//     handleModal2Retry = () => {
//         //test.getModifiedEditor().setValue(this.state.scodeSecCode);
//         this.setState({ wrongLineOpen: false })
//     }

//     handleResetStep1 = () => {
//         this.setState({ lineNumber: [] })
//         monaco.editor.getModels()[0].setValue(this.state.scodeVulCode);
//     }
//     handleResetStep2 = () => {

//         test.getModifiedEditor().setValue(this.state.scodeSecCode);
//     }

//     render() {
//         const { classes } = this.props;
//         const { options, code } = this.state;

//         return (

//             <div className={classes.root} style={{ backgroundColor: '#252526' }}>

//                 <Dialog open={this.state.correctLineOpen} onClose={this.handleClose}>
//                     <DialogContent className="modalSize" >
//                         <div className="modalCorrect">
//                             <img width="100px" height="100px" src={check_modal} />
//                         </div>
//                         <div className="modalCorrect">정답입니다.<br /></div>
//                         <div className="modalCorrect">
//                             <TextField
//                                 inputProps={{
//                                     readOnly: true,
//                                     disabled: true,
//                                 }}
//                                 variant="outlined"
//                                 margin="normal"
//                                 fullWidth
//                                 multiline
//                                 readOnly
//                                 margin="normal"
//                                 style={{ width: 450, wordBreak: "breakAll" }} //줄바꿈 속성
//                                 rows={5}
//                                 value={this.state.scodeVulDesc}
//                             ></TextField>
//                         </div>

//                     </DialogContent>
//                     <div className="modalNext">
//                         시도 횟수 : {this.state.step2Result === 0 ? this.state.tryNumFirst : this.state.tryNumSecond}번
//                     </div>
//                     <div className="modalNext">
//                         <DialogActions>
//                             {this.state.step2Result === 0 ? <Button variant="contained" color="primary" onClick={this.handleModalNext_1}>NEXT</Button> : <Button variant="contained" color="primary" onClick={this.handleModal2Finish}>닫기</Button>}
//                         </DialogActions>
//                     </div>
//                 </Dialog>

//                 {/* step 실패 */}
//                 <Dialog open={this.state.wrongLineOpen} onClose={this.handleClose}>
//                     <DialogContent className="modalSize" >
//                         <div></div>
//                         <div className="modalCorrect">
//                             <img width="100px" height="100px" src={error_modal} />
//                         </div>
//                         {this.state.isError === 0 ? <div className="modalCorrect">오답<br /></div> : <div className="modalCorrect">컴파일 에러<br /></div>}
//                         <div className="modalNext">
//                             시도 횟수 : {this.state.step2Result === 0 ? this.state.tryNumFirst : this.state.tryNumSecond}번
//                     </div>
//                         <div className="modalNext">
//                             <DialogActions>
//                                 {this.state.step2Result === 0 ? <Button variant="contained" color="primary" onClick={this.handleModalRetry}>Retry</Button> :
//                                     <Button variant="contained" color="primary" onClick={this.handleModal2Retry}>Retry</Button>}
//                             </DialogActions>
//                         </div>
//                     </DialogContent>
//                 </Dialog>


//                 <CssBaseline />
//                 <AppBar

//                     position="fixed"
//                     className={clsx(classes.appBar, {
//                         [classes.appBarShift]: this.state.open,
//                     })}
//                 >
//                     <Toolbar className={classes.toolbar} id="test2">
//                         <IconButton

//                             color="inherit"
//                             aria-label="open drawer"
//                             onClick={this.handleDrawerOpen}
//                             edge="start"
//                             className={clsx(classes.menuButton, this.state.open && classes.hide)}
//                         >
//                             <MenuIcon />
//                         </IconButton>
//                         <div style={{ color: "white", fontSize: "20px" }}>진단대상코드</div>
//                         {this.state.step === 1 ? null : <div className="step2Title" style={{ color: "white", fontSize: "20px" }}>수정대상코드</div>}
//                         <ColorButton id="exit" variant="contained" color="primary" className="exit" onClick={this.handleExit} >나가기</ColorButton>
//                     </Toolbar>
//                 </AppBar>
//                 {/*서랍식으로 학습창 구현 */}
//                 <Drawer
//                     className={classes.drawer}
//                     variant="persistent"
//                     anchor="left"
//                     open={this.state.open}
//                     classes={{
//                         paper: classes.drawerPaper,
//                     }}

//                 >
//                     <div className={classes.drawerHeader}>
//                         <div className="secureTitle"  > {this.state.secName} - {this.state.language}{/*추후 수정*/} </div><div>
//                             <IconButton color="white" aria-label="open drawer" onClick={this.handleDrawerClose}>
//                                 {classes.direction === 'ltr' ? <ChevronRightIcon style={{ fontSize: '40px', color: 'white' }} /> : <ChevronLeftIcon style={{ fontSize: '40px', color: 'white' }} />}
//                             </IconButton></div>
//                     </div>

//                     <div style={{ height: '100%', width: '100%', backgroundColor: '#DBE4EE' }}>
//                         <div className="selectDiv">
//                         </div>
//                         <DescAccordion
//                             secId={this.state.secId}
//                             handleSelectProblem={this.handleSelectProblem}
//                             lists={this.state.lists}
//                             problemNumber={this.state.problemNumber} />
//                         <div className="stepDiv" >단계</div>

//                         <div className="stepDiv2" ><CodeStepper step={this.state.step} /></div>
//                         <div className="pdf" >보안 약점 학습</div>
//                         <div className="pdf1" ><br /> <img width="20px" height="20px" src={pdf} /> <a style={{ color: "black", fontSize: "15px" }} href={this.state.secPdf} target="_blank"> 학습하기</a></div>

//                         <div className="video" >영상 학습 </div>
//                         <div className="video"><SecVideo secVideo={this.state.secVideo} /></div>
//                     </div>
//                 </Drawer>

//                 <main
//                     className={clsx(classes.content, {
//                         [classes.contentShift]: this.state.open,
//                     })}
//                 >



//                     <div style={{ width: `getel` }}>
//                         <div id="editor" className={"eidtorSize"} style={{ display: "block" }}>

//                             <MonacoEditor
//                                 language={this.state.language}
//                                 theme="Monokai"
//                                 options={options}
//                                 value={this.state.scodeVulCode + " "}
//                                 editorDidMount={this.editorDidMount}
//                                 width={this.state.width}
//                             />
//                         </div>

//                         <div id="diffEditor" className="eidtorSize" style={{ height: "0px", display: "block" }}>
//                             <div id="container" style={{ height: "100%" }}></div>
//                         </div>
//                         <div id="diffEditor_compare" style={{ height: "0px" }} />
//                         <div id="diffEditor_compare1" style={{ height: "0px" }} />
//                     </div>
//                     <Toolbar id="test" className={classes.toolbar1}>
//                         {this.state.step == 1 ? <ColorButton id="reset" color="primary" variant="contained" className="reset" onClick={this.handleResetStep1} >초기화</ColorButton> :
//                             <ColorButton id="reset" variant="contained" className="reset" onClick={this.handleResetStep2} >초기화</ColorButton>}
//                         {this.state.step == 1 ? <ColorButton id="submit" color="primary" variant="contained" className="submit" onClick={this.handleSubmitStep1} >제출</ColorButton> :
//                             <ColorButton id="submit" variant="contained" className="submit" onClick={this.handleSubmitStep2} >제출</ColorButton>}
//                     </Toolbar>
//                 </main>

//             </div>
//         );

//     }

// }
// export default withStyles(useStyles)(Securecoding);