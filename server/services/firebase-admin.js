const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://nufie-2de4f.firebaseio.com'
})

module.exports = admin