(function () {
  /**
   * @module App/controller
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.controller", [
    "ionic",
    "ngCordova"
  ]);

  module.controller("AppController", function ($rootScope, $ionicHistory, $ionicNavBarDelegate, $scope, $state, $timeout, $ionicPopup, $ionicModal, request, user) {
    var initialize = function () {
      $scope.data = {
        showMenu: false,
        showBack: false,
        waitTime: null,
        toast: {
          icon: null,
          showToast: false,
          button: null
        }
      };
    };

    var state = {
      event: null,
      toState: null,
      toParams: null,
      fromState: null,
      fromParams: null
    };


    var _ = {
      menu: null,
      openMenu: function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $scope.menu.show();
        return false;
      },
      closeMenu: function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $scope.menu.hide();
        return false;
      },
      getWaiting: function () {
        // api call
        var getWaitingTime = request.serviceDesk.waitTime({
          "e": user.email
        });
        getWaitingTime.then(function (data) {
          /*
           * Response is array of object of type as below
           * {
           * "wait":"string, the wait time",
           * "queue ":"int, the number of callers in the queue"
           * }
           *
           */

          $scope.data.waitTime = data[0];
          user.waitTime = $scope.data.waitTime;
        }, function (data) {
          console.error(data);
        });
      }
    };

    $scope.events = {
      // triggerMenu: function (event) {
      //   _.triggerMenu(event);
      // },
      openMenu: function (event) {
        _.openMenu(event);
      },
      closeMenu: function (event) {
        _.closeMenu(event);
      },
      openItem: function (event, item) {
        _.closeMenu(event);
        $rootScope.navigateTo(item);
      }
    };


    var toast = {
      id: null,
      list: [],
      timeout: function () {
        $scope.data.toast = toast.list.shift();

        $scope.data.toast.icon = ($scope && $scope.data && $scope.data.toast && $scope.data.toast.icon) || "icon-info-white";
        $scope.data.toast.showToast = true;
        document.querySelector(".toast").classList.remove("hide");
        $timeout(function () {
          $scope.data.toast.showToast = false;
          $timeout(function () {
            document.querySelector(".toast").classList.add("hide");
            if (toast.list.length !== 0) {
              toast.timeout();
            } else {
              toast.id = null;
            }
          }, 400);
        }, 4000);
      }
    };

    $rootScope.toast = function (data) {
      if (((toast.list.length > 0 && toast.list[toast.list.length - 1].text !== data.text) || toast.list.length === 0) &&
        ($scope.data.toast && $scope.data.toast.text !== data.text)) {
        toast.list.push(data);
      }
      if (toast.id === null) {
        toast.id = $timeout(toast.timeout, 0);
      }
    };

    $ionicModal.fromTemplateUrl('templates/modals/menu.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.menu = modal;
    });
    $scope.$on('$destroy', function () {
      $scope.menu.remove();
    });

    $rootScope.retryLastActivity = function () {
      if (typeof ($rootScope.lastActivity) === "function") {
        $rootScope.lastActivity();
      }
      $rootScope.$broadcast('$stateChangeSuccess', state.toState, state.toParams, state.fromState, state.fromParams);
    };

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      state.event = event;
      state.toState = toState;
      state.toParams = toParams;
      state.fromState = fromState;
      state.fromParams = fromParams;

      $ionicNavBarDelegate.showBar(toState.showBar);
      $scope.data.showMenu = toState.showMenu;
      $scope.data.showBack = toState.showBack;
      $scope.data.title = toState.title;

      $scope.data.waitTime = user.waitTime;
      if (fromState.history === false) {
        $timeout(function () {
          if ($ionicHistory.backView() !== null && $ionicHistory.backView().stateName === "app.home") {
            $ionicHistory.clearHistory();
          } else {
            $ionicHistory.removeBackView();
          }
        }, 100);
      }
    });
    try {
      $rootScope.lastActivity = null;
      initialize();
    } catch (e) {
      console.error("Initialize Failed");
    }
  });

  module.controller("HomeController", function($rootScope) {
    $rootScope.toast({
      text: "App Loaded Successfully"
    });

  });

})();