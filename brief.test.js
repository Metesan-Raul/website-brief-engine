import test from 'node:test';
import assert from 'node:assert/strict';
import { planBrief, formatBrief } from './brief.js';
const valid = { business: 'Studio', goal: 'portfolio', features: ['gallery'] };

test('normalises, deduplicates and does not mutate input', () => {
  const input = { ...valid, business: ' Studio ', features: ['gallery', 'gallery', 'filters'] };
  const original = structuredClone(input);
  const plan = planBrief(input);
  assert.equal(plan.business, 'Studio');
  assert.deepEqual(plan.features, ['filters', 'gallery']);
  assert.deepEqual(input, original);
});
test('rejects malformed and unsupported input', () => {
  for (const value of [null, [], {}, { ...valid, business: ' ' }, { ...valid, goal: 'unknown' }, { ...valid, features: ['unknown'] }]) {
    assert.throws(() => planBrief(value), TypeError);
  }
});
test('commerce dependencies appear once, including for a sales goal', () => {
  const plan = planBrief({ ...valid, goal: 'sales', features: ['payments', 'payments'] });
  assert.deepEqual(plan.dependencies.map(item => item.id), ['commerce']);
});
test('flags contact, booking, language and image responsibilities', () => {
  const plan = planBrief({ ...valid, features: ['booking', 'contact-form', 'gallery', 'multilingual'] });
  assert.deepEqual(plan.dependencies.map(item => item.id).sort(), ['assets', 'booking', 'content', 'enquiry-delivery']);
  assert.equal(plan.status, 'scope-discussion-required');
});
test('plain-text export is explicit about its limits', () => {
  assert.match(formatBrief(planBrief(valid)), /not a quote/);
});
