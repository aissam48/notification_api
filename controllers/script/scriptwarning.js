const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const dateTime = require('node-datetime')
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const verify = require('../../config/validator').verifyprojectoken

/*endpoint: /scriptwarning, methode: POST*/
router.post('/', verify, (req, res) => {
    const data = req.body
    const pool = require('../../config/mariadb').pool
    const firebaseAdmin = require('../../config/firebase').firebaseAdmin

    /*create time for notification*/
    const time = dateTime.create()
    const formatted = time.format('y-m-d H:M:S')
    const createdDate = '20' + formatted
    const dateFilterString = '20' + formatted
        .replace('-', '')
        .replace('-', '')
        .replace(' ', '')
        .replace(':', '')
        .replace(':', '')
    const dateFilter = Number(dateFilterString)

    /*random id for notification*/
    const id = uuid.v1()

    /*notification body*/
    const notificationJSON = {
        id: id,
        token: req.headers['authorization'].replace('bearer ', ''),
        message: {
            title: data.title,
            body: data.body,
            level: data.level
        },
        created_date: createdDate,
        date_filter: dateFilter
    }

    /*comand to insert notification body into database */
    const command = 'INSERT INTO notifications_table(id, token, title, body, level, created_date, date_filter) VALUES(?, ?, ?, ?, ?, ?, ?)'

    /*insert notification body into database*/
    pool.query(command, [notificationJSON.id, notificationJSON.token, notificationJSON.message.title, notificationJSON.message.body, notificationJSON.message.level, notificationJSON.created_date, notificationJSON.date_filter])
        .then((resQuery) => {
            const messaging = firebaseAdmin.messaging()
            const message = {
                notification: {
                    title: data.title,
                    body: data.body
                },
                data: {
                    level: data.level,
                    token: req.headers['authorization'].replace('bearer ', ''),
                    createdDate: createdDate,
                    click_action: process.env.FLUTTER_NOTIFICATION_CLICK,
                    group_key: process.env.GROUP_KEY
                },
                topic: process.env.TOPIC
            }
            /* push notification of project info to user*/
            messaging.send(message).then((resFCM) => {
                res.json({
                    statueInserted: true,
                    statueSent: true,
                    statue: true,
                    message: 'Notification has inserted in database and sent to devices'
                })
            }).catch((err) => {
                res.json({
                    statueInserted: true,
                    statueSent: false,
                    statue: true,
                    message: 'Notification does not sent to devices'
                })
            })
        }).catch((err) => {
            res.json({
                statueInserted: false,
                statueSent: false,
                statue: true,
                message: err
            })
        })
})
module.exports = router