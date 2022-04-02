/* create firebase admin to push notifications */
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../../push-notification-33c67-firebase-adminsdk-ohbf3-cb7a1ba392.json");
/*initialize firebase admin */
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});
exports.firebaseAdmin = firebaseAdmin