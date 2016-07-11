(function () {
  /**
   * @module App/request
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.request", [
    "ionic",
    "ngCordova"
  ]);
  /**
   * @factory request
   * @description API Module. All API requests are routed through this module.
   *
   */
  module.factory('request', function ($cordovaDevice, $ionicLoading, $cordovaNetwork, $http, $q, $rootScope) {
    var baseUrl = "https://com.test.hello";

    var service = {
      sampleURL: "/v1/sampleURL"
    };

    var objParams = {
      "key": null
    };
    /**
     * @function defaultHeader
     * @description This is the default header Object for all outgoing requests
     *
     * @returns {Object} {} Returns a new instance of the header object
     */
    var defaultHeader = function () {
      return {
        method: null,
        url: null,
        params: null,
        dataType: "jsonp",
        contentType: 'application/json',
        crossDomain: true,
        timeout: 50000,
        cache: false,
        async: true
      };
    };

    document.addEventListener("deviceready", function () {
      objParams.key = "sample key";
    });

    var common = {
      preLoaderCount: 0,
      preLoader: function () {
        if (common.preLoaderCount === 0) {
          $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
        }
        common.preLoaderCount++;
      },
      postLoader: function () {
        if (common.preLoaderCount !== 0) {
          common.preLoaderCount--;
        }
        if (common.preLoaderCount === 0) {
          $ionicLoading.hide();
        }
      },
      isResponseValid: function (data) {
        var returnObj;
        switch (data.code) {
          case 200:
            returnObj = true;
            console.info("API Request Completed Successfully");
            break;
          default:
            returnObj = false;
            console.error("API Request Failed");
        }
        return returnObj;
      }
    };
    var _ = {
      feedback: {
        sendEmail: function (params) {
          var deferred = $q.defer();
          var header = defaultHeader();
          header.method = "GET";
          header.url = baseUrl + service.feedback;
          header.params = {
          };
          if ($cordovaNetwork.isOnline()) {
            common.preLoader();
            $http(header).success(function (data) {
              deferred.resolve(data);
              common.postLoader();
            }).error(function (data) {
              deferred.reject(data);
              common.postLoader();
            });
          } else {
            $rootScope.toast({
              text: "Please check your internet connection",
            });
            deferred.reject();
          }
          return deferred.promise;
        }
      }
    };

    return {
      feedback: {
        /**
         * @function
         * @name this.feedback.sendEmail
         * @description Send an email, with feedback about the app
         *
         * @argument params.e   (string, required)  The email of the user, who is requesting authentication
         * @argument params.s   (string, optional)  The number of stars (out of 5) that the user gave for the app (e.g. "1", "2","3", "4", "5")
         * @argument params.c   (string, optional)  The user’s comments
         *
         * @returns {Object} Deferred.promise
         */
        sendEmail: function (params) {
          return _.feedback.sendEmail(params);
        }
      }
    };
  });
})();