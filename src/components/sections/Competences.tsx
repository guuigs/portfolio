import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, Content } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import { Editable } from "@/components/cms/Editable";

export interface CompetencesProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
  onOpenCase: (caseId: string) => void;
}

/** A horizontal rail that clips its overflow behind a soft edge. */
function Rail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Sans, not mono: these two labels were the "terminal → sans" swap. */}
      <h4 className="overline-sans">{label}</h4>
      <div className="rail-mask -mx-1">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 py-1">{children}</div>
      </div>
    </div>
  );
}

function CaseCard({ study, onOpen }: { study: CaseStudy; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        group flex w-40 shrink-0 flex-col gap-2 rounded-lg border border-line
        bg-surface p-2 text-left
        transition-[border-color,background-color] duration-150 ease-out
        hover:border-line-strong hover:bg-bg-subtle
      "
    >
      <div className="aspect-square overflow-hidden rounded-md bg-bg-subtle">
        <img
          src={study.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 items-start justify-between gap-1 px-1 pb-1">
        <span className="min-w-0 truncate text-[14px] font-medium text-fg sm:text-[13px]">
          {study.shortTitle}
        </span>
        <ArrowUpRight
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-fg-subtle transition-colors duration-150 group-hover:text-fg"
        />
      </div>
    </button>
  );
}

/**
 * Sticky index of every skill, pinned to the left of the column.
 *
 * Hidden below 1024px: there is no gutter to put it in, and stacking it above
 * the content would just be a second, redundant nav.
 */
function SkillNav({ skills }: { skills: Content["skills"] }) {
  const [activeId, setActiveId] = useState(skills[0]?.id ?? "");

  useEffect(() => {
    const targets = skills
      .map((skill) => document.getElementById(`skill-${skill.id}`))
      .filter((node): node is HTMLElement => Boolean(node));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The entry closest to the top of the viewport wins, so the marker
        // doesn't jump around when two headings are on screen at once.
        const onScreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (onScreen[0]) setActiveId(onScreen[0].target.id.replace("skill-", ""));
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [skills]);

  return (
    <nav
      aria-label="Index des compétences"
      className="sticky top-24 hidden self-start lg:block"
    >
      <ul className="flex flex-col gap-1 border-l border-line">
        {skills.map((skill) => {
          const isActive = skill.id === activeId;
          return (
            <li key={skill.id}>
              <a
                href={`#skill-${skill.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-4 text-[13px] leading-snug",
                  "transition-[color,border-color] duration-150 ease-out",
                  isActive
                    ? "border-fg font-medium text-fg"
                    : "border-transparent text-fg-faint hover:border-line-strong hover:text-fg",
                )}
              >
                {skill.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Competences({ content, admin, setField, onOpenCase }: CompetencesProps) {
  return (
    <section aria-label="Compétences" className="gutter-x mx-auto w-full max-w-5xl">
      <div className="grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
        <SkillNav skills={content.skills} />

        {/* min-w-0: as a grid item this defaults to min-width:auto, which lets
            the overflowing rails push the whole column past the viewport. */}
        <ul className="flex min-w-0 flex-col">
          {content.skills.map((skill, index) => {
            const linked = skill.cases
              .map((id) => content.cases.find((study) => study.id === id))
              .filter((study): study is CaseStudy => Boolean(study));

            return (
              <li
                key={skill.id}
                id={`skill-${skill.id}`}
                className="flex scroll-mt-24 flex-col gap-6 border-t border-line py-10 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-3">
                  <Editable
                    as="h3"
                    admin={admin}
                    value={skill.title}
                    onCommit={(value) => setField(`skills.${index}.title`, value)}
                    className="text-2xl tracking-[-0.03em]"
                  />
                  <Editable
                    as="p"
                    multiline
                    admin={admin}
                    value={skill.description}
                    onCommit={(value) => setField(`skills.${index}.description`, value)}
                    className="max-w-prose text-[15px] leading-relaxed text-fg-muted sm:text-[13px]"
                  />
                </div>

                <Rail label="stack technique">
                  {skill.stack.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </Rail>

                {linked.length > 0 && (
                  <Rail label="cas d’études">
                    {linked.map((study) => (
                      <CaseCard
                        key={study.id}
                        study={study}
                        onOpen={() => onOpenCase(study.id)}
                      />
                    ))}
                  </Rail>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
