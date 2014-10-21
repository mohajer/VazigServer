var socket = io.connect();
	
	
		function VM() {
			
			var self = this;
			self.result = ko.observable("");
			self.game = new Game();
			self.Board = ko.observableArray();
			for(var i = 0 ; i < 9 ;i++)
				self.Board.push(new cell(i+1,'white'));
				
			
			self.changeColor = function(cell,e)
			{
				
				//self.Board()[cell.number() -1].color("green");
				socket.emit('my_move',{mid:self.game.match_id(),pid:self.game.id(),cid:cell.number()-1});
				
				
			};
			
			socket.on('match_detail', function (data) {
			
				
			});
			socket.on('client_connected', function (data) {
				
					//Reset Game if it is middle of game
					self.game.status(0);
					self.game.id(0);
					self.game.match_id(0);
					self.game.opponent_id(0);
					for(var i = 0 ; i < 9 ;i++)
						self.Board()[i].color("white");
					
			});
		};
	
		function cell(number,color)
		{
			this.number = ko.observable(number);
			this.color = ko.observable(color);
		
		}
	    function Game()
		{
			var self = this;
			self.status = ko.observable(0);//0:not in game ---- 1:registered ---- 2:Found Opponent----3:End game
			self.id = ko.observable(0);
			self.second = ko.observable(10);
			self.match_id = ko.observable(0);
			self.opponent_id = ko.observable(0);
			
			self.search = function()
			{	
				
				socket.emit('register_client');
				socket.on('register_accept', function (data) {
					self.id(data);
					self.status(1);
					socket.on('match_found', function (data) {
						self.match_id(data.id);
						self.opponent_id((self.id() == data.player1)?data.player2:data.player1);
						self.status(2);
					});
				});
			}
		
		}
 
      $(function() {
        
        ko.applyBindings(new VM());
		
		//
      });