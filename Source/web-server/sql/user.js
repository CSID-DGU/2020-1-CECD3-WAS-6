module.exports = {
    insertUser : "insert into was_ide.user(email, name, password) values(?,?,?)",
    getUser : "select * from was_ide.user where email = ? and password = ?",
    getUserByEmail: "select * from was_ide.user where email = ?"
}