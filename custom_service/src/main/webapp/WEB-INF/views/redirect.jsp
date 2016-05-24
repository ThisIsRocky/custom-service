<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<head>
<title>Login- 餐饮管理系统</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="${ctx}/static/ace-1.3.4/css/font-awesome.min.css" />
</head>
<body>
    <!-- PAGE CONTENT BEGINS -->
    <div>
        <div>
            <div>
                <h1>
                    <span> <i class="ace-icon fa fa-sitemap"></i>
                    </span> 您访问的域名已失效
                </h1>

                <hr>
                <h3>5秒钟后跳转到${domain}</h3>
                <div>
                    <div></div>
                    <ul>
                        <li><i class="ace-icon fa fa-hand-o-right blue"></i> 当前访问网址近期将会失效，请记住即将跳转的网页地址</li>

                    </ul>
                </div>
                <hr>
                <div class="center">
                    <a href="javascript:history.back()"> <i class="ace-icon fa fa-arrow-left"></i> 后退
                    </a> <a href="${domain }"> <i class="ace-icon fa fa-tachometer"></i> 直接跳转
                    </a>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
                    setTimeout(function() {
                        location.href = '${domain}';
                    }, 5000);
                </script>
</body>
</html>