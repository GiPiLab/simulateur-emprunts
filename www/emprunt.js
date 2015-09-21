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


function calculeCapitalEcheanceConstante(tauxAnnuel,echeance,duree,periodicite)
{
	var ip=tauxAnnuel.dividedBy(periodicite);
	var puissance=ip.plus(Decimal.ONE).pow(duree);
	var num=puissance.minus(Decimal.ONE).times(echeance);
	var denom=puissance.times(ip);
	return num.dividedBy(denom);
}

function calculeCapitalCapitalConstant(tauxAnnuel,echeance,duree,periodicite)
{
	var ip=tauxAnnuel.dividedBy(periodicite);
	var num=echeance.times(duree);
	var denom=ip.times(duree).plus(Decimal.ONE);
	return num.dividedBy(denom);
}


function calculeTauxEcheanceConstante(capital,echeance,duree,periodicite)
{
	if(capital.equals(echeance.times(duree)))
	{
		return new Decimal(0);
	}
	var maxIter=1000000;

	var tauxAnnuel=new Decimal("0.000001");
	var it=0;
	var increment=new Decimal(100000);

	var sensEstimation=false;

	var echeanceCalculee;
	var maxDivide=new Decimal("0.00001");

	var countBounce=0;

	do
	{
		it++;
		echeanceCalculee=calculeEcheanceConstante(capital,tauxAnnuel,duree,periodicite);
		if(echeanceCalculee.equals(echeance))
		{
			return tauxAnnuel;
		}
		else if(echeanceCalculee.lessThan(echeance))
		{
			tauxAnnuel=tauxAnnuel.plus(increment);
			if(!sensEstimation)
			{
				if(increment.greaterThan(maxDivide))
				{
					increment=increment.dividedBy(10);
				}
				sensEstimation=true;
				countBounce++;
			}
			else
			{
				countBounce=0;
			}
		}
		else
		{
			tauxAnnuel=tauxAnnuel.minus(increment);
			if(sensEstimation)
			{
				if(increment.greaterThan(maxDivide))
				{
					increment=increment.dividedBy(10);
				}
				sensEstimation=false;
				countBounce++;
			}
			else
			{
				countBounce=0;
			}
		}
	}while(it<maxIter && countBounce < 4 && tauxAnnuel.greaterThan(0));

	return tauxAnnuel;

}



function calculeTauxCapitalConstant(capital,echeance,duree,periodicite)
{
	var ke=capital.dividedBy(duree);
	var ipe0=echeance.minus(ke);
	var i=ipe0.dividedBy(capital);
	return i.times(periodicite);
}


function getEmpruntDescription(capital,echeance,taux,duree,periodicite)
{
	return "Emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"% pendant "+formatDureeEmprunt(duree,periodicite);

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

function tableauAmortissementEcheanceConstante(capital,taux,echeance,duree,periodicite)
{
	var output="<table class='ui-responsive' id='tbl1' data-mode='columntoggle' data-role='table'><thead><tr><th>ieme</th><th>Date</<th><th>Echéance</th><th>Capital</th><th>Intérêts</th><th>Reste à payer</th></tr></thead><tbody>";

	var sumKe=new Decimal(0);
	var sumIpe=new Decimal(0);
	var sumEch=new Decimal(0);
	var ipe1=capital.times(taux.dividedBy(periodicite));
	var ke1=echeance.minus(ipe1);
	var crd1=capital.minus(ke1);

	sumKe=sumKe.plus(ke1);
	sumIpe=sumIpe.plus(ipe1);
	sumEch=sumEch.plus(echeance);
		output+="<tr><th>1</th><td>&nbsp;</td><td>"+echeance.toFormat(2)
			+"</td><td>"+ke1.toFormat(2)+"</td><td>"+ipe1.toFormat(2)+
			"</td><td>"+crd1.toFormat(2)+"</td></tr>";

	for(var i=2;i<=duree;i++)
	{
		var ipe=crd1.times(taux.dividedBy(periodicite));
		var ke=echeance.minus(ipe);
		var crd=crd1.minus(ke);

		sumKe=sumKe.plus(ke);
		sumIpe=sumIpe.plus(ipe);
		sumEch=sumEch.plus(echeance);
		
		output+="<tr><th>"+i+"</th><td>&nbsp;</td><td>"+echeance.toFormat(2)
			+"</td><td>"+ke.toFormat(2)+"</td><td>"+ipe.toFormat(2)+
			"</td><td>"+crd.toFormat(2)+"</td></tr>";
		ipe1=ipe;
		ke1=ke;
		crd1=crd;
	}
	output+="</tbody></table>";
	return output;
}


function tableauAmortissementCapitalConstant(capital,taux,echeance,duree,periodicite)
{
	var output="<table><tr><th>ieme</th><th>Date</<th><th>Echéance</th><th>Capital</th><th>Intérêts</th><th>Reste à payer</th></tr>";

}





