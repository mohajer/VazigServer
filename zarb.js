var zarb = function ()
	{
	
		var self = this;
		self.sockets = [];
		self.question = [[1,24,25],[2,13,4],[3,43,6],[4,21,7],[5,56,9]];
		self.points = [];
		self.p1  = "" ;
		self.p2  = "" ;
		
		self.setSocket = function(id1,id2,soc1,soc2)
		{
			self.sockets[id1] = soc1;
			self.sockets[id2] = soc2;
			self.points[id1] = 0;
			self.points[id2] = 0;
			self.p1 = id1;
			self.p2 = id2;
		}
		self.get = function(param)
		{	
			
			self.sockets[param.clientId].emit("sr_question",{"qnum":self.question[param.qnum -1][0],"num1":self.question[param.qnum -1][1],"num2":self.question[param.qnum -1][2]});
	
		}
		self.ans = function(param)
		{
			if(self.question[param.qnum -1][1]*self.question[param.qnum -1][2] == param.ans)
			{
				self.points[param.clientId]++;
			}
		
		}
		self.result = function(param)
		{
			if( param.clientId == self.id1)
				self.sockets[param.clientId].emit("sr_result",{"you": self.points[self.id1],"opp":self.points[self.id2],time:new Date().getTime()});
			else
				self.sockets[param.clientId].emit("sr_result",{"you": self.points[self.id2],"opp":self.points[self.id1],"time1" : new Date().getTime(),"hoho":10000});
			
		}
		
	}	

module.exports = zarb;