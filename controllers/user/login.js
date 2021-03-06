const express = require('express')
const router = express.Router()
const { jwt } = require('../../lib/jwt')
const { logInClass } = require('../../models/models')
const dateTime = require('node-datetime')
const mariadb = require('../../lib/mariadb')

/*endpoint: /login, methode: POST */
router.post('/', async (req, res) => {

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
    //connect to mariadb
    const pool = await mariadb.mariadb

    const username = data.username
    const password = data.password
    //create object from logInClass
    const login = new logInClass(username, password)
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

            //command insert any event login
            const commandLoginList = 'INSERT INTO login_list_table(token, username, password, login_time) VALUES(?,?,?,?)'
            /*create createdDate for notification */
            const time = dateTime.create()
            const formatted = time.format('y-m-d H:M:S')
            /* format() funtions return format 22-04-01 14:55 but require 2022-04-01 14:55 */
            const login_time = '20' + formatted
            pool.query(commandLoginList, [result.token, login.username, login.password, login_time])
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    })

})
module.exports = router