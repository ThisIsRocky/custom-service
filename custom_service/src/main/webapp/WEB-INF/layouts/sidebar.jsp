<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<link href="${ctx}/static/styles/common/tab_container-green.css" title="tab_theme" rel="stylesheet">
<link href="${ctx}/static/switch/css/bootstrap3/bootstrap-switch.css" rel="stylesheet">
<script src="${ctx}/static/switch/js/bootstrap-switch.js"></script>
<script src="${ctx}/static/jquery/jquery.cookie.js"></script>
<script type="text/javascript">
var greenStyle = '${ctx}/static/styles/common/tab_container-green.css';
var darkStyle = '${ctx}/static/styles/common/tab_container-dark.css';
var cookie_style = $.cookie('tab_theme');
if(cookie_style!=null){ 
	$("link[title='tab_theme']").attr("href",'${ctx}/static/styles/common/tab_container-'+cookie_style+'.css');
}
</script>
<nav role="navigation" class="navbar-default navbar-static-side">
    <div class="sidebar-collapse">
        <ul id="side-menu" class="nav">
            <li class="nav-header">
                <div class="dropdown profile-element"> <span>
                    <img src="img/profile_small.jpg" class="img-circle" alt="image">
                     </span>
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
	                    <span class="clear"> 
	                        <span class="text-muted text-xs block"> <strong class="font-bold">赵明</strong><b class="caret"></b></span>
	                    </span>
                    </a>
                    <ul class="dropdown-menu animated fadeInRight m-t-xs">
                        <li><a href="profile.html">个人信息</a></li>
                        <li class="divider"></li>
                        <li><a href="contacts.html">联系方式</a></li>
                        <li class="divider"></li>
                        <li><a href="mailbox.html">邮箱</a></li>
                        <li class="divider"></li>
	                    <li>
	                       <a href="javascript:void(0);">
			                    <div class="themeControl">
				                    主题:
				                    <div id="switcher" class="bootstrap-switch bootstrap-switch-mini">
									    <input id="themeSwitch" autocomplete="off" type="checkbox" checked  on-text="绿色" off-text="黑色"/>
									</div>
			                    </div>
	                       </a>
	                    </li>
                    </ul>
                </div>
                <div class="logo-element">
                    饿了么客服
                </div>
            </li>
            <c:forEach items="${menus}" var="menu">
	             <li>
	                <a><i class="${menu.iconClass}"></i> <span class="nav-label">${menu.menuName}</span> <span class="fa arrow"></span></a>
	                <c:if test="${menu.childMenu != null}">
		                <ul class="nav nav-second-level collapse">
	                        <c:forEach items="${menu.childMenu}" var="c">
			                    <li><a href="${c.url}" class="J_menuItem">${c.menuName}</a></li>
	                        </c:forEach>
	                    </ul>
	                </c:if>
	            </li>
            </c:forEach>
        </ul>
    </div>
</nav>
<script type="text/javascript">
$(function() {
	var state = true;
	if(cookie_style == 'dark') {
	    $('body').removeClass('md-skin');
	    state = false;
	}
	$("#themeSwitch").bootstrapSwitch({onText:'绿色',offText:'黑色', onColor:'success', offColor:'dark', state : state});
	
	$('#switcher').on('switchChange.bootstrapSwitch', function (e, on) {
	    var style = null;
		if(on) {//绿色主题
	    	style = 'green';
            $('body').addClass('md-skin');
            $("link[title='tab_theme']").attr("href",greenStyle); 
	    }else {//黑色主题
	    	style = 'dark';
            $('body').removeClass('md-skin');
            $("link[title='tab_theme']").attr("href",darkStyle); 
        }
		$.cookie('tab_theme', style);
        /* createLink(style); */
	});
	
    $('#side-menu').metisMenu();
/*     $.post('/index/loadMenu', {}, function(list) {
        $(list).each(function() {
            var menuLevel1 = $('<li>');
            var icon = this.iconClass ? this.iconClass : 'fa fa-th-large';
            menuLevel1.append('<a href="javascript:void(0);" class="J_menuItem"><i class="'+icon+'"></i> <span class="nav-label">'+this.menuName+'</span> <span class="fa arrow"></span></a>');
            if(this.childMenu) {
            	var level2 = $('<ul class="nav nav-second-level collapse">');
                $(this.childMenu).each(function() {
                    level2.append('<li><a href="'+this.url+'" class="J_menuItem">'+this.menuName+'</a></li>');
                });
                menuLevel1.append(level2);
            }
            $("#side-menu").append(menuLevel1);
        });
	   initMenuItem();
    }, 'json'); */
});

function createLink(theme) {     
	$("#theme-style").remove();
	var cssURL = '${ctx}/static/styles/common/tab_container-'+theme+'.css';
    var linkTag = $('').attr({
        'id': 'theme-style',
        'href': cssURL,
        'rel': 'stylesheet',
        'type': 'text/css',
        'media': 'all'
    });
    // 注意是将link添加到head里                        
    $($('body')[0]).append(linkTag);
}

function initMenuItem() {
    $(".J_menuItem").each(function(k) {
        if (!$(this).attr("data-index")) {
            $(this).attr("data-index", k)
        }
    });
    $(".J_menuItem").on("click", c);
}

function addFrame(url, id) {
    $(".frame_tab_title").each(function() {
        var fid = "#"+$(this).attr('frameid');
        $(fid).hide();
    });
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.class = "frame_tab";
    iframe.id = "frame_tab_" + id;
    if(id == 0) {
        iframe.height = $(window).height() - $("#navbar").height();
    }else {
        iframe.height = $(window).height() - $("#navbar").height() - 20;
    }
    iframe.width = '100%';
    $("#frameContainer").append(iframe);
    updateFrameHeightAndWidth();
}
</script>