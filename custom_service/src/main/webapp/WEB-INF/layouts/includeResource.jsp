<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="stylesheet" href="${ctx}/static/styles/common/inputSelect.css" />
<link rel="stylesheet" href="${ctx}/static/styles/tooltip.css" />

<link href="${ctx}/static/inspinia/css/bootstrap.min.css" rel="stylesheet">
<link href="${ctx}/static/inspinia/font-awesome/css/font-awesome.css" rel="stylesheet">
<!-- Toastr style -->
<link href="${ctx}/static/inspinia/css/plugins/toastr/toastr.min.css" rel="stylesheet">
<!-- Gritter -->
<link href="${ctx}/static/inspinia/js/plugins/gritter/jquery.gritter.css" rel="stylesheet">

<link href="${ctx}/static/inspinia/css/animate.css" rel="stylesheet">
<link href="${ctx}/static/inspinia/css/plugins/jQueryUI/jquery-ui-1.10.4.custom.min.css" rel="stylesheet">
<link href="${ctx}/static/inspinia/css/plugins/jqGrid/ui.jqgrid.css" rel="stylesheet">
<link href="${ctx}/static/inspinia/css/style.css" rel="stylesheet">

<script src="${ctx}/static/inspinia/js/jquery-2.1.1.js"></script>
<script src="${ctx}/static/inspinia/js/bootstrap.min.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
<!-- jQuery UI -->
<!-- Custom and plugin javascript -->
<script src="${ctx}/static/inspinia/js/inspinia.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/jqGrid/i18n/grid.locale-cn.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/gritter/jquery.gritter.min.js"></script>
<script src="${ctx}/static/inspinia/js/plugins/jquery-ui/jquery-ui.min.js"></script>
<!-- Toastr -->
<script src="${ctx}/static/inspinia/js/plugins/toastr/toastr.min.js"></script>

<!-- 可输入的下拉框控件 -->
<script src="${ctx}/static/scripts/utils/InputSelectUtil.js"></script>
<!-- 可输入的多选下拉框控件 -->
<script src="${ctx}/static/scripts/utils/MultiSelectUtil.js"></script>
<script src="${ctx}/static/scripts/tab_container.js"></script>