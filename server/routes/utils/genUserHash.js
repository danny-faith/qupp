const bcrypt = require('bcryptjs');

module.exports = function genUserHash(email) {
    // console.log('this is the email I got: ', email);
    let hash1 = 'hash1';
    
    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(email, salt, (err, hash) => {
    //         // if (err) throw err;
    //         // console.log('heres the hash: ', hash);
    //         console.log('hash1 inside equals: ', hash1);
            
    //         hash1 = hash;
    //         console.log('now hash1 1 equals: ', hash1);
            
    //         // return 'hash!!!!';
    //     });
    // });
    // console.log('hash1 still equals: ', hash1);
    
    // return hash1;

    async function hashPassword (user) {

        const password = user.password
        const saltRounds = 10;
      
        const hashedPassword = await new Promise((resolve, reject) => {
          bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
          });
        })
      
        return hashedPassword
      }
}