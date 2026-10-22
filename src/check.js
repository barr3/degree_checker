// The textarea is the checker's view of state.text.
const codesInText = () => new Set(planCodes());

function toggleCourse(code) {
  const codes = [...codesInText()];
  const next = codes.includes(code) ? codes.filter((c) => c !== code) : [...codes, code];
  // Keep any credit/level annotations the user typed for other courses.
  const kept = $('courses').value.toUpperCase().split(/[\s,;]+/).filter(Boolean)
    .filter((tok) => next.includes(tok.split(':')[0]));
  if (!codes.includes(code)) kept.push(code);
  $('courses').value = state.text = kept.join(', ');
  state.isExample = false;
  update();
}

function renderPageStatic() {
  $('assumed').innerHTML = t().assumed.map((a) => `<li>${esc(a)}</li>`).join('');
}

function afterLoad() { $('courses').value = state.text; }

function renderPicker() {
  const c = cohortOf();
  const taken = codesInText();
  const group = (title, entries) => `
    <div class="picker-group">
      <h3>${esc(title)}</h3>
      <div class="chips">${entries.map(([code, vof]) => {
        const info = c.courses[code];
        const tag = t().vof[vof];
        return `<button type="button" class="chip" data-code="${esc(code)}" aria-pressed="${taken.has(code)}" title="${esc(courseName(info))} · ${esc(info.l)}">${esc(code)}<span class="hp">${hp(info.hp)}</span>${tag ? `<span class="tag">${esc(tag)}</span>` : ''}</button>`;
      }).join('')}</div>
    </div>`;
  const order = { o: 0, 'o/v': 1, v: 2, f: 3 };
  const sorted = (obj) => Object.entries(obj).sort((a, b) => order[a[1]] - order[b[1]] || a[0].localeCompare(b[0]));
  const p = c.groups[$('profile').value], s = c.groups[$('spec').value];
  const biz = c.business.map((code) => [code, s.c[code] === 'o' ? 'o' : 'o/v']);
  $('picker').innerHTML = `<p class="hint">${esc(t().tapHint)}</p>`
    + group(`${t().groupProfile} · ${groupName(p)}`, sorted(p.c))
    + group(`${t().groupSpec} · ${groupName(s)}`, sorted(s.c))
    + group(t().groupBiz, biz);
}


function renderResults(r) {
  const met = r.reqs.filter((q) => q.ok).length, total = r.reqs.length;
  const clashes = r.schedule.collisions.length;
  const v = $('verdict');
  v.className = 'verdict ' + (met === total ? 'reqs-ok' : 'reqs-bad') + (clashes ? ' has-clash' : met === total ? ' all-ok' : '');
  const missing = r.reqs.filter((q) => !q.ok).map((q) => q.title.toLowerCase());
  v.innerHTML = `<div class="score">${met}<small>/${total}</small></div><div>
    <strong>${met === total ? esc(t().allMet) : esc(t().notMet(total - met))}</strong>
    <span>${met === total ? esc(t().hpCounted(hp(r.totals.totalHp))) : esc(t().notMetList(missing.join('; ')))}</span>
    ${clashes ? `<span class="clash-line">${esc(t().clashLine(clashes))}</span>` : ''}</div>
    <button type="button" class="export-open" id="export-open">${esc(t().exportOpen)}</button>`;

  $('warnings').innerHTML = r.warnings.map((w) => `<li>${esc(w)}</li>`).join('');

  $('reqs').innerHTML = renderReqGroups(r);
  $('todo').innerHTML = renderTodo(r);

  const clashing = new Set(r.schedule.collisions.flatMap((x) => [x.a, x.b]));
  const row = (course) => {
    let semCell = '—';
    if (course.semOptions) {
      const also = course.otherSlots.length ? ` (${t().alsoGiven} ${instText(course.otherSlots)})` : '';
      semCell = (course.semOptions.length > 1
        ? `<select data-sem="${esc(course.code)}" aria-label="${esc(t().thSemester)} ${esc(course.code)}">${course.semOptions.map((s) => `<option value="${s}"${s === course.sem ? ' selected' : ''}>${s}</option>`).join('')}</select>`
        : `<span class="mono">${course.sem}</span>`) + `<span class="slots">${esc(slotText(course.slots) + also)}</span>`;
    }
    return `<tr class="${clashing.has(course.code) ? 'clashing' : ''}">
      <td class="code">${esc(course.code)}</td>
      <td>${course.name ? `<a class="course-link" href="${courseUrl(course.code)}" target="_blank" rel="noopener">${esc(course.name)}</a>` : '—'}${course.note ? `<span class="course-note">${esc(course.note)}</span>` : ''}</td>
      <td class="num">${hp(course.hp)}</td>
      <td class="mono">${esc(course.level || '—')}</td>
      <td>${semCell}</td>
      <td><span class="role ${course.role}">${esc(t().roles[course.role])}</span></td></tr>`;
  };
  $('course-rows').innerHTML = r.courses.length ? chronological(r).map((sec) =>
    `<tr class="sem-head"><th colspan="6">${esc(sec.label)}<span>${hp(sec.hp)} hp</span></th></tr>`
      + sec.periods.map(([key, list]) => (key ? `<tr class="period-head"><td colspan="6">${esc(t().periodHead(key))}</td></tr>` : '') + list.map(row).join('')).join('')).join('')
    : `<tr><td colspan="6" class="empty">${esc(t().noCourses)}</td></tr>`;

  renderTimetable(r);
}

function renderTimetable(r) {
  const s = r.schedule;
  const c = cohortOf();
  const nameOf = (code) => {
    const info = c.courses[code] || ALT.c[code];
    return info ? `${code} ${courseName(info)}` : code;
  };
  const tiles = [7, 8, 9].map((sem) => `<div class="sem-tile"><span>${esc(t().thSemester)} ${sem}</span><b>${hp(s.perSemester[sem])} hp</b></div>`).join('')
    + (s.unplacedHp ? `<div class="sem-tile"><span>${esc(t().unscheduled)}</span><b>${hp(s.unplacedHp)} hp</b></div>` : '');
  let body = '';
  if (!s.collisions.length) {
    body = `<p class="ok-note">${esc(t().noClash)}</p>`;
  } else {
    // Moving a course to another TMA semester needs no exception; the caveat is for other programs and other courses.
    const risky = s.collisions.some((x) => x.options.slice(0, 10).some((o) => o.type !== 'move'));
    body = (risky ? `<p class="caveat"><strong>${esc(t().caveatTitle)}</strong>${esc(t().caveat)}</p>` : '') + s.collisions.map((x) => {
      const alts = x.options.slice(0, 10).map((o) => {
        if (o.type === 'move') {
          return `<li><div><span class="alt-kind">${esc(t().move)}</span>${esc(t().moveText(o.code, o.sem))}<span class="alt-meta">${esc(instText(o.slots))}</span></div>
            <button type="button" data-move="${esc(o.code)}" data-to="${o.sem}">${esc(t().moveBtn(o.sem))}</button></li>`;
        }
        const g = o.group;
        const progs = g.p.map((p) => `${p} ${ALT.progs[p] || ''}`.trim()).join(', ');
        const where = `${g.t} · ${slotText(g.s)} · ${g.campus} · ${g.lang}`;
        if (o.type === 'program') {
          return `<li><div><span class="alt-kind">${esc(t().program)}</span>${esc(t().programText(o.code, progs))}<span class="alt-meta">${esc(where)}. ${esc(t().fits(o.sem))}.</span></div></li>`;
        }
        const info = o.info;
        return `<li><div><span class="alt-kind">${esc(t().similar)}</span><a href="https://studieinfo.liu.se/${state.lang === 'en' ? 'en/' : ''}kurs/${esc(o.code)}" target="_blank" rel="noopener">${esc(o.code)} ${esc(courseName(info))}</a>, ${hp(info.hp || 0)} hp${info.l ? ', ' + esc(info.l) : ''}
          <span class="alt-meta">${esc(where)}. ${esc(t().fits(o.sem))}. ${esc(t().similarCounts(o.inPlan))}</span>
          <span class="alt-meta">${esc(t().programText(o.code, progs))}</span></div></li>`;
      }).join('');
      const searches = [x.a, x.b].map((code) => {
        const info = c.courses[code];
        const q = encodeURIComponent(info.n);
        return `<a href="https://studieinfo.liu.se/${state.lang === 'en' ? 'en/' : ''}?Term=${q}&Type=course&MainFieldOfStudy=" target="_blank" rel="noopener">${esc(courseName(info))}</a>`;
      }).join(' · ');
      return `<div class="clash">
        <div class="clash-head"><strong>${esc(t().clashHead(nameOf(x.a), nameOf(x.b)))}</strong><span>${esc(t().clashWhere(x.sem, x.period, x.block))}</span></div>
        ${alts ? `<ul class="alts">${alts}</ul>` : `<p class="hint">${esc(t().noAlts)}</p>`}
        <div class="search-links">${esc(t().search)} ${searches}</div>
      </div>`;
    }).join('');
  }
  $('timetable').innerHTML = `<h2>${esc(t().ttTitle)}</h2><div class="tt-summary">${tiles}</div>${renderLoad(r)}${body}<p class="hint">${esc(t().ttHint)}</p>`;
}


function update() {
  $('example-tag').hidden = !state.isExample;
  const r = validate(cohortOf(), $('profile').value, $('spec').value, state.text, validateOpts({ alt: ALT }));
  lastResult = r;
  renderResults(r);
  renderPicker();
  save();
}

$('courses').addEventListener('input', () => { state.text = $('courses').value; state.isExample = false; update(); });
$('clear').addEventListener('click', () => { $('courses').value = state.text = ''; state.semesters = {}; state.isExample = false; state.planId = null; update(); $('courses').focus(); });
$('example').addEventListener('click', () => { loadPlan(EXAMPLE); state.isExample = true; state.planId = null; update(); });
$('picker').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) toggleCourse(b.dataset.code); });
$('course-rows').addEventListener('change', (e) => {
  const sel = e.target.closest('select[data-sem]');
  if (sel) { state.semesters[sel.dataset.sem] = Number(sel.value); state.isExample = false; update(); }
});
$('timetable').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-move]');
  if (b) { state.semesters[b.dataset.move] = Number(b.dataset.to); state.isExample = false; update(); }
});
boot();
