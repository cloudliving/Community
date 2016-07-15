(function(){
	var href = location.href,
		hash = utils.parseHash(),
		wrap = $('#wrapper')
		template = {
			head: 	'<div class="order-info">'+
						'<p class="name">{#title#}</p>'+
						'<ul class="info-list">'+
							'<li class="item"><span class="left">项目时间</span><span class="right">{#setime#}</span></li>'+
							'<li class="item"><span class="left">费用(元)</span><span class="right price">{#fee#}</span></li>'+
							'<li class="item"><span class="left">报名人数</span><span class="right">{#join_num#}</span></li>'+
						'</ul>'+
					'</div>',

			form: [
				'<div class="myinfo ">'+
					'<p>{#description#}</p>'+
					'<form action="">'+
						'<label for="name"><span class="key"><i></i>姓名</span><input id="name" type="text" value="{#name#}"></label>'+
						'<label for="phone"><span class="key"><i></i>手机号码</span><input id="phone" type="number" value="{#phone#}"></label>'+
					'</form>'+
				'</div>',

				'<div class="myinfo">'+
					'<p>预留信息如下</p>'+
					'<form action="">'+
						'<label for="name"><span class="key"><i></i>姓名</span><input id="name" type="text" value="{#name#}" readonly></label>'+
						'<label for="phone"><span class="key"><i></i>手机号码</span><input id="phone" type="number" value="{#phone#}" readonly></label>'+
					'</form>'+
					'<p class="msg">如稍后信息可能修改, 请与"我">"项目活动"中操作</p>'+
				'</div>'
			],

			result: '<div class="result">'+
						'<span class="icon">√</span>'+
						'<p>恭喜你已成功报名该项目活动,</p>'+
						'<p>请注意举办地点和开始时间,到时候见~</p>'+
						'<p>点击图标首页</p>'+
					'</div>',

			btn: 	'<div class="btn-wrap">'+
						'<p>{#description#}</p>'+
						'<a class="btn">{#btn#}</a>'+
					'</div>'
		},
		introUrl = {
			active: 'http://vht.cloudliving.net/index.php?m=Community&c=Index&a=act&action=act_detail&id=',
			youth: 'http://vht.cloudliving.net/index.php?m=Community&c=Index&a=MassPT&action=mass_p_t_detail&id=',
			mpmt: 'http://vht.cloudliving.net/index.php?m=Community&c=Index&a=MassPT&action=mass_p_t_detail&id='
		}


	// 填写报名信息页面
	if (href.search('write.html') > 0) {
		$.get(introUrl[hash.type]+hash.id, {uid:uid},function(data){
			var data = JSON.parse(data),
				str = ""
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			str += template.head.format(data.result)
			str += template.form[0].format({description: '为方便线下及时联系确认, 需提供以下信息', name: '', phone: ''})
			str += template.btn.format({description: '你的信息会严格保密, <br> 仅用于项目确认及线下开展时联系', btn: '提交报名信息'})
			wrap.append(str)

			// 添加逻辑
			$('.btn').on('tap', function(e){
				e.preventDefault()
				var name = $('#name').val(),
					phone = $('#phone').val()

				if (/[^\u4e00-\u9fa5]/.test(name) || name.length == 0) {
					$.tips({content: '请填写中文姓名, 且长度不能为0'})
					return
				}
				if (!(/^1\d{10}$/.test(phone)) ) {
					$.tips({content: '请填写11位有效手机号'})
					return
				}

				// 判断活动费用、再跳链
				if (data.result.fee == 0) {
					$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=act&action=join_act&id='+hash.id+'&linkman='+name+'&phone='+phone, {uid:uid},function(data){
						var data = JSON.parse(data)
						if (data.Code != '0') { $.tips({content:data.errorMessage + '请重试'}); return}

						location.href = './result.html#id='+hash.id+'&name='+name+'&phone='+phone+'&type='+hash.type
					})
				} else {
					location.href = './pay.html#id='+hash.id+'&name='+name+'&phone='+phone+'&type='+hash.type
				}
			})

			utils.loading()
		})
	}

	// 确认页面
	if (href.search('pay.html') > 0) {
		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=act&action=act_detail&id='+hash.id, {uid:uid},function(data){
			console.log(data)
			var data = JSON.parse(data),
				str = ""
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			str += template.head.format(data.result)
			str += template.form[0].format({description: '预留信息如下', name: hash.name, phone: hash.phone})
			str += template.btn.format({description: '如稍后信息可能修改, 请与"我">"项目活动"中操作', btn: '支付'})
			wrap.append(str)

			$('input').attr('readonly', '')

			utils.loading()
		})
	}

	// 结果页
	if (href.search('result.html') > 0) {
		console.log(123)
		$.get(introUrl[hash.type]+hash.id, {uid:uid},function(data){
			var data = JSON.parse(data),
				str = ""
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			str += template.head.format(data.result)
			str += template.form[1].format({name: hash.name, phone: hash.phone})
			str += template.result

			wrap.append(str)

			$('.icon').on('tap', function(){
				location.href = '../index.html#uid='+uid
			})

			utils.loading()
		})
	}
})()