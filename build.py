"""Build index.html: embed course data and the validator into template.html.

    python3 build.py <dir with page_<id>.html files>   # re-parse downloaded program plans, then build
    python3 build.py                                     # build from the existing data.json and courses.json
    python3 build.py --artifact <path>                   # also write a version for publishing as a claude.ai artifact
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
    page = re.sub(r'<link rel="(?:icon|apple-touch-icon|preload)"[^>]*>\n', '', page)
    font = lambda m: 'url("data:font/woff2;base64,%s")' % base64.b64encode(open(os.path.join(here, m.group(1)), 'rb').read()).decode()
    return re.sub(r'url\("(fonts/[^"]+\.woff2)"\)', font, page).lstrip()


# The date the course pages were downloaded, written by scrape_courses.py.
fetched = read('fetched.txt').strip()
alt = compact_alternatives(json.loads(read('courses.json')), int(fetched[:4]))
page = (read('template.html')
        .replace('/*__DATA__*/', read('data.json').strip())
        .replace('/*__ALT__*/', json.dumps(alt, ensure_ascii=False, separators=(',', ':')))
        .replace('/*__VALIDATOR__*/', read('validator.js'))
        .replace('/*__EXAMPLE_SEMESTERS__*/', '')
        .replace('__FETCHED__', fetched))
open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote index.html', len(page), 'bytes')
if args.artifact:
    open(args.artifact, 'w', encoding='utf-8').write(artifact_version(page))
    print('wrote', args.artifact)
