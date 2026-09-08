/**
 * Bilingual interface strings and the active-language store.
 *
 * Figure interpretations live with the figures themselves (figures.js); this
 * module holds everything that belongs to the interface around them.
 *
 * @module i18n
 */

/** @typedef {'de'|'en'} Lang */

const STORAGE_KEY = 'geomancy.lang';

export const STRINGS = {
  de: {
    appTitle: 'Geomantie',
    appSubtitle: 'Das Schildbild — die Punktkunst der Erde',
    langLabel: 'Sprache',
    langOther: 'English',

    askHeading: 'Stelle deine Frage',
    askHint:
      'Formuliere sie so genau, wie du kannst. Die Kunst antwortet auf das, was gefragt wurde, nicht auf das, was gemeint war.',
    askPlaceholder: 'Wird sich die Sache zu meinen Gunsten wenden?',
    askSubmit: 'Beginnen',
    askEmpty: 'Bitte gib zuerst eine Frage ein.',

    castHeading: 'Setze die sechzehn Linien',
    castHint:
      'Tippe so oft, wie es sich richtig anfühlt — zähle nicht mit. Nur, ob es gerade oder ungerade viele waren, geht in die Linie ein. Dann setze sie.',
    tapPad: 'Tippen',
    tapPadHint: 'Leertaste',
    placeLine: 'Linie setzen',
    placeLineHint: 'Eingabetaste',
    progress: (mother, line) => `Mutter ${mother} · Linie ${line} von 4`,
    castDone: 'Schild erstellen',
    mothersHeading: 'Die vier Mütter',

    chartHeading: 'Das Schildbild',
    answerHeading: 'Die Antwort',
    judgeLabel: 'Der Richter',
    witnessesLabel: 'Die Zeugen',
    reconcilerLabel: 'Der Versöhner',
    newReading: 'Neue Frage',
    tapHouseHint: 'Ein Haus antippen, um seine Figur zu lesen.',

    figurePlanet: 'Planet',
    figureElement: 'Element',
    figureZodiac: 'Tierkreis',
    figureNature: 'Natur',
    figurePoints: 'Punkte',

    houseNames: {
      mother1: 'Erste Mutter', mother2: 'Zweite Mutter',
      mother3: 'Dritte Mutter', mother4: 'Vierte Mutter',
      daughter1: 'Erste Tochter', daughter2: 'Zweite Tochter',
      daughter3: 'Dritte Tochter', daughter4: 'Vierte Tochter',
      niece1: 'Erste Nichte', niece2: 'Zweite Nichte',
      niece3: 'Dritte Nichte', niece4: 'Vierte Nichte',
      rightWitness: 'Rechter Zeuge', leftWitness: 'Linker Zeuge',
      judge: 'Richter', reconciler: 'Versöhner',
    },
    rankRoles: {
      mothers:
        'Der Rohstoff der Lesung, Linie für Linie aus der Hand des Fragenden gewonnen.',
      daughters:
        'Die Mütter in den Spalten statt in den Zeilen gelesen — derselbe Stoff von der anderen Seite gesehen.',
      nieces:
        'Mütter und Töchter paarweise addiert: wie der Stoff sich auswirkt.',
      witnesses:
        'Der rechte Zeuge spricht für den Fragenden und das, was hierher führte; der linke für die erfragte Sache und wohin sie geht.',
      judge: 'Die Antwort. Alles darüber fließt in diese eine Figur zusammen.',
      reconciler:
        'Der Richter, zur ersten Mutter addiert: wie die Antwort dich persönlich berührt.',
    },

    verdicts: {
      yes: 'Ja',
      'qualified-yes': 'Ja, mit Vorbehalt',
      open: 'Offen',
      'qualified-no': 'Nein, mit Einschränkung',
      no: 'Nein',
    },
    verdictBodies: {
      yes: (judge) =>
        `${judge} steht als Richter und beide Zeugen tragen ihn. Die Sache geht zu deinen Gunsten aus.`,
      'qualified-yes': (judge) =>
        `${judge} steht als Richter — günstig, doch die Zeugen tragen ihn nur halb. Der Ausgang ist gut, der Weg dorthin nicht bequem.`,
      open: (judge) =>
        `${judge} ist ein Richter ohne eigene Neigung. Die Frage ist noch nicht entschieden; die Antwort liegt bei dem, was du als Nächstes tust.`,
      'qualified-no': (judge) =>
        `${judge} steht als Richter — ungünstig, doch die Zeugen sprechen milder. Ein Nein, das sich noch wenden lässt.`,
      no: (judge) =>
        `${judge} steht als Richter und beide Zeugen bestätigen ihn. Die Sache geht so nicht aus, wie du sie erhoffst.`,
    },
    witnessRelations: {
      'both-favourable':
        'Beide Zeugen sind günstig: der Weg hierher und der Weg weiter stimmen überein.',
      'both-unfavourable':
        'Beide Zeugen sind ungünstig: weder das Bisherige noch der Ausblick trägt die Sache.',
      improving:
        'Es begann schlecht und wendet sich zum Besseren — der linke Zeuge ist der stärkere von beiden.',
      declining:
        'Es begann gut und wendet sich zum Schlechteren. Was gesichert werden soll, muss früh gesichert werden.',
      mixed:
        'Die Zeugen stimmen weder überein noch widersprechen sie einander klar; die Sache ist noch in Bewegung.',
    },

    natures: {
      good: 'günstig', bad: 'ungünstig', neutral: 'neutral', mixed: 'gemischt',
    },
    elements: { fire: 'Feuer', air: 'Luft', water: 'Wasser', earth: 'Erde' },
    planets: {
      sun: 'Sonne', moon: 'Mond', mercury: 'Merkur', venus: 'Venus',
      mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn',
      'north-node': 'Aufsteigender Mondknoten',
      'south-node': 'Absteigender Mondknoten',
    },
    zodiac: {
      aries: 'Widder', taurus: 'Stier', gemini: 'Zwillinge', cancer: 'Krebs',
      leo: 'Löwe', virgo: 'Jungfrau', libra: 'Waage', scorpio: 'Skorpion',
      sagittarius: 'Schütze', capricorn: 'Steinbock',
      aquarius: 'Wassermann', pisces: 'Fische',
    },

    aboutHeading: 'Über das Verfahren',
    aboutBody:
      'Die Geomantie kam im 12. Jahrhundert als ʿilm al-raml — „Wissenschaft des Sandes“ — aus dem arabischen Raum nach Europa und war bis in die Renaissance eine der verbreitetsten Wahrsagekünste. Aus sechzehn zufällig gesetzten Linien entstehen vier Mütter; aus ihnen leiten sich durch Umstellen und Addieren alle weiteren Figuren ab, bis zum Richter, der die Antwort trägt. Diese App rechnet das vollständige Schildbild und deutet die sechzehn Figuren.',
  },

  en: {
    appTitle: 'Geomancy',
    appSubtitle: 'The Shield Chart — the dot art of the earth',
    langLabel: 'Language',
    langOther: 'Deutsch',

    askHeading: 'Ask your question',
    askHint:
      'Put it as precisely as you can. The art answers what was asked, not what was meant.',
    askPlaceholder: 'Will the matter turn out in my favour?',
    askSubmit: 'Begin',
    askEmpty: 'Please enter a question first.',

    castHeading: 'Cast the sixteen lines',
    castHint:
      'Tap as often as feels right — do not count. Only whether the taps were odd or even enters the line. Then place it.',
    tapPad: 'Tap',
    tapPadHint: 'Space',
    placeLine: 'Place line',
    placeLineHint: 'Enter',
    progress: (mother, line) => `Mother ${mother} · line ${line} of 4`,
    castDone: 'Raise the shield',
    mothersHeading: 'The four Mothers',

    chartHeading: 'The Shield Chart',
    answerHeading: 'The answer',
    judgeLabel: 'The Judge',
    witnessesLabel: 'The Witnesses',
    reconcilerLabel: 'The Reconciler',
    newReading: 'New question',
    tapHouseHint: 'Tap a house to read its figure.',

    figurePlanet: 'Planet',
    figureElement: 'Element',
    figureZodiac: 'Zodiac',
    figureNature: 'Nature',
    figurePoints: 'Points',

    houseNames: {
      mother1: 'First Mother', mother2: 'Second Mother',
      mother3: 'Third Mother', mother4: 'Fourth Mother',
      daughter1: 'First Daughter', daughter2: 'Second Daughter',
      daughter3: 'Third Daughter', daughter4: 'Fourth Daughter',
      niece1: 'First Niece', niece2: 'Second Niece',
      niece3: 'Third Niece', niece4: 'Fourth Niece',
      rightWitness: 'Right Witness', leftWitness: 'Left Witness',
      judge: 'Judge', reconciler: 'Reconciler',
    },
    rankRoles: {
      mothers:
        "The raw material of the reading, drawn line by line from the querent's own hand.",
      daughters:
        'The Mothers read down the columns instead of across — the same material seen from the other side.',
      nieces:
        'Mothers and Daughters added in pairs: how the material works itself out.',
      witnesses:
        'The right Witness speaks for the querent and what led here; the left for the matter asked about and where it is going.',
      judge: 'The answer. Everything above it flows into this single figure.',
      reconciler:
        'The Judge added to the First Mother: how the answer touches you personally.',
    },

    verdicts: {
      yes: 'Yes',
      'qualified-yes': 'Yes, with reservations',
      open: 'Open',
      'qualified-no': 'No, with a caveat',
      no: 'No',
    },
    verdictBodies: {
      yes: (judge) =>
        `${judge} sits as Judge and both Witnesses uphold it. The matter turns out in your favour.`,
      'qualified-yes': (judge) =>
        `${judge} sits as Judge — favourable, but the Witnesses only half support it. The outcome is good; the road to it is not comfortable.`,
      open: (judge) =>
        `${judge} is a Judge with no leaning of its own. The question is not yet decided; the answer rests on what you do next.`,
      'qualified-no': (judge) =>
        `${judge} sits as Judge — unfavourable, yet the Witnesses speak more gently. A no that can still be turned.`,
      no: (judge) =>
        `${judge} sits as Judge and both Witnesses confirm it. The matter will not end as you hope.`,
    },
    witnessRelations: {
      'both-favourable':
        'Both Witnesses are favourable: the road here and the road onward agree.',
      'both-unfavourable':
        'Both Witnesses are unfavourable: neither the past nor the outlook carries the matter.',
      improving:
        'It began badly and turns to the better — the left Witness is the stronger of the two.',
      declining:
        'It began well and turns to the worse. Whatever is to be secured must be secured early.',
      mixed:
        'The Witnesses neither agree nor clearly contradict one another; the matter is still in motion.',
    },

    natures: {
      good: 'favourable', bad: 'unfavourable', neutral: 'neutral', mixed: 'mixed',
    },
    elements: { fire: 'Fire', air: 'Air', water: 'Water', earth: 'Earth' },
    planets: {
      sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus',
      mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn',
      'north-node': 'North Node', 'south-node': 'South Node',
    },
    zodiac: {
      aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
      leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
      sagittarius: 'Sagittarius', capricorn: 'Capricorn',
      aquarius: 'Aquarius', pisces: 'Pisces',
    },

    aboutHeading: 'About the method',
    aboutBody:
      'Geomancy reached Europe in the twelfth century as ʿilm al-raml — the "science of the sand" — and remained one of the most widely practised divinatory arts until the Renaissance. Sixteen randomly cast lines form four Mothers; from these, transposition and addition derive every further figure, up to the Judge, which carries the answer. This app computes the complete shield chart and interprets all sixteen figures.',
  },
};

/** @type {Lang} */
let current = detectInitialLang();

/** Subscribers notified whenever the language changes. @type {Set<() => void>} */
const listeners = new Set();

/**
 * Pick a starting language: an earlier choice if there is one, otherwise the
 * browser's preference, otherwise German.
 * @returns {Lang}
 */
function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Not fatal.
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language ?? '' : '';
  return nav.toLowerCase().startsWith('de') ? 'de' : 'en';
}

/** @returns {Lang} the active language */
export function lang() {
  return current;
}

/**
 * The full string table for the active language.
 * @returns {typeof STRINGS.de}
 */
export function t() {
  return STRINGS[current];
}

/**
 * Switch language and notify subscribers.
 * @param {Lang} next
 */
export function setLang(next) {
  if (next !== 'de' && next !== 'en') return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore — the choice simply will not survive a reload.
  }
  document.documentElement.lang = next;
  listeners.forEach((fn) => fn());
}

/** Flip between the two languages. */
export function toggleLang() {
  setLang(current === 'de' ? 'en' : 'de');
}

/**
 * Register a callback fired on every language change.
 * @param {() => void} fn
 * @returns {() => void} unsubscribe
 */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * The localised block of a figure.
 * @param {import('./figures.js').Figure} figure
 * @returns {import('./figures.js').LocalisedFigure}
 */
export function figureText(figure) {
  return figure.text[current];
}
