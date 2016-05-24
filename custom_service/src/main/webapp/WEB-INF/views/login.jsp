<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh"
	uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Login- 餐饮管理系统</title>
<link rel="icon" href="/favicon.ico" type="image/x-icon" />
<link rel="SHORTCUT ICON" href="/favicon.ico"  type="image/x-icon" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet"
	href="${ctx}/static/amazeUi/amazeui.custom.min.css" />
<link rel="stylesheet"
	href="${ctx}/static/styles/jquery/jquery.gritter.css" />
<!-- bootstrap & fontawesome -->
<link rel="stylesheet"
	href="${ctx}/static/ace-1.3.4/css/bootstrap.min.css" />
<link rel="stylesheet"
	href="${ctx}/static/ace-1.3.4/css/font-awesome.min.css" />

<!-- page specific plugin styles -->
<link rel="stylesheet"
	href="${ctx}/static/ace-1.3.4/css/ui.jqgrid.min.css" />
<!-- ace styles -->
<link rel="stylesheet" href="${ctx}/static/ace-1.3.4/css/ace.min.css"
	class="ace-main-stylesheet" id="main-ace-style" />

<!--[if lte IE 9]>
	    <link rel="stylesheet" href="${ctx}/static/ace-1.3.4/css/ace-part2.min.css" class="ace-main-stylesheet" />
	<![endif]-->

<!--[if lte IE 9]>
	  <link rel="stylesheet" href="${ctx}/static/ace-1.3.4/css/ace-ie.min.css" />
	<![endif]-->

<!--[if lte IE 8]>
    <script type="text/javascript"> 
        alert("很遗憾，您现在正在使用的浏览器在系统中存在兼容性问题，部分功能可能无法使用\n目前系统支持谷歌浏览器(chrome)"); 
    </script> 
    <![endif]-->

<link rel="stylesheet"
	href="${ctx}/static/styles/jquery/perfect-scrollbar.min.css" />

<link rel="stylesheet" href="${ctx}/static/styles/common/default.css" />

<style>
.widget-box {
	min-height: 250px !important;
}

#sendMobile {
	width: 170px;
	height: 40px;
	padding: 0 10px;
	line-height: 40px;
	color: #bababa
}

.send {
	width: 95px;
	height: 40px;
	border: 1px solid #0089dc;
	margin-left: 5px;
	color: #0089dc;
	text-align: center;
	background: #fff;
	cursor: pointer
}
.zs_icon {
    width : 260px;
    hright:50px;
}
</style>
</head>

<body class="login-layout light-login">
	<div class="main-container" style="margin-top: 80px">
		<div class="main-content">
			<div class="row">
				<div class="col-sm-10 col-sm-offset-1">
					<div class="login-container">
						<div class="center">
<!-- 							<h1>
								<i class="ace-icon fa fa-leaf green"></i> <span class="red">馔山</span>
								<span class="grey" id="id-text2">餐饮管理系统</span>
							</h1> -->
							<img alt="" src="${ctx}/static/image/bg.jpg" class="zs_icon">
							<h4 class="blue" id="id-company-text">&copy; 馔山餐饮管理有限公司</h4>
						</div>

						<div class="space-6"></div>

						<div class="position-relative">
							<div id="login-box"
								class="login-box visible widget-box no-border">
								<div class="widget-body">
									<div class="widget-main">
										<h4 class="header blue lighter bigger">
											<i class="ace-icon fa fa-coffee green"></i> 请输入你的账号与密码
										</h4>
										<div class="space-6"></div>
										<form action="${ctx}/loginForm" method="post" id="form-signin">
											<fieldset>
												<label class="block clearfix"> <span
													class="block input-icon input-icon-right"> <input
														type="text" class="form-control" name="userName" id="userName"
														placeholder="账号" /> <i class="ace-icon fa fa-user"></i>
												</span>
												</label> <label class="block clearfix"> <span
													class="block input-icon input-icon-right"> <input
														type="password" class="form-control" name="password"
														id="password" placeholder="密码" /> <i
														class="ace-icon fa fa-lock"></i>
												</span>
												</label> <label class="block clearfix"> <span
													class="block input-icon input-icon-right"> <input
														type="text" class="form-control" name="kaptchaCode"
														id="kaptchaCode" placeholder="验证码" /> <i class="ace-icon"
														style="margin-right: -5px"> <img style="height: 32px"
															onclick="myReload()" id="kaptchaId" alt="验证码"
															src="kaptcha"></i>
												</span>
												</label>
												<input type="hidden" id="systemId" name="systemId" value="erp">
												<div class="space"></div>
												<div class="alert alert-danger hidden" role="alert"></div>
												<div class="clearfix">
													<button type="button" id="submitBtn"
														class="width-35 pull-right btn btn-sm btn-primary">
														<i class="ace-icon fa fa-key"></i> <span
															class="bigger-110">登录</span>
													</button>
												</div>

												<div class="space-4"></div>
											</fieldset>
										</form>
									</div>
									<!-- /.widget-main -->
								</div>
								<!-- /.login-box -->
							</div>
							<!-- /.position-relative -->
						</div>
					</div>
					<!-- /.col -->
				</div>
				<!-- /.row -->
			</div>
			<!-- /.main-content -->
		</div>
		<!-- /.main-container -->

		<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
			aria-labelledby="myModalLabel" aria-hidden="true">

			<div class="modal-dialog">

				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">&times;</button>
						<h3>安全验证</h3>
					</div>
					<div class="modal-body">
						<p>
							<input type="text" id="sendMobile" placeholder="请输入验证码" value="">
							<button class="send sendMsg phone"
								onclick="sendVerifyCodeForMobile(this)" id="sendMsgBtn">发送验证码</button>
						</p>
					</div>
					<div class="codeAlert alert-danger hidden" role="alert"
						style="height: 50px; padding: 15px"></div>
					<div class="modal-footer">
						<button type="button" id="toFrameBtn" class="btn btn-primary" style="width: 150px"
							onclick="toFrame()">确定</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">取消
						</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
        </div>

<!-- ace settings handler -->
<script src="${ctx}/static/ace-1.3.4/js/ace-extra.min.js"></script>
<!-- inline styles related to this page -->
<!-- ace settings handler -->
<script src="${ctx}/static/ace-1.3.4/js/jquery.min.js"></script>
<script src="${ctx}/static/ace-1.3.4/js/bootstrap.min.js"></script>
<script src="${ctx}/static/ace-1.3.4/js/jquery.gritter.min.js"></script>
<script src="${ctx}/static/rsa/jsbn.js"></script>
<script src="${ctx}/static/rsa/prng4.js"></script>
<script src="${ctx}/static/rsa/rng.js"></script>
<script src="${ctx}/static/rsa/rsa.js"></script>
<script src="${ctx}/static/scripts/login.js"></script>
</body>
</html>
