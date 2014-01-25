Object.defineProperty(Object.prototype, 'clone', {
	value: function () {
		if(Array.isArray(this)) {
			result = []
		}
		else {
			var result = {};
		}
		
		for(key in this) {
			var val = this[key];

			//copy array
			if(Array.isArray(val)) {
				result[key] = val.slice().clone();
			}
			//prevent weird typeof null == object
			else if(val === null) {
				result[key] = val;
			}
			//delete a key
			else if(val === undefined) {
				continue;
			}
			//clone object
			else if(typeof val === "object") {
				result[key] = val.clone();
			}
			//copy primitive
			else {
				result[key] = val;
			}
		}
		return result;
	}
});

Object.defineProperty(Object.prototype, 'absorb', {
	value: function (obj) {
		for(key in obj) {
			var next = obj[key];
			var current = this[key];
			if(Array.isArray(next)) {
				this[key] = next.slice().clone();
			}
			else if(next === null) {
				this[key] = next;
			}
			else if(next === undefined) {
				continue;
			}
			else if(typeof next === 'object') {
				if(current === null) {
					current = next.clone();
				}
				else if(typeof current === 'object') {
					current.absorb(next);
				}
				else if(current === undefined) {
					current = next.clone();
				}
			}
			else {
				this[key] = next;
			}	
		}
		return this;
	}
});

Object.defineProperty(Array.prototype, 'remove', {
	value: function (obj) {
		var i = this.indexOf(obj);
		if(~i) {
			this = this.splice(i,1);
		}
		return this;
	}
});