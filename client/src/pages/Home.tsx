import { useState } from "react";
import { usePortfolioContent } from "@/lib/portfolioContent";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDot,
  Download,
  Layers3,
  LineChart,
  Mail,
  Menu,
  Sparkles,
  Target,
  X,
} from "lucide-react";

const expertise = [
  {
    number: "01",
    icon: LineChart,
    title: "Pilotage de la performance",
    text: "Transformer les données en décisions lisibles, actionnables et alignées sur les priorités de l’organisation.",
    accent: "yellow",
  },
  {
    number: "02",
    icon: Target,
    title: "Stratégie & développement",
    text: "Structurer une vision, clarifier les arbitrages et faire avancer les projets avec méthode et précision.",
    accent: "blue",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Gestion de projet",
    text: "Coordonner les parties prenantes, sécuriser les délais et donner un rythme durable à l’exécution.",
    accent: "black",
  },
];

const cases = [
  { tag: "STRATÉGIE", title: "Réinventer le récit d’une structure engagée", year: "2025", color: "yellow" },
  { tag: "PERFORMANCE", title: "Rendre les indicateurs utiles au quotidien", year: "2024", color: "blue" },
  { tag: "COORDINATION", title: "Mettre en mouvement un écosystème", year: "2023", color: "ink" },
];

const steps = [
  ["01", "Écouter", "Comprendre le terrain, les enjeux et les signaux faibles."],
  ["02", "Clarifier", "Faire émerger l’essentiel et une direction commune."],
  ["03", "Structurer", "Installer le cadre, les priorités et les bons indicateurs."],
  ["04", "Déployer", "Passer de l’intention à l’impact, avec exigence."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { content } = usePortfolioContent();
  const iconMap = { chart: LineChart, target: Target, layers: Layers3 };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f3ee] text-[#111619]">
      <div className="bg-[#e9bb22] px-5 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#111619]">
        {content.hero.availability} · économie · gestion · stratégie
      </div>

      <header className="absolute inset-x-0 top-10 z-30 border-b border-white/15 text-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
          <a href="#top" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="flex h-9 w-9 items-center justify-center bg-[#e9bb22] text-sm font-black text-[#111619] transition-transform duration-200 group-hover:rotate-6">MD</span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.26em] sm:block">{content.identity.firstName}<br /><span className="font-normal tracking-[0.18em] text-white/60">{content.identity.name.replace(`${content.identity.firstName} `, "")}</span></span>
          </a>

          <nav className="hidden items-center gap-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 md:flex">
            <a className="transition-colors hover:text-[#e9bb22]" href="#expertise">Expertise</a>
            <a className="transition-colors hover:text-[#e9bb22]" href="#parcours">Parcours</a>
            <a className="transition-colors hover:text-[#e9bb22]" href="#contact">Contact</a>
          </nav>

          <button className="text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/15 bg-[#111619] px-5 py-6 md:hidden">
            <div className="flex flex-col gap-5 text-xs font-bold uppercase tracking-[0.2em] text-white/75">
              <a href="#expertise" onClick={closeMenu}>Expertise</a>
              <a href="#parcours" onClick={closeMenu}>Parcours</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative bg-[#111619] text-white">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute -right-28 top-28 h-96 w-96 rounded-full bg-[#85cce3]/10 blur-3xl" />
          <div className="relative mx-auto grid min-h-[710px] max-w-[1240px] items-end gap-16 px-5 pb-20 pt-44 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-24">
            <div className="max-w-3xl">
              <div className="mb-9 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#e9bb22]">
                <span className="h-px w-10 bg-[#e9bb22]" /> {content.hero.eyebrow}
              </div>
              <h1 className="max-w-3xl font-serif text-[clamp(3.4rem,7vw,6.8rem)] leading-[.91] tracking-[-.065em] text-[#f7f4ef]">
                {content.hero.title.split(content.hero.highlightedWord)[0]}<em className="font-light text-[#85cce3]">{content.hero.highlightedWord}</em>{content.hero.title.split(content.hero.highlightedWord)[1]}
              </h1>
              <p className="mt-9 max-w-xl text-base leading-7 text-white/60 md:text-lg md:leading-8">
                {content.hero.intro}
              </p>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <a href="#expertise" className="group inline-flex items-center gap-3 bg-[#e9bb22] px-6 py-4 text-[11px] font-black uppercase tracking-[0.17em] text-[#111619] transition-transform duration-200 hover:-translate-y-1 active:scale-[.98]">
                  Découvrir mon approche <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1" />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 px-3 py-4 text-[11px] font-bold uppercase tracking-[0.17em] text-white/70 transition-colors hover:text-white">
                  Prendre contact <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto">
              <div className="absolute -left-8 top-9 hidden h-32 w-32 border border-[#e9bb22]/40 sm:block" />
              <div className="relative overflow-hidden bg-[#f6f3ee] p-5 text-[#111619] shadow-2xl shadow-black/25 sm:p-7">
                <div className="absolute right-0 top-0 h-32 w-32 bg-[#85cce3]/80 mix-blend-multiply" />
                <div className="absolute right-5 top-16 z-0 h-52 w-32 overflow-hidden border-4 border-[#f6f3ee] bg-[#d9d4cb] shadow-xl sm:right-7 sm:h-56 sm:w-36">
                  <img src={content.identity.profileImage} alt={`Portrait de ${content.identity.name}`} className="h-full w-full object-cover object-top" />
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em]">Étude de profil</span>
                  <span className="flex h-8 w-8 items-center justify-center bg-[#111619] text-[10px] font-bold text-[#e9bb22]">01</span>
                </div>
                <div className="relative z-10 mt-24 flex max-w-[58%] items-end justify-between">
                  <div>
                    <p className="font-serif text-5xl tracking-[-.06em]">MD</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#111619]/55">Économie & gestion</p>
                  </div>
                  <div className="flex items-end gap-1 pb-1">
                    {[36, 52, 42, 78, 64, 93].map((height, index) => <span key={index} className={index === 5 ? "w-2 bg-[#e9bb22]" : "w-2 bg-[#111619]"} style={{ height }} />)}
                  </div>
                </div>
                <div className="mt-8 border-t border-[#111619]/15 pt-5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em]">
                    <span>Vision · Rigueur · Impact</span>
                    <CircleDot className="h-4 w-4 text-[#e9bb22]" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#e9bb22] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#111619] shadow-lg">
                Faire mieux,<br />faire juste.
              </div>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto grid max-w-[1240px] grid-cols-2 px-5 lg:grid-cols-4 lg:px-8">
              {content.metrics.map(({ value, label }, index) => (
                <div key={label} className={`border-white/10 px-0 py-6 ${index > 0 ? 'border-l pl-5 sm:pl-8' : ''} ${index > 1 ? 'hidden lg:block' : ''}`}>
                  <p className="font-serif text-3xl tracking-[-.04em] text-[#e9bb22]">{value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="expertise" className="mx-auto max-w-[1240px] px-5 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.26em] text-[#111619]/45"><span className="h-px w-8 bg-[#e9bb22]" /> {content.expertiseIntro.label}</div>
              <h2 className="max-w-sm whitespace-pre-line font-serif text-5xl leading-[.95] tracking-[-.055em] md:text-6xl">{content.expertiseIntro.title}</h2>
              <p className="mt-7 max-w-sm text-sm leading-7 text-[#111619]/60">{content.expertiseIntro.text}</p>
              <a href="#parcours" className="mt-9 inline-flex items-center gap-2 border-b border-[#111619] pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:border-[#e9bb22] hover:text-[#6b5710]">Voir le parcours <ArrowUpRight className="h-3.5 w-3.5" /></a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {content.expertise.map((item, index) => {
                const Icon = iconMap[item.icon] || iconMap.chart;
                const colorClass = item.accent === 'yellow' ? 'bg-[#e9bb22]' : item.accent === 'blue' ? 'bg-[#85cce3]' : 'bg-[#111619]';
                return <article key={`${item.title}-${index}`} className="group relative flex min-h-[290px] flex-col justify-between overflow-hidden bg-white p-7 shadow-[0_14px_45px_rgba(17,22,25,.06)] transition-transform duration-200 hover:-translate-y-2">
                  <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center ${colorClass} ${item.accent === 'black' ? 'text-white' : 'text-[#111619]'}`}><Icon className="h-5 w-5" /></span><span className="font-serif text-3xl text-[#111619]/15">{String(index + 1).padStart(2, '0')}</span></div>
                  <div><h3 className="max-w-[190px] font-serif text-2xl leading-[1.05] tracking-[-.035em]">{item.title}</h3><p className="mt-4 text-xs leading-6 text-[#111619]/55">{item.text}</p></div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#e9bb22] px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.22em] text-[#111619]">Précision dans l’analyse · exigence dans l’exécution · sens dans l’impact</section>

        <section id="parcours" className="bg-[#111619] px-5 py-24 text-white lg:py-32">
          <div className="mx-auto max-w-[1240px] lg:px-3">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.26em] text-[#85cce3]"><span className="h-px w-8 bg-[#85cce3]" /> Parcours</div><h2 className="max-w-xl font-serif text-5xl leading-[.95] tracking-[-.055em] md:text-6xl">Des expériences qui<br /><em className="font-light text-[#85cce3]">donnent du relief.</em></h2></div>
              <p className="max-w-xs text-sm leading-7 text-white/50">Chaque mission est une occasion de rendre les organisations plus lisibles, plus agiles et plus fortes.</p>
            </div>
            <div className="border-t border-white/15">
              {content.experiences.map(({ date, title, text }) => <div key={`${date}-${title}`} className="grid gap-5 border-b border-white/15 py-8 md:grid-cols-[.28fr_1fr_1fr] md:items-center md:gap-10"><div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#e9bb22]"><span className="h-2 w-2 rounded-full bg-[#e9bb22]" /> {date}</div><h3 className="font-serif text-2xl tracking-[-.03em] md:text-3xl">{title}</h3><p className="max-w-sm text-sm leading-6 text-white/50">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-24 lg:px-8 lg:py-32">
          <div className="mb-14 flex items-end justify-between"><div><div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.26em] text-[#111619]/45"><span className="h-px w-8 bg-[#e9bb22]" /> Sélection</div><h2 className="font-serif text-5xl tracking-[-.055em] md:text-6xl">Projets choisis</h2></div><span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-[#111619]/35 md:block">2023 — 2025</span></div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.projects.map((item, index) => <article key={`${item.title}-${index}`} className={`group relative min-h-[390px] overflow-hidden p-7 ${item.color === 'yellow' ? 'bg-[#e9bb22]' : item.color === 'blue' ? 'bg-[#85cce3]' : 'bg-[#d9d4cb]'}`}><div className="flex items-start justify-between"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111619]/60">{item.tag}</span><span className="text-[11px] font-bold text-[#111619]/55">0{index + 1}</span></div><div className="absolute inset-x-7 bottom-7"><div className="mb-8 h-px w-full bg-[#111619]/20" /><h3 className="max-w-[250px] font-serif text-3xl leading-[.98] tracking-[-.04em]">{item.title}</h3><div className="mt-6 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#111619]/55">{item.year}</span><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#111619]/30 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowUpRight className="h-4 w-4" /></span></div></div><div className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-full border-[22px] border-[#111619]/10 transition-transform duration-500 group-hover:scale-125" /></article>)}
          </div>
        </section>

        <section className="border-y border-[#111619]/10 bg-white px-5 py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.7fr_1.3fr] lg:px-3"><div><div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.26em] text-[#111619]/45"><span className="h-px w-8 bg-[#e9bb22]" /> Ma méthode</div><h2 className="max-w-sm font-serif text-5xl leading-[.95] tracking-[-.055em]">Simple dans la forme.<br /><em className="font-light">Exigeante sur le fond.</em></h2></div><div className="grid gap-0 border-t border-[#111619]/15 md:grid-cols-2">{steps.map(([num, title, text]) => <div key={num} className="border-b border-[#111619]/15 py-7 md:pr-10"><div className="mb-5 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e1b31c]">{num}</span><Check className="h-4 w-4 text-[#111619]/25" /></div><h3 className="font-serif text-2xl tracking-[-.03em]">{title}</h3><p className="mt-3 max-w-xs text-xs leading-6 text-[#111619]/55">{text}</p></div>)}</div></div>
        </section>

        <section id="contact" className="bg-[#85cce3] px-5 py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end lg:px-3"><div><div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.26em] text-[#111619]/55"><span className="h-px w-8 bg-[#111619]" /> {content.contact.label}</div><h2 className="max-w-2xl whitespace-pre-line font-serif text-6xl leading-[.9] tracking-[-.06em] md:text-8xl">{content.contact.title}</h2></div><div><p className="max-w-sm text-sm leading-7 text-[#111619]/70">{content.contact.text}</p><a href={`mailto:${content.contact.email}`} className="group mt-8 inline-flex items-center gap-3 bg-[#111619] px-6 py-4 text-[11px] font-black uppercase tracking-[0.17em] text-white transition-transform duration-200 hover:-translate-y-1 active:scale-[.98]">Écrire à {content.identity.firstName} <Mail className="h-4 w-4 text-[#e9bb22] transition-transform duration-200 group-hover:translate-x-1" /></a></div></div>
        </section>
      </main>

      <footer className="bg-[#111619] px-5 py-8 text-white lg:px-8"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center bg-[#e9bb22] text-[10px] font-black text-[#111619]">MD</span><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Merveille Danvide</span></div><div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35"><a href="#top" className="transition-colors hover:text-white">Haut de page</a><span>© 2026</span></div></div></footer>
    </div>
  );
}
