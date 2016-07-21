(function(){
	var href = location.href,
		template = {
			index: 	'<!-- data-repeat -->'+
					'<li class="item x.class" data-repeat="x in list" data-id="x.id">'+
						'<a class="wrap" href="detail.html?id=x.id">'+
							'<img src="x.image" class="thumb">'+
							'<p class="title">x.title</p>'+
							'<p class="hot">热度: x.heat</p>'+
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

					'<div class="btn-wrap"><a href="http://weixin.cloudliving.net/index.php?m=CAPI&c=Index&a=write&join_id={#join_id#}" class="btn"></a></div>'
		}

	// 活动首页
	if (href.search('index.html')>0) {
		// 定位我的社区
		$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=department&action=my_department',{uid:uid},function(data){
			var data = JSON.parse(data)
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}
			$('.position').text(data.result[0].title)
		})

		// 切换范围
		var range = $('.range a')
		range.on('tap', function(e){
			e.preventDefault()

			var target = $(e.target),
				url = target.hasClass('position') ? 
					'http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act&type_id=1' : 
					'http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act_all&type_id=1'

			$.get(url, {uid:uid},function(data){
				range.removeClass('current')
				target.addClass('current')

				var data = JSON.parse(data), 
					str, 
					ary = []
				if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

				// 处理数据
				if (!data.result.actList) {
					temp = '<p class="none">暂无活动</p>'
				} else {
					data.result.actList.forEach(function(e){
						switch (e.status_priority) {
							case '1':
								e.class = 'ing'
								break
							case '2':
								e.class = 'stop'
								break
							case '3':
								e.class = 'end'
								break
						}
						ary.push(e)
					})
					temp = template.index.format({list: ary})
				}

				// 渲染dom
				$('.active-list').empty()
				$('.active-list').append(temp)
				temp = null
			})
		})

		range.eq(0).trigger('tap')
		utils.loading()
	}

	// 活动详情
	if (href.search('detail.html')>0) {
		var id = utils.parseHash().id

		$.get('http://weixin.cloudliving.net/community_service.php?c=Index&a=act&action=act_detail&id='+id,{uid:uid},function(data){
			var data = JSON.parse(data), 
				temp, 
				obj = {},
				type	

			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			type = data.result.status_num
			// 整理数据
			obj.title = data.result.title
			obj.heat = data.result.heat
			obj.num = data.result.num
			// obj.intro = data.result.brief
			obj.id = data.result.id
			obj.join_id = data.result.join_id
			obj.image = data.result.image
			obj.list = []
			obj.list.push({key: '项目时间', value: data.result.setime})
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
				var result = new fz.Scroll('.ui-tab', {
				        role: 'tab',
				        autoplay: false,
				        interval: 3000
				    });

				var that = arguments.callee
				if (!result.itemWidth) {
					setTimeout(function(){
						that()
					}, 200)
				}
			})()


			// 页面逻辑处理
			var btn = $('.btn-wrap .btn')
			if (type == 1) {
				if (data.result.join_status == 2) {
					btn.text('已报名')
					btn.addClass('joined')
				} else {
					btn.text('我要报名')
					btn.addClass('start')
				}
			} else {
				btn.addClass('end')
				btn.text(data.result.status)
			}

			// 解除遮罩
			utils.loading()
		})
	}

})()