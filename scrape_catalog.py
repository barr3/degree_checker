"""Build catalog.json: courses outside the 6CTMA plan that a TMA student could pick, with timetables.

  * Semester 7-9 courses from the program plans of the other engineering programs (6C...) taught in
    Linköping, using the admission round from the same year as each TMA cohort, so the timetables
    match the same calendar years.
  * Language courses (T-codes) found with the studieinfo search, with their Linköping offerings.

    python3 scrape_catalog.py <cache dir> [catalog.json]

Pages are cached in <cache dir>, so re-runs only download what is missing.
"""
import html, json, os, re, sys, urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from parse import parse, COHORTS
from scrape_courses import fetch, parse_course, BASE, T_CODE

LANGUAGE_TERMS = ['engelska', 'tyska', 'franska', 'spanska', 'japanska', 'kinesiska', 'italienska', 'svenska som främmande', 'swedish']
RANK = {'o': 3, 'o/v': 2, 'v': 1, 'f': 0}


def programs(cache):
    """Engineering programs (civilingenjör) taught in Linköping, with their admission round ids per year."""
    h = fetch(cache, 'search_programs.html', f'{BASE}/?Term=civilingenj%C3%B6r&Type=all&MainFieldOfStudy=')
    found = {}
    for code, rid in sorted(set(re.findall(r'href="/program/(6C[A-Z]{3})/(\d+)"', h))):
        if code == '6CTMA':
            continue
        page = fetch(cache, f'program_{code}_{rid}.html', f'{BASE}/program/{code}/{rid}')
        name = html.unescape(re.search(r'<title>\s*\S+\s+(.*?)\s+-\s+Studieinfo', page, re.S).group(1))
        rounds = {}
        for r, label in re.findall(r'<option[^>]*value="/program/' + code + r'/(\d+)"[^>]*>([^<]*)</option>', page):
            m = re.match(r'HT (\d{4}), ([^,]+)', html.unescape(label).strip())
            if m and m.group(2) == 'Linköping':
                rounds[m.group(1)] = r
        if rounds:
            found[code] = dict(name=name, rounds=rounds)
        print(f'{code} {name}: {"Linköping " + ", ".join(sorted(rounds)) if rounds else "not in Linköping, skipped"}', file=sys.stderr)
    return found


def schedule_of(rows):
    """Timetable per term from program plan rows, in the same shape as data.json ('s')."""
    s = {}
    for r in rows:
        inst = s.setdefault('VT' if r['sem'] == 8 else 'HT', [])
        slot = [r['period'], r['block']]
        if r['hp_raw'].endswith('*'):
            if not inst:
                inst.append([])
            if slot not in inst[0]:
                inst[0].append(slot)
        elif [slot] not in inst:
            inst.append([slot])
    return s


def main():
    cache = sys.argv[1]
    out_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'catalog.json')
    os.makedirs(cache, exist_ok=True)
    progs = programs(cache)

    courses, sched = {}, {}
    for cohort_label in COHORTS.values():
        year = cohort_label[3:]
        for code, p in progs.items():
            rid = p['rounds'].get(year)
            if not rid:
                continue
            sv = os.path.join(cache, f'plan_{code}_{rid}.html')
            fetch(cache, f'plan_{code}_{rid}.html', f'{BASE}/program/{code}/{rid}')
            en = fetch(cache, f'plan_{code}_{rid}_en.html', f'{BASE}/en/program/{code}/{rid}')
            names_en = {k: re.sub(r'\s+', ' ', html.unescape(v)).strip() for k, v in re.findall(r'href="/en/kurs/([A-Z0-9]+)/[^"]*">([^<]*)</a>', en)}
            rows = [r for r in parse(sv) if 7 <= r['sem'] <= 9 and T_CODE.match(r['code']) and r['vof'] != 'f']
            by_code = {}
            for r in rows:
                by_code.setdefault(r['code'], []).append(r)
            for c, rs in by_code.items():
                r = rs[0]
                info = courses.setdefault(c, dict(n=r['name'], ne=names_en.get(c, r['name']), hp=r['hp'], l=r['level'], tm='3392' in r['fos'], progs=[]))
                if code not in info['progs']:
                    info['progs'].append(code)
                # Semesters the course is listed in, so courses only given in semester 9 stay there.
                for sem in sorted({x['sem'] for x in rs}):
                    if sem not in info.setdefault('sem', []):
                        info['sem'].append(sem)
                info['sem'].sort()
                year_s = sched.setdefault(year, {})
                merged = year_s.setdefault(c, {})
                for term, insts in schedule_of(rs).items():
                    for inst in insts:
                        if inst not in merged.setdefault(term, []):
                            merged[term].append(inst)
        print(f'{cohort_label}: {len(sched.get(year, {}))} courses', file=sys.stderr)

    # Language courses: search, then read their Linköping offerings from the course pages.
    lang_sched = {}
    for term in LANGUAGE_TERMS:
        q = re.sub(r'\W', '_', term)
        query = urllib.parse.urlencode({'Term': term, 'Type': 'course', 'MainFieldOfStudy': ''})
        h = fetch(cache, f'search_lang_{q}.html', f'{BASE}/?{query}')
        for c in sorted(set(re.findall(r'href="/kurs/([A-Z0-9]+)/', h))):
            if not T_CODE.match(c) or c in lang_sched:
                continue
            page = parse_course(fetch(cache, f'kurs_{c}.html', f'{BASE}/kurs/{c}'))
            s = {}
            for o in page['offers']:
                if 'Linköping' not in o['campus'] or o['term'][:2] not in ('HT', 'VT'):
                    continue
                pers, blks = o['per'].replace(' ', '').split(','), o['blk'].replace(' ', '').split(',')
                if len(pers) != len(blks) or not all(p.isdigit() for p in pers):
                    continue
                inst = [[int(p), b] for p, b in zip(pers, blks)]
                if inst not in s.setdefault(o['term'][:2], []):
                    s[o['term'][:2]].append(inst)
            if s:
                lang_sched[c] = s
                info = courses.setdefault(c, dict(n=page['n'], ne=page.get('ne') or page['n'], hp=page['hp'], l=page['l'], tm=False, progs=[]))
                info['lang'] = True
    print(f'language courses: {len(lang_sched)}', file=sys.stderr)

    json.dump(dict(programs={k: v['name'] for k, v in progs.items()}, courses=courses, sched=sched, lang=lang_sched),
              open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'wrote {out_path}: {len(courses)} courses', file=sys.stderr)


if __name__ == '__main__':
    main()
