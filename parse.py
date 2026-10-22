import re, html, json, sys
from html.parser import HTMLParser

COHORTS = {'5270':'HT 2022','5480':'HT 2023','5763':'HT 2024','6051':'HT 2025','6330':'HT 2026'}

def parse(path):
    h = open(path, encoding='utf-8').read()
    rows = []
    # split into semester sections
    for sec in re.split(r'<section class="accordion semester', h)[1:]:
        m = re.search(r'<h3>\s*Termin (\d+)', sec)
        if not m: continue
        sem = int(m.group(1))
        for spec in re.split(r'<div class="specialization"', sec)[1:]:
            sc = re.match(r'\s*data-specialization="([^"]*)"', spec).group(1)
            notes = {}
            for d in re.finditer(r'<tr class="details-row other-information-(\d+)".*?<td colspan="7">(.*?)</td>', spec, re.S):
                txt = re.sub(r'<[^>]+>', ' ', d.group(2))
                notes[d.group(1)] = re.sub(r'\s+', ' ', html.unescape(txt)).strip()
            for r in re.finditer(r'<tr class="main-row[^"]*"\s+data-course-code="([^"]+)"\s+data-field-of-study="([^"]*)"\s+data-vof="([^"]*)"\s+data-id="(\d+)">(.*?)</tr>', spec, re.S):
                code, fos, vof, rid, body = r.groups()
                tds = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t))).strip() for t in re.findall(r'<td>(.*?)</td>', body, re.S)]
                hp = tds[2]
                rows.append(dict(sem=sem, spec=sc, code=code, name=tds[1], hp=float(hp.rstrip('*').replace(',', '.')) if hp.rstrip('*') else None,
                                 hp_raw=hp, level=tds[3], block=tds[4], vof=vof, fos=[f for f in fos.split('|') if f], note=notes.get(rid, '')))
    return rows

if __name__ == '__main__':
    d = sys.argv[1]
    out = {}
    for cid, label in COHORTS.items():
        out[cid] = parse(f'{d}/page_{cid}.html')
        print(cid, label, len(out[cid]), 'rows', file=sys.stderr)
    json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
