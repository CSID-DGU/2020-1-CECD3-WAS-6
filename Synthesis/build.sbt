name := "Synthesizer"

version := "0.1"

scalaVersion := "2.12.8"

libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.5"

Compile / unmanagedJars += {
  baseDirectory.value / "unmanaged" / s"scalaz3_2.13-4.7.1.jar"
  baseDirectory.value / "unmanaged" / s"com.microsoft.z3.jar"
}