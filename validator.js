// Degree requirement and timetable checks for 6CTMA, semesters 7–9.
// Years 1–3, the thesis (30 hp) and the language requirement are assumed done.

// 300 hp = 180 (years 1–3) + 90 (semesters 7–9) + 30 (thesis).
const TOTAL_HP = 90;
// 90 hp advanced level in total, of which the thesis is 30.
const ADVANCED_HP = 60;
// 30 hp advanced level in the main field (Tillämpad matematik).
const MAIN_FIELD_HP = 30;
const DEFAULT_OUTSIDE_HP = 6;
// Full-time study: 30 hp per semester, 60 hp per year.
const SEMESTER_HP = 30;
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
    todoAdd: (x) => `Add ${x}.`,
    todoProfileHp: (hp) => `Add profile courses for ${hp} more hp.`,
    todoProfileAdv: (n) => `Add ${n} more advanced-level profile course${n === 1 ? '' : 's'}.`,
    todoPickOne: (x) => `Pick one of ${x}.`,
    todoSpecHp: (hp) => `Add specialization courses for ${hp} more hp.`,
    todoBusiness: (x) => `Add a business course: ${x}.`,
    todoOutside: (hp) => `Remove courses outside the program plan for ${hp} hp, or swap them for courses in the plan.`,
    todoTotal: (hp) => `Add courses for ${hp} more hp.`,
    todoAdvanced: (hp) => `Add advanced-level courses for ${hp} more hp, or swap basic-level courses for advanced ones.`,
    todoMainField: (hp) => `Add advanced courses in Tillämpad matematik for ${hp} more hp (most profile courses count).`,
    todoClash: (a, b, sem) => `${a} and ${b} collide in semester ${sem}.`,
    todoMove: (code, from, to) => `Move ${code} from semester ${from} to semester ${to} to even out the credits.`,
    todoHeavy: (sem) => `Semester ${sem} is over 30 hp. Consider dropping a course there.`,
    todoCsn: (hp) => `Add ${hp} hp in semester 7 or 8 to reach 60 hp for the year (CSN).`,
    todoSem9: (hp) => `Add ${hp} hp in semester 9 to reach 30 hp (CSN).`,
    outsideCatalog: (progs) => `Not in the program plan. Given for other programs (${progs}).`,
    outsideLanguage: 'Language course, not in the program plan.',
    heavy: (sem, hp) => `Semester ${sem} has ${hp} hp. More than 30 hp in a semester is a lot of work.`,
    csnYear: (hp) => `Semesters 7 and 8 add up to ${hp} hp. Less than 60 hp in a year can affect your CSN student aid.`,
    csnSem9: (hp) => `Semester 9 has ${hp} hp. Less than 30 hp (with the thesis in semester 10) can affect your CSN student aid.`,
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
    todoAdd: (x) => `Lägg till ${x}.`,
    todoProfileHp: (hp) => `Lägg till profilkurser för ${hp} hp till.`,
    todoProfileAdv: (n) => `Lägg till ${n} profilkurs${n === 1 ? '' : 'er'} till på avancerad nivå.`,
    todoPickOne: (x) => `Välj en av ${x}.`,
    todoSpecHp: (hp) => `Lägg till inriktningskurser för ${hp} hp till.`,
    todoBusiness: (x) => `Lägg till en kurs i företags- och affärsmässiga villkor: ${x}.`,
    todoOutside: (hp) => `Ta bort kurser utanför programplanen för ${hp} hp, eller byt dem mot kurser i programplanen.`,
    todoTotal: (hp) => `Lägg till kurser för ${hp} hp till.`,
    todoAdvanced: (hp) => `Lägg till kurser på avancerad nivå för ${hp} hp till, eller byt kurser på grundnivå mot avancerade.`,
    todoMainField: (hp) => `Lägg till avancerade kurser i Tillämpad matematik för ${hp} hp till (de flesta profilkurser räknas).`,
    todoClash: (a, b, sem) => `${a} och ${b} krockar termin ${sem}.`,
    todoMove: (code, from, to) => `Flytta ${code} från termin ${from} till termin ${to} för att jämna ut poängen.`,
    todoHeavy: (sem) => `Termin ${sem} har mer än 30 hp. Fundera på att stryka en kurs där.`,
    todoCsn: (hp) => `Lägg till ${hp} hp termin 7 eller 8 för att nå 60 hp på året (CSN).`,
    todoSem9: (hp) => `Lägg till ${hp} hp termin 9 för att nå 30 hp (CSN).`,
    outsideCatalog: (progs) => `Finns inte i programplanen. Ges för andra program (${progs}).`,
    outsideLanguage: 'Språkkurs, finns inte i programplanen.',
    heavy: (sem, hp) => `Termin ${sem} har ${hp} hp. Mer än 30 hp på en termin är mycket arbete.`,
    csnYear: (hp) => `Termin 7 och 8 blir tillsammans ${hp} hp. Mindre än 60 hp på ett år kan påverka ditt studiestöd från CSN.`,
    csnSem9: (hp) => `Termin 9 har ${hp} hp. Mindre än 30 hp (med examensarbetet termin 10) kan påverka ditt studiestöd från CSN.`,
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
// Spring courses are taken in semester 8. A course the plan lists in semester 7 can usually also be
// taken in semester 9, but one listed only in semester 9 (the project courses, for example) cannot be
// moved to semester 7.
function semesterOptions(info) {
  if (!info || !info.s) return [];
  const out = [];
  if (info.s.VT) out.push(8);
  if (info.s.HT) out.push(...(!info.sem || info.sem.includes(7) ? [7, 9] : [9]));
  return out.sort();
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

// Course details and timetable for a code: the cohort's own plan first, then the catalog of courses
// from other Linköping engineering programs (same admission year if possible) and language courses.
function courseSchedule(cohort, catalog, code) {
  const own = cohort.courses[code];
  if (own) return own.s ? own : null;
  if (!catalog || !catalog.courses[code]) return null;
  // sched.base is the newest timetable; sched[year] only holds the courses that differ that year.
  const year = cohort.label.slice(3);
  const s = (catalog.sched[year] || {})[code] || catalog.lang[code] || catalog.sched.base[code];
  if (!s) return null;
  const listed = catalog.courses[code].sem;
  return { ...catalog.courses[code], s, sem: listed && listed.length ? listed : Object.keys(s).map((term) => TERM_SEMESTERS[term][0]) };
}

function classify(cohort, profile, spec, entry, M, lang, catalog) {
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
  const known = catalog && catalog.courses[entry.code];
  if (known) {
    return { ...base, name: lang === 'en' ? known.ne : known.n, hp: entry.hp ?? known.hp, level: known.l, tm: known.tm,
      role: 'outside', note: known.lang ? M.outsideLanguage : M.outsideCatalog(known.progs.join(', ')) };
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

function timetable(cohort, alt, catalog, courses, semesters, M, instances) {
  const placed = courses.filter((c) => c.counted).map((c) => {
    const info = courseSchedule(cohort, catalog, c.code);
    const options = semesterOptions(info);
    if (!options.length) return null;
    const listed = options.filter((o) => info.sem.includes(o));
    const sem = options.includes(semesters[c.code]) ? semesters[c.code] : Math.min(...(listed.length ? listed : options));
    c.sem = sem;
    c.semOptions = options;
    // A course given in two separate periods (TEAE01) can be pinned to one of its offerings.
    const all = info.s[termOf(sem)];
    const pinned = instances && all[instances[c.code]];
    return { code: c.code, sem, options, info, insts: pinned ? [pinned] : all, all, coord: info.coord };
  }).filter(Boolean);

  // For courses with several offerings in a term (TEAE01 in period 1 or 2), use the one that
  // collides with the fewest other courses in the same semester.
  for (const p of placed) {
    const score = (inst) => placed.filter((o) => o !== p && o.sem === p.sem && !(p.coord || []).includes(o.code)
      && clash([inst], o.insts)).length;
    const best = p.insts.reduce((a, b) => (score(b) < score(a) ? b : a));
    const course = courses.find((c) => c.code === p.code);
    course.slots = best;
    course.otherSlots = p.all.filter((i) => i !== best);
    course.instance = p.all.indexOf(best);
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
  // Workload and CSN: more than 30 hp in a semester is a lot of work; CSN usually looks at a full
  // year, so semesters 7 + 8 should add up to 60 hp, and semester 9 (with the thesis in 10) to 30.
  const load = [];
  for (const sem of [7, 8, 9]) if (perSemester[sem] > SEMESTER_HP) load.push({ type: 'heavy', sem, text: M.heavy(sem, fmt(perSemester[sem])) });
  if (perSemester[7] + perSemester[8] < 2 * SEMESTER_HP) load.push({ type: 'csn', text: M.csnYear(fmt(perSemester[7] + perSemester[8])) });
  if (perSemester[9] < SEMESTER_HP) load.push({ type: 'csn', text: M.csnSem9(fmt(perSemester[9])) });
  return { collisions, perSemester, unplacedHp: sum(unplaced), load, placed };
}

// Concrete steps toward a plan that meets the requirements: courses to add (that fit the timetable and
// the credit balance), courses to move between semester 7 and 9, and what to look at otherwise.
function guidance(g) {
  const { cohort, catalog, profile, spec, schedule, taken, label, M } = g;
  const per = { ...schedule.perSemester };
  const inSem = (sem) => schedule.placed.filter((p) => p.sem === sem);
  const items = [];
  const item = (text, actions = []) => items.push({ text, actions });

  // Where a course could go: a semester it is offered in without collisions, the lightest first.
  const fitting = (code) => {
    const info = courseSchedule(cohort, catalog, code);
    if (!info) return null;
    const opts = semesterOptions(info).sort((a, b) => per[a] - per[b]);
    return opts.find((sem) => !inSem(sem).some((p) => !(p.coord || []).includes(code) && clash(info.s[termOf(sem)], p.insts))) || null;
  };
  const suggest = (codes, n, filter = () => true) => codes
    .filter((c) => !taken.has(c) && cohort.early[c] !== 'o' && cohort.courses[c] && filter(cohort.courses[c]))
    .map((c) => ({ code: c, sem: fitting(c), hp: cohort.courses[c].hp }))
    .filter((x) => x.sem)
    .sort((a, b) => per[a.sem] - per[b.sem] || a.code.localeCompare(b.code))
    .slice(0, n)
    .map((x) => ({ type: 'add', code: x.code, sem: x.sem }));
  const profCodes = Object.keys(profile.c).filter((c) => profile.c[c] !== 'f');
  const specCodes = Object.keys(spec.c).filter((c) => spec.c[c] !== 'f');
  const adv = (info) => isAdv(info.l);

  for (const c of g.missing.prof) item(M.todoAdd(label(c)), suggest([c], 1));
  if (g.need.profHp > 0) item(M.todoProfileHp(fmt(g.need.profHp)), suggest(profCodes, 3));
  if (g.need.profAdv > 0) item(M.todoProfileAdv(g.need.profAdv), suggest(profCodes, 3, adv));
  for (const c of g.missing.spec) item(M.todoAdd(label(c)), suggest([c], 1));
  if (g.missing.choice.length) item(M.todoPickOne(g.missing.choice.join(', ')), suggest(g.missing.choice, 4));
  if (g.need.specHp > 0) item(M.todoSpecHp(fmt(g.need.specHp)), suggest(specCodes, 3));
  if (g.missing.biz.length) item(M.todoBusiness(g.missing.biz.join(', ')), suggest(g.missing.biz, 2));
  if (g.need.outside > 0) item(M.todoOutside(fmt(g.need.outside)), g.counted.filter((c) => c.role === 'outside').map((c) => ({ type: 'remove', code: c.code })));
  if (g.need.total > 0) item(M.todoTotal(fmt(g.need.total)), suggest([...profCodes, ...specCodes], 3));
  if (g.need.adv > 0) item(M.todoAdvanced(fmt(g.need.adv)), suggest([...profCodes, ...specCodes], 3, adv));
  if (g.need.tm > 0) item(M.todoMainField(fmt(g.need.tm)), suggest([...profCodes, ...specCodes], 3, (i) => adv(i) && i.tm));

  for (const x of schedule.collisions) {
    item(M.todoClash(x.a, x.b, x.sem), x.options.filter((o) => o.type === 'move').slice(0, 2).map((o) => ({ type: 'move', code: o.code, sem: o.sem })));
  }

  // Credit balance: move autumn courses between semester 7 and 9 where that helps.
  const movable = (from, to) => inSem(from)
    .filter((p) => p.options.includes(to) && !inSem(to).some((q) => clash(p.info.s[termOf(to)], q.insts)))
    .map((p) => ({ code: p.code, hp: g.counted.find((c) => c.code === p.code).hp }))
    .sort((a, b) => a.hp - b.hp);
  const balance = (from, to, tooMuch) => {
    const m = movable(from, to).find((x) => per[to] + x.hp <= SEMESTER_HP);
    if (m) item(M.todoMove(m.code, from, to), [{ type: 'move', code: m.code, sem: to }]);
    else if (tooMuch) item(M.todoHeavy(from));
  };
  if (per[7] > SEMESTER_HP) balance(7, 9, true);
  else if (per[9] > SEMESTER_HP) {
    if (per[7] + per[8] < 2 * SEMESTER_HP) balance(9, 7, true); else item(M.todoHeavy(9));
  }
  if (per[8] > SEMESTER_HP) item(M.todoHeavy(8));
  if (per[7] + per[8] < 2 * SEMESTER_HP && per[9] <= SEMESTER_HP) item(M.todoCsn(fmt(2 * SEMESTER_HP - per[7] - per[8])));
  if (per[9] < SEMESTER_HP && per[7] <= SEMESTER_HP) item(M.todoSem9(fmt(SEMESTER_HP - per[9])));
  return items;
}

function validate(cohort, profileCode, specCode, text, opts = {}) {
  const lang = opts.lang === 'sv' ? 'sv' : 'en';
  const M = MESSAGES[lang];
  const profile = cohort.groups[profileCode];
  const spec = cohort.groups[specCode];
  const specName = lang === 'en' ? spec.name_en : spec.name;
  const rules = cohort.rules;
  const { entries, invalid, duplicates } = parseInput(text);
  const courses = entries.map((e) => classify(cohort, profile, spec, e, M, lang, opts.catalog));
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
  reqs[reqs.length - 1].ref = { url: `https://studieinfo.liu.se/program/6CTMA/${cohort.id}#syllabus:~:text=${encodeURIComponent('Maximalt kan')}`, quote: rules.outsideText };

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

  const schedule = timetable(cohort, opts.alt, opts.catalog, courses, opts.semesters || {}, M, opts.instances || {});
  const todo = guidance({ cohort, catalog: opts.catalog, profile, spec, rules, reqs, schedule, counted, taken, label, M, lang,
    need: { profHp: rules.profileHp - profHp, profAdv: rules.profileAdvCourses - profAdv.length, specHp: rules.specHp - specHp,
      total: TOTAL_HP - totalHp, adv: ADVANCED_HP - advHp, tm: MAIN_FIELD_HP - tmHp, outside: outsideHp - rules.outsideMax },
    missing: { prof: profMissing, spec: specMissing, choice: choiceOk ? [] : specChoice, biz: bizTaken.length ? [] : bizOptions } });
  return { courses, reqs, warnings, schedule, todo, totals: { totalHp, profHp, specHp, advHp, tmHp } };
}

if (typeof module !== 'undefined') module.exports = { validate, parseInput, clash, semesterOptions, courseSchedule, termOf };
