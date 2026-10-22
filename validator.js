// Degree requirement checks for 6CTMA, semesters 7–9.
// Years 1–3, the thesis (30 hp) and the language requirement are assumed done.

// 300 hp = 180 (years 1–3) + 90 (semesters 7–9) + 30 (thesis).
const TOTAL_HP = 90;
// 90 hp advanced level in total, of which the thesis is 30.
const ADVANCED_HP = 60;
// 30 hp advanced level in the main field (Tillämpad matematik).
const MAIN_FIELD_HP = 30;
const DEFAULT_OUTSIDE_HP = 6;

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

const sum = (list) => list.reduce((s, c) => s + c.hp, 0);
const fmt = (hp) => (Math.round(hp * 10) / 10).toString().replace('.', ',');
const isAdv = (level) => /^A/.test(level || '');

function classify(cohort, profile, spec, entry) {
  const info = cohort.courses[entry.code];
  const inProfile = entry.code in profile.c;
  const inSpec = entry.code in spec.c;
  const listings = [cohort.general[entry.code], ...Object.values(cohort.groups).map((g) => g.c[entry.code])]
    .filter(Boolean);
  const base = { code: entry.code, name: info ? info.n : null, hp: info ? info.hp : entry.hp, level: info ? info.l : null,
    tm: info ? info.tm : false, inProfile, inSpec, counted: true, role: null, note: '' };

  if (info && (info.l === 'A2E' || /^TQXX/.test(entry.code))) {
    return { ...base, counted: false, role: 'excluded', note: 'Thesis. Assumed done and not counted here.' };
  }
  if (listings.length) {
    if (listings.every((v) => v === 'f')) {
      return { ...base, counted: false, role: 'excluded', note: 'Voluntary course (F). Does not count toward the degree.' };
    }
    return { ...base, role: inProfile ? 'profile' : inSpec ? 'spec' : 'elective' };
  }
  if (info) {
    const vof = cohort.early[entry.code];
    if (vof === 'o') return { ...base, counted: false, role: 'excluded', note: 'Mandatory year 1–3 course. Already part of the assumed 180 hp.' };
    if (vof === 'f') return { ...base, counted: false, role: 'excluded', note: 'Voluntary course (F). Does not count toward the degree.' };
    return { ...base, role: 'elective', note: 'Year 1–3 elective.' };
  }
  return { ...base, hp: entry.hp ?? DEFAULT_OUTSIDE_HP, level: entry.adv ? 'A' : null, role: 'outside',
    hpAssumed: entry.hp == null,
    note: entry.hp == null ? `Not in the program plan. Credits unknown, assumed ${DEFAULT_OUTSIDE_HP} hp.` : 'Not in the program plan.' };
}

function validate(cohort, profileCode, specCode, text) {
  const profile = cohort.groups[profileCode];
  const spec = cohort.groups[specCode];
  const rules = cohort.rules;
  const { entries, invalid, duplicates } = parseInput(text);
  const courses = entries.map((e) => classify(cohort, profile, spec, e));
  const counted = courses.filter((c) => c.counted);
  const taken = new Set(counted.map((c) => c.code));
  const reqs = [];
  const req = (id, title, ok, detail, progress) => reqs.push({ id, title, ok, detail, progress });
  const missingOf = (codes) => codes.filter((c) => !taken.has(c));
  const label = (code) => `${code}${cohort.courses[code] ? ' ' + cohort.courses[code].n : ''}`;

  // Master profile
  const profMand = Object.keys(profile.c).filter((c) => profile.c[c] === 'o');
  const profMissing = missingOf(profMand);
  req('profile-mandatory', 'Mandatory profile courses', profMissing.length === 0,
    profMand.length === 0 ? 'This profile has no mandatory courses.'
      : profMissing.length ? `Missing: ${profMissing.map(label).join(', ')}.` : `Included: ${profMand.map(label).join(', ')}.`);

  const profCourses = counted.filter((c) => c.inProfile);
  const profHp = sum(profCourses);
  req('profile-hp', `At least ${rules.profileHp} hp from the profile`, profHp >= rules.profileHp,
    `${fmt(profHp)} of ${rules.profileHp} hp from ${profCourses.length} profile course${profCourses.length === 1 ? '' : 's'}.`,
    { value: profHp, target: rules.profileHp });

  const profAdv = profCourses.filter((c) => isAdv(c.level));
  req('profile-adv', `At least ${rules.profileAdvCourses} advanced-level profile courses`, profAdv.length >= rules.profileAdvCourses,
    `${profAdv.length} of ${rules.profileAdvCourses}${profAdv.length ? ': ' + profAdv.map((c) => c.code).join(', ') : ''}.`,
    { value: profAdv.length, target: rules.profileAdvCourses, unit: 'courses' });

  // Technical specialization
  const specMand = Object.keys(spec.c).filter((c) => spec.c[c] === 'o');
  const specChoice = Object.keys(spec.c).filter((c) => spec.c[c] === 'o/v');
  const specMissing = missingOf(specMand);
  const choiceOk = specChoice.length === 0 || specChoice.some((c) => taken.has(c));
  const specParts = [];
  if (specMissing.length) specParts.push(`Missing: ${specMissing.map(label).join(', ')}.`);
  if (!choiceOk) specParts.push(`Pick one of: ${specChoice.map(label).join(', ')}.`);
  if (!specParts.length) specParts.push(`Included: ${[...specMand, ...specChoice.filter((c) => taken.has(c))].map(label).join(', ')}.`);
  req('spec-mandatory', 'Mandatory specialization courses', specMissing.length === 0 && choiceOk, specParts.join(' '));

  const specCourses = counted.filter((c) => c.inSpec);
  const specHp = sum(specCourses);
  req('spec-hp', `At least ${rules.specHp} hp from the specialization`, specHp >= rules.specHp,
    `${fmt(specHp)} of ${rules.specHp} hp from ${specCourses.length} specialization course${specCourses.length === 1 ? '' : 's'}.`,
    { value: specHp, target: rules.specHp });

  // Business course: a specialization may make one of the alternatives mandatory (Finansiell matematik: TEAE01).
  const forced = cohort.business.filter((c) => spec.c[c] === 'o');
  const bizOptions = forced.length ? forced : cohort.business;
  const bizTaken = bizOptions.filter((c) => taken.has(c));
  let bizDetail = bizTaken.length ? `Included: ${bizTaken.map(label).join(', ')}.`
    : `Add ${bizOptions.length === 1 ? '' : 'one of '}${bizOptions.map(label).join(forced.length ? ', ' : ' or ')}.`;
  if (forced.length) bizDetail += ` ${spec.name} requires ${forced.join(', ')}.`;
  else if (rules.businessText.join() !== cohort.business.join()) {
    bizDetail += ` The plan text lists ${rules.businessText.join(' and ')}, but the course table also lists ${cohort.business.filter((c) => !rules.businessText.includes(c)).join(', ')}. All are accepted here. Confirm with your study counsellor.`;
  }
  req('business', 'Business course (företags- och affärsmässiga villkor)', bizTaken.length > 0, bizDetail);

  // Courses outside the program plan
  const outside = counted.filter((c) => c.role === 'outside');
  const outsideHp = sum(outside);
  req('outside', `At most ${rules.outsideMax} hp outside the program plan`, outsideHp <= rules.outsideMax,
    outside.length ? `${fmt(outsideHp)} hp: ${outside.map((c) => c.code).join(', ')}.${outsideHp > rules.outsideMax ? ` Only ${rules.outsideMax} hp can count.` : ''}`
      : 'No courses outside the program plan.',
    { value: outsideHp, target: rules.outsideMax, max: true });

  // Credit totals. Outside-plan credits above the cap do not count.
  const totalHp = sum(counted) - Math.max(0, outsideHp - rules.outsideMax);
  req('total', `At least ${TOTAL_HP} hp in semesters 7–9`, totalHp >= TOTAL_HP,
    `${fmt(totalHp)} of ${TOTAL_HP} hp counted.`, { value: totalHp, target: TOTAL_HP });

  // Mandatory advanced-level courses from years 1–3 (TANA31) count toward the advanced totals.
  const earlyAdv = Object.keys(cohort.early)
    .filter((c) => cohort.early[c] === 'o' && isAdv(cohort.courses[c].l))
    .map((c) => ({ code: c, ...cohort.courses[c] }));
  const advHp = sum(counted.filter((c) => isAdv(c.level))) + sum(earlyAdv);
  const earlyNote = earlyAdv.length ? ` Includes ${earlyAdv.map((c) => `${c.code} (${fmt(c.hp)} hp)`).join(', ')} from year 3.` : '';
  req('advanced', `At least ${ADVANCED_HP} hp at advanced level`, advHp >= ADVANCED_HP,
    `${fmt(advHp)} of ${ADVANCED_HP} hp, not counting the thesis.${earlyNote}`, { value: advHp, target: ADVANCED_HP });

  const earlyTm = earlyAdv.filter((c) => c.tm);
  const tmHp = sum(counted.filter((c) => isAdv(c.level) && c.tm)) + sum(earlyTm);
  req('main-field', `At least ${MAIN_FIELD_HP} hp advanced in Tillämpad matematik`, tmHp >= MAIN_FIELD_HP,
    `${fmt(tmHp)} of ${MAIN_FIELD_HP} hp.${earlyTm.length ? ` Includes ${earlyTm.map((c) => c.code).join(', ')} from year 3.` : ''}`,
    { value: tmHp, target: MAIN_FIELD_HP });

  const warnings = [];
  if (invalid.length) warnings.push(`Couldn't read ${invalid.map((t) => `"${t}"`).join(', ')}. Use course codes like TAMS46, optionally with credits: ABC123:7.5.`);
  if (duplicates.length) warnings.push(`Listed more than once: ${[...new Set(duplicates)].join(', ')}. Counted once.`);
  const both = counted.filter((c) => c.inProfile && c.inSpec);
  if (both.length) warnings.push(`${both.map((c) => c.code).join(', ')} is listed in both the profile and the specialization and is counted toward both. Check whether that is allowed.`);
  const assumed = outside.filter((c) => c.hpAssumed);
  if (assumed.length) warnings.push(`Credits assumed to be ${DEFAULT_OUTSIDE_HP} hp for ${assumed.map((c) => c.code).join(', ')}. Write e.g. ${assumed[0].code}:7.5 to set them.`);
  if (outside.some((c) => !isAdv(c.level))) warnings.push('Courses outside the program plan count as basic level unless you add :A, e.g. ABC123:7.5:A.');

  return { courses, reqs, warnings, totals: { totalHp, profHp, specHp, advHp, tmHp } };
}

if (typeof module !== 'undefined') module.exports = { validate, parseInput };
