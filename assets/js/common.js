var config = {
	//action
	action: {
		//http://61.160.248.69:666/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YINGYONGZHONGXIN_FENLEI&top=3
		//http://interface.18.net
		banRecommend: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_PAIHANGBANG4",
		banGame: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_REMEN2",
		banApp: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YINGYONGZHONGXIN_TUIJIAN",
		banGameClass: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_FENLEI3",
		//ban
		
		list: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=",
		
		//列表的列表
		listList: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=",
		
		//推荐游戏应用
		//listRecommendGame: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=ANGOUGOUV3_YOUHUZHONGXIN_REMEN2",
		listRecommendGame: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=ANGOUGOUV3_YOUHUZHONGXIN_PAIHANGBANG4",
		listRecommendApp: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=ANGOUGOUV3_YINGYONGZHONGXIN_TUIJIAN",
		
		//游戏 应用 列表
		listGame: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=ANGOUGOUV3_YOUHUZHONGXIN_REMEN2",
		listApp: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=6&pageSize=10&classCode=ANGOUGOUV3_YINGYONGZHONGXIN_ZHUANGJIBIBEI",
		
		//搜索列表
		listSearch: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=11&pageSize=10&kw=",
		searchRecommend: "http://interface.18.net/Mobile/Agg/V3000/list.aspx?m=12&siteid=1",

		//分类
		classGame: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=33&classCode=ANGOUGOUV3_YOUHUZHONGXIN_FENLEI3",
		classApp: "",
		
		//详情
		apk: "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=10&param="
	}, 
	defaultImg: {
		banImg: "assets/img/banner.png",
		apkImg: "assets/img/page-img.png",
		padeImg: ""
	}
};


//android页面跳转
function turnPage(str, type) {
	
	var id = "";
	if(type === "back") {
		var parse = new queryParse();
		id = parse.id;

		switch (id) {
		case "recomGameList":
			str = "index.html";
			break;
		case "recommendSlider":
			str = "index.html";
			break;
		case "gameList":
			str = "game.html";
			break;
		case "pageListList":
			str = "game.html";
			break;
		case "gameSlider":
			str = "game.html";
			break;
		case "appSlider":
			str = "app.html";
			break;
		case "appList":
			str = "app.html";
			break;
		case "searchList":
			str = "search.html";
			break;
		default:
			str = "index.html";
		}
	}

	var l = window.location.href.split("/");
	l.pop();
	var url = l.join("/") + "/" + str;
	
	if(type == "back") {
		try {
			roid.goBack();
		} catch (e) {
			window.open(l.join("/") + "/index.html", "_self");
		}
		
	} else {
		window.open(url, "_self");		
	}
}


//查找url参数
function queryParse() {
	var arr = window.location.search.slice(1).split("&");
	var arr2 = [];
	for(var i = 0, len = arr.length; i < len; i++) {
		arr2 = arr[i].split("=");
		this[arr2[0]] = arr2[1];
	}
	//return self;
}



//indslider	
function imgLoad(obj, src) {
	if(!src) return false;
	var img = new Image();
	img.src = src;
	img.onload = function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var windowRatio = Math.round(w / h * 10000);

		var imgw = img.width;
		var imgh = img.height;
		var imgratio = Math.round(imgw / imgh * 10000);
		
		obj.attr("src", src).css({"opacity": 1}).addClass("curr");
		
		img = null;
	}
	img.onerror = function() {
		//console.log(img);
		obj.attr("src", "assets/img/banner.png").css({"opacity": 1}).addClass("curr");
	}
}



//localStorage



//slider横屏旋转 bug
/*
function orientationChange() {
	setTimeout(function() {
		$("#indSlider").height($("#indSlider img").height());
	}, 100);
};
*/

function showSlider(actionUrl, id) {
	var object = "#" + id;

	//var sliderArr = '<div class="swiper-slide img00"><a href="javascript:;"><img class="cur"  src="assets/img/slide01.jpg" width="100%" height=""></a></div><div class="swiper-slide img01"><a href="javascript:;"><img src="assets/img/sliderTemp.gif" ssrc="assets/img/slide03.jpg" width="100%"></a></div><div class="swiper-slide img02"><a href="javascript:;"><img src="assets/img/sliderTemp.gif" ssrc="assets/img/slide02.jpg" width="100%"></a></div><div class="swiper-slide img03"><a href="javascript:;"><img src="assets/img/sliderTemp.gif" ssrc="assets/img/slide02.jpg" width="100%"></a></div>';

	var swiperFun = function(object) {
		window.mySwiper = new Swiper(object,{
			//pagination: ".pagination",
			//loop:true,
			paginationClickable: true,
			autoplay: 20000,
			resizeReInit: true,
			calculateHeight: true,
			autoplayDisableOnInteraction: false,
			//mousewheelControl: true,
			onlyExternal: true,//移动
			grabCursor: false, //手势
			onFirstInit: function(swiper) {
				$(object).parent().removeClass("cur");
				var ind = swiper.activeLoopIndex * 1;
				var imgs = $(object + " .swiper-slide.img0" + ind).find("img");
				if(!imgs.eq(0).hasClass("curr")) {
					var src = imgs.attr("ssrc");
					imgLoad(imgs, src);
				}
			},
			onTouchMove: function(swiper) {
				var ind = swiper.activeLoopIndex;
			},
			onSlideChangeEnd: function(swiper) {
				var ind = swiper.activeLoopIndex * 1;
				var imgs = $(object + " .swiper-slide.img0" + ind).find("img");
				if(!imgs.eq(0).hasClass("curr")) {
					var src = imgs.attr("ssrc");
					imgLoad(imgs, src);
				}
			}
		});
		
		$('.arrow-left').on('click', function(e){
			e.preventDefault()
			mySwiper.swipePrev()
		})
		$('.arrow-right').on('click', function(e){
			e.preventDefault()
			mySwiper.swipeNext()
		})
		
		/*
		orientationChange();
		window.onorientationchange = orientationChange;
		*/	
	}
	

	///
	if(window.localStorage && window.localStorage.getItem(actionUrl)) {
		var str = "";
		//var data = data.n;
		var data = window.localStorage.getItem(actionUrl);
		data = JSON.parse(data);
		var obj = data.obj;

		if(!obj.length || obj == "[]") {
			$(object).html("");
			return false;
		}
		
		for(var i = 0, len = obj.length; i < len; i++) {
			var icon = obj[i].advertImgUrl;
			var packName = obj[i].packName;
			str += '<div class="swiper-slide img0'+i+'"><a href="javascript:turnPage(\'page.html?packName='+packName+'&id='+id+'\')"><img class="cur" src="assets/img/sliderTemp.gif" ssrc="'+icon+'" width="100%" height=""></a></div>';
		}
		if(obj.length === 1) {
			$(object+ " .swiper-wrapper").html(str);
		} else {
			$(object+ " .swiper-wrapper").html(str);
		}
		swiperFun(object);


		var date = window.localStorage.getItem(actionUrl + "date");
		var nowDate = (new Date()).getTime();
		var second = Math.floor((nowDate - date) / 1000);
		if(second < 3600) {
			return false;
		}
		
	}
	
	
	$.ajax({
		url: actionUrl + "&top=3&jsoncallback=?",
		type: "POST",
		dateType: "json",
		timeout: 20000,
		cache: false,
		error: function(){
			$("#" + id).html('<div class="tac" style="padding:30px 0;"><a href="javascript:window.location.reload();">请求超时！点击重新加载</a></div>');
		},
		success:function(data){
			
			//
			if(window.localStorage) {
				window.localStorage.setItem(actionUrl, JSON.stringify(data.n));
				window.localStorage.setItem(actionUrl + "date", (new Date()).getTime());
			}


			var str = "";
			var data = data.n;
			var obj = data.obj;

			if(!obj.length || obj == "[]") {
				$(object).html("");
				return false;
			}
			
			for(var i = 0, len = obj.length; i < len; i++) {
				var icon = obj[i].advertImgUrl;
				var packName = obj[i].packName;
				str += '<div class="swiper-slide img0'+i+'"><a href="javascript:turnPage(\'page.html?packName='+packName+'&id='+id+'\')"><img class="cur" src="assets/img/sliderTemp.gif" ssrc="'+icon+'" width="100%" height=""></a></div>';
			}
			if(obj.length === 1) {
				$(object+ " .swiper-wrapper").html(str);
			} else {
				$(object+ " .swiper-wrapper").html(str);
			}
			swiperFun(object);
		}
	});

}













var apkList = [
	{
		"apkname": "Gold Miner",
		"packname": "com.senspark.goldminerclassic.par",
		"icon": "http://ftpagg.18.net/g5/GoldMiner.png",
		"filepath": "http://ftpagg.18.net/20103_2211201002_%E8%80%81%E9%98%BF%E4%BC%AF%E7%9F%BF%E5%B7%A5com.senspark.goldminerclassic.par.apk",
		"filesize": "10.6",
		"versioncode": "5",
		"versionname": "1.0.4"
	},{
		"apkname": "Speed Moto",
		"packname": "Game.SpeedMoto",
		"icon": "http://ftpagg.18.net/g5/SpeedMoto.png",
		"filepath": "http://ftpagg.18.net/20105_2211201002%20%E6%9E%81%E9%80%9F%E6%91%A9%E6%89%98Game.SpeedMoto.apk",
		"filesize": "4.91",
		"versioncode": "6",
		"versionname": "1.0.4"
	},{
		"apkname": "Pinball Pro",
		"packname": "com.PinballGame",
		"icon": "http://ftpagg.18.net/g5/PinballPro.png",
		"filepath": "http://ftpagg.18.net/20107_2211201002_%E4%B8%89%E7%BB%B4%E5%BC%B9%E7%90%83com.PinballGame.apk",
		"filesize": "4.98",
		"versioncode": "3",
		"versionname": "1.3"
	},{
		"apkname": "LostTempleII",
		"packname": "com.com.usdfhgd.freegame.newgood.as",
		"icon": "http://ftpagg.18.net/g5/LostTempleII.png",
		"filepath": "http://ftpagg.18.net/20601_2211201002%20%E5%A4%B1%E8%90%BD%E7%9A%84%E7%A5%9E%E5%BA%99com.com.usdfhgd.freegame.newgood.as.apk",
		"filesize": "23.7",
		"versioncode": "1",
		"versionname": "1"
	},{
		"apkname": "SpeedCar",
		"packname": "Game.NDK",
		"icon": "http://ftpagg.18.net/g5/SpeedCar.png",
		"filepath": "http://ftpagg.18.net/SpeedCar.apk",
		"filesize": "4.39",
		"versioncode": "16",
		"versionname": "1.1.5"
	}
];


function getStateTxt(getState) {
	/*
	下载 Download
	升级 Upgrade
	等待 Wait
	暂停 Pause
	继续 Continue
	安装 Install
	取消 Cancel
	打开 Launch
	*/
	var stateClass = "";
	var stateTxt = "";
	if(getState == "none") {
		stateClass = "download nor";
		stateTxt = "下载";
	} else if("updateable" == getState) { //升级
		stateClass = "download upgrade";
		stateTxt = "升级";
	} else if("inDownloadQueue" == getState) {//等待
		stateClass = "download wait";
		stateTxt = "等待";
	} else if("downloading" == getState) { //暂停
		stateClass = "download downing";
		stateTxt = "暂停";
	} else if("paused" == getState) { //继续
		stateClass = "download continue";
		stateTxt = "继续";
	} else if("downloadCompleted" == getState) {// 已下载完毕但尚未安装
		stateClass = "download install";
		stateTxt = "安装";
	} else if("corrupted" == getState) {//文件下载不完全，无法解析
		stateClass = "download cancel";
		stateTxt = "取消";
	} else if("installing" == getState) { //界面上需要知道这个apk正在被安装当中
		stateClass = "download install";
		stateTxt = "安装";
	} else if("installed" == getState) { //这个apk已经被安装完毕
		stateClass = "download open";
		stateTxt = "打开";
	} else if("removed" == getState) { //已经卸载完毕 
		stateClass = "download cancel";
		stateTxt = "取消";
	} else if("apkDeleted" == getState) { //apk文件已经被删除完毕
		stateClass = "download nor";
	} else {
		stateClass = "download nor";
		stateTxt = "下载";
	}
	
	return {
		"stateClass": stateClass,
		"stateTxt": stateTxt
	}
}


//show listApp
function showList(id, action, currPage, callback) {
	$("#" + id).removeClass("hide");
	//最后一条数据
	if($("#" + id).hasClass("lastData")) {
		return false;
	}

	var object = "#"+id + " ul";
	var loading = "#"+id + " .loading";
	
	$(loading).removeClass("hide");
	
	/*
	//测试数据
	$(obj).append($("#indList_temp").html());
	//$(".loading").remove();
	scrollLoad();
	return false;
	//测试数据 end
	*/
	

	var str = "";
	
	//java参数
	//apkname, packname, icon, filepath, filesize, versioncode, versionname
	var apkid = "",
		apkname = "",
		packname = "",
		icon = "",
		filepath = "",
		filesize = "",
		versioncode = "",
		versionname = "",
		path = "",
		info = "",
		rank = "",
		icoStatus = "";
	
	var downBtnArr = "";
	
	var url = action + "&currPage="+currPage;
	//$("#gameMenu").html("");
	


	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	if(window.localStorage && window.localStorage.getItem(url)) {
		
		//var data = data.n;
		var data = window.localStorage.getItem(url);
		data = JSON.parse(data);
		var obj = data.obj;
		//
		if(!obj.length || obj == "[]") {
			$("#" + id).addClass("hide");
			//搜索为空时的提示
			if(id == "searchList") {
				$("#searchList").removeClass("hide").html('<div class="tac">抱歉！您的搜索不存在!</div>');
			}
			return false;
		}

		//
		if(!data.countPage) {
			$(object).html('<li class="tac">123</li>').parent().removeClass("hide");
			$(loading).removeClass("hide");
			return false;
		}
		for(var i = 0, len = obj.length; i < len; i++) {
			
			apkid = obj[i].apkid;
			apkname = obj[i].apkname;
			packname = obj[i].packname;
			icon = obj[i].icon;
			filepath = obj[i].filepath;
			filesize = obj[i].filesize;
			versioncode = obj[i].versioncode;
			versionname = obj[i].versionname;
			info = obj[i].brief;
			rank = obj[i].rank;
			icoStatus = obj[i].icoStatus;//0:"默认"; 1:"热门"; 2:"最新";
			//filepath = "http://apk.57.net:900/files/2012-08-18/cn.wps.moffice_i18n_hd.apk";
			
			downBtnArr += "#apk" + apkid + ",";

			var icoSatusStr = "";
			if(icoStatus == 0) {
				icoSatusStr = "";
			} else if(icoStatus == 1) {
				icoSatusStr = '<span class="icoSatus hot">热门</span>';
			} else if(icoStatus == 2) {
				icoSatusStr = '<span class="icoSatus new">最新</span>';
			} else if(icoStatus == 3) {
				icoSatusStr = '<span class="icoSatus recommend">推荐</span>';
			}

			/*
			下载 Download
			升级 Upgrade
			等待 Wait
			暂停 Pause
			继续 Continue
			安装 Install
			取消 Cancel
			打开 Launch
			*/
			var stateClass = "download nor";
			var stateTxt = "下载";
			
			
			//java获取状态
			try {
				var getState = roid.getState(packname, versioncode, versionname);
				//$("#gameMenu").append(getState + "<br/>");
			} catch (e) {
				var getState = "";
			}
			
			//
			var state = getStateTxt(getState);
			stateClass = state.stateClass;
			stateTxt = state.stateTxt;

			str += '<li><a href="javascript:turnPage(\'page.html?packname='+packname+'&id='+id+'\')" class="list_main"><div class="img">'+icoSatusStr+'<img src="assets/img/o_pixel.gif" xsrc="'+icon+'" alt=""/></div><p class="tit break">'+apkname+'<span class="score"></p><p class="size break"><span class="first">'+rank+'分</span><span class="last">'+filesize+'M</span></p><p class="info break">'+info+'</p></a><a href="javascript:downLoad(\'apk'+apkid+'\');" id="apk'+apkid+'" class="'+stateClass+'" data-apkname="'+apkname+'" data-packname="'+packname+'" data-icon="'+icon+'" data-filepath="'+filepath+'" data-filesize="'+filesize+'" data-versioncode="'+versioncode+'" data-versionname="'+versionname+'" >'+stateTxt+'</a></li>';

		}
		
		//
		if(currPage == 1) {
			$(object).html(str).removeClass("hide");
			$(window).scroll(function() {
				scrollBottom(id);
				scrollLoad({id: id});
			});
			scrollLoad({id: id});
		} else {
			$(object).append(str).removeClass("hide");
		}
		
		//
		if(data.currPage === data.countPage) {
			$("#" + id).addClass("lastData");
			$(loading).remove();//加载到最后一条了
		} else {
			$(loading).removeClass("hide");
		}

		if(callback) callback();

		//添加页码标识
		$("#" + id).attr("data-currpage", currPage).attr("data-action", action);
		

		var date = window.localStorage.getItem(url + "date");
		var nowDate = (new Date()).getTime();
		var second = Math.floor((nowDate - date) / 1000);
		if(second < 3600) {
			return false;
		}
	}
	//////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////



	$.ajax({
		url: url + "&jsoncallback=?",
		type: "POST",
		dateType: "json",
		timeout: 20000,
		cache: false,
		error: function(){
			$("#" + id).html('<div class="tac" style="padding:30px 0;"><a href="javascript:window.location.reload();">请求超时！点击重新加载</a></div>');
		},
		success:function(data){

			/////////////////////////////////
			if(window.localStorage) {
				window.localStorage.setItem(url, JSON.stringify(data.n));
				window.localStorage.setItem(url + "date", (new Date()).getTime());
			}


			var data = data.n;
			var obj = data.obj;
			//
			if(!obj.length || obj == "[]") {
				$("#" + id).addClass("hide");
				//搜索为空时的提示
				if(id == "searchList") {
					$("#searchList").removeClass("hide").html('<div class="tac">抱歉！您的搜索不存在!</div>');
				}
				return false;
			}

			//
			if(!data.countPage) {
				$(object).html('<li class="tac">123</li>').parent().removeClass("hide");
				$(loading).removeClass("hide");
				return false;
			}
			for(var i = 0, len = obj.length; i < len; i++) {
				
				apkid = obj[i].apkid;
				apkname = obj[i].apkname;
				packname = obj[i].packname;
				icon = obj[i].icon;
				filepath = obj[i].filepath;
				filesize = obj[i].filesize;
				versioncode = obj[i].versioncode;
				versionname = obj[i].versionname;
				info = obj[i].brief;
				rank = obj[i].rank;
				icoStatus = obj[i].icoStatus;//0:"默认"; 1:"热门"; 2:"最新";
				//filepath = "http://apk.57.net:900/files/2012-08-18/cn.wps.moffice_i18n_hd.apk";
				
				downBtnArr += "#apk" + apkid + ",";

				var icoSatusStr = "";
				if(icoStatus == 0) {
					icoSatusStr = "";
				} else if(icoStatus == 1) {
					icoSatusStr = '<span class="icoSatus hot">热门</span>';
				} else if(icoStatus == 2) {
					icoSatusStr = '<span class="icoSatus new">最新</span>';
				} else if(icoStatus == 3) {
					icoSatusStr = '<span class="icoSatus recommend">推荐</span>';
				}

				/*
				下载 Download
				升级 Upgrade
				等待 Wait
				暂停 Pause
				继续 Continue
				安装 Install
				取消 Cancel
				打开 Launch
				*/
				var stateClass = "download nor";
				var stateTxt = "下载";
				
				
				//java获取状态
				try {
					var getState = roid.getState(packname, versioncode, versionname);
					//$("#gameMenu").append(getState + "<br/>");
				} catch (e) {
					var getState = "";
				}
				
				//
				var state = getStateTxt(getState);
				stateClass = state.stateClass;
				stateTxt = state.stateTxt;

				str += '<li><a href="javascript:turnPage(\'page.html?packname='+packname+'&id='+id+'\')" class="list_main"><div class="img">'+icoSatusStr+'<img src="assets/img/o_pixel.gif" xsrc="'+icon+'" alt=""/></div><p class="tit break">'+apkname+'<span class="score"></p><p class="size break"><span class="first">'+rank+'分</span><span class="last">'+filesize+'M</span></p><p class="info break">'+info+'</p></a><a href="javascript:downLoad(\'apk'+apkid+'\');" id="apk'+apkid+'" class="'+stateClass+'" data-apkname="'+apkname+'" data-packname="'+packname+'" data-icon="'+icon+'" data-filepath="'+filepath+'" data-filesize="'+filesize+'" data-versioncode="'+versioncode+'" data-versionname="'+versionname+'" >'+stateTxt+'</a></li>';

			}
			
			//
			if(currPage == 1) {
				$(object).html(str).removeClass("hide");
				$(window).scroll(function() {
					scrollBottom(id);
					scrollLoad({id: id});
				});
				scrollLoad({id: id});
			} else {
				$(object).append(str).removeClass("hide");
			}
			
			//
			if(data.currPage === data.countPage) {
				$("#" + id).addClass("lastData");
				$(loading).remove();//加载到最后一条了
			} else {
				$(loading).removeClass("hide");
			}

			if(callback) callback();

			//添加页码标识
			$("#" + id).attr("data-currpage", currPage).attr("data-action", action);
			
			//添加事件
			/*
			$(".download").each(function(i){
				if(!$(this).hasClass("cur")) {
					$(this).addClass("cur").on("tap", function() {
						var self = this;
						downLoad(self);
					});
				}
			});
			*/
			/*
			downBtnArr = downBtnArr.slice(0, -1);
			$(downBtnArr).on("tap", function() {
				var self = this;
				downLoad(self);
			});
			*/
		}
	});

	return false;
}




//滚动到底部加载
function scrollBottom(id) {
	
	var object = "#" + id;
	if($(object).hasClass("hide")) {
		return false;
	}
	
	var offsetPage = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
		offsetWindow = offsetPage + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight),
		bodyHeight = document.body.offsetHeight || document.documentElement.offsetHeight;
		//document.body.offsetHeight  scrollHeight
	var isLoading = $(object + " .loading").hasClass("cur");
	
	if(!isLoading && (offsetWindow > (bodyHeight - 20))) {
		//ajax
		$(object + " .loading").addClass("cur");
		setTimeout(function() {
			var action = $(object).attr("data-action");
			var currPage = $(object).attr("data-currpage");
			showList(id, action, ++currPage)
			$(object + " .loading").removeClass("cur");
		}, 1000);
	}
}





//获取状态roid.getState(String packname,String versioncode,String versionname)
//下载状态显示
//$("body").delegate(".download", "tap", function(e) {});
function downLoad(self) {
	var obj = $("#"+self);
	var apkname = obj.data("apkname"),
		packname = obj.data("packname"),
		icon = obj.data("icon"),
		filepath = obj.data("filepath"),
		filesize = obj.data("filesize"),
		versioncode = obj.data("versioncode"),
		versionname = obj.data("versionname");

	var downApp = function() {
		window.location.href = filepath;
	}

	if(obj.hasClass("nor")) {	
		//调用java下载
		try {
			appDownLoad(packname);
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
		} catch (e) {downApp();}
	} else if(obj.hasClass("downing")) {
		//调用java暂停
		try {
			appStop(packname);
			roid.toStop(packname);
		} catch (e) {downApp();}
		
	} else if(obj.hasClass("continue")) {
		//调用java继续
		try {
			appContinue(packname);
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
		} catch (e) {downApp();}
	} else if(obj.hasClass("install")) {
		//调用java安装
		try {
			roid.toInstall(packname, versionname)
		} catch (e) {downApp();}
	} else if(obj.hasClass("open")) {
		//调用java打开
		try {
			roid.toStart(packname) 
		} catch (e) {downApp();}
	} else if(obj.hasClass("upgrade")) {
		//调用java升级
		try {
			appDownLoad(packname);
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
		} catch (e) {downApp();}
	} else if(obj.hasClass("wait")) {
		//调用java继续
		try {
			appWait(name);
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
		} catch (e) {downApp();}
	}
	return false;
}



/*	正常情况 nor						apkDeleted  none
 *  下载 appContinue(name)  inDownloadQueue  downloading
 *	继续 appContinue(name)	inDownloadQueue  downloading
 *  暂停 appStop(name)		paused,
 *  安装 appInstall(name)	downloadCompleted 
 *	打开 appOpen(name)		installing  installed
 *	取消 appCancel(name)	corrupted,removed
 *	升级 appUpgrade(name) updateable
 * 
 *	name: app安装包
 */
function appDownLoad(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor continue cancel upgrade install").addClass("downing").html("暂停");	
		}
	});
}
function appContinue(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor continue cancel upgrade install").addClass("downing").html("暂停");	
		}
	});
}
function appStop(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing cancel upgrade install").addClass("continue").html("继续");	
		}
	});
}
//nor downing continue open cancel upgrade install
function appInstall(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing continue open cancel upgrade").addClass("install").html("安装");
		}
	});
}
function appOpen(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing continue cancel upgrade install").addClass("open").html("打开");
		}
	});
}
function appCancel(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("downing continue open upgrade install").addClass("cancel nor").html("下载");
		}
	});
}
function appUpgrade(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing continue open cancel install").addClass("upgrade").html("升级");
		}
	});
}
function appWait(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing continue open cancel upgrade").addClass("continue").html("继续");
		}
	});
}