Object.inspect = function(o){
	if($type(o)==false) return 'null';
	if($type(o.inspect)=='function') return o.inspect();
	if($type(o.toString)=='function') return o.toString();
	return '<unknown>';
};

String.implement('inspect',function(){return '"'+this.replace(/([\\"])/g,'\\$1')+'"'; });
Hash.implement('inspect',function(){ return this.getClean().inspect(); });
Array.implement('inspect',function(){
	var values = [];
	for(prop in this){
		if(!this.hasOwnProperty(prop)) continue;
		values.push(Object.inspect(this[prop]));
	}
	return '[' + values.join(',') + ']';
});
Window.implement('keyOf',Hash.prototype.keyOf);
Function.implement('inspect',function(){
	if($type(this)=='function') return this.toString();
	return '<class>';
});
Element.implement('inspect',function(){
	var ret = '<'+this.get('tag');
	var props = new Hash();
	$A(this.attributes).each(function(a){ props.include(a.name,a.nodeValue); });
	props.getKeys().sort().each(function(key){
		ret += ' '+Object.inspect(key)+'='+Object.inspect(props[key]);
	});
	if(this.getChildren().length > 0 || this.get('text').trim()!=='') ret += '>...</'+this.get('tag')+'>';
	else ret += ' />';
	return ret;
});
Document.implement('inspect',$lambda('Document'));
Window.implement('inspect',$lambda('Window'));

(function(){
	var toString = function(){ return this.toString(); };
	[Boolean,Native].map(function(type){ type.prototype.inspect=toString; });
	[RegExp,Number,Date].map(function(klass){ klass.implement('inspect',toString); });

	var objectInspect = function(){
		var kvPairs = [];
		for(prop in this){
			if(!this.hasOwnProperty(prop) || prop=='prototype') continue;
			kvPairs.push(Object.inspect(prop)+':'+Object.inspect(this[prop]));
		}
		return '{' + kvPairs.join(', ') + '}';
	};
	Object.prototype.inspect = objectInspect;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	Object.prototype.hasOwnProperty = function(prop){
		if(prop=='inspect' && Object.prototype[prop]==objectInspect) return false;
		return hasOwnProperty.call(this,prop); 
	};
})();
