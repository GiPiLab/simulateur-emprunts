function getTaux(forceRefresh)
{
	if(forceRefresh===undefined)
	{
		forceRefresh=false;
	}


	if(forceRefresh===true ||mustTauxBeRefreshed())
	{
		$.ajax({type:"GET", url:"http://gipilab.org/progs/taux/getTauxJSON.php",success:function(result){

			console.log("Refreshing taux");
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
		console.log("No refreshing taux, using cache");
	}
		
}


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


