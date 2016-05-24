<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<link rel="icon" href="favicon.ico" type="image/x-icon" />
<link rel="SHORTCUT ICON" href="favicon.ico" />
	<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
		<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
			<div class="main-container">
				<script type="text/javascript">
					try {
						ace.settings.check('main-container', 'fixed')
					} catch(e) {}
				</script>
				<div class="main-content">
					<div class="main-content-inner">
						<div id="breadcrumbs" class="breadcrumbs">
							<script type="text/javascript">
								try {
									ace.settings.check('breadcrumbs', 'fixed')
								} catch(e) {}
							</script>
							<ul class="breadcrumb">
								<li>
									<i class="ace-icon fa fa-home home-icon">
									</i>
									<a href="#">
										首页
									</a>
								</li>
							</ul>
						</div>
						<div class="page-content">
							<div class="row">
								<div id="notice-content" class="alert alert-block alert-success">
									<button type="button" class="close" data-dismiss="alert">
										<i class="ace-icon fa fa-times">
										</i>
									</button>
									<i class="ace-icon fa fa-check green">
									</i>
									
								</div>
							</div>
							<c:if test="${hasStoreProfitsPermission == true}">
							<div class="row">
								<div class="col-sm-6">
									<div class="widget-box">
										<div class="widget-header widget-header-flat widget-header-small">
											<h5 class="widget-title">
												<i class="ace-icon fa fa-signal">
												</i>
												自营净利润
											</h5>
											<div class="widget-toolbar" role="menu">
												<!-- add: non-hidden - to disable auto hide -->
												<div class="btn-group">
													<button class="btn dropdown-toggle btn-xs btn-success" data-toggle="dropdown"
													aria-expanded="false">
														昨天
														<span class="caret">
														</span>
													</button>
													<ul class="dropdown-menu pull-right js-status-update">
														<li class="active">
															<a href="javascript:void(0);" storetype=1 datetype=1>
																昨天
															</a>
														</li>
														<li class="">
															<a href="javascript:void(0);" storetype=1 datetype=2>
																本周
															</a>
														</li>
														<li class="">
															<a href="javascript:void(0);" storetype=1 datetype=3>
																上周
															</a>
														</li>
														<li>
															<a href="javascript:void(0);" storetype=1 datetype=4>
																本月
															</a>
														</li>
														<li>
															<a href="javascript:void(0);" storetype=1 datetype=5>
																上月
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
										<div class="widget-body">
											<div class="widget-main">
												<div id="store-self-pie-chart" style="width: 100%;height:210px;">
												</div>
												<div class="hr hr8 hr-double">
												</div>
												<div class="clearfix">
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-building fa-2x blue">
															</i>
															门店
															<br>
															<i class="ace-icon fa fa-spinner fa-spin blue store-num">
															</i>
														</span>
													</div>
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-cny fa-2x purple">
															</i>
															营业额
															<br>
															<i class="ace-icon fa fa-spinner fa-spin purple op-income">
															</i>
														</span>
													</div>
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-cny fa-2x red">
															</i>
															净利润
															<br>
															<i class="ace-icon fa fa-spinner fa-spin red profits">
															</i>
														</span>
													</div>
												</div>
											</div>
											<!-- /.widget-main -->
										</div>
										<!-- /.widget-body -->
									</div>
									<!-- /.widget-box -->
								</div>
								<div class="col-sm-6">
									<div class="widget-box">
										<div class="widget-header widget-header-flat widget-header-small">
											<h5 class="widget-title">
												<i class="ace-icon fa fa-signal">
												</i>
												联营净利润
											</h5>
											<div class="widget-toolbar" role="menu">
												<!-- add: non-hidden - to disable auto hide -->
												<div class="btn-group">
													<button class="btn dropdown-toggle btn-xs btn-success" data-toggle="dropdown"
													aria-expanded="false">
														昨天
														<span class="caret">
														</span>
													</button>
													<ul class="dropdown-menu pull-right js-status-update">
														<li class="active">
															<a href="javascript:void(0);" storetype=2 datetype=1>
																昨天
															</a>
														</li>
														<li class="">
															<a href="javascript:void(0);" storetype=2 datetype=2>
																本周
															</a>
														</li>
														<li class="">
															<a href="javascript:void(0);" storetype=2 datetype=3>
																上周
															</a>
														</li>
														<li>
															<a href="javascript:void(0);" storetype=2 datetype=4>
																本月
															</a>
														</li>
														<li>
															<a href="javascript:void(0);" storetype=2 datetype=5>
																上月
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
										<div class="widget-body">
											<div class="widget-main">
												<div id="store-union-pie-chart" style="width: 100%;height:210px;">
												</div>
												<div class="hr hr8 hr-double">
												</div>
												<div class="clearfix">
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-building fa-2x blue">
															</i>
															门店
															<br>
															<i class="ace-icon fa fa-spinner fa-spin blue store-num">
															</i>
														</span>
													</div>
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-cny fa-2x purple">
															</i>
															营业额
															<br>
															<i class="ace-icon fa fa-spinner fa-spin purple op-income">
															</i>
														</span>
													</div>
													<div class="grid3 center">
														<span class="grey">
															<i class="ace-icon fa fa-cny fa-2x red">
															</i>
															净利润
															<br>
															<i class="ace-icon fa fa-spinner fa-spin red profits">
															</i>
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							</c:if>
							<div class="row">
								<c:if test="${hasWarehousePermission == true || hasSupplierPermission==true}">
								<div id="supplier-todo" class="col-sm-12">
									<div class="widget-box transparent" id="recent-box">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">
												<i class="ace-icon fa fa-pencil-square-o blue">
												</i>
												待办
											</h4>
											<br>
											<div class="widget-toolbar no-border">
												<ul class="nav nav-tabs" id="recent-tab">
													<c:if test="${hasWarehousePermission == true}">
														<li class="">
															<a data-toggle="tab" href="#withoutwarehouse-tab">
																<small>未设仓库</small>
																<span id="withoutwarehouse-totalrows" class="badge badge-important">
																	...
																</span>
															</a>
														</li>
													</c:if>
													<c:if test="${hasWarehousePermission == true}">
														<li>
															<a data-toggle="tab" href="#withoutdeliverrule-tab">
																<small>未配订货规则</small>
																<span id="withoutdeliverrule-totalrows" class="badge badge-important">
																	...
																</span>
															</a>
														</li>
													</c:if>
													<c:if test="${hasWarehousePermission == true}">
														<li>
															<a data-toggle="tab" href="#unhandled-store-purchase-tab">
																<small>待处理订货单</small>
																<span id="unhandled-store-purchase-totalrows" class="badge badge-important">
																	...
																</span>
															</a>
														</li>
													</c:if>
													<c:if test="${hasReturnApprovePermission == true}">
														<li>
															<a data-toggle="tab" href="#unhandled-return-approve-tab">
																<small>待审核退货单</small>
																<span id="unhandled-return-approve-totalrows" class="badge badge-important">
																	...
																</span>
															</a>
														</li>
													</c:if>
													<c:if test="${hasReturnApprovePermission == true}">
														<li>
															<a data-toggle="tab" href="#need-diff-reason-return-approve-tab">
																<small>退货入库差异</small>
																<span id="need-diff-reason-return-approve-totalrows" class="badge badge-important">
																	...
																</span>
															</a>
														</li>
													</c:if>
                                                    <c:if test="${hasStorePermission == true}">
                                                        <li>
                                                            <a data-toggle="tab" href="#timeout-files-tab">
                                                                <small>临期文件</small>
                                                                <span id="timeout-files-totalrows" class="badge badge-important">
                                                                    ...
                                                                </span>
                                                            </a>
                                                        </li>
                                                    </c:if>
												</ul>
											</div>
										</div>
										<div class="widget-body">
											<div class="widget-main padding-4">
												<div class="tab-content padding-8">
													<c:if test="${hasWarehousePermission == true}">
													<div id="withoutwarehouse-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-lg" style="position: relative;">
															<table id="withoutwarehouse-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			门店所在城市
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_127').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													</c:if>
													<c:if test="${hasWarehousePermission == true}">
													<div id="withoutdeliverrule-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="withoutdeliverrule-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			门店所在城市
																		</th>
																		<th class="center">
																			服务仓库
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_26').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													</c:if>
													<c:if test="${hasWarehousePermission == true || hasSupplierPermission == true}">
													<div id="unhandled-store-purchase-tab" class="tab-pane">
														<c:if test="${hasWarehousePermission == true}">
														<div id="unhandled-store-purchase-for-warehouse">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="unhandled-store-purchase-for-warehouse-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			配送日期
																		</th>
																		<th class="center">
																			订货单号
																		</th>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			所在城市
																		</th>
																		<th class="center">
																			发货仓库
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_23').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														</div>
														</c:if>
														<c:if test="${hasSupplierPermission == true}">
														<div id="unhandled-store-purchase-for-supplier">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="unhandled-store-purchase-for-supplier-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			配送日期
																		</th>
																		<th class="center">
																			订货单号
																		</th>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			所在城市
																		</th>
																		<th class="center">
																			供应商
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_24').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														</div>
														</c:if>
														<div class="hr hr-double hr8">
														</div>
													</div>
													</c:if>
													<c:if test="${hasReturnApprovePermission == true}">
													<div id="unhandled-return-approve-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="unhandled-return-approve-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			提报日期
																		</th>
																		<th class="center">
																			退货单号
																		</th>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			所在城市
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_342').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													</c:if>
													<c:if test="${hasReturnApprovePermission == true}">
													<div id="need-diff-reason-return-approve-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="need-diff-reason-return-approve-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			门店
																		</th>
																		<th class="center">
																			门店城市
																		</th>
																		<th class="center">
																			入库仓库
																		</th>
																		<th class="center">
																			退货单号
																		</th>
																		<th class="center">
																			入库单号
																		</th>
																		<th class="center">
																			差异原因
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_342').click();parent.$('#menu_22').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													</c:if>
                                                    <c:if test="${hasStorePermission == true}">
                                                    <div id="timeout-files-tab" class="tab-pane">
                                                        <div class="ace-scroll ace-scroll-sm" style="position: relative;">
                                                            <table id="timeout-files-table" class="table  table-bordered table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="center">
                                                                            门店编码
                                                                        </th>
                                                                        <th class="center">
                                                                            门店名称
                                                                        </th>
                                                                        <th class="center">
                                                                            所在城市
                                                                        </th>
                                                                        <th class="center">
                                                                            到期证件
                                                                        </th>
                                                                        <th class="center">
                                                                            到期日期
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="hr hr8"></div><div class="left">
                                                            <span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_102').click();parent.$('#menu_102').parent().addClass('active');">前往设置</span>
                                                        </div>
                                                        <div class="hr hr-double hr8">
                                                        </div>
                                                    </div>
                                                    </c:if>
												</div>
											</div>
										</div>
									</div>
								</div>
								</c:if>
								<c:if test="${hasStorePermission == true}">
								<div id="store-todo" class="col-sm-12">
									<div class="widget-box transparent" id="recent-box">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">
												<i class="ace-icon fa fa-pencil-square-o blue">
												</i>
												待办
											</h4>
											<br>
											<div class="widget-toolbar no-border">
												<ul class="nav nav-tabs" id="recent-tab">
													<li class="zs-auth" permission="/restaurant/list">
														<a data-toggle="tab" href="#restaurant-not-matched-store-tab">
															<small>未设置网店关联门店</small>
															<span id="restaurant-not-matched-store-totalrows" class="badge badge-important">
																...
															</span>
														</a>
													</li>
													<li>
														<a data-toggle="tab" href="#store-not-inventory-tab">
															<small>未盘点门店(自营)</small>
															<span id="store-not-inventory-totalrows" class="badge badge-important">
																...
															</span>
														</a>
													</li>
													<li>
														<a data-toggle="tab" href="#store-not-reported-tab">
															<small>未提报费用门店(自营)</small>
															<span id="store-not-reported-totalrows" class="badge badge-important">
																...
															</span>
														</a>
													</li>
												</ul>
											</div>
										</div>
										<div class="widget-body">
											<div class="widget-main padding-4">
												<div class="tab-content padding-8">
													<div id="restaurant-not-matched-store-tab" class="tab-pane zs-auth" permission="/restaurant/list">
														<div class="ace-scroll ace-scroll-lg" style="position: relative;">
															<table id="restaurant-not-matched-store-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			餐厅ID
																		</th>
																		<th class="center">
																			餐厅名称
																		</th>
																		<th class="center">
																			营业时间
																		</th>
																		<th class="center">
																			餐厅地址
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_201').click();parent.$('#menu_14').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													<div id="store-not-inventory-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="store-not-inventory-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			所在城市
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_21').click();parent.$('#menu_18').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
													
													<div id="store-not-reported-tab" class="tab-pane">
														<div class="ace-scroll ace-scroll-sm" style="position: relative;">
															<table id="store-not-reported-table" class="table  table-bordered table-hover">
																<thead>
																	<tr>
																		<th class="center">
																			门店编码
																		</th>
																		<th class="center">
																			门店名称
																		</th>
																		<th class="center">
																			门店类型
																		</th>
																		<th class="center">
																			所在城市
																		</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
														<div class="hr hr8"></div><div class="left">
															<span class="label label-xlg label-primary arrowed-right" style="cursor: pointer;" onclick="parent.$('#menu_353').click();parent.$('#menu_18').parent().addClass('active');">前往设置</span>
														</div>
														<div class="hr hr-double hr8">
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								</c:if>
								<!-- /.col -->
							</div>

						</div>
					</div>
				</div>
			</div>
			<script type="text/javascript" src="${ctx}/static/scripts/echarts.common.min.js">
			</script>
			<script type="text/javascript">
			var storeType = ['自营','联营','商超'];
			function genTr() {
				var tr = '<tr>';
				$(genTr.arguments).each(function() {
					tr+='<td class="center">' + this + '</td>';
				});
				tr += '</tr>';
				return tr;
			}

				function getWithoutWarehouseData() {
					$.get('/supplier/warehouse/withoutWarehouse', {}, function(data) {
       					if (data) {
								var totalRows = data.totalRows;
								$('#withoutwarehouse-totalrows').html(totalRows);
								$(data.data).each(function() {
									$('#withoutwarehouse-table').find('tbody').append(genTr(this.storeCode,this.storeName, storeType[this.storeType-1], this.cityName));
								});
								$('#withoutwarehouse-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getWithoutDeliverRuleData() {
					$.get('/store/deliveryRule/withoutDeliverRule', {}, function(data) {
       					if (data) {
								var totalRows = data.totalRows;
								$('#withoutdeliverrule-totalrows').html(totalRows);
								$(data.data).each(function() {
									$('#withoutdeliverrule-table').find('tbody').append(genTr(this.storeCode,this.storeName,storeType[this.storeType-1],this.cityName,this.warehouseName));
								});
								$('#withoutdeliverrule-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getUnHandledStorePurchaseForWarehouseData() {
					$.get('/warehouse/delivery/unHandledStorePurchase', {}, function(data) {
							if (data) {
								var totalRows = parseInt($('#unhandled-store-purchase-totalrows').html());
								if (isNaN(totalRows)) {
									$('#unhandled-store-purchase-totalrows').html(data.totalRows);
								}
								else {
									$('#unhandled-store-purchase-totalrows').html(data.totalRows + totalRows);
								}
								if (data.data.length == 0) {
									$('#unhandled-store-purchase-for-warehouse').remove();
									return;
								}
								$(data.data).each(function() {
									$('#unhandled-store-purchase-for-warehouse-table').find('tbody').append(genTr($.dateFormat(this.expectReceiveDate,'yyyy-MM-dd'),this.id,this.storeCode,this.storeName,storeType[this.storeType - 1], this.cityName,this.supplierName));
								});
								$('#unhandled-store-purchase-for-warehouse-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getUnHandledStorePurchaseForSupplierData() {
					$.get('/supplier/delivery/unHandledStorePurchase', {}, function(data) {
							if (data) {
								var totalRows = parseInt($('#unhandled-store-purchase-totalrows').html());
								if (isNaN(totalRows)) {
									$('#unhandled-store-purchase-totalrows').html(data.totalRows);
								}
								else {
									$('#unhandled-store-purchase-totalrows').html(data.totalRows + totalRows);
								}
								if (data.data.length == 0) {
									$('#unhandled-store-purchase-for-supplier').remove();
									return;
								}
								$(data.data).each(function() {
									$('#unhandled-store-purchase-for-supplier-table').find('tbody').append(genTr($.dateFormat(this.expectReceiveDate,'yyyy-MM-dd'),this.id,this.storeCode,this.storeName,storeType[this.storeType - 1], this.cityName,this.supplierName));
								});
								$('#unhandled-store-purchase-for-supplier-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getReturnApproveData() {
					$.get('/returnApprove/getApproveList', {status:10,start:0,pageSize:20}, function(data) {
							if (data) {
								$('#unhandled-return-approve-totalrows').html(data.totalRows);
								$(data.data).each(function() {
									$('#unhandled-return-approve-table').find('tbody').append(genTr($.dateFormat(this.createTime,'yyyy-MM-dd'),this.id,this.storeCode,this.storeName,storeType[this.storeType-1],this.cityName));
								});
								$('#unhandled-return-approve-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				
				function getNeedDiffReasonReturnApproveList() {
					$.get('/returnApprove/getNeedDiffReasonList', {}, function(data) {
							if (data) {
								$('#need-diff-reason-return-approve-totalrows').html(data.totalRows);
								$(data.data).each(function() {
									var needDiffReasonStr = "";
									if ((this.needDiffReason & 1) == 1) {
										needDiffReasonStr += "数量不符<br>";
									}
									if ((this.needDiffReason & 2) == 2) {
										needDiffReasonStr += "生产日期不符";
									}
									$('#need-diff-reason-return-approve-table').find('tbody').append(genTr(this.storeCode + "-" + this.storeName,this.cityName,this.providerName,this.id,this.returnInId,needDiffReasonStr));
								});
								$('#need-diff-reason-return-approve-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getRestaurantNotMatchedStoreData() {
					$.post('/restaurant/list', {isStoreMatched:0,start:0,pageSize:20,isValid:1}, function(data) {
							if (data) {
								$('#restaurant-not-matched-store-totalrows').html(data.totalRows);
								$(data.data).each(function() {
									var servingTime = "";
			                        if (this.naposRestaurant && this.naposRestaurant.servingTime) {
			                            $(this.naposRestaurant.servingTime).each(function() {
			                                servingTime=servingTime+this+'<br>';
			                            });
			                        }
			                        var address = "";
			                        if (this.naposRestaurant && this.naposRestaurant.address) {
			                        	address = this.naposRestaurant.address;
			                        }
									$('#restaurant-not-matched-store-table').find('tbody').append(genTr(this.elemeRestaurantId,this.name,servingTime,address));
								});
								$('#restaurant-not-matched-store-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}
				function getStoreNotInventoryData() {
					$.get('/store/inventory/storeNotInventory', {}, function(data) {
							if (data.result) {
								$('#store-not-inventory-totalrows').html(data.result.totalRows);
								$(data.result.data).each(function() {
									$('#store-not-inventory-table').find('tbody').append(genTr(this.storeCode,this.storeName,storeType[this.storeType-1],this.cityName));
								});	
								var remind = '<span class="label block label-white middle"><i class="ace-icon fa fa-exclamation-triangle bigger-120">当前显示的是'+data.inventoryDay+'未盘点门店列表</i></span>';
								$('#store-not-inventory-table').parents('.ace-scroll').after(remind);
								$('#store-not-inventory-table').parents('.ace-scroll').ace_scroll({
									size: 150
								});
							}
    				}, 'json');
				}

                function getTimeoutFilesData() {
                    $.get('/store/alert/timeoutFile', {}, function(data) {
                            if (data) {
                                $('#timeout-files-totalrows').html(data.totalRows);
                                $(data.data).each(function() {
                                	var endDate = '';
                                	if(this.timeOut) {
                                		endDate = "<font color='red'>" + this.endDate + "</font>";
                                	}else {
                                		endDate = this.endDate;
                                	}
                                    $('#timeout-files-table').find('tbody').append(genTr(this.storeCode,this.storeName,this.cityName,this.type, endDate));
                                });
                                var remind = '<span class="label block label-white middle"><i class="ace-icon fa fa-exclamation-triangle bigger-120">当前显示的是临期文件列表</i></span>';
                                $('#timeout-files-table').parents('.ace-scroll').after(remind);
                                $('#timeout-files-table').parents('.ace-scroll').ace_scroll({
                                    size: 150
                                });
                            }
                    }, 'json');
                }
                function getStoreNotReportedData() {
                    $.get('/store/dailyExpense/storesNotReported', {}, function(data) {
                            if (data.result) {
                                $('#store-not-reported-totalrows').html(data.result.totalRows);
                                $(data.result.data).each(function() {
                                    $('#store-not-reported-table').find('tbody').append(genTr(this.storeCode,this.storeName,storeType[this.storeType-1],this.cityName));
                                });
                                var remind = '<span class="label block label-white middle"><i class="ace-icon fa fa-exclamation-triangle bigger-120">当前显示的是'+data.recordDay+'未提报费用门店列表</i></span>';
                                $('#store-not-reported-table').parents('.ace-scroll').after(remind);
                                $('#store-not-reported-table').parents('.ace-scroll').ace_scroll({
                                    size: 150
                                });
                            }
                    }, 'json');
                }
				function getStoreProfitsData(storeType, dateType) {
					$.get('/report/storeProfits/sum', {storeType: storeType,dateType: dateType}, function(data) {
							if (data) {
								var pie_id = storeType == 1 ? "store-self-pie-chart": "store-union-pie-chart";
								$('#' + pie_id).parent().find('.store-num').html('<small>' + data.storeCount + '家</small>');
								$('#' + pie_id).parent().find('.store-num').removeClass('fa-spinner fa-spin');
								$('#' + pie_id).parent().find('.op-income').html('<small>' + data.operatingIncome + '¥</small>');
								$('#' + pie_id).parent().find('.op-income').removeClass('fa-spinner fa-spin');
								$('#' + pie_id).parent().find('.profits').html('<small>' + data.profits + '¥</small>');
								$('#' + pie_id).parent().find('.profits').removeClass('fa-spinner fa-spin');
								drawPieChart(pie_id, data);
							}
    				}, 'json');
				}
				$(document).ready(function() {
					$.authenticate(function() {
						$('.zs-auth').remove();
        				$('#supplier-todo').find('li:first').addClass('active');
						$('#supplier-todo').find('.tab-pane:first').addClass('active');
						$('#store-todo').find('li:first').addClass('active');
						$('#store-todo').find('.tab-pane:first').addClass('active');
    				});
					
					<c:if test="${hasStoreProfitsPermission == true}">
					getStoreProfitsData(1, 1);
					getStoreProfitsData(2, 1);
					</c:if>
					<c:if test="${hasWarehousePermission == true}">
					getWithoutWarehouseData();
					getWithoutDeliverRuleData();
					</c:if>
					<c:if test="${hasWarehousePermission == true}">
					getUnHandledStorePurchaseForWarehouseData();
					</c:if>
					<c:if test="${hasSupplierPermission == true}">
					getUnHandledStorePurchaseForSupplierData();
					</c:if>
					<c:if test="${hasReturnApprovePermission == true}">
					getReturnApproveData();
					getNeedDiffReasonReturnApproveList();
					</c:if>
					<c:if test="${hasStorePermission == true}">
					getRestaurantNotMatchedStoreData();
					getStoreNotInventoryData();
					getStoreNotReportedData();
					getTimeoutFilesData();
					</c:if>
				});
				// 基于准备好的dom，初始化echarts实例
				function drawPieChart(id, data) {
					var myChart = echarts.init(document.getElementById(id));

					// 指定图表的配置项和数据
					var option = {
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							right: 'right',
							top: 'middle',
							data: ['净利润', '营销费用', '总产品成本', '损耗', '差异', '电费', '水费', '营运用品', '租金', '其它固定费用', '薪资'],
							formatter: function (name) {
							   if (name == '净利润') {
							   		return name + ":\n" + data.profits;
							   }
							   else if (name == '营销费用') {
							   		return name + ":\n" + data.marketingExpenses;
							   }
							   else if (name == '总产品成本') {
							   		return name + ":\n" + data.costOfGoods;
							   }
							   else if (name == '损耗') {
							   		return name + ":\n" + data.consumptionAmount;
							   }
							   else if (name == '差异') {
							   		return name + ":\n" + data.diffFee;
							   }
							   else if (name == '电费') {
							   		return name + ":\n" + data.powerFee;
							   }
							   else if (name == '水费') {
							   		return name + ":\n" + data.waterFee;
							   }
							   else if (name == '营运用品') {
							   		return name + ":\n" + data.operatingSuppliesAmount;
							   }
							   else if (name == '租金') {
							   		return name + ":\n" + data.rental;
							   }
							   else if (name == '其它固定费用') {
							   		return name + ":\n" + data.otherFixedCosts;
							   }
							   else {
							   		return name + ":\n" + data.salary;
							   }
							}
						},
						series: [{
							name: '数据',
							type: 'pie',
							radius: '55%',
							center: ['30%', '60%'],
							data: [{
								value: data.profits > 0 ? data.profits : 0,
								name: '净利润',
								itemStyle: {
				                    normal: {
				                        color: "#892E65"
				                        }
				                    }
							},
							{
								value: data.marketingExpenses > 0 ? data.marketingExpenses : 0,
								name: "营销费用",
								itemStyle: {
				                    normal: {
				                        color: "#BB4444"
				                        }
				                    }
							},
							{
								value: data.costOfGoods > 0 ? data.costOfGoods : 0,
								name: "总产品成本",
								itemStyle: {
				                    normal: {
				                        color: "#808080"
				                        }
				                    }
							},
							{
								value: data.consumptionAmount > 0 ? data.consumptionAmount : 0,
								name: "损耗",
								itemStyle: {
				                    normal: {
				                        color: "#FF6600"
				                        }
				                    }
							},
							{
								value: data.diffFee > 0 ? data.diffFee : 0,
								name: "差异",
								itemStyle: {
				                    normal: {
				                        color: "#FFCC00"
				                        }
				                    }
							},
							{
								value: data.powerFee > 0 ? data.powerFee : 0,
								name: "电费",
								itemStyle: {
				                    normal: {
				                        color: "#DFF0D8"
				                        }
				                    }
							},
							{
								value: data.waterFee > 0 ? data.waterFee : 0,
								name: "水费",
								itemStyle: {
				                    normal: {
				                        color: "#00FFFF"
				                        }
				                    }
							},
							{
								value: data.operatingSuppliesAmount > 0 ? data.operatingSuppliesAmount : 0,
								name: "营运用品",
								itemStyle: {
				                    normal: {
				                        color: "#0066FF"
				                        }
				                    }
							},
							{
								value: data.rental > 0 ? data.rental : 0,
								name: "租金",
								itemStyle: {
				                    normal: {
				                        color: "#9900FF"
				                        }
				                    }
							},
							{
								value: data.otherFixedCosts > 0 ? data.otherFixedCosts : 0,
								name: "其它固定费用",
								itemStyle: {
				                    normal: {
				                        color: "#CFB2A9"
				                        }
				                    }
							},
							{
								value: data.salary > 0 ? data.salary : 0,
								name: "薪资",
								itemStyle: {
				                    normal: {
				                        color: "#005F3C"
				                        }
				                    }
							}],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}]
					};
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
					$(window).resize(function(){
                		myChart.resize();    
             		});  
				}
			</script>
			<script type="text/javascript">
				/* 扩展窗口外部方法 */
				parent.$.dialog.notice = function(options) {
					var opts = options || {},
					api, aConfig, hide, wrap, top, duration = opts.duration || 500;

					var config = {
						id: opts.id,
						left: '100%',
						top: '100%',
						fixed: true,
						drag: false,
						resize: false,
						init: function(here) {
							api = this;
							aConfig = api.config;
							wrap = api.DOM.wrap;
							top = parseInt(wrap[0].style.top);
							hide = top + wrap[0].offsetHeight;

							wrap.css('top', hide + 'px').animate({
								top: top + 'px'
							},
							duration,
							function() {
								opts.init && opts.init.call(api, here);
							});
						},
						close: function(here) {
							wrap.animate({
								top: hide + 'px'
							},
							duration,
							function() {
								opts.close && opts.close.call(this, here);
								aConfig.close = $.noop;
								api.close();
							});

							return false;
						}
					};

					for (var i in opts) {
						if (config[i] === undefined) config[i] = opts[i];
					}

					return parent.$.dialog(config);
				};

				var url = '/common/getNotice?nd=' + Math.random();

				$.get(url,
				function(result) {
					var content = "";
					if (result && result.length > 0) {
						$.each(result,
						function() {
							if (this.configValue && this.configValue != '空' && this.configValue != '无' && this.configValue != 'null') {
								content+=this.configValue;
								};
							}
						);
					}
					if (content == '') {
						content = '欢迎登陆馔山餐饮系统！^_^';
					}
					$('#notice-content').append(content);
				});
				$(".js-status-update a").click(function() {
					var selText = $(this).text();
					var dateType = $(this).attr('datetype');
					var storeType = $(this).attr('storetype');
					var $this = $(this);
					$this.parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
					$this.parents('.dropdown-menu').find('li').removeClass('active');
					$this.parent().addClass('active');
					var pie_id = storeType == 1 ? "store-self-pie-chart": "store-union-pie-chart";
					$('#' + pie_id).parent().find('.store-num').html('');
					$('#' + pie_id).parent().find('.store-num').addClass('fa-spinner fa-spin');
					$('#' + pie_id).parent().find('.op-income').html('');
					$('#' + pie_id).parent().find('.op-income').addClass('fa-spinner fa-spin');
					$('#' + pie_id).parent().find('.profits').html('');
					$('#' + pie_id).parent().find('.profits').addClass('fa-spinner fa-spin');
					getStoreProfitsData(storeType, dateType);
				});
			</script>
