(function () {
  /**
   * @module App
   * @description A Pricewaterhouse Coopers Internal Application for Ticket Management
   *
   * @requires ionic
   * @requires ngCordova
   * @requires App/controller
   * @requires App/request
   * @requires App/db
   * @requires App/factory
   * @requires App/filter
   *
   */
  var app = angular.module("App", [
    "ionic",
    "ngCordova",
    "App.controller",
    "App.request",
    "App.directive",
    "App.db",
    "App.factory",
    "App.filter"
  ]);

  var timer = setTimeout(function () {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["App"]);
    });
  }, 2000);

  document.addEventListener("deviceready", function () {
    // Just to have it work with `ionic serve`
    clearTimeout(timer);
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["App"]);
      setTimeout(function() {
        navigator.splashscreen.hide();
    }, 1000);
    });
  });

  app.run(function ($ionicPlatform, $cordovaNetwork, $rootScope, $state, $ionicConfig, $ionicHistory, db) {

    $ionicPlatform.ready(function () {
      try {
        $ionicConfig.views.swipeBackEnabled(false);
        db.prepareDB();
        cordova.exec(null, null, "SplashScreen", "hide", []);
        navigator.splashscreen.hide();
        ionic.Platform.fullScreen(true, true);
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
        StatusBar.styleBlackTranslucent();
      } catch (e) {
        console.error("Not a device", e);
      }

      $rootScope.lastActivity = null;

      $ionicPlatform.registerBackButtonAction(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if ($ionicHistory.backView() !== null) {
          $ionicHistory.goBack();
        }
        return false;
      });
    });

    $rootScope.navigateTo = function (state, url) {
      if (state && state.length > 0) {
        $state.go(state);
      } else {
        window.location.hash = url;
      }
    };

    $rootScope.GoBack = function () {
      $ionicHistory.goBack();
    };
  });


  app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    /**
     * @description URL Configs for Application
     *
     * @requires $stateProvider
     * @requires $urlRouterProvider
     *
     */
    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/pages/app.html",
        controller: "AppController"
      })
      .state("app.home", {
        cache: false,
        url: "/home",
        showBar: true,
        showMenu: false,
        showBack: false,
        history: false,
        views: {
          "mainContent": {
            cache: false,
            templateUrl: "templates/pages/home.html",
            controller: "HomeController"
          }
        }
      });
    $urlRouterProvider.otherwise("/app/home");
  });
})();