(function () {
  angular.module('angularytics', []).provider('Angularytics', function () {
    var eventHandlersNames = ['Google'];
    this.setEventHandlers = function (handlers) {
      if (angular.isString(handlers)) {
        handlers = [handlers];
      }
      eventHandlersNames = [];
      angular.forEach(handlers, function (handler) {
        eventHandlersNames.push(capitalizeHandler(handler));
      });
    };
    var capitalizeHandler = function (handler) {
      return handler.charAt(0).toUpperCase() + handler.substring(1);
    };
    var pageChangeEvent = '$locationChangeSuccess';
    this.setPageChangeEvent = function (newPageChangeEvent) {
      pageChangeEvent = newPageChangeEvent;
    };
    this.$get = [
      '$injector',
      '$rootScope',
      '$location',
      function ($injector, $rootScope, $location) {
        var eventHandlers = [];
        angular.forEach(eventHandlersNames, function (handler) {
          eventHandlers.push($injector.get('Angularytics' + handler + 'Handler'));
        });
        var forEachHandlerDo = function (action) {
          angular.forEach(eventHandlers, function (handler) {
            action(handler);
          });
        };
        var service = {};
        service.init = function () {
        };
        service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
          forEachHandlerDo(function (handler) {
            if (category && action) {
              handler.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
            }
          });
        };
        service.trackPageView = function (url) {
          forEachHandlerDo(function (handler) {
            if (url) {
              handler.trackPageView(url);
            }
          });
        };
        $rootScope.$on(pageChangeEvent, function () {
          service.trackPageView($location.url());
        });
        return service;
      }
    ];
  });
}());
(function () {
  angular.module('angularytics').factory('AngularyticsConsoleHandler', [
    '$log',
    function ($log) {
      var service = {};
      service.trackPageView = function (url) {
        $log.log('URL visited', url);
      };
      service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
        $log.log('Event tracked', category, action, opt_label, opt_value, opt_noninteraction);
      };
      return service;
    }
  ]);
}());
(function () {
  angular.module('angularytics').factory('AngularyticsGoogleHandler', [
    '$log',
    function ($log) {
      var service = {};
      service.trackPageView = function (url) {
        _gaq.push([
          '_set',
          'page',
          url
        ]);
        _gaq.push([
          '_trackPageview',
          url
        ]);
      };
      service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
        _gaq.push([
          '_trackEvent',
          category,
          action,
          opt_label,
          opt_value,
          opt_noninteraction
        ]);
      };
      return service;
    }
  ]).factory('AngularyticsGoogleUniversalHandler', function () {
    var service = {};
    service.trackPageView = function (url) {
      ga('set', 'page', url);
      ga('send', 'pageview', url);
    };
    service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
      ga('send', 'event', category, action, opt_label, opt_value, { 'nonInteraction': opt_noninteraction });
    };
    return service;
  });
}());
(function () {
  angular.module('angularytics').filter('trackEvent', [
    'Angularytics',
    function (Angularytics) {
      return function (entry, category, action, opt_label, opt_value, opt_noninteraction) {
        Angularytics.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
        return entry;
      };
    }
  ]);
}());
/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.0.3
 */
(function(){
angular.module('ngMaterial', [ 'ng', 'ngAnimate', 'material.core', 'material.services.attrBind', 'material.services.compiler', 'material.services.registry', 'material.decorators', 'material.services.aria', "material.components.button","material.components.card","material.components.checkbox","material.components.content","material.components.dialog","material.components.divider","material.components.icon","material.components.linearProgress","material.components.list","material.components.radioButton","material.components.sidenav","material.components.slider","material.components.switch","material.components.tabs","material.components.textField","material.components.toast","material.components.toolbar","material.components.whiteframe"]);
var Constant = {
  KEY_CODE: {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFT_ARROW : 37,
    UP_ARROW : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40
  }
};

  /**
   * Angular Materials initialization function that validates environment
   * requirements.
   */
  angular.module('material.core',['ng'])
    .run(function validateEnvironment() {

      if (angular.isUndefined( window.Hammer )) {
        throw new Error(
          '$materialSwipe requires HammerJS to be preloaded.'
        );
      }

    });





/*
 * iterator is a list facade to easily support iteration and accessors
 *
 * @param items Array list which this iterator will enumerate
 * @param reloop Boolean enables iterator to consider the list as an endless reloop
 */
function iterator(items, reloop) {
  var trueFn = function() { return true; };

  reloop = !!reloop;
  var _items = items || [ ];

  // Published API
  return {
    items: getItems,
    count: count,

    inRange: inRange,
    contains: contains,
    indexOf: indexOf,
    itemAt: itemAt,

    findBy: findBy,

    add: add,
    remove: remove,

    first: first,
    last: last,
    next: next,
    previous: previous,

    hasPrevious: hasPrevious,
    hasNext: hasNext

  };

  /*
   * Publish copy of the enumerable set
   * @returns {Array|*}
   */
  function getItems() {
    return [].concat(_items);
  }

  /*
   * Determine length of the list
   * @returns {Array.length|*|number}
   */
  function count() {
    return _items.length;
  }

  /*
   * Is the index specified valid
   * @param index
   * @returns {Array.length|*|number|boolean}
   */
  function inRange(index) {
    return _items.length && ( index > -1 ) && (index < _items.length );
  }

  /*
   * Can the iterator proceed to the next item in the list; relative to
   * the specified item.
   *
   * @param item
   * @returns {Array.length|*|number|boolean}
   */
  function hasNext(item) {
    return item ? inRange(indexOf(item) + 1) : false;
  }

  /*
   * Can the iterator proceed to the previous item in the list; relative to
   * the specified item.
   *
   * @param item
   * @returns {Array.length|*|number|boolean}
   */
  function hasPrevious(item) {
    return item ? inRange(indexOf(item) - 1) : false;
  }

  /*
   * Get item at specified index/position
   * @param index
   * @returns {*}
   */
  function itemAt(index) {
    return inRange(index) ? _items[index] : null;
  }

  /*
   * Find all elements matching the key/value pair
   * otherwise return null
   *
   * @param val
   * @param key
   *
   * @return array
   */
  function findBy(key, val) {
    return _items.filter(function(item) {
      return item[key] === val;
    });
  }

  /*
   * Add item to list
   * @param item
   * @param index
   * @returns {*}
   */
  function add(item, index) {
    if ( !item ) return -1;

    if (!angular.isNumber(index)) {
      index = _items.length;
    }

    _items.splice(index, 0, item);

    return indexOf(item);
  }

  /*
   * Remove item from list...
   * @param item
   */
  function remove(item) {
    if ( contains(item) ){
      _items.splice(indexOf(item), 1);
    }
  }

  /*
   * Get the zero-based index of the target item
   * @param item
   * @returns {*}
   */
  function indexOf(item) {
    return _items.indexOf(item);
  }

  /*
   * Boolean existence check
   * @param item
   * @returns {boolean}
   */
  function contains(item) {
    return item && (indexOf(item) > -1);
  }

  /*
   * Find the next item. If reloop is true and at the end of the list, it will 
   * go back to the first item. If given ,the `validate` callback will be used
   * determine whether the next item is valid. If not valid, it will try to find the
   * next item again.
   * @param item
   * @param {optional} validate
   * @returns {*}
   */
  function next(item, validate) {
    validate = validate || trueFn;

    if (contains(item)) {
      var index = indexOf(item) + 1,
      found = inRange(index) ? _items[ index ] : (reloop ? first() : null);

      return validate(found) ? found : next(found, validate);
    }

    return null;
  }

  /*
   * Find the previous item. If reloop is true and at the beginning of the list, it will 
   * go back to the last item. If given ,the `validate` callback will be used
   * determine whether the previous item is valid. If not valid, it will try to find the
   * previous item again.
   * @param item
   * @param {optional} validate
   * @returns {*}
   */
  function previous(item, validate) {
    validate = validate || trueFn;

    if (contains(item)) {
      var index = indexOf(item) - 1,
      found = inRange(index) ? _items[ index ] : (reloop ? last() : null);

      return validate(found) ? found : previous(found, validate);
    }

    return null;
  }

  /*
   * Return first item in the list
   * @returns {*}
   */
  function first() {
    return _items.length ? _items[0] : null;
  }

  /*
   * Return last item in the list...
   * @returns {*}
   */
  function last() {
    return _items.length ? _items[_items.length - 1] : null;
  }

}

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

/* for nextUid() function below */
var uid = ['0','0','0'];

var Util = {
  now: window.performance ? angular.bind(performance, performance.now) : Date.now,

  /**
   * Checks if the specified element has an ancestor (ancestor being parent, grandparent, etc)
   * with the given attribute defined. 
   *
   * Also pass in an optional `limit` (levels of ancestry to scan), default 4.
   */
  ancestorHasAttribute: function ancestorHasAttribute(element, attrName, limit) {
    limit = limit || 4;
    var current = element;
    while (limit-- && current.length) {
      if (current[0].hasAttribute && current[0].hasAttribute(attrName)) {
        return true;
      }
      current = current.parent();
    }
    return false;
  },

  /**
   * Checks to see if the element or its parents are disabled.
   * @param element DOM element to start scanning for `disabled` attribute
   * @param limit Number of parent levels that should be scanned; defaults to 4
   * @returns {*} Boolean
   */
  isParentDisabled: function isParentDisabled(element, limit) {
    return Util.ancestorHasAttribute(element, 'disabled', limit);
  },

  /**
   * Checks if two elements have the same parent
   */
  elementIsSibling: function elementIsSibling(element, otherElement) {
    return element.parent().length && 
      (element.parent()[0] === otherElement.parent()[0]);
  },

  /**
   * Converts snake_case to camelCase.
   * @param name Name to normalize
   */
  camelCase: function camelCase(name) {
    return name
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
  },

  /**
   * Selects 'n' words from a string
   * for use in an HTML attribute
   */
  stringFromTextBody: function stringFromTextBody(textBody, numWords) {
    var string = textBody.trim();

    if(string.split(/\s+/).length > numWords){
      string = textBody.split(/\s+/).slice(1, (numWords + 1)).join(" ") + '...';
    }
    return string;
  },

  /**
   * Publish the iterator facade to easily support iteration and accessors
   * @see iterator.js
   */
  iterator: iterator,

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce: function debounce(func, wait, immediate) {
    var timeout;
    return function debounced() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  },

  // Returns a function that can only be triggered every `delay` milliseconds.
  // In other words, the function will not be called unless it has been more
  // than `delay` milliseconds since the last call.
  throttle: function throttle(func, delay) {
    var recent;
    return function throttled() {
      var context = this;
      var args = arguments;
      var now = Util.now();

      if (!recent || recent - now > delay) {
        func.apply(context, args);
        recent = now;
      }
    };
  },

  /**
   * nextUid, from angular.js.
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */
  nextUid: function() {
    var index = uid.length;
    var digit;

    while(index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57 /*'9'*/) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90  /*'Z'*/) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  },

  // Stop watchers and events from firing on a scope without destroying it,
  // by disconnecting it from its parent and its siblings' linked lists.
  disconnectScope: function disconnectScope(scope) {
    if (!scope) return;

    // we can't destroy the root scope or a scope that has been already destroyed
    if (scope.$root === scope) return;
    if (scope.$$destroyed ) return;

    var parent = scope.$parent;
    scope.$$disconnected = true;

    // See Scope.$destroy
    if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
    if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
    if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
    if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

    scope.$$nextSibling = scope.$$prevSibling = null;

  },

  // Undo the effects of disconnectScope above.
  reconnectScope: function reconnectScope(scope) {
    if (!scope) return;

    // we can't disconnect the root node or scope already disconnected
    if (scope.$root === scope) return;
    if (!scope.$$disconnected) return;

    var child = scope;

    var parent = child.$parent;
    child.$$disconnected = false;
    // See Scope.$new for this logic...
    child.$$prevSibling = parent.$$childTail;
    if (parent.$$childHead) {
      parent.$$childTail.$$nextSibling = child;
      parent.$$childTail = child;
    } else {
      parent.$$childHead = parent.$$childTail = child;
    }
  }

};

/* 
 * Since removing jQuery from the demos, some code that uses `element.focus()` is broken.
 *
 * We need to add `element.focus()`, because it's testable unlike `element[0].focus`.
 *
 * TODO(ajoslin): This should be added in a better place later.
 */
angular.element.prototype.focus = angular.element.prototype.focus || function() {
  if (this.length) {
    this[0].focus();
  }
  return this;
};
angular.element.prototype.blur = angular.element.prototype.blur || function() {
  if (this.length) {
    this[0].blur();
  }
  return this;
};

/**
 * @ngdoc module
 * @name material.components.animate
 * @description
 *
 * Ink and Popup Effects
 */
angular.module('material.animations', [])
  .service('$materialEffects', [ 
    '$rootElement', 
    '$$rAF', 
    '$sniffer',
    '$q',
    MaterialEffects
  ]);

/**
 * @ngdoc service
 * @name $materialEffects
 * @module material.components.animate
 *
 * @description
 * The `$materialEffects` service provides a simple API for various
 * Material Design effects.
 *
 * @returns A `$materialEffects` object with the following properties:
 * - `{function(element,styles,duration)}` `inkBar` - starts ink bar
 * animation on specified DOM element
 * - `{function(element,parentElement,clickElement)}` `popIn` - animated show of element overlayed on parent element
 * - `{function(element,parentElement)}` `popOut` - animated close of popup overlay
 *
 */
function MaterialEffects($rootElement, $$rAF, $sniffer, $q) {

  var webkit = /webkit/i.test($sniffer.vendorPrefix);
  function vendorProperty(name) {
    return webkit ? 
      ('webkit' + name.charAt(0).toUpperCase() + name.substring(1)) :
      name;
  }

  var self;
  // Publish API for effects...
  return self = {
    popIn: popIn,

    /* Constants */
    TRANSITIONEND_EVENT: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
    ANIMATIONEND_EVENT: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

    TRANSFORM: vendorProperty('transform'),
    TRANSITION: vendorProperty('transition'),
    TRANSITION_DURATION: vendorProperty('transitionDuration'),
    ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
    ANIMATION_DURATION: vendorProperty('animationDuration'),
    ANIMATION_NAME: vendorProperty('animationName'),
    ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
    ANIMATION_DIRECTION: vendorProperty('animationDirection')
  };

  // **********************************************************
  // API Methods
  // **********************************************************
  function popIn(element, parentElement, clickElement) {
    var deferred = $q.defer();
    parentElement.append(element);

    var startPos;
    if (clickElement) {
      var clickRect = clickElement[0].getBoundingClientRect();
      startPos = translateString(
        clickRect.left - element[0].offsetWidth,
        clickRect.top - element[0].offsetHeight, 
        0
      ) + ' scale(0.2)';
    } else {
      startPos = 'translate3d(0,100%,0) scale(0.5)';
    }

    element
      .css(self.TRANSFORM, startPos)
      .css('opacity', 0);
    
    $$rAF(function() {
      $$rAF(function() {
        element
          .addClass('active')
          .css(self.TRANSFORM, '')
          .css('opacity', '')
          .on(self.TRANSITIONEND_EVENT, finished);
      });
    });

    function finished(ev) {
      //Make sure this transitionend didn't bubble up from a child
      if (ev.target === element[0]) {
        element.off(self.TRANSITIONEND_EVENT, finished);
        deferred.resolve();
      }
    }

    return deferred.promise;
  }

  // **********************************************************
  // Utility Methods
  // **********************************************************


  function translateString(x, y, z) {
    return 'translate3d(' + Math.floor(x) + 'px,' + Math.floor(y) + 'px,' + Math.floor(z) + 'px)';
  }

}


(function() {

angular.module('material.animations')

/**
 * noink/nobar/nostretch directive: make any element that has one of
 * these attributes be given a controller, so that other directives can 
 * `require:` these and see if there is a `no<xxx>` parent attribute.
 *
 * @usage
 * <hljs lang="html">
 * <parent noink>
 *   <child detect-no>
 *   </child>
 * </parent>
 * </hljs>
 *
 * <hljs lang="js">
 * myApp.directive('detectNo', function() {
 *   return {
 *     require: ['^?noink', ^?nobar'],
 *     link: function(scope, element, attr, ctrls) {
 *       var noinkCtrl = ctrls[0];
 *       var nobarCtrl = ctrls[1];
 *       if (noInkCtrl) {
 *         alert("the noink flag has been specified on an ancestor!");
 *       }
 *       if (nobarCtrl) {
 *         alert("the nobar flag has been specified on an ancestor!");
 *       }
 *     }
 *   };
 * });
 * </hljs>
 */
.directive({
  noink: attrNoDirective(),
  nobar: attrNoDirective(),
  nostretch: attrNoDirective()
});

function attrNoDirective() {
  return function() {
    return {
      controller: angular.noop
    };
  };
}

})();


angular.module('material.animations')

.directive('inkRipple', [
  '$materialInkRipple',
  InkRippleDirective
])

.factory('$materialInkRipple', [
  '$window',
  '$$rAF',
  '$materialEffects',
  '$timeout',
  InkRippleService
]);

function InkRippleDirective($materialInkRipple) {
  return function(scope, element, attr) {
    if (attr.inkRipple == 'checkbox') {
      $materialInkRipple.attachCheckboxBehavior(element);
    } else {
      $materialInkRipple.attachButtonBehavior(element);
    }
  };
}

function InkRippleService($window, $$rAF, $materialEffects, $timeout) {

  // TODO fix this. doesn't support touch AND click devices (eg chrome pixel)
  var hasTouch = !!('ontouchend' in document);
  var POINTERDOWN_EVENT = hasTouch ? 'touchstart' : 'mousedown';
  var POINTERUP_EVENT = hasTouch ? 'touchend touchcancel' : 'mouseup mouseleave';

  return {
    attachButtonBehavior: attachButtonBehavior,
    attachCheckboxBehavior: attachCheckboxBehavior,
    attach: attach
  };

  function attachButtonBehavior(element) {
    return attach(element, {
      mousedown: true,
      center: false,
      animationDuration: 350,
      mousedownPauseTime: 175,
      animationName: 'inkRippleButton',
      animationTimingFunction: 'linear'
    });
  }

  function attachCheckboxBehavior(element) {
    return attach(element, {
      mousedown: true,
      center: true,
      animationDuration: 300,
      mousedownPauseTime: 180,
      animationName: 'inkRippleCheckbox',
      animationTimingFunction: 'linear'
    });
  }

  function attach(element, options) {
    // Parent element with noink attr? Abort.
    if (element.controller('noink')) return angular.noop;

    options = angular.extend({
      mousedown: true,
      hover: true,
      focus: true,
      center: false,
      animationDuration: 300,
      mousedownPauseTime: 150,
      animationName: '',
      animationTimingFunction: 'linear'
    }, options || {});

    var rippleContainer;
    var node = element[0];

    if (options.mousedown) {
      listenPointerDown(true);
    }

    // Publish self-detach method if desired...
    return function detach() {
      listenPointerDown(false);
      if (rippleContainer) {
        rippleContainer.remove();
      }
    };

    function listenPointerDown(shouldListen) {
      element[shouldListen ? 'on' : 'off'](POINTERDOWN_EVENT, onPointerDown);
    }

    function rippleIsAllowed() {
      return !Util.isParentDisabled(element);
    }

    function createRipple(left, top, positionsAreAbsolute) {

      var rippleEl = angular.element('<div class="material-ripple">')
            .css($materialEffects.ANIMATION_DURATION, options.animationDuration + 'ms')
            .css($materialEffects.ANIMATION_NAME, options.animationName)
            .css($materialEffects.ANIMATION_TIMING, options.animationTimingFunction)
            .on($materialEffects.ANIMATIONEND_EVENT, function() {
              rippleEl.remove();
            });

      if (!rippleContainer) {
        rippleContainer = angular.element('<div class="material-ripple-container">');
        element.append(rippleContainer);
      }
      rippleContainer.append(rippleEl);

      var containerWidth = rippleContainer.prop('offsetWidth');

      if (options.center) {
        left = containerWidth / 2;
        top = rippleContainer.prop('offsetHeight') / 2;
      } else if (positionsAreAbsolute) {
        var elementRect = node.getBoundingClientRect();
        left -= elementRect.left;
        top -= elementRect.top;
      }

      var css = {
        'background-color': $window.getComputedStyle(rippleEl[0]).color || 
          $window.getComputedStyle(node).color,
        'border-radius': (containerWidth / 2) + 'px',

        left: (left - containerWidth / 2) + 'px',
        width: containerWidth + 'px',

        top: (top - containerWidth / 2) + 'px',
        height: containerWidth + 'px'
      };
      css[$materialEffects.ANIMATION_DURATION] = options.fadeoutDuration + 'ms';
      rippleEl.css(css);

      return rippleEl;
    }

    function onPointerDown(ev) {
      if (!rippleIsAllowed()) return;

      var rippleEl = createRippleFromEvent(ev);
      var ripplePauseTimeout = $timeout(pauseRipple, options.mousedownPauseTime, false);
      rippleEl.on('$destroy', cancelRipplePause);

      // Stop listening to pointer down for now, until the user lifts their finger/mouse
      listenPointerDown(false);
      element.on(POINTERUP_EVENT, onPointerUp);

      function onPointerUp() {
        cancelRipplePause();
        rippleEl.css($materialEffects.ANIMATION_PLAY_STATE, 'running');
        element.off(POINTERUP_EVENT, onPointerUp);
        listenPointerDown(true);
      }
      function pauseRipple() {
        rippleEl.css($materialEffects.ANIMATION_PLAY_STATE, 'paused');
      }
      function cancelRipplePause() {
        $timeout.cancel(ripplePauseTimeout);
      }

      function createRippleFromEvent(ev) {
        ev = ev.touches ? ev.touches[0] : ev;
        return createRipple(ev.pageX, ev.pageY, true);
      }
    }
  }

}

/**
 * @ngdoc module
 * @name material.components.buttons
 * @description
 *
 * Button
 */
angular.module('material.components.button', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialButton', [
    'ngHrefDirective',
    '$materialInkRipple',
    '$aria',
    MaterialButtonDirective
  ]);

/**
 * @ngdoc directive
 * @name materialButton
 * @order 0
 *
 * @restrict E
 *
 * @description
 * `<material-button>` is a button directive with optional ink ripples (default enabled).
 *
 * @param {boolean=} noink Flag indicates use of ripple ink effects
 * @param {boolean=} disabled Flag indicates if the tab is disabled: not selectable with no ink effects
 * @param {string=} type Optional attribute to specific button types (useful for forms); such as 'submit', etc.
 * @param {string=} ng-href Optional attribute to support both ARIA and link navigation
 * @param {string=} href Optional attribute to support both ARIA and link navigation
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the button's text.
 *
 * @usage
 * <hljs lang="html">
 *  <material-button>Button</material-button>
 *  <br/>
 *  <material-button noink class="material-button-colored">
 *    Button (noInk)
 *  </material-button>
 *  <br/>
 *  <material-button disabled class="material-button-colored">
 *    Colored (disabled)
 *  </material-button>
 * </hljs>
 */
function MaterialButtonDirective(ngHrefDirectives, $materialInkRipple, $aria ) {
  var ngHrefDirective = ngHrefDirectives[0];

  return {
    restrict: 'E',
    compile: function(element, attr) {
      var innerElement;
      var attributesToCopy;

      // Add an inner anchor if the element has a `href` or `ngHref` attribute,
      // so this element can be clicked like a normal `<a>`.
      if (attr.ngHref || attr.href) {
        innerElement = angular.element('<a>');
        attributesToCopy = ['ng-href', 'href', 'rel', 'target'];
      // Otherwise, just add an inner button element (for form submission etc)
      } else {
        innerElement = angular.element('<button>');
        attributesToCopy = ['type', 'disabled', 'ng-disabled', 'form'];
      }

      angular.forEach(attributesToCopy, function(name) {
        var camelCaseName = Util.camelCase(name);
        if (attr.hasOwnProperty(camelCaseName)) {
          innerElement.attr(name, attr[camelCaseName]);
        }
      });

      innerElement
        .addClass('material-button-inner')
        .append(element.contents())
        // Since we're always passing focus to the inner element,
        // add a focus class to the outer element so we can still style
        // it with focus.
        .on('focus', function() {
          element.addClass('focus');
        })
        .on('blur', function() {
          element.removeClass('focus');
        });

      element.
        append(innerElement)
        .attr('tabIndex', -1)
        //Always pass focus to innerElement
        .on('focus', function() {
          innerElement.focus();
        });

      return function postLink(scope, element, attr) {
        $aria.expect(element, 'aria-label', element.text());
        $materialInkRipple.attachButtonBehavior(element);
      };
    }
  };

}

/**
 * @ngdoc module
 * @name material.components.card
 *
 * @description
 * Card components.
 */
angular.module('material.components.card', [
])
  .directive('materialCard', [
    materialCardDirective 
  ]);



/**
 * @ngdoc directive
 * @name materialCard
 * @module material.components.card
 *
 * @restrict E
 *
 * @description
 * The `<material-card>` directive is a container element used within `<material-content>` containers.
 *
 * Cards have constant width and variable heights; where the maximum height is limited to what can
 * fit within a single view on a platform, but it can temporarily expand as needed
 *
 * @usage
 * <hljs lang="html">
 * <material-card>
 *  <img src="/img/washedout.png" class="material-card-image">
 *  <h2>Paracosm</h2>
 *  <p>
 *    The titles of Washed Out's breakthrough song and the first single from Paracosm share the * two most important words in Ernest Greene's musical language: feel it. It's a simple request, as well...
 *  </p>
 * </material-card>
 * </hljs>
 *
 */
function materialCardDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module('material.components.checkbox', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialCheckbox', [ 
    'inputDirective',
    '$materialInkRipple',
    '$aria',
    MaterialCheckboxDirective
  ]);

/**
 * @ngdoc directive
 * @name materialCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
 * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} noink Use of attribute indicates use of ripple ink effects
 * @param {boolean=} disabled Use of attribute indicates the switch is disabled: no ink effects and not selectable
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the checkbox's text.
 *
 * @usage
 * <hljs lang="html">
 * <material-checkbox ng-model="isChecked" aria-label="Finished?">
 *   Finished ?
 * </material-checkbox>
 *
 * <material-checkbox noink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </material-checkbox>
 *
 * <material-checkbox disabled ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </material-checkbox>
 *
 * </hljs>
 *
 */
function MaterialCheckboxDirective(inputDirectives, $materialInkRipple, $aria) {
  var inputDirective = inputDirectives[0];

  var CHECKED_CSS = 'material-checked';

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    template: 
      '<div class="material-container" ink-ripple="checkbox">' +
        '<div class="material-icon"></div>' +
      '</div>' +
      '<div ng-transclude class="material-label"></div>',
    link: postLink
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function postLink(scope, element, attr, ngModelCtrl) {
    var checked = false;

    // Create a mock ngModel if the user doesn't provide one
    ngModelCtrl = ngModelCtrl || {
      $setViewValue: function(value) {
        this.$viewValue = value;
      },
      $parsers: [],
      $formatters: []
    };

    // Reuse the original input[type=checkbox] directive from Angular core.
    // This is a bit hacky as we need our own event listener and own render 
    // function.
    attr.type = 'checkbox';
    attr.tabIndex = 0;
    inputDirective.link(scope, {
      on: angular.noop,
      0: {}
    }, attr, [ngModelCtrl]);

    // We can't chain element.attr here because of a bug with jqLite
    element.attr('aria-checked', checked);
    element.attr('role', attr.type);
    element.attr('tabIndex', attr.tabIndex);
    element.on('click', listener);
    element.on('keypress', keypressHandler);
    ngModelCtrl.$render = render;

    $aria.expect(element, 'aria-label', element.text());

    function keypressHandler(ev) {
      if(ev.which === Constant.KEY_CODE.SPACE) {
        ev.preventDefault();
        listener(ev);
      }
    }
    function listener(ev) {
      if (element[0].hasAttribute('disabled')) return;

      scope.$apply(function() {
        checked = !checked;
        ngModelCtrl.$setViewValue(checked, ev && ev.type);
        ngModelCtrl.$render();
      });
    }

    function render() {
      checked = ngModelCtrl.$viewValue;
      element.attr('aria-checked', checked);
      if(checked) {
        element.addClass(CHECKED_CSS);
      } else {
        element.removeClass(CHECKED_CSS);
      }
    }
  }

}



/**
 * @ngdoc module
 * @name material.components.content
 *
 * @description
 * Scrollable content
 */
angular.module('material.components.content', [
  'material.services.registry'
])
  .directive('materialContent', [
    materialContentDirective
  ]);

/**
 * @ngdoc directive
 * @name materialContent
 * @module material.components.content
 *
 * @restrict E
 *
 * @description
 * The `<material-content>` directive is a container element useful for scrollable content
 *
 * @usage
 * <hljs lang="html">
 *  <material-content class="material-content-padding">
 *      Lorem ipsum dolor sit amet, ne quod novum mei.
 *  </material-content>
 * </hljs>
 *
 */
function materialContentDirective() {
  return {
    restrict: 'E',
    controller: angular.noop,
    link: function($scope, $element, $attr) {
      $scope.$broadcast('$materialContentLoaded', $element);
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.dialog
 */
angular.module('material.components.dialog', [
  'material.animations',
  'material.services.compiler',
  'material.services.aria',
  'material.services.interimElement',
])
  .directive('materialDialog', [
    '$$rAF',
    MaterialDialogDirective
  ])
  .factory('$materialDialog', [
    '$timeout',
    '$rootElement',
    '$materialEffects',
    '$animate',
    '$aria',
    '$$interimElement',
    MaterialDialogService
  ]);

function MaterialDialogDirective($$rAF) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      $$rAF(function() {
        var content = element[0].querySelector('.dialog-content');
        if (content && content.scrollHeight > content.clientHeight) {
          element.addClass('dialog-content-overflow');
        }
      });
    }
  };
}

/**
 * @ngdoc service
 * @name $materialDialog
 * @module material.components.dialog
 *
 * @description
 *
 * The $materialDialog service opens a dialog over top of the app. 
 *
 * Note: The dialog is always given an isolate scope.
 *
 * `$materialDialog` is an `$interimElement` service and adheres to the same behaviors.
 *  - `$materialDialog.show()`
 *  - `$materialDialog.hide()`
 *  - `$materialDialog.cancel()`
 *
 * Note: the dialog's template must have an outer `<material-dialog>` element. 
 * Inside, use an element with class `dialog-content` for the dialog's content, and use
 * an element with class `dialog-actions` for the dialog's actions.  
 *
 * When opened, the `dialog-actions` area will attempt to focus the first button found with 
 * class `dialog-close`. If no button with `dialog-close` class is found, it will focus the
 * last button in the `dialog-actions` area.
 *
 * @usage
 * <hljs lang="html">
 * <div ng-controller="MyController">
 *   <material-button ng-click="openDialog($event)">
 *     Open a Dialog from this button!
 *   </material-button>
 * </div>
 * </hljs>
 * <hljs lang="js">
 * var app = angular.module('app', ['ngMaterial']);
 * app.controller('MyController', function($scope, $materialDialog) {
 *   $scope.openDialog = function($event) {
 *     $materialDialog.show({
 *       template: '<material-dialog>Hello!</material-dialog>',
 *       targetEvent: $event
 *     });
 *   };
 * });
 * </hljs>
 *
 */

/**
 *
 * @ngdoc method
 * @name $materialDialog#show
 *
 * @description
 * Show a dialog with the specified options
 *
 * @paramType Options
 * @param {string=} templateUrl The url of a template that will be used as the content
 * of the dialog. 
 * @param {string=} template Same as templateUrl, except this is an actual template string.
 * @param {DOMClickEvent=} targetEvent A click's event object. When passed in as an option, 
 * the location of the click will be used as the starting point for the opening animation
 * of the the dialog.
 * @param {boolean=} hasBackdrop Whether there should be an opaque backdrop behind the dialog.
 *   Default true.
 * @param {boolean=} clickOutsideToClose Whether the user can click outside the dialog to
 *   close it. Default true.
 * @param {boolean=} escapeToClose Whether the user can press escape to close the dialog.
 *   Default true.
 * @param {string=} controller The controller to associate with the dialog. The controller
 * will be injected with the local `$hideDialog`, which is a function used to hide the dialog.
 * @param {object=} locals An object containing key/value pairs. The keys will be used as names
 * of values to inject into the controller. For example, `locals: {three: 3}` would inject
 * `three` into the controller, with the value 3.
 * @param {object=} resolve Similar to locals, except it takes promises as values, and the
 * toast will not open until all of the promises resolve.
 * @param {string=} controllerAs An alias to assign the controller to on the scope.
 * @param {element=} parent The element to append the dialog to. Defaults to appending
 *   to the root element of the application.
 *
 * @returns {Promise} Returns a promise that will be resolved or rejected when
 *  `$materialDialog.hide()` or `$materialDialog.cancel()` is called respectively.
 */

/**
 * @ngdoc method
 * @name $materialDialog#hide
 *
 * @description
 * Hide an existing dialog and `resolve` the promise returned from `$materialDialog.show()`.
 *
 * @param {*} arg An argument to resolve the promise with.
 *
 */

/**
 * @ngdoc method
 * @name $materialDialog#cancel
 *
 * @description
 * Hide an existing dialog and `reject` the promise returned from `$materialDialog.show()`.
 *
 * @param {*} arg An argument to reject the promise with.
 *
 */

function MaterialDialogService($timeout, $rootElement, $materialEffects, $animate, $aria, $$interimElement) {

  var $dialogService;
  return $dialogService = $$interimElement({
    hasBackdrop: true,
    isolateScope: true,
    onShow: onShow,
    onRemove: onRemove,
    clickOutsideToClose: true,
    escapeToClose: true,
    targetEvent: null,
    transformTemplate: function(template) {
      return '<div class="material-dialog-container">' + template + '</div>';
    }
  });

  function onShow(scope, element, options) {
    // Incase the user provides a raw dom element, always wrap it in jqLite
    options.parent = angular.element(options.parent);

    options.popInTarget = angular.element((options.targetEvent || {}).target); 
    var closeButton = findCloseButton();

    configureAria(element.find('material-dialog'));

    if (options.hasBackdrop) {
      var backdrop = angular.element('<material-backdrop class="opaque ng-enter">');
      $animate.enter(backdrop, options.parent, null);
      options.backdrop = backdrop;
    }

    return $materialEffects.popIn(
      element, 
      options.parent, 
      options.popInTarget.length && options.popInTarget
    )
    .then(function() {
      if (options.escapeToClose) {
        options.rootElementKeyupCallback = function(e) {
          if (e.keyCode === Constant.KEY_CODE.ESCAPE) {
            $timeout($dialogService.hide);
          }
        };

        $rootElement.on('keyup', options.rootElementKeyupCallback);
      }

      if (options.clickOutsideToClose) {
        options.dialogClickOutsideCallback = function(e) {
          // Only close if we click the flex container outside the backdrop
          if (e.target === element[0]) {
            $timeout($dialogService.hide);
          }
        };

        element.on('click', options.dialogClickOutsideCallback);
      }
      closeButton.focus();
    });


    function findCloseButton() {
      //If no element with class dialog-close, try to find the last
      //button child in dialog-actions and assume it is a close button
      var closeButton = element[0].querySelector('.dialog-close');
      if (!closeButton) {
        var actionButtons = element[0].querySelectorAll('.dialog-actions button');
        closeButton = actionButtons[ actionButtons.length - 1 ];
      }
      return angular.element(closeButton);
    }

  }

  function onRemove(scope, element, options) {

    if (options.backdrop) {
      $animate.leave(options.backdrop);
      element.data('backdrop', undefined);
    }
    if (options.escapeToClose) {
      $rootElement.off('keyup', options.rootElementKeyupCallback);
    }
    if (options.clickOutsideToClose) {
      element.off('click', options.dialogClickOutsideCallback);
    }
    return $animate.leave(element).then(function() {
      element.remove();
      options.popInTarget && options.popInTarget.focus();
    });

  }

  /**
   * Inject ARIA-specific attributes appropriate for Dialogs
   */
  function configureAria(element) {
    element.attr({
      'role': 'dialog'
    });

    var dialogContent = element.find('.dialog-content');
    if (dialogContent.length === 0){
      dialogContent = element;
    }
    var defaultText = Util.stringFromTextBody(dialogContent.text(), 3);
    $aria.expect(element, 'aria-label', defaultText);
  }
}

/**
 * @ngdoc module
 * @name material.components.textField
 * @description
 * Form
 */
angular.module('material.components.textField', [])
  .directive('materialInputGroup', [
    materialInputGroupDirective
  ])
  .directive('materialInput', [
    materialInputDirective
  ]);

/**
 * @ngdoc directive
 * @name materialInputGroup
 * @module material.components.textField
 * @restrict E
 * @description
 * Use the `<material-input-group>` directive as the grouping parent of a `<material-input>` element.
 *
 * @usage 
 * <hljs lang="html">
 * <material-input-group>
 *   <material-input type="text" ng-model="myText"></material-input>
 * </material-input-group>
 * </hljs>
 */
function materialInputGroupDirective() {
  return {
    restrict: 'CE',
    controller: ['$element', function($element) {
      this.setFocused = function(isFocused) {
        $element.toggleClass('material-input-focused', !!isFocused);
      };
      this.setHasValue = function(hasValue) {
        $element.toggleClass('material-input-has-value', !!hasValue);
      };
    }]
  };
}

/**
 * @ngdoc directive
 * @name materialInput
 * @module material.components.textField
 *
 * @restrict E
 *
 * @description
 * Use the `<material-input>` directive as elements within a `<material-input-group>` container
 *
 * @usage
 * <hljs lang="html">
 * <material-input-group>
 *   <material-input type="text" ng-model="user.fullName"></material-input>
 *   <material-input type="text" ng-model="user.email"></material-input>
 * </material-input-group>
 * </hljs>
 */
function materialInputDirective() {
  return {
    restrict: 'E',
    replace: true,
    template: '<input>',
    require: ['^?materialInputGroup', '?ngModel'],
    link: function(scope, element, attr, ctrls) {
      var inputGroupCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      if (!inputGroupCtrl) {
        return;
      }

      // When the input value changes, check if it "has" a value, and 
      // set the appropriate class on the input group
      if (ngModelCtrl) {
        ngModelCtrl.$viewChangeListeners.push(function() {
          inputGroupCtrl.setHasValue(!!ngModelCtrl.$viewValue);
        });
        ngModelCtrl.$render = function() {
          inputGroupCtrl.setHasValue(!!ngModelCtrl.$viewValue);
        };
      }
      element.on('input', function() {
        inputGroupCtrl.setHasValue(!!element.val());
      });

      // When the input focuses, add the focused class to the group
      element.on('focus', function(e) {
        inputGroupCtrl.setFocused(true);
      });
      // When the input blurs, remove the focused class from the group
      element.on('blur', function(e) {
        inputGroupCtrl.setFocused(false);
      });

      scope.$on('$destroy', function() {
        inputGroupCtrl.setFocused(false);
        inputGroupCtrl.setHasValue(false);
      });
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.components.icon', [])
  .directive('materialIcon', [
    materialIconDirective
  ]);

/**
 * @ngdoc directive
 * @name materialIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `<material-icon>` directive is an element useful for SVG icons
 *
 * @usage
 * <hljs lang="html">
 *  <material-icon icon="/img/icons/ic_access_time_24px.svg">
 *  </material-icon>
 * </hljs>
 *
 */
function materialIconDirective() {
  return {
    restrict: 'E',
    template: '<object class="material-icon"></object>',
    compile: function(element, attr) {
      var object = angular.element(element[0].children[0]);
      if(angular.isDefined(attr.icon)) {
        object.attr('data', attr.icon);
      }
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.list
 * @description
 * List module
 */
angular.module('material.components.list', [])

.directive('materialList', [
  materialListDirective
])
.directive('materialItem', [
  materialItemDirective
]);

/**
 * @ngdoc directive
 * @name materialList
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * The `<material-list>` directive is a list container for 1..n `<material-item>` tags.
 *
 * @usage
 * <hljs lang="html">
 * <material-list>
 *  <material-item ng-repeat="item in todos">
 *    <div class="material-tile-left">
 *      <img ng-src="{{item.face}}" class="face" alt="{{item.who}}">
 *    </div>
 *    <div class="material-tile-content">
 *      <h2>{{item.what}}</h2>
 *      <h3>{{item.who}}</h3>
 *      <p>
 *        {{item.notes}}
 *      </p>
 *    </div>
 *
 *  </material-item>
 * </material-list>
 * </hljs>
 *
 */
function materialListDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $element.attr({
        'role' : 'list'
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name materialItem
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * The `<material-item>` directive is a container intended for row items in a `<material-list>` container.
 *
 * @usage
 * <hljs lang="html">
 *  <material-list>
 *    <material-item>
 *            Item content in list
 *    </material-item>
 *  </material-list>
 * </hljs>
 *
 */
function materialItemDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $element.attr({
        'role' : 'listitem'
      });
    }
  };
}


/**
 * @ngdoc module
 * @name material.components.radioButton
 * @description radioButton module!
 */
angular.module('material.components.radioButton', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialRadioGroup', [
    materialRadioGroupDirective
  ])
  .directive('materialRadioButton', [
    '$aria',
    materialRadioButtonDirective
  ]);

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name materialRadioGroup
 *
 * @order 0
 * @restrict E
 *
 * @description
 * The `<material-radio-group>` directive identifies a grouping
 * container for the 1..n grouped material radio buttons; specified using nested
 * `<material-radio-button>` tags.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {boolean=} noink Use of attribute indicates flag to disable ink ripple effects.
 *
 * @usage
 * <hljs lang="html">
 * <material-radio-group ng-model="selected">
 *
 *   <material-radio-button
 *        ng-repeat="d in colorOptions"
 *        ng-value="d.value" aria-label="{{ d.label }}">
 *
 *          {{ d.label }}
 *
 *   </material-radio-button>
 *
 * </material-radio-group>
 * </hljs>
 *
 */
function materialRadioGroupDirective() {
  RadioGroupController.prototype = createRadioGroupControllerProto();

  return {
    restrict: 'E',
    controller: ['$element', RadioGroupController],
    require: ['materialRadioGroup', '?ngModel'],
    link: link
  };

  function link(scope, element, attr, ctrls) {
    var rgCtrl = ctrls[0],
      ngModelCtrl = ctrls[1] || {
        $setViewValue: angular.noop
      };

    function keydownListener(ev) {
      if (ev.which === Constant.KEY_CODE.LEFT_ARROW || ev.which === Constant.KEY_CODE.UP_ARROW) {
        ev.preventDefault();
        rgCtrl.selectPrevious();
      }
      else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW || ev.which === Constant.KEY_CODE.DOWN_ARROW) {
        ev.preventDefault();
        rgCtrl.selectNext();
      }
    }

    rgCtrl.init(ngModelCtrl);

    element.attr({
      'role': 'radiogroup',
      'tabIndex': '0'
    })
    .on('keydown', keydownListener);
  }

  function RadioGroupController($element) {
    this._radioButtonRenderFns = [];
    this.$element = $element;
  }

  function createRadioGroupControllerProto() {
    return {
      init: function(ngModelCtrl) {
        this._ngModelCtrl = ngModelCtrl;
        this._ngModelCtrl.$render = angular.bind(this, this.render);
      },
      add: function(rbRender) {
        this._radioButtonRenderFns.push(rbRender);
      },
      remove: function(rbRender) {
        var index = this._radioButtonRenderFns.indexOf(rbRender);
        if (index !== -1) {
          this._radioButtonRenderFns.splice(index, 1);
        }
      },
      render: function() {
        this._radioButtonRenderFns.forEach(function(rbRender) {
          rbRender();
        });
      },
      setViewValue: function(value, eventType) {
        this._ngModelCtrl.$setViewValue(value, eventType);
        // update the other radio buttons as well
        this.render();
      },
      getViewValue: function() {
        return this._ngModelCtrl.$viewValue;
      },
      selectNext: function() {
        return changeSelectedButton(this.$element, 1);
      },
      selectPrevious : function() {
        return changeSelectedButton(this.$element, -1);
      },
      setActiveDescendant: function (radioId) {
        this.$element.attr('aria-activedescendant', radioId);
      }
    };
  }
  /**
   * Change the radio group's selected button by a given increment.
   * If no button is selected, select the first button.
   */
  function changeSelectedButton(parent, selectionIncrement) {
    // Coerce all child radio buttons into an array
    var buttons = Array.prototype.slice.call(
      parent[0].querySelectorAll('material-radio-button')
    );

    if (buttons.length) {
      var selected = parent[0].querySelector('material-radio-button.material-checked');
      var target = buttons[buttons.indexOf(selected) + selectionIncrement] || buttons[0];
      // Activate radioButton's click listener (triggerHandler won't create a real click event)
      angular.element(target).triggerHandler('click');
    }
  }

}

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name materialRadioButton
 *
 * @order 1
 * @restrict E
 *
 * @description
 * The `<material-radio-button>`directive is the child directive required to be used within `<material-radioo-group>` elements.
 *
 * While similar to the `<input type="radio" ng-model="" value="">` directive,
 * the `<material-radio-button>` directive provides material ink effects, ARIA support, and
 * supports use within named radio groups.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {string} ngValue Angular expression which sets the value to which the expression should
 *    be set when selected.*
 * @param {string} value The value to which the expression should be set when selected.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the radio button's text.
 *
 * @usage
 * <hljs lang="html">
 *
 * <material-radio-button value="1" aria-label="Label 1">
 *   Label 1
 * </material-radio-button>
 *
 * <material-radio-button ng-model="color" ng-value="specialValue" aria-label="Green">
 *   Green
 * </material-radio-button>
 *
 * </hljs>
 *
 */
function materialRadioButtonDirective($aria) {

  var CHECKED_CSS = 'material-checked';

  return {
    restrict: 'E',
    require: '^materialRadioGroup',
    transclude: true,
    template: '<div class="material-container" ink-ripple="checkbox">' +
                '<div class="material-off"></div>' +
                '<div class="material-on"></div>' +
              '</div>' +
              '<div ng-transclude class="material-label"></div>',
    link: link
  };

  function link(scope, element, attr, rgCtrl) {
    var lastChecked;

    configureAria(element, scope);

    rgCtrl.add(render);
    attr.$observe('value', render);

    element
      .on('click', listener)
      .on('$destroy', function() {
        rgCtrl.remove(render);
      });

    function listener(ev) {
      if (element[0].hasAttribute('disabled')) return;

      scope.$apply(function() {
        rgCtrl.setViewValue(attr.value, ev && ev.type);
      });
    }

    function render() {
      var checked = (rgCtrl.getViewValue() === attr.value);
      if (checked === lastChecked) {
        return;
      }
      lastChecked = checked;
      element.attr('aria-checked', checked);
      if (checked) {
        element.addClass(CHECKED_CSS);
        rgCtrl.setActiveDescendant(element.attr('id'));
      } else {
        element.removeClass(CHECKED_CSS);
      }
    }
    /**
     * Inject ARIA-specific attributes appropriate for each radio button
     */
    function configureAria( element, scope ){
      scope.ariaId = buildAriaID();

      element.attr({
        'id' :  scope.ariaId,
        'role' : 'radio',
        'aria-checked' : 'false'
      });

      $aria.expect(element, 'aria-label', element.text());

      /**
       * Build a unique ID for each radio button that will be used with aria-activedescendant.
       * Preserve existing ID if already specified.
       * @returns {*|string}
       */
      function buildAriaID() {
        return attr.id || ( 'radio' + "_" + Util.nextUid() );
      }
    }
  }
}



/**
 * @ngdoc module
 * @name material.components.sidenav
 *
 * @description
 * A Sidenav QP component.
 */
angular.module('material.components.sidenav', [
  'material.services.registry'
])
  .factory('$materialSidenav', [
    '$materialComponentRegistry', 
    materialSidenavService 
  ])
  .directive('materialSidenav', [
    '$timeout',
    materialSidenavDirective 
  ])
  .controller('$materialSidenavController', [
    '$scope',
    '$element',
    '$attrs',
    '$timeout',
    '$materialSidenav',
    '$materialComponentRegistry',
    materialSidenavController 
  ]);
  
/**
 * @private
 * @ngdoc object
 * @name materialSidenavController
 * @module material.components.sidenav
 *
 * @description
 * The controller for materialSidenav components.
 */
function materialSidenavController($scope, $element, $attrs, $timeout, $materialSidenav, $materialComponentRegistry) {

  var self = this;

  $materialComponentRegistry.register(this, $attrs.componentId);

  this.isOpen = function() {
    return !!$scope.isOpen;
  };

  /**
   * Toggle the side menu to open or close depending on its current state.
   */
  this.toggle = function() {
    $scope.isOpen = !$scope.isOpen;
  };

  /**
   * Open the side menu
   */
  this.open = function() {
    $scope.isOpen = true;
  };

  /**
   * Close the side menu
   */
  this.close = function() {
    $scope.isOpen = false;
  };
}

/**
 * @private
 * @ngdoc service
 * @name $materialSidenav
 * @module material.components.sidenav
 *
 * @description
 * $materialSidenav makes it easy to interact with multiple sidenavs
 * in an app.
 *
 * @usage
 *
 * ```javascript
 * // Toggle the given sidenav
 * $materialSidenav(componentId).toggle();
 *
 * // Open the given sidenav
 * $materialSidenav(componentId).open();
 *
 * // Close the given sidenav
 * $materialSidenav(componentId).close();
 * ```
 */
function materialSidenavService($materialComponentRegistry) {
  return function(handle) {
    var instance = $materialComponentRegistry.get(handle);
    if(!instance) {
      $materialComponentRegistry.notFoundError(handle);
    }

    return {
      isOpen: function() {
        if (!instance) { return; }
        return instance.isOpen();
      },
      /**
       * Toggle the given sidenav
       * @param handle the specific sidenav to toggle
       */
      toggle: function() {
        if(!instance) { return; }
        instance.toggle();
      },
      /**
       * Open the given sidenav
       * @param handle the specific sidenav to open
       */
      open: function(handle) {
        if(!instance) { return; }
        instance.open();
      },
      /**
       * Close the given sidenav
       * @param handle the specific sidenav to close
       */
      close: function(handle) {
        if(!instance) { return; }
        instance.close();
      }
    };
  };
}

/**
 * @ngdoc directive
 * @name materialSidenav
 * @module material.components.sidenav
 * @restrict E
 *
 * @description
 *
 * A Sidenav component that can be opened and closed programatically.
 *
 * When used properly with a layout, it will seamleslly stay open on medium
 * and larger screens, while being hidden by default on mobile devices.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="horizontal" ng-controller="MyController">
 *   <material-sidenav component-id="left" class="material-sidenav-left">
 *     Left Nav!
 *   </material-sidenav>
 *
 *   <material-content>
 *     Center Content
 *     <material-button ng-click="openLeftMenu()">
 *       Open Left Menu
 *     </material-button>
 *   </material-content>
 *
 *   <material-sidenav component-id="right" class="material-sidenav-right">
 *     Right Nav!
 *   </material-sidenav>
 * </div>
 * </hljs>
 *
 * <hljs lang="js">
 * var app = angular.module('myApp', ['ngMaterial']);
 * app.controller('MainController', function($scope, $materialSidenav) {
 *   $scope.openLeftMenu = function() {
 *     $materialSidenav('left').toggle();
 *   };
 * });
 * </hljs>
 */
function materialSidenavDirective($timeout) {
  return {
    restrict: 'E',
    scope: {},
    controller: '$materialSidenavController',
    link: function($scope, $element, $attr, sidenavCtrl) {
      var backdrop = angular.element('<material-backdrop class="material-sidenav-backdrop">');

      $scope.$watch('isOpen', onShowHideSide);

      /**
       * Toggle the SideNav view and attach/detach listeners
       * @param isOpen
       */
      function onShowHideSide(isOpen) {
        var parent = $element.parent();

        $element.toggleClass('open', !!isOpen);

        if (isOpen) {
          parent.append(backdrop);
          backdrop.on('click', close);
          parent.on('keydown', onKeyDown);
        } else {
          backdrop.remove();
          backdrop.off('click', close);
          parent.off('keydown', onKeyDown);
        }
      }

      /**
       * Auto-close sideNav when the `escape` key is pressed.
       * @param evt
       */
      function onKeyDown(evt) {
        if(evt.which === Constant.KEY_CODE.ESCAPE){
          close();

          evt.preventDefault();
          evt.stopPropagation();
        }
      }

      /**
        * With backdrop `clicks` or `escape` key-press, immediately
       * apply the CSS close transition... Then notify the controller
       * to close() and perform its own actions.
       */
      function close() {

        onShowHideSide( false );

        $timeout(function(){
          sidenavCtrl.close();
        });
      }

    }
  };
}

/**
 * @ngdoc module
 * @name material.components.slider
 */
angular.module('material.components.slider', [
  'material.animations',
  'material.services.aria'
])
.directive('materialSlider', [
  SliderDirective
]);

/**
 * @ngdoc directive
 * @name materialSlider
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<material-slider>` component allows the user to choose from a range of
 * values.
 *
 * It has two modes: 'normal' mode, where the user slides between a wide range
 * of values, and 'discrete' mode, where the user slides between only a few
 * select values.
 *
 * To enable discrete mode, add the `discrete` attribute to a slider,
 * and use the `step` attribute to change the distance between
 * values the user is allowed to pick.
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * <material-slider ng-model="myValue" min="5" max="500">
 * </material-slider>
 * </hljs>
 * <h4>Discrete Mode</h4>
 * <hljs lang="html">
 * <material-slider discrete ng-model="myDiscreteValue" step="10" min="10" max="130">
 * </material-slider>
 * </hljs>
 *
 * @param {boolean=} discrete Whether to enable discrete mode.
 * @param {number=} step The distance between values the user is allowed to pick. Default 1.
 * @param {number=} min The minimum value the user is allowed to pick. Default 0.
 * @param {number=} max The maximum value the user is allowed to pick. Default 100.
 */
function SliderDirective() {
  return {
    scope: {},
    require: ['?ngModel', 'materialSlider'],
    controller: [
      '$scope',
      '$element',
      '$attrs',
      '$$rAF',
      '$window',
      '$materialEffects',
      '$aria',
      SliderController
    ],
    template:
      '<div class="slider-track-container">' +
        '<div class="slider-track"></div>' +
        '<div class="slider-track slider-track-fill"></div>' +
        '<div class="slider-track-ticks"></div>' +
      '</div>' +
      '<div class="slider-thumb-container">' +
        '<div class="slider-thumb"></div>' +
        '<div class="slider-focus-thumb"></div>' +
        '<div class="slider-focus-ring"></div>' +
        '<div class="slider-sign">' +
          '<span class="slider-thumb-text" ng-bind="modelValue"></span>' +
        '</div>' +
        '<div class="slider-disabled-thumb"></div>' +
      '</div>',
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var ngModelCtrl = ctrls[0] || {
      // Mock ngModelController if it doesn't exist to give us
      // the minimum functionality needed
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var sliderCtrl = ctrls[1];
    sliderCtrl.init(ngModelCtrl);
  }
}

/**
 * We use a controller for all the logic so that we can expose a few
 * things to unit tests
 */
function SliderController(scope, element, attr, $$rAF, $window, $materialEffects, $aria) {

  this.init = function init(ngModelCtrl) {
    var thumb = angular.element(element[0].querySelector('.slider-thumb'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.slider-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.slider-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.slider-track-ticks'));

    // Default values, overridable by attrs
    attr.min ? attr.$observe('min', updateMin) : updateMin(0);
    attr.max ? attr.$observe('max', updateMax) : updateMax(100);
    attr.step ? attr.$observe('step', updateStep) : updateStep(1);

    // We have to manually stop the $watch on ngDisabled because it exists
    // on the parent scope, and won't be automatically destroyed when
    // the component is destroyed.
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    } else {
      updateAriaDisabled(!!attr.disabled);
    }

    $aria.expect(element, 'aria-label');
    element.attr('tabIndex', 0);
    element.attr('role', 'slider');
    element.on('keydown', keydownListener);

    var hammertime = new Hammer(element[0], {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]
      ]
    });
    hammertime.on('hammer.input', onInput);
    hammertime.on('panstart', onPanStart);
    hammertime.on('pan', onPan);
    hammertime.on('panend', onPanEnd);

    // On resize, recalculate the slider's dimensions and re-render
    var updateAll = $$rAF.debounce(function() {
      refreshSliderDimensions();
      ngModelRender();
      redrawTicks();
    });
    updateAll();
    angular.element($window).on('resize', updateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', updateAll);
      hammertime.destroy();
      stopDisabledWatch();
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);

    /**
     * Attributes
     */
    var min;
    var max;
    var step;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
    }
    function updateStep(value) {
      step = parseFloat(value);
      redrawTicks();
    }
    function updateAriaDisabled(isDisabled) {
      element.attr('aria-disabled', !!isDisabled);
    }

    // Draw the ticks with canvas.
    // The alternative to drawing ticks with canvas is to draw one element for each tick,
    // which could quickly become a performance bottleneck.
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!angular.isDefined(attr.discrete)) return;

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        tickCanvas = angular.element('<canvas style="position:absolute;">');
        tickCtx = tickCanvas[0].getContext('2d');
        tickCtx.fillStyle = 'black';
        tickContainer.append(tickCanvas);
      }
      var dimensions = getSliderDimensions();
      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        distance = Math.floor(dimensions.width * (i / numSteps));
        tickCtx.fillRect(distance - 1, 0, 2, dimensions.height);
      }
    }


    /**
     * Refreshing Dimensions
     */
    var sliderDimensions = {};
    var throttledRefreshDimensions = Util.throttle(refreshSliderDimensions, 5000);
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }

    /**
     * left/right arrow listener
     */
    function keydownListener(ev) {
      var changeAmount;
      if (ev.which === Constant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    /**
     * ngModel setters and validators
     */
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      var percent = (ngModelCtrl.$viewValue - min) / (max - min);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
    }

    function minMaxValidator(value) {
      if (angular.isNumber(value)) {
        return Math.max(min, Math.min(max, value));
      }
    }
    function stepValidator(value) {
      if (angular.isNumber(value)) {
        return Math.round(value / step) * step;
      }
    }

    /**
     * @param percent 0-1
     */
    function setSliderPercent(percent) {
      activeTrack.css('width', (percent * 100) + '%');
      thumbContainer.css(
        $materialEffects.TRANSFORM,
        'translate3d(' + getSliderDimensions().width * percent + 'px,0,0)'
      );
      element.toggleClass('slider-min', percent === 0);
    }


    /**
     * Slide listeners
     */
    var isSliding = false;
    var isDiscrete = angular.isDefined(attr.discrete);

    function onInput(ev) {
      if (!isSliding && ev.eventType === Hammer.INPUT_START &&
          !element[0].hasAttribute('disabled')) {

        isSliding = true;

        element.addClass('active');
        element[0].focus();
        refreshSliderDimensions();

        onPan(ev);

        ev.srcEvent.stopPropagation();

      } else if (isSliding && ev.eventType === Hammer.INPUT_END) {

        if ( isDiscrete ) onPanEnd(ev);
        isSliding = false;

        element.removeClass('panning active');
      }
    }
    function onPanStart() {
      if (!isSliding) return;
      element.addClass('panning');
    }
    function onPan(ev) {
      if (!isSliding) return;

      // While panning discrete, update only the
      // visual positioning but not the model value.

      if ( isDiscrete ) adjustThumbPosition( ev.center.x );
      else              doSlide( ev.center.x );

      ev.preventDefault();
      ev.srcEvent.stopPropagation();
    }

    function onPanEnd(ev) {
      if ( isDiscrete ) {
        // Convert exact to closest discrete value.
        // Slide animate the thumb... and then update the model value.

        var exactVal = percentToValue( positionToPercent( ev.center.x ));
        var closestVal = minMaxValidator( stepValidator(exactVal) );

        setSliderPercent( valueToPercent(closestVal));
        $$rAF(function(){
          setModelValue( closestVal );
        });

        ev.preventDefault();
        ev.srcEvent.stopPropagation();
      }
    }

    /**
     * Expose for testing
     */
    this._onInput = onInput;
    this._onPanStart = onPanStart;
    this._onPan = onPan;

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    function doSlide( x ) {
      scope.$evalAsync( function() {
        setModelValue( percentToValue( positionToPercent(x) ));
      });
    }

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    function adjustThumbPosition( x ) {
      setSliderPercent( positionToPercent(x) );
    }

    /**
     * Convert horizontal position on slider to percentage value of offset from beginning...
     * @param x
     * @returns {number}
     */
    function positionToPercent( x ) {
      return (x - sliderDimensions.left) / (sliderDimensions.width);
    }

    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    function percentToValue( percent ) {
      return (min + percent * (max - min));
    }

    function valueToPercent( val ) {
      return (val - min)/(max - min);
    }

  };
}

/**
 * @ngdoc module
 * @name material.components.switch
 */

angular.module('material.components.switch', [
  'material.components.checkbox',
  'material.components.radioButton'
])

.directive('materialSwitch', [
  'materialCheckboxDirective',
  'materialRadioButtonDirective',
  MaterialSwitch
]);

/**
 * @ngdoc directive
 * @module material.components.switch
 * @name materialSwitch
 * @restrict E
 *
 * The switch directive is used very much like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
 * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} noink Use of attribute indicates use of ripple ink effects.
 * @param {boolean=} disabled Use of attribute indicates the switch is disabled: no ink effects and not selectable
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the switch's text.
 *
 * @usage
 * <hljs lang="html">
 * <material-switch ng-model="isActive" aria-label="Finished?">
 *   Finished ?
 * </material-switch>
 *
 * <material-switch noink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </material-switch>
 *
 * <material-switch disabled ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </material-switch>
 *
 * </hljs>
 */
function MaterialSwitch(checkboxDirectives, radioButtonDirectives) {
  var checkboxDirective = checkboxDirectives[0];
  var radioButtonDirective = radioButtonDirectives[0];

  return {
    restrict: 'E',
    transclude: true,
    template:
      '<div class="material-switch-bar"></div>' +
      '<div class="material-switch-thumb">' +
        radioButtonDirective.template +
      '</div>',
    require: '?ngModel',
    compile: compile
  };

  function compile(element, attr) {
    
    var thumb = angular.element(element[0].querySelector('.material-switch-thumb'));
    //Copy down disabled attributes for checkboxDirective to use
    thumb.attr('disabled', attr.disabled);
    thumb.attr('ngDisabled', attr.ngDisabled);

    return function postLink(scope, element, attr, ngModelCtrl) {
      checkboxDirective.link(scope, thumb, attr, ngModelCtrl);
    };
  }
}

/**
 * @ngdoc module
 * @name material.components.tabs
 * @description
 *
 * Tabs
 */
angular.module('material.components.tabs', [
  'material.animations',
  'material.components.swipe'
]);


/**
 * Conditionally configure ink bar animations when the
 * tab selection changes. If `nobar` then do not show the
 * bar nor animate.
 */
angular.module('material.components.tabs')

.directive('materialTabsInkBar', [
  '$materialEffects',
  '$window',
  '$$rAF',
  '$timeout',
  MaterialTabInkDirective
]);

function MaterialTabInkDirective($materialEffects, $window, $$rAF, $timeout) {

  return {
    restrict: 'E',
    require: ['^?nobar', '^materialTabs'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var nobar = ctrls[0];
    var tabsCtrl = ctrls[1];

    if (nobar) return;

    var debouncedUpdateBar = $$rAF.debounce(updateBar);

    scope.$watch(tabsCtrl.selected, updateBar);
    scope.$on('$materialTabsChanged', debouncedUpdateBar);
    scope.$on('$materialTabsPaginationChanged', debouncedUpdateBar);
    angular.element($window).on('resize', onWindowResize);

    function onWindowResize() {
      debouncedUpdateBar();
      $timeout(debouncedUpdateBar, 100, false);
    }

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', onWindowResize);
    });

    function updateBar() {
      var selectedElement = tabsCtrl.selected() && tabsCtrl.selected().element;

      if (!selectedElement || tabsCtrl.count() < 2) {
        element.css({
          display : 'none',
          width : '0px'
        });
      } else {
        var width = selectedElement.prop('offsetWidth');
        var left = selectedElement.prop('offsetLeft') + (tabsCtrl.$$pagingOffset || 0);

        element.css({
          display : width > 0 ? 'block' : 'none',
          width: width + 'px'
        });
        element.css($materialEffects.TRANSFORM, 'translate3d(' + left + 'px,0,0)');
      }
    }

  }

}


angular.module('material.components.tabs')

.directive('materialTabsPagination', [
  '$materialEffects',
  '$window',
  '$$rAF',
  '$$q',
  '$timeout',
  TabPaginationDirective
]);

function TabPaginationDirective($materialEffects, $window, $$rAF, $$q, $timeout) {

  // TODO allow configuration of TAB_MIN_WIDTH
  // Must match tab min-width rule in _tabs.scss
  var TAB_MIN_WIDTH = 8 * 12; 
  // Must match (2 * width of paginators) in scss
  var PAGINATORS_WIDTH = (8 * 4) * 2;

  return {
    restrict: 'A',
    require: '^materialTabs',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl) {

    var tabsParent = element.children();
    var state = scope.pagination = {
      page: -1,
      active: false,
      clickNext: function() { userChangePage(+1); },
      clickPrevious: function() { userChangePage(-1); }
    };

    var debouncedUpdatePagination = $$rAF.debounce(updatePagination);

    scope.$on('$materialTabsChanged', debouncedUpdatePagination);
    angular.element($window).on('resize', debouncedUpdatePagination);

    // Listen to focus events bubbling up from material-tab elements
    tabsParent.on('focusin', onTabsFocusIn);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdatePagination);
      tabsParent.off('focusin', onTabsFocusIn);
    });

    scope.$watch(tabsCtrl.selected, onSelectedTabChange);

    // Allows pagination through focus change.
    function onTabsFocusIn(ev) {
      if (!state.active) return;

      var tab = angular.element(ev.target).controller('materialTab');
      var pageIndex = getPageForTab(tab);
      if (pageIndex !== state.page) {
        // If the focused element is on a new page, don't focus yet.
        tab.element.blur();
        // Go to the new page, wait for the page transition to end, then focus.
        setPage(pageIndex).then(function() {
          tab.element.focus();
        });
      }
    }

    function onSelectedTabChange(selectedTab) {
      if (!selectedTab) return;

      if (state.active) {
        var selectedTabPage = getPageForTab(selectedTab);
        setPage(selectedTabPage);
      } else {
        debouncedUpdatePagination();
      }
    }

    // Called when page is changed by a user action (click)
    function userChangePage(increment) {
      var newPage = state.page + increment;
      var newTab;
      if (!tabsCtrl.selected() || getPageForTab(tabsCtrl.selected()) !== newPage) {
        var startIndex;
        if (increment < 0) {
          // If going backward, select the previous available tab, starting from
          // the first item on the page after newPage.
          startIndex = (newPage + 1) * state.itemsPerPage;
          newTab = tabsCtrl.previous( tabsCtrl.itemAt(startIndex) );
        } else {
          // If going forward, select the next available tab, starting with the
          // last item before newPage.
          startIndex = (newPage * state.itemsPerPage) - 1;
          newTab = tabsCtrl.next( tabsCtrl.itemAt(startIndex) );
        }
      }
      setPage(newPage).then(function() {
        newTab && newTab.element.focus();
      });
      newTab && tabsCtrl.select(newTab);
    }

    function updatePagination() {
      var tabs = element.find('material-tab');
      var tabsWidth = element.parent().prop('clientWidth') - PAGINATORS_WIDTH;

      var needPagination = tabsWidth && TAB_MIN_WIDTH * tabsCtrl.count() > tabsWidth;
      var paginationToggled = needPagination !== state.active;

      state.active = needPagination;

      if (needPagination) {

        state.pagesCount = Math.ceil((TAB_MIN_WIDTH * tabsCtrl.count()) / tabsWidth);
        state.itemsPerPage = Math.max(1, Math.floor(tabsCtrl.count() / state.pagesCount));
        state.tabWidth = tabsWidth / state.itemsPerPage;
        
        tabsParent.css('width', state.tabWidth * tabsCtrl.count() + 'px');
        tabs.css('width', state.tabWidth + 'px');

        var selectedTabPage = getPageForTab(tabsCtrl.selected());
        setPage(selectedTabPage);

      } else {

        if (paginationToggled) {
          $timeout(function() {
            tabsParent.css('width', '');
            tabs.css('width', '');
            slideTabButtons(0);
            state.page = -1;
          });
        }

      }
    }

    function slideTabButtons(x) {
      if (tabsCtrl.pagingOffset === x) {
        // Resolve instantly if no change
        return $$q.when();
      }

      var deferred = $$q.defer();

      tabsCtrl.$$pagingOffset = x;
      tabsParent.css($materialEffects.TRANSFORM, 'translate3d(' + x + 'px,0,0)');
      tabsParent.on($materialEffects.TRANSITIONEND_EVENT, onTabsParentTransitionEnd);

      return deferred.promise;

      function onTabsParentTransitionEnd(ev) {
        // Make sure this event didn't bubble up from an animation in a child element.
        if (ev.target === tabsParent[0]) {
          tabsParent.off($materialEffects.TRANSITIONEND_EVENT, onTabsParentTransitionEnd);
          deferred.resolve();
        }
      }
    }

    function getPageForTab(tab) {
      var tabIndex = tabsCtrl.indexOf(tab);
      if (tabIndex === -1) return 0;

      return Math.floor(tabIndex / state.itemsPerPage);
    }

    function setPage(page) {
      if (page === state.page) return;

      var lastPage = state.pagesCount;

      if (page < 0) page = 0;
      if (page > lastPage) page = lastPage;

      state.hasPrev = page > 0;
      state.hasNext = ((page + 1) * state.itemsPerPage) < tabsCtrl.count();

      state.page = page;

      $timeout(function() {
        scope.$broadcast('$materialTabsPaginationChanged');
      });

      return slideTabButtons(-page * state.itemsPerPage * state.tabWidth);
    }
  }

}


angular.module('material.components.tabs')

.controller('$materialTab', [
  '$scope',
  '$element',
  '$compile',
  '$animate',
  '$materialSwipe',
  TabItemController
]);

function TabItemController(scope, element, $compile, $animate, $materialSwipe) {
  var self = this;

  var detachSwipe = angular.noop;
  var attachSwipe = function() { return detachSwipe };
  var eventTypes = "swipeleft swiperight" ;
  var configureSwipe = $materialSwipe( scope, eventTypes );

  // special callback assigned by TabsController
  self.$$onSwipe = angular.noop;

  // Properties
  self.contentContainer = angular.element('<div class="tab-content ng-hide">');
  self.element = element;

  // Methods
  self.isDisabled = isDisabled;
  self.onAdd = onAdd;
  self.onRemove = onRemove;
  self.onSelect = onSelect;
  self.onDeselect = onDeselect;


  function isDisabled() {
    return element[0].hasAttribute('disabled');
  }
  
  /**
   * Add the tab's content to the DOM container area in the tabs,
   * @param contentArea the contentArea to add the content of the tab to
   */
  function onAdd(contentArea) {
    if (self.content.length) {

      self.contentContainer.append(self.content);
      self.contentScope = scope.$parent.$new();
      contentArea.append(self.contentContainer);

      $compile(self.contentContainer)(self.contentScope);

      Util.disconnectScope(self.contentScope);

      // For internal tab views we only use the `$materialSwipe`
      // so we can easily attach()/detach() when the tab view is active/inactive

      attachSwipe = configureSwipe( self.contentContainer, function(ev) {
        self.$$onSwipe(ev.type);
      }, true );
    }
  }


  /**
   * Usually called when a Tab is programmatically removed; such
   * as in an ng-repeat
   */
  function onRemove() {
    $animate.leave(self.contentContainer).then(function()
    {
      self.contentScope && self.contentScope.$destroy();
      self.contentScope = null;
    });
  }

  function onSelect() {
    // Resume watchers and events firing when tab is selected
    Util.reconnectScope(self.contentScope);
    detachSwipe = attachSwipe();

    element.addClass('active');
    element.attr('aria-selected', true);
    element.attr('tabIndex', 0);
    $animate.removeClass(self.contentContainer, 'ng-hide');

    scope.onSelect();
  }

  function onDeselect() {
    // Stop watchers & events from firing while tab is deselected
    Util.disconnectScope(self.contentScope);
    detachSwipe();

    element.removeClass('active');
    element.attr('aria-selected', false);
    // Only allow tabbing to the active tab
    element.attr('tabIndex', -1);
    $animate.addClass(self.contentContainer, 'ng-hide');

    scope.onDeselect();
  }

}


angular.module('material.components.tabs')

.directive('materialTab', [
  '$materialInkRipple', 
  '$compile',
  '$aria',
  MaterialTabDirective
]);

/**
 * @ngdoc directive
 * @name materialTab
 * @module material.components.tabs
 * @order 1
 *
 * @restrict E
 *
 * @description
 * `<material-tab>` is the nested directive used [within `<material-tabs>`] to specify each tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<material-tab-label>` tag can be used to specified more
 * complex tab header markup. If neither the **label** nor the **material-tab-label** are specified, then the nested
 * markup of the `<material-tab>` is used as the tab header markup.
 *
 * If a tab **label** has been identified, then any **non-**`<material-tab-label>` markup
 * will be considered tab content and will be transcluded to the internal `<div class="tabs-content">` container.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} active Flag indicates if the tab is currently selected; normally the `<material-tabs selected="">`; attribute is used instead.
 * @param {boolean=} ngDisabled Flag indicates if the tab is disabled: not selectable with no ink effects
 * @param {expression=} deselected Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} selected Expression to be evaluated after the tab has been selected.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <material-tab label="" disabled="" selected="" deselected="" >
 *   <h3>My Tab content</h3>
 * </material-tab>
 *
 * <material-tab >
 *   <material-tab-label>
 *     <h3>My Tab content</h3>
 *   </material-tab-label>
 *   <p>
 *     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *     totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *     dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *     sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *   </p>
 * </material-tab>
 * </hljs>
 *
 */
function MaterialTabDirective($materialInkRipple, $compile, $aria) {
  return {
    restrict: 'E',
    require: ['materialTab', '^materialTabs'],
    controller: '$materialTab',
    scope: {
      onSelect: '&',
      onDeselect: '&',
      label: '@'
    },
    compile: compile
  };

  function compile(element, attr) {
    var tabLabel = element.find('material-tab-label');

    // If a tab label element is found, remove it for later re-use.
    if (tabLabel.length) {
      tabLabel.remove();
    // Otherwise, try to use attr.label as the label
    } else if (angular.isDefined(attr.label)) {
      tabLabel = angular.element('<material-tab-label>').html(attr.label);
    // If nothing is found, use the tab's content as the label
    } else {
      tabLabel = angular.element('<material-tab-label>')
        .append(element.contents().remove());
    }

    // Everything that's left as a child is the tab's content.
    var tabContent = element.contents().remove();

    return function postLink(scope, element, attr, ctrls) {

      var tabItemCtrl = ctrls[0]; // Controller for THIS tabItemCtrl
      var tabsCtrl = ctrls[1]; // Controller for ALL tabs

      transcludeTabContent();

      var detachRippleFn = $materialInkRipple.attachButtonBehavior(element);
      tabsCtrl.add(tabItemCtrl);
      scope.$on('$destroy', function() {
        detachRippleFn();
        tabsCtrl.remove(tabItemCtrl);
      });

      if (!angular.isDefined(attr.ngClick)) element.on('click', defaultClickListener);
      element.on('keydown', keydownListener);

      if (angular.isNumber(scope.$parent.$index)) watchNgRepeatIndex();
      if (angular.isDefined(attr.active)) watchActiveAttribute();
      watchDisabled();

      configureAria();

      function transcludeTabContent() {
        // Clone the label we found earlier, and $compile and append it
        var label = tabLabel.clone();
        element.append(label);
        $compile(label)(scope.$parent);

        // Clone the content we found earlier, and mark it for later placement into
        // the proper content area.
        tabItemCtrl.content = tabContent.clone();
      }

      //defaultClickListener isn't applied if the user provides an ngClick expression.
      function defaultClickListener() {
        scope.$apply(function() {
          tabsCtrl.select(tabItemCtrl);
          tabItemCtrl.element.focus();
        });
      }
      function keydownListener(ev) {
        if (ev.which == Constant.KEY_CODE.SPACE ) {
          // Fire the click handler to do normal selection if space is pressed
          element.triggerHandler('click');
          ev.preventDefault();

        } else if (ev.which === Constant.KEY_CODE.LEFT_ARROW) {
          var previous = tabsCtrl.previous(tabItemCtrl);
          previous && previous.element.focus();

        } else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW) {
          var next = tabsCtrl.next(tabItemCtrl);
          next && next.element.focus();
        }
      }

      // If tabItemCtrl is part of an ngRepeat, move the tabItemCtrl in our internal array
      // when its $index changes
      function watchNgRepeatIndex() {
        // The tabItemCtrl has an isolate scope, so we watch the $index on the parent.
        scope.$watch('$parent.$index', function $indexWatchAction(newIndex) {
          tabsCtrl.move(tabItemCtrl, newIndex);
        });
      }

      function watchActiveAttribute() {
        var unwatch = scope.$parent.$watch('!!(' + attr.active + ')', activeWatchAction);
        scope.$on('$destroy', unwatch);
        
        function activeWatchAction(isActive) {
          var isSelected = tabsCtrl.selected() === tabItemCtrl;

          if (isActive && !isSelected) {
            tabsCtrl.select(tabItemCtrl);
          } else if (!isActive && isSelected) {
            tabsCtrl.deselect(tabItemCtrl);
          }
        }
      }

      function watchDisabled() {
        scope.$watch(tabItemCtrl.isDisabled, disabledWatchAction);
        
        function disabledWatchAction(isDisabled) {
          element.attr('aria-disabled', isDisabled);

          // Auto select `next` tab when disabled
          var isSelected = (tabsCtrl.selected() === tabItemCtrl);
          if (isSelected && isDisabled) {
            tabsCtrl.select(tabsCtrl.next() || tabsCtrl.previous());
          }

        }
      }

      function configureAria() {
        // Link together the content area and tabItemCtrl with an id
        var tabId = attr.id || Util.nextUid();
        var tabContentId = 'content_' + tabId;
        element.attr({
          id: tabId,
          role: 'tabItemCtrl',
          tabIndex: '-1', //this is also set on select/deselect in tabItemCtrl
          'aria-controls': tabContentId
        });
        tabItemCtrl.contentContainer.attr({
          id: tabContentId,
          role: 'tabpanel',
          'aria-labelledby': tabId
        });

        $aria.expect(element, 'aria-label', element.text());
      }

    };

  }

}


angular.module('material.components.tabs')

.controller('$materialTabs', [
  '$scope', 
  '$element',
  MaterialTabsController
]);

function MaterialTabsController(scope, element) {

  var tabsList = Util.iterator([], false);
  var self = this;

  // Properties
  self.element = element;
  // The section containing the tab content elements
  self.contentArea = angular.element(element[0].querySelector('.tabs-content'));

  // Methods from iterator
  self.inRange = tabsList.inRange;
  self.indexOf = tabsList.indexOf;
  self.itemAt = tabsList.itemAt;
  self.count = tabsList.count;
  
  self.selected = selected;
  self.add = add;
  self.remove = remove;
  self.move = move;
  self.select = select;
  self.deselect = deselect;

  self.next = next;
  self.previous = previous;

  self.swipe = swipe;

  // Get the selected tab
  function selected() {
    return self.itemAt(scope.selectedIndex);
  }

  // Add a new tab.
  // Returns a method to remove the tab from the list.
  function add(tab, index) {

    tabsList.add(tab, index);
    tab.onAdd(self.contentArea);

    // Register swipe feature
    tab.$$onSwipe = swipe;

    // Select the new tab if we don't have a selectedIndex, or if the
    // selectedIndex we've been waiting for is this tab
    if (scope.selectedIndex === -1 || scope.selectedIndex === self.indexOf(tab)) {
      self.select(tab);
    }
    scope.$broadcast('$materialTabsChanged');
  }

  function remove(tab) {
    if (!tabsList.contains(tab)) return;

    if (self.selected() === tab) {
      if (tabsList.count() > 1) {
        self.select(self.previous() || self.next());
      } else {
        self.deselect(tab);
      }
    }

    tabsList.remove(tab);
    tab.onRemove();

    scope.$broadcast('$materialTabsChanged');
  }

  // Move a tab (used when ng-repeat order changes)
  function move(tab, toIndex) {
    var isSelected = self.selected() === tab;

    tabsList.remove(tab);
    tabsList.add(tab, toIndex);
    if (isSelected) self.select(tab);

    scope.$broadcast('$materialTabsChanged');
  }

  function select(tab) {
    if (!tab || tab.isSelected || tab.isDisabled()) return;
    if (!tabsList.contains(tab)) return;

    self.deselect(self.selected());

    scope.selectedIndex = self.indexOf(tab);
    tab.isSelected = true;
    tab.onSelect();
  }
  function deselect(tab) {
    if (!tab || !tab.isSelected) return;
    if (!tabsList.contains(tab)) return;

    scope.selectedIndex = -1;
    tab.isSelected = false;
    tab.onDeselect();
  }

  function next(tab, filterFn) {
    return tabsList.next(tab || self.selected(), filterFn || isTabEnabled);
  }
  function previous(tab, filterFn) {
    return tabsList.previous(tab || self.selected(), filterFn || isTabEnabled);
  }

  function isTabEnabled(tab) {
    return tab && !tab.isDisabled();
  }

  /*
   * attach a swipe listen
   * if it's not selected, abort
   * check the direction
   *   if it is right
   *   it pan right
   *     Now select
   */

  function swipe(direction) {
    if ( !self.selected() ) return;

    // check the direction
    switch(direction) {

      case "swiperight":  // if it is right
      case "panright"  :  // it pan right
        // Now do this...
        self.select( self.previous() );
        break;

      case "swipeleft":
      case "panleft"  :
        self.select( self.next() );
        break;
    }

  }

}

angular.module('material.components.tabs')

/**
 * @ngdoc directive
 * @name materialTabs
 * @module material.components.tabs
 * @order 0
 *
 * @restrict E
 *
 * @description
 * The `<material-tabs>` directive serves as the container for 1..n `<material-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<material-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <material-tabs>
 *    <material-tab label="Tab #1"></material-tab>
 *    <material-tab label="Tab #2"></material-tab>
 *    <material-tab label="Tab #3"></material-tab>
 *  <material-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * > As a performance bonus, if the tab content is managed internally then the non-active (non-visible) tab contents are temporarily disconnected from the `$scope.$digest()` processes; which restricts and optimizes DOM updates to only the currently active tab.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 * *  If the currently active tab is the last tab, then next() action will select the first tab.
 * *  Any markup (other than **`<material-tab>`** tags) will be transcluded into the tab header area BEFORE the tab buttons.
 *
 * @param {integer=} selected Index of the active/selected tab
 * @param {boolean=} noink Flag indicates use of ripple ink effects
 * @param {boolean=} nobar Flag indicates use of ink bar effects
 * @param {string=}  align-tabs Attribute to indicate position of tab buttons: bottom or top; default is `top`
 *
 * @usage
 * <hljs lang="html">
 * <material-tabs selected="selectedIndex" >
 *   <img ng-src="/img/angular.png" class="centered">
 *
 *   <material-tab
 *      ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *      on-select="onTabSelected(tab)"
 *      on-deselect="announceDeselected(tab)"
 *      disabled="tab.disabled" >
 *
 *       <material-tab-label>
 *           {{tab.title}}
 *           <img src="/img/removeTab.png"
 *                ng-click="removeTab(tab)"
 *                class="delete" >
 *       </material-tab-label>
 *
 *       {{tab.content}}
 *
 *   </material-tab>
 *
 * </material-tabs>
 * </hljs>
 *
 */
.directive('materialTabs', [
  '$parse',
  TabsDirective
]);

function TabsDirective($parse) {
  return {
    restrict: 'E',
    controller: '$materialTabs',
    require: 'materialTabs',
    transclude: true,
    scope: {
      selectedIndex: '=?selected'
    },
    template: 
      '<section class="tabs-header" ' +
        'ng-class="{\'tab-paginating\': pagination.active}">' +

        '<div class="tab-paginator prev" ' +
          'ng-if="pagination.active && pagination.hasPrev" ' +
          'ng-click="pagination.clickPrevious()">' +
        '</div>' +

        // overflow: hidden container when paginating
        '<div class="tabs-header-items-container" material-tabs-pagination>' +
          // flex container for <material-tab> elements
          '<div class="tabs-header-items" ng-transclude></div>' +
          '<material-tabs-ink-bar></material-tabs-ink-bar>' +
        '</div>' +

        '<div class="tab-paginator next" ' +
          'ng-if="pagination.active && pagination.hasNext" ' +
          'ng-click="pagination.clickNext()">' +
        '</div>' +

      '</section>' +
      '<section class="tabs-content"></section>',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl) {

    configureAria();
    watchSelected();

    function configureAria() {
      element.attr({
        role: 'tablist'
      });
    }

    function watchSelected() {
      scope.$watch('selectedIndex', function watchSelectedIndex(newIndex, oldIndex) {
        // Note: if the user provides an invalid newIndex, all tabs will be deselected
        // and the associated view will be hidden.
        tabsCtrl.deselect( tabsCtrl.itemAt(oldIndex) );

        if (tabsCtrl.inRange(newIndex)) {
          var newTab = tabsCtrl.itemAt(newIndex);

          // If the newTab is disabled, find an enabled one to go to.
          if (newTab && newTab.isDisabled()) {
            newTab = newIndex > oldIndex ?
              tabsCtrl.next(newTab) :
              tabsCtrl.previous(newTab);
          }
          tabsCtrl.select(newTab);

        }
      });
    }

  }
}

/**
 * @ngdoc module
 * @name material.components.toast
 * @description
 * Toast
 */
angular.module('material.components.toast', [
  'material.services.interimElement',
  'material.components.swipe'
])
  .directive('materialToast', [
    MaterialToastDirective
  ])
  .factory('$materialToast', [
    '$timeout',
    '$$interimElement',
    '$animate',
    '$materialSwipe',
    MaterialToastService
  ]);

function MaterialToastDirective() {
  return {
    restrict: 'E'
  };
}

/**
 * @ngdoc service
 * @name $materialToast
 * @module material.components.toast
 *
 * @description
 * Open a toast notification on any position on the screen, with an optional 
 * duration.
 *
 * Only one toast notification may ever be active at any time. If a new toast is
 * shown while a different toast is active, the old toast will be automatically
 * hidden.
 *
 * `$materialToast` is an `$interimElement` service and adheres to the same behaviors.
 *  - `$materialToast.show()`
 *  - `$materialToast.hide()`
 *  - `$materialToast.cancel()`
 *
 * @usage
 * <hljs lang="html">
 * <div ng-controller="MyController">
 *   <material-button ng-click="openToast()">
 *     Open a Toast!
 *   </material-button>
 * </div>
 * </hljs>
 * <hljs lang="js">
 * var app = angular.module('app', ['ngMaterial']);
 * app.controller('MyController', function($scope, $materialToast) {
 *   $scope.openToast = function($event) {
 *     $materialToast.show({
 *       template: '<material-toast>Hello!</material-toast>',
 *       hideDelay: 3000
 *     });
 *   };
 * });
 * </hljs>
 */

 /**
 * @ngdoc method
 * @name $materialToast#show
 *
 * @description
 * Show a toast dialog with the specified options.
 *
 * @paramType Options
 * @param {string=} templateUrl The url of an html template file that will
 * be used as the content of the toast. Restrictions: the template must
 * have an outer `material-toast` element.
 * @param {string=} template Same as templateUrl, except this is an actual
 * template string.
 * @param {number=} hideDelay How many milliseconds the toast should stay
 * active before automatically closing.  Set to 0 to disable duration. 
 * Default: 3000.
 * @param {string=} position Where to place the toast. Available: any combination
 * of 'bottom', 'left', 'top', 'right', 'fit'. Default: 'bottom left'.
 * @param {string=} controller The controller to associate with this toast.
 * The controller will be injected the local `$hideToast`, which is a function
 * used to hide the toast.
 * @param {string=} locals An object containing key/value pairs. The keys will
 * be used as names of values to inject into the controller. For example, 
 * `locals: {three: 3}` would inject `three` into the controller with the value
 * of 3.
 * @param {object=} resolve Similar to locals, except it takes promises as values
 * and the toast will not open until the promises resolve.
 * @param {string=} controllerAs An alias to assign the controller to on the scope.
 *
 * @returns {Promise} Returns a promise that will be resolved or rejected when
 *  `$materialToast.hide()` or `$materialToast.cancel()` is called respectively.
 */

/**
 * @ngdoc method
 * @name $materialToast#hide
 *
 * @description
 * Hide an existing toast and `resolve` the promise returned from `$materialToast.show()`.
 *
 * @param {*} arg An argument to resolve the promise with.
 *
 */

/**
 * @ngdoc method
 * @name $materialToast#cancel
 *
 * @description
 * Hide an existing toast and `reject` the promise returned from `$materialToast.show()`.
 *
 * @param {*} arg An argument to reject the promise with.
 *
 */

function MaterialToastService($timeout, $$interimElement, $animate, $materialSwipe) {

  var factoryDef = {
    onShow: onShow,
    onRemove: onRemove,
    position: 'bottom left',
    hideDelay: 3000,
  };

  var $materialToast = $$interimElement(factoryDef);
  return $materialToast;

  function onShow(scope, element, options) {
    element.addClass(options.position);
    options.parent.addClass(toastOpenClass(options.position));

    var configureSwipe = $materialSwipe(scope, 'swipeleft swiperight');
    options.detachSwipe = configureSwipe(element, function(ev) {
      //Add swipeleft/swiperight class to element so it can animate correctly
      element.addClass(ev.type);
      $timeout($materialToast.hide);
    });

    return $animate.enter(element, options.parent);
  }

  function onRemove(scope, element, options) {
    options.detachSwipe();
    options.parent.removeClass(toastOpenClass(options.position));
    return $animate.leave(element);
  }

  function toastOpenClass(position) {
    return 'material-toast-open-' +
      (position.indexOf('top') > -1 ? 'top' : 'bottom');
  }
}

/**
 * @ngdoc module
 * @name material.components.toolbar
 */
angular.module('material.components.toolbar', [
  'material.components.content',
  'material.animations'
])
  .directive('materialToolbar', [
    '$$rAF',
    '$materialEffects',
    materialToolbarDirective
  ]);

/**
 * @ngdoc directive
 * @name materialToolbar
 * @restrict E
 * @description
 * `material-toolbar` is used to place a toolbar in your app.
 *
 * Toolbars are usually used above a content area to display the title of the
 * current page, and show relevant action buttons for that page.
 *
 * You can change the height of the toolbar by adding either the
 * `material-medium-tall` or `material-tall` class to the toolbar.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="vertical" layout-fill>
 *   <material-toolbar>
 *
 *     <div class="material-toolbar-tools">
 *       <span>My App's Title</span>
 *
 *       <!-- fill up the space between left and right area -->
 *       <span flex></span>
 *
 *       <material-button>
 *         Right Bar Button
 *       </material-button>
 *     </div>
 *
 *   </material-toolbar>
 *   <material-content>
 *     Hello!
 *   </material-content>
 * </div>
 * </hljs>
 *
 * @param {boolean=} scrollShrink Whether the header should shrink away as 
 * the user scrolls down, and reveal itself as the user scrolls up. 
 * Note: for scrollShrink to work, the toolbar must be a sibling of a 
 * `material-content` element, placed before it. See the scroll shrink demo.
 *
 *
 * @param {number=} shrinkSpeedFactor How much to change the speed of the toolbar's
 * shrinking by. For example, if 0.25 is given then the toolbar will shrink
 * at one fourth the rate at which the user scrolls down. Default 0.5.
 */ 
function materialToolbarDirective($$rAF, $materialEffects) {

  return {
    restrict: 'E',
    controller: angular.noop,
    link: function(scope, element, attr) {

      if (angular.isDefined(attr.scrollShrink)) {
        setupScrollShrink();
      }

      function setupScrollShrink() {
        // Current "y" position of scroll
        var y = 0;
        // Store the last scroll top position
        var prevScrollTop = 0;

        var shrinkSpeedFactor = attr.shrinkSpeedFactor || 0.5;

        var toolbarHeight;
        var contentElement;

        var debouncedContentScroll = $$rAF.debounce(onContentScroll);
        var debouncedUpdateHeight = Util.debounce(updateToolbarHeight, 5 * 1000);

        // Wait for $materialContentLoaded event from materialContent directive.
        // If the materialContent element is a sibling of our toolbar, hook it up
        // to scroll events.
        scope.$on('$materialContentLoaded', onMaterialContentLoad);

        function onMaterialContentLoad($event, newContentEl) {
          if (Util.elementIsSibling(element, newContentEl)) {
            // unhook old content event listener if exists
            if (contentElement) {
              contentElement.off('scroll', debouncedContentScroll);
            }

            newContentEl.on('scroll', debouncedContentScroll);
            newContentEl.attr('scroll-shrink', 'true');

            contentElement = newContentEl;
            $$rAF(updateToolbarHeight);
          }
        }

        function updateToolbarHeight() {
          toolbarHeight = element.prop('offsetHeight');
          // Add a negative margin-top the size of the toolbar to the content el.
          // The content will start transformed down the toolbarHeight amount,
          // so everything looks normal.
          //
          // As the user scrolls down, the content will be transformed up slowly
          // to put the content underneath where the toolbar was.
          contentElement.css(
            'margin-top', 
            (-toolbarHeight * shrinkSpeedFactor) + 'px'
          );
          onContentScroll();
        }

        function onContentScroll(e) {
          var scrollTop = e ? e.target.scrollTop : prevScrollTop;

          debouncedUpdateHeight();

          y = Math.min(
            toolbarHeight / shrinkSpeedFactor, 
            Math.max(0, y + scrollTop - prevScrollTop)
          );

          element.css(
            $materialEffects.TRANSFORM, 
            'translate3d(0,' + (-y * shrinkSpeedFactor) + 'px,0)'
          );
          contentElement.css(
            $materialEffects.TRANSFORM, 
            'translate3d(0,' + ((toolbarHeight - y) * shrinkSpeedFactor) + 'px,0)'
          );

          prevScrollTop = scrollTop;
        }

      }

    }
  };

}

angular.module('material.components.whiteframe', []);

/**
 * @ngdoc module
 * @name material.components.divider
 * @description Divider module!
 */
angular.module('material.components.divider', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialDivider', MaterialDividerDirective);

function MaterialDividerController(){}

/**
 * @ngdoc directive
 * @name materialDivider
 * @module material.components.divider
 * @restrict E
 *
 * @description
 * Dividers group and separate content within lists and page layouts using strong visual and spatial distinctions. This divider is a thin rule, lightweight enough to not distract the user from content.
 *
 * @param {boolean=} inset Add this attribute to activate the inset divider style.
 * @usage
 * <hljs lang="html">
 * <material-divider></material-divider>
 *
 * <material-divider inset></material-divider>
 * </hljs>
 *
 */
function MaterialDividerDirective() {
  return {
    restrict: 'E',
    controller: [MaterialDividerController]
  };
}

/**
 * @ngdoc module
 * @name material.components.linearProgress
 * @description Linear Progress module!
 */
angular.module('material.components.linearProgress', [
  'material.animations',
  'material.services.aria'
])
.directive('materialLinearProgress', [
  '$$rAF', 
  '$materialEffects',
  MaterialLinearProgressDirective
]);

/**
 * @ngdoc directive
 * @name materialLinearProgress
 * @module material.components.linearProgress
 * @restrict E
 *
 * @description
 * The linear progress directive is used to make loading content in your app as delightful and painless as possible by minimizing the amount of visual change a user sees before they can view and interact with content. Each operation should only be represented by one activity indicator—for example, one refresh operation should not display both a refresh bar and an activity circle.
 *
 * For operations where the percentage of the operation completed can be determined, use a determinate indicator. They give users a quick sense of how long an operation will take.
 *
 * For operations where the user is asked to wait a moment while something finishes up, and it’s not necessary to expose what's happening behind the scenes and how long it will take, use an indeterminate indicator.
 *
 * @param {string} mode Select from one of four modes: determinate, indeterminate, buffer or query.
 * @param {number=} value In determinate and buffer modes, this number represents the percentage of the primary progress bar. Default: 0
 * @param {number=} secondaryValue In the buffer mode, this number represents the precentage of the secondary progress bar. Default: 0
 *
 * @usage
 * <hljs lang="html">
 * <material-linear-progress mode="determinate" value="..."></material-linear-progress>
 *
 * <material-linear-progress mode="determinate" ng-value="..."></material-linear-progress>
 *
 * <material-linear-progress mode="indeterminate"></material-linear-progress>
 *
 * <material-linear-progress mode="buffer" value="..." secondaryValue="..."></material-linear-progress>
 *
 * <material-linear-progress mode="query"></material-linear-progress>
 * </hljs>
 */
function MaterialLinearProgressDirective($$rAF, $materialEffects) {

  return {
    restrict: 'E',
    template: '<div class="container">' +
      '<div class="dashed"></div>' +
      '<div class="bar bar1"></div>' +
      '<div class="bar bar2"></div>' +
      '</div>',
    compile: compile
  };
  
  function compile(tElement, tAttrs, transclude) {
    tElement.attr('aria-valuemin', 0);
    tElement.attr('aria-valuemax', 100);
    tElement.attr('role', 'progressbar');

    return postLink;
  }
  function postLink(scope, element, attr) {
    var bar1Style = element[0].querySelector('.bar1').style,
      bar2Style = element[0].querySelector('.bar2').style,
      container = angular.element(element[0].querySelector('.container'));

    attr.$observe('value', function(value) {
      if (attr.mode == 'query') {
        return;
      }

      var clamped = clamp(value);
      element.attr('aria-valuenow', clamped);
      bar2Style[$materialEffects.TRANSFORM] = linearProgressTransforms[clamped];
    });

    attr.$observe('secondaryvalue', function(value) {
      bar1Style[$materialEffects.TRANSFORM] = linearProgressTransforms[clamp(value)];
    });

    $$rAF(function() {
      container.addClass('ready');
    });
  }

  function clamp(value) {
    if (value > 100) {
      return 100;
    }

    if (value < 0) {
      return 0;
    }

    return Math.ceil(value || 0);
  }
}


// **********************************************************
// Private Methods
// **********************************************************
var linearProgressTransforms = (function() {
  var values = new Array(101);
  for(var i = 0; i < 101; i++){
    values[i] = makeTransform(i);
  }

  return values;

  function makeTransform(value){
    var scale = value/100;
    var translateX = (value-100)/2;
    return 'translateX(' + translateX.toString() + '%) scale(' + scale.toString() + ', 1)';
  }
})();

(function() {

  /**
   * @ngdoc module
   * @name material.components.swipe
   * @description Swipe module!
   */
  angular.module('material.components.swipe',['ng'])

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name $materialSwipe
     *
     *  This service allows directives to easily attach swipe and pan listeners to
     *  the specified element.
     *
     * @private
     */
    .factory("$materialSwipe", function() {

      // match expected API functionality
      var attachNoop = function(){ return angular.noop; };

      /**
       * SwipeService constructor pre-captures scope and customized event types
       *
       * @param scope
       * @param eventTypes
       * @returns {*}
       * @constructor
       */
      return function SwipeService(scope, eventTypes) {
        if ( !eventTypes ) eventTypes = "swipeleft swiperight";

        // publish configureFor() method for specific element instance
        return function configureFor(element, onSwipeCallback, attachLater ) {
          var hammertime = new Hammer(element[0], {
            recognizers : addRecognizers([], eventTypes )
          });

          // Attach swipe listeners now
          if ( !attachLater ) attachSwipe();

          // auto-disconnect during destroy
          scope.$on('$destroy', function() {
            hammertime.destroy();
          });

          return attachSwipe;

          // **********************
          // Internal methods
          // **********************

          /**
           * Delegate swipe event to callback function
           * and ensure $digest is triggered.
           *
           * @param ev HammerEvent
           */
          function swipeHandler(ev) {

            // Prevent triggering parent hammer listeners
            ev.srcEvent.stopPropagation();

            if ( angular.isFunction(onSwipeCallback) ) {
              scope.$apply(function() {
                onSwipeCallback(ev);
              });
            }
          }

          /**
           * Enable listeners and return detach() fn
           */
          function attachSwipe() {
            hammertime.on(eventTypes, swipeHandler );

            return function detachSwipe() {
              hammertime.off( eventTypes );
            };
          }

          /**
           * Add optional recognizers such as panleft, panright
           */
          function addRecognizers(list, events) {
            var hasPanning = (events.indexOf("pan") > -1);
            var hasSwipe   = (events.indexOf("swipe") > -1);

            if (hasPanning) {
              list.push([ Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL } ]);
            }
            if (hasSwipe) {
              list.push([ Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL } ]);
            }

            return list;
          }

        };
      };
    })

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name materialSwipeLeft
     *
     * @order 0
     * @restrict A
     *
     * @description
     * The `<div  material-swipe-left="<expression" >` directive identifies an element on which
     * HammerJS horizontal swipe left and pan left support will be active. The swipe/pan action
     * can result in custom activity trigger by evaluating `<expression>`.
     *
     * @param {boolean=} noPan Use of attribute indicates flag to disable detection of `panleft` activity
     *
     * @usage
     * <hljs lang="html">
     *
     * <div class="animate-switch-container"
     *      ng-switch on="data.selectedIndex"
     *      material-swipe-left="data.selectedIndex+=1;"
     *      material-swipe-right="data.selectedIndex-=1;" >
     *
     * </div>
     * </hljs>
     *
     */
    .directive("materialSwipeLeft", ['$parse', '$materialSwipe',
      function MaterialSwipeLeft($parse, $materialSwipe) {
        return {
          restrict: 'A',
          link :  swipePostLink( $parse, $materialSwipe, "SwipeLeft" )
        };
      }])

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name materialSwipeRight
     *
     * @order 1
     * @restrict A
     *
     * @description
     * The `<div  material-swipe-right="<expression" >` directive identifies functionality
     * that attaches HammerJS horizontal swipe right and pan right support to an element. The swipe/pan action
     * can result in activity trigger by evaluating `<expression>`
     *
     * @param {boolean=} noPan Use of attribute indicates flag to disable detection of `panright` activity
     *
     * @usage
     * <hljs lang="html">
     *
     * <div class="animate-switch-container"
     *      ng-switch on="data.selectedIndex"
     *      material-swipe-left="data.selectedIndex+=1;"
     *      material-swipe-right="data.selectedIndex-=1;" >
     *
     * </div>
     * </hljs>
     *
     */
    .directive( "materialSwipeRight", ['$parse', '$materialSwipe',
      function MaterialSwipeRight($parse, $materialSwipe) {
        return {
          restrict: 'A',
          link: swipePostLink( $parse, $materialSwipe, "SwipeRight" )
        };
      }
    ]);

    /**
     * Factory to build PostLink function specific to Swipe or Pan direction
     *
     * @param $parse
     * @param $materialSwipe
     * @param name
     * @returns {Function}
     */
    function swipePostLink($parse, $materialSwipe, name ) {

      return function(scope, element, attrs) {
        var direction = name.toLowerCase();
        var directiveName= "material" + name;

        var parentGetter = $parse(attrs[directiveName]) || angular.noop;
        var configureSwipe = $materialSwipe(scope, direction);
        var requestSwipe = function(locals) {
          // build function to request scope-specific swipe response
          parentGetter(scope, locals);
        };

        configureSwipe( element, function onHandleSwipe(ev) {
          if ( ev.type == direction ) {
            requestSwipe();
          }
        });

      }
    }

})();




angular.module('material.decorators', [])
.config(['$provide', function($provide) {
  $provide.decorator('$$rAF', ['$delegate', '$rootScope', rAFDecorator]);

  function rAFDecorator($$rAF, $rootScope) {

    /**
     * Use this to debounce events that come in often.
     * The debounced function will always use the *last* invocation before the
     * coming frame.
     *
     * For example, window resize events that fire many times a second:
     * If we set to use an raf-debounced callback on window resize, then
     * our callback will only be fired once per frame, with the last resize
     * event that happened before that frame.
     *
     * @param {function} callback function to debounce
     */
    $$rAF.debounce = function(cb) {
      var queueArgs, alreadyQueued, queueCb, context;
      return function debounced() {
        queueArgs = arguments;
        context = this;
        queueCb = cb;
        if (!alreadyQueued) {
          alreadyQueued = true;
          $$rAF(function() {
            queueCb.apply(context, queueArgs);
            alreadyQueued = false;
          });
        }
      };
    };

    return $$rAF;
  }
}]);

angular.module('material.services.aria', [])

.service('$aria', [
  '$log',
  AriaService
]);

function AriaService($log) {
  var messageTemplate = 'ARIA: Attribute "%s", required for accessibility, is missing on "%s"!';
  var defaultValueTemplate = 'Default value was set: %s="%s".';

  return {
    expect : expectAttribute,
  };

  /**
   * Check if expected ARIA has been specified on the target element
   * @param element
   * @param attrName
   * @param defaultValue
   */
  function expectAttribute(element, attrName, defaultValue) {

    var node = element[0];
    if (!node.hasAttribute(attrName)) {
      var hasDefault = angular.isDefined(defaultValue);

      if (hasDefault) {
        defaultValue = String(defaultValue).trim();
        // $log.warn(messageTemplate + ' ' + defaultValueTemplate,
        //           attrName, getTagString(node), attrName, defaultValue);
        element.attr(attrName, defaultValue);
      } else {
        // $log.warn(messageTemplate, attrName, getTagString(node));
      }
    }
  }


  /**
   * Gets the tag definition from a node's outerHTML
   * @example getTagString(
   *   '<material-button foo="bar">Hello</material-button>'
   * ) // => '<material-button foo="bar">'
   */
  function getTagString(node) {
    var html = node.outerHTML;
    var closingIndex = html.indexOf('>');
    return html.substring(0, closingIndex + 1);
  }
}

angular.module('material.services.attrBind', [
])
  .factory('$attrBind', [
    '$parse', 
    '$interpolate', 
    MaterialAttrBind 
  ]);

/**
 *  This service allows directives to easily databind attributes to private scope properties.
 *
 * @private
 */
function MaterialAttrBind($parse, $interpolate) {
  var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;

  return function (scope, attrs, bindDefinition, bindDefaults) {
    angular.forEach(bindDefinition || {}, function (definition, scopeName) {
      //Adapted from angular.js $compile
      var match = definition.match(LOCAL_REGEXP) || [],
        attrName = match[3] || scopeName,
        mode = match[1], // @, =, or &
        parentGet,
        unWatchFn;

      switch (mode) {
        case '@':   // One-way binding from attribute into scope

          attrs.$observe(attrName, function (value) {
            scope[scopeName] = value;
          });
          attrs.$$observers[attrName].$$scope = scope;

          if (!bypassWithDefaults(attrName, scopeName)) {
            // we trigger an interpolation to ensure
            // the value is there for use immediately
            scope[scopeName] = $interpolate(attrs[attrName])(scope);
          }
          break;

        case '=':   // Two-way binding...

          if (!bypassWithDefaults(attrName, scopeName)) {
            // Immediate evaluation
            scope[scopeName] = (attrs[attrName] === "") ? true : scope.$eval(attrs[attrName]);

            // Data-bind attribute to scope (incoming) and
            // auto-release watcher when scope is destroyed

            unWatchFn = scope.$watch(attrs[attrName], function (value) {
              scope[scopeName] = value;
            });
            scope.$on('$destroy', unWatchFn);
          }

          break;

        case '&':   // execute an attribute-defined expression in the context of the parent scope

          if (!bypassWithDefaults(attrName, scopeName, angular.noop)) {
            /* jshint -W044 */
            if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
              throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' +
                attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
            }

            parentGet = $parse(attrs[attrName]);
            scope[scopeName] = function (locals) {
              return parentGet(scope, locals);
            };
          }

          break;
      }
    });

    /**
     * Optional fallback value if attribute is not specified on element
     * @param scopeName
     */
    function bypassWithDefaults(attrName, scopeName, defaultVal) {
      if (!angular.isDefined(attrs[attrName])) {
        var hasDefault = bindDefaults && bindDefaults.hasOwnProperty(scopeName);
        scope[scopeName] = hasDefault ? bindDefaults[scopeName] : defaultVal;
        return true;
      }
      return false;
    }

  };
}

angular.module('material.services.compiler', [
])
  .service('$materialCompiler', [
    '$q',
    '$http',
    '$injector',
    '$compile',
    '$controller',
    '$templateCache',
    materialCompilerService
  ]);

function materialCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {

  /**
   * @ngdoc service
   * @name $materialCompiler
   * @module material.services.compiler
   *
   * @description
   * The $materialCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   */

   /**
    * @ngdoc method
    * @name $materialCompiler#compile
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` â€“ `{(string=|function()=}` â€“ Controller fn that should be associated with
    *      newly created scope or the name of a {@link angular.Module#controller registered
    *      controller} if passed as a string.
    *    - `controllerAs` â€“ `{string=}` â€“ A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` â€“ `{string=}` â€“ html template as a string or a function that
    *      returns an html template as a string which should be used by {@link
    *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
    *      This property takes precedence over `templateUrl`.
    *
    *    - `templateUrl` â€“ `{string=}` â€“ path or function that returns a path to an html
    *      template that should be used by {@link ngRoute.directive:ngView ngView}.
    *
    *    - `transformTemplate` â€“ `{function=} â€“ a function which can be used to transform
    *      the templateUrl or template provided after it is fetched.  It will be given one
    *      parameter, the template, and should return a transformed template.
    *
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved or one to be rejected before the controller is
    *      instantiated.
    *
    *      - `key` â€“ `{string}`: a name of a dependency to be injected into the controller.
    *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is {@link api/AUTO.$injector#invoke injected}
    *        and the return value is treated as the dependency. If the result is a promise, it is
    *        resolved before its value is injected into the controller.
    *
    * @returns {object=} promise A promsie which will be resolved with a `compileData` object,
    * with the following properties:
    *
    *   - `{element}` â€“ `element` â€“ an uncompiled angular element compiled using the provided template.
    *   
    *   - `{function(scope)}`  â€“ `link` â€“ A link function, which, when called, will compile
    *     the elmeent and instantiate options.controller.
    *
    *   - `{object}` â€“ `locals` â€“ The locals which will be passed into the controller once `link` is
    *     called.
    *
    * @usage
    * $materialCompiler.compile({
    *   templateUrl: 'modal.html',
    *   controller: 'ModalCtrl',
    *   locals: {
    *     modal: myModalInstance;
    *   }
    * }).then(function(compileData) {
    *   compileData.element; // modal.html's template in an element
    *   compileData.link(myScope); //attach controller & scope to element
    * });
    */
  this.compile = function(options) {
    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = options.resolve || {};
    var locals = options.locals || {};
    var transformTemplate = options.transformTemplate || angular.identity;

    // Take resolve values and invoke them.  
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    //Add the locals, which are just straight values to inject
    //eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = $http.get(templateUrl, {cache: $templateCache})
        .then(function(response) {
          return response.data;
        });
    } else {
      resolve.$template = $q.when(template);
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function(locals) {

      var template = transformTemplate(locals.$template);
      var element = angular.element('<div>').html(template).contents();
      var linkFn = $compile(element);

      //Return a linking function that can be used later when the element is ready
      return {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;

          //Instantiate controller if it exists, because we have scope
          if (controller) {
            var ctrl = $controller(controller, locals);
            //See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }
          }

          return linkFn(scope);
        }
      };
    });
  };
}

/**
 * @ngdoc module
 * @name material.services.interimElement
 * @description InterimElement
 */

angular.module('material.services.interimElement', [
  'material.services.compiler'
])
.factory('$$interimElement', [
  '$q',
  '$rootScope',
  '$timeout',
  '$rootElement',
  '$animate',
  '$materialCompiler',
  InterimElementFactory
]);

/**
 * @ngdoc service
 * @name $$interimElement
 *
 * @description
 *
 * Factory that contructs `$$interimElement.$service` services. 
 * Used internally in material for elements that appear on screen temporarily.
 * The service provides a promise-like API for interacting with the temporary
 * elements.
 *
 * ```js
 * app.service('$materialToast', function($$interimElement) {
 *   var $materialToast = $$interimElement(toastDefaultOptions);
 *   return $materialToast;
 * });
 * ```
 * @param {object=} defaultOptions Options used by default for the `show` method on the service.
 *
 * @returns {$$interimElement.$service}
 *
 */

function InterimElementFactory($q, $rootScope, $timeout, $rootElement, $animate, $materialCompiler) {

  return function createInterimElementService(defaults) {

    /**
     * @ngdoc service
     * @name $$interimElement.$service
     *
     * @description
     * A service used to control inserting and removing an element into the DOM.
     *
     */


    var stack = [];

    var parent = $rootElement.find('body');
    if (!parent.length) parent = $rootElement;

    defaults = angular.extend({
      parent: parent,
      onShow: function(scope, $el, options) {
        return $animate.enter($el, options.parent);
      },
      onRemove: function(scope, $el, options) {
        return $animate.leave($el);
      },
    }, defaults || {});

    var service;
    return service = {
      show: show,
      hide: hide,
      cancel: cancel
    };

    /**
     * @ngdoc method
     * @name $$interimElement.$service#show
     * @kind function
     *
     * @description
     * Compiles and inserts an element into the DOM.
     *
     * @param {Object} options Options object to compile with.
     *
     * @returns {Promise} Promise that will resolve when the service
     * has `#close()` or `#cancel()` called.
     *
     */
    function show(options) {
      if (stack.length) {
        service.hide();
      }

      var interimElement = new InterimElement(options);
      stack.push(interimElement);
      return interimElement.show().then(function() {
        return interimElement.deferred.promise;
      });
    }

    /**
     * @ngdoc method
     * @name $$interimElement.$service#hide
     * @kind function
     *
     * @description
     * Removes the `$interimElement` from the DOM and resolves the promise returned from `show`
     *
     * @param {*} resolveParam Data to resolve the promise with
     *
     * @returns undefined data that resolves after the element has been removed.
     *
     */
    function hide(success) {
      var interimElement = stack.shift();
      interimElement.remove().then(function() {
        interimElement.deferred.resolve(success);
      });
    }

    /**
     * @ngdoc method
     * @name $$interimElement.$service#cancel
     * @kind function
     *
     * @description
     * Removes the `$interimElement` from the DOM and rejects the promise returned from `show`
     *
     * @param {*} reason Data to reject the promise with
     *
     * @returns undefined
     *
     */
    function cancel(reason) {
      var interimElement = stack.shift();
      interimElement.remove().then(function() {
        interimElement.deferred.reject(reason);
      });
    }


    /*
     * Internal Interim Element Object
     * Used internally to manage the DOM element and related data
     */
    function InterimElement(options) {
      var self;
      var hideTimeout, element;

      options = options || {};

      options = angular.extend({
        scope: options.scope || $rootScope.$new(options.isolateScope)
      }, defaults, options);

      self = {
        options: options,
        deferred: $q.defer(),
        show: function() {
          return $materialCompiler.compile(options).then(function(compiledData) {
            element = compiledData.link(options.scope);
            var ret = options.onShow(options.scope, element, options);
            return $q.when(ret)
              .then(startHideTimeout);

            function startHideTimeout() {
              if (options.hideDelay) {
                hideTimeout = $timeout(service.hide, options.hideDelay) ;
              }
            }
          });
        },
        cancelTimeout: function() {
          if (hideTimeout) {
            $timeout.cancel(hideTimeout);
            hideTimeout = undefined;
          }
        },
        remove: function() {
          self.cancelTimeout();
          var ret = options.onRemove(options.scope, element, options);
          return $q.when(ret).then(function() {
            options.scope.$destroy();
          });
        }
      };
      return self;
    }
  };
}


/**
 * @ngdoc overview
 * @name material.services.registry
 *
 * @description
 * A component registry system for accessing various component instances in an app.
 */
angular.module('material.services.registry', [
])
  .factory('$materialComponentRegistry', [
    '$log', 
    materialComponentRegistry 
  ]);

/**
 * @ngdoc service
 * @name material.services.registry.service:$materialComponentRegistry
 *
 * @description
 * $materialComponentRegistry enables the user to interact with multiple instances of
 * certain complex components in a running app.
 */
function materialComponentRegistry($log) {
  var instances = [];

  return {
    /**
     * Used to print an error when an instance for a handle isn't found.
     */
    notFoundError: function(handle) {
      $log.error('No instance found for handle', handle);
    },
    /**
     * Return all registered instances as an array.
     */
    getInstances: function() {
      return instances;
    },

    /**
     * Get a registered instance.
     * @param handle the String handle to look up for a registered instance.
     */
    get: function(handle) {
      var i, j, instance;
      for(i = 0, j = instances.length; i < j; i++) {
        instance = instances[i];
        if(instance.$$materialHandle === handle) {
          return instance;
        }
      }
      return null;
    },

    /**
     * Register an instance.
     * @param instance the instance to register
     * @param handle the handle to identify the instance under.
     */
    register: function(instance, handle) {
      instance.$$materialHandle = handle;
      instances.push(instance);

      return function deregister() {
        var index = instances.indexOf(instance);
        if (index !== -1) {
          instances.splice(index, 1);
        }
      };
    }
  }
}


})();
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0,
        y = 0,
        i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            store.push(ev);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // get index of the event in the store
        // it not found, so the pointer hasn't been down (so it's probably a hover)
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    /**
     * handle touch events
     * @param {Object} ev
     */
    handler: function TEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches = toArray(ev.targetTouches),
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [];

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.3';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

var DocsApp = angular.module('docsApp', ['ngMaterial', 'ngRoute', 'angularytics'])

.config([
  'COMPONENTS',
  '$routeProvider',
function(COMPONENTS, $routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'template/home.tmpl.html'
    })
    .when('/layout/:tmpl', {
      templateUrl: function(params){
        return 'template/layout-' + params.tmpl + '.tmpl.html';
      }
    });

  angular.forEach(COMPONENTS, function(component) {

    angular.forEach(component.docs, function(doc) {
      $routeProvider.when(doc.url, {
        templateUrl: doc.outputPath,
        resolve: {
          component: function() { return component; },
          doc: function() { return doc; }
        },
        controller: 'ComponentDocCtrl'
      });
    });

  });

  $routeProvider.otherwise('/');

}])

.config(['AngularyticsProvider',
function(AngularyticsProvider) {
  AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);
}])

.run([
  'Angularytics',
  '$rootScope',
function(Angularytics, $rootScope) {
  Angularytics.init();
}])

.factory('menu', [
  'COMPONENTS',
  '$location',
  '$rootScope',
function(COMPONENTS, $location, $rootScope) {
  var componentDocs = [];
  var demoDocs = [];
  COMPONENTS.forEach(function(component) {
    component.docs.forEach(function(doc) {
      if (doc.docType === 'readme') {
        demoDocs.push(doc);
      } else {
        componentDocs.push(doc);
      }
    });
  });
  var sections = [{
    name: 'Demos',
    pages: demoDocs
  }, {
    name: 'Layout',
    pages: [{
      name: 'Container Elements',
      id: 'layoutContainers',
      url: '/layout/container'
    },{
      name: 'Grid System',
      id: 'layoutGrid',
      url: '/layout/grid'
    },{
      name: 'Child Alignment',
      id: 'layoutAlign',
      url: '/layout/alignment'
    },{
      name: 'Options',
      id: 'layoutOptions',
      url: '/layout/options'
    }]
  }, {
    name: 'API',
    pages: componentDocs
  }];
  var self;

  $rootScope.$on('$locationChangeSuccess', onLocationChange);

  return self = {
    sections: sections,

    selectSection: function(section) {
      self.openedSection = section;
    },
    toggleSelectSection: function(section) {
      self.openedSection = (self.openedSection === section ? null : section);
    },
    isSectionSelected: function(section) {
      return self.openedSection === section;
    },

    selectPage: function(section, page) {
      page && page.url && $location.path(page.url);
      self.currentSection = section;
      self.currentPage = page;
    },
    isPageSelected: function(section, page) {
      return self.currentPage === page;
    }
  };

  function onLocationChange() {
    var activated = false;
    var path = $location.path();
    sections.forEach(function(section) {
      section.pages.forEach(function(page) {
        if (path === page.url) {
          self.selectSection(section);
          self.selectPage(section, page);
          activated = true;
        }
      });
    });
    if (!activated) {
      self.selectSection(sections[2]);
    }
  }
}])

.controller('DocsCtrl', [
  '$scope',
  'COMPONENTS',
  '$materialSidenav',
  '$timeout',
  '$materialDialog',
  'menu',
  '$location',
function($scope, COMPONENTS, $materialSidenav, $timeout, $materialDialog, menu, $location ) {

  $scope.goToUrl = function(p) {
    window.location = p;
  };

  $scope.COMPONENTS = COMPONENTS;

  $scope.menu = menu;

  $scope.mainContentArea = document.querySelector("[role='main']");

  $scope.toggleMenu = function() {
    $timeout(function() {
      $materialSidenav('left').toggle();
    });
  };

  $scope.openPage = function(section, page) {
    menu.selectPage(section, page);
    $scope.toggleMenu();
    $scope.mainContentArea.focus();
  };

  $scope.goHome = function($event) {
    menu.selectPage(null, null);
    $location.path( '/' );
  };

  $scope.viewSource = function(demo, $event) {
    $materialDialog({
      targetEvent: $event,
      controller: 'ViewSourceCtrl',
      locals: {
        demo: demo
      },
      templateUrl: 'template/view-source.tmpl.html'
    });
  };

  $scope.menuDocs = function(component) {
    return component.docs.filter(function(doc) {
      return doc.docType !== 'readme';
    });
  };
}])

.controller('HomeCtrl', [
  '$scope',
  '$rootScope',
  '$http',
function($scope, $rootScope, $http) {
  $rootScope.currentComponent = $rootScope.currentDoc = null;

  $scope.version = "";
  $scope.versionURL = "";

  // Load build version information; to be
  // used in the header bar area
  var now = Math.round(new Date().getTime()/1000);
  var versionFile = "version.json" + "?ts=" + now;

  $http.get("version.json")
    .then(function(response){
      var sha = response.data.sha || "";
      var url = response.data.url;

      if (sha) {
        $scope.versionURL = url + sha;
        $scope.version = sha.substr(0,6);
      }
    });


}])

.controller('LayoutCtrl', [
  '$scope',
  '$attrs',
  '$location',
  '$rootScope',
function($scope, $attrs, $location, $rootScope) {
  $rootScope.currentComponent = $rootScope.currentDoc = null;
}])

.controller('ComponentDocCtrl', [
  '$scope',
  'doc',
  'component',
  '$rootScope',
  '$templateCache',
  '$http',
  '$q',
function($scope, doc, component, $rootScope, $templateCache, $http, $q) {
  $rootScope.currentComponent = component;
  $rootScope.currentDoc = doc;

  component.demos.forEach(function(demo) {

    var demoFiles = [demo.indexFile]
      .concat( (demo.files || []).sort(sortByJs) );

    var promises = demoFiles.map(function(file) {
      return $http.get(file.outputPath, {cache: $templateCache}).then(
        function(response) {
          file.content = response.data;
          return file;
        }, 
        function(err) {
          file.content = 'Failed to load ' + file.outputPath + '.';
          return file;
        }
      );
    });

    $q.all(promises).then(function(files) {
      demo.$files = files;
      demo.$selectedFile = files[0];
    });

  });

  function sortByJs(file) {
    return file.fileType == 'js' ? -1 : 1;
  }

}])
;

DocsApp
.constant('COMPONENTS', [
  {
    "id": "material.components.button",
    "name": "Buttons",
    "docs": [
      {
        "componentId": "material.components.button",
        "componentName": "Buttons",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/buttons/README.md",
        "humanName": "Buttons",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/buttons/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/buttons/README.md",
        "url": "/material.components.button/readme/overview",
        "outputPath": "generated/material.components.button/readme/overview/index.html",
        "readmeUrl": "/material.components.button/readme/overview"
      },
      {
        "description": "`<material-button>` is a button directive with optional ink ripples (default enabled).",
        "componentId": "material.components.button",
        "componentName": "Buttons",
        "docType": "directive",
        "name": "materialButton",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates use of ripple ink effects",
            "startingLine": 28,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "noink"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates if the tab is disabled: not selectable with no ink effects",
            "startingLine": 29,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "disabled"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Optional attribute to specific button types (useful for forms); such as 'submit', etc.",
            "startingLine": 30,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "type"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Optional attribute to support both ARIA and link navigation",
            "startingLine": 31,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ng-href"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Optional attribute to support both ARIA and link navigation",
            "startingLine": 32,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "href"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Publish the button label used by screen-readers for accessibility. Defaults to the button's text.",
            "startingLine": 33,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ariaLabel"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n <material-button>Button</material-button>\n <br/>\n <material-button noink class=\"material-button-colored\">\n   Button (noInk)\n </material-button>\n <br/>\n <material-button disabled class=\"material-button-colored\">\n   Colored (disabled)\n </material-button>\n</hljs>",
        "order": "0",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/buttons/buttons.js",
        "startingLine": 19,
        "humanName": "material-button",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/buttons/buttons.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/buttons/buttons.js",
        "url": "/material.components.button/directive/materialButton",
        "outputPath": "generated/material.components.button/directive/materialButton/index.html",
        "readmeUrl": "/material.components.button/readme/overview"
      }
    ],
    "url": "/material.components.button",
    "demos": [
      {
        "id": "demo1",
        "name": "Basic Buttons",
        "docType": "demo",
        "module": "buttonsDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/buttons/demo1/script.js",
            "componentId": "material.components.button",
            "componentName": "Buttons",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Basic Buttons",
            "module": "buttonsDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/buttons/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.button/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/buttons/demo1/style.css",
            "componentId": "material.components.button",
            "componentName": "Buttons",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Basic Buttons",
            "fileName": "style",
            "relativePath": "style.css/src/components/buttons/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.button/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/buttons/demo1/index.html",
          "componentId": "material.components.button",
          "componentName": "Buttons",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Basic Buttons",
          "fileName": "index",
          "relativePath": "index.html/src/components/buttons/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.button/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.button/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.card",
    "name": "Card",
    "docs": [
      {
        "componentId": "material.components.card",
        "componentName": "Card",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/card/README.md",
        "humanName": "Card",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/card/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/card/README.md",
        "url": "/material.components.card/readme/overview",
        "outputPath": "generated/material.components.card/readme/overview/index.html",
        "readmeUrl": "/material.components.card/readme/overview"
      },
      {
        "description": "The `<material-card>` directive is a container element used within `<material-content>` containers.\n\nCards have constant width and variable heights; where the maximum height is limited to what can\nfit within a single view on a platform, but it can temporarily expand as needed",
        "componentId": "material.components.card",
        "componentName": "Card",
        "docType": "directive",
        "name": "materialCard",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-card>\n <img src=\"/img/washedout.png\" class=\"material-card-image\">\n <h2>Paracosm</h2>\n <p>\n   The titles of Washed Out's breakthrough song and the first single from Paracosm share the * two most important words in Ernest Greene's musical language: feel it. It's a simple request, as well...\n </p>\n</material-card>\n</hljs>",
        "dependencies": [],
        "file": "src/components/card/card.js",
        "startingLine": 16,
        "humanName": "material-card",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/card/card.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/card/card.js",
        "url": "/material.components.card/directive/materialCard",
        "outputPath": "generated/material.components.card/directive/materialCard/index.html",
        "readmeUrl": "/material.components.card/readme/overview"
      }
    ],
    "url": "/material.components.card",
    "demos": [
      {
        "id": "demo1",
        "name": "Card Basic Usage",
        "docType": "demo",
        "module": "cardDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/card/demo1/script.js",
            "componentId": "material.components.card",
            "componentName": "Card",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Card Basic Usage",
            "module": "cardDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/card/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.card/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/card/demo1/style.css",
            "componentId": "material.components.card",
            "componentName": "Card",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Card Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/card/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.card/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/card/demo1/index.html",
          "componentId": "material.components.card",
          "componentName": "Card",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Card Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/card/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.card/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.card/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.checkbox",
    "name": "Checkbox",
    "docs": [
      {
        "componentId": "material.components.checkbox",
        "componentName": "Checkbox",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/checkbox/README.md",
        "humanName": "Checkbox",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/checkbox/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/checkbox/README.md",
        "url": "/material.components.checkbox/readme/overview",
        "outputPath": "generated/material.components.checkbox/readme/overview/index.html",
        "readmeUrl": "/material.components.checkbox/readme/overview"
      },
      {
        "description": "The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).",
        "componentId": "material.components.checkbox",
        "componentName": "Checkbox",
        "docType": "directive",
        "name": "materialCheckbox",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Assignable angular expression to data-bind to.",
            "startingLine": 25,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "ngModel"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Property name of the form under which the control is published.",
            "startingLine": 26,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "name"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The value to which the expression should be set when selected.",
            "startingLine": 27,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "ngTrueValue"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The value to which the expression should be set when not selected.",
            "startingLine": 28,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "ngFalseValue"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Angular expression to be executed when input changes due to user interaction with the input element.",
            "startingLine": 29,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ngChange"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Use of attribute indicates use of ripple ink effects",
            "startingLine": 30,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "noink"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Use of attribute indicates the switch is disabled: no ink effects and not selectable",
            "startingLine": 31,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "disabled"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Publish the button label used by screen-readers for accessibility. Defaults to the checkbox's text.",
            "startingLine": 32,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ariaLabel"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-checkbox ng-model=\"isChecked\" aria-label=\"Finished?\">\n  Finished ?\n</material-checkbox>\n\n<material-checkbox noink ng-model=\"hasInk\" aria-label=\"No Ink Effects\">\n  No Ink Effects\n</material-checkbox>\n\n<material-checkbox disabled ng-model=\"isDisabled\" aria-label=\"Disabled\">\n  Disabled\n</material-checkbox>\n\n</hljs>",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/checkbox/checkbox.js",
        "startingLine": 17,
        "humanName": "material-checkbox",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/checkbox/checkbox.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/checkbox/checkbox.js",
        "url": "/material.components.checkbox/directive/materialCheckbox",
        "outputPath": "generated/material.components.checkbox/directive/materialCheckbox/index.html",
        "readmeUrl": "/material.components.checkbox/readme/overview"
      }
    ],
    "url": "/material.components.checkbox",
    "demos": [
      {
        "id": "demo1",
        "name": "Checkbox Basic Usage",
        "docType": "demo",
        "module": "checkboxDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/checkbox/demo1/script.js",
            "componentId": "material.components.checkbox",
            "componentName": "Checkbox",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Checkbox Basic Usage",
            "module": "checkboxDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/checkbox/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.checkbox/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/checkbox/demo1/style.css",
            "componentId": "material.components.checkbox",
            "componentName": "Checkbox",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Checkbox Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/checkbox/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.checkbox/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/checkbox/demo1/index.html",
          "componentId": "material.components.checkbox",
          "componentName": "Checkbox",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Checkbox Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/checkbox/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.checkbox/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.checkbox/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.content",
    "name": "Content",
    "docs": [
      {
        "componentId": "material.components.content",
        "componentName": "Content",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/content/README.md",
        "humanName": "Content",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/content/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/content/README.md",
        "url": "/material.components.content/readme/overview",
        "outputPath": "generated/material.components.content/readme/overview/index.html",
        "readmeUrl": "/material.components.content/readme/overview"
      },
      {
        "description": "The `<material-content>` directive is a container element useful for scrollable content",
        "componentId": "material.components.content",
        "componentName": "Content",
        "docType": "directive",
        "name": "materialContent",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n <material-content class=\"material-content-padding\">\n     Lorem ipsum dolor sit amet, ne quod novum mei.\n </material-content>\n</hljs>",
        "dependencies": [
          "material.services.registry"
        ],
        "file": "src/components/content/content.js",
        "startingLine": 15,
        "humanName": "material-content",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/content/content.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/content/content.js",
        "url": "/material.components.content/directive/materialContent",
        "outputPath": "generated/material.components.content/directive/materialContent/index.html",
        "readmeUrl": "/material.components.content/readme/overview"
      }
    ],
    "url": "/material.components.content",
    "demos": [
      {
        "id": "demo1",
        "name": "Content Basic Usage",
        "docType": "demo",
        "module": "contentDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/content/demo1/script.js",
            "componentId": "material.components.content",
            "componentName": "Content",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Content Basic Usage",
            "module": "contentDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/content/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.content/demo/demo1/script.js"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/content/demo1/index.html",
          "componentId": "material.components.content",
          "componentName": "Content",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Content Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/content/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.content/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.content/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.dialog",
    "name": "Dialog",
    "docs": [
      {
        "componentId": "material.components.dialog",
        "componentName": "Dialog",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/dialog/README.md",
        "humanName": "Dialog",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/dialog/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/dialog/README.md",
        "url": "/material.components.dialog/readme/overview",
        "outputPath": "generated/material.components.dialog/readme/overview/index.html",
        "readmeUrl": "/material.components.dialog/readme/overview"
      },
      {
        "description": "The $materialDialog service opens a dialog over top of the app. \n\nNote: The dialog is always given an isolate scope.\n\n`$materialDialog` is an `$interimElement` service and adheres to the same behaviors.\n - `$materialDialog.show()`\n - `$materialDialog.hide()`\n - `$materialDialog.cancel()`\n\nNote: the dialog's template must have an outer `<material-dialog>` element. \nInside, use an element with class `dialog-content` for the dialog's content, and use\nan element with class `dialog-actions` for the dialog's actions.  \n\nWhen opened, the `dialog-actions` area will attempt to focus the first button found with \nclass `dialog-close`. If no button with `dialog-close` class is found, it will focus the\nlast button in the `dialog-actions` area.",
        "componentId": "material.components.dialog",
        "componentName": "Dialog",
        "docType": "service",
        "name": "$materialDialog",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<div ng-controller=\"MyController\">\n  <material-button ng-click=\"openDialog($event)\">\n    Open a Dialog from this button!\n  </material-button>\n</div>\n</hljs>\n<hljs lang=\"js\">\nvar app = angular.module('app', ['ngMaterial']);\napp.controller('MyController', function($scope, $materialDialog) {\n  $scope.openDialog = function($event) {\n    $materialDialog.show({\n      template: '<material-dialog>Hello!</material-dialog>',\n      targetEvent: $event\n    });\n  };\n});\n</hljs>",
        "dependencies": [
          "material.animations",
          "material.services.compiler",
          "material.services.aria",
          "material.services.interimElement",
          ""
        ],
        "file": "src/components/dialog/dialog.js",
        "startingLine": 39,
        "humanName": "$materialDialog",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/dialog/dialog.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/dialog/dialog.js",
        "url": "/material.components.dialog/service/$materialDialog",
        "outputPath": "generated/material.components.dialog/service/$materialDialog/index.html",
        "readmeUrl": "/material.components.dialog/readme/overview"
      }
    ],
    "url": "/material.components.dialog",
    "demos": [
      {
        "id": "demo1",
        "name": "Dialog Basic Usage",
        "docType": "demo",
        "module": "dialogDemo1",
        "files": [
          {
            "fileType": "html",
            "file": "src/components/dialog/demo1/my-dialog.tmpl.html",
            "componentId": "material.components.dialog",
            "componentName": "Dialog",
            "basePath": "my-dialog.tmpl.html",
            "docType": "demo",
            "id": "demo1",
            "name": "Dialog Basic Usage",
            "fileName": "my-dialog.tmpl",
            "relativePath": "my-dialog.tmpl.html/src/components/dialog/demo1/my-dialog.tmpl.html",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.dialog/demo/demo1/my-dialog.tmpl.html"
          },
          {
            "fileType": "js",
            "file": "src/components/dialog/demo1/script.js",
            "componentId": "material.components.dialog",
            "componentName": "Dialog",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Dialog Basic Usage",
            "module": "dialogDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/dialog/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.dialog/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/dialog/demo1/style.css",
            "componentId": "material.components.dialog",
            "componentName": "Dialog",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Dialog Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/dialog/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.dialog/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/dialog/demo1/index.html",
          "componentId": "material.components.dialog",
          "componentName": "Dialog",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Dialog Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/dialog/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.dialog/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.dialog/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.divider",
    "name": "Divider",
    "docs": [
      {
        "componentId": "material.components.divider",
        "componentName": "Divider",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/divider/README.md",
        "humanName": "Divider",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/divider/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/divider/README.md",
        "url": "/material.components.divider/readme/overview",
        "outputPath": "generated/material.components.divider/readme/overview/index.html",
        "readmeUrl": "/material.components.divider/readme/overview"
      },
      {
        "description": "Dividers group and separate content within lists and page layouts using strong visual and spatial distinctions. This divider is a thin rule, lightweight enough to not distract the user from content.",
        "componentId": "material.components.divider",
        "componentName": "Divider",
        "docType": "directive",
        "name": "materialDivider",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Add this attribute to activate the inset divider style.",
            "startingLine": 22,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "inset"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-divider></material-divider>\n\n<material-divider inset></material-divider>\n</hljs>",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/divider/divider.js",
        "startingLine": 14,
        "humanName": "material-divider",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/divider/divider.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/divider/divider.js",
        "url": "/material.components.divider/directive/materialDivider",
        "outputPath": "generated/material.components.divider/directive/materialDivider/index.html",
        "readmeUrl": "/material.components.divider/readme/overview"
      }
    ],
    "url": "/material.components.divider",
    "demos": [
      {
        "id": "demo1",
        "name": "Divider Usage",
        "docType": "demo",
        "module": "dividerDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/divider/demo1/script.js",
            "componentId": "material.components.divider",
            "componentName": "Divider",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Divider Usage",
            "module": "dividerDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/divider/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.divider/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/divider/demo1/style.css",
            "componentId": "material.components.divider",
            "componentName": "Divider",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Divider Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/divider/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.divider/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/divider/demo1/index.html",
          "componentId": "material.components.divider",
          "componentName": "Divider",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Divider Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/divider/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.divider/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.divider/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.linearProgress",
    "name": "Linear Progress",
    "docs": [
      {
        "componentId": "material.components.linearProgress",
        "componentName": "Linear Progress",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/linearProgress/README.md",
        "humanName": "Linear Progress",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/linearProgress/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/linearProgress/README.md",
        "url": "/material.components.linearProgress/readme/overview",
        "outputPath": "generated/material.components.linearProgress/readme/overview/index.html",
        "readmeUrl": "/material.components.linearProgress/readme/overview"
      },
      {
        "description": "The linear progress directive is used to make loading content in your app as delightful and painless as possible by minimizing the amount of visual change a user sees before they can view and interact with content. Each operation should only be represented by one activity indicator—for example, one refresh operation should not display both a refresh bar and an activity circle.\n\nFor operations where the percentage of the operation completed can be determined, use a determinate indicator. They give users a quick sense of how long an operation will take.\n\nFor operations where the user is asked to wait a moment while something finishes up, and it’s not necessary to expose what's happening behind the scenes and how long it will take, use an indeterminate indicator.",
        "componentId": "material.components.linearProgress",
        "componentName": "Linear Progress",
        "docType": "directive",
        "name": "materialLinearProgress",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Select from one of four modes: determinate, indeterminate, buffer or query.",
            "startingLine": 28,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "mode"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "In determinate and buffer modes, this number represents the percentage of the primary progress bar. Default: 0",
            "startingLine": 29,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "value"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "In the buffer mode, this number represents the precentage of the secondary progress bar. Default: 0",
            "startingLine": 30,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "secondaryValue"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-linear-progress mode=\"determinate\" value=\"...\"></material-linear-progress>\n\n<material-linear-progress mode=\"determinate\" ng-value=\"...\"></material-linear-progress>\n\n<material-linear-progress mode=\"indeterminate\"></material-linear-progress>\n\n<material-linear-progress mode=\"buffer\" value=\"...\" secondaryValue=\"...\"></material-linear-progress>\n\n<material-linear-progress mode=\"query\"></material-linear-progress>\n</hljs>",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/linearProgress/linearProgress.js",
        "startingLine": 16,
        "humanName": "material-linear-progress",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/linearProgress/linearProgress.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/linearProgress/linearProgress.js",
        "url": "/material.components.linearProgress/directive/materialLinearProgress",
        "outputPath": "generated/material.components.linearProgress/directive/materialLinearProgress/index.html",
        "readmeUrl": "/material.components.linearProgress/readme/overview"
      }
    ],
    "url": "/material.components.linearProgress",
    "demos": [
      {
        "id": "demo1",
        "name": "Linear Progress Basic Usage",
        "docType": "demo",
        "module": "linearProgressDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/linearProgress/demo1/script.js",
            "componentId": "material.components.linearProgress",
            "componentName": "Linear Progress",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Linear Progress Basic Usage",
            "module": "linearProgressDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/linearProgress/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.linearProgress/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/linearProgress/demo1/style.css",
            "componentId": "material.components.linearProgress",
            "componentName": "Linear Progress",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Linear Progress Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/linearProgress/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.linearProgress/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/linearProgress/demo1/index.html",
          "componentId": "material.components.linearProgress",
          "componentName": "Linear Progress",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Linear Progress Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/linearProgress/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.linearProgress/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.linearProgress/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.list",
    "name": "Lists",
    "docs": [
      {
        "componentId": "material.components.list",
        "componentName": "Lists",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/list/README.md",
        "humanName": "Lists",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/list/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/list/README.md",
        "url": "/material.components.list/readme/overview",
        "outputPath": "generated/material.components.list/readme/overview/index.html",
        "readmeUrl": "/material.components.list/readme/overview"
      },
      {
        "description": "The `<material-list>` directive is a list container for 1..n `<material-item>` tags.",
        "componentId": "material.components.list",
        "componentName": "Lists",
        "docType": "directive",
        "name": "materialList",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-list>\n <material-item ng-repeat=\"item in todos\">\n   <div class=\"material-tile-left\">\n     <img ng-src=\"{{item.face}}\" class=\"face\" alt=\"{{item.who}}\">\n   </div>\n   <div class=\"material-tile-content\">\n     <h2>{{item.what}}</h2>\n     <h3>{{item.who}}</h3>\n     <p>\n       {{item.notes}}\n     </p>\n   </div>\n\n </material-item>\n</material-list>\n</hljs>",
        "dependencies": [],
        "file": "src/components/list/list.js",
        "startingLine": 16,
        "humanName": "material-list",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/list/list.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/list/list.js",
        "url": "/material.components.list/directive/materialList",
        "outputPath": "generated/material.components.list/directive/materialList/index.html",
        "readmeUrl": "/material.components.list/readme/overview"
      },
      {
        "description": "The `<material-item>` directive is a container intended for row items in a `<material-list>` container.",
        "componentId": "material.components.list",
        "componentName": "Lists",
        "docType": "directive",
        "name": "materialItem",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n <material-list>\n   <material-item>\n           Item content in list\n   </material-item>\n </material-list>\n</hljs>",
        "dependencies": [],
        "file": "src/components/list/list.js",
        "startingLine": 57,
        "humanName": "material-item",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/list/list.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/list/list.js",
        "url": "/material.components.list/directive/materialItem",
        "outputPath": "generated/material.components.list/directive/materialItem/index.html",
        "readmeUrl": "/material.components.list/readme/overview"
      }
    ],
    "url": "/material.components.list",
    "demos": [
      {
        "id": "demo1",
        "name": "List Basic Usage",
        "docType": "demo",
        "module": "listDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/list/demo1/script.js",
            "componentId": "material.components.list",
            "componentName": "Lists",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "List Basic Usage",
            "module": "listDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/list/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.list/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/list/demo1/style.css",
            "componentId": "material.components.list",
            "componentName": "Lists",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "List Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/list/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.list/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/list/demo1/index.html",
          "componentId": "material.components.list",
          "componentName": "Lists",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "List Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/list/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.list/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.list/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.radioButton",
    "name": "Radio Button",
    "docs": [
      {
        "componentId": "material.components.radioButton",
        "componentName": "Radio Button",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/radioButton/README.md",
        "humanName": "Radio Button",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/radioButton/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/radioButton/README.md",
        "url": "/material.components.radioButton/readme/overview",
        "outputPath": "generated/material.components.radioButton/readme/overview/index.html",
        "readmeUrl": "/material.components.radioButton/readme/overview"
      },
      {
        "description": "The `<material-radio-group>` directive identifies a grouping\ncontainer for the 1..n grouped material radio buttons; specified using nested\n`<material-radio-button>` tags.",
        "componentId": "material.components.radioButton",
        "componentName": "Radio Button",
        "docType": "directive",
        "name": "materialRadioGroup",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Assignable angular expression to data-bind to.",
            "startingLine": 31,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "ngModel"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Use of attribute indicates flag to disable ink ripple effects.",
            "startingLine": 32,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "noink"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-radio-group ng-model=\"selected\">\n\n  <material-radio-button\n       ng-repeat=\"d in colorOptions\"\n       ng-value=\"d.value\" aria-label=\"{{ d.label }}\">\n\n         {{ d.label }}\n\n  </material-radio-button>\n\n</material-radio-group>\n</hljs>",
        "order": "0",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/radioButton/radioButton.js",
        "startingLine": 19,
        "humanName": "material-radio-group",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/radioButton/radioButton.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/radioButton/radioButton.js",
        "url": "/material.components.radioButton/directive/materialRadioGroup",
        "outputPath": "generated/material.components.radioButton/directive/materialRadioGroup/index.html",
        "readmeUrl": "/material.components.radioButton/readme/overview"
      },
      {
        "description": "The `<material-radio-button>`directive is the child directive required to be used within `<material-radioo-group>` elements.\n\nWhile similar to the `<input type=\"radio\" ng-model=\"\" value=\"\">` directive,\nthe `<material-radio-button>` directive provides material ink effects, ARIA support, and\nsupports use within named radio groups.",
        "componentId": "material.components.radioButton",
        "componentName": "Radio Button",
        "docType": "directive",
        "name": "materialRadioButton",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Assignable angular expression to data-bind to.",
            "startingLine": 165,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "ngModel"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Angular expression to be executed when input changes due to user\n   interaction with the input element.",
            "startingLine": 166,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ngChange"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Angular expression which sets the value to which the expression should\n   be set when selected.*",
            "startingLine": 168,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "ngValue"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The value to which the expression should be set when selected.",
            "startingLine": 170,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "value"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Property name of the form under which the control is published.",
            "startingLine": 171,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "name"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Publish the button label used by screen-readers for accessibility. Defaults to the radio button's text.",
            "startingLine": 172,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ariaLabel"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n\n<material-radio-button value=\"1\" aria-label=\"Label 1\">\n  Label 1\n</material-radio-button>\n\n<material-radio-button ng-model=\"color\" ng-value=\"specialValue\" aria-label=\"Green\">\n  Green\n</material-radio-button>\n\n</hljs>",
        "order": "1",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/radioButton/radioButton.js",
        "startingLine": 151,
        "humanName": "material-radio-button",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/radioButton/radioButton.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/radioButton/radioButton.js",
        "url": "/material.components.radioButton/directive/materialRadioButton",
        "outputPath": "generated/material.components.radioButton/directive/materialRadioButton/index.html",
        "readmeUrl": "/material.components.radioButton/readme/overview"
      }
    ],
    "url": "/material.components.radioButton",
    "demos": [
      {
        "id": "demo1",
        "name": "Radio Button Basic Usage",
        "docType": "demo",
        "module": "radioDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/radioButton/demo1/script.js",
            "componentId": "material.components.radioButton",
            "componentName": "Radio Button",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Radio Button Basic Usage",
            "module": "radioDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/radioButton/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.radioButton/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/radioButton/demo1/style.css",
            "componentId": "material.components.radioButton",
            "componentName": "Radio Button",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Radio Button Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/radioButton/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.radioButton/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/radioButton/demo1/index.html",
          "componentId": "material.components.radioButton",
          "componentName": "Radio Button",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Radio Button Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/radioButton/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.radioButton/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.radioButton/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.sidenav",
    "name": "Side Navigation",
    "docs": [
      {
        "componentId": "material.components.sidenav",
        "componentName": "Side Navigation",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/sidenav/README.md",
        "humanName": "Side Navigation",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/sidenav/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/sidenav/README.md",
        "url": "/material.components.sidenav/readme/overview",
        "outputPath": "generated/material.components.sidenav/readme/overview/index.html",
        "readmeUrl": "/material.components.sidenav/readme/overview"
      },
      {
        "description": "A Sidenav component that can be opened and closed programatically.\n\nWhen used properly with a layout, it will seamleslly stay open on medium\nand larger screens, while being hidden by default on mobile devices.",
        "componentId": "material.components.sidenav",
        "componentName": "Side Navigation",
        "docType": "directive",
        "name": "materialSidenav",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<div layout=\"horizontal\" ng-controller=\"MyController\">\n  <material-sidenav component-id=\"left\" class=\"material-sidenav-left\">\n    Left Nav!\n  </material-sidenav>\n\n  <material-content>\n    Center Content\n    <material-button ng-click=\"openLeftMenu()\">\n      Open Left Menu\n    </material-button>\n  </material-content>\n\n  <material-sidenav component-id=\"right\" class=\"material-sidenav-right\">\n    Right Nav!\n  </material-sidenav>\n</div>\n</hljs>\n\n<hljs lang=\"js\">\nvar app = angular.module('myApp', ['ngMaterial']);\napp.controller('MainController', function($scope, $materialSidenav) {\n  $scope.openLeftMenu = function() {\n    $materialSidenav('left').toggle();\n  };\n});\n</hljs>",
        "dependencies": [
          "material.services.registry"
        ],
        "file": "src/components/sidenav/sidenav.js",
        "startingLine": 133,
        "humanName": "material-sidenav",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/sidenav/sidenav.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/sidenav/sidenav.js",
        "url": "/material.components.sidenav/directive/materialSidenav",
        "outputPath": "generated/material.components.sidenav/directive/materialSidenav/index.html",
        "readmeUrl": "/material.components.sidenav/readme/overview"
      }
    ],
    "url": "/material.components.sidenav",
    "demos": [
      {
        "id": "demo1",
        "name": "Side Navigation Basic Usage",
        "docType": "demo",
        "module": "sidenavDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/sidenav/demo1/script.js",
            "componentId": "material.components.sidenav",
            "componentName": "Side Navigation",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Side Navigation Basic Usage",
            "module": "sidenavDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/sidenav/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.sidenav/demo/demo1/script.js"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/sidenav/demo1/index.html",
          "componentId": "material.components.sidenav",
          "componentName": "Side Navigation",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Side Navigation Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/sidenav/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.sidenav/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.sidenav/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.slider",
    "name": "Slider",
    "docs": [
      {
        "componentId": "material.components.slider",
        "componentName": "Slider",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/slider/README.md",
        "humanName": "Slider",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/slider/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/slider/README.md",
        "url": "/material.components.slider/readme/overview",
        "outputPath": "generated/material.components.slider/readme/overview/index.html",
        "readmeUrl": "/material.components.slider/readme/overview"
      },
      {
        "description": "The `<material-slider>` component allows the user to choose from a range of\nvalues.\n\nIt has two modes: 'normal' mode, where the user slides between a wide range\nof values, and 'discrete' mode, where the user slides between only a few\nselect values.\n\nTo enable discrete mode, add the `discrete` attribute to a slider,\nand use the `step` attribute to change the distance between\nvalues the user is allowed to pick.",
        "componentId": "material.components.slider",
        "componentName": "Slider",
        "docType": "directive",
        "name": "materialSlider",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Whether to enable discrete mode.",
            "startingLine": 41,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "discrete"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The distance between values the user is allowed to pick. Default 1.",
            "startingLine": 42,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "step"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The minimum value the user is allowed to pick. Default 0.",
            "startingLine": 43,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "min"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The maximum value the user is allowed to pick. Default 100.",
            "startingLine": 44,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "max"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<h4>Normal Mode</h4>\n<hljs lang=\"html\">\n<material-slider ng-model=\"myValue\" min=\"5\" max=\"500\">\n</material-slider>\n</hljs>\n<h4>Discrete Mode</h4>\n<hljs lang=\"html\">\n<material-slider discrete ng-model=\"myDiscreteValue\" step=\"10\" min=\"10\" max=\"130\">\n</material-slider>\n</hljs>",
        "dependencies": [
          "material.animations",
          "material.services.aria"
        ],
        "file": "src/components/slider/slider.js",
        "startingLine": 13,
        "humanName": "material-slider",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/slider/slider.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/slider/slider.js",
        "url": "/material.components.slider/directive/materialSlider",
        "outputPath": "generated/material.components.slider/directive/materialSlider/index.html",
        "readmeUrl": "/material.components.slider/readme/overview"
      }
    ],
    "url": "/material.components.slider",
    "demos": [
      {
        "id": "demo1",
        "name": "Slider Basic Usage",
        "docType": "demo",
        "module": "sliderDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/slider/demo1/script.js",
            "componentId": "material.components.slider",
            "componentName": "Slider",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Slider Basic Usage",
            "module": "sliderDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/slider/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.slider/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/slider/demo1/style.css",
            "componentId": "material.components.slider",
            "componentName": "Slider",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Slider Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/slider/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.slider/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/slider/demo1/index.html",
          "componentId": "material.components.slider",
          "componentName": "Slider",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Slider Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/slider/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.slider/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.slider/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.switch",
    "name": "Switch",
    "docs": [
      {
        "componentId": "material.components.switch",
        "componentName": "Switch",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/switch/README.md",
        "humanName": "Switch",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/switch/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/switch/README.md",
        "url": "/material.components.switch/readme/overview",
        "outputPath": "generated/material.components.switch/readme/overview/index.html",
        "readmeUrl": "/material.components.switch/readme/overview"
      },
      {
        "componentId": "material.components.switch",
        "componentName": "Switch",
        "docType": "directive",
        "name": "materialSwitch",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Assignable angular expression to data-bind to.",
            "startingLine": 24,
            "typeExpression": "string",
            "type": {
              "type": "NameExpression",
              "name": "string"
            },
            "typeList": [
              "string"
            ],
            "name": "ngModel"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Property name of the form under which the control is published.",
            "startingLine": 25,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "name"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The value to which the expression should be set when selected.",
            "startingLine": 26,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "ngTrueValue"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "The value to which the expression should be set when not selected.",
            "startingLine": 27,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "ngFalseValue"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Angular expression to be executed when input changes due to user interaction with the input element.",
            "startingLine": 28,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ngChange"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Use of attribute indicates use of ripple ink effects.",
            "startingLine": 29,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "noink"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Use of attribute indicates the switch is disabled: no ink effects and not selectable",
            "startingLine": 30,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "disabled"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Publish the button label used by screen-readers for accessibility. Defaults to the switch's text.",
            "startingLine": 31,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "ariaLabel"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-switch ng-model=\"isActive\" aria-label=\"Finished?\">\n  Finished ?\n</material-switch>\n\n<material-switch noink ng-model=\"hasInk\" aria-label=\"No Ink Effects\">\n  No Ink Effects\n</material-switch>\n\n<material-switch disabled ng-model=\"isDisabled\" aria-label=\"Disabled\">\n  Disabled\n</material-switch>\n\n</hljs>",
        "dependencies": [
          "material.components.checkbox",
          "material.components.radioButton"
        ],
        "file": "src/components/switch/switch.js",
        "startingLine": 17,
        "humanName": "material-switch",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/switch/switch.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/switch/switch.js",
        "url": "/material.components.switch/directive/materialSwitch",
        "outputPath": "generated/material.components.switch/directive/materialSwitch/index.html",
        "readmeUrl": "/material.components.switch/readme/overview"
      }
    ],
    "url": "/material.components.switch",
    "demos": [
      {
        "id": "demo1",
        "name": "Switch Basic Usage",
        "docType": "demo",
        "module": "switchDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/switch/demo1/script.js",
            "componentId": "material.components.switch",
            "componentName": "Switch",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Switch Basic Usage",
            "module": "switchDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/switch/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.switch/demo/demo1/script.js"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/switch/demo1/index.html",
          "componentId": "material.components.switch",
          "componentName": "Switch",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Switch Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/switch/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.switch/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.switch/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.tabs",
    "name": "Tabs",
    "docs": [
      {
        "componentId": "material.components.tabs",
        "componentName": "Tabs",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/tabs/README.md",
        "humanName": "Tabs",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/tabs/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/tabs/README.md",
        "url": "/material.components.tabs/readme/overview",
        "outputPath": "generated/material.components.tabs/readme/overview/index.html",
        "readmeUrl": "/material.components.tabs/readme/overview"
      },
      {
        "description": "The `<material-tabs>` directive serves as the container for 1..n `<material-tab>` child directives to produces a Tabs components.\nIn turn, the nested `<material-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view\ncontent that will be associated with each tab button.\n\nBelow is the markup for its simplest usage:\n\n <hljs lang=\"html\">\n <material-tabs>\n   <material-tab label=\"Tab #1\"></material-tab>\n   <material-tab label=\"Tab #2\"></material-tab>\n   <material-tab label=\"Tab #3\"></material-tab>\n <material-tabs>\n </hljs>\n\nTabs supports three (3) usage scenarios:\n\n 1. Tabs (buttons only)\n 2. Tabs with internal view content\n 3. Tabs with external view content\n\n**Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.\n**Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.\n**Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.\n\n> As a performance bonus, if the tab content is managed internally then the non-active (non-visible) tab contents are temporarily disconnected from the `$scope.$digest()` processes; which restricts and optimizes DOM updates to only the currently active tab.\n\nAdditional features also include:\n\n*  Content can include any markup.\n*  If a tab is disabled while active/selected, then the next tab will be auto-selected.\n*  If the currently active tab is the last tab, then next() action will select the first tab.\n*  Any markup (other than **`<material-tab>`** tags) will be transcluded into the tab header area BEFORE the tab buttons.",
        "componentId": "material.components.tabs",
        "componentName": "Tabs",
        "docType": "directive",
        "name": "materialTabs",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Index of the active/selected tab",
            "startingLine": 44,
            "typeExpression": "integer=",
            "type": {
              "type": "NameExpression",
              "name": "integer",
              "optional": true
            },
            "typeList": [
              "integer"
            ],
            "optional": true,
            "name": "selected"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates use of ripple ink effects",
            "startingLine": 45,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "noink"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates use of ink bar effects",
            "startingLine": 46,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "nobar"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Attribute to indicate position of tab buttons: bottom or top; default is `top`",
            "startingLine": 47,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "align-tabs"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-tabs selected=\"selectedIndex\" >\n  <img ng-src=\"/img/angular.png\" class=\"centered\">\n\n  <material-tab\n     ng-repeat=\"tab in tabs | orderBy:predicate:reversed\"\n     on-select=\"onTabSelected(tab)\"\n     on-deselect=\"announceDeselected(tab)\"\n     disabled=\"tab.disabled\" >\n\n      <material-tab-label>\n          {{tab.title}}\n          <img src=\"/img/removeTab.png\"\n               ng-click=\"removeTab(tab)\"\n               class=\"delete\" >\n      </material-tab-label>\n\n      {{tab.content}}\n\n  </material-tab>\n\n</material-tabs>\n</hljs>",
        "order": "0",
        "dependencies": [],
        "file": "src/components/tabs/js/tabsDirective.js",
        "startingLine": 3,
        "humanName": "material-tabs",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/tabs/js/tabsDirective.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/tabs/js/tabsDirective.js",
        "url": "/material.components.tabs/directive/materialTabs",
        "outputPath": "generated/material.components.tabs/directive/materialTabs/index.html",
        "readmeUrl": "/material.components.tabs/readme/overview"
      },
      {
        "description": "`<material-tab>` is the nested directive used [within `<material-tabs>`] to specify each tab with a **label** and optional *view content*.\n\nIf the `label` attribute is not specified, then an optional `<material-tab-label>` tag can be used to specified more\ncomplex tab header markup. If neither the **label** nor the **material-tab-label** are specified, then the nested\nmarkup of the `<material-tab>` is used as the tab header markup.\n\nIf a tab **label** has been identified, then any **non-**`<material-tab-label>` markup\nwill be considered tab content and will be transcluded to the internal `<div class=\"tabs-content\">` container.\n\nThis container is used by the TabsController to show/hide the active tab's content view. This synchronization is\nautomatically managed by the internal TabsController whenever the tab selection changes. Selection changes can\nbe initiated via data binding changes, programmatic invocation, or user gestures.",
        "componentId": "material.components.tabs",
        "componentName": "Tabs",
        "docType": "directive",
        "name": "materialTab",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Optional attribute to specify a simple string as the tab label",
            "startingLine": 31,
            "typeExpression": "string=",
            "type": {
              "type": "NameExpression",
              "name": "string",
              "optional": true
            },
            "typeList": [
              "string"
            ],
            "optional": true,
            "name": "label"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates if the tab is currently selected; normally the `<material-tabs selected=\"\">`; attribute is used instead.",
            "startingLine": 32,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "active"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Flag indicates if the tab is disabled: not selectable with no ink effects",
            "startingLine": 33,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "ngDisabled"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Expression to be evaluated after the tab has been de-selected.",
            "startingLine": 34,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "deselected"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Expression to be evaluated after the tab has been selected.",
            "startingLine": 35,
            "typeExpression": "expression=",
            "type": {
              "type": "NameExpression",
              "name": "expression",
              "optional": true
            },
            "typeList": [
              "expression"
            ],
            "optional": true,
            "name": "selected"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-tab label=\"\" disabled=\"\" selected=\"\" deselected=\"\" >\n  <h3>My Tab content</h3>\n</material-tab>\n\n<material-tab >\n  <material-tab-label>\n    <h3>My Tab content</h3>\n  </material-tab-label>\n  <p>\n    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,\n    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae\n    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,\n    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.\n  </p>\n</material-tab>\n</hljs>",
        "order": "1",
        "dependencies": [],
        "file": "src/components/tabs/js/tabItemDirective.js",
        "startingLine": 10,
        "humanName": "material-tab",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/tabs/js/tabItemDirective.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/tabs/js/tabItemDirective.js",
        "url": "/material.components.tabs/directive/materialTab",
        "outputPath": "generated/material.components.tabs/directive/materialTab/index.html",
        "readmeUrl": "/material.components.tabs/readme/overview"
      }
    ],
    "url": "/material.components.tabs",
    "demos": [
      {
        "id": "demo1",
        "name": "Static Paginated Tabs",
        "docType": "demo",
        "module": "tabsDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/tabs/demos/demo1/script.js",
            "componentId": "material.components.tabs",
            "componentName": "Tabs",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Static Paginated Tabs",
            "module": "tabsDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/tabs/demos/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.tabs/demo/demo1/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/tabs/demos/demo1/style.css",
            "componentId": "material.components.tabs",
            "componentName": "Tabs",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Static Paginated Tabs",
            "fileName": "style",
            "relativePath": "style.css/src/components/tabs/demos/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.tabs/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/tabs/demos/demo1/index.html",
          "componentId": "material.components.tabs",
          "componentName": "Tabs",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Static Paginated Tabs",
          "fileName": "index",
          "relativePath": "index.html/src/components/tabs/demos/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.tabs/demo/demo1/index.html"
        }
      },
      {
        "id": "demo2",
        "name": "Dynamic Tabs",
        "docType": "demo",
        "module": "tabsDemo2",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/tabs/demos/demo2/script.js",
            "componentId": "material.components.tabs",
            "componentName": "Tabs",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo2",
            "name": "Dynamic Tabs",
            "module": "tabsDemo2",
            "fileName": "script",
            "relativePath": "script.js/src/components/tabs/demos/demo2/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.tabs/demo/demo2/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/tabs/demos/demo2/style.css",
            "componentId": "material.components.tabs",
            "componentName": "Tabs",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo2",
            "name": "Dynamic Tabs",
            "fileName": "style",
            "relativePath": "style.css/src/components/tabs/demos/demo2/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.tabs/demo/demo2/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/tabs/demos/demo2/index.html",
          "componentId": "material.components.tabs",
          "componentName": "Tabs",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo2",
          "name": "Dynamic Tabs",
          "fileName": "index",
          "relativePath": "index.html/src/components/tabs/demos/demo2/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.tabs/demo/demo2/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.tabs/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.textField",
    "name": "Text Field",
    "docs": [
      {
        "componentId": "material.components.textField",
        "componentName": "Text Field",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/textField/README.md",
        "humanName": "Text Field",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/textField/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/textField/README.md",
        "url": "/material.components.textField/readme/overview",
        "outputPath": "generated/material.components.textField/readme/overview/index.html",
        "readmeUrl": "/material.components.textField/readme/overview"
      },
      {
        "description": "Use the `<material-input-group>` directive as the grouping parent of a `<material-input>` element.",
        "componentId": "material.components.textField",
        "componentName": "Text Field",
        "docType": "directive",
        "name": "materialInputGroup",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-input-group>\n  <material-input type=\"text\" ng-model=\"myText\"></material-input>\n</material-input-group>\n</hljs>",
        "dependencies": [],
        "file": "src/components/textField/textField.js",
        "startingLine": 15,
        "humanName": "material-input-group",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/textField/textField.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/textField/textField.js",
        "url": "/material.components.textField/directive/materialInputGroup",
        "outputPath": "generated/material.components.textField/directive/materialInputGroup/index.html",
        "readmeUrl": "/material.components.textField/readme/overview"
      },
      {
        "description": "Use the `<material-input>` directive as elements within a `<material-input-group>` container",
        "componentId": "material.components.textField",
        "componentName": "Text Field",
        "docType": "directive",
        "name": "materialInput",
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<material-input-group>\n  <material-input type=\"text\" ng-model=\"user.fullName\"></material-input>\n  <material-input type=\"text\" ng-model=\"user.email\"></material-input>\n</material-input-group>\n</hljs>",
        "dependencies": [],
        "file": "src/components/textField/textField.js",
        "startingLine": 44,
        "humanName": "material-input",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/textField/textField.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/textField/textField.js",
        "url": "/material.components.textField/directive/materialInput",
        "outputPath": "generated/material.components.textField/directive/materialInput/index.html",
        "readmeUrl": "/material.components.textField/readme/overview"
      }
    ],
    "url": "/material.components.textField",
    "demos": [
      {
        "id": "demo1",
        "name": "Text Field Usage",
        "docType": "demo",
        "module": "formDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/textField/demo1/script.js",
            "componentId": "material.components.textField",
            "componentName": "Text Field",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Text Field Usage",
            "module": "formDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/textField/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.textField/demo/demo1/script.js"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/textField/demo1/index.html",
          "componentId": "material.components.textField",
          "componentName": "Text Field",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Text Field Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/textField/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.textField/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.textField/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.toast",
    "name": "Toast",
    "docs": [
      {
        "componentId": "material.components.toast",
        "componentName": "Toast",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/toast/README.md",
        "humanName": "Toast",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/toast/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/toast/README.md",
        "url": "/material.components.toast/readme/overview",
        "outputPath": "generated/material.components.toast/readme/overview/index.html",
        "readmeUrl": "/material.components.toast/readme/overview"
      },
      {
        "description": "Open a toast notification on any position on the screen, with an optional \nduration.\n\nOnly one toast notification may ever be active at any time. If a new toast is\nshown while a different toast is active, the old toast will be automatically\nhidden.\n\n`$materialToast` is an `$interimElement` service and adheres to the same behaviors.\n - `$materialToast.show()`\n - `$materialToast.hide()`\n - `$materialToast.cancel()`",
        "componentId": "material.components.toast",
        "componentName": "Toast",
        "docType": "service",
        "name": "$materialToast",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<div ng-controller=\"MyController\">\n  <material-button ng-click=\"openToast()\">\n    Open a Toast!\n  </material-button>\n</div>\n</hljs>\n<hljs lang=\"js\">\nvar app = angular.module('app', ['ngMaterial']);\napp.controller('MyController', function($scope, $materialToast) {\n  $scope.openToast = function($event) {\n    $materialToast.show({\n      template: '<material-toast>Hello!</material-toast>',\n      hideDelay: 3000\n    });\n  };\n});\n</hljs>",
        "dependencies": [
          "material.services.interimElement",
          "material.components.swipe"
        ],
        "file": "src/components/toast/toast.js",
        "startingLine": 28,
        "humanName": "$materialToast",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/toast/toast.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/toast/toast.js",
        "url": "/material.components.toast/service/$materialToast",
        "outputPath": "generated/material.components.toast/service/$materialToast/index.html",
        "readmeUrl": "/material.components.toast/readme/overview"
      }
    ],
    "url": "/material.components.toast",
    "demos": [
      {
        "id": "demo1",
        "name": "Toast Basic Usage",
        "docType": "demo",
        "module": "toastDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/toast/demo1/script.js",
            "componentId": "material.components.toast",
            "componentName": "Toast",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Toast Basic Usage",
            "module": "toastDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/toast/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.toast/demo/demo1/script.js"
          },
          {
            "fileType": "html",
            "file": "src/components/toast/demo1/toast-template.html",
            "componentId": "material.components.toast",
            "componentName": "Toast",
            "basePath": "toast-template.html",
            "docType": "demo",
            "id": "demo1",
            "name": "Toast Basic Usage",
            "fileName": "toast-template",
            "relativePath": "toast-template.html/src/components/toast/demo1/toast-template.html",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.toast/demo/demo1/toast-template.html"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/toast/demo1/index.html",
          "componentId": "material.components.toast",
          "componentName": "Toast",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Toast Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/toast/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.toast/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.toast/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.toolbar",
    "name": "Toolbar",
    "docs": [
      {
        "componentId": "material.components.toolbar",
        "componentName": "Toolbar",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/toolbar/README.md",
        "humanName": "Toolbar",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/toolbar/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/toolbar/README.md",
        "url": "/material.components.toolbar/readme/overview",
        "outputPath": "generated/material.components.toolbar/readme/overview/index.html",
        "readmeUrl": "/material.components.toolbar/readme/overview"
      },
      {
        "description": "`material-toolbar` is used to place a toolbar in your app.\n\nToolbars are usually used above a content area to display the title of the\ncurrent page, and show relevant action buttons for that page.\n\nYou can change the height of the toolbar by adding either the\n`material-medium-tall` or `material-tall` class to the toolbar.",
        "componentId": "material.components.toolbar",
        "componentName": "Toolbar",
        "docType": "directive",
        "name": "materialToolbar",
        "params": [
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "Whether the header should shrink away as \nthe user scrolls down, and reveal itself as the user scrolls up. \nNote: for scrollShrink to work, the toolbar must be a sibling of a \n`material-content` element, placed before it. See the scroll shrink demo.",
            "startingLine": 50,
            "typeExpression": "boolean=",
            "type": {
              "type": "NameExpression",
              "name": "boolean",
              "optional": true
            },
            "typeList": [
              "boolean"
            ],
            "optional": true,
            "name": "scrollShrink"
          },
          {
            "tagDef": {
              "name": "param",
              "multi": true,
              "docProperty": "params",
              "transforms": [
                null,
                null,
                null
              ]
            },
            "tagName": "param",
            "description": "How much to change the speed of the toolbar's\nshrinking by. For example, if 0.25 is given then the toolbar will shrink\nat one fourth the rate at which the user scrolls down. Default 0.5.",
            "startingLine": 56,
            "typeExpression": "number=",
            "type": {
              "type": "NameExpression",
              "name": "number",
              "optional": true
            },
            "typeList": [
              "number"
            ],
            "optional": true,
            "name": "shrinkSpeedFactor"
          }
        ],
        "restrict": {
          "element": true,
          "attribute": false,
          "cssClass": false,
          "comment": false
        },
        "element": "ANY",
        "priority": 0,
        "usage": "<hljs lang=\"html\">\n<div layout=\"vertical\" layout-fill>\n  <material-toolbar>\n\n    <div class=\"material-toolbar-tools\">\n      <span>My App's Title</span>\n\n      <!-- fill up the space between left and right area -->\n      <span flex></span>\n\n      <material-button>\n        Right Bar Button\n      </material-button>\n    </div>\n\n  </material-toolbar>\n  <material-content>\n    Hello!\n  </material-content>\n</div>\n</hljs>",
        "dependencies": [
          "material.components.content",
          "material.animations"
        ],
        "file": "src/components/toolbar/toolbar.js",
        "startingLine": 15,
        "humanName": "material-toolbar",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/toolbar/toolbar.js",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/toolbar/toolbar.js",
        "url": "/material.components.toolbar/directive/materialToolbar",
        "outputPath": "generated/material.components.toolbar/directive/materialToolbar/index.html",
        "readmeUrl": "/material.components.toolbar/readme/overview"
      }
    ],
    "url": "/material.components.toolbar",
    "demos": [
      {
        "id": "demo1",
        "name": "Toolbar Basic Usage",
        "docType": "demo",
        "module": "toolbarDemo1",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/toolbar/demo1/script.js",
            "componentId": "material.components.toolbar",
            "componentName": "Toolbar",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo1",
            "name": "Toolbar Basic Usage",
            "module": "toolbarDemo1",
            "fileName": "script",
            "relativePath": "script.js/src/components/toolbar/demo1/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.toolbar/demo/demo1/script.js"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/toolbar/demo1/index.html",
          "componentId": "material.components.toolbar",
          "componentName": "Toolbar",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Toolbar Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/toolbar/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.toolbar/demo/demo1/index.html"
        }
      },
      {
        "id": "demo2",
        "name": "Scroll Shrinking Toolbar",
        "docType": "demo",
        "module": "toolbarDemo2",
        "files": [
          {
            "fileType": "js",
            "file": "src/components/toolbar/demo2/script.js",
            "componentId": "material.components.toolbar",
            "componentName": "Toolbar",
            "basePath": "script.js",
            "docType": "demo",
            "id": "demo2",
            "name": "Scroll Shrinking Toolbar",
            "module": "toolbarDemo2",
            "fileName": "script",
            "relativePath": "script.js/src/components/toolbar/demo2/script.js",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.toolbar/demo/demo2/script.js"
          },
          {
            "fileType": "css",
            "file": "src/components/toolbar/demo2/style.css",
            "componentId": "material.components.toolbar",
            "componentName": "Toolbar",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo2",
            "name": "Scroll Shrinking Toolbar",
            "fileName": "style",
            "relativePath": "style.css/src/components/toolbar/demo2/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.toolbar/demo/demo2/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/toolbar/demo2/index.html",
          "componentId": "material.components.toolbar",
          "componentName": "Toolbar",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo2",
          "name": "Scroll Shrinking Toolbar",
          "fileName": "index",
          "relativePath": "index.html/src/components/toolbar/demo2/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.toolbar/demo/demo2/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.toolbar/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  },
  {
    "id": "material.components.whiteframe",
    "name": "Whiteframe",
    "docs": [
      {
        "componentId": "material.components.whiteframe",
        "componentName": "Whiteframe",
        "docType": "readme",
        "name": "overview",
        "file": "src/components/whiteframe/README.md",
        "humanName": "Whiteframe",
        "githubUrl": "https://github.com/angular/material/tree/master/src/components/whiteframe/README.md",
        "githubEditUrl": "https://github.com/angular/material/edit/master/src/components/whiteframe/README.md",
        "url": "/material.components.whiteframe/readme/overview",
        "outputPath": "generated/material.components.whiteframe/readme/overview/index.html",
        "readmeUrl": "/material.components.whiteframe/readme/overview"
      }
    ],
    "url": "/material.components.whiteframe",
    "demos": [
      {
        "id": "demo1",
        "name": "Whiteframe Basic Usage",
        "docType": "demo",
        "module": "",
        "files": [
          {
            "fileType": "css",
            "file": "src/components/whiteframe/demo1/style.css",
            "componentId": "material.components.whiteframe",
            "componentName": "Whiteframe",
            "basePath": "style.css",
            "docType": "demo",
            "id": "demo1",
            "name": "Whiteframe Basic Usage",
            "fileName": "style",
            "relativePath": "style.css/src/components/whiteframe/demo1/style.css",
            "template": "demo/template.file",
            "outputPath": "generated/material.components.whiteframe/demo/demo1/style.css"
          }
        ],
        "indexFile": {
          "fileType": "html",
          "file": "src/components/whiteframe/demo1/index.html",
          "componentId": "material.components.whiteframe",
          "componentName": "Whiteframe",
          "basePath": "index.html",
          "docType": "demo",
          "id": "demo1",
          "name": "Whiteframe Basic Usage",
          "fileName": "index",
          "relativePath": "index.html/src/components/whiteframe/demo1/index.html",
          "template": "demo/template.file",
          "outputPath": "generated/material.components.whiteframe/demo/demo1/index.html"
        }
      }
    ],
    "template": "component.template.html",
    "outputPath": "generated/material.components.whiteframe/index.html",
    "renderedContent": "{{currentComponent.name}}\n"
  }
])

DocsApp.directive('demoInclude', [
  '$q', 
  '$http', 
  '$compile', 
  '$templateCache',
function($q, $http, $compile, $templateCache) {
  return function postLink(scope, element, attr) {
    var demoContainer;

    // Interpret the expression given as `demo-include="something"`
    var demo = scope.$eval(attr.demoInclude);

    handleDemoIndexFile();

    /**
     * Fetch the demo's incdex file, and if it contains its own ng-app module
     * then bootstrap a new angular app  with that module. Otherwise, compile
     * the demo into the current demo ng-app.
     */
    function handleDemoIndexFile() {
      $http.get(demo.indexFile.outputPath, {cache: $templateCache})
        .then(function(response) {

          demoContainer = angular.element(
            '<div class="demo-content ' + demo.module + '">'
          ).html(response.data);

          if (demo.module) {
            angular.bootstrap(demoContainer[0], [demo.module]);
          } else {
            $compile(demoContainer)(scope);
          }

          // Once everything is loaded, put the demo into the DOM
          $q.all([
            handleDemoStyles(),
            handleDemoTemplates()
          ]).finally(function() {
            element.append(demoContainer);
          });
        });
    }


    /**
     * Fetch the demo styles, add a rule to restrict the styles to only
     * apply to this specific demo, and append the styles to the DOM.
     */
    function handleDemoStyles() {

      var demoSelector = demo.module ? ('.' + demo.module + ' ') : '';
      var styleFiles = demo.files.filter(function(file) {
        return file.fileType === 'css';
      });

      return $q.all(styleFiles.map(function(file) {
        return $http.get(file.outputPath, {cache: $templateCache})
          .then(function(response) { return response.data; });
      }))
      .then(function(styles) {
        styles = styles.join('\n'); //join styles as one string

        var styleElement = angular.element('<style>' + styles + '</style>');
        document.body.appendChild(styleElement[0]);

        scope.$on('$destroy', function() {
          styleElement.remove();
        });
      });

    }

    /**
     * Fetch the templates for this demo, and put the templates into
     * the demo app's templateCache, with a url that allows the demo apps
     * to reference their templates local to the demo index file.
     *
     * For example, make it so the dialog demo can reference templateUrl
     * 'my-dialog.tmpl.html' instead of having to reference the url
     * 'generated/material.components.dialog/demo/demo1/my-dialog.tmpl.html'.
     */
    function handleDemoTemplates() {

      var templates = demo.files.filter(function(file) {
        return file.fileType === 'html';
      });
      // Get the $templateCache instance that goes with the demo's specific
      // app instance.

      return $q.all(templates.map(function(file) {
        return $http.get(file.outputPath).then(function(response) {
          var demoTemplateCache = demoContainer.injector().get('$templateCache');

          demoTemplateCache.put(file.basePath, response.data);

          scope.$on('$destroy', function() {
            demoTemplateCache.remove(file.basePath);
          });

        });

      }));

    }

  };

}]);

DocsApp

.directive('hljs', ['$compile', function($compile) {
  return {
    restrict: 'E',
    compile: function(element, attr) {
      var code;
      //No attribute? code is the content
      if (!attr.code) {
        code = element.html();
        element.empty();
      }

      return function(scope, element, attr) {
        var contentParent = angular.element('<pre><code class="highlight" ng-non-bindable></code></pre>');
        var codeElement = contentParent.find('code');

        // Attribute? code is the evaluation
        if (attr.code) {
          code = scope.$eval(attr.code);
        }
        if (!code) return;
        var highlightedCode = hljs.highlight(attr.language || attr.lang, code.trim());
        highlightedCode.value = highlightedCode.value.replace(/=<span class="hljs-value">""<\/span>/gi, '');
        codeElement.append(highlightedCode.value).addClass('highlight');

        element.append(contentParent);
      };
    }
  };
}])

.directive('codeView', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      var code = element.eq(0).clone();
      code.children().removeAttr('class');

      var highlightedCode = hljs.highlight('html', code[0].innerHTML);

      highlightedCode.value = highlightedCode.value.replace(/=<span class="hljs-value">""<\/span>/gi, '');

      element.prepend('<pre><code>' + highlightedCode.value + '</code></pre>');
      element.find('code').addClass('highlight');
    }
  };
})

.directive('iframeCodeView', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var iFrame = element[0].firstElementChild;
      if(iFrame && iFrame.src) {
        var links = angular.element(
          '<p><a class="material-button material-button-raised material-button-colored" href="' + iFrame.src + '" target="_blank">Full View</a> \
           <a class="material-button material-button-raised material-button-colored" href="view-source:' + iFrame.src + '" target="_blank">View Source</a></p>'
        );
        element.append(links);
      }
    }
  };
});

var hljs=new function(){function j(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function h(w,x){var v=w&&w.exec(x);return v&&v.index==0}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^lang(uage)?-/,"")});return v.filter(function(x){return i(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+j(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=j(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+j(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};var E=function(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})};if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b="\\b("+D.bK.split(" ").join("|")+")\\b"}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?("+F.b+")\\.?":F.b}).concat([D.tE,D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(h(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(h(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&h(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){if(!I.k){return j(C)}var T="";var W=0;I.lR.lastIndex=0;var U=I.lR.exec(C);while(U){T+=j(C.substr(W,U.index-W));var V=E(I,U);if(V){H+=V[1];T+=w(V[0],j(U[0]))}else{T+=j(U[0])}W=I.lR.lastIndex;U=I.lR.exec(C)}return T+j(C.substr(W))}function F(){if(I.sL&&!f[I.sL]){return j(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):e(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=j(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=j(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=i(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D+=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:j(L)}}else{throw O}}}function e(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:j(y)};var w=v;x.forEach(function(z){if(!i(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function g(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=b.useBR?z.innerHTML.replace(/\n/g,"").replace(/<br>|<br [^>]*>/g,"\n").replace(/<[^>]*>/g,""):z.textContent;var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):e(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=g(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function d(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function k(){return Object.keys(f)}function i(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=e;this.fixMarkup=g;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=d;this.listLanguages=k;this.getLanguage=i;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/};this.CLCM={cN:"comment",b:"//",e:"$",c:[this.PWM]};this.CBCM={cN:"comment",b:"/\\*",e:"\\*/",c:[this.PWM]};this.HCM={cN:"comment",b:"#",e:"$",c:[this.PWM]};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.CSSNM={cN:"number",b:this.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0};this.RM={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBCM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBCM,a.RM,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:true,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",rB:true,eE:true,e:"\\("};return{cI:true,i:"[=/|']",c:[a.CBCM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.CSSNM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBCM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.CSSNM,a.QSM,a.ASM,a.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});

angular.module('buttonsDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

});



angular.module('cardDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

});



angular.module('checkboxDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

  $scope.data = {};
  $scope.data.cb1 = true;
  $scope.data.cb2 = false;

});



angular.module('contentDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

})


angular.module('dialogDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $materialDialog) {
  $scope.dialog = function(e) {
    $materialDialog.show({
      templateUrl: 'my-dialog.tmpl.html',
      targetEvent: e,
      controller: ['$scope', function($scope) {
        $scope.close = function() {
          $materialDialog.hide();
        };
      }]
    });
  };
});


angular.module('dividerDemo1', ['ngMaterial'])
  .controller('AppCtrl', function($scope) {
    $scope.messages = [{
      face: '/img/list/60.jpeg',
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face: '/img/list/60.jpeg',
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face: '/img/list/60.jpeg',
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face: '/img/list/60.jpeg',
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face: '/img/list/60.jpeg',
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }];
  });



angular.module('formDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {
  $scope.data = {};
})

.directive('ig', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fid: '@'
    },
    template: 
      '<material-input-group>' +
        '<label for="{{fid}}">Description</label>' +
        '<material-input id="{{fid}}" type="text" ng-model="data.description">' +
      '</material-input-group>'
  };
});


angular.module('app', ['ngMaterial'])

.controller('AppCtrl', ['$scope', function($scope) {
}]);


angular.module('linearProgressDemo1', ['ngMaterial'])
  .controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
    $scope.mode = 'query';
    $scope.determinateValue = 30;
    $scope.determinateValue2 = 30;

    $interval(function() {
      $scope.determinateValue += 1;
      $scope.determinateValue2 += 1.5;
      if ($scope.determinateValue > 100) {
        $scope.determinateValue = 30;
        $scope.determinateValue2 = 30;
      }
    }, 100, 0, true);

    $interval(function() {
      $scope.mode = ($scope.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);
  }]);


angular.module('listDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {
    $scope.todos = [
      {
        face : '/img/list/60.jpeg',
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : '/img/list/60.jpeg',
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : '/img/list/60.jpeg',
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : '/img/list/60.jpeg',
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : '/img/list/60.jpeg',
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ]

});




angular.module('radioDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

  $scope.data = {
    group1 : '2',
    group2 : '6'
  };

  $scope.radioData = [
    { label: 'Label 4', value: '4' },
    { label: 'Label 5', value: '5' },
    { label: 'Label 6', value: '6' }
  ];

  $scope.addItem = function() {
    var r = Math.ceil(Math.random() * 1000);
    $scope.radioData.push({ label: 'Label ' + r, value: r });
  };

  $scope.removeItem = function() {
    $scope.radioData.pop();
  };

});


angular.module('app', ['ngMaterial'])

.controller('AppCtrl', function($scope, $timeout, $materialSidenav) {
  $scope.toggleLeft = function() {
    $materialSidenav('left').toggle();
  }
})

.controller('LeftCtrl', function($scope, $materialSidenav) {
  $scope.close = function() {
    $materialSidenav('left').close();
  }
})

.controller('ListCtrl', function($scope, $materialSidenav) {
  $scope.toggleLeft = function() {
    $materialSidenav('left').toggle();
  }
})

.directive('driveItem', function() {
  return {
    restrict: 'E',
    templateUrl: 'drive-item.html'
  }
})

.directive('iconFill', function() {
  return {
    restrict: 'E',
    templateUrl: 'icon.html'
  }
})



angular.module('sidenavDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $timeout, $materialSidenav) {
  $scope.toggleLeft = function() {
    $materialSidenav('left').toggle();
  };
  $scope.toggleRight = function() {
    $materialSidenav('right').toggle();
  };
})

.controller('LeftCtrl', function($scope, $timeout, $materialSidenav) {
  $scope.close = function() {
    $materialSidenav('left').close();
  };
})

.controller('RightCtrl', function($scope, $timeout, $materialSidenav) {
  $scope.close = function() {
    $materialSidenav('right').close();
  };
});



angular.module('sliderDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

  $scope.color = {
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255)
  };

  $scope.rating = 3;
  $scope.disabled1 = 0;
  $scope.disabled2 = 70;

});


angular.module('switchDemo1', ['ngMaterial']);



angular.module('tabsDemo1', ['ngMaterial'] )
  .controller('AppCtrl', function( $scope ) {

    $scope.data = {
      maxIndex : 9,
      selectedIndex : 0,
      locked : true
    };

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min( $scope.data.maxIndex, $scope.data.selectedIndex + 1) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max(0, ($scope.data.selectedIndex - 1));
    };
    
  });


angular.module('tabsDemo2', ['ngMaterial'])
  .controller('AppCtrl', function ($scope, $interpolate) {
    var tabs = [
      { title: 'Polymer', active: true, content: "Polymer practices are great!", style:"tab1"},
      { title: 'Material', active: false, content: "Material Design practices are better!", style:"tab2" },
      { title: 'Angular', active: false, content: "AngularJS practices are the best!", style:"tab3" },
      { title: 'NodeJS', active: false, disabled: false, content: "NodeJS practices are amazing!" }
    ];

    $scope.tabs = tabs;
    $scope.predicate = "title";
    $scope.reversed = true;
    $scope.selectedIndex = 2;
    $scope.allowDisable = true;

    $scope.onTabSelected = onTabSelected;
    $scope.announceSelected = announceSelected;
    $scope.announceDeselected = announceDeselected;

    $scope.addTab = function (title, view) {
      view = view || title + " Content View";
      tabs.push({ title: title, content: view, active: false, disabled: false});
    };

    $scope.removeTab = function (tab) {
      for (var j = 0; j < tabs.length; j++) {
        if (tab.title == tabs[j].title) {
          $scope.tabs.splice(j, 1);
          break;
        }
      }
    };

    $scope.submit = function ($event) {
      if ($event.which !== 13) return;
      if ($scope.tTitle) {
        $scope.addTab($scope.tTitle, $scope.tContent);
      }
    };

    // **********************************************************
    // Private Methods
    // **********************************************************

    function onTabSelected(tab) {
      $scope.selectedIndex = this.$index;

      $scope.announceSelected(tab);
    }

    function announceDeselected(tab) {
      $scope.farewell = $interpolate("Goodbye {{title}}!")(tab);
    }

    function announceSelected(tab) {
      $scope.greeting = $interpolate("Hello {{title}}!")(tab);
    }

  });




angular.module('app', ['ngMaterial'] )
  .controller('AppCtrl', function( $scope ) {
    var tabs = [
      { title: 'Polymer', active: true,  disabled: false, content:"Polymer practices are great!" },
      { title: 'Material', active: false, disabled: true , content:"Material Design practices are better!" },
      { title: 'Angular', active: false, disabled: true , content:"AngularJS practices are the best!" },
      { title: 'NodeJS' , active: false, disabled: false, content:"NodeJS practices are amazing!" }
    ];

    $scope.activeIndex = 1;
    $scope.tabs = [].concat(tabs);

  });


angular.module('app', ['ngMaterial'])
  .controller('AppCtrl', function ($scope, $interpolate) {
    var tabs = [
      { title: 'Polymer', active: true, disabled: false, content: "Polymer practices are great!", style:"tab1"},
      { title: 'Material', active: false, disabled: false, content: "Material Design practices are better!", style:"tab2" },
      { title: 'Angular', active: false, disabled: true, content: "AngularJS practices are the best!", style:"tab3" },
      { title: 'NodeJS', active: false, disabled: false, content: "NodeJS practices are amazing!" }
    ];

    $scope.tabs = tabs;
    $scope.predicate = "title";
    $scope.reversed = true;
    $scope.selectedIndex = 2;
    $scope.allowDisable = true;

    $scope.onTabSelected = onTabSelected;
    $scope.announceSelected = announceSelected;
    $scope.announceDeselected = announceDeselected;

    $scope.addTab = function (title, view) {
      view = view || title + " Content View";
      tabs.push({ title: title, content: view, active: false, disabled: false});
    };

    $scope.removeTab = function (tab) {
      for (var j = 0; j < tabs.length; j++) {
        if (tab.title == tabs[j].title) {
          $scope.tabs.splice(j, 1);
          break;
        }
      }
    }

    $scope.submit = function ($event) {
      if ($event.which !== 13) return;
      if ($scope.tTitle != "") {
        $scope.addTab($scope.tTitle, $scope.tContent);
      }
    }

    // **********************************************************
    // Private Methods
    // **********************************************************

    function onTabSelected(tab) {
      $scope.selectedIndex = this.$index;

      $scope.announceSelected(tab);
    }

    function announceDeselected(tab) {
      $scope.farewell = $interpolate("Goodbye {{title}}!")(tab);
    }

    function announceSelected(tab) {
      $scope.greeting = $interpolate("Hello {{title}}!")(tab);
    }

  });




angular.module('app', ['ngMaterial', 'ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/material', {
      templateUrl: 'material.tmpl.html',
      controller: 'MaterialTabCtrl'
    })
    .when('/angular', {
      templateUrl: 'angular.tmpl.html',
      controller: 'AngularTabCtrl'
    })
    .when('/polymer', {
      templateUrl: 'polymer.tmpl.html',
      controller: 'PolymerTabCtrl'
    })
    .otherwise({
      redirectTo: '/material'
    });
})

.controller('AppCtrl', function($scope, $location) {
  var tabs = $scope.tabs = [
    { path: '/material', label: 'Material Design' },
    { path: '/angular', label: 'Use Angular' },
    { path: '/polymer', label: 'Use Polymer' },
  ];

  $scope.selectedTabIndex = 0;
  $scope.$watch('selectedTabIndex', watchSelectedTab);
  
  function watchSelectedTab(index, oldIndex) {
    console.log('selecting from', oldIndex, 'to', index);
    $scope.reverse = index < oldIndex;
    $location.path(tabs[index].path);
  }

})

.controller('MaterialTabCtrl', function($scope) {
})

.controller('AngularTabCtrl', function($scope) {
})

.controller('PolymerTabCtrl', function($scope) {
});



angular.module('formDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {
  $scope.data = {};
})

.directive('ig', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fid: '@'
    },
    template: 
      '<material-input-group>' +
        '<label for="{{fid}}">Description</label>' +
        '<material-input id="{{fid}}" type="text" ng-model="data.description">' +
      '</material-input-group>'
  };
});



angular.module('toastDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $materialToast, $animate) {
  
  $scope.toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $scope.complexToastIt = function() {
    $materialToast.show({
      controller: 'ToastCtrl',
      templateUrl: 'toast-template.html',
      duration: 6000,
      position: $scope.getToastPosition()
    });
  };

  $scope.toastIt = function() {
    $materialToast.show({
      template: '<material-toast>Hello, ' + Math.random() + '</material-toast>',
      duration: 2000,
      position: $scope.getToastPosition()
    });
  };

})

.controller('ToastCtrl', function($scope, $materialToast) {
  $scope.closeToast = function() {
    $materialToast.hide();
  };
});



angular.module('toolbarDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

})

.directive('svgIcon', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<svg viewBox="0 0 24 24" style="pointer-events: none;"><g><g><rect fill="none" width="24" height="24"></rect><path d="M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z"></path></g></g></svg>'
  }
});


var app = angular.module('toolbarDemo2', ['ngMaterial']);

app.controller('AppCtrl', function($scope) {
  var item = {
    face: '/img/list/60.jpeg',
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    notes: "I'll be in your neighborhood doing errands."
  };
  $scope.todos = [];
  for (var i = 0; i < 15; i++) {
    $scope.todos.push({
      face: '/img/list/60.jpeg',
      what: "Brunch this weekend?",
      who: "Min Li Chan",
      notes: "I'll be in your neighborhood doing errands."
    });
  }
});



angular.module('app', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

});
