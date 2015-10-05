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

	while(it<maxIter && countBounce < 4 && tauxAnnuel.greaterThan(0))
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
	};

	if(it==maxIter || tauxAnnuel.isNeg())
	{
		return new Decimal(-1);
	}

	else return tauxAnnuel;

}



function calculeTauxCapitalConstant(capital,echeance,duree,periodicite)
{
	var ke=capital.dividedBy(duree);
	var ipe0=echeance.minus(ke);
	var i=ipe0.dividedBy(capital);
	return i.times(periodicite);
}


function getEmpruntDescription(capital,taux,duree,periodicite)
{
	return "Emprunt de "+capital.toFormat(2)+"€ à "+taux.times(100).toFormat(3)+"% pendant "+formatDureeEmprunt(duree,periodicite);

}


function formatEmpruntQuery(capital,taux,duree,echeance,periodicite)
{
	if(periodicite===null)
	{
		throw new Error("Invalid emprunt, need periodicite");
	}

	periodicite=new Decimal(periodicite);

	if(capital==null && taux!==null && duree!==null && echeance!==null)
	{
		var taux=new Decimal(taux);
		var echeance=new Decimal(echeance);
		var out="<h1>Calcul du capital</h1><p>échéance approchée = "+echeance.toFormat(2)+"€";
		out+=" ; taux annuel = "+taux.times(100).toFormat(3)+"%";
		out+=" ; durée = "+formatDureeEmprunt(duree,periodicite)+"</p>";
		return out;
	}
	else if(capital!==null && taux==null && duree!==null && echeance!==null)
	{
		var capital=new Decimal(capital);
		var echeance=new Decimal(echeance);
		var out="<h1>Calcul du taux</h1><p>échéance approchée = "+echeance.toFormat(2)+"€";
		out+=" ; somme empruntée = "+capital.toFormat(2)+"€";
		out+=" ; durée = "+formatDureeEmprunt(duree,periodicite)+"</p>";
		return out;
	}
	else if(capital!==null && taux!==null && duree==null && echeance!==null)
	{
		var taux=new Decimal(taux);
		var echeance=new Decimal(echeance);
		var capital=new Decimal(capital);
		var out="<h1>Calcul de la durée</h1><p>échéance approchée = "+echeance.toFormat(2)+"€";
		out+=" ; somme empruntée = "+capital.toFormat(2)+"€";
		out+=" ; taux annuel = "+taux.times(100).toFormat(3)+"% ; périodicité "+periodiciteToString(periodicite)+"</p>";
		return out;
	}
	else if(capital!==null && taux!==null && duree!==null && echeance==null)
	{
		var capital=new Decimal(capital);
		var taux=new Decimal(taux);
		
		var out="<h1>Calcul de l'échéance</h1><p>somme empruntée = "+capital.toFormat(2)+"€";
		out+=" ; taux annuel = "+taux.times(100).toFormat(3)+"%";
		out+=" ; durée = "+formatDureeEmprunt(duree,periodicite)+"</p>";
		return out;
	}
	else
	{
		throw new Error("Invalid parameters");
	}
}


function periodiciteToString(periodicite)
{
	var per=periodicite.toNumber();
	switch(per)
	{
		case 12:return "mensuelle";
		case 4:return "trimestrielle";
		case 2:return "semestrielle";
		case 1:return "annuelle";
		default:
		       throw("Undefined periodicite");
	}
}



function formatDureeEmprunt(duree,periodicite)
{
	var text;
	var dur=duree.toString();
	var per=periodicite.toNumber();
	switch(per)
	{
		case 12:text=dur+" mois";
			break;
		case 4:text=dur+" trimestre";
		       if(duree>=2)
			       text+="s";
		       break;
		case 2:text=dur+" semestre";
		       if(duree>=2)
			       text+="s";
		       break;
		case 1:text=dur+" an";
		       if(duree>=2)
			       text+="s";
		       break;
		default:
		       throw("undefined periodicite");
	}
	return text;
}

function tableauAmortissementEcheanceConstante(capital,taux,duree,periodicite,breakpoint)
{
	var echeance=calculeEcheanceConstante(capital,taux,duree,periodicite);
	var rand=Math.floor(Math.random()*1000+1).toString();
	var output="<table class='ui-responsive' id='tbl"+rand+"' data-role='table'><thead><tr><th>ieme</th><th>Date</<th><th style='text-align:right'>Echéance</th><th style='text-align:right'>Capital</th><th style='text-align:right'>Intérêts</th><th style='text-align:right'>Reste à payer</th></tr></thead><tbody>";

	var tauxPer=taux.dividedBy(periodicite);
	var ipe=capital.times(tauxPer);
	var ke=echeance.minus(ipe);
	var crd=capital.minus(ke);

	var sumKe=new Decimal(0);
	var sumIpe=new Decimal(0);
	var sumEch=new Decimal(0);

	var date=Date.today();

	
	var per=periodicite.toNumber();

	for(var i=1;i<=duree;i++)
	{
		if(crd.isNegative())
		{
			crd=crd.absoluteValue();
			if(i!=duree)
				throw("Error with premature negative crd");
		}

		if(i<breakpoint || i>=duree-2)
		{
		output+="<tr><th>"+i+"</th><td>"+date.toString('dd-MM-yyyy')+"</td><td style='text-align:right'>"+echeance.toFormat(2)
			+"</td><td style='text-align:right'>"+ke.toFormat(2)+"</td><td style='text-align:right'>"+ipe.toFormat(2)+
			"</td><td style='text-align:right'>"+crd.toFormat(2)+"</td></tr>";
		}
		else if(i==breakpoint)
		{
			output+="<tr><th>...</th><td>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td></tr>";
		}
		
		switch(per)
		{
			case 12:
				date=date.add({months:1});
				break;
			case 4:
				date=date.add({months:3});
				break;
			case 2:
				date=date.add({months:6});
				break;
			case 1:
				date=date.add({months:12});
				break;
			default:
				throw("Invalid periodicite");

		}
		
		sumKe=sumKe.plus(ke);
		sumIpe=sumIpe.plus(ipe);
		sumEch=sumEch.plus(echeance);

		ipe=crd.times(tauxPer);
		ke=echeance.minus(ipe);
		crd=crd.minus(ke);
	}

		output+="<tr><th>TOTAL</th><td>&nbsp;</td><td style='text-align:right'><b>"+sumEch.toFormat(2)
			+"</b></td><td style='text-align:right'><b>"+sumKe.toFormat(2)+"</b></td><td style='text-align:right'><b>"+sumIpe.toFormat(2)+
			"</b></td><td>&nbsp;</td></tr></tbody></table>";


	output+="</tbody></table>";
	return output;
}

function tableauAmortissementCapitalConstant(capital,taux,duree,periodicite,breakpoint)
{
	var echeance=calculeEcheanceCapitalConstant(capital,taux,duree,periodicite);
	var rand=Math.floor(Math.random()*1000+1).toString();
	var output="<table class='ui-responsive' id='tbl"+rand+"' data-role='table'><thead><tr><th>ieme</th><th>Date</<th><th style='text-align:right'>Echéance</th><th style='text-align:right'>Capital</th><th style='text-align:right'>Intérêts</th><th style='text-align:right'>Reste à payer</th></tr></thead><tbody>";

	var tauxPer=taux.dividedBy(periodicite);
	var ipe=capital.times(tauxPer);
	var ke=capital.dividedBy(duree);
	var crd=capital.minus(ke);


	var sumKe=new Decimal(0);
	var sumIpe=new Decimal(0);
	var sumEch=new Decimal(0);

	var date=Date.today();

	
	var per=periodicite.toNumber();

	for(var i=1;i<=duree;i++)
	{
		if(crd.isNegative())
		{
			crd=crd.absoluteValue();
			if(i!=duree)
				throw("Error with premature negative crd");
		}

	
		if(i<breakpoint || i>=duree-2)
		{
			output+="<tr><th>"+i+"</th><td>"+date.toString('dd-MM-yyyy')+"</td><td style='text-align:right'>"+echeance.toFormat(2)
				+"</td><td style='text-align:right'>"+ke.toFormat(2)+"</td><td style='text-align:right'>"+ipe.toFormat(2)+
				"</td><td style='text-align:right'>"+crd.toFormat(2)+"</td></tr>";
		}
		else if(i==breakpoint)
		{
			output+="<tr><th>...</th><td>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td></tr>";
		}
		
		switch(per)
		{
			case 12:
				date=date.add({months:1});
				break;
			case 4:
				date=date.add({months:3});
				break;
			case 2:
				date=date.add({months:6});
				break;
			case 1:
				date=date.add({months:12});
				break;
			default:
				throw("Invalid periodicite");

		}


		sumKe=sumKe.plus(ke);
		sumIpe=sumIpe.plus(ipe);
		sumEch=sumEch.plus(echeance);

		ipe=crd.times(tauxPer);
		crd=crd.minus(ke);
		echeance=ipe.plus(ke);
	}

		output+="<tr><th>TOTAL</th><td>&nbsp;</td><td style='text-align:right'><b>"+sumEch.toFormat(2)
			+"</b></td><td style='text-align:right'><b>"+sumKe.toFormat(2)+"</b></td><td style='text-align:right'><b>"+sumIpe.toFormat(2)+
			"</b></td><td>&nbsp;</td></tr></tbody></table>";


	output+="</tbody></table>";
	return output;
}







