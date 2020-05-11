import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let fighterOne = {
      fighter: firstFighter,
      health: firstFighter.health,
      blockCriticalHit: false,
      indicator: document.getElementById('left-fighter-indicator')
    }
    let fighterTwo = {
      fighter: secondFighter,
      health: firstFighter.health,
      blockCriticalHit: false,
      indicator: document.getElementById('right-fighter-indicator')
    }
    let pressedKeys = new Set();

    document.addEventListener('keydown', (event) => {
      pressedKeys.add(event.code);
      switch (event.code) {
        case controls.PlayerOneAttack:
          if (!pressedKeys.has(controls.PlayerOneBlock) && !pressedKeys.has(controls.PlayerTwoBlock)) {
            strike(fighterOne, fighterTwo);
          }
          break;
        case controls.PlayerTwoAttack:
          if (!pressedKeys.has(controls.PlayerTwoBlock) && !pressedKeys.has(controls.PlayerOneBlock)) {
            strike(fighterTwo, fighterOne);
          }
          break;
      }
      if (!fighterOne.blockCriticalHit &&
          controls.PlayerOneCriticalHitCombination.includes(event.code) &&
          checkKeysCriticalHit(controls.PlayerOneCriticalHitCombination, pressedKeys)) {
        strike(fighterOne, fighterTwo, true);
      }
      if (!fighterTwo.blockCriticalHit &&
          controls.PlayerTwoCriticalHitCombination.includes(event.code) &&
          checkKeysCriticalHit(controls.PlayerTwoCriticalHitCombination, pressedKeys)) {
        strike(fighterTwo, fighterOne, true)
      }

    });

    document.addEventListener('keyup', (event) => {
      pressedKeys.delete(event.code);
    });

    function strike(attacker, defender, isCritical=false) {
      let damage;
      if (isCritical) {
        damage = getCriticalDamage(attacker.fighter);
        attacker.blockCriticalHit = true;
        setTimeout(() => { attacker.blockCriticalHit = false }, 10000);
      } else {
        damage = getDamage(attacker.fighter, defender.fighter);
      }
      defender.health -= damage;
      console.log(defender.health);
      setFighterHealthBar(defender);
      if (defender.health <= 0) resolve(attacker.fighter);
    }
  });
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);
  let damage = hitPower - blockPower;
  damage = damage > 0 ? damage : 0;
  return damage;
}

export function getCriticalDamage(attacker) {
  const damage = attacker.attack * 2;
  return damage;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  const power = fighter.attack * criticalHitChance;
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  const power = fighter.defense * dodgeChance;
  return power;
}

function checkKeysCriticalHit(keys, pressed) {
  for (let key of keys) {
    if (!pressed.has(key)) {
      return false;
    }
  }
  return true;
}

function setFighterHealthBar(player) {
  let percent = player.health * 100 / player.fighter.health;
  if (percent < 0) percent = 0;
  player.indicator.style.width = `${percent}%`;
}
