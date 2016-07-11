(function () {
  /**
   * @module App/directive
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.directive", [
    "ionic",
    "ngCordova"
  ]);
  /**
   * @directive emailPattern
   * @description Function to initialize and set up database and tables
   *
   */
  module.directive('emailPattern', function () {
    return {
      require: 'ngModel',
      link: function (scope) {
        return scope.value;
      }
    };
  });
})();