//页面加载完成
$(document).ready(function(){
	console.log('客服页面加载完成');

  	//获取客户端IO连接实例
  	var socket = io.connect();
	console.log('客服端连接IO完成');

	/**
	 * 注册服务端登陆点击事件
	 */
	$('#serviceLogin').click(function () {
		console.log('发送客服登录信息');
		socket.emit('serviceLogin', {serviceId : '001', nickName : '测试客服001', channel : '测试App-客服端'});
		socket.serviceId = '001';
		console.log('发送客服登录信息');
	});

	/**
	 * 接收登陆结果
	 */
	socket.on('serviceLoginResult',function(data){
		console.log('客服登陆成功 serviceId = ' + data.serviceId + " , nickName = " + data.nickName);
		$('#serviceLoginReturn').val('客服:' + data.nickName + ', 登陆成功, 创建会话 : ' + data.serviceId + ', 等待用户接入...');
	});

	/**
	 * 获得新分配用户的信息
	 */
	socket.on('assignUser',function(data){
		console.log('被分配了用户, id = ' + data.userId + " , 昵称 = " + data.nikeName + " , 渠道 = " + data.channel);
		$('#assignUser').val('被分配了用户, id = ' + data.userId + " , 昵称 = " + data.nikeName + " , 渠道 = " + data.channel + ", 发送默认询问,等待回复...");
		//保存当前这个页面的用户信息
		socket.userId = data.userId;
		socket.userNikeName = data.nikeName;
		socket.userChannel = data.channel;
		//发送默认询问
		console.log('socket.serviceId = ' + socket.serviceId);
		var defRespond = {from : socket.serviceId, to : data.userId, message : "默认回复-有什么需要帮助?"};
		socket.emit('defRespondToAgent',defRespond);
	});

	/**
	 * 客服发送消息给用户
	 */
	$('#sendMsgBtn').click(function () {
		console.log('发送消息给用户');
		//构建测试数据
		var sendMsg = {};
		sendMsg.from = socket.serviceId;
		sendMsg.to= socket.userId;
		sendMsg.message = $('#sendMsg').val();
		console.log('向客服发送消息 sendMsg.from = ' + sendMsg.from + " , sendMsg.to = " + sendMsg.to + " , sendMsg.message = " + sendMsg.message);
		//用户发送
		socket.emit('serviceToUserMsg', sendMsg);
	});

	/**
	 * 用户退出
	 */
	socket.on('agentLogout',function(data){
		console.log('用户退出了, id = ' + data.userId + " , 昵称 = " + data.nikeName + " , 渠道 = " + data.channel);
		$('#agentLogout').val(JSON.stringify(data));
		////保存当前这个页面的用户信息
		//socket.userId = data.userId;
		//socket.userNikeName = data.nikeName;
		//socket.userChannel = data.channel;
		////发送默认询问
		//console.log('socket.serviceId = ' + socket.serviceId);
		//var defRespond = {from : socket.serviceId, to : data.userId, message : "默认回复-有什么需要帮助?"};
		//socket.emit('defRespondToAgent',defRespond);
	});

	///**
	// * 客服给用户消息
	// * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	// * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	// * parameter: 消息内容(发送方 接收方 消息内容)
	// */
	//socket.on('serviceToUserMsg',function(data){
	//	console.log('收到用户消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
	//	//更新UI
	//	$('#reciverMsg').val(JSON.stringify(data));
	//	////TODO 显示页面更新UI
	//	////构建测试数据
	//	//data.from = '1001';
	//	//data.to= '001';
	//	//data.message = '用户:我需要咨询问题';
	//	//console.log('向客服发送消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
	//	////用户发送
	//	//socket.emit('userToServiceMsg', data);
	//});

	/**
	 * 客服给用户消息
	 * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	 * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	 * parameter: 消息内容(发送方 接收方 消息内容)
	 */
	socket.on('userToServiceMsg',function(data){
		console.log('收到用户消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
		//更新UI
		$('#reciverMsg').val(JSON.stringify(data));
		////TODO 显示页面更新UI
		////构建测试数据
		//data.from = '1001';
		//data.to= '001';
		//data.message = '用户:我需要咨询问题';
		//console.log('向客服发送消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
		////用户发送
		//socket.emit('userToServiceMsg', data);
	});

	//接收用户退出事件

	//来自服务器的消息 -- 关闭浏览器，主动断开，掉线等任何断开连接的情况
	socket.on('disconnect',function(){
		console.log("服务器断开连接");
	});

});
