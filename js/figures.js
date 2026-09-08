/**
 * The sixteen geomantic figures.
 *
 * A figure is four lines, read top to bottom, each line holding either one
 * point (active, odd) or two points (passive, even). The four lines are
 * traditionally assigned to the elements Fire, Air, Water and Earth.
 *
 *   pattern: [fire, air, water, earth]  where 1 = single point, 2 = double point
 *
 * Planetary, elemental and zodiacal attributions follow the Western tradition
 * as set down by Agrippa (De Occulta Philosophia, Book II) and reproduced in
 * Stephen Skinner, "Geomancy in Theory and Practice".
 *
 * @module figures
 */

/**
 * @typedef {Object} Figure
 * @property {string}   id       stable key, also used for CSS hooks
 * @property {number[]} pattern  four lines, top to bottom, each 1 or 2
 * @property {string}   latin    the traditional Latin name
 * @property {string}   planet   planetary ruler (i18n key)
 * @property {string}   element  elemental attribution (i18n key)
 * @property {string}   zodiac   zodiacal attribution (i18n key)
 * @property {'good'|'bad'|'neutral'|'mixed'} nature  general benevolence
 * @property {{de: LocalisedFigure, en: LocalisedFigure}} text
 */

/**
 * @typedef {Object} LocalisedFigure
 * @property {string}   name      vernacular name
 * @property {string[]} keywords  three or four one-word associations
 * @property {string}   meaning   two or three sentences of interpretation
 */

/** @type {Figure[]} */
export const FIGURES = [
  {
    id: 'via',
    pattern: [1, 1, 1, 1],
    latin: 'Via',
    planet: 'moon',
    element: 'water',
    zodiac: 'cancer',
    nature: 'neutral',
    text: {
      en: {
        name: 'The Way',
        keywords: ['movement', 'change', 'journey'],
        meaning:
          'Nothing stays as it is. The road is open, but it leads away from where you now stand. Favourable for travel, departure and anything that must begin; unfavourable for anything that must hold still.',
      },
      de: {
        name: 'Der Weg',
        keywords: ['Bewegung', 'Wandel', 'Reise'],
        meaning:
          'Nichts bleibt, wie es ist. Der Weg ist offen, führt aber fort von dort, wo du gerade stehst. Günstig für Reisen, Aufbruch und alles, was beginnen soll; ungünstig für alles, was Bestand haben muss.',
      },
    },
  },
  {
    id: 'populus',
    pattern: [2, 2, 2, 2],
    latin: 'Populus',
    planet: 'moon',
    element: 'water',
    zodiac: 'capricorn',
    nature: 'neutral',
    text: {
      en: {
        name: 'The People',
        keywords: ['crowd', 'stillness', 'waiting'],
        meaning:
          'A gathering, a multitude, a standstill. Populus has no will of its own — it takes on the character of whatever surrounds it. It points to matters involving many people, or to a situation waiting for someone else to move first.',
      },
      de: {
        name: 'Das Volk',
        keywords: ['Menge', 'Stillstand', 'Warten'],
        meaning:
          'Eine Versammlung, eine Menge, ein Stillstand. Populus hat keinen eigenen Willen — es nimmt den Charakter dessen an, was es umgibt. Es deutet auf Angelegenheiten mit vielen Beteiligten, oder auf eine Lage, die darauf wartet, dass ein anderer sich zuerst bewegt.',
      },
    },
  },
  {
    id: 'coniunctio',
    pattern: [2, 1, 1, 2],
    latin: 'Coniunctio',
    planet: 'mercury',
    element: 'earth',
    zodiac: 'virgo',
    nature: 'neutral',
    text: {
      en: {
        name: 'Conjunction',
        keywords: ['meeting', 'union', 'recovery'],
        meaning:
          'Things come together: people, contracts, circumstances. In itself neither good nor bad — it joins, and what is joined decides the outcome. Traditionally the figure for finding what was lost.',
      },
      de: {
        name: 'Die Verbindung',
        keywords: ['Begegnung', 'Vereinigung', 'Wiederfinden'],
        meaning:
          'Dinge kommen zusammen: Menschen, Verträge, Umstände. An sich weder gut noch schlecht — es verbindet, und was verbunden wird, entscheidet den Ausgang. Überliefert als die Figur für das Wiederfinden von Verlorenem.',
      },
    },
  },
  {
    id: 'carcer',
    pattern: [1, 2, 2, 1],
    latin: 'Carcer',
    planet: 'saturn',
    element: 'earth',
    zodiac: 'capricorn',
    nature: 'bad',
    text: {
      en: {
        name: 'The Prison',
        keywords: ['confinement', 'delay', 'binding'],
        meaning:
          'Something is locked: a situation, a person, a decision. Carcer is binding and durable, which makes it bad wherever freedom is wanted and good wherever something should hold fast.',
      },
      de: {
        name: 'Der Kerker',
        keywords: ['Gefangenschaft', 'Verzögerung', 'Bindung'],
        meaning:
          'Etwas ist verschlossen: eine Lage, ein Mensch, eine Entscheidung. Carcer bindet und ist dauerhaft — schlecht überall dort, wo Freiheit gewünscht ist, und gut überall dort, wo etwas halten soll.',
      },
    },
  },
  {
    id: 'fortuna-maior',
    pattern: [2, 2, 1, 1],
    latin: 'Fortuna Maior',
    planet: 'sun',
    element: 'fire',
    zodiac: 'leo',
    nature: 'good',
    text: {
      en: {
        name: 'The Greater Fortune',
        keywords: ['success', 'strength', 'permanence'],
        meaning:
          'Success won by your own strength, and therefore lasting. Inner power and protection. A matter that resolves in your favour — and stays resolved.',
      },
      de: {
        name: 'Das große Glück',
        keywords: ['Erfolg', 'Stärke', 'Dauer'],
        meaning:
          'Erfolg aus eigener Kraft und darum von Bestand. Innere Stärke und Schutz. Eine Sache, die sich zu deinen Gunsten löst — und gelöst bleibt.',
      },
    },
  },
  {
    id: 'fortuna-minor',
    pattern: [1, 1, 2, 2],
    latin: 'Fortuna Minor',
    planet: 'sun',
    element: 'fire',
    zodiac: 'leo',
    nature: 'good',
    text: {
      en: {
        name: 'The Lesser Fortune',
        keywords: ['luck', 'help', 'haste'],
        meaning:
          'Success that arrives from outside: help, luck, a favourable circumstance. Real, but quick and unstable. Take it now — it will not wait for you.',
      },
      de: {
        name: 'Das kleine Glück',
        keywords: ['Glück', 'Hilfe', 'Eile'],
        meaning:
          'Erfolg, der von außen kommt: Hilfe, Glück, ein günstiger Umstand. Echt, aber schnell und unbeständig. Greif jetzt zu — es wartet nicht auf dich.',
      },
    },
  },
  {
    id: 'acquisitio',
    pattern: [2, 1, 2, 1],
    latin: 'Acquisitio',
    planet: 'jupiter',
    element: 'fire',
    zodiac: 'sagittarius',
    nature: 'good',
    text: {
      en: {
        name: 'Gain',
        keywords: ['profit', 'increase', 'receiving'],
        meaning:
          'What you seek comes to you, and it stays. The most favourable figure for money, property and anything you wish to hold on to.',
      },
      de: {
        name: 'Der Gewinn',
        keywords: ['Gewinn', 'Zuwachs', 'Empfangen'],
        meaning:
          'Was du suchst, kommt zu dir — und es bleibt. Die günstigste Figur für Geld, Besitz und alles, was du behalten möchtest.',
      },
    },
  },
  {
    id: 'amissio',
    pattern: [1, 2, 1, 2],
    latin: 'Amissio',
    planet: 'venus',
    element: 'earth',
    zodiac: 'taurus',
    nature: 'bad',
    text: {
      en: {
        name: 'Loss',
        keywords: ['loss', 'release', 'slipping away'],
        meaning:
          'Something slips out of your hands. The mirror image of Acquisitio: bad wherever you want to keep something, good wherever you want to be rid of it.',
      },
      de: {
        name: 'Der Verlust',
        keywords: ['Verlust', 'Loslassen', 'Entgleiten'],
        meaning:
          'Etwas entgleitet dir. Das Spiegelbild von Acquisitio: schlecht überall dort, wo du etwas behalten willst, gut überall dort, wo du etwas loswerden willst.',
      },
    },
  },
  {
    id: 'laetitia',
    pattern: [1, 2, 2, 2],
    latin: 'Laetitia',
    planet: 'jupiter',
    element: 'water',
    zodiac: 'pisces',
    nature: 'good',
    text: {
      en: {
        name: 'Joy',
        keywords: ['joy', 'health', 'ascent'],
        meaning:
          'The figure points upward, and so does the matter. Confidence, blessing, improvement. Excellent for health, hope and beginnings.',
      },
      de: {
        name: 'Die Freude',
        keywords: ['Freude', 'Gesundheit', 'Aufstieg'],
        meaning:
          'Die Figur zeigt nach oben, und die Sache tut es auch. Zuversicht, Segen, Besserung. Hervorragend für Gesundheit, Hoffnung und Anfänge.',
      },
    },
  },
  {
    id: 'tristitia',
    pattern: [2, 2, 2, 1],
    latin: 'Tristitia',
    planet: 'saturn',
    element: 'earth',
    zodiac: 'aquarius',
    nature: 'bad',
    text: {
      en: {
        name: 'Sorrow',
        keywords: ['sadness', 'weight', 'descent'],
        meaning:
          'The figure points downward: delay, grief, things sinking. Unfavourable for nearly everything, except matters that genuinely need depth, patience or digging.',
      },
      de: {
        name: 'Die Trauer',
        keywords: ['Traurigkeit', 'Schwere', 'Absinken'],
        meaning:
          'Die Figur zeigt nach unten: Verzögerung, Kummer, Absinken. Ungünstig für beinahe alles — außer für Dinge, die wirklich Tiefe, Geduld oder Graben verlangen.',
      },
    },
  },
  {
    id: 'puer',
    pattern: [1, 1, 2, 1],
    latin: 'Puer',
    planet: 'mars',
    element: 'fire',
    zodiac: 'aries',
    nature: 'mixed',
    text: {
      en: {
        name: 'The Boy',
        keywords: ['impulse', 'courage', 'recklessness'],
        meaning:
          'Young, male, headlong energy — the figure is a raised sword. Good for conflict, competition and anything that takes nerve; bad for peace, patience and love.',
      },
      de: {
        name: 'Der Knabe',
        keywords: ['Impuls', 'Mut', 'Unbesonnenheit'],
        meaning:
          'Junge, männliche, ungestüme Energie — die Figur ist ein erhobenes Schwert. Gut für Streit, Wettkampf und alles, was Nerven verlangt; schlecht für Frieden, Geduld und Liebe.',
      },
    },
  },
  {
    id: 'puella',
    pattern: [1, 2, 1, 1],
    latin: 'Puella',
    planet: 'venus',
    element: 'air',
    zodiac: 'libra',
    nature: 'good',
    text: {
      en: {
        name: 'The Girl',
        keywords: ['charm', 'harmony', 'inconstancy'],
        meaning:
          'Grace, beauty, agreement. Pleasant but changeable: she consents easily, and means it only for now. Very favourable for love and for questions of taste.',
      },
      de: {
        name: 'Das Mädchen',
        keywords: ['Anmut', 'Harmonie', 'Wankelmut'],
        meaning:
          'Anmut, Schönheit, Einverständnis. Angenehm, aber wandelbar: sie stimmt leicht zu und meint es nur für den Augenblick. Sehr günstig für die Liebe und für Fragen des Geschmacks.',
      },
    },
  },
  {
    id: 'albus',
    pattern: [2, 2, 1, 2],
    latin: 'Albus',
    planet: 'mercury',
    element: 'water',
    zodiac: 'cancer',
    nature: 'good',
    text: {
      en: {
        name: 'The White One',
        keywords: ['clarity', 'wisdom', 'calm'],
        meaning:
          'Cool judgment and clear sight. A peaceful figure, but a passive one: thought rather than action. Favourable for counsel, study and any situation that needs to cool down.',
      },
      de: {
        name: 'Der Weiße',
        keywords: ['Klarheit', 'Weisheit', 'Ruhe'],
        meaning:
          'Kühles Urteil und klarer Blick. Eine friedliche Figur, aber eine passive: Denken statt Handeln. Günstig für Rat, Studium und jede Lage, die sich abkühlen muss.',
      },
    },
  },
  {
    id: 'rubeus',
    pattern: [2, 1, 2, 2],
    latin: 'Rubeus',
    planet: 'mars',
    element: 'water',
    zodiac: 'scorpio',
    nature: 'bad',
    text: {
      en: {
        name: 'The Red One',
        keywords: ['passion', 'anger', 'deceit'],
        meaning:
          'Heat without light. Rubeus corrupts what it touches and is unfavourable in almost every position — favourable only for matters that are themselves destructive.',
      },
      de: {
        name: 'Der Rote',
        keywords: ['Leidenschaft', 'Zorn', 'Täuschung'],
        meaning:
          'Hitze ohne Licht. Rubeus verdirbt, was es berührt, und ist in fast jeder Position ungünstig — günstig allein für Dinge, die selbst zerstörerisch sind.',
      },
    },
  },
  {
    id: 'caput-draconis',
    pattern: [2, 1, 1, 1],
    latin: 'Caput Draconis',
    planet: 'north-node',
    element: 'earth',
    zodiac: 'virgo',
    nature: 'good',
    text: {
      en: {
        name: "The Dragon's Head",
        keywords: ['threshold', 'beginning', 'entrance'],
        meaning:
          'A door opening. Caput Draconis amplifies whatever stands beside it, which makes it excellent at the beginning of a matter and far less so at its end.',
      },
      de: {
        name: 'Der Drachenkopf',
        keywords: ['Schwelle', 'Anfang', 'Eingang'],
        meaning:
          'Eine Tür öffnet sich. Caput Draconis verstärkt, was neben ihm steht — hervorragend am Anfang einer Sache und weit weniger an ihrem Ende.',
      },
    },
  },
  {
    id: 'cauda-draconis',
    pattern: [1, 1, 1, 2],
    latin: 'Cauda Draconis',
    planet: 'south-node',
    element: 'fire',
    zodiac: 'sagittarius',
    nature: 'bad',
    text: {
      en: {
        name: "The Dragon's Tail",
        keywords: ['ending', 'exit', 'rupture'],
        meaning:
          'The threshold already crossed. Completion, but also breakage and departure. Favourable only when you want something finished for good.',
      },
      de: {
        name: 'Der Drachenschwanz',
        keywords: ['Ende', 'Ausgang', 'Bruch'],
        meaning:
          'Die bereits überschrittene Schwelle. Abschluss, aber auch Bruch und Fortgang. Günstig allein dann, wenn du etwas endgültig beenden willst.',
      },
    },
  },
];

/**
 * Lookup table from the four-line pattern (joined, e.g. "2211") to its figure.
 * Built once at module load.
 * @type {Map<string, Figure>}
 */
const BY_PATTERN = new Map(FIGURES.map((f) => [f.pattern.join(''), f]));

/**
 * Resolve four lines to the geomantic figure they form.
 *
 * @param {number[]} lines four values, each 1 or 2, ordered fire → earth
 * @returns {Figure}
 * @throws {Error} if the lines are not a valid figure
 */
export function figureFor(lines) {
  const figure = BY_PATTERN.get(lines.join(''));
  if (!figure) {
    throw new Error(`Not a valid geomantic figure: [${lines.join(', ')}]`);
  }
  return figure;
}

/**
 * Total number of points in a figure (between 4 and 8).
 * @param {Figure} figure
 * @returns {number}
 */
export function pointCount(figure) {
  return figure.pattern.reduce((sum, line) => sum + line, 0);
}
