const express = require('express')
const router = express.Router()
const { jwt } = require('../../lib/jwt')

/*endpoint: /login, methode: POST */
router.post('/', async (req, res) => {

    const pool = require('../../lib/mariadb').pool
    const data = req.body
    const username = data.username
    const password = data.password
    const command = 'SELECT * FROM login_table WHERE username=? AND password=?'
    /*query user with username and password*/
    pool.query(command, [username, password]).then((resSearch) => {

        // in case no user has info match username and password
        if (resSearch[0] == undefined) {
            res.json({
                success: false,
                message: 'Valid email or password '
            })
            return
        }
        // generate token for user
        jwt.jwtSign({
            username: username,
            password: password
        }).then((result) => {
            const commandUpdateToken = 'UPDATE login_table SET token=? WHERE username=?'
            pool.query(commandUpdateToken, [result.token, username]).then((resQuery) => {
                res.json({
                    token: result.token,
                    success: true,
                    user: {
                        username: username
                    },
                })
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                })
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    })
})
module.exports = router