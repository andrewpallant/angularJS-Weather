app.directive('roundConverter2', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelCtrl) {
            function roundNumber(val) {
                var parsed = parseFloat(val, 10);
                if(parsed !== parsed) { return null; } // check for NaN
                var rounded = Math.round(parsed).toFixed(1);
                return rounded;
            }
            ngModelCtrl.$parsers.push(roundNumber); // Parsers take the view value and convert it to a model value.
        }
    };
});

app.controller('MainCtrl1', [
  '$scope',
  'GeolocationService',
  'WeatherService',
  function ($scope, geolocation, weather) {

      $scope.position = null;
      $scope.weather = null;
      $scope.forecast = null;
      $scope.city = 'London, On';

      // SEE: https://gist.github.com/robhurring/6074128
      geolocation().then(function (position) {
          $scope.position = position;
      });

      // City Watch
      $scope.$watch('city', function (val) {
          if (val == '-- Select --' && $scope.position)
          {
              // If we have a position and no city - auto look up
              weather.current.byPosition($scope.position.coords.latitude, $scope.position.coords.longitude).then(function (data) {
                  $scope.weather = data;
              });

              weather.forecast.byPosition($scope.position.coords.latitude, $scope.position.coords.longitude).then(function (data) {
                  $scope.forecast = data;
              });
          }
          else{
          weather.current.byCity(val).then(function (data) {
              $scope.weather = data;
          });

          weather.forecast.byCity(val).then(function (data) {
              $scope.forecast = data;
          });
          }
      });

      // Auto Detect Position
      $scope.$watch('position', function (position) {
          if (!position) {
              // If no Position Use City
              weather.current.byCity($scope.city).then(function (data) {
                  $scope.weather = data;
              });

              weather.forecast.byCity($scope.city).then(function (data) {
                  $scope.forecast = data;
              });
          } else {
              $scope.city = '-- Select --';
              weather.current.byPosition(position.coords.latitude, position.coords.longitude).then(function (data) {
                  $scope.weather = data;
              });

              weather.forecast.byPosition(position.coords.latitude, position.coords.longitude).then(function (data) {
                  $scope.forecast = data;
              });
          }
      });

      
      

  }]);

