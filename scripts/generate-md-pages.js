#!/usr/bin/env node

/**
 * Generate AI-crawlable markdown files from page content
 * Runs during build process to create .md files for each section
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pages');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Page content for AI crawlers
const pages = {
  'home.md': `# Honeyman Enterprises - Strategic Systems & AI Consulting

## Strategic systems. Sustainable innovation.

Operate smarter, move faster, and create lasting impact with processes designed for growth.

### Call to Action
- Schedule a Call
- Explore Services

## About Honeyman Enterprises

Visit: https://honeymanenterprises.com

Contact: info@honeymanenterprises.com
`,

  'about.md': `# About Honeyman Enterprises

## Who We Are

Honeyman Enterprises partners with organizations that believe in progress through systems thinking. Our team blends executive-level strategy, digital transformation, and AI-driven enablement to help businesses grow sustainably and intelligently.

## Core Values

- **Efficiency**: Streamlined processes that maximize output and minimize waste
- **Integrity**: Transparent, ethical practices in all client engagements
- **Innovation**: Cutting-edge solutions powered by modern technology and AI

## Our Approach

We combine executive-level strategy with hands-on implementation, ensuring that transformation initiatives deliver measurable results. Our methodology integrates EOS (Entrepreneurial Operating System) and OKRs (Objectives and Key Results) frameworks to create sustainable growth.

## Industries We Serve

- Technology & SaaS
- Professional Services
- Healthcare & Life Sciences
- Manufacturing & Supply Chain
- Financial Services
- E-commerce & Retail

Contact: info@honeymanenterprises.com
`,

  'method.md': `# The Honeyman Method™

Our agile-inspired framework merges EOS and OKRs into a continuous, collaborative cycle that aligns every engagement with measurable outcomes and stakeholder visibility.

## Five-Stage Process

### 1. Discovery
We begin by understanding your current state, challenges, and goals. Through stakeholder interviews, process audits, and data analysis, we identify opportunities for improvement and transformation.

**Key Activities:**
- Stakeholder interviews
- Process mapping
- Systems audit
- Gap analysis
- Opportunity identification

### 2. Strategy
Based on discovery insights, we develop a comprehensive strategy aligned with your business objectives. This includes roadmap creation, resource planning, and success metrics definition.

**Key Activities:**
- Strategic planning
- Roadmap development
- Resource allocation
- OKR definition
- Risk assessment

### 3. Approval
We present our strategy and gain alignment with key stakeholders. This collaborative phase ensures buy-in and sets clear expectations for the engagement.

**Key Activities:**
- Strategy presentation
- Stakeholder alignment
- Budget approval
- Timeline agreement
- Success criteria validation

### 4. Execution
Our team implements the approved strategy through iterative sprints, maintaining continuous communication and adapting as needed based on feedback and results.

**Key Activities:**
- Agile implementation
- Sprint planning
- Continuous delivery
- Quality assurance
- Change management

### 5. Delivery
We complete the engagement with knowledge transfer, documentation, and ongoing support to ensure sustained success beyond our involvement.

**Key Activities:**
- Final deliverables
- Knowledge transfer
- Training & enablement
- Documentation
- Post-launch support

## Framework Benefits

- Measurable outcomes at every stage
- Continuous stakeholder visibility
- Adaptive to changing requirements
- Combines best practices from EOS and OKRs
- Proven track record across industries

Contact us to learn how The Honeyman Method can transform your organization.
`,

  'services.md': `# What We Do - Services

Purposeful consulting services designed for measurable impact.

## Strategy & Operations

Structure growth through data-backed business development systems and operational alignment.

**Services Include:**
- Go-to-Market architecture
- Organizational design
- Business process optimization
- Performance management systems
- Strategic planning & execution

**Ideal For:** Companies scaling operations, entering new markets, or optimizing existing processes.

## Digital Transformation

Modernize legacy operations with scalable, cloud-ready foundations and compliance frameworks.

**Services Include:**
- System audit & assessment
- Workflow optimization
- Cloud migration strategy
- Integration architecture
- Compliance & security frameworks

**Ideal For:** Organizations modernizing infrastructure, replacing legacy systems, or improving operational efficiency.

## AI Consulting

Integrate and teach the practical use of AI—from prompt strategy to full agentic systems.

**Services Include:**
- LLM integration & implementation
- Custom agent design
- Prompt engineering strategy
- AI workflow automation
- Team training & enablement

**Ideal For:** Businesses exploring AI adoption, implementing LLM solutions, or building custom AI capabilities.

## Engagement Models

**Advisory:** Strategic guidance and planning
**Implementation:** Hands-on execution and delivery
**Training:** Knowledge transfer and team enablement
**Fractional Leadership:** Ongoing executive-level support

## Industries & Expertise

- Technology & SaaS platforms
- Professional services firms
- Healthcare & life sciences
- Manufacturing operations
- Financial services
- E-commerce businesses

Contact: info@honeymanenterprises.com
Phone: Schedule a discovery call
`,

  'contact.md': `# Contact Honeyman Enterprises

## Let's Talk

Every project begins with a conversation. Schedule a call or send us a note to start discovery.

## Contact Information

**Email:** info@honeymanenterprises.com

**Schedule:** [Schedule a discovery call](https://meetings-na2.hubspot.com/honeyman)

## Contact Form

Submit inquiries through our contact form with the following information:
- First Name
- Last Name
- Email Address
- Company (optional)
- Project Details / Message

## What Happens Next?

1. **Initial Response:** We'll respond within 1 business day
2. **Discovery Call:** 30-minute consultation to understand your needs
3. **Proposal:** Customized proposal with scope, timeline, and pricing
4. **Engagement:** Begin work with clear milestones and deliverables

## Office Hours

Monday - Friday: 9:00 AM - 5:00 PM PST

We serve clients across North America and internationally.

## Follow Us

- LinkedIn: https://www.linkedin.com/company/honeyman-enterprises
- Website: https://honeymanenterprises.com

---

Honeyman Enterprises - Strategic Systems & AI Consulting
© 2025 Honeyman Enterprises. All rights reserved.
`
};

// Write all markdown files
Object.entries(pages).forEach(([filename, content]) => {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Generated: ${filename}`);
});

console.log(`\n🎉 Successfully generated ${Object.keys(pages).length} AI-crawlable markdown files`);
console.log(`📁 Location: public/pages/\n`);
