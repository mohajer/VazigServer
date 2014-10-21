var sio = require('socket.io')
  , http = require('http')
  , index = require('fs').readFileSync(__dirname + '/index.html')
  , request = require('request')
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('S3CRE7'));
app.use(express.cookieSession());
app.use(app.router);
var io = sio.listen(app.listen(process.env.PORT || 3000),{log:false});

var match_counter = 1000;



//HangMan class



//Player Class
function Player(socket,id,status,gname)
{
	var self = this;
	self.id = id;
	self.status = status; //0:not in game ---- 1:registered ---- 2:Found Opponent
	self.socket = socket;
	self.game = gname;
}

//Match Class
function Match(id,team1,team2)
{
	var self = this;
	self.id = id;
	var d = new Date();
	var n = d.getTime(); 	
	self.time = n;
	self.mouse1 = {};
	self.mouse2 = {};
	self.second = 100;
	self.player1 = team1;
	self.player2 = team2;
	self.p1Point = 0;
	self.p2Point = 0;
	self.data = [0,0,0,0,0,0,0,0,0];
	self.winner = 0;
	self.isFinished = function()
	{
		for(var i = 0 ; i < 9;i++)
		{
			if( self.data[i] == 1 )
				self.p1Point++;
			else if(self.data[i] == 2)
				self.p2Point++;
		}
		var d = new Date();
		var n = d.getTime(); 
		self.second = Math.round(10 - ( n - self.time )/100);
		
		if( self.second < 0)
		{
			if( self.p1Point > self.p2Point)
				self.winner = 1;
			else if( self.p2Point > self.p1Point)
				self.winner = 2;
			else
				self.winner = 3;
			return true;
			
		}
	}

}

//World Model Class
function WorldModel()
{
	var self = this;
	self.all_player = [];
	self.all_match = [];
	self.findPlayerById =function(id)
	{
		for(var i = 0 ; i < self.all_player.length;i++)
		{
			if( self.all_player[i].id == id)
				return self.all_player[i];
		}

	}
	self.findMatchById = function(id) 
	{
		for(var i = 0 ; i < self.all_match.length;i++)
		{
			if( self.all_match[i].id == id)
				return self.all_match[i];
		}

	}
}

		
//IO Socket Connection and event handler
var wm = new WorldModel();

//New Connection
io.sockets.on('connection', function (socket) {
  console.log("New Client Connected!");
  socket.emit('sr_connect'); //Check if client is already in a game and send him game data if needed
  //New Client Want to start a game
	socket.on('register', function (data) {
		console.log("new Client Registered!");
		
		
		var gameImp = require('./'+data.game+'.js');
		var game = new gameImp;
		game.setSocket(socket);
		wm.all_player.push(new Player(socket,socket.id,1,game));
		
		socket.emit('sr_register',socket.id);
		
		
		
		
	});
	socket.on('play', function (data) {
		wm.findPlayerById(socket.id).game[data.method](data.param);
		
	})
	
  
});


