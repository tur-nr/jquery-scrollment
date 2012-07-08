(function ($, window, undefined) {
	$.Scrollment = new function () {
		this.$win        = $(window)
		this.initiated   = false
		this.unique      = 0
		this.attachments = {}
		this.stack       = []

		this.init = function () {
			// check if already initiated
			if (! this.initiated) {
				this.$win.bind('scroll.scrollment', $.proxy(this.onScroll, this))

				setTimeout($.proxy(this.onScroll, this), 0)
			}

			return this.initiated = true
		}

		this.bindElement = function ($element, settings) {
			// scrollment reference
			var that = this

			$element.each(function () {
				var attachment = {
						 '$element': $(this),
						'settings': $.extend({
							            forceStart: false,
							        }, settings),
						     'get': function (key) {
						     	    	// helpers to return a defined value
										// or to call a function and get its returned value
										var value = function (k) {
											return this.settings[k]
										}
										, func = function (k) {
											return this.settings[k].apply(this.$element)
										}

										if (typeof this.settings[key] === 'function') {
											return func.apply(this, [key])
										}
										else {
											return value.apply(this, [key])
										}
									},
							 'css': function (key, state) {
						     	    	// helpers to return a defined value
										// or to call a function and get its returned value
										var value = function (k, s) {
											return this.settings.css[k][s]
										}
										, func = function (k, s) {
											return this.settings.css[k][s].apply(this.$element)
										}

										if (typeof this.settings.css[key][state] === 'function') {
											return func.apply(this, [key, state])
										}
										else {
											return value.apply(this, [key, state])
										}
									},
						 'trigger': function (key, params) {
										if (typeof this.settings[key] === 'function') {
											this.settings[key].apply(this.$element, Array.prototype.slice.call(arguments, 1))
										}
									},
						    'data': {
						    	'scrolling': true,
						    	    'first': true
						    }
				    }
				  , id  = attachment.get('id') || 'scrollment-'+(++that.unique)
				  , ids = attachment.$element.data('scrollment-ids')

				if (ids === undefined) ids = [id]
				else ids.push(id)

				attachment.$element.data('scrollment-ids', ids)

				// force start
				if (attachment.get('forceStart') === true) {
					var css = {}

					$.each(attachment.get('css'), function (property, options) {
						css[property] = attachment.css(property, 'start')
					})

					attachment.$element.css(css)
				}

				// add to scrollment attachment
				that.attachments[id] = attachment
			})
		}

		this.unbindElement = function ($element, id) {
			var ids = $element.data('scrollment-ids')

			// no scrollment in place
			if (ids === undefined)
				return $element
			else {
				if (id === undefined)
					id = ids
				else if (Object.prototype.toString.call(id) !== '[object Array]')
					id = [id]
			}

			// remove attachment and data
			for (var i = 0; i < id.length; i++) {
				delete this.attachments[id[i]]
				ids.remove(id[i])
			}

			this.refreshStack()
		}

		this.enableElement = function ($element, id, flag) {
			var ids  = $element.data('scrollment-ids')

			// no scrollment in place
			if (ids === undefined)
				return $element
			else {
				if (id === undefined)
					id = ids
				else if (Object.prototype.toString.call(id) !== '[object Array]')
					id = [id]
			}

			// enabled the scrollment
			for (var i = 0; i < id.length; i++) {
				this.attachments[id[i]].data.enabled = flag
			}
		}

		this.refreshStack = function (scrollTop) {
			var that = this // scrollment ref

			scrollTop  = scrollTop || this.$win.scrollTop()
			this.stack = []

			$.each(this.attachments, function (key, attachment) {
				var start = attachment.get('start')
				  , stop  = attachment.get('stop')

				if ((scrollTop >= start && scrollTop <= stop) || attachment.data.scrolling) {
					// add to stack
					that.stack.push(key)
				}
			})
		}

		this.onScroll = function (event) {
			var scrollTop = this.$win.scrollTop()

			for (var i = 0; i < this.stack.length; i++) {
				var attachment = this.attachments[this.stack[i]]
				  , start      = attachment.get('start')
				  , stop       = attachment.get('stop')
				  , frames     = Math.abs(stop-start)
				  , frame      = scrollTop-start
				  , animation  = $.extend({
				  				     'easing': 'swing',
				  				      'clear': false,
				  				       'jump': false
								 }, attachment.get('animation'))
				  , animate    = (typeof animation.duration === 'number')
				  , css        = {}

				if (attachment.data.enabled === false) continue;

				// precise frame
				if (frame < 0) frame = 0
				else if (frame > frames) frame = frames


				$.each(attachment.get('css'), function (property, options) {
					var start = attachment.css(property, 'start')
					  , stop  = attachment.css(property, 'stop')
					  , diff  = Math.abs(start-stop)
					  , add   = (diff/frames)*frame
					  , value

					// subtract
					if (start > stop) {
						add = -add
					}

					css[property] = start+add
				})

				// animate or not ??
				if (animate && attachment.data.first !== true)
					attachment.$element.stop(animation.clear, animation.jump)
				                       .animate(css, animation.duration, animation.easing)
				else {
					attachment.$element.css(css)
					attachment.data.first = false
				}

				// callbacks
				// started
				if (! attachment.data.scrolling) {
					attachment.trigger('onStart')
					attachment.data.scrolling = true

					// on frame
					attachment.trigger('onScroll', frame, frames)
				}
				else {
					// on frame
					attachment.trigger('onScroll', frame, frames)

					// stopped
					if (frame == 0 || frame == frames) {
						attachment.trigger('onStop')
						attachment.data.scrolling = false
					}
				}
			}

			// refresh stack
			this.refreshStack(scrollTop)
		}
	}

	$.fn.scrollment = function (options) {
		var $element = this
		  , id       = arguments[1]

		if (typeof options === 'string') {
			// check if scrollment is on element
			switch (options) {
				case 'start':
					$.Scrollment.enableElement($element, id, true)
					break

				case 'stop':
					$.Scrollment.enableElement($element, id, false)
					break

				case 'remove':
					$.Scrollment.unbindElement($element, id)
					break
			}

			return $element
		}
		// force options to be type array
		if (Object.prototype.toString.call(options) !== '[object Array]') options = [options]

		// attach element(s) to scrollment
		$.each(options, function (i, settings) {
			$.Scrollment.bindElement($element, settings)
		})

		// enable scrollment plugin
		$.Scrollment.init()

		return $element
	}

	// we need this to remove array elements
	Array.prototype.remove = function() {
	    var what, a= arguments, L= a.length, ax;
	    while(L && this.length){
	        what= a[--L];
	        while((ax= this.indexOf(what))!= -1){
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	}
	// IE8 indexOf
	Array.prototype.indexOf = function(what, i) {
        i= i || 0;
        var L= this.length;
        while(i< L){
            if(this[i]=== what) return i;
            ++i;
        }
        return -1;
    }
})(jQuery, window)