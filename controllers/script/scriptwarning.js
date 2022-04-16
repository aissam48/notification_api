const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const dateTime = require('node-datetime')
const mariadb = require('../../lib/mariadb').mariadb
const firebaseAdmin = require('../../lib/firebase').firebaseAdmin
const { jwt } = require('../../lib/jwt')


/*endpoint: /scriptwarning, methode: POST*/
router.post('/', jwt.jwtProject, (req, res) => {
    const data = req.body

    /* chack if any of data items is empty or undefined */
    switch (true) {
        case (data.title == undefined): {
            res.json({
                statue: false,
                message: 'title is undefined or empty'
            })
            return
        }
        case (data.body == undefined): {
            res.json({
                statue: false,
                message: 'body is undefined or empty'
            })
            return
        }
        case (data.level == undefined): {
            res.json({
                statue: false,
                message: 'level is undefined or empty'
            })
            return
        }
        case (data.projectName == undefined): {
            res.json({
                statue: false,
                message: 'projectName is undefined or empty'
            })
            return
        }
    }

    /* remove 'Bearer ' text from token sequence*/
    const bearerToken = req.headers['authorization']
    if (bearerToken == undefined) {
        res.json({
            statue: false,
            message: 'token is undefined or empty'
        })
        return
    }
    const token = bearerToken.split(' ')[1]

    /*create createdDate for notification */
    const time = dateTime.create()
    const formatted = time.format('y-m-d H:M:S:N')
    /* format() funtions return format 22-04-01 14:55 but require 2022-04-01 14:55 */
    const createdDate = '20' + formatted
    const dateFilterString = '20' + formatted
        .replace('-', '')
        .replace('-', '')
        .replace(' ', '')
        .replace(':', '')
        .replace(':', '')
        .replace(':', '')

    const dateFilter = Number(dateFilterString)

    /* random unique id for notification */
    const notification_id = uuid.v1()

    /* format notification body */
    const notificationJSON = {
        notification_id: notification_id,
        token: token,
        message: {
            title: data.title,
            body: data.body,
            level: data.level,
            projectName: data.projectName
        },
        created_date: createdDate,
        date_filter: dateFilter
    }

    /*comand to insert notification body into database */
    const command = 'INSERT INTO notifications_table(notification_id, token, title, body, level, created_date, date_filter) VALUES(?, ?, ?, ?, ?, ?, ?)'

    /*insert notification body into database*/
    mariadb.then((pool) => {

        pool.query(command, [notificationJSON.notification_id, notificationJSON.token, notificationJSON.message.title, notificationJSON.message.body, notificationJSON.message.level, notificationJSON.created_date, notificationJSON.date_filter])
            .then((resQuery) => {

                const messaging = firebaseAdmin.messaging()
                const message = {
                    data: {
                        title: data.title,
                        body: data.body,
                        level: data.level,
                        projectName: data.projectName,
                        token: token,
                        notification_id: notification_id,
                        createdDate: createdDate,
                        click_action: process.env.FLUTTER_NOTIFICATION_CLICK,
                        group_key: process.env.GROUP_KEY
                    },
                    android: {
                        priority: 'high'
                    },

                    apns: {
                        headers: {
                            'apns-priority': '5'
                        }
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