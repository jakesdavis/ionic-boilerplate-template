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
    var baseUrl = "api.openweathermap.org/data/2.5";

    var service = {
      weather: "/weather"
    };

    var objParams = {
      "APPID": ""
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
      objParams.APPID = "db585f9c2596dd5357447a9169729ae8";
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
      weather: {
        getWeather: function (params) {
          var deferred = $q.defer();
          var header = defaultHeader();
          header.method = "GET";
          header.url = baseUrl + service.feedback;
          header.params = {
            "APPID": objParams.APPID,
            "q": params.city
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
      weather: {
        /**
         * @function
         * @name this.weather.getWeather
         * @description Get Weather
         *
         * @argument params.q   (string, optional)  The city where weather needs to be queried
         *
         * @returns {Object} Deferred.promise
         */
        getWeather: function (params) {
          return _.weather.getWeather(params);
        }
      }
    };
  });
})();