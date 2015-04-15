(function() {
	
	var dev = "http://61.160.248.69:666/Mobile/Agg/V3000/List.aspx";//测试接口
	var line = "http://interface.18.net/Mobile/Agg/V3000/List.aspx";//正式接口
	var actionHost = line;

	var listPageSize = 10;//列表数
	
	var ua = navigator.userAgent;
	
	var isWeixin = false;//微信判断
	if(ua.indexOf("MicroMessenger") > -1) isWeixin  = true;



	var agg = {

		//接口
		action: {
			//banner图
			banRecommend: actionHost + "?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_PAIHANGBANG4",
			banGame: actionHost + "?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_REMEN2",
			banApp: actionHost + "?m=27&code=ANGOUGOUV3_YINGYONGZHONGXIN_TUIJIAN",
			banGameClass: actionHost + "?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_FENLEI3",
			
			list: actionHost + "?m=6&pageSize=" + listPageSize + "&classCode=",
			listList: actionHost + "?m=6&pageSize=" + listPageSize + "&classCode=",
			
			//推荐游戏应用 列表
			listRecommendGame: actionHost + "?m=6&pageSize="+listPageSize+"&classCode=ANGOUGOUV3_YOUHUZHONGXIN_PAIHANGBANG4",
			listRecommendApp: actionHost + "?m=6&pageSize="+listPageSize+"&classCode=ANGOUGOUV3_YINGYONGZHONGXIN_TUIJIAN",
			
			//游戏&应用 列表
			listGame: actionHost + "?m=6&pageSize="+listPageSize+"&classCode=ANGOUGOUV3_YOUHUZHONGXIN_REMEN2",
			listApp: actionHost + "?m=6&pageSize="+listPageSize+"&classCode=ANGOUGOUV3_YINGYONGZHONGXIN_ZHUANGJIBIBEI",
			
			//搜索列表
			listSearch: actionHost + "?m=11&pageSize="+listPageSize+"&kw=",
			//搜索推荐
			searchRecommend: actionHost + "?m=12&siteid=1",

			//分类
			classGame: actionHost + "?m=33&classCode=ANGOUGOUV3_YOUHUZHONGXIN_FENLEI3",
			
			//详情
			apk: actionHost + "?m=10&param="
		},
		
		//查看url参数
		queryParse: function() {
			//host/#page.html?name=he&age=18
			var l = window.location.href;
			var s = l.indexOf("?") + 1;
			var arr = l.slice(s).split("&");
			var arr2 = [];
			for(var i = 0, len = arr.length; i < len; i++) {
				arr2 = arr[i].split("=");
				this[arr2[0]] = arr2[1];
			}
		},
		
		//图片加载
		imgLoad: function(obj, src) {
			if(!src) return false;
			var img = new Image();
			img.onload = function() {
				obj.attr("src", src).addClass("curr");
				img = null;
			}
			img.onerror = function() {
				obj.attr("src", "assets/img/banner.png").addClass("curr");
			}
			img.src = src;
		},


		//滚动到底部加载 指定外层为.page
		scrollBottom: function(id) {
			var obj = $("#" + id);
			var loading = obj.find(".loading");

			if(obj.parent(".page").hasClass("hide")) return false;

			//searchList特殊处理
			if(id == "searchList" && obj.hasClass("hide")) return false;
			
			var offsetPage = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
				offsetWindow = offsetPage + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight),
				bodyHeight = document.body.offsetHeight || document.documentElement.offsetHeight;

			var isLoading = loading.hasClass("cur");
			
			if(!isLoading && (offsetWindow > (bodyHeight - 20))) {
				//ajax
				
				loading.addClass("cur");
				setTimeout(function() {
					var action = obj.attr("data-action");
					var currPage = obj.attr("data-currpage");
					var downType = obj.attr("data-downtype");
					agg.showList(id, action, ++currPage, downType, function() {
						loading.removeClass("cur");
					});
					
				}, 10);
			}
		},
		//图片懒加载
		scrollLoad: function(options) {
			
			var t = 100;
			var defaults = (arguments.length == 0) ? { src: 'xSrc', time: t} : { src: options.src || 'xSrc', time: options.time || t, id: options.id};
			var camelize = function (s) {
				return s.replace(/-(\w)/g, function (strMatch, p1) {
					return p1.toUpperCase();
				});
			};
			var getStyle = function (element, property) {
				if (arguments.length != 2) return false;
				var value = element.style[camelize(property)];
				if (!value) {
					if (document.defaultView && document.defaultView.getComputedStyle) {
						var css = document.defaultView.getComputedStyle(element, null);
						value = css ? css.getPropertyValue(property) : null;
					} else if (element.currentStyle) {
						value = element.currentStyle[camelize(property)];
					}
				}
				return value == 'auto' ? '' : value;
			};
			var _init = function () {
				//by hth
				if($("#" + defaults.id).parent().hasClass("hide")) return false;

				//searchList特殊处理
				if(defaults.id == "searchList") {
					if($("#" + defaults.id).hasClass("hide")) return false;
				}

				var offsetPage = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
					offsetWindow = offsetPage + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight)-50,
					//docImg = document.images,
					//by hth
					docImg = $("#" + defaults.id).find("img"),

					_len = docImg.length;
				if (!_len) return false;
				for (var i = 0; i < _len; i++) {
					var attrSrc = docImg[i].getAttribute(defaults.src),
						o = docImg[i], tag = o.nodeName.toLowerCase(),
						cur = docImg[i].className;
					if (o) {
						postPage = o.getBoundingClientRect().top + window.document.documentElement.scrollTop + window.document.body.scrollTop; 
						postWindow = postPage + Number(getStyle(o, 'height').replace('px', ''));
						if ((postPage > offsetPage && postPage < offsetWindow) || (postWindow > offsetPage && postWindow < offsetWindow)) {
							if (tag === "img" && attrSrc !== null && cur !== "cur") {
								(function(o) {
									o.className = "cur";
									o.onerror = function() {
										o.className = "cur";
										o.setAttribute("src", agg.defaultImg.apkImg);
									}
									o.onload = function() {
										o = null;
									};
									o.setAttribute("src", attrSrc);
								})(o);
							}
							o = null;
						}
					}
				};

			};
			_init();
		},

		//展示banner图
		swiperObj: {},
		swiperEvent: {},
		showSlider: function(actionUrl, id, downType, callback) {
			var object = "#" + id;

			//判断重复定义swiper
			if(agg.swiperObj[id]) {
				return false;
			}

			var swiperFun = function(object, id) {
				agg.swiperObj[id] = new Swiper(object,{
					pagination: ("."+id+"Pagination"),
					//loop:true,
					paginationClickable: true,
					//autoplay: 5000,
					resizeReInit: true,
					resizeReInit: true,
					calculateHeight: true,
					autoplayDisableOnInteraction: true,
					//mousewheelControl: true,
					onlyExternal: false,//false:可移动
					grabCursor: true, //手势
					onFirstInit: function(swiper) {

						var len = swiper.slides.length;
						if(len === 1) {
							$("."+id+"Pagination").addClass("hide");
							$("#"+id+"Prev").addClass("hide");
							$("#"+id+"Next").addClass("hide");
						}

						$(object).parent().removeClass("cur");
						var ind = swiper.activeLoopIndex * 1;
						var imgs = $(object + " .swiper-slide.img0" + ind).find("img");
						if(!imgs.eq(0).hasClass("curr")) {
							var src = imgs.attr("ssrc");
							agg.imgLoad(imgs, src);
						}

						//上一页 下一页 体验优化
						var ind2 = swiper.activeLoopIndex;
						//var len = swiper.slides.length;
						if(ind2 == 0) {
							setTimeout(function() {
								$(object).siblings(".arrow-left").addClass("disabled");
								$(object).siblings(".arrow-right").removeClass("disabled");
							}, 1000);
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
							agg.imgLoad(imgs, src);
						}

						//上一页 下一页 体验优化
						var ind2 = swiper.activeLoopIndex;
						var len = swiper.slides.length;
						if(ind2 == 0) {
							$(object).siblings(".arrow-left").addClass("disabled");
							$(object).siblings(".arrow-right").removeClass("disabled");
						} else if(ind2 == (len-1)) {
							$(object).siblings(".arrow-right").addClass("disabled");
							$(object).siblings(".arrow-left").removeClass("disabled");
						} else {
							$(object).siblings(".arrow-left").removeClass("disabled");
							$(object).siblings(".arrow-right").removeClass("disabled");
						}
					}
				});
				

				agg.swiperEvent[id+"Next"] = function() {
					//e.preventDefault();
					agg.swiperObj[id].swipeNext();
				}
				agg.swiperEvent[id+"Prev"] = function() {
					//e.preventDefault();
					agg.swiperObj[id].swipePrev()
				}

				
				/*
				orientationChange();
				window.onorientationchange = orientationChange;
				*/	
			};
			
			//解析数据
			var parseDate = function(data, object, id, callback) {

				//console.log(data);
				var str = "";
				var data = data.n || data;
				var obj = data.obj;

				if(!obj.length || obj == "[]") {
					$(object).html("");
					if(callback) callback();
					return false;
				}
				
				var title = "",
					icon = "",
					packName = "";
				var l = location.href;
				var URL = l.slice(0, l.lastIndexOf("/") + 1).concat("page.html");
				var url = "";

				for(var i = 0, len = obj.length; i < len; i++) {
					title = obj[i].title;
					icon = obj[i].advertImgUrl;
					packName = obj[i].packName;
					url = URL + "?packname=" + packName + "&downType=" + downType;

					str += '<div class="swiper-slide img0'+i+'"><a href="javascript:buildNewWebPage(\''+title+'\', \''+url+'\');"><img class="cur" src="assets/img/sliderTemp.gif" ssrc="'+icon+'" width="100%" height=""></a></div>';
				}
				if(obj.length === 1) {
					$(object+ " .swiper-wrapper").html(str);
				} else {
					$(object+ " .swiper-wrapper").html(str);
				}
				if(callback) callback();

				swiperFun(object, id);
			};
			
			
			///1hour存储
			/*
			if(window.localStorage && window.localStorage.getItem(actionUrl)) {
				
				var data = window.localStorage.getItem(actionUrl);
				data = JSON.parse(data);

				parseDate(data, object, id, callback);
				
				var date = window.localStorage.getItem(actionUrl + "date");
				var nowDate = (new Date()).getTime();
				var second = Math.floor((nowDate - date) / 1000);
				if(second < 3600) {
					return false;
				}
				
			}
			*/
			
			//请求数据
			$.ajax({
				url: actionUrl + "&top=3&jsoncallback=?",
				type: "POST",
				dateType: "json",
				timeout: 20000,
				cache: false,
				error: function(){
					$("#" + id + " .swiper-wrapper").html('<div class="swiper-slide por"><a href="javascript:;" style="position:absolute;top:0;left:0;width:100%;height:100%;text-align:center;background:red;">123</a><img src="assets/img/sliderTemp.gif" width="100%" height=""></div>');

					if(callback) callback();
				},
				success:function(data){
					
					/*
					if(window.localStorage) {
						window.localStorage.setItem(actionUrl, JSON.stringify(data.n));
						window.localStorage.setItem(actionUrl + "date", (new Date()).getTime());
					}
					*/
					
					parseDate(data, object, id, callback);
				}
			});
		},

		/*
		 * @description		显示app列表
		 *
		 * @param id		列表最外层id
		 * @param action	数据接口地址
		 * @param currPage	当前页
		 * @param downType	所属类型
		 * @param callback	回调
		 */
		showList: function(id, action, currPage, downType, callback) {
			//添加下载类型
			$("#" + id).attr("data-downtype", downType);

			//添加页码标识
			$("#" + id).attr("data-currpage", currPage).attr("data-action", action);

			$("#" + id).removeClass("hide");
			//最后一条数据
			if((currPage !== 1) && $("#" + id).hasClass("lastData")) {
				return false;
			}
			if(currPage === 1) {
				$("#" + id).removeClass("lastData");
			}

			var object = "#"+id + " ul";
			var loading = "#"+id + " .loading";
			
			$(loading).removeClass("hide");

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
			
			var url = action + "&currPage="+currPage;		
			
			$.ajax({
				url: url + "&jsoncallback=?",
				type: "POST",
				dateType: "json",
				timeout: 20000,
				cache: false,
				error: function(){
					$("#errorList").remove();
					$("#" + id + " .loading").addClass("hide").addClass("cur").after('<div class="tac" id="errorList" style="padding:30px 0;"><a href="javascript:agg.errorContinue(\''+id+'\');">请求超时！点击重新加载</a></div>');
				},
				success:function(data){
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

					
					var title = "";
					var l = location.href;
					var URL = l.slice(0, l.lastIndexOf("/") + 1).concat("page.html");
					var url = "";

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
						
						
						url = URL + "?packname=" + packname + "&downType=" + downType;

						str += '<li><a href="javascript:buildNewWebPage(\''+apkname+'\', \''+url+'\');" class="list_main"><div class="img">'+icoSatusStr+'<img src="assets/img/o_pixel.gif" xsrc="'+icon+'" alt=""/></div><p class="tit break">'+apkname+'<span class="score"></p><p class="size break"><span class="first">'+rank+'分</span><span class="last">'+filesize+'M</span></p><p class="info break">'+info+'</p></a><a href="javascript:downLoad(\'apk'+apkid+'\');" id="apk'+apkid+'" class="'+stateClass+'" data-apkname="'+apkname+'" data-packname="'+packname+'" data-icon="'+icon+'" data-filepath="'+filepath+'" data-filesize="'+filesize+'" data-versioncode="'+versioncode+'" data-versionname="'+versionname+'" data-downtype="' + downType + '" >'+stateTxt+'</a></li>';

					}
					
					//
					if(currPage == 1) {
						$(object).html(str).removeClass("hide");
						$(window).scroll(function() {
							agg.scrollBottom(id);
							agg.scrollLoad({id: id});
						});
						setTimeout(function() {
							agg.scrollLoad({id: id});
						}, 1);
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
					//$("#" + id).attr("data-currpage", currPage).attr("data-action", action);
					
				}
			});

			return false;
		}
	};
	
	window.agg = agg;
})();







/**
 * @description:Html中javascript调用本地新建一个的Web页面的方法
 * @author:lanhaizhong
 * @param title
 *            标题
 * @param url
 *            给页面传递的地址
 */
/*
@JavascriptInterface
public void buildNewWebPage(String title, String url) {
	if (url == null) {
		return;
	} else {

	}
}
*/


/**
 * @description:Html中javascript调用本地新建一个的Web页面的方法
 * @author:lanhaizhong
 * @param title
 *            标题
 * @param url
 *            给页面传递的地址
 */
//@JavascriptInterface
function buildNewWebPage(title, url) {
	try {
		roid.buildNewWebPage(title, url);
	} catch (e) {
		console.log(title, url);
		window.open(url, "_blank");
	}
}





/*
 * 下载按钮事件
 * @method	roid.toDownLoad()	下载
 * @method	roid.toStop()		暂停
 * @method	roid.toInstall()	安装
 * @method	roid.toStart()		打开
 *
 * @param {string}	apkname		apk名称
 * @param {string}	packname	包名
 * @param {string}	icon		应用图标
 * @param {string}	filepath	文件链接
 * @param {string}	filesize	文件大小
 * @param {string}	versioncode	版本号x(用于升级)
 * @param {string}	versionname	版本名x.x.x
 */
function downLoad(self) {

	var obj = $(".page:not(.hide) #"+self).eq(0);

	var apkname = obj.data("apkname"),
		packname = obj.data("packname"),
		icon = obj.data("icon"),
		filepath = obj.data("filepath"),
		filesize = obj.data("filesize"),
		versioncode = obj.data("versioncode"),
		versionname = obj.data("versionname");
	var downType = obj.data("downtype");

	var downApp = function() {
		window.location.href = filepath;
		//console.log(filepath);
	};
	
	//hasClass说明现在的状态
	if(obj.hasClass("nor")) {	
		//调用java下载
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
			appDownLoad(packname);
		} catch (e) {downApp();}

	} else if(obj.hasClass("downing")) {
		//调用java暂停
		try {
			roid.toStop(packname);
			appStop(packname);
		} catch (e) {downApp();}

	} else if(obj.hasClass("continue")) {
		//调用java下载
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
			appDownLoad(packname);
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
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
			appDownLoad(packname);
		} catch (e) {downApp();}

	} else if(obj.hasClass("wait")) {
		//调用java继续
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname)
			appWait(name);
		} catch (e) {downApp();}
	}
	return false;
}


/*
 * 获取apk的状态
 * @method	getStateTxt()
 * @param {string}	getState	roid.getState()返回的字符串
 * @return {object} {stateClass:状态类, stateTxt:状态字}	
 */
function getStateTxt(getState) {

	var stateClass = "",
		stateTxt = "";

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


/*
 * javascript显示相应的状态
 *
 * @method	appDownLoad()	下载
 * @method	appContinue()	继续
 * @method	appStop()		暂停
 * @method	appWait()		暂停
 * @method	appOpen()		打开
 * @method	appCancel()		取消
 * @method	appUpgrade()	升级
 *
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
function appWait(name) {
	$(".download").each(function(i) {
		if($(this).data("packname") === name) {
			$(this).removeClass("nor downing continue open cancel upgrade").addClass("continue").html("继续");
		}
	});
}
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
			$(this).removeClass("downing continue open upgrade install").addClass("nor").html("下载");
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
