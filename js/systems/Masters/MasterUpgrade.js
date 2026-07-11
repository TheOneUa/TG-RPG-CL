// ============================================================
//  MASTER UI — вкладка "Улучшить"
// ============================================================
Object.assign(MasterUI, {
    renderUpgrade() {
        const p = this.p, m = this.m, res = this.res, masterId = this.masterId;
        // Улучшить надетый предмет (atk или def +1)
        const cost = upgradeCost(masterId);
        const canAfford = p.gold >= cost.gold && (p.resources[m.resource] || 0) >= cost.res;
        const eq = p.equipment || {};
        const equippedItems = Object.entries(eq).filter(([,id]) => id).map(([slot, id]) => ({ slot, id }));

        mbody.innerHTML = this.tabsHtml('upgrade') + `
            <div style="color:#666;font-size:12px;margin-bottom:8px;padding:0 4px">
                Улучшает надетый предмет: +2 к основному бонусу<br>
                Стоимость: 💰${cost.gold}  ${res.icon}${cost.res} за улучшение
            </div>
            ${equippedItems.length === 0
                ? '<div style="color:#444;padding:16px;text-align:center">Наденьте предмет для улучшения</div>'
                : equippedItems.map(({slot, id}) => {
                    const def = ITEM_DEFS[id];
                    if (!def) return '';
                    const itemObj = p._getEquipObj?.(slot) || def;
                    return `<div class="mitem">
                        <div class="micon" style="font-size:22px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)">${def.icon}</div>
                        <div class="minfo">
                            <div class="mname">${def.name}</div>
                            <div class="mdesc">${_itemStatStr(def)}</div>
                            <div class="mprice">💰${cost.gold}  ${res.icon}${cost.res}</div>
                        </div>
                        <button class="mbuy" ${canAfford?'':'disabled'} data-upslot="${slot}">Улучшить</button>
                    </div>`;
                }).join('')}`;

        this.attachTabBtns();
        mbody.querySelectorAll('[data-upslot]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (p.gold < cost.gold || (p.resources[m.resource]||0) < cost.res) return;
                const slot = btn.dataset.upslot;
                const id = p.equipment[slot];
                if (!id) return;
                p.gold -= cost.gold;
                p.resources[m.resource] -= cost.res;
                // Добавляем постоянный бонус к этому предмету через overrides
                if (!p.itemUpgrades) p.itemUpgrades = {};
                if (!p.itemUpgrades[id]) p.itemUpgrades[id] = { atk:0, def:0 };
                const def = ITEM_DEFS[id];
                if (def.atk) p.itemUpgrades[id].atk += 2;
                else if (def.def) p.itemUpgrades[id].def += 2;
                p.recalcEqBonus();
                showQNotif('⬆️ ' + def.name + ' улучшен!');
                sound.play('crit');
                saveGame(true);
                this.render();
            });
        });
    }
});
