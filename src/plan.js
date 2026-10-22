// Build a plan: semesters 7–9 laid out period by period, courses grouped by timetable block.
// The plan itself (state.text, state.semesters) is the same one the checker uses.

const BLOCK_ORDER = ['1', '2', '3', '4', '-'];

// Instances of a course in the term a semester belongs to (each a list of [period, block] slots).
function instancesIn(code, sem) {
  const info = courseSchedule(cohortOf(), CATALOG, code);
  return info ? info.s[termOf(sem)] || [] : [];
}
function infoOf(code) {
  return cohortOf().courses[code] || CATALOG.courses[code] || null;
}

// Courses of the TMA plan to show: the chosen profile and specialization plus the general courses,
// or every TMA course in semesters 7–9 with "show all".
function visibleCourses() {
  const c = cohortOf();
  const p = c.groups[$('profile').value], s = c.groups[$('spec').value];
  const tags = {};
  const add = (code, tag, vof) => {
    if (vof === 'f' || !c.courses[code] || !c.courses[code].s) return;
    if (!tags[code]) tags[code] = { roles: [], vof };
    if (tag && !tags[code].roles.includes(tag)) tags[code].roles.push(tag);
    if ((vof === 'o' || vof === 'o/v') && tag) tags[code].vof = vof;
  };
  for (const [code, vof] of Object.entries(p.c)) add(code, 'profile', vof);
  for (const [code, vof] of Object.entries(s.c)) add(code, 'spec', vof);
  for (const [code, vof] of Object.entries(c.general)) add(code, null, c.business.includes(code) ? (s.c[code] === 'o' ? 'o' : 'o/v') : vof);
  if ($('show-all').checked) {
    for (const g of Object.values(c.groups)) for (const [code, vof] of Object.entries(g.c)) add(code, null, vof === 'o' || vof === 'o/v' ? 'v' : vof);
  }
  return tags;
}

function placedIn(r, sem) {
  return r.courses.filter((x) => x.counted && x.sem === sem).map((x) => ({ code: x.code, insts: instancesIn(x.code, sem), coord: (infoOf(x.code) || {}).coord || [] }));
}

// Courses already in the plan for this semester that the course would collide with.
function conflictsFor(code, sem, r) {
  const insts = instancesIn(code, sem);
  const coord = (infoOf(code) || {}).coord || [];
  return placedIn(r, sem).filter((p) => p.code !== code && !coord.includes(p.code) && !p.coord.includes(code))
    .map((p) => ({ code: p.code, slot: clash(insts, p.insts) })).filter((x) => x.slot);
}

function courseButton(code, sem, r, meta, cls) {
  const info = infoOf(code);
  const inPlan = r.courses.find((x) => x.code === code);
  const here = inPlan && inPlan.sem === sem;
  let note = '';
  let status = '';
  if (here) status = 'selected';
  else if (inPlan && inPlan.sem) { status = 'elsewhere'; note = t().chosenIn(inPlan.sem); }
  else {
    const conflicts = conflictsFor(code, sem, r);
    if (conflicts.length) { status = 'conflict'; note = t().clashesWith(conflicts.map((x) => x.code).join(', ')); }
  }
  return `<button type="button" class="course ${status} ${cls || ''}" data-code="${esc(code)}" data-sem="${sem}" aria-pressed="${here}">
    <span class="c-head"><span class="c-code">${esc(code)}</span><span class="c-hp">${hp(info.hp)} hp</span></span>
    <span class="c-name">${esc(courseName(info))}</span>
    <span class="c-meta">${esc(meta)}</span>${note ? `<span class="c-note">${esc(note)}</span>` : ''}</button>`;
}

function renderGrid(r) {
  const tags = visibleCourses();
  // Courses in the plan are always shown, also when they are outside the current filter.
  for (const x of r.courses) if (x.counted && x.sem && !tags[x.code]) tags[x.code] = { roles: x.role === 'outside' ? ['outside'] : [], vof: '' };
  const html = [7, 8, 9].map((sem) => {
    // period -> block -> [[code, cls]]
    const cells = { 1: {}, 2: {} };
    for (const [code, tag] of Object.entries(tags)) {
      const insts = instancesIn(code, sem);
      for (const inst of insts) {
        const both = new Set(inst.map(([p]) => p)).size > 1;
        for (const [p, b] of inst) {
          if (!cells[p]) continue;
          (cells[p][b] = cells[p][b] || []).push([code, tag, both]);
        }
      }
    }
    const periods = [1, 2].map((p) => {
      const blocks = BLOCK_ORDER.filter((b) => cells[p][b]).map((b) => {
        const list = cells[p][b].sort((a, z) => (z[1].vof === 'o') - (a[1].vof === 'o') || a[0].localeCompare(z[0]));
        return `<div class="block"><h4>${esc(b === '-' ? t().noBlockHead : t().blockHead(b))}</h4>${list.map(([code, tag, both]) => {
          const info = infoOf(code);
          const parts = [info.l, ...tag.roles.map((x) => (x === 'outside' ? t().roles.outside : t().roles[x])), t().vof[tag.vof] || '', both ? t().periodHead('12') : ''].filter(Boolean);
          return courseButton(code, sem, r, parts.join(' · '), tag.vof === 'o' ? 'mandatory' : '');
        }).join('')}</div>`;
      }).join('');
      return `<div class="period"><h3>${esc(t().periodHead(String(p)))}</h3>${blocks || '<p class="hint">–</p>'}</div>`;
    }).join('');
    const total = r.schedule.perSemester[sem];
    const heavy = total > 30;
    return `<section class="sem" data-sem="${sem}"><header><h2>${esc(t().semHead(sem, termLabel(sem)))}</h2>
      <span class="sem-hp${heavy ? ' heavy' : ''}">${hp(total)} hp</span></header><div class="periods">${periods}</div></section>`;
  }).join('');
  $('grid').innerHTML = html;
}

function renderSummary(r) {
  const met = r.reqs.filter((q) => q.ok).length, total = r.reqs.length;
  const missing = r.reqs.filter((q) => !q.ok);
  const clashes = r.schedule.collisions;
  const counted = r.courses.filter((x) => x.counted);
  const sems = [7, 8, 9].map((sem) => `<tr><th>${esc(t().semHead(sem, termLabel(sem)))}</th><td class="num${r.schedule.perSemester[sem] > 30 ? ' heavy' : ''}">${hp(r.schedule.perSemester[sem])} hp</td></tr>`).join('');
  $('summary').innerHTML = `<h2>${esc(t().summaryTitle)}</h2>
    <p class="hint">${esc(counted.length ? t().planCourses(counted.length, hp(r.totals.totalHp)) : t().emptyPlan)}</p>
    <p class="sum-line ${met === total ? 'ok' : 'bad'}">${met === total ? '✓' : '✗'} ${esc(t().summaryReqs(met, total))}</p>
    ${missing.length ? `<ul class="sum-missing">${missing.map((q) => `<li>${esc(q.title)}</li>`).join('')}</ul>` : ''}
    ${clashes.length ? `<ul class="sum-clashes">${clashes.map((x) => `<li>${esc(t().clashItem(x.a, x.b, x.sem, x.period, x.block))}</li>`).join('')}</ul>` : ''}
    <table class="sem-sum"><tbody>${sems}</tbody></table>
    ${renderLoad(r)}
    <p class="sum-links"><a href="#all-reqs">${esc(t().seeAll)}</a> · <a href="index.html">${esc(t().openInCheck)}</a></p>`;
}

function renderOther(r) {
  const c = cohortOf();
  const q = $('other-search').value.trim().toLowerCase();
  const advOnly = $('other-adv').checked;
  if (q.length < 2) {
    // Show the courses from the catalog that are already in the plan, so they can be removed here too.
    const chosen = r.courses.filter((x) => CATALOG.courses[x.code] && !c.courses[x.code]).map((x) => x.code);
    $('other-results').innerHTML = chosen.map((code) => otherItem(code, r)).join('') + `<li class="hint">${esc(t().otherPrompt)}</li>`;
    return;
  }
  const hits = Object.entries(CATALOG.courses).filter(([code, info]) => !c.courses[code]
    && (!advOnly || /^A/.test(info.l || ''))
    && (code.toLowerCase().startsWith(q) || info.n.toLowerCase().includes(q) || (info.ne || '').toLowerCase().includes(q))
    && courseSchedule(c, CATALOG, code))
    .sort((a, b) => a[0].localeCompare(b[0]));
  const shown = hits.slice(0, 30);
  $('other-results').innerHTML = shown.length
    ? shown.map(([code]) => otherItem(code, r)).join('') + (hits.length > shown.length ? `<li class="hint">${esc(t().otherMore(hits.length - shown.length))}</li>` : '')
    : `<li class="hint">${esc(t().otherNone)}</li>`;
}

function otherItem(code, r) {
  const c = cohortOf();
  const info = CATALOG.courses[code];
  const sched = courseSchedule(c, CATALOG, code);
  const when = Object.entries(sched.s).map(([term, insts]) => `${term}: ${instText(insts)}`).join(' · ');
  const progs = info.lang ? t().roles.outside : info.progs.join(', ');
  const inPlan = r.courses.find((x) => x.code === code);
  const actions = inPlan
    ? `<span class="hint">${esc(t().inPlan(inPlan.sem || '–'))}</span><button type="button" data-remove="${esc(code)}">${esc(t().remove)}</button>`
    : semesterOptions(sched).map((sem) => `<button type="button" data-add="${esc(code)}" data-sem="${sem}">${esc(t().addTo(sem))}</button>`).join('');
  return `<li class="other-item"><div><span class="c-code">${esc(code)}</span> ${esc(courseName(info))}
      <span class="c-meta">${hp(info.hp)} hp · ${esc(info.l || '')} · ${esc(when)} · ${esc(progs)}</span></div>
    <div class="row">${actions}</div></li>`;
}

let toastTimer;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
}

async function addCourse(code, sem) {
  const conflicts = conflictsFor(code, sem, lastResult);
  if (conflicts.length) {
    const list = conflicts.map((x) => t().conflictItem(x.code, sem, x.slot[0], x.slot[1]));
    const ok = await confirmBox(t().conflictTitle, `<p>${esc(t().conflictText(code, list.join(', ')))}</p>`, t().conflictOk);
    if (!ok) return;
  }
  const before = lastResult.schedule.perSemester[sem];
  setCourse(code, sem);
  update();
  const after = lastResult.schedule.perSemester[sem];
  if (after > 30 && after > before) {
    const heavy = lastResult.schedule.load.find((w) => w.type === 'heavy' && w.sem === sem);
    if (heavy) toast(heavy.text);
  }
}

function renderPageStatic() {
  $('other-hint').textContent = t().otherHint(cohortOf().rules.outsideMax);
}

function afterLoad() {}

function update() {
  const r = validate(cohortOf(), $('profile').value, $('spec').value, state.text, validateOpts());
  lastResult = r;
  renderSummary(r);
  renderGrid(r);
  renderOther(r);
  $('reqs').innerHTML = renderReqGroups(r);
  save();
}

$('grid').addEventListener('click', (e) => {
  const b = e.target.closest('.course');
  if (!b) return;
  const code = b.dataset.code, sem = Number(b.dataset.sem);
  const inPlan = lastResult.courses.find((x) => x.code === code);
  // Clicking a chosen course removes it; clicking it in another semester moves it there.
  if (inPlan && inPlan.sem === sem) { removeCourse(code); update(); }
  else addCourse(code, sem);
});
$('other-results').addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  const rem = e.target.closest('[data-remove]');
  if (add) addCourse(add.dataset.add, Number(add.dataset.sem));
  if (rem) { removeCourse(rem.dataset.remove); update(); }
});
$('other-search').addEventListener('input', () => renderOther(lastResult));
$('other-adv').addEventListener('change', () => renderOther(lastResult));
$('show-all').addEventListener('change', update);
$('clear-plan').addEventListener('click', () => { state.text = ''; state.semesters = {}; state.isExample = false; state.planId = null; update(); });
boot();
