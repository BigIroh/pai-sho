(function () {
	var http = window.http = {};

	http.request = function (opts) {
		//required params
		if(opts.url === undefined) {
			throw new Error("http.request missing required parameter `url`");
		}
		else if(opts.method === undefined) {
			throw new Error("http.request missing required parameter `method`");
		}
		
		//optional params
		if(opts.progress === undefined) {
			opts.progress = function () {};
		}
		if(opts.done === undefined) {
			opts.done = function () {};
		}

		//open the request
		xhr = new XMLHttpRequest();
		if(opts.user && opts.password) {
			xhr.open(opts.method, opts.url, true, opts.user, opts.password);
		}
		else {
			xhr.open(opts.method, opts.url, true);
		}

		if(opts.data !== undefined) {
			xhr.send(opts.data);
		}

		//set up handlers
		xhr._transferred = 0;
		xhr.onreadystatechange = function () {
			//headers recieved
			if(xhr.readystate == 2) {
				var type = xhr.getResponseHeader('Content-Type');
				switch (type) {
					case 'application/json':
					case 'text/json':
						xhr.responseType = 'json';
						break;
					case 'text/plain':
					case 'text/html':
					default:
						xhr.responseType = 'text';
						break;
				}
			}
			//loading
			else if(xhr.readystate == 3) {
				var update = xhr.responseText.substring(xhr._transferred);
				xhr._transferred = xhr.responseText.length;
				opts.progress.call(xhr, update);
			}
			//done
			else if(xhr.readystate == 4) {
				opts.done(xhr.status, xhr.response);
			}
		}
	}

	var verbs = ['get', 'post', 'put', 'delete'];
	verbs.forEach(function (verb) {
		http[verb] = function (opts) {
			opts.method = verb;
			return http.request(opts);
		}
	});
}())
