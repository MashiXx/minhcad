import { Check, Minus } from "lucide-react";
import type { ComparisonRow, Plan } from "@/lib/site";

type PlanColumn = Pick<Plan, "id" | "name">;

function groupRows(rows: ComparisonRow[]) {
  const groups: { name: string; rows: ComparisonRow[] }[] = [];
  for (const row of rows) {
    const existing = groups.find((g) => g.name === row.group);
    if (existing) existing.rows.push(row);
    else groups.push({ name: row.group, rows: [row] });
  }
  return groups;
}

/** A cell value: check / dash icon with accessible text, or a short string. */
function Value({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm text-fg/90">{value}</span>;
  return value ? (
    <span className="inline-flex items-center">
      <Check aria-hidden className="size-4 text-accent-hover" strokeWidth={2.2} />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="inline-flex items-center">
      <Minus aria-hidden className="size-4 text-subtle" strokeWidth={2} />
      <span className="sr-only">Not included</span>
    </span>
  );
}

/**
 * Feature comparison. A real table from md up; stacked cards (one per group)
 * below 768px so nothing scrolls horizontally.
 */
export function ComparisonTable({ rows, plans }: { rows: ComparisonRow[]; plans: [PlanColumn, PlanColumn] }) {
  const groups = groupRows(rows);
  const [personal, professional] = plans;

  return (
    <>
      <div className="hidden overflow-hidden rounded-[16px] border border-line md:block">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">
            Feature comparison between the {personal.name} and {professional.name} licenses
          </caption>
          <colgroup>
            <col />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead className="bg-surface-1">
            <tr>
              <th scope="col" className="px-6 py-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-subtle">
                Feature
              </th>
              <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-fg">
                {personal.name}
              </th>
              <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-fg">
                {professional.name}
              </th>
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.name} className="border-t border-line">
              <tr className="bg-white/[0.015]">
                <th
                  scope="rowgroup"
                  colSpan={3}
                  className="px-6 pb-2 pt-5 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent-hover"
                >
                  {group.name}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.feature} className="border-t border-line/60 transition-colors hover:bg-white/[0.02]">
                  <th scope="row" className="px-6 py-3.5 text-sm font-normal text-fg/90">
                    {row.feature}
                  </th>
                  <td className="px-6 py-3.5 text-center">
                    <Value value={row.personal} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Value value={row.professional} />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {groups.map((group) => (
          <section
            key={group.name}
            aria-label={`${group.name} features`}
            className="overflow-hidden rounded-[14px] border border-line bg-surface-1/80"
          >
            <h3 className="border-b border-line px-4 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent-hover">
              {group.name}
            </h3>
            <ul className="divide-y divide-line">
              {group.rows.map((row) => (
                <li key={row.feature} className="px-4 py-3.5">
                  <p className="text-sm text-fg">{row.feature}</p>
                  <dl className="mt-2.5 grid grid-cols-2 gap-3">
                    <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-md bg-bg/60 px-3 py-2">
                      <dt className="text-xs text-muted">{personal.name}</dt>
                      <dd>
                        <Value value={row.personal} />
                      </dd>
                    </div>
                    <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-md bg-bg/60 px-3 py-2">
                      <dt className="text-xs text-muted">{professional.name}</dt>
                      <dd>
                        <Value value={row.professional} />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
