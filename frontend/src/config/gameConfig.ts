export interface GameConfig {
    sessionTime: number;
    enemySpawnTime: number;

    player: {
        health: number;
        speed: number;
        rotationSpeed: number;
    };

    projectile: {
        speed: number;
        damage: number;
        lifetime: number;
    };

    chaser: {
        health: number;
        speed: number;
        damage: number;
    };

    shooter: {
        health: number;
        speed: number;
        attackRange: number;
        damage: number;
        cooldown: number;
    };
}

export const defaultGameConfig: GameConfig = {
    sessionTime: 120,
    enemySpawnTime: 5,

    player: {
        health: 100,
        speed: 200,
        rotationSpeed: 3,
    },

    projectile: {
        speed: 500,
        damage: 20,
        lifetime: 2,
    },

    chaser: {
        health: 50,
        speed: 120,
        damage: 20,
    },

    shooter: {
        health: 70,
        speed: 80,
        attackRange: 500,
        damage: 10,
        cooldown: 1.5,
    },
};