/*
* @Author: qiaoyong
* @Date:   2019-01-16 20:12:43
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-22 22:17:23
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
	//使用ejs模板
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
				console.log(result[i].date)
				// 时间格式转换2019-01-22T12:49:55.578Z
				

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
})