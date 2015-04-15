(function() {
	
	var dev = "http://192.168.1.159:8888/appManager/yzmarkethot/";
	var line = "http://ftpagg.18.net/yzmarkethot/";
	var action = line;

	//腾讯新闻接口
	var actionNews = "http://interface.18.net/Mobile/Agg/V4000/baiduNews.aspx?jsoncallback=?";

	//banner接口(暂停使用)
	var actionBanner = "http://interface.18.net/Mobile/Agg/V3000/List.aspx?m=27&code=ANGOUGOUV3_YOUHUZHONGXIN_PAIHANGBANG4&top=3";
	
	//app详情接口
	var actionPackName = action + "page.html?packname";

	//应用市场链接
	var actionMarket = action + "index.html";

	//新闻接口加载状态
	var isShowNews = 0;
	
	//搜索接口(百度&神马)
	var baiduUrl = "http://m.baidu.com/s?from=1793a&uid=xccx&word=";
	var smUrl = "http://m.yz.sm.cn/s?from=wm630147&q=";
	var searchUrl = smUrl;

	//第三个导航url
	//爱阅读http://m.ireader.com/book_bookshelf.php?key=1F2&p2=104070
	var navThirdUrl = action + "index.html";
	var navThirdTit = "应用";

	if($("body").hasClass("skinGreen")) {
		navThirdUrl = "http://m.ireader.com/book_bookshelf.php?key=1F2&p2=104070";
		navThirdTit = "爱阅读";
	}

	var agg = {
		defaultImg: {
			apkImg: "assets/img/apk_icon.png"
		},
		searchBaidu: function() {
			var key = $("input").val();
			var url = searchUrl + key;

			buildNewWebPage('百度一下', url);
		},
		//搜索下拉
		searhNavEvent: function(){
			var $searchNav = $("#searchNav");
			var $searchPan = $("#searchPan");
			var hidePan = function() {
				$searchNav.removeClass("cur");
				$searchPan.addClass("dn");
			}
			$searchNav.on("click", function(){
				if($(this).hasClass("cur")) {
					hidePan();
				} else {
					$searchNav.addClass("cur");
					$searchPan.removeClass("dn");
				}
			});
			$searchPan.on("click", "a", function(e){
				var ind = $(this).index();
				var tips = "";
				var imgSrc = "";
				if (ind === 0) {
					searchUrl = smUrl;
					imgSrc = "assets/img/sm.png";
				} else if (ind === 1) {
					searchUrl = baiduUrl;
					imgSrc = "assets/img/bd.png";
				}
				$("#searchNav img").attr("src", imgSrc);
				hidePan();
			});
			$(window).on("scroll", function(){
				hidePan();
			});
			$(".header .input").on("focus", function() {
				hidePan();
			});
		},

		//滚动到底部加载 指定wrapper
		scrollBottom: function(id) {
			
			var object = "#" + id;
			if($(object).hasClass("hide")) {
				return false;
			}

			//searchList特殊处理
			if(id == "searchList") {
				if($("#" + id).hasClass("hide")) return false;
			}
			
			var offsetPage = window.pageYOffset ? window.pageYOffset : window.document.documentElement.scrollTop,
			offsetWindow = offsetPage + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight),
			bodyHeight = document.body.offsetHeight || document.documentElement.offsetHeight;
				//document.body.offsetHeight  scrollHeight
				var isLoading = $(object + " .loading2").hasClass("cur");

				if(!isLoading && (offsetWindow > (bodyHeight - 20))) {
				//ajax
				
				$(object + " .loading2").addClass("cur");
				setTimeout(function() {
					var action = $(object).attr("data-action");
					var currPage = $(object).attr("data-currpage");
					agg.showList(id, action, ++currPage, function() {
						$(object + " .loading2").removeClass("cur");
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
				if($("#" + defaults.id).hasClass("hide")) return false;

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
										//
										if(defaults.id === "PageNews") {
											$(o).parent().remove();
										}
										o.onload = function() {
											o = null;
										};
									}
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

		//图片加载opacity
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

		//banner图
		swiperObj: {},
		swiperEvent: {},
		showSlider: function(actionUrl, id, callback) {
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
					autoplay: 5000,
					resizeReInit: true,
					calculateHeight: true,
					autoplayDisableOnInteraction: true,
					//mousewheelControl: true,
					onlyExternal: false,//false:移动
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
						var len = swiper.slides.length;
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
					return false;
				}

				var icon = "";
				var packName = "";
				var tit = "";
				var downType = "ban-hot";
				var url = "";
				var classCode = "";
				
				//绿色版
				//if($("body").hasClass("skinGreen")) obj.shift();

				for(var i = 0, len = obj.length; i < len; i++) {
					icon = obj[i].advertImgUrl;
					packName = obj[i].packName;
					tit = obj[i].title;
					classCode = obj[i].classCode || "local";

					url = actionPackName+'='+packName+'&downType='+downType+"&title=" +tit+"&classCode="+classCode;

					str += '<div class="swiper-slide img0'+i+'"><a href="javascript:buildNewWebPage(\''+tit+'\',\''+url+'\');" class="noTap"><img class="cur" src="assets/img/sliderTemp.gif" ssrc="'+icon+'" width="100%" height=""></a></div>';
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
			
			parseDate(BANNER, object, id, callback);
			
			
			//请求数据
			/*
			$.ajax({
				//url: actionUrl + "&top=3&jsoncallback=?",
				url: actionUrl + "&jsoncallback=?",
				type: "POST",
				dateType: "json",
				timeout: 20000,
				cache: false,
				error: function(){
					$("#" + id).html('<div class="tac" style="padding:30px 0;"><a href="javascript:window.location.reload();">请求超时！点击重新加载</a></div>');

					if(callback) callback();
				},
				success:function(data){
					
					
					//if(window.localStorage) {
					//	window.localStorage.setItem(actionUrl, JSON.stringify(data.n));
					//	window.localStorage.setItem(actionUrl + "date", (new Date()).getTime());
					//}
					
					
					parseDate(data, object, id, callback);
				}
			});
*/
},

		//show
		showApp: function(actionUrl) {

			var parseData = function(data) {
				var obj = data.n.obj;
				
				var apkid = "",
				apkname = "",
				packname = "",
				icon = "",
				filepath = "",
				filesize = "",
				rank = "",
				versionname = "",
				versioncode = "",
				classCode = "";

				var str = '<ul class="list_market oh">';
				
				//
				var title = "";
				var l = location.href;
				var URL = l.slice(0, l.lastIndexOf("/") + 1).concat("page.html");
				var url = "";
				var downType = "list-hot";

				for(var i = 0, len = obj.length; i < 8; i++) {
					
					apkid = obj[i].apkid;
					apkname = obj[i].apkname;
					packname = obj[i].packname;
					icon = obj[i].icon;
					filepath = obj[i].filepath;
					filesize = obj[i].filesize;
					rank = obj[i].rank;
					versionname = obj[i].versionname;
					versioncode = obj[i].versioncode;
					classCode = obj[i].classCode;

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

					url = actionPackName + "=" + packname + "&downType=" +downType + "&title="+apkname+"&classCode="+classCode;

					str += '<li><a href="javascript:buildNewWebPage(\''+apkname+'\',\''+url+'\');" class="item"><span class="img"><img src="assets/img/o_pixel.gif" xsrc="'+icon+'" alt="" width="53" height="53" /></span><span class="tit">'+apkname+'</span><span class="txt">'+filesize+'M</span></a><a href="javascript:downLoad(\'apk'+apkid+'\');" id="apk'+apkid+'" class="apk'+apkid+' '+stateClass+'" data-apkname="'+apkname+'" data-packname="'+packname+'" data-icon="'+icon+'" data-filepath="'+filepath+'" data-filesize="'+filesize+'" data-versioncode="'+versioncode+'" data-versionname="'+versionname+'" data-downtype="' + downType + '"  data-packtype="'+classCode+'">'+stateTxt+'</a></li>';

					//javascript:buildNewWebPage(\''+apkname+'\', \''+url+'\');
				}

				str += '</ul>';
				str += '<a href="javascript:buildNewWebPage(\'\',\''+actionMarket+'\');" class="more">更多游戏和应用<span>></span></a>';

				$("#marketList").removeClass("loading").html(str);
				$(window).scroll(function() {
					agg.scrollLoad({"id": "PageIndex"});
				});
			};
			
			parseData(APP);
			//var actionUrl = !!actionUrl ? (actionUrl + "jsoncallback") : "action/app.json";
			/*
			$.ajax({
				url: actionUrl,
				type: "POST",
				dateType: "json",
				//timeout: 1000,
				cache: false,
				error: function(){
					alert("err");
				},
				success:function(data){
					
					parseData(data);
				}
			});
*/
},

		//导航切换
		navEvent: function() {
			var setNavCur = function(ind) {
				$(".nav").each(function() {
					$(this).find("a").eq(ind).addClass("cur").siblings("a").removeClass("cur");
				});
			};
			$(".nav a").bind("click", function() {
				var ind = $(this).index();
				var page = $(".page");
				
				switch (ind) {
					case 0:
					setNavCur(ind);
					page.eq(0).removeClass("hide").siblings(".page").addClass("hide");

					if(!!agg.swiperObj.slider) {
						agg.swiperObj.slider.startAutoplay();
					}
					break;
					case 1:
					if(!isShowNews) return false;

					setNavCur(ind);
					page.eq(1).removeClass("hide").siblings(".page").addClass("hide");
					agg.scrollLoad({"id": "PageNews"});

					if(!!agg.swiperObj.slider) {
						agg.swiperObj.slider.stopAutoplay();
					}
					break;
					case 2:
					buildNewWebPage(navThirdTit, navThirdUrl);
					break;
					default:
					
				}
				return false;
			});
			
			$("#newsHotMore").bind("click", function() {
				$(window).scrollTop(0);
				$("#nav a").eq(1).click();
			});
		},
		
		//标题收缩
		titleEvent: function() {
			
			$(".title_1").bind("click", function() {
				var tit = $(this);

				var con = tit.siblings(".con");
				
				if(!tit.hasClass("up")) {
					tit.addClass("up");
					con.addClass("up");
				} else {
					tit.removeClass("up");
					con.removeClass("up");
				}
			});
		},
		
		
		showNews: function(callback) {
			
			var showIndex = function(obj) {
				var str = "";
				var len = 5;
				var title = "";
				var url = "";
				var abs = "";
				var img = {};
				var ts = "";

				str += '<ul class="list_news">';
				for(var i = 0; i < len; i++) {
					title = obj[i].title;
					title = title.replace(/\"/g, "“").replace(/\'/g, "‘");
					url = obj[i].url;
					abs = obj[i].abs;
					img = obj[i].imageurls[0];
					ts = obj[i].ts;
					
					str += '<li><a href="javascript:buildNewWebPage(\''+title+'\',\''+url+'\');"><span class="dot"></span>'+title+'</a></li>';
				}
				str += '</ul>';

				$("#newsHot ul").removeClass("loading").html(str);
			};
			//显示新闻
			var showNewsList = function(obj, curPage) {
				var str = "";
				var len = obj.length;
				var title = "";
				var url = "";
				var abs = "";
				var img = {};
				var ts = "";


				for(var i = 0; i < len; i++) {
					title = obj[i].title;
					title = title.replace(/\"/g, "“").replace(/\'/g, "‘");
					url = obj[i].url;
					abs = obj[i].abs;
					img = obj[i].imageurls[0];
					ts = obj[i].ts;

					str += '<li><a href="javascript:buildNewWebPage(\''+title+'\',\''+url+'\');"><span class="img"><img src="assets/img/o_pixel.gif" xsrc='+img.url+' width="100%" height="auto" /></span><span class="tit">'+title+'</span><span class="txt">'+abs+'</span><span class="times"></span></a></li>';
				}

				$("#PageNews").removeClass("loading").find("ul").append(str);
				$("#PageNews").attr({"curPage": curPage}).attr({"countPage": obj.length});

				if(curPage === 1) {
					$(window).scroll(function() {
						agg.scrollLoad({"id": "PageNews"});
						
					});
				} else {
					
				}

			};

			$.ajax({
				url: actionNews,
				type: "POST",
				dateType: "json",
				//timeout: 1000,
				cache: false,
				error: function(){
					//alert(1);
				},
				success:function(data){
					window.NEWS = data.n.data.news;
					/*
					{
						"abs": "十分钟纵览国际财经大事。",
						"comment": "",
						"site": "国际财经头条",
						"title": "国际财经头条：美国油价或跌破3元人民币一升",
						"type": "news",
						"url": "http://gb.cri.cn/42071/2015/01/14/7671s4840234.htm"
						"ts": "1421204670000",
					}
					*/
					showIndex(NEWS);
					showNewsList(NEWS, 1);
					if(callback) callback();
				}
			});
		},

		showLife: function() {
			var obj = LIFE.obj;

			//绿色版
			if($("body").hasClass("skinGreen")) obj = gLIFE.obj;

			var title = "";
			var url = "";
			var str = "";
			var img = "";
			
			str += '<ul class="list_life oh">';
			for(var i = 0, len = obj.length; i < len; i++) {
				title = obj[i].title;
				url = obj[i].url;
				img = obj[i].img;

				str += '<li><a href="javascript:buildNewWebPage(\''+title+'\', \''+url+'\');"><span class="img"><img src="'+img+'" alt="" width="80%" height="auto" /></span><span class="txt">'+title+'</span></a></li>';
			}
			str += '</ul>';

			$("#lifeList").removeClass("loading").html(str);
		},

		//显示详细导航列表 
		showWebList: function() {
			var webList = WEBLIST;
			var str = '';
			var title;
			var subtitle;
			
			for(var i = 0, len = webList.length; i < len; i++) {
				var obj = webList[i];
				var con = obj.con;
				
				title = obj.title;
				str += '<div class="classNav mb10 box"><div class="title_1"><a href="javascript:;">'+title+'<span class="arrow"></span></a></div>';
				
				str += '<div class="con">';
				for(var j = 0, len2 = con.length; j < len2; j++) {
					var obj2 = con[j];
					subtitle = obj2["subtitle"];
					if(subtitle) {
						str += '<div class="subtitle"><span class="dot">&nbsp;</span>'+subtitle+'</div>';	
					} else if(title === "更多分类"  || title === "热门游戏") {
						str += '<div class="subtitle" style="height:0;border-bottom:none;"></div>';	
					}
					str += '<ul class="list">';
					
					var tit = "";
					for(var k = 0, len3 = obj2.list.length; k < len3; k++) {
						var url = obj2.list[k].url;
						var name = obj2.list[k].name;
						if(obj2.list[k]["isTit"] === "1") {
							tit = "tit";
							str += '<li class="'+tit+'"><span>'+name+'</span></li>';
						} else if(obj2.list[k]["isTit"] === "2"){
							tit = "tit";
							str += '<li class="'+tit+'"><a href="javascript:buildNewWebPage(\''+name+'\', \''+url+'\');">'+name+'</a></li>';
						} else {
							tit = "";
							str += '<li class="'+tit+'"><a href="javascript:buildNewWebPage(\''+name+'\', \''+url+'\');">'+name+'</a></li>';
						}
					}

					str += '</ul>';
				}
				
				str += '</div></div>';
			}
			//console.log(str);
			$("#weblist").html(str);
		},

		init: function() {
			agg.showApp();
			agg.showNews(function() {
				isShowNews = 1;
			});
			agg.navEvent();
			agg.showSlider(actionBanner, "slider");
			agg.showLife();

			agg.showWebList();

			agg.titleEvent();

			//agg.showWeather();
			agg.searhNavEvent();


			//滚动nav置顶
			$(window).on("scroll", function() {
				if($(window).scrollTop() > 150) {
					$(".navFixed").addClass("cur");
				} else {
					$(".navFixed").removeClass("cur");
				}
			});
		}
	};



	
	
	/*
	 * 显示IP天气(采用LBS开放平台)
	 * 5000次/天，利用storage/cookie存储
	 *
	 * @param ak		string		开发者密钥
	 * @param location	string		城市
	 * @param output	string		默认为xml格式
	 * @param callback	function	将json格式的返回值通过callback函数返回以实现jsonp功能
	 */
	 agg.showWeather = function() {
	 	var ak = 'KmFOlUKcfteiksk67AHPZz4O';
	 	var ip = 'http://api.map.baidu.com/location/ip?ak=' + ak;
	 	var weather = 'http://api.map.baidu.com/telematics/v3/weather?output=json&ak=' + ak + '&location=';

		//根据天气获取天气
		var showWeather = function(city) {
			$.ajax({
				url: weather + city + "&callback=?",
				dataType : "jsonp",
				jsonp: "jsoncallback",
				cache: false,
				error: function(){
					console.log("weather err");
				},
				success:function(data){
					console.log(data);
					//今后四天的天气详情
					var res = data.results[0].weather_data;
					var today = res[0];
					var date = today.date;//"周三 01月21日 (实时：14℃)"
					var dayPictureUrl = date.dayPictureUrl;
					var nightPictureUrl = date.nightPictureUrl;
					var temp = date.temperature;
					var weather = date.weather;
					var wind = date.wind;
					var str = "";

					$("#weather").html();
				}
			});
		};

		//获取IP
		var getIp = function(callback) {
			$.ajax({
				url: ip + "&callback=?",
				dataType : "jsonp",
				jsonp: "jsoncallback",
				cache: false,
				error: function(){
					console.log("err");
				},
				success:function(data){
					var city = data.content.address_detail.city;
					if(callback) callback(city);
				}
			});	
		};

		//存数据
		var save = function() {

		};

		//取数据
		var get = function() {
			
		};


		
		getIp(function(city) {
			showWeather(city);
		});
	};




	window.agg = agg;

	agg.init();
})();













/*
 * cookie存取
 * setCookie(name,value,time)
 * getCookie(name)
 * delCookie(name)
 */
 function setCookie(name,value,time)
 {
 	var strsec = getsec(time);
 	var exp = new Date();
 	exp.setTime(exp.getTime() + strsec*1);
 	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
 }

 function getsec(str)
 {
 	var str1=str.substring(1,str.length)*1;
 	var str2=str.substring(0,1);
 	if (str2=="s")
 	{
 		return str1*1000;
 	}
 	else if (str2=="h")
 	{
 		return str1*60*60*1000;
 	}
 	else if (str2=="d")
 	{
 		return str1*24*60*60*1000;
 	}
 }
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
//setCookie("name","hayden","s20");

//读取cookies
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

	if(arr=document.cookie.match(reg))

		return (arr[2]);
	else
		return null;
}

//删除cookies
function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}






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
		//console.log(title, url);
		window.open(url, "_self");
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

 	var obj = $("."+self);

 	var apkname = obj.data("apkname"),
 	packname = obj.data("packname"),
 	icon = obj.data("icon"),
 	filepath = obj.data("filepath"),
 	filesize = obj.data("filesize"),
 	versioncode = obj.data("versioncode"),
 	versionname = obj.data("versionname");
 	var downType = obj.data("downtype");
	var coid = 1;//1-蓝色版 2-绿色版
	var ncoid = 1;//1-199 2-移卓市场
	var packType = obj.data("packtype");//就是classCode
	var encodeApkName = encodeURIComponent(apkname);//中文转码 节省后台查询
	
	var downApp = function() {
		window.location.href = filepath;
		//console.log(filepath);
	};

	
	//hasClass说明现在的状态
	//坑爹的try catch
	if(obj.hasClass("nor")) {	
		//调用java下载
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType, coid, ncoid, packType, encodeApkName);
			appDownLoad(packname);
		} catch (e) {
			try {
				roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType);
				appDownLoad(packname);
			} catch (e) {
				try {
					roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
					appDownLoad(packname);
				} catch (e) {
					downApp();
				}
			}
		}

	} else if(obj.hasClass("downing")) {
		//调用java暂停
		try {
			roid.toStop(packname);
			appStop(packname);
		} catch (e) {downApp();}

	} else if(obj.hasClass("continue")) {
		//调用java下载
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType, coid, ncoid, packType, encodeApkName);
			appDownLoad(packname);	
		} catch (e) {
			try {
				roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType);
				appDownLoad(packname);
			} catch (e) {
				try {
					roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
					appDownLoad(packname);
				} catch (e) {
					downApp();
				}
			}
		}

	} else if(obj.hasClass("install")) {
		//调用java安装
		try {
			roid.toInstall(packname, versionname, downType, coid, ncoid, packType, encodeApkName);
		} catch (e) {
			try {
				roid.toInstall(packname, versionname, downType);
			} catch (e) {
				try {
					roid.toInstall(packname, versionname);
				} catch (e) {
					downApp();
				}
			}
		}

	} else if(obj.hasClass("open")) {
		//调用java打开
		try {
			roid.toStart(packname, downType, coid, ncoid, packType, encodeApkName);
		} catch (e) {
			try {
				roid.toStart(packname, downType);
			} catch (e) {
				try {
					roid.toStart(packname);
				} catch (e) {
					downApp();
				}
			}
		}

	} else if(obj.hasClass("upgrade")) {
		//调用java升级
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType, coid, ncoid, packType, encodeApkName);
			appDownLoad(packname);
		} catch (e) {
			try {
				roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType);
				appDownLoad(packname);
			} catch (e) {
				try {
					roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
					appDownLoad(packname);
				} catch (e) {
					downApp();
				}
			}
		}

	} else if(obj.hasClass("wait")) {
		//调用java继续
		try {
			roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType, coid, ncoid, packType, encodeApkName);
			appWait(name);
		} catch (e) {
			try {
				roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname, downType);
				appWait(name);
			} catch (e) {
				try {
					roid.toDownLoad(apkname, packname, icon, filepath, filesize, versioncode, versionname);
					appWait(name);
				} catch (e) {
					downApp();	
				}
			}
		}
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
		stateTxt = "<i></i>下载中";
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
			$(this).removeClass("nor continue cancel upgrade install").addClass("downing").html("<i></i>下载中");//暂停	
		}
	});
 }
 function appContinue(name) {
 	$(".download").each(function(i) {
 		if($(this).data("packname") === name) {
			$(this).removeClass("nor continue cancel upgrade install").addClass("downing").html("<i></i>下载中");//暂停	
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
