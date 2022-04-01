const mariadb = require('mariadb')
const env = require('dotenv')
env.config()

function connectMariadb() {
    /* configuration of mariadb  */
    const pool = mariadb.createPool({
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE
    })
    pool.getConnection().then((res) => {
        /* export pool to all endpoints */
        console.log('connected to mariadb...')
        exports.pool = pool
    }).catch((err) => {
        console.log(err)
    })
}

exports.mariadb = connectMariadb()


