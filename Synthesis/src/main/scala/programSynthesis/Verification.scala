package programSynthesis



class Verification extends RegexParsers {
  val ctx: Context = new Context(new java.util.HashMap[String, String])
  val solver: com.microsoft.z3.Solver = ctx.mkSolver()
  var z3Constraints = Set[String]()

  var space = ""
  var inputs = List[String]()

  // Terminal Symbol
  def NUMBER = ("""\d+(\.\d*)?""".r ) ^^  { _.toInt }
  def VARIABLE = ("""[a-z]+(\[[a-z|0-9]+\])?""".r ) ^^ { _.toString }
  def OPERAND = ( VARIABLE | NUMBER) ^^ {
    case x => x
  }
  def OP= ("""[-|+|*|/|%]""".r ) ^^ {
    case x => x
  }
  def GLT = ("==" | "<" | ">" ) ^^ {
    case x => x
  }

  // Non-terminal Symbol
  def EXPR = (OPERAND ~ opt(OP ~ OPERAND)) ^^ {
    case op1 ~ Some(op2) => { // expression space
      val operand1 = {
        op1 match{
          case x1:String => ctx.mkIntConst(x1)
          case x1:Int => ctx.mkNumeral(x1, ctx.mkIntSort()).asInstanceOf[ArithExpr]
        }
      }
      op2 match {
        case x ~ y => {
          val operand2 = {
            y match {
              case y1: String => ctx.mkIntConst(y1)
              case y1: Int => ctx.mkInt(y1).asInstanceOf[ArithExpr]
            }
          }
          x match {
            case "+" => ctx.mkAdd(operand1, operand2)
            case "-" => ctx.mkSub(operand1, operand2)
            case "*" => ctx.mkMul(operand1, operand2)
            case "/" => ctx.mkDiv(operand1, operand2)
//            case "%" => ctx.mkMod(operand1, operand2)
          }
        }
      }
    }
    case op1 ~ None =>{ // operand 1개만 있을 때
      op1 match{
        case x:String => ctx.mkIntConst(x)
        case x:Int => ctx.mkInt(x).asInstanceOf[ArithExpr]
      }
    }
  }

  def TRUTH = ("true" | "false" | OPERAND ~ GLT ~ OPERAND) ^^ {
    case operand1 ~ opx ~ operand2 =>{
      val a:ArithExpr = {
        operand1 match{
          case operand1:Int => ctx.mkNumeral(operand1, ctx.mkIntSort()).asInstanceOf[ArithExpr]
          case operand:String => ctx.mkIntConst(operand)
        }
      }
      val b:ArithExpr = {
        operand2 match{
          case operand:Int => {ctx.mkNumeral(operand, ctx.mkIntSort()).asInstanceOf[ArithExpr]}
          case operand:String =>{ctx.mkIntConst(operand)}
        }
      }
      opx match{
        case ">" => ctx.mkGt(a, b)
        case "<" => ctx.mkLt(a, b)
        case "==" => ctx.mkEq(a, b)
        case "!=" => ctx.mkNot(ctx.mkEq(a,b))
      }
    }
    case itself =>{
      itself.toString match{
        case "true" => ctx.mkTrue
        case "false" => ctx.mkFalse
      }
    }
  }
  def INPUT = ("""[a-z]+(\[[a-z0-9]+\])?""".r) ^^ { // 사용된 변수들을 저장함
    case examples =>{
      examples match{
        case example:String =>{
          inputs :+= example
          example
        }
      }
    }
  }

  def ASSIGN = (opt(VARIABLE ~ "=") ~ EXPR) ^^ {
    case Some(front) ~ _EXP => {
      val rval = {
        _EXP match{
          case _EXP:ArithExpr => _EXP
        }
      }
      val _expr:BoolExpr= {
        front match{
          case x ~ "=" =>{
            x match {
              case x:String => ctx.mkEq(ctx.mkIntConst(x), rval)
            }
          }
        }
      }
      _expr
    }
//    case None ~ _EXP => {// assignment가 아니면 논리식이 될 수 없음.
//      _EXP match{
//        case _expr:ArithExpr => _expr
//      }
//    }
  }

  def CLAUSE = ("if" ~ "(" ~ TRUTH ~ ")" ~ ":" ~ ASSIGN ~ opt("else" ~ ":" ~ ASSIGN) |
    "while" ~ "(" ~ TRUTH ~ ")" ~ ":" ~ ASSIGN) ^^ { // ASSIGN ; ASSIGN 추가되어야 함
    case "if" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat ~ Some(elseStat) =>{
      val truthClause = {
        truthStat match{
          case truthStat:BoolExpr => truthStat
        }
      }
      val assignClause = {
        assignStat match{
          case assignStat:BoolExpr => assignStat
        }
      }

      val elseClause = {
        elseStat match { // truthStat의 not과 함께 추가한다.
          case _ ~ _ ~ elseAssign => {
            elseAssign match {
              case elseAssign:BoolExpr => elseAssign
            }
          }
        }
      }
      ctx.mkOr(ctx.mkAnd(truthClause, assignClause), ctx.mkAnd(ctx.mkNot(truthClause), elseClause))
    }
    case "if" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat ~ None =>{
      val truthClause = {
        truthStat match{
          case truthStat:BoolExpr => truthStat
        }
      }
      val assignClause = {
        assignStat match{
          case assignStat:BoolExpr => assignStat
        }
      }
      ctx.mkAnd(truthClause, assignClause)
    }
    case "while" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat =>{ // loop unrolling과 같은 기법이 필요할 것 같음.
      val truthClause = {
        truthStat match{
          case truthStat:BoolExpr => truthStat
        }
      }
      val assignClause = {
        assignStat match{
          case assignStat:BoolExpr => assignStat
        }
      }
      ctx.mkAnd(truthClause, assignClause)
    }
  }


//  def FUNCTION: Parser[Any] = ("def" ~ """[a-z]+""".r ~ "(" ~ INPUT ~ opt("," ~ INPUT) ~ ")" ~ ":" ~ CLAUSE) ^^ {
//    case "def" ~ funcName ~ "(" ~ inputVar1 ~ Some(inputVar2) ~ ")" ~ ":" ~ clause =>{
//      var space = List[String]()
//      var programHeader = "def " + funcName + "("
//      inputVar1 match{
//        case inputVar:String => programHeader = programHeader + inputVar
//      }
//      inputVar2 match{
//        case _ ~ inputVar=>{
//          inputVar match{
//            case inputVar:String => programHeader = programHeader + ", " + inputVar + "): "
//          }
//        }
//      }
//      clause match{
//        case clause:List[String] => space = for(y <- clause) yield (programHeader + y)
//      }
//      space
//    }
//  }

  def space_(x:String) = this.space = x

  def verify() ={
    solver.add(ctx.mkEq(ctx.mkIntConst("a"), ctx.mkInt(10)))
    solver.add(this.parseAll(this.CLAUSE, space).get)
//    solver.add(this.parseAll())
//    println(this.parseAll(this.FUNCTION, space))// 여기에서 논리식이 생성됨.

    if (solver.check == Status.SATISFIABLE) {
      println("YES")
      solver.getModel
    }
    else
      "NO"
  }
}