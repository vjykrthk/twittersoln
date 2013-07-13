require 'sinatra'
require 'twitter'
require 'json'

before do
	content_type :json
end

helpers do
	def swapImg(arr)
		arr.map do |b|
      		b[:img] = b[:img].gsub(/_normal/, "_bigger")
      		b
    	end    
	end
	def getRecentTweetIds
		tweets = Twitter.user_timeline(params[:id].to_i, count:10, exclude_replies:true, include_rts:false).reject {|i| i.retweet_count==0 }
		puts tweets
		tweets.map(&:id)
	end
	def getTweetersInfo
		tweeter = Twitter.user(params[:id].to_i)
		{:tweeter_id => tweeter.id, img:tweeter.profile_image_url.gsub(/_normal/, "_bigger")}
	end
	def getRetweetersInfo(tweet_ids)
		users = []

		tweet_ids.collect do |tweet_id|
		 users.concat(Twitter.retweeters_of(tweet_id))
		end

		puts tweet_ids

		users.uniq! do |user|
			user.id
		end		

		users.sort! do |user1, user2|
	  		user2[:followers_count] <=> user1[:followers_count]
		end

		#users.select! { |user| Twitter.friendship?(user.id, params[:id].to_i) }
		
		retweeters_info = users.first(10).map do |user|
	 	 { id:user.id, img:user.profile_image_url , followers_count:user.followers_count, following:Twitter.friendship?(params[:id].to_i, user.id) }
		end	

		retweeters_info = swapImg(retweeters_info)
	end

end

get '/' do
	content_type :html
 	 File.read(File.join('public', 'index.html'))
end

get '/tweeters' do
	tweeters = ["@dchelimsky", "@dhh", "@rbates", "@spolsky", "@github", "@topfunky", "@robconery", "@greggpollack", "@pragdave"]
	tweeters_info = tweeters.map do |tweeter|
		t = Twitter.user(tweeter)
		{ tweeter_id:t.id, img:t.profile_image_url}
	end
	tweets_info = swapImg(tweeters_info)
	tweeters_info.to_json
end

get '/retweeters/:id' do

	tweet_ids = getRecentTweetIds

	{ :tweeter => getTweetersInfo, :retweeters => getRetweetersInfo(tweet_ids) }.to_json

end
