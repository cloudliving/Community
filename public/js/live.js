var template = 		'<p class="title">{#actTitle#}</p>'+
					'<video id="my-video" class="video-js" controls preload="auto" poster="../../public/images/poster.png">'+
					    '<source src="{#pull_url#}" type="application/x-mpegURL">'+
					'</video>'+
					'<p class="hint">注意<br>此直播仅提供报名参与用户观看,其他人员无法看到</p>',

	aid = utils.parseHash().id,
	url = 'http://vht.cloudliving.net/community_service.php?m=Community&c=Index&a=act&action=act_live&aid='+aid+'&uid='+uid,
	wrap = $('#wrapper')

$.get(url, function(res) {
	if (res.Code != 0) {$.tips({content: res.errorMessage}); return}


	wrap.append(template.format(res.result))

	neplayer("my-video", {}, function(){
	  utils.loading()
	});
}, 'json')