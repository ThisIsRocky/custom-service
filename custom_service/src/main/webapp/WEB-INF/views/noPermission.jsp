<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh"
           uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="stylesheet"
      href="${ctx}/static/ace/css/bootstrap.min.css"
      type="text/css" />

<div class="page-content-area">
    <div id="msg" class="alert alert-danger" style="text-align:center;margin-bottom: 0px;" role="alert" >您没有访问权限，请申请开通</div>
    <div style="text-align:center;"><a class="btn btn-primary" href="javascript:history.back();">返回</a></div>
</div>
