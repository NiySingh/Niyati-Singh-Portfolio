import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { ProjectInteractivePreview } from './ProjectInteractivePreview';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111315]/55 p-4 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E4E6EB] bg-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ECEEF2] pb-5">
          <div>
            <p className="text-xs font-medium text-[#646B78]">
              {project.categoryLabel} · {project.date} · {project.stack.join(' / ')}
            </p>
            <h2
              id="project-modal-title"
              className="mt-1.5 text-2xl font-bold tracking-tight text-[#111315] sm:text-3xl"
            >
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-[#525866]">{project.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4E6EB] text-[#3F4552] transition-colors hover:bg-[#F3F4F6] hover:text-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
            aria-label="Close project details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6">
          <ProjectInteractivePreview projectId={project.id} interactive />
        </div>

        <div className="mt-8 grid gap-8 border-t border-[#ECEEF2] pt-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-base font-semibold text-[#111315]">
              Engineering Overview
            </h3>
            <p className="text-sm leading-relaxed text-[#3F4552]">
              {project.summary}
            </p>
            <ul className="space-y-2.5 text-sm leading-relaxed text-[#3F4552]">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <ArrowRight
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-[#990000]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 border-t border-[#ECEEF2] pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <div>
              <p className="text-xs font-medium text-[#646B78]">Key Outcome</p>
              <p className="mt-1 font-mono text-2xl font-bold text-[#990000]">
                {project.metricValue}
              </p>
              <p className="text-xs text-[#525866]">{project.metricLabel}</p>
            </div>

            <div className="space-y-3 border-t border-[#ECEEF2] pt-4 text-xs">
              <div>
                <span className="font-semibold text-[#111315]">Input</span>
                <p className="mt-0.5 text-[#525866]">
                  {project.architecture.input}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#111315]">Processing</span>
                <p className="mt-0.5 text-[#525866]">
                  {project.architecture.processing}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#111315]">Output</span>
                <p className="mt-0.5 text-[#525866]">
                  {project.architecture.output}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
