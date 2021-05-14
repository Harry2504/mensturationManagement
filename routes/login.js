// /login
var express = require('express');
var router = express.Router();
var usersql = require('../database/userdb.js');
var bookingAgentDb = require('../database/bookingAgentDatabase.js');

//authentication
//now we will store client info using express session instead of cookie parser as
//cookie parser can store limited information
var session = require('express-session');
//after session we would need filestore to store the info
var FileStore = require('session-file-store')(session);

router.use(session({
	name: 'session-id1',
	secret: '12345-67890-09876-543210',
	saveUninitialized: false,
	resave: false,
	store: new FileStore()
}));

function auth(req,res,next){
	console.log(req.session);

if(!req.session.user){
			res.redirect('/login');
}
    else{
		if(req.session.user === 'authenticated1'){
			next();
		}
		else{
			res.redirect('/login');
		}
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	//if logging in for the first time
	if(req.session.user === 'authenticated1'){
		res.redirect('/login/dashboard');
	}
else{
  res.render('login', { message: "" ,message1: ""});
}
	});  


router.post('/',function(req,res,next){
if(req.session.user == undefined){

	let email = req.body.email;
	let password = req.body.password;

	let mysql = "SELECT logincheck('"+ email +"');";
	let mysql1 = "SELECT databasename('"+ email +"');";

	usersql.query(mysql,function(err,result){
		if (err) throw err;
		let temp = (result.rows[0]);
		console.log(temp);
		let userdata = temp.logincheck;
		if(userdata==null){
			res.render('login', { message: "EMAIL not registered. Please register first." ,message1:""});
		}
		else{
			console.log(userdata);
		if(userdata==password){
	usersql.query(mysql1,function(err,result){
		if (err) throw err;
		let temp = (result.rows[0]);
		let userdata = temp.databasename;
		console.log(userdata);
			 req.session.user = 'authenticated1';
			 req.session.token = userdata;
			 console.log(req.session.token);
		        res.statusCode=200;
		        res.setHeader('Content-Type', 'text/plain');
			res.redirect('/login/dashboard');
		});

		} 
		else{
			res.render('login', {message:"",  message1: "Password does not match" });
		}
	}

	});
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
		res.clearCookie('session-id1');
		//redirect helps to redirect the response
		res.redirect('/login');
	}
	else{
		var err = new Error('You are not logged in!');
		err.status = 403;
		//i.e. telling the error handle to handle the error
		next(err);
	}
});


router.use(auth);
router.get('/dashboard',(req,res)=>{
	console.log(req.session.token);


let months = ['Jan', 'Feb','Mar','April','May','June','July','August','Sep','Oct','Nov','Dec']
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

	let db = bookingAgentDb(userDatabase);
		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);

	let mysql1 = "SELECT COUNT(*) FROM details;";			
		db.query(mysql1,function(err,result2){
			console.log(result2.rows[0]);
			if (result2.rows[0].count==0) {
					res.render('dashboard', { name:result.rows[0].username, startdate:'Nan',startmonth:'',ovulationdate:'Nan',ovulationmonth:'',lastdate:'Nan',lastmonth:''});

			}

else{

	let mysql1 = "SELECT perioddate FROM details ORDER BY id DESC LIMIT 1;";			
			db.query(mysql1,function(err,result1){
				console.log(result1.rows[0].perioddate);
				let date=result1.rows[0].perioddate;

	let mysql1 = "SELECT periodmonth FROM details ORDER BY id DESC LIMIT 1;";			
			db.query(mysql1,function(err,result1){
				console.log(result1.rows[0].periodmonth);
				month_no = (result1.rows[0].periodmonth);
				let month= months[month_no - 1];

	let mysql1 = "SELECT cyclelength FROM details ORDER BY id DESC LIMIT 1;";			
			db.query(mysql1,function(err,result1){
				console.log(result1.rows[0].cyclelength);
				lengthp = result1.rows[0].cyclelength;
				let startmonth_no = 0;
				var startmonth;

				if(month_no%2==0){

				startdate = (date + lengthp)%31;
				startmonth_no =  month_no + Math.floor((date + lengthp)/31);
				startmonth = months[startmonth_no-1];

}

else{
				startdate = (date + lengthp)%30
				startmonth_no =  month_no + Math.floor((date + lengthp)/30);
				startmonth = months[startmonth_no-1];

}

let ovulationdate = 0;
let ovulationmonth_no = 0;
var ovulationmonth;

				if(startmonth_no%2==0){

				ovulationdate = (startdate - 14 + 30 )%30;
				ovulationmonth_no =  startmonth_no + (Math.floor((startdate - 14 + 30 )/30) - 1);
				ovulationmonth = months[ovulationmonth_no-1];

}

else{
				ovulationdate = (startdate - 14 + 31 )%31;
				ovulationmonth_no =  startmonth_no + (Math.floor((startdate - 14 + 31 )/31) - 1);
				ovulationmonth = months[ovulationmonth_no-1];

}

console.log(startmonth_no)
console.log(ovulationmonth_no)

				res.render('dashboard', { name:result.rows[0].username, startdate:startdate,startmonth:startmonth,ovulationdate:ovulationdate,ovulationmonth:ovulationmonth,lastdate:date,lastmonth:month});

});
});

});
}
});

	});

	});

router.get('/profile',(req,res)=>{
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);
  res.render('profile', { name:result.rows[0].username});

});
});

router.post('/profile',(req,res)=>{

    // period date
	let periodDay = req.body.periodDay;
	let cycleLength = req.body.cycleLength;
	let periodLength = req.body.periodLength;
	let date = periodDay.slice(8,10);
	let month = periodDay.slice(5,7);

	let mysql1 = "INSERT INTO details(perioddate,periodmonth,periodlength,cyclelength) VALUES( " + date + "," + month + "," + periodLength + "," +cycleLength + ");";
	console.log(mysql1);

	userDatabase = req.session.token;
	console.log(userDatabase);
	let db = bookingAgentDb(userDatabase);
		db.query(mysql1,function(err,result){
			if (err) {throw err;}
					res.redirect('/login/dashboard');
	
		})


});

router.get('/issues',(req,res)=>{
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);
  res.render('issues', { name:result.rows[0].username,search_result:[]});

});
});

router.post('/issues',(req,res)=>{
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);

if(req.body.cramp!=undefined){
	let preffered = "Protein based food";
	let avoid = "Food rich in carbohydrates";
	let home = "Put a heating pad on your belly or lower back or taking a hot bath"
	let medicine = "ibuprofen(Advil) or naproxen(aleve)"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

  res.render('issues', { name:result.rows[0].username,search_result:net});

}
else if(req.body.bloating!=undefined){
	let preffered = "Potassium rich foods";
	let avoid = "Salty foods and refined carbohydrates";
	let home = "Exercise and drink lots of water"
	let medicine = "diuretics"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};
  res.render('issues', { name:result.rows[0].username,search_result:net});
	
}
else if(req.body.sore!=undefined){
	let preffered = "Soya based foods";
	let avoid = "Salt, sugar and caffeine";
	let home = "Try wearing a supportive bra during ths time"
	let medicine = "ibuprofen or naproxen"
 var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

  res.render('issues', { name:result.rows[0].username,search_result:net});
	
}
else if(req.body.headache!=undefined){
	let preffered = "Caffeine";
	let avoid = "Citrus fruits";
	let home = "Try eating chocolate and drinking caffinated tea or soda"
	let medicine = "Pain relievers like aspirin"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};
  res.render('issues', { name:result.rows[0].username,search_result:net});
	
}
else{
 	let preffered = "Bland foods like bananas, rice, applesauce, toast and tea and ginger candies";
	let avoid = "Eating heavy meals";
	let home = "Apply a cool compress to your forehead and sit in front of a fan to get fresh air"
	let medicine = "Dimenhydrinate "
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};
 res.render('issues', { name:result.rows[0].username,search_result:net});
	
}
});

});

router.get('/share',(req,res)=>{
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);
 
res.render('share', { name:result.rows[0].username});

});
	});

router.post('/share',(req,res)=>{
let title = req.body.title;
let text = req.body.text;

mysql1 = "INSERT INTO blogtb(title,text) VALUES('" + title + "','" + text + "');";

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			res.redirect('/login/dashboard');
});

});

router.get('/read',(req,res)=>{
	userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);
 
	let mysql1 = "SELECT * FROM blogTB;";
		usersql.query(mysql1,function(err,result1){
			if (err) {throw err;}
			let temp = result1.rows;
			console.log(temp);

  res.render('blog', { name:result.rows[0].username, search_result:temp});

});
});
});

router.get('/read/:id',(req,res)=>{
		userDatabase = req.session.token;
	console.log(userDatabase);
	let mysql1 = "SELECT username('"+ userDatabase +"'::VARCHAR);";
	console.log(mysql1);

		usersql.query(mysql1,function(err,result){
			if (err) {throw err;}
			console.log(result.rows);
			console.log(result.rows[0].username);

			let id_blog = req.params.id;
	let mysql1 = "SELECT * FROM blogtb WHERE id="+ id_blog +";";
		usersql.query(mysql1,function(err,result1){
			if (err) {throw err;}
			let id_blog = req.params.id;

  res.render('eachblog', { name:result.rows[0].username,title:result1.rows[0].title,text:result1.rows[0].text});
});

});

});

module.exports = router;
