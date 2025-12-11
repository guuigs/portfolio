# Images du Portfolio

Ce dossier contient toutes les images utilisées dans le projet.

## Organisation

Placez toutes vos images dans ce dossier avec des noms descriptifs et en minuscules.

### Convention de nommage

- Utilisez des tirets (`-`) pour séparer les mots
- Évitez les espaces et caractères spéciaux
- Utilisez des noms descriptifs et clairs

**Exemples** :
- `home-image.png` - Image de la page d'accueil
- `profile-photo.jpg` - Photo de profil
- `project-thumbnail.png` - Miniature de projet
- `experience-logo-company.png` - Logo d'entreprise pour la section expériences

### Formats supportés

- **PNG** - Pour les images avec transparence, logos, icônes
- **JPG/JPEG** - Pour les photos et images sans transparence
- **WEBP** - Format moderne pour une meilleure compression
- **SVG** - Pour les icônes et graphiques vectoriels
- **GIF** - Pour les animations simples

## Utilisation dans le code

Pour importer une image dans un composant React :

```tsx
import monImage from "@/assets/images/mon-image.png";

export function MaPage() {
  return (
    <div>
      <img src={monImage} alt="Description de l'image" />
    </div>
  );
}
```

### Exemple avec chemin relatif

```tsx
import monImage from "../../assets/images/mon-image.png";
```

## Optimisation des images

### Avant d'ajouter une image :

1. **Redimensionnez** l'image à la taille maximale d'affichage
2. **Compressez** l'image (outils recommandés : TinyPNG, Squoosh)
3. **Choisissez le bon format** :
   - PNG pour la transparence
   - JPG pour les photos
   - WEBP pour le meilleur ratio qualité/taille

### Tailles recommandées

- **Images hero** : max 1920px de largeur
- **Miniatures** : max 600px de largeur
- **Photos de profil** : max 400px
- **Icônes** : 64px à 128px (ou utilisez SVG)

## Images actuelles

- `home-image.png` - Image principale de la page d'accueil

---

**Note** : Ne commitez pas d'images trop volumineuses (>1MB). Optimisez-les d'abord !
