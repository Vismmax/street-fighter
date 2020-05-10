import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    const image = createFighterImage(fighter);
    const name = createElement({tagName:'h2'});
    name.innerText = fighter.name;
    const health = createElement({tagName:'div'});
    health.innerText = `Health: ${fighter.health}`;
    const attack = createElement({tagName:'div'});
    attack.innerText = `Attack: ${fighter.attack}`;
    const defense = createElement({tagName:'div'});
    defense.innerText = `Defense: ${fighter.defense}`;
    fighterElement.append(image, name, health, attack, defense);
  } else if (fighter === false) {
    fighterElement.innerText = 'Failed to load fighter';
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
