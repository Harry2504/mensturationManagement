var bookingAgentDb = require('../database/bookingAgentDatabase.js')


function creatingFunctions(dbname){
	console.log("sds");
	let sql = bookingAgentDb(dbname);
	let mysql1 = "CREATE TABLE details(Perioddate integer NOT NULL,Periodmonth integer NOT NULL,Periodlength integer NOT NULL,Cyclelength integer NOT NULL,Id BIGSERIAL PRIMARY KEY NOT NULL);";
    // let mysql2 = "CREATE TABLE passenger(PNR_no UUID NOT NULL,first_name VARCHAR(15) NOT NULL,last_name VARCHAR(15) NOT NULL,age SMALLINT NOT NULL,gender VARCHAR(1) NOT NULL,coach_no VARCHAR(4) NOT NULL,berth_no SMALLINT NOT NULL,berth_type VARCHAR(2) NOT NULL);";
    // let mysql3 = 'CREATE OR REPLACE FUNCTION generate_pnr() RETURNs VARCHAR(20) LANGUAGE plpgsql AS $$ BEGIN CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; RETURN uuid_generate_v4(); END; $$; ';
    // let mysql4 = "CREATE OR REPLACE PROCEDURE insert_ticket (PNR_given UUID,trainid VARCHAR(10), From_given VARCHAR(25),To_given VARCHAR(25),no_passengers SMALLINT,date_given DATE,coach_type_given VARCHAR(7)) LANGUAGE plpgsql AS $$ BEGIN INSERT INTO ticket(PNR_no, train_id,From_city,To_city, no_of_passengers, date,coach_type) VALUES(pnr_given ,trainid, From_given, To_given, no_passengers,date_given,coach_type_given); COMMIT; END; $$; ";
    // let mysql5 = "CREATE OR REPLACE PROCEDURE insert_Passenger(PNR_given UUID,first VARCHAR(15),last VARCHAR(15),age_ SMALLINT,gen VARCHAR(1),coachno VARCHAR(4),berthno SMALLINT,berthtype VARCHAR(2)) LANGUAGE plpgsql AS $$ BEGIN INSERT INTO passenger( PNR_no,first_name ,last_name ,age,gender,coach_no ,berth_no ,berth_type) VALUES( pnr_given,first ,last ,age_,gen,coachno ,berthno ,berthtype); COMMIT; END; $$; ";
   
    sql.query(mysql1,function(err,result){
		if (err) throw err;
		console.log(result);
		// sql.query(mysql2,function(err,result){
		// 	if(err) throw err;
		// 	console.log(result);
		// 	sql.query(mysql3,function(err,result){
		// 		if(err) throw err;
		// 		console.log(result);
		// 		sql.query(mysql4,function(err,result){
		// 			if(err) throw err;
		//         	console.log(result);
		// 	    	sql.query(mysql5,function(err,result){
		// 	    		if(err) throw err;
	 //               		console.log(result);
		// });
		// });
		// });
		// });
	});

}

module.exports = creatingFunctions;