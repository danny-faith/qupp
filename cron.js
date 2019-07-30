const cron = require('node-cron');
const User = require('./models/User');
const Moment = require('moment');

const messengerUserStatusCheck = cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    User.find({ online: true })
        .then(users => {
            // console.log(users.length);
            const a = Moment(users[2].lastOnline);
            const b = Moment(Date.now());
            console.log(users[2].username);
            
            console.log('users[0].lastOnline: ', users[2].lastOnline);
            
            console.log(b.diff(a, 'minutes'));
            // users.forEach(user => {
            //     // console.log(user);
            //     const a = Moment(user.lastOnline);
            //     const b = Moment(Date.now());
            //     console.log(a.diff(b));
                
            //     // console.log(Moment(user.lastOnline));
            // })
        })
        .catch(err => console.log(err));
});

module.exports = messengerUserStatusCheck;