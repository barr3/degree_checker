# TMA Degree Check

A single web page that checks a course plan for the Master of Science in Engineering Mathematics
(Civilingenjör i teknisk matematik, 6CTMA) at Linköping University against the degree requirements.

Choose your admission year, master profile and technical specialization, then list the courses you
have taken or plan to take in semesters 7–9. The page reports which requirements are met:

- Master profile: mandatory courses, at least 30 hp from the profile, at least 4 advanced-level profile courses
- Technical specialization: mandatory courses (including "pick one" project courses), at least 36 hp
- Business course (TEAE01 / TEIO94 / TEAE05, depending on admission year)
- At most 18 hp of courses outside the program plan
- At least 90 hp in semesters 7–9, at least 60 hp at advanced level, at least 30 hp advanced in Tillämpad matematik

Years 1–3, the thesis, the language requirement, overlapping course content and timetable clashes are
assumed to be fine and are not checked. This is an unofficial tool; confirm your plan with study counselling.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The built page (served by GitHub Pages). Generated, do not edit by hand. |
| `template.html` | Page layout, styles and UI code. |
| `validator.js` | The requirement checks. |
| `data.json` | Course data and rules per admission year, generated from studieinfo.liu.se. |
| `parse.py`, `build_data.py` | Parse the downloaded program plan pages into `data.json`. |
| `fetch.sh` | Downloads the program plan pages. |
| `build.py` | Embeds `data.json` and `validator.js` into `template.html` to produce `index.html`. |

## Updating

```sh
./fetch.sh pages           # download program plans from studieinfo.liu.se
python3 build.py pages     # regenerate data.json and index.html
```

After editing `template.html` or `validator.js`, run `python3 build.py` to rebuild `index.html` from the
existing `data.json`. To add an admission year, add its id (from the URL
`studieinfo.liu.se/program/6CTMA/<id>`) to `COHORTS` in `parse.py` and to `fetch.sh`.
