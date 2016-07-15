$(function(){
	var href = location.href,
		hash = utils.parseHash()
		str = '',
		template = {
			list: 	'<!-- data-repeat -->'+
					'<a class="mpmt-item" href="detail.html#id=x.id" data-repeat="x in list">'+
		            	'<div class="main">'+
		            	    '<h4 class="name">x.title</h4>'+
		            	    '<p><i class="icon-position"></i>x.address</p>'+
		            	    '<p><i class="icon-clock"></i><span class="data">2015.12.29</span><span class="hour">x.setime</span></p>'+
		            	'</div>'+
		                '<div class="count">'+
		                    '<div class="wrap">'+
		                        '<em>x.num</em>人'+
		                        '<br>'+
		                        '<em>x.text</em>'+
		                    '</div>'+
		                '</div>'+
		            '</a>'+
		            '<!-- end data-repeat -->',

            detail: 	'<div class="mpmt-detail">'+
				            '<div class="hd">'+
				                '<p class="title">{#title#}</p>'+
				                '<p class="clearfix"><span class="time">{#setime#}</span><span class="num">编号:{#id#}</span></p>'+
				            '</div>'+

				            '<p class="info">活动信息</p>'+
				            '<ul class="info-list">'+
				                '<li class="item clearfix"><span class="left">活动区域</span><span class="right">{#address#}</span></li>'+
				                '<li class="item clearfix"><span class="left">已报名</span><span class="right highlight">{#num#}人</span></li>'+
				                '<li class="item clearfix"><span class="left">活动状态</span><span class="right">{#typetext#}</span></li>'+
				                '<li class="item clearfix"><span class="left">现场联系人</span><span class="right">{#linkman#}</span></li>'+
				                '<li class="item clearfix"><span class="left">联系电话</span><span class="right">{#phone#}</span></li>'+
				            '</ul>'+
				        '</div>'+
				        '<div class="btn-wrap"><a href="../../pay/write.html#id={#id#}&type=mpmt" class="btn {#btnclass#}">{#btntext#}</a></div>'

		}

	if (href.search('index.html') > 0) {
		// 定位社区
		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=department&action=my_department', {uid:uid},function(data){
			var data = JSON.parse(data)
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}
			$('.cummu').text(data.result[0].title)
		})

		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=MassPT&action=mass_p_t', {uid:uid},function(res){
			var data = JSON.parse(res),
				text
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			if (data.result.massPTList.length > 0) {
				data.result.massPTList.forEach(function(e, index){
					switch (e.status) {
						case '1':
							text = '报名中'
							break; 
						case '2':
							text = '进行中'
							break;
						case '3':
							text = '已截止'
							break;		
					}
					data.result.massPTList[index].text = text
				})

				str = template.list.format({list: data.result.massPTList})

			} else {
				str = '<p>暂无数据</p>'   
			}

			$('.mpmts').append(str)
			utils.loading()
		})
	}

	if (href.search('detail.html') > 0) {
		$.get('http://vht.cloudliving.net/index.php?m=Community&c=Index&a=MassPT&action=mass_p_t_detail&id='+hash.id, {uid:uid}, function(res){
			var data = JSON.parse(res), text, str, btntext, btnclass
			if (data.Code != '0') { $.tips({content:data.errorMessage + '请刷新重试'}); return}

			switch (data.result.status) {
				case '1':
					text = '报名中'
					break; 
				case '2':
					text = '进行中'
					break;
				case '3':
					text = '已截止'
					break;		
			}
			if (data.result.status == 3) {
				btntext = '已截止'
				btnclass = 'end'
			} else {
				if (data.result.join_status == 0) {
					btntext = '我要报名'
					btnclass = 'start'
				} else {
					btntext = '已报名'
					btnclass = 'joined'
				}
			}

			data.result.typetext = text
			data.result.btntext = btntext
			data.result.btnclass = btnclass
			str = template.detail.format(data.result)
			$('#wrapper').append(str)
			utils.loading()
		})
	}
})