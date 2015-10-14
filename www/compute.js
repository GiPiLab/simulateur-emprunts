'use strict';

function computeTables(currentEmpruntVariation1, currentEmpruntVariation2)
{
	if (currentEmpruntVariation1 === undefined || currentEmpruntVariation2 === undefined)
	{
		throw new Error('Missing arguments');
	}
	if (!currentEmpruntVariation1.isValid && !currentEmpruntVariation2.isValid)
	{
		throw new Error('Invalid Emprunt');
	}
	var output = '';


	if(window.cordova)
		ActivityIndicator.show("Patienter...");


	if (currentEmpruntVariation1.isValid)
	{
		output += "<h3 class='ui-bar ui-bar-a'>" + Emprunt.getEmpruntDescription(currentEmpruntVariation1.capital, currentEmpruntVariation1.taux, currentEmpruntVariation1.duree, currentEmpruntVariation1.periodicite) + ', profil &laquo;&nbsp;échéance constante&nbsp;&raquo;</h3>';

		output += "<div class='ui-body'>" + Emprunt.echeanceConstante.tableauAmortissement(currentEmpruntVariation1, 50) + '</div>';

		output += "<h3 class='ui-bar ui-bar-b'>" + Emprunt.getEmpruntDescription(currentEmpruntVariation1.capital, currentEmpruntVariation1.taux, currentEmpruntVariation1.duree, currentEmpruntVariation1.periodicite) + ', profil &laquo;&nbsp;capital constant&nbsp;&raquo;</h3>';

		output += "<div class='ui-body'>" + Emprunt.capitalConstant.tableauAmortissement(currentEmpruntVariation1, 50) + '</div>';
	}

	if (currentEmpruntVariation2.isValid)
	{
		output += '<h2>Mais aussi...</h2>';
		output += "<h3 class='ui-bar ui-bar-b'>" + Emprunt.getEmpruntDescription(currentEmpruntVariation2.capital, currentEmpruntVariation2.taux, currentEmpruntVariation2.duree, currentEmpruntVariation2.periodicite) + ', profil &laquo;&nbsp;capital constant&nbsp;&raquo;</h3>';

		output += "<div class='ui-body'>" + Emprunt.capitalConstant.tableauAmortissement(currentEmpruntVariation2, 50) + '</div>';
		output += "<h3 class='ui-bar ui-bar-a'>" + Emprunt.getEmpruntDescription(currentEmpruntVariation2.capital, currentEmpruntVariation2.taux, currentEmpruntVariation2.duree, currentEmpruntVariation2.periodicite) + ', profil &laquo;&nbsp;échéance constante&nbsp;&raquo;</h3>';

		output += "<div class='ui-body'>" + Emprunt.echeanceConstante.tableauAmortissement(currentEmpruntVariation2, 50) + '</div>';

	}
	$('#tableau').html(output);

	$('#tableau').trigger('create');

	$.mobile.pageContainer.pagecontainer('change', '#pageTableaux', {transition: 'none'});
	if(window.cordova)	
		ActivityIndicator.hide();
}

//Computes the missing value depending of the filled fields, display and store the results
//in empruntVar1, empruntVar2. empruntFormData will not contains the results, only the input values
function computeMissing(empruntVar1, empruntVar2, empruntFormData)
{
	if (empruntVar1 === undefined || empruntVar2 === undefined || empruntFormData === undefined)
	{
		throw new Error('Missing parameters');
	}
	var nbInputs = 0;
	var setCapital = false, setEcheance = false, setTaux = false, setDuree = false;
	empruntVar1.reset();
	empruntVar2.reset();
	empruntFormData.reset();

	$('#linkPageTableau').prop('disabled', true);
	$('#saveEmprunt').prop('disabled', true);

	if ($('#input-capital').val())
	{
		nbInputs++;
		setCapital = true;
	}
	if ($('#input-echeance').val())
	{
		nbInputs++;
		setEcheance = true;
	}
	if ($('#input-taux').val())
	{
		nbInputs++;
		setTaux = true;
	}
	if ($('#input-duree').val())
	{
		nbInputs++;
		setDuree = true;
	}

	if (nbInputs != 3)
	{
		alert('Remplissez exactement trois champs puis appuyez sur le bouton pour calculer la grandeur manquante');
		return;
	}
	


	var periodicite = new Decimal($('#select-periodicite').val());
	empruntVar1.periodicite = periodicite;
	empruntVar2.periodicite = periodicite;
	empruntFormData.periodicite = periodicite;

	//Calcul de l'échéance
	if (setCapital && setTaux && setDuree)
	{
		var capital = new Decimal($('#input-capital').val());
		var taux = new Decimal($('#input-taux').val()).dividedBy(100);
		var duree = new Decimal($('#input-duree').val());
		var echeanceConstante = Emprunt.echeanceConstante.calculeEcheance(capital, taux, duree, periodicite);

		empruntVar1.capital = capital;
		empruntVar1.taux = taux;
		empruntVar1.duree = duree;

		empruntFormData.capital = capital;
		empruntFormData.taux = taux;
		empruntFormData.duree = duree;
		empruntFormData.isValid = true;
		$('#saveEmprunt').prop('disabled', false);

		var res = "Valeur de l'échéance pour un emprunt de " + capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '% par an pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite) + ' :';


		if (echeanceConstante.isFinite() && !echeanceConstante.isNegative())
		{
			res += "<div class='resultat'>" + echeanceConstante.toFormat(2) + '€</div>';
			empruntVar1.echeance = echeanceConstante;
			empruntVar1.isValid = true;
			$('#linkPageTableau').prop('disabled', false);
			$('#saveEmprunt').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);

		var echeanceCapitalConstant = Emprunt.capitalConstant.calculeEcheance(capital, taux, duree, periodicite);

		res = 'Valeur de la première échéance pour un emprunt de '+ capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '% par an pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite) + ' : ';

		if (echeanceCapitalConstant.isFinite() && !echeanceCapitalConstant.isNegative())
		{
			res += "<div class='resultat'>" + echeanceCapitalConstant.toFormat(2) + '€</div>';
			$('#linkPageTableau').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}

		$('#resultatCapitalConstant').html(res);
	}
	//Calcul de la durée
	else if (setEcheance && setTaux && setCapital)
	{
		var capital = new Decimal($('#input-capital').val());
		var taux = new Decimal($('#input-taux').val()).dividedBy(100);
		var echeance = new Decimal($('#input-echeance').val());
		if (echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return;
		}
		empruntVar1.capital = capital;
		empruntVar1.taux = taux;
		empruntVar1.echeance = echeance;

		empruntFormData.capital = capital;
		empruntFormData.taux = taux;
		empruntFormData.echeance = echeance;
		empruntFormData.isValid = true;
		$('#saveEmprunt').prop('disabled', false);

		empruntVar2.capital = capital;
		empruntVar2.taux = taux;
		empruntVar2.echeance = echeance;

		var dureeEcheanceConstante = Emprunt.echeanceConstante.calculeDuree(capital, taux, echeance, periodicite);

		var res = "Durée d'un emprunt de " + capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '%, échéance '+ Emprunt.periodiciteToString(periodicite) + ' approchée de '+ echeance.toFormat(2) + '€ :';

		if (dureeEcheanceConstante.isFinite() && !dureeEcheanceConstante.isNegative())
		{
			res += "<div class='resultat'>" + Emprunt.formatDureeEmprunt(dureeEcheanceConstante, periodicite) + '</div>';
			empruntVar1.duree = dureeEcheanceConstante;
			empruntVar1.isValid = true;
			$('#linkPageTableau').prop('disabled', false);

		}
		else
			res += "<div class='resultat'>pas de résultat</div>";


		$('#resultatEcheanceConstante').html(res);

		var dureeCapitalConstant = Emprunt.capitalConstant.calculeDuree(capital, taux, echeance, periodicite);

		res = "Durée d'un emprunt de " + capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '%, première échéance '+ Emprunt.periodiciteToString(periodicite) + ' approchée de '+ echeance.toFormat(2) + '€ :';

		if (dureeCapitalConstant.isFinite() && !dureeCapitalConstant.isNegative())
		{
			res += "<div class='resultat'>" + Emprunt.formatDureeEmprunt(dureeCapitalConstant, periodicite) + '</div>';
			if (!dureeCapitalConstant.equals(dureeEcheanceConstante))
			{
				empruntVar2.duree = dureeCapitalConstant;
				empruntVar2.isValid = true;
			}
			$('#linkPageTableau').prop('disabled', false);
		}
		else
			res += "<div class='resultat'>pas de résultat</div>";

		$('#resultatCapitalConstant').html(res);
	}
	//Calcul du taux
	else if (setCapital && setDuree && setEcheance)
	{
		var capital = new Decimal($('#input-capital').val());
		var echeance = new Decimal($('#input-echeance').val());
		var duree = new Decimal($('#input-duree').val());
		if (echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return;
		}
		if(window.cordova)
			ActivityIndicator.show("Patienter...");
		empruntVar1.capital = capital;
		empruntVar1.duree = duree;
		empruntVar1.echeance = echeance;

		empruntFormData.capital = capital;
		empruntFormData.duree = duree;
		empruntFormData.echeance = echeance;
		empruntFormData.isValid = true;
		$('#saveEmprunt').prop('disabled', false);

		empruntVar2.capital = capital;
		empruntVar2.duree = duree;
		empruntVar2.echeance = echeance;

		var tauxEcheanceConstante = Emprunt.echeanceConstante.calculeTaux(capital, echeance, duree, periodicite);
		var res = 'Taux annuel estimé pour un emprunt de '+ capital.toFormat(2) + '€ pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite) + ', échéance constante de '+ echeance.toFormat(2) + '€ :';


		if (tauxEcheanceConstante.isFinite() && !tauxEcheanceConstante.isNegative())
		{
			res += "<div class='resultat'>" + tauxEcheanceConstante.times(100).toFormat(3) + '%</div>';
			empruntVar1.taux = tauxEcheanceConstante;
			empruntVar1.isValid = true;
			$('#linkPageTableau').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);

		var tauxCapitalConstant = Emprunt.capitalConstant.calculeTaux(capital, echeance, duree, periodicite);

		res = 'Taux annuel estimé pour un emprunt de '+ capital.toFormat(2) + '€ pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite) + ', première échéance de '+ echeance.toFormat(2) + '€, capital constant :';


		if (tauxCapitalConstant.isFinite() && !tauxCapitalConstant.isNegative())
		{
			res += "<div class='resultat'>" + tauxCapitalConstant.times(100).toFormat(3) + '%</div>';
			if (!tauxCapitalConstant.equals(tauxEcheanceConstante))
			{
				empruntVar2.taux = tauxCapitalConstant;
				empruntVar2.isValid = true;
			}
			$('#linkPageTableau').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatCapitalConstant').html(res);
		if(window.cordova)
			ActivityIndicator.hide();
	}
	//Calcul du capital
	else if (setTaux && setDuree && setEcheance)
	{
		var echeance = new Decimal($('#input-echeance').val());
		var duree = new Decimal($('#input-duree').val());
		var taux = new Decimal($('#input-taux').val()).dividedBy(100);

		empruntVar1.taux = taux;
		empruntVar1.duree = duree;
		empruntVar1.echeance = echeance;

		empruntFormData.duree = duree;
		empruntFormData.taux = taux;
		empruntFormData.echeance = echeance;
		empruntFormData.isValid = true;
		$('#saveEmprunt').prop('disabled', false);

		empruntVar2.taux = taux;
		empruntVar2.duree = duree;
		empruntVar2.echeance = echeance;

		var capitalEcheanceConstante = Emprunt.echeanceConstante.calculeCapital(taux, echeance, duree, periodicite);

		var res = "Capital obtenu lors d'un emprunt de " + Emprunt.formatDureeEmprunt(duree, periodicite) + ' à '+ taux.times(100).toFormat(3) + '% par an, échéance constante de '+ echeance.toFormat(2) + '€ :';

		if (capitalEcheanceConstante.isFinite() && !capitalEcheanceConstante.isNegative())
		{
			res += "<div class='resultat'>" + capitalEcheanceConstante.toFormat(2) + '€</div>';
			empruntVar1.capital = capitalEcheanceConstante;
			empruntVar1.isValid = true;
			$('#linkPageTableau').prop('disabled', false);

		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);


		var capitalCapitalConstant = Emprunt.capitalConstant.calculeCapital(taux, echeance, duree, periodicite);
		res = "Capital obtenu lors d'un emprunt de " + Emprunt.formatDureeEmprunt(duree, periodicite) + ' à '+ taux.times(100).toFormat(3) + '% par an, remboursement capital constant avec première échéance de '+ echeance.toFormat(2) + '€ :';

		if (capitalCapitalConstant.isFinite() && !capitalCapitalConstant.isNegative())
		{
			res += "<div class='resultat'>" + capitalCapitalConstant.toFormat(2) + '€</div>';

			if (!capitalCapitalConstant.equals(capitalEcheanceConstante))
			{
				empruntVar2.capital = capitalCapitalConstant;
				empruntVar2.isValid = true;
				$('#linkPageTableau').prop('disabled', false);
			}
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatCapitalConstant').html(res);
	}
	else
	{
		throw new Error("Erreur de determination de l'inconnue");
	}
}

