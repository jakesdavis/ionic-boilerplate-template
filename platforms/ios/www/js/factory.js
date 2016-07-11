(function () {
  /**
   * @module App/factory
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.factory", [
    "ionic",
    "ngCordova"
  ]);
  /**
   * @factory factory
   * @description Function to initialize and set up database and tables
   *
   */
  module.factory('user', function () {
    return {
    };
  });
})();