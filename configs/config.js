require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    SALTROUNDS: +process.env.SALTROUNDS,
    JWTKEY: process.env.JWTKEY
}