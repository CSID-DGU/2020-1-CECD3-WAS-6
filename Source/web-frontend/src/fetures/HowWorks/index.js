import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

function HowWorks(props) {
  return (
    <div className="howworks">
      <h3 id="프로그램-자동-생성을-이용한-디버거-개발">프로그램 자동 생성을 이용한 디버거 개발</h3>
      <p>Development of Automated Debugger with Automatic Program Generation</p>
      <h4 id="cecd3-was-6">2020-1-CECD3-WAS-6</h4>
      <p>#program synthesis #fault localization #code repair #debugging method</p>
      <h3 id="design"><strong>Design</strong></h3>
      <p>Fault Localization - Coverage-based - Suspiciouness - Tarantula, Ochiai, OP2, ...</p>
      <p id="project-model">Project Model</p>
      <div class="figure">
        <img  style={{margin: '0 auto', width: '500px', height: '200px'}}src="https://user-images.githubusercontent.com/24788751/85994135-524b0200-ba32-11ea-9b92-98e629a459ec.png" alt="Debug_Model" />
      </div>
      <h3 id="how2use"><strong>How to Work</strong></h3>
      <div className="work_desc">
        <div className="fontend">
          <h4 id="frontend">Frontend</h4>
          <ul>
            <li>Node.js</li>
            <li>React.js 16.4</li>
          </ul>
          <ol style={{listStyleType: "decimal"}}>
            <li><p>Clone the repository.</p>
              <pre><code>https://github.com/CSID-DGU/2020-1-CECD3-WAS-6.git</code></pre></li>
            <li><p>Install all the required libraries Reactjs</p>
              <pre><code>npm install </code></pre></li>
            <li><p>Create .env file</p>
              <pre><code>REACT_APP_SERVER_API=http://localhost:3001 </code></pre></li>
            <li><p>Run the application.</p>
              <pre><code>npm start</code></pre></li>
            <li><p>Go to <code>http://localhost:8080</code></p></li>
          </ol>
        </div>
        <div className="backend">
          <h4 id="middle-fuctionfault-localizer">Middle Fuction[Fault Localizer]</h4>
          <ul>
            <li>Python 3</li>
          </ul>
          <ol style={{listStyleType: "decimal"}}>
            <li><p>Tarantula</p>
              <pre><code>python tarantula.py mid.py testCaseMid2</code></pre>
            </li>
            <li><p>Scala</p>
              <pre><code>scala Scala.scala mid.py {`"def max(x, y): if (y < x): z = x else: z = y return z"`}</code></pre>
            </li>
          </ol>
          </div>
      </div>  
    </div>
  )
}

export default HowWorks

