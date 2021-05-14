var express = require('express');
var router = express.Router();
var trainsql = require('../database/train.js');
var sql = require('../database/userdb.js');

//now we will store client info using express session instead of cookie parser as
//cookie parser can store limited information
var session = require('express-session');
//after session we would need filestore to store the info
var FileStore = require('session-file-store')(session);

router.use(session({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: false,
	resave: false,
	store: new FileStore()
}));


/* GET users listing. */
router.get('/', function(req, res, next) {
console.log(req.session);
	//if logging in for the first time
	if(req.session.user === 'authenticated'){
		res.redirect('/admin/trains');
	}

	else{
	res.render('admin',{message:"",message1:""});
    }
});

router.post('/',function(req, res, next){
	if(!req.session.user){
	var email = req.body.email;
	var password = req.body.password;         

	        if(email === 'admin' && password === '123'){
		        //signed true means it is a signed cookie
		        req.session.user = 'authenticated';
		        res.statusCode=200;
		        res.setHeader('Content-Type', 'text/plain');
		        res.redirect('/admin/trains');
   	        }
	        else if(email=='pop'){
			res.render('admin', {message:"",  message1: "Password does not match" });
     	}
	        else if(password=='pop'){
			res.render('admin', {message:"Email does not match",  message1: "" });
     	}
     	else{
     		res.render('admin', {message:"Email does not match",  message1: "Password does not match" });		
     	}

}
//if already logged in using cookies
else{ 
    res.statusCode=200;
	res.setHeader('Content-Type', 'text/plain');
	res.end("You are already authenticated");
}

});

router.get('/logout',(req,res)=>{
	if(req.session){
		//destroy() destroys the information stored i.e. it will delete the info from client-side
		req.session.destroy();
		//deleting the cookie
		res.clearCookie('session-id');
		//redirect helps to redirect the response
		res.redirect('/admin');
	}
	else{
		var err = new Error('YOu are not logged in!');
		err.status = 403;
		//i.e. telling the error handle to handle the error
		next(err);
	}
});

function auth(req,res,next){
	console.log(req.session);

if(!req.session.user){
		var err = new Error('You are not authenticated!!');
		    res.setHeader('WWW-Authenticate', 'Basic');
	    	err.statusCode = 401;
	    	next(err);
}
    else{
		if(req.session.user === 'authenticated'){
			next();
		}
		else{
 			var err = new Error('You are not authenticated!!');
        	err.statusCode = 403;
	    	next(err);
		}
	}
}

router.use(auth);

router.get('/trains',(req,res)=>{
	let mysql = "Select * FROM traintb ORDER BY date;"

	trainsql.query(mysql,function(err,result){
		if (err) throw err;
		console.log(result.rows);
	res.render('trains',{search_result:result.rows});
	});
});

router.get('/addtrain',(req,res)=>{
	res.render('addtrain',{message:""});
});

router.post('/addtrain',(req,res)=>{
	var train_id = req.body.train_id;
	var from_given = req.body.from;
	var to_given = req.body.to;
	var date = req.body.date;
	var ac_coach = req.body.AC_coach_no;
	var sleeper_coach = req.body.Sleeper_coach_no;

	if ( from_given.toLowerCase() == to_given.toLowerCase()) {
	res.render('addtrain',{message:"'From city' and 'to city' cannot be the same"});
	}

	else{

    let mysql = "CALL insertTrain('" + train_id + "'::VARCHAR,'" + from_given + "'::VARCHAR,'" + to_given + "'::VARCHAR,'"+ date + "'::date," + ac_coach + "::SMALLINT," + sleeper_coach + "::SMALLINT);";
	console.log(mysql);
	trainsql.query(mysql,function(err,result){
		if (err) {
			res.redirect('/admin/errortrain');
		}
		else{
		console.log(err);
		console.log(result);
		res.redirect('/admin/trains');
	}
	});
}
});

router.get('/allusers',(req,res)=>{

	let mysql = "SELECT * FROM userTB;";
  sql.query(mysql,function(err,result){
    if (err) {
      throw err;
    }
    else{
    	console.log(result.rows);
	res.render('allusers',{search_result:result.rows});
    }
});

});

router.get('/errortrain',(req,res)=>{
	res.render('errortrain',{message:"That train is  available on that day"});
});

module.exports = router;
