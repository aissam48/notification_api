const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', verify, (req, res) => {

    const data = req.body
    const dateFilter = data.dateFilter
    const pool = require('../App').mariadb


    const command = 'SELECT * FROM projects_table WHERE dateFilter>="$dateFilter"'.replace('$dateFilter', dateFilter)

    pool.query(command).then((resQuery) => {

        res.json({
            statue: true,
            result: resQuery
        })

    }).catch((err) => {
        res.json({
            statue: false,
            message: err
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
            console.log(token)

            if (resQuery[0] == undefined) {

                res.json({
                    statue: false,
                    message: 1
                })
                return
            }

            if (resQuery[0].token == token) {

                next()
            } else {
                res.json({
                    statue: false,
                    message: 2
                })
            }
        })

    } else {

        res.json({
            statue: false,
            message: 3
        })
    }

}





module.exports = router

