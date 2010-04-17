(function(){
	var inspect = function(){ return this.toString(); };
	[Boolean,Native].map(function(type){ type.prototype.inspect=inspect; });
	[RegExp,Number,Function,Date].map(function(klass){ klass.implement({inspect:inspect}); });
	String.implement({inspect:function(){return '"'+this.replace(/([\\"])/g,'\\$1')+'"'; }});
	Hash.implement({inspect:function(){
		var kv_pairs = [];
		for(prop in this){
			if(!this.hasOwnProperty(prop)) continue;
			kv_pairs.push(prop.inspect()+':'+($type(this[prop])=='object' ? $H(this[prop]) : this[prop]).inspect());
		}
		return '{' + kv_pairs.join(',') + '}';
	}});
	Array.implement({inspect:function(){
		var values = [];
		for(prop in this){
			if(!this.hasOwnProperty(prop)) continue;
			values.push(($type(this[prop])=='object' ? $H(this[prop]) : this[prop]).inspect());
		}
		return '[' + values.join(',') + ']';
	}});
})();
