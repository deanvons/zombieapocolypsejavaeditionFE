import "../css/CreateSurvivorPage.css";

const survivorTypes = [
  {
    name: "CAREGIVER",
    image: "/hershel1.jpg",
    attributes: {
      Strength: 2,
      Agility: 3,
      Trustworthiness: 8,
      Intelligence: 8,
      Courage: 5,
      Endurance: 6,
      Leadership: 5,
    },
    skills: ["Field Medicine", "Psychological Support", "Cooking"],
  },
  {
    name: "HERO",
    image: "/rick.jpg",
    attributes: {
      Strength: 9,
      Agility: 5,
      Trustworthiness: 2,
      Intelligence: 3,
      Courage: 8,
      Endurance: 6,
      Leadership: 6,
    },
    skills: ["Marksman", "Heavy Weapons", "Blunt Weapons"],
  },
  {
    name: "OUTLAW",
    image: "/daryl.jpg",
    attributes: {
      Strength: 7,
      Agility: 9,
      Trustworthiness: 1,
      Intelligence: 5,
      Courage: 6,
      Endurance: 6,
      Leadership: 3,
    },
    skills: [
      "Improvised Combat",
      "Stealth Combat",
      "Intimidation",
      "Trap Setting",
    ],
  },
];

export default function CreateSurvivorPage() {
  return (
    <div className="selectpage-maincontent">
      <header>
        <h2 className="homepage-title animate-flicker">
          WHO DO YOU WANT TO BE?
        </h2>
      </header>

      <div className="survivortype-components grid grid-cols-1 gap-5 md:grid-cols-3">
        {survivorTypes.map((survivor) => (
          <article
            key={survivor.name}
            className="bg-neutral-primary-soft block max-w-sm border border-default p-6 shadow-xs"
          >
            <img
              className="h-64 w-full rounded-base object-contain bg-neutral-primary-soft"
              src={survivor.image}
              alt={`${survivor.name.toLowerCase()} survivor`}
            />
            <h3 className="mt-6 mb-4 text-2xl font-semibold tracking-tight text-heading">
              {survivor.name}
            </h3>
            <h4 className="mb-2 font-semibold text-heading">Attributes</h4>
            <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-body">
              {Object.entries(survivor.attributes).map(([attribute, value]) => (
                <div className="flex justify-between gap-2" key={attribute}>
                  <dt>{attribute}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <h4 className="mb-2 font-semibold text-heading">Skills</h4>
            <ul className="list-inside list-disc text-sm text-body">
              {survivor.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <a
              href="#"
              class="inline-flex items-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
            >
              Select
              <svg
                class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
