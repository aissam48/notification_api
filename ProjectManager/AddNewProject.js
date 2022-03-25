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
        createdDate: data.createdDate,
        description: data.description,
        estimatedTime: data.estimatedTime,
        dateFilter: data.dateFilter
    }

    jwt.sign({ data }, 'secretToken', (err, token) => {

        projectJSON.token = token

        const command = 'INSERT INTO projects_table(token, projectName, createdDate, description, estimatedTime, dateFilter) VALUES("$token", "$projectName", "$createdDate", "$description", "$estimatedTime", "$dateFilter")'
            .replace('$token', projectJSON.token)
            .replace('$projectName', projectJSON.projectName)
            .replace('$createdDate', projectJSON.createdDate)
            .replace('$description', projectJSON.description)
            .replace('$estimatedTime', projectJSON.estimatedTime)
            .replace('$dateFilter', projectJSON.dateFilter)


        pool.query(command).then((resQuery) => {
            res.send('project added')

        }).catch((err) => {
            console.error(err)
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



            if (resQuery[0] == undefined) {
                res.json({
                    statue: false,
                    messgae: 'there is no user associted with this token  ->' + token
                })

                return
            }

            if (resQuery[0].token == token) {

                next()
            }
        })

    } else {

        res.json({
            statue: false,
            messgae: 'token is empty or undefined'
        })

    }

}


module.exports = router
