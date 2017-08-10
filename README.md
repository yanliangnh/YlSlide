YlSlide幻灯插件
---
### 基本用法：

---

1、先引入jquery库、YlSlide插件及依赖的css文件
```
<script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/jquery.Yl.Slide.min.js"></script>
<link rel="stylesheet" href="css/css.css" type="text/css">
```
2、JS部分

```
			$(document).ready(function() {
				//基本用法
				$('.Yl-container').YlSlide({
					wrapper:'.Yl-wrapper',//包装层
					slideClass:'.Yl-slide',//循环层
					stylePrefix:'.Yl-',//循环层附加样式前缀(如要修改对应的CSS也需修改)
					slideLength:3,//视图个数
					pages:true,//是否开启分页
					pagination:'.Yl-pagination',//分页样式
					pagingSelect:'.Yl-pagination-bullet-active',//分页选中样式
					autoplay:5000,//每个视图切换毫秒数	
					imgTemplate:{//图片模板
						0:['<div class="Yl-img0"></div>'],
						1:['<div class="Yl-img1"></div>'],
						2:['<div class="Yl-img2"></div>']
					},
					fontTemplate:{//文字模板
					0:['<div class="Yl-font0">ALL ABOUT US</div>','<div class="Yl-font1">“成就中国人的事业”是我们亘古不变的使命</div>','<div class="Yl-font2">只为一建提分</div>'],
					1:['<div class="Yl-font0">SINCE 2002</div>','<div class="Yl-font1">十五年专注一建教学，行业的佼佼者</div>','<div class="Yl-font2">只为一建提分</div>'],
					2:['<div class="Yl-font0">CHANCE FOR YOU</div>','<div class="Yl-font1">更高效的学习方式，让学员花费更少的时间</div>','<div class="Yl-font2">只为一建提分</div>']
					},
					fontAnimationMode:{//文字动画模式
						0:['fadeInUp','fadeInUp','slideInLeft'],
						1:['fadeInUp','fadeInUp','slideInLeft'],
						2:['fadeInUp','fadeInUp','slideInLeft']
					},
					customTemplate:{//自定义模板（可用作按钮模板）
						0:['<div class="Yl-Button"><a href="javascript:void(0);">开启专属你的备考之旅</a></div>'],
						1:['<div class="Yl-Button"><a href="javascript:void(0);">开启专属你的备考之旅</a></div>'],
						2:['<div class="Yl-Button"><a href="javascript:void(0);">开启专属你的备考之旅</a></div>']
					},
					resource:[//slide所需的图片资源
						'images/layer1.jpg',
						'images/layer2.jpg',
						'images/layer3.jpg'
					],
					loading:function(e){//加载过程中回调函数
						$("#Percent").text(e+'%'); //设置百分数到DOM上
						if (e == 100) {
							$("#Percent").remove();
						}
					},
					callback:function(e){//整个DOM加载完成后的回调函数
												
					},
					before: function(e) {//每个视图切换前的回调函数
						
					}, 
					after: function(e) {//每个视图切换完成后的回调函数
						
					}
				});
			});


```
3.界面部分

```
<div class="Yl-container">
	<div id="Percent"></div> //预加载百分比显示层
</div>
```

---
### 效果展示

1. 基本展示[：https://yanliangnh.github.io/YlSlide/index.html](https://yanliangnh.github.io/YlSlide/index.html) 
2. 一页多屏[：https://yanliangnh.github.io/YlSlide/multiScreen.html](https://yanliangnh.github.io/YlSlide/multiScreen.html)
3. cmd&amd模式[：https://yanliangnh.github.io/YlSlide/YlSlideSeajs.html](https://yanliangnh.github.io/YlSlide/YlSlideSeajs.html)

---

### 回调部分
```
callback:function(e){//整个DOM加载完成后的回调函数
	//e为整个插件的所有方法和属性，自行输入console.log（e）查看具体自己需要的！										
}
				
```


```
before: function(e) {//每个视图切换前的回调函数
    //此处的e为控制当前视图的
    //当前序号：e.index
    //总视图：e.total
    //整个包装层的DOM对象:e.ele
    //停止播放：e.pause()
    //开始播放：e.play()
}
```

```
after: function(e) {//页面切换完成后的回调函数
    //同before回调函数用法						
}
```
```
resource:[//slide所需的图片资源
	'images/layer1.jpg',
	'images/layer2.jpg',
	'images/layer3.jpg'
]

loading:function(e){//加载过程中回调函数
	$("#Percent").text(e+'%'); //设置百分数到DOM上
		if (e == 100) {
			$("#Percent").remove();
		}
}

```

