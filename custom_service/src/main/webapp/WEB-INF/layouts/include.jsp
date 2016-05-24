<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html>
<head>
<%@ include file="/WEB-INF/layouts/includeResource.jsp"%>
</head>
<body class="no-skin"  style="background-color: #f3f3f4;">
	<sitemesh:body />
	<script type="text/javascript">

    $(function() {
        $(document).click(function() {
        	if((parent && parent.frameElement && parent.frameElement.tagName != 'IFRAME') || parent.window) {
        		if(parent.window.clickEvent) {
		        	parent.window.clickEvent();
        		}
        	}
        });
    });
	</script>
</body>
</html>
