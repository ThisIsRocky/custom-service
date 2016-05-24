用法：
 在需要验证的地方加入属性：
 tip="提示信息" 
 isNull="1" 
 checkType=integer
例子：
 <INPUT id=text1 size=30 tip="提示信息" isNull="1" checkType=integer>
属性说明：
 tip:提示信息
 isNull：1允许录入空,2不能为空
 checkType：验证类型，具体如下
            1. chinese 中文
            2. integer 整型
            3. id      身份证
            4. userID  英文,数字,下划线的帐号
            5. money   金额,保留两位小数
            6. float   小数
            7. mail    邮件
            8. poss    邮编
            9. phone   移动电话
            10.URL     url
            11.empty   非空
            12.tell    固定电话
            13.tellOrPhone 固定电话或手机，可输入数字  "-"  "," 

使用时需要在页面中加入：
<script>
	$(function(){
		formValidate();
	});
</script>

//加入新的方法
validat();
实时验证页面输入信息
--未完待续(验证类型的添加)