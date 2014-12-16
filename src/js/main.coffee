utils = require './components/utils'
_ = require 'lodash'
console.log utils.add(1,2)

_.forEach [1, 2, 3, 4], (n) ->
    console.log(n);
