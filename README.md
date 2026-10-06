# MediLaboApp — Dépistage du diabète de type 2

## 📋 Présentation

Ce projet a été développé dans le cadre de la formation **Développeur Backend .NET d'OpenClassrooms**. Il s'agit d'une application distribuée permettant de gérer les informations des patients de l'Abernathy Clinic et d'évaluer leur risque de développer un diabète de type 2.

### Contexte du projet
L'application répond à la demande d'une clinique de santé qui souhaite automatiser le dépistage du diabète de type 2 chez ses patients. Le système analyse les données personnelles des patients (âge, genre) ainsi que leurs notes médicales pour calculer un niveau de risque personnalisé.

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
└──────────────┘ └──────┬───────┘ └──────┬───────┘ └────────┬─────────┘
                         ▼                ▼          appelle Patient + Note
                  ┌──────────┐     ┌──────────┐
                  │SQL Server│     │ MongoDB  │
                  │(MediLaboDb)    │(noteservice)
                  └──────────┘     └──────────┘
```

---

## 🔐 Sécurité

- **Authentification** : `AuthService` génère un token **JWT** au login, contenant le rôle de l'utilisateur
- **Autorisation en couches** : la Gateway valide une première fois le token, puis **chaque microservice le revalide lui-même** (`AddJwtBearer` + `[Authorize]`) — aucun service ne fait confiance au réseau interne (defense in depth)
- **Rôles** :
  - `Admin` / `Practitioner` : lecture + écriture (création/modification/suppression patients et notes)
  - `Assistant` : lecture seule (`[Authorize(Roles = "Practitioner,Admin")]` sur les endpoints d'écriture ; boutons masqués côté Frontend pour l'ergonomie)
- **Propagation du token** : `DiabetesRiskService` relaie le header `Authorization` reçu vers ses appels sortants vers `PatientService`/`NoteService` (sinon ces appels échoueraient en 401)

---

## 🎯 Microservices

### 1. Gateway (Ocelot)
- **Technologie** : ASP.NET Core 9 + Ocelot
- **Responsabilités** : point d'entrée unique, routage vers les microservices downstream, première vérification du JWT sur les routes protégées
- **Port** : 5000

### 2. AuthService
- **Technologie** : ASP.NET Core 9
- **Responsabilités** : authentification, génération du token JWT (rôle inclus dans les claims)
- **Utilisateurs** : en mémoire (démo), 3 comptes de test (voir plus bas)
- **Port** : 5003

### 3. PatientService
- **Technologie** : ASP.NET Core 9 + Entity Framework Core
- **Responsabilités** : CRUD complet des patients (nom, prénom, date de naissance, genre, adresse, téléphone)
- **Base de données** : SQL Server (`MediLaboDb`), **normalisée 3NF** — l'âge n'est jamais stocké, il est calculé à la volée à partir de la date de naissance
- **Port** : 5001

### 4. NoteService
- **Technologie** : ASP.NET Core 9
- **Responsabilités** : CRUD des notes médicales libres rédigées par les praticiens, liées à un patient via `PatientId`
- **Base de données** : MongoDB (documents JSON, schéma flexible adapté à du texte libre)
- **Port** : 5002

### 5. DiabetesRiskService
- **Technologie** : ASP.NET Core 9
- **Responsabilités** : calcule le niveau de risque diabétique en appelant `PatientService` (âge, genre) et `NoteService` (notes), avec propagation du JWT
- **Port** : 5004
- **Niveaux de risque** :
  - `None` : aucun risque
  - `Borderline` : `>30 ans` avec 2 à 5 déclencheurs distincts
  - `InDanger` : `>30 ans` avec 6-7 déclencheurs, ou hommes `≤30 ans` avec 3+ déclencheurs, ou femmes `≤30 ans` avec 4+ déclencheurs
  - `EarlyOnset` : `>30 ans` avec 8+ déclencheurs, ou hommes `≤30 ans` avec 5+ déclencheurs, ou femmes `≤30 ans` avec 7+ déclencheurs
  - Le comptage se base sur la **présence** de chacun des 11 termes déclencheurs dans les notes (pas leur fréquence)

### 6. Frontend (React)
- **Technologie** : React (Vite), servi en production via Nginx
- **Responsabilités** : login, liste et fiche patient, gestion des notes, affichage du niveau de risque. Les 3 appels API (patient, notes, risque) sont faits **en parallèle** au chargement
- **Port** : 3000

---

## 🚀 Installation et démarrage

### Prérequis
- Docker et Docker Compose

### Lancement avec Docker
```bash
git clone https://github.com/Reb2594/MediLaboApp
cd MediLaboApp
docker-compose up --build
```

Démarre les 7 conteneurs : SQL Server, MongoDB, AuthService, PatientService, NoteService, DiabetesRiskService, Gateway, Frontend.

| Service | Adresse |
|---|---|
| Frontend | http://localhost:3000 |
| Gateway (API) | http://localhost:5000 |
| PatientService | http://localhost:5001 |
| NoteService | http://localhost:5002 |
| AuthService | http://localhost:5003 |
| DiabetesRiskService | http://localhost:5004 |
| SQL Server | localhost:1433 |
| MongoDB | localhost:27017 |

### 📚 Documentation API (Swagger)
Chaque backend expose une interface Swagger en environnement de développement, pratique pour explorer et tester les endpoints sans Postman :
- AuthService : http://localhost:5003/swagger
- PatientService : http://localhost:5001/swagger
- NoteService : http://localhost:5002/swagger
- DiabetesRiskService : http://localhost:5004/swagger

Sur les services protégés, cliquer sur **Authorize** et coller le token JWT (sans préfixe) obtenu via `/api/auth/login` pour tester les endpoints sécurisés.

### 🔑 Comptes de test
| Username | Password | Rôle |
|---|---|---|
| `admin` | `Admin1234!` | Admin |
| `doctor` | `Doctor1234!` | Practitioner |
| `assistant` | `Assistant1234!` | Assistant (lecture seule) |

Pour obtenir un token JWT directement en API :
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{ "username": "admin", "password": "Admin1234!" }
```
La réponse contient un `token` à utiliser dans l'en-tête `Authorization: Bearer <token>`.

---

## 📊 Base de données

### SQL Server — PatientService (`MediLaboDb`)
Normalisée en **3NF** :
- Table `Patients` (`Id, FirstName, LastName, DateOfBirth, Gender, Address, PhoneNumber`)
- Aucune donnée dérivée stockée (l'âge est calculé, jamais persisté)

### MongoDB — NoteService
Collection `Notes` contenant : `PatientId, PatientName, NoteText`. Pas de schéma fixe imposé — adapté à du texte médical libre et à son évolution sans migration.

---

## 🌿 Green Code — actions appliquées

- **Async/await systématique** sur tous les appels I/O (base de données, HTTP) pour ne pas bloquer de threads inutilement
- **Requêtes ciblées** (projections LINQ) au lieu de charger des entités complètes non nécessaires
- **Base normalisée 3NF** : pas de donnée redondante ni dérivée stockée
- **Appels API en parallèle** côté Frontend (patient, notes, risque chargés simultanément, pas en séquentiel)
- **Images Docker multi-stage** : image finale en runtime `aspnet` seul, sans le SDK complet

### Pistes d'amélioration identifiées
- Mettre en cache les résultats de risque (évite de recalculer à chaque affichage)
- Paginer les listes de patients et de notes
- Valider l'existence du `PatientId` côté NoteService avant d'enregistrer une note (actuellement non vérifié entre les deux bases)

---

## 🛠️ Technologies utilisées
- **Backend** : ASP.NET Core 9
- **Frontend** : React (Vite) + Nginx
- **API Gateway** : Ocelot
- **Authentification** : JWT (génération et validation maison)
- **Bases de données** : SQL Server (Entity Framework Core), MongoDB
- **Containerisation** : Docker, Docker Compose

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
