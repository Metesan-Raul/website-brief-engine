import { planBrief, formatBrief } from './brief.js';
console.log(formatBrief(planBrief({
  business: 'Independent photography studio',
  goal: 'enquiries',
  features: ['gallery', 'contact-form', 'multilingual']
})));
