var wafepaApp = angular.module("wafepa", ["ngRoute"]);

wafepaApp.service("recordsService", function($http){
	
	this.url = "/api/records";
	
	this.getRecords = function(){
		var promise = $http.get(this.url);
		return promise;
	}
	
});

wafepaApp.controller("HomeCtrl", function($scope){
	$scope.message = "Hello JWD!";
});


wafepaApp.controller("ActivitiesCtrl", function($scope, $http, $location, recordsService){
	
	var baseUrl = "/api/activities";
	
	$scope.activities = [];
	
	var getActivities = function(){
		var promise = $http.get(baseUrl);
		promise.then(
			function success(res){
				//console.log(res);
				$scope.activities = res.data;
			},
			function error(res){
				
			}
		);
		
		//console.log("test");
	}
	
	getActivities();
	
	
	$scope.goToEdit = function(id){
		$location.path("/activities/edit/" + id);
	}
	
	$scope.goToAdd = function(){
		$location.path("/activities/add");
	}
});


wafepaApp.controller("EditActivityCtrl", function($scope, $http, $routeParams, $location){
	//console.log($routeParams);
	
	var url = "/api/activities/" + $routeParams.id;
	
	$scope.activity = {};
	$scope.activity.name = "";
	
	var getActivity = function(){
		var promise = $http.get(url);
		promise.then(
			function success(res){
				$scope.activity = res.data;
			},
			function error(){
				alert("Couldn't fetch the activity");
			}
		);
	}
	
	getActivity();
	
	$scope.doEdit = function(){
		$http.put(url, $scope.activity).then(
			function uspeh(){
				$location.path("/activities");
			},
			function neuspeh(){
				alert("Couldn't edit the activity.")
			}
		);
	}

});


wafepaApp.controller("AddActivityCtrl", function($scope,$location,$http){
	
	var url = "/api/activities";
	
	$scope.activity = {};
	$scope.activity.name = "";
	
	$scope.doAdd = function(){
		$http.post(url, $scope.activity).then(
			function success(){
				$location.path("/activities");
			},
			function error(){
				alert("Couldn't post the activity");
			}
		);
	}
	
});


wafepaApp.controller("RecordsCtrl", function($scope, $http, $location){
	
	var url = "/api/records";
	var urlActivites = "/api/activities";
	var urlUsers = "/api/users";
	
	
	$scope.records = [];
	$scope.activities = [];
	$scope.users = [];
	
	
	$scope.newRecord = {};
	$scope.newRecord.time = "";
	$scope.newRecord.duration = "";
	$scope.newRecord.intensity = "";
	$scope.newRecord.activityId = "";
	$scope.newRecord.userId = "";
	//TODO: dodati obeležja kojim se povezuje sa korisnikom i aktivnošću
	
	
	$scope.searchParams = {};
	$scope.searchParams.activityName = "";
	$scope.searchParams.minDuration = "";
	$scope.searchParams.intensity = "";
	
	$scope.pageNum = 0;
	$scope.totalPages = 1;
	
	var getRecords = function(){
		
		var config = {params:{}};
		
		if($scope.searchParams.activityName != ""){
			config.params.activityName = $scope.searchParams.activityName;
		}
		if($scope.searchParams.minDuration != ""){
			config.params.minDuration = $scope.searchParams.minDuration;
		}
		if($scope.searchParams.intensity != ""){
			config.params.intensity = $scope.searchParams.intensity;
		}
		
		config.params.pageNum = $scope.pageNum;
		
		var promise = $http.get(url, config);
		promise.then(
			function success(res){
				$scope.records = res.data;
				
				$scope.totalPages = res.headers("totalPages");
			},
			function error(){
				alert("Couldn't fetch records");
			}
		);
	}
	
	getRecords();
	
	//TODO: Obezbediti prihvat korisnika i aktivnosti
	var getUsers = function(){
		
		var promise = $http.get(urlUsers);
		promise.then(
			function success(res){
				$scope.users = res.data;
			},
			function error(res){
				alert("Couldn't fetch users.")
			}
		);	
		
	}
	
	getUsers();
	
	var getActivities = function(){
		
		$http.get(urlActivites).then(
			function uspeh(odg){
				$scope.activities = odg.data;
			},
			function neuspeh(){
				alert("Couln't fetch activites.");
			}
		);
		
	}
	
	getActivities();
	
	
	
	$scope.doAdd = function(){
		
		$http.post(url, $scope.newRecord).then(
			function success(res){
				getRecords();
				
				$scope.newRecord.time = "";
				$scope.newRecord.duration = "";
				$scope.newRecord.intensity = "";
				$scope.newRecord.activityId = "";
				$scope.newRecord.userId = "";
			},
			function error(){
				alert("Couldn't save the record");
			}
		);
	}
	
	$scope.goToEdit = function(id){
		$location.path("/records/edit/" + id);
	}
	
	$scope.doDelete = function(id){
		$http.delete(url + "/" + id).then(
			function success(res){
				getRecords();
			},
			function error(res){
				alert("Couln't delete the record.")
			}
		);
	}
	
	$scope.doSearch = function(){
		$scope.pageNum = 0;
		getRecords();
	}
	
	$scope.changePage = function(direction){//-1 unazad, +1 unapred
		$scope.pageNum = $scope.pageNum + direction;
		getRecords();
	}
	
});


wafepaApp.controller("EditRecordCtrl", function($scope, $http, $routeParams, $location){
	
	var recordUrl = "/api/records/" + $routeParams.id;
	var activitiesUrl = "/api/activities";
	var usersUrl = "/api/users";
	
	$scope.record = {};
	$scope.record.time = "";
	$scope.record.duration = "";
	$scope.record.intensity = "";
	$scope.record.userId = "";
	$scope.record.activityId = "";	
	
	
	$scope.activities = [];
	$scope.users = [];
	
	
	
	var getActivities = function(){
		$http.get(activitiesUrl).then(
			function success(res){
				$scope.activities = res.data;
				
				getUsers();
			},
			function error(){
				alert("Couldn't fetch activities");
			}
		);
	}
	
	var getUsers = function(){
		return $http.get(usersUrl).then(
			function success(res){
				$scope.users = res.data;
				
				getRecord();
			},
			function error(){
				alert("Couldn't fetch users.");
			}
		);
	}
	
	var getRecord = function(){
		$http.get(recordUrl).then(
			function success(res){
				$scope.record = res.data;
			},
			function error(){
				alert("Couldn't fetch record.");
			}
		);
	}
	
	//TODO: Obezbediti redosled izvrsavanja!
	getActivities();
	
	
	$scope.doEdit = function(){
		$http.put(recordUrl, $scope.record).then(
			function success(){
				$location.path("/records");
			},
			function error(){
				alert("Something went wrong.");
			}
		);
	}
});



wafepaApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : '/app/html/home.html',
			controller : 'HomeCtrl'
		})
		.when('/activities', {
			templateUrl : '/app/html/activities.html'
		})
		.when('/activities/add', {
			templateUrl : '/app/html/add-activity.html'
		})
		.when('/activities/edit/:id', {
			templateUrl : '/app/html/edit-activity.html'
		})
		.when('/records', {
			templateUrl : '/app/html/records.html'
		})
		.when('/records/edit/:id', {
			templateUrl : '/app/html/edit-record.html'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
