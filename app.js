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



//World Model Class
function WorldModel()
{
	var self = this;
	self.all_player = [];
	
	self.findPlayerById =function(id)
	{
		for(var i = 0 ; i < self.all_player.length;i++)
		{
			if( self.all_player[i].id == id)
				return self.all_player[i];
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
		var player_num = 2;
		
		socket.emit('sr_register',socket.id);
		match_counter++;
		
		if( player_num == 1) // One player game
		{
			var gameImp = require('./'+data.game+'.js');
			var game = new gameImp;
			wm.all_player.push(new Player(socket,socket.id,1,game));
			game.setSocket(socket);
		}
		else
		{

			wm.all_player.push(new Player(socket,socket.id,1,null));
			
			for(var i = 0 ; i < wm.all_player.length;i++)//Search for opponent
			{
				if(wm.all_player[i].status == 1 && wm.all_player[i].id != socket.id)
				{
					var gameImp = require('./'+data.game+'.js');
					var game = new gameImp;
					wm.all_player[i].game = game;
					wm.findPlayerById(socket.id).game = game;
				
					socket.join("match" + match_counter); //Join cur user to group match 
					wm.all_player[i].socket.join("match" + match_counter); //Join Other user to group match	
					
					game.setSocket(socket.id, wm.all_player[i].socket.id, socket ,wm.all_player[i].socket);
					io.sockets.in("match" + match_counter).emit('sr_match');
					wm.all_player[i].status = 2;
					wm.findPlayerById(socket.id).status = 2;
				}
		}
		
		}
		
		
		
		
		
		
	});
	socket.on('play', function (data) {
		wm.findPlayerById(socket.id).game[data.method](data.param);
		
	})
	
  
});


