import "../css/HomePage.css";

export default function SurvivorTypeCard({ survivor }) {
  return (
    <article className="bg-neutral-primary-soft flex w-full flex-col border border-default p-4 shadow-xs">
      <img
        className="h-[clamp(15rem,18vh,9rem)] w-full rounded-base object-contain bg-neutral-primary-soft"
        src={survivor.image}
        alt={`${survivor.name.toLowerCase()} survivor`}
      />

      <h3 className="mt-3 mb-2 text-xl font-semibold tracking-tight text-heading">
        {survivor.name}
      </h3>

      <h4 className="mb-1 text-sm font-semibold text-heading">Attributes</h4>
      <dl className="mb-3 space-y-1.5 text-xs text-body">
        {Object.entries(survivor.attributes).map(([attribute, value]) => (
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2" key={attribute}>
            <dt>{attribute}</dt>
            <dd className="flex items-center gap-2">
              <div
                role="meter"
                aria-label={attribute}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={value}
                className="h-2 flex-1 overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-text">
                {value}/10
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <h4 className="mb-1 text-sm font-semibold text-heading">Skills</h4>
      <ul className="mb-3 list-inside list-disc text-xs leading-5 text-body">
        {survivor.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <button
        type="button"
        className="group menu-button menu-button-active mt-auto w-full px-4 py-2"
      >
        <span className="flex items-center justify-between">
          <span className="button-label button-label-active">Select</span>
          <span className="button-arrow" aria-hidden="true">&rarr;</span>
        </span>
        <span className="button-indicator" aria-hidden="true" />
      </button>
    </article>
  );
}