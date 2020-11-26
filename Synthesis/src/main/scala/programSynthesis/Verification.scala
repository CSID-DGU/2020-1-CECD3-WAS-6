package tlqkf

import scala.util.parsing.combinator._
import com.microsoft.z3._

import scala.collection.immutable.ListSet

class Verification extends RegexParsers {
  val ctx: Context = new Context(new java.util.HashMap[String, String])
  var z3Constraints = Set[String]()
  var i = 0

  var space = ""
  var inputs = List[String]()

  // Terminal Symbol
  def NUMBER = ("""\d+(\.\d*)?""".r ) ^^  { _.toInt }
  def VARIABLE = ("""[a-z]+(\[[a-z|0-9]+\])?""".r | "NUMBER" ) ^^ {
    case "NUMBER"=>{
      i = i + 1
      "NUMBER" + i.toString()}
    case x => x.toString
  }
  def OPERAND = ( VARIABLE | NUMBER) ^^ {
    case x => x
  }
  def OP= ("""[-|+|*|/|%]""".r ) ^^ {
    case x => x
  }
  def GLT = ("==" | "<" | ">" | "!=") ^^ {
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
            case "%" => ctx.mkMod(operand1.asInstanceOf[IntExpr], operand2.asInstanceOf[IntExpr])
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
          case operand:Int => ctx.mkNumeral(operand, ctx.mkIntSort()).asInstanceOf[ArithExpr]
          case operand:String =>ctx.mkIntConst(operand)
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
              case x:String => ctx.mkEq(ctx.mkIntConst(x.toString), rval)
            }
          }
        }
      }
      _expr
    }
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

      ctx.mkAnd(ctx.mkImplies(truthClause, assignClause), ctx.mkImplies(ctx.mkNot(truthClause), elseClause))
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


  def FUNCTION: Parser[BoolExpr] = ("def" ~ """[a-z]+""".r ~ "(" ~ INPUT ~ opt("," ~ INPUT) ~ ")" ~ ":" ~ CLAUSE ~ "return" ~ OPERAND) ^^ {
    case "def" ~ _ ~ "(" ~ _ ~ _ ~ ")" ~ ":" ~ clause ~ "return" ~ _ =>{
      clause
    }
  }

  def space_(x:String) = this.space = x

  def verify():String ={
    val solver: com.microsoft.z3.Solver = ctx.mkSolver()
    var varList = ListSet[String]("x", "y", "z")
    i = 0
    val iospec = List[(Int, Int, Int)]((1, 2, 2), (10, 20, 20), (30, 24, 30), (40, 39, 40), (1, 2, 2), (10, 20, 20),
      (30, 24, 30), (40, 39, 40), (1, 10, 10), (100, -19, 100), (-10, -20, -10), (32, 1, 32), (1, 0, 1), (77, 29, 77))

    //specification
    val specX = ctx.mkIntConst("x")
    val specY = ctx.mkIntConst("y")
    val specZ = ctx.mkIntConst("z")
    val number1 = ctx.mkIntConst("NUMBER1")
    val number2 = ctx.mkIntConst("NUMBER2")

    solver.add(this.parseAll(this.FUNCTION, space).get)

    iospec.foreach(io => {
      solver.push()
      solver.add(ctx.mkEq(specX, ctx.mkInt(io._1)))
      solver.add(ctx.mkEq(specY, ctx.mkInt(io._2)))

      if (solver.check != Status.SATISFIABLE){
        return "NOANSWER"
      }
      val zAns = solver.getModel.eval(specZ, false)
      zAns match{
        case z:IntNum =>{
          if (z.getInt != io._3) {
            println("Z: ", z.getInt)
            return "NOANSWER"
          }
        }
        case _:IntExpr => return "NOANSWER"
      }

      solver.pop()
      println(solver.getModel)
      val res1 = solver.getModel.eval(number1, false)

      val res2 = solver.getModel.eval(number2, false)

      res1 match{
        case res:IntNum => {
          if (!varList.exists(_=="NUMBER1")) {
            varList = varList ++ ListSet("NUMBER1")
            space = space.substring(0, space.indexOf("NUMBER")) + res.getInt.toString + space.substring(space.indexOf("NUMBER")+ 6)
          }
        }
        case _ =>
      }
      res2 match{
        case res:IntNum =>{
          if (!varList.exists(_=="NUMBER2")) {
            varList = varList ++ ListSet("NUMBER2")
            solver.add(ctx.mkEq(number2, ctx.mkInt(res.getInt)))
            space = space.substring(0, space.indexOf("NUMBER")) + res.getInt.toString + space.substring(space.indexOf("NUMBER")+ 6)
          }
        }
        case _ =>
      }
    })

    space
  }
}