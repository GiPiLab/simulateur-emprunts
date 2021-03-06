/*
 * Copyright Laboratoire de Recherche pour le Développement Local,
 * Thibault Mondary et Gilbert Mondary, 2008-
 * 
 * labo@gipilab.org
 * 
 * Ce logiciel est un programme informatique servant à effectuer des simulations
 * d'emprunts. 
 * 
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA 
 * sur le site "http://www.cecill.info".
 * 
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme, le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * 
 * A cet égard l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement, à l'utilisation, à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant 
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à 
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant des connaissances informatiques approfondies. Les
 * utilisateurs sont donc invités à charger et tester l'adéquation du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement, 
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité. 
 * 
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez 
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
*/

'use strict';

/*
 * Fonctions liant emprunt.js et l'interface graphique
 */



/*
 * Demande une date de début de l'emprunt, en utilisant le plugin natif si sur mobile,
 * puis calcule et affiche les tableaux d'amortissement associés à currentEmpruntVariation1 et 2
 * Affiche les tableaux dans #divTableaux et change la page courante
 */
function getDateAndComputeTables(currentEmpruntVariation1, currentEmpruntVariation2)
{
	if (currentEmpruntVariation1 === undefined || currentEmpruntVariation2 === undefined)
	{
		throw new Error('Missing arguments');
	}

	if(typeof datePicker==="object")
	{
		datePicker.show({date:new Date(),mode:"date",titleText:"Date de première échéance"},function(date){
			computeTables(currentEmpruntVariation1,currentEmpruntVariation2,date);
		},function(error){
			//If click on cancel, returns
			return;
			//computeTables(currentEmpruntVariation1,currentEmpruntVariation2,new Date());
		});
	}
	else
	{
		computeTables(currentEmpruntVariation1,currentEmpruntVariation2,new Date());
	}
}

/*
 * Calcule et affiche un tableau d'amortissement mémorisé
 * savedTable contient : empruntData un emprunt, dateDebut une date et modeCalculTableau
 * valant soit "echeanceConstante" soit "capitalConstant"
 * Affiche le tableau dans #divTableaux et change la page courante
 */
function computeSavedTable(savedTable)
{
	if(savedTable===undefined)
	{
		throw new Error('Missing arguments');
	}
	if(savedTable.empruntData===undefined ||savedTable.dateDebut===undefined || savedTable.modeCalculTableau===undefined)
	{
		throw new Error("Bad table type");
	}
	
	var output = '';


	if(typeof ProgressIndicator!=="undefined")
		ProgressIndicator.showSimpleWithLabel(true,"Patienter...");
		

	if(savedTable.modeCalculTableau==="echeanceConstante")
	{
		var tbl1=Emprunt.echeanceConstante.tableauAmortissement(savedTable.empruntData, 1000,savedTable.dateDebut);
		output += "<h3 class='ui-bar ui-bar-a'>" + Emprunt.getEmpruntDescription(savedTable.empruntData.capital, savedTable.empruntData.taux, savedTable.empruntData.duree, savedTable.empruntData.periodicite) + ', profil &laquo;&nbsp;échéance constante&nbsp;&raquo;</h3>';
		output+="<div class='ui-body'>"+tbl1.tableauHtml+"</div>";

	}

	else if(savedTable.modeCalculTableau==="capitalConstant")
	{
		var tbl2=Emprunt.capitalConstant.tableauAmortissement(savedTable.empruntData, 1000,savedTable.dateDebut);
		output += "<h3 class='ui-bar ui-bar-b'>" + Emprunt.getEmpruntDescription(savedTable.empruntData.capital, savedTable.empruntData.taux, savedTable.empruntData.duree, savedTable.empruntData.periodicite) + ', profil &laquo;&nbsp;capital constant&nbsp;&raquo;</h3>';
		output+="<div class='ui-body'>"+tbl2.tableauHtml+"</div>";
	}

	else
	{
		if(typeof ProgressIndicator!=="undefined")	
			ProgressIndicator.hide();
		throw new Error("Invalid modeCalculTableau");
	}

	$('#divTableaux').html(output);
	$('#divTableaux').trigger('create');
	
	$.mobile.pageContainer.pagecontainer('change', '#pageTableaux', {transition: 'none'});

	if(typeof ProgressIndicator!=="undefined")	
		ProgressIndicator.hide();

}

/* 
 * Calcule et affiche les tableaux d'amortissement associés à currentEmpruntVariation1 et 2
 * Affiche les tableaux dans #divTableaux et change la page courante
 */
function computeTables(currentEmpruntVariation1, currentEmpruntVariation2, dateDebut)
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


	if(typeof ProgressIndicator!=="undefined")
		ProgressIndicator.showSimpleWithLabel(true,"Patienter...");

		
	if (currentEmpruntVariation1.isValid)
	{
		var tbl1=Emprunt.echeanceConstante.tableauAmortissement(currentEmpruntVariation1, 360,dateDebut);
		var tbl2=Emprunt.capitalConstant.tableauAmortissement(currentEmpruntVariation1, 360,dateDebut);

		output += "<div data-role='collapsible' data-theme='a'><h3>" + Emprunt.getEmpruntDescription(currentEmpruntVariation1.capital, currentEmpruntVariation1.taux, currentEmpruntVariation1.duree, currentEmpruntVariation1.periodicite) + ', profil &laquo;&nbsp;échéance constante&nbsp;&raquo;<br>Coût total de l\'emprunt : '+tbl1.coutTotalEmprunt.toFormat(2)+'€</h3>';

		output += "<div><a href='#' class='ui-btn btnSaveTbl1'>Mémoriser</a>" + tbl1.tableauHtml + "</div><a href='#' class='ui-btn btnSaveTbl1'>Mémoriser</a></div>";

		output += "<div data-role='collapsible' data-theme='b'><h3>" + Emprunt.getEmpruntDescription(currentEmpruntVariation1.capital, currentEmpruntVariation1.taux, currentEmpruntVariation1.duree, currentEmpruntVariation1.periodicite) + ', profil &laquo;&nbsp;capital constant&nbsp;&raquo;<br>Coût total de l\'emprunt : '+tbl2.coutTotalEmprunt.toFormat(2)+'€</h3>';

		output += "<div><a href='#' class='ui-btn btnSaveTbl2'>Mémoriser</a>" + tbl2.tableauHtml + "</div><a href='#' class='ui-btn btnSaveTbl2'>Mémoriser</a></div>";
	}

	if (currentEmpruntVariation2.isValid)
	{
		var tbl3=Emprunt.capitalConstant.tableauAmortissement(currentEmpruntVariation2, 360,dateDebut);
		var tbl4=Emprunt.echeanceConstante.tableauAmortissement(currentEmpruntVariation2, 360,dateDebut);


		output += '<h2>Mais aussi...</h2>';
		output += "<div data-role='collapsible' data-theme='b'><h3>" + Emprunt.getEmpruntDescription(currentEmpruntVariation2.capital, currentEmpruntVariation2.taux, currentEmpruntVariation2.duree, currentEmpruntVariation2.periodicite) + ', profil &laquo;&nbsp;capital constant&nbsp;&raquo;<br>Coût total de l\'emprunt : '+tbl3.coutTotalEmprunt.toFormat(2)+'€</h3>';

		output += "<div><a href='#' class='ui-btn btnSaveTbl3'>Mémoriser</a>" + tbl3.tableauHtml + "</div><a href='#' class='ui-btn btnSaveTbl3'>Mémoriser</a></div>";
		output += "<div data-role='collapsible' data-theme='a'><h3>" + Emprunt.getEmpruntDescription(currentEmpruntVariation2.capital, currentEmpruntVariation2.taux, currentEmpruntVariation2.duree, currentEmpruntVariation2.periodicite) + ', profil &laquo;&nbsp;échéance constante&nbsp;&raquo;<br>Coût total de l\'emprunt : '+tbl4.coutTotalEmprunt.toFormat(2)+'€</h3>';

		output += "<div><a href='#' class='ui-btn btnSaveTbl4'>Mémoriser</a>" + tbl4.tableauHtml + "</div><a href='#' class='ui-btn btnSaveTbl4'>Mémoriser</a></div>";

	}

	$('#divTableaux').html(output);
	$('#divTableaux').trigger('create');
	
	$('.btnSaveTbl1').click(function(){saveTable(currentEmpruntVariation1,dateDebut,"echeanceConstante");});
	$('.btnSaveTbl2').click(function(){saveTable(currentEmpruntVariation1,dateDebut,"capitalConstant");});
	$('.btnSaveTbl3').click(function(){saveTable(currentEmpruntVariation2,dateDebut,"capitalConstant");});
	$('.btnSaveTbl4').click(function(){saveTable(currentEmpruntVariation2,dateDebut,"echeanceConstante");});

	$.mobile.pageContainer.pagecontainer('change', '#pageTableaux', {transition: 'none'});
	if(typeof ProgressIndicator!=="undefined")	
		ProgressIndicator.hide();
}


/* 
 * Lit les données sur l'interface et calcule la grandeur manquante en modifiant
 * empruntVar1, empruntVar2 (les emprunts avec le résultat calculé en échéance constante et capital contant)
 * et empruntFormData (contient seulement les champs renseignés, pas le résultat, utilisé pour mémoriser les questions posées)
 * 
 * Affiche les résultats dans #resultatEcheanceConstante et #resultatCapitalConstant et déverouille les boutons
 * Retourne faux si les elements saisis sont incorrects
 */
function computeMissing(empruntVar1, empruntVar2, empruntFormData)
{
	if (empruntVar1 === undefined || empruntVar2 === undefined || empruntFormData === undefined)
	{
		throw new Error('Missing parameters');
		return false;
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
		return false;
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
			console.log(echeanceConstante.toString());
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
			console.log(echeanceCapitalConstant.toString());
		}

		$('#resultatCapitalConstant').html(res);
	}
	//Calcul de la durée
	else if (setEcheance && setTaux && setCapital)
	{
		capital = new Decimal($('#input-capital').val());
		taux = new Decimal($('#input-taux').val()).dividedBy(100);
		var echeance = new Decimal($('#input-echeance').val());
		if (echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return false;
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

		res = "Durée d'un emprunt de " + capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '%, échéance '+ Emprunt.periodiciteToString(periodicite) + ' approchée de '+ echeance.toFormat(2) + '€ :';

		if (dureeEcheanceConstante.isFinite() && !dureeEcheanceConstante.isNegative())
		{
			res += "<div class='resultat'>" + Emprunt.formatDureeEmprunt(dureeEcheanceConstante, periodicite) + '</div>';
			empruntVar1.duree = dureeEcheanceConstante;
			if(dureeEcheanceConstante.lessThan(Emprunt.MAXDUREE))
			{
				empruntVar1.isValid = true;			
			}
			else
			{
				res+="<p style='text-align:center;font-size:small'>(durée trop importante, le tableau ne sera pas affiché)</p>";
			}
			$('#linkPageTableau').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
			console.log(dureeEcheanceConstante.toString());
		}


		$('#resultatEcheanceConstante').html(res);

		var dureeCapitalConstant = Emprunt.capitalConstant.calculeDuree(capital, taux, echeance, periodicite);

		res = "Durée d'un emprunt de " + capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '%, première échéance '+ Emprunt.periodiciteToString(periodicite) + ' approchée de '+ echeance.toFormat(2) + '€ :';

		if (dureeCapitalConstant.isFinite() && !dureeCapitalConstant.isNegative())
		{
			res += "<div class='resultat'>" + Emprunt.formatDureeEmprunt(dureeCapitalConstant, periodicite) + '</div>';
			if (!dureeCapitalConstant.equals(dureeEcheanceConstante))
			{
				empruntVar2.duree = dureeCapitalConstant;
				if(dureeCapitalConstant.lessThan(Emprunt.MAXDUREE))
				{
					empruntVar2.isValid = true;
				}
				else
				{
					res+="<p style='text-align:center;font-size:small'>(durée trop importante, le tableau ne sera pas affiché)</p>";
				}
			}
			$('#linkPageTableau').prop('disabled', false);
		}
		else
		{
			res += "<div class='resultat'>pas de résultat</div>";
			console.log(dureeCapitalConstant.toString());
		}

		$('#resultatCapitalConstant').html(res);
	}
	//Calcul du taux
	else if (setCapital && setDuree && setEcheance)
	{
		capital = new Decimal($('#input-capital').val());
		echeance = new Decimal($('#input-echeance').val());
		duree = new Decimal($('#input-duree').val());
		if (echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return false;
		}
		if(typeof ProgressIndicator!=="undefined")
		ProgressIndicator.showSimpleWithLabel(true,"Patienter...");

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
		res = 'Taux annuel estimé pour un emprunt de '+ capital.toFormat(2) + '€ pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite) + ', échéance constante de '+ echeance.toFormat(2) + '€ :';


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
			console.log(tauxEcheanceConstante.toString());
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
			console.log(tauxCapitalConstant.toString());
		}
		$('#resultatCapitalConstant').html(res);
		if(typeof ProgressIndicator!=="undefined")
			ProgressIndicator.hide();
	}
	//Calcul du capital
	else if (setTaux && setDuree && setEcheance)
	{
		echeance = new Decimal($('#input-echeance').val());
		duree = new Decimal($('#input-duree').val());
		taux = new Decimal($('#input-taux').val()).dividedBy(100);

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

		res = "Capital obtenu lors d'un emprunt de " + Emprunt.formatDureeEmprunt(duree, periodicite) + ' à '+ taux.times(100).toFormat(3) + '% par an, échéance constante de '+ echeance.toFormat(2) + '€ :';

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
			console.log(capitalEcheanceConstante.toString());
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
			console.log(capitalCapitalConstant.toString());
		}
		$('#resultatCapitalConstant').html(res);
	}
	else
	{
		throw new Error("Erreur de determination de l'inconnue");
		return false;
	}
	return true;
}

