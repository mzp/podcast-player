require 'sinatra'
require 'open-uri'
require 'rexml/document'
require 'json'

get '/' do
    send_file File.join(settings.public_folder, 'index.html')
end

get '/items' do
  response = []
  open(params[:url]) do |rss|
    doc = REXML::Document.new(rss)
    doc.elements.each("//item") do|item|
      title = item.elements['./title'].first
      description = item.elements['./description'].first
      link = item.elements['./link'].first
      url = item.elements['./enclosure'].attribute 'url'
      type = item.elements['./enclosure'].attribute 'type'
      response << {
        title: title,
        link: link,
        description: description,
        enclosure: { url: url, type: type },
        playing: false
      }
    end
  end

  response[0][:playing] = true unless response.empty?
  content_type :json
  response.to_json
end
