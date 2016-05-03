//页面加载完成
$(document).ready(function(){
	console.log('客服页面加载完成');
	var agentInfoArr = new Array();

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
		var serviceInfo = {serviceId : '001', serviceNickName : '测试客服001', channel : '测试App-客服端'};
		serviceInfo.serviceId = $('#serviceId').val();
		serviceInfo.serviceNickName = $('#serviceNickName').val();
		socket.emit('serviceLogin', serviceInfo);
		//TODO 发接口验证用户有效性
		console.log('发送客服登录信息 Json = ' + JSON.stringify(serviceInfo));
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
		//TODO 保存当前会话下的多用户信息和那个用户说话就要设置成那个用户的） 对象包含 ：用户ID 昵称 渠道
		var agentInfo = {};
		agentInfo.agentId = data.agentId;
		agentInfo.agentNickName = data.agentNickName;
		agentInfo.channel = data.channel;
		agentInfoArr.push(agentInfo);
		console.log('打印agentInfoArr[0] = ' + JSON.stringify(agentInfoArr[0]));
		// socket.agentId = data.agentId;
		// socket.agentNickName = data.agentNickName;
		// socket.channel = data.channel;
		//TODO 发送默认询问 - 此处要做成可配置项
		console.log('socket.serviceId = ' + socket.serviceId);
		var defRespond = {from : socket.serviceId, to : data.agentId, message : "默认回复-有什么需要帮助?"};
		socket.emit('defRespondToAgent',defRespond);
		//TODO 更新页面显示 - 创建新用户会话窗口，更新内容显示
	});

	/**
	 * 根据用户Id获取用户信息
	 * @param agentInfoArr 当前房间的用户列表
	 * @param agentId      检索条件:用户Id
	 * @returns {*} 指定Id的用户信息对象
	 */
	function getAgentInfo(agentInfoArr, agentId) {
		console.log("--------- 根据用户Id获取用户实例 ---------");
		var agentInfo;
		if (agentInfoArr.length > 0) {
			console.log("agentInfoArr.length = " + agentInfoArr.length);
			for (var i = 0; i < agentInfoArr.length; i++) {
				console.log("agentInfoArr[i] = " + JSON.stringify(agentInfoArr[i]));
				// console.log("匹配agentId = " + agentId + ", 匹配项 = " + agentInfoArr[i].agentId);
				if(agentId == agentInfoArr[i].agentId){
					console.log("找到agentId实例");
					agentInfo = agentInfoArr[i];
				} else {
					console.log("未找到agentId实例");
				}
			}
			console.log("agentInfo.agentId = " + agentInfo.agentId);
			console.log("agentInfo.agentNickName = " + agentInfo.agentNickName);
		} else {
			agentInfo = false;
		}
		return agentInfo;
	}
	
	/**
	 * 客服发送消息给用户
	 */
	$('#sendMsgBtn').click(function () {
		console.log('--------------------------- 发送消息给用户 ------------------------------');
		//TODO 给谁发：现在没有页面 只能手工输入了（取自页面）
		var sendAgentId = $('#sendAgentId').val();
		//TODO 找到要发送的用户信息并进行设置   有页面的话可以从页面取值  无页面时先来自缓存数组用户个人信息
		var agentInfo = getAgentInfo(agentInfoArr, sendAgentId);
		console.log('当前要给用户发消息 对象 = ' + JSON.stringify(agentInfo));
		//构建测试数据
		var sendMsg = {};
		sendMsg.from = socket.serviceId;
		sendMsg.to= agentInfo.agentId;//当前给谁发
		sendMsg.message = $('#sendMsg').val();
		console.log('向客服发送消息 sendMsg.from = ' + sendMsg.from + " , sendMsg.to = " + sendMsg.to + " , sendMsg.message = " + sendMsg.message);
		//用户发送
		socket.emit('serviceToAgentMsg', sendMsg);
		//TODO 更新页面显示 - 聊天区域本地更新信息
	});

	/**
	 * 收到用户发来的消息
	 * 1,根据消息目标ID找到聊天室,将消息发给对应客服
	 * * 站在用户角度为1对1 : 客服端收到消息后根据发送人ID更新UI
	 * parameter: 消息内容(发送方 接收方 消息内容)
	 */
	socket.on('agentToServiceMsg',function(data){
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
