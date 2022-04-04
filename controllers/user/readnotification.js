const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const mariadb = require('../../lib/mariadb').mariadb
const { readNotification } = require('../../models/models')
/*endpoint: /notificationsreaders, methode: POST */
router.post('/', (req, res) => {

    const data = req.body
    const id = uuid.v1()
    // check data not empty or undefined
    switch (true) {
        case (data.notification_id == undefined): {
            res.json({
                statue: false,
                message: 'notification_id is empty or undefined'
            })
            return
        }
        case (data.token == undefined): {
            res.json({
                statue: false,
                message: 'token is empty or undefined'
            })
            return
        }
        case (data.username == undefined): {
            res.json({
                statue: false,
                message: 'username is empty or undefined'
            })
            return
        }
        case (data.readDate == undefined): {
            res.json({
                statue: false,
                message: 'readDate is empty or undefined'
            })
            return
        }
    }

    /* model of readNotification */
    const readNotificationModel = new readNotification(
        id,
        data.notification_id,
        data.token,
        data.username,
        data.readDate
    )

    const command = 'INSERT INTO notifications_readers_table(id, notification_id, token, username, read_date) VALUES(?, ?, ?, ?, ?)'
    mariadb.then((pool) => {
        /*insert notifications readers data to database*/
        pool.query(command, [readNotificationModel.id, readNotificationModel.notification_id, readNotificationModel.token, readNotificationModel.username, readNotificationModel.read_date]).then((resQuery) => {
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