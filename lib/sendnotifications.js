const mariadb = require('./mariadb').mariadb
const firebaseAdmin = require('firebase-admin')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

module.exports = {

    startSend: () => {
        const task = new Task('simple task', () => {
            mariadb.then((pool) => {
                const commandGetAllDeviceTokens = 'SELECT * FROM notifications_checker_table WHERE statue=?'
                pool.query(commandGetAllDeviceTokens, ['unReceived']).then((allDeviceTokenQuery) => {
                    const allDeviceToken = Array.from(allDeviceTokenQuery)
                    for (const item of allDeviceToken) {
                        const messaging = firebaseAdmin.messaging()
                        const message = {
                            notification: {
                                title: item.title,
                                body: item.body
                            },
                            data: {
                                level: item.level,
                                token: item.token,
                                notification_id: item.notification_id,
                                createdDate: item.created_date,
                                click_action: process.env.FLUTTER_NOTIFICATION_CLICK,
                                group_key: process.env.GROUP_KEY
                            },
                            token: item.device_token
                        }

                        console.log(message)
                        setTimeout(() => {
                            messaging.send(message)
                        }, 2000)

                    }
                })
            })
        })
        // excuse task send notifications wihch unReceived each 10 minutes
        const scheduler = new ToadScheduler()
        const job = new SimpleIntervalJob({ minutes: 10 }, task)
        scheduler.addSimpleIntervalJob(job)
    }
}
