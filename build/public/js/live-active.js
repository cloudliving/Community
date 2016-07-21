(function(){
	var href = location.href,
		template = {
			index: 	'<!-- data-repeat -->'+
					'<li class="item status-x.status_num" data-repeat="x in list" data-id="x.id">'+
						'<a class="wrap" href="live/detail.html?id=x.id">'+
							'<img src="x.image" class="thumb">'+
							'<p class="title">x.title</p>'+
							'<p class="hot"><i class="icon-fire"></i> x.heat</p>'+
							'<p class="commu"><i class="icon-house-2"></i> x.department_name</p>'+
						'</a>'+
					'</li>'+
					'<!-- end data-repeat -->',

			detail: '<div class="act-detail">'+
						'<div class="hd">'+
							'<img src="{#image#}" alt="" class="thumb">'+
							'<p class="title">{#title#}</p>'+
							'<p class="clearfix"><span class="hot">热度:{#heat#}</span><span class="num">编号:{#num#}</span></p>'+
						'</div>'+
						'<div class="bd">'+
							'<div class="ui-tab">'+
							    '<ul class="ui-tab-nav ui-border-b">'+
							        '<li class="current">活动信息</li>'+
							        '<li>活动介绍</li>'+
							    '</ul>'+
							    '<ul class="ui-tab-content" style="width:200%">'+
							        '<li class="current">'+
							        	'<ul class="info-list">'+
					        				'<!-- data-repeat -->'+
							        		'<li class="item clearfix" data-repeat="x in list"><span class="left">x.key</span><span class="right x.class">x.value</span></li>'+
							        		'<!-- end data-repeat -->'+
							        	'</ul>'+
							        '</li>'+
							        '<li>'+
							        	'<div class="text-wrap"></div>'+
							        '</li>'+
							    '</ul>'+
							'</div>'+
						'</div>'+
					'</div>'+

					'<div class="btn-wrap"><button data-href="http://weixin.cloudliving.net/index.php?m=CAPI&c=Index&a=write&join_id={#join_id#}" class="btn"></button></div>'
		}
	// 活动详情
	if (href.search('detail.html')>0) {
		var id = utils.parseHash().id

		// 热度+1
		$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act_plus_one_view', {aid: id, uid: uid})

		$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act_detail&id='+id, {uid:uid},function(data){
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
					if (type == 1) {
						btn.text('我要报名')
						btn.addClass('start')
					} else if (type == 3) {
						btn.text('进行中')
						btn.addClass('joined')
					} else {
						btn.addClass('end')
						btn.text(data.result.status)
					}
				}
			} else {
				if (data.result.join_status == 1) {
					btn.text('已报名')
					btn.addClass('joined')
				} else {
					if (type == 1) {
						btn.text('我要报名')
						btn.addClass('start')
					} else if (type == 3) {
						btn.text('进行中')
						btn.addClass('joined')
					} else {
						btn.addClass('end')
						btn.text(data.result.status)
					}
				}
			}

			btn.on('tap', function(e){
				e.preventDefault()

				var community = data.result.department_title
					href = $(this).attr('data-href') + '&uid=' + uid

				$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=department&action=my_department', {uid:uid},function(data){
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

			// 解除遮罩
			utils.loading()
		})
	} else { // 首页
		// 定位我的社区
		$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=department&action=my_department', {uid:uid},function(data){
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
					'http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act' : 
					'http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act_all'

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