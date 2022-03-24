const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', verify, (req, res) => {

    const data = req.body
    const time = data.time

    const command = 'SELECT * FROM projects_table WHERE time>="$time"'.replace('$time', time)

    pool.query(command).then((resQuery) => {

        res.json({
            statue: true,
            result: resQuery
        })

    }).catch((err) => {
        res.json({
            statue: false
        })
    })

})

function verify(req, res, next) {

    const pool = require('../App').mariadb
    const token = req.headers['token']

    if (token != undefined) {
        const command = 'SELECT token FROM login_table WHERE token="$token"'.replace('$token', token)
        pool.query(command).then((resQuery) => {

            console.log(resQuery)

            if (resQuery[0].token == token) {

                next()
            } else {
                res.json({
                    statue: false
                })
            }
        })

    } else {

        res.json({
            statue: false
        })
    }

}





module.exports = router

