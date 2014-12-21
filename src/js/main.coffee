_ = require 'lodash'
require 'better-xhr/dist/better-xhr'
Vue = require 'vue'
utils = require './components/utils'

Playlist = {
  items: []
}

Vue.filter 'short', (value) ->
  if value.length < 20
    value
  else
    value.substr(0, 20) + "..."

window.onload = ->
  new Vue({
    el: '#js-fetcher',
    data: { url : '' },
    methods: {
      fetch: (data, e) ->
        # FIXME: this is view's task. Use some cool filter.
        # FIXME: validate data.url
        utils.stopEvent e
        XHR.get("#{location.href}/items?url=#{data.url}").then (items) ->
          Playlist.items = items
    }
  })
  new Vue({
    el: '#js-playlist',
    data: Playlist,
    methods: {
      play: (item) ->
        this.$data.items = _.map this.$data.items, (x) ->
          x.playing = x == item.$data
          x
    }
  })
  new Vue({
    el: '#js-player',
    data: Playlist,
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
