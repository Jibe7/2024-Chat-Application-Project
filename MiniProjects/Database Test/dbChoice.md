Un choix techniquement pertinent pour ce projet (communication en temps réel) serait Redis : 
- Qui stockerait les messages et les informations de présence des utilisateurs
- Que l'on utiliserait avec du Pub/Sub pour diffuser les messages aux utilisateurs en temps réel
- Qui gèrerait les files d'attente de messages pour garantir la livraison
couplé avec un serveur web (Python, Nodejs...) qui gèrerait les requêtes http des utilisateurs et se connecterait à Redis pour publier et recevoir des messages et avec une base de données SQL pour stocker les données persistantes.
Les avantages d'une utilisation de Redis serait :
- des performances élevées
- scalabilité horizontale (ajout de nouveau serveur Redis si besoin)
- simplicité (pub/sub)
- flexibilité (ajout d'autres fonctionnalités comme la présence d'utilisateurs)
Considération : persistance des données ou ajout d'une bdd sql mais complexité plus importante.

Bien que Redis semble être une solution idéale, je considère les bases de données MySQL & MariaDB, PostgreSQL et MongoDB qui sont très populaires et répandues. PostgreSQL offre des fonctionalités avancées mais est également plus complexe, ce qui ne paraît pas être nécessaire pour ce projet, MongoDB, MySQL ou MariaDB suffisent pour un projet web simple (c'est le cas) et une base de donnée de petite taille (également).

MariaDB et MySQL sont très similaires (Maria est un fork de MySQL), MySQL est néanmoins plus mature et avec une communauté plus importante.

Bien que MongoDB et MySQL puisse être utilisé dans des scénarios différents chacun, MongoDB brille avec des applications dont la structure des données change, ayant beaucoup de données non structurées changeant fréquemment et ayant besoin de scalabilité horizontale; MySQL pour des applications nécessitant une intégrité forte, des requêtes complexes ayant des jointures et des structures de données bien définis.
Avantages de MongoDB : 
- on peut stocker les messages en document JSON avec des champs pour l'envoyeur, la date, le contenu...
- le contenu peut être flexible (text, image, ou autres) sans changement de schéma
- une application de messagerie représente bien des données changeant fréquemment
Avantage de MySQL :
- on a une structure de message bien définie et l'on envisage pas de changement dans le futur

Résumé :
- le mieux est l'ennemi du bien, inutile de considérer des bases de données dont les fonctionnalités sont trop avancées pour ce projet (Redis❌ PostgreSQL❌)
- les fonctionnalités étant similaires (un peu plus innovante sur MariaDB mais ce n'est pas un critère pour ce projet), la maturité et la taille de la communauté oriente donc vers MySQL (MariaDB ❌ MySQL 🆗)
- les performances de notre application et son évolutivité ne sont pas importante (je ne souhaite pas créer le prochain facebook), la forme des données étant bien défini on privilégiera MySQL 🟢 à MongoDB❌

Le grand gagnant :

# 🏆🏆MySQL🏆🏆






# Configuration MySQL
### Data Directory
Choisir un dossier...
### Type and Networking
Étant donné que l'application y accédant est sur le même PC, je n'ai pas d'utilité à ouvrir le port du firewall.
La configuration par défaut du Port et X Protocol Port (utilisé pour le protocol X, un protocol de communication interne entre les composants MySQL) est très bien.
Le choix de communication avec la base de donnée peut être via des named pipe (plus rapide que connexion tcp/ip) ou encore de la mémoire partagée (encore plus rapide que named pipe) ou du tcp/ip. N'ayant pas besoin de performance pour cette application je choisis de rester en tcp/ip.
### Accounts and Roles
Root Password : là où je m'y attends
MySQL User : 
Name : BackendReadWrite
Role : DB Manager
Password : là où je m'y attends
### Windows Service
No
### Server File Permissions
Do you want MySQL Configurator to update the server file permissions for you ?
Yes, grant full access to the user running the Windows Service (if applicable) and the administrators group only. Other users and groups will not have access. 🆗
Yes, but let me review and configure the level of access. ❌
No, I will manage the permissions after the server configuration. ❌
Less overhead for configuration and my backend app can connect 🤷‍♂️
### Logging Options
None. Performance and Security is not a concern for this application.
### Advanced Options
Server ID : 1 (we don't care as we are not using binary logging).
Table Name Case : Lower Case, the default. -> All table names are stored and compared in lowercase, regardless of how they were originally created.
### Sample Databases 
None.

