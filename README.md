# simulateur-emprunts

<p align='center'>
<a href="https://play.google.com/store/apps/details?id=org.gipilab.simulateuremprunts&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-AC-global-none-all-co-pr-py-PartBadges-Oct1515-1"><img width="150" alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/images/apps/fr-play-badge.png" /></a>
</p>


##Compilation for android with cordova

- Install cordova and android sdk

- Clone the repository somewhere

- Create a new cordova tree, for example: `cordova create outputpath org.gipilab.simulateuremprunts "Simulateur d'emprunts"`

- Replace `www` and `config.xml` with those from this repository

- `cordova prepare` into the root of `outputpath`

- Replace `platforms/android/AndroidManifest.xml` with the one cloned from git

- Fetch all data and compile with `cordova prepare;cordova build`



