const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb+srv://marcin:VxiHbPyWYrgG9kxa@cluster0-ogdia.mongodb.net/angular-app?retryWrites=true&w=majority', {
        useNewUrlParser: true
    }).then(() => {
        console.log('Connected to db...');
    }).catch((error) => {
        console.log('Error occured...' + error );
    })
}