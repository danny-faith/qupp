const cron = require('node-cron');
const User = require('./models/User');
const Moment = require('moment');

const messengerUserStatusCheck = cron.schedule('* * * * *', () => {
    // console.log('running a task every minute');
    User.find({ online: true })
        .then(users => {
            users.forEach(user => {
                const date = new Date();
		        date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 )
                const a = Moment(user.lastOnline);
                const b = Moment(date);
                // console.log(b.diff(a, 'minutes'));

                // below accounts for timezones
                if (b.diff(a, 'minutes') > 0) {
                    // user has not been on qupp for 2 mins - set their status to offline
                    user.online = false;
                    user.save()
                        .then(() => {})
                        .catch((err) => console.log(err));
                }
            })
        })
        .catch(err => console.log(err));
});

module.exports = messengerUserStatusCheck;