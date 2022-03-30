const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

/*endpoint: /login, methode: POST */
router.post('/', async (req, res) => {

    const pool = require('../../config/mariadb').pool
    const data = req.body
    const username = data.username
    const password = data.password
    const command = 'SELECT * FROM login_table WHERE username=? AND password=?'
    /*query user with username and password*/
    pool.query(command, [username, password]).then((resSearch) => {

        if (resSearch[0] == undefined) {
            res.json({
                success: false,
                message: 'Valid email or password '
            })
            return
        }
        /* generate Token for user for first login  */
        jwt.sign({
            'username': resSearch[0].username,
            'password': resSearch[0].password
        }, 'secretKey', (err, resToken) => {

            const token = resToken.split('.')[2]
            /*set value for token */
            const commandUpdateToken = 'UPDATE login_table SET token=? WHERE username=?'
            pool.query(commandUpdateToken, [token, username]).then((resQuery) => {
                res.json({
                    token: token,
                    success: true,
                    user: {
                        username: username
                    },
                })
            }).catch((err) => {
                res.json({
                    success: false,
                })
            })
        })
    }).catch((err) => {
        res.json({
            message: err,
            success: false
        })
    })
})

module.exports = router