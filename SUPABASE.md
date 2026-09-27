# Configuration de Supabase

Les contenus modifiables du portfolio (identité, accueil, expertises, parcours,
projets et contact) sont enregistrés dans la table `portfolio_content`. La
vitrine les charge depuis Supabase et le bouton **Sauvegarder** de l’espace
d’administration les met à jour.

## Mise en place

1. Créez un projet dans [Supabase](https://supabase.com/).
2. Dans **SQL Editor**, exécutez le contenu de
   `supabase/migrations/20260927000000_portfolio_content.sql`.
3. Dans **Project Settings → API**, copiez l’URL du projet et la clé
   `service_role` (ou la clé secrète équivalente).
4. Pour Netlify, importez le dépôt et laissez les paramètres de
   `netlify.toml` définir la commande de build (`pnpm build`), le dossier publié
   (`dist/public`) et les fonctions (`netlify/functions`). Ajoutez
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` et `JWT_SECRET`
   dans **Site configuration → Environment variables**, avec le contexte
   **Production**. `JWT_SECRET` doit contenir au moins 32 octets aléatoires et
   sert à signer la session admin. Ne préfixez pas les secrets par `VITE_`.
   Pour un poste local, copiez `.env.example` vers `.env`, renseignez les
   valeurs et redémarrez le serveur.
5. Après le déploiement, ouvrez `/admin` ou `/studio`, saisissez le mot de passe administrateur,
   modifiez un contenu puis cliquez sur **Sauvegarder**.

La clé `service_role` donne un accès privilégié : elle doit rester côté serveur,
ne jamais être préfixée par `VITE_`, et ne doit pas être publiée dans le dépôt.
Le mot de passe et `JWT_SECRET` doivent également rester secrets et hors du
dépôt. Après cinq essais erronés depuis une même adresse IP, la connexion est
bloquée pendant 15 minutes. La session admin est protégée par un cookie HTTP
only et expire après huit heures. L’accès d’administration repose sur cette
session par mot de passe ; les anciens comptes OAuth n’accordent aucun accès
administrateur.
La table n’accorde pas d’accès direct aux rôles `anon` et `authenticated` ;
les lectures passent par le serveur et les écritures exigent une session
administrateur.

La base est créée lors de la configuration Supabase ; l’application ne peut pas
créer automatiquement un projet Supabase ni définir ses clés à votre place.
