const mariadb = require('mariadb')
const env = require('dotenv')
env.config()


const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
})

exports.mariadb =
    new Promise((resolve, reject) => {
        pool.getConnection().then((result) => {
            console.log('connected to mariadb...')
            resolve(pool)
        }).catch((err) => {
            reject(err)
        })
    })



