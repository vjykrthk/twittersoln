// Generated by CoffeeScript 1.4.0
(function() {
  var Retweeters, Tweeter, Tweeters,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tweeter = (function(_super) {

    __extends(Tweeter, _super);

    function Tweeter() {
      return Tweeter.__super__.constructor.apply(this, arguments);
    }

    return Tweeter;

  })(Backbone.Model);

  Tweeters = (function(_super) {

    __extends(Tweeters, _super);

    function Tweeters() {
      return Tweeters.__super__.constructor.apply(this, arguments);
    }

    Tweeters.prototype.model = Tweeter;

    Tweeters.prototype.url = '/tweeters';

    return Tweeters;

  })(Backbone.Collection);

  Retweeters = (function(_super) {

    __extends(Retweeters, _super);

    function Retweeters() {
      return Retweeters.__super__.constructor.apply(this, arguments);
    }

    return Retweeters;

  })(Backbone.Collection);

  $(function() {
    var MainRouter, MainView, RetweetersView, TweeterView, TweetersView, router;
    MainView = (function(_super) {

      __extends(MainView, _super);

      function MainView() {
        return MainView.__super__.constructor.apply(this, arguments);
      }

      MainView.prototype.el = '#container';

      MainView.prototype.mtt = _.template($('#main_tweeter_template').html());

      MainView.prototype.mrt = _.template($('#main_retweeter_template').html());

      MainView.prototype.rt = _.template($('#retweeter_template').html());

      MainView.prototype.initialize = function() {
        _.bindAll(this, 'render', 'renderMainRetweeter', 'renderTweeter', 'renderRetweeters', 'arrangeElementInCircle');
        this.tweetersCollection = this.options.tweetersCollection;
        this.retweetersCollection = this.options.retweetersCollection;
        this.tweetersCollection.bind('reset', this.render);
        return this.retweetersCollection.bind('reset', this.renderMainRetweeter);
      };

      MainView.prototype.render = function() {
        var tweetersView;
        $(this.el).empty();
        $(this.el).append(this.mtt());
        tweetersView = new TweetersView({
          collection: this.options.tweetersCollection
        });
        return $(this.el).find('.list-container').append(tweetersView.render().el);
      };

      MainView.prototype.renderMainRetweeter = function() {
        $(this.el).empty();
        this.renderTweeter();
        this.renderRetweeters();
        return this.arrangeElementInCircle();
      };

      MainView.prototype.renderTweeter = function() {
        var tweeter;
        tweeter = this.retweetersCollection.models[0].get('tweeter');
        return $(this.el).append(this.mrt(tweeter));
      };

      MainView.prototype.renderRetweeters = function() {
        var retweeters, retweetersView;
        retweeters = this.retweetersCollection.models[0].get('retweeters');
        retweetersView = new RetweetersView({
          collection: retweeters
        });
        return $(this.el).find('.retweeters').append(retweetersView.render().el);
      };

      MainView.prototype.arrangeElementInCircle = function() {
        var angle, container, elements, height, radius, step, width;
        radius = 200;
        elements = $(".retweeter");
        container = $("#container .retweeters");
        width = container.width();
        height = container.height();
        angle = 0;
        console.log("elements, container, width, heigth, angle", elements, container, width, height, angle);
        step = (2 * Math.PI) / elements.length;
        elements.each(function() {
          var x, y;
          x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
          y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
          $(this).css({
            left: x + 'px',
            top: y + 'px'
          });
          return angle += step;
        });
        return ($('[rel=tooltip]')).tooltip();
      };

      return MainView;

    })(Backbone.View);
    TweeterView = (function(_super) {

      __extends(TweeterView, _super);

      function TweeterView() {
        return TweeterView.__super__.constructor.apply(this, arguments);
      }

      TweeterView.prototype.events = {
        'click': 'loadRetweeters'
      };

      TweeterView.prototype.tagName = 'li';

      TweeterView.prototype.className = 'tweeter';

      TweeterView.prototype.template = _.template($('#tweeter_template').html());

      TweeterView.prototype.initialize = function() {
        return _.bindAll(this, 'render', 'loadRetweeters');
      };

      TweeterView.prototype.render = function() {
        $(this.el).append(this.template(this.model.toJSON()));
        return this;
      };

      TweeterView.prototype.loadRetweeters = function() {
        return router.navigate("retweeters/" + (this.model.get('tweeter_id')), {
          trigger: true
        });
      };

      return TweeterView;

    })(Backbone.View);
    TweetersView = (function(_super) {

      __extends(TweetersView, _super);

      function TweetersView() {
        return TweetersView.__super__.constructor.apply(this, arguments);
      }

      TweetersView.prototype.tagName = 'ul';

      TweetersView.prototype.render = function() {
        var _this = this;
        this.collection.each(function(model) {
          var tv;
          tv = new TweeterView({
            model: model
          });
          return $(_this.el).append(tv.render().el);
        });
        return this;
      };

      return TweetersView;

    })(Backbone.View);
    RetweetersView = (function(_super) {

      __extends(RetweetersView, _super);

      function RetweetersView() {
        return RetweetersView.__super__.constructor.apply(this, arguments);
      }

      RetweetersView.prototype.className = 'retweeter_circle';

      RetweetersView.prototype.template = _.template($('#retweeter_template').html());

      RetweetersView.prototype.render = function() {
        var model, _i, _len, _ref;
        _ref = this.collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          $(this.el).append(this.template(model));
        }
        return this;
      };

      return RetweetersView;

    })(Backbone.View);
    MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        return MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        '': 'tweeters',
        'retweeters/:id': 'retweeters'
      };

      MainRouter.prototype.initialize = function() {
        this.tweeters = new Tweeters();
        this.retweeters = new Retweeters();
        return this.mainView = new MainView({
          tweetersCollection: this.tweeters,
          retweetersCollection: this.retweeters
        });
      };

      MainRouter.prototype.tweeters = function() {
        return this.tweeters.fetch({
          reset: true
        });
      };

      MainRouter.prototype.retweeters = function(id) {
        return this.retweeters.fetch({
          url: "retweeters/" + id,
          reset: true
        });
      };

      return MainRouter;

    })(Backbone.Router);
    router = new MainRouter();
    return Backbone.history.start();
  });

}).call(this);
