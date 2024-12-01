class Bubble { 
    constructor(init_x = null, init_y = null, riseSpeed = 2){ 
        this.x = init_x; 
        this.y = init_y;

        this.color = {
            r: Math.random() * 255, 
            g: Math.random() * 255, 
            b: Math.random() * 255
        }
        this.riseSpeed = riseSpeed; 
        this.maxWiggleX = 2; 
        this.maxWiggleY = 2; 
    }
    init(canvas, ctx){ 
        this.canvas = canvas; 
        this.ctx = ctx;
        this.x = (this.x == null) ? canvas.width/2 : this.x; 
        this.y = (this.y == null) ? canvas.height : this.y;  
    }
    render(){
        this.x += this.maxWiggleX * Math.random() - this.maxWiggleX / 2; 
        this.y -= this.maxWiggleY * Math.random() - this.maxWiggleY / 2 + (this.riseSpeed * Math.random());
        this.ctx.beginPath(); 
        // this.ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
        this.ctx.arc(this.x, this.y, this.canvas.width/50, 0, Math.PI * 2)
        this.ctx.stroke(); 
    }
}
class Flask{ 
    constructor(bubblesCount = 10){ 
        this.bubblesCount = bubblesCount; 
        this.bubbles = []; //for flask animation
    }
    init(canvas, ctx){
        ctx.lineWidth = canvas.width / 100; 
        this.canvas = canvas; 
        this.ctx = ctx; 
        this.flaskPadding = canvas.width / 10; 
        this.flaskImage = new Image(); 
        this.flaskImage.src = "./images/flask.png"; 

        for(let i = 0; i < this.bubblesCount; i++){ 
            //init_x, init_y, rise_speed
            let bubble = new Bubble(canvas.width/2, Math.random() * canvas.height, 2)
            bubble.init(canvas, ctx)
            this.bubbles.push(bubble)
        }
    }
    render(){
        let loopFor = this.bubbles.length;
        for(let i = 0; i < loopFor; i++){ 
            let bubble = this.bubbles[i]
            if(bubble.y < 0){ 
                this.bubbles.splice(i, 1);
                let bubble = new Bubble(); 
                bubble.init(this.canvas, this.ctx)
                this.bubbles.push(bubble)
                loopFor -= 1; 
            }else{ 
                bubble.render();
            }
            
        }
        this.ctx.drawImage(this.flaskImage, this.flaskPadding, this.flaskPadding, this.canvas.width - this.flaskPadding * 2, this.canvas.height - this.flaskPadding)
    }
}
class Planet{ 
    constructor(){ 
        this.curAngle = Math.random() * Math.PI * 2; 
        this.planetSpeed = Math.random() * Math.PI * 2 / 100; 
    }
    init(canvas, ctx, distanceFromSun, planetWidth){
        this.r = planetWidth / 2
        this.distanceFromSun = distanceFromSun;
        this.canvas = canvas; 
        this.ctx = ctx; 
    }
    render(){
        this.curAngle += this.planetSpeed;
        this.x = Math.cos(this.curAngle) * this.distanceFromSun 
        this.y = Math.sin(this.curAngle) * this.distanceFromSun 
        this.ctx.beginPath()
        this.ctx.arc(this.x,this.y,this.r, 0, Math.PI * 2)
        this.ctx.stroke()
    }
}
class Ring{ 
    constructor(){ 

    }

    init(canvas, ctx, radius){ 
        this.canvas = canvas; 
        this.ctx = ctx; 
        this.r = radius; 
    }
    render(){ 
        this.ctx.save()
        this.ctx.lineWidth = .5;
        this.ctx.beginPath()
        this.ctx.arc(0,0,this.r, 0, Math.PI * 2)
        this.ctx.stroke()
        this.ctx.restore()
    }
}
class Sun{ 
    constructor(){ 

    }
    init(canvas, ctx, sunWidth){ 
        this.canvas = canvas
        this.ctx = ctx
        this.r = sunWidth / 2
    }
    render(){ 
        this.ctx.beginPath()
        this.ctx.arc(0,0,this.r, 0, Math.PI * 2)
        this.ctx.stroke()
    }
}
class Orbit{ 
    constructor(count = 5){ 
        this.orbits = []
        this.count = count;
        
    }
    init(canvas, ctx, speed){ 
        this.canvas = canvas
        this.ctx = ctx 
        this.speed = speed
        this.padding = 5; 
        this.sun = new Sun(); 
        this.sun.init(canvas, ctx, this.canvas.width / 20)

        let orbitRadius = this.sun.r + 20; 
        let planetSpacing = (canvas.width / 2 - orbitRadius - this.padding) / this.count; 
        for(let i = 0; i < this.count; i++){ 
            let planet = new Planet()
            let ring = new Ring()
            planet.init(canvas, ctx, orbitRadius, Math.random() * 10)
            ring.init(canvas, ctx, orbitRadius)

            this.orbits.push({ 
                planet, 
                ring
            })
            orbitRadius += planetSpacing
        }
    }
    render(){
        this.ctx.save()
        this.ctx.translate(this.canvas.width / 2, this.canvas.height /2 )

        this.sun.render()
        this.orbits.forEach(orbit => { 
            orbit.planet.render()
            orbit.ring.render()
        })
        this.ctx.restore(); 
    }
}
class ClockHand{ 
    constructor(clockHandData){ 
        this.handData = clockHandData
    }
    init(canvas, ctx){ 
        this.canvas = canvas; 
        this.ctx = ctx; 
    }
    render(){
        let x = Math.cos(this.handData.angle) * this.handData.length; 
        let y = Math.sin(this.handData.angle) * this.handData.length;
        this.handData.angle += this.handData.angleSpeed 
        this.ctx.save(); 
        this.ctx.translate(this.canvas.width/2, this.canvas.height/2)
        this.ctx.beginPath(); 
        this.ctx.moveTo(0, 0); 
        this.ctx.lineTo(x, y); 
        this.ctx.stroke(); 
        this.ctx.restore(); 
    }
}
class Clock{ 
    constructor(){ 

    }
    init(canvas, ctx, time = 0){
        this.canvas = canvas; 
        this.ctx = ctx; 


        let secondArmAngleIncrement = Math.PI / 60 / 12; 
        let minuteArmAngleIncrement = Math.PI / 60 / 60 / 12; 
        let hourArmAngleIncrement = Math.PI / 60 / 60 / 60 / 12; 

        let initSecondArmAngle = Math.PI * (3/2) + secondArmAngleIncrement * time; 
        let initMinuteArmAngle = Math.PI * (3/2) + minuteArmAngleIncrement * time; 
        let initHourArmAngle = Math.PI  * (3/2) + hourArmAngleIncrement * time; 

        let secondHandLength = canvas.width / 2 - canvas.width / 50; 
        let minuteHandLength = canvas.width / 2 - canvas.width / 40; 
        let hourHandLength = canvas.width / 2 - canvas.width / 30; 

        let secondHandData = { 
            x: Math.cos(initSecondArmAngle) * secondHandLength, 
            y: Math.sin(initSecondArmAngle) * secondHandLength, 
            angle: initSecondArmAngle, 
            angleSpeed: secondArmAngleIncrement, 
            length: secondHandLength
        }
        let minuteHandData = { 
            x: Math.cos(initMinuteArmAngle) * minuteHandLength, 
            y: Math.sin(initMinuteArmAngle) * minuteHandLength, 
            angle: initMinuteArmAngle, 
            angleSpeed: minuteArmAngleIncrement, 
            length: minuteHandLength
        }; 
        let hourHandData = { 
            x: Math.cos(initHourArmAngle) * hourHandLength, 
            y: Math.sin(initHourArmAngle) * hourHandLength, 
            angle: initHourArmAngle, 
            angleSpeed: hourArmAngleIncrement, 
            length: hourHandLength
        };
        this.secondHand = new ClockHand(secondHandData); 
        this.minuteHand = new ClockHand(minuteHandData); 
        this.hourHand   = new ClockHand(hourHandData); 
        this.secondHand.init(canvas, ctx, secondArmAngleIncrement); 
        this.minuteHand.init(canvas, ctx, minuteArmAngleIncrement); 
        this.hourHand.init(canvas, ctx, hourArmAngleIncrement); 
    }
    render(){ 
        this.secondHand.render(); 
        this.minuteHand.render(); 
        this.hourHand.render(); 
    }
}
class Scene{ 
    constructor(){ 
        this.render = this.render.bind(this);
        var capturer = new CCapture({
	        framerate: 60,
            format: 'gif', 
            workersPath: './js/',
	        verbose: true
        })
        this.capturer = capturer;
        this.recording = false;
        this.gifLength = 180;
        this.frameCount = 0;
    }

    render(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

        this.ctx.beginPath(); 
        this.ctx.arc(this.canvas.width/2, this.canvas.height/2 , this.canvas.width / 2, 0, Math.PI * 2)
        this.ctx.fillStyle = (this.canvas.getAttribute('animation-background'))  ? this.canvas.getAttribute('animation-background') : 'white'; 
        this.ctx.fill()
        this.widget.render();
        if(this.frameCount < this.gifLength && this.recording){ 
            this.capturer.capture(this.canvas)
            this.frameCount++;
        }else if(this.frameCount === this.gifLength && this.recording){ 
            this.capturer.stop()
            this.capturer.save()
        }
 
        requestAnimationFrame(this.render);
    }
    start(){ 
        requestAnimationFrame(this.render); 
    }
    beginCapture(){ 
        this.recording = true;
        this.capturer.start()
    }
    setAnimationType(){ 
        switch(this.canvas.getAttribute('animation-type').toLowerCase()){ 
            case "flask": 
            this.widget = new Flask(10)
            break;

            case "orbit": 
            this.widget = new Orbit(5)
            break;

            case "clock": 
            this.widget = new Clock(); 
            break; 
        }
    }
    setGIFLength(newLength){ 
        this.gifLength = newLength; 
    }
    init(id) {
        const initializeCanvas = () => {
            console.log('Initializing canvas with ID:', id);
            this.canvas = document.getElementById(id);

            this.ctx = this.canvas.getContext('2d');
            this.setAnimationType();
            this.widget.init(this.canvas, this.ctx);
        };
    
        if (document.readyState === "complete") {
            console.log("COMPLETE")
            initializeCanvas();
        } else {
            console.log("waiting for DOM to load...")
            document.addEventListener("DOMContentLoaded", initializeCanvas);
        }
    }
}
let canvasElements = document.querySelectorAll('canvas')
let scenes = []



canvasElements.forEach(canvasElement => {
    if(canvasElement.getAttribute('animation-type') !== null){ 
        let scene = new Scene()
        scene.init(canvasElement.id)
        scene.start()
        scenes.push(scene)
    }
})
document.addEventListener("DOMContentLoaded", () => { 
    let renderButton = document.getElementById("render")
    let selectType = document.getElementById("canvas-select")
    let output = document.getElementById("canvas-output")
    let recordGIFButton = document.getElementById("generate-gif")
    let canvasWidthInput = document.getElementById("canvas-width")
    let errorMessage = document.getElementById("error-message")
    let GIFLength = document.getElementById('GIF-length')
    let isRenderingMain = false; 

    let renderCanvas
    let renderScene

    let maxGIFFrames = 180

    let width = 100
    let height = 100
    canvasWidthInput.addEventListener("change", (e) => { 
        width = e.target.value
        height = e.target.value
    })
    renderButton.addEventListener("click", () => {

        console.log(document.readyState)
        console.log(selectType.value)
        renderCanvas = document.getElementById("render-canvas")
        let backgroundColor = document.getElementById('canvas-color').value
        renderCanvas.setAttribute("animation-type", selectType.value)
        renderCanvas.setAttribute("animation-background", backgroundColor)
        renderCanvas.width = width; 
        renderCanvas.height = height; 
        renderScene = new Scene()

        renderScene.init(renderCanvas.id)
        renderScene.start()
        isRenderingMain = true
    })
    GIFLength.addEventListener('change', (e) => {
        if(isRenderingMain){ 
            maxGIFFrames = e.target.value * 60; 
            renderScene.setGIFLength(maxGIFFrames)
            console.log(maxGIFFrames)
        }
    })
    recordGIFButton.addEventListener('click', () => {
        if(isRenderingMain){ 
            renderScene.beginCapture()
        }else{ 
            errorMessage.innerHTML = "error: please render a scene before generating GIF"
        }
        this.beginCapture()
    })
})