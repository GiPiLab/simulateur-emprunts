function calculeEcheanceConstante(capital,tauxAnnuel,duree,periodicite)
{
	if(tauxAnnuel.isZero())
	{
		return capital.dividedBy(duree);
	}

	var ip=tauxAnnuel.dividedBy(periodicite);
	var puissance=ip.plus(Decimal.ONE).pow(-duree);
	return capital.times(ip).dividedBy(Decimal.ONE.minus(puissance));
}


function formatDureeEmprunt(duree,periodicite)
{
	var text;
	var dur=duree.toString();
	var per=periodicite.toString();
	switch(per)
	{
		case "12":text=dur+" mois";
			break;
		case "4":text=dur+" trimestre";
		       if(duree>=2)
			       text+="s";
		       break;
		case "2":text=dur+" semestre";
		       if(duree>=2)
			       text+="s";
		       break;
		case "1":text=dur+" an";
		       if(duree>=2)
			       text+="s";
		       break;
		default:
		       console.log("undefined periodicite");
		       return;
	}
	return text;
}

