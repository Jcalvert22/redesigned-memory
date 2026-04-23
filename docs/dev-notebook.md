# Development Notebook

## Project Timeline

- **2026-03-31:** Entire team met on an optional day to clarify objectives. [Commit](https://github.com/Jcalvert22/redesigned-memory/commit/70307adaad1f7e2854dc4175e72108572a9a0772)
- **2026-04-07:** Basic setup and app skeleton completed. [Commit](https://github.com/Jcalvert22/redesigned-memory/commit/d93694f978cb0153d990ea1801ace28bbb0d9be7)
- **2026-04-14:** Jayce and Carley met in class to clarify project requirements and improve UI/UX. [Commit](https://github.com/Jcalvert22/redesigned-memory/commit/898533c883883248bf6d242d66a7bbfecf478ef7)
- **2026-04-21:** Jayce and Gunnar met to fix CI/CD and add fetch API support for exercises. [Commit](https://github.com/Jcalvert22/redesigned-memory/commit/1604e3845672ecfe560c8938b9e3b7ae86293beb)
- **2026-04-22:** Entire team met to add finishing touches and close remaining milestones. [Commit](https://github.com/Jcalvert22/redesigned-memory/commit/4a4b686a00f001b76f4fed0e846a20fafe8821af)

## Key Decisions

1. **Supabase over MongoDB**
   - Chosen because it was easier to set up and more developer-friendly for this project.
2. **n2 GCP machine**
   - The app is low-power and not intended to be a full production website, so we chose a lower-cost VM to conserve credits.
3. **Fetch API for exercises**
   - Simple to implement and sufficient to load JSON data from another repository.

## Problem Solving

### Exercise search integration

- Needed to populate the exercise search bar using JSON from another repo.
- Initially, exercises would not load at all.
- Added browser console debugging and discovered the API response format differed from our original assumptions.
- Refactored the display cards to match the new JSON structure, and the search feature began working.

### CI/CD workflow debugging

- The workflow kept failing during the run.
- We identified the cause as SSH public key permission issues.
- We initially assumed the YAML configuration was the problem and tried several versions.
- The true fix was generating a new SSH key pair and updating the GitHub Actions secrets.
- This then led to an issue where github could not cd into the right directory, which was fixed by hardcoding the directory into the yml file.
