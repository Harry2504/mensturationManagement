
const { Client } = require('pg');

function calluserDatabase(dbname){
const connectionString = 'postgres://postgres:1234@localhost:5432/'+ dbname;
console.log(connectionString);
const client = new Client({
    connectionString: connectionString
});
client.connect(function(err){
	if(err) throw err;
	console.log("CONNECTED!!");
});

return client;
}

module.exports = calluserDatabase;