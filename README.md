# TMA Degree Check

A single web page that checks a course plan for the Master of Science in Engineering Mathematics
(Civilingenjör i teknisk matematik, 6CTMA) at Linköping University against the degree requirements.
The page is available in Swedish and English.

Choose your admission year, master profile and technical specialization, then list the courses you
have taken or plan to take in semesters 7–9. The page reports which requirements are met:

- Master profile: mandatory courses, at least 30 hp from the profile, at least 4 advanced-level profile courses
- Technical specialization: mandatory courses (including "pick one" project courses), at least 36 hp
- Business course (TEAE01 / TEIO94 / TEAE05, depending on admission year)
- At most 18 hp of courses outside the program plan
- At least 90 hp in semesters 7–9, at least 60 hp at advanced level, at least 30 hp advanced in Tillämpad matematik

It also checks the timetable. Each course is placed in a semester (autumn courses can be moved between
semester 7 and 9), and two courses in the same semester, period and block are flagged as a collision,
unless the program plan says they are coordinated. For each collision it suggests ways around it:

1. Taking one of the courses in the other autumn semester.
2. Taking the same course with another program that has a different timetable.
3. A T-course with a similar name (found with the studieinfo search), under a different code.

Options 2 and 3 are not guaranteed to work (seats, approval, how the course counts), and the page says so.

The plan can be exported as a PDF or an Excel file (.xlsx). If the plan does not meet every requirement
or has collisions, the export dialog lists the problems first, and the exported file is marked as not
complete. The export libraries (jsPDF, jsPDF-AutoTable, SheetJS) are loaded from jsDelivr, pinned to exact
versions with integrity hashes, only when someone exports. Downloads do not work when the page is viewed as
a claude.ai artifact.

Years 1–3, the thesis, the language requirement and overlapping course content are assumed to be fine
and are not checked. This is an unofficial tool; confirm your plan with study counselling.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The built page (served by GitHub Pages). Generated, do not edit by hand. |
| `template.html` | Page layout, styles, UI code and UI text in both languages. |
| `validator.js` | The requirement and timetable checks, with their messages in both languages. |
| `data.json` | Courses, timetables and rules per admission year, from the program plans. |
| `courses.json` | Every offering of each course (all programs) and similarly named courses, from the course pages. |
| `parse.py`, `build_data.py` | Parse the downloaded program plan pages into `data.json`. |
| `fetch.sh` | Downloads the program plan pages (Swedish and English). |
| `scrape_courses.py` | Downloads course pages and name searches into `courses.json`. |
| `build.py` | Embeds the data and `validator.js` into `template.html` to produce `index.html`. |
| `favicon.png` | Site icon. |

## Updating

```sh
./fetch.sh pages                          # download program plans from studieinfo.liu.se
python3 build_data.py pages data.json .   # regenerate data.json
python3 scrape_courses.py course-pages    # download course pages (cached in course-pages/), regenerate courses.json
python3 build.py                          # rebuild index.html
```

After editing `template.html` or `validator.js`, run `python3 build.py` to rebuild `index.html`.
`python3 build.py --artifact <file>` also writes a version for publishing as a claude.ai artifact.
To add an admission year, add its id (from the URL `studieinfo.liu.se/program/6CTMA/<id>`) to
`COHORTS` in `parse.py` and to `fetch.sh`.
