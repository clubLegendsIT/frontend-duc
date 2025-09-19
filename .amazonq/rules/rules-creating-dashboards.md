**Objectif :** Créer une interface d'administration responsive, moderne et sécurisée pour gérer le contenu du site "Pizza Le Duc". L'interface doit comporter une page de connexion et deux dashboards distincts avec des niveaux d'accès différents.

---

### **Partie 1 : Philosophie de Conception et Qualité du Code**

**1.1. Direction Artistique (Exigence Clé) :**
*   **Style :** Le design doit être **professionnel, mature et épuré**. Évite tout style enfantin ("childish") ou trop chargé. L'objectif est une interface utilisateur qui inspire confiance, efficacité et créativité.
*   **Inspiration :** Pense à des dashboards modernes comme ceux de Vercel, Stripe, ou des thèmes premium minimalistes. L'interface doit être intuitive, avec une utilisation intelligente de l'espace blanc, des contrastes clairs et une hiérarchie visuelle évidente.
*   **Créativité :** Bien que l'interface doive être fonctionnelle, j'attends une touche de créativité dans la présentation des données, les micro-interactions (hover, transitions) et l'agencement des éléments pour rendre l'expérience utilisateur agréable.

**1.2. Principes de Qualité du Code (Non Négociable) :**
*   Le code doit être **propre, lisible et maintenable**. Il doit impérativement respecter les principes suivants :
    *   **SoC (Separation of Concerns) :** Sépare clairement la logique (hooks), la récupération des données (services API), l'état (Context) et la présentation (composants UI).
    *   **DRY (Don't Repeat Yourself) :** Crée des composants réutilisables (par ex: un composant `DataTable` générique, un `FormModal`) pour éviter la duplication de code entre les différentes pages CRUD.
    *   **KISS (Keep It Simple, Stupid) :** Favorise les solutions simples et directes. Évite la sur-ingénierie.
    *   **YAGNI (You Ain't Gonna Need It) :** Implémente uniquement les fonctionnalités demandées. N'ajoute pas de code ou de complexité en prévision de besoins futurs hypothétiques.

---

### **Partie 2 : Conception Générale et Charte Graphique**

**2.1. Charte Graphique :**
*   **Source d'Inspiration :** Le site public existant `https://www.pizzapodensac.com/`.
*   **Couleurs Primaires :**
    *   **Vert Foncé (pour les headers, boutons principaux) :** `~#006400`
    *   **Rouge Vif (pour les accents, actions destructrices) :** `~#FF0000`
    *   **Blanc / Blanc Cassé :** Pour les fonds et le texte sur fond foncé.
    *   **Palette de Gris :** Des gris neutres et modernes pour le texte, les bordures et les arrière-plans secondaires.
*   **Typographie :** Utilise une police sans-serif lisible et moderne, comme Inter ou Manrope.

**2.2. Bibliothèque de Composants :**
*   Utilise **shadcn/ui** pour tous les composants de base (Buttons, Cards, Inputs, Tables, Toasts, etc.). Configure le thème pour qu'il corresponde à notre charte graphique.

**2.3. Navigation (Exigence Clé) :**
*   **PAS de barre latérale (sidebar).**
*   **Sur Desktop :** Une barre de navigation supérieure (`Navbar`) fixe, contenant le logo/titre, des onglets de navigation et les informations de l'utilisateur avec un bouton de déconnexion.
*   **Sur Mobile :** La `Navbar` supérieure est simplifiée. La navigation principale se fait via une **barre de navigation inférieure (`MobileBottomNav`)** fixe, avec des icônes et des labels.

---

### **Partie 3 : Structure de l'Application et Authentification**

**3.1. Structure des Fichiers (Next.js App Router) :**
*   Crée une structure de "Route Groups" pour séparer les layouts :
    *   `/app/(auth)/login/page.tsx`
    *   `/app/(admin)/admin-dashboard/...`
    *   `/app/(superadmin)/superadmin-dashboard/...`

**3.2. Gestion de l'Authentification :**
*   Implémente un **`AuthContext`** en React pour gérer l'état de l'authentification (token, données utilisateur) de manière globale.
*   Le token JWT doit être stocké de manière sécurisée (par ex: `localStorage` ou cookie httpOnly si possible).
*   Crée un client **`axios` centralisé** qui attache automatiquement le token JWT à l'en-tête `Authorization` de chaque requête.

---

### **Partie 4 : Interfaces à Construire**

**4.1. Page de Connexion (`/login`)**
*   Une interface simple, centrée et professionnelle.
*   Utilise le composant `<Card>` de shadcn/ui.
*   Champs pour l'email/mot de passe et un bouton "Se connecter".
*   **Logique :** Lors de la soumission, appelle l'endpoint `POST /auth/login`. Si le login réussit, décode le token JWT pour connaître le rôle et **redirige vers le dashboard approprié** (`/admin-dashboard` ou `/superadmin-dashboard`). Affiche un toast de succès ou d'erreur.

**4.2. Dashboard Admin (`/admin-dashboard`)**
*   **Accès :** Protégé par un `RoleProtectedRoute`. Accessible aux rôles **`Admin` ET `SuperAdmin`**.
*   **Layout :** Utilise la `Navbar` et la `MobileBottomNav` avec les onglets de navigation spécifiques à l'Admin.
*   **Pages et Fonctionnalités (CRUD complet pour chaque) :**
    1.  **Gestion de l'Entreprise (`/business`) :** Formulaire pour voir et mettre à jour les infos de l'entreprise (`GET /business`, `PATCH /business/:id`).
    2.  **Gestion des Événements (`/events`) :** Affichage en table, avec modales pour "Ajouter", "Modifier", "Supprimer".
    3.  **Gestion des Catégories (`/categories`) :** Interface CRUD complète.
    4.  **Gestion des Articles (`/items`) :** Interface CRUD complète.

**4.3. Dashboard SuperAdmin (`/superadmin-dashboard`)**
*   **Accès :** Protégé par un `RoleProtectedRoute`. Accessible **UNIQUEMENT** au rôle `SuperAdmin`.
*   **Layout :** Utilise les **mêmes composants de navigation** que l'Admin, mais avec des onglets supplémentaires.
*   **Pages et Fonctionnalités :**
    1.  **Accès Complet au Dashboard Admin :** Le SuperAdmin peut faire tout ce que l'Admin peut faire. Les composants de page (formulaires, tables) doivent être **partagés** entre les deux dashboards (principe DRY).
    2.  **Fonctionnalité Exclusive - Gestion des Utilisateurs (`/users`) :** Interface CRUD complète pour gérer les utilisateurs.

---

### **Résumé des Exigences Techniques**

*   **Framework :** Next.js 14+ (App Router) 15.5.3
*   **Styling :** Tailwind CSS
*   **Composants UI :** shadcn/ui
*   **Requêtes API :** Axios
*   **Gestion d'état global :** React Context
*   **Code :** TypeScript, propre, respectant les principes SoC, DRY, KISS, YAGNI.
*   **Design :** Professionnel, mature, créatif et responsive.