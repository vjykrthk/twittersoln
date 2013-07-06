class Tweeter extends Backbone.Model

class Tweeters extends Backbone.Collection

	model: Tweeter

	url: '/tweeters'

class Retweeters extends Backbone.Collection





$ ->
	class MainView extends Backbone.View
		el: '#container'
		
		mtt: _.template $('#main_tweeter_template').html()
		mrt: _.template $('#main_retweeter_template').html()
		rt:  _.template $('#retweeter_template').html()
		
		initialize: ->
			_.bindAll @, 'render', 'renderMainRetweeter', 'renderTweeter', 'renderRetweeters', 'arrangeElementInCircle'
			@tweetersCollection = @options.tweetersCollection
			@retweetersCollection = @options.retweetersCollection
			@tweetersCollection.bind 'reset', @render
			@retweetersCollection.bind 'reset', @renderMainRetweeter

		render: ->
			$(@el).empty()
			$(@el).append @mtt()
			tweetersView = new TweetersView { collection: @options.tweetersCollection }
			$(@el).find('.list-container').append tweetersView.render().el

		renderMainRetweeter: ->
			$(@el).empty()
			@renderTweeter()
			@renderRetweeters()
			@arrangeElementInCircle()

		renderTweeter: ->
			tweeter = @retweetersCollection.models[0].get('tweeter')
			$(@el).append @mrt tweeter

		renderRetweeters: ->
			retweeters = @retweetersCollection.models[0].get('retweeters')
			retweetersView = new RetweetersView { collection: retweeters }
			$(@el).find('.retweeters').append retweetersView.render().el

		arrangeElementInCircle: ->
			radius = 200
			elements = $ ".retweeter"
			container = $ "#container .retweeters"
			width = container.width()
			height = container.height()
			angle = 0

			console.log "elements, container, width, heigth, angle", elements, container, width, height, angle

			step = (2 * Math.PI) / elements.length

			elements.each ->
				x = Math.round(width/2 + radius * Math.cos(angle) - $(@).width()/2)
				y = Math.round(height/2 + radius * Math.sin(angle) - $(@).height()/2)

				$(@).css { left: x+'px', top: y+'px' }
				angle += step
		
			($ '[rel=tooltip]').tooltip()


	class TweeterView extends Backbone.View
		events:
			'click' : 'loadRetweeters'

		tagName: 'li'

		className: 'tweeter'

		template: _.template $('#tweeter_template').html()

		initialize: ->
			_.bindAll @, 'render', 'loadRetweeters' 

		render: ->
			$(@el).append @template @model.toJSON()
			@

		loadRetweeters: ->
			router.navigate "retweeters/#{@model.get 'tweeter_id'}", trigger:true

	class TweetersView extends Backbone.View
		tagName: 'ul'
		render: ->
			# console.log(@collection)
			@collection.each (model)=>
				tv = new TweeterView({model:model})
				$(@el).append tv.render().el
			@

	class RetweetersView extends Backbone.View
		className: 'retweeter_circle'
		template: _.template $('#retweeter_template').html()
		render: ->
			for model in @collection
				$(@el).append @template model
			@


	class MainRouter extends Backbone.Router
		routes:
			'':'tweeters'
			'retweeters/:id':'retweeters'

		initialize: ->
			@tweeters = new Tweeters()
			@retweeters = new Retweeters()
			@mainView = new MainView { tweetersCollection: @tweeters, retweetersCollection: @retweeters }

		tweeters: ->
			@tweeters.fetch { reset:true }

		retweeters: (id)->
			@retweeters.fetch { url: "retweeters/#{id}", reset:true }

	router = new MainRouter()

	Backbone.history.start()
