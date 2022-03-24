const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', verify, (req, res) => {


    console.log('Middleware good')

    const data = req.body
    const pool = require('../App').mariadb

    const projectJSON = {
        token: '',
        projectName: data.projectName,
        dateAdded: data.dateAdded,
        description: data.description,
        estimatedTime: data.estimatedTime
    }

    jwt.sign({ data }, 'secretToken', (err, token) => {

        projectJSON.token = token

        const command = 'INSERT INTO projects_table(token, projectName, dateAdded, description, estimatedTime) VALUES("$token", "$projectName", "$dateAdded", "$description", "$estimatedTime")'
            .replace('$token', projectJSON.token)
            .replace('$projectName', projectJSON.projectName)
            .replace('$dateAdded', projectJSON.dateAdded)
            .replace('$description', projectJSON.description)
            .replace('$estimatedTime', projectJSON.estimatedTime)

        pool.query(command).then((res) => {
            res.send('project added')
        }).catch((err) => {
            res.send(err)
        })

    })

})


function verify(req, res, next) {

    console.log(' in Middleware')
    const pool = require('../App').mariadb
    const token = req.headers['token']

    if (token != undefined) {
        const command = 'SELECT token FROM login_table WHERE token="$token"'.replace('$token', token)
        pool.query(command).then((resQuery) => {

            console.log(resQuery)

            if (resQuery[0] != {} && resQuery[0] != undefined && resQuery[0] != null && resQuery[0].token == token) {

                next()
            }
        })

    } else {

    }

}


module.exports = router
