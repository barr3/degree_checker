"""Download course pages from studieinfo.liu.se and collect every offering of each course
(program, semester, period, block) plus T-courses with a similar name, for finding
alternatives when two courses collide.

    python3 scrape_courses.py <cache dir> [data.json] [courses.json]

Pages are cached in <cache dir>, so re-runs only download what is missing.
"""
import datetime, html, json, os, re, sys, time, urllib.parse, urllib.request

BASE = 'https://studieinfo.liu.se'
T_CODE = re.compile(r'^T[A-Z0-9]{3}\d{2}$')


def fetch(cache, name, url):
    path = os.path.join(cache, name)
    if not os.path.exists(path):
        time.sleep(0.3)
        with urllib.request.urlopen(url, timeout=30) as r:
            open(path, 'wb').write(r.read())
    return open(path, encoding='utf-8').read()


def text(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def parse_course(h):
    title = re.search(r'<title>\s*(\S+)\s+(.*?)\s+-\s+Studieinfo', html.unescape(h), re.S)
    hp = re.search(r'<h1[^>]*>.*?,\s*([\d,.]+)\s*hp', h, re.S)
    name_en = re.search(r'<p class="subtitle">\s*(.*?),\s*[\d,.]+\s*credits\s*</p>', html.unescape(h), re.S)
    level = re.search(r'Fördjupningsnivå\s*</h2>\s*([A-Z0-9]+)', html.unescape(h))
    offers = []
    table = re.search(r'<table class="table table-striped study-guide-table">(.*?)</table>', h, re.S)
    for row in re.findall(r'<tr>(.*?)</tr>', table.group(1) if table else '', re.S):
        tds = [text(td) for td in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)]
        if len(tds) < 8:
            continue
        sem = re.match(r'(\d+)\s*\((HT|VT) (\d{4})\)', tds[2])
        offers.append(dict(p=tds[0], pn=tds[1], sem=int(sem.group(1)) if sem else None,
                           term=f'{sem.group(2)} {sem.group(3)}' if sem else tds[2],
                           per=tds[3], blk=tds[4], lang=tds[5], campus=tds[6], vof=tds[7]))
    return dict(n=title.group(2).strip() if title else None, ne=name_en.group(1).strip() if name_en else None,
                hp=float(hp.group(1).replace(',', '.')) if hp else None,
                l=level.group(1) if level else None, offers=offers)


def search(cache, code, name):
    q = urllib.parse.urlencode({'Term': name, 'Type': 'course', 'MainFieldOfStudy': ''})
    h = fetch(cache, f'search_{code}.html', f'{BASE}/?{q}')
    hits = re.findall(r'href="/kurs/([A-Z0-9]+)/[^"]*"', h)
    return sorted({c for c in hits if T_CODE.match(c) and c != code})


def main():
    cache = sys.argv[1]
    here = os.path.dirname(os.path.abspath(__file__))
    data_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, 'data.json')
    out_path = sys.argv[3] if len(sys.argv) > 3 else os.path.join(here, 'courses.json')
    os.makedirs(cache, exist_ok=True)
    data = json.load(open(data_path, encoding='utf-8'))

    # Every course listed in semesters 7-9 of any admission year.
    plan = {}
    for cohort in data:
        for code, c in cohort['courses'].items():
            if c.get('sem') and T_CODE.match(code):
                plan[code] = c['n']

    courses = {}
    for i, (code, name) in enumerate(sorted(plan.items())):
        courses[code] = parse_course(fetch(cache, f'kurs_{code}.html', f'{BASE}/kurs/{code}'))
        courses[code]['similar'] = search(cache, code, name)
        print(f'{i + 1}/{len(plan)} {code}: {len(courses[code]["offers"])} offerings, similar {courses[code]["similar"]}', file=sys.stderr)
    for code in sorted({s for c in list(courses.values()) for s in c['similar']} - set(courses)):
        courses[code] = parse_course(fetch(cache, f'kurs_{code}.html', f'{BASE}/kurs/{code}'))
        print(f'similar {code}: {courses[code]["n"]}', file=sys.stderr)
    json.dump(courses, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    # build.py shows this date on the page and drops offerings from before its year.
    open(os.path.join(os.path.dirname(out_path), 'fetched.txt'), 'w').write(datetime.date.today().isoformat() + '\n')
    print(f'wrote {out_path}: {len(courses)} courses', file=sys.stderr)


if __name__ == '__main__':
    main()
