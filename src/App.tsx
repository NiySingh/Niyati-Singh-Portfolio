import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  Phone,
  Search,
  X,
} from 'lucide-react';
import {
  COURSEWORK,
  EDUCATION,
  EXPERIENCES,
  KEY_METRICS,
  PROFILE,
  PROJECTS,
  ProjectCategory,
  ProjectItem,
  SKILL_GROUPS,
} from './data/portfolioData';
import { IndoorNavLab } from './components/IndoorNavLab';
import { ProjectInteractivePreview } from './components/ProjectInteractivePreview';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal, downloadResumePdf } from './components/ResumeModal';

export default function App() {
  const [projectFilter, setProjectFilter] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [resumeOpen, setResumeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [skillQuery, setSkillQuery] = useState('');
  const [activeSkill, setActiveSkill] = useState<string | null>('YOLOv8');

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === projectFilter);
  }, [projectFilter]);

  const skillEvidence = useMemo(() => {
    const query = (activeSkill ?? skillQuery).trim().toLowerCase();
    if (!query) return [];

    const matches: { source: string; context: string; metric: string }[] = [];

    for (const exp of EXPERIENCES) {
      for (const ach of exp.achievements) {
        const hay =
          `${ach.lead} ${ach.detail} ${ach.skills.join(' ')}`.toLowerCase();
        if (hay.includes(query)) {
          matches.push({
            source: `${exp.role} · ${exp.organization}`,
            context: ach.detail,
            metric: ach.metric,
          });
        }
      }
    }

    for (const proj of PROJECTS) {
      const hay =
        `${proj.title} ${proj.summary} ${proj.stack.join(' ')}`.toLowerCase();
      if (hay.includes(query)) {
        matches.push({
          source: `Project · ${proj.title}`,
          context: proj.summary,
          metric: `${proj.metricValue} ${proj.metricLabel}`,
        });
      }
    }

    return matches;
  }, [activeSkill, skillQuery]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Education', href: '#education' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111315]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E4E6EB] bg-[#F7F7F8]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-8">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#111315] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#990000]"
          >
            {PROFILE.name}
          </a>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#525866]"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#111315] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#990000] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#990000]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="whitespace-nowrap shrink-0 rounded-lg bg-[#990000] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7A0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
            >
              View Resume
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E6EB] bg-white text-[#111315] md:hidden"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <nav
            className="border-t border-[#E4E6EB] bg-white px-5 py-3 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-[#3F4552] hover:bg-[#F7F7F8] hover:text-[#111315]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* Split-Screen Hero + Interactive Navigation Lab */}
        <section className="mx-auto max-w-[1200px] px-5 pt-10 pb-12 sm:px-8 sm:pt-14 sm:pb-16">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="text-sm font-medium text-[#525866]">
                  Los Angeles, CA · MS Computer Science, University of Southern California
                </p>

                <h1 className="mt-4 max-w-2xl text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-bold tracking-tight text-[#111315] [text-wrap:balance]">
                  {PROFILE.headline}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-[1.65] text-[#454B57]">
                  {PROFILE.bio}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#111315] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#272B33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
                  >
                    Explore Selected Work
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[#DCDFE6] bg-white px-4 py-2.5 text-sm font-medium text-[#111315] transition-colors hover:bg-[#F3F4F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
                  >
                    {copiedEmail ? (
                      <>
                        <Check
                          className="h-4 w-4 text-[#166534]"
                          aria-hidden="true"
                        />
                        Email Copied
                      </>
                    ) : (
                      <>
                        <Copy
                          className="h-4 w-4 text-[#525866]"
                          aria-hidden="true"
                        />
                        {PROFILE.email}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E4E6EB] pt-5 text-sm text-[#525866]">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#111315] transition-colors hover:text-[#990000]"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {PROFILE.githubDisplay}
                </a>
                <span aria-hidden="true" className="text-[#CBD1DC]">
                  ·
                </span>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#111315] transition-colors hover:text-[#990000]"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  {PROFILE.linkedinDisplay}
                </a>
                <span aria-hidden="true" className="text-[#CBD1DC]">
                  ·
                </span>
                <a
                  href="tel:+12138294379"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#3F4552] transition-colors hover:text-[#990000]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {PROFILE.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <IndoorNavLab />
            </div>
          </div>

          {/* Full-width 4-Column Quantitative Proof Row below Hero Split */}
          <div className="mt-12 grid grid-cols-1 divide-y divide-[#E4E6EB] rounded-2xl border border-[#E4E6EB] bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {KEY_METRICS.map((item, idx) => (
              <div
                key={item.label}
                className={`p-6 ${idx === 1 ? 'sm:border-l sm:border-[#E4E6EB] lg:border-l' : ''} ${
                  idx >= 2 ? 'sm:border-t sm:border-[#E4E6EB] lg:border-t-0' : ''
                }`}
              >
                <p className="font-mono text-3xl font-semibold tracking-tight text-[#111315]">
                  {item.value}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#111315]">
                  {item.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#646B78]">
                  {item.context}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider */}
        <div className="overflow-hidden border-y border-[#E4E6EB] bg-white py-3.5">
          <div className="animate-marquee text-xs font-medium tracking-wide text-[#646B78]">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
                <span>Computer Vision & YOLOv8</span>
                <span aria-hidden="true">·</span>
                <span>BLE RSSI Indoor Localization</span>
                <span aria-hidden="true">·</span>
                <span>Graph-Based Path Planning</span>
                <span aria-hidden="true">·</span>
                <span>React & TypeScript Systems</span>
                <span aria-hidden="true">·</span>
                <span>AWS Cloud & Docker</span>
                <span aria-hidden="true">·</span>
                <span>Flask & FastAPI Backends</span>
                <span aria-hidden="true">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Projects Bento Grid */}
        <section
          id="projects"
          className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium text-[#990000]">
                01. Selected Engineering Work
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111315] sm:text-4xl [text-wrap:balance]">
                Systems built from research to production
              </h2>
            </div>

            <div
              className="flex items-center gap-1 self-start rounded-lg bg-[#ECEEF2] p-1"
              role="tablist"
              aria-label="Filter projects by discipline"
            >
              {(
                [
                  { id: 'all', label: 'All Projects' },
                  { id: 'vision', label: 'Computer Vision' },
                  { id: 'systems', label: 'Systems & Web' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={projectFilter === tab.id}
                  onClick={() => setProjectFilter(tab.id)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    projectFilter === tab.id
                      ? 'bg-white text-[#111315] shadow-xs'
                      : 'text-[#525866] hover:text-[#111315]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project, idx) => {
              const isFlagship =
                projectFilter === 'all' && idx === 0 && project.id === 'indoor-nav';

              return (
                <article
                  key={project.id}
                  className={`group flex flex-col justify-between rounded-2xl border border-[#E4E6EB] bg-white p-6 transition-colors hover:border-[#C5CAD4] sm:p-7 ${
                    isFlagship ? 'md:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#646B78]">
                      <span>
                        {project.categoryLabel} · {project.date}
                      </span>
                      <span className="font-mono text-[#525866]">
                        {project.stack.join(' / ')}
                      </span>
                    </div>

                    <div
                      className={`mt-4 grid gap-6 ${
                        isFlagship ? 'lg:grid-cols-12 lg:items-center' : ''
                      }`}
                    >
                      <div className={isFlagship ? 'lg:col-span-6' : ''}>
                        <h3 className="text-xl font-bold tracking-tight text-[#111315] sm:text-2xl">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#454B57]">
                          {project.summary}
                        </p>

                        <div className="mt-5 flex items-baseline gap-3 border-t border-[#ECEEF2] pt-4">
                          <span className="font-mono text-2xl font-bold text-[#990000]">
                            {project.metricValue}
                          </span>
                          <span className="text-xs text-[#525866]">
                            {project.metricLabel}
                          </span>
                        </div>
                      </div>

                      <div className={isFlagship ? 'lg:col-span-6' : 'mt-5'}>
                        <ProjectInteractivePreview projectId={project.id} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#ECEEF2] pt-4">
                    <span className="text-xs text-[#646B78]">
                      Interactive simulation & architecture inside
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#DCDFE6] bg-white px-3.5 py-2 text-xs font-semibold text-[#111315] transition-colors hover:border-[#990000] hover:text-[#990000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
                    >
                      Inspect Case Study
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Experience Timeline */}
        <section
          id="experience"
          className="border-t border-[#E4E6EB] bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#990000]">
                02. Industry & Research Experience
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111315] sm:text-4xl [text-wrap:balance]">
                Applied computer vision and full-stack internships
              </h2>
            </div>

            <div className="mt-10 divide-y divide-[#E4E6EB] border-t border-b border-[#E4E6EB]">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  className="grid gap-6 py-8 md:grid-cols-12 md:gap-10"
                >
                  <div className="md:col-span-4">
                    <p className="font-mono text-xs text-[#646B78]">
                      {exp.period}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[#111315]">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#3F4552]">
                      {exp.organization}
                    </p>
                    <p className="mt-0.5 text-xs text-[#646B78]">
                      {exp.location} · {exp.focus}
                    </p>
                  </div>

                  <div className="space-y-5 md:col-span-8">
                    {exp.achievements.map((ach) => (
                      <div key={ach.lead} className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#111315]">
                            {ach.lead}
                          </h4>
                          <span className="font-mono text-xs font-medium text-[#990000]">
                            {ach.metric}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#454B57]">
                          {ach.detail}
                        </p>
                        <p className="text-xs text-[#646B78]">
                          Stack: {ach.skills.join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities & Interactive Skill Explorer */}
        <section
          id="capabilities"
          className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-medium text-[#990000]">
                03. Technical Capabilities
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111315] sm:text-4xl [text-wrap:balance]">
                Core engineering stack & applied proof
              </h2>
              <p className="mt-2 text-sm text-[#525866]">
                Select or search any technology below to trace where it was deployed across research, internships, and coursework projects.
              </p>
            </div>

            <div className="relative w-full max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#646B78]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={skillQuery}
                onChange={(e) => {
                  setSkillQuery(e.target.value);
                  setActiveSkill(null);
                }}
                placeholder="Filter skills (e.g. YOLOv8, React)"
                aria-label="Filter technical skills"
                className="w-full rounded-lg border border-[#DCDFE6] bg-white py-2.5 pr-3 pl-9 text-sm text-[#111315] placeholder:text-[#7A818E] focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="divide-y divide-[#E4E6EB] rounded-2xl border border-[#E4E6EB] bg-white lg:col-span-7">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.domain}
                  className="grid gap-3 p-5 sm:grid-cols-12 sm:items-baseline"
                >
                  <h3 className="text-xs font-semibold text-[#646B78] sm:col-span-4">
                    {group.domain}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 sm:col-span-8">
                    {group.items.map((skill) => {
                      const matchesSearch =
                        skillQuery.trim().length > 0 &&
                        skill.toLowerCase().includes(skillQuery.toLowerCase());
                      const isSelected = activeSkill === skill;

                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            setActiveSkill(isSelected ? null : skill);
                            setSkillQuery('');
                          }}
                          className={`whitespace-nowrap shrink-0 rounded-md px-2 py-1 text-sm transition-colors ${
                            isSelected || matchesSearch
                              ? 'bg-[#990000] font-medium text-white'
                              : 'text-[#111315] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#E4E6EB] bg-white p-6 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#ECEEF2] pb-3">
                  <div>
                    <p className="text-xs text-[#646B78]">Applied Evidence</p>
                    <h3 className="mt-0.5 text-base font-semibold text-[#111315]">
                      {activeSkill
                        ? activeSkill
                        : skillQuery.trim()
                          ? `Matching "${skillQuery.trim()}"`
                          : 'Select a skill to inspect usage'}
                    </h3>
                  </div>
                  {(activeSkill || skillQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSkill(null);
                        setSkillQuery('');
                      }}
                      className="text-xs font-medium text-[#525866] hover:text-[#111315]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {skillEvidence.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {skillEvidence.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-b border-[#ECEEF2] pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-semibold text-[#111315]">
                            {item.source}
                          </p>
                          <span className="font-mono text-xs text-[#990000]">
                            {item.metric}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#525866]">
                          {item.context}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm leading-relaxed text-[#646B78]">
                    {activeSkill || skillQuery.trim()
                      ? 'This capability is part of Niyati’s core technical toolkit across coursework and systems prototyping.'
                      : 'Click any language, framework, or ML tool on the left to inspect its project and internship deployments.'}
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-[#ECEEF2] pt-4 text-xs text-[#646B78]">
                Foundational proficiency across ML pipelines, backend REST services, and cloud deployments.
              </div>
            </div>
          </div>
        </section>

        {/* Education & Coursework */}
        <section
          id="education"
          className="border-t border-[#E4E6EB] bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <p className="text-xs font-medium text-[#990000]">
              04. Academic Foundation
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111315] sm:text-4xl">
              Education & Coursework
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.institution}
                  className="flex flex-col justify-between rounded-2xl border border-[#E4E6EB] bg-[#FAFAFB] p-6 sm:p-7"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#646B78]">
                      <span>{edu.location}</span>
                      <span className="font-mono">{edu.period}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-[#111315]">
                      {edu.institution}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#3F4552]">
                      {edu.degree}
                    </p>
                  </div>
                  <p className="mt-5 border-t border-[#E4E6EB] pt-4 font-mono text-xs font-medium text-[#990000]">
                    {edu.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#E4E6EB] pt-6">
              <p className="text-xs font-semibold text-[#646B78]">
                Relevant Computer Science Coursework
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#3F4552]">
                {COURSEWORK.join(' · ')}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[#E4E6EB] bg-[#F7F7F8] py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#111315]">
              {PROFILE.name}
            </h2>
            <p className="mt-1 text-sm text-[#525866]">
              MS Computer Science Candidate at USC · Open to Software Engineering & ML Internships
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#111315] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#272B33]"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email Niyati
            </a>
            <button
              type="button"
              onClick={() => {
                downloadResumePdf().catch(() => setResumeOpen(true));
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[#DCDFE6] bg-white px-4 py-2.5 text-xs font-semibold text-[#111315] transition-colors hover:bg-[#F3F4F6]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download Resume
            </button>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#DCDFE6] bg-white px-3.5 py-2.5 text-xs font-medium text-[#3F4552] transition-colors hover:text-[#111315]"
            >
              <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#DCDFE6] bg-white px-3.5 py-2.5 text-xs font-medium text-[#3F4552] transition-colors hover:text-[#111315]"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-[#E4E6EB] px-5 pt-6 text-xs text-[#646B78] sm:px-8">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Los Angeles, California · {PROFILE.phone}</span>
        </div>
      </footer>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
