var app = angular.module("portfolio2015", ['ui.router', 'ui.validate', 'ui.mask', 'ngSanitize'])
	
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

		// Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      	$urlRouterProvider

        	// If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        	.otherwise('/');

        $stateProvider

	        .state("home", {
	          url: "/",
	          controller: 'homepageController',
	          templateUrl: 'templates/home.html'

	        })

	        .state("journal", {
	          	url: "/journal",
	          	controller: 'journalController',
	          	templateUrl: 'templates/journal.html'
	        })

	        .state("journal-post", {
	          	url: "/journal-post/{ID}",
	          	controller: 'journalPostController',
	          	templateUrl: 'templates/journal-post.html'
	        })

	        .state("curriculum-vitae", {
	          url: "/curriculum-vitae",
	          controller: 'curriculumVitaeController',
	          templateUrl: 'templates/curriculum-vitae.html'

	        })

    }])
	
	// Navigation on index.html
	.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {	
		
    	$scope.navClass = function (page) {
        	var currentRoute = $location.path().substring(1) || 'home';
        	return page === currentRoute ? 'active' : '';
    	}; 

    	$scope.collapse = false;
    	
    	$scope.toggleMenu = function (status) {
    		if( $(window).width() <= 768 ){
        		var activeClass = status ? 'on' : 'collapse';
        		return activeClass;
        	}
        	else{
        		$scope.collapse = false;
        		return 'collapse';
        	}
    	}; 

    	      
	}])

	// Call to wordpress
	.factory("WPService", function ($http) {
		return {
			homepage : function(){
				return $http.get("http://www.paulmatchett.co.uk/wp/wp-json/posts/2")
			},
  			cv : function(){
   				return $http.get("http://www.paulmatchett.co.uk/wp/wp-json/posts/560");
  			},
  			listOfPosts : function(){
   				return $http.get("http://www.paulmatchett.co.uk/wp/?json_route=/posts");
  			},
  			post : function(id){
  				var post = "http://www.paulmatchett.co.uk/wp/wp-json/posts/" + id;
   				return $http.get(post);
  			}
		}
	})
	
	.controller("homepageController", function($scope, WPService){
	
		var pagesPromise = WPService.homepage();
    	pagesPromise.success(function(response) {
    		$scope.homepage = response;
    	});

	})
	
	.filter('readmore', function () {
	    return function (text, id) {
	    	var excerpt = text.substr(0, text.length - 5) + "<a href='#/journal-post/"+id+"' class='more website'> ...Read More</a></p>";
	        return excerpt;
	    }
	})
	
	.controller("journalController", function($scope, WPService){

		var servicesPromise =  WPService.listOfPosts();
    	servicesPromise.success(function(response) {
    		$scope.posts = response;
    	});

	})

	.controller('journalPostController', function($scope, $stateParams, WPService) {

    	var servicesPromise = WPService.post($stateParams.ID);
  		servicesPromise.success(function(response) {
    		$scope.post  = response;
    		prettyPrint();
    	});
  	})

	.controller("curriculumVitaeController", function($scope, WPService){

		var pagesPromise = WPService.cv();

    	pagesPromise.success(function(response) {
    		$scope.cv = response;
    	});

	})

	.controller("ContactController", function($scope, $http) {
    
    	$scope.result = 'hidden'
	    $scope.resultMessage;
	    $scope.messageBox = "alert-success";
	    $scope.formData; //formData is an object holding the name, email, subject, and message
	    $scope.submitButtonDisabled = false;
	    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
	    
	    $scope.submit = function(contactform) {

	        $scope.submitted = true;
	        $scope.submitButtonDisabled = true;

	        if (contactform.$valid) {

	            $http({
	                method  : 'POST',
	                url     : 'contact-form.php',
	                data    : $.param($scope.formData),  //param method from jQuery
	                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
	            }).success(function(data){
	                console.log(data);
	                if (data.success) { //success comes from the return json object
	                    $scope.submitButtonDisabled = true;
	                    $scope.resultMessage = data.message;
	                    $scope.messageBox = "alert-success";
	                    $scope.result='bg-success';
	                } else {
	                    $scope.submitButtonDisabled = false;
	                    $scope.resultMessage = data.message;
	                    $scope.messageBox = "alert-danger";
	                    $scope.result='bg-danger';
	                }
	            });

	        } else {

	            $scope.submitButtonDisabled = false;
	            $scope.resultMessage = 'Something went wrong. Please try again later.';
	            $scope.result='bg-danger';
	            $scope.messageBox = "alert-danger";

	        }

	    }

  	});
	

