# Handling a website enquiry

A form submission can be valid JavaScript but still be an invalid brief. Keep
validation separate from displaying the result, and return an actionable message
instead of letting a TypeError become an unexplained server error.

The following dependency-free example uses synthetic data. It can be saved as
`form-example.js` beside `brief.js` and run with `node form-example.js`.

```js
import assert from 'node:assert/strict';
import { planBrief, formatBrief } from './brief.js';

function reviewSubmission(payload) {
  try {
    const plan = planBrief(payload);
    return { ok: true, plan, summary: formatBrief(plan) };
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    return { ok: false, message: error.message };
  }
}

const accepted = reviewSubmission({
  business: 'Example photography studio',
  goal: 'enquiries',
  features: ['booking', 'gallery', 'multilingual', 'booking']
});

assert.equal(accepted.ok, true);
assert.deepEqual(accepted.plan.features, ['booking', 'gallery', 'multilingual']);
assert.deepEqual(
  accepted.plan.dependencies.map(item => item.id),
  ['booking', 'content', 'assets']
);
assert.equal(accepted.plan.status, 'scope-discussion-required');

const rejected = reviewSubmission({
  business: 'Example photography studio',
  goal: 'enquiries',
  features: ['book-now'] // UI labels are not supported feature identifiers.
});
assert.equal(rejected.ok, false);
assert.equal(rejected.message, 'Features must be an array of supported values.');
console.log(accepted.summary);
console.log('Rejected example:', rejected.message);
```

## Connecting it to an application

- Map visible form labels to the supported identifiers before calling the module.
  Do not silently drop unsupported selections: ask the user to correct them.
- Run validation on the server as well as in the browser. Client-side validation
  alone can be bypassed. The module itself does not provide an HTTP endpoint.
- Present `summary` as plain text, not raw HTML. A business name is user input.
- If validation fails, let the visitor fix the form without losing their entries.
  A web adapter can map this result to its own validation response; authentication,
  request-size limits, rate limiting and persistence belong to that adapter.

An accepted result still needs a scope conversation. In this example, booking
needs availability and cancellation rules, multilingual content needs an owner,
and gallery images need usage permission. No booking is created and no enquiry
is delivered by running this example.
