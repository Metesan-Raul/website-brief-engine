const goals = new Set(['enquiries', 'portfolio', 'catalogue', 'sales']);
const features = new Set(['contact-form', 'gallery', 'filters', 'payments', 'booking', 'multilingual']);

/** Validate untrusted brief data and turn it into explicit planning questions.
 * No pricing, delivery guarantees or external requests are produced.
 */
export function planBrief(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Brief must be an object.');
  }
  if (typeof input.business !== 'string' || !input.business.trim() || input.business.length > 160) {
    throw new TypeError('Business must contain 1–160 characters.');
  }
  if (!goals.has(input.goal)) throw new TypeError('Unsupported goal.');
  if (!Array.isArray(input.features) || input.features.some(feature => !features.has(feature))) {
    throw new TypeError('Features must be an array of supported values.');
  }
  const selected = [...new Set(input.features)].sort();
  const dependencies = new Map();
  const add = (key, detail) => dependencies.set(key, detail);
  if (selected.includes('contact-form')) add('enquiry-delivery', 'Choose a delivery provider, validate on the server and test failure handling.');
  if (selected.includes('payments') || input.goal === 'sales') add('commerce', 'Agree payment provider, order lifecycle, refunds and inventory responsibilities.');
  if (selected.includes('booking')) add('booking', 'Define availability, timezones, conflicts and cancellation rules.');
  if (selected.includes('multilingual')) add('content', 'Agree languages, translation ownership and review of each language.');
  if (selected.includes('gallery')) add('assets', 'Confirm permission to use images and prepare appropriate image sizes.');
  return {
    business: input.business.trim(),
    goal: input.goal,
    features: selected,
    dependencies: [...dependencies].map(([id, detail]) => ({ id, detail })),
    questions: [
      'Who is the primary audience and what should they do next?',
      'Who provides and approves the content?',
      'Who owns the domain, hosting and ongoing maintenance?'
    ],
    status: 'scope-discussion-required'
  };
}

export function formatBrief(plan) {
  return [
    `Website brief: ${plan.business}`,
    `Goal: ${plan.goal}`,
    `Features: ${plan.features.join(', ') || 'none selected'}`,
    '', 'Production dependencies:',
    ...plan.dependencies.map(item => `- ${item.detail}`),
    '', 'Before estimating:', ...plan.questions.map(question => `- ${question}`),
    '', 'This is a planning summary, not a quote or a production readiness assessment.'
  ].join('\n');
}
