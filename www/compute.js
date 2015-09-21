function computeTables()
{
	if(currentEmprunt.capital==null ||
			currentEmprunt.echeance==null||
			currentEmprunt.duree==null||
			currentEmprunt.periodicite==null||
			currentEmprunt.taux==null)
		return;

	$.mobile.pageContainer.pagecontainer("change","#pageTableaux",{transition:"none"});

	$("#tableau").html(tableauAmortissementEcheanceConstante(currentEmprunt.capital,currentEmprunt.taux,currentEmprunt.echeance,currentEmprunt.duree,currentEmprunt.periodicite));	

}


function computeMissing()
{
	var nbInputs=0;
	var setCapital=false,setEcheance=false,setTaux=false,setDuree=false;

	currentEmprunt.echeance=null;
	currentEmprunt.capital=null;
	currentEmprunt.duree=null;
	currentEmprunt.taux=null;
	currentEmprunt.periodicite=null;

	if($('#input-capital').val())
	{
		nbInputs++;
		setCapital=true;
	}
	if($('#input-echeance').val())
	{
		nbInputs++;
		setEcheance=true;
	}
	if($('#input-taux').val())
	{
		nbInputs++;
		setTaux=true;
	}
	if($('#input-duree').val())
	{
		nbInputs++;
		setDuree=true;
	}

	if(nbInputs!=3)
	{
		alert("Remplissez exactement trois champs pour appuyez sur le bouton pour calculer la grandeur manquante");
		return;
	}

	var periodicite=new Decimal($('#select-periodicite').val());
	currentEmprunt.periodicite=periodicite;

	//Calcul de l'échéance
	if(setCapital && setTaux && setDuree)
	{
		var capital=new Decimal($('#input-capital').val());
		var taux=new Decimal($('#input-taux').val()).dividedBy(100);
		var duree=new Decimal($('#input-duree').val());
		var echeanceConstante=calculeEcheanceConstante(capital,taux,duree,periodicite);

		currentEmprunt.capital=capital;
		currentEmprunt.taux=taux;
		currentEmprunt.duree=duree;


		var res="Valeur de l'échéance pour un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"% par an pendant "+formatDureeEmprunt(duree,periodicite)+" :";	


		if(echeanceConstante.isFinite()&& !echeanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+echeanceConstante.toFormat(2)+"€</div>";
			currentEmprunt.echeance=echeanceConstante;
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);

		var echeanceCapitalConstant=calculeEcheanceCapitalConstant(capital,taux,duree,periodicite);

		res="Valeur de la première échéance pour un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"% par an pendant "+formatDureeEmprunt(duree,periodicite)+" : ";

		if(echeanceCapitalConstant.isFinite() && !echeanceCapitalConstant.isNegative())
		{
			res+="<div class='resultat'>"+echeanceCapitalConstant.toFormat(2)+"€</div>";
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
					
		$('#resultatCapitalConstant').html(res);	
	}
	//Calcul de la durée
	else if(setEcheance && setTaux && setCapital)
	{
		var capital=new Decimal($('#input-capital').val());
		var taux=new Decimal($('#input-taux').val()).dividedBy(100);
		var echeance=new Decimal($('#input-echeance').val());
		if(echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return;
		}
		var dureeEcheanceConstante=calculeDureeEcheanceConstante(capital,taux,echeance,periodicite);

		var res="Durée d'un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"%, échéance "+periodiciteToString(periodicite)+" approchée de "+echeance.toFormat(2)+"€ :";

		if(dureeEcheanceConstante.isFinite())
			res+="<div class='resultat'>"+formatDureeEmprunt(dureeEcheanceConstante,periodicite)+"</div>";
		else
			res+="<div class='resultat'>pas de résultat</div>";


		$('#resultatEcheanceConstante').html(res);	

		var dureeCapitalConstant=calculeDureeCapitalConstant(capital,taux,echeance,periodicite);

		res="Durée d'un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"%, première échéance "+periodiciteToString(periodicite)+" approchée de "+echeance.toFormat(2)+"€ :";

		if(dureeCapitalConstant.isFinite() && !dureeCapitalConstant.isNegative())
			res+="<div class='resultat'>"+formatDureeEmprunt(dureeCapitalConstant,periodicite)+"</div>";
		else
			res+="<div class='resultat'>pas de résultat</div>";

		$('#resultatCapitalConstant').html(res);	
	}
	//Calcul du taux
	else if(setCapital && setDuree && setEcheance)
	{
		var capital=new Decimal($('#input-capital').val());
		var echeance=new Decimal($('#input-echeance').val());
		var duree=new Decimal($('#input-duree').val());
		if(echeance.greaterThan(capital))
		{
			alert("L'echéance ne peut pas être supérieure au capital !");
			return;
		}
		var tauxEcheanceConstante=calculeTauxEcheanceConstante(capital,echeance,duree,periodicite);


		var res="Taux annuel estimé pour un emprunt de "+capital.toFormat(2)+"€ pendant "+formatDureeEmprunt(duree,periodicite)+", échéance constante de "+echeance.toFormat(2)+"€ :";


		if(tauxEcheanceConstante.isFinite() && !tauxEcheanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+tauxEcheanceConstante.times(100).toFormat(3)+"%</div>";
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);
		
		var tauxCapitalConstant=calculeTauxCapitalConstant(capital,echeance,duree,periodicite);
				
		res="Taux annuel estimé pour un emprunt de "+capital.toFormat(2)+"€ pendant "+formatDureeEmprunt(duree,periodicite)+", première échéance de "+echeance.toFormat(2)+"€, capital constant :";


		if(tauxCapitalConstant.isFinite() && !tauxCapitalConstant.isNegative())
		{
			res+="<div class='resultat'>"+tauxCapitalConstant.times(100).toFormat(3)+"%</div>";
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatCapitalConstant').html(res);

	}
	//Calcul du capital
	else if(setTaux && setDuree && setEcheance)
	{
		var echeance=new Decimal($('#input-echeance').val());
		var duree=new Decimal($('#input-duree').val());
		var taux=new Decimal($('#input-taux').val()).dividedBy(100);

		var capitalEcheanceConstante=calculeCapitalEcheanceConstante(taux,echeance,duree,periodicite);

		var res="Capital obtenu lors d'un emprunt de "+formatDureeEmprunt(duree,periodicite)+" à "+taux.times(100).toFormat(3)+"% par an, échéance constante de "+echeance.toFormat(2)+"€ :";

		if(capitalEcheanceConstante.isFinite() && !capitalEcheanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+capitalEcheanceConstante.toFormat(2)+"€</div>";
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatEcheanceConstante').html(res);


		var capitalCapitalConstant=calculeCapitalCapitalConstant(taux,echeance,duree,periodicite);
		res="Capital obtenu lors d'un emprunt de "+formatDureeEmprunt(duree,periodicite)+" à "+taux.times(100).toFormat(3)+"% par an, remboursement capital constant avec première échéance de "+echeance.toFormat(2)+"€ :";

		if(capitalCapitalConstant.isFinite() && !capitalCapitalConstant.isNegative())
		{
			res+="<div class='resultat'>"+capitalCapitalConstant.toFormat(2)+"€</div>";
		}
		else
		{
			res+="<div class='resultat'>pas de résultat</div>";
		}
		$('#resultatCapitalConstant').html(res);

	}

	else
	{
		throw new Error("Erreur de determination de l'inconnue");		
	}





}

