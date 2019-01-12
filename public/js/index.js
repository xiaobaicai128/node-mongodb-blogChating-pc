/*
* @Author: qiaoyong
* @Date:   2018-12-22 15:40:48
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-05 20:14:57
*/
$(() => {
	$('.name').on('keyup', () => {
		$('.remove').css('display', 'inline-block');
		$('.claim1').css('display', 'none');
		$('.alert').hide();
		if($('.name').val().length = 0) {
			$('.remove').css('display', 'inline-block');
		}
	})
	$('.remove').on('click', () => {
		$('.name').val('');
		$('.password').val('');
		$('.remove').hide(50);
		$('.claim2').hide(50);
	})
	$('.password').on('keyup', () => {
		$('.claim2').hide(50);
		// if($('.name').val().length = 0) {
		// 	$('.claim2').css('display', 'inline-block');
		// }
	})
	
	$('.my-button').click(() => {
		if($('.password').val().length == 0){
			$('.claim2').css('display', 'inline-block');
		} 
		if($('.name').val().length == 0) {
			$('.claim1').show();
		}
		if($('.password').val().length > 0 && $('.name').val().length > 0){
			$.post('/dologin', {
				'username': $('.name').val(),
				'password': $('.password').val()
			}, (result) => {
				if(result == 2) { // 数据库中查找成功，跳转到主页
					window.location.href = '/main';
				}
				if(result == -1) { // 没有此人，跳转到注册页面
					$('.alert1').show();
				}
				if(result == -2) { // 密码错误
					$('.alert2').show();
				}
			})
			
		}

	})
	
})