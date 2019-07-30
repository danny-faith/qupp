const cron = require('node-cron');
const User = require('./models/User');


const messengerUserStatusCheck = cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    User.find({ online: true })
        .then(users => console.log(users.length))
        .catch(err => console.log(err));
});

module.exports = messengerUserStatusCheck;