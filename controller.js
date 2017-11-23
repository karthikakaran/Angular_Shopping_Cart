var myapp = angular.module('myapp', ['ngRoute']);
myapp.config(['$routeProvider',function($routeProvider) {
        $routeProvider
            .when('/showProducts', {
                templateUrl : 'shoppingCart.htm',
                controller  : 'shoppingcartController'
            })
	    .when('/checkout', {
                templateUrl : 'CheckoutCart.htm',
                controller  : 'checkoutCartController'
            })
	    .otherwise({
                redirectTo: '/'
            });
}]);

myapp.controller('mainController', function($scope, $http, $window, $location) {
	 $location.path("showProducts");
});

myapp.controller('shoppingcartController', function($scope, $http, $window, $location, $rootScope) {
  var flag = true;
  if(typeof JSON.stringify($rootScope.products) == 'string') flag = false;
  if (flag) {
    $http({
      method: 'GET',
      url: 'products.js'
    }).then(function successCallback(response) {
      $rootScope.products = response['data'];
    }, function errorCallback(response) {
      alert('Oops!');
    });
  }
  $scope.values = {};
  $scope.checkout = function(){
    var values = JSON.stringify($scope.values);
    $.each($scope.values, function(key, value) {
      var price = $rootScope.products[key]['Price'];
      $rootScope.products[key]['CostOfItem'] = value * price;
      $rootScope.products[key]['Quantity'] = value;
    });
    if(JSON.stringify($scope.values) === JSON.stringify({})) alert('Please add items to the cart!');
    else $location.path('checkout');
  };

});

myapp.controller('checkoutCartController', function($scope, $http, $window, $location, $rootScope) {
  $scope.totalAmt = 0;
  $.each($rootScope.products, function (key, value) {
    if ($scope.products[key]['CostOfItem'])
      $scope.totalAmt += $scope.products[key]['CostOfItem'];
  });

  $scope.delete = function (index) {
    $scope.totalAmt -= $scope.products[index]['CostOfItem']
    delete $scope.products[index]['CostOfItem'];
    delete $scope.products[index]['Quantity'];
  }

  $scope.changeQuantity = function (index) {
     if($scope.products[index]['Quantity'] != null) {
       $scope.totalAmt -= $scope.products[index]['CostOfItem'];
       $scope.products[index]['CostOfItem'] = $scope.products[index]['Quantity'] * $scope.products[index]['Price'];
       $scope.totalAmt += $scope.products[index]['CostOfItem'];
     }
  }

  $scope.changeItemInCart = function() {
    $rootScope.products = angular.copy($scope.products);
 	  $location.path('showProducts');
  }

  $scope.message = function() {
    $scope.totalAmt == 0 ? alert('No items selected!') : alert('PAID! Thank You!');
  }
});
