/**
 * Application flow: ask → cast → read.
 *
 * All mutable state lives in the single `state` object below. Every screen is
 * a pure function of that state, so a language switch is simply a re-render.
 *
 * @module main
 */

import { MOTHER_LINE_COUNT, buildChart, lineFromTally } from './geomancy.js';
import { t, lang, toggleLang, onLangChange } from './i18n.js';
import { el, clear, figureGlyph, shield, houseDetail, answerPanel } from './render.js';

const app = document.getElementById('app');
const header = document.getElementById('header');
const footer = document.getElementById('footer');

/**
 * @typedef {Object} State
 * @property {'ask'|'cast'|'reading'} screen
 * @property {string}   question
 * @property {number[]} lines            lines cast so far (max 16)
 * @property {number}   tally            taps since the last placed line
 * @property {import('./geomancy.js').Chart|null} chart
 * @property {number|null} selected      index of the house shown in the detail panel
 * @property {string}   error
 */

/** @type {State} */
const state = {
  screen: 'ask',
  question: '',
  lines: [],
  tally: 0,
  chart: null,
  selected: null,
  error: '',
};

/* ------------------------------------------------------------------ screens */

/** @returns {HTMLElement} */
function askScreen() {
  const strings = t();

  const input = el('input', {
    type: 'text',
    id: 'question',
    class: 'question-input',
    placeholder: strings.askPlaceholder,
    value: state.question,
    autocomplete: 'off',
    maxlength: '160',
  });

  const submit = () => {
    const value = input.value.trim();
    if (!value) {
      state.error = strings.askEmpty;
      render();
      document.getElementById('question')?.focus();
      return;
    }
    state.question = value;
    state.error = '';
    state.screen = 'cast';
    render();
  };

  const form = el('form', {
    class: 'ask',
    onSubmit: (event) => {
      event.preventDefault();
      submit();
    },
  },
    el('h2', { class: 'screen__heading', text: strings.askHeading }),
    el('p', { class: 'screen__hint', text: strings.askHint }),
    el('label', { class: 'sr-only', for: 'question', text: strings.askHeading }),
    input,
    state.error ? el('p', { class: 'error', role: 'alert', text: state.error }) : null,
    el('button', { type: 'submit', class: 'btn btn--primary', text: strings.askSubmit })
  );

  queueMicrotask(() => input.focus());
  return form;
}

/** @returns {HTMLElement} */
function castScreen() {
  const strings = t();
  const placed = state.lines.length;
  const complete = placed >= MOTHER_LINE_COUNT;
  const motherIndex = Math.min(Math.floor(placed / 4), 3);
  const lineIndex = complete ? 4 : (placed % 4) + 1;

  // Live view of the four Mothers as their lines are set.
  const mothers = el('div', { class: 'mothers' },
    ...[0, 1, 2, 3].map((m) =>
      el('div', {
        class: 'mothers__slot',
        'data-active': !complete && m === motherIndex ? 'true' : 'false',
      },
        figureGlyph(state.lines.slice(m * 4, m * 4 + 4), { animate: true }),
        el('span', { class: 'mothers__label', text: String(m + 1) })
      )
    )
  );

  const tapPad = el('button', {
    type: 'button',
    class: 'tap-pad',
    disabled: complete,
    'aria-label': strings.tapPad,
    onClick: () => {
      state.tally += 1;
      updateTally();
    },
  },
    el('span', { class: 'tap-pad__label', text: strings.tapPad }),
    el('span', { class: 'tap-pad__key', text: strings.tapPadHint })
  );

  const tallyDots = el('div', { class: 'tally', id: 'tally', 'aria-hidden': 'true' });

  const advance = () => {
    if (complete) {
      state.chart = buildChart(state.lines);
      state.selected = 14; // open on the Judge
      state.screen = 'reading';
      render();
      return;
    }
    state.lines.push(lineFromTally(state.tally));
    state.tally = 0;
    render();
  };

  const action = el('button', {
    type: 'button',
    class: `btn btn--primary ${complete ? 'btn--ready' : ''}`,
    onClick: advance,
  },
    complete ? strings.castDone : strings.placeLine,
    !complete ? el('span', { class: 'btn__key', text: strings.placeLineHint }) : null
  );

  const section = el('section', { class: 'cast' },
    el('h2', { class: 'screen__question', text: state.question }),
    el('p', { class: 'screen__hint', text: strings.castHint }),
    el('p', { class: 'progress', text: complete ? `16 / 16` : strings.progress(motherIndex + 1, lineIndex) }),
    mothers,
    tapPad,
    tallyDots,
    action
  );

  /** Repaint the tap tally without re-rendering the whole screen. */
  function updateTally() {
    clear(tallyDots);
    for (let i = 0; i < Math.min(state.tally, 24); i++) tallyDots.append(el('i'));
    if (state.tally > 24) tallyDots.append(el('span', { class: 'tally__more', text: '…' }));
  }
  updateTally();

  // Keyboard: space taps, enter advances. Bound per render, released on teardown.
  keyHandler = (event) => {
    if (event.repeat) return;
    if (event.code === 'Space') {
      event.preventDefault();
      if (!complete) {
        state.tally += 1;
        updateTally();
        tapPad.classList.remove('tap-pad--pulse');
        void tapPad.offsetWidth; // restart the animation
        tapPad.classList.add('tap-pad--pulse');
      }
    } else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      event.preventDefault();
      advance();
    }
  };

  return section;
}

/** @returns {HTMLElement} */
function readingScreen() {
  const strings = t();
  const chart = /** @type {import('./geomancy.js').Chart} */ (state.chart);

  const selectedHouse = chart.houses[state.selected ?? 14];
  const detailSlot = el('div', { class: 'detail-slot' }, houseDetail(selectedHouse));

  /**
   * Selecting a house swaps the detail panel and moves the marker. The shield
   * itself is never rebuilt, so it neither flickers nor replays its animation.
   * @param {import('./geomancy.js').House} house
   */
  const select = (house) => {
    state.selected = house.index;
    for (const marked of section.querySelectorAll('.house[aria-current]')) {
      marked.removeAttribute('aria-current');
    }
    const cell = section.querySelector(`#house-${house.key}`);
    cell?.setAttribute('aria-current', 'true');
    cell?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    detailSlot.replaceChildren(houseDetail(house));
  };

  const section = el('section', { class: 'reading' },
    el('h2', { class: 'screen__question', text: state.question }),
    answerPanel(chart, select),
    el('div', { class: 'reading__chart' },
      el('h2', { class: 'screen__heading', text: strings.chartHeading }),
      el('p', { class: 'screen__hint', text: strings.tapHouseHint }),
      el('div', { class: 'chart-scroll' }, shield(chart, select))
    ),
    detailSlot,
    el('button', {
      type: 'button',
      class: 'btn btn--ghost',
      text: strings.newReading,
      onClick: () => {
        Object.assign(state, {
          screen: 'ask', question: '', lines: [], tally: 0,
          chart: null, selected: null, error: '',
        });
        render();
      },
    })
  );

  queueMicrotask(() => {
    section.querySelector(`#house-${selectedHouse.key}`)?.setAttribute('aria-current', 'true');

    // The chart is read from the right, so on a narrow screen — where it
    // scrolls — that is where the reader should start.
    const viewport = section.querySelector('.chart-scroll');
    if (viewport && viewport.scrollWidth > viewport.clientWidth) {
      viewport.scrollLeft = viewport.scrollWidth;
    }
  });

  return section;
}

/* ------------------------------------------------------------------- chrome */

function renderHeader() {
  const strings = t();
  clear(header);
  header.append(
    el('div', { class: 'brand' },
      el('h1', { class: 'brand__title', text: strings.appTitle }),
      el('p', { class: 'brand__subtitle', text: strings.appSubtitle })
    ),
    el('button', {
      type: 'button',
      class: 'lang',
      'aria-label': `${strings.langLabel}: ${strings.langOther}`,
      text: strings.langOther,
      onClick: toggleLang,
    })
  );
}

function renderFooter() {
  const strings = t();
  clear(footer);
  footer.append(
    el('details', { class: 'about' },
      el('summary', { text: strings.aboutHeading }),
      el('p', { text: strings.aboutBody })
    )
  );
}

/* -------------------------------------------------------------------- driver */

/** @type {((event: KeyboardEvent) => void)|null} */
let keyHandler = null;

function render() {
  if (keyHandler) {
    window.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }

  renderHeader();
  renderFooter();
  clear(app);

  const screens = { ask: askScreen, cast: castScreen, reading: readingScreen };
  app.append(screens[state.screen]());
  app.dataset.screen = state.screen;

  if (keyHandler) window.addEventListener('keydown', keyHandler);
}

// A language switch keeps the reading intact — only the words change.
onLangChange(render);

document.documentElement.lang = lang();
render();
