const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({ 
    position:{
        x: 0, 
        y: 0
    },
    image: battleBackgroundImage
})

let vault
let shiba 
let renderedSprites
let queue = [] 

let battleAnimationId

function fadeBack(){
    //fade back to back
    gsap.to(".battle-transition",{
        opacity: 1,
        onComplete: () => {
            cancelAnimationFrame(battleAnimationId)
            animate()
            document.querySelector(".userInterface").style.display = "none"
            
            gsap.to(".battle-transition",{
                opacity: 0
            })

            battle.initiated = false
            audio.Map.play()
        }
    })
}

function initBattle() {
    document.querySelector(".userInterface").style.display = "block"
    document.querySelector(".dialogue").style.display = "none"
    document.querySelector("#enemyHealthBar").style.width = "100%"
    document.querySelector("#shibaHealthBar").style.width = "100%"
    document.querySelector(".btn-part").replaceChildren()


    vault = new Monster(monsters.Vault)
    shiba = new Monster(monsters.Shiba)
    renderedSprites  = [vault,shiba]
    queue = [] 
    
    shiba.attacks.forEach(attack => {
        const button = document.createElement("button")
        button.innerHTML = attack.name
        document.querySelector(".btn-part").append(button)
    })

    // eventlistener for attacks 
    document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click",(e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        shiba.attack({
            attack:selectedAttack,
            recipient: vault,
            renderedSprites
        })
        // enemy attacks
        if(vault.health <= 0) {
            queue.push(() => {
                vault.faint()
            })
            queue.push(() => {
                fadeBack()
            })
        }

        const randomAttack= vault.attacks[Math.floor(Math.random() * vault.attacks.length)]
        
        queue.push(() => {
            vault.attack({
                attack:randomAttack,
                recipient: shiba,
                renderedSprites
            })
            
            if(shiba.health <= 0) {
                queue.push(() => {
                    shiba.faint()
                })

                queue.push(() => {
                    fadeBack()
                })
            }
        })
    })
    button.addEventListener('mouseenter', (e) =>{
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector(".attackType").innerHTML = selectedAttack.type
        document.querySelector(".attackType").style.color = selectedAttack.color
    })
})
}

function  animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}
animate()
// initBattle()
// animateBattle()

document.querySelector(".dialogue").addEventListener("click", (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    }else e.currentTarget.style.display = "none"
})