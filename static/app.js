var app = angular.module('text-sync', ['ngMaterial']);


app.controller('appCtrl', ['$scope', function(scope) {

  scope.tabs = [
  // TODO remove this
    {name: '01 calendar', path: '/notes/01%20calendar.txt'},
    {name: '02 todo', path: '/notes/02%20todo.txt'},
    {name: '03 scratch', path: '/notes/03%20scratch.txt'}
  ];

  scope.pickFiles = function() {
    Dropbox.choose({
      linkType: "direct",
      multiselect: true,
      extensions: [".txt"],
      success: function(files) {
        for (var i = 0; i < files.length; i++) {
          file = files[i];
          scope.tabs.push({
            name: /^(.*)\..*$/.exec(file.name)[1],
            path: /\/view\/\w+(.*)$/.exec(file.link)[1]
          });
          scope.$digest();
        }
      },
    });
  };

}]);


app.directive('toolbarButton', [function() {
  return {
    replace: true,
    restrict: 'A',
    scope: {},
    templateUrl: 'toolbar-button.html',
    transclude: true,
    link: function (scope, element) {
    }
  };
}]);


app.directive('tabbedFile', [
    '$http', '$materialToast', function($http, toast) {
  var load = function(path, scope) {
    scope.error = false;
    scope.loaded = false;
    $http({method: 'GET', url: '/j/get_file' + path})
    .success(function(data, status, headers, config) {
      scope.loaded = true;
      scope.content = data.content;
      scope.metadata = data.metadata;
    })
    .error(function(data, status, headers, config) {
      scope.error = true;
      scope.loaded = true;
    });
  };

  var push = function(path, scope) {
    // TODO
    console.log('push...');
    return;
    $http({method: 'POST', url: '/j/put_file' + path})
    .success(function(data, status, headers, config) {
      toast({
        template: '<material-toast>' + 'Saved!' + '</material-toast>',
        position: 'bottom left'
      });
    })
    .error(function(data, status, headers, config) {
    });
  };

  return {
    replace: true,
    restrict: 'A',
    scope: {
      'tab': '='
    },
    templateUrl: 'tabbed-file.html',
    link: function (scope, element) {
      scope.monospace = true;
      scope.reload = function() {
        load(scope.tab.path, scope);
      };
      scope.commit = function() {
        push(scope.tab.path, scope);
      };
      scope.reload();
    }
  };
}]);


