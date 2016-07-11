(function () {
  /**
   * @module App/filter
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.filter", [
    "ionic",
    "ngCordova"
  ]);
  /**
   * @filter TwoDigit
   * @description Function to initialize and set up database and tables
   *
   */
  module.filter('TwoDigit', function () {
    return function (number) {
      if (number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    };
  });
})();