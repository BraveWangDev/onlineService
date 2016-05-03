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
	 * 用户登陆
	 */
	$('#agentLogin').click(function () {
		console.log("-------------------------------- 发送用户登录信息 -----------------------------------");
		//TODO 登录信息来自页面输入（或赋值）
		var agentInfo = {agentId : '1001', agentNickName : '测试用户1001', channel : '测试App-用户端'};
		agentInfo.agentId = $('#agentId').val();
		agentInfo.agentNickName = $('#agentNickName').val();
		socket.emit('agentLogin', agentInfo);
		//保存自己的信息
		socket.agentId = agentInfo.agentId;
		socket.agentNickName = agentInfo.agentNickName;
		socket.channel = agentInfo.channel;
		console.log('用户端保存用户信息到Socket完成');
	});

	/**
	 * 接收登陆结果
	 */
	socket.on('agentLoginResult',function(data){
		console.log('--------------------------- 收到用户登录结果 ------------------------------');
		console.log('登录返回 Json = ' + JSON.stringify(data));
		if(data.resCode == 0){
			console.log('用户登陆成功 分配serviceId = ' + data.serviceId + ', nickName = ' + data.serviceNickName);
			//TODO 保存分配客服信息和会话号
			socket.room = data.serviceId;
			socket.serviceId = data.serviceId;
			socket.serviceNickName= data.nickName;
			$('#agentLoginReturn').val('用户:' + socket.agentNickName + ', 登陆成功, 进入会话 : ' +  socket.room);
		}else{
			alert(data.message);
		}
	});

	/**
	 * 收到客服端的默认回复
	 */
	socket.on('defRespondToAgent', function (data) {
		console.log('--------------------------- 收到客服端的默认回复 ------------------------------');
		console.log('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
		$('#defRespondToAgent').val('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
		//TODO 更新UI - 显示区域内容显示
	});

	/**
	 * 用户发送消息给客服
	 */
	$('#sendMsgBtn').click(function () {
		console.log('--------------------------- 发送消息给客服 ------------------------------');
		//发送给客服
		var sendMsg = {};
		sendMsg.from = socket.agentId;
		sendMsg.to= socket.serviceId;
		sendMsg.message = $('#sendMsg').val();
		console.log('向客服发送消息 sendMsg.from = ' + sendMsg.from + " , sendMsg.to = " + sendMsg.to + " , sendMsg.message = " + sendMsg.message);
		socket.emit('agentToServiceMsg', sendMsg);
		//TODO 更新UI - 显示区域内容显示   清空输入框
	});

	/**
	 * 收到客服端的默认回复
	 */
	socket.on('agentToServiceMsg', function (data) {
		console.log('--------------------------- 收到客服端的默认回复 ------------------------------');
		console.log('收到客服端的默认回复, from = ' + data.from + " , to = " + data.to + " , 消息 = " + data.message);
		//TODO 更新页面显示 - 更新对话区域内容
		$('#reciverMsg').val(JSON.stringify(data));
	});

	/**
	 * 接收客服回复消息
	 * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	 * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	 * parameter: 消息内容(发送方 接收方 消息内容)
	 */
	socket.on('serviceToAgentMsg',function(data){
		console.log('--------------------------- 接收客服回复消息 ------------------------------');
		console.log('打印当前socket.room = ' + socket.room);//服务器是不会返回并更新本地socket对象的
		console.log('收到客服回复; data.from = ' + data.from + " , data.to = " + data.to + " , data.message = " + data.message);
		//TODO 更新页面显示 - 更新对话区域内容
		$('#reciverMsg').val(JSON.stringify(data));
	});

	/**
	 * 用户退出
	 */
	$('#agentLogout').click(function () {
		console.log('--------------------------- 用户退出 ------------------------------');
		console.log('点击用户退出 agentId = ' + socket.agentId + ", nickName = " + socket.agentNickName);
		//发送给客服
		var sendMsg = {};
		sendMsg.agentId = socket.agentId;
		sendMsg.agentNickName = socket.agentNickName;
		sendMsg.serviceId = socket.serviceId;
		socket.emit('agentLogout', sendMsg);
		//TODO 关闭页面， 清理个人信息缓存
	});

	/**
	 * 来自服务器的消息 -- 关闭浏览器，主动断开，掉线等任何断开连接的情况
	 */
	socket.on('disconnect',function(){
		console.log("服务器断开连接");
	});

});