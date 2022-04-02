const express = require('express')
const router = express.Router()
const mariadb = require('../../lib/mariadb').mariadb

/*endpoint: /logout, methode: POST */
router.post('/', async (req, res) => {

    const bearerToken = req.headers['authorization']
    const command = 'UPDATE login_table SET token=? WHERE token=?'
    if (bearerToken == undefined) {
        res.json({
            success: false,
            message: 'token is undefined or empty'
        })
        return
    }

    const token = bearerToken.split(' ')[1]
    switch (token) {
        case undefined: {
            res.json({
                success: false,
                message: 'token does not deleted'
            })
            break
        }
        default: {
            /*set empty value for token for logout */
            mariadb.then((pool) => {
                pool.query(command, ['', token.replace('bearer ', '')]).then((resQuery) => {
                    /* handle if value of token has changed to empty value */
                    switch (resQuery.affectedRows) {
                        case 0: {
                            res.json({
                                success: false,
                                message: 'token does not deleted'
                            })
                            break
                        }
                        case 1: {
                            res.json({
                                success: true,
                                message: 'token has deleted'
                            })
                            break
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        message: 'token does not deleted'
                    })
                })
            }).catch((err) => {
                console.log(err)
                res.json({
                    success: false,
                    message: 'token does not deleted'
                })
            })

        }
    }
})
module.exports = router