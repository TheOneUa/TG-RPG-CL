// ============================================================
//  ПРЕДМЕТЫ — таблица лута из монстров
// ============================================================
// slot: 'weapon' | 'armor' | 'ring' | 'consumable'
// rarity: 'common' | 'rare' | 'epic'
const ITEM_DEFS = {
    // Зелья (расходники)
    hpPot:        { name: 'Зелье HP',      icon: '🧪', slot: 'consumable', col: '#c83232' },
    mpPot:        { name: 'Зелье MP',      icon: '💧', slot: 'consumable', col: '#3c78dc' },
    gold:         { name: 'Золото',        icon: '💰', slot: 'consumable', col: '#ffd700' },

    // Оружие (equipable)
    sword_iron:   { name: 'Железный меч',  icon: '⚔️', slot: 'weapon', rarity: 'common', atk: 8,  col: '#969190' },
    sword_steel:  { name: 'Стальной меч',  icon: '🗡️', slot: 'weapon', rarity: 'rare',   atk: 16, col: '#b0c8e0' },
    bow_wood:     { name: 'Деревянный лук', icon: '🏹', slot: 'weapon', rarity: 'common', atk: 7,  col: '#8b5e3c' },
    bow_elven:    { name: 'Эльфийский лук', icon: '🪄', slot: 'weapon', rarity: 'rare',   atk: 14, col: '#4a9a5a' },
    staff_oak:    { name: 'Дубовый посох',  icon: '🪄', slot: 'weapon', rarity: 'common', atk: 6, mp: 10, col: '#6a4a8a' },
    staff_crystal:{ name: 'Хрустальный посох','icon': '💎', slot: 'weapon', rarity: 'rare', atk: 12, mp: 25, col: '#8a5aaa' },

    // Броня (equipable)
    armor_leather:{ name: 'Кожаная броня', icon: '🥋', slot: 'armor', rarity: 'common', def: 4,  col: '#8b5e3c' },
    armor_chain:  { name: 'Кольчуга',      icon: '🛡️', slot: 'armor', rarity: 'rare',   def: 10, col: '#a0a8b0' },
    armor_robe:   { name: 'Мантия',        icon: '👘', slot: 'armor', rarity: 'common', def: 2,  mp: 15, col: '#5a3a7a' },

    // Кольца (equipable)
    ring_hp:      { name: 'Кольцо жизни',    icon: '💍', slot: 'ring', rarity: 'rare', hp: 20, col: '#c83232' },
    ring_atk:     { name: 'Кольцо силы',     icon: '💍', slot: 'ring', rarity: 'rare', atk: 5, col: '#ff8800' },
    ring_spd:     { name: 'Кольцо ветра',    icon: '💍', slot: 'ring', rarity: 'epic', spd: 0.3, col: '#44aaff' },
    ring_speed:   { name: 'Кольцо быстрого клинка', icon: '⚡', slot: 'ring', rarity: 'epic', atkSpd: 0.3, col: '#ffee44' },
};

// Таблицы дропа: { itemId: вес } — чем больше вес, тем чаще
const DROP_TABLE_COMMON = {
    hpPot: 30, mpPot: 20, gold: 25,
    sword_iron: 8, bow_wood: 8, staff_oak: 8,
    armor_leather: 7, armor_robe: 5,
};
const DROP_TABLE_RARE = {
    hpPot: 20, mpPot: 15, gold: 20,
    sword_iron: 8, bow_wood: 8, staff_oak: 8,
    sword_steel: 6, bow_elven: 6, staff_crystal: 5,
    armor_leather: 6, armor_chain: 5, armor_robe: 4,
    ring_hp: 4, ring_atk: 4,
};
const DROP_TABLE_BOSS = {
    sword_steel: 12, bow_elven: 12, staff_crystal: 10,
    armor_chain: 10, ring_hp: 8, ring_atk: 8, ring_spd: 5, ring_speed: 4,
    hpPot: 15, mpPot: 10, gold: 30,
};

function weightedRandom(table) {
    const total = Object.values(table).reduce((a,b) => a+b, 0);
    let r = Math.random() * total;
    for (const [key, w] of Object.entries(table)) {
        r -= w;
        if (r <= 0) return key;
    }
    return Object.keys(table)[0];
}

function rollLoot(isBoss, depth) {
    const drops = [];
    if (isBoss) {
        // Босс: 2-3 гарантированных дропа
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) drops.push(weightedRandom(DROP_TABLE_BOSS));
    } else {
        // Обычный враг: ~35% шанс на дроп
        if (Math.random() < 0.35) {
            const table = depth >= 5 ? DROP_TABLE_RARE : DROP_TABLE_COMMON;
            drops.push(weightedRandom(table));
        }
    }
    return drops;
}

// Строка вида "⚔️+5 🛡️+2" для отображения бонусов предмета.
// Используется: ui/CharScreen (экипировка/инвентарь) и systems/Masters (улучшение).
function _itemStatStr(def) {
    if (!def) return '';
    const parts = [];
    if (def.atk)    parts.push('⚔️+' + def.atk);
    if (def.def)    parts.push('🛡️+' + def.def);
    if (def.hp)     parts.push('❤️+' + def.hp);
    if (def.mp)     parts.push('💧+' + def.mp);
    if (def.spd)    parts.push('💨+' + def.spd);
    if (def.atkSpd) parts.push('⚡+' + def.atkSpd);
    return parts.join(' ');
}
