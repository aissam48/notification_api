const express = require('express')
const router = express.Router()
const { jwt } = require('../../lib/jwt')
const { logInClass } = require('../../models/models')

/*endpoint: /login, methode: POST */
router.post('/', async (req, res) => {

    const pool = require('../../lib/mariadb').pool
    const data = req.body

    switch (true) {
        case (data.username == undefined): {
            res.json({
                success: false,
                message: 'username is empty or undefined'
            })
            return
        }
        case (data.password == undefined): {
            res.json({
                success: false,
                message: 'password is empty or undefined'
            })
            return
        }
    }

    const username = data.username
    const password = data.password
    const login = new logIn(username, password)
    const command = 'SELECT * FROM login_table WHERE username=? AND password=?'
    /*query user with username and password*/
    pool.query(command, [login.username, login.password]).then((resSearch) => {

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
            username: login.username,
            password: login.password
        }).then((result) => {
            const commandUpdateToken = 'UPDATE login_table SET token=? WHERE username=?'
            pool.query(commandUpdateToken, [result.token, login.username]).then((resQuery) => {
                res.json({
                    token: result.token,
                    success: true,
                    user: {
                        username: login.username,
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