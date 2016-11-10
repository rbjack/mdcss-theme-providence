/* eslint-env browser */
/* global examples, Prism */

var iFrameTimeoutID;

(function() {
	var throttle = function(type, name, obj) {
		obj = obj || window;
		var running = false;
		var func = function() {
			if (running) { return; }
			running = true;
			requestAnimationFrame(function() {
				obj.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		obj.addEventListener(type, func);
	};

	/* init - you can init any event */
	throttle("resize", "optimizedResize");
})();

function afterRender() {
	window.clearTimeout(iFrameTimeoutID);
	console.log('ping');
	resizeIFrameToFitContent();
}

function resizeIFrameToFitContent() {
	var iframes = document.querySelectorAll("iframe");
  for( var i = 0; i < iframes.length; i++) {
     setIFrameHeight( iframes[i] );
  }
}

function setIFrameHeight( iFrame ) {
	iFrame.style.height = iFrame.contentWindow.document.body.scrollHeight + "px";
}

document.addEventListener('DOMContentLoaded', function () {
	Array.prototype.forEach.call(document.querySelectorAll('pre code[class^="lang"]'), function (code) {
		// set pre, wrap, opts, and get meta data from code
		var pre  = code.parentNode;
		var conf = {};
		var text = String(code.textContent || code.innerText || '');

		// get meta data from code class
		code.className.replace(/^lang-(\w+)(?::(\w+))?/, function ($0, $1, $2) {
			if ($2) return 'example:' + $2 + ',lang:' + $2;

			if ($1 === 'example') return 'example:html';

			return 'lang:' + $1;
		}).split(/\s*,\s*/).forEach(function (opt) {
			opt = opt.split(':');

			conf[opt.shift().trim()] = opt.join(':').trim();
		});

		code.removeAttribute('class');

		// conditionally syntax highlight code
		if (conf.lang in Prism.languages) code.innerHTML = Prism.highlight(text, Prism.languages[conf.lang]);

		// conditionally create code examples
		if (conf.example in examples.lang) {
			examples.lang[conf.example](pre, text, conf);
		}
	});

	iFrameTimeoutID = window.setTimeout(afterRender, 10);
});

// handle event
window.addEventListener("optimizedResize", function() {
	resizeIFrameToFitContent();
});
