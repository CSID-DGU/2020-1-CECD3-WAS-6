# 프로그램 자동 생성을 이용한 디버거 개발
## Development of Automated Debugger with Automatic Program Generation
## 2020-1-CECD3-WAS-6
Hello! Everyone, This project is about an Automated Debugger which automatically find lines of erroneous code and correct them satisfying given specification. The debugger made of some techniques. First technique that we use is Fault Localization. This technique find lines that is likely to occur fault in execution. To be specific, in our project, we implements Coverage-based Fault Localization. Also, The Fault Localization calculates suspiciouness of error-prone code with some formulas such as Tarantula, Ochiai, etc. Second, Program Synthesis is one of automated programming and generates code that satisfies given specification. In this project, this technique corrects error code which is specified by Fault Localization. As a result, this system will be served as a web application.

---



## **How to use?**
#### coming soon...
---

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



## **Member**

- 한용진 (DalnaraCrater) 
- 정세인 (wnddkdpcqkd)
- 오재혁 (OhJaeHyeok)
- 응웬딩흐엉 (huonghope)