# 프로그램 자동 생성을 이용한 디버거 개발
Development of Automated Debugger with Automatic Program Generation

## 2020-1-CECD3-WAS-6
Hello! Everyone, This project is about an Automated Debugger which automatically find lines of erroneous code and correct them satisfying given specification. The debugger made of some techniques. First technique that we use is Fault Localization. This technique find lines that is likely to occur fault in execution. To be specific, in our project, we implements Coverage-based Fault Localization. Also, The Fault Localization calculates suspiciouness of error-prone code with some formulas such as Tarantula, Ochiai, etc. Second, Program Synthesis is one of automated programming and generates code that satisfies given specification. In this project, this technique corrects error code which is specified by Fault Localization. As a result, this system will be served as a web application.

## **How to use?**
#### coming soon...

## **Design**

Fault Localization
- Coverage-based
- Suspiciouness
    - Tarantula, Ochiai, OP2, ...

Program Synthesis
- Enumerative Search
- Heuristic Method
- Code Optimization

### Project Model
![Debug_Model](https://user-images.githubusercontent.com/24788751/85994135-524b0200-ba32-11ea-9b92-98e629a459ec.png)


## **Future Work**
### Alternative Program Space Search Algorithm
- CDCL(Conflict-driven Clause Learning)
- DeepLearning


## **Run**
### Frontend
* Node.js
* React.js 16.4 

1. Clone the repository. 

    ```
    https://github.com/CSID-DGU/2020-1-CECD3-WAS-6.git
    ```
    
1. Move into the project directory. 

    ```
    cd 2020-1-CECD3-WAS-6/Source/web-frontend
    ```
	
1. Install all the required libraries Reactjs

    ```
    npm install 
    ```
1. Create .env file

    ```
    REACT_APP_SERVER_API=http://localhost:3001 
    ```

1. Run the application.

    ```
    npm start
    ```
    
1. Go to `http://localhost:8080`

---
### Backend
* Python 3 

1. Move into the project directory. 

    ```
    2020-1-CECD3-WAS-6/Source/web-server
    ```
	
1. Install all the required libraries, by installing the requirements.txt file.

    ```
    npm install 
    ```

1. Create env file.

    ```
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASS=
    MYSQL_DB=was_ide

    PORT=3001
    TOKEN=wasteamdongguk
    ```
    
1. Run the application.

    ```
    nodemon
    ```
    

## **Member**

- 한용진 (DalnaraCrater) 
- 정세인 (wnddkdpcqkd)
- 오재혁 (OhJaeHyeok)
- 응웬딩흐엉 (huonghope)