const express = require('express')
const router = express.Router()
const uuid = require('uuid')



router.post('/', verify, (req, res) => {

    const data = req.body
    const pool = require('../App').mariadb
    const adminFCM = require('../App').FCM

    const id = uuid.v1()

    const notificationJSON = {
        id: id,
        token: req.headers['token'],
        message: {
            title: data.title,
            body: data.body,
            level: data.level
        },
        date: data.date
    }

    const command = 'INSERT INTO notifications_table(id, token, title, body, level, date) VALUES("$id", "$token", "$title", "$body", "$level", "$date")'
        .replace('$id', id)
        .replace('$token', data.token)
        .replace('$title', data.title)
        .replace('$body', data.body)
        .replace('$level', data.level)
        .replace('$date', data.date)

    pool.query(command).then((resQuery) => {

        const messaging = adminFCM.messaging()
        const message = {
            notification: {
                title: data.title,
                body: data.body
            },

            topic: 'notificationsapi'
        }

        messaging.send(message).then((resFCM) => {

            console.log(resFCM)
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

            console.log(err)

        })


    }).catch((err) => {

        res.json({
            statueInserted: false,
            statueSent: false,
            statue: true,
            message: 'Notification does not inserted'
        })

        console.log(err)
    })

})


function verify(req, res, next) {

    const token = req.headers['token']

    const pool = require('../App').mariadb

    if (token != undefined && token != null) {

        console.log(token)
        const command = 'SELECT * FROM projects_table WHERE token="$token"'.replace('$token', token)
        pool.query(command).then((resQuery) => {


            if (resQuery[0] == undefined) {
                res.json({
                    statue: false,
                    message: 'there is no project has created'
                })
                return

            }


            if (resQuery[0].token == token) {
                next()
            } else {
                res.json({
                    statue: false,
                    message: 'there is no project associted with this token'
                })
            }

        })
    }
}



module.exports = router