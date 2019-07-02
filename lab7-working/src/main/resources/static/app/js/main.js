var wafepaApp = angular.module("wafepa", ["ngRoute"]);

wafepaApp.controller("HomeCtrl", function($scope){
	$scope.message = "Hello JWD!";
});


wafepaApp.controller("ActivitiesCtrl", function($scope, $http){
	
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
		.otherwise({
			redirectTo: '/'
		});
}]);