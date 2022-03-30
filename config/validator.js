/* methode verify token of user is valid or not */
function verifyusertoken(req, res, next) {

    const pool = require('./mariadb').pool
    const bearer = req.headers['authorization']
    const token = bearer.replace('Bearer ', '')

    /* Check is this token valid or not */
    if (token != undefined) {
        const command = 'SELECT token FROM login_table WHERE token=?'
        pool.query(command, [token]).then((resQuery) => {

            if (resQuery[0] == undefined) {
                res.json({
                    statue: false,
                    message: ' There is no user associted with this token'
                })
                return
            }

            if (resQuery[0].token == token) {
                next()
            } else {
                res.json({
                    statue: false,
                    message: ' There is no user associted with this token'
                })
            }
        })
    } else {
        res.json({
            statue: false,
            message: 'token is empty or undefined'
        })
    }
}
exports.verifyusertoken = verifyusertoken
///////////////////////////////////////////////////////////////////////////////////////////////

/* methode verify token of user is valid or not */
function verifyprojectoken(req, res, next) {

    const bearer = req.headers['authorization']
    const token = bearer.replace('Bearer ', '')
    console.log(token)
    const pool = require('./mariadb').pool
    if (token != undefined && token != null) {
        /*fetch project associated with this token*/
        const command = 'SELECT * FROM projects_table WHERE token=?'
        pool.query(command, [token]).then((resQuery) => {
            if (resQuery[0] == undefined) {
                res.json({
                    statue: false,
                    message: 'there is no project has created with this token'
                })
                return
            }

            if (resQuery[0].token == token) {
                next()
            } else {
                res.json({
                    statue: false,
                    message: 'there is no project associted with this token'
                })
            }
        })
    } else {
        res.json({
            statue: false,
            message: 'token is undefiend or empty'
        })
    }
}
exports.verifyprojectoken = verifyprojectoken