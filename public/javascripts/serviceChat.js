//页面加载完成
$(document).ready(function(){
	console.log('客服页面加载完成');

	/**
	 * 获取客户端IO连接实例
	 */
  	var socket = io.connect();
	console.log('客服端连接IO完成');

	/**
	 * 服务端登陆
	 */
	$('#serviceLogin').click(function () {
		console.log('--------------------------- 发送客服登录信息 ------------------------------');
		//TODO 从页面拿到用户登录信息
		var LoginInfo = {serviceId : '001', serviceNickName : '测试客服001', channel : '测试App-客服端'};
		socket.emit('serviceLogin', LoginInfo);
		//TODO 发接口验证用户有效性
		console.log('发送客服登录信息 Json = ' + JSON.stringify(LoginInfo));
	});

	/**
	 * 接收客服登陆结果
	 */
	socket.on('serviceLoginResult',function(data){
		console.log('--------------------------- 接收客服登陆结果 ------------------------------');
		console.log('客服登陆成功 serviceId = ' + data.serviceId + " , serviceNickName = " + data.serviceNickName);
		//TODO 保存服务器返回的客服信息
		socket.serviceId = data.serviceId;
		socket.serviceNickName = data.serviceNickName;
		socket.channel = data.channel;
		$('#serviceLoginReturn').val('客服:' + data.serviceNickName + ', 登陆成功, 创建会话 : ' + data.serviceId + ', 等待用户接入...');
		//TODO 更新页面显示-进入客服页面-赋值信息（缓存自己的信息）
	});

	/**
	 * 获得新分配用户的信息
	 */
	socket.on('assignUser',function(data){
		console.log('--------------------------- 获得新分配用户的信息 ------------------------------');
		console.log('被分配了用户, id = ' + data.agentId + " , 昵称 = " + data.agentNickName + " , 渠道 = " + data.channel);
		$('#assignUser').val('被分配了用户, id = ' + data.agentId + " , 昵称 = " + data.agentNickName + " , 渠道 = " + data.channel + ", 发送默认询问,等待回复...");
		//保存当前这个页面的用户信息
		socket.agentId = data.agentId;
		socket.agentNickName = data.agentNickName;
		socket.channel = data.channel;
		//TODO 发送默认询问 - 此处要做成可配置项
		console.log('socket.serviceId = ' + socket.serviceId);
		var defRespond = {from : socket.serviceId, to : data.agentId, message : "默认回复-有什么需要帮助?"};
		socket.emit('defRespondToAgent',defRespond);
		//TODO 更新页面显示 - 创建新用户会话窗口，更新内容显示
	});

	/**
	 * 客服发送消息给用户
	 */
	$('#sendMsgBtn').click(function () {
		console.log('--------------------------- 发送消息给用户 ------------------------------');
		//构建测试数据
		var sendMsg = {};
		sendMsg.from = socket.serviceId;
		sendMsg.to= socket.agentId;
		sendMsg.message = $('#sendMsg').val();
		console.log('向客服发送消息 sendMsg.from = ' + sendMsg.from + " , sendMsg.to = " + sendMsg.to + " , sendMsg.message = " + sendMsg.message);
		//用户发送
		socket.emit('serviceToUserMsg', sendMsg);
		//TODO 更新页面显示 - 聊天区域本地更新信息
	});

	/**
	 * 收到用户发来的消息
	 * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	 * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	 * parameter: 消息内容(发送方 接收方 消息内容)
	 */
	socket.on('userToServiceMsg',function(data){
		console.log('--------------------------- 收到用户发来的消息 ------------------------------');
		console.log('收到用户消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
		//TODO 更新页面显示
		$('#reciverMsg').val(JSON.stringify(data));
	});

	/**
	 * 用户退出
	 */
	socket.on('agentLogout',function(data){
		console.log('--------------------------- 用户退出 ------------------------------');
		console.log('用户退出了, id = ' + data.agentId + " , 昵称 = " + data.agentNickName + " , 渠道 = " + data.channel);
		//TODO 更新页面显示 - 提示或关闭窗口
		$('#agentLogout').val(JSON.stringify(data));
	});

	/**
	 * 来自服务器的消息 -- 关闭浏览器，主动断开，掉线等任何断开连接的情况
	 */
	socket.on('disconnect',function(){
		console.log('--------------------------- 服务器断开连接 ------------------------------');
		console.log("服务器断开连接");
		//TODO 更新页面显示
	});

});
