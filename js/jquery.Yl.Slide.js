/*
 2017/08/10 智取小师妹
 QQ/微信：65268828
 mail:yanliangnhai@163.com
 如果在使用过程中有bug或改进的问题请联系我！ 
 Edition:v1.1
 1.优化相关代码
 2.增加loading功能
 */
 ;(function($, window, document, undefined) {
	//定义ylSlide的构造函数
	var ylSlide = function(ele, opt) {
		this.edition='v1.1';
		this.$element = ele; //选择器
		this.pic_index = 0;
		this.setTimes = null;
		this.defaults = {
			wrapper: '.Yl-wrapper', //包装层
			slideClass: '.Yl-slide', //循环层
			stylePrefix: '.Yl-', //循环层附加样式前缀
			slideLength: 3, //视图个数
			pages: true, //是否开启分页
			pagination: '.Yl-pagination', //分页样式
			pagingSelect: '.Yl-pagination-bullet-active', //分页选中样式
			autoplay: 5000, //每个视图切换毫秒数
			imgTemplate: {}, //图片模板
			fontTemplate: {}, //文字模板
			fontAnimationMode: {}, //文字动画模式
			customTemplate: {}, //自定义模板（可用作按钮模板）
			resource:[],//预加载资源数组
			loading:function(){}, //资源预加载回调
			callback: function() {}, //整个DOM加载完成后的回调函数
			before: function() {}, //每个视图切换前的回调函数
			after: function() {} //每个视图切换完成后的回调函数			
		};
		this.options = $.extend({}, this.defaults, opt);		
	};
	//定义ylSlide的方法
	ylSlide.prototype = {
		decon: function(items) {
			var self = this,
			defaults = {
				wrapper: self.options.wrapper,
				slideClass: self.options.slideClass,
				stylePrefix: self.options.stylePrefix,
				slideLength: self.options.slideLength,
				pages: self.options.pages,
				pagination: self.options.pagination,
				pagingSelect: self.options.pagingSelect,
				autoplay: self.options.autoplay,
				imgTemplate: self.options.imgTemplate,
				fontTemplate: self.options.fontTemplate,
				fontAnimationMode: self.options.fontAnimationMode,
				customTemplate: self.options.customTemplate,
				resource:self.options.resource,
				loading:self.options.loading,
				callback: self.options.callback,
				before: self.options.before,
				after: self.options.after				
			};
			return items.call(self, defaults);
		},
		util: {
			eachs: function(ele, leng, Class, Create, pre, oneClass, addclass) { //渲染/解构dom
				//创建代码片段
				var fragment = document.createDocumentFragment(),
				div;
				for (var i = 0; i < leng; i++) {
					div = document.createElement(Create);
					oneClass !== undefined && oneClass !== '' && i === 0 ?
					div.className = oneClass :
					(
						div.className = Class,
						addclass !== undefined && addclass !== '' ?
						div.className += ' ' + addclass + i :
						''
						);
					//代码片段中添加div
					fragment.appendChild(div);
				}
				pre == 'end' ? ele.append(fragment) : ele.prepend(fragment);
			},
			splits: function(e) { //分割class
				var o = e.split('.')[1];
				return o;
			},
			obj: function(e, fn) { //解构模板里的配置项映射给fn处理	
				var len = e.length,
				i = 0,
				tag = false;
				typeof e == 'object' ? (e[0][0] instanceof Array ? tag = true : console.log('Parameter error!')) : '';
				if (tag) {
					for (; i < len; i++) {
						fn.call(this, e[i]);
					}
				}
			},
			addTemp: function($selector, ele, Class, fontTemp, fontAnimationTemp) { //添加模板
				var len = Object.keys(ele).length,
				that = this;
				for (var i = 0; i < len; i++) {
					if (ele == fontTemp) {
						for (var k = 0; k < ele[i].length; k++) {
							var $ele = $(ele[i][k]),
							AniClass = fontAnimationTemp[i][k];
							$ele.addClass(AniClass);
							$selector.find(Class).eq(i).append($ele.html(
								AniClass == 'slideInLeft' ?
								that.setText_a($ele) :
								that.setText($ele)
								));
						}
					} else {
						$selector.find(Class).eq(i).append(ele[i]);
					}
				}
			},
			getRandomNum: function(Min, Max) { //获取随机数
				var Range = Max - Min;
				var Rand = Math.random();
				return (Min + Math.round(Rand * Range));
			},
			setText: function(e) { //初始化文字1	
				var text = e.text(),
				that = this;
				text = text.replace(/ /g, "^");
				var arr = text.split("");
				var html = "";
				for (var i = 0; i < arr.length; i++) {
					html += "<i style='transition-delay:0." + that.getRandomNum(1, 8) + "s;-webkit-transition-delay:0." + that.getRandomNum(1, 8) + "s'>" + arr[i] + "</i>";
				}
				html = html.replace(/\^/g, "&nbsp;");
				html = html.replace("> <", ">&nbsp;<");
				return html;
			},
			setText_a: function(e) { //初始化文字2
				var text = e.text(),
				html = "",
				l = 0,
				that = this;
				text = text.replace(/ /g, "^");
				text = text.replace(" ", "^");
				while (l < text.length) {
					var x = that.getRandomNum(2, 5);
					var y = that.getRandomNum(8, 20) * 0.1;
					html += "<i><b style='transition-delay:" + y + "s;-webkit-transition-delay:" + y + "s'>" + text.substr(l, x) + "</b></i>";
					l += x;
				}
				html = html.replace(/\^/g, "&nbsp;");
				html = html.replace("> <", ">&nbsp;<");
				e.html(html);
			},
			showtxt: function(e, delay) { //激活文字动画			
				setTimeout(function() {
					e.addClass("act");
				}, delay);
			},
			hidetxt: function(elements, e) { //移除文字激活
				elements.find(e).find(".act").removeClass("act");
			}
		},		
		slide: {
			start: function(elements, pic_index, options, util, fn) {
				var self = this,
				num = options.slideLength,
				ele = elements.find(options.slideClass),
				autoplay = options.autoplay,
				imgTemplate = options.imgTemplate,
				slideClass = options.slideClass,
				stylePrefix = options.stylePrefix,
				fontTemplate = options.fontTemplate,
				pagination = options.pagination,
				pagingSelect = options.pagingSelect,
				splits = util.splits,
				after = options.after,
				before = options.before;

				self.setTimes = setTimeout(function() {
					self.start(elements, pic_index, options, util, fn);
				}, autoplay);

				fn.call(self, elements, pic_index, options, util, self.setTimes);

				var callObj = {
					total: num,
					ele: ele,
					index: pic_index,
					pause: function() {
						self.closeSlide(self.setTimes);
					},
					play: function() {
						self.setTimes = setTimeout(function() {
							self.start(elements, pic_index, options, util, fn);
						}, autoplay);
					}
				};
				before.call(self, callObj); //每屏动画之前回调			
				util.hidetxt(elements, slideClass); //清除所有文字动画
				self.removeImgStyle(elements, imgTemplate); //清除图片动画style				
				self.addImgStyle(elements, imgTemplate, pic_index, autoplay); //添加图片动画style
				self.fontImgActive(elements, util, imgTemplate, pic_index, stylePrefix, fontTemplate); //文字激活or图片动画			
				ele.eq(pic_index).fadeIn().siblings().fadeOut(); //开始动画				
				self.tabIcon(elements, pagination, pic_index, splits(pagingSelect)); //切换分页小图标				
				pic_index < num - 1 ? pic_index++ : pic_index = 0; //递归规则
				after.call(self, callObj); //每屏播放动画之后回调
			},
			onClickTab: function(elements, pic_index, options, util, setTimes) {
				var self = this;
				elements.find(options.pagination + " span").on('click', function() {
					var that = $(this),
					i = that.index();
					self.slide.closeSlide(setTimes); //停止定时器					
					self.setTimes = setTimeout(function() {
						self.slide.start(elements, i, options, util, self.slide.onClickTab.bind(self));
					}, 200);
				});
			},
			closeSlide: function(ele) {
				clearTimeout(ele);
			},
			addImgStyle: function(elements, ele, i, play) { //添加图片动画style				
				elements.find('.' + $($(ele[i])[0]).attr('class')).css({
					'animation': 'Yl-img_an ' + parseInt(play / 1000 + 1) + 's forwards'
				});
			},
			removeImgStyle: function(elements, ele) {
				var x = Object.keys(elements.find(ele)).length;

				for (var k = 0; k < x; k++) {
					elements.find('.' + $($(ele[k])[0]).attr('class')).css({
						'animation': ''
					});
				}
			},
			tabIcon: function(elements, pagination, pic_index, Select) {
				elements.find(pagination + ' span').eq(pic_index).addClass(Select).siblings().removeClass(Select);
			},
			fontImgActive: function(elements, util, imgTemplate, pic_index, stylePrefix, fontTemplate) {
				util.showtxt(elements.find('.' + $($(imgTemplate[pic_index])[0]).attr('class')), 0);
				var p = Object.keys(fontTemplate).length,
				k = 0,
				v = 0;
				for (; k < p; k++) {
					var x = Object.keys(fontTemplate[k]).length;
					for (; v < x; v++) {
						util.showtxt(elements.find(stylePrefix + pic_index + " ." + $($(fontTemplate[k])[v]).attr('class')), 500);
						util.showtxt(elements.find(stylePrefix + pic_index + " ." + $($(fontTemplate[k])[v]).attr('class')), 500);
						util.showtxt(elements.find(stylePrefix + pic_index + " ." + $($(fontTemplate[k])[v]).attr('class')), 500);
					}
				}
			}
		},
		loads:{
			res:function(str,ele,fn){
				if (str.length !== 0) {
					var self = this,
						resource = str,
						resLen = resource.length,
						loadNum = 0;
					for (var i = 0; i < resLen; i++) {
						var Images = new Image();
						Images.src = resource[i];
						if (Images.complete) { //如果缓存里有这张图片，就是触发complete
							self.getFun(++loadNum, resLen, ele, fn);
							continue;
						}
						Images.onload = function() {
							self.getFun(++loadNum, resLen, ele, fn); //图片加载
						};
					}
				}else{
					fn.call(self,100);
				}
			},
			setNum:function(percent,ele,fn){
				var self=this;
				fn.call(self,percent);
				ele.call(self,percent);		
			},
			getFun:function(loadNum,resLen,ele,fn){
				var self=this;		
				var percent = Math.floor(loadNum / resLen * 100);
				self.setNum(percent,ele,fn);
			}
		},
		render: function() {
			var self = this;
			if ($(self.$element.selector).length > 0) {
				self.loads.res(self.options.resource,self.options.loading,function(e){
					if(e==100){
						self.decon(function(e) {
							//创建包装层Yl-wrapper
							self.$element.children().hasClass(self.util.splits(e.wrapper)) === false ?
								self.util.eachs(self.$element, 1, self.util.splits(e.wrapper), 'div') : '';
							//创建包装层下的循环层
							self.$element.children(e.wrapper).children().hasClass(self.util.splits(e.slideClass)) === false ?
								self.util.eachs(self.$element.children(e.wrapper), e.slideLength, self.util.splits(e.slideClass), 'div', '', '', self.util.splits(e.stylePrefix)) : '';
							//是否创建分页层
							e.pages === true ? (self.$element.find('div').hasClass(self.util.splits(e.pagination)) === false ?
								(self.util.eachs(self.$element, 1, self.util.splits(e.pagination), 'div', 'end'), self.util.eachs(self.$element.find(e.pagination), e.slideLength, '', 'span', '')) :
								'') : '';
							//循环层内添加模板
							self.util.obj([e.imgTemplate, e.fontTemplate, e.customTemplate], function(o) {
								self.util.addTemp(self.$element, o, e.slideClass, e.fontTemplate, e.fontAnimationMode);
							});
							//移除文字激活
							self.util.hidetxt(self.$element, e.slideClass);
							//文字激活or图片动画
							self.slide.fontImgActive(self.$element, self.util, e.imgTemplate, 0, e.stylePrefix, e.fontTemplate);
						});
						//创建页面完成后的回调函数
						self.options.callback.call(self, self.defaults);
						//启动切换slide			
						self.slide.start(self.$element, self.pic_index, self.options, self.util, self.slide.onClickTab.bind(self));
					}
				});
			} else {
				console.log('Component failed！');
			}
		}
	};
	//在插件中使用ylSlide对象
	$.fn.YlSlide = function(options) {
		//创建ylSlide的实体
		var YlSlide = new ylSlide(this, options);
		//调用方法
		return YlSlide.render();
	};
})(jQuery, window, document);


if (typeof define === "function" && (define.amd || define.cmd)) {
	define("YlSlide", [], function() {
		return YlSlide.render();
	});
}