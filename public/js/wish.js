;(function(){
	var 
		url = {
			view: 'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=wish&action=online_wish_list',
			submit: 'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=wish&action=submit_wish'
		},
		datas, stars,
		wrap = $('#wrapper'),
		body = $('body'),
		template = {
			view: 	'<div class="hd a-bounceinT">'+
						'<img src="../../public/images/wish-title-1.png" class="title">'+
					'</div>'+

					'<div class="stars">'+
						'<!-- data-repeat -->'+
							'<span class="star status-x.selected a-bouncein" data-repeat="x in wishes"></span>'+
						'<!-- end data-repeat -->'+ '\n' +
					'</div>'+

					'<div class="ctn status-{#is_selected#} a-fadeinB">'+
						'<p>星星可以点亮多颗</p>'+

						'<button class="btn submit">许下心愿</button>'+
						'<a href="mywish.html" class="btn link ">我的心愿单</a>'+

						'<div class="others">'+
							'<img src="../../public/images/wish-title-2.png" class="title">'+
							'<div class="list j-marquee">'+
								'<ul>'+
									'<!-- data-repeat -->'+
										'<li class="item" data-repeat="x in others">x.name 许下 x.total 个心愿</li>'+
									'<!-- end data-repeat -->'+ '\n' +
								'</ul>'+
							'</div>'+
						'</div>'+
					'</div>',

			shadow: '<div class="shadow a-fadein">'+
						'<div class="box">'+
							'<p class="txt1">{#title#}</p>'+
							'<p class="txt2">{#descript#}</p>'+
							'<button class="btn">{#status_text#}</button>'+
						'</div>'+
					'</div>'
		}



	$.get(url.view, {uid: uid}, function(res) {
		if (res.Code != 0) {
			$.tips({content: res.errorMessage})
			return
		}

		datas = res.result.wishes
		wrap.append(template.view.format(res.result))

		var 
			ctn = $('.ctn'),
			submit = $('.submit')

		stars = $('.star')
		stars.each(function(index, el){
			$(el).addClass('star-'+(index+1))
		})

		stars.on('tap', function(){
			var index = $(this).index()
			alertShadow(index, datas[index])
		})

		submit.on('tap', function(){
			if (stars.filter('.status-1').length == 0) {
				$.tips({content: '请先点亮心愿星'})
				return
			}

			var ary = [],
				wid = res.result.wid

			stars.each(function(index, el){
				ary.push({is_selected: Number($(el).hasClass('status-1'))})
			})

			$.get(url.submit, {uid: uid, data: ary, wid: wid}, function(res){
				if (res.Code != 0) {
					$.tips({content: res.errorMessage})
					return
				}

				location.href = 'success.html'
			}, 'json')
		})

		utils.loading()
		marquee()
	}, 'json')




	function alertShadow(index, data){
		var 
			star = stars.eq(index), 
			selected = star.hasClass('status-1'),
			status_text = selected ? '熄灭它' : '点亮它'

		data.status_text = status_text
		body.append(template.shadow.format(data))

		$('.shadow').on('tap', function(e){
			var 
				that = $(this),
				target = $(e.target)



			if (target.hasClass('shadow')) {
				that.remove()
			}

			if (target.hasClass('btn')) {
				that.remove()

				if ($('.ctn').hasClass('status-1')) {
					$.tips({content: '您以提交过心愿单, 无法更改'})
				} else {
					selected ? star.removeClass('status-1') : star.addClass('status-1')
				}
			}
		})
	}

	function marquee(select){
		var 
			wrap = $('.j-marquee'),
			ctn = wrap.children('ul'),
			wh = wrap.height(),
			ch = ctn.height(),
			h = 0 // 已滚动的距离
			offset = .8 // 单次滚动距离

		console.log(wh)
		console.log(ch)

		setTimeout(function(){
			ctn.css({
				transform: 'translateY(-'+h+'px)'
			})

			if (h + wh > ch) {
				h = 0
			} else {
				h += offset
			}

			setTimeout(arguments.callee, 50)
		}, 50)
	}
})()





// event
// var stars = $('.star')

// stars.on('tap', function(){
// 	var index = $(this).index()

// 	alertwindow(index, datas[index])
// })