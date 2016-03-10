// Generated by CoffeeScript 1.9.1

/*
@name jquery-badyl
@description Meet Badyl – bootstrap affix-like wheel reinvent.
@version 1.7.57
@author Se7enSky studio <info@se7ensky.com>
 */


/*! jquery-badyl 1.7.57 http://github.com/Se7enSky/jquery-badyl */

(function() {
  var plugin,
    slice = [].slice;

  plugin = function($) {
    "use strict";
    var Badyl;
    Badyl = (function() {
      Badyl.prototype.defaults = {
        offset: 0
      };

      Badyl.prototype.cssSnippets = {
        top: {
          position: 'absolute',
          top: 0,
          bottom: ''
        },
        bottom: {
          position: 'absolute',
          top: '',
          bottom: 0
        },
        fixTop: {
          position: 'fixed',
          top: 0,
          bottom: ''
        },
        fixBottom: {
          position: 'fixed',
          top: '',
          bottom: 0
        },
        unstable: {
          position: 'absolute',
          top: '',
          bottom: ''
        }
      };

      function Badyl(el, config) {
        this.el = el;
        this.$el = $(this.el);
        this.$el.data("badyl", this);
        this.config = $.extend({}, this.defaults, config);
        this.state = null;
        this.badylized = false;
        this.$refEl = $(this.$el.attr("data-badyl-ref-el"));
        this.$originalParent = this.$el.parent();
        this.prevWindowScrollTop = 0;
        this.smartResizeTimeout = null;
        this.badylize();
      }

      Badyl.prototype.destroy = function() {
        return this.debadylize();
      };

      Badyl.prototype.badylize = function() {
        if (this.badylized) {
          return;
        }
        this.containerInnerWidth = this.measureInnerWidth(this.$originalParent);
        this.originalHeight = this.$el.height();
        this.badylInnerHeight = this.originalHeight + this.config.offset * 2;
        this.$refEl.css({
          height: ""
        });
        this.badylHeight = this.$refEl.height() + this.config.offset * 2;
        if (this.badylInnerHeight > this.badylHeight) {
          this.$refEl.css({
            height: this.badylInnerHeight + "px"
          });
          this.badylHeight = this.$refEl.height() + this.config.offset * 2;
        }
        this.$el.replaceWith(this.$badylContainer = $("<div>")).css({
          position: 'relative',
          height: this.badylHeight + "px",
          margin: "-" + this.config.offset + "px 0"
        }).append(this.$badylInner = $("<div>")).css({
          width: this.containerInnerWidth + "px",
          height: this.badylInnerHeight + "px",
          padding: this.config.offset + "px 0"
        }).append(this.$originalElement = this.$el.clone());
        this.$originalElement.data("badyl", this);
        this.$badylContainer.data("badyl", this);
        this.badylOffsetTop = this.$badylContainer.offset().top;
        this.refreshInnerCss();
        this.bindEvents();
        this.badylized = true;
        return this.$originalElement.trigger("badylized");
      };

      Badyl.prototype.rebadylize = function() {
        if (!this.badylized) {
          return;
        }
        if (this.smartResizeTimeout) {
          clearTimeout(this.smartResizeTimeout);
        }
        this.containerInnerWidth = this.measureInnerWidth(this.$originalParent);
        this.rebadylizeFromState = this.state;
        this.badylized = false;
        this.state = null;
        this.$refEl.css({
          height: ""
        });
        this.badylHeight = this.$refEl.height() + this.config.offset * 2;
        this.$badylInner.css({
          width: this.containerInnerWidth + "px",
          padding: this.config.offset + "px 0"
        });
        this.originalHeight = this.$originalElement.height();
        this.badylInnerHeight = this.originalHeight + this.config.offset * 2;
        if (this.badylInnerHeight > this.badylHeight) {
          this.$refEl.css({
            height: this.badylInnerHeight + "px"
          });
          this.badylHeight = this.$refEl.height() + this.config.offset * 2;
        }
        this.$badylContainer.css({
          position: 'relative',
          height: this.badylHeight + "px",
          margin: "-" + this.config.offset + "px 0"
        });
        this.$badylInner.css({
          height: this.badylInnerHeight + "px"
        });
        this.badylOffsetTop = this.$badylContainer.offset().top;
        this.refreshInnerCss();
        this.badylized = true;
        return this.$originalElement.trigger("rebadylized");
      };

      Badyl.prototype.debadylize = function() {
        if (!this.badylized) {
          return;
        }
        if (this.smartResizeTimeout) {
          clearTimeout(this.smartResizeTimeout);
        }
        this.unbindEvents();
        this.$badylContainer.replaceWith(this.$el = this.$originalElement);
        this.$el.data("badyl", this);
        this.badylized = false;
        this.state = null;
        return this.$el.trigger("debadylized");
      };

      Badyl.prototype.bindEvents = function() {
        $(window).on("scroll", this.windowScrollHandler = (function(_this) {
          return function(e) {
            return _this.refreshInnerCss();
          };
        })(this));
        return $(window).on("resize", this.windowResizeHandler = (function(_this) {
          return function(e) {
            if (_this.smartResizeTimeout) {
              clearTimeout(_this.smartResizeTimeout);
            }
            return _this.smartResizeTimeout = setTimeout(function() {
              if (_this.badylized) {
                _this.rebadylize();
              }
              return _this.smartResizeTimeout = null;
            }, 100);
          };
        })(this));
      };

      Badyl.prototype.unbindEvents = function() {
        $(window).off("scroll", this.windowScrollHandler);
        return $(window).off("resize", this.windowResizeHandler);
      };

      Badyl.prototype.refreshInnerCss = function() {
        var containerHeight, ref, scrollingBottom, scrollingTop, windowHeight, windowScrollTop;
        windowScrollTop = $(window).scrollTop();
        windowHeight = $(window).height();
        containerHeight = this.$badylContainer.height();
        scrollingBottom = windowScrollTop > this.prevWindowScrollTop;
        scrollingTop = !scrollingBottom;
        if (this.badylInnerHeight > windowHeight) {
          switch (this.state) {
            case null:
              if (windowScrollTop >= this.badylOffsetTop + this.badylHeight - this.badylInnerHeight) {
                this.switchState("bottom");
              } else if (windowScrollTop < this.badylOffsetTop) {
                this.switchState("top");
              } else if ((ref = this.rebadylizeFromState) === "fixTop" || ref === "fixBottom") {
                this.switchState(this.rebadylizeFromState);
              } else if (this.rebadylizeFromState === "unstable") {
                this.switchState("unstable", {
                  top: this.unstableTop + "px"
                });
              }
              break;
            case "top":
              if (windowScrollTop >= this.badylOffsetTop + this.badylInnerHeight - windowHeight) {
                this.switchState("fixBottom");
              }
              break;
            case "bottom":
              if (windowScrollTop < this.badylOffsetTop + this.badylHeight - this.badylInnerHeight) {
                this.switchState("fixTop");
              }
              break;
            case "fixBottom":
              if (windowScrollTop + windowHeight < this.badylOffsetTop + this.badylInnerHeight) {
                this.switchState("top");
              } else if (windowScrollTop + windowHeight >= this.badylOffsetTop + this.badylHeight) {
                this.switchState("bottom");
              } else if (scrollingTop) {
                this.switchState("unstable", {
                  top: (this.unstableTop = windowScrollTop - this.badylOffsetTop - (this.badylInnerHeight - windowHeight)) + "px"
                });
              }
              break;
            case "fixTop":
              if (windowScrollTop < this.badylOffsetTop) {
                this.switchState("top");
              } else if (windowScrollTop >= this.badylOffsetTop + this.badylHeight - this.badylInnerHeight) {
                this.switchState("bottom");
              } else if (scrollingBottom) {
                this.switchState("unstable", {
                  top: (this.unstableTop = windowScrollTop - this.badylOffsetTop) + "px"
                });
              }
              break;
            case "unstable":
              if (windowScrollTop < this.unstableTop + this.badylOffsetTop) {
                this.switchState("fixTop");
              } else if (windowScrollTop >= this.unstableTop + this.badylOffsetTop + (this.badylInnerHeight - windowHeight)) {
                this.switchState("fixBottom");
              }
          }
        } else {
          if (windowScrollTop >= this.badylHeight + this.badylOffsetTop - this.badylInnerHeight) {
            this.switchState("bottom");
          } else if (windowScrollTop > this.badylOffsetTop) {
            this.switchState("fixTop");
          } else {
            this.switchState("top");
          }
        }
        return this.prevWindowScrollTop = windowScrollTop;
      };

      Badyl.prototype.switchState = function(newState, addCss) {
        if (newState === this.state) {
          return;
        }
        if (this.cssSnippets[newState]) {
          this.$badylInner.css(this.cssSnippets[newState]);
        }
        if (addCss) {
          this.$badylInner.css(addCss);
        }
        return this.state = newState;
      };

      Badyl.prototype.measureInnerWidth = function($el) {
        var $measureDiv, result;
        $el.append($measureDiv = $("<div>").css({
          display: "block",
          width: "100%"
        }));
        result = $measureDiv.width();
        $measureDiv.remove();
        return result;
      };

      return Badyl;

    })();
    return $.fn.badyl = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return this.each(function() {
        var badyl;
        badyl = $(this).data('badyl');
        if (!badyl) {
          badyl = new Badyl(this, typeof method === 'object' ? method : {});
        }
        if (typeof method === 'string') {
          return badyl[method].apply(badyl, args);
        }
      });
    };
  };

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], plugin);
  } else {
    plugin(jQuery);
  }

}).call(this);
