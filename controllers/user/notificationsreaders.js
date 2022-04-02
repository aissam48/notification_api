const express = require('express')
const router = express.Router()
const uuid = require('uuid')
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const mariadb = require('../../lib/mariadb').mariadb

/*endpoint: /notificationsreaders, methode: POST */
router.post('/', (req, res) => {

    const data = req.body
    const id = uuid.v1()

    /* body of notifications readers */
    const itemNotificationsReader = {
        id: id,
        notification_id: data.notification_id,
        token: data.token,
        username: data.username,
        read_date: data.readDate
    }
    const command = 'INSERT INTO notifications_readers_table(id, notification_id, token, username, read_date) VALUES(?, ?, ?, ?, ?)'
    mariadb.then((pool) => {
        /*insert notifications readers data to database*/
        pool.query(command, [itemNotificationsReader.id, itemNotificationsReader.notification_id, itemNotificationsReader.token, itemNotificationsReader.username, itemNotificationsReader.read_date]).then((resQuery) => {
            res.json({
                statue: true,
                message: 'item has inserted into database'
            })
        }).catch((err) => {
            res.json({
                statue: false,
                message: 'item does not inserted into database'
            })
        })
    }).catch((err) => {
        res.json({
            statue: false,
            message: 'item does not inserted into database'
        })
    })

})
module.exports = router