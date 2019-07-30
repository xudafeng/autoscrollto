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
    localStorage.setItem(storageNamespace, value);
  };

  AutoScrollTo.prototype.getCurrentTopSync = function() {
    var value = localStorage.getItem(storageNamespace);
    return parseInt(value, 10);
  };

  AutoScrollTo.prototype.scrollTo = function() {
    const currentTop = this.getCurrentTopSync();
    if (currentTop) {
      window.scrollTo(0, currentTop);
    }
  };

  exports.AutoScrollTo = AutoScrollTo;
});
