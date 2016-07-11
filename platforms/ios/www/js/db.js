(function () {
  /**
   * @module App/db
   * @description The Controllers for the application App
   *
   * @requires ionic
   * @requires ngCordova
   *
   */
  var module = angular.module("App.db", [
    "ionic",
    "ngCordova"
  ]);
  module.factory('db', function ($cordovaSQLite, $q) {
    var db = null;
    var _ = {
      prepareDB: function () {
        db = $cordovaSQLite.openDB({
          name: "App.db",
          location: 'default'
        });
        _.createTables();
      },
      createTables: function () {
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sample (id integer primary key, value text)").then(function (res) {
          console.info("table created `sample`: " + res);
        }, function (res) {
          console.error("`sample` table create command failed: " + res);
        });
      },
      insertData: function (data) {
        var defer = $q.defer();
        var query = "INSERT INTO sample (value) VALUES (?)";
        $cordovaSQLite.execute(db, query, [data.value]).then(function (res) {
          console.info("Data added to table `sample`: " + res);
          defer.resolve(res);
        }, function (err) {
          console.error(err);
          defer.reject(err);
        });
        return defer.promise;
      }
    };

    return {
      /**
       * @function prepareDB
       * @description Set up all Tables for
       *
       * @returns {null} Null Object
       */
      prepareDB: function () {
        _.prepareDB();
      },
      /**
       * @function insertData
       * @description Insert a given value to the database
       *
       * @returns {Object} Promise Object
       */
      insertData: function (data) {
        return _.insertData(data);
      }
    };
  });
})();