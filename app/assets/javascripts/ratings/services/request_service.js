/* 
 * 
 * @return promise
*/
angular.module("RequestService", []).service("RequestService", ["$http", function($http) {
  var root = "http://localhost:4040/api/v1/";

  function makeQueryParameterString(params) {
    if (typeof params !== "object") return false;

    var paramatersString = "",
        parameter,
        prefix;

  angular.forEach(params, function(value,key) {
      prefix = !paramatersString ? "?" : "&";
      paramater = prefix + key + "=" + value;

      paramatersString += paramater;
    });

    return paramatersString;
  }

  return {
    get: function(url, params) {
      var queryParams = makeQueryParameterString(params);

      return $http({
        method: "GET",
        data: params,
        url: root + url + queryParams
      });
    }
  };
}]);
