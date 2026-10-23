# Website Brief Engine

A small, dependency-free JavaScript module that turns a website brief into a structured scope discussion. Built as an independent project to demonstrate input validation, deterministic domain logic, tests and documented boundaries.

## Why it exists

“I need a booking button” is not a complete specification. Availability, timezones and cancellation rules still need owners. This module makes those unanswered responsibilities visible before quoting a website.

## Run

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm test
npm run example
```

## Use

```js
import { planBrief, formatBrief } from './brief.js';

const plan = planBrief({
  business: 'Independent studio',
  goal: 'enquiries',
  features: ['gallery', 'contact-form']
});
console.log(formatBrief(plan));
```

**Goals:** `enquiries`, `portfolio`, `catalogue`, `sales`.

**Features:** `contact-form`, `gallery`, `filters`, `payments`, `booking`, `multilingual`.

Invalid input throws a `TypeError`. Features are deduplicated and sorted; the input is not mutated. The returned object contains the normalised brief, dependencies, discovery questions and an explicit `scope-discussion-required` status.

## Design decisions

- Pure domain function: no network, tracking, account or database.
- Allowlisted values at the input boundary.
- Payment and sales requirements produce one shared commerce dependency.
- No fabricated estimate, compliance guarantee or delivery date.
- Text export is for reading, not an HTML renderer. Escape values if integrating into HTML.

## Verification and limitations

The Node test suite covers malformed input, normalisation, duplicate features, dependency rules and export boundaries. A GitHub Actions workflow is included for Node 22 and 24; inclusion is not a claim that remote CI has run.

This is a planning utility, not a complete requirements system, security audit or legal assessment. It does not send enquiries, take payments or make bookings. A production application still needs its own UI, integration testing, storage decisions and operational controls.
