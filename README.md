# MediLaboApp

Application médicale en architecture **microservices ASP.NET Core** pour aider les médecins de l'Abernathy Clinic à identifier les patients à risque de diabète de type 2.

---

## 🏗️ Architecture

```
                         ┌──────────────┐
                         │   Frontend   │  (React, port 3000)
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │  Gateway API │  (Ocelot, port 5000)
                         └──────┬───────┘
        ┌───────────────┬───────┴────────┬──────────────────┐
┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐ ┌────────▼─────────┐
│ AuthService  │ │PatientService│ │ NoteService  │ │DiabetesRiskService│
│ (JWT, 5003)  │ │(SQL, 5001)   │ │(MongoDB,5002)│ │  (calcul, 5004)  │
└──────────────┘ └──────────────┘ └──────────────┘ └────────┬─────────┘
                                                     appelle Patient + Note
```

Chaque microservice vérifie lui-même le token JWT (`[Authorize]`), en plus de la vérification faite par la Gateway : aucun service ne fait confiance au réseau interne.

---

## 🚀 Microservices

| Service | Rôle | Stockage | Port |
|---|---|---|---|
| **AuthService** | Authentification, génère un JWT (rôles `Admin`, `Practitioner`, `Assistant`) | Utilisateurs en mémoire (démo) | 5003 |
| **PatientService** | CRUD des données démographiques du patient | SQL Server (normalisé 3NF) | 5001 |
| **NoteService** | CRUD des notes médicales libres rédigées par les praticiens | MongoDB (documents) | 5002 |
| **DiabetesRiskService** | Calcule le niveau de risque de diabète à partir des données Patient + Notes | — (appelle les 2 services ci-dessus en HTTP, avec propagation du token JWT) | 5004 |
| **Gateway (Ocelot)** | Point d'entrée unique, route chaque requête vers le bon microservice | — | 5000 |
| **Frontend (React)** | Interface : login, liste/fiche patient, notes, résultat du risque | — | 3000 |

### Rôles et droits
- `Admin` / `Practitioner` : lecture + écriture (création/modification/suppression patients et notes)
- `Assistant` : lecture seule (les actions d'écriture sont masquées côté Frontend et bloquées côté serveur avec `[Authorize(Roles = "...")]`)

---

## 🔐 Sécurité

- Authentification par **JWT** émis par `AuthService` (login → token contenant le rôle)
- Chaque microservice valide le token indépendamment (`AddJwtBearer` + `[Authorize]`), en plus de la Gateway
- Les routes d'écriture sont restreintes par rôle (`[Authorize(Roles = "Practitioner,Admin")]`)
- Le token est propagé par `DiabetesRiskService` vers ses appels sortants (`PatientService`/`NoteService`), sinon ces appels échoueraient en 401

---

## 🧮 Algorithme de risque diabète

1. Récupération de l'âge/genre du patient et de toutes ses notes
2. Comptage du nombre de **termes déclencheurs distincts** présents dans les notes (présence, pas fréquence)
3. Calcul du niveau de risque selon des seuils qui dépendent de l'âge (et du genre si le patient a 30 ans ou moins)

Niveaux retournés : `None`, `Borderline`, `InDanger`, `EarlyOnset`.

---

## 🛠️ Lancement avec Docker

```bash
docker-compose up --build
```

Démarre les 7 conteneurs (SQL Server, MongoDB, AuthService, PatientService, NoteService, DiabetesRiskService, Gateway, Frontend). Application disponible sur `http://localhost:3000`.

Comptes de test : `admin` / `Admin1234!`, `doctor` / `Doctor1234!`, `assistant` / `Assistant1234!`.

---

## 🌿 Green Code

Bonnes pratiques appliquées dans le code :
- **Async/await systématique** sur tous les appels I/O (base de données, HTTP) pour ne pas bloquer de threads inutilement
- **Requêtes ciblées** (projections LINQ) au lieu de charger des entités complètes non nécessaires
- **Base normalisée 3NF** côté PatientService : pas de donnée redondante stockée (ex. l'âge n'est jamais stocké, il est calculé à partir de la date de naissance)
- **Appels API en parallèle** côté Frontend (patient, notes, risque chargés simultanément, pas en séquentiel)
- **Images Docker multi-stage** : image finale en runtime `aspnet` seul, sans le SDK complet

---

## 📁 Structure du projet

```
MediLaboApp/
├── AuthService.API/           # Authentification + JWT
├── PatientService.API/        # Données patients (SQL Server)
├── NoteService.API/           # Notes médicales (MongoDB)
├── DiabetesRiskService.API/   # Calcul du risque diabète
├── Gateway.API/               # Ocelot (point d'entrée unique)
├── Frontend/                  # React (Vite)
├── docker-compose.yml
└── MediLaboApp.sln
```
