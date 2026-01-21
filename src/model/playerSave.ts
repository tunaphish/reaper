type SeenEnemy =  {
    enemyName: string,
    seenAt: number, 
}

type PlayerSave = {
    spirits: number
    seenEnemies: SeenEnemy[]
}


//   meta: {
//     version: number
//     timestamp: number
//   }

//   player: {
//     level: number
//     xp: number
//     stats: Record<string, number>
//   }

    // items: { id: string; qty: number }[]
//   progression: {
//     flags: Record<string, boolean>
//     unlockedAbilities: string[]
//   }

//   settings?: {
//     volume: number
//     textSpeed: number
//   }