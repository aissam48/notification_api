class readNotificationClass {
    constructor(id, notification_id, token, username, readDate) {
        this.id = id
        this.notification_id = notification_id
        this.token = token
        this.username = username
        this.readDate = readDate
    }
}

class logInClass {
    constructor(username, password) {
        this.username = username
        this.password = password
    }
}

module.exports = {
    readNotification: readNotificationClass,
    logInClass: logInClass
}