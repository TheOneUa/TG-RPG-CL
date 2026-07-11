// ============================================================
//  PLAYER EQUIPMENT — экипировка и бонусы от неё
// ============================================================
Object.assign(Player.prototype, {
    // Пересчитать бонусы от надетой экипировки
    recalcEqBonus() {
        const b = { atk: 0, def: 0, hp: 0, mp: 0, spd: 0, atkSpd: 0 };
        const upgrades = this.itemUpgrades || {};
        for (const [slot, itemId] of Object.entries(this.equipment || {})) {
            if (!itemId) continue;
            const def = ITEM_DEFS[itemId];
            if (!def) continue;
            if (def.atk)  b.atk  += def.atk  + (upgrades[itemId]?.atk  || 0);
            if (def.def)  b.def  += def.def  + (upgrades[itemId]?.def  || 0);
            if (def.hp)   b.hp   += def.hp;
            if (def.mp)   b.mp   += def.mp;
            if (def.spd)  b.spd  += def.spd;
            if (def.atkSpd) b.atkSpd += def.atkSpd;
        }
        this.eqBonus = b;

        // Эффективные боевые характеристики = база + бонус экипировки.
        // ВАЖНО: используются в бою (computeDamage/hurt) и в HUD,
        // тогда как this.atk/def/maxhp/maxmp остаются "базой" для
        // статов/левелапа/мастеров — их не трогаем напрямую.
        this.effAtk   = this.atk   + b.atk;
        this.effDef   = this.def   + b.def;
        this.effMaxhp = this.maxhp + b.hp;
        this.effMaxmp = this.maxmp + b.mp;
        this.effSpd   = this.spd   + b.spd;
    },

    // Надеть предмет из инвентаря (по индексу)
    equip(invIdx, floats) {
        const item = this.inventory[invIdx];
        if (!item) return;
        const def = ITEM_DEFS[item.type];
        if (!def || def.slot === 'consumable') return;
        const slot = def.slot; // 'weapon'|'armor'|'ring'

        // Снять текущий предмет в этом слоте
        if (this.equipment[slot]) {
            this.inventory.push({ type: this.equipment[slot] });
        }
        this.equipment[slot] = item.type;
        this.inventory.splice(invIdx, 1);
        this.recalcEqBonus();
        if (floats) floats.push(new FText(this.x, this.y - CFG.TILE, def.icon + ' Надет', '#ffd700', 13));
        sound.play('pickup');
        saveGame(true);
    },

    // Снять экипировку в слоте → в инвентарь
    unequip(slot, floats) {
        if (!this.equipment[slot]) return;
        this.inventory.push({ type: this.equipment[slot] });
        this.equipment[slot] = null;
        this.recalcEqBonus();
        if (floats) floats.push(new FText(this.x, this.y - CFG.TILE, 'Снято', '#aaa', 12));
        saveGame(true);
    }
});
