"""Build the site: index.html (check a plan) and planera.html (build a plan) from src/, with the
course data and the validator embedded.

    python3 build.py <dir with page_<id>.html files>   # re-parse downloaded program plans, then build
    python3 build.py                                     # build from the existing data.json, courses.json and catalog.json
    python3 build.py --artifact <dir>                    # also write versions for publishing as a claude.ai artifact
"""
import argparse, base64, json, os, re, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
args = argparse.ArgumentParser()
args.add_argument('pages', nargs='?')
args.add_argument('--artifact')
args = args.parse_args()
if args.pages:
    subprocess.run([sys.executable, '-I', os.path.join(here, 'build_data.py'), args.pages, os.path.join(here, 'data.json'), here], check=True)
read = lambda name: open(os.path.join(here, name), encoding='utf-8').read()


def compact_alternatives(courses, min_year):
    """Group each course's offerings by timetable, leaving out the 6CTMA ones already in data.json
    and offerings from before min_year (a discontinued course's page still shows its last offering)."""
    progs, out = {}, {}
    for code, c in courses.items():
        groups = {}
        for o in c['offers']:
            year = o['term'][-4:]
            if o['p'] == '6CTMA' or not year.isdigit() or int(year) < min_year:
                continue
            pers, blks = o['per'].replace(' ', '').split(','), o['blk'].replace(' ', '').split(',')
            if len(pers) != len(blks) or not all(p.isdigit() for p in pers):
                continue
            slots = [[int(p), b] for p, b in zip(pers, blks)]
            key = (o['term'], json.dumps(slots), o['campus'])
            g = groups.setdefault(key, dict(t=o['term'], s=slots, p=[], lang=o['lang'], campus=o['campus']))
            if o['p'] not in g['p']:
                g['p'].append(o['p'])
            # Keep the shortest name per program code (without the specialization suffix).
            if o['p'] not in progs or len(o['pn']) < len(progs[o['p']]):
                progs[o['p']] = o['pn']
        out[code] = dict(n=c['n'], ne=c.get('ne') or c['n'], hp=c['hp'], l=c['l'], g=list(groups.values()))
        if c.get('similar'):
            out[code]['sim'] = c['similar']
    return dict(progs=progs, c=out)


def artifact_version(page):
    """The claude.ai artifact host supplies its own document skeleton and icon, and needs inline assets."""
    page = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', '', page, count=1)
    for tag in ('</head>', '<body>', '</body>', '</html>'):
        page = page.replace(tag, '', 1)
    # Icons and preloads point at files next to index.html, which an artifact does not have.
    return inline_fonts(page).lstrip()


def inline_fonts(page):
    """Icons and preloads point at files next to the page, which an artifact does not have; fonts go inline."""
    page = re.sub(r'<link rel="(?:icon|apple-touch-icon|preload)"[^>]*>\n', '', page)
    font = lambda m: 'url("data:font/woff2;base64,%s")' % base64.b64encode(open(os.path.join(here, m.group(1)), 'rb').read()).decode()
    return re.sub(r'url\("(fonts/[^"]+\.woff2)"\)', font, page)


def compact_catalog(catalog):
    """Most courses have the same timetable every year: keep the newest year as the base and only the
    differences per admission year."""
    years = sorted(catalog['sched'])
    base = dict(catalog['sched'][years[-1]])
    for y in years:
        for code, s in catalog['sched'][y].items():
            base.setdefault(code, s)
    sched = {'base': base}
    for y in years:
        diff = {code: s for code, s in catalog['sched'][y].items() if base.get(code) != s}
        if diff:
            sched[y] = diff
    return dict(programs=catalog['programs'], courses=catalog['courses'], sched=sched, lang=catalog['lang'])


PAGES = {
    'check': dict(file='index.html', title='TMA Degree Check', intro='intro',
                  description='Kontrollera en kursplan för Civilingenjör i teknisk matematik (6CTMA, Linköpings universitet), termin 7–9, mot masterprofil, teknisk inriktning och examenskrav.'),
    'plan': dict(file='planera.html', title='Bygg plan – TMA Degree Check', intro='planIntro',
                 description='Bygg din plan för termin 7–9 på Civilingenjör i teknisk matematik (6CTMA, Linköpings universitet) period för period, med krav, schemakrockar och poäng.'),
}

# The date the course pages were downloaded, written by scrape_courses.py.
fetched = read('fetched.txt').strip()
alt = compact_alternatives(json.loads(read('courses.json')), int(fetched[:4]))
catalog = compact_catalog(json.loads(read('catalog.json')))
shared = (read('src/shared.js')
          .replace('/*__DATA__*/', read('data.json').strip())
          .replace('/*__ALT__*/', json.dumps(alt, ensure_ascii=False, separators=(',', ':')))
          .replace('/*__CATALOG__*/', json.dumps(catalog, ensure_ascii=False, separators=(',', ':')))
          .replace('/*__VALIDATOR__*/', read('validator.js'))
          .replace('__FETCHED__', fetched))
if args.artifact:
    os.makedirs(args.artifact, exist_ok=True)
for page, cfg in PAGES.items():
    body = read(f'src/{page}.body.html').replace('<!--__SAVED__-->', read('src/saved.html').rstrip('\n'))
    # Spliced last, in this order, so placeholders inside the data or code are never touched.
    html = read('src/layout.html')
    for key, value in [('__TITLE__', cfg['title']), ('__DESCRIPTION__', cfg['description']), ('__INTRO_KEY__', cfg['intro']),
                       ('__PAGE__', page), ('/*__STYLE__*/', read('src/style.css')), ('<!--__BODY__-->', body),
                       ('/*__PAGE_JS__*/', read(f'src/{page}.js')), ('/*__SHARED__*/', shared)]:
        assert html.count(key) == 1, key
        html = html.replace(key, value)
    open(os.path.join(here, cfg['file']), 'w', encoding='utf-8').write(html)
    print('wrote', cfg['file'], len(html), 'bytes')
    if args.artifact:
        # The first page is the artifact itself (the host adds the document skeleton); others are full pages.
        out = artifact_version(html) if page == 'check' else inline_fonts(html)
        open(os.path.join(args.artifact, cfg['file']), 'w', encoding='utf-8').write(out)
        print('wrote', os.path.join(args.artifact, cfg['file']))
