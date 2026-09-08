/**
 * Tests for the chart derivation. Run with:  node --test test/
 *
 * The logic modules import nothing from the DOM, so they run unchanged in Node.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { FIGURES, figureFor, pointCount } from '../js/figures.js';
import {
  addLines, addFigures, buildChart, lineFromTally,
  verdict, witnessRelation, MOTHER_LINE_COUNT,
} from '../js/geomancy.js';

/** Every possible seed is 2^16; a random sample is plenty for the invariants. */
function randomSeed() {
  return Array.from({ length: MOTHER_LINE_COUNT }, () => (Math.random() < 0.5 ? 1 : 2));
}

test('there are exactly sixteen figures', () => {
  assert.equal(FIGURES.length, 16);
});

test('every figure has a distinct four-line pattern', () => {
  const patterns = new Set(FIGURES.map((f) => f.pattern.join('')));
  assert.equal(patterns.size, 16, 'two figures share a pattern');
});

test('the sixteen patterns cover every combination of four lines', () => {
  const seen = new Set(FIGURES.map((f) => f.pattern.join('')));
  for (const a of [1, 2]) for (const b of [1, 2]) for (const c of [1, 2]) for (const d of [1, 2]) {
    assert.ok(seen.has(`${a}${b}${c}${d}`), `no figure for ${a}${b}${c}${d}`);
  }
});

test('every figure has both language blocks filled in', () => {
  for (const figure of FIGURES) {
    for (const lang of ['de', 'en']) {
      const text = figure.text[lang];
      assert.ok(text?.name, `${figure.latin} is missing a ${lang} name`);
      assert.ok(text.meaning.length > 40, `${figure.latin} has a thin ${lang} meaning`);
      assert.ok(text.keywords.length >= 3, `${figure.latin} needs three ${lang} keywords`);
    }
  }
});

test('Via is all single points, Populus all double', () => {
  assert.equal(figureFor([1, 1, 1, 1]).latin, 'Via');
  assert.equal(figureFor([2, 2, 2, 2]).latin, 'Populus');
  assert.equal(pointCount(figureFor([1, 1, 1, 1])), 4);
  assert.equal(pointCount(figureFor([2, 2, 2, 2])), 8);
});

test('Acquisitio and Amissio are each other reversed', () => {
  const gain = FIGURES.find((f) => f.latin === 'Acquisitio');
  const loss = FIGURES.find((f) => f.latin === 'Amissio');
  assert.deepEqual([...gain.pattern].reverse(), loss.pattern);
});

test('addition follows the parity rule', () => {
  assert.equal(addLines(1, 1), 2);
  assert.equal(addLines(2, 2), 2);
  assert.equal(addLines(1, 2), 1);
  assert.equal(addLines(2, 1), 1);
  // Amissio + Fortuna Minor = Coniunctio
  assert.deepEqual(addFigures([1, 2, 1, 2], [1, 1, 2, 2]), [2, 1, 1, 2]);
  assert.equal(figureFor(addFigures([1, 2, 1, 2], [1, 1, 2, 2])).latin, 'Coniunctio');
});

test('a tally becomes a line by parity alone', () => {
  assert.equal(lineFromTally(0), 2);
  assert.equal(lineFromTally(7), 1);
  assert.equal(lineFromTally(12), 2);
});

test('a chart needs exactly sixteen valid lines', () => {
  assert.throws(() => buildChart([1, 2, 1]), /exactly 16 lines/);
  assert.throws(() => buildChart(Array(16).fill(3)), /must be 1 .* or 2/);
});

test('the Daughters are the Mothers transposed', () => {
  const seed = randomSeed();
  const chart = buildChart(seed);
  const mothers = chart.houses.slice(0, 4).map((h) => h.lines);
  const daughters = chart.houses.slice(4, 8).map((h) => h.lines);

  for (let d = 0; d < 4; d++) {
    for (let i = 0; i < 4; i++) {
      assert.equal(daughters[d][i], mothers[i][d], `daughter ${d} line ${i}`);
    }
  }
});

test('each Niece is the sum of its two parents', () => {
  const chart = buildChart(randomSeed());
  const h = chart.houses;
  assert.deepEqual(h[8].lines, addFigures(h[0].lines, h[1].lines));
  assert.deepEqual(h[9].lines, addFigures(h[2].lines, h[3].lines));
  assert.deepEqual(h[10].lines, addFigures(h[4].lines, h[5].lines));
  assert.deepEqual(h[11].lines, addFigures(h[6].lines, h[7].lines));
});

test('Witnesses, Judge and Reconciler descend correctly', () => {
  const chart = buildChart(randomSeed());
  const h = chart.houses;
  assert.deepEqual(chart.rightWitness.lines, addFigures(h[8].lines, h[9].lines));
  assert.deepEqual(chart.leftWitness.lines, addFigures(h[10].lines, h[11].lines));
  assert.deepEqual(chart.judge.lines, addFigures(chart.rightWitness.lines, chart.leftWitness.lines));
  assert.deepEqual(chart.reconciler.lines, addFigures(chart.judge.lines, h[0].lines));
});

test('the Judge always has an even point count — over 2000 charts', () => {
  const judges = new Set();
  for (let i = 0; i < 2000; i++) {
    const chart = buildChart(randomSeed());
    const points = pointCount(chart.judge.figure);
    assert.equal(points % 2, 0, `${chart.judge.figure.latin} has ${points} points`);
    judges.add(chart.judge.figure.latin);
  }
  // Only these eight figures have an even point count, and all should appear.
  assert.deepEqual([...judges].sort(), [
    'Acquisitio', 'Amissio', 'Carcer', 'Coniunctio',
    'Fortuna Maior', 'Fortuna Minor', 'Populus', 'Via',
  ]);
});

test('the chart is fully determined by its seed', () => {
  const seed = randomSeed();
  const a = buildChart(seed);
  const b = buildChart([...seed]);
  assert.deepEqual(a.houses.map((h) => h.lines), b.houses.map((h) => h.lines));
});

test('every chart yields a verdict and a witness relation', () => {
  const verdicts = new Set();
  for (let i = 0; i < 500; i++) {
    const chart = buildChart(randomSeed());
    const call = verdict(chart);
    assert.ok(['yes', 'qualified-yes', 'open', 'qualified-no', 'no'].includes(call));
    assert.ok(['both-favourable', 'both-unfavourable', 'improving', 'declining', 'mixed']
      .includes(witnessRelation(chart)));
    verdicts.add(call);
  }
  assert.ok(verdicts.size >= 3, 'the verdict rules collapse to too few outcomes');
});

test('all sixteen Mothers of Populus give a Populus Judge', () => {
  // Every line double: transposition and addition both preserve it.
  const chart = buildChart(Array(16).fill(2));
  assert.equal(chart.judge.figure.latin, 'Populus');
  assert.ok(chart.houses.every((h) => h.figure.latin === 'Populus'));
});
