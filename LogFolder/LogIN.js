const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()


router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', async (req, res) => {

    const pool = require('../App').mariadb
    const data = req.body
    const username = data.username
    const password = data.password
    const command = 'SELECT * FROM login_table WHERE username= "$username" AND password= "$password"'
        .replace('$username', username)
        .replace('$password', password)

    pool.query(command).then((resSearch) => {

        const usernameCheck = resSearch[0].username
        const passwordCheck = resSearch[0].password

        if (username == usernameCheck && password == passwordCheck) {

            jwt.sign({
                'username': resSearch[0].username,
                'password': resSearch[0].password
            }, 'secretKey', (err, resToken) => {

                const commandUpdateToken = 'UPDATE login_table SET token="$resToken" WHERE username="$username"'
                    .replace('$resToken', resToken)
                    .replace('$username', username)
                pool.query(commandUpdateToken)

                res.status(200).json({

                    token: resToken,
                    success: true,
                    user: {
                        username: username,
                        id: 1
                    },

                })

            })


        } else {

            res.status(200).json({
                message: 'Valid email or password ',
                success: false
            })

        }


    }).catch((err) => {

        res.status(400).json({

            message: 'error on server',
            success: false,
            error: err
        })
    })

})





module.exports = router