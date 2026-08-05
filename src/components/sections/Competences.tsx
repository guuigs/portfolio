import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, Content } from "@/lib/content";
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
      <h4 className="overline">{label}</h4>
      <div className="rail-mask -mx-1">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 py-1">{children}</div>
      </div>
    </div>
  );
}

function CaseCard({
  study,
  onOpen,
}: {
  study: CaseStudy;
  onOpen: () => void;
}) {
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
        <span className="min-w-0 truncate text-[13px] font-medium text-fg">
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

export function Competences({ content, admin, setField, onOpenCase }: CompetencesProps) {
  return (
    <section aria-label="Compétences" className="mx-auto w-full max-w-3xl px-6 lg:px-10">
      <ul className="flex flex-col">
        {content.skills.map((skill, index) => {
          const linked = skill.cases
            .map((id) => content.cases.find((study) => study.id === id))
            .filter((study): study is CaseStudy => Boolean(study));

          return (
            <li
              key={skill.id}
              className="flex flex-col gap-6 border-t border-line py-10 first:border-t-0 first:pt-0"
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
                  className="max-w-prose text-[15px] leading-relaxed text-fg-muted"
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
    </section>
  );
}
