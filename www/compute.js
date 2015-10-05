function computeTables()
{
	if(!currentEmpruntVariation1.isValid && !currentEmpruntVariation2.isValid)
	{
		alert("Calculez d'abord un emprunt");
		return;
	}
	var output="";

	if(currentEmpruntVariation1.isValid)
	{
		output+="<h3 class='ui-bar ui-bar-a'>"+getEmpruntDescription(currentEmpruntVariation1.capital,currentEmpruntVariation1.taux,currentEmpruntVariation1.duree,currentEmpruntVariation1.periodicite)+", profil &laquo;&nbsp;échéance constante&nbsp;&raquo;</h3>";

		output+="<div class='ui-body'>"+tableauAmortissementEcheanceConstante(currentEmpruntVariation1.capital,currentEmpruntVariation1.taux,currentEmpruntVariation1.duree,currentEmpruntVariation1.periodicite,50)+"</div>";	
		
		output+="<h3 class='ui-bar ui-bar-a'>"+getEmpruntDescription(currentEmpruntVariation1.capital,currentEmpruntVariation1.taux,currentEmpruntVariation1.duree,currentEmpruntVariation1.periodicite)+", profil &laquo;&nbsp;capital constant&nbsp;&raquo;</h3>";

		output+="<div class='ui-body'>"+tableauAmortissementCapitalConstant(currentEmpruntVariation1.capital,currentEmpruntVariation1.taux,currentEmpruntVariation1.duree,currentEmpruntVariation1.periodicite,50)+"</div>";	
	}

	if(currentEmpruntVariation2.isValid)
	{
		output+="<h2>Mais aussi...</h2>";
		output+="<h3 class='ui-bar ui-bar-a'>"+getEmpruntDescription(currentEmpruntVariation2.capital,currentEmpruntVariation2.taux,currentEmpruntVariation2.duree,currentEmpruntVariation2.periodicite)+", profil &laquo;&nbsp;capital constant&nbsp;&raquo;</h3>";

		output+="<div class='ui-body'>"+tableauAmortissementCapitalConstant(currentEmpruntVariation2.capital,currentEmpruntVariation2.taux,currentEmpruntVariation2.duree,currentEmpruntVariation2.periodicite,50)+"</div>";	
		output+="<h3 class='ui-bar ui-bar-a'>"+getEmpruntDescription(currentEmpruntVariation2.capital,currentEmpruntVariation2.taux,currentEmpruntVariation2.duree,currentEmpruntVariation2.periodicite)+", profil &laquo;&nbsp;échéance constante&nbsp;&raquo;</h3>";

		output+="<div class='ui-body'>"+tableauAmortissementEcheanceConstante(currentEmpruntVariation2.capital,currentEmpruntVariation2.taux,currentEmpruntVariation2.duree,currentEmpruntVariation2.periodicite,50)+"</div>";	

	}
		$("#tableau").html(output);

	$("#tableau").trigger("create");
	$.mobile.pageContainer.pagecontainer("change","#pageTableaux",{transition:"none"});


}


function computeMissing()
{
	var nbInputs=0;
	var setCapital=false,setEcheance=false,setTaux=false,setDuree=false;

	currentEmpruntVariation1.echeance=null;
	currentEmpruntVariation1.capital=null;
	currentEmpruntVariation1.duree=null;
	currentEmpruntVariation1.taux=null;
	currentEmpruntVariation1.periodicite=null;
	currentEmpruntVariation1.isValid=false;
	
	currentEmpruntVariation2.echeance=null;
	currentEmpruntVariation2.capital=null;
	currentEmpruntVariation2.duree=null;
	currentEmpruntVariation2.taux=null;
	currentEmpruntVariation2.periodicite=null;
	currentEmpruntVariation2.isValid=false;

	currentEmpruntFormData.echeance=null;
	currentEmpruntFormData.capital=null;
	currentEmpruntFormData.duree=null;
	currentEmpruntFormData.taux=null;
	currentEmpruntFormData.periodicite=null;
	currentEmpruntFormData.isValid=false;

	$("#linkPageTableau").prop('disabled',true);
	$("#saveEmprunt").prop('disabled',true);

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
		alert("Remplissez exactement trois champs puis appuyez sur le bouton pour calculer la grandeur manquante");
		return;
	}

	var periodicite=new Decimal($('#select-periodicite').val());
	currentEmpruntVariation1.periodicite=periodicite;
	currentEmpruntVariation2.periodicite=periodicite;
	currentEmpruntFormData.periodicite=periodicite;

	//Calcul de l'échéance
	if(setCapital && setTaux && setDuree)
	{
		var capital=new Decimal($('#input-capital').val());
		var taux=new Decimal($('#input-taux').val()).dividedBy(100);
		var duree=new Decimal($('#input-duree').val());
		var echeanceConstante=calculeEcheanceConstante(capital,taux,duree,periodicite);

		currentEmpruntVariation1.capital=capital;
		currentEmpruntVariation1.taux=taux;
		currentEmpruntVariation1.duree=duree;
		
		currentEmpruntFormData.capital=capital;
		currentEmpruntFormData.taux=taux;
		currentEmpruntFormData.duree=duree;
		currentEmpruntFormData.isValid=true;
		$("#saveEmprunt").prop('disabled',false);

		var res="Valeur de l'échéance pour un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"% par an pendant "+formatDureeEmprunt(duree,periodicite)+" :";	


		if(echeanceConstante.isFinite()&& !echeanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+echeanceConstante.toFormat(2)+"€</div>";
			currentEmpruntVariation1.echeance=echeanceConstante;
			currentEmpruntVariation1.isValid=true;
			$("#linkPageTableau").prop('disabled',false);
			$("#saveEmprunt").prop('disabled',false);
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
			$("#linkPageTableau").prop('disabled',false);
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
		currentEmpruntVariation1.capital=capital;
		currentEmpruntVariation1.taux=taux;
		currentEmpruntVariation1.echeance=echeance;
		
		currentEmpruntFormData.capital=capital;
		currentEmpruntFormData.taux=taux;
		currentEmpruntFormData.echeance=echeance;
		currentEmpruntFormData.isValid=true;
		$("#saveEmprunt").prop('disabled',false);

		currentEmpruntVariation2.capital=capital;
		currentEmpruntVariation2.taux=taux;
		currentEmpruntVariation2.echeance=echeance;
		
		var dureeEcheanceConstante=calculeDureeEcheanceConstante(capital,taux,echeance,periodicite);

		var res="Durée d'un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"%, échéance "+periodiciteToString(periodicite)+" approchée de "+echeance.toFormat(2)+"€ :";

		if(dureeEcheanceConstante.isFinite() && !dureeEcheanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+formatDureeEmprunt(dureeEcheanceConstante,periodicite)+"</div>";
			currentEmpruntVariation1.duree=dureeEcheanceConstante;
			currentEmpruntVariation1.isValid=true;
			$("#linkPageTableau").prop('disabled',false);

		}
		else
			res+="<div class='resultat'>pas de résultat</div>";


		$('#resultatEcheanceConstante').html(res);	

		var dureeCapitalConstant=calculeDureeCapitalConstant(capital,taux,echeance,periodicite);

		res="Durée d'un emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"%, première échéance "+periodiciteToString(periodicite)+" approchée de "+echeance.toFormat(2)+"€ :";

		if(dureeCapitalConstant.isFinite() && !dureeCapitalConstant.isNegative())
		{
			res+="<div class='resultat'>"+formatDureeEmprunt(dureeCapitalConstant,periodicite)+"</div>";
			if(!dureeCapitalConstant.equals(dureeEcheanceConstante))
			{
				currentEmpruntVariation2.duree=dureeCapitalConstant;
				currentEmpruntVariation2.isValid=true;
			}
			$("#linkPageTableau").prop('disabled',false);
		}
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
		currentEmpruntVariation1.capital=capital;
		currentEmpruntVariation1.duree=duree;
		currentEmpruntVariation1.echeance=echeance;
		
		currentEmpruntFormData.capital=capital;
		currentEmpruntFormData.duree=duree;
		currentEmpruntFormData.echeance=echeance;
		currentEmpruntFormData.isValid=true;
		$("#saveEmprunt").prop('disabled',false);

		currentEmpruntVariation2.capital=capital;
		currentEmpruntVariation2.duree=duree;
		currentEmpruntVariation2.echeance=echeance;

		var tauxEcheanceConstante=calculeTauxEcheanceConstante(capital,echeance,duree,periodicite);


		var res="Taux annuel estimé pour un emprunt de "+capital.toFormat(2)+"€ pendant "+formatDureeEmprunt(duree,periodicite)+", échéance constante de "+echeance.toFormat(2)+"€ :";


		if(tauxEcheanceConstante.isFinite() && !tauxEcheanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+tauxEcheanceConstante.times(100).toFormat(3)+"%</div>";
			currentEmpruntVariation1.taux=tauxEcheanceConstante;
			currentEmpruntVariation1.isValid=true;
			$("#linkPageTableau").prop('disabled',false);
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
			if(!tauxCapitalConstant.equals(tauxEcheanceConstante))
			{
				currentEmpruntVariation2.taux=tauxCapitalConstant;
				currentEmpruntVariation2.isValid=true;
			}
			$("#linkPageTableau").prop('disabled',false);
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
		
		currentEmpruntVariation1.taux=taux;
		currentEmpruntVariation1.duree=duree;
		currentEmpruntVariation1.echeance=echeance;
		
		currentEmpruntFormData.duree=duree;
		currentEmpruntFormData.taux=taux;
		currentEmpruntFormData.echeance=echeance;
		currentEmpruntFormData.isValid=true;
		$("#saveEmprunt").prop('disabled',false);

		currentEmpruntVariation2.taux=taux;
		currentEmpruntVariation2.duree=duree;
		currentEmpruntVariation2.echeance=echeance;

		var capitalEcheanceConstante=calculeCapitalEcheanceConstante(taux,echeance,duree,periodicite);

		var res="Capital obtenu lors d'un emprunt de "+formatDureeEmprunt(duree,periodicite)+" à "+taux.times(100).toFormat(3)+"% par an, échéance constante de "+echeance.toFormat(2)+"€ :";

		if(capitalEcheanceConstante.isFinite() && !capitalEcheanceConstante.isNegative())
		{
			res+="<div class='resultat'>"+capitalEcheanceConstante.toFormat(2)+"€</div>";
			currentEmpruntVariation1.capital=capitalEcheanceConstante;
			currentEmpruntVariation1.isValid=true;
			$("#linkPageTableau").prop('disabled',false);

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
			
			if(!capitalCapitalConstant.equals(capitalEcheanceConstante))
			{
				currentEmpruntVariation2.capital=capitalCapitalConstant;
				currentEmpruntVariation2.isValid=true;
				$("#linkPageTableau").prop('disabled',false);
			}
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

