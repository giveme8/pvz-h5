// 游戏常量配置 - 单一数据源
export const CONFIG = {
  // 画布尺寸
  WIDTH: 900,
  HEIGHT: 600,

  // 网格系统 (5行 × 9列)
  GRID: {
    ROWS: 5,
    COLS: 9,
    CELL_SIZE: 80,
    OFFSET_X: 120,  // 左侧预留给植物选择栏
    OFFSET_Y: 80,   // 顶部预留给HUD
  },

  // 阳光系统
  SUN: {
    INITIAL: 150,
    DROP_INTERVAL: 10000,  // 10秒天降阳光
    DROP_AMOUNT: 25,
  },

  // 植物定义
  PLANTS: {
    SUNFLOWER: {
      key: 'sunflower',
      name: '向日葵',
      cost: 50,
      hp: 300,
      color: 0xFFD700,
      sunProduceInterval: 24000,  // 24秒产阳光
      sunProduceAmount: 25,
    },
    PEASHOOTER: {
      key: 'peashooter',
      name: '豌豆射手',
      cost: 100,
      hp: 300,
      color: 0x2ECC71,
      fireInterval: 1500,
      projectileDamage: 20,
      projectileSpeed: 300,
    },
    WALLNUT: {
      key: 'wallnut',
      name: '坚果墙',
      cost: 50,
      hp: 4000,
      color: 0xD4A017,
    },
  },

  // 僵尸定义
  ZOMBIES: {
    NORMAL: {
      key: 'zombie_normal',
      name: '普通僵尸',
      hp: 200,
      color: 0x7DB87D,
      speed: 30,
      damage: 100,
      attackInterval: 1000,
      score: 100,
    },
    CONE: {
      key: 'zombie_cone',
      name: '路障僵尸',
      hp: 560,
      color: 0x6B8E6B,
      speed: 25,
      damage: 100,
      attackInterval: 1000,
      score: 200,
    },
  },

  // 波次配置 (3波)
  WAVES: [
    { delay: 5000,  zombies: [{ type: 'NORMAL', count: 3, interval: 3000 }] },
    { delay: 30000, zombies: [{ type: 'NORMAL', count: 3, interval: 2000 }, { type: 'CONE', count: 1, interval: 2000 }] },
    { delay: 60000, zombies: [{ type: 'NORMAL', count: 4, interval: 1500 }, { type: 'CONE', count: 2, interval: 2000 }] },
  ],

  // 颜色主题
  COLORS: {
    BG: 0x5C8A3C,
    GRID_EVEN: 0x6AA346,
    GRID_ODD: 0x5C9E3A,
    GRID_HOVER: 0x88CC55,
    UI_BG: 0x2C4A1E,
    SUN_COLOR: 0xFFD700,
    HP_RED: 0xFF4444,
    HP_GREEN: 0x44FF44,
  },
}
