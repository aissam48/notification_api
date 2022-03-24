const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', verify, (req, res) => {

    const token = req.body.token
    const pool = require('../App').mariadb

    const command = 'SELECT token FROM login_table WHERE token="$token"'.replace('$token', token)
    pool.query(command).then((resQuery) => {

        if (resQuery[0] != {} && resQuery[0].token == token) {
            res.json({
                statue: true
            })
        } else {
            res.json({
                statue: false
            })
        }
    }).catch((err) => {

    })

})

function verify(req, res, next) {

    const token = req.body.token

    if (token != null && token != undefined && token != '') {
        next()
    } else {
        res.json({
            statue: false
        })
    }

}





module.exports = router