/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var Playlist, Router, Vue, director, router, utils, _;

	  _ = __webpack_require__(4);

	  Router = __webpack_require__(2);

	  director = __webpack_require__(5);

	  __webpack_require__(3);

	  Vue = __webpack_require__(6);

	  utils = __webpack_require__(1);

	  Playlist = {
	    url: 'http://feeds.rebuild.fm/rebuildfm',
	    items: []
	  };

	  Vue.filter('short', function(value) {
	    if (value.length < 20) {
	      return value;
	    } else {
	      return value.substr(0, 20) + "...";
	    }
	  });

	  window.onload = function() {
	    new Vue({
	      el: '#js-fetcher',
	      data: Playlist,
	      methods: {
	        fetch: function(data, e) {
	          utils.stopEvent(e);
	          return router.redirect("#/play?url=" + data.url);
	        }
	      }
	    });
	    new Vue({
	      el: '#js-playlist',
	      data: Playlist,
	      methods: {
	        play: function(item) {
	          return this.$data.items = _.map(this.$data.items, function(x) {
	            x.playing = x === item.$data;
	            return x;
	          });
	        }
	      }
	    });
	    return new Vue({
	      el: '#js-player',
	      data: Playlist,
	      methods: {
	        playNext: function(item) {
	          var playings, xs;
	          playings = utils.shift(_.map(this.$data.items, function(item) {
	            return item.playing;
	          }));
	          xs = _.zip(this.$data.items, playings);
	          return this.$data.items = _.map(xs, function(x) {
	            var playing;
	            item = x[0];
	            playing = x[1];
	            item.playing = playing;
	            return item;
	          });
	        }
	      }
	    });
	  };

	  router = new Router();

	  router.addRoute('#/play/', function(req, next) {
	    var url;
	    url = "" + location.origin + "/items?url=" + req.query.url;
	    Playlist.url = req.query.url;
	    return XHR.get(url).then(function(items) {
	      return Playlist.items = items;
	    });
	  });

	  router.errors(404, function(err, href) {
	    return console.log("error: " + href);
	  });

	  router.run(location.hash);

	}).call(this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var _;

	  _ = __webpack_require__(4);

	  exports.shift = function(xs) {
	    var ys;
	    ys = _.clone(xs);
	    ys.unshift(ys.pop());
	    return ys;
	  };

	  exports.stopEvent = function(e) {
	    e.stopPropagation();
	    return e.preventDefault();
	  };

	}).call(this);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/***
	 * @preserve Router.js
	 * @version 1.0.0
	 * @author: Fabrizio Ruggeri
	 * @website: http://ramielcreations.com/projects/router-js/
	 * @license GPL-v2
	 */


	/*jshint expr:true */
	(function(name, definition) {
	    if (true) module.exports = definition();
	    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
	    else this[name] = definition();
	}('Router', function() {
	    
	    /**
	     * Provide Function Bind specification if browser desn't support it
	     */
	    if(!Function.prototype.bind) {
	        Function.prototype.bind = function(object) {
	            var originalFunction = this, args = Array.prototype.slice.call(arguments); object = args.shift();
	            return function() {
	                return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
	            };
	        };
	    }

	    /**
	     * Commodity function to bind hashchange event
	     * @param {DOMElement} el       Element of DOM
	     * @param {function} listener Callback
	     */
	    function addHashchangeListener( el, listener ){
	        if (el.addEventListener) {
	          el.addEventListener('hashchange', listener, false); 
	        } else if (el.attachEvent)  {
	          el.attachEvent('hashchange', listener);
	        }
	    }

	    /**
	     * Commodity function to unbind hashchange event
	     * @param  {DOMElement} el       Element of DOM
	     * @param  {function} listener Callback
	     */
	    function removeHashchangeListener( el, listener ){
	        if (el.removeEventListener) {
	          el.removeEventListener('hashchange', listener, false); 
	        } else if (el.detachEvent)  {
	          el.detachEvent('hashchange', listener);
	        }
	    }

	    /**
	     * Commodity function to extend parameters and default options
	     * @return {object} merged objects
	     */
	    function extend(){
	        for(var i=1; i<arguments.length; i++)
	            for(var key in arguments[i])
	                if(arguments[i].hasOwnProperty(key))
	                    arguments[0][key] = arguments[i][key];
	        return arguments[0];
	    }
	    
	    /**
	     * Thanks to Sammy.js
	     */
	    var PATH_REPLACER = "([^\/\\?]+)",
	        PATH_NAME_MATCHER = /:([\w\d]+)/g,
	        PATH_EVERY_MATCHER = /\/\*(?!\*)/,
	        PATH_EVERY_REPLACER = "\/([^\/\\?]+)",
	        PATH_EVERY_GLOBAL_MATCHER = /\*{2}/,
	        PATH_EVERY_GLOBAL_REPLACER = "(.*?)\\??",
	        LEADING_BACKSLASHES_MATCH = /\/*$/;
	    
	    /**
	     * Http Request constructor
	     * @param {string} href Url for request object
	     * @class Request
	     * @name Request
	     * @classDesc Class representing a single http request
	     */
	    var Request = function(href){
	        /**
	         * The href of this request
	         * @type {string}
	         * @memberof Request
	         * @instance
	         * @name href
	         * @public
	         */
	        this.href = href;
	        /**
	         * Contains params with which this request is launched
	         * @type {object}
	         * @memberof Request
	         * @instance
	         * @name params
	         * @public
	         */
	        this.params;
	        /**
	         * GET Query object
	         * @type {object}
	         * @memberof Request
	         * @instance
	         * @name query
	         * @public
	         */
	        this.query;
	        /**
	         * Contains any generic regex matched parameters
	         * @type {object}
	         * @memberof Request
	         * @instance
	         * @name splat
	         * @public
	         */
	        this.splat;
	        /**
	         * If true another route matched the request and you are able to call next
	         * @type {Boolean}
	         * @memberof Request
	         * @instance
	         * @name hasNext
	         * @public
	         */
	        this.hasNext = false;
	    };

	    /**
	     * Return value passed in request using, in order params, query and eventually default_value if provided
	     * @param {string} key Key of the value to retrieve
	     * @param {*} default_value Default value if nothing found. Default to nothing
	     * @return param value
	     * @memberOf Request
	     */
	    Request.prototype.get = function(key, default_value){
	        return (this.params && this.params[key] !== undefined) ? 
	                this.params[key]
	                : (this.query && this.query[key] !== undefined) ?
	                    this.query[key]
	                    : (default_value !== undefined) ?
	                        default_value : undefined;
	    };

	    /**
	     * Router construction options
	     * @typedef {object} Router~Options
	     * @property {boolean} [ignorecase=true] If false casing matters in routing match
	     */


	    /**
	     * Construct a router
	     * @param {Router~Options} [options] Options for the instance of the router
	     * @class Router
	     * @name Router
	     * @classDesc Router main class
	     */
	    var Router = function(options) {
	        this._options = extend({ignorecase: true}, options);
	        this._routes = [];
	        this._befores = [];
	        this._errors = {
	            '_'     : function(err, url, httpCode) {
	                if(console && console.warn) console.warn('Router.js : '+httpCode);
	            },
	            '_404'  : function(err, url) {
	                if(console && console.warn) console.warn('404! Unmatched route for url ' + url);
	            },
	            '_500'  : function(err, url) {
	                if(console && console.error) console.error('500! Internal error route for url ' + url);
	                else{
	                    throw new Error('500');
	                }
	            }
	        };
	        this._paused = false;
	        this._hasChangeHandler = this._onHashChange.bind(this);
	        addHashchangeListener(window,this._hasChangeHandler);
	    };

	    /**
	     * Hander for hashchange event
	     * @param  {object} e - Event of hashchange
	     * @return {boolean}   this method returns true
	     * @memberOf Router
	     * @private
	     */
	    Router.prototype._onHashChange = function(e){
	        if(!this._paused){
	            this._route( this._extractFragment(window.location.href) );
	        }
	        return true;
	    };
	    
	    /**
	     * Extract fragments from url (everything after '#')
	     * @param  {String} url
	     * @return {String} Route fragment
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._extractFragment = function(url){
	        var hash_index = url.indexOf('#');
	        return hash_index >= 0 ? url.substring(hash_index) : '#/';
	    };

	    /**
	     * Internally launched when an error in route or in nexts happens
	     * @param {string|number} httpCode The httpCode of the error to thrown
	     * @param {object} err, Error to thrown
	     * @param {string} url, Url which generated the error
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._throwsRouteError = function( httpCode, err, url ) {
	        if(this._errors['_'+httpCode] instanceof Function)
	            this._errors['_'+httpCode](err, url, httpCode);
	        else{
	            this._errors._(err, url, httpCode);
	        }
	        return false;
	    };
	    
	    
	    /**
	     * Build a request object based on passed information
	     * @param {object} urlObj
	     * @param {object} params Params of request if any. Not mandatory
	     * @throw error Error if urlObj is not 
	     * @return {object} Request object
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._buildRequestObject = function(fragmentUrl, params, splat, hasNext){
	        if(!fragmentUrl)
	            throw new Error('Unable to compile request object');
	        var request = new Request(fragmentUrl);
	        if(params)
	            request.params = params;
	        var completeFragment = fragmentUrl.split('?');
	        if(completeFragment.length == 2){
	            var queryKeyValue = null;
	            var queryString = completeFragment[1].split('&');
	            request.query = {};
	            for(var i = 0, qLen = queryString.length; i < qLen; i++){
	                queryKeyValue = queryString[i].split('=');
	                request.query[decodeURI(queryKeyValue[0])] = decodeURI(queryKeyValue[1].replace(/\+/g, '%20'));
	            }
	            request.query;
	        }
	        if(splat && splat.length > 0){
	            request.splats = splat;
	        }
	        if(hasNext === true){
	            request.hasNext = true;
	        }
	        return request;
	    };

	    /**
	     * Internally launched when routes for current hash are found
	     * @param {object} urlObj Object of the url which fired this route
	     * @param {String} url Url which fired this route
	     * @param {array} matchedIndexes Array of matched indexes
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._followRoute = function( fragmentUrl, url, matchedIndexes ) {
	        var index = matchedIndexes.splice(0, 1), 
	            route = this._routes[index], 
	            match = url.match(route.path), 
	            request, 
	            params = {},
	            splat = [];
	        if(!route){
	            return this._throwsRouteError(500, new Error('Internal error'), fragmentUrl);
	        }
	        /*Combine path parameter name with params passed if any*/
	        for(var i = 0, len = route.paramNames.length; i < len; i++) {
	            params[route.paramNames[i]] = match[i + 1];
	        }
	        i = i+1;
	        /*If any other match put them in request splat*/
	        if( match && i < match.length){
	            for(var j = i;j< match.length;j++){
	                splat.push(match[j]);
	            }
	        }
	        /*Build next callback*/
	        var hasNext = (matchedIndexes.length !== 0);
	        var next = (
	            function(uO, u,mI, hasNext){
	                return function(hasNext, err, error_code){
	                    if(!hasNext && !err){
	                        return this._throwsRouteError( 500, 'Cannot call "next" without an error if request.hasNext is false', fragmentUrl );
	                    }
	                    if(err) 
	                        return this._throwsRouteError( error_code || 500, err, fragmentUrl );
	                    this._followRoute(uO, u, mI);
	                    }.bind(this, hasNext);
	                }.bind(this)(fragmentUrl, url, matchedIndexes, hasNext)
	        );
	        request = this._buildRequestObject( fragmentUrl, params, splat, hasNext );
	        route.routeAction(request, next);
	    };
	    
	    /**
	     * Internally call every registered before
	     * @param {function[]} befores Array of befores callback
	     * @param {function} before Actual before
	     * @param {object} urlObj Object of the url which fired this route
	     * @param {String} url Url which fired this route
	     * @param {array} matchedIndexes Array of matched indexes
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._routeBefores = function(befores, before, fragmentUrl, url, matchedIndexes) {
	        var next;
	        if(befores.length > 0) {
	            var nextBefore = befores.splice(0, 1);
	            nextBefore = nextBefore[0];
	            next = function(err, error_code) {
	                if(err)
	                    return this._throwsRouteError( error_code || 500, err, fragmentUrl);
	                this._routeBefores(befores, nextBefore, fragmentUrl, url, matchedIndexes);
	            }.bind(this);
	        } else {
	            next = function(err, error_code) {
	                if(err)
	                    return this._throwsRouteError( error_code || 500, err, fragmentUrl);
	                this._followRoute(fragmentUrl, url, matchedIndexes);
	            }.bind(this);
	        }
	        before( this._buildRequestObject( fragmentUrl, null, null, true ), next );
	    };
	    
	    /**
	     * On hashChange route request through registered handler
	     * @param  {String} fragmentUrl
	     * @private
	     * @memberOf Router
	     */
	    Router.prototype._route = function( fragmentUrl ) {
	        var route = '', 
	            befores = this._befores.slice(),/*Take a copy of befores cause is nedeed to splice them*/ 
	            matchedIndexes = [],
	            urlToTest;
	        var url = fragmentUrl;
	        if(url.length === 0)
	            return true;
	        url = url.replace( LEADING_BACKSLASHES_MATCH, '');
	        urlToTest = (url.split('?'))[0]
	              .replace( LEADING_BACKSLASHES_MATCH, '');/*Removes leading backslashes from the end of the url*/
	        /*Check for all matching indexes*/
	        for(var p in this._routes) {
	            if(this._routes.hasOwnProperty(p)) {
	                route = this._routes[p];
	                if(route.path.test(urlToTest)) {
	                    matchedIndexes.push(p);
	                }
	            }
	        }
	        
	        if(matchedIndexes.length > 0) {
	            /*If befores were added call them in order*/
	            if(befores.length > 0) {
	                var before = befores.splice(0, 1);
	                before = before[0];
	                /*Execute all before consecutively*/
	                this._routeBefores(befores, before, fragmentUrl, url, matchedIndexes);
	            } else {
	                /*Follow all routes*/
	                this._followRoute(fragmentUrl, url,  matchedIndexes);
	            }
	        /*If no route matched, then call 404 error*/
	        } else {
	            return this._throwsRouteError(404, null, fragmentUrl);
	        }
	    };
	    
	    /**
	     * Pause router to be binded on hashchange
	     * @return {Router} return this router for chaining
	     * @memberOf Router
	    */
	    Router.prototype.pause = function(){
	        this._paused = true;
	        return this;
	    };
	    
	    /**
	     * Unpause router to be binded on hashchange
	     * @param   {Boolean} triggerNow - If true evaluate location immediately
	     * @return {Router} return this router for chaining
	     * @memberOf Router
	     */
	    Router.prototype.play = function(triggerNow){
	        triggerNow = 'undefined' == typeof triggerNow ? false : triggerNow;
	        this._paused = false;
	        if(triggerNow){
	            this._route( this._extractFragment(window.location.href) );
	        }
	        return this;
	    };
	    
	    /**
	     * Set location but doesn't fire route handler
	     * @param {String} url - Url to set location to
	     * @return {Router} return this router for chaining
	     * @memberOf Router
	     * 
	     */
	    Router.prototype.setLocation = function(url){
	        window.history.pushState(null,'',url);
	        return this;
	    };
	    
	    /**
	     * Set location and fires route handler
	     * @param {String} url Url to redirect to
	     * @return {Router} return this router for chaining
	     * @memberOf Router
	     */
	    Router.prototype.redirect = function(url){
	        this.setLocation(url);
	        if(!this._paused)
	            this._route( this._extractFragment(url) );
	        return this;
	    };

	    /**
	     * This callback is called when this route is matched
	     * @callback Router~routeCallback
	     * @param {Request} req - the request object
	     * @param {function} next - Call it next matching route should be fired
	     */

	    
	    Router.prototype.addRoute = 
	    Router.prototype.add = 
	    Router.prototype.route = 
	    /**
	     * Add a routes to possible route match. Alias : route, add, get
	     * @param {(string|RegExp)} path A string or a regular expression to match
	     * @param {Router~routeCallback} callback - Is fired on path match
	     * @memberOf Router
	     */
	    Router.prototype.get = function(path, callback) {
	        var match, 
	            modifiers = (this._options.ignorecase ? 'i' : ''), 
	            paramNames = [];
	        if('string' == typeof path) {
	            /*Remove leading backslash from the end of the string*/
	            path = path.replace(LEADING_BACKSLASHES_MATCH,'');
	            /*Param Names are all the one defined as :param in the path*/
	            while(( match = PATH_NAME_MATCHER.exec(path)) !== null) {
	                paramNames.push(match[1]);
	            }
	            path = new RegExp(path
	                          .replace(PATH_NAME_MATCHER, PATH_REPLACER)
	                          .replace(PATH_EVERY_MATCHER, PATH_EVERY_REPLACER)
	                          .replace(PATH_EVERY_GLOBAL_MATCHER, PATH_EVERY_GLOBAL_REPLACER) + "(?:\\?.+)?$", modifiers);
	        }
	        this._routes.push({
	            'path' : path,
	            'paramNames' : paramNames,
	            'routeAction' : callback
	        });
	        return this;
	    };


	    /**
	     * Adds a before callback. Will be fired before every route
	     * @param {Router~routeCallback} callback
	     * @memberOf Router
	     */
	    Router.prototype.before = function(callback) {
	        this._befores.push(callback);
	        return this;
	    };


	    /**
	     * This callback is called when this route is matched
	     * @callback Router~errorCallback
	     * @param {object} err - the error
	     * @param {string} href - Href which fired this error
	     */
	    
	    
	    /**
	     * Adds error callback handling for Http code
	     * @param {Number} httpCode Http code to handle just like 404,500 or what else
	     * @param {Router~errorCallback} callback Handler for error
	     * @memberOf Router
	     */
	    Router.prototype.errors = function(httpCode, callback) {
	        if(isNaN(httpCode)) {
	            throw new Error('Invalid code for routes error handling');
	        }
	        if(!(callback instanceof Function)){
	            throw new Error('Invalid callback for routes error handling');
	        }
	        httpCode = '_' + httpCode;
	        this._errors[httpCode] = callback;
	        return this;
	    };
	    
	    /**
	     * Run application. Note that calling this is not mandatory. Calling it just force application to evaluate current or passed url
	     * @param {String} startUrl Url to redirect application on startup. Default is current location
	     * @memberOf Router
	     */
	    Router.prototype.run = function( startUrl ){
	        if(!startUrl){
	            startUrl = this._extractFragment(window.location.href);
	        }
	        startUrl = startUrl.indexOf('#') === 0 ? startUrl : '#'+startUrl;
	        this.redirect( startUrl );
	        return this;
	    };

	    /**
	     * Remove every reference to DOM and event listeners
	     * @return {Router} This router
	     * @memberOf Router
	     */
	    Router.prototype.destroy = function(){
	        removeHashchangeListener(window, this._hasChangeHandler);
	        return this;
	    };

	    return Router;
	}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file src/better-xhr.js
	 * @version 0.3.1 2014-09-22T11:14:59
	 * @overview Better abstraction for XMLHttpRequest
	 * @copyright Maksim Chemerisuk 2014
	 * @license MIT
	 * @see https://github.com/chemerisuk/better-xhr
	 */
	(function() {
	    "use strict";

	    var global = this || window,
	        toString = Object.prototype.toString,
	        Promise;

	    function XHR(method, url, config) {
	        config = config || {};
	        method = method.toUpperCase();

	        var headers = config.headers || {},
	            charset = "charset" in config ? config.charset : XHR.defaults.charset,
	            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
	            data = config.data;

	        if (toString.call(data) === "[object Object]") {
	            data = Object.keys(data).reduce(function(memo, key) {
	                var name = encodeURIComponent(key),
	                    value = data[key];

	                if (Array.isArray(value)) {
	                    value.forEach(function(value) {
	                        memo.push(name + "=" + encodeURIComponent(value));
	                    });
	                } else {
	                    memo.push(name + "=" + encodeURIComponent(value));
	                }

	                return memo;
	            }, []).join("&").replace(/%20/g, "+");
	        }

	        if (typeof data === "string") {
	            if (method === "GET") {
	                url += (~url.indexOf("?") ? "&" : "?") + data;

	                data = null;
	            } else {
	                headers["Content-Type"] = "application/x-www-form-urlencoded; charset=" + charset;
	            }
	        }

	        if (toString.call(config.json) === "[object Object]") {
	            data = JSON.stringify(config.json);

	            headers["Content-Type"] = "application/json; charset=" + charset;
	        }

	        if (cacheBurst && method === "GET") {
	            url += (~url.indexOf("?") ? "&" : "?") + cacheBurst + "=" + Date.now();
	        }

	        return new Promise(function(resolve, reject) {
	            var xhr = new XMLHttpRequest();

	            xhr.onabort = function() { reject(new Error("abort")) };
	            xhr.onerror = function() { reject(new Error("fail")) };
	            xhr.ontimeout = function() { reject(new Error("timeout")) };
	            xhr.onreadystatechange = function() {
	                if (xhr.readyState === 4) {
	                    var status = xhr.status;

	                    data = xhr.responseText;

	                    try {
	                        data = JSON.parse(data);
	                    } catch (err) {}

	                    if (status >= 200 && status < 300 || status === 304) {
	                        resolve(data);
	                    } else {
	                        reject(data);
	                    }
	                }
	            };

	            xhr.open(method, url, true);
	            xhr.timeout = config.timeout || XHR.defaults.timeout;

	            Object.keys(XHR.defaults.headers).forEach(function(key) {
	                if (!(key in headers)) {
	                    headers[key] = XHR.defaults.headers[key];
	                }
	            });

	            Object.keys(headers).forEach(function(key) {
	                if (headers[key]) {
	                    xhr.setRequestHeader(key, headers[key]);
	                }
	            });

	            xhr.send(data);
	        });
	    }

	    XHR.get = function(url, config) {
	        return XHR("get", url, config);
	    };

	    XHR.post = function(url, config) {
	        return XHR("post", url, config);
	    };

	    XHR.defaults = {
	        timeout: 15000,
	        cacheBurst: "_",
	        charset: "UTF-8",
	        headers: {
	            "X-Requested-With": "XMLHttpRequest"
	        }
	    };

	    if (typeof module !== "undefined" && module.exports) {
	        Promise = __webpack_require__(7);
	    } else {
	        Promise = global.Promise;
	    }

	    global.XHR = XHR;
	})();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash -o ./dist/lodash.compat.js`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	;(function() {

	  /** Used as a safe reference for `undefined` in pre ES5 environments */
	  var undefined;

	  /** Used to pool arrays and objects used internally */
	  var arrayPool = [],
	      objectPool = [];

	  /** Used to generate unique IDs */
	  var idCounter = 0;

	  /** Used internally to indicate various things */
	  var indicatorObject = {};

	  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
	  var keyPrefix = +new Date + '';

	  /** Used as the size when optimizations are enabled for large arrays */
	  var largeArraySize = 75;

	  /** Used as the max size of the `arrayPool` and `objectPool` */
	  var maxPoolSize = 40;

	  /** Used to detect and test whitespace */
	  var whitespace = (
	    // whitespace
	    ' \t\x0B\f\xA0\ufeff' +

	    // line terminators
	    '\n\r\u2028\u2029' +

	    // unicode category "Zs" space separators
	    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
	  );

	  /** Used to match empty string literals in compiled template source */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

	  /**
	   * Used to match ES6 template delimiters
	   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
	   */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

	  /** Used to match regexp flags from their coerced string values */
	  var reFlags = /\w*$/;

	  /** Used to detected named functions */
	  var reFuncName = /^\s*function[ \n\r\t]+\w/;

	  /** Used to match "interpolate" template delimiters */
	  var reInterpolate = /<%=([\s\S]+?)%>/g;

	  /** Used to match leading whitespace and zeros to be removed */
	  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

	  /** Used to ensure capturing order of template delimiters */
	  var reNoMatch = /($^)/;

	  /** Used to detect functions containing a `this` reference */
	  var reThis = /\bthis\b/;

	  /** Used to match unescaped characters in compiled string literals */
	  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

	  /** Used to assign default `context` object properties */
	  var contextProps = [
	    'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object',
	    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
	    'parseInt', 'setTimeout'
	  ];

	  /** Used to fix the JScript [[DontEnum]] bug */
	  var shadowedProps = [
	    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	    'toLocaleString', 'toString', 'valueOf'
	  ];

	  /** Used to make template sourceURLs easier to identify */
	  var templateCounter = 0;

	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	      arrayClass = '[object Array]',
	      boolClass = '[object Boolean]',
	      dateClass = '[object Date]',
	      errorClass = '[object Error]',
	      funcClass = '[object Function]',
	      numberClass = '[object Number]',
	      objectClass = '[object Object]',
	      regexpClass = '[object RegExp]',
	      stringClass = '[object String]';

	  /** Used to identify object classifications that `_.clone` supports */
	  var cloneableClasses = {};
	  cloneableClasses[funcClass] = false;
	  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
	  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
	  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
	  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

	  /** Used as an internal `_.debounce` options object */
	  var debounceOptions = {
	    'leading': false,
	    'maxWait': 0,
	    'trailing': false
	  };

	  /** Used as the property descriptor for `__bindData__` */
	  var descriptor = {
	    'configurable': false,
	    'enumerable': false,
	    'value': null,
	    'writable': false
	  };

	  /** Used as the data object for `iteratorTemplate` */
	  var iteratorData = {
	    'args': '',
	    'array': null,
	    'bottom': '',
	    'firstArg': '',
	    'init': '',
	    'keys': null,
	    'loop': '',
	    'shadowedProps': null,
	    'support': null,
	    'top': '',
	    'useHas': false
	  };

	  /** Used to determine if values are of the language type Object */
	  var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	  };

	  /** Used to escape characters for inclusion in compiled string literals */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\t': 't',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  /** Used as a reference to the global object */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Detect free variable `exports` */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  /** Detect free variable `module` */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect the popular CommonJS extension `module.exports` */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
	  var freeGlobal = objectTypes[typeof global] && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * The base implementation of `_.indexOf` without support for binary searches
	   * or `fromIndex` constraints.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} [fromIndex=0] The index to search from.
	   * @returns {number} Returns the index of the matched value or `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    var index = (fromIndex || 0) - 1,
	        length = array ? array.length : 0;

	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * An implementation of `_.contains` for cache objects that mimics the return
	   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
	   *
	   * @private
	   * @param {Object} cache The cache object to inspect.
	   * @param {*} value The value to search for.
	   * @returns {number} Returns `0` if `value` is found, else `-1`.
	   */
	  function cacheIndexOf(cache, value) {
	    var type = typeof value;
	    cache = cache.cache;

	    if (type == 'boolean' || value == null) {
	      return cache[value] ? 0 : -1;
	    }
	    if (type != 'number' && type != 'string') {
	      type = 'object';
	    }
	    var key = type == 'number' ? value : keyPrefix + value;
	    cache = (cache = cache[type]) && cache[key];

	    return type == 'object'
	      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
	      : (cache ? 0 : -1);
	  }

	  /**
	   * Adds a given value to the corresponding cache object.
	   *
	   * @private
	   * @param {*} value The value to add to the cache.
	   */
	  function cachePush(value) {
	    var cache = this.cache,
	        type = typeof value;

	    if (type == 'boolean' || value == null) {
	      cache[value] = true;
	    } else {
	      if (type != 'number' && type != 'string') {
	        type = 'object';
	      }
	      var key = type == 'number' ? value : keyPrefix + value,
	          typeCache = cache[type] || (cache[type] = {});

	      if (type == 'object') {
	        (typeCache[key] || (typeCache[key] = [])).push(value);
	      } else {
	        typeCache[key] = true;
	      }
	    }
	  }

	  /**
	   * Used by `_.max` and `_.min` as the default callback when a given
	   * collection is a string value.
	   *
	   * @private
	   * @param {string} value The character to inspect.
	   * @returns {number} Returns the code unit of given character.
	   */
	  function charAtCallback(value) {
	    return value.charCodeAt(0);
	  }

	  /**
	   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
	   * them in ascending order.
	   *
	   * @private
	   * @param {Object} a The object to compare to `b`.
	   * @param {Object} b The object to compare to `a`.
	   * @returns {number} Returns the sort order indicator of `1` or `-1`.
	   */
	  function compareAscending(a, b) {
	    var ac = a.criteria,
	        bc = b.criteria,
	        index = -1,
	        length = ac.length;

	    while (++index < length) {
	      var value = ac[index],
	          other = bc[index];

	      if (value !== other) {
	        if (value > other || typeof value == 'undefined') {
	          return 1;
	        }
	        if (value < other || typeof other == 'undefined') {
	          return -1;
	        }
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to return the same value for
	    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See http://code.google.com/p/v8/issues/detail?id=90
	    return a.index - b.index;
	  }

	  /**
	   * Creates a cache object to optimize linear searches of large arrays.
	   *
	   * @private
	   * @param {Array} [array=[]] The array to search.
	   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
	   */
	  function createCache(array) {
	    var index = -1,
	        length = array.length,
	        first = array[0],
	        mid = array[(length / 2) | 0],
	        last = array[length - 1];

	    if (first && typeof first == 'object' &&
	        mid && typeof mid == 'object' && last && typeof last == 'object') {
	      return false;
	    }
	    var cache = getObject();
	    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

	    var result = getObject();
	    result.array = array;
	    result.cache = cache;
	    result.push = cachePush;

	    while (++index < length) {
	      result.push(array[index]);
	    }
	    return result;
	  }

	  /**
	   * Used by `template` to escape characters for inclusion in compiled
	   * string literals.
	   *
	   * @private
	   * @param {string} match The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(match) {
	    return '\\' + stringEscapes[match];
	  }

	  /**
	   * Gets an array from the array pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Array} The array from the pool.
	   */
	  function getArray() {
	    return arrayPool.pop() || [];
	  }

	  /**
	   * Gets an object from the object pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Object} The object from the pool.
	   */
	  function getObject() {
	    return objectPool.pop() || {
	      'array': null,
	      'cache': null,
	      'criteria': null,
	      'false': false,
	      'index': 0,
	      'null': false,
	      'number': null,
	      'object': null,
	      'push': null,
	      'string': null,
	      'true': false,
	      'undefined': false,
	      'value': null
	    };
	  }

	  /**
	   * Checks if `value` is a DOM node in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
	   */
	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }

	  /**
	   * Releases the given array back to the array pool.
	   *
	   * @private
	   * @param {Array} [array] The array to release.
	   */
	  function releaseArray(array) {
	    array.length = 0;
	    if (arrayPool.length < maxPoolSize) {
	      arrayPool.push(array);
	    }
	  }

	  /**
	   * Releases the given object back to the object pool.
	   *
	   * @private
	   * @param {Object} [object] The object to release.
	   */
	  function releaseObject(object) {
	    var cache = object.cache;
	    if (cache) {
	      releaseObject(cache);
	    }
	    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
	    if (objectPool.length < maxPoolSize) {
	      objectPool.push(object);
	    }
	  }

	  /**
	   * Slices the `collection` from the `start` index up to, but not including,
	   * the `end` index.
	   *
	   * Note: This function is used instead of `Array#slice` to support node lists
	   * in IE < 9 and to ensure dense arrays are returned.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to slice.
	   * @param {number} start The start index.
	   * @param {number} end The end index.
	   * @returns {Array} Returns the new array.
	   */
	  function slice(array, start, end) {
	    start || (start = 0);
	    if (typeof end == 'undefined') {
	      end = array ? array.length : 0;
	    }
	    var index = -1,
	        length = end - start || 0,
	        result = Array(length < 0 ? 0 : length);

	    while (++index < length) {
	      result[index] = array[start + index];
	    }
	    return result;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Create a new `lodash` function using the given context object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utilities
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns the `lodash` function.
	   */
	  function runInContext(context) {
	    // Avoid issues with some ES3 environments that attempt to use values, named
	    // after built-in constructors like `Object`, for the creation of literals.
	    // ES5 clears this up by stating that literals must use built-in constructors.
	    // See http://es5.github.io/#x11.1.5.
	    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

	    /** Native constructor references */
	    var Array = context.Array,
	        Boolean = context.Boolean,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Number = context.Number,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;

	    /**
	     * Used for `Array` method references.
	     *
	     * Normally `Array.prototype` would suffice, however, using an array literal
	     * avoids issues in Narwhal.
	     */
	    var arrayRef = [];

	    /** Used for native method references */
	    var errorProto = Error.prototype,
	        objectProto = Object.prototype,
	        stringProto = String.prototype;

	    /** Used to restore the original `_` reference in `noConflict` */
	    var oldDash = context._;

	    /** Used to resolve the internal [[Class]] of values */
	    var toString = objectProto.toString;

	    /** Used to detect if a method is native */
	    var reNative = RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    /** Native method shortcuts */
	    var ceil = Math.ceil,
	        clearTimeout = context.clearTimeout,
	        floor = Math.floor,
	        fnToString = Function.prototype.toString,
	        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
	        hasOwnProperty = objectProto.hasOwnProperty,
	        push = arrayRef.push,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        setTimeout = context.setTimeout,
	        splice = arrayRef.splice,
	        unshift = arrayRef.unshift;

	    /** Used to set meta data on functions */
	    var defineProperty = (function() {
	      // IE 8 only accepts DOM elements
	      try {
	        var o = {},
	            func = isNative(func = Object.defineProperty) && func,
	            result = func(o, o, o) && func;
	      } catch(e) { }
	      return result;
	    }());

	    /* Native method shortcuts for methods with the same name as other `lodash` methods */
	    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
	        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	        nativeIsFinite = context.isFinite,
	        nativeIsNaN = context.isNaN,
	        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random;

	    /** Used to lookup a built-in constructor by [[Class]] */
	    var ctorByClass = {};
	    ctorByClass[arrayClass] = Array;
	    ctorByClass[boolClass] = Boolean;
	    ctorByClass[dateClass] = Date;
	    ctorByClass[funcClass] = Function;
	    ctorByClass[objectClass] = Object;
	    ctorByClass[numberClass] = Number;
	    ctorByClass[regexpClass] = RegExp;
	    ctorByClass[stringClass] = String;

	    /** Used to avoid iterating non-enumerable properties in IE < 9 */
	    var nonEnumProps = {};
	    nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	    nonEnumProps[objectClass] = { 'constructor': true };

	    (function() {
	      var length = shadowedProps.length;
	      while (length--) {
	        var key = shadowedProps[length];
	        for (var className in nonEnumProps) {
	          if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
	            nonEnumProps[className][key] = false;
	          }
	        }
	      }
	    }());

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object which wraps the given value to enable intuitive
	     * method chaining.
	     *
	     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
	     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
	     * and `unshift`
	     *
	     * Chaining is supported in custom builds as long as the `value` method is
	     * implicitly or explicitly included in the build.
	     *
	     * The chainable wrapper functions are:
	     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
	     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
	     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
	     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
	     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
	     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
	     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
	     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
	     * and `zip`
	     *
	     * The non-chainable wrapper functions are:
	     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
	     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
	     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
	     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
	     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
	     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
	     * `template`, `unescape`, `uniqueId`, and `value`
	     *
	     * The wrapper functions `first` and `last` return wrapped values when `n` is
	     * provided, otherwise they return unwrapped values.
	     *
	     * Explicit chaining can be enabled by using the `_.chain` method.
	     *
	     * @name _
	     * @constructor
	     * @category Chaining
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns a `lodash` instance.
	     * @example
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(function(num) {
	     *   return num * num;
	     * });
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
	      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
	       ? value
	       : new lodashWrapper(value);
	    }

	    /**
	     * A fast path for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @param {boolean} chainAll A flag to enable chaining for all methods
	     * @returns {Object} Returns a `lodash` instance.
	     */
	    function lodashWrapper(value, chainAll) {
	      this.__chain__ = !!chainAll;
	      this.__wrapped__ = value;
	    }
	    // ensure `new lodashWrapper` is an instance of `lodash`
	    lodashWrapper.prototype = lodash.prototype;

	    /**
	     * An object used to flag environments features.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    var support = lodash.support = {};

	    (function() {
	      var ctor = function() { this.x = 1; },
	          object = { '0': 1, 'length': 1 },
	          props = [];

	      ctor.prototype = { 'valueOf': 1, 'y': 1 };
	      for (var key in new ctor) { props.push(key); }
	      for (key in arguments) { }

	      /**
	       * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsClass = toString.call(arguments) == argsClass;

	      /**
	       * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

	      /**
	       * Detect if `name` or `message` properties of `Error.prototype` are
	       * enumerable by default. (IE < 9, Safari < 5.1)
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

	      /**
	       * Detect if `prototype` properties are enumerable by default.
	       *
	       * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	       * (if the prototype or a property on the prototype has been set)
	       * incorrectly sets a function's `prototype` property [[Enumerable]]
	       * value to `true`.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

	      /**
	       * Detect if functions can be decompiled by `Function#toString`
	       * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

	      /**
	       * Detect if `Function#name` is supported (all but IE).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcNames = typeof Function.name == 'string';

	      /**
	       * Detect if `arguments` object indexes are non-enumerable
	       * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumArgs = key != 0;

	      /**
	       * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	       *
	       * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
	       * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumShadows = !/valueOf/.test(props);

	      /**
	       * Detect if own properties are iterated after inherited properties (all but IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.ownLast = props[0] != 'x';

	      /**
	       * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
	       *
	       * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
	       * and `splice()` functions that fail to remove the last element, `value[0]`,
	       * of array-like objects even though the `length` property is set to `0`.
	       * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
	       * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

	      /**
	       * Detect lack of support for accessing string characters by index.
	       *
	       * IE < 8 can't access characters by index and IE 8 can only access
	       * characters by index on string literals.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

	      /**
	       * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
	       * and that the JS engine errors when attempting to coerce an object to
	       * a string without a `toString` function.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      try {
	        support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	      } catch(e) {
	        support.nodeClass = true;
	      }
	    }(1));

	    /**
	     * By default, the template delimiters used by Lo-Dash are similar to those in
	     * embedded Ruby (ERB). Change the following template settings to use alternative
	     * delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {

	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': /<%-([\s\S]+?)%>/g,

	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': /<%([\s\S]+?)%>/g,

	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,

	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',

	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {

	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The template used to create iterator functions.
	     *
	     * @private
	     * @param {Object} data The data object used to populate the text.
	     * @returns {string} Returns the interpolated text.
	     */
	    var iteratorTemplate = function(obj) {

	      var __p = 'var index, iterable = ' +
	      (obj.firstArg) +
	      ', result = ' +
	      (obj.init) +
	      ';\nif (!iterable) return result;\n' +
	      (obj.top) +
	      ';';
	       if (obj.array) {
	      __p += '\nvar length = iterable.length; index = -1;\nif (' +
	      (obj.array) +
	      ') {  ';
	       if (support.unindexedChars) {
	      __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
	       }
	      __p += '\n  while (++index < length) {\n    ' +
	      (obj.loop) +
	      ';\n  }\n}\nelse {  ';
	       } else if (support.nonEnumArgs) {
	      __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
	      (obj.loop) +
	      ';\n    }\n  } else {  ';
	       }

	       if (support.enumPrototypes) {
	      __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
	       }

	       if (support.enumErrorProps) {
	      __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
	       }

	          var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

	       if (obj.useHas && obj.keys) {
	      __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
	          if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }  ';
	       } else {
	      __p += '\n  for (index in iterable) {\n';
	          if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }    ';
	       if (support.nonEnumShadows) {
	      __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
	       for (k = 0; k < 7; k++) {
	      __p += '\n    index = \'' +
	      (obj.shadowedProps[k]) +
	      '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
	              if (!obj.useHas) {
	      __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
	       }
	      __p += ') {\n      ' +
	      (obj.loop) +
	      ';\n    }      ';
	       }
	      __p += '\n  }    ';
	       }

	       }

	       if (obj.array || support.nonEnumArgs) {
	      __p += '\n}';
	       }
	      __p +=
	      (obj.bottom) +
	      ';\nreturn result';

	      return __p
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The base implementation of `_.bind` that creates the bound function and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new bound function.
	     */
	    function baseBind(bindData) {
	      var func = bindData[0],
	          partialArgs = bindData[2],
	          thisArg = bindData[4];

	      function bound() {
	        // `Function#bind` spec
	        // http://es5.github.io/#x15.3.4.5
	        if (partialArgs) {
	          // avoid `arguments` object deoptimizations by using `slice` instead
	          // of `Array.prototype.slice.call` and not assigning `arguments` to a
	          // variable as a ternary expression
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        // mimic the constructor's `return` behavior
	        // http://es5.github.io/#x13.2.2
	        if (this instanceof bound) {
	          // ensure `new bound` is an instance of `func`
	          var thisBinding = baseCreate(func.prototype),
	              result = func.apply(thisBinding, args || arguments);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisArg, args || arguments);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.clone` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates clones with source counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, callback, stackA, stackB) {
	      if (callback) {
	        var result = callback(value);
	        if (typeof result != 'undefined') {
	          return result;
	        }
	      }
	      // inspect [[Class]]
	      var isObj = isObject(value);
	      if (isObj) {
	        var className = toString.call(value);
	        if (!cloneableClasses[className] || (!support.nodeClass && isNode(value))) {
	          return value;
	        }
	        var ctor = ctorByClass[className];
	        switch (className) {
	          case boolClass:
	          case dateClass:
	            return new ctor(+value);

	          case numberClass:
	          case stringClass:
	            return new ctor(value);

	          case regexpClass:
	            result = ctor(value.source, reFlags.exec(value));
	            result.lastIndex = value.lastIndex;
	            return result;
	        }
	      } else {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isDeep) {
	        // check for circular references and return corresponding clone
	        var initedStack = !stackA;
	        stackA || (stackA = getArray());
	        stackB || (stackB = getArray());

	        var length = stackA.length;
	        while (length--) {
	          if (stackA[length] == value) {
	            return stackB[length];
	          }
	        }
	        result = isArr ? ctor(value.length) : {};
	      }
	      else {
	        result = isArr ? slice(value) : assign({}, value);
	      }
	      // add array properties assigned by `RegExp#exec`
	      if (isArr) {
	        if (hasOwnProperty.call(value, 'index')) {
	          result.index = value.index;
	        }
	        if (hasOwnProperty.call(value, 'input')) {
	          result.input = value.input;
	        }
	      }
	      // exit for shallow clone
	      if (!isDeep) {
	        return result;
	      }
	      // add the source value to the stack of traversed objects
	      // and associate it with its clone
	      stackA.push(value);
	      stackB.push(result);

	      // recursively populate clone (susceptible to call stack limits)
	      (isArr ? baseEach : forOwn)(value, function(objValue, key) {
	        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
	      });

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    function baseCreate(prototype, properties) {
	      return isObject(prototype) ? nativeCreate(prototype) : {};
	    }
	    // fallback for browsers without `Object.create`
	    if (!nativeCreate) {
	      baseCreate = (function() {
	        function Object() {}
	        return function(prototype) {
	          if (isObject(prototype)) {
	            Object.prototype = prototype;
	            var result = new Object;
	            Object.prototype = null;
	          }
	          return result || context.Object();
	        };
	      }());
	    }

	    /**
	     * The base implementation of `_.createCallback` without support for creating
	     * "_.pluck" or "_.where" style callbacks.
	     *
	     * @private
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     */
	    function baseCreateCallback(func, thisArg, argCount) {
	      if (typeof func != 'function') {
	        return identity;
	      }
	      // exit early for no `thisArg` or already bound by `Function#bind`
	      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
	        return func;
	      }
	      var bindData = func.__bindData__;
	      if (typeof bindData == 'undefined') {
	        if (support.funcNames) {
	          bindData = !func.name;
	        }
	        bindData = bindData || !support.funcDecomp;
	        if (!bindData) {
	          var source = fnToString.call(func);
	          if (!support.funcNames) {
	            bindData = !reFuncName.test(source);
	          }
	          if (!bindData) {
	            // checks if `func` references the `this` keyword and stores the result
	            bindData = reThis.test(source);
	            setBindData(func, bindData);
	          }
	        }
	      }
	      // exit early if there are no `this` references or `func` is bound
	      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
	        return func;
	      }
	      switch (argCount) {
	        case 1: return function(value) {
	          return func.call(thisArg, value);
	        };
	        case 2: return function(a, b) {
	          return func.call(thisArg, a, b);
	        };
	        case 3: return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	        case 4: return function(accumulator, value, index, collection) {
	          return func.call(thisArg, accumulator, value, index, collection);
	        };
	      }
	      return bind(func, thisArg);
	    }

	    /**
	     * The base implementation of `createWrapper` that creates the wrapper and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new function.
	     */
	    function baseCreateWrapper(bindData) {
	      var func = bindData[0],
	          bitmask = bindData[1],
	          partialArgs = bindData[2],
	          partialRightArgs = bindData[3],
	          thisArg = bindData[4],
	          arity = bindData[5];

	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          key = func;

	      function bound() {
	        var thisBinding = isBind ? thisArg : this;
	        if (partialArgs) {
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        if (partialRightArgs || isCurry) {
	          args || (args = slice(arguments));
	          if (partialRightArgs) {
	            push.apply(args, partialRightArgs);
	          }
	          if (isCurry && args.length < arity) {
	            bitmask |= 16 & ~32;
	            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
	          }
	        }
	        args || (args = arguments);
	        if (isBindKey) {
	          func = thisBinding[key];
	        }
	        if (this instanceof bound) {
	          thisBinding = baseCreate(func.prototype);
	          var result = func.apply(thisBinding, args);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisBinding, args);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.difference` that accepts a single array
	     * of values to exclude.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {Array} [values] The array of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     */
	    function baseDifference(array, values) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
	          result = [];

	      if (isLarge) {
	        var cache = createCache(values);
	        if (cache) {
	          indexOf = cacheIndexOf;
	          values = cache;
	        } else {
	          isLarge = false;
	        }
	      }
	      while (++index < length) {
	        var value = array[index];
	        if (indexOf(values, value) < 0) {
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseObject(values);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.flatten` without support for callback
	     * shorthands or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
	     * @param {number} [fromIndex=0] The index to start from.
	     * @returns {Array} Returns a new flattened array.
	     */
	    function baseFlatten(array, isShallow, isStrict, fromIndex) {
	      var index = (fromIndex || 0) - 1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];

	        if (value && typeof value == 'object' && typeof value.length == 'number'
	            && (isArray(value) || isArguments(value))) {
	          // recursively flatten arrays (susceptible to call stack limits)
	          if (!isShallow) {
	            value = baseFlatten(value, isShallow, isStrict);
	          }
	          var valIndex = -1,
	              valLength = value.length,
	              resIndex = result.length;

	          result.length += valLength;
	          while (++valIndex < valLength) {
	            result[resIndex++] = value[valIndex];
	          }
	        } else if (!isStrict) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
	     * that allows partial "_.where" style comparisons.
	     *
	     * @private
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
	     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
	     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
	      // used to indicate that when comparing objects, `a` has at least the properties of `b`
	      if (callback) {
	        var result = callback(a, b);
	        if (typeof result != 'undefined') {
	          return !!result;
	        }
	      }
	      // exit early for identical values
	      if (a === b) {
	        // treat `+0` vs. `-0` as not equal
	        return a !== 0 || (1 / a == 1 / b);
	      }
	      var type = typeof a,
	          otherType = typeof b;

	      // exit early for unlike primitive values
	      if (a === a &&
	          !(a && objectTypes[type]) &&
	          !(b && objectTypes[otherType])) {
	        return false;
	      }
	      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
	      // http://es5.github.io/#x15.3.4.4
	      if (a == null || b == null) {
	        return a === b;
	      }
	      // compare [[Class]] names
	      var className = toString.call(a),
	          otherClass = toString.call(b);

	      if (className == argsClass) {
	        className = objectClass;
	      }
	      if (otherClass == argsClass) {
	        otherClass = objectClass;
	      }
	      if (className != otherClass) {
	        return false;
	      }
	      switch (className) {
	        case boolClass:
	        case dateClass:
	          // coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	          return +a == +b;

	        case numberClass:
	          // treat `NaN` vs. `NaN` as equal
	          return (a != +a)
	            ? b != +b
	            // but treat `+0` vs. `-0` as not equal
	            : (a == 0 ? (1 / a == 1 / b) : a == +b);

	        case regexpClass:
	        case stringClass:
	          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	          // treat string primitives and their corresponding object instances as equal
	          return a == String(b);
	      }
	      var isArr = className == arrayClass;
	      if (!isArr) {
	        // unwrap any `lodash` wrapped values
	        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
	            bWrapped = hasOwnProperty.call(b, '__wrapped__');

	        if (aWrapped || bWrapped) {
	          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
	        }
	        // exit for functions and DOM nodes
	        if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	          return false;
	        }
	        // in older versions of Opera, `arguments` objects have `Array` constructors
	        var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	            ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

	        // non `Object` object instances with different constructors are not equal
	        if (ctorA != ctorB &&
	              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	              ('constructor' in a && 'constructor' in b)
	            ) {
	          return false;
	        }
	      }
	      // assume cyclic structures are equal
	      // the algorithm for detecting cyclic structures is adapted from ES 5.1
	      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	      var initedStack = !stackA;
	      stackA || (stackA = getArray());
	      stackB || (stackB = getArray());

	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == a) {
	          return stackB[length] == b;
	        }
	      }
	      var size = 0;
	      result = true;

	      // add `a` and `b` to the stack of traversed objects
	      stackA.push(a);
	      stackB.push(b);

	      // recursively compare objects and arrays (susceptible to call stack limits)
	      if (isArr) {
	        // compare lengths to determine if a deep comparison is necessary
	        length = a.length;
	        size = b.length;
	        result = size == length;

	        if (result || isWhere) {
	          // deep compare the contents, ignoring non-numeric properties
	          while (size--) {
	            var index = length,
	                value = b[size];

	            if (isWhere) {
	              while (index--) {
	                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
	                  break;
	                }
	              }
	            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
	              break;
	            }
	          }
	        }
	      }
	      else {
	        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	        // which, in this case, is more costly
	        forIn(b, function(value, key, b) {
	          if (hasOwnProperty.call(b, key)) {
	            // count the number of properties.
	            size++;
	            // deep compare each property value.
	            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
	          }
	        });

	        if (result && !isWhere) {
	          // ensure both objects have the same number of properties
	          forIn(a, function(value, key, a) {
	            if (hasOwnProperty.call(a, key)) {
	              // `size` will be `-1` if `a` has more properties than `b`
	              return (result = --size > -1);
	            }
	          });
	        }
	      }
	      stackA.pop();
	      stackB.pop();

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.merge` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     */
	    function baseMerge(object, source, callback, stackA, stackB) {
	      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
	        var found,
	            isArr,
	            result = source,
	            value = object[key];

	        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
	          // avoid merging previously merged cyclic sources
	          var stackLength = stackA.length;
	          while (stackLength--) {
	            if ((found = stackA[stackLength] == source)) {
	              value = stackB[stackLength];
	              break;
	            }
	          }
	          if (!found) {
	            var isShallow;
	            if (callback) {
	              result = callback(value, source);
	              if ((isShallow = typeof result != 'undefined')) {
	                value = result;
	              }
	            }
	            if (!isShallow) {
	              value = isArr
	                ? (isArray(value) ? value : [])
	                : (isPlainObject(value) ? value : {});
	            }
	            // add `source` and associated `value` to the stack of traversed objects
	            stackA.push(source);
	            stackB.push(value);

	            // recursively merge objects and arrays (susceptible to call stack limits)
	            if (!isShallow) {
	              baseMerge(value, source, callback, stackA, stackB);
	            }
	          }
	        }
	        else {
	          if (callback) {
	            result = callback(value, source);
	            if (typeof result == 'undefined') {
	              result = source;
	            }
	          }
	          if (typeof result != 'undefined') {
	            value = result;
	          }
	        }
	        object[key] = value;
	      });
	    }

	    /**
	     * The base implementation of `_.random` without argument juggling or support
	     * for returning floating-point numbers.
	     *
	     * @private
	     * @param {number} min The minimum possible value.
	     * @param {number} max The maximum possible value.
	     * @returns {number} Returns a random number.
	     */
	    function baseRandom(min, max) {
	      return min + floor(nativeRandom() * (max - min + 1));
	    }

	    /**
	     * The base implementation of `_.uniq` without support for callback shorthands
	     * or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function} [callback] The function called per iteration.
	     * @returns {Array} Returns a duplicate-value-free array.
	     */
	    function baseUniq(array, isSorted, callback) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          result = [];

	      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
	          seen = (callback || isLarge) ? getArray() : result;

	      if (isLarge) {
	        var cache = createCache(seen);
	        indexOf = cacheIndexOf;
	        seen = cache;
	      }
	      while (++index < length) {
	        var value = array[index],
	            computed = callback ? callback(value, index, array) : value;

	        if (isSorted
	              ? !index || seen[seen.length - 1] !== computed
	              : indexOf(seen, computed) < 0
	            ) {
	          if (callback || isLarge) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseArray(seen.array);
	        releaseObject(seen);
	      } else if (callback) {
	        releaseArray(seen);
	      }
	      return result;
	    }

	    /**
	     * Creates a function that aggregates a collection, creating an object composed
	     * of keys generated from the results of running each element of the collection
	     * through a callback. The given `setter` function sets the keys and values
	     * of the composed object.
	     *
	     * @private
	     * @param {Function} setter The setter function.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter) {
	      return function(collection, callback, thisArg) {
	        var result = {};
	        callback = lodash.createCallback(callback, thisArg, 3);

	        if (isArray(collection)) {
	          var index = -1,
	              length = collection.length;

	          while (++index < length) {
	            var value = collection[index];
	            setter(result, value, callback(value, index, collection), collection);
	          }
	        } else {
	          baseEach(collection, function(value, key, collection) {
	            setter(result, value, callback(value, key, collection), collection);
	          });
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, either curries or invokes `func`
	     * with an optional `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of method flags to compose.
	     *  The bitmask may be composed of the following flags:
	     *  1 - `_.bind`
	     *  2 - `_.bindKey`
	     *  4 - `_.curry`
	     *  8 - `_.curry` (bound)
	     *  16 - `_.partial`
	     *  32 - `_.partialRight`
	     * @param {Array} [partialArgs] An array of arguments to prepend to those
	     *  provided to the new function.
	     * @param {Array} [partialRightArgs] An array of arguments to append to those
	     *  provided to the new function.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new function.
	     */
	    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          isPartial = bitmask & 16,
	          isPartialRight = bitmask & 32;

	      if (!isBindKey && !isFunction(func)) {
	        throw new TypeError;
	      }
	      if (isPartial && !partialArgs.length) {
	        bitmask &= ~16;
	        isPartial = partialArgs = false;
	      }
	      if (isPartialRight && !partialRightArgs.length) {
	        bitmask &= ~32;
	        isPartialRight = partialRightArgs = false;
	      }
	      var bindData = func && func.__bindData__;
	      if (bindData && bindData !== true) {
	        // clone `bindData`
	        bindData = slice(bindData);
	        if (bindData[2]) {
	          bindData[2] = slice(bindData[2]);
	        }
	        if (bindData[3]) {
	          bindData[3] = slice(bindData[3]);
	        }
	        // set `thisBinding` is not previously bound
	        if (isBind && !(bindData[1] & 1)) {
	          bindData[4] = thisArg;
	        }
	        // set if previously bound but not currently (subsequent curried functions)
	        if (!isBind && bindData[1] & 1) {
	          bitmask |= 8;
	        }
	        // set curried arity if not yet set
	        if (isCurry && !(bindData[1] & 4)) {
	          bindData[5] = arity;
	        }
	        // append partial left arguments
	        if (isPartial) {
	          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
	        }
	        // append partial right arguments
	        if (isPartialRight) {
	          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
	        }
	        // merge flags
	        bindData[1] |= bitmask;
	        return createWrapper.apply(null, bindData);
	      }
	      // fast path for `_.bind`
	      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
	      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
	    }

	    /**
	     * Creates compiled iteration functions.
	     *
	     * @private
	     * @param {...Object} [options] The compile options object(s).
	     * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
	     * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
	     * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
	     * @param {string} [options.args] A comma separated string of iteration function arguments.
	     * @param {string} [options.top] Code to execute before the iteration branches.
	     * @param {string} [options.loop] Code to execute in the object loop.
	     * @param {string} [options.bottom] Code to execute after the iteration branches.
	     * @returns {Function} Returns the compiled function.
	     */
	    function createIterator() {
	      // data properties
	      iteratorData.shadowedProps = shadowedProps;

	      // iterator options
	      iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
	      iteratorData.init = 'iterable';
	      iteratorData.useHas = true;

	      // merge options into a template data object
	      for (var object, index = 0; object = arguments[index]; index++) {
	        for (var key in object) {
	          iteratorData[key] = object[key];
	        }
	      }
	      var args = iteratorData.args;
	      iteratorData.firstArg = /^[^,]+/.exec(args)[0];

	      // create the function factory
	      var factory = Function(
	          'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
	          'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
	          'objectTypes, nonEnumProps, stringClass, stringProto, toString',
	        'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
	      );

	      // return the compiled function
	      return factory(
	        baseCreateCallback, errorClass, errorProto, hasOwnProperty,
	        indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
	        objectTypes, nonEnumProps, stringClass, stringProto, toString
	      );
	    }

	    /**
	     * Used by `escape` to convert characters to HTML entities.
	     *
	     * @private
	     * @param {string} match The matched character to escape.
	     * @returns {string} Returns the escaped character.
	     */
	    function escapeHtmlChar(match) {
	      return htmlEscapes[match];
	    }

	    /**
	     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	     * customized, this method returns the custom method, otherwise it returns
	     * the `baseIndexOf` function.
	     *
	     * @private
	     * @returns {Function} Returns the "indexOf" function.
	     */
	    function getIndexOf() {
	      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
	      return result;
	    }

	    /**
	     * Checks if `value` is a native function.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
	     */
	    function isNative(value) {
	      return typeof value == 'function' && reNative.test(value);
	    }

	    /**
	     * Sets `this` binding data on a given function.
	     *
	     * @private
	     * @param {Function} func The function to set data on.
	     * @param {Array} value The data array to set.
	     */
	    var setBindData = !defineProperty ? noop : function(func, value) {
	      descriptor.value = value;
	      defineProperty(func, '__bindData__', descriptor);
	    };

	    /**
	     * A fallback implementation of `isPlainObject` which checks if a given value
	     * is an object created by the `Object` constructor, assuming objects created
	     * by the `Object` constructor have no inherited enumerable properties and that
	     * there are no `Object.prototype` extensions.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     */
	    function shimIsPlainObject(value) {
	      var ctor,
	          result;

	      // avoid non Object objects, `arguments` objects, and DOM elements
	      if (!(value && toString.call(value) == objectClass) ||
	          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) ||
	          (!support.argsClass && isArguments(value)) ||
	          (!support.nodeClass && isNode(value))) {
	        return false;
	      }
	      // IE < 9 iterates inherited properties before own properties. If the first
	      // iterated property is an object's own property then there are no inherited
	      // enumerable properties.
	      if (support.ownLast) {
	        forIn(value, function(value, key, object) {
	          result = hasOwnProperty.call(object, key);
	          return false;
	        });
	        return result !== false;
	      }
	      // In most environments an object's own properties are iterated before
	      // its inherited properties. If the last iterated property is an object's
	      // own property then there are no inherited enumerable properties.
	      forIn(value, function(value, key) {
	        result = key;
	      });
	      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
	    }

	    /**
	     * Used by `unescape` to convert HTML entities to characters.
	     *
	     * @private
	     * @param {string} match The matched character to unescape.
	     * @returns {string} Returns the unescaped character.
	     */
	    function unescapeHtmlChar(match) {
	      return htmlUnescapes[match];
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Checks if `value` is an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
	     * @example
	     *
	     * (function() { return _.isArguments(arguments); })(1, 2, 3);
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == argsClass || false;
	    }
	    // fallback for browsers that can't detect `arguments` objects by [[Class]]
	    if (!support.argsClass) {
	      isArguments = function(value) {
	        return value && typeof value == 'object' && typeof value.length == 'number' &&
	          hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
	      };
	    }

	    /**
	     * Checks if `value` is an array.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
	     * @example
	     *
	     * (function() { return _.isArray(arguments); })();
	     * // => false
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     */
	    var isArray = nativeIsArray || function(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == arrayClass || false;
	    };

	    /**
	     * A fallback implementation of `Object.keys` which produces an array of the
	     * given object's own enumerable property names.
	     *
	     * @private
	     * @type Function
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     */
	    var shimKeys = createIterator({
	      'args': 'object',
	      'init': '[]',
	      'top': 'if (!(objectTypes[typeof object])) return result',
	      'loop': 'result.push(index)'
	    });

	    /**
	     * Creates an array composed of the own enumerable property names of an object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     * @example
	     *
	     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
	     */
	    var keys = !nativeKeys ? shimKeys : function(object) {
	      if (!isObject(object)) {
	        return [];
	      }
	      if ((support.enumPrototypes && typeof object == 'function') ||
	          (support.nonEnumArgs && object.length && isArguments(object))) {
	        return shimKeys(object);
	      }
	      return nativeKeys(object);
	    };

	    /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
	    var eachIteratorOptions = {
	      'args': 'collection, callback, thisArg',
	      'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
	      'array': "typeof length == 'number'",
	      'keys': keys,
	      'loop': 'if (callback(iterable[index], index, collection) === false) return result'
	    };

	    /** Reusable iterator options for `assign` and `defaults` */
	    var defaultsIteratorOptions = {
	      'args': 'object, source, guard',
	      'top':
	        'var args = arguments,\n' +
	        '    argsIndex = 0,\n' +
	        "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
	        'while (++argsIndex < argsLength) {\n' +
	        '  iterable = args[argsIndex];\n' +
	        '  if (iterable && objectTypes[typeof iterable]) {',
	      'keys': keys,
	      'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
	      'bottom': '  }\n}'
	    };

	    /** Reusable iterator options for `forIn` and `forOwn` */
	    var forOwnIteratorOptions = {
	      'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
	      'array': false
	    };

	    /**
	     * Used to convert characters to HTML entities:
	     *
	     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
	     * don't require escaping in HTML and have no special meaning unless they're part
	     * of a tag or an unquoted attribute value.
	     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
	     */
	    var htmlEscapes = {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      "'": '&#39;'
	    };

	    /** Used to convert HTML entities to characters */
	    var htmlUnescapes = invert(htmlEscapes);

	    /** Used to match HTML entities and HTML characters */
	    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
	        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

	    /**
	     * A function compiled to iterate `arguments` objects, arrays, objects, and
	     * strings consistenly across environments, executing the callback for each
	     * element in the collection. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index|key, collection). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @private
	     * @type Function
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEach = createIterator(eachIteratorOptions);

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object. Subsequent sources will overwrite property assignments of previous
	     * sources. If a callback is provided it will be executed to produce the
	     * assigned values. The callback is bound to `thisArg` and invoked with two
	     * arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @alias extend
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize assigning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
	     * // => { 'name': 'fred', 'employer': 'slate' }
	     *
	     * var defaults = _.partialRight(_.assign, function(a, b) {
	     *   return typeof a == 'undefined' ? b : a;
	     * });
	     *
	     * var object = { 'name': 'barney' };
	     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var assign = createIterator(defaultsIteratorOptions, {
	      'top':
	        defaultsIteratorOptions.top.replace(';',
	          ';\n' +
	          "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
	          '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
	          "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
	          '  callback = args[--argsLength];\n' +
	          '}'
	        ),
	      'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
	    });

	    /**
	     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
	     * be cloned, otherwise they will be assigned by reference. If a callback
	     * is provided it will be executed to produce the cloned values. If the
	     * callback returns `undefined` cloning will be handled by the method instead.
	     * The callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var shallow = _.clone(characters);
	     * shallow[0] === characters[0];
	     * // => true
	     *
	     * var deep = _.clone(characters, true);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * _.mixin({
	     *   'clone': _.partialRight(_.clone, function(value) {
	     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
	     *   })
	     * });
	     *
	     * var clone = _.clone(document.body);
	     * clone.childNodes.length;
	     * // => 0
	     */
	    function clone(value, isDeep, callback, thisArg) {
	      // allows working with "Collections" methods without using their `index`
	      // and `collection` arguments for `isDeep` and `callback`
	      if (typeof isDeep != 'boolean' && isDeep != null) {
	        thisArg = callback;
	        callback = isDeep;
	        isDeep = false;
	      }
	      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates a deep clone of `value`. If a callback is provided it will be
	     * executed to produce the cloned values. If the callback returns `undefined`
	     * cloning will be handled by the method instead. The callback is bound to
	     * `thisArg` and invoked with one argument; (value).
	     *
	     * Note: This method is loosely based on the structured clone algorithm. Functions
	     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
	     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
	     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var deep = _.cloneDeep(characters);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'node': element
	     * };
	     *
	     * var clone = _.cloneDeep(view, function(value) {
	     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
	     * });
	     *
	     * clone.node == view.node;
	     * // => false
	     */
	    function cloneDeep(value, callback, thisArg) {
	      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates an object that inherits from the given `prototype` object. If a
	     * `properties` object is provided its own enumerable properties are assigned
	     * to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties ? assign(result, properties) : result;
	    }

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object for all destination properties that resolve to `undefined`. Once a
	     * property is set, additional defaults of the same property will be ignored.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param- {Object} [guard] Allows working with `_.reduce` without using its
	     *  `key` and `object` arguments as sources.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var object = { 'name': 'barney' };
	     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var defaults = createIterator(defaultsIteratorOptions);

	    /**
	     * This method is like `_.findIndex` except that it returns the key of the
	     * first element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': false },
	     *   'fred': {    'age': 40, 'blocked': true },
	     *   'pebbles': { 'age': 1,  'blocked': false }
	     * };
	     *
	     * _.findKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => 'barney' (property order is not guaranteed across environments)
	     *
	     * // using "_.where" callback shorthand
	     * _.findKey(characters, { 'age': 1 });
	     * // => 'pebbles'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findKey(characters, 'blocked');
	     * // => 'fred'
	     */
	    function findKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwn(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * This method is like `_.findKey` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': true },
	     *   'fred': {    'age': 40, 'blocked': false },
	     *   'pebbles': { 'age': 1,  'blocked': true }
	     * };
	     *
	     * _.findLastKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastKey(characters, { 'age': 40 });
	     * // => 'fred'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastKey(characters, 'blocked');
	     * // => 'pebbles'
	     */
	    function findLastKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwnRight(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over own and inherited enumerable properties of an object,
	     * executing the callback for each property. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, key, object). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forIn(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
	     */
	    var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
	      'useHas': false
	    });

	    /**
	     * This method is like `_.forIn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forInRight(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
	     */
	    function forInRight(object, callback, thisArg) {
	      var pairs = [];

	      forIn(object, function(value, key) {
	        pairs.push(key, value);
	      });

	      var length = pairs.length;
	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(pairs[length--], pairs[length], object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Iterates over own enumerable properties of an object, executing the callback
	     * for each property. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, key, object). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
	     */
	    var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

	    /**
	     * This method is like `_.forOwn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
	     */
	    function forOwnRight(object, callback, thisArg) {
	      var props = keys(object),
	          length = props.length;

	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        var key = props[length];
	        if (callback(object[key], key, object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Creates a sorted array of property names of all enumerable properties,
	     * own and inherited, of `object` that have function values.
	     *
	     * @static
	     * @memberOf _
	     * @alias methods
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names that have function values.
	     * @example
	     *
	     * _.functions(_);
	     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
	     */
	    function functions(object) {
	      var result = [];
	      forIn(object, function(value, key) {
	        if (isFunction(value)) {
	          result.push(key);
	        }
	      });
	      return result.sort();
	    }

	    /**
	     * Checks if the specified property name exists as a direct property of `object`,
	     * instead of an inherited property.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to check.
	     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
	     * @example
	     *
	     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
	     * // => true
	     */
	    function has(object, key) {
	      return object ? hasOwnProperty.call(object, key) : false;
	    }

	    /**
	     * Creates an object composed of the inverted keys and values of the given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to invert.
	     * @returns {Object} Returns the created inverted object.
	     * @example
	     *
	     * _.invert({ 'first': 'fred', 'second': 'barney' });
	     * // => { 'fred': 'first', 'barney': 'second' }
	     */
	    function invert(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = {};

	      while (++index < length) {
	        var key = props[index];
	        result[object[key]] = key;
	      }
	      return result;
	    }

	    /**
	     * Checks if `value` is a boolean value.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
	     * @example
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false ||
	        value && typeof value == 'object' && toString.call(value) == boolClass || false;
	    }

	    /**
	     * Checks if `value` is a date.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     */
	    function isDate(value) {
	      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
	    }

	    /**
	     * Checks if `value` is a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     */
	    function isElement(value) {
	      return value && value.nodeType === 1 || false;
	    }

	    /**
	     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
	     * length of `0` and objects with no own enumerable properties are considered
	     * "empty".
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({});
	     * // => true
	     *
	     * _.isEmpty('');
	     * // => true
	     */
	    function isEmpty(value) {
	      var result = true;
	      if (!value) {
	        return result;
	      }
	      var className = toString.call(value),
	          length = value.length;

	      if ((className == arrayClass || className == stringClass ||
	          (support.argsClass ? className == argsClass : isArguments(value))) ||
	          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
	        return !length;
	      }
	      forOwn(value, function() {
	        return (result = false);
	      });
	      return result;
	    }

	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent to each other. If a callback is provided it will be executed
	     * to compare values. If the callback returns `undefined` comparisons will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (a, b).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var copy = { 'name': 'fred' };
	     *
	     * object == copy;
	     * // => false
	     *
	     * _.isEqual(object, copy);
	     * // => true
	     *
	     * var words = ['hello', 'goodbye'];
	     * var otherWords = ['hi', 'goodbye'];
	     *
	     * _.isEqual(words, otherWords, function(a, b) {
	     *   var reGreet = /^(?:hello|hi)$/i,
	     *       aGreet = _.isString(a) && reGreet.test(a),
	     *       bGreet = _.isString(b) && reGreet.test(b);
	     *
	     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
	     * });
	     * // => true
	     */
	    function isEqual(a, b, callback, thisArg) {
	      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
	    }

	    /**
	     * Checks if `value` is, or can be coerced to, a finite number.
	     *
	     * Note: This is not the same as native `isFinite` which will return true for
	     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
	     * @example
	     *
	     * _.isFinite(-101);
	     * // => true
	     *
	     * _.isFinite('10');
	     * // => true
	     *
	     * _.isFinite(true);
	     * // => false
	     *
	     * _.isFinite('');
	     * // => false
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
	    }

	    /**
	     * Checks if `value` is a function.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     */
	    function isFunction(value) {
	      return typeof value == 'function';
	    }
	    // fallback for older versions of Chrome and Safari
	    if (isFunction(/x/)) {
	      isFunction = function(value) {
	        return typeof value == 'function' && toString.call(value) == funcClass;
	      };
	    }

	    /**
	     * Checks if `value` is the language type of Object.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(1);
	     * // => false
	     */
	    function isObject(value) {
	      // check if the value is the ECMAScript language type of Object
	      // http://es5.github.io/#x8
	      // and avoid a V8 bug
	      // http://code.google.com/p/v8/issues/detail?id=2291
	      return !!(value && objectTypes[typeof value]);
	    }

	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * Note: This is not the same as native `isNaN` which will return `true` for
	     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // `NaN` as a primitive is the only value that is not equal to itself
	      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
	      return isNumber(value) && value != +value;
	    }

	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(undefined);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }

	    /**
	     * Checks if `value` is a number.
	     *
	     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
	     * @example
	     *
	     * _.isNumber(8.4 * 5);
	     * // => true
	     */
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        value && typeof value == 'object' && toString.call(value) == numberClass || false;
	    }

	    /**
	     * Checks if `value` is an object created by the `Object` constructor.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * _.isPlainObject(new Shape);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     */
	    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	      if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
	        return false;
	      }
	      var valueOf = value.valueOf,
	          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	      return objProto
	        ? (value == objProto || getPrototypeOf(value) == objProto)
	        : shimIsPlainObject(value);
	    };

	    /**
	     * Checks if `value` is a regular expression.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
	     * @example
	     *
	     * _.isRegExp(/fred/);
	     * // => true
	     */
	    function isRegExp(value) {
	      return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
	    }

	    /**
	     * Checks if `value` is a string.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
	     * @example
	     *
	     * _.isString('fred');
	     * // => true
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        value && typeof value == 'object' && toString.call(value) == stringClass || false;
	    }

	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     */
	    function isUndefined(value) {
	      return typeof value == 'undefined';
	    }

	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
	     * @example
	     *
	     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     *
	     * var characters = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.mapValues(characters, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 }
	     */
	    function mapValues(object, callback, thisArg) {
	      var result = {};
	      callback = lodash.createCallback(callback, thisArg, 3);

	      forOwn(object, function(value, key, object) {
	        result[key] = callback(value, key, object);
	      });
	      return result;
	    }

	    /**
	     * Recursively merges own enumerable properties of the source object(s), that
	     * don't resolve to `undefined` into the destination object. Subsequent sources
	     * will overwrite property assignments of previous sources. If a callback is
	     * provided it will be executed to produce the merged values of the destination
	     * and source properties. If the callback returns `undefined` merging will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var names = {
	     *   'characters': [
	     *     { 'name': 'barney' },
	     *     { 'name': 'fred' }
	     *   ]
	     * };
	     *
	     * var ages = {
	     *   'characters': [
	     *     { 'age': 36 },
	     *     { 'age': 40 }
	     *   ]
	     * };
	     *
	     * _.merge(names, ages);
	     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
	     *
	     * var food = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var otherFood = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.merge(food, otherFood, function(a, b) {
	     *   return _.isArray(a) ? a.concat(b) : undefined;
	     * });
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
	     */
	    function merge(object) {
	      var args = arguments,
	          length = 2;

	      if (!isObject(object)) {
	        return object;
	      }
	      // allows working with `_.reduce` and `_.reduceRight` without using
	      // their `index` and `collection` arguments
	      if (typeof args[2] != 'number') {
	        length = args.length;
	      }
	      if (length > 3 && typeof args[length - 2] == 'function') {
	        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
	      } else if (length > 2 && typeof args[length - 1] == 'function') {
	        callback = args[--length];
	      }
	      var sources = slice(arguments, 1, length),
	          index = -1,
	          stackA = getArray(),
	          stackB = getArray();

	      while (++index < length) {
	        baseMerge(object, sources[index], callback, stackA, stackB);
	      }
	      releaseArray(stackA);
	      releaseArray(stackB);
	      return object;
	    }

	    /**
	     * Creates a shallow clone of `object` excluding the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` omitting the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The properties to omit or the
	     *  function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object without the omitted properties.
	     * @example
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
	     * // => { 'name': 'fred' }
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
	     *   return typeof value == 'number';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function omit(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var props = [];
	        forIn(object, function(value, key) {
	          props.push(key);
	        });
	        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

	        var index = -1,
	            length = props.length;

	        while (++index < length) {
	          var key = props[index];
	          result[key] = object[key];
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (!callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates a two dimensional array of an object's key-value pairs,
	     * i.e. `[[key1, value1], [key2, value2]]`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns new array of key-value pairs.
	     * @example
	     *
	     * _.pairs({ 'barney': 36, 'fred': 40 });
	     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
	     */
	    function pairs(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        var key = props[index];
	        result[index] = [key, object[key]];
	      }
	      return result;
	    }

	    /**
	     * Creates a shallow clone of `object` composed of the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` picking the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The function called per
	     *  iteration or property names to pick, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object composed of the picked properties.
	     * @example
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
	     * // => { 'name': 'fred' }
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
	     *   return key.charAt(0) != '_';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function pick(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var index = -1,
	            props = baseFlatten(arguments, true, false, 1),
	            length = isObject(object) ? props.length : 0;

	        while (++index < length) {
	          var key = props[index];
	          if (key in object) {
	            result[key] = object[key];
	          }
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * An alternative to `_.reduce` this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own
	     * enumerable properties through a callback, with each callback execution
	     * potentially mutating the `accumulator` object. The callback is bound to
	     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
	     * Callbacks may exit iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
	     *   num *= num;
	     *   if (num % 2) {
	     *     return result.push(num) < 3;
	     *   }
	     * });
	     * // => [1, 9, 25]
	     *
	     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     * });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function transform(object, callback, accumulator, thisArg) {
	      var isArr = isArray(object);
	      if (accumulator == null) {
	        if (isArr) {
	          accumulator = [];
	        } else {
	          var ctor = object && object.constructor,
	              proto = ctor && ctor.prototype;

	          accumulator = baseCreate(proto);
	        }
	      }
	      if (callback) {
	        callback = lodash.createCallback(callback, thisArg, 4);
	        (isArr ? baseEach : forOwn)(object, function(value, index, object) {
	          return callback(accumulator, value, index, object);
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * Creates an array composed of the own enumerable property values of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property values.
	     * @example
	     *
	     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => [1, 2, 3] (property order is not guaranteed across environments)
	     */
	    function values(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = object[props[index]];
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array of elements from the specified indexes, or keys, of the
	     * `collection`. Indexes may be specified as individual arguments or as arrays
	     * of indexes.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
	     *   to retrieve, specified as individual indexes or arrays of indexes.
	     * @returns {Array} Returns a new array of elements corresponding to the
	     *  provided indexes.
	     * @example
	     *
	     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
	     * // => ['a', 'c', 'e']
	     *
	     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
	     * // => ['fred', 'pebbles']
	     */
	    function at(collection) {
	      var args = arguments,
	          index = -1,
	          props = baseFlatten(args, true, false, 1),
	          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
	          result = Array(length);

	      if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      while(++index < length) {
	        result[index] = collection[props[index]];
	      }
	      return result;
	    }

	    /**
	     * Checks if a given value is present in a collection using strict equality
	     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
	     * offset from the end of the collection.
	     *
	     * @static
	     * @memberOf _
	     * @alias include
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {*} target The value to check for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
	     * @example
	     *
	     * _.contains([1, 2, 3], 1);
	     * // => true
	     *
	     * _.contains([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.contains('pebbles', 'eb');
	     * // => true
	     */
	    function contains(collection, target, fromIndex) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = collection ? collection.length : 0,
	          result = false;

	      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
	      if (isArray(collection)) {
	        result = indexOf(collection, target, fromIndex) > -1;
	      } else if (typeof length == 'number') {
	        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
	      } else {
	        baseEach(collection, function(value) {
	          if (++index >= fromIndex) {
	            return !(result = value === target);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through the callback. The corresponding value
	     * of each key is the number of times the key was returned by the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
	    });

	    /**
	     * Checks if the given callback returns truey value for **all** elements of
	     * a collection. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias all
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if all elements passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes']);
	     * // => false
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.every(characters, 'age');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.every(characters, { 'age': 36 });
	     * // => false
	     */
	    function every(collection, callback, thisArg) {
	      var result = true;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (!(result = !!callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return (result = !!callback(value, index, collection));
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning an array of all elements
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias select
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that passed the callback check.
	     * @example
	     *
	     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [2, 4, 6]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.filter(characters, 'blocked');
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     *
	     * // using "_.where" callback shorthand
	     * _.filter(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     */
	    function filter(collection, callback, thisArg) {
	      var result = [];
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning the first element that
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias detect, findWhere
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.find(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
	     *
	     * // using "_.where" callback shorthand
	     * _.find(characters, { 'age': 1 });
	     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.find(characters, 'blocked');
	     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
	     */
	    function find(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            return value;
	          }
	        }
	      } else {
	        var result;
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result = value;
	            return false;
	          }
	        });
	        return result;
	      }
	    }

	    /**
	     * This method is like `_.find` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(num) {
	     *   return num % 2 == 1;
	     * });
	     * // => 3
	     */
	    function findLast(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forEachRight(collection, function(value, index, collection) {
	        if (callback(value, index, collection)) {
	          result = value;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, executing the callback for each
	     * element. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * Note: As with other "Collections" methods, objects with a `length` property
	     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	     * may be used for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
	     * // => logs each number and returns '1,2,3'
	     *
	     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
	     * // => logs each number and returns the object (property order is not guaranteed across environments)
	     */
	    function forEach(collection, callback, thisArg) {
	      if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (callback(collection[index], index, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, callback, thisArg);
	      }
	      return collection;
	    }

	    /**
	     * This method is like `_.forEach` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
	     * // => logs each number from right to left and returns '3,2,1'
	     */
	    function forEachRight(collection, callback, thisArg) {
	      var iterable = collection,
	          length = collection ? collection.length : 0;

	      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (length--) {
	          if (callback(collection[length], length, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        if (typeof length != 'number') {
	          var props = keys(collection);
	          length = props.length;
	        } else if (support.unindexedChars && isString(collection)) {
	          iterable = collection.split('');
	        }
	        baseEach(collection, function(value, key, collection) {
	          key = props ? props[--length] : --length;
	          return callback(iterable[key], key, collection);
	        });
	      }
	      return collection;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of a collection through the callback. The corresponding value
	     * of each key is an array of the elements responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
	    });

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of the collection through the given callback. The corresponding
	     * value of each key is the last element responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var keys = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.indexBy(keys, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     */
	    var indexBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });

	    /**
	     * Invokes the method named by `methodName` on each element in the `collection`
	     * returning an array of the results of each invoked method. Additional arguments
	     * will be provided to each invoked method. If `methodName` is a function it
	     * will be invoked for, and `this` bound to, each element in the `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|string} methodName The name of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [arg] Arguments to invoke the method with.
	     * @returns {Array} Returns a new array of the results of each invoked method.
	     * @example
	     *
	     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invoke([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    function invoke(collection, methodName) {
	      var args = slice(arguments, 2),
	          index = -1,
	          isFunc = typeof methodName == 'function',
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
	      });
	      return result;
	    }

	    /**
	     * Creates an array of values by running each element in the collection
	     * through the callback. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias collect
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of the results of each `callback` execution.
	     * @example
	     *
	     * _.map([1, 2, 3], function(num) { return num * 3; });
	     * // => [3, 6, 9]
	     *
	     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
	     * // => [3, 6, 9] (property order is not guaranteed across environments)
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, callback, thisArg) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      callback = lodash.createCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (++index < length) {
	          result[index] = callback(collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, key, collection) {
	          result[++index] = callback(value, key, collection);
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the maximum value of a collection. If the collection is empty or
	     * falsey `-Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.max(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'fred', 'age': 40 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.max(characters, 'age');
	     * // => { 'name': 'fred', 'age': 40 };
	     */
	    function max(collection, callback, thisArg) {
	      var computed = -Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value > result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current > computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the minimum value of a collection. If the collection is empty or
	     * falsey `Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.min(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'barney', 'age': 36 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.min(characters, 'age');
	     * // => { 'name': 'barney', 'age': 36 };
	     */
	    function min(collection, callback, thisArg) {
	      var computed = Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value < result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current < computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the value of a specified property from all elements in the collection.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string} property The name of the property to pluck.
	     * @returns {Array} Returns a new array of property values.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.pluck(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    var pluck = map;

	    /**
	     * Reduces a collection to a value which is the accumulated result of running
	     * each element in the collection through the callback, where each successive
	     * callback execution consumes the return value of the previous execution. If
	     * `accumulator` is not provided the first element of the collection will be
	     * used as the initial `accumulator` value. The callback is bound to `thisArg`
	     * and invoked with four arguments; (accumulator, value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @alias foldl, inject
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var sum = _.reduce([1, 2, 3], function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     *   return result;
	     * }, {});
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function reduce(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        if (noaccum) {
	          accumulator = collection[++index];
	        }
	        while (++index < length) {
	          accumulator = callback(accumulator, collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          accumulator = noaccum
	            ? (noaccum = false, value)
	            : callback(accumulator, value, index, collection)
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * This method is like `_.reduce` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias foldr
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var list = [[0, 1], [2, 3], [4, 5]];
	     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    function reduceRight(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);
	      forEachRight(collection, function(value, index, collection) {
	        accumulator = noaccum
	          ? (noaccum = false, value)
	          : callback(accumulator, value, index, collection);
	      });
	      return accumulator;
	    }

	    /**
	     * The opposite of `_.filter` this method returns the elements of a
	     * collection that the callback does **not** return truey for.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that failed the callback check.
	     * @example
	     *
	     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [1, 3, 5]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.reject(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     *
	     * // using "_.where" callback shorthand
	     * _.reject(characters, { 'age': 36 });
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     */
	    function reject(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);
	      return filter(collection, function(value, index, collection) {
	        return !callback(value, index, collection);
	      });
	    }

	    /**
	     * Retrieves a random element or `n` random elements from a collection.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to sample.
	     * @param {number} [n] The number of elements to sample.
	     * @param- {Object} [guard] Allows working with functions like `_.map`
	     *  without using their `index` arguments as `n`.
	     * @returns {Array} Returns the random sample(s) of `collection`.
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     *
	     * _.sample([1, 2, 3, 4], 2);
	     * // => [3, 1]
	     */
	    function sample(collection, n, guard) {
	      if (collection && typeof collection.length != 'number') {
	        collection = values(collection);
	      } else if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      if (n == null || guard) {
	        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
	      }
	      var result = shuffle(collection);
	      result.length = nativeMin(nativeMax(0, n), result.length);
	      return result;
	    }

	    /**
	     * Creates an array of shuffled values, using a version of the Fisher-Yates
	     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to shuffle.
	     * @returns {Array} Returns a new shuffled collection.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4, 5, 6]);
	     * // => [4, 1, 6, 3, 5, 2]
	     */
	    function shuffle(collection) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        var rand = baseRandom(0, ++index);
	        result[index] = result[rand];
	        result[rand] = value;
	      });
	      return result;
	    }

	    /**
	     * Gets the size of the `collection` by returning `collection.length` for arrays
	     * and array-like objects or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to inspect.
	     * @returns {number} Returns `collection.length` or number of own enumerable properties.
	     * @example
	     *
	     * _.size([1, 2]);
	     * // => 2
	     *
	     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => 3
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      var length = collection ? collection.length : 0;
	      return typeof length == 'number' ? length : keys(collection).length;
	    }

	    /**
	     * Checks if the callback returns a truey value for **any** element of a
	     * collection. The function returns as soon as it finds a passing value and
	     * does not iterate over the entire collection. The callback is bound to
	     * `thisArg` and invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias any
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if any element passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.some(characters, 'blocked');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.some(characters, { 'age': 1 });
	     * // => false
	     */
	    function some(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if ((result = callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return !(result = callback(value, index, collection));
	        });
	      }
	      return !!result;
	    }

	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through the callback. This method
	     * performs a stable sort, that is, it will preserve the original sort order
	     * of equal elements. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an array of property names is provided for `callback` the collection
	     * will be sorted by each property value.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of sorted elements.
	     * @example
	     *
	     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
	     * // => [3, 1, 2]
	     *
	     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
	     * // => [3, 1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'barney',  'age': 26 },
	     *   { 'name': 'fred',    'age': 30 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(_.sortBy(characters, 'age'), _.values);
	     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
	     *
	     * // sorting by multiple properties
	     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
	     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
	     */
	    function sortBy(collection, callback, thisArg) {
	      var index = -1,
	          isArr = isArray(callback),
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      if (!isArr) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      forEach(collection, function(value, key, collection) {
	        var object = result[++index] = getObject();
	        if (isArr) {
	          object.criteria = map(callback, function(key) { return value[key]; });
	        } else {
	          (object.criteria = getArray())[0] = callback(value, key, collection);
	        }
	        object.index = index;
	        object.value = value;
	      });

	      length = result.length;
	      result.sort(compareAscending);
	      while (length--) {
	        var object = result[length];
	        result[length] = object.value;
	        if (!isArr) {
	          releaseArray(object.criteria);
	        }
	        releaseObject(object);
	      }
	      return result;
	    }

	    /**
	     * Converts the `collection` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to convert.
	     * @returns {Array} Returns the new converted array.
	     * @example
	     *
	     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
	     * // => [2, 3, 4]
	     */
	    function toArray(collection) {
	      if (collection && typeof collection.length == 'number') {
	        return (support.unindexedChars && isString(collection))
	          ? collection.split('')
	          : slice(collection);
	      }
	      return values(collection);
	    }

	    /**
	     * Performs a deep comparison of each element in a `collection` to the given
	     * `properties` object, returning an array of all elements that have equivalent
	     * property values.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Object} props The object of property values to filter by.
	     * @returns {Array} Returns a new array of elements that have the given properties.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * _.where(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
	     *
	     * _.where(characters, { 'pets': ['dino'] });
	     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
	     */
	    var where = filter;

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are all falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an array excluding all values of the provided arrays using strict
	     * equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {...Array} [values] The arrays of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
	     * // => [1, 3, 4]
	     */
	    function difference(array) {
	      return baseDifference(array, baseFlatten(arguments, true, true, 1));
	    }

	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.findIndex(characters, function(chr) {
	     *   return chr.age < 20;
	     * });
	     * // => 2
	     *
	     * // using "_.where" callback shorthand
	     * _.findIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findIndex(characters, 'blocked');
	     * // => 1
	     */
	    function findIndex(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0;

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        if (callback(array[index], index, array)) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': true },
	     *   { 'name': 'fred',    'age': 40, 'blocked': false },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
	     * ];
	     *
	     * _.findLastIndex(characters, function(chr) {
	     *   return chr.age > 30;
	     * });
	     * // => 1
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastIndex(characters, 'blocked');
	     * // => 2
	     */
	    function findLastIndex(array, callback, thisArg) {
	      var length = array ? array.length : 0;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(array[length], length, array)) {
	          return length;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Gets the first element or first `n` elements of an array. If a callback
	     * is provided elements at the beginning of the array are returned as long
	     * as the callback returns truey. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias head, take
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the first element(s) of `array`.
	     * @example
	     *
	     * _.first([1, 2, 3]);
	     * // => 1
	     *
	     * _.first([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.first([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.first(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function first(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = -1;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[0] : undefined;
	        }
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, n), length));
	    }

	    /**
	     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
	     * is truey, the array will only be flattened a single level. If a callback
	     * is provided each element of the array is passed through the callback before
	     * flattening. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2], [3, [[4]]]]);
	     * // => [1, 2, 3, 4];
	     *
	     * _.flatten([1, [2], [3, [[4]]]], true);
	     * // => [1, 2, 3, [[4]]];
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.flatten(characters, 'pets');
	     * // => ['hoppy', 'baby puss', 'dino']
	     */
	    function flatten(array, isShallow, callback, thisArg) {
	      // juggle arguments
	      if (typeof isShallow != 'boolean' && isShallow != null) {
	        thisArg = callback;
	        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
	        isShallow = false;
	      }
	      if (callback != null) {
	        array = map(array, callback, thisArg);
	      }
	      return baseFlatten(array, isShallow);
	    }

	    /**
	     * Gets the index at which the first occurrence of `value` is found using
	     * strict equality for comparisons, i.e. `===`. If the array is already sorted
	     * providing `true` for `fromIndex` will run a faster binary search.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	     *  to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 1
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 4
	     *
	     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
	     * // => 2
	     */
	    function indexOf(array, value, fromIndex) {
	      if (typeof fromIndex == 'number') {
	        var length = array ? array.length : 0;
	        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
	      } else if (fromIndex) {
	        var index = sortedIndex(array, value);
	        return array[index] === value ? index : -1;
	      }
	      return baseIndexOf(array, value, fromIndex);
	    }

	    /**
	     * Gets all but the last element or last `n` elements of an array. If a
	     * callback is provided elements at the end of the array are excluded from
	     * the result as long as the callback returns truey. The callback is bound
	     * to `thisArg` and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.initial([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.initial([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [1]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.initial(characters, 'blocked');
	     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function initial(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : callback || n;
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
	    }

	    /**
	     * Creates an array of unique values present in all provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of shared values.
	     * @example
	     *
	     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2]
	     */
	    function intersection() {
	      var args = [],
	          argsIndex = -1,
	          argsLength = arguments.length,
	          caches = getArray(),
	          indexOf = getIndexOf(),
	          trustIndexOf = indexOf === baseIndexOf,
	          seen = getArray();

	      while (++argsIndex < argsLength) {
	        var value = arguments[argsIndex];
	        if (isArray(value) || isArguments(value)) {
	          args.push(value);
	          caches.push(trustIndexOf && value.length >= largeArraySize &&
	            createCache(argsIndex ? args[argsIndex] : seen));
	        }
	      }
	      var array = args[0],
	          index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      outer:
	      while (++index < length) {
	        var cache = caches[0];
	        value = array[index];

	        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
	          argsIndex = argsLength;
	          (cache || seen).push(value);
	          while (--argsIndex) {
	            cache = caches[argsIndex];
	            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	      }
	      while (argsLength--) {
	        cache = caches[argsLength];
	        if (cache) {
	          releaseObject(cache);
	        }
	      }
	      releaseArray(caches);
	      releaseArray(seen);
	      return result;
	    }

	    /**
	     * Gets the last element or last `n` elements of an array. If a callback is
	     * provided elements at the end of the array are returned as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the last element(s) of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     *
	     * _.last([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.last([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [2, 3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.last(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.last(characters, { 'employer': 'na' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function last(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[length - 1] : undefined;
	        }
	      }
	      return slice(array, nativeMax(0, length - n));
	    }

	    /**
	     * Gets the index at which the last occurrence of `value` is found using strict
	     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
	     * as the offset from the end of the collection.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=array.length-1] The index to search from.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 4
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 1
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var index = array ? array.length : 0;
	      if (typeof fromIndex == 'number') {
	        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Removes all provided values from the given array using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {...*} [value] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pull(array) {
	      var args = arguments,
	          argsIndex = 0,
	          argsLength = args.length,
	          length = array ? array.length : 0;

	      while (++argsIndex < argsLength) {
	        var index = -1,
	            value = args[argsIndex];
	        while (++index < length) {
	          if (array[index] === value) {
	            splice.call(array, index--, 1);
	            length--;
	          }
	        }
	      }
	      return array;
	    }

	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to but not including `end`. If `start` is less than `stop` a
	     * zero-length range is created unless a negative `step` is specified.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns a new range array.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    function range(start, end, step) {
	      start = +start || 0;
	      step = typeof step == 'number' ? step : (+step || 1);

	      if (end == null) {
	        end = start;
	        start = 0;
	      }
	      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
	      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
	      var index = -1,
	          length = nativeMax(0, ceil((end - start) / (step || 1))),
	          result = Array(length);

	      while (++index < length) {
	        result[index] = start;
	        start += step;
	      }
	      return result;
	    }

	    /**
	     * Removes all elements from an array that the callback returns truey for
	     * and returns an array of removed elements. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4, 5, 6];
	     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
	     *
	     * console.log(array);
	     * // => [1, 3, 5]
	     *
	     * console.log(evens);
	     * // => [2, 4, 6]
	     */
	    function remove(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (callback(value, index, array)) {
	          result.push(value);
	          splice.call(array, index--, 1);
	          length--;
	        }
	      }
	      return result;
	    }

	    /**
	     * The opposite of `_.initial` this method gets all but the first element or
	     * first `n` elements of an array. If a callback function is provided elements
	     * at the beginning of the array are excluded from the result as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias drop, tail
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.rest([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.rest([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.rest([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.rest(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.rest(characters, { 'employer': 'slate' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function rest(array, callback, thisArg) {
	      if (typeof callback != 'number' && callback != null) {
	        var n = 0,
	            index = -1,
	            length = array ? array.length : 0;

	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
	      }
	      return slice(array, n);
	    }

	    /**
	     * Uses a binary search to determine the smallest index at which a value
	     * should be inserted into a given sorted array in order to maintain the sort
	     * order of the array. If a callback is provided it will be executed for
	     * `value` and each element of `array` to compute their sort ranking. The
	     * callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedIndex([20, 30, 50], 40);
	     * // => 2
	     *
	     * // using "_.pluck" callback shorthand
	     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	     * // => 2
	     *
	     * var dict = {
	     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
	     * };
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return dict.wordToNumber[word];
	     * });
	     * // => 2
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return this.wordToNumber[word];
	     * }, dict);
	     * // => 2
	     */
	    function sortedIndex(array, value, callback, thisArg) {
	      var low = 0,
	          high = array ? array.length : low;

	      // explicitly reference `identity` for better inlining in Firefox
	      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
	      value = callback(value);

	      while (low < high) {
	        var mid = (low + high) >>> 1;
	        (callback(array[mid]) < value)
	          ? low = mid + 1
	          : high = mid;
	      }
	      return low;
	    }

	    /**
	     * Creates an array of unique values, in order, of the provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of combined values.
	     * @example
	     *
	     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2, 3, 5, 4]
	     */
	    function union() {
	      return baseUniq(baseFlatten(arguments, true, true));
	    }

	    /**
	     * Creates a duplicate-value-free version of an array using strict equality
	     * for comparisons, i.e. `===`. If the array is sorted, providing
	     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
	     * each element of `array` is passed through the callback before uniqueness
	     * is computed. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias unique
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a duplicate-value-free array.
	     * @example
	     *
	     * _.uniq([1, 2, 1, 3, 1]);
	     * // => [1, 2, 3]
	     *
	     * _.uniq([1, 1, 2, 2, 3], true);
	     * // => [1, 2, 3]
	     *
	     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
	     * // => ['A', 'b', 'C']
	     *
	     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
	     * // => [1, 2.5, 3]
	     *
	     * // using "_.pluck" callback shorthand
	     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniq(array, isSorted, callback, thisArg) {
	      // juggle arguments
	      if (typeof isSorted != 'boolean' && isSorted != null) {
	        thisArg = callback;
	        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
	        isSorted = false;
	      }
	      if (callback != null) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      return baseUniq(array, isSorted, callback);
	    }

	    /**
	     * Creates an array excluding all provided values using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to filter.
	     * @param {...*} [value] The values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
	     * // => [2, 3, 4]
	     */
	    function without(array) {
	      return baseDifference(array, slice(arguments, 1));
	    }

	    /**
	     * Creates an array that is the symmetric difference of the provided arrays.
	     * See http://en.wikipedia.org/wiki/Symmetric_difference.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of values.
	     * @example
	     *
	     * _.xor([1, 2, 3], [5, 2, 1, 4]);
	     * // => [3, 5, 4]
	     *
	     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
	     * // => [1, 4, 5]
	     */
	    function xor() {
	      var index = -1,
	          length = arguments.length;

	      while (++index < length) {
	        var array = arguments[index];
	        if (isArray(array) || isArguments(array)) {
	          var result = result
	            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
	            : array;
	        }
	      }
	      return result || [];
	    }

	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second
	     * elements of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @alias unzip
	     * @category Arrays
	     * @param {...Array} [array] Arrays to process.
	     * @returns {Array} Returns a new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    function zip() {
	      var array = arguments.length > 1 ? arguments : arguments[0],
	          index = -1,
	          length = array ? max(pluck(array, 'length')) : 0,
	          result = Array(length < 0 ? 0 : length);

	      while (++index < length) {
	        result[index] = pluck(array, index);
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed from arrays of `keys` and `values`. Provide
	     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
	     * or two arrays, one of `keys` and one of corresponding `values`.
	     *
	     * @static
	     * @memberOf _
	     * @alias object
	     * @category Arrays
	     * @param {Array} keys The array of keys.
	     * @param {Array} [values=[]] The array of values.
	     * @returns {Object} Returns an object composed of the given keys and
	     *  corresponding values.
	     * @example
	     *
	     * _.zipObject(['fred', 'barney'], [30, 40]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function zipObject(keys, values) {
	      var index = -1,
	          length = keys ? keys.length : 0,
	          result = {};

	      if (!values && length && !isArray(keys[0])) {
	        values = [];
	      }
	      while (++index < length) {
	        var key = keys[index];
	        if (values) {
	          result[key] = values[index];
	        } else if (key) {
	          result[key[0]] = key[1];
	        }
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that executes `func`, with  the `this` binding and
	     * arguments of the created function, only after being called `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {number} n The number of times the function must be called before
	     *  `func` is executed.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('Done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'Done saving!', after all saves have completed
	     */
	    function after(n, func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with the `this`
	     * binding of `thisArg` and prepends any additional `bind` arguments to those
	     * provided to the bound function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to bind.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var func = function(greeting) {
	     *   return greeting + ' ' + this.name;
	     * };
	     *
	     * func = _.bind(func, { 'name': 'fred' }, 'hi');
	     * func();
	     * // => 'hi fred'
	     */
	    function bind(func, thisArg) {
	      return arguments.length > 2
	        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
	        : createWrapper(func, 1, null, null, thisArg);
	    }

	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method. Method names may be specified as individual arguments or as arrays
	     * of method names. If no method names are provided all the function properties
	     * of `object` will be bound.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...string} [methodName] The object method names to
	     *  bind, specified as individual method names or arrays of method names.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() { console.log('clicked ' + this.label); }
	     * };
	     *
	     * _.bindAll(view);
	     * jQuery('#docs').on('click', view.onClick);
	     * // => logs 'clicked docs', when the button is clicked
	     */
	    function bindAll(object) {
	      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
	          index = -1,
	          length = funcs.length;

	      while (++index < length) {
	        var key = funcs[index];
	        object[key] = createWrapper(object[key], 1, null, null, object);
	      }
	      return object;
	    }

	    /**
	     * Creates a function that, when called, invokes the method at `object[key]`
	     * and prepends any additional `bindKey` arguments to those provided to the bound
	     * function. This method differs from `_.bind` by allowing bound functions to
	     * reference methods that will be redefined or don't yet exist.
	     * See http://michaux.ca/articles/lazy-function-definition-pattern.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object the method belongs to.
	     * @param {string} key The key of the method.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'name': 'fred',
	     *   'greet': function(greeting) {
	     *     return greeting + ' ' + this.name;
	     *   }
	     * };
	     *
	     * var func = _.bindKey(object, 'greet', 'hi');
	     * func();
	     * // => 'hi fred'
	     *
	     * object.greet = function(greeting) {
	     *   return greeting + 'ya ' + this.name + '!';
	     * };
	     *
	     * func();
	     * // => 'hiya fred!'
	     */
	    function bindKey(object, key) {
	      return arguments.length > 2
	        ? createWrapper(key, 19, slice(arguments, 2), null, object)
	        : createWrapper(key, 3, null, null, object);
	    }

	    /**
	     * Creates a function that is the composition of the provided functions,
	     * where each function consumes the return value of the function that follows.
	     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {...Function} [func] Functions to compose.
	     * @returns {Function} Returns the new composed function.
	     * @example
	     *
	     * var realNameMap = {
	     *   'pebbles': 'penelope'
	     * };
	     *
	     * var format = function(name) {
	     *   name = realNameMap[name.toLowerCase()] || name;
	     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	     * };
	     *
	     * var greet = function(formatted) {
	     *   return 'Hiya ' + formatted + '!';
	     * };
	     *
	     * var welcome = _.compose(greet, format);
	     * welcome('pebbles');
	     * // => 'Hiya Penelope!'
	     */
	    function compose() {
	      var funcs = arguments,
	          length = funcs.length;

	      while (length--) {
	        if (!isFunction(funcs[length])) {
	          throw new TypeError;
	        }
	      }
	      return function() {
	        var args = arguments,
	            length = funcs.length;

	        while (length--) {
	          args = [funcs[length].apply(this, args)];
	        }
	        return args[0];
	      };
	    }

	    /**
	     * Creates a function which accepts one or more arguments of `func` that when
	     * invoked either executes `func` returning its result, if all `func` arguments
	     * have been provided, or returns a function that accepts one or more of the
	     * remaining `func` arguments, and so on. The arity of `func` can be specified
	     * if `func.length` is not sufficient.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var curried = _.curry(function(a, b, c) {
	     *   console.log(a + b + c);
	     * });
	     *
	     * curried(1)(2)(3);
	     * // => 6
	     *
	     * curried(1, 2)(3);
	     * // => 6
	     *
	     * curried(1, 2, 3);
	     * // => 6
	     */
	    function curry(func, arity) {
	      arity = typeof arity == 'number' ? arity : (+arity || func.length);
	      return createWrapper(func, 4, null, null, null, arity);
	    }

	    /**
	     * Creates a function that will delay the execution of `func` until after
	     * `wait` milliseconds have elapsed since the last time it was invoked.
	     * Provide an options object to indicate that `func` should be invoked on
	     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
	     * to the debounced function will return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to debounce.
	     * @param {number} wait The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * var lazyLayout = _.debounce(calculateLayout, 150);
	     * jQuery(window).on('resize', lazyLayout);
	     *
	     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
	     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * });
	     *
	     * // ensure `batchLog` is executed once after 1 second of debounced calls
	     * var source = new EventSource('/stream');
	     * source.addEventListener('message', _.debounce(batchLog, 250, {
	     *   'maxWait': 1000
	     * }, false);
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          maxWait = false,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      wait = nativeMax(0, wait) || 0;
	      if (options === true) {
	        var leading = true;
	        trailing = false;
	      } else if (isObject(options)) {
	        leading = options.leading;
	        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      var delayed = function() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0) {
	          if (maxTimeoutId) {
	            clearTimeout(maxTimeoutId);
	          }
	          var isCalled = trailingCall;
	          maxTimeoutId = timeoutId = trailingCall = undefined;
	          if (isCalled) {
	            lastCalled = now();
	            result = func.apply(thisArg, args);
	            if (!timeoutId && !maxTimeoutId) {
	              args = thisArg = null;
	            }
	          }
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      };

	      var maxDelayed = function() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (trailing || (maxWait !== wait)) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = null;
	          }
	        }
	      };

	      return function() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);

	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0;

	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = null;
	        }
	        return result;
	      };
	    }

	    /**
	     * Defers executing the `func` function until the current call stack has cleared.
	     * Additional arguments will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to defer.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) { console.log(text); }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    function defer(func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 1);
	      return setTimeout(function() { func.apply(undefined, args); }, 1);
	    }

	    /**
	     * Executes the `func` function after `wait` milliseconds. Additional arguments
	     * will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay execution.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) { console.log(text); }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    function delay(func, wait) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 2);
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }

	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it will be used to determine the cache key for storing the result
	     * based on the arguments provided to the memoized function. By default, the
	     * first argument provided to the memoized function is used as the cache key.
	     * The `func` is executed with the `this` binding of the memoized function.
	     * The result cache is exposed as the `cache` property on the memoized function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] A function used to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var fibonacci = _.memoize(function(n) {
	     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
	     * });
	     *
	     * fibonacci(9)
	     * // => 34
	     *
	     * var data = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // modifying the result cache
	     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
	     * get('pebbles');
	     * // => { 'name': 'pebbles', 'age': 1 }
	     *
	     * get.cache.pebbles.name = 'penelope';
	     * get('pebbles');
	     * // => { 'name': 'penelope', 'age': 1 }
	     */
	    function memoize(func, resolver) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var memoized = function() {
	        var cache = memoized.cache,
	            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

	        return hasOwnProperty.call(cache, key)
	          ? cache[key]
	          : (cache[key] = func.apply(this, arguments));
	      }
	      memoized.cache = {};
	      return memoized;
	    }

	    /**
	     * Creates a function that is restricted to execute `func` once. Repeat calls to
	     * the function will return the value of the first call. The `func` is executed
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` executes `createApplication` once
	     */
	    function once(func) {
	      var ran,
	          result;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (ran) {
	          return result;
	        }
	        ran = true;
	        result = func.apply(this, arguments);

	        // clear the `func` variable so the function may be garbage collected
	        func = null;
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with any additional
	     * `partial` arguments prepended to those provided to the new function. This
	     * method is similar to `_.bind` except it does **not** alter the `this` binding.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) { return greeting + ' ' + name; };
	     * var hi = _.partial(greet, 'hi');
	     * hi('fred');
	     * // => 'hi fred'
	     */
	    function partial(func) {
	      return createWrapper(func, 16, slice(arguments, 1));
	    }

	    /**
	     * This method is like `_.partial` except that `partial` arguments are
	     * appended to those provided to the new function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
	     *
	     * var options = {
	     *   'variable': 'data',
	     *   'imports': { 'jq': $ }
	     * };
	     *
	     * defaultsDeep(options, _.templateSettings);
	     *
	     * options.variable
	     * // => 'data'
	     *
	     * options.imports
	     * // => { '_': _, 'jq': $ }
	     */
	    function partialRight(func) {
	      return createWrapper(func, 32, null, slice(arguments, 1));
	    }

	    /**
	     * Creates a function that, when executed, will only call the `func` function
	     * at most once per every `wait` milliseconds. Provide an options object to
	     * indicate that `func` should be invoked on the leading and/or trailing edge
	     * of the `wait` timeout. Subsequent calls to the throttled function will
	     * return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to throttle.
	     * @param {number} wait The number of milliseconds to throttle executions to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * var throttled = _.throttle(updatePosition, 100);
	     * jQuery(window).on('scroll', throttled);
	     *
	     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	     *   'trailing': false
	     * }));
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      if (options === false) {
	        leading = false;
	      } else if (isObject(options)) {
	        leading = 'leading' in options ? options.leading : leading;
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      debounceOptions.leading = leading;
	      debounceOptions.maxWait = wait;
	      debounceOptions.trailing = trailing;

	      return debounce(func, wait, debounceOptions);
	    }

	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Additional arguments provided to the function are appended
	     * to those provided to the wrapper function. The wrapper is executed with
	     * the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('Fred, Wilma, & Pebbles');
	     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      return createWrapper(wrapper, 16, [value]);
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var getter = _.constant(object);
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }

	    /**
	     * Produces a callback bound to an optional `thisArg`. If `func` is a property
	     * name the created callback will return the property value for a given element.
	     * If `func` is an object the created callback will return `true` for elements
	     * that contain the equivalent object properties, otherwise it will return `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // wrap to create custom callback shorthands
	     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
	     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
	     *   return !match ? func(callback, thisArg) : function(object) {
	     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
	     *   };
	     * });
	     *
	     * _.filter(characters, 'age__gt38');
	     * // => [{ 'name': 'fred', 'age': 40 }]
	     */
	    function createCallback(func, thisArg, argCount) {
	      var type = typeof func;
	      if (func == null || type == 'function') {
	        return baseCreateCallback(func, thisArg, argCount);
	      }
	      // handle "_.pluck" style callback shorthands
	      if (type != 'object') {
	        return property(func);
	      }
	      var props = keys(func),
	          key = props[0],
	          a = func[key];

	      // handle "_.where" style callback shorthands
	      if (props.length == 1 && a === a && !isObject(a)) {
	        // fast path the common case of providing an object with a single
	        // property containing a primitive value
	        return function(object) {
	          var b = object[key];
	          return a === b && (a !== 0 || (1 / a == 1 / b));
	        };
	      }
	      return function(object) {
	        var length = props.length,
	            result = false;

	        while (length--) {
	          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
	            break;
	          }
	        }
	        return result;
	      };
	    }

	    /**
	     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
	     * corresponding HTML entities.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('Fred, Wilma, & Pebbles');
	     * // => 'Fred, Wilma, &amp; Pebbles'
	     */
	    function escape(string) {
	      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
	    }

	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }

	    /**
	     * Adds function properties of a source object to the destination object.
	     * If `object` is a function methods will be added to its prototype as well.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Function|Object} [object=lodash] object The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
	     * @example
	     *
	     * function capitalize(string) {
	     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	     * }
	     *
	     * _.mixin({ 'capitalize': capitalize });
	     * _.capitalize('fred');
	     * // => 'Fred'
	     *
	     * _('fred').capitalize().value();
	     * // => 'Fred'
	     *
	     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
	     * _('fred').capitalize();
	     * // => 'Fred'
	     */
	    function mixin(object, source, options) {
	      var chain = true,
	          methodNames = source && functions(source);

	      if (!source || (!options && !methodNames.length)) {
	        if (options == null) {
	          options = source;
	        }
	        ctor = lodashWrapper;
	        source = object;
	        object = lodash;
	        methodNames = functions(source);
	      }
	      if (options === false) {
	        chain = false;
	      } else if (isObject(options) && 'chain' in options) {
	        chain = options.chain;
	      }
	      var ctor = object,
	          isFunc = isFunction(ctor);

	      forEach(methodNames, function(methodName) {
	        var func = object[methodName] = source[methodName];
	        if (isFunc) {
	          ctor.prototype[methodName] = function() {
	            var chainAll = this.__chain__,
	                value = this.__wrapped__,
	                args = [value];

	            push.apply(args, arguments);
	            var result = func.apply(object, args);
	            if (chain || chainAll) {
	              if (value === result && isObject(result)) {
	                return this;
	              }
	              result = new ctor(result);
	              result.__chain__ = chainAll;
	            }
	            return result;
	          };
	        }
	      });
	    }

	    /**
	     * Reverts the '_' variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      context._ = oldDash;
	      return this;
	    }

	    /**
	     * A no-operation function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // no operation performed
	    }

	    /**
	     * Gets the number of milliseconds that have elapsed since the Unix epoch
	     * (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var stamp = _.now();
	     * _.defer(function() { console.log(_.now() - stamp); });
	     * // => logs the number of milliseconds it took for the deferred function to be called
	     */
	    var now = isNative(now = Date.now) && now || function() {
	      return new Date().getTime();
	    };

	    /**
	     * Converts the given value into an integer of the specified radix.
	     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
	     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
	     *
	     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
	     * implementations. See http://es5.github.io/#E.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} value The value to parse.
	     * @param {number} [radix] The radix used to interpret the value to parse.
	     * @returns {number} Returns the new integer value.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     */
	    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
	      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
	      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
	    };

	    /**
	     * Creates a "_.pluck" style function, which returns the `key` value of a
	     * given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} key The name of the property to retrieve.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'fred',   'age': 40 },
	     *   { 'name': 'barney', 'age': 36 }
	     * ];
	     *
	     * var getName = _.property('name');
	     *
	     * _.map(characters, getName);
	     * // => ['barney', 'fred']
	     *
	     * _.sortBy(characters, getName);
	     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
	     */
	    function property(key) {
	      return function(object) {
	        return object[key];
	      };
	    }

	    /**
	     * Produces a random number between `min` and `max` (inclusive). If only one
	     * argument is provided a number between `0` and the given number will be
	     * returned. If `floating` is truey or either `min` or `max` are floats a
	     * floating-point number will be returned instead of an integer.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} [min=0] The minimum possible value.
	     * @param {number} [max=1] The maximum possible value.
	     * @param {boolean} [floating=false] Specify returning a floating-point number.
	     * @returns {number} Returns a random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(min, max, floating) {
	      var noMin = min == null,
	          noMax = max == null;

	      if (floating == null) {
	        if (typeof min == 'boolean' && noMax) {
	          floating = min;
	          min = 1;
	        }
	        else if (!noMax && typeof max == 'boolean') {
	          floating = max;
	          noMax = true;
	        }
	      }
	      if (noMin && noMax) {
	        max = 1;
	      }
	      min = +min || 0;
	      if (noMax) {
	        max = min;
	        min = 0;
	      } else {
	        max = +max || 0;
	      }
	      if (floating || min % 1 || max % 1) {
	        var rand = nativeRandom();
	        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
	      }
	      return baseRandom(min, max);
	    }

	    /**
	     * Resolves the value of property `key` on `object`. If `key` is a function
	     * it will be invoked with the `this` binding of `object` and its result returned,
	     * else the property value is returned. If `object` is falsey then `undefined`
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to resolve.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = {
	     *   'cheese': 'crumpets',
	     *   'stuff': function() {
	     *     return 'nonsense';
	     *   }
	     * };
	     *
	     * _.result(object, 'cheese');
	     * // => 'crumpets'
	     *
	     * _.result(object, 'stuff');
	     * // => 'nonsense'
	     */
	    function result(object, key) {
	      if (object) {
	        var value = object[key];
	        return isFunction(value) ? object[key]() : value;
	      }
	    }

	    /**
	     * A micro-templating method that handles arbitrary delimiters, preserves
	     * whitespace, and correctly escapes quotes within interpolated code.
	     *
	     * Note: In the development build, `_.template` utilizes sourceURLs for easier
	     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	     *
	     * For more information on precompiling templates see:
	     * http://lodash.com/custom-builds
	     *
	     * For more information on Chrome extension sandboxes see:
	     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} text The template text.
	     * @param {Object} data The data object used to populate the text.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as local variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [variable] The data object variable name.
	     * @returns {Function|string} Returns a compiled function when no `data` object
	     *  is given, else it returns the interpolated text.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= name %>');
	     * compiled({ 'name': 'fred' });
	     * // => 'hello fred'
	     *
	     * // using the "escape" delimiter to escape HTML in data property values
	     * _.template('<b><%- value %></b>', { 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to generate HTML
	     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
	     * _.template('hello ${ name }', { 'name': 'pebbles' });
	     * // => 'hello pebbles'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using a custom template delimiters
	     * _.templateSettings = {
	     *   'interpolate': /{{([\s\S]+?)}}/g
	     * };
	     *
	     * _.template('hello {{ name }}!', { 'name': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using the `imports` option to import jQuery
	     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     *   var __t, __p = '', __e = _.escape;
	     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
	     *   return __p;
	     * }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(text, data, options) {
	      // based on John Resig's `tmpl` implementation
	      // http://ejohn.org/blog/javascript-micro-templating/
	      // and Laura Doktorova's doT.js
	      // https://github.com/olado/doT
	      var settings = lodash.templateSettings;
	      text = String(text || '');

	      // avoid missing dependencies when `iteratorTemplate` is not defined
	      options = defaults({}, options, settings);

	      var imports = defaults({}, options.imports, settings.imports),
	          importsKeys = keys(imports),
	          importsValues = values(imports);

	      var isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";

	      // compile the regexp to match each delimiter
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');

	      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);

	        // escape characters that cannot be included in string literals
	        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

	        // replace delimiters with snippets
	        if (escapeValue) {
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;

	        // the JS engine embedded in Adobe products requires returning the `match`
	        // string in order to produce the correct `offset` value
	        return match;
	      });

	      source += "';\n";

	      // if `variable` is not specified, wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain
	      var variable = options.variable,
	          hasVariable = variable;

	      if (!hasVariable) {
	        variable = 'obj';
	        source = 'with (' + variable + ') {\n' + source + '\n}\n';
	      }
	      // cleanup code by stripping empty strings
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');

	      // frame code as the function body
	      source = 'function(' + variable + ') {\n' +
	        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
	        "var __t, __p = '', __e = _.escape" +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';

	      // Use a sourceURL for easier debugging.
	      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

	      try {
	        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
	      } catch(e) {
	        e.source = source;
	        throw e;
	      }
	      if (data) {
	        return result(data);
	      }
	      // provide the compiled function's source by its `toString` method, in
	      // supported environments, or the `source` property as a convenience for
	      // inlining compiled templates during the build process
	      result.source = source;
	      return result;
	    }

	    /**
	     * Executes the callback `n` times, returning an array of the results
	     * of each callback execution. The callback is bound to `thisArg` and invoked
	     * with one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} n The number of times to execute the callback.
	     * @param {Function} callback The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns an array of the results of each `callback` execution.
	     * @example
	     *
	     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
	     * // => [3, 6, 4]
	     *
	     * _.times(3, function(n) { mage.castSpell(n); });
	     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
	     *
	     * _.times(3, function(n) { this.cast(n); }, mage);
	     * // => also calls `mage.castSpell(n)` three times
	     */
	    function times(n, callback, thisArg) {
	      n = (n = +n) > -1 ? n : 0;
	      var index = -1,
	          result = Array(n);

	      callback = baseCreateCallback(callback, thisArg, 1);
	      while (++index < n) {
	        result[index] = callback(index);
	      }
	      return result;
	    }

	    /**
	     * The inverse of `_.escape` this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
	     * corresponding characters.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('Fred, Barney &amp; Pebbles');
	     * // => 'Fred, Barney & Pebbles'
	     */
	    function unescape(string) {
	      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
	    }

	    /**
	     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return String(prefix == null ? '' : prefix) + id;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object that wraps the given value with explicit
	     * method chaining enabled.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _.chain(characters)
	     *     .sortBy('age')
	     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
	     *     .first()
	     *     .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      value = new lodashWrapper(value);
	      value.__chain__ = true;
	      return value;
	    }

	    /**
	     * Invokes `interceptor` with the `value` as the first argument and then
	     * returns `value`. The purpose of this method is to "tap into" a method
	     * chain in order to perform operations on intermediate results within
	     * the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3, 4])
	     *  .tap(function(array) { array.pop(); })
	     *  .reverse()
	     *  .value();
	     * // => [3, 2, 1]
	     */
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }

	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Chaining
	     * @returns {*} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(characters).first();
	     * // => { 'name': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(characters).chain()
	     *   .first()
	     *   .pick('age')
	     *   .value();
	     * // => { 'age': 36 }
	     */
	    function wrapperChain() {
	      this.__chain__ = true;
	      return this;
	    }

	    /**
	     * Produces the `toString` result of the wrapped value.
	     *
	     * @name toString
	     * @memberOf _
	     * @category Chaining
	     * @returns {string} Returns the string result.
	     * @example
	     *
	     * _([1, 2, 3]).toString();
	     * // => '1,2,3'
	     */
	    function wrapperToString() {
	      return String(this.__wrapped__);
	    }

	    /**
	     * Extracts the wrapped value.
	     *
	     * @name valueOf
	     * @memberOf _
	     * @alias value
	     * @category Chaining
	     * @returns {*} Returns the wrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).valueOf();
	     * // => [1, 2, 3]
	     */
	    function wrapperValueOf() {
	      return this.__wrapped__;
	    }

	    /*--------------------------------------------------------------------------*/

	    // add functions that return wrapped values when chaining
	    lodash.after = after;
	    lodash.assign = assign;
	    lodash.at = at;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.chain = chain;
	    lodash.compact = compact;
	    lodash.compose = compose;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.createCallback = createCallback;
	    lodash.curry = curry;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.filter = filter;
	    lodash.flatten = flatten;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.functions = functions;
	    lodash.groupBy = groupBy;
	    lodash.indexBy = indexBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.invert = invert;
	    lodash.invoke = invoke;
	    lodash.keys = keys;
	    lodash.map = map;
	    lodash.mapValues = mapValues;
	    lodash.max = max;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.min = min;
	    lodash.omit = omit;
	    lodash.once = once;
	    lodash.pairs = pairs;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.pick = pick;
	    lodash.pluck = pluck;
	    lodash.property = property;
	    lodash.pull = pull;
	    lodash.range = range;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.shuffle = shuffle;
	    lodash.sortBy = sortBy;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.times = times;
	    lodash.toArray = toArray;
	    lodash.transform = transform;
	    lodash.union = union;
	    lodash.uniq = uniq;
	    lodash.values = values;
	    lodash.where = where;
	    lodash.without = without;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;

	    // add aliases
	    lodash.collect = map;
	    lodash.drop = rest;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.extend = assign;
	    lodash.methods = functions;
	    lodash.object = zipObject;
	    lodash.select = filter;
	    lodash.tail = rest;
	    lodash.unique = uniq;
	    lodash.unzip = zip;

	    // add functions to `lodash.prototype`
	    mixin(lodash);

	    /*--------------------------------------------------------------------------*/

	    // add functions that return unwrapped values when chaining
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.contains = contains;
	    lodash.escape = escape;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.has = has;
	    lodash.identity = identity;
	    lodash.indexOf = indexOf;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isNaN = isNaN;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isString = isString;
	    lodash.isUndefined = isUndefined;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.mixin = mixin;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.result = result;
	    lodash.runInContext = runInContext;
	    lodash.size = size;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.template = template;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;

	    // add aliases
	    lodash.all = every;
	    lodash.any = some;
	    lodash.detect = find;
	    lodash.findWhere = find;
	    lodash.foldl = reduce;
	    lodash.foldr = reduceRight;
	    lodash.include = contains;
	    lodash.inject = reduce;

	    mixin(function() {
	      var source = {}
	      forOwn(lodash, function(func, methodName) {
	        if (!lodash.prototype[methodName]) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }(), false);

	    /*--------------------------------------------------------------------------*/

	    // add functions capable of returning wrapped and unwrapped values when chaining
	    lodash.first = first;
	    lodash.last = last;
	    lodash.sample = sample;

	    // add aliases
	    lodash.take = first;
	    lodash.head = first;

	    forOwn(lodash, function(func, methodName) {
	      var callbackable = methodName !== 'sample';
	      if (!lodash.prototype[methodName]) {
	        lodash.prototype[methodName]= function(n, guard) {
	          var chainAll = this.__chain__,
	              result = func(this.__wrapped__, n, guard);

	          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
	            ? result
	            : new lodashWrapper(result, chainAll);
	        };
	      }
	    });

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = '2.4.1';

	    // add "Chaining" functions to the wrapper
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.toString = wrapperToString;
	    lodash.prototype.value = wrapperValueOf;
	    lodash.prototype.valueOf = wrapperValueOf;

	    // add `Array` functions that return unwrapped values
	    baseEach(['join', 'pop', 'shift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        var chainAll = this.__chain__,
	            result = func.apply(this.__wrapped__, arguments);

	        return chainAll
	          ? new lodashWrapper(result, chainAll)
	          : result;
	      };
	    });

	    // add `Array` functions that return the existing wrapped value
	    baseEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        func.apply(this.__wrapped__, arguments);
	        return this;
	      };
	    });

	    // add `Array` functions that return new wrapped values
	    baseEach(['concat', 'slice', 'splice'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
	      };
	    });

	    // avoid array-like object bugs with `Array#shift` and `Array#splice`
	    // in IE < 9, Firefox < 10, Narwhal, and RingoJS
	    if (!support.spliceObjects) {
	      baseEach(['pop', 'shift', 'splice'], function(methodName) {
	        var func = arrayRef[methodName],
	            isSplice = methodName == 'splice';

	        lodash.prototype[methodName] = function() {
	          var chainAll = this.__chain__,
	              value = this.__wrapped__,
	              result = func.apply(value, arguments);

	          if (value.length === 0) {
	            delete value[0];
	          }
	          return (chainAll || isSplice)
	            ? new lodashWrapper(result, chainAll)
	            : result;
	        };
	      });
	    }

	    return lodash;
	  }

	  /*--------------------------------------------------------------------------*/

	  // expose Lo-Dash
	  var _ = runInContext();

	  // some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose Lo-Dash to the global object even when an AMD loader is present in
	    // case Lo-Dash is loaded with a RequireJS shim config.
	    // See http://requirejs.org/docs/api.html#config-shim
	    root._ = _;

	    // define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // check for `exports` after `define` in case a build optimizer adds an `exports` object
	  else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // in Narwhal or Rhino -require
	    else {
	      freeExports._ = _;
	    }
	  }
	  else {
	    // in a browser or Rhino
	    root._ = _;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module), (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	

	//
	// Generated on Sat Dec 06 2014 16:08:09 GMT-0500 (EST) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
	// Version 1.2.4
	//

	(function (exports) {

	/*
	 * browser.js: Browser specific functionality for director.
	 *
	 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
	 * MIT LICENSE
	 *
	 */

	var dloc = document.location;

	function dlocHashEmpty() {
	  // Non-IE browsers return '' when the address bar shows '#'; Director's logic
	  // assumes both mean empty.
	  return dloc.hash === '' || dloc.hash === '#';
	}

	var listener = {
	  mode: 'modern',
	  hash: dloc.hash,
	  history: false,

	  check: function () {
	    var h = dloc.hash;
	    if (h != this.hash) {
	      this.hash = h;
	      this.onHashChanged();
	    }
	  },

	  fire: function () {
	    if (this.mode === 'modern') {
	      this.history === true ? window.onpopstate() : window.onhashchange();
	    }
	    else {
	      this.onHashChanged();
	    }
	  },

	  init: function (fn, history) {
	    var self = this;
	    this.history = history;

	    if (!Router.listeners) {
	      Router.listeners = [];
	    }

	    function onchange(onChangeEvent) {
	      for (var i = 0, l = Router.listeners.length; i < l; i++) {
	        Router.listeners[i](onChangeEvent);
	      }
	    }

	    //note IE8 is being counted as 'modern' because it has the hashchange event
	    if ('onhashchange' in window && (document.documentMode === undefined
	      || document.documentMode > 7)) {
	      // At least for now HTML5 history is available for 'modern' browsers only
	      if (this.history === true) {
	        // There is an old bug in Chrome that causes onpopstate to fire even
	        // upon initial page load. Since the handler is run manually in init(),
	        // this would cause Chrome to run it twise. Currently the only
	        // workaround seems to be to set the handler after the initial page load
	        // http://code.google.com/p/chromium/issues/detail?id=63040
	        setTimeout(function() {
	          window.onpopstate = onchange;
	        }, 500);
	      }
	      else {
	        window.onhashchange = onchange;
	      }
	      this.mode = 'modern';
	    }
	    else {
	      //
	      // IE support, based on a concept by Erik Arvidson ...
	      //
	      var frame = document.createElement('iframe');
	      frame.id = 'state-frame';
	      frame.style.display = 'none';
	      document.body.appendChild(frame);
	      this.writeFrame('');

	      if ('onpropertychange' in document && 'attachEvent' in document) {
	        document.attachEvent('onpropertychange', function () {
	          if (event.propertyName === 'location') {
	            self.check();
	          }
	        });
	      }

	      window.setInterval(function () { self.check(); }, 50);

	      this.onHashChanged = onchange;
	      this.mode = 'legacy';
	    }

	    Router.listeners.push(fn);

	    return this.mode;
	  },

	  destroy: function (fn) {
	    if (!Router || !Router.listeners) {
	      return;
	    }

	    var listeners = Router.listeners;

	    for (var i = listeners.length - 1; i >= 0; i--) {
	      if (listeners[i] === fn) {
	        listeners.splice(i, 1);
	      }
	    }
	  },

	  setHash: function (s) {
	    // Mozilla always adds an entry to the history
	    if (this.mode === 'legacy') {
	      this.writeFrame(s);
	    }

	    if (this.history === true) {
	      window.history.pushState({}, document.title, s);
	      // Fire an onpopstate event manually since pushing does not obviously
	      // trigger the pop event.
	      this.fire();
	    } else {
	      dloc.hash = (s[0] === '/') ? s : '/' + s;
	    }
	    return this;
	  },

	  writeFrame: function (s) {
	    // IE support...
	    var f = document.getElementById('state-frame');
	    var d = f.contentDocument || f.contentWindow.document;
	    d.open();
	    d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
	    d.close();
	  },

	  syncHash: function () {
	    // IE support...
	    var s = this._hash;
	    if (s != dloc.hash) {
	      dloc.hash = s;
	    }
	    return this;
	  },

	  onHashChanged: function () {}
	};

	var Router = exports.Router = function (routes) {
	  if (!(this instanceof Router)) return new Router(routes);

	  this.params   = {};
	  this.routes   = {};
	  this.methods  = ['on', 'once', 'after', 'before'];
	  this.scope    = [];
	  this._methods = {};

	  this._insert = this.insert;
	  this.insert = this.insertEx;

	  this.historySupport = (window.history != null ? window.history.pushState : null) != null

	  this.configure();
	  this.mount(routes || {});
	};

	Router.prototype.init = function (r) {
	  var self = this
	    , routeTo;
	  this.handler = function(onChangeEvent) {
	    var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
	    var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
	    self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
	  };

	  listener.init(this.handler, this.history);

	  if (this.history === false) {
	    if (dlocHashEmpty() && r) {
	      dloc.hash = r;
	    } else if (!dlocHashEmpty()) {
	      self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
	    }
	  }
	  else {
	    if (this.convert_hash_in_init) {
	      // Use hash as route
	      routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
	      if (routeTo) {
	        window.history.replaceState({}, document.title, routeTo);
	      }
	    }
	    else {
	      // Use canonical url
	      routeTo = this.getPath();
	    }

	    // Router has been initialized, but due to the chrome bug it will not
	    // yet actually route HTML5 history state changes. Thus, decide if should route.
	    if (routeTo || this.run_in_init === true) {
	      this.handler();
	    }
	  }

	  return this;
	};

	Router.prototype.explode = function () {
	  var v = this.history === true ? this.getPath() : dloc.hash;
	  if (v.charAt(1) === '/') { v=v.slice(1) }
	  return v.slice(1, v.length).split("/");
	};

	Router.prototype.setRoute = function (i, v, val) {
	  var url = this.explode();

	  if (typeof i === 'number' && typeof v === 'string') {
	    url[i] = v;
	  }
	  else if (typeof val === 'string') {
	    url.splice(i, v, s);
	  }
	  else {
	    url = [i];
	  }

	  listener.setHash(url.join('/'));
	  return url;
	};

	//
	// ### function insertEx(method, path, route, parent)
	// #### @method {string} Method to insert the specific `route`.
	// #### @path {Array} Parsed path to insert the `route` at.
	// #### @route {Array|function} Route handlers to insert.
	// #### @parent {Object} **Optional** Parent "routes" to insert into.
	// insert a callback that will only occur once per the matched route.
	//
	Router.prototype.insertEx = function(method, path, route, parent) {
	  if (method === "once") {
	    method = "on";
	    route = function(route) {
	      var once = false;
	      return function() {
	        if (once) return;
	        once = true;
	        return route.apply(this, arguments);
	      };
	    }(route);
	  }
	  return this._insert(method, path, route, parent);
	};

	Router.prototype.getRoute = function (v) {
	  var ret = v;

	  if (typeof v === "number") {
	    ret = this.explode()[v];
	  }
	  else if (typeof v === "string"){
	    var h = this.explode();
	    ret = h.indexOf(v);
	  }
	  else {
	    ret = this.explode();
	  }

	  return ret;
	};

	Router.prototype.destroy = function () {
	  listener.destroy(this.handler);
	  return this;
	};

	Router.prototype.getPath = function () {
	  var path = window.location.pathname;
	  if (path.substr(0, 1) !== '/') {
	    path = '/' + path;
	  }
	  return path;
	};
	function _every(arr, iterator) {
	  for (var i = 0; i < arr.length; i += 1) {
	    if (iterator(arr[i], i, arr) === false) {
	      return;
	    }
	  }
	}

	function _flatten(arr) {
	  var flat = [];
	  for (var i = 0, n = arr.length; i < n; i++) {
	    flat = flat.concat(arr[i]);
	  }
	  return flat;
	}

	function _asyncEverySeries(arr, iterator, callback) {
	  if (!arr.length) {
	    return callback();
	  }
	  var completed = 0;
	  (function iterate() {
	    iterator(arr[completed], function(err) {
	      if (err || err === false) {
	        callback(err);
	        callback = function() {};
	      } else {
	        completed += 1;
	        if (completed === arr.length) {
	          callback();
	        } else {
	          iterate();
	        }
	      }
	    });
	  })();
	}

	function paramifyString(str, params, mod) {
	  mod = str;
	  for (var param in params) {
	    if (params.hasOwnProperty(param)) {
	      mod = params[param](str);
	      if (mod !== str) {
	        break;
	      }
	    }
	  }
	  return mod === str ? "([._a-zA-Z0-9-]+)" : mod;
	}

	function regifyString(str, params) {
	  var matches, last = 0, out = "";
	  while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
	    last = matches.index + matches[0].length;
	    matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
	    out += str.substr(0, matches.index) + matches[0];
	  }
	  str = out += str.substr(last);
	  var captures = str.match(/:([^\/]+)/ig), capture, length;
	  if (captures) {
	    length = captures.length;
	    for (var i = 0; i < length; i++) {
	      capture = captures[i];
	      if (capture.slice(0, 2) === "::") {
	        str = capture.slice(1);
	      } else {
	        str = str.replace(capture, paramifyString(capture, params));
	      }
	    }
	  }
	  return str;
	}

	function terminator(routes, delimiter, start, stop) {
	  var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
	  for (i = 0; i < routes.length; i++) {
	    var chunk = routes[i];
	    if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
	      left = chunk.indexOf(start, last);
	      right = chunk.indexOf(stop, last);
	      if (~left && !~right || !~left && ~right) {
	        var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
	        routes = [ tmp ].concat(routes.slice((i || 1) + 1));
	      }
	      last = (right > left ? right : left) + 1;
	      i = 0;
	    } else {
	      last = 0;
	    }
	  }
	  return routes;
	}

	var QUERY_SEPARATOR = /\?.*/;

	Router.prototype.configure = function(options) {
	  options = options || {};
	  for (var i = 0; i < this.methods.length; i++) {
	    this._methods[this.methods[i]] = true;
	  }
	  this.recurse = options.recurse || this.recurse || false;
	  this.async = options.async || false;
	  this.delimiter = options.delimiter || "/";
	  this.strict = typeof options.strict === "undefined" ? true : options.strict;
	  this.notfound = options.notfound;
	  this.resource = options.resource;
	  this.history = options.html5history && this.historySupport || false;
	  this.run_in_init = this.history === true && options.run_handler_in_init !== false;
	  this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
	  this.every = {
	    after: options.after || null,
	    before: options.before || null,
	    on: options.on || null
	  };
	  return this;
	};

	Router.prototype.param = function(token, matcher) {
	  if (token[0] !== ":") {
	    token = ":" + token;
	  }
	  var compiled = new RegExp(token, "g");
	  this.params[token] = function(str) {
	    return str.replace(compiled, matcher.source || matcher);
	  };
	  return this;
	};

	Router.prototype.on = Router.prototype.route = function(method, path, route) {
	  var self = this;
	  if (!route && typeof path == "function") {
	    route = path;
	    path = method;
	    method = "on";
	  }
	  if (Array.isArray(path)) {
	    return path.forEach(function(p) {
	      self.on(method, p, route);
	    });
	  }
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  if (Array.isArray(method)) {
	    return method.forEach(function(m) {
	      self.on(m.toLowerCase(), path, route);
	    });
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.insert(method, this.scope.concat(path), route);
	};

	Router.prototype.path = function(path, routesFn) {
	  var self = this, length = this.scope.length;
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.scope = this.scope.concat(path);
	  routesFn.call(this, this);
	  this.scope.splice(length, path.length);
	};

	Router.prototype.dispatch = function(method, path, callback) {
	  var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
	  this._invoked = true;
	  if (!fns || fns.length === 0) {
	    this.last = [];
	    if (typeof this.notfound === "function") {
	      this.invoke([ this.notfound ], {
	        method: method,
	        path: path
	      }, callback);
	    }
	    return false;
	  }
	  if (this.recurse === "forward") {
	    fns = fns.reverse();
	  }
	  function updateAndInvoke() {
	    self.last = fns.after;
	    self.invoke(self.runlist(fns), self, callback);
	  }
	  after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
	  if (after && after.length > 0 && invoked) {
	    if (this.async) {
	      this.invoke(after, this, updateAndInvoke);
	    } else {
	      this.invoke(after, this);
	      updateAndInvoke();
	    }
	    return true;
	  }
	  updateAndInvoke();
	  return true;
	};

	Router.prototype.invoke = function(fns, thisArg, callback) {
	  var self = this;
	  var apply;
	  if (this.async) {
	    apply = function(fn, next) {
	      if (Array.isArray(fn)) {
	        return _asyncEverySeries(fn, apply, next);
	      } else if (typeof fn == "function") {
	        fn.apply(thisArg, (fns.captures || []).concat(next));
	      }
	    };
	    _asyncEverySeries(fns, apply, function() {
	      if (callback) {
	        callback.apply(thisArg, arguments);
	      }
	    });
	  } else {
	    apply = function(fn) {
	      if (Array.isArray(fn)) {
	        return _every(fn, apply);
	      } else if (typeof fn === "function") {
	        return fn.apply(thisArg, fns.captures || []);
	      } else if (typeof fn === "string" && self.resource) {
	        self.resource[fn].apply(thisArg, fns.captures || []);
	      }
	    };
	    _every(fns, apply);
	  }
	};

	Router.prototype.traverse = function(method, path, routes, regexp, filter) {
	  var fns = [], current, exact, match, next, that;
	  function filterRoutes(routes) {
	    if (!filter) {
	      return routes;
	    }
	    function deepCopy(source) {
	      var result = [];
	      for (var i = 0; i < source.length; i++) {
	        result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
	      }
	      return result;
	    }
	    function applyFilter(fns) {
	      for (var i = fns.length - 1; i >= 0; i--) {
	        if (Array.isArray(fns[i])) {
	          applyFilter(fns[i]);
	          if (fns[i].length === 0) {
	            fns.splice(i, 1);
	          }
	        } else {
	          if (!filter(fns[i])) {
	            fns.splice(i, 1);
	          }
	        }
	      }
	    }
	    var newRoutes = deepCopy(routes);
	    newRoutes.matched = routes.matched;
	    newRoutes.captures = routes.captures;
	    newRoutes.after = routes.after.filter(filter);
	    applyFilter(newRoutes);
	    return newRoutes;
	  }
	  if (path === this.delimiter && routes[method]) {
	    next = [ [ routes.before, routes[method] ].filter(Boolean) ];
	    next.after = [ routes.after ].filter(Boolean);
	    next.matched = true;
	    next.captures = [];
	    return filterRoutes(next);
	  }
	  for (var r in routes) {
	    if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
	      current = exact = regexp + this.delimiter + r;
	      if (!this.strict) {
	        exact += "[" + this.delimiter + "]?";
	      }
	      match = path.match(new RegExp("^" + exact));
	      if (!match) {
	        continue;
	      }
	      if (match[0] && match[0] == path && routes[r][method]) {
	        next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
	        next.after = [ routes[r].after ].filter(Boolean);
	        next.matched = true;
	        next.captures = match.slice(1);
	        if (this.recurse && routes === this.routes) {
	          next.push([ routes.before, routes.on ].filter(Boolean));
	          next.after = next.after.concat([ routes.after ].filter(Boolean));
	        }
	        return filterRoutes(next);
	      }
	      next = this.traverse(method, path, routes[r], current);
	      if (next.matched) {
	        if (next.length > 0) {
	          fns = fns.concat(next);
	        }
	        if (this.recurse) {
	          fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
	          next.after = next.after.concat([ routes[r].after ].filter(Boolean));
	          if (routes === this.routes) {
	            fns.push([ routes["before"], routes["on"] ].filter(Boolean));
	            next.after = next.after.concat([ routes["after"] ].filter(Boolean));
	          }
	        }
	        fns.matched = true;
	        fns.captures = next.captures;
	        fns.after = next.after;
	        return filterRoutes(fns);
	      }
	    }
	  }
	  return false;
	};

	Router.prototype.insert = function(method, path, route, parent) {
	  var methodType, parentType, isArray, nested, part;
	  path = path.filter(function(p) {
	    return p && p.length > 0;
	  });
	  parent = parent || this.routes;
	  part = path.shift();
	  if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
	    part = regifyString(part, this.params);
	  }
	  if (path.length > 0) {
	    parent[part] = parent[part] || {};
	    return this.insert(method, path, route, parent[part]);
	  }
	  if (!part && !path.length && parent === this.routes) {
	    methodType = typeof parent[method];
	    switch (methodType) {
	     case "function":
	      parent[method] = [ parent[method], route ];
	      return;
	     case "object":
	      parent[method].push(route);
	      return;
	     case "undefined":
	      parent[method] = route;
	      return;
	    }
	    return;
	  }
	  parentType = typeof parent[part];
	  isArray = Array.isArray(parent[part]);
	  if (parent[part] && !isArray && parentType == "object") {
	    methodType = typeof parent[part][method];
	    switch (methodType) {
	     case "function":
	      parent[part][method] = [ parent[part][method], route ];
	      return;
	     case "object":
	      parent[part][method].push(route);
	      return;
	     case "undefined":
	      parent[part][method] = route;
	      return;
	    }
	  } else if (parentType == "undefined") {
	    nested = {};
	    nested[method] = route;
	    parent[part] = nested;
	    return;
	  }
	  throw new Error("Invalid route context: " + parentType);
	};



	Router.prototype.extend = function(methods) {
	  var self = this, len = methods.length, i;
	  function extend(method) {
	    self._methods[method] = true;
	    self[method] = function() {
	      var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
	      self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
	    };
	  }
	  for (i = 0; i < len; i++) {
	    extend(methods[i]);
	  }
	};

	Router.prototype.runlist = function(fns) {
	  var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
	  if (this.every && this.every.on) {
	    runlist.push(this.every.on);
	  }
	  runlist.captures = fns.captures;
	  runlist.source = fns.source;
	  return runlist;
	};

	Router.prototype.mount = function(routes, path) {
	  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
	    return;
	  }
	  var self = this;
	  path = path || [];
	  if (!Array.isArray(path)) {
	    path = path.split(self.delimiter);
	  }
	  function insertOrMount(route, local) {
	    var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
	    if (isRoute) {
	      rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
	      parts.shift();
	    }
	    if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
	      local = local.concat(parts);
	      self.mount(routes[route], local);
	      return;
	    }
	    if (isRoute) {
	      local = local.concat(rename.split(self.delimiter));
	      local = terminator(local, self.delimiter);
	    }
	    self.insert(event, local, routes[route]);
	  }
	  for (var route in routes) {
	    if (routes.hasOwnProperty(route)) {
	      insertOrMount(route, path.slice(0));
	    }
	  }
	};



	}(true ? exports : window));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Vue.js v0.11.4
	 * (c) 2014 Evan You
	 * Released under the MIT License.
	 */

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define(factory);
		else if(typeof exports === 'object')
			exports["Vue"] = factory();
		else
			root["Vue"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var extend = _.extend

		/**
		 * The exposed Vue constructor.
		 *
		 * API conventions:
		 * - public API methods/properties are prefiexed with `$`
		 * - internal methods/properties are prefixed with `_`
		 * - non-prefixed properties are assumed to be proxied user
		 *   data.
		 *
		 * @constructor
		 * @param {Object} [options]
		 * @public
		 */

		function Vue (options) {
		  this._init(options)
		}

		/**
		 * Mixin global API
		 */

		extend(Vue, __webpack_require__(2))

		/**
		 * Vue and every constructor that extends Vue has an
		 * associated options object, which can be accessed during
		 * compilation steps as `this.constructor.options`.
		 *
		 * These can be seen as the default options of every
		 * Vue instance.
		 */

		Vue.options = {
		  directives  : __webpack_require__(8),
		  filters     : __webpack_require__(9),
		  partials    : {},
		  transitions : {},
		  components  : {}
		}

		/**
		 * Build up the prototype
		 */

		var p = Vue.prototype

		/**
		 * $data has a setter which does a bunch of
		 * teardown/setup work
		 */

		Object.defineProperty(p, '$data', {
		  get: function () {
		    return this._data
		  },
		  set: function (newData) {
		    this._setData(newData)
		  }
		})

		/**
		 * Mixin internal instance methods
		 */

		extend(p, __webpack_require__(10))
		extend(p, __webpack_require__(11))
		extend(p, __webpack_require__(12))
		extend(p, __webpack_require__(13))

		/**
		 * Mixin public API methods
		 */

		extend(p, __webpack_require__(3))
		extend(p, __webpack_require__(4))
		extend(p, __webpack_require__(5))
		extend(p, __webpack_require__(6))
		extend(p, __webpack_require__(7))

		module.exports = _.Vue = Vue

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		var lang   = __webpack_require__(14)
		var extend = lang.extend

		extend(exports, lang)
		extend(exports, __webpack_require__(15))
		extend(exports, __webpack_require__(16))
		extend(exports, __webpack_require__(17))
		extend(exports, __webpack_require__(18))

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var mergeOptions = __webpack_require__(19)

		/**
		 * Expose useful internals
		 */

		exports.util = _
		exports.nextTick = _.nextTick
		exports.config = __webpack_require__(20)

		exports.compiler = {
		  compile: __webpack_require__(42),
		  transclude: __webpack_require__(43)
		}

		exports.parsers = {
		  path: __webpack_require__(44),
		  text: __webpack_require__(45),
		  template: __webpack_require__(46),
		  directive: __webpack_require__(47),
		  expression: __webpack_require__(48)
		}

		/**
		 * Each instance constructor, including Vue, has a unique
		 * cid. This enables us to create wrapped "child
		 * constructors" for prototypal inheritance and cache them.
		 */

		exports.cid = 0
		var cid = 1

		/**
		 * Class inehritance
		 *
		 * @param {Object} extendOptions
		 */

		exports.extend = function (extendOptions) {
		  extendOptions = extendOptions || {}
		  var Super = this
		  var Sub = createClass(extendOptions.name || 'VueComponent')
		  Sub.prototype = Object.create(Super.prototype)
		  Sub.prototype.constructor = Sub
		  Sub.cid = cid++
		  Sub.options = mergeOptions(
		    Super.options,
		    extendOptions
		  )
		  Sub['super'] = Super
		  // allow further extension
		  Sub.extend = Super.extend
		  // create asset registers, so extended classes
		  // can have their private assets too.
		  createAssetRegisters(Sub)
		  return Sub
		}

		/**
		 * A function that returns a sub-class constructor with the
		 * given name. This gives us much nicer output when
		 * logging instances in the console.
		 *
		 * @param {String} name
		 * @return {Function}
		 */

		function createClass (name) {
		  return new Function(
		    'return function ' + _.camelize(name, true) +
		    ' (options) { this._init(options) }'
		  )()
		}

		/**
		 * Plugin system
		 *
		 * @param {Object} plugin
		 */

		exports.use = function (plugin) {
		  // additional parameters
		  var args = _.toArray(arguments, 1)
		  args.unshift(this)
		  if (typeof plugin.install === 'function') {
		    plugin.install.apply(plugin, args)
		  } else {
		    plugin.apply(null, args)
		  }
		  return this
		}

		/**
		 * Define asset registration methods on a constructor.
		 *
		 * @param {Function} Constructor
		 */

		var assetTypes = [
		  'directive',
		  'filter',
		  'partial',
		  'transition'
		]

		function createAssetRegisters (Constructor) {

		  /* Asset registration methods share the same signature:
		   *
		   * @param {String} id
		   * @param {*} definition
		   */

		  assetTypes.forEach(function (type) {
		    Constructor[type] = function (id, definition) {
		      if (!definition) {
		        return this.options[type + 's'][id]
		      } else {
		        this.options[type + 's'][id] = definition
		      }
		    }
		  })

		  /**
		   * Component registration needs to automatically invoke
		   * Vue.extend on object values.
		   *
		   * @param {String} id
		   * @param {Object|Function} definition
		   */

		  Constructor.component = function (id, definition) {
		    if (!definition) {
		      return this.options.components[id]
		    } else {
		      if (_.isPlainObject(definition)) {
		        definition.name = id
		        definition = _.Vue.extend(definition)
		      }
		      this.options.components[id] = definition
		    }
		  }
		}

		createAssetRegisters(exports)

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(21)
		var Path = __webpack_require__(44)
		var textParser = __webpack_require__(45)
		var dirParser = __webpack_require__(47)
		var expParser = __webpack_require__(48)
		var filterRE = /[^|]\|[^|]/

		/**
		 * Get the value from an expression on this vm.
		 *
		 * @param {String} exp
		 * @return {*}
		 */

		exports.$get = function (exp) {
		  var res = expParser.parse(exp)
		  if (res) {
		    return res.get.call(this, this)
		  }
		}

		/**
		 * Set the value from an expression on this vm.
		 * The expression must be a valid left-hand
		 * expression in an assignment.
		 *
		 * @param {String} exp
		 * @param {*} val
		 */

		exports.$set = function (exp, val) {
		  var res = expParser.parse(exp, true)
		  if (res && res.set) {
		    res.set.call(this, this, val)
		  }
		}

		/**
		 * Add a property on the VM
		 *
		 * @param {String} key
		 * @param {*} val
		 */

		exports.$add = function (key, val) {
		  this._data.$add(key, val)
		}

		/**
		 * Delete a property on the VM
		 *
		 * @param {String} key
		 */

		exports.$delete = function (key) {
		  this._data.$delete(key)
		}

		/**
		 * Watch an expression, trigger callback when its
		 * value changes.
		 *
		 * @param {String} exp
		 * @param {Function} cb
		 * @param {Boolean} [deep]
		 * @param {Boolean} [immediate]
		 * @return {Function} - unwatchFn
		 */

		exports.$watch = function (exp, cb, deep, immediate) {
		  var vm = this
		  var key = deep ? exp + '**deep**' : exp
		  var watcher = vm._userWatchers[key]
		  var wrappedCb = function (val, oldVal) {
		    cb.call(vm, val, oldVal)
		  }
		  if (!watcher) {
		    watcher = vm._userWatchers[key] =
		      new Watcher(vm, exp, wrappedCb, {
		        deep: deep,
		        user: true
		      })
		  } else {
		    watcher.addCb(wrappedCb)
		  }
		  if (immediate) {
		    wrappedCb(watcher.value)
		  }
		  return function unwatchFn () {
		    watcher.removeCb(wrappedCb)
		    if (!watcher.active) {
		      vm._userWatchers[key] = null
		    }
		  }
		}

		/**
		 * Evaluate a text directive, including filters.
		 *
		 * @param {String} text
		 * @return {String}
		 */

		exports.$eval = function (text) {
		  // check for filters.
		  if (filterRE.test(text)) {
		    var dir = dirParser.parse(text)[0]
		    // the filter regex check might give false positive
		    // for pipes inside strings, so it's possible that
		    // we don't get any filters here
		    return dir.filters
		      ? _.applyFilters(
		          this.$get(dir.expression),
		          _.resolveFilters(this, dir.filters).read,
		          this
		        )
		      : this.$get(dir.expression)
		  } else {
		    // no filter
		    return this.$get(text)
		  }
		}

		/**
		 * Interpolate a piece of template text.
		 *
		 * @param {String} text
		 * @return {String}
		 */

		exports.$interpolate = function (text) {
		  var tokens = textParser.parse(text)
		  var vm = this
		  if (tokens) {
		    return tokens.length === 1
		      ? vm.$eval(tokens[0].value)
		      : tokens.map(function (token) {
		          return token.tag
		            ? vm.$eval(token.value)
		            : token.value
		        }).join('')
		  } else {
		    return text
		  }
		}

		/**
		 * Log instance data as a plain JS object
		 * so that it is easier to inspect in console.
		 * This method assumes console is available.
		 *
		 * @param {String} [path]
		 */

		exports.$log = function (path) {
		  var data = path
		    ? Path.get(this._data, path)
		    : this._data
		  if (data) {
		    data = JSON.parse(JSON.stringify(data))
		  }
		  console.log(data)
		}

	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var transition = __webpack_require__(49)

		/**
		 * Append instance to target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */

		exports.$appendTo = function (target, cb, withTransition) {
		  return insert(
		    this, target, cb, withTransition,
		    append, transition.append
		  )
		}

		/**
		 * Prepend instance to target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */

		exports.$prependTo = function (target, cb, withTransition) {
		  target = query(target)
		  if (target.hasChildNodes()) {
		    this.$before(target.firstChild, cb, withTransition)
		  } else {
		    this.$appendTo(target, cb, withTransition)
		  }
		  return this
		}

		/**
		 * Insert instance before target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */

		exports.$before = function (target, cb, withTransition) {
		  return insert(
		    this, target, cb, withTransition,
		    before, transition.before
		  )
		}

		/**
		 * Insert instance after target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */

		exports.$after = function (target, cb, withTransition) {
		  target = query(target)
		  if (target.nextSibling) {
		    this.$before(target.nextSibling, cb, withTransition)
		  } else {
		    this.$appendTo(target.parentNode, cb, withTransition)
		  }
		  return this
		}

		/**
		 * Remove instance from DOM
		 *
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */

		exports.$remove = function (cb, withTransition) {
		  var inDoc = this._isAttached && _.inDoc(this.$el)
		  // if we are not in document, no need to check
		  // for transitions
		  if (!inDoc) withTransition = false
		  var op
		  var self = this
		  var realCb = function () {
		    if (inDoc) self._callHook('detached')
		    if (cb) cb()
		  }
		  if (
		    this._isBlock &&
		    !this._blockFragment.hasChildNodes()
		  ) {
		    op = withTransition === false
		      ? append
		      : transition.removeThenAppend
		    blockOp(this, this._blockFragment, op, realCb)
		  } else {
		    op = withTransition === false
		      ? remove
		      : transition.remove
		    op(this.$el, this, realCb)
		  }
		  return this
		}

		/**
		 * Shared DOM insertion function.
		 *
		 * @param {Vue} vm
		 * @param {Element} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition]
		 * @param {Function} op1 - op for non-transition insert
		 * @param {Function} op2 - op for transition insert
		 * @return vm
		 */

		function insert (vm, target, cb, withTransition, op1, op2) {
		  target = query(target)
		  var targetIsDetached = !_.inDoc(target)
		  var op = withTransition === false || targetIsDetached
		    ? op1
		    : op2
		  var shouldCallHook =
		    !targetIsDetached &&
		    !vm._isAttached &&
		    !_.inDoc(vm.$el)
		  if (vm._isBlock) {
		    blockOp(vm, target, op, cb)
		  } else {
		    op(vm.$el, target, vm, cb)
		  }
		  if (shouldCallHook) {
		    vm._callHook('attached')
		  }
		  return vm
		}

		/**
		 * Execute a transition operation on a block instance,
		 * iterating through all its block nodes.
		 *
		 * @param {Vue} vm
		 * @param {Node} target
		 * @param {Function} op
		 * @param {Function} cb
		 */

		function blockOp (vm, target, op, cb) {
		  var current = vm._blockStart
		  var end = vm._blockEnd
		  var next
		  while (next !== end) {
		    next = current.nextSibling
		    op(current, target, vm)
		    current = next
		  }
		  op(end, target, vm, cb)
		}

		/**
		 * Check for selectors
		 *
		 * @param {String|Element} el
		 */

		function query (el) {
		  return typeof el === 'string'
		    ? document.querySelector(el)
		    : el
		}

		/**
		 * Append operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Node} target
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */

		function append (el, target, vm, cb) {
		  target.appendChild(el)
		  if (cb) cb()
		}

		/**
		 * InsertBefore operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Node} target
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */

		function before (el, target, vm, cb) {
		  _.before(el, target)
		  if (cb) cb()
		}

		/**
		 * Remove operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */

		function remove (el, vm, cb) {
		  _.remove(el)
		  if (cb) cb()
		}

	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		/**
		 * Listen on the given `event` with `fn`.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */

		exports.$on = function (event, fn) {
		  (this._events[event] || (this._events[event] = []))
		    .push(fn)
		  modifyListenerCount(this, event, 1)
		  return this
		}

		/**
		 * Adds an `event` listener that will be invoked a single
		 * time then automatically removed.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */

		exports.$once = function (event, fn) {
		  var self = this
		  function on () {
		    self.$off(event, on)
		    fn.apply(this, arguments)
		  }
		  on.fn = fn
		  this.$on(event, on)
		  return this
		}

		/**
		 * Remove the given callback for `event` or all
		 * registered callbacks.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */

		exports.$off = function (event, fn) {
		  var cbs
		  // all
		  if (!arguments.length) {
		    if (this.$parent) {
		      for (event in this._events) {
		        cbs = this._events[event]
		        if (cbs) {
		          modifyListenerCount(this, event, -cbs.length)
		        }
		      }
		    }
		    this._events = {}
		    return this
		  }
		  // specific event
		  cbs = this._events[event]
		  if (!cbs) {
		    return this
		  }
		  if (arguments.length === 1) {
		    modifyListenerCount(this, event, -cbs.length)
		    this._events[event] = null
		    return this
		  }
		  // specific handler
		  var cb
		  var i = cbs.length
		  while (i--) {
		    cb = cbs[i]
		    if (cb === fn || cb.fn === fn) {
		      modifyListenerCount(this, event, -1)
		      cbs.splice(i, 1)
		      break
		    }
		  }
		  return this
		}

		/**
		 * Trigger an event on self.
		 *
		 * @param {String} event
		 */

		exports.$emit = function (event) {
		  this._eventCancelled = false
		  var cbs = this._events[event]
		  if (cbs) {
		    // avoid leaking arguments:
		    // http://jsperf.com/closure-with-arguments
		    var i = arguments.length - 1
		    var args = new Array(i)
		    while (i--) {
		      args[i] = arguments[i + 1]
		    }
		    i = 0
		    cbs = cbs.length > 1
		      ? _.toArray(cbs)
		      : cbs
		    for (var l = cbs.length; i < l; i++) {
		      if (cbs[i].apply(this, args) === false) {
		        this._eventCancelled = true
		      }
		    }
		  }
		  return this
		}

		/**
		 * Recursively broadcast an event to all children instances.
		 *
		 * @param {String} event
		 * @param {...*} additional arguments
		 */

		exports.$broadcast = function (event) {
		  // if no child has registered for this event,
		  // then there's no need to broadcast.
		  if (!this._eventsCount[event]) return
		  var children = this._children
		  if (children) {
		    for (var i = 0, l = children.length; i < l; i++) {
		      var child = children[i]
		      child.$emit.apply(child, arguments)
		      if (!child._eventCancelled) {
		        child.$broadcast.apply(child, arguments)
		      }
		    }
		  }
		  return this
		}

		/**
		 * Recursively propagate an event up the parent chain.
		 *
		 * @param {String} event
		 * @param {...*} additional arguments
		 */

		exports.$dispatch = function () {
		  var parent = this.$parent
		  while (parent) {
		    parent.$emit.apply(parent, arguments)
		    parent = parent._eventCancelled
		      ? null
		      : parent.$parent
		  }
		  return this
		}

		/**
		 * Modify the listener counts on all parents.
		 * This bookkeeping allows $broadcast to return early when
		 * no child has listened to a certain event.
		 *
		 * @param {Vue} vm
		 * @param {String} event
		 * @param {Number} count
		 */

		var hookRE = /^hook:/
		function modifyListenerCount (vm, event, count) {
		  var parent = vm.$parent
		  // hooks do not get broadcasted so no need
		  // to do bookkeeping for them
		  if (!parent || !count || hookRE.test(event)) return
		  while (parent) {
		    parent._eventsCount[event] =
		      (parent._eventsCount[event] || 0) + count
		    parent = parent.$parent
		  }
		}

	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		/**
		 * Create a child instance that prototypally inehrits
		 * data on parent. To achieve that we create an intermediate
		 * constructor with its prototype pointing to parent.
		 *
		 * @param {Object} opts
		 * @param {Function} [BaseCtor]
		 * @return {Vue}
		 * @public
		 */

		exports.$addChild = function (opts, BaseCtor) {
		  BaseCtor = BaseCtor || _.Vue
		  opts = opts || {}
		  var parent = this
		  var ChildVue
		  var inherit = opts.inherit !== undefined
		    ? opts.inherit
		    : BaseCtor.options.inherit
		  if (inherit) {
		    var ctors = parent._childCtors
		    if (!ctors) {
		      ctors = parent._childCtors = {}
		    }
		    ChildVue = ctors[BaseCtor.cid]
		    if (!ChildVue) {
		      var optionName = BaseCtor.options.name
		      var className = optionName
		        ? _.camelize(optionName, true)
		        : 'VueComponent'
		      ChildVue = new Function(
		        'return function ' + className + ' (options) {' +
		        'this.constructor = ' + className + ';' +
		        'this._init(options) }'
		      )()
		      ChildVue.options = BaseCtor.options
		      ChildVue.prototype = this
		      ctors[BaseCtor.cid] = ChildVue
		    }
		  } else {
		    ChildVue = BaseCtor
		  }
		  opts._parent = parent
		  opts._root = parent.$root
		  var child = new ChildVue(opts)
		  if (!this._children) {
		    this._children = []
		  }
		  this._children.push(child)
		  return child
		}

	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var compile = __webpack_require__(42)

		/**
		 * Set instance target element and kick off the compilation
		 * process. The passed in `el` can be a selector string, an
		 * existing Element, or a DocumentFragment (for block
		 * instances).
		 *
		 * @param {Element|DocumentFragment|string} el
		 * @public
		 */

		exports.$mount = function (el) {
		  if (this._isCompiled) {
		    _.warn('$mount() should be called only once.')
		    return
		  }
		  if (!el) {
		    el = document.createElement('div')
		  } else if (typeof el === 'string') {
		    var selector = el
		    el = document.querySelector(el)
		    if (!el) {
		      _.warn('Cannot find element: ' + selector)
		      return
		    }
		  }
		  this._compile(el)
		  this._isCompiled = true
		  this._callHook('compiled')
		  if (_.inDoc(this.$el)) {
		    this._callHook('attached')
		    this._initDOMHooks()
		    ready.call(this)
		  } else {
		    this._initDOMHooks()
		    this.$once('hook:attached', ready)
		  }
		  return this
		}

		/**
		 * Mark an instance as ready.
		 */

		function ready () {
		  this._isAttached = true
		  this._isReady = true
		  this._callHook('ready')
		}

		/**
		 * Teardown the instance, simply delegate to the internal
		 * _destroy.
		 */

		exports.$destroy = function (remove, deferCleanup) {
		  this._destroy(remove, deferCleanup)
		}

		/**
		 * Partially compile a piece of DOM and return a
		 * decompile function.
		 *
		 * @param {Element|DocumentFragment} el
		 * @return {Function}
		 */

		exports.$compile = function (el) {
		  return compile(el, this.$options, true)(this, el)
		}

	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		// manipulation directives
		exports.text       = __webpack_require__(22)
		exports.html       = __webpack_require__(23)
		exports.attr       = __webpack_require__(24)
		exports.show       = __webpack_require__(25)
		exports['class']   = __webpack_require__(26)
		exports.el         = __webpack_require__(27)
		exports.ref        = __webpack_require__(28)
		exports.cloak      = __webpack_require__(29)
		exports.style      = __webpack_require__(30)
		exports.partial    = __webpack_require__(31)
		exports.transition = __webpack_require__(32)

		// event listener directives
		exports.on         = __webpack_require__(33)
		exports.model      = __webpack_require__(50)

		// child vm directives
		exports.component  = __webpack_require__(34)
		exports.repeat     = __webpack_require__(35)
		exports['if']      = __webpack_require__(36)

		// child vm communication directives
		exports['with']    = __webpack_require__(37)
		exports.events     = __webpack_require__(38)

	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		/**
		 * Stringify value.
		 *
		 * @param {Number} indent
		 */

		exports.json = {
		  read: function (value, indent) {
		    return typeof value === 'string'
		      ? value
		      : JSON.stringify(value, null, Number(indent) || 2)
		  },
		  write: function (value) {
		    try {
		      return JSON.parse(value)
		    } catch (e) {
		      return value
		    }
		  }
		}

		/**
		 * 'abc' => 'Abc'
		 */

		exports.capitalize = function (value) {
		  if (!value && value !== 0) return ''
		  value = value.toString()
		  return value.charAt(0).toUpperCase() + value.slice(1)
		}

		/**
		 * 'abc' => 'ABC'
		 */

		exports.uppercase = function (value) {
		  return (value || value === 0)
		    ? value.toString().toUpperCase()
		    : ''
		}

		/**
		 * 'AbC' => 'abc'
		 */

		exports.lowercase = function (value) {
		  return (value || value === 0)
		    ? value.toString().toLowerCase()
		    : ''
		}

		/**
		 * 12345 => $12,345.00
		 *
		 * @param {String} sign
		 */

		var digitsRE = /(\d{3})(?=\d)/g

		exports.currency = function (value, sign) {
		  value = parseFloat(value)
		  if (!value && value !== 0) return ''
		  sign = sign || '$'
		  var s = Math.floor(Math.abs(value)).toString(),
		    i = s.length % 3,
		    h = i > 0
		      ? (s.slice(0, i) + (s.length > 3 ? ',' : ''))
		      : '',
		    f = '.' + value.toFixed(2).slice(-2)
		  return (value < 0 ? '-' : '') +
		    sign + h + s.slice(i).replace(digitsRE, '$1,') + f
		}

		/**
		 * 'item' => 'items'
		 *
		 * @params
		 *  an array of strings corresponding to
		 *  the single, double, triple ... forms of the word to
		 *  be pluralized. When the number to be pluralized
		 *  exceeds the length of the args, it will use the last
		 *  entry in the array.
		 *
		 *  e.g. ['single', 'double', 'triple', 'multiple']
		 */

		exports.pluralize = function (value) {
		  var args = _.toArray(arguments, 1)
		  return args.length > 1
		    ? (args[value % 10 - 1] || args[args.length - 1])
		    : (args[0] + (value === 1 ? '' : 's'))
		}

		/**
		 * A special filter that takes a handler function,
		 * wraps it so it only gets triggered on specific
		 * keypresses. v-on only.
		 *
		 * @param {String} key
		 */

		var keyCodes = {
		  enter    : 13,
		  tab      : 9,
		  'delete' : 46,
		  up       : 38,
		  left     : 37,
		  right    : 39,
		  down     : 40,
		  esc      : 27
		}

		exports.key = function (handler, key) {
		  if (!handler) return
		  var code = keyCodes[key]
		  if (!code) {
		    code = parseInt(key, 10)
		  }
		  return function (e) {
		    if (e.keyCode === code) {
		      return handler.call(this, e)
		    }
		  }
		}

		// expose keycode hash
		exports.key.keyCodes = keyCodes

		/**
		 * Install special array filters
		 */

		_.extend(exports, __webpack_require__(39))

	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		var mergeOptions = __webpack_require__(19)

		/**
		 * The main init sequence. This is called for every
		 * instance, including ones that are created from extended
		 * constructors.
		 *
		 * @param {Object} options - this options object should be
		 *                           the result of merging class
		 *                           options and the options passed
		 *                           in to the constructor.
		 */

		exports._init = function (options) {

		  options = options || {}

		  this.$el           = null
		  this.$parent       = options._parent
		  this.$root         = options._root || this
		  this.$             = {} // child vm references
		  this.$$            = {} // element references
		  this._watcherList  = [] // all watchers as an array
		  this._watchers     = {} // internal watchers as a hash
		  this._userWatchers = {} // user watchers as a hash
		  this._directives   = [] // all directives

		  // a flag to avoid this being observed
		  this._isVue = true

		  // events bookkeeping
		  this._events         = {}    // registered callbacks
		  this._eventsCount    = {}    // for $broadcast optimization
		  this._eventCancelled = false // for event cancellation

		  // block instance properties
		  this._isBlock     = false
		  this._blockStart  =          // @type {CommentNode}
		  this._blockEnd    = null     // @type {CommentNode}

		  // lifecycle state
		  this._isCompiled  =
		  this._isDestroyed =
		  this._isReady     =
		  this._isAttached  =
		  this._isBeingDestroyed = false

		  // children
		  this._children =         // @type {Array}
		  this._childCtors = null  // @type {Object} - hash to cache
		                           // child constructors

		  // merge options.
		  options = this.$options = mergeOptions(
		    this.constructor.options,
		    options,
		    this
		  )

		  // set data after merge.
		  this._data = options.data || {}

		  // initialize data observation and scope inheritance.
		  this._initScope()

		  // setup event system and option events.
		  this._initEvents()

		  // call created hook
		  this._callHook('created')

		  // if `el` option is passed, start compilation.
		  if (options.el) {
		    this.$mount(options.el)
		  }
		}

	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var inDoc = _.inDoc

		/**
		 * Setup the instance's option events & watchers.
		 * If the value is a string, we pull it from the
		 * instance's methods by name.
		 */

		exports._initEvents = function () {
		  var options = this.$options
		  registerCallbacks(this, '$on', options.events)
		  registerCallbacks(this, '$watch', options.watch)
		}

		/**
		 * Register callbacks for option events and watchers.
		 *
		 * @param {Vue} vm
		 * @param {String} action
		 * @param {Object} hash
		 */

		function registerCallbacks (vm, action, hash) {
		  if (!hash) return
		  var handlers, key, i, j
		  for (key in hash) {
		    handlers = hash[key]
		    if (_.isArray(handlers)) {
		      for (i = 0, j = handlers.length; i < j; i++) {
		        register(vm, action, key, handlers[i])
		      }
		    } else {
		      register(vm, action, key, handlers)
		    }
		  }
		}

		/**
		 * Helper to register an event/watch callback.
		 *
		 * @param {Vue} vm
		 * @param {String} action
		 * @param {String} key
		 * @param {*} handler
		 */

		function register (vm, action, key, handler) {
		  var type = typeof handler
		  if (type === 'function') {
		    vm[action](key, handler)
		  } else if (type === 'string') {
		    var methods = vm.$options.methods
		    var method = methods && methods[handler]
		    if (method) {
		      vm[action](key, method)
		    } else {
		      _.warn(
		        'Unknown method: "' + handler + '" when ' +
		        'registering callback for ' + action +
		        ': "' + key + '".'
		      )
		    }
		  }
		}

		/**
		 * Setup recursive attached/detached calls
		 */

		exports._initDOMHooks = function () {
		  this.$on('hook:attached', onAttached)
		  this.$on('hook:detached', onDetached)
		}

		/**
		 * Callback to recursively call attached hook on children
		 */

		function onAttached () {
		  this._isAttached = true
		  var children = this._children
		  if (!children) return
		  for (var i = 0, l = children.length; i < l; i++) {
		    var child = children[i]
		    if (!child._isAttached && inDoc(child.$el)) {
		      child._callHook('attached')
		    }
		  }
		}

		/**
		 * Callback to recursively call detached hook on children
		 */

		function onDetached () {
		  this._isAttached = false
		  var children = this._children
		  if (!children) return
		  for (var i = 0, l = children.length; i < l; i++) {
		    var child = children[i]
		    if (child._isAttached && !inDoc(child.$el)) {
		      child._callHook('detached')
		    }
		  }
		}

		/**
		 * Trigger all handlers for a hook
		 *
		 * @param {String} hook
		 */

		exports._callHook = function (hook) {
		  var handlers = this.$options[hook]
		  if (handlers) {
		    for (var i = 0, j = handlers.length; i < j; i++) {
		      handlers[i].call(this)
		    }
		  }
		  this.$emit('hook:' + hook)
		}

	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Observer = __webpack_require__(51)
		var Dep = __webpack_require__(40)

		/**
		 * Setup the scope of an instance, which contains:
		 * - observed data
		 * - computed properties
		 * - user methods
		 * - meta properties
		 */

		exports._initScope = function () {
		  this._initData()
		  this._initComputed()
		  this._initMethods()
		  this._initMeta()
		}

		/**
		 * Initialize the data. 
		 */

		exports._initData = function () {
		  // proxy data on instance
		  var data = this._data
		  var keys = Object.keys(data)
		  var i = keys.length
		  var key
		  while (i--) {
		    key = keys[i]
		    if (!_.isReserved(key)) {
		      this._proxy(key)
		    }
		  }
		  // observe data
		  Observer.create(data).addVm(this)
		}

		/**
		 * Swap the isntance's $data. Called in $data's setter.
		 *
		 * @param {Object} newData
		 */

		exports._setData = function (newData) {
		  newData = newData || {}
		  var oldData = this._data
		  this._data = newData
		  var keys, key, i
		  // unproxy keys not present in new data
		  keys = Object.keys(oldData)
		  i = keys.length
		  while (i--) {
		    key = keys[i]
		    if (!_.isReserved(key) && !(key in newData)) {
		      this._unproxy(key)
		    }
		  }
		  // proxy keys not already proxied,
		  // and trigger change for changed values
		  keys = Object.keys(newData)
		  i = keys.length
		  while (i--) {
		    key = keys[i]
		    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
		      // new property
		      this._proxy(key)
		    }
		  }
		  oldData.__ob__.removeVm(this)
		  Observer.create(newData).addVm(this)
		  this._digest()
		}

		/**
		 * Proxy a property, so that
		 * vm.prop === vm._data.prop
		 *
		 * @param {String} key
		 */

		exports._proxy = function (key) {
		  // need to store ref to self here
		  // because these getter/setters might
		  // be called by child instances!
		  var self = this
		  Object.defineProperty(self, key, {
		    configurable: true,
		    enumerable: true,
		    get: function proxyGetter () {
		      return self._data[key]
		    },
		    set: function proxySetter (val) {
		      self._data[key] = val
		    }
		  })
		}

		/**
		 * Unproxy a property.
		 *
		 * @param {String} key
		 */

		exports._unproxy = function (key) {
		  delete this[key]
		}

		/**
		 * Force update on every watcher in scope.
		 */

		exports._digest = function () {
		  var i = this._watcherList.length
		  while (i--) {
		    this._watcherList[i].update()
		  }
		  var children = this._children
		  var child
		  if (children) {
		    i = children.length
		    while (i--) {
		      child = children[i]
		      if (child.$options.inherit) {
		        child._digest()
		      }
		    }
		  }
		}

		/**
		 * Setup computed properties. They are essentially
		 * special getter/setters
		 */

		function noop () {}
		exports._initComputed = function () {
		  var computed = this.$options.computed
		  if (computed) {
		    for (var key in computed) {
		      var userDef = computed[key]
		      var def = {
		        enumerable: true,
		        configurable: true
		      }
		      if (typeof userDef === 'function') {
		        def.get = _.bind(userDef, this)
		        def.set = noop
		      } else {
		        def.get = userDef.get
		          ? _.bind(userDef.get, this)
		          : noop
		        def.set = userDef.set
		          ? _.bind(userDef.set, this)
		          : noop
		      }
		      Object.defineProperty(this, key, def)
		    }
		  }
		}

		/**
		 * Setup instance methods. Methods must be bound to the
		 * instance since they might be called by children
		 * inheriting them.
		 */

		exports._initMethods = function () {
		  var methods = this.$options.methods
		  if (methods) {
		    for (var key in methods) {
		      this[key] = _.bind(methods[key], this)
		    }
		  }
		}

		/**
		 * Initialize meta information like $index, $key & $value.
		 */

		exports._initMeta = function () {
		  var metas = this.$options._meta
		  if (metas) {
		    for (var key in metas) {
		      this._defineMeta(key, metas[key])
		    }
		  }
		}

		/**
		 * Define a meta property, e.g $index, $key, $value
		 * which only exists on the vm instance but not in $data.
		 *
		 * @param {String} key
		 * @param {*} value
		 */

		exports._defineMeta = function (key, value) {
		  var dep = new Dep()
		  Object.defineProperty(this, key, {
		    enumerable: true,
		    configurable: true,
		    get: function metaGetter () {
		      if (Observer.target) {
		        Observer.target.addDep(dep)
		      }
		      return value
		    },
		    set: function metaSetter (val) {
		      if (val !== value) {
		        value = val
		        dep.notify()
		      }
		    }
		  })
		}

	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Directive = __webpack_require__(41)
		var compile = __webpack_require__(42)
		var transclude = __webpack_require__(43)

		/**
		 * Transclude, compile and link element.
		 *
		 * If a pre-compiled linker is available, that means the
		 * passed in element will be pre-transcluded and compiled
		 * as well - all we need to do is to call the linker.
		 *
		 * Otherwise we need to call transclude/compile/link here.
		 *
		 * @param {Element} el
		 * @return {Element}
		 */

		exports._compile = function (el) {
		  var options = this.$options
		  var parent = options._parent
		  if (options._linkFn) {
		    this._initElement(el)
		    options._linkFn(this, el)
		  } else {
		    var raw = el
		    if (options._asComponent) {
		      // separate container element and content
		      var content = options._content = _.extractContent(raw)
		      // create two separate linekrs for container and content
		      var parentOptions = parent.$options
		      
		      // hack: we need to skip the paramAttributes for this
		      // child instance when compiling its parent container
		      // linker. there could be a better way to do this.
		      parentOptions._skipAttrs = options.paramAttributes
		      var containerLinkFn =
		        compile(raw, parentOptions, true, true)
		      parentOptions._skipAttrs = null

		      if (content) {
		        var contentLinkFn =
		          compile(content, parentOptions, true)
		        // call content linker now, before transclusion
		        this._contentUnlinkFn = contentLinkFn(parent, content)
		      }
		      // tranclude, this possibly replaces original
		      el = transclude(el, options)
		      this._initElement(el)
		      // now call the container linker on the resolved el
		      this._containerUnlinkFn = containerLinkFn(parent, el)
		    } else {
		      // simply transclude
		      el = transclude(el, options)
		      this._initElement(el)
		    }
		    var linkFn = compile(el, options)
		    linkFn(this, el)
		    if (options.replace) {
		      _.replace(raw, el)
		    }
		  }
		  return el
		}

		/**
		 * Initialize instance element. Called in the public
		 * $mount() method.
		 *
		 * @param {Element} el
		 */

		exports._initElement = function (el) {
		  if (el instanceof DocumentFragment) {
		    this._isBlock = true
		    this.$el = this._blockStart = el.firstChild
		    this._blockEnd = el.lastChild
		    this._blockFragment = el
		  } else {
		    this.$el = el
		  }
		  this.$el.__vue__ = this
		  this._callHook('beforeCompile')
		}

		/**
		 * Create and bind a directive to an element.
		 *
		 * @param {String} name - directive name
		 * @param {Node} node   - target node
		 * @param {Object} desc - parsed directive descriptor
		 * @param {Object} def  - directive definition object
		 */

		exports._bindDir = function (name, node, desc, def) {
		  this._directives.push(
		    new Directive(name, node, this, desc, def)
		  )
		}

		/**
		 * Teardown an instance, unobserves the data, unbind all the
		 * directives, turn off all the event listeners, etc.
		 *
		 * @param {Boolean} remove - whether to remove the DOM node.
		 * @param {Boolean} deferCleanup - if true, defer cleanup to
		 *                                 be called later
		 */

		exports._destroy = function (remove, deferCleanup) {
		  if (this._isBeingDestroyed) {
		    return
		  }
		  this._callHook('beforeDestroy')
		  this._isBeingDestroyed = true
		  var i
		  // remove self from parent. only necessary
		  // if parent is not being destroyed as well.
		  var parent = this.$parent
		  if (parent && !parent._isBeingDestroyed) {
		    i = parent._children.indexOf(this)
		    parent._children.splice(i, 1)
		  }
		  // destroy all children.
		  if (this._children) {
		    i = this._children.length
		    while (i--) {
		      this._children[i].$destroy()
		    }
		  }
		  // teardown parent linkers
		  if (this._containerUnlinkFn) {
		    this._containerUnlinkFn()
		  }
		  if (this._contentUnlinkFn) {
		    this._contentUnlinkFn()
		  }
		  // teardown all directives. this also tearsdown all
		  // directive-owned watchers. intentionally check for
		  // directives array length on every loop since directives
		  // that manages partial compilation can splice ones out
		  for (i = 0; i < this._directives.length; i++) {
		    this._directives[i]._teardown()
		  }
		  // teardown all user watchers.
		  for (i in this._userWatchers) {
		    this._userWatchers[i].teardown()
		  }
		  // remove reference to self on $el
		  if (this.$el) {
		    this.$el.__vue__ = null
		  }
		  // remove DOM element
		  var self = this
		  if (remove && this.$el) {
		    this.$remove(function () {
		      self._cleanup()
		    })
		  } else if (!deferCleanup) {
		    this._cleanup()
		  }
		}

		/**
		 * Clean up to ensure garbage collection.
		 * This is called after the leave transition if there
		 * is any.
		 */

		exports._cleanup = function () {
		  // remove reference from data ob
		  this._data.__ob__.removeVm(this)
		  this._data =
		  this._watchers =
		  this._userWatchers =
		  this._watcherList =
		  this.$el =
		  this.$parent =
		  this.$root =
		  this._children =
		  this._directives = null
		  // call the last hook...
		  this._isDestroyed = true
		  this._callHook('destroyed')
		  // turn off all instance listeners.
		  this.$off()
		}

	/***/ },
	/* 14 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Check is a string starts with $ or _
		 *
		 * @param {String} str
		 * @return {Boolean}
		 */

		exports.isReserved = function (str) {
		  var c = str.charCodeAt(0)
		  return c === 0x24 || c === 0x5F
		}

		/**
		 * Guard text output, make sure undefined outputs
		 * empty string
		 *
		 * @param {*} value
		 * @return {String}
		 */

		exports.toString = function (value) {
		  return value == null
		    ? ''
		    : value.toString()
		}

		/**
		 * Check and convert possible numeric numbers before
		 * setting back to data
		 *
		 * @param {*} value
		 * @return {*|Number}
		 */

		exports.toNumber = function (value) {
		  return (
		    isNaN(value) ||
		    value === null ||
		    typeof value === 'boolean'
		  ) ? value
		    : Number(value)
		}

		/**
		 * Strip quotes from a string
		 *
		 * @param {String} str
		 * @return {String | false}
		 */

		exports.stripQuotes = function (str) {
		  var a = str.charCodeAt(0)
		  var b = str.charCodeAt(str.length - 1)
		  return a === b && (a === 0x22 || a === 0x27)
		    ? str.slice(1, -1)
		    : false
		}

		/**
		 * Camelize a hyphen-delmited string.
		 *
		 * @param {String} str
		 * @return {String}
		 */

		var camelRE = /[-_](\w)/g
		var capitalCamelRE = /(?:^|[-_])(\w)/g

		exports.camelize = function (str, cap) {
		  var RE = cap ? capitalCamelRE : camelRE
		  return str.replace(RE, function (_, c) {
		    return c ? c.toUpperCase () : ''
		  })
		}

		/**
		 * Simple bind, faster than native
		 *
		 * @param {Function} fn
		 * @param {Object} ctx
		 * @return {Function}
		 */

		exports.bind = function (fn, ctx) {
		  return function () {
		    return fn.apply(ctx, arguments)
		  }
		}

		/**
		 * Convert an Array-like object to a real Array.
		 *
		 * @param {Array-like} list
		 * @param {Number} [start] - start index
		 * @return {Array}
		 */

		exports.toArray = function (list, start) {
		  start = start || 0
		  var i = list.length - start
		  var ret = new Array(i)
		  while (i--) {
		    ret[i] = list[i + start]
		  }
		  return ret
		}

		/**
		 * Mix properties into target object.
		 *
		 * @param {Object} to
		 * @param {Object} from
		 */

		exports.extend = function (to, from) {
		  for (var key in from) {
		    to[key] = from[key]
		  }
		  return to
		}

		/**
		 * Quick object check - this is primarily used to tell
		 * Objects from primitive values when we know the value
		 * is a JSON-compliant type.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */

		exports.isObject = function (obj) {
		  return obj && typeof obj === 'object'
		}

		/**
		 * Strict object type check. Only returns true
		 * for plain JavaScript objects.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */

		var toString = Object.prototype.toString
		exports.isPlainObject = function (obj) {
		  return toString.call(obj) === '[object Object]'
		}

		/**
		 * Array type check.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */

		exports.isArray = function (obj) {
		  return Array.isArray(obj)
		}

		/**
		 * Define a non-enumerable property
		 *
		 * @param {Object} obj
		 * @param {String} key
		 * @param {*} val
		 * @param {Boolean} [enumerable]
		 */

		exports.define = function (obj, key, val, enumerable) {
		  Object.defineProperty(obj, key, {
		    value        : val,
		    enumerable   : !!enumerable,
		    writable     : true,
		    configurable : true
		  })
		}

	/***/ },
	/* 15 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Can we use __proto__?
		 *
		 * @type {Boolean}
		 */

		exports.hasProto = '__proto__' in {}

		/**
		 * Indicates we have a window
		 *
		 * @type {Boolean}
		 */

		var toString = Object.prototype.toString
		var inBrowser = exports.inBrowser =
		  typeof window !== 'undefined' &&
		  toString.call(window) !== '[object Object]'

		/**
		 * Defer a task to the start of the next event loop
		 *
		 * @param {Function} cb
		 * @param {Object} ctx
		 */

		var defer = inBrowser
		  ? (window.requestAnimationFrame ||
		    window.webkitRequestAnimationFrame ||
		    setTimeout)
		  : setTimeout

		exports.nextTick = function (cb, ctx) {
		  if (ctx) {
		    defer(function () { cb.call(ctx) }, 0)
		  } else {
		    defer(cb, 0)
		  }
		}

		/**
		 * Detect if we are in IE9...
		 *
		 * @type {Boolean}
		 */

		exports.isIE9 =
		  inBrowser &&
		  navigator.userAgent.indexOf('MSIE 9.0') > 0

		/**
		 * Sniff transition/animation events
		 */

		if (inBrowser && !exports.isIE9) {
		  var isWebkitTrans =
		    window.ontransitionend === undefined &&
		    window.onwebkittransitionend !== undefined
		  var isWebkitAnim =
		    window.onanimationend === undefined &&
		    window.onwebkitanimationend !== undefined
		  exports.transitionProp = isWebkitTrans
		    ? 'WebkitTransition'
		    : 'transition'
		  exports.transitionEndEvent = isWebkitTrans
		    ? 'webkitTransitionEnd'
		    : 'transitionend'
		  exports.animationProp = isWebkitAnim
		    ? 'WebkitAnimation'
		    : 'animation'
		  exports.animationEndEvent = isWebkitAnim
		    ? 'webkitAnimationEnd'
		    : 'animationend'
		}

	/***/ },
	/* 16 */
	/***/ function(module, exports, __webpack_require__) {

		var config = __webpack_require__(20)

		/**
		 * Check if a node is in the document.
		 *
		 * @param {Node} node
		 * @return {Boolean}
		 */

		var doc =
		  typeof document !== 'undefined' &&
		  document.documentElement

		exports.inDoc = function (node) {
		  return doc && doc.contains(node)
		}

		/**
		 * Extract an attribute from a node.
		 *
		 * @param {Node} node
		 * @param {String} attr
		 */

		exports.attr = function (node, attr) {
		  attr = config.prefix + attr
		  var val = node.getAttribute(attr)
		  if (val !== null) {
		    node.removeAttribute(attr)
		  }
		  return val
		}

		/**
		 * Insert el before target
		 *
		 * @param {Element} el
		 * @param {Element} target 
		 */

		exports.before = function (el, target) {
		  target.parentNode.insertBefore(el, target)
		}

		/**
		 * Insert el after target
		 *
		 * @param {Element} el
		 * @param {Element} target 
		 */

		exports.after = function (el, target) {
		  if (target.nextSibling) {
		    exports.before(el, target.nextSibling)
		  } else {
		    target.parentNode.appendChild(el)
		  }
		}

		/**
		 * Remove el from DOM
		 *
		 * @param {Element} el
		 */

		exports.remove = function (el) {
		  el.parentNode.removeChild(el)
		}

		/**
		 * Prepend el to target
		 *
		 * @param {Element} el
		 * @param {Element} target 
		 */

		exports.prepend = function (el, target) {
		  if (target.firstChild) {
		    exports.before(el, target.firstChild)
		  } else {
		    target.appendChild(el)
		  }
		}

		/**
		 * Replace target with el
		 *
		 * @param {Element} target
		 * @param {Element} el
		 */

		exports.replace = function (target, el) {
		  var parent = target.parentNode
		  if (parent) {
		    parent.replaceChild(el, target)
		  }
		}

		/**
		 * Copy attributes from one element to another.
		 *
		 * @param {Element} from
		 * @param {Element} to
		 */

		exports.copyAttributes = function (from, to) {
		  if (from.hasAttributes()) {
		    var attrs = from.attributes
		    for (var i = 0, l = attrs.length; i < l; i++) {
		      var attr = attrs[i]
		      to.setAttribute(attr.name, attr.value)
		    }
		  }
		}

		/**
		 * Add event listener shorthand.
		 *
		 * @param {Element} el
		 * @param {String} event
		 * @param {Function} cb
		 */

		exports.on = function (el, event, cb) {
		  el.addEventListener(event, cb)
		}

		/**
		 * Remove event listener shorthand.
		 *
		 * @param {Element} el
		 * @param {String} event
		 * @param {Function} cb
		 */

		exports.off = function (el, event, cb) {
		  el.removeEventListener(event, cb)
		}

		/**
		 * Add class with compatibility for IE & SVG
		 *
		 * @param {Element} el
		 * @param {Strong} cls
		 */

		exports.addClass = function (el, cls) {
		  if (el.classList) {
		    el.classList.add(cls)
		  } else {
		    var cur = ' ' + (el.getAttribute('class') || '') + ' '
		    if (cur.indexOf(' ' + cls + ' ') < 0) {
		      el.setAttribute('class', (cur + cls).trim())
		    }
		  }
		}

		/**
		 * Remove class with compatibility for IE & SVG
		 *
		 * @param {Element} el
		 * @param {Strong} cls
		 */

		exports.removeClass = function (el, cls) {
		  if (el.classList) {
		    el.classList.remove(cls)
		  } else {
		    var cur = ' ' + (el.getAttribute('class') || '') + ' '
		    var tar = ' ' + cls + ' '
		    while (cur.indexOf(tar) >= 0) {
		      cur = cur.replace(tar, ' ')
		    }
		    el.setAttribute('class', cur.trim())
		  }
		}

		/**
		 * Extract raw content inside an element into a temporary
		 * container div
		 *
		 * @param {Element} el
		 * @return {Element}
		 */

		exports.extractContent = function (el) {
		  var child
		  var rawContent
		  if (el.hasChildNodes()) {
		    rawContent = document.createElement('div')
		    /* jshint boss:true */
		    while (child = el.firstChild) {
		      rawContent.appendChild(child)
		    }
		  }
		  return rawContent
		}

	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(18)

		/**
		 * Resolve read & write filters for a vm instance. The
		 * filters descriptor Array comes from the directive parser.
		 *
		 * This is extracted into its own utility so it can
		 * be used in multiple scenarios.
		 *
		 * @param {Vue} vm
		 * @param {Array<Object>} filters
		 * @param {Object} [target]
		 * @return {Object}
		 */

		exports.resolveFilters = function (vm, filters, target) {
		  if (!filters) {
		    return
		  }
		  var res = target || {}
		  // var registry = vm.$options.filters
		  filters.forEach(function (f) {
		    var def = vm.$options.filters[f.name]
		    _.assertAsset(def, 'filter', f.name)
		    if (!def) return
		    var args = f.args
		    var reader, writer
		    if (typeof def === 'function') {
		      reader = def
		    } else {
		      reader = def.read
		      writer = def.write
		    }
		    if (reader) {
		      if (!res.read) res.read = []
		      res.read.push(function (value) {
		        return args
		          ? reader.apply(vm, [value].concat(args))
		          : reader.call(vm, value)
		      })
		    }
		    if (writer) {
		      if (!res.write) res.write = []
		      res.write.push(function (value, oldVal) {
		        return args
		          ? writer.apply(vm, [value, oldVal].concat(args))
		          : writer.call(vm, value, oldVal)
		      })
		    }
		  })
		  return res
		}

		/**
		 * Apply filters to a value
		 *
		 * @param {*} value
		 * @param {Array} filters
		 * @param {Vue} vm
		 * @param {*} oldVal
		 * @return {*}
		 */

		exports.applyFilters = function (value, filters, vm, oldVal) {
		  if (!filters) {
		    return value
		  }
		  for (var i = 0, l = filters.length; i < l; i++) {
		    value = filters[i].call(vm, value, oldVal)
		  }
		  return value
		}

	/***/ },
	/* 18 */
	/***/ function(module, exports, __webpack_require__) {

		var config = __webpack_require__(20)

		/**
		 * Enable debug utilities. The enableDebug() function and
		 * all _.log() & _.warn() calls will be dropped in the
		 * minified production build.
		 */

		enableDebug()

		function enableDebug () {
		  var hasConsole = typeof console !== 'undefined'
		  
		  /**
		   * Log a message.
		   *
		   * @param {String} msg
		   */

		  exports.log = function (msg) {
		    if (hasConsole && config.debug) {
		      console.log('[Vue info]: ' + msg)
		    }
		  }

		  /**
		   * We've got a problem here.
		   *
		   * @param {String} msg
		   */

		  exports.warn = function (msg) {
		    if (hasConsole && !config.silent) {
		      console.warn('[Vue warn]: ' + msg)
		      /* istanbul ignore if */
		      if (config.debug) {
		        /* jshint debug: true */
		        debugger
		      } else {
		        console.log(
		          'Set `Vue.config.debug = true` to enable debug mode.'
		        )
		      }
		    }
		  }

		  /**
		   * Assert asset exists
		   */

		  exports.assertAsset = function (val, type, id) {
		    if (!val) {
		      exports.warn('Failed to resolve ' + type + ': ' + id)
		    }
		  }
		}

	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var extend = _.extend

		/**
		 * Option overwriting strategies are functions that handle
		 * how to merge a parent option value and a child option
		 * value into the final value.
		 *
		 * All strategy functions follow the same signature:
		 *
		 * @param {*} parentVal
		 * @param {*} childVal
		 * @param {Vue} [vm]
		 */

		var strats = Object.create(null)

		/**
		 * Helper that recursively merges two data objects together.
		 */

		function mergeData (to, from) {
		  var key, toVal, fromVal
		  for (key in from) {
		    toVal = to[key]
		    fromVal = from[key]
		    if (!to.hasOwnProperty(key)) {
		      to.$add(key, fromVal)
		    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
		      mergeData(toVal, fromVal)
		    }
		  }
		  return to
		}

		/**
		 * Data
		 */

		strats.data = function (parentVal, childVal, vm) {
		  if (!vm) {
		    // in a Vue.extend merge, both should be functions
		    if (!childVal) {
		      return parentVal
		    }
		    if (typeof childVal !== 'function') {
		      _.warn(
		        'The "data" option should be a function ' +
		        'that returns a per-instance value in component ' +
		        'definitions.'
		      )
		      return parentVal
		    }
		    if (!parentVal) {
		      return childVal
		    }
		    // when parentVal & childVal are both present,
		    // we need to return a function that returns the
		    // merged result of both functions... no need to
		    // check if parentVal is a function here because
		    // it has to be a function to pass previous merges.
		    return function mergedDataFn () {
		      return mergeData(
		        childVal.call(this),
		        parentVal.call(this)
		      )
		    }
		  } else {
		    // instance merge, return raw object
		    var instanceData = typeof childVal === 'function'
		      ? childVal.call(vm)
		      : childVal
		    var defaultData = typeof parentVal === 'function'
		      ? parentVal.call(vm)
		      : undefined
		    if (instanceData) {
		      return mergeData(instanceData, defaultData)
		    } else {
		      return defaultData
		    }
		  }
		}

		/**
		 * El
		 */

		strats.el = function (parentVal, childVal, vm) {
		  if (!vm && childVal && typeof childVal !== 'function') {
		    _.warn(
		      'The "el" option should be a function ' +
		      'that returns a per-instance value in component ' +
		      'definitions.'
		    )
		    return
		  }
		  var ret = childVal || parentVal
		  // invoke the element factory if this is instance merge
		  return vm && typeof ret === 'function'
		    ? ret.call(vm)
		    : ret
		}

		/**
		 * Hooks and param attributes are merged as arrays.
		 */

		strats.created =
		strats.ready =
		strats.attached =
		strats.detached =
		strats.beforeCompile =
		strats.compiled =
		strats.beforeDestroy =
		strats.destroyed =
		strats.paramAttributes = function (parentVal, childVal) {
		  return childVal
		    ? parentVal
		      ? parentVal.concat(childVal)
		      : _.isArray(childVal)
		        ? childVal
		        : [childVal]
		    : parentVal
		}

		/**
		 * Assets
		 *
		 * When a vm is present (instance creation), we need to do
		 * a three-way merge between constructor options, instance
		 * options and parent options.
		 */

		strats.directives =
		strats.filters =
		strats.partials =
		strats.transitions =
		strats.components = function (parentVal, childVal, vm, key) {
		  var ret = Object.create(
		    vm && vm.$parent
		      ? vm.$parent.$options[key]
		      : _.Vue.options[key]
		  )
		  if (parentVal) {
		    var keys = Object.keys(parentVal)
		    var i = keys.length
		    var field
		    while (i--) {
		      field = keys[i]
		      ret[field] = parentVal[field]
		    }
		  }
		  if (childVal) extend(ret, childVal)
		  return ret
		}

		/**
		 * Events & Watchers.
		 *
		 * Events & watchers hashes should not overwrite one
		 * another, so we merge them as arrays.
		 */

		strats.watch =
		strats.events = function (parentVal, childVal) {
		  if (!childVal) return parentVal
		  if (!parentVal) return childVal
		  var ret = {}
		  extend(ret, parentVal)
		  for (var key in childVal) {
		    var parent = ret[key]
		    var child = childVal[key]
		    ret[key] = parent
		      ? parent.concat(child)
		      : [child]
		  }
		  return ret
		}

		/**
		 * Other object hashes.
		 */

		strats.methods =
		strats.computed = function (parentVal, childVal) {
		  if (!childVal) return parentVal
		  if (!parentVal) return childVal
		  var ret = Object.create(parentVal)
		  extend(ret, childVal)
		  return ret
		}

		/**
		 * Default strategy.
		 */

		var defaultStrat = function (parentVal, childVal) {
		  return childVal === undefined
		    ? parentVal
		    : childVal
		}

		/**
		 * Make sure component options get converted to actual
		 * constructors.
		 *
		 * @param {Object} components
		 */

		function guardComponents (components) {
		  if (components) {
		    var def
		    for (var key in components) {
		      def = components[key]
		      if (_.isPlainObject(def)) {
		        def.name = key
		        components[key] = _.Vue.extend(def)
		      }
		    }
		  }
		}

		/**
		 * Merge two option objects into a new one.
		 * Core utility used in both instantiation and inheritance.
		 *
		 * @param {Object} parent
		 * @param {Object} child
		 * @param {Vue} [vm] - if vm is present, indicates this is
		 *                     an instantiation merge.
		 */

		module.exports = function mergeOptions (parent, child, vm) {
		  guardComponents(child.components)
		  var options = {}
		  var key
		  if (child.mixins) {
		    for (var i = 0, l = child.mixins.length; i < l; i++) {
		      parent = mergeOptions(parent, child.mixins[i], vm)
		    }
		  }
		  for (key in parent) {
		    merge(key)
		  }
		  for (key in child) {
		    if (!(parent.hasOwnProperty(key))) {
		      merge(key)
		    }
		  }
		  function merge (key) {
		    var strat = strats[key] || defaultStrat
		    options[key] = strat(parent[key], child[key], vm, key)
		  }
		  return options
		}

	/***/ },
	/* 20 */
	/***/ function(module, exports, __webpack_require__) {

		module.exports = {

		  /**
		   * The prefix to look for when parsing directives.
		   *
		   * @type {String}
		   */

		  prefix: 'v-',

		  /**
		   * Whether to print debug messages.
		   * Also enables stack trace for warnings.
		   *
		   * @type {Boolean}
		   */

		  debug: false,

		  /**
		   * Whether to suppress warnings.
		   *
		   * @type {Boolean}
		   */

		  silent: false,

		  /**
		   * Whether allow observer to alter data objects'
		   * __proto__.
		   *
		   * @type {Boolean}
		   */

		  proto: true,

		  /**
		   * Whether to parse mustache tags in templates.
		   *
		   * @type {Boolean}
		   */

		  interpolate: true,

		  /**
		   * Whether to use async rendering.
		   */

		  async: true,

		  /**
		   * Internal flag to indicate the delimiters have been
		   * changed.
		   *
		   * @type {Boolean}
		   */

		  _delimitersChanged: true

		}

		/**
		 * Interpolation delimiters.
		 * We need to mark the changed flag so that the text parser
		 * knows it needs to recompile the regex.
		 *
		 * @type {Array<String>}
		 */

		var delimiters = ['{{', '}}']
		Object.defineProperty(module.exports, 'delimiters', {
		  get: function () {
		    return delimiters
		  },
		  set: function (val) {
		    delimiters = val
		    this._delimitersChanged = true
		  }
		})

	/***/ },
	/* 21 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var config = __webpack_require__(20)
		var Observer = __webpack_require__(51)
		var expParser = __webpack_require__(48)
		var batcher = __webpack_require__(52)
		var uid = 0

		/**
		 * A watcher parses an expression, collects dependencies,
		 * and fires callback when the expression value changes.
		 * This is used for both the $watch() api and directives.
		 *
		 * @param {Vue} vm
		 * @param {String} expression
		 * @param {Function} cb
		 * @param {Object} options
		 *                 - {Array} filters
		 *                 - {Boolean} twoWay
		 *                 - {Boolean} deep
		 *                 - {Boolean} user
		 * @constructor
		 */

		function Watcher (vm, expression, cb, options) {
		  this.vm = vm
		  vm._watcherList.push(this)
		  this.expression = expression
		  this.cbs = [cb]
		  this.id = ++uid // uid for batching
		  this.active = true
		  options = options || {}
		  this.deep = options.deep
		  this.user = options.user
		  this.deps = Object.create(null)
		  // setup filters if any.
		  // We delegate directive filters here to the watcher
		  // because they need to be included in the dependency
		  // collection process.
		  if (options.filters) {
		    this.readFilters = options.filters.read
		    this.writeFilters = options.filters.write
		  }
		  // parse expression for getter/setter
		  var res = expParser.parse(expression, options.twoWay)
		  this.getter = res.get
		  this.setter = res.set
		  this.value = this.get()
		}

		var p = Watcher.prototype

		/**
		 * Add a dependency to this directive.
		 *
		 * @param {Dep} dep
		 */

		p.addDep = function (dep) {
		  var id = dep.id
		  if (!this.newDeps[id]) {
		    this.newDeps[id] = dep
		    if (!this.deps[id]) {
		      this.deps[id] = dep
		      dep.addSub(this)
		    }
		  }
		}

		/**
		 * Evaluate the getter, and re-collect dependencies.
		 */

		p.get = function () {
		  this.beforeGet()
		  var vm = this.vm
		  var value
		  try {
		    value = this.getter.call(vm, vm)
		  } catch (e) {
		    _.warn(
		      'Error when evaluating expression "' +
		      this.expression + '":\n   ' + e
		    )
		  }
		  // "touch" every property so they are all tracked as
		  // dependencies for deep watching
		  if (this.deep) {
		    traverse(value)
		  }
		  value = _.applyFilters(value, this.readFilters, vm)
		  this.afterGet()
		  return value
		}

		/**
		 * Set the corresponding value with the setter.
		 *
		 * @param {*} value
		 */

		p.set = function (value) {
		  var vm = this.vm
		  value = _.applyFilters(
		    value, this.writeFilters, vm, this.value
		  )
		  try {
		    this.setter.call(vm, vm, value)
		  } catch (e) {
		    _.warn(
		      'Error when evaluating setter "' +
		      this.expression + '":\n   ' + e
		    )
		  }
		}

		/**
		 * Prepare for dependency collection.
		 */

		p.beforeGet = function () {
		  Observer.target = this
		  this.newDeps = {}
		}

		/**
		 * Clean up for dependency collection.
		 */

		p.afterGet = function () {
		  Observer.target = null
		  for (var id in this.deps) {
		    if (!this.newDeps[id]) {
		      this.deps[id].removeSub(this)
		    }
		  }
		  this.deps = this.newDeps
		}

		/**
		 * Subscriber interface.
		 * Will be called when a dependency changes.
		 */

		p.update = function () {
		  if (!config.async || config.debug) {
		    this.run()
		  } else {
		    batcher.push(this)
		  }
		}

		/**
		 * Batcher job interface.
		 * Will be called by the batcher.
		 */

		p.run = function () {
		  if (this.active) {
		    var value = this.get()
		    if (
		      (typeof value === 'object' && value !== null) ||
		      value !== this.value
		    ) {
		      var oldValue = this.value
		      this.value = value
		      var cbs = this.cbs
		      for (var i = 0, l = cbs.length; i < l; i++) {
		        cbs[i](value, oldValue)
		        // if a callback also removed other callbacks,
		        // we need to adjust the loop accordingly.
		        var removed = l - cbs.length
		        if (removed) {
		          i -= removed
		          l -= removed
		        }
		      }
		    }
		  }
		}

		/**
		 * Add a callback.
		 *
		 * @param {Function} cb
		 */

		p.addCb = function (cb) {
		  this.cbs.push(cb)
		}

		/**
		 * Remove a callback.
		 *
		 * @param {Function} cb
		 */

		p.removeCb = function (cb) {
		  var cbs = this.cbs
		  if (cbs.length > 1) {
		    var i = cbs.indexOf(cb)
		    if (i > -1) {
		      cbs.splice(i, 1)
		    }
		  } else if (cb === cbs[0]) {
		    this.teardown()
		  }
		}

		/**
		 * Remove self from all dependencies' subcriber list.
		 */

		p.teardown = function () {
		  if (this.active) {
		    // remove self from vm's watcher list
		    // we can skip this if the vm if being destroyed
		    // which can improve teardown performance.
		    if (!this.vm._isBeingDestroyed) {
		      var list = this.vm._watcherList
		      list.splice(list.indexOf(this))
		    }
		    for (var id in this.deps) {
		      this.deps[id].removeSub(this)
		    }
		    this.active = false
		    this.vm = this.cbs = this.value = null
		  }
		}


		/**
		 * Recrusively traverse an object to evoke all converted
		 * getters, so that every nested property inside the object
		 * is collected as a "deep" dependency.
		 *
		 * @param {Object} obj
		 */

		function traverse (obj) {
		  var key, val, i
		  for (key in obj) {
		    val = obj[key]
		    if (_.isArray(val)) {
		      i = val.length
		      while (i--) traverse(val[i])
		    } else if (_.isObject(val)) {
		      traverse(val)
		    }
		  }
		}

		module.exports = Watcher

	/***/ },
	/* 22 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  bind: function () {
		    this.attr = this.el.nodeType === 3
		      ? 'nodeValue'
		      : 'textContent'
		  },

		  update: function (value) {
		    this.el[this.attr] = _.toString(value)
		  }
		  
		}

	/***/ },
	/* 23 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(46)

		module.exports = {

		  bind: function () {
		    // a comment node means this is a binding for
		    // {{{ inline unescaped html }}}
		    if (this.el.nodeType === 8) {
		      // hold nodes
		      this.nodes = []
		    }
		  },

		  update: function (value) {
		    value = _.toString(value)
		    if (this.nodes) {
		      this.swap(value)
		    } else {
		      this.el.innerHTML = value
		    }
		  },

		  swap: function (value) {
		    // remove old nodes
		    var i = this.nodes.length
		    while (i--) {
		      _.remove(this.nodes[i])
		    }
		    // convert new value to a fragment
		    // do not attempt to retrieve from id selector
		    var frag = templateParser.parse(value, true, true)
		    // save a reference to these nodes so we can remove later
		    this.nodes = _.toArray(frag.childNodes)
		    _.before(frag, this.el)
		  }

		}

	/***/ },
	/* 24 */
	/***/ function(module, exports, __webpack_require__) {

		// xlink
		var xlinkNS = 'http://www.w3.org/1999/xlink'
		var xlinkRE = /^xlink:/

		module.exports = {

		  priority: 850,

		  bind: function () {
		    var name = this.arg
		    this.update = xlinkRE.test(name)
		      ? xlinkHandler
		      : defaultHandler
		  }

		}

		function defaultHandler (value) {
		  if (value || value === 0) {
		    this.el.setAttribute(this.arg, value)
		  } else {
		    this.el.removeAttribute(this.arg)
		  }
		}

		function xlinkHandler (value) {
		  if (value != null) {
		    this.el.setAttributeNS(xlinkNS, this.arg, value)
		  } else {
		    this.el.removeAttributeNS(xlinkNS, 'href')
		  }
		}

	/***/ },
	/* 25 */
	/***/ function(module, exports, __webpack_require__) {

		var transition = __webpack_require__(49)

		module.exports = function (value) {
		  var el = this.el
		  transition.apply(el, value ? 1 : -1, function () {
		    el.style.display = value ? '' : 'none'
		  }, this.vm)
		}

	/***/ },
	/* 26 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var addClass = _.addClass
		var removeClass = _.removeClass

		module.exports = function (value) {
		  if (this.arg) {
		    var method = value ? addClass : removeClass
		    method(this.el, this.arg)
		  } else {
		    if (this.lastVal) {
		      removeClass(this.el, this.lastVal)
		    }
		    if (value) {
		      addClass(this.el, value)
		      this.lastVal = value
		    }
		  }
		}

	/***/ },
	/* 27 */
	/***/ function(module, exports, __webpack_require__) {

		module.exports = {

		  isLiteral: true,

		  bind: function () {
		    this.vm.$$[this.expression] = this.el
		  },

		  unbind: function () {
		    delete this.vm.$$[this.expression]
		  }
		  
		}

	/***/ },
	/* 28 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  isLiteral: true,

		  bind: function () {
		    var child = this.el.__vue__
		    if (!child || this.vm !== child.$parent) {
		      _.warn(
		        'v-ref should only be used on a child component ' +
		        'from the parent template.'
		      )
		      return
		    }
		    this.vm.$[this.expression] = child
		  },

		  unbind: function () {
		    if (this.vm.$[this.expression] === this.el.__vue__) {
		      delete this.vm.$[this.expression]
		    }
		  }
		  
		}

	/***/ },
	/* 29 */
	/***/ function(module, exports, __webpack_require__) {

		var config = __webpack_require__(20)

		module.exports = {

		  bind: function () {
		    var el = this.el
		    this.vm.$once('hook:compiled', function () {
		      el.removeAttribute(config.prefix + 'cloak')
		    })
		  }

		}

	/***/ },
	/* 30 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var prefixes = ['-webkit-', '-moz-', '-ms-']
		var camelPrefixes = ['Webkit', 'Moz', 'ms']
		var importantRE = /!important;?$/
		var camelRE = /([a-z])([A-Z])/g
		var testEl = null
		var propCache = {}

		module.exports = {

		  deep: true,

		  update: function (value) {
		    if (this.arg) {
		      this.setProp(this.arg, value)
		    } else {
		      if (typeof value === 'object') {
		        // cache object styles so that only changed props
		        // are actually updated.
		        if (!this.cache) this.cache = {}
		        for (var prop in value) {
		          this.setProp(prop, value[prop])
		          /* jshint eqeqeq: false */
		          if (value[prop] != this.cache[prop]) {
		            this.cache[prop] = value[prop]
		            this.setProp(prop, value[prop])
		          }
		        }
		      } else {
		        this.el.style.cssText = value
		      }
		    }
		  },

		  setProp: function (prop, value) {
		    prop = normalize(prop)
		    if (!prop) return // unsupported prop
		    // cast possible numbers/booleans into strings
		    if (value != null) value += ''
		    if (value) {
		      var isImportant = importantRE.test(value)
		        ? 'important'
		        : ''
		      if (isImportant) {
		        value = value.replace(importantRE, '').trim()
		      }
		      this.el.style.setProperty(prop, value, isImportant)
		    } else {
		      this.el.style.removeProperty(prop)
		    }
		  }

		}

		/**
		 * Normalize a CSS property name.
		 * - cache result
		 * - auto prefix
		 * - camelCase -> dash-case
		 *
		 * @param {String} prop
		 * @return {String}
		 */

		function normalize (prop) {
		  if (propCache[prop]) {
		    return propCache[prop]
		  }
		  var res = prefix(prop)
		  propCache[prop] = propCache[res] = res
		  return res
		}

		/**
		 * Auto detect the appropriate prefix for a CSS property.
		 * https://gist.github.com/paulirish/523692
		 *
		 * @param {String} prop
		 * @return {String}
		 */

		function prefix (prop) {
		  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
		  var camel = _.camelize(prop)
		  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
		  if (!testEl) {
		    testEl = document.createElement('div')
		  }
		  if (camel in testEl.style) {
		    return prop
		  }
		  var i = prefixes.length
		  var prefixed
		  while (i--) {
		    prefixed = camelPrefixes[i] + upper
		    if (prefixed in testEl.style) {
		      return prefixes[i] + prop
		    }
		  }
		}

	/***/ },
	/* 31 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(46)
		var vIf = __webpack_require__(36)

		module.exports = {

		  isLiteral: true,

		  // same logic reuse from v-if
		  compile: vIf.compile,
		  teardown: vIf.teardown,

		  bind: function () {
		    var el = this.el
		    this.start = document.createComment('v-partial-start')
		    this.end = document.createComment('v-partial-end')
		    if (el.nodeType !== 8) {
		      el.innerHTML = ''
		    }
		    if (el.tagName === 'TEMPLATE' || el.nodeType === 8) {
		      _.replace(el, this.end)
		    } else {
		      el.appendChild(this.end)
		    }
		    _.before(this.start, this.end)
		    if (!this._isDynamicLiteral) {
		      this.insert(this.expression)
		    }
		  },

		  update: function (id) {
		    this.teardown()
		    this.insert(id)
		  },

		  insert: function (id) {
		    var partial = this.vm.$options.partials[id]
		    _.assertAsset(partial, 'partial', id)
		    if (partial) {
		      this.compile(templateParser.parse(partial))
		    }
		  }

		}

	/***/ },
	/* 32 */
	/***/ function(module, exports, __webpack_require__) {

		module.exports = {

		  priority: 1000,
		  isLiteral: true,

		  bind: function () {
		    this.el.__v_trans = {
		      id: this.expression
		    }
		  }

		}

	/***/ },
	/* 33 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  acceptStatement: true,
		  priority: 700,

		  bind: function () {
		    // deal with iframes
		    if (
		      this.el.tagName === 'IFRAME' &&
		      this.arg !== 'load'
		    ) {
		      var self = this
		      this.iframeBind = function () {
		        _.on(self.el.contentWindow, self.arg, self.handler)
		      }
		      _.on(this.el, 'load', this.iframeBind)
		    }
		  },

		  update: function (handler) {
		    if (typeof handler !== 'function') {
		      _.warn(
		        'Directive "v-on:' + this.expression + '" ' +
		        'expects a function value.'
		      )
		      return
		    }
		    this.reset()
		    var vm = this.vm
		    this.handler = function (e) {
		      e.targetVM = vm
		      vm.$event = e
		      var res = handler(e)
		      vm.$event = null
		      return res
		    }
		    if (this.iframeBind) {
		      this.iframeBind()
		    } else {
		      _.on(this.el, this.arg, this.handler)
		    }
		  },

		  reset: function () {
		    var el = this.iframeBind
		      ? this.el.contentWindow
		      : this.el
		    if (this.handler) {
		      _.off(el, this.arg, this.handler)
		    }
		  },

		  unbind: function () {
		    this.reset()
		    _.off(this.el, 'load', this.iframeBind)
		  }
		}

	/***/ },
	/* 34 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(46)

		module.exports = {

		  isLiteral: true,

		  /**
		   * Setup. Two possible usages:
		   *
		   * - static:
		   *   v-component="comp"
		   *
		   * - dynamic:
		   *   v-component="{{currentView}}"
		   */

		  bind: function () {
		    if (!this.el.__vue__) {
		      // create a ref anchor
		      this.ref = document.createComment('v-component')
		      _.replace(this.el, this.ref)
		      // check keep-alive options.
		      // If yes, instead of destroying the active vm when
		      // hiding (v-if) or switching (dynamic literal) it,
		      // we simply remove it from the DOM and save it in a
		      // cache object, with its constructor id as the key.
		      this.keepAlive = this._checkParam('keep-alive') != null
		      if (this.keepAlive) {
		        this.cache = {}
		      }
		      // if static, build right now.
		      if (!this._isDynamicLiteral) {
		        this.resolveCtor(this.expression)
		        this.childVM = this.build()
		        this.childVM.$before(this.ref)
		      } else {
		        // check dynamic component params
		        this.readyEvent = this._checkParam('wait-for')
		        this.transMode = this._checkParam('transition-mode')
		      }
		    } else {
		      _.warn(
		        'v-component="' + this.expression + '" cannot be ' +
		        'used on an already mounted instance.'
		      )
		    }
		  },

		  /**
		   * Resolve the component constructor to use when creating
		   * the child vm.
		   */

		  resolveCtor: function (id) {
		    this.ctorId = id
		    this.Ctor = this.vm.$options.components[id]
		    _.assertAsset(this.Ctor, 'component', id)
		  },

		  /**
		   * Instantiate/insert a new child vm.
		   * If keep alive and has cached instance, insert that
		   * instance; otherwise build a new one and cache it.
		   *
		   * @return {Vue} - the created instance
		   */

		  build: function () {
		    if (this.keepAlive) {
		      var cached = this.cache[this.ctorId]
		      if (cached) {
		        return cached
		      }
		    }
		    var vm = this.vm
		    var el = templateParser.clone(this.el)
		    if (this.Ctor) {
		      var child = vm.$addChild({
		        el: el,
		        _asComponent: true
		      }, this.Ctor)
		      if (this.keepAlive) {
		        this.cache[this.ctorId] = child
		      }
		      return child
		    }
		  },

		  /**
		   * Teardown the current child, but defers cleanup so
		   * that we can separate the destroy and removal steps.
		   */

		  unbuild: function () {
		    var child = this.childVM
		    if (!child || this.keepAlive) {
		      return
		    }
		    // the sole purpose of `deferCleanup` is so that we can
		    // "deactivate" the vm right now and perform DOM removal
		    // later.
		    child.$destroy(false, true)
		  },

		  /**
		   * Remove current destroyed child and manually do
		   * the cleanup after removal.
		   *
		   * @param {Function} cb
		   */

		  removeCurrent: function (cb) {
		    var child = this.childVM
		    var keepAlive = this.keepAlive
		    if (child) {
		      child.$remove(function () {
		        if (!keepAlive) child._cleanup()
		        if (cb) cb()
		      })
		    } else if (cb) {
		      cb()
		    }
		  },

		  /**
		   * Update callback for the dynamic literal scenario,
		   * e.g. v-component="{{view}}"
		   */

		  update: function (value) {
		    if (!value) {
		      // just destroy and remove current
		      this.unbuild()
		      this.removeCurrent()
		      this.childVM = null
		    } else {
		      this.resolveCtor(value)
		      this.unbuild()
		      var newComponent = this.build()
		      var self = this
		      if (this.readyEvent) {
		        newComponent.$once(this.readyEvent, function () {
		          self.swapTo(newComponent)
		        })
		      } else {
		        this.swapTo(newComponent)
		      }
		    }
		  },

		  /**
		   * Actually swap the components, depending on the
		   * transition mode. Defaults to simultaneous.
		   *
		   * @param {Vue} target
		   */

		  swapTo: function (target) {
		    var self = this
		    switch (self.transMode) {
		      case 'in-out':
		        target.$before(self.ref, function () {
		          self.removeCurrent()
		          self.childVM = target
		        })
		        break
		      case 'out-in':
		        self.removeCurrent(function () {
		          target.$before(self.ref)
		          self.childVM = target
		        })
		        break
		      default:
		        self.removeCurrent()
		        target.$before(self.ref)
		        self.childVM = target
		    }
		  },

		  /**
		   * Unbind.
		   */

		  unbind: function () {
		    this.unbuild()
		    // destroy all keep-alive cached instances
		    if (this.cache) {
		      for (var key in this.cache) {
		        this.cache[key].$destroy()
		      }
		      this.cache = null
		    }
		  }

		}

	/***/ },
	/* 35 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var isObject = _.isObject
		var textParser = __webpack_require__(45)
		var expParser = __webpack_require__(48)
		var templateParser = __webpack_require__(46)
		var compile = __webpack_require__(42)
		var transclude = __webpack_require__(43)
		var mergeOptions = __webpack_require__(19)
		var uid = 0

		module.exports = {

		  /**
		   * Setup.
		   */

		  bind: function () {
		    // uid as a cache identifier
		    this.id = '__v_repeat_' + (++uid)
		    // we need to insert the objToArray converter
		    // as the first read filter, because it has to be invoked
		    // before any user filters. (can't do it in `update`)
		    if (!this.filters) {
		      this.filters = {}
		    }
		    // add the object -> array convert filter
		    var objectConverter = _.bind(objToArray, this)
		    if (!this.filters.read) {
		      this.filters.read = [objectConverter]
		    } else {
		      this.filters.read.unshift(objectConverter)
		    }
		    // setup ref node
		    this.ref = document.createComment('v-repeat')
		    _.replace(this.el, this.ref)
		    // check if this is a block repeat
		    this.template = this.el.tagName === 'TEMPLATE'
		      ? templateParser.parse(this.el, true)
		      : this.el
		    // check other directives that need to be handled
		    // at v-repeat level
		    this.checkIf()
		    this.checkRef()
		    this.checkComponent()
		    // check for trackby param
		    this.idKey =
		      this._checkParam('track-by') ||
		      this._checkParam('trackby') // 0.11.0 compat
		    // cache for primitive value instances
		    this.cache = Object.create(null)
		  },

		  /**
		   * Warn against v-if usage.
		   */

		  checkIf: function () {
		    if (_.attr(this.el, 'if') !== null) {
		      _.warn(
		        'Don\'t use v-if with v-repeat. ' +
		        'Use v-show or the "filterBy" filter instead.'
		      )
		    }
		  },

		  /**
		   * Check if v-ref/ v-el is also present.
		   */

		  checkRef: function () {
		    var childId = _.attr(this.el, 'ref')
		    this.childId = childId
		      ? this.vm.$interpolate(childId)
		      : null
		    var elId = _.attr(this.el, 'el')
		    this.elId = elId
		      ? this.vm.$interpolate(elId)
		      : null
		  },

		  /**
		   * Check the component constructor to use for repeated
		   * instances. If static we resolve it now, otherwise it
		   * needs to be resolved at build time with actual data.
		   */

		  checkComponent: function () {
		    var id = _.attr(this.el, 'component')
		    var options = this.vm.$options
		    if (!id) {
		      this.Ctor = _.Vue // default constructor
		      this.inherit = true // inline repeats should inherit
		      // important: transclude with no options, just
		      // to ensure block start and block end
		      this.template = transclude(this.template)
		      this._linkFn = compile(this.template, options)
		    } else {
		      this._asComponent = true
		      var tokens = textParser.parse(id)
		      if (!tokens) { // static component
		        var Ctor = this.Ctor = options.components[id]
		        _.assertAsset(Ctor, 'component', id)
		        // If there's no parent scope directives and no
		        // content to be transcluded, we can optimize the
		        // rendering by pre-transcluding + compiling here
		        // and provide a link function to every instance.
		        if (!this.el.hasChildNodes() &&
		            !this.el.hasAttributes()) {
		          // merge an empty object with owner vm as parent
		          // so child vms can access parent assets.
		          var merged = mergeOptions(Ctor.options, {}, {
		            $parent: this.vm
		          })
		          this.template = transclude(this.template, merged)
		          this._linkFn = compile(this.template, merged, false, true)
		        }
		      } else {
		        // to be resolved later
		        var ctorExp = textParser.tokensToExp(tokens)
		        this.ctorGetter = expParser.parse(ctorExp).get
		      }
		    }
		  },

		  /**
		   * Update.
		   * This is called whenever the Array mutates.
		   *
		   * @param {Array} data
		   */

		  update: function (data) {
		    if (typeof data === 'number') {
		      data = range(data)
		    }
		    this.vms = this.diff(data || [], this.vms)
		    // update v-ref
		    if (this.childId) {
		      this.vm.$[this.childId] = this.vms
		    }
		    if (this.elId) {
		      this.vm.$$[this.elId] = this.vms.map(function (vm) {
		        return vm.$el
		      })
		    }
		  },

		  /**
		   * Diff, based on new data and old data, determine the
		   * minimum amount of DOM manipulations needed to make the
		   * DOM reflect the new data Array.
		   *
		   * The algorithm diffs the new data Array by storing a
		   * hidden reference to an owner vm instance on previously
		   * seen data. This allows us to achieve O(n) which is
		   * better than a levenshtein distance based algorithm,
		   * which is O(m * n).
		   *
		   * @param {Array} data
		   * @param {Array} oldVms
		   * @return {Array}
		   */

		  diff: function (data, oldVms) {
		    var idKey = this.idKey
		    var converted = this.converted
		    var ref = this.ref
		    var alias = this.arg
		    var init = !oldVms
		    var vms = new Array(data.length)
		    var obj, raw, vm, i, l
		    // First pass, go through the new Array and fill up
		    // the new vms array. If a piece of data has a cached
		    // instance for it, we reuse it. Otherwise build a new
		    // instance.
		    for (i = 0, l = data.length; i < l; i++) {
		      obj = data[i]
		      raw = converted ? obj.value : obj
		      vm = !init && this.getVm(raw)
		      if (vm) { // reusable instance
		        vm._reused = true
		        vm.$index = i // update $index
		        if (converted) {
		          vm.$key = obj.key // update $key
		        }
		        if (idKey) { // swap track by id data
		          if (alias) {
		            vm[alias] = raw
		          } else {
		            vm._setData(raw)
		          }
		        }
		      } else { // new instance
		        vm = this.build(obj, i)
		        vm._new = true
		      }
		      vms[i] = vm
		      // insert if this is first run
		      if (init) {
		        vm.$before(ref)
		      }
		    }
		    // if this is the first run, we're done.
		    if (init) {
		      return vms
		    }
		    // Second pass, go through the old vm instances and
		    // destroy those who are not reused (and remove them
		    // from cache)
		    for (i = 0, l = oldVms.length; i < l; i++) {
		      vm = oldVms[i]
		      if (!vm._reused) {
		        this.uncacheVm(vm)
		        vm.$destroy(true)
		      }
		    }
		    // final pass, move/insert new instances into the
		    // right place. We're going in reverse here because
		    // insertBefore relies on the next sibling to be
		    // resolved.
		    var targetNext, currentNext
		    i = vms.length
		    while (i--) {
		      vm = vms[i]
		      // this is the vm that we should be in front of
		      targetNext = vms[i + 1]
		      if (!targetNext) {
		        // This is the last item. If it's reused then
		        // everything else will eventually be in the right
		        // place, so no need to touch it. Otherwise, insert
		        // it.
		        if (!vm._reused) {
		          vm.$before(ref)
		        }
		      } else {
		        if (vm._reused) {
		          // this is the vm we are actually in front of
		          currentNext = findNextVm(vm, ref)
		          // we only need to move if we are not in the right
		          // place already.
		          if (currentNext !== targetNext) {
		            vm.$before(targetNext.$el, null, false)
		          }
		        } else {
		          // new instance, insert to existing next
		          vm.$before(targetNext.$el)
		        }
		      }
		      vm._new = false
		      vm._reused = false
		    }
		    return vms
		  },

		  /**
		   * Build a new instance and cache it.
		   *
		   * @param {Object} data
		   * @param {Number} index
		   */

		  build: function (data, index) {
		    var original = data
		    var meta = { $index: index }
		    if (this.converted) {
		      meta.$key = original.key
		    }
		    var raw = this.converted ? data.value : data
		    var alias = this.arg
		    var hasAlias = !isObject(raw) || alias
		    // wrap the raw data with alias
		    data = hasAlias ? {} : raw
		    if (alias) {
		      data[alias] = raw
		    } else if (hasAlias) {
		      meta.$value = raw
		    }
		    // resolve constructor
		    var Ctor = this.Ctor || this.resolveCtor(data, meta)
		    var vm = this.vm.$addChild({
		      el: templateParser.clone(this.template),
		      _asComponent: this._asComponent,
		      _linkFn: this._linkFn,
		      _meta: meta,
		      data: data,
		      inherit: this.inherit
		    }, Ctor)
		    // cache instance
		    this.cacheVm(raw, vm)
		    return vm
		  },

		  /**
		   * Resolve a contructor to use for an instance.
		   * The tricky part here is that there could be dynamic
		   * components depending on instance data.
		   *
		   * @param {Object} data
		   * @param {Object} meta
		   * @return {Function}
		   */

		  resolveCtor: function (data, meta) {
		    // create a temporary context object and copy data
		    // and meta properties onto it.
		    // use _.define to avoid accidentally overwriting scope
		    // properties.
		    var context = Object.create(this.vm)
		    var key
		    for (key in data) {
		      _.define(context, key, data[key])
		    }
		    for (key in meta) {
		      _.define(context, key, meta[key])
		    }
		    var id = this.ctorGetter.call(context, context)
		    var Ctor = this.vm.$options.components[id]
		    _.assertAsset(Ctor, 'component', id)
		    return Ctor
		  },

		  /**
		   * Unbind, teardown everything
		   */

		  unbind: function () {
		    if (this.childId) {
		      delete this.vm.$[this.childId]
		    }
		    if (this.vms) {
		      var i = this.vms.length
		      var vm
		      while (i--) {
		        vm = this.vms[i]
		        this.uncacheVm(vm)
		        vm.$destroy()
		      }
		    }
		  },

		  /**
		   * Cache a vm instance based on its data.
		   *
		   * If the data is an object, we save the vm's reference on
		   * the data object as a hidden property. Otherwise we
		   * cache them in an object and for each primitive value
		   * there is an array in case there are duplicates.
		   *
		   * @param {Object} data
		   * @param {Vue} vm
		   */

		  cacheVm: function (data, vm) {
		    var idKey = this.idKey
		    var cache = this.cache
		    var id
		    if (idKey) {
		      id = data[idKey]
		      if (!cache[id]) {
		        cache[id] = vm
		      } else {
		        _.warn('Duplicate ID in v-repeat: ' + id)
		      }
		    } else if (isObject(data)) {
		      id = this.id
		      if (data.hasOwnProperty(id)) {
		        if (data[id] === null) {
		          data[id] = vm
		        } else {
		          _.warn(
		            'Duplicate objects are not supported in v-repeat.'
		          )
		        }
		      } else {
		        _.define(data, this.id, vm)
		      }
		    } else {
		      if (!cache[data]) {
		        cache[data] = [vm]
		      } else {
		        cache[data].push(vm)
		      }
		    }
		    vm._raw = data
		  },

		  /**
		   * Try to get a cached instance from a piece of data.
		   *
		   * @param {Object} data
		   * @return {Vue|undefined}
		   */

		  getVm: function (data) {
		    if (this.idKey) {
		      return this.cache[data[this.idKey]]
		    } else if (isObject(data)) {
		      return data[this.id]
		    } else {
		      var cached = this.cache[data]
		      if (cached) {
		        var i = 0
		        var vm = cached[i]
		        // since duplicated vm instances might be a reused
		        // one OR a newly created one, we need to return the
		        // first instance that is neither of these.
		        while (vm && (vm._reused || vm._new)) {
		          vm = cached[++i]
		        }
		        return vm
		      }
		    }
		  },

		  /**
		   * Delete a cached vm instance.
		   *
		   * @param {Vue} vm
		   */

		  uncacheVm: function (vm) {
		    var data = vm._raw
		    if (this.idKey) {
		      this.cache[data[this.idKey]] = null
		    } else if (isObject(data)) {
		      data[this.id] = null
		      vm._raw = null
		    } else {
		      this.cache[data].pop()
		    }
		  }

		}

		/**
		 * Helper to find the next element that is an instance
		 * root node. This is necessary because a destroyed vm's
		 * element could still be lingering in the DOM before its
		 * leaving transition finishes, but its __vue__ reference
		 * should have been removed so we can skip them.
		 *
		 * @param {Vue} vm
		 * @param {CommentNode} ref
		 * @return {Vue}
		 */

		function findNextVm (vm, ref) {
		  var el = (vm._blockEnd || vm.$el).nextSibling
		  while (!el.__vue__ && el !== ref) {
		    el = el.nextSibling
		  }
		  return el.__vue__
		}

		/**
		 * Attempt to convert non-Array objects to array.
		 * This is the default filter installed to every v-repeat
		 * directive.
		 *
		 * It will be called with **the directive** as `this`
		 * context so that we can mark the repeat array as converted
		 * from an object.
		 *
		 * @param {*} obj
		 * @return {Array}
		 * @private
		 */

		function objToArray (obj) {
		  if (!_.isPlainObject(obj)) {
		    return obj
		  }
		  var keys = Object.keys(obj)
		  var i = keys.length
		  var res = new Array(i)
		  var key
		  while (i--) {
		    key = keys[i]
		    res[i] = {
		      key: key,
		      value: obj[key]
		    }
		  }
		  // `this` points to the repeat directive instance
		  this.converted = true
		  return res
		}

		/**
		 * Create a range array from given number.
		 *
		 * @param {Number} n
		 * @return {Array}
		 */

		function range (n) {
		  var i = -1
		  var ret = new Array(n)
		  while (++i < n) {
		    ret[i] = i
		  }
		  return ret
		}

	/***/ },
	/* 36 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var compile = __webpack_require__(42)
		var templateParser = __webpack_require__(46)
		var transition = __webpack_require__(49)

		module.exports = {

		  bind: function () {
		    var el = this.el
		    if (!el.__vue__) {
		      this.start = document.createComment('v-if-start')
		      this.end = document.createComment('v-if-end')
		      _.replace(el, this.end)
		      _.before(this.start, this.end)
		      if (el.tagName === 'TEMPLATE') {
		        this.template = templateParser.parse(el, true)
		      } else {
		        this.template = document.createDocumentFragment()
		        this.template.appendChild(el)
		      }
		      // compile the nested partial
		      this.linker = compile(
		        this.template,
		        this.vm.$options,
		        true
		      )
		    } else {
		      this.invalid = true
		      _.warn(
		        'v-if="' + this.expression + '" cannot be ' +
		        'used on an already mounted instance.'
		      )
		    }
		  },

		  update: function (value) {
		    if (this.invalid) return
		    if (value) {
		      this.insert()
		    } else {
		      this.teardown()
		    }
		  },

		  insert: function () {
		    // avoid duplicate inserts, since update() can be
		    // called with different truthy values
		    if (!this.unlink) {
		      this.compile(this.template) 
		    }
		  },

		  compile: function (template) {
		    var vm = this.vm
		    var frag = templateParser.clone(template)
		    var originalChildLength = vm._children
		      ? vm._children.length
		      : 0
		    this.unlink = this.linker
		      ? this.linker(vm, frag)
		      : vm.$compile(frag)
		    transition.blockAppend(frag, this.end, vm)
		    this.children = vm._children
		      ? vm._children.slice(originalChildLength)
		      : null
		    if (this.children && _.inDoc(vm.$el)) {
		      this.children.forEach(function (child) {
		        child._callHook('attached')
		      })
		    }
		  },

		  teardown: function () {
		    if (!this.unlink) return
		    transition.blockRemove(this.start, this.end, this.vm)
		    if (this.children && _.inDoc(this.vm.$el)) {
		      this.children.forEach(function (child) {
		        if (!child._isDestroyed) {
		          child._callHook('detached')
		        }
		      })
		    }
		    this.unlink()
		    this.unlink = null
		  }

		}

	/***/ },
	/* 37 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(21)

		module.exports = {

		  priority: 900,

		  bind: function () {
		    var vm = this.vm
		    if (this.el !== vm.$el) {
		      _.warn(
		        'v-with can only be used on instance root elements.'
		      )
		    } else if (!vm.$parent) {
		      _.warn(
		        'v-with must be used on an instance with a parent.'
		      )
		    } else {
		      var key = this.arg
		      this.watcher = new Watcher(
		        vm.$parent,
		        this.expression,
		        key
		          ? function (val) {
		              vm.$set(key, val)
		            }
		          : function (val) {
		              vm.$data = val
		            }
		      )
		      // initial set
		      var initialVal = this.watcher.value
		      if (key) {
		        vm.$set(key, initialVal)
		      } else {
		        vm.$data = initialVal
		      }
		    }
		  },

		  unbind: function () {
		    if (this.watcher) {
		      this.watcher.teardown()
		    }
		  }

		}

	/***/ },
	/* 38 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = { 

		  bind: function () {
		    var child = this.el.__vue__
		    if (!child || this.vm !== child.$parent) {
		      _.warn(
		        '`v-events` should only be used on a child component ' +
		        'from the parent template.'
		      )
		      return
		    }
		    var method = this.vm[this.expression]
		    if (!method) {
		      _.warn(
		        '`v-events` cannot find method "' + this.expression +
		        '" on the parent instance.'
		      )
		    }
		    child.$on(this.arg, method)
		  }

		  // when child is destroyed, all events are turned off,
		  // so no need for unbind here.

		}

	/***/ },
	/* 39 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Path = __webpack_require__(44)

		/**
		 * Filter filter for v-repeat
		 *
		 * @param {String} searchKey
		 * @param {String} [delimiter]
		 * @param {String} dataKey
		 */

		exports.filterBy = function (arr, searchKey, delimiter, dataKey) {
		  // allow optional `in` delimiter
		  // because why not
		  if (delimiter && delimiter !== 'in') {
		    dataKey = delimiter
		  }
		  // get the search string
		  var search =
		    _.stripQuotes(searchKey) ||
		    this.$get(searchKey)
		  if (!search) {
		    return arr
		  }
		  search = ('' + search).toLowerCase()
		  // get the optional dataKey
		  dataKey =
		    dataKey &&
		    (_.stripQuotes(dataKey) || this.$get(dataKey))
		  return arr.filter(function (item) {
		    return dataKey
		      ? contains(Path.get(item, dataKey), search)
		      : contains(item, search)
		  })
		}

		/**
		 * Filter filter for v-repeat
		 *
		 * @param {String} sortKey
		 * @param {String} reverseKey
		 */

		exports.orderBy = function (arr, sortKey, reverseKey) {
		  var key =
		    _.stripQuotes(sortKey) ||
		    this.$get(sortKey)
		  if (!key) {
		    return arr
		  }
		  var order = 1
		  if (reverseKey) {
		    if (reverseKey === '-1') {
		      order = -1
		    } else if (reverseKey.charCodeAt(0) === 0x21) { // !
		      reverseKey = reverseKey.slice(1)
		      order = this.$get(reverseKey) ? 1 : -1
		    } else {
		      order = this.$get(reverseKey) ? -1 : 1
		    }
		  }
		  // sort on a copy to avoid mutating original array
		  return arr.slice().sort(function (a, b) {
		    a = Path.get(a, key)
		    b = Path.get(b, key)
		    return a === b ? 0 : a > b ? order : -order
		  })
		}

		/**
		 * String contain helper
		 *
		 * @param {*} val
		 * @param {String} search
		 */

		function contains (val, search) {
		  if (_.isObject(val)) {
		    for (var key in val) {
		      if (contains(val[key], search)) {
		        return true
		      }
		    }
		  } else if (val != null) {
		    return val.toString().toLowerCase().indexOf(search) > -1
		  }
		}

	/***/ },
	/* 40 */
	/***/ function(module, exports, __webpack_require__) {

		var uid = 0

		/**
		 * A dep is an observable that can have multiple
		 * directives subscribing to it.
		 *
		 * @constructor
		 */

		function Dep () {
		  this.id = ++uid
		  this.subs = []
		}

		var p = Dep.prototype

		/**
		 * Add a directive subscriber.
		 *
		 * @param {Directive} sub
		 */

		p.addSub = function (sub) {
		  this.subs.push(sub)
		}

		/**
		 * Remove a directive subscriber.
		 *
		 * @param {Directive} sub
		 */

		p.removeSub = function (sub) {
		  if (this.subs.length) {
		    var i = this.subs.indexOf(sub)
		    if (i > -1) this.subs.splice(i, 1)
		  }
		}

		/**
		 * Notify all subscribers of a new value.
		 */

		p.notify = function () {
		  for (var i = 0, l = this.subs.length; i < l; i++) {
		    this.subs[i].update()
		  }
		}

		module.exports = Dep

	/***/ },
	/* 41 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var config = __webpack_require__(20)
		var Watcher = __webpack_require__(21)
		var textParser = __webpack_require__(45)
		var expParser = __webpack_require__(48)

		/**
		 * A directive links a DOM element with a piece of data,
		 * which is the result of evaluating an expression.
		 * It registers a watcher with the expression and calls
		 * the DOM update function when a change is triggered.
		 *
		 * @param {String} name
		 * @param {Node} el
		 * @param {Vue} vm
		 * @param {Object} descriptor
		 *                 - {String} expression
		 *                 - {String} [arg]
		 *                 - {Array<Object>} [filters]
		 * @param {Object} def - directive definition object
		 * @constructor
		 */

		function Directive (name, el, vm, descriptor, def) {
		  // public
		  this.name = name
		  this.el = el
		  this.vm = vm
		  // copy descriptor props
		  this.raw = descriptor.raw
		  this.expression = descriptor.expression
		  this.arg = descriptor.arg
		  this.filters = _.resolveFilters(vm, descriptor.filters)
		  // private
		  this._locked = false
		  this._bound = false
		  // init
		  this._bind(def)
		}

		var p = Directive.prototype

		/**
		 * Initialize the directive, mixin definition properties,
		 * setup the watcher, call definition bind() and update()
		 * if present.
		 *
		 * @param {Object} def
		 */

		p._bind = function (def) {
		  if (this.name !== 'cloak' && this.el.removeAttribute) {
		    this.el.removeAttribute(config.prefix + this.name)
		  }
		  if (typeof def === 'function') {
		    this.update = def
		  } else {
		    _.extend(this, def)
		  }
		  this._watcherExp = this.expression
		  this._checkDynamicLiteral()
		  if (this.bind) {
		    this.bind()
		  }
		  if (
		    this.update && this._watcherExp &&
		    (!this.isLiteral || this._isDynamicLiteral) &&
		    !this._checkStatement()
		  ) {
		    // wrapped updater for context
		    var dir = this
		    var update = this._update = function (val, oldVal) {
		      if (!dir._locked) {
		        dir.update(val, oldVal)
		      }
		    }
		    // use raw expression as identifier because filters
		    // make them different watchers
		    var watcher = this.vm._watchers[this.raw]
		    // v-repeat always creates a new watcher because it has
		    // a special filter that's bound to its directive
		    // instance.
		    if (!watcher || this.name === 'repeat') {
		      watcher = this.vm._watchers[this.raw] = new Watcher(
		        this.vm,
		        this._watcherExp,
		        update, // callback
		        {
		          filters: this.filters,
		          twoWay: this.twoWay,
		          deep: this.deep
		        }
		      )
		    } else {
		      watcher.addCb(update)
		    }
		    this._watcher = watcher
		    if (this._initValue != null) {
		      watcher.set(this._initValue)
		    } else {
		      this.update(watcher.value)
		    }
		  }
		  this._bound = true
		}

		/**
		 * check if this is a dynamic literal binding.
		 *
		 * e.g. v-component="{{currentView}}"
		 */

		p._checkDynamicLiteral = function () {
		  var expression = this.expression
		  if (expression && this.isLiteral) {
		    var tokens = textParser.parse(expression)
		    if (tokens) {
		      var exp = textParser.tokensToExp(tokens)
		      this.expression = this.vm.$get(exp)
		      this._watcherExp = exp
		      this._isDynamicLiteral = true
		    }
		  }
		}

		/**
		 * Check if the directive is a function caller
		 * and if the expression is a callable one. If both true,
		 * we wrap up the expression and use it as the event
		 * handler.
		 *
		 * e.g. v-on="click: a++"
		 *
		 * @return {Boolean}
		 */

		p._checkStatement = function () {
		  var expression = this.expression
		  if (
		    expression && this.acceptStatement &&
		    !expParser.pathTestRE.test(expression)
		  ) {
		    var fn = expParser.parse(expression).get
		    var vm = this.vm
		    var handler = function () {
		      fn.call(vm, vm)
		    }
		    if (this.filters) {
		      handler = _.applyFilters(
		        handler,
		        this.filters.read,
		        vm
		      )
		    }
		    this.update(handler)
		    return true
		  }
		}

		/**
		 * Check for an attribute directive param, e.g. lazy
		 *
		 * @param {String} name
		 * @return {String}
		 */

		p._checkParam = function (name) {
		  var param = this.el.getAttribute(name)
		  if (param !== null) {
		    this.el.removeAttribute(name)
		  }
		  return param
		}

		/**
		 * Teardown the watcher and call unbind.
		 */

		p._teardown = function () {
		  if (this._bound) {
		    if (this.unbind) {
		      this.unbind()
		    }
		    var watcher = this._watcher
		    if (watcher && watcher.active) {
		      watcher.removeCb(this._update)
		      if (!watcher.active) {
		        this.vm._watchers[this.raw] = null
		      }
		    }
		    this._bound = false
		    this.vm = this.el = this._watcher = null
		  }
		}

		/**
		 * Set the corresponding value with the setter.
		 * This should only be used in two-way directives
		 * e.g. v-model.
		 *
		 * @param {*} value
		 * @param {Boolean} lock - prevent wrtie triggering update.
		 * @public
		 */

		p.set = function (value, lock) {
		  if (this.twoWay) {
		    if (lock) {
		      this._locked = true
		    }
		    this._watcher.set(value)
		    if (lock) {
		      var self = this
		      _.nextTick(function () {
		        self._locked = false
		      })
		    }
		  }
		}

		module.exports = Directive

	/***/ },
	/* 42 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var config = __webpack_require__(20)
		var textParser = __webpack_require__(45)
		var dirParser = __webpack_require__(47)
		var templateParser = __webpack_require__(46)

		/**
		 * Compile a template and return a reusable composite link
		 * function, which recursively contains more link functions
		 * inside. This top level compile function should only be
		 * called on instance root nodes.
		 *
		 * When the `asParent` flag is true, this means we are doing
		 * a partial compile for a component's parent scope markup
		 * (See #502). This could **only** be triggered during
		 * compilation of `v-component`, and we need to skip v-with,
		 * v-ref & v-component in this situation.
		 *
		 * @param {Element|DocumentFragment} el
		 * @param {Object} options
		 * @param {Boolean} partial
		 * @param {Boolean} asParent - compiling a component
		 *                             container as its parent.
		 * @return {Function}
		 */

		module.exports = function compile (el, options, partial, asParent) {
		  var params = !partial && options.paramAttributes
		  var paramsLinkFn = params
		    ? compileParamAttributes(el, params, options)
		    : null
		  var nodeLinkFn = el instanceof DocumentFragment
		    ? null
		    : compileNode(el, options, asParent)
		  var childLinkFn =
		    !(nodeLinkFn && nodeLinkFn.terminal) &&
		    el.tagName !== 'SCRIPT' &&
		    el.hasChildNodes()
		      ? compileNodeList(el.childNodes, options)
		      : null

		  /**
		   * A linker function to be called on a already compiled
		   * piece of DOM, which instantiates all directive
		   * instances.
		   *
		   * @param {Vue} vm
		   * @param {Element|DocumentFragment} el
		   * @return {Function|undefined}
		   */

		  return function link (vm, el) {
		    var originalDirCount = vm._directives.length
		    if (paramsLinkFn) paramsLinkFn(vm, el)
		    if (nodeLinkFn) nodeLinkFn(vm, el)
		    if (childLinkFn) childLinkFn(vm, el.childNodes)

		    /**
		     * If this is a partial compile, the linker function
		     * returns an unlink function that tearsdown all
		     * directives instances generated during the partial
		     * linking.
		     */

		    if (partial) {
		      var dirs = vm._directives.slice(originalDirCount)
		      return function unlink () {
		        var i = dirs.length
		        while (i--) {
		          dirs[i]._teardown()
		        }
		        i = vm._directives.indexOf(dirs[0])
		        vm._directives.splice(i, dirs.length)
		      }
		    }
		  }
		}

		/**
		 * Compile a node and return a nodeLinkFn based on the
		 * node type.
		 *
		 * @param {Node} node
		 * @param {Object} options
		 * @param {Boolean} asParent
		 * @return {Function|undefined}
		 */

		function compileNode (node, options, asParent) {
		  var type = node.nodeType
		  if (type === 1 && node.tagName !== 'SCRIPT') {
		    return compileElement(node, options, asParent)
		  } else if (type === 3 && config.interpolate) {
		    return compileTextNode(node, options)
		  }
		}

		/**
		 * Compile an element and return a nodeLinkFn.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @param {Boolean} asParent
		 * @return {Function|null}
		 */

		function compileElement (el, options, asParent) {
		  var linkFn, tag, component
		  // check custom element component, but only on non-root
		  if (!asParent && !el.__vue__) {
		    tag = el.tagName.toLowerCase()
		    component =
		      tag.indexOf('-') > 0 &&
		      options.components[tag]
		    if (component) {
		      el.setAttribute(config.prefix + 'component', tag)
		    }
		  }
		  if (component || el.hasAttributes()) {
		    // check terminal direcitves
		    if (!asParent) {
		      linkFn = checkTerminalDirectives(el, options)
		    }
		    // if not terminal, build normal link function
		    if (!linkFn) {
		      var dirs = collectDirectives(el, options, asParent)
		      linkFn = dirs.length
		        ? makeDirectivesLinkFn(dirs)
		        : null
		    }
		  }
		  // if the element is a textarea, we need to interpolate
		  // its content on initial render.
		  if (el.tagName === 'TEXTAREA') {
		    var realLinkFn = linkFn
		    linkFn = function (vm, el) {
		      el.value = vm.$interpolate(el.value)
		      if (realLinkFn) realLinkFn(vm, el)
		    }
		    linkFn.terminal = true
		  }
		  return linkFn
		}

		/**
		 * Build a multi-directive link function.
		 *
		 * @param {Array} directives
		 * @return {Function} directivesLinkFn
		 */

		function makeDirectivesLinkFn (directives) {
		  return function directivesLinkFn (vm, el) {
		    // reverse apply because it's sorted low to high
		    var i = directives.length
		    var dir, j, k
		    while (i--) {
		      dir = directives[i]
		      if (dir._link) {
		        // custom link fn
		        dir._link(vm, el)
		      } else {
		        k = dir.descriptors.length
		        for (j = 0; j < k; j++) {
		          vm._bindDir(dir.name, el,
		                      dir.descriptors[j], dir.def)
		        }
		      }
		    }
		  }
		}

		/**
		 * Compile a textNode and return a nodeLinkFn.
		 *
		 * @param {TextNode} node
		 * @param {Object} options
		 * @return {Function|null} textNodeLinkFn
		 */

		function compileTextNode (node, options) {
		  var tokens = textParser.parse(node.nodeValue)
		  if (!tokens) {
		    return null
		  }
		  var frag = document.createDocumentFragment()
		  var el, token
		  for (var i = 0, l = tokens.length; i < l; i++) {
		    token = tokens[i]
		    el = token.tag
		      ? processTextToken(token, options)
		      : document.createTextNode(token.value)
		    frag.appendChild(el)
		  }
		  return makeTextNodeLinkFn(tokens, frag, options)
		}

		/**
		 * Process a single text token.
		 *
		 * @param {Object} token
		 * @param {Object} options
		 * @return {Node}
		 */

		function processTextToken (token, options) {
		  var el
		  if (token.oneTime) {
		    el = document.createTextNode(token.value)
		  } else {
		    if (token.html) {
		      el = document.createComment('v-html')
		      setTokenType('html')
		    } else if (token.partial) {
		      el = document.createComment('v-partial')
		      setTokenType('partial')
		    } else {
		      // IE will clean up empty textNodes during
		      // frag.cloneNode(true), so we have to give it
		      // something here...
		      el = document.createTextNode(' ')
		      setTokenType('text')
		    }
		  }
		  function setTokenType (type) {
		    token.type = type
		    token.def = options.directives[type]
		    token.descriptor = dirParser.parse(token.value)[0]
		  }
		  return el
		}

		/**
		 * Build a function that processes a textNode.
		 *
		 * @param {Array<Object>} tokens
		 * @param {DocumentFragment} frag
		 */

		function makeTextNodeLinkFn (tokens, frag) {
		  return function textNodeLinkFn (vm, el) {
		    var fragClone = frag.cloneNode(true)
		    var childNodes = _.toArray(fragClone.childNodes)
		    var token, value, node
		    for (var i = 0, l = tokens.length; i < l; i++) {
		      token = tokens[i]
		      value = token.value
		      if (token.tag) {
		        node = childNodes[i]
		        if (token.oneTime) {
		          value = vm.$eval(value)
		          if (token.html) {
		            _.replace(node, templateParser.parse(value, true))
		          } else {
		            node.nodeValue = value
		          }
		        } else {
		          vm._bindDir(token.type, node,
		                      token.descriptor, token.def)
		        }
		      }
		    }
		    _.replace(el, fragClone)
		  }
		}

		/**
		 * Compile a node list and return a childLinkFn.
		 *
		 * @param {NodeList} nodeList
		 * @param {Object} options
		 * @return {Function|undefined}
		 */

		function compileNodeList (nodeList, options) {
		  var linkFns = []
		  var nodeLinkFn, childLinkFn, node
		  for (var i = 0, l = nodeList.length; i < l; i++) {
		    node = nodeList[i]
		    nodeLinkFn = compileNode(node, options)
		    childLinkFn =
		      !(nodeLinkFn && nodeLinkFn.terminal) &&
		      node.tagName !== 'SCRIPT' &&
		      node.hasChildNodes()
		        ? compileNodeList(node.childNodes, options)
		        : null
		    linkFns.push(nodeLinkFn, childLinkFn)
		  }
		  return linkFns.length
		    ? makeChildLinkFn(linkFns)
		    : null
		}

		/**
		 * Make a child link function for a node's childNodes.
		 *
		 * @param {Array<Function>} linkFns
		 * @return {Function} childLinkFn
		 */

		function makeChildLinkFn (linkFns) {
		  return function childLinkFn (vm, nodes) {
		    // stablize nodes
		    nodes = _.toArray(nodes)
		    var node, nodeLinkFn, childrenLinkFn
		    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
		      node = nodes[n]
		      nodeLinkFn = linkFns[i++]
		      childrenLinkFn = linkFns[i++]
		      if (nodeLinkFn) {
		        nodeLinkFn(vm, node)
		      }
		      if (childrenLinkFn) {
		        childrenLinkFn(vm, node.childNodes)
		      }
		    }
		  }
		}

		/**
		 * Compile param attributes on a root element and return
		 * a paramAttributes link function.
		 *
		 * @param {Element} el
		 * @param {Array} attrs
		 * @param {Object} options
		 * @return {Function} paramsLinkFn
		 */

		function compileParamAttributes (el, attrs, options) {
		  var params = []
		  var i = attrs.length
		  var name, value, param
		  while (i--) {
		    name = attrs[i]
		    value = el.getAttribute(name)
		    if (value !== null) {
		      param = {
		        name: name,
		        value: value
		      }
		      var tokens = textParser.parse(value)
		      if (tokens) {
		        el.removeAttribute(name)
		        if (tokens.length > 1) {
		          _.warn(
		            'Invalid param attribute binding: "' +
		            name + '="' + value + '"' +
		            '\nDon\'t mix binding tags with plain text ' +
		            'in param attribute bindings.'
		          )
		          continue
		        } else {
		          param.dynamic = true
		          param.value = tokens[0].value
		        }
		      }
		      params.push(param)
		    }
		  }
		  return makeParamsLinkFn(params, options)
		}

		/**
		 * Build a function that applies param attributes to a vm.
		 *
		 * @param {Array} params
		 * @param {Object} options
		 * @return {Function} paramsLinkFn
		 */

		var dataAttrRE = /^data-/

		function makeParamsLinkFn (params, options) {
		  var def = options.directives['with']
		  return function paramsLinkFn (vm, el) {
		    var i = params.length
		    var param, path
		    while (i--) {
		      param = params[i]
		      // params could contain dashes, which will be
		      // interpreted as minus calculations by the parser
		      // so we need to wrap the path here
		      path = _.camelize(param.name.replace(dataAttrRE, ''))
		      if (param.dynamic) {
		        // dynamic param attribtues are bound as v-with.
		        // we can directly duck the descriptor here beacuse
		        // param attributes cannot use expressions or
		        // filters.
		        vm._bindDir('with', el, {
		          arg: path,
		          expression: param.value
		        }, def)
		      } else {
		        // just set once
		        vm.$set(path, param.value)
		      }
		    }
		  }
		}

		/**
		 * Check an element for terminal directives in fixed order.
		 * If it finds one, return a terminal link function.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Function} terminalLinkFn
		 */

		var terminalDirectives = [
		  'repeat',
		  'if',
		  'component'
		]

		function skip () {}
		skip.terminal = true

		function checkTerminalDirectives (el, options) {
		  if (_.attr(el, 'pre') !== null) {
		    return skip
		  }
		  var value, dirName
		  /* jshint boss: true */
		  for (var i = 0; i < 3; i++) {
		    dirName = terminalDirectives[i]
		    if (value = _.attr(el, dirName)) {
		      return makeTeriminalLinkFn(el, dirName, value, options)
		    }
		  }
		}

		/**
		 * Build a link function for a terminal directive.
		 *
		 * @param {Element} el
		 * @param {String} dirName
		 * @param {String} value
		 * @param {Object} options
		 * @return {Function} terminalLinkFn
		 */

		function makeTeriminalLinkFn (el, dirName, value, options) {
		  var descriptor = dirParser.parse(value)[0]
		  var def = options.directives[dirName]
		  var terminalLinkFn = function (vm, el) {
		    vm._bindDir(dirName, el, descriptor, def)
		  }
		  terminalLinkFn.terminal = true
		  return terminalLinkFn
		}

		/**
		 * Collect the directives on an element.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @param {Boolean} asParent
		 * @return {Array}
		 */

		function collectDirectives (el, options, asParent) {
		  var attrs = _.toArray(el.attributes)
		  var i = attrs.length
		  var dirs = []
		  var attr, attrName, dir, dirName, dirDef
		  while (i--) {
		    attr = attrs[i]
		    attrName = attr.name
		    if (attrName.indexOf(config.prefix) === 0) {
		      dirName = attrName.slice(config.prefix.length)
		      if (asParent &&
		          (dirName === 'with' ||
		           dirName === 'component')) {
		        continue
		      }
		      dirDef = options.directives[dirName]
		      _.assertAsset(dirDef, 'directive', dirName)
		      if (dirDef) {
		        dirs.push({
		          name: dirName,
		          descriptors: dirParser.parse(attr.value),
		          def: dirDef
		        })
		      }
		    } else if (config.interpolate) {
		      dir = collectAttrDirective(el, attrName, attr.value,
		                                 options)
		      if (dir) {
		        dirs.push(dir)
		      }
		    }
		  }
		  // sort by priority, LOW to HIGH
		  dirs.sort(directiveComparator)
		  return dirs
		}

		/**
		 * Check an attribute for potential dynamic bindings,
		 * and return a directive object.
		 *
		 * @param {Element} el
		 * @param {String} name
		 * @param {String} value
		 * @param {Object} options
		 * @return {Object}
		 */

		function collectAttrDirective (el, name, value, options) {
		  if (options._skipAttrs &&
		      options._skipAttrs.indexOf(name) > -1) {
		    return
		  }
		  var tokens = textParser.parse(value)
		  if (tokens) {
		    var def = options.directives.attr
		    var i = tokens.length
		    var allOneTime = true
		    while (i--) {
		      var token = tokens[i]
		      if (token.tag && !token.oneTime) {
		        allOneTime = false
		      }
		    }
		    return {
		      def: def,
		      _link: allOneTime
		        ? function (vm, el) {
		            el.setAttribute(name, vm.$interpolate(value))
		          }
		        : function (vm, el) {
		            var value = textParser.tokensToExp(tokens, vm)
		            var desc = dirParser.parse(name + ':' + value)[0]
		            vm._bindDir('attr', el, desc, def)
		          }
		    }
		  }
		}

		/**
		 * Directive priority sort comparator
		 *
		 * @param {Object} a
		 * @param {Object} b
		 */

		function directiveComparator (a, b) {
		  a = a.def.priority || 0
		  b = b.def.priority || 0
		  return a > b ? 1 : -1
		}

	/***/ },
	/* 43 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(46)

		/**
		 * Process an element or a DocumentFragment based on a
		 * instance option object. This allows us to transclude
		 * a template node/fragment before the instance is created,
		 * so the processed fragment can then be cloned and reused
		 * in v-repeat.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Element|DocumentFragment}
		 */

		module.exports = function transclude (el, options) {
		  // for template tags, what we want is its content as
		  // a documentFragment (for block instances)
		  if (el.tagName === 'TEMPLATE') {
		    el = templateParser.parse(el)
		  }
		  if (options && options.template) {
		    el = transcludeTemplate(el, options)
		  }
		  if (el instanceof DocumentFragment) {
		    _.prepend(document.createComment('v-start'), el)
		    el.appendChild(document.createComment('v-end'))
		  }
		  return el
		}

		/**
		 * Process the template option.
		 * If the replace option is true this will swap the $el.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Element|DocumentFragment}
		 */

		function transcludeTemplate (el, options) {
		  var template = options.template
		  var frag = templateParser.parse(template, true)
		  if (!frag) {
		    _.warn('Invalid template option: ' + template)
		  } else {
		    var rawContent = options._content || _.extractContent(el)
		    if (options.replace) {
		      if (frag.childNodes.length > 1) {
		        transcludeContent(frag, rawContent)
		        return frag
		      } else {
		        var replacer = frag.firstChild
		        _.copyAttributes(el, replacer)
		        transcludeContent(replacer, rawContent)
		        return replacer
		      }
		    } else {
		      el.appendChild(frag)
		      transcludeContent(el, rawContent)
		      return el
		    }
		  }
		}

		/**
		 * Resolve <content> insertion points mimicking the behavior
		 * of the Shadow DOM spec:
		 *
		 *   http://w3c.github.io/webcomponents/spec/shadow/#insertion-points
		 *
		 * @param {Element|DocumentFragment} el
		 * @param {Element} raw
		 */

		function transcludeContent (el, raw) {
		  var outlets = getOutlets(el)
		  var i = outlets.length
		  if (!i) return
		  var outlet, select, selected, j, main
		  // first pass, collect corresponding content
		  // for each outlet.
		  while (i--) {
		    outlet = outlets[i]
		    if (raw) {
		      select = outlet.getAttribute('select')
		      if (select) {  // select content
		        selected = raw.querySelectorAll(select)
		        outlet.content = _.toArray(
		          selected.length
		            ? selected
		            : outlet.childNodes
		        )
		      } else { // default content
		        main = outlet
		      }
		    } else { // fallback content
		      outlet.content = _.toArray(outlet.childNodes)
		    }
		  }
		  // second pass, actually insert the contents
		  for (i = 0, j = outlets.length; i < j; i++) {
		    outlet = outlets[i]
		    if (outlet !== main) {
		      insertContentAt(outlet, outlet.content)
		    }
		  }
		  // finally insert the main content
		  if (main) {
		    insertContentAt(main, _.toArray(raw.childNodes))
		  }
		}

		/**
		 * Get <content> outlets from the element/list
		 *
		 * @param {Element|Array} el
		 * @return {Array}
		 */

		var concat = [].concat
		function getOutlets (el) {
		  return _.isArray(el)
		    ? concat.apply([], el.map(getOutlets))
		    : el.querySelectorAll
		      ? _.toArray(el.querySelectorAll('content'))
		      : []
		}

		/**
		 * Insert an array of nodes at outlet,
		 * then remove the outlet.
		 *
		 * @param {Element} outlet
		 * @param {Array} contents
		 */

		function insertContentAt (outlet, contents) {
		  // not using util DOM methods here because
		  // parentNode can be cached
		  var parent = outlet.parentNode
		  for (var i = 0, j = contents.length; i < j; i++) {
		    parent.insertBefore(contents[i], outlet)
		  }
		  parent.removeChild(outlet)
		}

	/***/ },
	/* 44 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(53)
		var pathCache = new Cache(1000)
		var identRE = /^[$_a-zA-Z]+[\w$]*$/

		/**
		 * Path-parsing algorithm scooped from Polymer/observe-js
		 */

		var pathStateMachine = {
		  'beforePath': {
		    'ws': ['beforePath'],
		    'ident': ['inIdent', 'append'],
		    '[': ['beforeElement'],
		    'eof': ['afterPath']
		  },

		  'inPath': {
		    'ws': ['inPath'],
		    '.': ['beforeIdent'],
		    '[': ['beforeElement'],
		    'eof': ['afterPath']
		  },

		  'beforeIdent': {
		    'ws': ['beforeIdent'],
		    'ident': ['inIdent', 'append']
		  },

		  'inIdent': {
		    'ident': ['inIdent', 'append'],
		    '0': ['inIdent', 'append'],
		    'number': ['inIdent', 'append'],
		    'ws': ['inPath', 'push'],
		    '.': ['beforeIdent', 'push'],
		    '[': ['beforeElement', 'push'],
		    'eof': ['afterPath', 'push']
		  },

		  'beforeElement': {
		    'ws': ['beforeElement'],
		    '0': ['afterZero', 'append'],
		    'number': ['inIndex', 'append'],
		    "'": ['inSingleQuote', 'append', ''],
		    '"': ['inDoubleQuote', 'append', '']
		  },

		  'afterZero': {
		    'ws': ['afterElement', 'push'],
		    ']': ['inPath', 'push']
		  },

		  'inIndex': {
		    '0': ['inIndex', 'append'],
		    'number': ['inIndex', 'append'],
		    'ws': ['afterElement'],
		    ']': ['inPath', 'push']
		  },

		  'inSingleQuote': {
		    "'": ['afterElement'],
		    'eof': 'error',
		    'else': ['inSingleQuote', 'append']
		  },

		  'inDoubleQuote': {
		    '"': ['afterElement'],
		    'eof': 'error',
		    'else': ['inDoubleQuote', 'append']
		  },

		  'afterElement': {
		    'ws': ['afterElement'],
		    ']': ['inPath', 'push']
		  }
		}

		function noop () {}

		/**
		 * Determine the type of a character in a keypath.
		 *
		 * @param {Char} char
		 * @return {String} type
		 */

		function getPathCharType (char) {
		  if (char === undefined) {
		    return 'eof'
		  }

		  var code = char.charCodeAt(0)

		  switch(code) {
		    case 0x5B: // [
		    case 0x5D: // ]
		    case 0x2E: // .
		    case 0x22: // "
		    case 0x27: // '
		    case 0x30: // 0
		      return char

		    case 0x5F: // _
		    case 0x24: // $
		      return 'ident'

		    case 0x20: // Space
		    case 0x09: // Tab
		    case 0x0A: // Newline
		    case 0x0D: // Return
		    case 0xA0:  // No-break space
		    case 0xFEFF:  // Byte Order Mark
		    case 0x2028:  // Line Separator
		    case 0x2029:  // Paragraph Separator
		      return 'ws'
		  }

		  // a-z, A-Z
		  if ((0x61 <= code && code <= 0x7A) ||
		      (0x41 <= code && code <= 0x5A)) {
		    return 'ident'
		  }

		  // 1-9
		  if (0x31 <= code && code <= 0x39) {
		    return 'number'
		  }

		  return 'else'
		}

		/**
		 * Parse a string path into an array of segments
		 * Todo implement cache
		 *
		 * @param {String} path
		 * @return {Array|undefined}
		 */

		function parsePath (path) {
		  var keys = []
		  var index = -1
		  var mode = 'beforePath'
		  var c, newChar, key, type, transition, action, typeMap

		  var actions = {
		    push: function() {
		      if (key === undefined) {
		        return
		      }
		      keys.push(key)
		      key = undefined
		    },
		    append: function() {
		      if (key === undefined) {
		        key = newChar
		      } else {
		        key += newChar
		      }
		    }
		  }

		  function maybeUnescapeQuote () {
		    var nextChar = path[index + 1]
		    if ((mode === 'inSingleQuote' && nextChar === "'") ||
		        (mode === 'inDoubleQuote' && nextChar === '"')) {
		      index++
		      newChar = nextChar
		      actions.append()
		      return true
		    }
		  }

		  while (mode) {
		    index++
		    c = path[index]

		    if (c === '\\' && maybeUnescapeQuote()) {
		      continue
		    }

		    type = getPathCharType(c)
		    typeMap = pathStateMachine[mode]
		    transition = typeMap[type] || typeMap['else'] || 'error'

		    if (transition === 'error') {
		      return // parse error
		    }

		    mode = transition[0]
		    action = actions[transition[1]] || noop
		    newChar = transition[2] === undefined
		      ? c
		      : transition[2]
		    action()

		    if (mode === 'afterPath') {
		      return keys
		    }
		  }
		}

		/**
		 * Format a accessor segment based on its type.
		 *
		 * @param {String} key
		 * @return {Boolean}
		 */

		function formatAccessor(key) {
		  if (identRE.test(key)) { // identifier
		    return '.' + key
		  } else if (+key === key >>> 0) { // bracket index
		    return '[' + key + ']'
		  } else { // bracket string
		    return '["' + key.replace(/"/g, '\\"') + '"]'
		  }
		}

		/**
		 * Compiles a getter function with a fixed path.
		 *
		 * @param {Array} path
		 * @return {Function}
		 */

		exports.compileGetter = function (path) {
		  var body =
		    'try{return o' +
		    path.map(formatAccessor).join('') +
		    '}catch(e){};'
		  return new Function('o', body)
		}

		/**
		 * External parse that check for a cache hit first
		 *
		 * @param {String} path
		 * @return {Array|undefined}
		 */

		exports.parse = function (path) {
		  var hit = pathCache.get(path)
		  if (!hit) {
		    hit = parsePath(path)
		    if (hit) {
		      hit.get = exports.compileGetter(hit)
		      pathCache.put(path, hit)
		    }
		  }
		  return hit
		}

		/**
		 * Get from an object from a path string
		 *
		 * @param {Object} obj
		 * @param {String} path
		 */

		exports.get = function (obj, path) {
		  path = exports.parse(path)
		  if (path) {
		    return path.get(obj)
		  }
		}

		/**
		 * Set on an object from a path
		 *
		 * @param {Object} obj
		 * @param {String | Array} path
		 * @param {*} val
		 */

		exports.set = function (obj, path, val) {
		  if (typeof path === 'string') {
		    path = exports.parse(path)
		  }
		  if (!path || !_.isObject(obj)) {
		    return false
		  }
		  var last, key
		  for (var i = 0, l = path.length - 1; i < l; i++) {
		    last = obj
		    key = path[i]
		    obj = obj[key]
		    if (!_.isObject(obj)) {
		      obj = {}
		      last.$add(key, obj)
		    }
		  }
		  key = path[i]
		  if (key in obj) {
		    obj[key] = val
		  } else {
		    obj.$add(key, val)
		  }
		  return true
		}

	/***/ },
	/* 45 */
	/***/ function(module, exports, __webpack_require__) {

		var Cache = __webpack_require__(53)
		var config = __webpack_require__(20)
		var dirParser = __webpack_require__(47)
		var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
		var cache, tagRE, htmlRE, firstChar, lastChar

		/**
		 * Escape a string so it can be used in a RegExp
		 * constructor.
		 *
		 * @param {String} str
		 */

		function escapeRegex (str) {
		  return str.replace(regexEscapeRE, '\\$&')
		}

		/**
		 * Compile the interpolation tag regex.
		 *
		 * @return {RegExp}
		 */

		function compileRegex () {
		  config._delimitersChanged = false
		  var open = config.delimiters[0]
		  var close = config.delimiters[1]
		  firstChar = open.charAt(0)
		  lastChar = close.charAt(close.length - 1)
		  var firstCharRE = escapeRegex(firstChar)
		  var lastCharRE = escapeRegex(lastChar)
		  var openRE = escapeRegex(open)
		  var closeRE = escapeRegex(close)
		  tagRE = new RegExp(
		    firstCharRE + '?' + openRE +
		    '(.+?)' +
		    closeRE + lastCharRE + '?',
		    'g'
		  )
		  htmlRE = new RegExp(
		    '^' + firstCharRE + openRE +
		    '.*' +
		    closeRE + lastCharRE + '$'
		  )
		  // reset cache
		  cache = new Cache(1000)
		}

		/**
		 * Parse a template text string into an array of tokens.
		 *
		 * @param {String} text
		 * @return {Array<Object> | null}
		 *               - {String} type
		 *               - {String} value
		 *               - {Boolean} [html]
		 *               - {Boolean} [oneTime]
		 */

		exports.parse = function (text) {
		  if (config._delimitersChanged) {
		    compileRegex()
		  }
		  var hit = cache.get(text)
		  if (hit) {
		    return hit
		  }
		  if (!tagRE.test(text)) {
		    return null
		  }
		  var tokens = []
		  var lastIndex = tagRE.lastIndex = 0
		  var match, index, value, first, oneTime, partial
		  /* jshint boss:true */
		  while (match = tagRE.exec(text)) {
		    index = match.index
		    // push text token
		    if (index > lastIndex) {
		      tokens.push({
		        value: text.slice(lastIndex, index)
		      })
		    }
		    // tag token
		    first = match[1].charCodeAt(0)
		    oneTime = first === 0x2A // *
		    partial = first === 0x3E // >
		    value = (oneTime || partial)
		      ? match[1].slice(1)
		      : match[1]
		    tokens.push({
		      tag: true,
		      value: value.trim(),
		      html: htmlRE.test(match[0]),
		      oneTime: oneTime,
		      partial: partial
		    })
		    lastIndex = index + match[0].length
		  }
		  if (lastIndex < text.length) {
		    tokens.push({
		      value: text.slice(lastIndex)
		    })
		  }
		  cache.put(text, tokens)
		  return tokens
		}

		/**
		 * Format a list of tokens into an expression.
		 * e.g. tokens parsed from 'a {{b}} c' can be serialized
		 * into one single expression as '"a " + b + " c"'.
		 *
		 * @param {Array} tokens
		 * @param {Vue} [vm]
		 * @return {String}
		 */

		exports.tokensToExp = function (tokens, vm) {
		  return tokens.length > 1
		    ? tokens.map(function (token) {
		        return formatToken(token, vm)
		      }).join('+')
		    : formatToken(tokens[0], vm, true)
		}

		/**
		 * Format a single token.
		 *
		 * @param {Object} token
		 * @param {Vue} [vm]
		 * @param {Boolean} single
		 * @return {String}
		 */

		function formatToken (token, vm, single) {
		  return token.tag
		    ? vm && token.oneTime
		      ? '"' + vm.$eval(token.value) + '"'
		      : single
		        ? token.value
		        : inlineFilters(token.value)
		    : '"' + token.value + '"'
		}

		/**
		 * For an attribute with multiple interpolation tags,
		 * e.g. attr="some-{{thing | filter}}", in order to combine
		 * the whole thing into a single watchable expression, we
		 * have to inline those filters. This function does exactly
		 * that. This is a bit hacky but it avoids heavy changes
		 * to directive parser and watcher mechanism.
		 *
		 * @param {String} exp
		 * @return {String}
		 */

		var filterRE = /[^|]\|[^|]/
		function inlineFilters (exp) {
		  if (!filterRE.test(exp)) {
		    return '(' + exp + ')'
		  } else {
		    var dir = dirParser.parse(exp)[0]
		    if (!dir.filters) {
		      return '(' + exp + ')'
		    } else {
		      exp = dir.expression
		      for (var i = 0, l = dir.filters.length; i < l; i++) {
		        var filter = dir.filters[i]
		        var args = filter.args
		          ? ',"' + filter.args.join('","') + '"'
		          : ''
		        exp = 'this.$options.filters["' + filter.name + '"]' +
		          '.apply(this,[' + exp + args + '])'
		      }
		      return exp
		    }
		  }
		}

	/***/ },
	/* 46 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(53)
		var templateCache = new Cache(1000)
		var idSelectorCache = new Cache(1000)

		var map = {
		  _default : [0, '', ''],
		  legend   : [1, '<fieldset>', '</fieldset>'],
		  tr       : [2, '<table><tbody>', '</tbody></table>'],
		  col      : [
		    2,
		    '<table><tbody></tbody><colgroup>',
		    '</colgroup></table>'
		  ]
		}

		map.td =
		map.th = [
		  3,
		  '<table><tbody><tr>',
		  '</tr></tbody></table>'
		]

		map.option =
		map.optgroup = [
		  1,
		  '<select multiple="multiple">',
		  '</select>'
		]

		map.thead =
		map.tbody =
		map.colgroup =
		map.caption =
		map.tfoot = [1, '<table>', '</table>']

		map.g =
		map.defs =
		map.symbol =
		map.use =
		map.image =
		map.text =
		map.circle =
		map.ellipse =
		map.line =
		map.path =
		map.polygon =
		map.polyline =
		map.rect = [
		  1,
		  '<svg ' +
		    'xmlns="http://www.w3.org/2000/svg" ' +
		    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
		    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
		    'version="1.1">',
		  '</svg>'
		]

		var tagRE = /<([\w:]+)/
		var entityRE = /&\w+;/

		/**
		 * Convert a string template to a DocumentFragment.
		 * Determines correct wrapping by tag types. Wrapping
		 * strategy found in jQuery & component/domify.
		 *
		 * @param {String} templateString
		 * @return {DocumentFragment}
		 */

		function stringToFragment (templateString) {
		  // try a cache hit first
		  var hit = templateCache.get(templateString)
		  if (hit) {
		    return hit
		  }

		  var frag = document.createDocumentFragment()
		  var tagMatch = templateString.match(tagRE)
		  var entityMatch = entityRE.test(templateString)

		  if (!tagMatch && !entityMatch) {
		    // text only, return a single text node.
		    frag.appendChild(
		      document.createTextNode(templateString)
		    )
		  } else {

		    var tag    = tagMatch && tagMatch[1]
		    var wrap   = map[tag] || map._default
		    var depth  = wrap[0]
		    var prefix = wrap[1]
		    var suffix = wrap[2]
		    var node   = document.createElement('div')

		    node.innerHTML = prefix + templateString.trim() + suffix
		    while (depth--) {
		      node = node.lastChild
		    }

		    var child
		    /* jshint boss:true */
		    while (child = node.firstChild) {
		      frag.appendChild(child)
		    }
		  }

		  templateCache.put(templateString, frag)
		  return frag
		}

		/**
		 * Convert a template node to a DocumentFragment.
		 *
		 * @param {Node} node
		 * @return {DocumentFragment}
		 */

		function nodeToFragment (node) {
		  var tag = node.tagName
		  // if its a template tag and the browser supports it,
		  // its content is already a document fragment.
		  if (
		    tag === 'TEMPLATE' &&
		    node.content instanceof DocumentFragment
		  ) {
		    return node.content
		  }
		  return tag === 'SCRIPT'
		    ? stringToFragment(node.textContent)
		    : stringToFragment(node.innerHTML)
		}

		// Test for the presence of the Safari template cloning bug
		// https://bugs.webkit.org/show_bug.cgi?id=137755
		var hasBrokenTemplate = _.inBrowser
		  ? (function () {
		      var a = document.createElement('div')
		      a.innerHTML = '<template>1</template>'
		      return !a.cloneNode(true).firstChild.innerHTML
		    })()
		  : false

		// Test for IE10/11 textarea placeholder clone bug
		var hasTextareaCloneBug = _.inBrowser
		  ? (function () {
		      var t = document.createElement('textarea')
		      t.placeholder = 't'
		      return t.cloneNode(true).value === 't'
		    })()
		  : false

		/**
		 * 1. Deal with Safari cloning nested <template> bug by
		 *    manually cloning all template instances.
		 * 2. Deal with IE10/11 textarea placeholder bug by setting
		 *    the correct value after cloning.
		 *
		 * @param {Element|DocumentFragment} node
		 * @return {Element|DocumentFragment}
		 */

		exports.clone = function (node) {
		  var res = node.cloneNode(true)
		  var i, original, cloned
		  /* istanbul ignore if */
		  if (hasBrokenTemplate) {
		    original = node.querySelectorAll('template')
		    if (original.length) {
		      cloned = res.querySelectorAll('template')
		      i = cloned.length
		      while (i--) {
		        cloned[i].parentNode.replaceChild(
		          original[i].cloneNode(true),
		          cloned[i]
		        )
		      }
		    }
		  }
		  /* istanbul ignore if */
		  if (hasTextareaCloneBug) {
		    if (node.tagName === 'TEXTAREA') {
		      res.value = node.value
		    } else {
		      original = node.querySelectorAll('textarea')
		      if (original.length) {
		        cloned = res.querySelectorAll('textarea')
		        i = cloned.length
		        while (i--) {
		          cloned[i].value = original[i].value
		        }
		      }
		    }
		  }
		  return res
		}

		/**
		 * Process the template option and normalizes it into a
		 * a DocumentFragment that can be used as a partial or a
		 * instance template.
		 *
		 * @param {*} template
		 *    Possible values include:
		 *    - DocumentFragment object
		 *    - Node object of type Template
		 *    - id selector: '#some-template-id'
		 *    - template string: '<div><span>{{msg}}</span></div>'
		 * @param {Boolean} clone
		 * @param {Boolean} noSelector
		 * @return {DocumentFragment|undefined}
		 */

		exports.parse = function (template, clone, noSelector) {
		  var node, frag

		  // if the template is already a document fragment,
		  // do nothing
		  if (template instanceof DocumentFragment) {
		    return clone
		      ? template.cloneNode(true)
		      : template
		  }

		  if (typeof template === 'string') {
		    // id selector
		    if (!noSelector && template.charAt(0) === '#') {
		      // id selector can be cached too
		      frag = idSelectorCache.get(template)
		      if (!frag) {
		        node = document.getElementById(template.slice(1))
		        if (node) {
		          frag = nodeToFragment(node)
		          // save selector to cache
		          idSelectorCache.put(template, frag)
		        }
		      }
		    } else {
		      // normal string template
		      frag = stringToFragment(template)
		    }
		  } else if (template.nodeType) {
		    // a direct node
		    frag = nodeToFragment(template)
		  }

		  return frag && clone
		    ? exports.clone(frag)
		    : frag
		}

	/***/ },
	/* 47 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(53)
		var cache = new Cache(1000)
		var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
		var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g

		/**
		 * Parser state
		 */

		var str
		var c, i, l
		var inSingle
		var inDouble
		var curly
		var square
		var paren
		var begin
		var argIndex
		var dirs
		var dir
		var lastFilterIndex
		var arg

		/**
		 * Push a directive object into the result Array
		 */

		function pushDir () {
		  dir.raw = str.slice(begin, i).trim()
		  if (dir.expression === undefined) {
		    dir.expression = str.slice(argIndex, i).trim()
		  } else if (lastFilterIndex !== begin) {
		    pushFilter()
		  }
		  if (i === 0 || dir.expression) {
		    dirs.push(dir)
		  }
		}

		/**
		 * Push a filter to the current directive object
		 */

		function pushFilter () {
		  var exp = str.slice(lastFilterIndex, i).trim()
		  var filter
		  if (exp) {
		    filter = {}
		    var tokens = exp.match(filterTokenRE)
		    filter.name = tokens[0]
		    filter.args = tokens.length > 1 ? tokens.slice(1) : null
		  }
		  if (filter) {
		    (dir.filters = dir.filters || []).push(filter)
		  }
		  lastFilterIndex = i + 1
		}

		/**
		 * Parse a directive string into an Array of AST-like
		 * objects representing directives.
		 *
		 * Example:
		 *
		 * "click: a = a + 1 | uppercase" will yield:
		 * {
		 *   arg: 'click',
		 *   expression: 'a = a + 1',
		 *   filters: [
		 *     { name: 'uppercase', args: null }
		 *   ]
		 * }
		 *
		 * @param {String} str
		 * @return {Array<Object>}
		 */

		exports.parse = function (s) {

		  var hit = cache.get(s)
		  if (hit) {
		    return hit
		  }

		  // reset parser state
		  str = s
		  inSingle = inDouble = false
		  curly = square = paren = begin = argIndex = 0
		  lastFilterIndex = 0
		  dirs = []
		  dir = {}
		  arg = null

		  for (i = 0, l = str.length; i < l; i++) {
		    c = str.charCodeAt(i)
		    if (inSingle) {
		      // check single quote
		      if (c === 0x27) inSingle = !inSingle
		    } else if (inDouble) {
		      // check double quote
		      if (c === 0x22) inDouble = !inDouble
		    } else if (
		      c === 0x2C && // comma
		      !paren && !curly && !square
		    ) {
		      // reached the end of a directive
		      pushDir()
		      // reset & skip the comma
		      dir = {}
		      begin = argIndex = lastFilterIndex = i + 1
		    } else if (
		      c === 0x3A && // colon
		      !dir.expression &&
		      !dir.arg
		    ) {
		      // argument
		      arg = str.slice(begin, i).trim()
		      // test for valid argument here
		      // since we may have caught stuff like first half of
		      // an object literal or a ternary expression.
		      if (argRE.test(arg)) {
		        argIndex = i + 1
		        dir.arg = _.stripQuotes(arg) || arg
		      }
		    } else if (
		      c === 0x7C && // pipe
		      str.charCodeAt(i + 1) !== 0x7C &&
		      str.charCodeAt(i - 1) !== 0x7C
		    ) {
		      if (dir.expression === undefined) {
		        // first filter, end of expression
		        lastFilterIndex = i + 1
		        dir.expression = str.slice(argIndex, i).trim()
		      } else {
		        // already has filter
		        pushFilter()
		      }
		    } else {
		      switch (c) {
		        case 0x22: inDouble = true; break // "
		        case 0x27: inSingle = true; break // '
		        case 0x28: paren++; break         // (
		        case 0x29: paren--; break         // )
		        case 0x5B: square++; break        // [
		        case 0x5D: square--; break        // ]
		        case 0x7B: curly++; break         // {
		        case 0x7D: curly--; break         // }
		      }
		    }
		  }

		  if (i === 0 || begin !== i) {
		    pushDir()
		  }

		  cache.put(s, dirs)
		  return dirs
		}

	/***/ },
	/* 48 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Path = __webpack_require__(44)
		var Cache = __webpack_require__(53)
		var expressionCache = new Cache(1000)

		var keywords =
		  'Math,break,case,catch,continue,debugger,default,' +
		  'delete,do,else,false,finally,for,function,if,in,' +
		  'instanceof,new,null,return,switch,this,throw,true,try,' +
		  'typeof,var,void,while,with,undefined,abstract,boolean,' +
		  'byte,char,class,const,double,enum,export,extends,' +
		  'final,float,goto,implements,import,int,interface,long,' +
		  'native,package,private,protected,public,short,static,' +
		  'super,synchronized,throws,transient,volatile,' +
		  'arguments,let,yield'

		var wsRE = /\s/g
		var newlineRE = /\n/g
		var saveRE = /[\{,]\s*[\w\$_]+\s*:|'[^']*'|"[^"]*"/g
		var restoreRE = /"(\d+)"/g
		var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/
		var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
		var keywordsRE = new RegExp('^(' + keywords.replace(/,/g, '\\b|') + '\\b)')

		/**
		 * Save / Rewrite / Restore
		 *
		 * When rewriting paths found in an expression, it is
		 * possible for the same letter sequences to be found in
		 * strings and Object literal property keys. Therefore we
		 * remove and store these parts in a temporary array, and
		 * restore them after the path rewrite.
		 */

		var saved = []

		/**
		 * Save replacer
		 *
		 * @param {String} str
		 * @return {String} - placeholder with index
		 */

		function save (str) {
		  var i = saved.length
		  saved[i] = str.replace(newlineRE, '\\n')
		  return '"' + i + '"'
		}

		/**
		 * Path rewrite replacer
		 *
		 * @param {String} raw
		 * @return {String}
		 */

		function rewrite (raw) {
		  var c = raw.charAt(0)
		  var path = raw.slice(1)
		  if (keywordsRE.test(path)) {
		    return raw
		  } else {
		    path = path.indexOf('"') > -1
		      ? path.replace(restoreRE, restore)
		      : path
		    return c + 'scope.' + path
		  }
		}

		/**
		 * Restore replacer
		 *
		 * @param {String} str
		 * @param {String} i - matched save index
		 * @return {String}
		 */

		function restore (str, i) {
		  return saved[i]
		}

		/**
		 * Rewrite an expression, prefixing all path accessors with
		 * `scope.` and generate getter/setter functions.
		 *
		 * @param {String} exp
		 * @param {Boolean} needSet
		 * @return {Function}
		 */

		function compileExpFns (exp, needSet) {
		  // reset state
		  saved.length = 0
		  // save strings and object literal keys
		  var body = exp
		    .replace(saveRE, save)
		    .replace(wsRE, '')
		  // rewrite all paths
		  // pad 1 space here becaue the regex matches 1 extra char
		  body = (' ' + body)
		    .replace(pathReplaceRE, rewrite)
		    .replace(restoreRE, restore)
		  var getter = makeGetter(body)
		  if (getter) {
		    return {
		      get: getter,
		      body: body,
		      set: needSet
		        ? makeSetter(body)
		        : null
		    }
		  }
		}

		/**
		 * Compile getter setters for a simple path.
		 *
		 * @param {String} exp
		 * @return {Function}
		 */

		function compilePathFns (exp) {
		  var getter, path
		  if (exp.indexOf('[') < 0) {
		    // really simple path
		    path = exp.split('.')
		    getter = Path.compileGetter(path)
		  } else {
		    // do the real parsing
		    path = Path.parse(exp)
		    getter = path.get
		  }
		  return {
		    get: getter,
		    // always generate setter for simple paths
		    set: function (obj, val) {
		      Path.set(obj, path, val)
		    }
		  }
		}

		/**
		 * Build a getter function. Requires eval.
		 *
		 * We isolate the try/catch so it doesn't affect the
		 * optimization of the parse function when it is not called.
		 *
		 * @param {String} body
		 * @return {Function|undefined}
		 */

		function makeGetter (body) {
		  try {
		    return new Function('scope', 'return ' + body + ';')
		  } catch (e) {
		    _.warn(
		      'Invalid expression. ' +
		      'Generated function body: ' + body
		    )
		  }
		}

		/**
		 * Build a setter function.
		 *
		 * This is only needed in rare situations like "a[b]" where
		 * a settable path requires dynamic evaluation.
		 *
		 * This setter function may throw error when called if the
		 * expression body is not a valid left-hand expression in
		 * assignment.
		 *
		 * @param {String} body
		 * @return {Function|undefined}
		 */

		function makeSetter (body) {
		  try {
		    return new Function('scope', 'value', body + '=value;')
		  } catch (e) {
		    _.warn('Invalid setter function body: ' + body)
		  }
		}

		/**
		 * Check for setter existence on a cache hit.
		 *
		 * @param {Function} hit
		 */

		function checkSetter (hit) {
		  if (!hit.set) {
		    hit.set = makeSetter(hit.body)
		  }
		}

		/**
		 * Parse an expression into re-written getter/setters.
		 *
		 * @param {String} exp
		 * @param {Boolean} needSet
		 * @return {Function}
		 */

		exports.parse = function (exp, needSet) {
		  exp = exp.trim()
		  // try cache
		  var hit = expressionCache.get(exp)
		  if (hit) {
		    if (needSet) {
		      checkSetter(hit)
		    }
		    return hit
		  }
		  // we do a simple path check to optimize for them.
		  // the check fails valid paths with unusal whitespaces,
		  // but that's too rare and we don't care.
		  var res = pathTestRE.test(exp)
		    ? compilePathFns(exp)
		    : compileExpFns(exp, needSet)
		  expressionCache.put(exp, res)
		  return res
		}

		// Export the pathRegex for external use
		exports.pathTestRE = pathTestRE

	/***/ },
	/* 49 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var applyCSSTransition = __webpack_require__(54)
		var applyJSTransition = __webpack_require__(55)

		/**
		 * Append with transition.
		 *
		 * @oaram {Element} el
		 * @param {Element} target
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */

		exports.append = function (el, target, vm, cb) {
		  apply(el, 1, function () {
		    target.appendChild(el)
		  }, vm, cb)
		}

		/**
		 * InsertBefore with transition.
		 *
		 * @oaram {Element} el
		 * @param {Element} target
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */

		exports.before = function (el, target, vm, cb) {
		  apply(el, 1, function () {
		    _.before(el, target)
		  }, vm, cb)
		}

		/**
		 * Remove with transition.
		 *
		 * @oaram {Element} el
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */

		exports.remove = function (el, vm, cb) {
		  apply(el, -1, function () {
		    _.remove(el)
		  }, vm, cb)
		}

		/**
		 * Remove by appending to another parent with transition.
		 * This is only used in block operations.
		 *
		 * @oaram {Element} el
		 * @param {Element} target
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */

		exports.removeThenAppend = function (el, target, vm, cb) {
		  apply(el, -1, function () {
		    target.appendChild(el)
		  }, vm, cb)
		}

		/**
		 * Append the childNodes of a fragment to target.
		 *
		 * @param {DocumentFragment} block
		 * @param {Node} target
		 * @param {Vue} vm
		 */

		exports.blockAppend = function (block, target, vm) {
		  var nodes = _.toArray(block.childNodes)
		  for (var i = 0, l = nodes.length; i < l; i++) {
		    exports.before(nodes[i], target, vm)
		  }
		}

		/**
		 * Remove a block of nodes between two edge nodes.
		 *
		 * @param {Node} start
		 * @param {Node} end
		 * @param {Vue} vm
		 */

		exports.blockRemove = function (start, end, vm) {
		  var node = start.nextSibling
		  var next
		  while (node !== end) {
		    next = node.nextSibling
		    exports.remove(node, vm)
		    node = next
		  }
		}

		/**
		 * Apply transitions with an operation callback.
		 *
		 * @oaram {Element} el
		 * @param {Number} direction
		 *                  1: enter
		 *                 -1: leave
		 * @param {Function} op - the actual DOM operation
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */

		var apply = exports.apply = function (el, direction, op, vm, cb) {
		  var transData = el.__v_trans
		  if (
		    !transData ||
		    !vm._isCompiled ||
		    // if the vm is being manipulated by a parent directive
		    // during the parent's compilation phase, skip the
		    // animation.
		    (vm.$parent && !vm.$parent._isCompiled)
		  ) {
		    op()
		    if (cb) cb()
		    return
		  }
		  // determine the transition type on the element
		  var jsTransition = vm.$options.transitions[transData.id]
		  if (jsTransition) {
		    // js
		    applyJSTransition(
		      el,
		      direction,
		      op,
		      transData,
		      jsTransition,
		      vm,
		      cb
		    )
		  } else if (_.transitionEndEvent) {
		    // css
		    applyCSSTransition(
		      el,
		      direction,
		      op,
		      transData,
		      cb
		    )
		  } else {
		    // not applicable
		    op()
		    if (cb) cb()
		  }
		}

	/***/ },
	/* 50 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		var handlers = {
		  _default: __webpack_require__(56),
		  radio: __webpack_require__(57),
		  select: __webpack_require__(58),
		  checkbox: __webpack_require__(59)
		}

		module.exports = {

		  priority: 800,
		  twoWay: true,
		  handlers: handlers,

		  /**
		   * Possible elements:
		   *   <select>
		   *   <textarea>
		   *   <input type="*">
		   *     - text
		   *     - checkbox
		   *     - radio
		   *     - number
		   *     - TODO: more types may be supplied as a plugin
		   */

		  bind: function () {
		    // friendly warning...
		    var filters = this.filters
		    if (filters && filters.read && !filters.write) {
		      _.warn(
		        'It seems you are using a read-only filter with ' +
		        'v-model. You might want to use a two-way filter ' +
		        'to ensure correct behavior.'
		      )
		    }
		    var el = this.el
		    var tag = el.tagName
		    var handler
		    if (tag === 'INPUT') {
		      handler = handlers[el.type] || handlers._default
		    } else if (tag === 'SELECT') {
		      handler = handlers.select
		    } else if (tag === 'TEXTAREA') {
		      handler = handlers._default
		    } else {
		      _.warn("v-model doesn't support element type: " + tag)
		      return
		    }
		    handler.bind.call(this)
		    this.update = handler.update
		    this.unbind = handler.unbind
		  }

		}

	/***/ },
	/* 51 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var config = __webpack_require__(20)
		var Dep = __webpack_require__(40)
		var arrayMethods = __webpack_require__(60)
		var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
		__webpack_require__(61)

		var uid = 0

		/**
		 * Type enums
		 */

		var ARRAY  = 0
		var OBJECT = 1

		/**
		 * Augment an target Object or Array by intercepting
		 * the prototype chain using __proto__
		 *
		 * @param {Object|Array} target
		 * @param {Object} proto
		 */

		function protoAugment (target, src) {
		  target.__proto__ = src
		}

		/**
		 * Augment an target Object or Array by defining
		 * hidden properties.
		 *
		 * @param {Object|Array} target
		 * @param {Object} proto
		 */

		function copyAugment (target, src, keys) {
		  var i = keys.length
		  var key
		  while (i--) {
		    key = keys[i]
		    _.define(target, key, src[key])
		  }
		}

		/**
		 * Observer class that are attached to each observed
		 * object. Once attached, the observer converts target
		 * object's property keys into getter/setters that
		 * collect dependencies and dispatches updates.
		 *
		 * @param {Array|Object} value
		 * @param {Number} type
		 * @constructor
		 */

		function Observer (value, type) {
		  this.id = ++uid
		  this.value = value
		  this.active = true
		  this.deps = []
		  _.define(value, '__ob__', this)
		  if (type === ARRAY) {
		    var augment = config.proto && _.hasProto
		      ? protoAugment
		      : copyAugment
		    augment(value, arrayMethods, arrayKeys)
		    this.observeArray(value)
		  } else if (type === OBJECT) {
		    this.walk(value)
		  }
		}

		Observer.target = null

		var p = Observer.prototype

		/**
		 * Attempt to create an observer instance for a value,
		 * returns the new observer if successfully observed,
		 * or the existing observer if the value already has one.
		 *
		 * @param {*} value
		 * @return {Observer|undefined}
		 * @static
		 */

		Observer.create = function (value) {
		  if (
		    value &&
		    value.hasOwnProperty('__ob__') &&
		    value.__ob__ instanceof Observer
		  ) {
		    return value.__ob__
		  } else if (_.isArray(value)) {
		    return new Observer(value, ARRAY)
		  } else if (
		    _.isPlainObject(value) &&
		    !value._isVue // avoid Vue instance
		  ) {
		    return new Observer(value, OBJECT)
		  }
		}

		/**
		 * Walk through each property and convert them into
		 * getter/setters. This method should only be called when
		 * value type is Object. Properties prefixed with `$` or `_`
		 * and accessor properties are ignored.
		 *
		 * @param {Object} obj
		 */

		p.walk = function (obj) {
		  var keys = Object.keys(obj)
		  var i = keys.length
		  var key, prefix
		  while (i--) {
		    key = keys[i]
		    prefix = key.charCodeAt(0)
		    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
		      this.convert(key, obj[key])
		    }
		  }
		}

		/**
		 * Try to carete an observer for a child value,
		 * and if value is array, link dep to the array.
		 *
		 * @param {*} val
		 * @return {Dep|undefined}
		 */

		p.observe = function (val) {
		  return Observer.create(val)
		}

		/**
		 * Observe a list of Array items.
		 *
		 * @param {Array} items
		 */

		p.observeArray = function (items) {
		  var i = items.length
		  while (i--) {
		    this.observe(items[i])
		  }
		}

		/**
		 * Convert a property into getter/setter so we can emit
		 * the events when the property is accessed/changed.
		 *
		 * @param {String} key
		 * @param {*} val
		 */

		p.convert = function (key, val) {
		  var ob = this
		  var childOb = ob.observe(val)
		  var dep = new Dep()
		  if (childOb) {
		    childOb.deps.push(dep)
		  }
		  Object.defineProperty(ob.value, key, {
		    enumerable: true,
		    configurable: true,
		    get: function () {
		      // Observer.target is a watcher whose getter is
		      // currently being evaluated.
		      if (ob.active && Observer.target) {
		        Observer.target.addDep(dep)
		      }
		      return val
		    },
		    set: function (newVal) {
		      if (newVal === val) return
		      // remove dep from old value
		      var oldChildOb = val && val.__ob__
		      if (oldChildOb) {
		        var oldDeps = oldChildOb.deps
		        oldDeps.splice(oldDeps.indexOf(dep), 1)
		      }
		      val = newVal
		      // add dep to new value
		      var newChildOb = ob.observe(newVal)
		      if (newChildOb) {
		        newChildOb.deps.push(dep)
		      }
		      dep.notify()
		    }
		  })
		}

		/**
		 * Notify change on all self deps on an observer.
		 * This is called when a mutable value mutates. e.g.
		 * when an Array's mutating methods are called, or an
		 * Object's $add/$delete are called.
		 */

		p.notify = function () {
		  var deps = this.deps
		  for (var i = 0, l = deps.length; i < l; i++) {
		    deps[i].notify()
		  }
		}

		/**
		 * Add an owner vm, so that when $add/$delete mutations
		 * happen we can notify owner vms to proxy the keys and
		 * digest the watchers. This is only called when the object
		 * is observed as an instance's root $data.
		 *
		 * @param {Vue} vm
		 */

		p.addVm = function (vm) {
		  (this.vms = this.vms || []).push(vm)
		}

		/**
		 * Remove an owner vm. This is called when the object is
		 * swapped out as an instance's $data object.
		 *
		 * @param {Vue} vm
		 */

		p.removeVm = function (vm) {
		  this.vms.splice(this.vms.indexOf(vm), 1)
		}

		module.exports = Observer


	/***/ },
	/* 52 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		// we have two separate queues: one for directive updates
		// and one for user watcher registered via $watch().
		// we want to guarantee directive updates to be called
		// before user watchers so that when user watchers are
		// triggered, the DOM would have already been in updated
		// state.
		var queue = []
		var userQueue = []
		var has = {}
		var waiting = false
		var flushing = false

		/**
		 * Reset the batcher's state.
		 */

		function reset () {
		  queue = []
		  userQueue = []
		  has = {}
		  waiting = false
		  flushing = false
		}

		/**
		 * Flush both queues and run the jobs.
		 */

		function flush () {
		  flushing = true
		  run(queue)
		  run(userQueue)
		  reset()
		}

		/**
		 * Run the jobs in a single queue.
		 *
		 * @param {Array} queue
		 */

		function run (queue) {
		  // do not cache length because more jobs might be pushed
		  // as we run existing jobs
		  for (var i = 0; i < queue.length; i++) {
		    queue[i].run()
		  }
		}

		/**
		 * Push a job into the job queue.
		 * Jobs with duplicate IDs will be skipped unless it's
		 * pushed when the queue is being flushed.
		 *
		 * @param {Object} job
		 *   properties:
		 *   - {String|Number} id
		 *   - {Function}      run
		 */

		exports.push = function (job) {
		  if (!job.id || !has[job.id] || flushing) {
		    // A user watcher callback could trigger another
		    // directive update during the flushing; at that time
		    // the directive queue would already have been run, so
		    // we call that update immediately as it is pushed.
		    if (flushing && !job.user) {
		      job.run()
		      return
		    }
		    ;(job.user ? userQueue : queue).push(job)
		    has[job.id] = job
		    if (!waiting) {
		      waiting = true
		      _.nextTick(flush)
		    }
		  }
		}

	/***/ },
	/* 53 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * A doubly linked list-based Least Recently Used (LRU)
		 * cache. Will keep most recently used items while
		 * discarding least recently used items when its limit is
		 * reached. This is a bare-bone version of
		 * Rasmus Andersson's js-lru:
		 *
		 *   https://github.com/rsms/js-lru
		 *
		 * @param {Number} limit
		 * @constructor
		 */

		function Cache (limit) {
		  this.size = 0
		  this.limit = limit
		  this.head = this.tail = undefined
		  this._keymap = {}
		}

		var p = Cache.prototype

		/**
		 * Put <value> into the cache associated with <key>.
		 * Returns the entry which was removed to make room for
		 * the new entry. Otherwise undefined is returned.
		 * (i.e. if there was enough room already).
		 *
		 * @param {String} key
		 * @param {*} value
		 * @return {Entry|undefined}
		 */

		p.put = function (key, value) {
		  var entry = {
		    key:key,
		    value:value
		  }
		  this._keymap[key] = entry
		  if (this.tail) {
		    this.tail.newer = entry
		    entry.older = this.tail
		  } else {
		    this.head = entry
		  }
		  this.tail = entry
		  if (this.size === this.limit) {
		    return this.shift()
		  } else {
		    this.size++
		  }
		}

		/**
		 * Purge the least recently used (oldest) entry from the
		 * cache. Returns the removed entry or undefined if the
		 * cache was empty.
		 */

		p.shift = function () {
		  var entry = this.head
		  if (entry) {
		    this.head = this.head.newer
		    this.head.older = undefined
		    entry.newer = entry.older = undefined
		    this._keymap[entry.key] = undefined
		  }
		  return entry
		}

		/**
		 * Get and register recent use of <key>. Returns the value
		 * associated with <key> or undefined if not in cache.
		 *
		 * @param {String} key
		 * @param {Boolean} returnEntry
		 * @return {Entry|*}
		 */

		p.get = function (key, returnEntry) {
		  var entry = this._keymap[key]
		  if (entry === undefined) return
		  if (entry === this.tail) {
		    return returnEntry
		      ? entry
		      : entry.value
		  }
		  // HEAD--------------TAIL
		  //   <.older   .newer>
		  //  <--- add direction --
		  //   A  B  C  <D>  E
		  if (entry.newer) {
		    if (entry === this.head) {
		      this.head = entry.newer
		    }
		    entry.newer.older = entry.older // C <-- E.
		  }
		  if (entry.older) {
		    entry.older.newer = entry.newer // C. --> E
		  }
		  entry.newer = undefined // D --x
		  entry.older = this.tail // D. --> E
		  if (this.tail) {
		    this.tail.newer = entry // E. <-- D
		  }
		  this.tail = entry
		  return returnEntry
		    ? entry
		    : entry.value
		}

		module.exports = Cache

	/***/ },
	/* 54 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var addClass = _.addClass
		var removeClass = _.removeClass
		var transDurationProp = _.transitionProp + 'Duration'
		var animDurationProp = _.animationProp + 'Duration'

		var queue = []
		var queued = false

		/**
		 * Push a job into the transition queue, which is to be
		 * executed on next frame.
		 *
		 * @param {Element} el    - target element
		 * @param {Number} dir    - 1: enter, -1: leave
		 * @param {Function} op   - the actual dom operation
		 * @param {String} cls    - the className to remove when the
		 *                          transition is done.
		 * @param {Function} [cb] - user supplied callback.
		 */

		function push (el, dir, op, cls, cb) {
		  queue.push({
		    el  : el,
		    dir : dir,
		    cb  : cb,
		    cls : cls,
		    op  : op
		  })
		  if (!queued) {
		    queued = true
		    _.nextTick(flush)
		  }
		}

		/**
		 * Flush the queue, and do one forced reflow before
		 * triggering transitions.
		 */

		function flush () {
		  /* jshint unused: false */
		  var f = document.documentElement.offsetHeight
		  queue.forEach(run)
		  queue = []
		  queued = false
		}

		/**
		 * Run a transition job.
		 *
		 * @param {Object} job
		 */

		function run (job) {

		  var el = job.el
		  var data = el.__v_trans
		  var cls = job.cls
		  var cb = job.cb
		  var op = job.op
		  var transitionType = getTransitionType(el, data, cls)

		  if (job.dir > 0) { // ENTER
		    if (transitionType === 1) {
		      // trigger transition by removing enter class
		      removeClass(el, cls)
		      // only need to listen for transitionend if there's
		      // a user callback
		      if (cb) setupTransitionCb(_.transitionEndEvent)
		    } else if (transitionType === 2) {
		      // animations are triggered when class is added
		      // so we just listen for animationend to remove it.
		      setupTransitionCb(_.animationEndEvent, function () {
		        removeClass(el, cls)
		      })
		    } else {
		      // no transition applicable
		      removeClass(el, cls)
		      if (cb) cb()
		    }
		  } else { // LEAVE
		    if (transitionType) {
		      // leave transitions/animations are both triggered
		      // by adding the class, just remove it on end event.
		      var event = transitionType === 1
		        ? _.transitionEndEvent
		        : _.animationEndEvent
		      setupTransitionCb(event, function () {
		        op()
		        removeClass(el, cls)
		      })
		    } else {
		      op()
		      removeClass(el, cls)
		      if (cb) cb()
		    }
		  }

		  /**
		   * Set up a transition end callback, store the callback
		   * on the element's __v_trans data object, so we can
		   * clean it up if another transition is triggered before
		   * the callback is fired.
		   *
		   * @param {String} event
		   * @param {Function} [cleanupFn]
		   */

		  function setupTransitionCb (event, cleanupFn) {
		    data.event = event
		    var onEnd = data.callback = function transitionCb (e) {
		      if (e.target === el) {
		        _.off(el, event, onEnd)
		        data.event = data.callback = null
		        if (cleanupFn) cleanupFn()
		        if (cb) cb()
		      }
		    }
		    _.on(el, event, onEnd)
		  }
		}

		/**
		 * Get an element's transition type based on the
		 * calculated styles
		 *
		 * @param {Element} el
		 * @param {Object} data
		 * @param {String} className
		 * @return {Number}
		 *         1 - transition
		 *         2 - animation
		 */

		function getTransitionType (el, data, className) {
		  var type = data.cache && data.cache[className]
		  if (type) return type
		  var inlineStyles = el.style
		  var computedStyles = window.getComputedStyle(el)
		  var transDuration =
		    inlineStyles[transDurationProp] ||
		    computedStyles[transDurationProp]
		  if (transDuration && transDuration !== '0s') {
		    type = 1
		  } else {
		    var animDuration =
		      inlineStyles[animDurationProp] ||
		      computedStyles[animDurationProp]
		    if (animDuration && animDuration !== '0s') {
		      type = 2
		    }
		  }
		  if (type) {
		    if (!data.cache) data.cache = {}
		    data.cache[className] = type
		  }
		  return type
		}

		/**
		 * Apply CSS transition to an element.
		 *
		 * @param {Element} el
		 * @param {Number} direction - 1: enter, -1: leave
		 * @param {Function} op - the actual DOM operation
		 * @param {Object} data - target element's transition data
		 */

		module.exports = function (el, direction, op, data, cb) {
		  var prefix = data.id || 'v'
		  var enterClass = prefix + '-enter'
		  var leaveClass = prefix + '-leave'
		  // clean up potential previous unfinished transition
		  if (data.callback) {
		    _.off(el, data.event, data.callback)
		    removeClass(el, enterClass)
		    removeClass(el, leaveClass)
		    data.event = data.callback = null
		  }
		  if (direction > 0) { // enter
		    addClass(el, enterClass)
		    op()
		    push(el, direction, null, enterClass, cb)
		  } else { // leave
		    addClass(el, leaveClass)
		    push(el, direction, op, leaveClass, cb)
		  }
		}

	/***/ },
	/* 55 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Apply JavaScript enter/leave functions.
		 *
		 * @param {Element} el
		 * @param {Number} direction - 1: enter, -1: leave
		 * @param {Function} op - the actual DOM operation
		 * @param {Object} data - target element's transition data
		 * @param {Object} def - transition definition object
		 * @param {Vue} vm - the owner vm of the element
		 * @param {Function} [cb]
		 */

		module.exports = function (el, direction, op, data, def, vm, cb) {
		  if (data.cancel) {
		    data.cancel()
		    data.cancel = null
		  }
		  if (direction > 0) { // enter
		    if (def.beforeEnter) {
		      def.beforeEnter.call(vm, el)
		    }
		    op()
		    if (def.enter) {
		      data.cancel = def.enter.call(vm, el, function () {
		        data.cancel = null
		        if (cb) cb()
		      })
		    } else if (cb) {
		      cb()
		    }
		  } else { // leave
		    if (def.leave) {
		      data.cancel = def.leave.call(vm, el, function () {
		        data.cancel = null
		        op()
		        if (cb) cb()
		      })
		    } else {
		      op()
		      if (cb) cb()
		    }
		  }
		}

	/***/ },
	/* 56 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  bind: function () {
		    var self = this
		    var el = this.el

		    // check params
		    // - lazy: update model on "change" instead of "input"
		    var lazy = this._checkParam('lazy') != null
		    // - number: cast value into number when updating model.
		    var number = this._checkParam('number') != null

		    // handle composition events.
		    // http://blog.evanyou.me/2014/01/03/composition-event/
		    var cpLocked = false
		    this.cpLock = function () {
		      cpLocked = true
		    }
		    this.cpUnlock = function () {
		      cpLocked = false
		      // in IE11 the "compositionend" event fires AFTER
		      // the "input" event, so the input handler is blocked
		      // at the end... have to call it here.
		      set()
		    }
		    _.on(el,'compositionstart', this.cpLock)
		    _.on(el,'compositionend', this.cpUnlock)

		    // shared setter
		    function set () {
		      self.set(
		        number ? _.toNumber(el.value) : el.value,
		        true
		      )
		    }

		    // if the directive has filters, we need to
		    // record cursor position and restore it after updating
		    // the input with the filtered value.
		    // also force update for type="range" inputs to enable
		    // "lock in range" (see #506)
		    this.listener = this.filters || el.type === 'range'
		      ? function textInputListener () {
		          if (cpLocked) return
		          var charsOffset
		          // some HTML5 input types throw error here
		          try {
		            // record how many chars from the end of input
		            // the cursor was at
		            charsOffset = el.value.length - el.selectionStart
		          } catch (e) {}
		          // Fix IE10/11 infinite update cycle
		          // https://github.com/yyx990803/vue/issues/592
		          /* istanbul ignore if */
		          if (charsOffset < 0) {
		            return
		          }
		          set()
		          _.nextTick(function () {
		            // force a value update, because in
		            // certain cases the write filters output the
		            // same result for different input values, and
		            // the Observer set events won't be triggered.
		            var newVal = self._watcher.value
		            self.update(newVal)
		            if (charsOffset != null) {
		              var cursorPos =
		                _.toString(newVal).length - charsOffset
		              el.setSelectionRange(cursorPos, cursorPos)
		            }
		          })
		        }
		      : function textInputListener () {
		          if (cpLocked) return
		          set()
		        }

		    this.event = lazy ? 'change' : 'input'
		    _.on(el, this.event, this.listener)

		    // IE9 doesn't fire input event on backspace/del/cut
		    if (!lazy && _.isIE9) {
		      this.onCut = function () {
		        _.nextTick(self.listener)
		      }
		      this.onDel = function (e) {
		        if (e.keyCode === 46 || e.keyCode === 8) {
		          self.listener()
		        }
		      }
		      _.on(el, 'cut', this.onCut)
		      _.on(el, 'keyup', this.onDel)
		    }

		    // set initial value if present
		    if (
		      el.hasAttribute('value') ||
		      (el.tagName === 'TEXTAREA' && el.value.trim())
		    ) {
		      this._initValue = number
		        ? _.toNumber(el.value)
		        : el.value
		    }
		  },

		  update: function (value) {
		    this.el.value = _.toString(value)
		  },

		  unbind: function () {
		    var el = this.el
		    _.off(el, this.event, this.listener)
		    _.off(el,'compositionstart', this.cpLock)
		    _.off(el,'compositionend', this.cpUnlock)
		    if (this.onCut) {
		      _.off(el,'cut', this.onCut)
		      _.off(el,'keyup', this.onDel)
		    }
		  }

		}

	/***/ },
	/* 57 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  bind: function () {
		    var self = this
		    var el = this.el
		    this.listener = function () {
		      self.set(el.value, true)
		    }
		    _.on(el, 'change', this.listener)
		    if (el.checked) {
		      this._initValue = el.value
		    }
		  },

		  update: function (value) {
		    /* jshint eqeqeq: false */
		    this.el.checked = value == this.el.value
		  },

		  unbind: function () {
		    _.off(this.el, 'change', this.listener)
		  }

		}

	/***/ },
	/* 58 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(21)

		module.exports = {

		  bind: function () {
		    var self = this
		    var el = this.el
		    // check options param
		    var optionsParam = this._checkParam('options')
		    if (optionsParam) {
		      initOptions.call(this, optionsParam)
		    }
		    this.multiple = el.hasAttribute('multiple')
		    this.listener = function () {
		      var value = self.multiple
		        ? getMultiValue(el)
		        : el.value
		      self.set(value, true)
		    }
		    _.on(el, 'change', this.listener)
		    checkInitialValue.call(this)
		  },

		  update: function (value) {
		    /* jshint eqeqeq: false */
		    var el = this.el
		    el.selectedIndex = -1
		    var multi = this.multiple && _.isArray(value)
		    var options = el.options
		    var i = options.length
		    var option
		    while (i--) {
		      option = options[i]
		      option.selected = multi
		        ? indexOf(value, option.value) > -1
		        : value == option.value
		    }
		  },

		  unbind: function () {
		    _.off(this.el, 'change', this.listener)
		    if (this.optionWatcher) {
		      this.optionWatcher.teardown()
		    }
		  }

		}

		/**
		 * Initialize the option list from the param.
		 *
		 * @param {String} expression
		 */

		function initOptions (expression) {
		  var self = this
		  function optionUpdateWatcher (value) {
		    if (_.isArray(value)) {
		      self.el.innerHTML = ''
		      buildOptions(self.el, value)
		      if (self._watcher) {
		        self.update(self._watcher.value)
		      }
		    } else {
		      _.warn('Invalid options value for v-model: ' + value)
		    }
		  }
		  this.optionWatcher = new Watcher(
		    this.vm,
		    expression,
		    optionUpdateWatcher,
		    { deep: true }
		  )
		  // update with initial value
		  optionUpdateWatcher(this.optionWatcher.value)
		}

		/**
		 * Build up option elements. IE9 doesn't create options
		 * when setting innerHTML on <select> elements, so we have
		 * to use DOM API here.
		 *
		 * @param {Element} parent - a <select> or an <optgroup>
		 * @param {Array} options
		 */

		function buildOptions (parent, options) {
		  var op, el
		  for (var i = 0, l = options.length; i < l; i++) {
		    op = options[i]
		    if (!op.options) {
		      el = document.createElement('option')
		      if (typeof op === 'string') {
		        el.text = el.value = op
		      } else {
		        el.text = op.text
		        el.value = op.value
		      }
		    } else {
		      el = document.createElement('optgroup')
		      el.label = op.label
		      buildOptions(el, op.options)
		    }
		    parent.appendChild(el)
		  }
		}

		/**
		 * Check the initial value for selected options.
		 */

		function checkInitialValue () {
		  var initValue
		  var options = this.el.options
		  for (var i = 0, l = options.length; i < l; i++) {
		    if (options[i].hasAttribute('selected')) {
		      if (this.multiple) {
		        (initValue || (initValue = []))
		          .push(options[i].value)
		      } else {
		        initValue = options[i].value
		      }
		    }
		  }
		  if (initValue) {
		    this._initValue = initValue
		  }
		}

		/**
		 * Helper to extract a value array for select[multiple]
		 *
		 * @param {SelectElement} el
		 * @return {Array}
		 */

		function getMultiValue (el) {
		  return Array.prototype.filter
		    .call(el.options, filterSelected)
		    .map(getOptionValue)
		}

		function filterSelected (op) {
		  return op.selected
		}

		function getOptionValue (op) {
		  return op.value || op.text
		}

		/**
		 * Native Array.indexOf uses strict equal, but in this
		 * case we need to match string/numbers with soft equal.
		 *
		 * @param {Array} arr
		 * @param {*} val
		 */

		function indexOf (arr, val) {
		  /* jshint eqeqeq: false */
		  var i = arr.length
		  while (i--) {
		    if (arr[i] == val) return i
		  }
		  return -1
		}

	/***/ },
	/* 59 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)

		module.exports = {

		  bind: function () {
		    var self = this
		    var el = this.el
		    this.listener = function () {
		      self.set(el.checked, true)
		    }
		    _.on(el, 'change', this.listener)
		    if (el.checked) {
		      this._initValue = el.checked
		    }
		  },

		  update: function (value) {
		    this.el.checked = !!value
		  },

		  unbind: function () {
		    _.off(this.el, 'change', this.listener)
		  }

		}

	/***/ },
	/* 60 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var arrayProto = Array.prototype
		var arrayMethods = Object.create(arrayProto)

		/**
		 * Intercept mutating methods and emit events
		 */

		;[
		  'push',
		  'pop',
		  'shift',
		  'unshift',
		  'splice',
		  'sort',
		  'reverse'
		]
		.forEach(function (method) {
		  // cache original method
		  var original = arrayProto[method]
		  _.define(arrayMethods, method, function mutator () {
		    // avoid leaking arguments:
		    // http://jsperf.com/closure-with-arguments
		    var i = arguments.length
		    var args = new Array(i)
		    while (i--) {
		      args[i] = arguments[i]
		    }
		    var result = original.apply(this, args)
		    var ob = this.__ob__
		    var inserted
		    switch (method) {
		      case 'push':
		        inserted = args
		        break
		      case 'unshift':
		        inserted = args
		        break
		      case 'splice':
		        inserted = args.slice(2)
		        break
		    }
		    if (inserted) ob.observeArray(inserted)
		    // notify change
		    ob.notify()
		    return result
		  })
		})

		/**
		 * Swap the element at the given index with a new value
		 * and emits corresponding event.
		 *
		 * @param {Number} index
		 * @param {*} val
		 * @return {*} - replaced element
		 */

		_.define(
		  arrayProto,
		  '$set',
		  function $set (index, val) {
		    if (index >= this.length) {
		      this.length = index + 1
		    }
		    return this.splice(index, 1, val)[0]
		  }
		)

		/**
		 * Convenience method to remove the element at given index.
		 *
		 * @param {Number} index
		 * @param {*} val
		 */

		_.define(
		  arrayProto,
		  '$remove',
		  function $remove (index) {
		    if (typeof index !== 'number') {
		      index = this.indexOf(index)
		    }
		    if (index > -1) {
		      return this.splice(index, 1)[0]
		    }
		  }
		)

		module.exports = arrayMethods

	/***/ },
	/* 61 */
	/***/ function(module, exports, __webpack_require__) {

		var _ = __webpack_require__(1)
		var objProto = Object.prototype

		/**
		 * Add a new property to an observed object
		 * and emits corresponding event
		 *
		 * @param {String} key
		 * @param {*} val
		 * @public
		 */

		_.define(
		  objProto,
		  '$add',
		  function $add (key, val) {
		    if (this.hasOwnProperty(key)) return
		    var ob = this.__ob__
		    if (!ob || _.isReserved(key)) {
		      this[key] = val
		      return
		    }
		    ob.convert(key, val)
		    if (ob.vms) {
		      var i = ob.vms.length
		      while (i--) {
		        var vm = ob.vms[i]
		        vm._proxy(key)
		        vm._digest()
		      }
		    } else {
		      ob.notify()
		    }
		  }
		)

		/**
		 * Deletes a property from an observed object
		 * and emits corresponding event
		 *
		 * @param {String} key
		 * @public
		 */

		_.define(
		  objProto,
		  '$delete',
		  function $delete (key) {
		    if (!this.hasOwnProperty(key)) return
		    delete this[key]
		    var ob = this.__ob__
		    if (!ob || _.isReserved(key)) {
		      return
		    }
		    if (ob.vms) {
		      var i = ob.vms.length
		      while (i--) {
		        var vm = ob.vms[i]
		        vm._unproxy(key)
		        vm._digest()
		      }
		    } else {
		      ob.notify()
		    }
		  }
		)

	/***/ }
	/******/ ])
	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {(function() {
	    var root;

		if (typeof window === 'object' && window) {
			root = window;
		} else {
			root = global;
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = root.Promise ? root.Promise : Promise;
		} else if (!root.Promise) {
			root.Promise = Promise;
		}

		// Use polyfill for setImmediate for performance gains
		var asap = root.setImmediate || function(fn) { setTimeout(fn, 1); };

		// Polyfill for Function.prototype.bind
		function bind(fn, thisArg) {
			return function() {
				fn.apply(thisArg, arguments);
			}
		}

		var isArray = Array.isArray || function(value) { return Object.prototype.toString.call(value) === "[object Array]" };

		function Promise(fn) {
			if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
			if (typeof fn !== 'function') throw new TypeError('not a function');
			this._state = null;
			this._value = null;
			this._deferreds = []

			doResolve(fn, bind(resolve, this), bind(reject, this))
		}

		function handle(deferred) {
			var me = this;
			if (this._state === null) {
				this._deferreds.push(deferred);
				return
			}
			asap(function() {
				var cb = me._state ? deferred.onFulfilled : deferred.onRejected
				if (cb === null) {
					(me._state ? deferred.resolve : deferred.reject)(me._value);
					return;
				}
				var ret;
				try {
					ret = cb(me._value);
				}
				catch (e) {
					deferred.reject(e);
					return;
				}
				deferred.resolve(ret);
			})
		}

		function resolve(newValue) {
			try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
				if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
				if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
					var then = newValue.then;
					if (typeof then === 'function') {
						doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
						return;
					}
				}
				this._state = true;
				this._value = newValue;
				finale.call(this);
			} catch (e) { reject.call(this, e); }
		}

		function reject(newValue) {
			this._state = false;
			this._value = newValue;
			finale.call(this);
		}

		function finale() {
			for (var i = 0, len = this._deferreds.length; i < len; i++) {
				handle.call(this, this._deferreds[i]);
			}
			this._deferreds = null;
		}

		function Handler(onFulfilled, onRejected, resolve, reject){
			this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
			this.onRejected = typeof onRejected === 'function' ? onRejected : null;
			this.resolve = resolve;
			this.reject = reject;
		}

		/**
		 * Take a potentially misbehaving resolver function and make sure
		 * onFulfilled and onRejected are only called once.
		 *
		 * Makes no guarantees about asynchrony.
		 */
		function doResolve(fn, onFulfilled, onRejected) {
			var done = false;
			try {
				fn(function (value) {
					if (done) return;
					done = true;
					onFulfilled(value);
				}, function (reason) {
					if (done) return;
					done = true;
					onRejected(reason);
				})
			} catch (ex) {
				if (done) return;
				done = true;
				onRejected(ex);
			}
		}

		Promise.prototype['catch'] = function (onRejected) {
			return this.then(null, onRejected);
		};

		Promise.prototype.then = function(onFulfilled, onRejected) {
			var me = this;
			return new Promise(function(resolve, reject) {
				handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
			})
		};

		Promise.all = function () {
			var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

			return new Promise(function (resolve, reject) {
				if (args.length === 0) return resolve([]);
				var remaining = args.length;
				function res(i, val) {
					try {
						if (val && (typeof val === 'object' || typeof val === 'function')) {
							var then = val.then;
							if (typeof then === 'function') {
								then.call(val, function (val) { res(i, val) }, reject);
								return;
							}
						}
						args[i] = val;
						if (--remaining === 0) {
							resolve(args);
						}
					} catch (ex) {
						reject(ex);
					}
				}
				for (var i = 0; i < args.length; i++) {
					res(i, args[i]);
				}
			});
		};

		Promise.resolve = function (value) {
			if (value && typeof value === 'object' && value.constructor === Promise) {
				return value;
			}

			return new Promise(function (resolve) {
				resolve(value);
			});
		};

		Promise.reject = function (value) {
			return new Promise(function (resolve, reject) {
				reject(value);
			});
		};

		Promise.race = function (values) {
			return new Promise(function (resolve, reject) {
				for(var i = 0, len = values.length; i < len; i++) {
					values[i].then(resolve, reject);
				}
			});
		};
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])