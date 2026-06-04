# MediLaboApp

Application médicale basée sur une architecture **microservices ASP.NET Core** pour aider les médecins de l'Abernathy Clinic à identifier les patients à risque de diabète de type 2.

---

## 🏗️ Architecture

```
                        ┌─────────────────┐
                        │   Gateway API   │
                        │    (Ocelot)     │
                        └────────┬────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼──────┐   ┌──────────▼───────┐   ┌─────────▼────────┐
│ PatientService │   │   NoteService    │   │DiabetesRiskService│
│  (SQL Server)  │   │   (MongoDB)      │   │   (calcul risque) │
└────────────────┘   └──────────────────┘   └──────────────────┘
          │
┌─────────▼──────┐
│  AuthService   │
│(ASP.NET Identity│
└────────────────┘
```

---

## 🚀 Microservices

### PatientService ✅ Sprint 1
Gestion des données démographiques des patients (CRUD).
- **Base de données** : SQL Server (normalisée 3NF)
- **Port** : 5001

### NoteService 🔄 Sprint 2
Gestion des notes/comptes rendus de visites médicales.
- **Base de données** : MongoDB
- **Port** : 5002

### AuthService 🔄 Sprint 2
Authentification et autorisation avec ASP.NET Core Identity.
- **Base de données** : SQL Server
- **Port** : 5003

### DiabetesRiskService 🔄 Sprint 3
Génération de rapports de risque de diabète de type 2 basés sur les données patient et les notes médicales.
- **Port** : 5004

### Gateway (Ocelot) 🔄 Sprint 2
Point d'entrée unique pour tous les microservices.
- **Port** : 5000

---

## 📋 Sprints

### Sprint 1 — Données patients
- [x] CRUD patients (données démographiques)
- [x] Base SQL Server normalisée 3NF
- [x] Dockerisation du service

### Sprint 2 — Notes médicales & Sécurité
- [ ] CRUD notes de visite (NoteService - MongoDB)
- [ ] Authentification avec ASP.NET Core Identity
- [ ] Gateway Ocelot
- [ ] Sécurisation des endpoints

### Sprint 3 — Rapport de risque
- [ ] Algorithme de calcul du risque diabète
- [ ] DiabetesRiskService
- [ ] Tests d'intégration

---

## 🛠️ Lancement avec Docker

```bash
docker-compose up --build
```

---

## 🔐 Sécurité

- Authentification via **ASP.NET Core Identity**
- Tokens **JWT** pour les échanges entre services
- Toutes les routes sensibles protégées par `[Authorize]`

---

## 🌿 Green Code — Bonnes pratiques appliquées au projet

Dans le cadre de la politique de protection de l'environnement du client, voici les actions mises en place et recommandées pour réduire l'empreinte carbone de l'application.

### ✅ Actions appliquées dans le code

#### 1. Programmation asynchrone systématique
Tous les appels I/O (base de données, HTTP) utilisent `async/await` pour éviter le gaspillage de threads CPU.
```csharp
// ✅ Bon
public async Task<PatientDto?> GetByIdAsync(int id) { ... }

// ❌ À éviter
public PatientDto? GetById(int id) { ... }
```

#### 2. Requêtes SQL ciblées (pas de SELECT *)
Utilisation de projections LINQ pour ne charger que les données nécessaires, réduisant les transferts réseau et la charge CPU.
```csharp
// ✅ Projection ciblée
return await _context.Patients
    .Select(p => new PatientDto { Id = p.Id, FirstName = p.FirstName })
    .ToListAsync();
```

#### 3. Bases de données normalisées (3NF)
La normalisation évite la redondance des données, ce qui réduit le volume de stockage et les I/O disque.

#### 4. Images Docker légères (multi-stage build)
Utilisation de builds multi-étapes pour produire des images Docker minimales (`mcr.microsoft.com/dotnet/aspnet` en runtime vs SDK au build), réduisant la taille des images et donc la bande passante de déploiement.

#### 5. Injection de dépendances avec `AddScoped`
Réutilisation des instances sur la durée d'une requête HTTP plutôt que de recréer des objets inutilement (`AddTransient`).

---

### 📋 Actions recommandées

#### Infrastructure
- **Scale-to-zero** : Couper les microservices non sollicités en dehors des heures de bureau (ex: environnements de dev/staging).
- **Healthchecks** : Déjà mis en place sur SQL Server dans le `docker-compose.yml` — évite les redémarrages inutiles.
- **Mutualisation des ressources** : Un seul réseau Docker bridge partagé entre tous les services.

#### Code & API
- **Compression HTTP** : Activer le middleware `ResponseCompression` dans ASP.NET Core pour réduire la taille des réponses JSON.
  ```csharp
  builder.Services.AddResponseCompression(options => {
      options.EnableForHttps = true;
  });
  ```
- **Mise en cache** : Utiliser `IMemoryCache` pour les données peu changeantes (ex: listes de référence).
- **Pagination** : Implémenter la pagination sur tous les endpoints `GET` de liste pour limiter le volume de données transférées.
- **Éviter le over-fetching** : Ne jamais exposer plus de champs que nécessaire dans les DTOs.

#### CI/CD
- **Builds conditionnels** : Configurer GitHub Actions pour ne déclencher les builds/tests que sur les fichiers réellement modifiés.
- **Cache des dépendances NuGet** : Utiliser le cache dans les pipelines pour éviter de re-télécharger les packages à chaque build.

#### Monitoring
- **Mesurer l'impact** : Utiliser des outils comme [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) pour suivre la consommation réelle de l'infrastructure.
- **Alertes sur la consommation** : Mettre en place des alertes si un service consomme anormalement plus de CPU/mémoire que d'habitude.

#### Bonnes pratiques d'équipe
- Préférer les algorithmes à faible complexité (O(n) vs O(n²)) — notamment pour l'algorithme de calcul du risque diabète.
- Éviter les dépendances inutiles dans les projets `.csproj`.
- Revues de code orientées performance et sobriété numérique.

---

### 📚 Ressources Green Code
- [Green Software Foundation](https://greensoftware.foundation/)
- [Principles of Green Software Engineering](https://principles.green/)
- [Cloud Carbon Footprint (outil open source)](https://www.cloudcarbonfootprint.org/)
- [GreenIT Analysis (extension navigateur)](https://chrome.google.com/webstore/detail/greenit-analysis/)

---

## 📁 Structure du projet

```
MediLaboApp/
├── PatientService.API/        # Sprint 1 ✅
├── NoteService.API/           # Sprint 2 🔄
├── AuthService.API/           # Sprint 2 🔄
├── DiabetesRiskService.API/   # Sprint 3 🔄
├── Gateway.API/               # Sprint 2 🔄
├── docker-compose.yml
└── MediLaboApp.sln
```
