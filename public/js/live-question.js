$(function(){
	var href = location.href,
		hash = utils.parseHash(),
		template = {
			list: 	'<!-- data-repeat -->'+
					'<li class="item" data-repeat="x in list">'+
						'<a href="question-detail.html?id=x.id">'+
							'<div class="top">'+
								'<img class="thumb" src="x.image" alt="">'+
								'<div class="wrap">'+
									'<p class="title">x.title</p>'+
									'<p class="time">x.ctime</span>'+
								'</div>'+
							'</div>'+
							'<p class="bottom"><span class="type">x.type_name</span><span class="status">x.status</span></p>'+
						'</a>'+
					'</li>'+
					'<!-- end data-repeat -->',

			detail: 	'<div class="complate-detail">'+
							'<div class="hd">'+
								'<div class="ui-slider">'+
								    '<ul class="ui-slider-content">'+
								    	'<!-- data-repeat -->'+
								        '<li class="current" data-repeat="x in images"><span style="background-image:url(x.src)"></span></li>'+
								        '<!-- end data-repeat -->'+
								    '</ul>'+
								'</div>'+
								'<p class="title">{#title#}<span class="num">编号:{#id#}</span></p>'+
								'<p class="info"><span class="type">{#type_name#}</span><span class="status">{#status#}</span></p>'+
							'</div>'+
							
							'<div class="bd">'+
								'<div class="user">'+
									'<img src="{#avatar#}" alt="" class="avatar">'+
									'<div class="wrap">'+
										'<p class="name">{#nickname#}</p>'+
										'<p class="time">{#ctime#}</p>'+
									'</div>'+
								'</div>'+

								'<div class="ctn">'+
									'<p>{#brief#}</p>'+
								'</div>'+
							'</div>'+
						'</div>'
		}

	if (href.search('index.html') >= 0) {
		// 定位社区
		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=department&action=my_department', {uid:uid},function(data){
			var data = JSON.parse(data)
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}
			$('.cummu').text(data.result[0].title)
		})

		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=question&action=question', {uid: uid}, function(res){
			var data = JSON.parse(res), str
			if (data.Code != 0) { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			str = !data.result.questionList ? '<p class="none">暂无数据</p>' : template.list.format({list: data.result.questionList})
			$('.question-list').append(str)

			// 绑定搜索逻辑
			;(function(){
				var form = $('form'),
					input = $('#search'),
					search = $('.search-btn'),
					back = $('.back'),
					wrap = $('.question-list'),
					cache = wrap.html(),
					str

				form.on('submit', function(e){
					e.preventDefault()

					$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=question&action=question', {title: input.val(), uid: uid}, function(data){
						if (data.Code != 0) {$.tips({content: data.errorMessage}); return}
						if (!data.result.questionList) {$.tips({content: '暂无搜索结果'}); return}						

						back.fadeIn()
						$.tips({content: '检索出'+data.result.questionList.length+'条结果'})
						str = template.list.format({list: data.result.questionList})
						wrap.html(str)
						
					}, 'json')
				})

				back.on('tap', function(){
					$(this).hide()
					wrap.html(cache)
					input.val('')
				})
			})()

			utils.loading()
		})
	}

	if (href.search('detail.html') >= 0) {
		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=question&action=question_detail&id='+hash.id, {uid: uid}, function(data){
			if (data.Code != 0) { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			data.result.images = JSON.parse(data.result.images)
			$('#wrapper').append(template.detail.format(data.result))

			var slider = new fz.Scroll('.ui-slider', {
			    role: 'slider',
			    indicator: true,
			    autoplay: true,
			    interval: 3000
			});
			
			utils.loading()
		}, 'json')
	}

})
