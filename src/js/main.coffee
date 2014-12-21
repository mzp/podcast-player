_ = require 'lodash'
Router = require 'router.js/src/router'
director = require 'director'
require 'better-xhr/dist/better-xhr'
Vue = require 'vue'
utils = require './components/utils'

Playlist = {
  url: 'http://feeds.rebuild.fm/rebuildfm',
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
    data: Playlist,
    methods: {
      fetch: (data, e) ->
        # FIXME: this is view's task. Use some cool filter.
        utils.stopEvent e
        router.redirect "#/play?url=#{data.url}"
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

#director.Router(routes).init()
#
router = new Router()
router.addRoute '#/play/', (req, next) ->
  # FIXME: validate data.url
  url = "#{location.origin}/items?url=#{req.query.url}"
  Playlist.url = req.query.url
  XHR.get(url).then (items) ->
    Playlist.items = items

router.errors 404, (err, href) ->
  console.log "error: #{href}"

router.run location.hash
