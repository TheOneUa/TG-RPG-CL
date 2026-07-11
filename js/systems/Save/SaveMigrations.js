// ============================================================
//  SAVE MIGRATIONS — приведение старых сохранений к текущей схеме
// ============================================================
// Каждый блок отвечает за переход С конкретной версии на следующую.
// При добавлении новой версии схемы — дописать новый if ниже,
// не трогая предыдущие (миграции применяются последовательно).

function _migrateSave(d, fromVersion) {
    if (fromVersion < 2) {
        // v1→v2: bag мог содержать sword/shield — убираем
        if (d.bag) { delete d.bag.sword; delete d.bag.shield; }
        // Инициализируем новые поля если отсутствуют
        d.inventory    = d.inventory    ?? [];
        d.equipment    = d.equipment    ?? { weapon: null, armor: null, ring: null };
        d.itemUpgrades = d.itemUpgrades ?? {};
        d.enchants     = d.enchants     ?? {};
        d.statPoints   = d.statPoints   ?? 0;
        d.questProgress = d.questProgress ?? { kills:{}, bossKillsQ:0, goldEarned:0, maxDepthQ:0 };
    }
}
