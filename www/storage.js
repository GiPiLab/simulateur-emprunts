function initDb()
{
	if(typeof(Storage)==="undefined")
	{
		throw new Error("Error no local storage !");
	}
}

//Returns the identifier of the saved emprunt
function saveEmprunt(emp)
{	
	if(localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp=JSON.parse(localStorage.getItem("simulateurEmpruntslisteEmprunts"));
		listEmp.push(emp);
		console.log(listEmp);
		localStorage.setItem("simulateurEmpruntslisteEmprunts",JSON.stringify(listEmp));
	}
	else
	{
		var listEmp=[emp];
		localStorage.setItem("simulateurEmpruntslisteEmprunts",JSON.stringify(listEmp));
	}
	
	$("#listeEmprunts").html(listEmprunts());
	$("#listeEmprunts").trigger("create");
}



function loadEmprunt(i)
{
	var listEmp=JSON.parse(localStorage.getItem("simulateurEmpruntslisteEmprunts"));

	if(i>=0 && i < listEmp.length)
	{
		var emp=listEmp[i];
		if(emp.capital!=null)
			$("#input-capital").val(emp.capital);
		else
			$("#input-capital").val('');

		if(emp.echeance!=null)
			$("#input-echeance").val(emp.echeance);
		else
			$("#input-echeance").val('');
		if(emp.duree!=null)
			$("#input-duree").val(emp.duree);
		else
			$("#input-duree").val('');

		if(emp.taux!=null)
			$("#input-taux").val(emp.taux*100);
		else
			$("#input-taux").val('');

		if(emp.periodicite!=null)
		{
			$("#select-periodicite").val(emp.periodicite);
			//Do not refresh before creation
			try{
				$("#select-periodicite").selectmenu("refresh");
			}catch(e){}
		}
	$.mobile.pageContainer.pagecontainer("change","#pageEmprunt",{transition:"none"});
	}
	else
	{
		throw new Error("Invalid index");
	}
}

function removeEmprunt(i)
{
	var listEmp=JSON.parse(localStorage.getItem("simulateurEmpruntslisteEmprunts"));

	if(i>=0 && i < listEmp.length)
	{
		listEmp.splice(i,1);
		localStorage.setItem("simulateurEmpruntslisteEmprunts",JSON.stringify(listEmp));
	}
}

function listEmprunts()
{
	var out="";
	if(localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp=JSON.parse(localStorage.getItem("simulateurEmpruntslisteEmprunts"));
	
		out+="<ul data-role='listview' data-split-icon='delete'>";
	
		for(i=0;i<listEmp.length;i++)
		{
			var emp=listEmp[i];
			var description=formatEmpruntQuery(emp.capital,emp.taux,emp.duree,emp.echeance,emp.periodicite);
			out+="<li><a href='#' onclick='loadEmprunt("+i+");'>"+description+"</a><a href='#' onclick='removeEmprunt("+i+");$(\"#listeEmprunts\").html(listEmprunts());$(\"#listeEmprunts\").trigger(\"create\");'>Supprimer</a></li>";
		}

		out+="</ul>";
	}
	return out;	
}



