var fullimg = (function(){
	var template = 	'<div class="shadow">'+
						'<p class="info">'+
							'<span class="close">关闭</span>'+
							'<span class="cur-num">{#index#}</span>/<span class="all-num">{#all#}</span>'+
						'</p>'+
						'<ul class="fullimg" style="width:{#width#} ;transform: translateX({#offset#})">'+
							'<!-- data-repeat -->'+
							'<li class="prev" style="background-image: url(x.src)" data-repeat="x in srcs"></li>'+
							'<!-- end data-repeat -->'+
						'</ul>'+
					'</div>',

		shadow, wrap, cur_num, all, index, imgs, srcs = [], str, offset, init, addEvent
		body = $('body'),
		_width = body.width()

	init = function(cur){
			index = cur

		if (shadow) {
			offset = '-' + (_width * index) + 'px'
			wrap.css({width: width, transform: 'translateX('+offset+')'})
			cur_num.text(index+1)
			shadow.fadeIn()
		} else {
			imgs = $('.j-fullimg')
			all = imgs.length
			width = 100*all + '%'
			offset = '-' + (_width * index) + 'px'

			imgs.each(function(){
				srcs.push({src: $(this).attr('src') })
			})

			str = template.format({
				index: index+1,
				all: all,
				width: width,
				srcs: srcs,
				offset: offset
			})

			body.append(str)
			wrap = $('.fullimg')
			shadow = $('.shadow')
			cur_num = $('.cur-num')
			wrap.addClass('transition')

			addEvent()
		}

		body[0].ontouchmove = function(e){
			e.preventDefault()
		}
	}

	addEvent = function(){


		$('.close').on('tap', function(){
			shadow.hide()
			body[0].ontouchmove = null
		})

		wrap.on('swipeLeft', function(){
			console.log(index)
			if (index < all-1) {
				index++
				offset = '-' + (_width * index) + 'px'
				cur_num.text(index+1)
				wrap.css({width: width, transform: 'translateX('+offset+')'})
			}
		})
		wrap.on('swipeRight', function(){
			console.log(index)
			if (index > 0) {
				index--
				cur_num.text(index+1)
				offset = '-' + (_width * index) + 'px'
				wrap.css({width: width, transform: 'translateX('+offset+')'})
			}
		})
	}

	return {
		init: init
	}
})()


;(function(){
	var template = {
		title: '<p class="title">{#actTitle#}</p>',

		item: 	'<li class="shows-item ui-table-tb clearfix">'+
					'<p class="time">{#ctime#}</p>'+
					'<ul class="imgtxts">'+
						'<!-- data-repeat -->'+
						'<li class="imgtxts-item" data-repeat="x in shows">'+
							'<p class="txt">x.brief</p>'+
							'<img src="x.src" alt="" class="img j-fullimg">'+
						'</li>'+
						'<!-- end data-repeat -->'+
					'</ul>'+
					'<button class="thumb status{#is_like#}" data-like="{#like#}" data-id="{#id#}">'+
						'<span class="thumb-num">{#like#}</span>'+
						'<i class="icon-heart"></i>'+
					'</button>'+
				'</li>'
	},
	url = {
		list: 'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_show'
	},
	aid = utils.parseHash().id,
	str = ''


	$.get(url.list, {uid: uid, aid: aid}, function(res){
		if (res.Code != 0) {$.tips({content: res.errorMsg}); return}

		// 渲染dom
		str = template.title.format(res.result)
		if (res.result.actShowList) {
			var data = res.result.actShowList

			str += '<ul class="shows">'
			for (var i = 0; i < data.length; i++) {
				data[i].shows = JSON.parse(data[i].shows)

				str += template.item.format(data[i])
			}
			str += '</ul>'
		} else {
			str += '<p class="none">活动照片收集中,待会再来看吧</p>'
		}
		$('#wrapper').append(str)

		// 绑定事件
		$('#wrapper').on('tap', function(e){
			var target = $(e.target)

			if (target[0].nodeName == 'I') {
				var parent = target.parent('.thumb'),
					num_wrap = target.siblings('.thumb-num'),
					num = Number(num_wrap.text()),
					id = parent.attr('data-id')

				if (parent.hasClass('status1')) {
					parent.removeClass('status1')
					num_wrap.text(num-1)
				} else {
					parent.addClass('status1')
					num_wrap.text(num+1)
				}

				$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_show_like_or_not', {uid: uid, sid: id})
			}

			if (target[0].nodeName == 'IMG') {
				var index = $('img').index(target)

				fullimg.init(index)
			}
		})
	}, 'json')

})()


