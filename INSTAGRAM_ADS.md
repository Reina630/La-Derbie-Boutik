# Guide des Publicités Instagram - Liens de Commande Rapide

## 📱 Comment utiliser les liens pour Instagram

### Format du lien
Pour créer un lien qui ouvre automatiquement le formulaire de commande sur un produit spécifique :

```
https://votresite.com/boutique?order=ID_DU_PRODUIT
```

### Exemples concrets

Si votre produit a l'ID `1` dans la base de données :
```
https://votresite.com/boutique?order=1
```

Si votre produit a l'ID `5` :
```
https://votresite.com/boutique?order=5
```

### Comment trouver l'ID d'un produit ?

1. **Via l'interface admin** : Allez dans l'admin → Produits
2. **Directement dans l'URL** : Quand vous êtes sur la page d'un produit, l'URL est `/produit/ID`
3. **Dans Supabase** : Table `products`, colonne `id`

## 🎯 Configuration de la publicité Instagram

### Étape 1 : Créer votre publicité Instagram
1. Allez dans Meta Business Suite
2. Créez une nouvelle publicité
3. Choisissez l'objectif "Trafic" ou "Conversions"

### Étape 2 : Configurer le bouton d'action
1. Pour le bouton d'action, choisissez l'une de ces options :
   - **"Acheter maintenant"**
   - **"Commander maintenant"**
   - **"En savoir plus"**
   - **"S'inscrire"**

2. Dans le champ URL de destination, collez votre lien :
   ```
   https://votresite.com/boutique?order=1
   ```
   *(Remplacez `1` par l'ID de votre produit)*

### Étape 3 : Ce qui se passe quand quelqu'un clique

1. ✅ Le client arrive sur votre boutique
2. ✅ Le formulaire de commande s'ouvre **automatiquement**
3. ✅ Le produit est déjà sélectionné avec son image et son prix
4. ✅ Le client remplit simplement :
   - Son nom
   - Son téléphone
   - Son adresse de livraison
   - La quantité désirée
5. ✅ La commande est enregistrée dans votre système
6. ✅ Vous recevez la notification dans l'admin

## 💡 Conseils pour vos publicités

### Produits recommandés pour Instagram
- Vos **meilleurs produits** (best-sellers)
- Produits en **promotion**
- **Nouveautés**
- Produits avec de **belles images**

### Texte de la publicité
Exemple de texte accrocheur :
```
🔥 Offre Spéciale !
[Nom du produit] à seulement [Prix] FCFA

✨ Qualité premium
🚚 Livraison rapide
💳 Paiement à la livraison

👉 Commandez maintenant en 2 clics !
```

### Image/Vidéo
- Utilisez des **images haute qualité** du produit
- Montrez le produit **en utilisation**
- Ajoutez du texte sur l'image avec le **prix** et l'**offre**

## 📊 Suivi des performances

Vous pouvez suivre les commandes provenant d'Instagram en :
1. Allant dans **Admin → Commandes**
2. Vérifiant les nouvelles commandes
3. Contactant les clients via le numéro fourni

## 🔧 Personnalisation avancée

### Utiliser différents produits pour différentes publicités

**Publicité 1** - Produit vedette :
```
https://votresite.com/boutique?order=1
```

**Publicité 2** - Promotion :
```
https://votresite.com/boutique?order=5
```

**Publicité 3** - Nouveauté :
```
https://votresite.com/boutique?order=10
```

### Combiner avec des catégories
Vous pouvez même ouvrir la boutique sur une catégorie ET un produit :
```
https://votresite.com/boutique?category=2&order=5
```
*(Mais le formulaire s'ouvrira quand même automatiquement)*

## ❓ Questions fréquentes

**Q : Le formulaire s'ouvre automatiquement ?**  
R : Oui, dès que quelqu'un clique sur le lien Instagram.

**Q : Puis-je tester le lien avant de lancer la pub ?**  
R : Oui ! Copiez le lien dans votre navigateur pour le tester.

**Q : Le client peut changer de produit ?**  
R : Oui, il peut fermer le formulaire et naviguer dans la boutique normalement.

**Q : Les commandes vont où ?**  
R : Dans l'admin, section "Commandes", avec le statut "En attente".

**Q : Le client reçoit une confirmation ?**  
R : Oui, un message de succès s'affiche, et vous devez le contacter pour finaliser.

## 🎨 Templates de liens prêts à l'emploi

Copiez et remplacez simplement `VOTRE_DOMAINE` et l'`ID` :

### Pour un produit standard
```
https://VOTRE_DOMAINE/boutique?order=ID
```

### Pour un produit en vedette
```
https://VOTRE_DOMAINE/boutique?order=ID
```

## 📞 Support

Si vous avez besoin d'aide pour configurer vos liens Instagram, vérifiez :
1. Que le produit existe dans votre base de données
2. Que l'ID est correct
3. Que le lien fonctionne en le testant dans un navigateur

---

✅ **Tout est prêt !** Vous pouvez maintenant booster vos publicités Instagram avec des liens directs vers le formulaire de commande.
