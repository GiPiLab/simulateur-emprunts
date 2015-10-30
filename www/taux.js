/*
 * Copyright Laboratoire de Recherche pour le Développement Local,
 * Thibault Mondary, 2008-2015
 * 
 * thibault@gipilab.org
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
 * Affichage des taux euribor et tecs
 */


/*
 * Récupère les taux si besoin ou si forcé, et les affiche dans #divTaux
 */
function getTaux(forceRefresh)
{
	if(forceRefresh===undefined)
	{
		forceRefresh=false;
	}


	if(forceRefresh===true ||mustTauxBeRefreshed())
	{
		$.ajax({type:"GET", url:"http://gipilab.org/progs/taux/getTauxJSON.php",success:function(result){

			try
			{
				var data=JSON.parse(result);
			}
			catch(e){
				alert(e);
				return;
			}
			$("#divTaux").html(tauxToHtml(data));
			$("#divTaux").trigger("create");
			$("#optionPanel").trigger("updatelayout");
			saveLastTaux(result);

		},
			error:function(xhr,error,errorThrown){
				$("#divTaux").html("Erreur de chargement des taux");
				$("#divTaux").trigger("create");
				$("#optionPanel").trigger("updatelayout");
			}
		});
	}
	else
	{
		var result=loadLastTaux();
		if(result===false)
		{
			getTaux(true);
			return;
		}
		$("#divTaux").html(tauxToHtml(JSON.parse(result)));
		$("#divTaux").trigger("create");
		$("#optionPanel").trigger("updatelayout");
	}
		
}

/*
 * Fabrique le tableau des taux à partir des données JSON
 */
function tauxToHtml(taux)
{
	var output="<table style='font-size:8pt' width='100%' class='tableTaux'><thead><tr><th></th><th>taux</th><th>prec</th><th>min</th><th>max</th></tr></thead><tbody>";

	output+="<tr><th style='text-align:center;padding-top:5px' colspan='5'>Eonia ("+taux.eonia.date+")</th></tr>";
	output+="<tr><td style='text-align:left'>eonia</td><td>"+taux.eonia.current
		+"</td><td>"+taux.eonia.prev+"</td><td>"+taux.eonia.min+"</td><td>"+
		taux.eonia.max+"</td></tr>";

	output+="<tr><th style='text-align:center;padding-top:5px' colspan='5'>Euribor ("+taux.euribors.date+")</th></tr>";
	output+="<tr><td style='text-align:left'>eur-1m</td><td>"+taux.euribors.unMois.current
		+"</td><td>"+taux.euribors.unMois.prev+"</td><td>"+taux.euribors.unMois.min+"</td><td>"+
		taux.euribors.unMois.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>eur-3m</td><td>"+taux.euribors.troisMois.current
		+"</td><td>"+taux.euribors.troisMois.prev+"</td><td>"+taux.euribors.troisMois.min+"</td><td>"+
		taux.euribors.troisMois.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>eur-6m</td><td>"+taux.euribors.sixMois.current
		+"</td><td>"+taux.euribors.sixMois.prev+"</td><td>"+taux.euribors.sixMois.min+"</td><td>"+
		taux.euribors.sixMois.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>eur-12m</td><td>"+taux.euribors.douzeMois.current
		+"</td><td>"+taux.euribors.douzeMois.prev+"</td><td>"+taux.euribors.douzeMois.min+"</td><td>"+
		taux.euribors.douzeMois.max+"</td></tr>";

	output+="<tr><th style='text-align:center;padding-top:5px' colspan='5'>TEC ("+taux.tecs.date+")</th></tr>";
	output+="<tr><td style='text-align:left'>TEC10</td><td>"+taux.tecs.tec10.current
		+"</td><td>"+taux.tecs.tec10.prev+"</td><td>"+taux.tecs.tec10.min+"</td><td>"+
		taux.tecs.tec10.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>TEC15</td><td>"+taux.tecs.tec15.current
		+"</td><td>"+taux.tecs.tec15.prev+"</td><td>"+taux.tecs.tec15.min+"</td><td>"+
		taux.tecs.tec15.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>TEC20</td><td>"+taux.tecs.tec20.current
		+"</td><td>"+taux.tecs.tec20.prev+"</td><td>"+taux.tecs.tec20.min+"</td><td>"+
		taux.tecs.tec20.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>TEC25</td><td>"+taux.tecs.tec25.current
		+"</td><td>"+taux.tecs.tec25.prev+"</td><td>"+taux.tecs.tec25.min+"</td><td>"+
		taux.tecs.tec25.max+"</td></tr>";
	output+="<tr><td style='text-align:left'>TEC30</td><td>"+taux.tecs.tec30.current
		+"</td><td>"+taux.tecs.tec30.prev+"</td><td>"+taux.tecs.tec30.min+"</td><td>"+
		taux.tecs.tec30.max+"</td></tr>";


	output+="</tbody></table>";

	return output.replace(/\./g,',');
}


