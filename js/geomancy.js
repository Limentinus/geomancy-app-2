/**
 * The geomantic shield chart — pure logic, no DOM.
 *
 * A reading begins with sixteen lines, generated one at a time. Every four
 * lines form a Mother. From the four Mothers the rest of the chart is derived
 * by two operations only:
 *
 *   - transposition: the Daughters are the Mothers read down the columns
 *                    instead of across the rows
 *   - addition:      two figures are added line by line; two points if the
 *                    pair is even, one point if it is odd
 *
 * The chart is therefore fully determined by the sixteen initial lines. Nothing
 * in this module touches the page, which makes the whole derivation testable.
 *
 * @module geomancy
 */

import { figureFor, pointCount } from './figures.js';

/** Number of lines the querent generates by hand. */
export const MOTHER_LINE_COUNT = 16;

/** The fifteen houses of the shield, plus the Reconciler. */
export const HOUSE_KEYS = /** @type {const} */ ([
  'mother1', 'mother2', 'mother3', 'mother4',
  'daughter1', 'daughter2', 'daughter3', 'daughter4',
  'niece1', 'niece2', 'niece3', 'niece4',
  'rightWitness', 'leftWitness',
  'judge',
  'reconciler',
]);

/** Roman numerals for the fifteen shield houses; the Reconciler sits outside. */
const ROMAN = [
  'I', 'II', 'III', 'IV',
  'V', 'VI', 'VII', 'VIII',
  'IX', 'X', 'XI', 'XII',
  'XIII', 'XIV',
  'XV',
  'XVI',
];

/** Which rank of the chart each house belongs to — used for grouping in the UI. */
const RANK = [
  'mothers', 'mothers', 'mothers', 'mothers',
  'daughters', 'daughters', 'daughters', 'daughters',
  'nieces', 'nieces', 'nieces', 'nieces',
  'witnesses', 'witnesses',
  'judge',
  'reconciler',
];

/**
 * @typedef {Object} House
 * @property {string}   key     one of HOUSE_KEYS
 * @property {string}   roman   Roman numeral of the position
 * @property {string}   rank    mothers | daughters | nieces | witnesses | judge | reconciler
 * @property {number}   index   0-based position in the chart
 * @property {number[]} lines   the four lines, top to bottom
 * @property {import('./figures.js').Figure} figure
 */

/**
 * @typedef {Object} Chart
 * @property {House[]} houses          all sixteen houses, in chart order
 * @property {House}   judge           convenience handle on house XV
 * @property {House}   rightWitness    convenience handle on house XIII
 * @property {House}   leftWitness     convenience handle on house XIV
 * @property {House}   reconciler      convenience handle on house XVI
 * @property {number[]} seed           the sixteen lines the chart was built from
 */

/**
 * Add two lines. Even sum yields a passive (double) line, odd an active (single).
 *
 * @param {number} a 1 or 2
 * @param {number} b 1 or 2
 * @returns {1|2}
 */
export function addLines(a, b) {
  return (a + b) % 2 === 0 ? 2 : 1;
}

/**
 * Add two figures line by line.
 *
 * @param {number[]} a four lines
 * @param {number[]} b four lines
 * @returns {number[]} four lines
 */
export function addFigures(a, b) {
  return a.map((line, i) => addLines(line, b[i]));
}

/**
 * Convert a tally of taps into a single line.
 *
 * The querent taps an uncounted number of times; only the parity survives,
 * which is the digital equivalent of striking a row of marks in sand and
 * seeing whether an odd or even number remain.
 *
 * @param {number} tally
 * @returns {1|2}
 */
export function lineFromTally(tally) {
  return tally % 2 === 0 ? 2 : 1;
}

/**
 * Build the complete shield chart from the sixteen generated lines.
 *
 * @param {number[]} seed sixteen values, each 1 or 2; lines 0–3 are the first
 *                        Mother, 4–7 the second, and so on
 * @returns {Chart}
 * @throws {Error} if the seed is the wrong length or holds anything but 1 and 2
 */
export function buildChart(seed) {
  if (!Array.isArray(seed) || seed.length !== MOTHER_LINE_COUNT) {
    throw new Error(`A chart needs exactly ${MOTHER_LINE_COUNT} lines, got ${seed?.length}`);
  }
  if (!seed.every((line) => line === 1 || line === 2)) {
    throw new Error('Every line must be 1 (single point) or 2 (double points)');
  }

  // Mothers: four consecutive lines each.
  const mothers = [0, 1, 2, 3].map((m) => seed.slice(m * 4, m * 4 + 4));

  // Daughters: the Mothers transposed. Daughter d takes its i-th line from
  // the d-th line of Mother i.
  const daughters = [0, 1, 2, 3].map((d) => mothers.map((mother) => mother[d]));

  // Nieces: Mothers and Daughters added in pairs.
  const nieces = [
    addFigures(mothers[0], mothers[1]),
    addFigures(mothers[2], mothers[3]),
    addFigures(daughters[0], daughters[1]),
    addFigures(daughters[2], daughters[3]),
  ];

  // Witnesses, Judge, Reconciler.
  const rightWitness = addFigures(nieces[0], nieces[1]);
  const leftWitness = addFigures(nieces[2], nieces[3]);
  const judge = addFigures(rightWitness, leftWitness);
  const reconciler = addFigures(judge, mothers[0]);

  const allLines = [
    ...mothers, ...daughters, ...nieces,
    rightWitness, leftWitness, judge, reconciler,
  ];

  /** @type {House[]} */
  const houses = allLines.map((lines, index) => ({
    key: HOUSE_KEYS[index],
    roman: ROMAN[index],
    rank: RANK[index],
    index,
    lines,
    figure: figureFor(lines),
  }));

  const chart = {
    houses,
    seed: [...seed],
    rightWitness: houses[12],
    leftWitness: houses[13],
    judge: houses[14],
    reconciler: houses[15],
  };

  assertValid(chart);
  return chart;
}

/**
 * The Judge is always the sum of two figures, so each of its lines is even —
 * which means its total point count must be even too. Only eight of the
 * sixteen figures qualify (Via, Populus, Coniunctio, Carcer, both Fortunae,
 * Acquisitio, Amissio). A Judge outside that set means the chart was derived
 * incorrectly, and the traditional instruction is to discard the reading.
 *
 * @param {Chart} chart
 * @throws {Error} if the chart is internally inconsistent
 */
export function assertValid(chart) {
  const points = pointCount(chart.judge.figure);
  if (points % 2 !== 0) {
    throw new Error(
      `Invalid chart: the Judge (${chart.judge.figure.latin}) has ${points} points, ` +
        'but a Judge must always have an even point count.'
    );
  }
}

/**
 * Classify the relationship between the two Witnesses.
 *
 * The right Witness speaks for the querent and the past, the left for the
 * quesited and the future. Their agreement or disagreement colours the Judge's
 * verdict — a good Judge between two bad Witnesses is a thin sort of yes.
 *
 * @param {Chart} chart
 * @returns {'both-favourable'|'both-unfavourable'|'improving'|'declining'|'mixed'}
 */
export function witnessRelation(chart) {
  const right = favourability(chart.rightWitness.figure);
  const left = favourability(chart.leftWitness.figure);

  if (right > 0 && left > 0) return 'both-favourable';
  if (right < 0 && left < 0) return 'both-unfavourable';
  if (right < 0 && left > 0) return 'improving';
  if (right > 0 && left < 0) return 'declining';
  return 'mixed';
}

/**
 * Reduce a figure's nature to a sign: +1 favourable, -1 unfavourable, 0 neutral.
 *
 * @param {import('./figures.js').Figure} figure
 * @returns {-1|0|1}
 */
export function favourability(figure) {
  if (figure.nature === 'good') return 1;
  if (figure.nature === 'bad') return -1;
  return 0;
}

/**
 * The overall verdict, derived from the Judge and tempered by the Witnesses.
 *
 * @param {Chart} chart
 * @returns {'yes'|'qualified-yes'|'open'|'qualified-no'|'no'}
 */
export function verdict(chart) {
  const judge = favourability(chart.judge.figure);
  const relation = witnessRelation(chart);

  if (judge > 0) {
    return relation === 'both-unfavourable' || relation === 'declining' ? 'qualified-yes' : 'yes';
  }
  if (judge < 0) {
    return relation === 'both-favourable' || relation === 'improving' ? 'qualified-no' : 'no';
  }
  return 'open';
}
