var app = angular.module(
    'text-sync', ['cfp.hotkeys', 'ngCookies', 'ngMaterial']);


var AUTOSAVE_TIMEOUT_ = 4000;  // milliseconds


app.controller('appCtrl', [
    '$scope', '$timeout', 'hotkeys', function(scope, $timeout, hotkeys) {
  window.onbeforeunload = function() {
    if (Storage) {
      // strip out object keys starting with '$'
      var tabsData = angular.copy(scope.tabs);
      for (var i = 0; i < tabsData.length; i++) {
        tabData = tabsData[i];
        for (var key in tabData) {
          if (key[0] == '$') {
            delete tabData[key];
          }
        }
      }
      window.localStorage.setItem('tabs', JSON.stringify(tabsData));
    }
  };

  if (Storage) {
    var tabsValues = window.localStorage.getItem('tabs') || '[]';
    scope.tabs = JSON.parse(tabsValues);
  }
  else {
    scope.tabs = [];
  }

  hotkeys.bindTo(scope)
    .add({
      combo: 'ctrl+left',
      allowIn: ['TEXTAREA'],
      description: 'Change tabs to the left.',
      callback: function() {
        scope.selectedTabIndex =
            (scope.selectedTabIndex - 1 + scope.tabs.length)
            % scope.tabs.length;
      }
    })
    .add({
      combo: 'ctrl+right',
      allowIn: ['TEXTAREA'],
      description: 'Change tabs to the right.',
      callback: function() {
        scope.selectedTabIndex =
            (scope.selectedTabIndex + 1) % scope.tabs.length;
      }
    });

  scope.pickFiles = function() {
    Dropbox.choose({
      linkType: 'direct',
      multiselect: true,
      extensions: ['.txt'],
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

  scope.$watch('tabs.length', function(newLength, oldLength) {
    console.log('newLength=' + newLength + ', oldLength=' + oldLength);
    if (newLength == oldLength) {
      return;
    }
    var selection = scope.selectedTabIndex;
    if (oldLength > newLength) {
      if (selection > 0) {
        selection = selection - 1;
      }
    }
    if (newLength > oldLength) {
      selection = oldLength;
    }
    $timeout(function() {
      scope.selectedTabIndex = selection;
    });
  });
}]);


app.directive('toolbarButton', [function() {
  return {
    replace: true,
    restrict: 'A',
    scope: {
      'active': '=?',
      'click': '&'
    },
    templateUrl: 'toolbar-button.html',
    transclude: true
  };
}]);


app.directive('tabbedFile', [
    '$http', '$mdToast', '$timeout', 'hotkeys',
    function($http, $mdToast, $timeout, hotkeys) {

  var load = function(path, scope) {
    scope.error = false;
    scope.loaded = false;
    $http({method: 'GET', url: '/j/get_file' + path})
    .success(function(data, status, headers, config) {
      scope.loaded = true;
      scope.content = data.content;
      scope.savedContent = data.content;
      scope.metadata = data.metadata;
    })
    .error(function(data, status, headers, config) {
      scope.error = true;
      scope.loaded = true;
    });
  };

  var save = function(path, scope) {
    var saveContent = scope.content;
    $http({
      method: 'POST',
      url: '/j/put_file' + path,
      params: {parent_rev: scope.metadata.rev},
      data: saveContent
    })
    .success(function(data, status, headers, config) {
      scope.metadata = data.metadata;
      scope.savedContent = saveContent;
      var message = 'Saved!';
      if (data.conflict) {
        // TODO something smarter here
        message += ' (with conflict)'
      }
      $mdToast.show({
        template: '<md-toast>' + message + '</md-toast>',
        position: 'bottom left'
      });
    })
    .error(function(data, status, headers, config) {
      $mdToast.show({
        template: '<md-toast>' + 'Error!' + '</md-toast>',
        position: 'bottom left'
      });
    });
  };

  return {
    replace: true,
    restrict: 'A',
    scope: {
      'close': '&',
      'tab': '='
    },
    templateUrl: 'tabbed-file.html',
    link: function (scope, element) {
      scope.monospace = true;
      scope.reload = function() {
        load(scope.tab.path, scope);
      };
      scope.save = function() {
        save(scope.tab.path, scope);
      };
      scope.reload();
      scope.autosave = null;
      scope.$watch('content', function(newContent, oldContent) {
        if (newContent === oldContent) {
          return;
        }
        $timeout.cancel(scope.autosave);
        scope.autosave = $timeout(function() {
          if (scope.content != scope.savedContent) {
            scope.save();
          }
        }, AUTOSAVE_TIMEOUT_);
      });

      element.find('textarea').focus();  // TODO
    }
  };
}]);


