import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, Check, Eye, FileText, Globe2, LayoutDashboard, Minus, Pencil, Plus, RotateCcw, Save, Settings2, Sparkles, Trash2, TrendingUp } from "lucide-react";
import { DEFAULT_PORTFOLIO_CONTENT, PortfolioContent, savePortfolioContent, usePortfolioContent } from "@/lib/portfolioContent";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Tab = "Vue d’ensemble" | "Contenu" | "Projets" | "Réglages";

const activity = [
  ["01", "Profil mis à jour", "Il y a 2 heures", "yellow"],
  ["02", "Projet publié", "Hier à 16:40", "blue"],
  ["03", "Nouvelle visite", "Hier à 09:12", "ink"],
];

function Field({ label, value, onChange, multiline = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string }) {
  const className = "mt-2 w-full border border-[#111619]/15 bg-[#f6f3ee] p-3 text-sm outline-none transition-colors placeholder:text-[#111619]/25 focus:border-[#e1b31c]";
  return <label className="block"><span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#111619]/45">{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${className} min-h-[90px] resize-y leading-6`} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />}</label>;
}

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-end justify-between gap-4 border-b border-[#111619]/10 pb-5"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111619]/40">{eyebrow}</p><h2 className="mt-2 font-serif text-3xl tracking-[-.04em]">{title}</h2></div>{action}</div>;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("Vue d’ensemble");
  const { content, setContent } = usePortfolioContent();
  const [saved, setSaved] = useState(false);
  const saveMutation = trpc.portfolio.save.useMutation();
  const resetMutation = trpc.portfolio.reset.useMutation();

  const patch = <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => setContent((current) => ({ ...current, [key]: value }));
  const saveChanges = async () => {
    try {
      await saveMutation.mutateAsync(content);
      savePortfolioContent(content);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      toast.error("Échec de la sauvegarde", {
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
      });
    }
  };
  const restoreDefaults = async () => {
    if (!window.confirm("Réinitialiser tous les contenus avec les valeurs de départ ?")) return;
    try {
      await resetMutation.mutateAsync();
      savePortfolioContent(DEFAULT_PORTFOLIO_CONTENT);
      setContent(DEFAULT_PORTFOLIO_CONTENT);
      toast.success("Le contenu par défaut a été restauré.");
    } catch (error) {
      toast.error("Échec de la réinitialisation", {
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
      });
    }
  };

  return <DashboardLayout>
    <div className="min-h-[calc(100vh-2rem)] bg-[#f6f3ee] -m-4 p-5 text-[#111619] lg:p-8">
      <header className="mx-auto flex max-w-[1380px] flex-col justify-between gap-5 border-b border-[#111619]/10 pb-7 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#111619]/45"><LayoutDashboard className="h-3.5 w-3.5 text-[#e1b31c]" /> Studio portfolio</div><h1 className="font-serif text-5xl tracking-[-.055em]">Bonjour, {content.identity.firstName}.</h1><p className="mt-2 text-sm text-[#111619]/55">Modifiez chaque contenu de votre site depuis cet espace.</p></div><div className="flex flex-wrap items-center gap-3"><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#111619]/15 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:border-[#111619]/40"><Eye className="h-3.5 w-3.5" /> Voir le site</a><Button onClick={saveChanges} disabled={saveMutation.isPending} className="h-auto rounded-none bg-[#111619] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white hover:bg-[#263339]">{saved ? <Check className="h-3.5 w-3.5 text-[#e9bb22]" /> : <Save className="h-3.5 w-3.5 text-[#e9bb22]" />} {saveMutation.isPending ? "Enregistrement…" : saved ? "Sauvegardé" : "Sauvegarder"}</Button></div></header>

      <div className="mx-auto mt-7 max-w-[1380px]"><div className="mb-8 flex gap-6 overflow-x-auto border-b border-[#111619]/10 text-[10px] font-black uppercase tracking-[0.17em]">{(["Vue d’ensemble", "Contenu", "Projets", "Réglages"] as Tab[]).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 pb-4 transition-colors ${activeTab === tab ? "border-[#e1b31c] text-[#111619]" : "border-transparent text-[#111619]/35 hover:text-[#111619]"}`}>{tab}</button>)}</div>

      {activeTab === "Vue d’ensemble" && <Overview content={content} onContent={() => setActiveTab("Contenu")} onProjects={() => setActiveTab("Projets")} />}
      {activeTab === "Contenu" && <ContentEditor content={content} patch={patch} />}
      {activeTab === "Projets" && <ProjectsEditor projects={content.projects} onChange={(projects) => patch("projects", projects)} />}
      {activeTab === "Réglages" && <section className="max-w-3xl bg-white p-6 md:p-8"><SectionTitle eyebrow="Préférences du studio" title="Réglages du portfolio" action={<button onClick={restoreDefaults} disabled={resetMutation.isPending} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#111619]/45 hover:text-[#111619] disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" /> {resetMutation.isPending ? "Réinitialisation…" : "Réinitialiser"}</button>} /><div className="mt-8 space-y-5">{["Recevoir les notifications de contact", "Afficher la disponibilité sur le site", "Activer les statistiques de visite"].map((setting, index) => <div key={setting} className="flex items-center justify-between border-b border-[#111619]/10 pb-5"><div><p className="text-sm font-bold">{setting}</p><p className="mt-1 text-xs text-[#111619]/45">Cette option s’applique immédiatement à la vitrine.</p></div><button className={`relative h-6 w-11 rounded-full transition-colors ${index !== 1 ? "bg-[#111619]" : "bg-[#111619]/15"}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${index !== 1 ? "translate-x-6 bg-[#e9bb22]" : "translate-x-1 bg-white"}`} /></button></div>)}</div></section>}
      </div>
    </div>
  </DashboardLayout>;
}

function Overview({ content, onContent, onProjects }: { content: PortfolioContent; onContent: () => void; onProjects: () => void }) {
  const cards = [["Vues du portfolio", "2 486", "+18,4%", Eye, "yellow"], ["Projets publiés", String(content.projects.length), "+03 ce mois", FileText, "blue"], ["Taux de contact", "8,7%", "+2,1 pts", TrendingUp, "ink"], ["Disponibilité", content.hero.availability, "Pour 2026", Globe2, "cream"]] as const;
  return <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, delta, Icon, tone]) => <div key={label} className="group bg-white p-5 shadow-[0_12px_35px_rgba(17,22,25,.05)]"><div className="flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center ${tone === "yellow" ? "bg-[#e9bb22]" : tone === "blue" ? "bg-[#85cce3]" : tone === "ink" ? "bg-[#111619] text-white" : "bg-[#f0ece6]"}`}><Icon className="h-4 w-4" /></span><ArrowUpRight className="h-4 w-4 text-[#111619]/20 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><p className="mt-8 text-[10px] font-black uppercase tracking-[0.15em] text-[#111619]/40">{label}</p><div className="mt-2 flex items-end justify-between gap-2"><p className="font-serif text-3xl tracking-[-.04em]">{value}</p><span className="text-right text-[10px] font-bold text-[#6d8c55]">{delta}</span></div></div>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.8fr]"><section className="bg-[#111619] p-6 text-white md:p-8"><div className="flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#85cce3]"><BarChart3 className="h-3.5 w-3.5" /> Trafic du portfolio</div><p className="font-serif text-4xl tracking-[-.05em]">2 486 <span className="font-sans text-sm font-normal tracking-normal text-white/35">visites</span></p></div><Badge className="rounded-none border-0 bg-[#e9bb22] text-[9px] font-black uppercase tracking-[0.12em] text-[#111619]">30 derniers jours</Badge></div><div className="mt-10 flex h-40 items-end gap-2 border-b border-white/15 sm:gap-3">{[30,44,39,58,51,63,54,75,67,88,72,96,81,100,91,112,105,122,118,134,128,145,138,158,150,168,162,182,174,196].map((height, index) => <div key={index} className="group relative flex-1"><div style={{ height }} className={`w-full transition-all duration-200 group-hover:bg-[#e9bb22] ${index > 22 ? "bg-[#85cce3]" : "bg-white/25"}`} /></div>)}</div><div className="mt-4 flex justify-between text-[9px] font-bold uppercase tracking-[0.16em] text-white/35"><span>01 sept.</span><span>26 sept.</span></div></section><section className="bg-white p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111619]/40">Activité récente</p><p className="mt-2 font-serif text-2xl tracking-[-.04em]">Tout est à jour</p></div><span className="flex h-9 w-9 items-center justify-center bg-[#e9bb22]"><Sparkles className="h-4 w-4" /></span></div><div className="mt-8 space-y-5">{activity.map(([num, title, date, color]) => <div key={num} className="flex items-start gap-3"><span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center text-[9px] font-black ${color === "yellow" ? "bg-[#e9bb22]" : color === "blue" ? "bg-[#85cce3]" : "bg-[#111619] text-white"}`}>{num}</span><div><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[10px] text-[#111619]/40">{date}</p></div></div>)}</div><button onClick={onContent} className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#111619]/60 hover:text-[#111619]">Gérer le contenu <ArrowUpRight className="h-3.5 w-3.5" /></button></section></div><div className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><section className="bg-[#e9bb22] p-6 md:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111619]/55">À la une</p><h2 className="mt-4 max-w-sm font-serif text-4xl leading-[.95] tracking-[-.05em]">{content.hero.title}</h2></div><Pencil className="h-5 w-5" /></div><button onClick={onContent} className="mt-8 inline-flex items-center gap-2 border-b border-[#111619] pb-2 text-[10px] font-black uppercase tracking-[0.15em]">Modifier le contenu <ArrowUpRight className="h-3.5 w-3.5" /></button></section><section className="bg-white p-6 md:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111619]/40">Accès rapide</p><h2 className="mt-2 font-serif text-3xl tracking-[-.04em]">Que souhaitez-vous faire ?</h2></div><Settings2 className="h-5 w-5 text-[#111619]/30" /></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><button onClick={onContent} className="flex min-h-[100px] flex-col justify-between border border-[#111619]/10 p-4 text-left transition-colors hover:border-[#e1b31c]"><Pencil className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Modifier toute la page</span></button><button onClick={onProjects} className="flex min-h-[100px] flex-col justify-between border border-[#111619]/10 p-4 text-left transition-colors hover:border-[#85cce3]"><Plus className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Ajouter un projet</span></button><a href="/" target="_blank" rel="noreferrer" className="flex min-h-[100px] flex-col justify-between border border-[#111619]/10 p-4 text-left transition-colors hover:border-[#111619]"><Eye className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Prévisualiser</span></a></div></section></div></>;
}

function ContentEditor({ content, patch }: { content: PortfolioContent; patch: <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => void }) {
  const updateIdentity = (key: keyof PortfolioContent["identity"], value: string) => patch("identity", { ...content.identity, [key]: value });
  const updateHero = (key: keyof PortfolioContent["hero"], value: string) => patch("hero", { ...content.hero, [key]: value });
  const updateIntro = (key: keyof PortfolioContent["expertiseIntro"], value: string) => patch("expertiseIntro", { ...content.expertiseIntro, [key]: value });
  const updateContact = (key: keyof PortfolioContent["contact"], value: string) => patch("contact", { ...content.contact, [key]: value });
  const updateMetric = (index: number, key: "value" | "label", value: string) => patch("metrics", content.metrics.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addMetric = () => patch("metrics", [...content.metrics, { value: "00", label: "Nouvel indicateur" }]);
  const removeMetric = (index: number) => patch("metrics", content.metrics.filter((_, itemIndex) => itemIndex !== index));
  const updateExpertise = (index: number, key: string, value: string) => patch("expertise", content.expertise.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) as PortfolioContent["expertise"]);
  const addExpertise = () => patch("expertise", [...content.expertise, { title: "Nouvelle expertise", text: "Décrivez cette compétence ou ce service.", icon: "chart", accent: "yellow" }]);
  const removeExpertise = (index: number) => patch("expertise", content.expertise.filter((_, itemIndex) => itemIndex !== index));
  const updateExperience = (index: number, key: string, value: string) => patch("experiences", content.experiences.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) as PortfolioContent["experiences"]);
  const addExperience = () => patch("experiences", [...content.experiences, { date: "2026", title: "Nouvelle expérience", text: "Décrivez cette expérience." }]);
  const removeExperience = (index: number) => patch("experiences", content.experiences.filter((_, itemIndex) => itemIndex !== index));

  return <div className="space-y-5"><section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Identité" title="Informations personnelles" /><div className="mt-7 grid gap-5 md:grid-cols-2"><Field label="Nom complet" value={content.identity.name} onChange={(value) => updateIdentity("name", value)} /><Field label="Prénom affiché" value={content.identity.firstName} onChange={(value) => updateIdentity("firstName", value)} /><Field label="Domaine / fonction" value={content.identity.role} onChange={(value) => updateIdentity("role", value)} /><Field label="Lieu" value={content.identity.location} onChange={(value) => updateIdentity("location", value)} /><Field label="Email public" value={content.identity.email} onChange={(value) => updateIdentity("email", value)} /><Field label="URL de la photo" value={content.identity.profileImage} onChange={(value) => updateIdentity("profileImage", value)} placeholder="https://… ou /manus-storage/…" /></div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Accueil" title="Hero de la page d’accueil" /><div className="mt-7 grid gap-5"><Field label="Petit label" value={content.hero.eyebrow} onChange={(value) => updateHero("eyebrow", value)} /><Field label="Titre principal" value={content.hero.title} onChange={(value) => updateHero("title", value)} multiline /><Field label="Mot à mettre en couleur" value={content.hero.highlightedWord} onChange={(value) => updateHero("highlightedWord", value)} /><Field label="Introduction" value={content.hero.intro} onChange={(value) => updateHero("intro", value)} multiline /><Field label="Disponibilité" value={content.hero.availability} onChange={(value) => updateHero("availability", value)} /></div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Chiffres clés" title="Indicateurs affichés" action={<Button onClick={addMetric} className="h-auto rounded-none bg-[#e9bb22] px-3 py-2 text-[10px] font-black uppercase text-[#111619] hover:bg-[#f0c932]"><Plus className="h-3.5 w-3.5" /> Ajouter</Button>} /><div className="mt-7 grid gap-4 md:grid-cols-2">{content.metrics.map((metric, index) => <div key={`${metric.label}-${index}`} className="relative border border-[#111619]/10 p-4"><button onClick={() => removeMetric(index)} className="absolute right-3 top-3 text-[#111619]/25 hover:text-red-600" aria-label="Supprimer cet indicateur"><Trash2 className="h-4 w-4" /></button><div className="grid gap-3 pr-6"><Field label="Valeur" value={metric.value} onChange={(value) => updateMetric(index, "value", value)} /><Field label="Libellé" value={metric.label} onChange={(value) => updateMetric(index, "label", value)} /></div></div>)}</div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Expertises" title="Compétences & services" action={<Button onClick={addExpertise} className="h-auto rounded-none bg-[#85cce3] px-3 py-2 text-[10px] font-black uppercase text-[#111619] hover:bg-[#9ed9e9]"><Plus className="h-3.5 w-3.5" /> Ajouter</Button>} /><div className="mt-7 space-y-4">{content.expertise.map((item, index) => <div key={`${item.title}-${index}`} className="relative border border-[#111619]/10 p-5"><button onClick={() => removeExpertise(index)} className="absolute right-3 top-3 text-[#111619]/25 hover:text-red-600" aria-label="Supprimer cette expertise"><Trash2 className="h-4 w-4" /></button><div className="grid gap-4 pr-6 md:grid-cols-2"><Field label="Titre" value={item.title} onChange={(value) => updateExpertise(index, "title", value)} /><Field label="Icône (chart, target, layers)" value={item.icon} onChange={(value) => updateExpertise(index, "icon", value)} /><Field label="Description" value={item.text} onChange={(value) => updateExpertise(index, "text", value)} multiline /><Field label="Couleur (yellow, blue, black)" value={item.accent} onChange={(value) => updateExpertise(index, "accent", value)} /></div></div>)}</div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Section expertise" title="Introduction de la section" /><div className="mt-7 grid gap-5"><Field label="Label" value={content.expertiseIntro.label} onChange={(value) => updateIntro("label", value)} /><Field label="Titre" value={content.expertiseIntro.title} onChange={(value) => updateIntro("title", value)} multiline /><Field label="Texte" value={content.expertiseIntro.text} onChange={(value) => updateIntro("text", value)} multiline /></div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Parcours" title="Expériences professionnelles" action={<Button onClick={addExperience} className="h-auto rounded-none bg-[#111619] px-3 py-2 text-[10px] font-black uppercase text-white hover:bg-[#263339]"><Plus className="h-3.5 w-3.5 text-[#e9bb22]" /> Ajouter</Button>} /><div className="mt-7 space-y-4">{content.experiences.map((item, index) => <div key={`${item.title}-${index}`} className="relative border border-[#111619]/10 p-5"><button onClick={() => removeExperience(index)} className="absolute right-3 top-3 text-[#111619]/25 hover:text-red-600" aria-label="Supprimer cette expérience"><Trash2 className="h-4 w-4" /></button><div className="grid gap-4 pr-6"><Field label="Période" value={item.date} onChange={(value) => updateExperience(index, "date", value)} /><Field label="Poste" value={item.title} onChange={(value) => updateExperience(index, "title", value)} /><Field label="Description" value={item.text} onChange={(value) => updateExperience(index, "text", value)} multiline /></div></div>)}</div></section>

    <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Contact" title="Bloc de contact" /><div className="mt-7 grid gap-5"><Field label="Label" value={content.contact.label} onChange={(value) => updateContact("label", value)} /><Field label="Titre" value={content.contact.title} onChange={(value) => updateContact("title", value)} multiline /><Field label="Texte" value={content.contact.text} onChange={(value) => updateContact("text", value)} multiline /><Field label="Email de contact" value={content.contact.email} onChange={(value) => updateContact("email", value)} /></div></section></div>;
}

function ProjectsEditor({ projects, onChange }: { projects: PortfolioContent["projects"]; onChange: (projects: PortfolioContent["projects"]) => void }) {
  const addProject = () => onChange([...projects, { tag: "NOUVEAU", title: "Nouveau projet", year: "2026", color: "yellow" }]);
  const update = (index: number, key: string, value: string) => onChange(projects.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) as PortfolioContent["projects"]);
  return <section className="bg-white p-6 md:p-8"><SectionTitle eyebrow="Bibliothèque de projets" title="Études de cas" action={<Button onClick={addProject} className="h-auto rounded-none bg-[#e9bb22] px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#111619] hover:bg-[#f0c932]"><Plus className="h-3.5 w-3.5" /> Nouveau projet</Button>} /><div className="mt-8 space-y-4">{projects.map((project, index) => <div key={`${project.title}-${index}`} className="relative border border-[#111619]/10 p-5"><button onClick={() => onChange(projects.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-3 top-3 text-[#111619]/25 hover:text-red-600" aria-label="Supprimer ce projet"><Trash2 className="h-4 w-4" /></button><div className="grid gap-4 pr-6 md:grid-cols-2"><Field label="Catégorie" value={project.tag} onChange={(value) => update(index, "tag", value)} /><Field label="Année" value={project.year} onChange={(value) => update(index, "year", value)} /><Field label="Titre du projet" value={project.title} onChange={(value) => update(index, "title", value)} multiline /><Field label="Couleur (yellow, blue, ink)" value={project.color} onChange={(value) => update(index, "color", value)} /></div></div>)}</div></section>;
}
