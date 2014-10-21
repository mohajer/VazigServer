var hangMan = function ()
	{
	
		var self = this;
		self.socket = {};
		self.wordc = 5;
		self.myword = "salam";
		self.try_num = 0;
		self.max_try = 10;
		self.setSocket = function(soc)
		{
			self.socket = soc;
		}
		self.init = function()
		{
			self.socket.emit("sr_play",{"wordc" : self.wordc});
			
		}
		self.guess = function(arr_gs)
		{
			var ret = {};
			var tr_count = 0 ;
			self.try_num++;
			if(self.max_try < self.try_num )
			{
				self.socket.emit("sr_guess",{"message" : "Your has reach the limit of try number ","try_num":self.try_num});
			
			}
			 
			
			if( Object.keys(arr_gs).length != self.wordc)
			{
			
				self.socket.emit("sr_guess",{"message" : "word length not match!","try_num":self.try_num,"wordc" : self.wordc});
			return 1;
			}
				
			for(var i = 0 ; i < Object.keys(arr_gs).length;i++)
			{
				
				if( self.myword[i] == arr_gs[i])
				{
					ret[i]=1;
					tr_count++;
				}
				else if( self.myword.indexOf(arr_gs[i]) != -1)
					ret[i]= 2;
				else
				{
					ret[i]= 0;
				}
				
			}
			if( tr_count == self.wordc)
				self.socket.emit("sr_guess",{"result": ret , "try_num":self.try_num ,"wordc" : self.wordc , "message" : "you win!"});
			else
				self.socket.emit("sr_guess",{"result": ret , "try_num":self.try_num , "wordc" : self.wordc});
			return;
		}
	}	

module.exports = hangMan;