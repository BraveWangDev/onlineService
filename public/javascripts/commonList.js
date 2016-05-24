/**
 * Created by Brave on 16/5/24.
 */

//页面加载完成
$(document).ready(function(){

    /**
     * 添加常用语
     */
    function addCommon() {

        var commonInfo = {username:'test', content:'测试添加常用语'};

        $.ajax({
            url: '/api/common/',
            type: 'POST',
            data: commonInfo,
            success: function(data, status, xhr) {
                alert("post成功!" + data.resCode);
            }
        })
    }

    /**
     * 查找常用语
     */
    function findCommon() {

        $.ajax({
            url: '/api/common/test',
            type: 'GET',
            success: function(data, status, xhr) {
                alert("get成功! resCode = " + data.resCode);
                alert(data.resData);
            }
        })
    }

    $('#addCommon').click(addCommon);
    $('#findCommon').click(findCommon);
});