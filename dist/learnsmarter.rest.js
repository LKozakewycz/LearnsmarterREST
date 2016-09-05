(function($) {

	var config = {
		url : '',
		container : null
	};

	var methods = {
		init : function(initConfig) {
			config = $.extend({}, config, initConfig)
		},

	/**
	 * @description	: 	Get a list of courses
	 *
	 * @param		object							options
	 */
		getCourses : function(options) {
			var calloutUrl = ''+config.url;

			if ( optionSet(options, 'courseAreaId') ) {
				calloutUrl = calloutUrl + '/' + options['courseAreaId']; 
			}

			if ( optionSet(options, 'page') ) {
				calloutUrl = calloutUrl + '/' + options['page'];
			}

			var callback = createCallbackFunction(this, options);

			sendRequest(calloutUrl, callback);
		},

	/**
	 * @description	: 	Get a list of scheduled courses
	 *
	 * @param		object							options
	 */
		getEvents : function(options) {
			var calloutUrl = ''+config.url;
	
			if ( optionSet(options, 'courseId') ) {
				calloutUrl = calloutUrl + '/' + options['courseId']; 
			}

			if ( optionSet(options, 'page') ) {
				calloutUrl = calloutUrl + '/' + options['page'];
			}

			var callback = createCallbackFunction(this, options);

			sendRequest(calloutUrl, callback);
		},


	/**
	 * @description	: 	Auto render variables and repeat
	 *
	 * @param		object							options
	 * @param		object							record results
	 */
		autoRender : function($this, data) {
			var container;

			$($this).find('[ls-object]').each(function(){
				renderObjectFields($(this), data);
			});

			$($this).find('[ls-repeat]').each(function(){
				renderRepeat($(this), data);
			});
		}
	};


	/**
	 * @description	: 	Render repeat tags
	 *
	 * @param		object							options
	 * @param		object							record results
	 */
	var renderRepeat = function(container, data) {
		container.hide();

		var $data = data;

		if ( Object.prototype.toString.call($data) !== '[object Array]' ) {
			$data = data[container.attr('ls-repeat')];
		}

		var maxResults = typeof container.attr('ls-repeat-max') !== 'undefined' ? container.attr('ls-repeat-max') : $data.length;

		if ( maxResults > $data.length ) {
			maxResults = $data.length;
		} else if ( $data.length > maxResults ) {
			$data.splice(0, $data.length-1);
		}

		var hasStringKeys = false;

		for ( var k in $data ) {
			if ( typeof k === 'string' && !$.isNumeric(k) ) {
				hasStringKeys = true;
			}
		}

		var newDoms = [];

		if ( !hasStringKeys ) {
			for ( var i=0; i<maxResults; i++ ) {
				var newDom = container.clone(true);
				newDom.attr('id', '');

				parseDOMFields(newDom, $data[i]);
				parseReferenceFields(newDom, $data[i]);

				newDom.show();
				newDom.removeAttr('ls-repeat ls-repeat-max');
				newDoms.push(newDom);
			}
		} else {
			for ( var k in $data ) {
				var newDom = container.clone(true);
				newDom.attr('id', '');

				parseDOMFields(newDom, {'key':k, 'value':$data[k]});
				parseReferenceFields(newDom, {'key':k, 'value':$data[k]});

				newDom.show();
				newDom.removeAttr('ls-repeat ls-repeat-max');
				newDoms.push(newDom);
			}
		}

		container.after(newDoms);
		container.remove();
	}


	/**
	 * @description	: 	Parse and render object fields
	 *
	 * @param		object							container element
	 * @param		object							json response object
	 */
	var renderObjectFields = function(container, $data) {
		var obj = container.attr('ls-object');
	
		parseDOMFields(container, $data, obj);
		parseReferenceFields(container, $data, obj);

		container.show();
	}


	/**
	 * @description	: 	Parse DOM fields
	 *
	 * @param		object							container element
	 * @param		object							json response object
	 */
	var parseDOMFields = function(newDom, $data, obj) {
		if ( typeof obj !== 'undefined' && obj != null && obj !== '' ) {
			$data = $data[obj];
		}

		// Find each field element
		newDom.find('[ls-field]').each(function(){
			var val = getFieldValue($data, $(this).attr('ls-field'));

			// Format dates/times (requires moment.js)
			if ( typeof $(this).attr('ls-format') !== 'undefined' && val !== '' ) {
				if ( typeof moment === 'undefined' ) {
					console.warn('moment.js is required for date/time formatting: http://momentjs.com');
				} else {
					val = moment(val).format($(this).attr('ls-format'));
				}
			}

			// Set value to DOM (escaped or not)
			if ( $(this).attr('ls-escape') === 'false' ) {
				$(this).html(val);
			} else {
				$(this).text(val);
			}

			$(this).removeAttr('ls-field ls-format')
		});
	}

	/**
	 * @description	: 	Parse referenced fields (fields no specified by the ls-field
	 *					attribute, but using Visualforce style tags: {!example} 
	 *
	 * @param		object							container element
	 * @param		object							json response object
	 */
	var parseReferenceFields = function(newDom, $data, obj) {
		if ( typeof obj !== 'undefined' && obj != null && obj !== ''  ) {
			$data = $data[obj];
		}

		// Find each field reference directly
		var html = ''+newDom.html();
		var vm = html.match(/{!([a-zA-Z_\.]+)}/gi);

		if ( vm != null ) {
			for ( var x=0; x<vm.length; x++ ) {
				var fieldVal = getFieldValue($data, vm[x].substring(2, vm[x].length-1));
				var escapedVal = $('<span/>').text(fieldVal).text();

				html = html.replace(vm[x], escapedVal);
			}

			newDom.html(html);
		}
	}


/**
 * @description	: 	Get the value of the specified field
 *
 * @param		object							SObject record
 * @param		string							field path
 */
	var getFieldValue = function(obj, path) {
		var fp = path.split('.');

		for ( var i=0; i<fp.length-1; i++ ) {
			if ( typeof obj[fp[i]] === 'undefined' ) {
				return '';
			}

			obj = obj[fp[i]];
		}

		return obj[fp[fp.length-1]];
	}


/**
 * @description	: 	Create a callback function based on the given options
 *
 * @param		jQuery object					parent element					
 * @param		object							options
 */
	var createCallbackFunction = function($this, options) {
		var callback;

		if ( optionSet(options, 'onSuccess') ) {
			callback = options['onSuccess'];
		}


		if ( !optionSet(options, 'autoRender') || options['autoRender'] === true ) {
			var onSuccess;
			var beforeRender;

			if ( typeof callback !== 'undefined' && callback !== null ) {
				onSuccess = callback.clone();
			}

			if ( optionSet(options, 'beforeRender') ) {
				beforeRender = options['beforeRender'];
			}

			callback = function(data) {
				if ( typeof beforeRender === 'function' ) {
					beforeRender(data);
				}

				methods.autoRender($this, data);

				if ( typeof onSuccess === 'function' ) {
					onSuccess(data);
				} 
			};
		}

		return callback;
	}


/**
 * @description	: 	Send a callout request to given URL and invoke the specified
 *					callback function.
 *
 * @param		string							callout url
 * @param		function  						callback function
 */
	var sendRequest = function(calloutUrl, callback) {
		$.ajax({
            type 		: 'GET',
            url 		: calloutUrl,
            dataType 	: 'json',
            success		: callback,
            error		: function (event, jqXHR, ajaxSettings, thrownError) {
                alert('Callout to REST API Failed.');
                console.error(event);
                console.error(jqXHR);
                console.error(ajaxSettings);
                console.error(thrownError);
            }
        });
	};

/**
 * @description	: 	Determine if an option has been set on an object.
 *
 * @param		object							option object
 * @param		string							option key
 */
	var optionSet = function(obj, k) {
		return typeof obj !== 'undefined' && typeof obj[k] !== 'undefined' && obj[k];
	};

/**
 * @description	: 	Clone a function
 *
 * @param		object							option object
 * @param		string							option key
 */
	Function.prototype.clone = function() {
	    var that = this;
	    var temp = function temporary() { return that.apply(this, arguments); };
	    for(var key in this) {
	        if (this.hasOwnProperty(key)) {
	            temp[key] = this[key];
	        }
	    }
	    return temp;
	};

/**
 * @description	: 	Initiate the Learnsmarter REST plugin
 *
 * @param		mixed							method to call or options to include on init
 */
	$.fn.LearnsmarterREST = function(methodOrOptions) {
		if ( methods[methodOrOptions] ) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof methodOrOptions === 'object' || !methodOrOptions ) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + methodOrOptions + ' does not exist on LearnsmarterREST');
		}
	}


}( jQuery ));