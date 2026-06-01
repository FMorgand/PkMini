# PkMini — Jeu d'apprentissage de la table des types Pokémon

## Concept

Application web interactive permettant d'apprendre par cœur la table des types Pokémon (Gen 6+) à travers un jeu de remplissage progressif.

---

## La table des types

- **18 types** (Gen 6+) : Normal, Feu, Eau, Électrik, Plante, Glace, Combat, Poison, Sol, Vol, Psy, Insecte, Roche, Spectre, Dragon, Ténèbres, Acier, Fée
- **Axes** :
  - Colonnes (X) : type *attaquant*
  - Lignes (Y) : type *défenseur*
- **Valeurs possibles par case** :
  - **×0** — Aucun effet
  - **×½** — Peu efficace
  - **×1** — Efficacité normale *(case neutre, non jouée)*
  - **×2** — Super efficace

---

## Déroulement du jeu

Le jeu se compose de **3 phases strictement séquentielles** :

| Phase | Catégorie à trouver | Couleur de sélection |
|-------|---------------------|----------------------|
| 1     | ×0 — Aucun effet    | Noir / gris foncé    |
| 2     | ×2 — Super efficace | Vert / rouge         |
| 3     | ×½ — Peu efficace   | Jaune / orange       |

### Déroulement d'une phase

1. Le joueur clique sur les cases qu'il pense appartenir à la catégorie courante.
2. Les cases sélectionnées changent de couleur (état "sélectionné").
3. Un clic sur une case déjà sélectionnée la désélectionne.
4. Le joueur clique sur un bouton **"Valider"** quand il pense avoir trouvé toutes les cases.
5. La correction s'affiche :
   - Cases **correctement trouvées** : couleur validée (ex. vert)
   - Cases **manquées** (oubli) : révélées en rouge
   - Cases **en trop** (erreur) : surlignées en orange
6. Un score de phase est affiché (ex. "14/17 — 3 erreurs").
7. Le joueur passe à la phase suivante.

### Fin du jeu

Une fois les 3 phases terminées, la **table complète** s'affiche avec toutes les valeurs révélées et un score global.

---

## Interface

### Grille

- Tableau 18×18 avec en-têtes de types (icône ou texte court) sur les deux axes.
- État des cases :
  - **Vide** : case neutre (blanc / gris clair)
  - **Sélectionnée** : couleur de la phase courante
  - **Validée** : couleur définitive selon la catégorie
- Les cases de type ×1 (efficacité normale) ne sont jamais à sélectionner et restent visuellement neutres.

### Compteurs par ligne

À droite de chaque ligne, un compteur affiche le **nombre de cases restantes à trouver** pour la catégorie de la phase courante uniquement.

- Pendant la phase ×0 : compteur ×0 visible par ligne
- Pendant la phase ×2 : compteur ×2 visible par ligne
- Pendant la phase ×½ : compteur ×½ visible par ligne

Le compteur décrémente en temps réel quand le joueur sélectionne une case (même si ce n'est pas forcément la bonne — le compteur reflète les cases *non encore sélectionnées* dans la ligne).

> **Note** : le compteur indique combien de cases *existent* dans cette catégorie pour la ligne, pas combien sont correctes. La correction n'est révélée qu'à la validation.

### Bouton de validation

Bouton **"Valider la phase"** visible en permanence pendant le jeu, en bas ou en haut de la grille.

---

## Stack technique envisagée

- HTML / CSS / JavaScript vanilla (pas de framework) pour garder le projet léger
- Un seul fichier `index.html` ou organisation minimale `index.html` + `style.css` + `game.js`
- Aucune dépendance externe

---

## Données : table des types Gen 6+

La table est encodée en dur dans le code JavaScript sous forme d'une matrice 18×18.

Légende : `0` = aucun effet, `0.5` = peu efficace, `1` = normal, `2` = super efficace.

```
Ordre des types (index 0→17) :
Normal, Feu, Eau, Électrik, Plante, Glace, Combat, Poison,
Sol, Vol, Psy, Insecte, Roche, Spectre, Dragon, Ténèbres, Acier, Fée
```

---

## Extensions futures possibles

- Mode "timer" avec chronomètre par phase
- Historique des scores
- Mode révision : afficher la table complète consultable
- Support mobile (grille scrollable / zoom)
- Localisation EN / FR des noms de types
