var app = angular.module(
    'text-sync', ['cfp.hotkeys', 'ngCookies', 'ngMaterial']);


app.constants = {
  AUTOSAVE_TIMEOUT_: 4000  // milliseconds
};


app.util = {};


app.util.getShortName = function(fileName) {
  var name = /.*\/(.*?)\..*$/.exec(fileName)[1];
  return decodeURIComponent(name);
};


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
          var file = files[i];
          var path = /\/view\/\w+(.*)$/.exec(file.link)[1];
          scope.tabs.push({
            name: app.util.getShortName(path),
            path: path
          });
          scope.$apply(function() {
            scope.selectedTabIndex = scope.tabs.length - 1;
          });
        }
      },
    });
  };

  scope.onConflict = function(tabIndex, tabData, serverData) {
    var existingTab = scope.tabs[tabIndex];
    var newTab = angular.copy(existingTab);

    existingTab.path = serverData.metadata.path;
    existingTab.name = app.util.getShortName(existingTab.path);

    scope.tabs.splice(tabIndex, 0, newTab);

    $timeout(function() {
      scope.selectedTabIndex = tabIndex + 1;
    });
  };

  scope.$watch('tabs.length', function(newLength, oldLength) {
    if (newLength == oldLength) {
      return;
    }
    var selection = scope.selectedTabIndex;
    if (oldLength > newLength) {
      if (selection > 0) {
        selection = selection - 1;
      }
      $timeout(function() {
        scope.selectedTabIndex = selection;
      });
    }
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
        message += ' (with conflict)'
        scope.onConflict({
          tabIndex: scope.tabIndex, tabData: scope.tab, serverData: data});
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
      'onConflict': '&',
      'tab': '=',
      'tabIndex': '='
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
        }, app.constants.AUTOSAVE_TIMEOUT_);
      });

      element.find('textarea').focus();  // TODO
    }
  };
}]);


