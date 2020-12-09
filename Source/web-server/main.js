

// const ROOT = process.env.ROOT;
// var child = require('child_process').exec('scala HelloWorld')
// child.stdout.pipe(process.stdout)
// child.on('exit', function(code) {
//     console.log("hello", code)
//     process.exit()
// })

const { exec } = require('child_process');


const ls = exec(`"C:\\Program Files\\Java\\jdk1.8.0_251\\bin\\java.exe" "-javaagent:C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2019.1.3\\lib\\idea_rt.jar=53358:C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2019.1.3\\bin" -Dfile.encoding=UTF-8 -classpath "C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\charsets.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\deploy.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\access-bridge-64.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\cldrdata.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\dnsns.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\jaccess.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\jfxrt.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\localedata.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\nashorn.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunec.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunjce_provider.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunmscapi.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunpkcs11.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\zipfs.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\javaws.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jce.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jfr.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jfxswt.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jsse.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\management-agent.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\plugin.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\resources.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\rt.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\target\\\\scala-2.11\\\\classes;C:\\\\Users\\\\nguye\\\\AppData\\\\Local\\\\Coursier\\\\cache\\\\v1\\\\https\\\\repo1.maven.org\\\\maven2\\\\org\\\\scala-lang\\\\scala-library\\\\2.11.12\\\\scala-library-2.11.12.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\scala-parser-combinators-2.11.0-M4.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\unmanaged\\\\com.microsoft.z3.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\unmanaged\\\\scalaz3_2.13-4.7.1.jar" -jar untitled.jar "def min(x,y): if (x>y): ?? else: z = y return z"`, function (error, stdout, stderr) {
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    console.log('Child Process STDOUT: ' + stdout);
    console.log('Child Process STDERR: ' + stderr);
});

ls.on('exit', function (code) {
    console.log(code)
    console.log('Child process exited with exit code ' + code);
});
