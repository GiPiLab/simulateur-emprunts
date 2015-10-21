# simulateur-emprunts


##Compilation for android with cordova

- Install cordova and android sdk

- Clone the repository somewhere

- Create a new cordova tree, for example: `cordova create outputpath org.gipilab.simulateuremprunts "Simulateur d'emprunts"`

- Replace `www` and `config.xml` with those from this repository

- `cordova prepare` into the root of `outputpath`

- Replace `platforms/android/AndroidManifest.xml` with the one cloned from git

- Fetch all data and compile with `cordova prepare;cordova build`




