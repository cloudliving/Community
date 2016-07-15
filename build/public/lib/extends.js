// 模板解析方法
String.prototype.format = function(obj){
	var str = this.valueOf()

	// 替换{##}里内容
	str = str.replace(/{#(\w+(\.\w+)*)#}/g, function(match, key){
		return utils.getValue(obj, key)
	})

	// 替换 data-repeat
	str = str.replace(/<!-- data-repeat -->(.*data-repeat="(\w+)\sin\s(\w+)".*)<!-- end data-repeat -->/g, function(self, match, key, _obj){
		var repeat = '',
			_data = obj[_obj],
			re =  new RegExp(key + '\\.(\\w+)', 'g')

		for (var i = 0; i < _data.length; i++) {
			repeat += match.replace(re, function(a, b){
				return utils.getValue(_data[i], b)
			})					
		}
		return repeat
	})

	return str
}


// 工具对象
var utils = {}

// 获取对象属性值
utils.getValue = function(obj, attr){
	var ary = attr.split('.'), 
		_data

	if (ary.length>1) {
		_data = obj[ary[0]]
		for (var i = 1; i < ary.length; i++) {
			_data = _data[ary[i]]
		}
	} else {
		_data = obj[attr]
	}

	return _data
}


// loading遮罩、默认添加、
// 调用 utils.loading() 删除遮罩、显示dom
// 给#wrapper添加自定义属性data-loading="complate"后, loading不会自动加载
utils.loading = (function(){
	var wrap = $('#wrapper'),
		body = $('body'),
		loading = '<div id="loading"></div>',
		done,
		add

	done = function(){
		$('#loading').remove()
		wrap.addClass('fadein')
	}

	add = function(){
		body.append(loading)
	}

	if (wrap.attr('data-loading') == 'complate') {
		wrap.addClass('fadein')
	} else {
		add()
	}

	done.add = add
	return done
})()

// 解析hash
utils.parseHash = function(){
	var hash = (arguments[0] || location.hash).slice(1), obj = {}
	if (!hash) return

	hash.split('&').forEach(function(e){
		obj[e.split('=')[0]] = e.split('=')[1]
	})
	
	return obj
}

// 给链接加上UID尾巴, 包括动态添加的
var uid = (utils.parseHash() && utils.parseHash().uid) || 108391
;(function(){
	var clock;
	clearTimeout(clock)
	$('body').on('DOMNodeInserted', function(){
		clearTimeout(clock)
		clock = setTimeout(add, 300)
	})

	function add(){
		$('a').not('.finished').on('click', function(e){
			e.preventDefault()
			var href = $(this).attr('href')

			if (href.search('#')>0) {
				location.href = href + '&uid=' + uid
			} else {
				location.href = href + '#uid=' + uid
			}
		}).addClass('finished')
	}
})()


