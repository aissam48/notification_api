const jwt = require('jsonwebtoken')
require('dotenv').config()
const mariadb = require('./mariadb').mariadb

module.exports.jwt = {
    jwtSign: (value) => {
        return new Promise((resolve, reject) => {
            jwt.sign(value, process.env.TOKEN_SECRET_KEY, (err, token) => {
                if (err) {
                    reject('Could not generate token')
                } else {
                    resolve({
                        token: token
                    })
                }
            })
        })
    },

    jwtSecure: (req, res, next) => {

        const bearerToken = req.headers['authorization']
        //bearerToken is undefined or empty
        if (bearerToken == undefined) {
            res.json({
                statue: false,
                message: 'token is empty or undefined'
            })
            return
        }

        const token = bearerToken.split(' ')[1]
        // check if token validate or not
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, result) => {
            if (err) {
                res.json({
                    statue: false,
                    message: 'token is not valid'
                })
            } else {
                // Token is valid
                const command = 'SELECT token FROM login_table WHERE token=?'
                mariadb.then((pool) => {
                    pool.query(command, [token]).then((resQuery) => {
                        //cast resQuery to Array
                        const resQueryArray = Array.from(resQuery)
                        switch (resQueryArray[0]) {
                            case undefined: {
                                res.json({
                                    statue: false,
                                    message: ' There is no user associted with this token'
                                })
                                break
                            }
                            default: {
                                switch (resQueryArray[0].token) {
                                    case token: {
                                        next()
                                        break
                                    }
                                }
                            }
                        }
                    })
                })

            }
        })
    },

    jwtProject: (req, res, next) => {
        const bearerToken = req.headers['authorization']
        if (bearerToken == undefined) {
            res.json({
                statue: false,
                message: 'token is undefiend or empty'
            })
            return
        }
        const token = bearerToken.split(' ')[1]

        /*fetch project associated with this token*/
        const command = 'SELECT * FROM projects_table WHERE token=?'
        mariadb.then((pool) => {
            pool.query(command, [token]).then((resQuery) => {
                //cast resQuery to Array
                const resQueryArray = Array.from(resQuery)
                switch (resQueryArray[0]) {
                    case undefined: {
                        res.json({
                            statue: false,
                            message: ' There is no project associted with this token'
                        })
                        break
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
        }).catch((err) => {
            res.json({
                statue: false,
                message: 'could not fetch project'
            })
        })
    }
}
//////////////////////////////////////////////////////////////////////