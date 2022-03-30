const express = require('express')
const router = express.Router()
const verify = require('../../config/validator').verifyusertoken

/*endpoin: /getprojects, methode: POST */
router.post('/', verify, (req, res) => {

    const data = req.body
    const dateFilter = data.dateFilter
    console.log(dateFilter)
    const pool = require('../../config/mariadb').pool
    const command = 'SELECT * FROM projects_table WHERE date_filter>=?'

    /* validation of dateFilter */
    if (Number(dateFilter) == 0 || Number(dateFilter).length == 14) {
        //fetch all projects from local mariadb
        pool.query(command, [dateFilter]).then((resQuery) => {
            res.json({
                statue: true,
                result: resQuery
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
