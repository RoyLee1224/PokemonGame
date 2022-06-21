const monsters = {
    Shiba:{
        position:{
            x:300,
            y:330
        },
        image:{
            src:'./img/shiba.png'
        },
        frames: {
            max: 5,
            hold: 60
        },
        animate: true,
        name: "Shiba",
        attacks: [attacks.Tackle,attacks.DogeLoaf]
    },
    Vault:{
        position:{
            x:650,
            y:130
        },
        image:{
            src: './img/monin.PNG'
        },
        frames: {
            max: 2,
            hold: 100
        },
        animate: true,
        isEnemy: true,
        name: "Monin",
        attacks:[attacks.Tackle,]
    }
}
