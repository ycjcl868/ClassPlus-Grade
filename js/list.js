/**
 * Created by Administrator on 2015/8/22.
 */
//加载中
var ajaxbg = $("#background,#progressBar");
//获取老师account
var account = GetQueryString("account");
//获取第几次考试
var terms = GetQueryString("terms");
//获取请求类型：0-名次表   1-进步生   2-退步生  3-班级列表
var type = GetQueryString("type");
//获取返回
var back = document.getElementById("back");
//标题名
var typeName = document.getElementById("typeName");

ajaxbg.show();
//发送ajax请求
function ajax() {
    $.ajax({
        type: 'get',//account=7&terms=11
        url: 'process.php',//请求数据的地址
        dataType: 'json',
        data: {
            //学生account号
            account: account,
            //学期
            terms: terms,
            //类型
            type: type,
            //接口判断
            interface:'list'
        },
        timeout: 5000,
        success: function (data) {//
            try {
                ajaxbg.hide();
                var bt = baidu.template;
                //排名
                var rank = bt('rank', data);
                document.getElementById('list-content').innerHTML = rank;
            } catch (e) {
                alert("请重试");
            }
        },
        error: function (e) {
            alert("请求失败");
        },
        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时，请重试");
            }
        }
    });
}


ajax();


//获取url地址中的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
};

//返回按钮
back.onclick = function () {
    window.location.href = 'teacher.html?account=' + account + '&terms=' + terms;
};


//标题名
switch (type) {
    case '0':
        typeName.innerHTML = '名次列表';
        break;
    case '1':
        typeName.innerHTML = '进步生列表';
        break;
    case '2':
        typeName.innerHTML = '退步生列表';
        break;
    case '3':
        typeName.innerHTML = '班级列表';
        break;
    default :
        typeName.innerHTML = '出错了...';
        break;
}
;

