function getTaux()
{
	$.ajax({url:"http://gipilab.org/progs/taux/getTauxJSON.php",success:function(result){

		var data=JSON.parse(result);
		$("#divTaux").html(tauxToHtml(data));
		$("#divTaux").trigger("create");

	}});
}


function tauxToHtml(taux)
{
	var output="<table style='font-size:8pt' class='ui-responsive' data-role='table'><thead><tr><th></th><th>cur</th><th>prev</th><th>min</th><th>max</th></tr></thead><tbody>";

	output+="<tr><td style='text-align:center' colspan='5'>Eonia ("+taux.eonia.date+")</td></tr>";
	output+="<tr><td>eonia</td><td>"+taux.eonia.current
		+"</td><td>"+taux.eonia.prev+"</td><td>"+taux.eonia.min+"</td><td>"+
		taux.eonia.max+"</td></tr>";

	output+="<tr><td style='text-align:center' colspan='5'>Euribors ("+taux.euribors.date+")</td></tr>";
	output+="<tr><td>eur-1m</td><td>"+taux.euribors.unMois.current
		+"</td><td>"+taux.euribors.unMois.prev+"</td><td>"+taux.euribors.unMois.min+"</td><td>"+
		taux.euribors.unMois.max+"</td></tr>";
	output+="<tbody><tr><td>eur-3m</td><td>"+taux.euribors.troisMois.current
		+"</td><td>"+taux.euribors.troisMois.prev+"</td><td>"+taux.euribors.troisMois.min+"</td><td>"+
		taux.euribors.troisMois.max+"</td></tr>";
	output+="<tbody><tr><td>eur-6m</td><td>"+taux.euribors.sixMois.current
		+"</td><td>"+taux.euribors.sixMois.prev+"</td><td>"+taux.euribors.sixMois.min+"</td><td>"+
		taux.euribors.sixMois.max+"</td></tr>";
	output+="<tbody><tr><td>eur-12m</td><td>"+taux.euribors.douzeMois.current
		+"</td><td>"+taux.euribors.douzeMois.prev+"</td><td>"+taux.euribors.douzeMois.min+"</td><td>"+
		taux.euribors.douzeMois.max+"</td></tr>";
	output+="<tr><td style='text-align:center' colspan='5'>TECS ("+taux.tecs.date+")</td></tr>";
	output+="<tr><td>TEC10</td><td>"+taux.tecs.tec10.current
		+"</td><td>"+taux.tecs.tec10.prev+"</td><td>"+taux.tecs.tec10.min+"</td><td>"+
		taux.tecs.tec10.max+"</td></tr>";
	output+="<tbody><tr><td>TEC15</td><td>"+taux.tecs.tec15.current
		+"</td><td>"+taux.tecs.tec15.prev+"</td><td>"+taux.tecs.tec15.min+"</td><td>"+
		taux.tecs.tec15.max+"</td></tr>";
	output+="<tbody><tr><td>TEC20</td><td>"+taux.tecs.tec20.current
		+"</td><td>"+taux.tecs.tec20.prev+"</td><td>"+taux.tecs.tec20.min+"</td><td>"+
		taux.tecs.tec20.max+"</td></tr>";
	output+="<tbody><tr><td>TEC25</td><td>"+taux.tecs.tec25.current
		+"</td><td>"+taux.tecs.tec25.prev+"</td><td>"+taux.tecs.tec25.min+"</td><td>"+
		taux.tecs.tec25.max+"</td></tr>";
	output+="<tbody><tr><td>TEC30</td><td>"+taux.tecs.tec30.current
		+"</td><td>"+taux.tecs.tec30.prev+"</td><td>"+taux.tecs.tec30.min+"</td><td>"+
		taux.tecs.tec30.max+"</td></tr>";


	output+="</tbody></table>";

	return output.replace(/\./g,',');
}


