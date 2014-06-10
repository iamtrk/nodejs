var mysql      = require('mysql');
var redis = require('redis');
var client = redis.createClient();
var async = require('async');
var fs = require('fs');

client.on("error", function (err) {
	console.log("Error " + err);
});

var connection = mysql.createConnection({
	host     : 'dbhost',
	user     : 'username',
	password : 'passowrd',
	database : 'db'
});

connection.connect();

connection.query('SELECT email,mobile from customers', function(err, rows, fields) {
	if (err)  console.log(err);
	async.forEach(rows,function(row,callback){
		console.log(row.login+' : '+row.mobile);

		async.parallel([
			function(callback){client.SADD('emails',row.login,function(err,res){
				if(err) console.log(err);
				console.log('emails call : '+res);
				callback();
			});},
			function(callback){client.SADD('mobiles',row.mobile,function(err,res){
				if(err) console.log(err);
				console.log('mobiles call : '+res);
				callback();
			});}
			],function(err){
				if(err) console.log(err);
				callback();
			});


	},function(err){
		if(err) console.log(err);
		console.log('Everything has been collected, Thanks');
		client.quit();
	});
});

connection.end(function(err){
	console.log('Connection got closed');
});


