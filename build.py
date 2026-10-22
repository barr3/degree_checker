"""Build index.html: embed course data and the validator into template.html.

    python3 build.py <dir with page_<id>.html files>   # re-parse downloaded pages, then build
    python3 build.py                                     # build from the existing data.json
"""
import datetime, os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) > 1:
    subprocess.run([sys.executable, '-I', os.path.join(here, 'build_data.py'), sys.argv[1], os.path.join(here, 'data.json'), here], check=True)
read = lambda name: open(os.path.join(here, name), encoding='utf-8').read()
fetched = datetime.date.fromtimestamp(os.path.getmtime(os.path.join(here, 'data.json'))).isoformat()
page = (read('template.html')
        .replace('/*__DATA__*/', read('data.json').strip())
        .replace('/*__VALIDATOR__*/', read('validator.js'))
        .replace('__FETCHED__', fetched))
open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote index.html', len(page), 'bytes')
