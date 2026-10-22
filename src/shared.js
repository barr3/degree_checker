const DATA = /*__DATA__*/;
const ALT = /*__ALT__*/;
const CATALOG = /*__CATALOG__*/;
/*__VALIDATOR__*/

const UI = {
  en: {
    eyebrow: '6CTMA · Civilingenjör i teknisk matematik · Linköping',
    intro: 'Choose your admission year, master profile and technical specialization, then list the courses you have taken or plan to take in semesters 7–9. The checklist updates as you type.',
    cohort: 'Admission year', profile: 'Master profile', spec: 'Technical specialization',
    courses: 'Your courses, semesters 7–9', exampleTag: 'Example plan',
    coursesHint: 'Course codes separated by commas or new lines. Courses from other Linköping engineering programs and language courses are recognized. For any other course, add its credits and <code>:A</code> if it is advanced level, e.g. <code>ABC123:7.5:A</code>.',
    clear: 'Clear list', loadExample: 'Load example', tapHint: 'Tap a course to add or remove it.',
    groupProfile: 'Profile', groupSpec: 'Specialization', groupBiz: 'Business course',
    vof: { o: 'mandatory', 'o/v': 'pick one', v: '', f: 'voluntary' },
    allMet: 'Every checked requirement is met', notMet: (n) => `${n} requirement${n === 1 ? '' : 's'} not met`,
    hpCounted: (hp) => `${hp} hp counted in semesters 7–9.`, notMetList: (x) => `Not met: ${x}.`,
    clashLine: (n) => `${n} timetable collision${n === 1 ? '' : 's'}. See Timetable below.`,
    groups: ['Master profile', 'Technical specialization', 'Degree requirements'],
    met: 'Met', notMetPill: 'Not met',
    yourCourses: 'Your courses', thCode: 'Code', thCourse: 'Course', thLevel: 'Level', thSemester: 'Semester', thCounts: 'Counts toward',
    roles: { profile: 'Profile', spec: 'Specialization', elective: 'Program elective', outside: 'Outside plan', excluded: 'Not counted' },
    noCourses: 'No courses yet. Type course codes or tap them in the list on the left.',
    period: 'P', block: 'block', or: 'or', noBlock: 'no block', alsoGiven: 'also given',
    semHead: (sem, term) => `Semester ${sem} · ${term}`, noTimetable: 'No timetable',
    periodHead: (key) => (key === '12' ? 'Periods 1–2' : `Period ${key}`),
    semTotals: 'Credits per semester', unscheduled: 'no semester',
    ttTitle: 'Timetable',
    noClash: 'No timetable collisions between your courses in the semesters you picked.',
    ttHint: 'Collisions are checked per semester, so change a course\'s semester in the table above to move it. Autumn courses can usually be taken in semester 7 or 9.',
    clashHead: (a, b) => `${a} and ${b} collide`,
    clashWhere: (sem, p, blk) => `Semester ${sem}, period ${p}, block ${blk}.`,
    caveatTitle: 'These alternatives are not guaranteed to work.',
    caveat: 'Taking a course with another program needs a free seat and usually approval from the course or your program. A course with a different code is a different course: it may not count toward your profile or specialization, and it may overlap in content with courses you already have. Timetables come from studieinfo and can change. Check with study counselling before you change your plan.',
    move: 'Other semester', moveText: (c, s) => `Take ${c} in semester ${s} instead.`, moveBtn: (s) => `Move to semester ${s}`,
    program: 'Same course, other program',
    programText: (c, progs) => `${c} is also given for ${progs}.`,
    similar: 'Similar course, different code',
    similarCounts: (inPlan) => inPlan ? 'In the 6CTMA plan: counts as a program elective, not toward your profile or specialization unless listed there.' : 'Not in the 6CTMA plan: counts as a course outside the program plan (max 18 hp).',
    fits: (sem) => `Fits in semester ${sem}`,
    noAlts: 'No collision-free alternative found in the downloaded timetables.',
    search: 'Search studieinfo:',
    assumed: [
      'Years 1–3 are complete (180 hp, all mandatory courses).',
      'The thesis (30 hp, advanced level in Tillämpad matematik) is done.',
      'The language requirement is met (thesis in English, a 6 hp language course, or a semester abroad).',
      'No two courses overlap in content. Overlapping courses cannot both count toward the degree.',
      'Courses outside the program plan have no timetable here and are not checked for collisions.',
    ],
    assumedTitle: 'Assumed and not checked',
    unofficial: 'Unofficial tool. Check your final plan with study counselling (studievägledningen) before relying on it.',
    navCheck: 'Check a plan', navPlan: 'Build a plan', helpTitle: 'Show the guide',
    planIntro: 'Pick your master profile and technical specialization, then click courses period by period to build semesters 7–9. Requirements, collisions and credits update as you go.',
    aboutTitle: 'About',
    aboutText: 'TMA Degree Check is made by a student on the Engineering Mathematics program to make it easier to plan years 4 and 5. Course data and rules come from studieinfo.liu.se. Everything runs in your browser, and your plans are only saved on your own device.',
    contactText: 'Questions, or found a mistake? Email', githubText: 'Want to help improve it? The code is on GitHub:',
    sourceRef: 'Source: the program syllabus',
    loadTitle: 'Credits and CSN', loadOk: 'Semesters 7 and 8 add up to 60 hp and semester 9 to 30 hp.',
    savedTitle: 'Saved plans', savedUnsaved: '(unsaved plan)', planSave: 'Save', planSaveAs: 'Save as new…', planDelete: 'Delete',
    planName: 'Name of the plan', planNamePlaceholder: 'e.g. Plan A – machine learning', planNameOk: 'Save', planNameCancel: 'Cancel',
    savedHint: 'Plans are saved in this browser only.', savedChanged: 'Changed since you last saved.', savedSaved: (n) => `Saved as “${n}”.`,
    savedDeleteTitle: 'Delete plan?', savedDeleteText: (n) => `“${n}” will be deleted from this browser. This can't be undone.`,
    savedOpenTitle: 'Open another plan?', savedOpenText: 'Your current plan has changes that are not saved. They will be lost.',
    confirmCancel: 'Cancel', confirmDelete: 'Delete', confirmOpen: 'Open anyway',
    tourNext: 'Next', tourBack: 'Back', tourDone: 'Done', tourSkip: 'Skip', tourCount: (i, n) => `${i} of ${n}`,
    tour: {
      check: [
        ['#cohort', 'Your program', 'Start by choosing your admission year, master profile and technical specialization.'],
        ['#courses', 'Your courses', 'Type the course codes you have taken or plan to take, or tap them in the lists below. Everything updates as you type.'],
        ['#verdict', 'Summary', 'How many requirements are met, and whether any courses collide. You can export the plan as PDF or Excel from here.'],
        ['#reqs', 'Requirements', 'Every requirement, with exactly what is missing.'],
        ['#course-table', 'Your courses in order', 'Semester by semester and period by period. Autumn courses can be moved between semester 7 and 9 here.'],
        ['#timetable', 'Timetable and credits', 'Collisions with suggestions for getting around them, and warnings about workload and CSN.'],
        ['#saved-plans', 'Saved plans', 'Save the plan to come back to it later. Plans are stored in this browser.'],
        ['#nav-plan', 'Build a plan', 'Prefer to click your plan together period by period? Try Build a plan.'],
      ],
      plan: [
        ['#plan-settings', 'Your program', 'Choose your admission year, master profile and technical specialization.'],
        ['#grid', 'Semester by semester', 'Each semester has two periods, with the courses grouped by timetable block. Courses in the same period and block collide.'],
        ['#grid .course', 'Pick courses', 'Click a course to add it and again to remove it. Autumn courses can be taken in semester 7 or 9. You get a warning if a course collides or a semester gets heavy.'],
        ['#other', 'Other courses', 'Courses from other engineering programs in Linköping and language courses. Up to 18 hp can count toward the degree.'],
        ['#summary', 'Your plan', 'Requirements, credits per semester and CSN at a glance.'],
        ['#saved-plans', 'Save and export', 'Save plans in this browser, or export them as PDF or Excel.'],
        ['#nav-check', 'Check a plan', 'See the plan in detail, with alternatives for collisions.'],
      ],
    },
    clearPlan: 'Clear plan', showAll: 'Show courses from all profiles and specializations',
    otherTitle: 'Other courses', otherHint: (n) => `Courses from other engineering programs in Linköping, and language courses. They count as courses outside the program plan, and at most ${n} hp of those count toward the degree.`,
    otherSearch: 'Search by code or name', otherAdvanced: 'Advanced level only', otherNone: 'No courses match the search.',
    otherMore: (n) => `${n} more. Narrow the search to see them.`, otherPrompt: 'Type at least two letters, or a course code.',
    addTo: (sem) => `+ Semester ${sem}`, inPlan: (sem) => `In your plan, semester ${sem}`, remove: 'Remove',
    noBlockHead: 'No block', blockHead: (b) => `Block ${b}`,
    chosenIn: (sem) => `chosen for semester ${sem}`, clashesWith: (codes) => `collides with ${codes}`,
    conflictTitle: 'Timetable collision', conflictOk: 'Add anyway',
    conflictText: (code, list) => `${code} has lectures at the same time as ${list}. You can't attend both, unless you take one of them another semester.`,
    conflictItem: (code, sem, p, b) => `${code} (semester ${sem}, period ${p}, block ${b})`,
    summaryTitle: 'Your plan', summaryReqs: (met, total) => `${met} of ${total} requirements met`, seeAll: 'See all requirements',
    openInCheck: 'Show in Check a plan', emptyPlan: 'No courses yet. Click courses in the semesters to the right to start.',
    planCourses: (n, hpTotal) => `${n} course${n === 1 ? '' : 's'}, ${hpTotal} hp`,
    exportOpen: 'Export…', exportTitle: 'Export your plan', exportFormat: 'Format',
    exportPdfHint: 'For reading and printing, e.g. to bring to study counselling.',
    exportXlsxHint: 'A spreadsheet you can sort and keep editing.',
    exportCancel: 'Cancel', exportGo: 'Export', exportAnyway: 'Export anyway', exporting: 'Creating file…',
    exportOk: 'Every checked requirement is met and there are no timetable collisions.',
    exportProblems: 'The plan does not meet every requirement yet',
    exportProblemsNote: 'You can export it anyway. The file will say that the plan is not complete.',
    exportEmpty: 'Add some courses before exporting.',
    exportFailed: 'Couldn\'t load the export tool. Check your internet connection and try again.',
    clashItem: (a, b, sem, p, blk) => `${a} and ${b} collide (semester ${sem}, period ${p}, block ${blk})`,
    file: {
      title: 'Study plan', name: 'study-plan', program: 'Program', programValue: 'Civilingenjör i teknisk matematik (6CTMA), Linköping University',
      exported: 'Exported', statusOk: 'Every checked requirement is met.', statusBad: 'NOT COMPLETE: the plan does not meet every requirement.',
      sheetPlan: 'Plan', sheetReqs: 'Requirements', sheetClashes: 'Collisions', part: 'Part', status: 'Status', note: 'Note',
      period: 'Period', block: 'Block', alternatives: 'Alternatives', totals: 'Credits', total: 'Counted in semesters 7–9',
      requirement: 'Requirement', result: 'Result', courseA: 'Course 1', courseB: 'Course 2', page: (i, n) => `Page ${i} of ${n}`,
    },
    source: (url, date) => `Course data, rules and timetables from <a href="${url}" target="_blank" rel="noopener">studieinfo.liu.se</a>, read on ${date}.`,
  },
  sv: {
    eyebrow: '6CTMA · Civilingenjör i teknisk matematik · Linköping',
    intro: 'Välj antagningsår, masterprofil och teknisk inriktning och lista sedan kurserna du har läst eller planerar att läsa termin 7–9. Kontrollen uppdateras medan du skriver.',
    cohort: 'Antagningsår', profile: 'Masterprofil', spec: 'Teknisk inriktning',
    courses: 'Dina kurser, termin 7–9', exampleTag: 'Exempelplan',
    coursesHint: 'Kurskoder separerade med komma eller ny rad. Kurser från andra civilingenjörsprogram i Linköping och språkkurser känns igen. För andra kurser, lägg till hp och <code>:A</code> om kursen är på avancerad nivå, t.ex. <code>ABC123:7.5:A</code>.',
    clear: 'Rensa listan', loadExample: 'Ladda exempel', tapHint: 'Tryck på en kurs för att lägga till eller ta bort den.',
    groupProfile: 'Profil', groupSpec: 'Inriktning', groupBiz: 'Företags- och affärsmässiga villkor',
    vof: { o: 'obligatorisk', 'o/v': 'välj en', v: '', f: 'frivillig' },
    allMet: 'Alla kontrollerade krav är uppfyllda', notMet: (n) => `${n} krav är inte uppfyllt${n === 1 ? '' : 'a'}`,
    hpCounted: (hp) => `${hp} hp räknas under termin 7–9.`, notMetList: (x) => `Ej uppfyllt: ${x}.`,
    clashLine: (n) => `${n} schemakrock${n === 1 ? '' : 'ar'}. Se Schema nedan.`,
    groups: ['Masterprofil', 'Teknisk inriktning', 'Examenskrav'],
    met: 'Uppfyllt', notMetPill: 'Ej uppfyllt',
    yourCourses: 'Dina kurser', thCode: 'Kod', thCourse: 'Kurs', thLevel: 'Nivå', thSemester: 'Termin', thCounts: 'Räknas till',
    roles: { profile: 'Profil', spec: 'Inriktning', elective: 'Valbar i programmet', outside: 'Utanför programplanen', excluded: 'Räknas inte' },
    noCourses: 'Inga kurser än. Skriv kurskoder eller tryck på dem i listan till vänster.',
    period: 'P', block: 'block', or: 'eller', noBlock: 'inget block', alsoGiven: 'ges även',
    semHead: (sem, term) => `Termin ${sem} · ${term}`, noTimetable: 'Utan schema',
    periodHead: (key) => (key === '12' ? 'Period 1–2' : `Period ${key}`),
    semTotals: 'Poäng per termin', unscheduled: 'ingen termin',
    ttTitle: 'Schema',
    noClash: 'Inga schemakrockar mellan dina kurser under de terminer du valt.',
    ttHint: 'Krockar kontrolleras per termin, så ändra en kurs termin i tabellen ovan för att flytta den. Höstkurser kan oftast läsas termin 7 eller 9.',
    clashHead: (a, b) => `${a} och ${b} krockar`,
    clashWhere: (sem, p, blk) => `Termin ${sem}, period ${p}, block ${blk}.`,
    caveatTitle: 'De här alternativen fungerar inte nödvändigtvis.',
    caveat: 'Att läsa en kurs med ett annat program kräver en ledig plats och oftast ett godkännande från kursen eller ditt program. En kurs med en annan kod är en annan kurs: den räknas kanske inte till din profil eller inriktning och kan överlappa innehållsmässigt med kurser du redan har. Schemat kommer från studieinfo och kan ändras. Stäm av med studievägledningen innan du ändrar din plan.',
    move: 'Annan termin', moveText: (c, s) => `Läs ${c} termin ${s} i stället.`, moveBtn: (s) => `Flytta till termin ${s}`,
    program: 'Samma kurs, annat program',
    programText: (c, progs) => `${c} ges även för ${progs}.`,
    similar: 'Liknande kurs, annan kod',
    similarCounts: (inPlan) => inPlan ? 'Finns i 6CTMA:s programplan: räknas som valbar kurs, inte till profil eller inriktning om den inte står där.' : 'Finns inte i 6CTMA:s programplan: räknas som kurs utanför programplanen (högst 18 hp).',
    fits: (sem) => `Passar termin ${sem}`,
    noAlts: 'Hittade inget krockfritt alternativ i de nedladdade schemana.',
    search: 'Sök på studieinfo:',
    assumed: [
      'Åk 1–3 är klara (180 hp, alla obligatoriska kurser).',
      'Examensarbetet (30 hp, avancerad nivå i Tillämpad matematik) är klart.',
      'Språkkravet är uppfyllt (examensarbete på engelska, en språkkurs på 6 hp eller en termin utomlands).',
      'Inga kurser överlappar innehållsmässigt. Överlappande kurser kan inte båda räknas i examen.',
      'Kurser utanför programplanen saknar schema här och kontrolleras inte för krockar.',
    ],
    assumedTitle: 'Antaget och inte kontrollerat',
    unofficial: 'Inofficiellt verktyg. Stäm av din slutliga plan med studievägledningen innan du förlitar dig på den.',
    navCheck: 'Kontrollera plan', navPlan: 'Bygg plan', helpTitle: 'Visa guiden',
    planIntro: 'Välj masterprofil och teknisk inriktning och klicka sedan på kurser period för period för att bygga termin 7–9. Krav, krockar och poäng uppdateras medan du väljer.',
    aboutTitle: 'Om verktyget',
    aboutText: 'TMA Degree Check är gjort av en student på teknisk matematik för att göra det lättare att planera åk 4 och 5. Kursdata och regler hämtas från studieinfo.liu.se. Allt körs i din webbläsare, och dina planer sparas bara på din egen enhet.',
    contactText: 'Frågor, eller hittat ett fel? Mejla', githubText: 'Vill du hjälpa till att förbättra verktyget? Koden finns på GitHub:',
    sourceRef: 'Källa: utbildningsplanen',
    loadTitle: 'Poäng och CSN', loadOk: 'Termin 7 och 8 blir tillsammans 60 hp och termin 9 blir 30 hp.',
    savedTitle: 'Sparade planer', savedUnsaved: '(osparad plan)', planSave: 'Spara', planSaveAs: 'Spara som ny…', planDelete: 'Ta bort',
    planName: 'Planens namn', planNamePlaceholder: 't.ex. Plan A – maskininlärning', planNameOk: 'Spara', planNameCancel: 'Avbryt',
    savedHint: 'Planerna sparas bara i den här webbläsaren.', savedChanged: 'Ändrad sedan du sparade.', savedSaved: (n) => `Sparad som ”${n}”.`,
    savedDeleteTitle: 'Ta bort planen?', savedDeleteText: (n) => `”${n}” tas bort från den här webbläsaren. Det går inte att ångra.`,
    savedOpenTitle: 'Öppna en annan plan?', savedOpenText: 'Den nuvarande planen har ändringar som inte är sparade. De försvinner.',
    confirmCancel: 'Avbryt', confirmDelete: 'Ta bort', confirmOpen: 'Öppna ändå',
    tourNext: 'Nästa', tourBack: 'Tillbaka', tourDone: 'Klart', tourSkip: 'Hoppa över', tourCount: (i, n) => `${i} av ${n}`,
    tour: {
      check: [
        ['#cohort', 'Ditt program', 'Börja med att välja antagningsår, masterprofil och teknisk inriktning.'],
        ['#courses', 'Dina kurser', 'Skriv kurskoderna du har läst eller planerar att läsa, eller tryck på dem i listorna nedanför. Allt uppdateras medan du skriver.'],
        ['#verdict', 'Sammanfattning', 'Hur många krav som är uppfyllda och om några kurser krockar. Härifrån kan du också exportera planen som PDF eller Excel.'],
        ['#reqs', 'Krav', 'Varje krav, med exakt vad som saknas.'],
        ['#course-table', 'Dina kurser i ordning', 'Termin för termin och period för period. Här kan du flytta höstkurser mellan termin 7 och 9.'],
        ['#timetable', 'Schema och poäng', 'Schemakrockar med förslag på hur du kommer runt dem, och varningar om arbetsbörda och CSN.'],
        ['#saved-plans', 'Sparade planer', 'Spara planen för att komma tillbaka till den senare. Planerna sparas i den här webbläsaren.'],
        ['#nav-plan', 'Bygg plan', 'Vill du hellre klicka ihop planen period för period? Testa Bygg plan.'],
      ],
      plan: [
        ['#plan-settings', 'Ditt program', 'Välj antagningsår, masterprofil och teknisk inriktning.'],
        ['#grid', 'Termin för termin', 'Varje termin har två perioder, med kurserna sorterade efter schemablock. Kurser i samma period och block krockar.'],
        ['#grid .course', 'Välj kurser', 'Klicka på en kurs för att lägga till den och klicka igen för att ta bort den. Höstkurser kan läsas termin 7 eller 9. Du får en varning om en kurs krockar eller om en termin blir tung.'],
        ['#other', 'Andra kurser', 'Kurser från andra civilingenjörsprogram i Linköping och språkkurser. Upp till 18 hp av dem kan räknas i examen.'],
        ['#summary', 'Din plan', 'Krav, poäng per termin och CSN i en överblick.'],
        ['#saved-plans', 'Spara och exportera', 'Spara planer i den här webbläsaren, eller exportera dem som PDF eller Excel.'],
        ['#nav-check', 'Kontrollera plan', 'Se planen i detalj, med alternativ vid schemakrockar.'],
      ],
    },
    clearPlan: 'Rensa planen', showAll: 'Visa kurser från alla profiler och inriktningar',
    otherTitle: 'Andra kurser', otherHint: (n) => `Kurser från andra civilingenjörsprogram i Linköping, och språkkurser. De räknas som kurser utanför programplanen, och högst ${n} hp av sådana räknas i examen.`,
    otherSearch: 'Sök på kod eller namn', otherAdvanced: 'Bara avancerad nivå', otherNone: 'Inga kurser matchar sökningen.',
    otherMore: (n) => `${n} till. Förfina sökningen för att se dem.`, otherPrompt: 'Skriv minst två bokstäver, eller en kurskod.',
    addTo: (sem) => `+ Termin ${sem}`, inPlan: (sem) => `I din plan, termin ${sem}`, remove: 'Ta bort',
    noBlockHead: 'Utan block', blockHead: (b) => `Block ${b}`,
    chosenIn: (sem) => `vald termin ${sem}`, clashesWith: (codes) => `krockar med ${codes}`,
    conflictTitle: 'Schemakrock', conflictOk: 'Lägg till ändå',
    conflictText: (code, list) => `${code} har undervisning samtidigt som ${list}. Du kan inte gå på båda, om du inte läser en av dem en annan termin.`,
    conflictItem: (code, sem, p, b) => `${code} (termin ${sem}, period ${p}, block ${b})`,
    summaryTitle: 'Din plan', summaryReqs: (met, total) => `${met} av ${total} krav uppfyllda`, seeAll: 'Se alla krav',
    openInCheck: 'Visa i Kontrollera plan', emptyPlan: 'Inga kurser än. Klicka på kurser i terminerna till höger för att börja.',
    planCourses: (n, hpTotal) => `${n} ${n === 1 ? 'kurs' : 'kurser'}, ${hpTotal} hp`,
    exportOpen: 'Exportera…', exportTitle: 'Exportera planen', exportFormat: 'Format',
    exportPdfHint: 'För att läsa och skriva ut, t.ex. till ett möte med studievägledningen.',
    exportXlsxHint: 'Ett kalkylblad som du kan sortera och fortsätta redigera.',
    exportCancel: 'Avbryt', exportGo: 'Exportera', exportAnyway: 'Exportera ändå', exporting: 'Skapar filen…',
    exportOk: 'Alla kontrollerade krav är uppfyllda och det finns inga schemakrockar.',
    exportProblems: 'Planen uppfyller inte alla krav än',
    exportProblemsNote: 'Du kan exportera den ändå. Filen märks då med att planen inte är klar.',
    exportEmpty: 'Lägg till kurser innan du exporterar.',
    exportFailed: 'Kunde inte ladda exportfunktionen. Kontrollera internetanslutningen och försök igen.',
    clashItem: (a, b, sem, p, blk) => `${a} och ${b} krockar (termin ${sem}, period ${p}, block ${blk})`,
    file: {
      title: 'Studieplan', name: 'studieplan', program: 'Program', programValue: 'Civilingenjör i teknisk matematik (6CTMA), Linköpings universitet',
      exported: 'Exporterad', statusOk: 'Alla kontrollerade krav är uppfyllda.', statusBad: 'EJ KLAR: planen uppfyller inte alla krav.',
      sheetPlan: 'Plan', sheetReqs: 'Krav', sheetClashes: 'Schemakrockar', part: 'Del', status: 'Status', note: 'Anmärkning',
      period: 'Period', block: 'Block', alternatives: 'Alternativ', totals: 'Poäng', total: 'Räknas under termin 7–9',
      requirement: 'Krav', result: 'Resultat', courseA: 'Kurs 1', courseB: 'Kurs 2', page: (i, n) => `Sida ${i} av ${n}`,
    },
    source: (url, date) => `Kursdata, regler och scheman från <a href="${url}" target="_blank" rel="noopener">studieinfo.liu.se</a>, hämtade ${date}.`,
  },
};
const FETCHED = '__FETCHED__';

const EXAMPLE = { cohort: '5270', profile: 'TMSO', spec: 'TIMI',
  text: 'TAMS48, TAMS46, TAMS32, TAOP34, TAMS41, TAMS39,\nTSKS15, TSKS38, TDDE07, TDDE70, TATA85, TDDE09, TDDE15,\nTEAE01',
  semesters: /*__EXAMPLE_SEMESTERS__*/ {} };
const STORE_KEY = 'tma-degree-check';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const hp = (n) => (Math.round(n * 10) / 10).toString().replace('.', ',');
const cohortOf = () => DATA.find((c) => c.id === $('cohort').value);
const state = { lang: 'sv', langChosen: false, text: '', semesters: {}, isExample: false, planId: null };
let lastResult = null;
const t = () => UI[state.lang];
const courseName = (info) => (state.lang === 'en' ? info.ne || info.n : info.n);
const groupName = (g) => (state.lang === 'en' ? g.name_en : g.name);

function fillSelect(sel, items, keep) {
  sel.innerHTML = items.map(([v, label]) => `<option value="${esc(v)}">${esc(label)}</option>`).join('');
  if (items.some(([v]) => v === keep)) sel.value = keep;
}

function fillGroups() {
  const c = cohortOf();
  const groups = Object.entries(c.groups).sort((a, b) => groupName(a[1]).localeCompare(groupName(b[1]), state.lang));
  fillSelect($('profile'), groups.filter(([, g]) => g.kind === 'profile').map(([k, g]) => [k, groupName(g)]), $('profile').value);
  fillSelect($('spec'), groups.filter(([, g]) => g.kind === 'spec').map(([k, g]) => [k, groupName(g)]), $('spec').value);
}


const slotText = (inst) => inst.map(([p, b]) => b === '-' ? `${t().period}${p} · ${t().noBlock}` : `${t().period}${p} · ${t().block} ${b}`).join(' + ');
const instText = (insts) => insts.map(slotText).join(` ${t().or} `);

// Chronological order of the plan: one section per semester with sub-sections per period
// (courses over both periods last), then courses without a timetable. Used by the table and the exports.
const REQ_GROUPS = [
  ['profile-mandatory', 'profile-hp', 'profile-adv'],
  ['spec-mandatory', 'spec-hp'],
  ['business', 'outside', 'total', 'advanced', 'main-field'],
];
const PERIOD_ORDER = ['1', '2', '12'];
const periodKey = (course) => [...new Set(course.slots.map(([p]) => p))].sort().join('');
function termLabel(sem) {
  const startYear = parseInt(cohortOf().label.slice(3), 10);
  return sem === 8 ? `VT ${startYear + 4}` : `HT ${startYear + (sem === 7 ? 3 : 4)}`;
}
function chronological(r) {
  const sections = [];
  for (const sem of [7, 8, 9]) {
    const inSem = r.courses.filter((course) => course.sem === sem);
    if (!inSem.length) continue;
    const periods = PERIOD_ORDER.map((key) => [key, inSem.filter((course) => periodKey(course) === key)
      .sort((a, b) => a.slots[0][1].localeCompare(b.slots[0][1]) || a.code.localeCompare(b.code))])
      .filter(([, list]) => list.length);
    sections.push({ sem, label: t().semHead(sem, termLabel(sem)), hp: r.schedule.perSemester[sem], periods });
  }
  const rest = r.courses.filter((course) => !course.sem);
  if (rest.length) {
    sections.push({ sem: null, label: t().noTimetable, hp: rest.reduce((s, course) => s + (course.counted ? course.hp : 0), 0), periods: [[null, rest]] });
  }
  return sections;
}


// ---- Export (PDF and Excel). The libraries are loaded from jsDelivr only when someone exports. ----
const LIBS = {
  pdf: [
    ['https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js', 'sha384-qovJwSBbRDPP5cEjCp8S0UP66wrvnjaa60XMOGzTNanrThcrGfXfnZkvgY8N1KT3'],
    ['https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.8/dist/jspdf.plugin.autotable.min.js', 'sha384-5jk55M0XWoAw7LyhlXJe19ErOr3doBAPzxw9vahPFbvolqWa2yDk4fhHa2zuYeOa'],
  ],
  // SheetJS 0.18.5 is the last release on npm; its known issues are in reading files, and this page only writes them.
  xlsx: [['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'sha384-vtjasyidUo0kW94K5MXDXntzOJpQgBKXmE7e2Ga4LG0skTTLeBi97eFAXsqewJjw']],
};
const loadedScripts = {};
function loadScript([src, integrity]) {
  loadedScripts[src] = loadedScripts[src] || new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.integrity = integrity; s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = () => { delete loadedScripts[src]; s.remove(); reject(new Error(`Could not load ${src}`)); };
    document.head.appendChild(s);
  });
  return loadedScripts[src];
}
async function loadLibs(format) { for (const lib of LIBS[format]) await loadScript(lib); }

function planProblems(r) {
  return [
    ...r.reqs.filter((q) => !q.ok).map((q) => `${q.title}: ${q.detail}`),
    ...r.schedule.collisions.map((x) => t().clashItem(x.a, x.b, x.sem, x.period, x.block)),
  ];
}

// Plain-text version of a collision alternative, for the exported files.
function altPlain(o) {
  if (o.type === 'move') return `${t().move}: ${t().moveText(o.code, o.sem).replace(/\.$/, '')} (${instText(o.slots)}).`;
  const g = o.group;
  const where = `${g.t}, ${slotText(g.s)}, ${g.campus}`;
  if (o.type === 'program') return `${t().program}: ${t().programText(o.code, g.p.join(', '))}. ${where}. ${t().fits(o.sem)}.`;
  return `${t().similar}: ${o.code} ${courseName(o.info)} (${hp(o.info.hp || 0)} hp). ${where}. ${t().fits(o.sem)}. ${t().similarCounts(o.inPlan)}`;
}

function exportData(r) {
  const c = cohortOf();
  const F = t().file;
  const problems = planProblems(r);
  const rows = chronological(r).flatMap((sec) => sec.periods.flatMap(([key, list]) => list.map((course) => ({
    term: sec.sem ? `${sec.sem} (${termLabel(sec.sem)})` : '–',
    period: key ? (key === '12' ? '1–2' : key) : '–',
    block: course.slots ? [...new Set(course.slots.map(([, b]) => b))].join(', ').replace('-', '–') : '–',
    code: course.code, name: course.name || '', hp: course.hp, level: course.level || '',
    role: t().roles[course.role], note: course.note || '', counted: course.counted,
    clashing: r.schedule.collisions.some((x) => x.a === course.code || x.b === course.code),
  }))));
  return {
    ok: problems.length === 0, problems, rows, r,
    meta: [
      [F.program, F.programValue],
      [t().cohort, c.label],
      [t().profile, groupName(c.groups[$('profile').value])],
      [t().spec, groupName(c.groups[$('spec').value])],
      [F.exported, new Date().toLocaleDateString('sv-SE')],
    ],
    reqGroups: REQ_GROUPS.map((ids, gi) => ({ title: t().groups[gi], reqs: ids.map((id) => r.reqs.find((q) => q.id === id)) })),
    totals: [7, 8, 9].map((sem) => [`${t().thSemester} ${sem} (${termLabel(sem)})`, r.schedule.perSemester[sem]]),
    collisions: r.schedule.collisions.map((x) => ({ ...x, text: t().clashItem(x.a, x.b, x.sem, x.period, x.block), alts: x.options.slice(0, 10).map(altPlain) })),
    risky: r.schedule.collisions.some((x) => x.options.slice(0, 10).some((o) => o.type !== 'move')),
  };
}

function exportFilename(ext) {
  return `${t().file.name}-${cohortOf().label.replace(' ', '')}-${$('profile').value}-${$('spec').value}.${ext}`;
}

function exportPdf(d) {
  const F = t().file;
  const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
  const M = 40, W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
  const GREEN = [43, 117, 71], RED = [178, 63, 44], GREY = [102, 102, 100], BAND = [242, 242, 240];
  let y = M + 6;
  const space = (h) => { if (y + h > H - M - 20) { doc.addPage(); y = M; } };
  const para = (text, { size = 10, style = 'normal', color = [27, 27, 27], indent = 0, gap = 4 } = {}) => {
    doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - 2 * M - indent);
    space(lines.length * size * 1.25);
    doc.text(lines, M + indent, y + size * 0.8);
    y += lines.length * size * 1.25 + gap;
  };
  const heading = (text) => { y += 10; para(text, { size: 13, style: 'bold', gap: 6 }); };
  const table = (opts) => {
    window.autoTable(doc, { startY: y, margin: { left: M, right: M, bottom: M + 20 }, theme: 'plain', rowPageBreak: 'avoid',
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 4, textColor: [27, 27, 27], lineColor: [225, 225, 222], lineWidth: { bottom: 0.5 } },
      headStyles: { fontStyle: 'bold', textColor: GREY, fontSize: 8 }, ...opts });
    y = doc.lastAutoTable.finalY + 8;
  };

  para(`TMA Degree Check – ${F.title}`, { size: 18, style: 'bold', gap: 10 });
  for (const [k, v] of d.meta) {
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(27, 27, 27); doc.text(`${k}:`, M, y + 8);
    doc.setFont('helvetica', 'normal'); doc.text(doc.splitTextToSize(v, W - 2 * M - 120), M + 120, y + 8);
    y += 14;
  }
  y += 8;

  // Status box: green when complete, red with the list of problems otherwise.
  const statusLines = d.ok ? [F.statusOk] : [F.statusBad, ...d.problems.map((p) => `•  ${p}`)];
  doc.setFontSize(10);
  const wrapped = statusLines.map((l) => doc.splitTextToSize(l, W - 2 * M - 24));
  const boxH = wrapped.reduce((h, l) => h + l.length * 12.5, 0) + 16;
  space(boxH);
  doc.setDrawColor(...(d.ok ? GREEN : RED)); doc.setLineWidth(1); doc.rect(M, y, W - 2 * M, boxH);
  doc.setFillColor(...(d.ok ? GREEN : RED)); doc.rect(M, y, 3, boxH, 'F');
  let ty = y + 8;
  wrapped.forEach((lines, i) => {
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal'); doc.setTextColor(...(i === 0 ? (d.ok ? GREEN : RED) : [27, 27, 27]));
    doc.text(lines, M + 12, ty + 9); ty += lines.length * 12.5;
  });
  y += boxH + 10;

  heading(F.sheetReqs);
  table({
    head: [[F.status, F.requirement, F.result]],
    body: d.reqGroups.flatMap((g) => [
      [{ content: g.title, colSpan: 3, styles: { fontStyle: 'bold', fillColor: BAND } }],
      ...g.reqs.map((q) => [{ content: q.ok ? t().met : t().notMetPill, styles: { textColor: q.ok ? GREEN : RED, fontStyle: 'bold' } }, q.title, q.detail]),
    ]),
    columnStyles: { 0: { cellWidth: 62 }, 1: { cellWidth: 170 } },
  });

  heading(t().yourCourses);
  const sections = chronological(d.r);
  table({
    head: [[t().thSemester, F.period, F.block, t().thCode, t().thCourse, 'hp', t().thLevel, t().thCounts]],
    body: sections.flatMap((sec) => [
      [{ content: `${sec.label} – ${hp(sec.hp)} hp`, colSpan: 8, styles: { fontStyle: 'bold', fillColor: BAND } }],
      ...d.rows.filter((row) => row.term === (sec.sem ? `${sec.sem} (${termLabel(sec.sem)})` : '–')).map((row) => [
        row.term.split(' ')[0], row.period, row.block,
        { content: row.code, styles: row.clashing ? { textColor: RED, fontStyle: 'bold' } : {} },
        row.note ? `${row.name}\n${row.note}` : row.name, hp(row.hp), row.level,
        { content: row.role, styles: row.counted ? {} : { textColor: GREY } },
      ]),
    ]),
    columnStyles: { 0: { cellWidth: 44 }, 1: { cellWidth: 38 }, 2: { cellWidth: 34 }, 3: { cellWidth: 50 }, 5: { cellWidth: 28, halign: 'right' }, 6: { cellWidth: 34 }, 7: { cellWidth: 82 } },
  });
  para(`${F.total}: ${hp(d.r.totals.totalHp)} hp. ${d.totals.map(([k, v]) => `${k}: ${hp(v)} hp`).join(', ')}.`, { size: 9, color: GREY });

  heading(t().ttTitle);
  if (!d.collisions.length) para(t().noClash);
  for (const x of d.collisions) {
    para(x.text, { style: 'bold', color: RED, gap: 2 });
    x.alts.forEach((a) => para(`–  ${a}`, { size: 9, indent: 12, gap: 2 }));
    y += 4;
  }
  if (d.risky) para(`${t().caveatTitle} ${t().caveat}`, { size: 9, color: GREY });

  heading(t().assumedTitle);
  t().assumed.forEach((a) => para(`•  ${a}`, { size: 9, gap: 2 }));

  // Footer on every page.
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...GREY);
    doc.text(doc.splitTextToSize(t().unofficial, W - 2 * M - 70), M, H - M + 4);
    doc.text(F.page(i, pages), W - M, H - M + 4, { align: 'right' });
  }
  doc.save(exportFilename('pdf'));
}

function exportXlsx(d) {
  const F = t().file;
  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();
  const sheet = (rows, widths) => { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = widths.map((wch) => ({ wch })); return ws; };

  const plan = [
    [`TMA Degree Check – ${F.title}`], ...d.meta, [],
    [d.ok ? F.statusOk : F.statusBad], ...d.problems.map((p) => ['', p]), [],
    [t().thSemester, F.period, F.block, t().thCode, t().thCourse, 'hp', t().thLevel, t().thCounts, F.note],
    ...d.rows.map((row) => [row.term, row.period, row.block, row.code, row.name, row.hp, row.level, row.role, row.note]),
    [], [F.totals], ...d.totals, [F.total, d.r.totals.totalHp], [],
    [t().unofficial],
  ];
  XLSX.utils.book_append_sheet(wb, sheet(plan, [16, 8, 8, 10, 46, 6, 7, 22, 50]), F.sheetPlan);

  const reqs = [[F.part, F.requirement, F.status, F.result],
    ...d.reqGroups.flatMap((g) => g.reqs.map((q) => [g.title, q.title, q.ok ? t().met : t().notMetPill, q.detail]))];
  XLSX.utils.book_append_sheet(wb, sheet(reqs, [24, 44, 12, 90]), F.sheetReqs);

  if (d.collisions.length) {
    const clashes = [[t().thSemester, F.period, F.block, F.courseA, F.courseB, F.alternatives],
      ...d.collisions.map((x) => [x.sem, x.period, x.block, x.a, x.b, x.alts.join('\n')])];
    if (d.risky) clashes.push([], [`${t().caveatTitle} ${t().caveat}`]);
    XLSX.utils.book_append_sheet(wb, sheet(clashes, [8, 8, 8, 10, 10, 110]), F.sheetClashes);
  }
  XLSX.writeFile(wb, exportFilename('xlsx'));
}

function openExport() {
  const r = lastResult;
  const problems = planProblems(r);
  const empty = r.courses.length === 0;
  const status = $('export-status');
  status.className = 'export-status' + (empty || problems.length ? ' bad' : '');
  status.innerHTML = empty ? `<strong>${esc(t().exportEmpty)}</strong>`
    : problems.length ? `<strong>${esc(t().exportProblems)}</strong><ul>${problems.map((p) => `<li>${esc(p)}</li>`).join('')}</ul><p>${esc(t().exportProblemsNote)}</p>`
    : `<strong>✓ ${esc(t().exportOk)}</strong>`;
  $('export-go').textContent = problems.length && !empty ? t().exportAnyway : t().exportGo;
  $('export-go').disabled = empty;
  $('export-error').hidden = true;
  $('export-dialog').showModal();
}

async function runExport(e) {
  e.preventDefault();
  const format = $('format-xlsx').checked ? 'xlsx' : 'pdf';
  const go = $('export-go'), label = go.textContent;
  go.disabled = true; go.textContent = t().exporting; $('export-error').hidden = true;
  try {
    await loadLibs(format);
    const d = exportData(lastResult);
    if (format === 'pdf') exportPdf(d); else exportXlsx(d);
    $('export-dialog').close();
  } catch (err) {
    console.error(err);
    $('export-error').textContent = t().exportFailed;
    $('export-error').hidden = false;
  } finally {
    go.disabled = false; go.textContent = label;
  }
}


// ---- Things both pages share: requirement list, credit warnings, plan storage, saved plans,
// confirm dialog, guided tour, contact link. Each page defines update(), renderPageStatic() and afterLoad(). ----

const validateOpts = (extra) => ({ lang: state.lang, semesters: state.semesters, catalog: CATALOG, ...extra });

function renderReqGroups(r) {
  return REQ_GROUPS.map((ids, gi) => `<div class="req-group"><h3>${esc(t().groups[gi])}</h3>${ids.map((id) => {
    const q = r.reqs.find((x) => x.id === id);
    let meter = '';
    if (q.progress && q.progress.target) {
      const frac = Math.min(1, q.progress.value / q.progress.target);
      meter = `<div class="meter ${q.ok ? '' : 'bad'}" role="img" aria-label="${hp(q.progress.value)} / ${q.progress.target}"><i style="width:${(frac * 100).toFixed(1)}%"></i></div>`;
    }
    const ref = q.ref ? `<span class="req-ref"><a href="${esc(q.ref.url)}" target="_blank" rel="noopener">${esc(t().sourceRef)}</a>: ”${esc(q.ref.quote)}”</span>` : '';
    return `<div class="req"><span class="pill ${q.ok ? 'ok' : 'bad'}">${esc(q.ok ? t().met : t().notMetPill)}</span>
      <div class="req-title">${esc(q.title)}</div><div class="req-detail">${esc(q.detail)}${ref}</div>${meter}</div>`;
  }).join('')}</div>`).join('');
}

function renderLoad(r) {
  const load = r.schedule.load;
  if (!load.length) return `<p class="ok-note">${esc(t().loadOk)}</p>`;
  return `<ul class="load-list">${load.map((w) => `<li class="${w.type}">${esc(w.text)}</li>`).join('')}</ul>`;
}

// The plan both pages work on: program choices, course list (codes as typed) and chosen semesters.
const readJSON = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } };
const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };
const PLANS_KEY = 'tma-degree-check-plans';
const currentPlan = () => ({ cohort: $('cohort').value, profile: $('profile').value, spec: $('spec').value, text: state.text, semesters: { ...state.semesters } });
const samePlan = (a, b) => JSON.stringify([a.cohort, a.profile, a.spec, parseInput(a.text).entries, a.semesters])
  === JSON.stringify([b.cohort, b.profile, b.spec, parseInput(b.text).entries, b.semesters]);

function save() {
  writeJSON(STORE_KEY, { ...currentPlan(), lang: state.langChosen ? state.lang : undefined, isExample: state.isExample, planId: state.planId });
  renderSaved();
}

function loadPlan(p) {
  $('cohort').value = DATA.some((c) => c.id === p.cohort) ? p.cohort : DATA[0].id;
  fillGroups();
  $('profile').value = p.profile;
  $('spec').value = p.spec;
  state.text = p.text || '';
  state.semesters = { ...(p.semesters || {}) };
  afterLoad();
}

function planCodes() { return parseInput(state.text).entries.map((e) => e.code); }
function setCourse(code, sem) {
  const codes = planCodes();
  if (!codes.includes(code)) state.text = (state.text.trim() ? state.text.trim().replace(/,$/, '') + ', ' : '') + code;
  if (sem) state.semesters[code] = sem;
  state.isExample = false;
}
function removeCourse(code) {
  state.text = state.text.toUpperCase().split(/[\s,;]+/).filter((tok) => tok && tok.split(':')[0] !== code).join(', ');
  delete state.semesters[code];
  state.isExample = false;
}

// Saved plans: named copies of the plan in this browser.
const savedPlans = () => readJSON(PLANS_KEY, []);
function renderSaved() {
  const box = $('saved-plans');
  if (!box) return;
  const plans = savedPlans();
  const current = plans.find((p) => p.id === state.planId);
  $('saved-select').innerHTML = `<option value="">${esc(t().savedUnsaved)}</option>`
    + plans.map((p) => `<option value="${esc(p.id)}"${p.id === state.planId ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  $('plan-delete').disabled = !current;
  if (!$('saved-status').dataset.flash) {
    $('saved-status').textContent = current && !samePlan(current.plan, currentPlan()) ? t().savedChanged : t().savedHint;
  }
}
function flashSaved(text) {
  const el = $('saved-status');
  el.textContent = text; el.dataset.flash = '1';
  clearTimeout(flashSaved.timer);
  flashSaved.timer = setTimeout(() => { delete el.dataset.flash; renderSaved(); }, 2500);
}
function storePlan(name, id) {
  const plans = savedPlans();
  const entry = { id: id || `p${Date.now().toString(36)}`, name, saved: new Date().toISOString(), plan: currentPlan() };
  const i = plans.findIndex((p) => p.id === entry.id);
  if (i >= 0) plans[i] = entry; else plans.push(entry);
  writeJSON(PLANS_KEY, plans);
  state.planId = entry.id; state.isExample = false;
  save();
  flashSaved(t().savedSaved(name));
}
function askName(show) {
  $('save-as').hidden = !show;
  if (show) { const current = savedPlans().find((p) => p.id === state.planId); $('plan-name').value = current ? current.name : ''; $('plan-name').focus(); }
}
function initSaved() {
  if (!$('saved-plans')) return;
  $('plan-save').addEventListener('click', () => {
    const current = savedPlans().find((p) => p.id === state.planId);
    if (current) storePlan(current.name, current.id); else askName(true);
  });
  $('plan-save-as').addEventListener('click', () => { askName(true); $('plan-name').value = ''; });
  $('plan-name-cancel').addEventListener('click', () => askName(false));
  $('save-as').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('plan-name').value.trim();
    if (!name) { $('plan-name').focus(); return; }
    const existing = savedPlans().find((p) => p.name === name);
    storePlan(name, existing && existing.id);
    askName(false);
  });
  $('plan-delete').addEventListener('click', async () => {
    const current = savedPlans().find((p) => p.id === state.planId);
    if (!current) return;
    if (!await confirmBox(t().savedDeleteTitle, `<p>${esc(t().savedDeleteText(current.name))}</p>`, t().confirmDelete)) return;
    writeJSON(PLANS_KEY, savedPlans().filter((p) => p.id !== current.id));
    state.planId = null;
    save();
  });
  $('saved-select').addEventListener('change', async (e) => {
    const target = savedPlans().find((p) => p.id === e.target.value);
    const current = savedPlans().find((p) => p.id === state.planId);
    const dirty = !state.isExample && planCodes().length && !(current && samePlan(current.plan, currentPlan()));
    if (!target) { state.planId = null; save(); return; }
    if (dirty && !await confirmBox(t().savedOpenTitle, `<p>${esc(t().savedOpenText)}</p>`, t().confirmOpen)) { renderSaved(); return; }
    loadPlan(target.plan);
    state.planId = target.id; state.isExample = false;
    update();
  });
}

// A small in-page confirm (the browser's confirm() is not available everywhere this page runs).
function confirmBox(title, html, okLabel) {
  const d = $('confirm-dialog');
  $('confirm-title').textContent = title;
  $('confirm-body').innerHTML = html;
  $('confirm-ok').textContent = okLabel;
  $('confirm-cancel').textContent = t().confirmCancel;
  return new Promise((resolve) => {
    const done = (value) => { d.close(); $('confirm-ok').onclick = $('confirm-cancel').onclick = d.oncancel = null; resolve(value); };
    $('confirm-ok').onclick = () => done(true);
    $('confirm-cancel').onclick = () => done(false);
    d.oncancel = (e) => { e.preventDefault(); done(false); };
    d.showModal();
    $('confirm-ok').focus();
  });
}

// Guided tour: shown once per page (remembered in this browser), and again from the ? button.
const tour = { steps: [], i: 0 };
function startTour(force) {
  const key = `tma-tour-${PAGE}`;
  if (!force && readJSON(key, false)) return;
  writeJSON(key, true);
  tour.steps = t().tour[PAGE].filter(([sel]) => document.querySelector(sel));
  tour.i = 0;
  $('tour').hidden = false;
  showTourStep();
}
function endTour() { $('tour').hidden = true; }
function showTourStep() {
  const [sel, title, text] = tour.steps[tour.i];
  const el = document.querySelector(sel);
  const target = el.closest('.field') || el;
  const n = tour.steps.length;
  $('tour-count').textContent = t().tourCount(tour.i + 1, n);
  $('tour-title').textContent = title;
  $('tour-text').textContent = text;
  $('tour-skip').textContent = t().tourSkip;
  $('tour-skip').hidden = tour.i === n - 1;
  $('tour-back').textContent = t().tourBack;
  $('tour-back').hidden = tour.i === 0;
  $('tour-next').textContent = tour.i === n - 1 ? t().tourDone : t().tourNext;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' });
  tour.target = target;
  placeTour();
  setTimeout(placeTour, smooth ? 350 : 0);
  $('tour-next').focus();
}
function placeTour() {
  if ($('tour').hidden || !tour.target) return;
  const r = tour.target.getBoundingClientRect();
  const pad = 6, spot = $('tour-spot'), card = $('tour-card');
  Object.assign(spot.style, { top: `${r.top - pad}px`, left: `${r.left - pad}px`, width: `${r.width + 2 * pad}px`, height: `${r.height + 2 * pad}px` });
  const ch = card.offsetHeight, vh = window.innerHeight, vw = window.innerWidth;
  const below = r.bottom + pad + 12, above = r.top - pad - 12 - ch;
  const top = below + ch < vh ? below : above > 8 ? above : Math.max(8, vh - ch - 8);
  const left = Math.min(Math.max(8, r.left), vw - card.offsetWidth - 8);
  Object.assign(card.style, { top: `${top}px`, left: `${left}px` });
}

function renderContact() {
  // Put together in the page so the address is not sitting in the HTML for scrapers.
  const user = ['grebmol', 'berrab'].join('').split('').reverse().join('');
  const domain = ['gmail', 'com'].join('.');
  const a = document.createElement('a');
  a.href = `mailto:${user}@${domain}`;
  a.textContent = `${user}@${domain}`;
  $('contact').replaceChildren(a);
}

function renderStatic() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t()[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t()[el.dataset.i18nHtml]; });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t()[el.dataset.i18nTitle]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t()[el.dataset.i18nPlaceholder]; });
  $('lang-sv').setAttribute('aria-pressed', state.lang === 'sv');
  $('lang-en').setAttribute('aria-pressed', state.lang === 'en');
  $(PAGE === 'check' ? 'nav-check' : 'nav-plan').setAttribute('aria-current', 'page');
  const url = `https://studieinfo.liu.se/${state.lang === 'en' ? 'en/' : ''}program/6CTMA/${$('cohort').value}#curriculum`;
  $('source-line').innerHTML = t().source(url, FETCHED);
  fillGroups();
  renderPageStatic();
}

function setLang(lang) { state.lang = lang; state.langChosen = true; renderStatic(); update(); }

function boot() {
  fillSelect($('cohort'), DATA.map((c) => [c.id, c.label]), '5270');
  const saved = readJSON(STORE_KEY, null);
  // Swedish unless the viewer has picked a language with the toggle.
  state.langChosen = !!(saved && saved.lang);
  state.lang = state.langChosen ? saved.lang : 'sv';
  if (saved && saved.cohort) { loadPlan(saved); state.isExample = !!saved.isExample; state.planId = saved.planId || null; }
  else { loadPlan(EXAMPLE); state.isExample = true; }
  renderStatic();
  renderContact();
  initSaved();
  update();

  $('lang-sv').addEventListener('click', () => setLang('sv'));
  $('lang-en').addEventListener('click', () => setLang('en'));
  $('help').addEventListener('click', () => startTour(true));
  $('tour-next').addEventListener('click', () => { if (tour.i < tour.steps.length - 1) { tour.i++; showTourStep(); } else endTour(); });
  $('tour-back').addEventListener('click', () => { if (tour.i > 0) { tour.i--; showTourStep(); } });
  $('tour-skip').addEventListener('click', endTour);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('tour').hidden) endTour(); });
  window.addEventListener('resize', placeTour);
  window.addEventListener('scroll', placeTour, { passive: true });
  $('cohort').addEventListener('change', () => { renderStatic(); update(); });
  $('profile').addEventListener('change', update);
  $('spec').addEventListener('change', update);
  document.addEventListener('click', (e) => { if (e.target.closest('#export-open')) openExport(); });
  $('export-cancel').addEventListener('click', () => $('export-dialog').close());
  $('export-form').addEventListener('submit', runExport);
  startTour(false);
}
