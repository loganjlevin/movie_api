const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'asdf',
  CONNECTION_URI:
    process.env.CONNECTION_URI || 'mongodb://127.0.0.1:27017/myFLixDB',
};

module.exports = config;
