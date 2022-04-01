/* midllewar to verify token of user if is valid or not */
function verifyusertoken(req, res, next) {
    const pool = require('./mariadb').pool
    const bearerToken = req.headers['authorization']

    /* Check is this token valid or not */
    if (bearerToken != undefined) {

        const token = bearerToken.replace('Bearer ', '')
        //fetch user who associated with this token
        const command = 'SELECT token FROM login_table WHERE token=?'
        pool.query(command, [token]).then((resQuery) => {

            //cast resQuery to Array
            const resQueryArray = Array.from(resQuery)
            switch (resQueryArray[0]) {
                case undefined: {
                    res.json({
                        statue: false,
                        message: ' There is no user associted with this token'
                    })
                }
                default: {
                    switch (resQueryArray[0].token) {
                        case token: {
                            next()
                        }
                    }
                }
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

/* midllewar verify token of project if is valid or not */
function verifyprojectoken(req, res, next) {

    const bearerToken = req.headers['authorization']
    const pool = require('./mariadb').pool

    if (bearerToken != undefined) {
        const token = bearerToken.replace('Bearer ', '')

        /*fetch project associated with this token*/
        const command = 'SELECT * FROM projects_table WHERE token=?'
        pool.query(command, [token]).then((resQuery) => {
            //cast resQuery to Array
            const resQueryArray = Array.from(resQuery)
            switch (resQueryArray[0]) {
                case undefined: {
                    res.json({
                        statue: false,
                        message: ' There is no user associted with this token'
                    })
                }
                default: {
                    switch (resQueryArray[0].token) {
                        case token: {
                            next()
                        }
                    }
                }
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