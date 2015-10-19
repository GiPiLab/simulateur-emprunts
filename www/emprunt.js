'use strict';


var Emprunt = {

	//Prototype for an emprunt data structure
	empruntData: function()
	{
		var that = this;
		that.reset = function()
		{
			that.capital = null;
			that.echeance = null;
			that.taux = null;
			that.duree = null;
			that.periodicite = null;
			that.isValid = false;
		};
		that.reset();
	},
	periodiciteToString: function(periodicite)
	{
		if (periodicite === undefined || periodicite === null)
		{
			throw new Error('undefined periodicite');
		}
		var per = periodicite.toNumber();
		switch (per)
		{
			case 12: return 'mensuelle';
			case 4: return 'trimestrielle';
			case 2: return 'semestrielle';
			case 1: return 'annuelle';
			default:
			       throw new RangeError('Invalid periodicite');
		}
	},

	formatDureeEmprunt: function(duree, periodicite)
	{
		if (duree === undefined || periodicite === undefined || duree === null || periodicite === null)
		{
			throw new Error('Missing parameters');
		}
		var text;
		var dur = duree.toString();
		var per = periodicite.toNumber();
		switch (per)
		{
			case 12: text = dur + ' mois';
				break;
			case 4: text = dur + ' trimestre';
			       if (duree >= 2)
				       text += 's';
			       break;
			case 2: text = dur + ' semestre';
			       if (duree >= 2)
				       text += 's';
			       break;
			case 1: text = dur + ' an';
			       if (duree >= 2)
				       text += 's';
			       break;
			default:
			       throw new RangeError('Invalid periodicite');
		}
		return text;
	},


	getEmpruntDescription: function(capital, taux, duree, periodicite)
	{
		if (capital === undefined || taux === undefined || duree === undefined || periodicite === undefined)
		{
			throw new Error('Missing parameters');
		}
		return 'Emprunt de '+ capital.toFormat(2) + '€ à '+ taux.times(100).toFormat(3) + '% pendant '+ Emprunt.formatDureeEmprunt(duree, periodicite);
	},

	formatEmpruntQuery: function(capital, taux, duree, echeance, periodicite)
	{
		if (periodicite === undefined || capital === undefined || taux === undefined || duree === undefined
				|| echeance === undefined)
		{
			throw new Error('Invalid emprunt, missing arguments');
		}

		periodicite = new Decimal(periodicite);

		if (capital === null && taux !== null && duree !== null && echeance !== null)
		{
			var dTaux = new Decimal(taux);
			var dEcheance = new Decimal(echeance);
			var out = '<h1>Calcul du capital</h1><p>échéance approchée = '+ dEcheance.toFormat(2) + '€';
			out += ' ; taux annuel = '+ dTaux.times(100).toFormat(3) + '%';
			out += ' ; durée = '+ Emprunt.formatDureeEmprunt(duree, periodicite) + '</p>';
			return out;
		}
		else if (capital !== null && taux === null && duree !== null && echeance !== null)
		{
			var dCapital = new Decimal(capital);
			var dEcheance = new Decimal(echeance);
			var out = '<h1>Calcul du taux</h1><p>échéance approchée = '+ dEcheance.toFormat(2) + '€';
			out += ' ; somme empruntée = '+ dCapital.toFormat(2) + '€';
			out += ' ; durée = '+ Emprunt.formatDureeEmprunt(duree, periodicite) + '</p>';
			return out;
		}
		else if (capital !== null && taux !== null && duree === null && echeance !== null)
		{
			var dTaux = new Decimal(taux);
			var dEcheance = new Decimal(echeance);
			var dCapital = new Decimal(capital);
			var out = '<h1>Calcul de la durée</h1><p>échéance approchée = '+ dEcheance.toFormat(2) + '€';
			out += ' ; somme empruntée = '+ dCapital.toFormat(2) + '€';
			out += ' ; taux annuel = '+ dTaux.times(100).toFormat(3) + '% ; périodicité '+ Emprunt.periodiciteToString(periodicite) + '</p>';
			return out;
		}
		else if (capital !== null && taux !== null && duree !== null && echeance === null)
		{
			var dCapital = new Decimal(capital);
			var dTaux = new Decimal(taux);

			var out = "<h1>Calcul de l'échéance</h1><p>somme empruntée = " + dCapital.toFormat(2) + '€';
			out += ' ; taux annuel = '+ dTaux.times(100).toFormat(3) + '%';
			out += ' ; durée = '+ Emprunt.formatDureeEmprunt(duree, periodicite) + '</p>';
			return out;
		}
		else
		{
			throw new Error('Invalid parameters');
		}
	},

	//Static methods, will not update empruntData
	echeanceConstante: {

		calculeEcheance: function(capital, tauxAnnuel, duree, periodicite)
		{
			if (capital === undefined || tauxAnnuel === undefined || duree === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			if (tauxAnnuel.isZero())
			{
				return capital.dividedBy(duree);
			}

			var ip = tauxAnnuel.dividedBy(periodicite);
			var puissance = ip.plus(Decimal.ONE).pow(-duree);
			return capital.times(ip).dividedBy(Decimal.ONE.minus(puissance));
		},

		calculeDuree: function(capital, tauxAnnuel, echeance, periodicite)
		{
			if (capital === undefined || tauxAnnuel === undefined || echeance === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ip = tauxAnnuel.dividedBy(periodicite);
			var denum = ip.times(capital).minus(echeance);
			var tmp1 = echeance.dividedBy(denum).neg().ln();
			var tmp2 = ip.plus(Decimal.ONE).ln();
			return tmp1.dividedBy(tmp2).round(Decimal.ROUND_UP);
		},
		calculeCapital: function(tauxAnnuel, echeance, duree, periodicite)
		{
			if (duree === undefined || tauxAnnuel === undefined || echeance === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ip = tauxAnnuel.dividedBy(periodicite);
			var puissance = ip.plus(Decimal.ONE).pow(duree);
			var num = puissance.minus(Decimal.ONE).times(echeance);
			var denom = puissance.times(ip);
			return num.dividedBy(denom);
		},
		calculeTaux: function(capital, echeance, duree, periodicite)
		{
			if (capital === undefined || duree === undefined || echeance === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			if (capital.equals(echeance.times(duree)))
			{
				return new Decimal(0);
			}
			var maxIter = 1000000;

			var tauxAnnuel = new Decimal('0.000001');
			var it = 0;
			var increment = new Decimal(100000);

			var sensEstimation = false;

			var echeanceCalculee;
			var maxDivide = new Decimal('0.00001');

			var countBounce = 0;

			while (it < maxIter && countBounce < 4 && tauxAnnuel.greaterThan(0))
			{
				it++;
				echeanceCalculee = Emprunt.echeanceConstante.calculeEcheance(capital, tauxAnnuel, duree, periodicite);
				if (echeanceCalculee.equals(echeance))
				{
					return tauxAnnuel;
				}
				else if (echeanceCalculee.lessThan(echeance))
				{
					tauxAnnuel = tauxAnnuel.plus(increment);
					if (!sensEstimation)
					{
						if (increment.greaterThan(maxDivide))
						{
							increment = increment.dividedBy(10);
						}
						sensEstimation = true;
						countBounce++;
					}
					else
					{
						countBounce = 0;
					}
				}
				else
				{
					tauxAnnuel = tauxAnnuel.minus(increment);
					if (sensEstimation)
					{
						if (increment.greaterThan(maxDivide))
						{
							increment = increment.dividedBy(10);
						}
						sensEstimation = false;
						countBounce++;
					}
					else
					{
						countBounce = 0;
					}
				}
			}

			if (it === maxIter || tauxAnnuel.isNeg())
			{
				return new Decimal(-1);
			}

			else return tauxAnnuel;
		},

		tableauAmortissement: function(emprunt, breakpoint)
		{
			if (emprunt === undefined || breakpoint === undefined)
			{
				throw new Error('Missing arguments');
			}

			if (emprunt.capital === undefined || emprunt.duree === undefined || emprunt.taux === undefined || emprunt.periodicite === undefined || emprunt.isValid === undefined)
			{
				throw new TypeError('Invalid object type emprunt !');
			}

			if (emprunt.isValid === false)
			{
				throw new Error('Not a valid, computable emprunt');
			}

			var echeance = Emprunt.echeanceConstante.calculeEcheance(emprunt.capital, emprunt.taux, emprunt.duree, emprunt.periodicite);
			var rand = Math.floor(Math.random() * 1000 + 1).toString();
			var output = "<table class='ui-responsive' id='tbl" + rand + "' data-role='table'><thead><tr><th>ieme</th><th>Date</<th><th style='text-align:right'>Echéance</th><th style='text-align:right'>Capital</th><th style='text-align:right'>Intérêts</th><th style='text-align:right'>Reste à payer</th></tr></thead><tbody>";

			var tauxPer = emprunt.taux.dividedBy(emprunt.periodicite);
			var ipe = emprunt.capital.times(tauxPer);
			var ke = echeance.minus(ipe);
			var crd = emprunt.capital.minus(ke);

			var sumKe = new Decimal(0);
			var sumIpe = new Decimal(0);
			var sumEch = new Decimal(0);

			var date = Date.today();

			var per = emprunt.periodicite.toNumber();

			for (var i = 1; i <= emprunt.duree; i++)
			{
				if (crd.isNegative())
				{
					crd = crd.absoluteValue();
					if (i != emprunt.duree)
						throw new RangeError('Error with premature negative crd');
				}

				if (i < breakpoint || i >= emprunt.duree - 2)
				{
					output += '<tr><th>'+ i + '</th><td>'+ date.toString('dd-MM-yyyy') + "</td><td style='text-align:right'>" + echeance.toFormat(2)
						+ "</td><td style='text-align:right'>" + ke.toFormat(2) + "</td><td style='text-align:right'>" + ipe.toFormat(2) +
						"</td><td style='text-align:right'>" + crd.toFormat(2) + '</td></tr>';
				}
				else if (i === breakpoint)
				{
					output += "<tr><th>...</th><td>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td></tr>";
				}

				switch (per)
				{
					case 12:
						date = date.add({months: 1});
						break;
					case 4:
						date = date.add({months: 3});
						break;
					case 2:
						date = date.add({months: 6});
						break;
					case 1:
						date = date.add({months: 12});
						break;
					default:
						throw new RangeError('Invalid periodicite');

				}

				sumKe = sumKe.plus(ke);
				sumIpe = sumIpe.plus(ipe);
				sumEch = sumEch.plus(echeance);

				ipe = crd.times(tauxPer);
				ke = echeance.minus(ipe);
				crd = crd.minus(ke);
			}

			output += "<tr><th>TOTAL</th><td>&nbsp;</td><td style='text-align:right'><b>" + sumEch.toFormat(2)
				+ "</b></td><td style='text-align:right'><b>" + sumKe.toFormat(2) + "</b></td><td style='text-align:right'><b>" + sumIpe.toFormat(2) +
				'</b></td><td>&nbsp;</td></tr></tbody></table>';


			output += '</tbody></table>';
			var resultObject={};
			resultObject.tableauHtml=output;
			resultObject.coutTotalEmprunt=sumIpe;
			return resultObject;
		}
	},

	capitalConstant: {
		calculeEcheance: function(capital, tauxAnnuel, duree, periodicite)
		{
			if (capital === undefined || duree === undefined || tauxAnnuel === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ip = tauxAnnuel.dividedBy(periodicite);
			return capital.times(ip).plus(capital.dividedBy(duree));
		},

		calculeDuree: function(capital, tauxAnnuel, echeance, periodicite)
		{
			if (capital === undefined || echeance === undefined || tauxAnnuel === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ip = tauxAnnuel.dividedBy(periodicite);
			return capital.dividedBy(echeance.minus(capital.times(ip))).round(Decimal.ROUND_UP);
		},

		calculeCapital: function(tauxAnnuel, echeance, duree, periodicite)
		{
			if (duree === undefined || echeance === undefined || tauxAnnuel === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ip = tauxAnnuel.dividedBy(periodicite);
			var num = echeance.times(duree);
			var denom = ip.times(duree).plus(Decimal.ONE);
			return num.dividedBy(denom);
		},

		calculeTaux: function(capital, echeance, duree, periodicite)
		{
			if (duree === undefined || echeance === undefined || capital === undefined || periodicite === undefined)
			{
				throw new Error('Missing arguments !');
			}
			var ke = capital.dividedBy(duree);
			var ipe0 = echeance.minus(ke);
			var i = ipe0.dividedBy(capital);
			return i.times(periodicite);
		},

		tableauAmortissement: function(emprunt, breakpoint)
		{
			if (emprunt === undefined || breakpoint === undefined)
			{
				throw new Error('Missing arguments');
			}

			if (emprunt.capital === undefined || emprunt.duree === undefined || emprunt.taux === undefined || emprunt.periodicite === undefined || emprunt.isValid === undefined)
			{
				throw new TypeError('Invalid object type emprunt !');
			}

			if (emprunt.isValid === false)
			{
				throw new Error('Not a valid, computable emprunt');
			}
			var echeance = Emprunt.capitalConstant.calculeEcheance(emprunt.capital, emprunt.taux, emprunt.duree, emprunt.periodicite);
			var rand = Math.floor(Math.random() * 1000 + 1).toString();
			var output = "<table class='ui-responsive' id='tbl" + rand + "' data-role='table'><thead><tr><th>ieme</th><th>Date</<th><th style='text-align:right'>Echéance</th><th style='text-align:right'>Capital</th><th style='text-align:right'>Intérêts</th><th style='text-align:right'>Reste à payer</th></tr></thead><tbody>";

			var tauxPer = emprunt.taux.dividedBy(emprunt.periodicite);
			var ipe = emprunt.capital.times(tauxPer);
			var ke = emprunt.capital.dividedBy(emprunt.duree);
			var crd = emprunt.capital.minus(ke);

			var sumKe = new Decimal(0);
			var sumIpe = new Decimal(0);
			var sumEch = new Decimal(0);

			var date = Date.today();


			var per = emprunt.periodicite.toNumber();

			for (var i = 1; i <= emprunt.duree; i++)
			{
				if (crd.isNegative())
				{
					crd = crd.absoluteValue();
					if (i != emprunt.duree)
						throw new RangeError('Error with premature negative crd');
				}


				if (i < breakpoint || i >= emprunt.duree - 2)
				{
					output += '<tr><th>'+ i + '</th><td>'+ date.toString('dd-MM-yyyy') + "</td><td style='text-align:right'>" + echeance.toFormat(2)
						+ "</td><td style='text-align:right'>" + ke.toFormat(2) + "</td><td style='text-align:right'>" + ipe.toFormat(2) +
						"</td><td style='text-align:right'>" + crd.toFormat(2) + '</td></tr>';
				}
				else if (i === breakpoint)
				{
					output += "<tr><th>...</th><td>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td><td style='text-align:right'>...</td></tr>";
				}

				switch (per)
				{
					case 12:
						date = date.add({months: 1});
						break;
					case 4:
						date = date.add({months: 3});
						break;
					case 2:
						date = date.add({months: 6});
						break;
					case 1:
						date = date.add({months: 12});
						break;
					default:
						throw new RangeError('Invalid periodicite');

				}
				sumKe = sumKe.plus(ke);
				sumIpe = sumIpe.plus(ipe);
				sumEch = sumEch.plus(echeance);

				ipe = crd.times(tauxPer);
				crd = crd.minus(ke);
				echeance = ipe.plus(ke);
			}

			output += "<tr><th>TOTAL</th><td>&nbsp;</td><td style='text-align:right'><b>" + sumEch.toFormat(2)
				+ "</b></td><td style='text-align:right'><b>" + sumKe.toFormat(2) + "</b></td><td style='text-align:right'><b>" + sumIpe.toFormat(2) +
				'</b></td><td>&nbsp;</td></tr></tbody></table>';
			output += '</tbody></table>';
			var resultObject={};
			resultObject.tableauHtml=output;
			resultObject.coutTotalEmprunt=sumIpe;
			return resultObject;
		}
	}
};

