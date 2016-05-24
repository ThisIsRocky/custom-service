<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<nav role="navigation" class="navbar-default navbar-static-side">
    <div class="sidebar-collapse">
        <ul id="side-menu" class="nav">
            <li class="nav-header">
                <div class="dropdown profile-element"> <span>
                    <img src="img/profile_small.jpg" class="img-circle" alt="image">
                     </span>
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold">David Williams</strong>
                     </span> <span class="text-muted text-xs block">Art Director <b class="caret"></b></span> </span> </a>
                    <ul class="dropdown-menu animated fadeInRight m-t-xs">
                        <li><a href="profile.html">Profile</a></li>
                        <li><a href="contacts.html">Contacts</a></li>
                        <li><a href="mailbox.html">Mailbox</a></li>
                        <li class="divider"></li>
                        <li><a href="login.html">Logout</a></li>
                    </ul>
                </div>
                <div class="logo-element">
                    Eleme cs
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
            <!--<li>
                <a href="mailbox.html"><i class="fa fa-envelope"></i> <span class="nav-label">Mailbox </span><span class="label label-warning pull-right">16/24</span></a>
                    <li><a href="#" class="J_menuItem">Inbox</a></li>
                    <li><a href="mail_detail.html" class="J_menuItem">Email view</a></li>
                    <li><a href="mail_compose.html" class="J_menuItem">Compose email</a></li>
                    <li><a href="email_template.html" class="J_menuItem">Email templates</a></li>
                </ul>
            </li>
            <li>
                <a href="/index/toList" class="J_menuItem"><i class="fa fa-pie-chart"></i> <span class="nav-label">列表</span>  </a>
            </li> -->
        </ul>

    </div>
</nav>
<script type="text/javascript">
$(function() {
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