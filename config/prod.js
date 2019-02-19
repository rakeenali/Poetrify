module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailSecret: process.env.EMAIL_SECRET,
  tokenSecret: process.env.TOKEN_SECRET,
  nodeMailerUser: process.env.MAILER_USER,
  nodeMailerPassword: process.env.MAILER_PASSWORD
};
