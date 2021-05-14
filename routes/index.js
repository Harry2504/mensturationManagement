// /signup addresss
var express = require('express');
// router 
var router = express.Router();
//database se connect kiya
var sql = require('../database/userdb.js');
//for creating tables
var create = require('../database/model.js')
//to connect purely with server
var host = require('../database/hostConnect.js')
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index',{message:"",message1:""});
});

router.post('/', function(req, res) {
const name  = req.body.name;
const username  = (req.body.username).toLowerCase();
const email  = req.body.email;
const password  = req.body.password;

  let mysql3 = "SELECT * FROM userTB WHERE email = '"+ email +"';";
  let mysql2 = "SELECT * FROM userTB WHERE username = '"+ username +"';";
  let message = "";
  let message1 = "";

  sql.query(mysql2,function(err,result1){
    if (err) {
      throw err;
    }
    else{
      console.log(result1.rows);
      console.log((result1.rows[0]));
      console.log("result");
      console.log((result1.rows[0]) != null);
      
      if((result1.rows[0]) != null){
        message = "This username is already registered!";
        res.render('index',{message:message,message1:message1});
      }
      else{
         sql.query(mysql3,function(err,result2){
          if (err) {
            throw err;
          }
          else{
              console.log((result2.rows[0]));
              console.log((result2.rows[0]) != null);
              if((result2.rows[0]) != null){
                  message1 = "This email is already registered!";
                  res.render('index',{message:"",message1:message1});
                  }
              else{
                let mysql = "CALL insertSignup('"+ name + "','" + password +"','"+ username + "','"+ email+ "');";
                console.log(mysql);
                sql.query(mysql,function(err,result){
                    if (err) throw err;
                    console.log(result);
                    //for encryption we add a z.
                    let dbname = username;
                    let mysql1 = "CREATE DATABASE "+ dbname +";";
                    host.query(mysql1, function (err, result) {
                        if (err) throw err;
                        else{
                          console.log("Database created");
                          setTimeout(function() {
                            create(dbname);
                              res.redirect('/login');
                            }, 5000);
                          
                        }
                    });
                });
              } 
          }

        });
      }
    }
  })
});

module.exports = router;
