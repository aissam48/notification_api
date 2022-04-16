const express = require('express')
const router = express.Router()
const { jwt } = require('../../lib/jwt')
const mariadb = require('../../lib/mariadb').mariadb


//list to add all dateFilter which sent
var listFilter = []
/*endpoint: /getnotifications, methode: POST */
router.post('/', jwt.jwtSecure, (req, res) => {

    const data = req.body
    const dateFilter = data.dateFilter
    const command = 'SELECT * FROM notifications_table WHERE date_filter>?'
    console.log(dateFilter)

    // prevent process with the same dateFilter
    if (listFilter.includes(dateFilter)) {
        console.log(listFilter.includes(dateFilter))
        return
    }
    listFilter.push(dateFilter)


    /* validation of dateFilter */
    if (dateFilter == 0 || dateFilter.length == 17) {
        //fetch all notifications from local mariadb
        mariadb.then((pool) => {
            pool.query(command, [dateFilter]).then((resQuery) => {
                res.json({
                    statue: true,
                    result: Array.from(resQuery)
                })
                console.log(Array.from(resQuery).length)
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