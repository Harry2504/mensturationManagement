const express = require('express');
const { Client } = require('pg');

const connectionString = 'postgres://postgres:1234@localhost:5432';
const client = new Client({
    connectionString: connectionString
});

client.connect(function(err){
	if(err) throw err;
	console.log("CONNECTED!!");
});

module.exports = client;