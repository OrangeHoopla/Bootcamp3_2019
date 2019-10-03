//This file holds any configuration variables we may need 
//'config.js' is ignored by git to protect sensitive information, such as your database's username and password
//copy this file's contents to another file 'config.js' and store your MongoLab uri there

module.exports = {
  db: {
    uri: 'mongodb+srv://admin:really@genesis-8ttgu.mongodb.net/admin?retryWrites=true&w=majority'//place the URI of your mongo database here.
  }, 
  openCage: {
    key: '652466c4f21640f3b172fa728a079dc2' //place your openCage public key here - Sign-up for a free key https://opencagedata.com/
  },
  port: 8080
};