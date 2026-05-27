// 游戏常量配置 - 单一数据源
export const CONFIG = {
  // 画布尺寸 — 参考目标图匹配
  WIDTH: 1136,
  HEIGHT: 640,

  // 网格系统 (5行 × 9列)
  // 布局: 200px侧栏 + 32px间距 + 9×96=864px网格 + 40px右装饰 = 1136
  //       72px顶HUD + 28px间距 + 5×96=480px网格 + 60px底装饰 = 640
  GRID: {
    ROWS: 5,
    COLS: 9,
    CELL_SIZE: 96,
    OFFSET_X: 232,   // sidebarWidth(200) + buffer(32)
    OFFSET_Y: 100,   // HUD_H(72) + lower(28)
    SIDEBAR_W: 200,  // 左侧植物选择栏宽度
    HUD_H: 72,       // 顶部 HUD 高度
  },

  // 功能开关
  TYPING_ENABLED: false,  // 打字攻击模式（MVP 默认关闭）

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

  // 颜色主题 — 对标参考图深草绿配色
  COLORS: {
    BG: 0x3a7a1e,
    BODY_BG: '#2d5a1b',  // HTML body 背景色
    GRID_EVEN: 0x5a9a2e,
    GRID_ODD: 0x4a8820,
    GRID_HOVER: 0x88CC55,
    UI_BG: 0x1a4a0a,
    SIDEBAR_BG: 0x1a3a0a,
    SUN_COLOR: 0xFFD700,
    HP_RED: 0xFF4444,
    HP_GREEN: 0x44FF44,
    CARD_BORDER: 0xd4a017,  // 金色卡片边框
  },
}
