const express = require('express')
const app = express()
const mariadb = require('mariadb')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const LogIN = require('./LogFolder/LogIN')
app.use('/login', LogIN)

const LogOUT = require('./LogFolder/LogOUT')
app.use('/logout', LogOUT)

const GetAllProjects = require('./ProjectManager/GetAllProjects')
app.use('/getallprojects', GetAllProjects)

const Notifications = require('./Notifications')
app.use('/notifications', Notifications)

const AddNewProject = require('./ProjectManager/AddNewProject')
app.use('/addnewproject', AddNewProject)

const CheckTokenValidat = require('./LogFolder/CheckTokenValidat')
app.use('/checktokenvalidat', CheckTokenValidat)

const ScriptWarning = require('./ScriptListener/ScriptWarning')
app.use('/scriptwarning', ScriptWarning)


const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '0020dC5d78@.',
    database: 'notifications'
})


var adminFCM = require("firebase-admin");

var serviceAccount = require("../notificationsapi-72e6c-firebase-adminsdk-tpb9b-f1ae8a76fa.json");

adminFCM.initializeApp({
    credential: adminFCM.credential.cert(serviceAccount)
});


pool.getConnection().then((res) => {
    console.log(res, 'hello mariadb')
    exports.mariadb = pool
    exports.FCM = adminFCM

}).catch((err) => {

    console.log(err)
})



app.listen(3000, () => {
    console.log('Working good on port 3000...')
})