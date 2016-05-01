//var preRoom = '';
//var adder = true;
//var deler = true;

//页面加载完成
$(document).ready(function(){

	console.log('页面加载完成');

  	//获取客户端IO连接实例
  	var socket = io.connect();
	console.log('用户端连接IO完成');
	/**
	 * 注册用户端登陆点击事件
	 */
	$('#agentLogin').click(function () {
		console.log('发送客服登录信息');
		var agentInfo = {userId : '1001', nikeName : '测试用户1001', channel : '测试App-用户端'};
		socket.emit('agentLogin', agentInfo);
		//保存自己的信息
		socket.userId = agentInfo.userId;
		socket.nikeName = agentInfo.nikeName;
		socket.channel = agentInfo.channel;
		console.log('用户端保存用户信息到Socket完成');
	});

	/**
	 * 接收登陆结果
	 */
	socket.on('agentLoginResult',function(data){

		console.log('用户登陆成功 serviceId = ' + data.serviceId + ', nickName = ' + data.nickName);
		//保存分配客服信息和会话号
		socket.room = data.serviceId;
		socket.serviceId = data.serviceId;
		socket.serviceNickName= data.nickName;
		$('#agentLoginReturn').val('用户:' + socket.nikeName + ', 登陆成功, 进入会话 : ' +  socket.room);
	});

	//收到客服端的默认回复
	socket.on('defRespondToAgent', function (data) {
		console.log('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
		//更新UI
		$('#defRespondToAgent').val('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
	});

	/**
	 * 用户发送消息给客服
	 */
	$('#sendMsgBtn').click(function () {
		console.log('发送消息给客服');
		//发送给客服
		var sendMsg = {};
		sendMsg.from = socket.userId;
		sendMsg.to= socket.serviceId;
		sendMsg.message = $('#sendMsg').val();
		console.log('向客服发送消息 sendMsg.from = ' + sendMsg.from + " , sendMsg.to = " + sendMsg.to + " , sendMsg.message = " + sendMsg.message);
		socket.emit('userToServiceMsg', sendMsg);
	});

	//收到客服端的默认回复
	socket.on('userToServiceMsg', function (data) {
		console.log('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
		//更新UI
		$('#reciverMsg').val(JSON.stringify(data));
	});

	/**
	 * 接收客服回复消息
	 * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	 * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	 * parameter: 消息内容(发送方 接收方 消息内容)
	 */
	socket.on('serviceToUserMsg',function(data){
		console.log('打印当前socket.room = ' + socket.room);//服务器是不会返回并更新本地socket对象的
		console.log('收到客服消息 data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
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

	/**
	 * 用户退出事件
	 */
	$('#agentLogout').click(function () {
		console.log('点击用户退出 userId = ' + socket.userId + ", nickName = " + socket.nikeName);
		//发送给客服
		var sendMsg = {};
		sendMsg.userId = socket.userId;
		sendMsg.nickName = socket.nikeName;
		socket.emit('agentLogout', sendMsg);
	});

	//来自服务器的消息 -- 关闭浏览器，主动断开，掉线等任何断开连接的情况
	socket.on('disconnect',function(){
		console.log("服务器断开连接");
	});

});