<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="Cache-Control" content="no-store" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="description" content="overview &amp; stats" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<title>馔山餐饮管理系统<sitemesh:title /></title>
<link rel="icon" href="/favicon.ico" type="image/x-icon" />
<link rel="SHORTCUT ICON" href="/favicon.ico"  type="image/x-icon" />

<%@ include file="/WEB-INF/layouts/includeResource.jsp"%>

<style type="text/css">

#content-main{
    height:100%;
    min-height:375px;
}
</style>

</head>

<body class="md-skin pace-done">
    <%@ include file="/WEB-INF/layouts/sidebar.jsp"%>
    <div id="page-wrapper" class="dashbard-1" style="min-height: 432px;"">
<%--         <%@ include file="/WEB-INF/layouts/header.jsp"%>
 --%>            
        <div class="row content-tabs" id="content-tabs">
	        <a href="#" id="navbar-minimalize" class="navbar-minimalize minimalize-styl-1 btn btn-primary roll-nav roll-left "><i class="fa fa-bars"></i> </a>
            <button class="roll-nav roll-left J_tabLeft" style="margin-left:40px;"><i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <a data-id="index_v1.html" class="active J_menuTab" href="javascript:;" style="margin-left:40px;">首页</a>
                </div>
            </nav>
            <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
            </button>
            <div class="btn-group roll-nav roll-right">
                <button data-toggle="dropdown" class="dropdown J_tabClose">关闭操作<span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" role="menu">
                    <li class="J_tabShowActive"><a>定位当前选项卡</a>
                    </li>
                    <li class="divider"></li>
                    <li class="J_tabCloseAll"><a>关闭全部选项卡</a>
                    </li>
                    <li class="J_tabCloseOther"><a>关闭其他选项卡</a>
                    </li>
                </ul>
            </div>
            <a class="roll-nav roll-right J_tabExit" href="login.html"><i class="fa fa fa-sign-out"></i> 退出</a>
        </div>
        <div class="row J_mainContent" id="content-main">
            <iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="" frameborder="0" data-id="index_v1.html" seamless=""></iframe>
        </div>
        <!--#内容显示 -->
<%--         <div id="frameContainer" style="overflow-y:hidden;padding:0px;">
	            <sitemesh:body />
		        <iframe id="defaultFrame" name="defaultFrame" class="contentFrame" scrolling="auto" style="display:none;width:100%;padding-left: 3px;">
		        </iframe>
        </div> --%>
    </div>
</body>
</html>
