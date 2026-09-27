import { z } from "zod";

export const portfolioContentSchema = z.object({
  identity: z.object({
    name: z.string(),
    firstName: z.string(),
    role: z.string(),
    email: z.string(),
    location: z.string(),
    profileImage: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    highlightedWord: z.string(),
    intro: z.string(),
    availability: z.string(),
  }),
  metrics: z.array(z.object({ value: z.string(), label: z.string() })),
  expertiseIntro: z.object({
    label: z.string(),
    title: z.string(),
    text: z.string(),
  }),
  expertise: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
      icon: z.enum(["chart", "target", "layers"]),
      accent: z.enum(["yellow", "blue", "black"]),
    }),
  ),
  experiences: z.array(
    z.object({ date: z.string(), title: z.string(), text: z.string() }),
  ),
  projects: z.array(
    z.object({
      tag: z.string(),
      title: z.string(),
      year: z.string(),
      color: z.enum(["yellow", "blue", "ink"]),
    }),
  ),
  contact: z.object({
    label: z.string(),
    title: z.string(),
    text: z.string(),
    email: z.string(),
  }),
});

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  identity: {
    name: "Merveille Danvide",
    firstName: "Merveille",
    role: "Économie & gestion",
    email: "bonjour@merveille-danvide.fr",
    location: "France · Afrique de l’Ouest",
    profileImage: "/manus-storage/WhatsAppImage2026-09-26at23.47.00_3e977a09.jpeg",
  },
  hero: {
    eyebrow: "Portfolio 2026",
    title: "Piloter la performance avec lucidité.",
    highlightedWord: "performance",
    intro:
      "Je crée des passerelles entre vision stratégique, intelligence des données et qualité d’exécution pour faire progresser les organisations.",
    availability: "Disponible pour de nouvelles collaborations",
  },
  metrics: [
    { value: "05+", label: "années d’expérience" },
    { value: "24", label: "projets accompagnés" },
    { value: "03", label: "expertises clés" },
    { value: "100%", label: "engagement" },
  ],
  expertiseIntro: {
    label: "Mon expertise",
    title: "Une vision claire. Des résultats tangibles.",
    text: "À la croisée de l’économie, de la gestion et de la communication, j’aide les équipes à transformer la complexité en leviers d’action.",
  },
  expertise: [
    {
      title: "Pilotage de la performance",
      text: "Transformer les données en décisions lisibles, actionnables et alignées sur les priorités de l’organisation.",
      icon: "chart",
      accent: "yellow",
    },
    {
      title: "Stratégie & développement",
      text: "Structurer une vision, clarifier les arbitrages et faire avancer les projets avec méthode et précision.",
      icon: "target",
      accent: "blue",
    },
    {
      title: "Gestion de projet",
      text: "Coordonner les parties prenantes, sécuriser les délais et donner un rythme durable à l’exécution.",
      icon: "layers",
      accent: "black",
    },
  ],
  experiences: [
    {
      date: "2024 — Aujourd’hui",
      title: "Consultante stratégie & performance",
      text: "Accompagnement de directions dans la structuration de leurs priorités, indicateurs et plans d’action.",
    },
    {
      date: "2022 — 2024",
      title: "Cheffe de projet · transformation",
      text: "Coordination de projets transverses, animation des parties prenantes et suivi opérationnel.",
    },
    {
      date: "2020 — 2022",
      title: "Analyste économie & gestion",
      text: "Analyse de données, préparation de recommandations et appui à la décision.",
    },
  ],
  projects: [
    {
      tag: "STRATÉGIE",
      title: "Réinventer le récit d’une structure engagée",
      year: "2025",
      color: "yellow",
    },
    {
      tag: "PERFORMANCE",
      title: "Rendre les indicateurs utiles au quotidien",
      year: "2024",
      color: "blue",
    },
    {
      tag: "COORDINATION",
      title: "Mettre en mouvement un écosystème",
      year: "2023",
      color: "ink",
    },
  ],
  contact: {
    label: "Parlons-nous",
    title: "Une idée. Un enjeu. Un impact.",
    text: "Vous cherchez un regard structurant pour un projet stratégique, une transformation ou un nouveau cap ? Échangeons simplement.",
    email: "bonjour@merveille-danvide.fr",
  },
};
