/*
* @Author: qiaoyong
* @Date:   2019-01-16 20:12:43
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-02-17 19:24:55
*/
$(() => {

	$('#button').click(() => {
		let comment = $('#comment').val();
		if(comment.length == 0){
			return;
		}
		// console.log($('#myname').val())
		// let comment = $('#comment').val();
		// let thtml = '';
		// 		thtml = `<img src="./avatar/01.jpg" alt="${$('#myname').val()}" class="mr-3 mt-3 rounded-circle" style="width:60px;">
		//         <div class="media-body">
		          
		//           <a href="#"><h6>${username}</h6></a>
		//           <p>${comment}</p>
		//           <small><i>${new Date()}</i></small>
		//           <div class="span"><a href=""><span> 赞 |</span></a><a href=""><span> 转发 |</span></a><a href=""><span> 评论</span></a></div> 
		//         </div>`
  //       		$('.tem').append($(thtml)).show();

		$('#comment').val('');
		$.post('/comment', {
			'comment': comment
		}, (err, result) => {
			// console.log(result)
			if(result == 'success') {
				window.location = '/main';
				$('.feedback').fadeIn(800);
				// let thtml = '';
				// thtml = `<img src="./avatar/01.jpg" alt="${$('#myname').val()}" class="mr-3 mt-3 rounded-circle" style="width:60px;">
		  //       <div class="media-body">
		          
		  //         <a href="#"><h6>${username}</h6></a>
		  //         <p>${comment}</p>
		  //         <small><i>${new Date()}</i></small>
		  //         <div class="span"><a href=""><span> 赞 |</span></a><a href=""><span> 转发 |</span></a><a href=""><span> 评论</span></a></div> 
		  //       </div>`
    //     		$('.tem').append($(thtml)).show();
				setInterval(() => {
					$('.feedback').fadeOut(800);
				}, 3000)
			} else if(result == '-6'){
				$('.feedback').text('发表失败').fadeIn(800);
			}
		})
	})

})
// 帖子刷新
	//使用underscore模板
$(() => {
	let compiled = _.template($('#template').html());

	getAllComment(0);
	function getAllComment(page){
		$.get('/getallcomment?page='+page, (result) => {
			//从此数据库获得 username， date, comment
			// 异步转为同步
			iterator(0);
			function iterator(i){
				if(i === result.length){
					return;
				}
				
				// 去forum数据库获得头像，say等数据
				$.get('/getuserinfo?username='+result[i].username, (result2) => {
					result[i].avatar = result2[0].avatar;
					result[i].say = result2[0].say;
					// console.log(result[i].avatar)
					//组装underscore模板
					var html = compiled({
						'username': result[i].username,
						'avatar': result[i].avatar,
						'say': result[i].say,
						'comment': result[i].comment,
						'date': result[i].date
					});
					// console.log(html)
					$('.placeholder').append($(html));
					iterator(i+1);
				})
			}
		})
	}
	//分页
	$.get('/getallcommentCount', (count) => {
		let allCount = parseInt(count);
		let pageMount = Math.ceil(allCount / 7); // 每页显示七条，求得页数一共 有多少页
		for(let i=0, len=pageMount; i<len; i++){
			$('.pagination').append(`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`);
			// $(`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`).after($('#nextd'))
		}
			
		$('.pagination').addClass('active');
	  	$('.pagination li').click(function(){
	  		$('.placeholder').html('');
	  		var page = $(this).index();
	  		// console.log(page)
	  		getAllComment(page);
	  		$(this).addClass('active').siblings().removeClass('active');
	  	})
	})
})
// 分页
// $(() => {
// 	$.get('/getallcommentCount', (count) => {
// 		let allCount = parseInt(count);
// 		let pageMount = Math.ceil(allCount / 7); // 每页显示七条，求得页数一共 有多少页
// 		for(let i=0, len=pageMount; i<len; i++){
// 			$('.pagemount').append(`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`)
// 			$('.pagemount li').click(() => {
// 				$(this).addClass('active').siblings().removeClass('active')
// 				$('.placeholder').html('');
// 				let page = $(this).index();
// 				getAllComment(page);
// 			})
// 		}
// 	})
// })