

function Game(){
	this.size = 4//4*4
	this.boxs = $("div[class^='item gr']") //小盒子们
	$('.item').on("webkitAnimationEnd",function(){
		$(this).data('ani','')
	})
}
//在原型上写一些实例间公用的方法
Game.prototype = {
	constructor:Game,
	init:function(){
		this.canPlay = true //当有了结果的时候为false，滑动不生效
		this.nums = [] //这个是我们的数据层
		this.score = 0
		this.makeNumArray()
		this.randomPushGirl()
		this.randomPushGirl()
		this.render()
		this.renderScore()
		this.renderBest()
		
	},
	makeNumArray(){//将一维数组变成二维数组，0代表没东西
		for (var r =0;r<this.size;r++) {
			let arr = []
			for (var c =0;c<this.size;c++) {
				arr.push(0)
			}
			this.nums.push(arr)
		}
	},
	randomPushGirl(){//随机的放入2或者4
		//先找见空位置
		let emptys = []
		for (var r =0;r<this.size;r++) {			
			for (var c =0;c<this.size;c++) {
				if(this.nums[r][c]==0){
					emptys.push({r:r,c:c})
				}
			}
		}
		
		if(emptys.length){
			
			//随机从空位置中找一个位置
			
			let len = emptys.length;
			let ran = Math.floor(Math.random()*len)	
			let empty = emptys[ran]
			let num = Math.random()>0.5?2:4
			this.nums[empty.r][empty.c] = num
		}
		
	},
	render(){//将nums里面的数字反应到视图上
		
		for (var r =0;r<this.size;r++) {			
			for (var c =0;c<this.size;c++) {
				let num = this.nums[r][c]
				let box = this.boxs[r*this.size+c]
				
				switch(num){
					case 0:$(box).data('num',num).html('');break;
					case 2:$(box).data('num',num).html('采女');break;
					case 4:$(box).data('num',num).html('常在');break;
					case 8:$(box).data('num',num).html('贵人');break;
					case 16:$(box).data('num',num).html('嫔');break;
					case 32:$(box).data('num',num).html('容华');break;
					case 64:$(box).data('num',num).html('婕妤');break;
					case 128:$(box).data('num',num).html('贵嫔');break;
					case 256:$(box).data('num',num).html('昭仪');break;
					case 512:$(box).data('num',num).html('妃');break;
					case 1024:$(box).data('num',num).html('贵妃');break;
					case 2048:$(box).data('num',num).html('皇后');break;
				}
				setTimeout(function(){
					$(box).data("ani",'jello')
				},0)
				
			}
		}
	},
	renderScore(){//显示分数
		$("#now").html(this.score)
	},
	sortScores(){
		let scores = localStorage.scores?JSON.parse(localStorage.scores):[]
		let wins = []
		let loses =[]
		scores.forEach(function(item){
			if(item.type=='win'){
				wins.push(item)
			}else{
				loses.push(item)
			}
		})
		wins.sort(function(a,b){			
			return b.score-a.score
		})
		loses.sort(function(a,b){			
			return b.score-a.score
		})
		scores = wins.concat(loses)
		localStorage.scores = JSON.stringify(scores)
		return scores
		
	},
	renderBest(){	
//		console.log(this.sortScores())
		let scores = this.sortScores()
		$("#best").html(scores.length>0?scores[0].score:0)
	},
	swipeDown(){
		//向下滑动的时候，数字会向下运动，遍历的方向是向上的，依次查找离其最近的非零数，如果不相等且自己不为0，不做操作，接着遍历下一位，如果相等的话，当前数的值*=2，非零数=0，如果自身是0，互换位置，且下一次遍历依然从当前的位置开始
		for(var c=0;c<this.size;c++){
			for(var r=this.size-1;r>0;r--){
				//得到最近的非零行数
				let _r = this.downNotZero(r,c)
				if(_r==-1){break;}else{	
					
					this.UpDownJadge(r,c,_r,function(){
						r++
					})
					
				}
				
			}
		}
		
		this.AfterAction()
		
	},
	downNotZero(r,c){//等到当前行的上面最近的非零行数
		for(var _r=r-1;_r>=0;_r--){
			if(this.nums[_r][c]!=0){
				return _r
			}
		}
		return -1	
	},
	swipeUp(){
		
		for(var c = 0;c<this.size;c++){
			for(var r = 0;r<this.size-1;r++){
				let _r = this.upNotZero(r,c)
				if(_r==-1){
					break;
				}else{
					this.UpDownJadge(r,c,_r,function(){
						r--
					})
				}
			}
		}
		this.AfterAction()
	},
	upNotZero(r,c){
		for(var _r=r+1;_r<this.size;_r++){
			if(this.nums[_r][c]!=0){
				return _r
			}
		}
		return -1
	},
	UpDownJadge(r,c,_r,cb){
		if(this.nums[r][c]==this.nums[_r][c]){
			//得分
			this.nums[r][c]*=2;
			this.nums[_r][c]=0;
			this.score += 2
		}else if(this.nums[r][c]==0){
			this.nums[r][c]=this.nums[_r][c]
			this.nums[_r][c]=0
			cb()
		}
	},
	swipeRight(){
		
		for (var r=0;r<this.size;r++) {
			for (var c = this.size-1;c>0;c--) {
				let _c = this.rightNotZero(r,c)
				
				if(_c==-1){break;}else{
					
					this.LeftRightJadge(r,c,_c,()=>{
						c++
					})
				}
				
			}
		}
		this.AfterAction()
	},
	rightNotZero(r,c){
		for(var _c=c-1;_c>=0;_c--){
			if(this.nums[r][_c]!=0){
				return _c
			}
		}
		return -1
	},
	swipeLeft(){
		
		for (var r=0;r<this.size;r++) {
			for (var c = 0;c<this.size-1;c++) {
				let _c = this.leftNotZero(r,c)
				
				if(_c==-1){break;}else{
					this.LeftRightJadge(r,c,_c,()=>{
						c--
					})
				}
				
			}
		}
		this.AfterAction()
	},
	leftNotZero(r,c){
		for(var _c=c+1;_c<this.size;_c++){
			if(this.nums[r][_c]!=0){
				return _c
			}
		}
		return -1
	},
	LeftRightJadge(r,c,_c,cb){
		if(this.nums[r][c]==this.nums[r][_c]){
			//得分
			this.nums[r][c]*=2;
			this.nums[r][_c]=0;
			this.score += 2
		}else if(this.nums[r][c]==0){
			this.nums[r][c]=this.nums[r][_c]
			this.nums[r][_c]=0
			cb()
		}
	},
	AfterAction(){//动作结束后，新增一个随机的2、4，重新渲染、显示分数
		this.randomPushGirl();
		this.render()
		this.renderScore()
		let that = this
		this.judgeResult(function(result){//win lose 
			if(result){
				that.canPlay = false
				let text=result=='win'?'您赢了':'您输了'
				
				that.record(result)//记录分数
				
				mui.confirm('皇上，'+text,'重新开始吗？','是否',function(val){
					if(val.index==0){
						//重新开始
						that.init()
					}
				},'div')
			}
			
		})
		
	},
	judgeResult(cb){//判断是否输赢
		let result = this.isWin()
		if(!result){
			result = this.isLose()
		}
		cb(result)
	},
	isWin(){//判断是否赢了
		for (var r = 0;r<this.size;r++) {
			for (var c = 0;c<this.size;c++) {
				if(this.nums[r][c]==2048){
					return 'win'
				}
			}
		}
		return false
	},
	isLose(){//判断是否输了 只要有空的就输不了，只要前三行的数和它下面的数相等就输不了，只要前三列的数和它右边的数相等就输不了
		for (var r = 0;r<this.size;r++) {
			for (var c = 0;c<this.size;c++) {
				if(this.nums[r][c]==0){
					return false
				}
				
				if(c<this.size-1&&this.nums[r][c]==this.nums[r][c+1]){
					return false
				}
				if(r<this.size-1&&this.nums[r][c]==this.nums[r+1][c]){
					return false
				}
			}
		}
		return 'lose'
		
	},
	record(type){//记录分数
		let scores = localStorage.scores?JSON.parse(localStorage.scores):[]
		scores.push({time:Date.now(),score:this.score,type:type})
		localStorage.scores = JSON.stringify(scores)
		this.sortScores()
		
		mui.plusReady(function(){
			let sort = plus.webview.getWebviewById('sort.html')
			mui.fire(sort,'rerender')
		})
		
	}

}








