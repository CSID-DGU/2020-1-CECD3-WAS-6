module.exports = {
    insertUser : "insert into was_ide.user(email, name, password) values(?,?,?)",
    getUser : "select * from was_ide.user where email = ? and password = ?",
    getUserByEmail: "select * from was_ide.user where email = ?",

    insertProject : "insert into was_ide.project(project_name, user_id, language) values(?,?, ?)",
    selectProject : "select * from was_ide.project where id = ? ",
    selectProjectByUserId : "select * from was_ide.project where user_id = ? ",

    selectProjectByAllId: "select * from was_ide.project where user_id = ? and id = ? ",
    insertHistoryBuild: "insert into was_ide.history_build(project_id, user_id, build_path) values(?,?,?)",
    selectHistoryBuildProject: "select * from was_ide.history_build where project_id = ? and user_id"
}