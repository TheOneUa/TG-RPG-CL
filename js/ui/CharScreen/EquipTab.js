// ============================================================
//  ЭКРАН ПЕРСОНАЖА — вкладка "Экипировка"
// ============================================================
function _renderEquipTab(p) {
    const EQ_SLOTS = [
        { id: 'weapon', name: 'Оружие',   icon: '⚔️' },
        { id: 'armor',  name: 'Броня',     icon: '🛡️' },
        { id: 'ring',   name: 'Кольцо',    icon: '💍' },
    ];
    const eq = p.equipment || {};
    const bonus = p.eqBonus || {};

    document.getElementById('eq-slots').innerHTML = EQ_SLOTS.map(sl => {
        const itemId = eq[sl.id];
        const def = itemId ? ITEM_DEFS[itemId] : null;
        const stats = def ? _itemStatStr(def) : '';
        return `<div class="eq-slot-row">
            <span class="eq-slot-icon">${def ? def.icon : sl.icon}</span>
            <div class="eq-slot-info">
                <div class="eq-slot-name">${def ? def.name : sl.name + ' — пусто'}</div>
                <div class="eq-slot-stats">${stats}</div>
            </div>
            ${def ? `<button class="eq-slot-btn" data-slot="${sl.id}">Снять</button>` : ''}
        </div>`;
    }).join('');

    document.querySelectorAll('.eq-slot-btn').forEach(btn => {
        bindTapButton(btn, () => {
            p.unequip(btn.dataset.slot, G.floats);
            _renderCharScreen();
        });
    });

    const bonusLines = Object.entries(bonus).filter(([,v]) => v > 0)
        .map(([k,v]) => (STAT_GAINS[k]?.icon || '⬆️') + ' +' + (['spd','atkSpd'].includes(k) ? v.toFixed(2) : Math.round(v)));
    document.getElementById('eq-bonus-info').innerHTML = bonusLines.length
        ? 'Бонусы: ' + bonusLines.map(l => `<span>${l}</span>`).join(' ')
        : 'Наденьте предметы для получения бонусов';
}
