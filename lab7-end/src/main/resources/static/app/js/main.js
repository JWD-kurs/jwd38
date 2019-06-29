var wafepaApp = angular.module("wafepa", ["ngRoute"]);

wafepaApp.controller("HomeCtrl", function($scope){
	$scope.message = "Hello JWD!";
});


wafepaApp.controller("ActivitiesCtrl", function($scope, $http, $location){
	
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


wafepaApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : '/app/html/home.html',
			controller: 'HomeCtrl'
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
		.otherwise({
			redirectTo: '/'
		});
}]);