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

function calculeEcheanceCapitalConstant(capital,tauxAnnuel,duree,periodicite)
{
	var ip=tauxAnnuel.dividedBy(periodicite);
	return capital.times(ip).plus(capital.dividedBy(duree));
}


function calculeDureeEcheanceConstante(capital,tauxAnnuel,echeance,periodicite)
{
	var ip=tauxAnnuel.dividedBy(periodicite);
	var denum=ip.times(capital).minus(echeance);
	var tmp1=echeance.dividedBy(denum).neg().ln();
	var tmp2=ip.plus(Decimal.ONE).ln();
	return tmp1.dividedBy(tmp2).round(Decimal.ROUND_UP);
}

function calculeDureeCapitalConstant(capital,tauxAnnuel,echeance,periodicite)
{
	var ip=tauxAnnuel.dividedBy(periodicite);
	return capital.dividedBy(echeance.minus(capital.times(ip))).round(Decimal.ROUND_UP);
}

function periodiciteToString(periodicite)
{
	var per=periodicite.toString();
	switch(per)
	{
		case "12":return "mensuelle";
		case "4":return "trimestrielle";
		case "2":return "semestrielle";
		case "1":return "annuelle";
	}
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

