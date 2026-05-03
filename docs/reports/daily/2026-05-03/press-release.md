FOR IMMEDIATE RELEASE

# U.S. Government Website Accessibility Report: May 3, 2026

*Washington, D.C. -- May 3, 2026* -- A daily scan of 11 of the most-visited U.S. government websites found 25 accessibility barriers across 11 URLs today. The most common issues include Document Structure Navigation, Color-Independent Link Identification, and Digital Motor Access.

These barriers prevent Americans with disabilities from independently accessing essential government services. This is a single daily snapshot of the most popular ~11 pages in U.S. federal government web properties, as measured by the Digital Analytics Program (DAP).

## Americans Being Left Out

Based on page traffic data and U.S. Census disability prevalence estimates (ACS 2022), today's accessibility barriers are estimated to affect the following groups of Americans:

| Disability Group | Affected Page Loads | Estimated People Affected |
|-----------------|---------------------|--------------------------|
| Limited Reach and Strength | 15,080 | ~875 |
| Without Perception of Color | 15,999 | ~688 |
| Limited Vision | 18,587 | ~446 |
| Limited Manipulation | 17,169 | ~378 |
| Without Vision | 17,169 | ~172 |
| Without Hearing | 17,169 | ~52 |

*Total page loads across all scanned URLs today: 200,364*

*Estimates use disability prevalence rates from the U.S. Census Bureau American Community Survey (ACS) 2022, supplemented by CDC, NIDCD, AFB, and NIH/NEI data. These are rough estimates intended to illustrate the scale of accessibility barriers, not precise measurements.*

## Top Accessibility Barriers

The following accessibility issues were most frequently found across today's scanned government websites. Each issue prevents specific groups of Americans from independently accessing government services.

### 1. `heading-order`: Document Structure Navigation

*Found on 5 government websites today*

Screen reader users navigate complex government websites primarily through heading structure, using headings as a table of contents to jump between sections. Skipped heading levels break the logical document outline, causing confusion about the hierarchy of information and forcing users to re-read sections to understand the relationship between topics, adding significant time and effort to information-gathering tasks.

**Affected groups:**

- People who are blind using screen readers
- People who are deaf and rely on visual-to-text tools
- People with motor disabilities using keyboard navigation

### 2. `link-in-text-block`: Color-Independent Link Identification

*Found on 4 government websites today*

When links are distinguished only by color, people with color vision deficiency cannot identify them as links and may miss critical references to additional information, forms, or resources. On government websites, overlooked links in informational content can mean missing essential instructions, deadlines, or procedures that affect a citizen's ability to access services or comply with requirements.

**Affected groups:**

- People with low vision who may not perceive color differences
- People who are color blind (approximately 8% of men, 0.5% of women)

### 3. `target-size`: Digital Motor Access

*Found on 4 government websites today*

Small touch targets act as a digital gatekeeper, excluding individuals with tremors, arthritis, or limited dexterity from accessing essential services independently. These technical failures transform a routine interaction into a source of failure, stripping away the autonomy of citizens who require a frictionless, accessible interface to participate in digital life. The approximately 58 million Americans with ambulatory or self-care disabilities are disproportionately impacted by inadequate touch target sizing on government mobile websites.

**Affected groups:**

- People with Parkinson's disease, arthritis, or hand tremors
- Older adults with reduced fine motor control
- People with motor disabilities using alternative pointing devices
- People in situational impairment contexts (e.g., commuting, holding a child)

### 4. `landmark-one-main`: Primary Content Identification

*Found on 4 government websites today*

Without a main landmark, screen reader users lose their most efficient way to skip to the primary content of a government page. Every page visit requires tabbing through the entire navigation structure to reach the actual content, a significant time and effort burden that accumulates across repeated visits to government websites for citizens managing ongoing benefit cases or legal matters.

**Affected groups:**

- People who are blind using screen readers
- People who are deaf and rely on visual-to-text tools
- People with motor disabilities using keyboard navigation

### 5. `aria-required-attr`: ARIA Role Completeness

*Found on 2 government websites today*

ARIA roles without their required attributes create incomplete semantic information for assistive technologies. Screen reader users navigating custom widgets on government websites receive partial or incorrect information about the state and function of controls, making accurate interaction impossible and eroding trust in the digital service.

**Affected groups:**

- People who are blind using screen readers
- People who are deaf and rely on visual-to-text tools
- People with motor disabilities using keyboard or switch access

## Accessibility Scores

Aggregate Lighthouse scores across 11 scanned U.S. government websites today:

| Metric | Score |
|--------|-------|
| Accessibility | 92.11 |
| Performance | 46.89 |
| Best Practices | 90.44 |
| SEO | 87.67 |

## About This Report

This report captures a daily snapshot of the most-visited U.S. government web pages as measured by the Digital Analytics Program (DAP). Scans use Lighthouse (Google's automated web quality tool, which includes axe-core for accessibility testing). Reports are published automatically each day.

- [View full interactive report](https://mgifford.github.io/daily-nsf/docs/reports/daily/2026-05-03/index.html)
- [Download accessibility findings (JSON)](https://mgifford.github.io/daily-nsf/docs/reports/daily/2026-05-03/axe-findings.json)
- [Download accessibility findings (CSV)](https://mgifford.github.io/daily-nsf/docs/reports/daily/2026-05-03/axe-findings.csv)

---

*Generated by [Daily NSF](https://github.com/mgifford/daily-nsf) | Source: Digital Analytics Program | Methodology: Lighthouse + axe-core | Date: 2026-05-03*
