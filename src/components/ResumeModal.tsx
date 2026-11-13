import React, { useEffect, useRef, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  COURSEWORK,
  EDUCATION,
  EXPERIENCES,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from '../data/portfolioData';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export const downloadResumePdf = async () => {
  const response = await fetch(PROFILE.resumeUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch resume PDF');
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'Niyati_Singh_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose }) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'document'>('pdf');
  const [scale, setScale] = useState<number>(1.35);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || viewMode !== 'pdf') return;

    let cancelled = false;

    const renderPdf = async () => {
      setLoading(true);
      setRenderError(null);
      try {
        const loadingTask = pdfjsLib.getDocument({ url: PROFILE.resumeUrl });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setNumPages(pdf.numPages);
        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.className =
            'mx-auto block max-w-full rounded-lg border border-[#DCDFE6] bg-white shadow-sm';

          const context = canvas.getContext('2d');
          if (!context) continue;

          context.setTransform(dpr, 0, 0, dpr, 0, 0);
          container.appendChild(canvas);

          await page.render({
            canvasContext: context,
            canvas,
            viewport,
          }).promise;
        }
        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setRenderError(
            err instanceof Error ? err.message : 'Unable to render PDF preview'
          );
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [open, viewMode, scale]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResumePdf();
    } catch {
      setViewMode('document');
    } finally {
      setDownloading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111315]/60 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E4E6EB] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEEF2] px-5 py-4 sm:px-6">
          <div>
            <h2
              id="resume-modal-title"
              className="text-base font-semibold text-[#111315]"
            >
              Niyati Singh — Curriculum Vitae
            </h2>
            <p className="text-xs text-[#646B78]">
              MS Computer Science, University of Southern California
              {numPages > 0 && viewMode === 'pdf'
                ? ` · ${numPages} page${numPages > 1 ? 's' : ''}`
                : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F6] p-1">
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'pdf'
                    ? 'bg-white text-[#111315] shadow-xs'
                    : 'text-[#525866] hover:text-[#111315]'
                }`}
              >
                PDF Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'document'
                    ? 'bg-white text-[#111315] shadow-xs'
                    : 'text-[#525866] hover:text-[#111315]'
                }`}
              >
                Selectable Text
              </button>
            </div>

            {viewMode === 'pdf' && (
              <div className="hidden items-center gap-1 rounded-lg border border-[#E4E6EB] px-1.5 py-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.85, +(s - 0.2).toFixed(2)))}
                  className="rounded p-1 text-[#525866] hover:bg-[#F3F4F6] hover:text-[#111315]"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="w-11 text-center font-mono text-[11px] text-[#3F4552]">
                  {Math.round((scale / 1.35) * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(2.15, +(s + 0.2).toFixed(2)))}
                  className="rounded p-1 text-[#525866] hover:bg-[#F3F4F6] hover:text-[#111315]"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-[#990000] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#7A0000] disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {downloading ? 'Preparing...' : 'Download PDF'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4E6EB] text-[#3F4552] transition-colors hover:bg-[#F3F4F6] hover:text-[#111315]"
              aria-label="Close resume viewer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F3F4F6] p-4 sm:p-6">
          {viewMode === 'pdf' ? (
            <div className="mx-auto max-w-3xl">
              {loading && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-[#E4E6EB] bg-white py-20 text-center">
                  <FileText
                    className="h-7 w-7 text-[#990000]"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-medium text-[#111315]">
                    Rendering PDF resume...
                  </p>
                  <p className="mt-1 text-xs text-[#646B78]">
                    Drawing directly to canvas so browser iframe policies never block your CV.
                  </p>
                </div>
              )}

              {renderError && (
                <div className="rounded-xl border border-[#E4E6EB] bg-white p-6 text-center">
                  <p className="text-sm font-semibold text-[#111315]">
                    PDF canvas preview could not load ({renderError})
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('document')}
                    className="mt-3 rounded-lg bg-[#111315] px-4 py-2 text-xs font-medium text-white"
                  >
                    Switch to Selectable Text View
                  </button>
                </div>
              )}

              <div
                ref={containerRef}
                className={`space-y-4 ${loading || renderError ? 'hidden' : 'block'}`}
              />
            </div>
          ) : (
            <article className="mx-auto max-w-3xl rounded-xl border border-[#DCDFE6] bg-white p-6 text-[#111315] shadow-sm sm:p-10">
              <header className="border-b border-[#111315] pb-4 text-center">
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {PROFILE.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#3F4552]">
                  {PROFILE.email} · {PROFILE.linkedinDisplay} ·{' '}
                  {PROFILE.githubDisplay} · {PROFILE.phone} · {PROFILE.location}
                </p>
              </header>

              <section className="mt-5">
                <h4 className="border-b border-[#DCDFE6] pb-1 text-xs font-bold tracking-wider text-[#111315]">
                  EDUCATION
                </h4>
                <div className="mt-2.5 space-y-2.5 text-xs">
                  {EDUCATION.map((edu) => (
                    <div
                      key={edu.institution}
                      className="flex flex-wrap items-baseline justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-[#111315]">
                          {edu.degree}
                        </p>
                        <p className="text-[#454B57]">
                          {edu.institution}, {edu.location}
                        </p>
                      </div>
                      <div className="text-right font-mono text-[11px] text-[#525866]">
                        <p>{edu.period}</p>
                        {edu.note.includes('CGPA') && (
                          <p className="font-semibold text-[#111315]">
                            {edu.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#454B57]">
                    <span className="font-semibold text-[#111315]">
                      Relevant Coursework:{' '}
                    </span>
                    {COURSEWORK.join(', ')}
                  </p>
                </div>
              </section>

              <section className="mt-5">
                <h4 className="border-b border-[#DCDFE6] pb-1 text-xs font-bold tracking-wider text-[#111315]">
                  SKILLS
                </h4>
                <div className="mt-2.5 space-y-1 text-xs text-[#3F4552]">
                  {SKILL_GROUPS.map((group) => (
                    <p key={group.domain}>
                      <span className="font-semibold text-[#111315]">
                        {group.domain}:{' '}
                      </span>
                      {group.items.join(', ')}
                    </p>
                  ))}
                </div>
              </section>

              <section className="mt-5">
                <h4 className="border-b border-[#DCDFE6] pb-1 text-xs font-bold tracking-wider text-[#111315]">
                  EXPERIENCE
                </h4>
                <div className="mt-2.5 space-y-3.5 text-xs">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-[#111315]">
                          {exp.role} — {exp.organization}, {exp.location}
                        </p>
                        <span className="font-mono text-[11px] text-[#525866]">
                          {exp.period}
                        </span>
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-[#3F4552]">
                        {exp.achievements.map((ach) => (
                          <li key={ach.lead}>{ach.detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-5">
                <h4 className="border-b border-[#DCDFE6] pb-1 text-xs font-bold tracking-wider text-[#111315]">
                  PROJECTS
                </h4>
                <div className="mt-2.5 space-y-3.5 text-xs">
                  {PROJECTS.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-[#111315]">
                          {proj.title}{' '}
                          <span className="font-normal text-[#525866]">
                            ({proj.stack.join(', ')})
                          </span>
                        </p>
                        <span className="font-mono text-[11px] text-[#525866]">
                          {proj.date}
                        </span>
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-[#3F4552]">
                        {proj.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
