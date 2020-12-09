import React, {Suspense} from 'react';
import { BrowserRouter as  Router, Switch, Route} from 'react-router-dom'


import { Header, Footer } from './components';
import Loading from './components/Loading';


import Auth from './hoc/auth'


const Dashboard = React.lazy(() => import('./fetures/Dashboard'));
const Login = React.lazy(() => import('./fetures/Login'));
const Register = React.lazy(() => import('./fetures/Register'))
const Editor = React.lazy(() => import('./fetures/Editor'))
const Error = React.lazy(() => import('./components/Error'));
const ProjectManage = React.lazy(() => import('./fetures/ProjectManager'))
const ProjectBuildHistory = React.lazy(() => import('./fetures/ProjectBuildHistory'))
const CheckPage = React.lazy(() => import('./fetures/CheckPage'))
const HowWorks = React.lazy(() => import('./fetures/HowWorks'))

function App() {
  return (
  <Suspense fallback={<Loading/>}>  
      <Router>
      <Header/>
        <Switch>
          <Route exact path='/' component={Auth(Dashboard, null)} />
          <Route exact path='/signin' component={Auth(Login, false)} />
          <Route exact path='/signup' component ={Auth(Register, false)} />
          <Route exac path ='/projectmanage'component ={Auth(ProjectManage, null)} />
          <Route exact path='/editor' component={Auth(Editor, null)} />
          <Route exact path='/history' component={Auth(ProjectBuildHistory, null)} />
          <Route exact path='/work' component={Auth(HowWorks, null)} />
          <Route exact path='/checkpage' component={<CheckPage />} />
          <Route path ='*'>
          <Error/>
        </Route>
        </Switch>
      </Router>
      <Footer />
    </Suspense>
  );
}

export default App;
