;(function(){
	var href = location.href,
		template = {
			index: 	'<!-- data-repeat -->'+
					'<li class="item status-x.status_num live-status-x.live_status" data-repeat="x in list" data-id="x.id">'+
						'<a class="wrap" href="detail.html?id=x.id">'+
							'<img src="x.image" class="thumb">'+
							'<p class="title">x.title <img src="../../public/images/live.png" alt="" class="live" /></p>'+
							'<div class="flex-wrap">'+
								'<p class="hot"><i class="icon-fire"></i> x.heat</p>'+
								'<p class="commu"><i class="icon-house-2"></i> x.department_name</p>'+
							'</div>'+
						'</a>'+
					'</li>'+
					'<!-- end data-repeat -->',

			detail: '<div class="act-detail open-key live-status-{#live_status#}">'+
						'<div class="hd">'+
							'<img src="{#image#}" alt="" class="banner">'+
							'<p class="title">{#title#}</p>'+
							'<div class="attr-wrap">'+
								'<div class="attr">	'+
									'<p class="num">编号:{#num#}</p>'+
									'<p class="hot">热度:{#heat#}</p>'+
								'</div>'+
								'<div class="btn-wrap">	'+
									'<button class="collect type{#is_keep#}"><i class="icon-star-{#is_keep#}"></i></button>'+
									'<a href="http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=write&join_id={#join_id#}" class="btn"></a>'+	
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="bd">'+
							'<div class="ui-tab">'+
							    '<ul class="ui-tab-nav ui-border-b">'+
							        '<li class="current">信息</li>'+
							        '<li>介绍</li>'+
							    '</ul>'+
							    '<ul class="ui-tab-content" style="width:200%">'+
							        '<li class="current">'+
							        	'<ul class="info-list">'+
					        				'<!-- data-repeat -->'+
							        		'<li class="item clearfix" data-repeat="x in list"><span class="left">x.key</span><span class="right x.class">x.value</span></li>'+
							        		'<!-- end data-repeat -->'+ '\n' +
							        	'</ul>'+
							        '</li>'+
							        '<li>'+
							        	'<div class="text-wrap"></div>'+
							        '</li>'+
							    '</ul>'+
							'</div>'+

				        	'<a class="act-show" href="act-show.html?id={#id#}">活动秀 <span class="show-img" style="background-image: url({#act_show_first_image#})"></span><i class="icon-live">直播中</i></a>'+

				        	'<div class="cmt nodata">'+
    							'<p class="cmt-title">评论 <span class="cmt-title-num">(<span></span>)</span></p>'+
    							'<ul class="cmt-list"></ul>'+

    							'<form action="" class="cmt-form ui-border-t">'+
    								'<input type="text" class="cmt-input" placeholder="写评论">'+
    								'<button class="cmt-send">发送</button>'+
    							'</form>'+
    						'</div>'+

						'</div>'+
					'</div>'
		}
	// 活动详情
	if (href.search('detail.html')>0) {
		var id = utils.parseHash().id

		// 热度+1
		$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_plus_one_view', {aid: id, uid: uid})

		$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_detail&id='+id, {uid:uid},function(data){
			var data = JSON.parse(data), 
				temp, 
				obj = {},
				type = data.result.status_num

			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			// 整理数据
			obj.title = data.result.title
			obj.heat = data.result.heat
			obj.num = data.result.num
			obj.id = data.result.id
			obj.join_id = data.result.join_id
			obj.image = data.result.image
			obj.is_keep = data.result.is_keep
			obj.act_show_first_image = data.result.act_show_first_image
			obj.live_status = data.result.live_status
			obj.list = []
			obj.list.push({key: '活动时间', value: data.result.setime})
			obj.list.push({key: '报名截止时间', value: data.result.jtime})
			obj.list.push({key: '费用(元)', value: data.result.fee, class: 'highlight'})
			obj.list.push({key: '地址', value: data.result.address})
			obj.list.push({key: '举办范围', value: data.result.department_title})
			obj.list.push({key: '举办机构', value: data.result.organization})
			obj.list.push({key: '联系人', value: data.result.linkman})
			obj.list.push({key: '联系电话', value: data.result.phone})
			obj.list.push({key: '报名人数', value: data.result.join_num})

			// 渲染模板并添加到页面
			temp = template.detail.format(obj)
			document.querySelector('#wrapper').innerHTML = temp
			document.querySelector('.text-wrap').innerHTML = data.result.brief
			if (!data.result.act_show_first_image) {
				$('.show-img').hide()
			}

			// 初始化选项卡
			;(function(){
				var btn = $('.ui-tab-nav>li'),
					wrap = $('.ui-tab-content'),
					ctn = $('.ui-tab-content>li')

				btn.on('tap', function(){
					var index = $(this).index(),
						width = $('.ui-tab-content .current').width()
						offset = -index * width

					wrap.css({
						webkitTransform: 'translateX('+offset+'px)',
						transform: 'translateX('+offset+'px)'
					})
					btn.removeClass('current').eq(index).addClass('current')
					ctn.removeClass('current').eq(index).addClass('current')
				})
			})()

			// 页面逻辑处理
			var btn = $('.btn-wrap .btn')
			if (data.result.fee > 0) {
				if (data.result.join_status == 2) {
					btn.text('已报名')
					btn.addClass('joined')
				} else {
					switch (type) {
						case 1:
							btn.text('我要报名')
							btn.addClass('start')
							break;
						case 3:
							btn.text('报名截止')
							btn.addClass('end')
							break;
						default:
							btn.text(data.result.status)
							btn.addClass('end')
							break;
					}
				}
			} else {
				if (data.result.join_status == 1) {
					btn.text('已报名')
					btn.addClass('joined')
				} else {
					switch (type) {
						case 1:
							btn.text('我要报名')
							btn.addClass('start')
							break;
						case 3:
							btn.text('报名截止')
							btn.addClass('end')
							break;
						default:
							btn.text(data.result.status)
							btn.addClass('end')
							break;
					}
				}
			}

			// 报名逻辑
			btn.on('click', function(e){
				e.preventDefault()

				var community = data.result.department_title
					href = $(this).attr('href') + '&uid=' + uid

				$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=department&action=my_department', {uid:uid},function(data){
					if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

					if (community != data.result[0].title) {
						$.dialog({
							content: '活动社区与您所在社区不是同一社区, 确定报名吗',
							button: ['确定', '取消']
						})
						$('#dialogButton0').on('tap', function(){
							location.href = href
						})
					} else {
						location.href = href
					}

				}, 'json')
			})

			// 收藏
			$('.collect').on('tap', function(){
				var that = $(this), 
					star = that.children('i')

				if (star.hasClass('icon-star-0')) {
					$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_keep', {uid: uid, aid: data.result.id}, function(res){
						star.removeClass('icon-star-0').addClass('icon-star-1')
						that.addClass('type1')
						$.tips({content: '收藏成功'})
					})
				} else {
					$.dialog({
						content: '是否取消收藏',
						button: ['确认', '取消']
					});

					$('#dialogButton0').on('tap', function(){
						$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_keep', {uid: uid, aid: data.result.id}, function(res){
							star.removeClass('icon-star-1').addClass('icon-star-0')
							that.removeClass('type1')
							$.tips({content: '已取消收藏'})
						})
					})
				}
			})

			// 评论逻辑
			;(function(){
				var wrap = $('.act-detail'),
					cmt = $('.cmt'),
					form = $('.cmt-form'),
					input = $('.cmt-input'),
					list = $('.cmt-list'),
					num = $('.cmt-title-num'),
					body = $('body'),
					ot = cmt.offset().top,
					wh = $(window).height(),
					aid = data.result.id,
					datas = data.result.cmt_list,
					cmt_num = datas && datas.length || 0,
					str = ''

				// 渲染评论列表
				if (datas) {
					for (var i = 0; i < datas.length; i++) {
						str += renderCmt(datas[i])
					}
					list.append(str)
					num.text('('+cmt_num+')')
					cmt.removeClass('nodata')
				}

				// 滚动显示评论框
				$(window).on('scroll', function(e){
					var h = body.scrollTop()
					if (h+wh>ot+80) {
						wrap.removeClass('open-key')
					} else {
						wrap.addClass('open-key')
					}
				})

				// 事件绑定
				cmt.on('tap', function(e){
					var target = e.target,
						btn = $(target).parent('button'),
						num = $(target).siblings('.thumb-num'),
						number = Number(num.text()),
						cmt_id = $(target).parents('li').attr('data-id')

					// 点赞
					if (target.nodeName == 'I') {
						if (btn.hasClass('status1')) {
							btn.removeClass('status1')
							num.text(number-1)
						} else {
							btn.addClass('status1')
							num.text(number+1)
						}
						$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_comment_like_or_not', {uid: uid, cid: cmt_id})
					}
				})

				// 优化软键盘弹出显示效果
				input.on('focus', function(){
					body.scrollTop(9999)
					wrap.addClass('open-key')
				}).on('blur', function(){
					wrap.removeClass('open-key')
				})

				// 评论提交
				form.on('submit', function(e){
					e.preventDefault()

					var text = input.val()

					if (text.length == 0) { $.tips({content: '请输入内容后再提交'}); return }
					$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_comment', {uid: uid, aid: aid, content: text}, function(res){
						cmt_num++
						input.val('')
						
						list.prepend(renderCmt(res.just_commit_cmt_list[0]))
						cmt.removeClass('nodata')
						num.text('('+cmt_num+')')

						body.scrollTop(ot)
						$.tips({content: '评论成功'})
					}, 'json')
				})
			})()

			// 解除遮罩
			utils.loading()
		})
	} else { // 首页
		// 定位我的社区
		$.get('http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=department&action=my_department', {uid:uid},function(data){
			var data = JSON.parse(data)
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			data.result ? $('.position').text(data.result[0].title) : location.href = 'select/index.html?uid=' + uid
		})

		// 切换范围
		var range = $('.range a')
		range.on('tap', function(e){
			e.preventDefault()

			var target = $(e.target),
				url = target.hasClass('position') ? 
					'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act' : 
					'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_all'

			$.get(url, {uid:uid},function(data){
				if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

				var temp = data.result.actList ? template.index.format({list: data.result.actList}) : '<p class="none">暂无数据</p>'

				// 渲染dom
				range.removeClass('current')
				target.addClass('current')
				$('.active-list').empty().append(temp)
				temp = null
			}, 'json')
		})

		range.eq(0).trigger('tap')
		utils.loading()
	}
})()



// {
// 	Code: 0,
// 	result: {
// 		balabala: 'balabala',
// 		// ... ... 

// 		cmt_list: [
// 			{
// 				// 显示字段
// 				avatar : 'url', // 用户头像
// 				name : 'heheda', // 用户昵称
// 				time : '2016-01-20 15:00', // 评论时间
// 				ctn : '活动不错', // 评论内容
// 				thumb : 27 , // 点赞数

// 				// 逻辑字段
// 				is_thumb : 1 , // 是否点赞 , 当前用户对这条评论是否点过赞,  1点了 , 0没点
// 				cmt_id : 1 , // 评论id
// 			}
// 		]
// 	}
// }


function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

function renderCmt(data){
	return '<li class="cmt-list-item ui-border-b" data-id='+data.cmt_id+'>'+
				'<img src="'+data.avatar+'" alt="" class="ctn-avatar">'+
				'<div class="ctn-wrap">'+
					'<div class="ctn-head">'+
						'<p class="ctn-name">'+data.name+'</p>'+
						'<p class="ctn-time">'+data.time+'</p>'+
						'<button class="thumb status'+data.is_thumb+'" data-thumb="'+data.thumb+'">'+
							'<span class="thumb-num">'+data.thumb+'</span>'+
							'<i class="icon-heart"></i>'+
						'</button>'+
					'</div>'+
					'<div class="ctn-ctn">'+data.cnt+'</div>'+
				'</div>'+
			'</li>'+
			'<!-- end data-repeat -->'
}