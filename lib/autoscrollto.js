'use strict';

// https://github.com/xudafeng/autoscrollto

;(function(root, factory) {
  if (typeof exports !== 'undefined') {
    return factory(exports);
  } else {
    /* istanbul ignore next */
    factory(root['AutoScrollTo'] || (root['AutoScrollTo'] = {}));
  }
})(this, function(exports) {

  function throttle(func, wait) {
    var ctx, args, res, timeoutID;
    var last = 0;

    return function throttled () {
      ctx = this;
      args = arguments;
      var delta = new Date() - last;
      if (!timeoutID) {
        if (delta >= wait) {
          call();
        } else {
          timeoutID = setTimeout(call, wait - delta);
        }
      }
      return res;
    };

    function call () {
      timeoutID = 0;
      last = +new Date();
      res = func.apply(ctx, args);
      ctx = null;
      args = null;
    }
  }

  /* istanbul ignore next */
  function AutoScrollTo(options) {
    this.options = options || {};
    this.options.throttleTime = this.options.throttleTime || 200;
    this.options.container = this.options.container || window;
    this.options.pageNumber = this.options.pageNumber || 20;
    this.currentUrl = location.href;
    this.init();
  }

  var storageNamespace = '_autoscrollto_storage';

  var getScrollTop = function() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  };

  AutoScrollTo.prototype.init = function() {
    var that = this;
    window.addEventListener('scroll', throttle(function() {
      var value = getScrollTop();
      that.setCurrentTopSync(value);
    }, this.options.throttleTime));
  };

  AutoScrollTo.prototype.setCurrentTopSync = function(value) {
    var list = localStorage.getItem(storageNamespace) || '[]';
    try {
      list = JSON.parse(list);
    } catch (e) {
      list = [];
    }
    if (!Array.isArray(list)) {
      list = [];
    }
    for (var i = 0; i < list.length; i++) {
      if (list[i].url === this.currentUrl) {
        list[i] = {
          url: this.currentUrl,
          value: value
        };
        localStorage.setItem(storageNamespace, JSON.stringify(list));
        return;
      };
    }
    if (list.length >= this.options.pageNumber) {
      list.shift();
    }
    list.push({
      url: this.currentUrl,
      value: value
    });
    localStorage.setItem(storageNamespace, JSON.stringify(list));
  };

  AutoScrollTo.prototype.getCurrentTopSync = function() {
    var list = localStorage.getItem(storageNamespace) || '[]';
    try {
      list = JSON.parse(list);
    } catch (e) {
      list = [];
    }
    if (!Array.isArray(list)) {
      list = [];
    }
    var value = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].url === this.currentUrl) {
        value = list[i].value;
        break;
      };
    }
    return value;
  };

  AutoScrollTo.prototype.scrollTo = function() {
    var currentTop = this.getCurrentTopSync();
    if (currentTop) {
      window.scrollTo(0, currentTop);
    }
  };

  exports.AutoScrollTo = AutoScrollTo;
});

