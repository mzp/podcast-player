_ = require 'lodash'
Vue = require 'vue'
utils = require './components/utils'

items = [
  {
    title: 'Girls',
    link: 'http://www.nicovideo.jp/watch/sm22468962',
    description: 'http://www.nicovideo.jp/watch/sm22468962',
    enclosure: {
      url: 'https://codefirst.org/hobiron/fetch/537e7d3ff8facb3b9e000003/sm22468962.mp4',
      type: 'audio/mpeg'
    },
    playing: true,
    pubDate: 'Sun, 21 Dec 2014 07:15:36 +0900'
  },
  {
    title: 'Girls-2',
    link: 'http://www.nicovideo.jp/watch/sm22468962',
    description: 'http://www.nicovideo.jp/watch/sm22468962',
    enclosure: {
      url: 'https://codefirst.org/hobiron/fetch/537e7d3ff8facb3b9e000003/sm22468962.mp4',
      type: 'audio/mpeg'
    },
    playing: false,
    pubDate: 'Sun, 21 Dec 2014 07:15:36 +0900'
  }
]

window.onload = ->
  new Vue({
    el: '#js-playlist',
    data: { items: items },
    methods: {
      play: (item) ->
        this.$data.items = _.map this.$data.items, (x) ->
          x.playing = x == item.$data
          x
    }
  })
  new Vue({
    el: '#js-player',
    data: { items: items },
    methods: {
      playNext: (item) ->
        # 再生リストを1個ずらす
        playings = utils.shift _.map(this.$data.items, (item) -> item.playing)

        xs = _.zip this.$data.items, playings
        this.$data.items = _.map xs, (x) ->
          item = x[0]
          playing = x[1]
          item.playing = playing
          item
    }
  })
