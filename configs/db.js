const mongoose = require('mongoose');
const { MONGO_URL } = require('./config')

const connection = mongoose.connect(MONGO_URL);

module.exports = {
    connection
}