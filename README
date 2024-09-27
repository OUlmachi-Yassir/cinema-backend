# CinéManager

## Application de Gestion de Cinéma avec Authentification et Réservations (Backend)

### Contexte du Projet

CinéManager est une application de gestion pour un cinéma qui permet de gérer les films, les réservations, les salles, les séances et les places disponibles. L'application offre également des fonctionnalités d'authentification pour les utilisateurs, garantissant que les réservations ne peuvent être effectuées que si le client est authentifié. Les administrateurs peuvent créer d'autres administrateurs, tandis que les clients peuvent créer leurs propres comptes.

### Objectifs du Projet

- Gérer les films, les séances, les salles et les réservations.
- Authentifier les utilisateurs (clients et administrateurs) pour sécuriser l'accès à certaines fonctionnalités.
- Permettre aux administrateurs de gérer tout le système, y compris la création de nouveaux administrateurs.
- Exiger l'inscription et la connexion des clients pour accéder aux fonctionnalités de réservation.

### Fonctionnalités Principales

#### Gestion des Utilisateurs

- **Inscription des Clients :**
  - Les clients peuvent créer un compte via l'application (nom, email, mot de passe, etc.).
  - Validation des données lors de l'inscription.

- **Connexion et Authentification :**
  - Les clients et les administrateurs doivent se connecter pour accéder à certaines fonctionnalités (comme réserver une place pour un film).
  - Utilisation de JWT pour la gestion des sessions sécurisées.

- **Gestion des Administrateurs :**
  - Un administrateur peut créer d'autres administrateurs.
  - Possibilité de modifier ou supprimer des comptes administrateurs.

#### Gestion des Films

- **Ajouter un Film :**
  - Les administrateurs peuvent ajouter, modifier ou supprimer un film.

- **Lister les Films Disponibles :**
  - Les clients et les administrateurs peuvent voir la liste des films actuellement à l'affiche.

#### Gestion des Salles et des Séances

- **Créer une Salle :**
  - Les administrateurs peuvent définir les caractéristiques des salles de cinéma (nom, capacité, type de salle).

- **Planifier une Séance :**
  - Planification des séances avec l'horaire, le film associé, la salle et les tarifs.

- **Modifier ou Annuler une Séance :**
  - Mettre à jour les horaires ou annuler une séance.

- **Voir les Séances Disponibles :**
  - Les clients peuvent voir les séances pour un film et vérifier les disponibilités.

#### Gestion des Réservations

- **Réserver des Places :**
  - Les clients doivent être authentifiés pour pouvoir réserver des places pour une séance donnée.

- **Confirmation :**
  - Le client reçoit une confirmation par email et les détails de la séance.

- **Annuler ou Modifier une Réservation :**
  - Les clients peuvent annuler ou modifier leurs réservations.

#### Gestion des Places Disponibles

- **Affichage des Places Disponibles :**
  - Les clients peuvent voir le nombre de places disponibles pour une séance donnée.

- **Sélection d'une Place Spécifique :**
  - Les clients peuvent choisir leur place.

- **Mise à Jour en Temps Réel des Places :**
  - Le système met à jour automatiquement la disponibilité des places après chaque réservation.

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/OUlmachi-Yassir/cinema-backend.git
