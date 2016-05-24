<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.lang.Exception"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>错误页面</title>
	</head>
	<body>
		<h1>页面出错了，请联系管理员</h1>
		<div style="display:none">
			<% Exception e = (Exception)request.getAttribute("exception"); 
			out.print(e.fillInStackTrace());
			//out.print(e.getMessage()); %>
		</div>
	</body>
</html>
