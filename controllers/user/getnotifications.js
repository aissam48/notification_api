const express = require('express')
const router = express.Router()
const verify = require('../../config/validator').verifyusertoken

/*endpoint: /getnotifications, methode: POST */
router.post('/', verify, (req, res) => {

    const data = req.body
    const dateFilter = data.dateFilter
    console.log('noti ' + dateFilter)
    const pool = require('../../config/mariadb').pool
    const command = 'SELECT * FROM notifications_table WHERE date_filter>=?'

    /* validation of dateFilter */
    if (dateFilter == 0 || dateFilter.length == 14) {
        //fetch all notifications from local mariadb
        pool.query(command, [dateFilter]).then((resQuery) => {
            res.json({
                statue: true,
                result: Array.from(resQuery)
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