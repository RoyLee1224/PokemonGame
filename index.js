const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i <  collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 +i))
}

const battleZonesMap = []
for (let i = 0; i <  battleZonesData.length; i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70 +i))
}

const boundries = []
const offset = {
    x: -785,
    y: -650
}

collisionsMap.forEach((row,i) =>{
    row.forEach((symbol, j) => {
        if(symbol===1025)
        boundries.push(
            new Boundary({
                position:{
                    x: j*Boundary.width + offset.x,
                    y: i*Boundary.height + offset.y
                }
            })
        )
    })
})

const battleZones = []
battleZonesMap.forEach((row,i) =>{
    row.forEach((symbol, j) => {
        if(symbol===1025)
        battleZones.push(
            new Boundary({
                position:{
                    x: j*Boundary.width + offset.x,
                    y: i*Boundary.height + offset.y
                }
            })
        )
    })
})

const image = new Image()
image.src = "./img/Pellet Town.png"

const foregroundImage = new Image()
foregroundImage.src = "./img/foregroundObjects.png"

const playerUpImage = new Image()
playerUpImage.src = "./img/playerUp.png"

const playerLeftImage = new Image()
playerLeftImage.src = "./img/playerLeft.png"

const playerDownImage = new Image()
playerDownImage.src = "./img/playerDown.png"

const playerRightImage = new Image()
playerRightImage.src = "./img/playerRight.png"

const player = new Sprite({
    position: {
        x:canvas.width/2 -192/2.7,
        y:canvas.height/2 -68/2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left:playerLeftImage,
        down:playerDownImage,
        right:playerRightImage,
    }
})

const background = new Sprite({ position:{
    x: offset.x,
    y: offset.y
    },
    image: image
})

const foreground = new Sprite({ position:{
    x: offset.x,
    y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    }
}

const movables = [background, ...boundries, foreground, ...battleZones]

function rectangularCollision({rectangle1,rectangle2}){
    return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.width >= rectangle2.position.y && 
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function OverlappingArea({A,B}){
    return (
        Math.min(A.position.x + A.width,B.position.x + B.width) 
        - Math.max(A.position.x, B.position.x)
        ) *
        (Math.min(A.position.y + A.height,B.position.y + B.height) 
        - Math.max(A.position.y, B.position.y)
    )
}

const triggerRate = 0.01
const battle ={
    initiated: false
}

function animate(){
    const animationId =window.requestAnimationFrame(animate)
    background.draw()
    boundries.forEach(boundary =>{
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()
    
    //activate a battle 
    
    let moving = true
    player.animate = false

    if (battle.initiated) return 

    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed ){
        for (let i = 0; i< battleZones.length; i++){
            const battleZone = battleZones[i]
            const overlappingArea = OverlappingArea({
                A:player,
                B:battleZone
            })
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:battleZone
                })
                && overlappingArea > player.width * player.height / 2
                && Math.random()< triggerRate
            ){
                //detectivate current animation loop
                window.cancelAnimationFrame(animationId)
                
                audio.Map.stop()
                audio.battle.play()


                battle.initiated = true
                gsap.to('.battle-transition', {
                    opacity: 1, 
                    repeat: 3,
                    yoyo: true,
                    duration:0.4,
                    onComplete(){
                        gsap.to(".battle-transition",{
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                initBattle()
                                animateBattle()
                                gsap.to(".battle-transition",{
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    
    if (keys.w.pressed && lastKey === "w"){
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i< boundries.length; i++){
            const boundary = boundries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary,position:{
                        x:boundary.position.x,
                        y:boundary.position.y + 3
                    }}
                })
            ){
            moving = false
                break
            }
        }

        if (moving)
            movables.forEach((movable) =>{
            movable.position.y += 3
        })
    }else if (keys.a.pressed && lastKey === "a"){
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i< boundries.length; i++){
            const boundary = boundries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary,position:{
                        x:boundary.position.x + 3,
                        y:boundary.position.y
                    }}
                })
            ){
            moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) =>{
            movable.position.x += 3
        })    
    }else if (keys.s.pressed && lastKey === "s"){
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i< boundries.length; i++){
            const boundary = boundries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary,position:{
                        x:boundary.position.x,
                        y:boundary.position.y - 20
                    }}
                })
            ){
            moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) =>{
            movable.position.y -= 3
        })
    }else if (keys.d.pressed && lastKey === "d"){
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i< boundries.length; i++){
            const boundary = boundries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary,position:{
                        x:boundary.position.x - 3,
                        y:boundary.position.y 
                    }}
                })
            ){
            moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) =>{
            movable.position.x -= 3
        })
    }
}

let lastKey = ""
window.addEventListener("keydown",(e) => {
    switch(e.key){
        case"w":
            keys.w.pressed = true
            lastKey = "w"
            break
        
        case"a":
            keys.a.pressed = true
            lastKey = "a"
            break
        
        case"s":
            keys.s.pressed = true
            lastKey = "s"
            break
        
        case"d":
            keys.d.pressed = true
            lastKey = "d"
            break
    }
})

window.addEventListener("keyup",(e) => {
    switch(e.key){
        case"w":
            keys.w.pressed = false
            break
        
        case"a":
            keys.a.pressed = false
            break
        
        case"s":
            keys.s.pressed = false
            break
        
        case"d":
            keys.d.pressed = false
            break
    }
})

let clicked = false
addEventListener("click",() => {
    if (!clicked){
        audio.Map.play()
        clicked = true
    }    
})