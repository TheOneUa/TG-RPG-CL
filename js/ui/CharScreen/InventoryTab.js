// ============================================================
//  ЭКРАН ПЕРСОНАЖА — вкладка "Инвентарь"
// ============================================================
function _renderInvTab(p) {
    const inv = p.inventory || [];
    const grid = document.getElementById('inv-grid');
    const empty = document.getElementById('inv-empty');

    if (!inv.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = inv.map((item, idx) => {
        const def = ITEM_DEFS[item.type] || {};
        return `<div class="inv-item rarity-${def.rarity||'common'}" data-idx="${idx}">
            <span class="inv-item-icon">${def.icon || '❓'}</span>
            <div class="inv-item-name">${def.name || item.type}</div>
            <div class="inv-item-stats">${_itemStatStr(def)}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.inv-item').forEach(el => {
        bindTapButton(el, () => {
            const idx = parseInt(el.dataset.idx);
            const item = p.inventory[idx];
            if (!item) return;
            const def = ITEM_DEFS[item.type];
            if (!def || def.slot === 'consumable') return;
            p.equip(idx, G.floats);
            _renderCharScreen();
        });
    });
}
