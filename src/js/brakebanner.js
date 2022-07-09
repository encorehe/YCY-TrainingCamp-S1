class BrakeBanner{
	constructor(selector){
	   this.app = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		// backgroundColor: 0xff0000,
		   resizeTo:window
	   })

		this.stage = this.app.stage;

		//插入到body
		document.querySelector(selector).appendChild(this.app.view)
		//创建加载器
		this.loader = new PIXI.Loader();
	    // this.loader.add('btn.png','images/btn.png')
		//加载资源
		this.addImg()
		this.loader.load();
		this.loader.onComplete.add(()=>{
			this.showImg();
		})

	}
	formatToHump(value){
		return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
	}
	addImg(){ //添加资源到画布
		let resources = ['brake_bike.png','brake_handlerbar.png','brake_lever.png','btn.png','btn_circle.png'];
		this.resources = resources;
		for(let i of resources){
			this.loader.add(`${i}`,`images/${i}`)
		}
	}
	showImg(){ //显示资源
		// 创建粒子
		let {particleContainer,start,pause} = this.createParticleContainer();
		//显示按住按钮
		let actionButton = this.createActionButton();
		//车架
		let {brakeLeverImg,bikeContainer} = this.createBikeContainer(actionButton);

		// this.stage.addChild(actionButton);

		actionButton.interactive = true;
		actionButton.buttonMode = true;
		actionButton.on("mousedown",()=>{
			// brakeLeverImg.rotation = Math.PI / 180*-30
			gsap.to(brakeLeverImg,{duration:.6,rotation:Math.PI / 180*-30});
			gsap.to(actionButton,{duration:.6,x:360,y:820});
			pause();
		})
		start();
		actionButton.on("mouseup",()=>{
			// brakeLeverImg.rotation = 0
			gsap.to(brakeLeverImg,{duration:.6,rotation:0});
			gsap.to(actionButton,{duration:.6,x:422,y:650});
			start();
		})
		let resize = () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
		}
		window.addEventListener("resize",resize)
		resize();

	}
	createParticleContainer(){
		//创建粒子
		let particleContainer = new PIXI.Container();
		this.stage.addChild(particleContainer)
		particleContainer.pivot.x = window.innerWidth/2
		particleContainer.pivot.y = window.innerHeight/2
		particleContainer.x = window.innerWidth/2
		particleContainer.y = window.innerHeight/2
		particleContainer.rotation = 35*Math.PI/180;


		let particles = [];
		let colors = [0xf1cf54,0xb5cea8,0xf1cf54];
		for (let i = 0;i<10;i++){
			let gr = new PIXI.Graphics();
			gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
			gr.drawCircle(0,0,6);
			gr.endFill();
			let pItem = {
				sx: Math.random() * window.innerWidth,
				sy: Math.random() * window.innerHeight,
				gr:gr
			}
			gr.x = pItem.sx
			gr.y = pItem.sy

			particleContainer.addChild(gr);
			particles.push(pItem)
		}
		let speed = 0;
		function loop(){
			speed+=5
			speed = Math.min(speed,20)
			for(let i = 0; i < particles.length; i++){
				let pItem = particles[i];
				pItem.gr.y+=10;
				if( speed>=20 ){
					pItem.gr.scale.y = 40
					pItem.gr.scale.x = 0.03
				}

				if(pItem.gr.y>window.innerHeight) pItem.gr.y= 0
			}
		}

		function start(){
			speed = 0;
			gsap.ticker.add(loop)
		}

		//粒子有多个颜色
		//向某个角度持续移动
		//按住鼠标停止

		function pause(){
			gsap.ticker.remove(loop)
			for(let i = 0; i < particles.length; i++){
				let pItem = particles[i];
				pItem.gr.scale.y = 1
				pItem.gr.scale.x = 1
				gsap.to(pItem.gr,{duration:.6,x:pItem.sx,y:pItem.sy,ease:'elastic.out'})
			}
		}
		//停止的时候还有一点回弹
		return {particleContainer,pause,start}
	}
	createBikeContainer(actionButton){
		let bikeContainer = new PIXI.Container();
		this.stage.addChild(bikeContainer)

		bikeContainer.scale.x = 0.5
		bikeContainer.scale.y = 0.5
		let bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture);
		let brakeHandlerbarImg = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture);
		let brakeLeverImg = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture);
		bikeContainer.addChild(bikeImage)
		bikeContainer.addChild(brakeLeverImg)
		bikeContainer.addChild(brakeHandlerbarImg)
		bikeContainer.addChild(actionButton)


		brakeLeverImg.pivot.x =   455
		brakeLeverImg.pivot.y =   455

		brakeLeverImg.x =   722
		brakeLeverImg.y =   900
		actionButton.x =   422
		actionButton.y =   650

		return{
			bikeContainer,
			brakeLeverImg,
			actionButton
		}

	}
	createActionButton(){
		let actionButton = new PIXI.Container();


		let btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture);
		let btnCircle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		let btnCircle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		actionButton.addChild(btnImage);
		actionButton.addChild(btnCircle);
		actionButton.addChild(btnCircle2);
		btnImage.pivot.x = btnImage.pivot.y =  btnImage.width/2
		btnCircle.pivot.x = btnCircle.pivot.y =  btnCircle.width/2
		btnCircle2.pivot.x = btnCircle2.pivot.y =  btnCircle2.width/2

		actionButton.x = actionButton.y = 300

		btnCircle.scale.x = btnCircle.scale.y = 0.8
		gsap.to(btnCircle.scale,{duration:1,x:1.3,y:1.3,repeat:-1});
		gsap.to(btnCircle,{duration:1,alpha:0,repeat:-1});
		return actionButton
	}
}