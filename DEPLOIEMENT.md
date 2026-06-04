# 🚀 Guide de déploiement - Portfolio Guilhem Terrier

## ✅ Build de production prêt

Votre build de production est **prêt** et se trouve dans le dossier :
```
C:\Users\Admin\Desktop\PORTFOLIO\build\
```

## 📦 Contenu du dossier build

- ✅ `.htaccess` - Configuration Apache pour le routing React
- ✅ `index.html` - Page principale
- ✅ `assets/` - Tous les fichiers JS, CSS et images optimisés
- ✅ `logo-reduit.png` - Favicon du site
- ✅ `pdf/` - Fichiers PDF (CV + Mémoire M1)

## 🌐 Déploiement sur un hébergeur Apache

### Étapes :

1. **Connectez-vous à votre hébergeur** via FTP (FileZilla, WinSCP, etc.) ou cPanel

2. **Accédez au dossier racine** de votre site web (généralement `public_html/`, `www/`, ou `htdocs/`)

3. **Uploadez TOUT le contenu du dossier `build/`**
   - Ne pas uploader le dossier "build" lui-même
   - Uploader uniquement son CONTENU
   - Assurez-vous que le fichier `.htaccess` est bien uploadé (fichier caché)

4. **Structure finale sur le serveur :**
   ```
   public_html/
   ├── .htaccess          ← Très important pour le routing !
   ├── index.html
   ├── logo-reduit.png
   ├── assets/
   │   ├── index-C6TdoAIj.css
   │   ├── index-D9hvePvx.js
   │   └── [toutes les images]
   └── pdf/
       ├── cv.pdf
       └── memoire-m1-dimi.pdf
   ```

## ⚠️ Problèmes courants et solutions

### Problème 1 : Page blanche après upload
**Cause :** Le fichier `.htaccess` n'est pas uploadé (fichier caché)
**Solution :**
- Dans votre client FTP, activez "Afficher les fichiers cachés"
- Vérifiez que `.htaccess` est bien sur le serveur

### Problème 2 : Erreur 404 sur les routes
**Cause :** Apache n'a pas le module `mod_rewrite` activé
**Solution :**
- Contactez votre hébergeur pour activer `mod_rewrite`
- Ou ajoutez dans votre cPanel

### Problème 3 : Images ne s'affichent pas
**Cause :** Chemin incorrect ou permissions
**Solution :**
- Vérifiez les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)
- Vérifiez que le dossier `assets/` est bien uploadé

### Problème 4 : PDFs ne se téléchargent pas
**Cause :** Dossier `pdf/` manquant ou permissions incorrectes
**Solution :**
- Vérifiez que le dossier `pdf/` contient bien les 2 fichiers PDF
- Permissions : 644 pour les PDF

## 🎯 Hébergeurs recommandés (gratuits et faciles)

### Option 1 : Netlify (Recommandé ⭐)
**Le plus simple !**
1. Allez sur [netlify.com](https://netlify.com)
2. Créez un compte gratuit
3. Glissez-déposez le dossier `build/` dans leur interface
4. Votre site est en ligne en 30 secondes !

**Avantages :**
- Gratuit
- HTTPS automatique
- Pas besoin de FTP
- Mises à jour en quelques secondes

### Option 2 : Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte
3. Importez votre projet depuis GitHub ou uploadez le dossier
4. Déploiement automatique

### Option 3 : GitHub Pages
1. Créez un repo GitHub
2. Uploadez le contenu de `build/`
3. Activez GitHub Pages dans les settings
4. Votre site sera sur `https://votre-username.github.io/nom-repo/`

## 📝 Checklist avant mise en ligne

- [ ] Build terminé sans erreurs
- [ ] Fichier `.htaccess` présent dans le dossier build
- [ ] Tous les fichiers du dossier `build/` uploadés
- [ ] Le fichier `index.html` est à la racine
- [ ] Le dossier `assets/` contient tous les fichiers
- [ ] Le dossier `pdf/` contient les 2 PDFs
- [ ] Le favicon `logo-reduit.png` est présent
- [ ] Testé sur navigateur : page d'accueil fonctionne
- [ ] Testé : navigation entre les pages
- [ ] Testé : liens LinkedIn, mail, CV
- [ ] Testé : téléchargement du mémoire M1

## 🔄 Pour mettre à jour le site plus tard

1. Faites vos modifications dans le code source
2. Relancez `npm run build`
3. Re-uploadez le contenu du nouveau dossier `build/`
4. Votre site est mis à jour !

## 💡 Astuce

Pour éviter de tout re-uploader à chaque fois, utilisez Netlify ou Vercel qui :
- Se connectent à votre repo GitHub
- Buildent automatiquement à chaque commit
- Mettent à jour le site en quelques secondes

---

**Votre portfolio est prêt à être déployé ! 🎉**

Emplacement du build : `C:\Users\Admin\Desktop\PORTFOLIO\build\`