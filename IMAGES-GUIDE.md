# Guide d'utilisation des images

## 📁 Dossier des images

Toutes vos images doivent être placées dans :
```
src/assets/images/
```

## 📥 Comment ajouter une nouvelle image

### Étape 1 : Préparer votre image

1. **Optimisez la taille** de votre image avant de l'ajouter
2. **Nommez correctement** votre fichier (minuscules, tirets)
   - ✅ Bon : `mon-projet.png`, `photo-profil.jpg`
   - ❌ Mauvais : `Mon Projet.PNG`, `photo profil.jpg`

### Étape 2 : Placer l'image

Copiez votre image dans le dossier `src/assets/images/`

### Étape 3 : Utiliser l'image dans votre code

#### Option A : Import avec alias `@/` (recommandé)

```tsx
import monImage from "@/assets/images/mon-image.png";

export function MaPage() {
  return (
    <div>
      <img src={monImage} alt="Description" className="w-full" />
    </div>
  );
}
```

#### Option B : Import avec chemin relatif

```tsx
import monImage from "../../assets/images/mon-image.png";
```

## 📝 Convention de nommage

### Images de pages
- `home-image.png` - Page d'accueil
- `experiences-banner.jpg` - Bannière section expériences
- `likes-background.png` - Fond section ce que j'aime
- `mentality-illustration.png` - Illustration section mentalité

### Images de projets
- `project-[nom]-thumbnail.png` - Miniature de projet
- `project-[nom]-screenshot-1.png` - Capture d'écran 1
- `project-[nom]-screenshot-2.png` - Capture d'écran 2

### Logos et icônes
- `logo-[entreprise].png` - Logo d'entreprise
- `icon-[nom].svg` - Icône vectorielle
- `skill-[technologie].png` - Logo de compétence

### Photos personnelles
- `profile-photo.jpg` - Photo de profil
- `profile-hero.jpg` - Photo hero page d'accueil

## 🎨 Formats recommandés

| Format | Usage | Taille max |
|--------|-------|------------|
| **PNG** | Logos, icônes, transparence | 500 KB |
| **JPG** | Photos, images complexes | 800 KB |
| **WEBP** | Alternative moderne (meilleure compression) | 500 KB |
| **SVG** | Icônes, graphiques vectoriels | 50 KB |

## 🖼️ Tailles recommandées

- **Hero images** : 1920 x 1080 px
- **Bannières** : 1600 x 600 px
- **Miniatures de projets** : 800 x 600 px
- **Photos de profil** : 400 x 400 px
- **Icônes** : 128 x 128 px (ou SVG)

## 🔧 Outils d'optimisation

### En ligne (gratuit)
- **TinyPNG** : https://tinypng.com/ (PNG/JPG)
- **Squoosh** : https://squoosh.app/ (tous formats)
- **SVGOMG** : https://jakearchibald.github.io/svgomg/ (SVG)

### Logiciels
- **ImageOptim** (Mac)
- **FileOptimizer** (Windows)
- **GIMP** (multiplateforme)

## 📋 Checklist avant d'ajouter une image

- [ ] Image optimisée (< 1 MB)
- [ ] Nom de fichier en minuscules avec tirets
- [ ] Format approprié (PNG/JPG/WEBP/SVG)
- [ ] Taille adaptée à l'usage
- [ ] Image placée dans `src/assets/images/`
- [ ] Import ajouté dans le composant
- [ ] Attribut `alt` descriptif ajouté

## 💡 Exemples pratiques

### Exemple 1 : Image de projet

```tsx
// src/components/pages/Experiences.tsx
import projectThumbnail from "@/assets/images/project-portfolio-thumbnail.png";

export function ProjectCard() {
  return (
    <div className="card">
      <img
        src={projectThumbnail}
        alt="Capture d'écran du projet Portfolio"
        className="w-full h-[300px] object-cover rounded-lg"
      />
      <h3>Mon Portfolio</h3>
      <p>Description du projet...</p>
    </div>
  );
}
```

### Exemple 2 : Photo de profil

```tsx
// src/components/pages/Home.tsx
import profilePhoto from "@/assets/images/profile-photo.jpg";

export function Hero() {
  return (
    <div className="flex items-center gap-8">
      <img
        src={profilePhoto}
        alt="Photo de profil"
        className="w-[200px] h-[200px] rounded-full object-cover"
      />
      <div>
        <h1>Bienvenue</h1>
        <p>Je suis développeur web</p>
      </div>
    </div>
  );
}
```

### Exemple 3 : Logo d'entreprise

```tsx
// src/components/pages/Experiences.tsx
import logoGoogle from "@/assets/images/logo-google.png";
import logoApple from "@/assets/images/logo-apple.png";

export function ExperienceCard() {
  return (
    <div className="experience-card">
      <img
        src={logoGoogle}
        alt="Logo Google"
        className="w-[60px] h-[60px] object-contain"
      />
      <div>
        <h3>Google</h3>
        <p>Développeur Frontend</p>
      </div>
    </div>
  );
}
```

## 🚨 Erreurs courantes

### Erreur : "Cannot find module"

```
Cannot find module '@/assets/images/mon-image.png'
```

**Solution** :
1. Vérifiez que l'image existe dans `src/assets/images/`
2. Vérifiez l'orthographe exacte du nom de fichier
3. Redémarrez le serveur Vite (`npm run dev`)

### Erreur : Image ne s'affiche pas

**Solutions** :
1. Vérifiez le chemin d'import
2. Vérifiez que l'attribut `src={variable}` est correct
3. Ouvrez la console du navigateur pour voir les erreurs

## 📚 Ressources

- **Documentation Vite** : https://vitejs.dev/guide/assets.html
- **Images responsive** : https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- **Optimisation d'images** : https://web.dev/fast/#optimize-your-images

---

**Besoin d'aide ?** Consultez le README dans `src/assets/images/README.md`
