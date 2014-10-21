var app = angular.module("hangMan", ['ngRoute']);
app.config(function($routeProvider){
	$routeProvider
		.when("/",{templateUrl:"main.html"})
		.otherwise({redirectTo: '/'})
});

  
app.controller('mainCtr', ['$scope', function($scope){

	$scope.connected=false;  	
  	$scope.client="";  	  
	$scope.connect="";
	$scope.client="";
	$scope.str="";
	
	
	
	socket.on('sr_connect', function (data) {  	
		$scope.connect="welcom";
	});	
	
   
  
  
	$scope.register=function(){
		socket.on('sr_register', function (data) {
			$scope.client = "U client id is :"+data ;
			//$('#register').remove();
		});
		socket.emit('register', {"game" : "hangMan"});     
	}
	
	$scope.play = function(){
	socket.on('sr_play', function (data) {  
	/*console.log(data.wordc) 
    $('#play').remove();*/
    // alert("zahra");
    for ($i = 0; $i <data.wordc; $i++) {
     $scope.str += "<input type='text' maxlength='1' size='2' class='hang-inp' style='background-color:black;color:#fff' />"
	 /*<input type='text' maxlength='1' size='2' class='hang-inp' style='background-color:black;color:#fff'>*/
    };
  //  $scope.input.push(str+"<br /><button id ='guess'>guess</button>");
  });
  socket.emit('play',{"method":"init"}); 
 	}
  
} ]
);