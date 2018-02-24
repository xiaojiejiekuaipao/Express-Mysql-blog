// project util.js
$(function(){
   //
    var limit = 4;
    var current_page = 1;
    var pages = 0;
    var count = 0;
    // 全局数组存储评论
    var comments = [];
    
    // 登录注册切换
    $('.j_userTab span').on('click',function(){
        var _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if( _index==0 ){
            $('.user_login').css('display','inline-block');
            $('.user_register').hide();
        }else{
            $('.user_login').hide();
            $('.user_register').css('display','inline-block');
        }
    });

    // 登录校验
    var reg = /^[^<>"'$\|?~*&@(){}]*$/;
    var $login = $('#login');
    var $register = $('#register');
    var $userForm = $('.user_form');
    var $userLogined = $('.user_logined');
    $('.user_login_btn').on('click',function(){
        if( $login.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(0).find('input').val().trim()) ){
            $login.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $login.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(1).find('input').val().trim()) ){
            $login.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: {
                username: $login.find('.user_input').eq(0).find('input').val().trim(),
                password: $login.find('.user_input').eq(1).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data.code != 0){
                    $login.find('.user_err span').text( data.msg ).show();
                    return false;
                }else{
                    $login.find('.user_err span').text( data.msg ).show();
                    window.location.reload()
                }
            }
        })
    });

    $('.user_register_btn').on('click',function(){
        if( $register.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(0).find('input').val().trim()) ){
            $register.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(1).find('input').val().trim()) ){
            $register.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() != 
            $register.find('.user_input').eq(2).find('input').val().trim()
        ){
            $register.find('.user_err span').text('两次输入的密码不一致').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/register',
            data: {
                username: $register.find('.user_input').eq(0).find('input').val().trim(),
                password: $register.find('.user_input').eq(1).find('input').val().trim(),
                repassword: $register.find('.user_input').eq(2).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                $register.find('.user_err span').text( data.msg ).show();
            }
        })
    });

    // 退出
    $('.user_loginOut').on('click', function(){
        $.ajax({
            type: 'get',
            url: '/api/loginOut',
            success: function(data){
              console.log(data)
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    });

    // 提交评论
    $('.discuss_submit').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/comment',
            data: {
                article_id: $('.discuss_id').val(),
                commentContent: $('.discuss_input').val()
            },
            dataType: 'json',
            success: function(data){
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    });
    // 每次页面重载时获取文章的所有评论
    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            article_id: $('.discuss_id').val()
        },
        dataType: 'json',
        success: function(data){
            if(!data.code){
                console.log(data)
                comments = data.commentList.reverse()
                renderComments();
            }
        }
    })
    $('.pager li').on('click', function () {
    	if ($(this).hasClass('previous')) {
    		current_page --;
    	} else {
    	  current_page ++;
    	}
    	renderComments()
    })
    $('.discuss_default span').on('click', function () {
    	$('.user_input input[type="text"]').focus()
    })

    function renderComments(){
        
        // 总条数=总评论数/每页条数
        var pages = Math.ceil(comments.length / limit)
        var start = limit * (current_page-1);
        var end = start + limit;
        end = Math.min(end, comments.length) // 最大不能大于总评论数
        var $lis = $('.discuss_page li');
        $lis.eq(1).html('第'+current_page+ '页' + '/' + '共' + pages + '页')
        
        if (pages <1) {
          $('.discuss_page').hide()
        }
        
        if (current_page <= 1) {
          console.log(current_page)
        	current_page = 1;
        	$lis.eq(0).addClass('disabled').children('a').html('没有上一页')
        } else {
          $lis.eq(0).removeClass('disabled').children('a').html('<span aria-hidden="true">&larr;</span> 上一页')
          
        }
        if (current_page >= pages) {
        	current_page = pages;
        	$lis.eq(2).addClass('disabled').children('a').html('没有下一页')
        } else {
          $lis.eq(2).removeClass('disabled').children('a').html('<span aria-hidden="true">&rarr;</span> 下一页')
        }
        var commentsStr = "";
        for(var i=start;i<end;i++){
            commentsStr += `<li>
                    <p class="discuss_user"><span>${comments[i].username}</span>
                    <i>${comments[i].comment_time}</i></p>
                    <div class="discuss_userMain">
                        ${comments[i].content}
                    </div>
                </li>`
        };
        $('.discuss_list').html( commentsStr );
    };


    // 打字效果
    var str = 'hello world';
    var i = 0;
    function typing(){
        var divTyping = $('.banner h2');
        if (i <= str.length) {
            divTyping.text( str.slice(0, i++) + '_' );
            setTimeout(function(){typing()}, 200);
        }else{
            divTyping.text( str );
        }
    }
    typing();
});