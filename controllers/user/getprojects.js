const express = require('express')
const router = express.Router()
const { jwt } = require('../../lib/jwt')
const mariadb = require('../../lib/mariadb').mariadb

/*endpoin: /getprojects, methode: POST */
router.post('/', jwt.jwtSecure, (req, res) => {

    const data = req.body
    const dateFilter = data.dateFilter
    const command = 'SELECT * FROM projects_table WHERE date_filter>?'

    /* validation of dateFilter */
    if (dateFilter == 0 || dateFilter.toString().length == 14) {
        //fetch all projects from local mariadb
        mariadb.then((pool) => {
            pool.query(command, [dateFilter]).then((resQuery) => {
                switch (Array.from(resQuery).length) {
                    case 0: {
                        res.json({
                            statue: true,
                            result: []
                        })
                        break
                    }
                    default: {
                        res.json({
                            statue: true,
                            result: Array.from(resQuery)
                        })
                        break
                    }
                }
            }).catch((err) => {
                res.json({
                    statue: false,
                    result: err
                })
            })
        }).catch((err) => {
            res.json({
                statue: false,
                result: err
            })
        })

    } else {
        res.json({
            statue: false,
            result: 'does not match require format'
        })
    }
})
module.exports = router

