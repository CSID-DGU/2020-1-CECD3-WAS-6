# 프로그램 합성과 결함 위치 식별을 이용한 자동 디버거 개발
Development of an Automated Debugger with Program Synthesis and Fault Localization

## 2020-1-CECD3-WAS-6
Hello! Everyone, This project is about an Automated Debugger which automatically finds lines of erroneous code in an imperative program and corrects them satisfying given specification. The debugger made of some techniques. The first technique that we use is **Fault Localization**. This technique finds lines that are likely to occur fault in execution. Also, **Program Synthesis** is one of the automated programming methods and generates code that satisfies given specification. This wonderful technique corrects an error statement which is localized by the Fault Localization. As a result, this system will be served as a web application.

\#program synthesis \#fault localization \#code repair \#debugging method
Patent(특허 출원): 10-2020-0176727 (Korea)

## **Design**

### Fault Localization
In this project, we implemented Coverage-based Fault Localization. The Fault Localization calculates suspiciousness of error-prone code with some formulas such as Tarantula, Ochiai, etc.
- Coverage-based
- Suspiciouness
    - Tarantula, Ochiai, OP2, ...

### Program Synthesis
The synthsizer searches candidates which satisfies the given specification over program space. While searching over the program space, the synthesizer converts the candidate to a first-order logic formula and verifies whether it is satisfied by the specification.

- Enumerative Search
- Conflict Driven Clause Learning

### Project Model
![finalmodel](https://user-images.githubusercontent.com/24788751/102711747-5a0fa300-42ff-11eb-97bf-8e5d9fb57590.png)


## **How2Use?**

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
* Node v12.6.1

1. Move into the project directory. 

    ```
    2020-1-CECD3-WAS-6/Source/web-server
    ```
	
1. Install all the required libraries

    ```
    npm install 
    ```

1. Create .env file.

    ```
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASS=
    MYSQL_DB=was_ide

    PORT=3001
    TOKEN=wasteamdongguk
    ```
1. Create database['was_ide'] with sql.sql file
   
1. Run the application.

    ```
    nodemon
    ```
---
### Middle Fuction[Fault Localizer]
* Python 3

1. Tarantula

    ```
    python tarantula.py mid.py testCaseMid2
    ```

## **Member**

- 한용진 (DalnaraCrater) 
- 오재혁 (OhJaeHyeok)
- 응웬딩흐엉 (huonghope)
