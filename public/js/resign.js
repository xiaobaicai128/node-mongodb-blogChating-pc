/*
* @Author: qiaoyong
* @Date:   2018-12-23 15:25:28
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-12-24 22:17:13
*/
$(() => {
	let len = $('.container li').length;
	auto();

	function auto (){
		let n =1
		function t() {
			if(n >= len) {
				n = 0;
			}
			$(".container li").filter(":visible").fadeOut(100).parent().children().eq(n).fadeIn(100);
			n++;
		}
		var timer = setInterval(t, 3000);
		$(".container").hover(() => {
			clearInterval(timer);
		}, () => {
			timer = setInterval(t, 3000);

		})
	}

	$('#username').on('keyup', () => {
		$('.name-claim').hide(100);
	})
	$('#password').on('keyup', () => {
		let str = $('#password').val();
		$('.password-claim').show(100);
		$('.a').hide();
		$('.b').hide();
		// 排除有密码空格现象
		if(str.indexOf(' ') >= 0){
			console.log('有空格');
			$('.a ').hide();
			$('.b').show();
		} else if(str.length > 0) {
			$('.a ').show();

		} else if(str.length === 0){
			$('.a ').hide();
			$('.b').show();
		}
		// 密码个数的动画
		if(str.length>=8 && str.length<=16){
			$('.c ').show();
			$('.d').hide();
		} else {
			$('.c ').hide();
			$('.d').show();
		}
	})

	$('#submit').on('click', () => {
		$('.password-claim').hide(100);
		if($('.check').prop('checked')){
			$('.text').css('color', '#888')
			if($('#username').val().length === 0) {
				$('.name-claim').show()
			}
			if($('#password').val().length === 0) {
				$('.password-claim').show(100);
			} else {
				//提交数据
				$.post('/doregist', {
					'username': $('#username').val(),
					'password': $('#password').val()
				}, (result) => {
					console.log(result == 1)
					if(result == 1) {
						console.log(888)
						$('.result').text('注册成功，将于2秒后跳转到主页面').css('color', '#08ec08');
						setTimeout(() => {
							window.location.href = '/main';
						}, 2000)
					} else{
						console.log('用户名被占用')
						$('#usenameChange').text('用户名被占用').css('color', 'red');
					}
				})
			}
		} else {
			$('.text').css('color', 'red')
		}
		
		
	})
})