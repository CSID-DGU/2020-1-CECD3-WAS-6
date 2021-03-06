package tlqkf

import scala.util.parsing.combinator._
import scala.collection.mutable.Map
import scala.collection.immutable.ListSet
import scala.util.control.Breaks

class Synthesize extends RegexParsers {
  var space = ListSet[String]()
  var inputs = ListSet[String]()
  var isDerive = true

  val op = List("+", "-", "/", "%", "*")
  val glt = List("<", ">", "==", "!=")

  val clause = List("if ( TRUTH ): ASSIGN else: ASSIGN", "while ( TRUTH ): ASSIGN", "ASSIGN")
  val assign = List("VARIABLE = EXPR")
  val expr = List("OPERAND", "OPERAND OP OPERAND")
  val truth = List("OPERAND GLT OPERAND")
  val operand = List("NUMBER", "VARIABLE")
  val node: Map[String, List[String]] = Map("CLAUSE" -> clause, "ASSIGN" -> assign, "EXPR" -> expr,
    "OPERAND" -> operand, "OP" -> op, "GLT" -> glt, "TRUTH" -> truth)

  // Terminal Symbol
  def NUMBER = ("""\d+(\.\d*)?""".r | "NUMBER") ^^  { _.toString }
  def VARIABLE = ("""[a-z]+(\[[a-z0-9]+\])?""".r | "VARIABLE") ^^ {
    case "VARIABLE" => {
      isDerive = true
      inputs.toList
    }
    case others => others.toString
  } // 지금 변수 이름이 소문자 1개밖에 인식을 안하도록 해두었음
  def INPUT = ("""[a-z]+(\[[a-z0-9]+\])?""".r) ^^ { // 사용된 변수들을 저장함
    case examples =>{
      examples match{
        case example:String =>{
          inputs = inputs ++ ListSet(example)
          example
        }
      }
    }
  }
  def OPERAND = ("OPERAND" | VARIABLE | NUMBER) ^^ {
    case x => {
      x match{
        case "OPERAND" => {
          isDerive = true
          derive("OPERAND")
        }
        case _ => x
      }
    }
  }
  def OP= ("""[-|+|*|/|%]""".r | "OP") ^^ {
    case x => {
      x match{
        case "OP" => {
          isDerive = true
          derive("OP")
        }
        case _ => x
      }
    }
  }
  def GLT = ("==" | "<" | ">" | "!=" | "GLT") ^^ {
    case x => {
      x match{
        case "GLT" => {
          isDerive = true
          derive("GLT")
        }
        case _ => x
      }
    }
  }

  // Non-terminal Symbol
  def EXPR = ("EXPR" | OPERAND ~ opt(OP ~ OPERAND)) ^^ {
    case op1 ~ Some(op2) => { // expression space
      var first = List[String]()
      op1 match{
        case x1:String => first :+= x1
        case x1:List[String] => x1.foreach(elt1 => first :+= elt1)
      }
      op2 match {
        case x ~ y => {
          x match {
            case x1: String => first = for {et <- first} yield (et + " " + x1)
            case x1: List[String] => first = for {et1 <- first; et2 <- x1} yield (et1 + " " + et2)
          }
          y match {
            case y1: String => for {et <- first} yield (et + " " + y1)
            case y1: List[String] => for {et1 <- first; et2 <- y1} yield (et1 + " " + et2)
          }
        }
      }
    }
    case op1 ~ None =>{ // operand 1개만 있을 때
      op1 match{
        case x:String => List(x)
        case x:List[String] => x
      }
    }
    case op1=>{
      op1 match{
        case "EXPR"=> {
          isDerive = true
          derive("EXPR")
        }
        case x => x
      }
    }
  }

  def TRUTH: Parser[Any] = ("!!" | "TRUTH"| "true" | "false" | OPERAND ~ GLT ~ OPERAND) ^^ {
    case operand1 ~ opx ~ operand2 =>{
      var first = List[String]()
      operand1 match{
        case x:String => first = List(x)
        case x:List[String] => first = x
      }
      opx match{
        case x:String => first = for{y1 <- first} yield (y1 + " " + x)
        case x:List[String] => first = for{x1 <- x; y1 <- first} yield (y1 + " " + x1)
      }
      operand2 match{
        case x:String => first = for{y1 <- first} yield (y1 + " " + x)
        case x:List[String] => first = for{x1 <- x; y1 <- first} yield (y1 + " " + x1)
      }
      first
    }
    case itself =>{
      itself.toString match{
        case "!!" | "TRUTH" => {
          isDerive = true
          derive("TRUTH")
        }
        case "true" | "false" => List(itself.toString)
      }
    }
  }

  def ASSIGN: Parser[Any] = ("??" | "ASSIGN" | (opt(VARIABLE ~ "=") ~ EXPR)) ^^ {
    case Some(front) ~ _EXP => {
      var first = List[String]()
      front match{
        case x ~ "=" =>{
          x match {
            case x:String => first :+= x
            case x:List[String] => first = x
          }
        }
      }
      _EXP match{
        case _EXP:List[String] =>{
          for{x <- first; y <- _EXP} yield (x + " = " + y)
        }
      }
    }
    case None ~ _EXP => _EXP
    case itself =>{
      println("assign: ")
      itself.toString match{
        case "??" | "ASSIGN" =>{
          inputs = inputs ++ ListSet("z")
          isDerive = true
          derive("ASSIGN")
        }
      }
    }
  }

  def CLAUSE: Parser[Any] = ("if" ~ "(" ~ TRUTH ~ ")" ~ ":" ~ CLAUSE ~ opt("else" ~ ":" ~ CLAUSE) |
    "while" ~ "(" ~ TRUTH ~ ")" ~ ":" ~ CLAUSE | ASSIGN) ^^ { // ASSIGN ; ASSIGN 추가되어야 함
    case "if" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat ~ Some(elseStat) =>{
      var space = List("if (")
      truthStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + x)
      }
      assignStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + "): " + x)
      }
      elseStat match{
        case _ ~ _ ~ elseAssign =>{
          elseAssign match{
            case xs:List[String] => space = for{x <- xs; y <- space} yield (y + " else: " + x)
          }
        }
      }
      space
    }
    case "if" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat ~ None =>{
      var space = List("if (")
      truthStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + x)
      }
      assignStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + "): " + x)
      }
      space
    }
    case "while" ~ "(" ~ truthStat ~ ")" ~ ":" ~ assignStat =>{
      var space = List("while (")
      truthStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + x)
      }
      assignStat match{
        case xs:List[String] => space = for{x <- xs; y <- space} yield (y + "): " + x)
      }
      space
    }
    case assignStat => assignStat
  }

  def FUNCTION: Parser[Any] = ("def" ~ """[a-z]+""".r ~ "(" ~ INPUT ~ opt("," ~ INPUT) ~ ")" ~ ":" ~ CLAUSE ~ "return" ~ OPERAND) ^^ {
    case "def" ~ funcName ~ "(" ~ inputVar1 ~ Some(inputVar2) ~ ")" ~ ":" ~ clause ~ "return" ~ retVal =>{
      var space = List[String]()
      var programHeader = "def " + funcName + "("
      inputVar1 match{
        case inputVar:String => programHeader = programHeader + inputVar
      }
      inputVar2 match{
        case _ ~ inputVar=>{
          inputVar match{
            case inputVar:String => programHeader = programHeader + ", " + inputVar + "): "
          }
        }
      }
      clause match{
        case clause:List[String] => space = for(y <- clause) yield (programHeader + y)
      }
      retVal match{
        case retVal:String => space = for(x <- space) yield (x + " return " + retVal)
      }
      space
    }
  }

  def derive(init: String): List[String] ={
    var candidateProg = List[String]()
    node.get(init).foreach(x => for(a <- x){
      candidateProg :+= a
    })
    candidateProg
  }

  def space_(x:String) = this.space = ListSet(x)
  def _space() = this.space

  def synthesize():String ={
    var okpass = 0
    var notpass = 0
    val verifier = new Verification

    var searched = ListSet[String]()
    val loop = new Breaks
    var i = 0

    while (!space.isEmpty){
      i = i + 1
      val prog = space.last

      isDerive = false
      val derive = this.parseAll(this.FUNCTION, prog).get

      // verification
      verifier.space_(prog)
      if (!isDerive) {
        if (!verifier.verify().equals("NOANSWER")) {
          okpass = okpass + 1
          return prog

        } else {
          notpass = notpass + 1
        }
      }


      searched = searched ++ ListSet[String](prog)

      derive match{
        case candidates:List[String] => {
          space = space - (prog)
          for{x <- candidates} {
            x match{
              case x1:String => {
                if (!searched.exists(_==x1))
                  space = space ++ ListSet[String](x)
              }
            }
          }
        }
      }
    }
    println("result, ", okpass, " ", notpass)
  }
  space
}
