/**
 * Rendering helpers. Everything that produces DOM lives here; nothing here
 * holds application state.
 *
 * @module render
 */

import { pointCount } from './figures.js';
import { verdict, witnessRelation } from './geomancy.js';
import { t, figureText } from './i18n.js';

/**
 * Terse element builder.
 *
 * @param {string} tag
 * @param {Object|string|Node} [props] attributes, or the first child
 * @param {...(string|Node|null|undefined|false)} children
 * @returns {HTMLElement}
 */
export function el(tag, props, ...children) {
  const node = document.createElement(tag);

  if (props && typeof props === 'object' && !(props instanceof Node)) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = value;
      else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(node.style, value);
      } else {
        node.setAttribute(key, value === true ? '' : String(value));
      }
    }
  } else if (props !== undefined && props !== null) {
    children.unshift(props);
  }

  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Remove every child of a node. @param {Element} node */
export function clear(node) {
  node.replaceChildren();
}

/**
 * Draw a geomantic figure as four rows of one or two points.
 *
 * @param {number[]} lines four values, each 1 or 2; missing lines render as
 *                         empty slots so a figure can be shown while it is
 *                         still being cast
 * @param {Object}   [options]
 * @param {boolean}  [options.animate=false] stagger the rows on appearance
 * @param {number}   [options.total=4]       how many rows to draw in total
 * @returns {HTMLElement}
 */
export function figureGlyph(lines, { animate = false, total = 4 } = {}) {
  const wrap = el('div', { class: 'figure', 'aria-hidden': 'true' });

  for (let row = 0; row < total; row++) {
    const value = lines[row];
    const line = el('span', { class: 'figure__line' });
    if (value === undefined) {
      line.classList.add('figure__line--empty');
    } else {
      for (let dot = 0; dot < value; dot++) line.append(el('i'));
      if (animate) {
        line.classList.add('figure__line--enter');
        line.style.animationDelay = `${row * 70}ms`;
      }
    }
    wrap.append(line);
  }
  return wrap;
}

/**
 * A single house of the shield, as a focusable button.
 *
 * @param {import('./geomancy.js').House} house
 * @param {(house: import('./geomancy.js').House) => void} onSelect
 * @returns {HTMLElement}
 */
export function houseCell(house, onSelect) {
  const strings = t();
  const text = figureText(house.figure);
  const cell = el(
    'button',
    {
      type: 'button',
      class: `house house--${house.rank}`,
      id: `house-${house.key}`,
      'data-nature': house.figure.nature,
      'aria-label': `${house.roman} — ${strings.houseNames[house.key]}: ${house.figure.latin}, ${text.name}`,
      style: { animationDelay: `${house.index * 45}ms` },
      onClick: () => onSelect(house),
    },
    el('span', { class: 'house__roman', text: house.roman }),
    figureGlyph(house.lines),
    el('span', { class: 'house__name', text: house.figure.latin })
  );
  return cell;
}

/**
 * The shield chart: fifteen houses in the traditional four-rank pyramid,
 * read right to left.
 *
 * @param {import('./geomancy.js').Chart} chart
 * @param {(house: import('./geomancy.js').House) => void} onSelect
 * @returns {HTMLElement}
 */
export function shield(chart, onSelect) {
  const grid = el('div', { class: 'shield', role: 'group', 'aria-label': t().chartHeading });
  // Houses I–XV only; the Reconciler stands outside the shield.
  for (const house of chart.houses.slice(0, 15)) {
    grid.append(houseCell(house, onSelect));
  }
  return grid;
}

/**
 * The detail panel for one house: its position, its figure and the figure's
 * interpretation.
 *
 * @param {import('./geomancy.js').House} house
 * @returns {HTMLElement}
 */
export function houseDetail(house) {
  const strings = t();
  const figure = house.figure;
  const text = figureText(figure);

  const attribute = (label, value) =>
    el('div', { class: 'attr' },
      el('dt', { text: label }),
      el('dd', { text: value })
    );

  return el('div', { class: 'detail', 'data-nature': figure.nature },
    el('p', { class: 'detail__position', text: `${house.roman} · ${strings.houseNames[house.key]}` }),
    el('div', { class: 'detail__head' },
      figureGlyph(house.lines),
      el('div', {},
        el('h3', { class: 'detail__latin', text: figure.latin }),
        el('p', { class: 'detail__name', text: text.name }),
        el('p', { class: 'detail__keywords', text: text.keywords.join(' · ') })
      )
    ),
    el('dl', { class: 'detail__attrs' },
      attribute(strings.figurePlanet, strings.planets[figure.planet]),
      attribute(strings.figureElement, strings.elements[figure.element]),
      attribute(strings.figureZodiac, strings.zodiac[figure.zodiac]),
      attribute(strings.figureNature, strings.natures[figure.nature]),
      attribute(strings.figurePoints, String(pointCount(figure)))
    ),
    el('p', { class: 'detail__meaning', text: text.meaning }),
    el('p', { class: 'detail__role', text: strings.rankRoles[house.rank] })
  );
}

/**
 * The reading: the Judge's verdict, the two Witnesses that frame it and the
 * Reconciler that brings it back to the querent.
 *
 * @param {import('./geomancy.js').Chart} chart
 * @param {(house: import('./geomancy.js').House) => void} onSelect
 * @returns {HTMLElement}
 */
export function answerPanel(chart, onSelect) {
  const strings = t();
  const call = verdict(chart);
  const relation = witnessRelation(chart);
  const judgeText = figureText(chart.judge.figure);

  const miniature = (house, label) =>
    el('button', {
      type: 'button',
      class: 'mini',
      'data-nature': house.figure.nature,
      onClick: () => onSelect(house),
    },
      el('span', { class: 'mini__label', text: label }),
      figureGlyph(house.lines),
      el('span', { class: 'mini__latin', text: house.figure.latin }),
      el('span', { class: 'mini__name', text: figureText(house.figure).name })
    );

  return el('section', { class: 'answer', 'data-verdict': call },
    el('h2', { class: 'answer__heading', text: strings.answerHeading }),
    el('p', { class: 'answer__verdict', text: strings.verdicts[call] }),
    el('p', { class: 'answer__body', text: strings.verdictBodies[call](`${chart.judge.figure.latin} — ${judgeText.name}` ) }),
    el('p', { class: 'answer__witnesses', text: strings.witnessRelations[relation] }),
    el('div', { class: 'answer__figures' },
      miniature(chart.rightWitness, strings.houseNames.rightWitness),
      miniature(chart.judge, strings.judgeLabel),
      miniature(chart.leftWitness, strings.houseNames.leftWitness)
    ),
    el('div', { class: 'answer__reconciler' },
      miniature(chart.reconciler, strings.reconcilerLabel),
      el('p', { class: 'answer__reconciler-note', text: strings.rankRoles.reconciler })
    )
  );
}
