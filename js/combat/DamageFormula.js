// ============================================================
//  DAMAGE FORMULA — единая формула урона для всех источников
//  (ближний бой, стрелы, файрбол, урон по игроку)
// ============================================================
// Броня снижает урон по формуле убывающей отдачи (как в MOBA-играх):
//   reduction = armor / (armor + K)
// где K — константа масштаба (чем больше K, тем слабее влияет броня).
// Это не даёт броне превращать персонажа в неуязвимого — даже при
// огромной защите какой-то процент урона всегда проходит.
const ARMOR_K = 50;

function armorReduction(armor) {
    const a = Math.max(0, armor || 0);
    return a / (a + ARMOR_K); // 0..~0.9, никогда не достигает 1
}

// Применить броню к сырому урону, минимум 1 урон всегда проходит
function applyArmor(rawDamage, armor) {
    const reduced = rawDamage * (1 - armorReduction(armor));
    return Math.max(1, Math.round(reduced));
}

// ============================================================
//  КРИТИЧЕСКИЙ УДАР
// ============================================================
const BASE_CRIT_CHANCE = 0.15;   // базовый шанс крита у игрока
const CRIT_MULTIPLIER  = 2.0;    // множитель урона при крите

// Считает итоговый шанс крита с учётом зачарований и способностей
function getCritChance(attacker) {
    if (!attacker) return BASE_CRIT_CHANCE;
    let chance = BASE_CRIT_CHANCE;
    // Бонус от зачарования "Острое лезвие" (critup)
    if (attacker._enchantCrit) chance += attacker._enchantCrit;
    // Способность мечника "Кровавая ярость" — гарантированный крит
    if (attacker.cls === 'warrior' && attacker.abilityActive > 0) return 1.0;
    return Math.min(1, chance);
}

// ============================================================
//  ОСНОВНАЯ ФОРМУЛА УРОНА
// ============================================================
// attacker: объект с .atk (число или уже готовое значение урона)
// defender: объект с .def (броня)
// options: { isPlayerAttacking: bool, forceCrit: bool, baseDamage: number }
//
// Возвращает { damage, isCrit }
function computeDamage(attackerAtk, defenderDef, attacker, options = {}) {
    const rawBase = options.baseDamage ?? attackerAtk;
    // Небольшой разброс урона ±10% для живости чисел (кроме снарядов — они стабильны)
    const variance = options.noVariance ? 1 : (0.9 + Math.random() * 0.2);
    let base = rawBase * variance;

    const critChance = options.forceCrit ? 1 : getCritChance(attacker);
    const isCrit = Math.random() < critChance;
    if (isCrit) base *= CRIT_MULTIPLIER;

    const finalDamage = applyArmor(base, defenderDef);
    return { damage: finalDamage, isCrit };
}

// ============================================================
//  ПРИМЕНЕНИЕ LIFESTEAL (похищение жизни)
// ============================================================
function applyLifesteal(attacker, damageDealt) {
    if (!attacker || !attacker.enchants) return 0;
    const hasLifesteal = Object.values(attacker.enchants).includes('lifesteal');
    if (!hasLifesteal) return 0;
    const heal = Math.round(damageDealt * 0.05); // 5% урона → HP
    if (heal > 0 && attacker.hp < attacker.maxhp) {
        attacker.hp = Math.min(attacker.maxhp, attacker.hp + heal);
        return heal;
    }
    return 0;
}
