// Degree requirement and timetable checks for 6CTMA, semesters 7–9.
// Years 1–3, the thesis (30 hp) and the language requirement are assumed done.

// 300 hp = 180 (years 1–3) + 90 (semesters 7–9) + 30 (thesis).
const TOTAL_HP = 90;
// 90 hp advanced level in total, of which the thesis is 30.
const ADVANCED_HP = 60;
// 30 hp advanced level in the main field (Tillämpad matematik).
const MAIN_FIELD_HP = 30;
const DEFAULT_OUTSIDE_HP = 6;
// Autumn courses can be taken in semester 7 or 9, spring courses in semester 8.
const TERM_SEMESTERS = { HT: [7, 9], VT: [8] };
const termOf = (sem) => (sem === 8 ? 'VT' : 'HT');

const list = (items, lang) => {
  const and = lang === 'sv' ? ' och ' : ' and ';
  return items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + and + items[items.length - 1];
};
const orList = (items, lang) => {
  const or = lang === 'sv' ? ' eller ' : ' or ';
  return items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + or + items[items.length - 1];
};
const fmt = (hp) => (Math.round(hp * 10) / 10).toString().replace('.', ',');
const plural = (n, one, many) => (n === 1 ? one : many);

const MESSAGES = {
  en: {
    thesis: 'Thesis. Assumed done and not counted here.',
    voluntary: 'Voluntary course (F). Does not count toward the degree.',
    early: 'Mandatory year 1–3 course. Already part of the assumed 180 hp.',
    earlyElective: 'Year 1–3 elective.',
    outsideAssumed: (hp) => `Not in the program plan. Credits unknown, assumed ${hp} hp.`,
    outside: 'Not in the program plan.',
    profMandTitle: 'Mandatory profile courses',
    none: 'This profile has no mandatory courses.',
    missing: (x) => `Missing: ${x}.`,
    included: (x) => `Included: ${x}.`,
    profHpTitle: (n) => `At least ${n} hp from the profile`,
    hpFrom: (v, n, k, what) => `${v} of ${n} hp from ${k} ${what} ${plural(k, 'course', 'courses')}.`,
    profile: 'profile', specialization: 'specialization',
    profAdvTitle: (n) => `At least ${n} advanced-level profile courses`,
    countOf: (v, n, x) => `${v} of ${n}${x ? ': ' + x : ''}.`,
    specMandTitle: 'Mandatory specialization courses',
    pickOne: (x) => `Pick one of: ${x}.`,
    specHpTitle: (n) => `At least ${n} hp from the specialization`,
    bizTitle: 'Business course (företags- och affärsmässiga villkor)',
    add: (x) => `Add ${x}.`,
    addOneOf: (x) => `Add one of ${x}.`,
    requires: (spec, x) => `${spec} requires ${x}.`,
    bizConflict: (text, extra) => `The plan text lists ${text}, but the course table also lists ${extra}. All are accepted here. Confirm with your study counsellor.`,
    outsideTitle: (n) => `At most ${n} hp outside the program plan`,
    outsideHp: (v, x, over) => `${v} hp: ${x}.${over ? ` Only ${over} hp can count.` : ''}`,
    noOutside: 'No courses outside the program plan.',
    totalTitle: (n) => `At least ${n} hp in semesters 7–9`,
    totalDetail: (v, n) => `${v} of ${n} hp counted.`,
    advTitle: (n) => `At least ${n} hp at advanced level`,
    advDetail: (v, n, early) => `${v} of ${n} hp, not counting the thesis.${early ? ` Includes ${early} from year 3.` : ''}`,
    tmTitle: (n) => `At least ${n} hp advanced in Tillämpad matematik`,
    tmDetail: (v, n, early) => `${v} of ${n} hp.${early ? ` Includes ${early} from year 3.` : ''}`,
    invalid: (x) => `Couldn't read ${x}. Use course codes like TAMS46, optionally with credits: ABC123:7.5.`,
    duplicates: (x) => `Listed more than once: ${x}. Counted once.`,
    both: (x) => `${x} is listed in both the profile and the specialization and is counted toward both. Check whether that is allowed.`,
    assumedHp: (hp, x, ex) => `Credits assumed to be ${hp} hp for ${x}. Write e.g. ${ex}:7.5 to set them.`,
    basicLevel: 'Courses outside the program plan count as basic level unless you add :A, e.g. ABC123:7.5:A.',
  },
  sv: {
    thesis: 'Examensarbete. Antas vara klart och räknas inte här.',
    voluntary: 'Frivillig kurs (F). Räknas inte in i examen.',
    early: 'Obligatorisk kurs i åk 1–3. Ingår redan i de 180 hp som antas vara klara.',
    earlyElective: 'Valbar kurs i åk 1–3.',
    outsideAssumed: (hp) => `Finns inte i programplanen. Okänt antal hp, antas vara ${hp} hp.`,
    outside: 'Finns inte i programplanen.',
    profMandTitle: 'Obligatoriska profilkurser',
    none: 'Profilen har inga obligatoriska kurser.',
    missing: (x) => `Saknas: ${x}.`,
    included: (x) => `Med: ${x}.`,
    profHpTitle: (n) => `Minst ${n} hp från profilen`,
    hpFrom: (v, n, k, what) => `${v} av ${n} hp från ${k} ${plural(k, 'kurs', 'kurser')} i ${what}.`,
    profile: 'profilen', specialization: 'inriktningen',
    profAdvTitle: (n) => `Minst ${n} profilkurser på avancerad nivå`,
    countOf: (v, n, x) => `${v} av ${n}${x ? ': ' + x : ''}.`,
    specMandTitle: 'Obligatoriska kurser i inriktningen',
    pickOne: (x) => `Välj en av: ${x}.`,
    specHpTitle: (n) => `Minst ${n} hp från inriktningen`,
    bizTitle: 'Företags- och affärsmässiga villkor',
    add: (x) => `Lägg till ${x}.`,
    addOneOf: (x) => `Lägg till en av ${x}.`,
    requires: (spec, x) => `${spec} kräver ${x}.`,
    bizConflict: (text, extra) => `Utbildningsplanens text anger ${text}, men programplanen anger även ${extra}. Alla godtas här. Stäm av med din studievägledare.`,
    outsideTitle: (n) => `Högst ${n} hp utanför programplanen`,
    outsideHp: (v, x, over) => `${v} hp: ${x}.${over ? ` Bara ${over} hp kan räknas.` : ''}`,
    noOutside: 'Inga kurser utanför programplanen.',
    totalTitle: (n) => `Minst ${n} hp under termin 7–9`,
    totalDetail: (v, n) => `${v} av ${n} hp räknas.`,
    advTitle: (n) => `Minst ${n} hp på avancerad nivå`,
    advDetail: (v, n, early) => `${v} av ${n} hp, exklusive examensarbetet.${early ? ` Inklusive ${early} från åk 3.` : ''}`,
    tmTitle: (n) => `Minst ${n} hp avancerat i Tillämpad matematik`,
    tmDetail: (v, n, early) => `${v} av ${n} hp.${early ? ` Inklusive ${early} från åk 3.` : ''}`,
    invalid: (x) => `Kunde inte läsa ${x}. Skriv kurskoder som TAMS46, eventuellt med hp: ABC123:7.5.`,
    duplicates: (x) => `Angiven mer än en gång: ${x}. Räknas en gång.`,
    both: (x) => `${x} finns i både profilen och inriktningen och räknas till båda. Kontrollera att det är tillåtet.`,
    assumedHp: (hp, x, ex) => `Antar ${hp} hp för ${x}. Skriv t.ex. ${ex}:7.5 för att ange hp.`,
    basicLevel: 'Kurser utanför programplanen räknas som grundnivå om du inte lägger till :A, t.ex. ABC123:7.5:A.',
  },
};

function parseInput(text) {
  const tokens = text.toUpperCase().split(/[\s,;]+/).filter(Boolean);
  const entries = [], invalid = [], duplicates = [];
  const seen = new Set();
  for (const tok of tokens) {
    const m = tok.match(/^([A-Z0-9]{4,8})(?::(\d+(?:[.,]\d+)?))?(?::(A))?$/);
    if (!m) { invalid.push(tok); continue; }
    if (seen.has(m[1])) { duplicates.push(m[1]); continue; }
    seen.add(m[1]);
    entries.push({ code: m[1], hp: m[2] ? parseFloat(m[2].replace(',', '.')) : null, adv: !!m[3] });
  }
  return { entries, invalid, duplicates };
}

const sum = (items) => items.reduce((s, c) => s + c.hp, 0);
const isAdv = (level) => /^A/.test(level || '');

// Semesters a course can be taken in, from the terms it is scheduled in.
function semesterOptions(info) {
  if (!info || !info.s) return [];
  return Object.keys(info.s).flatMap((term) => TERM_SEMESTERS[term]).sort();
}

// The shared [period, block] if two courses cannot avoid each other, otherwise null.
// Each course has one or more instances (alternative offerings); a collision only counts
// if every combination of instances shares a block.
function clash(instsA, instsB) {
  if (!instsA.length || !instsB.length) return null;
  let first = null;
  for (const a of instsA) {
    for (const b of instsB) {
      const shared = a.find(([p, blk]) => blk !== '-' && b.some(([q, blk2]) => q === p && blk2 === blk));
      if (!shared) return null;
      first = first || shared;
    }
  }
  return first;
}

function classify(cohort, profile, spec, entry, M, lang) {
  const info = cohort.courses[entry.code];
  const inProfile = entry.code in profile.c;
  const inSpec = entry.code in spec.c;
  const listings = [cohort.general[entry.code], ...Object.values(cohort.groups).map((g) => g.c[entry.code])]
    .filter(Boolean);
  const base = { code: entry.code, name: info ? (lang === 'en' ? info.ne : info.n) : null, hp: info ? info.hp : entry.hp,
    level: info ? info.l : null, tm: info ? info.tm : false, inProfile, inSpec, counted: true, role: null, note: '' };

  if (info && (info.l === 'A2E' || /^TQXX/.test(entry.code))) {
    return { ...base, counted: false, role: 'excluded', note: M.thesis };
  }
  if (listings.length) {
    if (listings.every((v) => v === 'f')) return { ...base, counted: false, role: 'excluded', note: M.voluntary };
    return { ...base, role: inProfile ? 'profile' : inSpec ? 'spec' : 'elective' };
  }
  if (info) {
    const vof = cohort.early[entry.code];
    if (vof === 'o') return { ...base, counted: false, role: 'excluded', note: M.early };
    if (vof === 'f') return { ...base, counted: false, role: 'excluded', note: M.voluntary };
    return { ...base, role: 'elective', note: M.earlyElective };
  }
  return { ...base, hp: entry.hp ?? DEFAULT_OUTSIDE_HP, level: entry.adv ? 'A' : null, role: 'outside',
    hpAssumed: entry.hp == null, note: entry.hp == null ? M.outsideAssumed(DEFAULT_OUTSIDE_HP) : M.outside };
}

// Ways around a collision between course x and course y in semester sem, each checked against
// everything else placed in the target semester.
function alternatives(cohort, alt, placed, x, sem) {
  const others = (target) => placed.filter((p) => p.code !== x.code && p.sem === target);
  const blockers = (insts, target) => others(target)
    .filter((p) => !(p.coord || []).includes(x.code) && clash(insts, p.insts)).map((p) => p.code);
  const out = [];

  // 1. The same course in the other autumn semester.
  for (const target of x.options) {
    if (target === sem) continue;
    const insts = x.info.s[termOf(target)];
    const b = blockers(insts, target);
    if (!b.length) out.push({ type: 'move', code: x.code, sem: target, slots: insts });
  }
  if (!alt) return out;

  // 2. The same course given for another program, with a different timetable.
  const own = (term) => JSON.stringify((x.info.s[term] || []).map((i) => [...i].sort()));
  for (const g of (alt.c[x.code] || {}).g || []) {
    const term = g.t.slice(0, 2);
    if (own(term).includes(JSON.stringify([...g.s].sort()))) continue;
    const target = TERM_SEMESTERS[term].find((t) => !blockers([g.s], t).length);
    if (target) out.push({ type: 'program', code: x.code, sem: target, group: g });
  }

  // 3. A T-course with a similar name, under a different code.
  for (const code of (alt.c[x.code] || {}).sim || []) {
    // Skip courses already in the plan and mandatory year 1–3 courses (already taken).
    if (placed.some((p) => p.code === code) || cohort.early[code] === 'o') continue;
    const info = alt.c[code];
    if (!info) continue;
    for (const g of info.g || []) {
      const target = TERM_SEMESTERS[g.t.slice(0, 2)].find((t) => !blockers([g.s], t).length);
      if (target) out.push({ type: 'similar', code, info, inPlan: code in cohort.courses, sem: target, group: g });
    }
  }
  return out;
}

function timetable(cohort, alt, courses, semesters) {
  const placed = courses.filter((c) => c.counted).map((c) => {
    const info = cohort.courses[c.code];
    const options = semesterOptions(info);
    if (!options.length) return null;
    const sem = options.includes(semesters[c.code]) ? semesters[c.code] : Math.min(...info.sem);
    c.sem = sem;
    c.semOptions = options;
    return { code: c.code, sem, options, info, insts: info.s[termOf(sem)], coord: info.coord };
  }).filter(Boolean);

  // For courses with several offerings in a term (TEAE01 in period 1 or 2), use the one that
  // collides with the fewest other courses in the same semester.
  for (const p of placed) {
    const score = (inst) => placed.filter((o) => o !== p && o.sem === p.sem && !(p.coord || []).includes(o.code)
      && clash([inst], o.insts)).length;
    const best = p.insts.reduce((a, b) => (score(b) < score(a) ? b : a));
    const course = courses.find((c) => c.code === p.code);
    course.slots = best;
    course.otherSlots = p.insts.filter((i) => i !== best);
  }

  const collisions = [];
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i], b = placed[j];
      if (a.sem !== b.sem || (a.coord || []).includes(b.code)) continue;
      const slot = clash(a.insts, b.insts);
      if (slot) {
        collisions.push({ a: a.code, b: b.code, sem: a.sem, period: slot[0], block: slot[1],
          options: [...alternatives(cohort, alt, placed, a, a.sem), ...alternatives(cohort, alt, placed, b, b.sem)] });
      }
    }
  }
  const perSemester = { 7: 0, 8: 0, 9: 0 };
  for (const c of courses) if (c.counted && c.sem) perSemester[c.sem] += c.hp;
  const unplaced = courses.filter((c) => c.counted && !c.sem);
  return { collisions, perSemester, unplacedHp: sum(unplaced) };
}

function validate(cohort, profileCode, specCode, text, opts = {}) {
  const lang = opts.lang === 'sv' ? 'sv' : 'en';
  const M = MESSAGES[lang];
  const profile = cohort.groups[profileCode];
  const spec = cohort.groups[specCode];
  const specName = lang === 'en' ? spec.name_en : spec.name;
  const rules = cohort.rules;
  const { entries, invalid, duplicates } = parseInput(text);
  const courses = entries.map((e) => classify(cohort, profile, spec, e, M, lang));
  const counted = courses.filter((c) => c.counted);
  const taken = new Set(counted.map((c) => c.code));
  const reqs = [];
  const req = (id, title, ok, detail, progress) => reqs.push({ id, title, ok, detail, progress });
  const missingOf = (codes) => codes.filter((c) => !taken.has(c));
  const label = (code) => {
    const info = cohort.courses[code];
    return `${code}${info ? ' ' + (lang === 'en' ? info.ne : info.n) : ''}`;
  };

  // Master profile
  const profMand = Object.keys(profile.c).filter((c) => profile.c[c] === 'o');
  const profMissing = missingOf(profMand);
  req('profile-mandatory', M.profMandTitle, profMissing.length === 0,
    profMand.length === 0 ? M.none
      : profMissing.length ? M.missing(profMissing.map(label).join(', ')) : M.included(profMand.map(label).join(', ')));

  const profCourses = counted.filter((c) => c.inProfile);
  const profHp = sum(profCourses);
  req('profile-hp', M.profHpTitle(rules.profileHp), profHp >= rules.profileHp,
    M.hpFrom(fmt(profHp), rules.profileHp, profCourses.length, M.profile), { value: profHp, target: rules.profileHp });

  const profAdv = profCourses.filter((c) => isAdv(c.level));
  req('profile-adv', M.profAdvTitle(rules.profileAdvCourses), profAdv.length >= rules.profileAdvCourses,
    M.countOf(profAdv.length, rules.profileAdvCourses, profAdv.map((c) => c.code).join(', ')),
    { value: profAdv.length, target: rules.profileAdvCourses });

  // Technical specialization
  const specMand = Object.keys(spec.c).filter((c) => spec.c[c] === 'o');
  const specChoice = Object.keys(spec.c).filter((c) => spec.c[c] === 'o/v');
  const specMissing = missingOf(specMand);
  const choiceOk = specChoice.length === 0 || specChoice.some((c) => taken.has(c));
  const specParts = [];
  if (specMissing.length) specParts.push(M.missing(specMissing.map(label).join(', ')));
  if (!choiceOk) specParts.push(M.pickOne(specChoice.map(label).join(', ')));
  if (!specParts.length) specParts.push(M.included([...specMand, ...specChoice.filter((c) => taken.has(c))].map(label).join(', ')));
  req('spec-mandatory', M.specMandTitle, specMissing.length === 0 && choiceOk, specParts.join(' '));

  const specCourses = counted.filter((c) => c.inSpec);
  const specHp = sum(specCourses);
  req('spec-hp', M.specHpTitle(rules.specHp), specHp >= rules.specHp,
    M.hpFrom(fmt(specHp), rules.specHp, specCourses.length, M.specialization), { value: specHp, target: rules.specHp });

  // Business course: a specialization may make one of the alternatives mandatory (Finansiell matematik: TEAE01).
  const forced = cohort.business.filter((c) => spec.c[c] === 'o');
  const bizOptions = forced.length ? forced : cohort.business;
  const bizTaken = bizOptions.filter((c) => taken.has(c));
  let bizDetail = bizTaken.length ? M.included(bizTaken.map(label).join(', '))
    : bizOptions.length === 1 ? M.add(label(bizOptions[0])) : M.addOneOf(orList(bizOptions.map(label), lang));
  if (forced.length) bizDetail += ' ' + M.requires(specName, forced.join(', '));
  else if (rules.businessText.join() !== cohort.business.join()) {
    bizDetail += ' ' + M.bizConflict(list(rules.businessText, lang), cohort.business.filter((c) => !rules.businessText.includes(c)).join(', '));
  }
  req('business', M.bizTitle, bizTaken.length > 0, bizDetail);

  // Courses outside the program plan
  const outside = counted.filter((c) => c.role === 'outside');
  const outsideHp = sum(outside);
  req('outside', M.outsideTitle(rules.outsideMax), outsideHp <= rules.outsideMax,
    outside.length ? M.outsideHp(fmt(outsideHp), outside.map((c) => c.code).join(', '), outsideHp > rules.outsideMax ? rules.outsideMax : 0)
      : M.noOutside,
    { value: outsideHp, target: rules.outsideMax, max: true });

  // Credit totals. Outside-plan credits above the cap do not count.
  const totalHp = sum(counted) - Math.max(0, outsideHp - rules.outsideMax);
  req('total', M.totalTitle(TOTAL_HP), totalHp >= TOTAL_HP, M.totalDetail(fmt(totalHp), TOTAL_HP), { value: totalHp, target: TOTAL_HP });

  // Mandatory advanced-level courses from years 1–3 (TANA31) count toward the advanced totals.
  const earlyAdv = Object.keys(cohort.early)
    .filter((c) => cohort.early[c] === 'o' && isAdv(cohort.courses[c].l))
    .map((c) => ({ code: c, ...cohort.courses[c] }));
  const advHp = sum(counted.filter((c) => isAdv(c.level))) + sum(earlyAdv);
  req('advanced', M.advTitle(ADVANCED_HP), advHp >= ADVANCED_HP,
    M.advDetail(fmt(advHp), ADVANCED_HP, earlyAdv.map((c) => `${c.code} (${fmt(c.hp)} hp)`).join(', ')),
    { value: advHp, target: ADVANCED_HP });

  const earlyTm = earlyAdv.filter((c) => c.tm);
  const tmHp = sum(counted.filter((c) => isAdv(c.level) && c.tm)) + sum(earlyTm);
  req('main-field', M.tmTitle(MAIN_FIELD_HP), tmHp >= MAIN_FIELD_HP,
    M.tmDetail(fmt(tmHp), MAIN_FIELD_HP, earlyTm.map((c) => c.code).join(', ')), { value: tmHp, target: MAIN_FIELD_HP });

  const warnings = [];
  if (invalid.length) warnings.push(M.invalid(invalid.map((t) => `"${t}"`).join(', ')));
  if (duplicates.length) warnings.push(M.duplicates([...new Set(duplicates)].join(', ')));
  const both = counted.filter((c) => c.inProfile && c.inSpec);
  if (both.length) warnings.push(M.both(both.map((c) => c.code).join(', ')));
  const assumed = outside.filter((c) => c.hpAssumed);
  if (assumed.length) warnings.push(M.assumedHp(DEFAULT_OUTSIDE_HP, assumed.map((c) => c.code).join(', '), assumed[0].code));
  if (outside.some((c) => !isAdv(c.level))) warnings.push(M.basicLevel);

  const schedule = timetable(cohort, opts.alt, courses, opts.semesters || {});
  return { courses, reqs, warnings, schedule, totals: { totalHp, profHp, specHp, advHp, tmHp } };
}

if (typeof module !== 'undefined') module.exports = { validate, parseInput, clash, semesterOptions };
