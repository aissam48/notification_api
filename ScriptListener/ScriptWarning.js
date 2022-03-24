const express = require('express')
const router = express.Router()
const uuid = require('uuid')



router.post('/', verify, (req, res) => {

    const data = req.body
    const pool = require('../App').mariadb

    const id = uuid.v1()

    const notificationJSON = {
        id: id,
        token: data.token,
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

        res.json({
            statue: true,
            message: 'Notification inserted'
        })

        /*
        
        Firebase Cloud Messaging
        
        */


    }).catch((err) => {

        res.json({
            statue: false,
            message: 'Notification does not inserted',
            err: err
        })
    })

})


function verify(req, res, next) {

    const token = req.headers['token']

    const pool = require('../App').mariadb

    if (token != undefined && token != null) {

        const command = 'SELECT * FROM projects_table WHERE token="$token"'.replace('$token', token)
        pool.query(command).then((resQuery) => {

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