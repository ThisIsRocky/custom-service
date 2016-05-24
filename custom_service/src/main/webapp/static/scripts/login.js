function sendVerifyCodeForMobile(obj) {
    $.ajax({
        type : "POST",
        data : $("#form-signin").serialize(),
        url : "/sendIdentifyingCode",
        type : "POST",
        dataType : "json",
        success : function(data) {
        },
        error : function(req) {
        }
    });
    settime(obj)
}
var countdown = 60;
function settime(obj) {

    if (countdown == 0) {
        obj.removeAttribute("disabled");
        $('#sendMsgBtn').html("发送验证码");
        countdown = 60;
        return;
    } else {
        obj.setAttribute("disabled", true);
        $('#sendMsgBtn').html("已发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function() {
        settime(obj)
    }, 1000)
}

function toFrame() {
    $(".codeAlert").addClass("hidden");
    var code = $('#sendMobile').val();
    if (code == '' || code == null) {
        $(".codeAlert").html("请输入验证码");
        $(".codeAlert").removeClass("hidden");
        return;
    }
    $("#toFrameBtn").attr("disabled", "true");
    $.ajax({
        type : "POST",
        url : "/validIdentifyingCode?code=" + code,
        data : $("#form-signin").serialize(),
        type : "POST",
        dataType : "json",
        success : function(data) {
            if (data == true) {
                window.location.href = "/frame";
            } else {
                $(".codeAlert").html("手机验证码错误或失效");
                $(".codeAlert").removeClass("hidden");
                $("#toFrameBtn").removeAttr("disabled");
            }

        },
        error : function(req) {
            $(".codeAlert").html("手机验证码错误或失效");
            $(".codeAlert").removeClass("hidden");
            $("#toFrameBtn").removeAttr("disabled");
        }
    });

}
function myReload() {
    $("#kaptchaId").attr('src', $("#kaptchaId").attr("src") + "?nocache=" + new Date().getTime());
}

function do_encrypt(psw) {
    var rsa = new RSAKey();
    rsa.setPublic('ab392a0fd72152bd91141a02d3c99403c3700fdee2bff7d72b350659fb95b1ee6785a0baf2b196bf0dddf882dc8d675974ea9edc4609c946db6a4e29458808a749b309bad0e8ca392e8a635409e5086bde826f59d8609c95769bd6edba8a8e450c2aa94d9e746c645fad67b9d15eef14f0a7d63fa985f5d88c2b323258d490cf', '10001');
    var res = rsa.encrypt(psw);
    if (res) {
        return linebrk(res, 64);
    }
}

$(function() {

    $(document).keypress(function(event) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == "13") {// keyCode=13是回车键
            $('#submitBtn').click();
        }
    });
    $("#submitBtn").click(function(e) {
        var userName = $.trim($("#userName").val());
        var password = $("#password").val();
        var systemId = $("#systemId").val();
        var alertMessage = "";
        var focusFlag = 0;
        if (userName == '' || userName == null) {
            alertMessage += "账号不能为空!</br>";
            focusFlag = 1;
        }
        if (password == '' || password == null) {
            alertMessage += "密码不能为空!</br>"
            focusFlag += 2;
            $("#password").focus();
        }
        var kaptchaCode = $("#kaptchaCode").val();
        if (kaptchaCode == '' || kaptchaCode == null) {
            alertMessage += "验证码不能为空!</br>"
        }
        if (alertMessage != "" && alertMessage != null) {
            $(".alert").html(alertMessage);
            $(".alert").removeClass("hidden");
            if (focusFlag == 2) {
                $("#password").focus();
            }
            if (focusFlag == 1 || focusFlag == 3) {
                $("#userName").val("");
                $("#userName").focus();
            }
            return;
        }

        $.ajax({
            url : "/userType",
            type : "POST",
            data : {'userName' : userName },
            dataType : "text",
            success : function(data) {
            if (data == 0) {
               password = do_encrypt(password);
            }
                    $.ajax({
                    url : "loginForm",
                    type : "POST",
                    data : {'userName' : userName, 'password' : password, 'kaptchaCode' : kaptchaCode, 'systemId' : systemId},
                    dataType : "text",
                    success : function(data) {
                    if (data == "true") {
                    $(".alert").addClass("hidden");
                    $('#myModal').modal();

                    // window.location.href="/frame";
                    return;
                }else if (data == "noMobile") {
                    window.location.href = "frame";
                }else if (data == "rekaptcha") {
                    myReload();
                    $(".alert").html("<font color='red'>验证码错误</font>");
                    $(".alert").removeClass("hidden")
                    $('#submitBtn').attr("disabled", false);

                    return;
                }else if (data == 'overtimes') {
                    $(".alert").html("<font color='red'>账号已经被锁，请半小时后重新登录</font>");
                    $(".alert").removeClass("hidden")
                } else {
                    $(".alert").html("<font color='red'>账号或密码错误</font>");
                    myReload();
                    $(".alert").removeClass("hidden")
                }
                },
                    error : function(req) {
                    if(req.readyState == 4 && req.status == 200 && req.responseText == 'noMobile'){
                    window.location.href = "frame";
                }else{
                    myReload();
                    if (req.responseText == 'rekaptcha') {
                    $(".alert").html("<font color='red'>验证码错误</font>");
                    $(".alert").removeClass("hidden")
                    $('#submitBtn').attr("disabled", false);
                }else if(req.responseText == 'overtimes') {
                    $(".alert").html("<font color='red'>账号已经被锁，请半小时后重新登录</font>");
                    $(".alert").removeClass("hidden");
                } else {
                    $(".alert").html("<font color='red'>服务器发生错误</font>");
                    $(".alert").removeClass("hidden");
                }
                }
                }
                });
        },
        });
    });


})
if (window != top) {
    top.location.href = location.href;
}

// 浏览器检查
var sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
var scan;
(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1]
    : (s = ua.match(/firefox\/([\d.]+)/))? sys.firefox = s[1]
    : (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1]
    : (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1]
    : (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

// 以下进行测试
if (sys.ie) {
    scan = "您使用的ie内核" + sys.ie;
}
if (sys.firefox) {
    scan = "您使用的是firefox内核" + sys.firefox;
}
//if (sys.chrome) {
//    scan = "您使用的是chrome内核" + sys.chrome;
//}
if (sys.opera) {
    scan = "您使用的是opera内核" + sys.opera;
}
if (sys.safari) {
    scan = "您使用的是safari内核" + sys.safari;
}
if (scan) {
    scan = '很抱歉，' + scan + '的浏览器，在系统中可能存在兼容性问题，部分功能无法正常使用<br/>请使用最新的<span class="green">谷歌浏览器(chrome)</span>';

    scan += '<br/><img class="gritter-image" src="/static/image/chrome.png">';
    $.gritter.add({
        title: '浏览器兼容性警告',
        text: scan,
        sticky: false,
        time: 100000,
        //image: '/static/image/chrome.png',
        class_name: 'gritter-warning gritter-center'
    });
}
