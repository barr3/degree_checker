import re, html, json, sys
sys.path.insert(0, sys.argv[3])
from parse import parse, COHORTS

RANK = {'o': 3, 'o/v': 2, 'v': 1, 'f': 0}
CODE = r'T[A-Z0-9]{3}\d{2}'

def plan_text(h):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', h, flags=re.S)
    t = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t)))
    return t[:t.find('Termin 1 HT')]

def num(pat, t):
    m = re.search(pat, t)
    if not m: raise SystemExit(f'rule not found: {pat}')
    return int(m.group(1))

out = []
for cid, label in COHORTS.items():
    h = open(f'{sys.argv[1]}/page_{cid}.html', encoding='utf-8').read()
    t = plan_text(h)
    rows = parse(f'{sys.argv[1]}/page_{cid}.html')
    names = {k: html.unescape(v).replace('Masterprofil ', '').replace('Teknisk inriktning ', '')
             for k, v in re.findall(r'<option[^>]*value="(T[MI][A-Z]{2})"[^>]*>([^<]*)</option>', h)}
    biz_txt = re.search(r'Företags- och affärsmässiga villkor skall minst 6 ?hp vara godkända av följande kurser(.*?)(Att kommunicera|Maximalt)', t).group(1)
    business = sorted(set(re.findall(CODE, biz_txt)) | {r['code'] for r in rows if r['sem'] >= 7 and r['spec'] == '' and r['vof'] == 'o/v'})
    rules = dict(
        profileHp=num(r'masterprofil omfattar (\d+) hp', t),
        profileAdvCourses=num(r'Minst (\d+) kurser på avancerad nivå', t),
        specHp=num(r'teknisk inriktning omfattar (?:minst )?(\d+) hp', t),
        outsideMax=num(r'Maximalt kan (\d+) ?hp av kurser utanför programplanen', t),
        businessText=sorted(set(re.findall(CODE, biz_txt))),
    )
    courses, groups, general, early = {}, {}, {}, {}
    def put(d, code, vof):
        if code not in d or RANK[vof] > RANK[d[code]]: d[code] = vof
    for r in rows:
        c = courses.setdefault(r['code'], dict(n=r['name'], hp=r['hp'], l=r['level'], tm='3392' in r['fos']))
        if c['hp'] != r['hp']: print('hp mismatch', cid, r['code'], c['hp'], r['hp'], file=sys.stderr)
        if r['sem'] <= 6: put(early, r['code'], r['vof'])
        elif r['spec'] == '': put(general, r['code'], r['vof'])
        else:
            g = groups.setdefault(r['spec'], dict(name=names[r['spec']], kind='profile' if r['spec'].startswith('TM') else 'spec', c={}))
            put(g['c'], r['code'], r['vof'])
    out.append(dict(id=cid, label=label, rules=rules, business=business, courses=courses,
                    groups=dict(sorted(groups.items(), key=lambda kv: kv[1]['name'])), general=general, early=early))
    print(cid, label, rules, business, len(courses), file=sys.stderr)
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, separators=(',', ':'))
