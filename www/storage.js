'use strict';


/*Storage for emprunts*/

function saveEmpruntToFavorite(emp)
{
	if (emp === undefined || emp === null)
	{
		throw new Error('undefined emprunt !');
	}

	if (emp.capital === undefined || emp.echeance === undefined || emp.duree === undefined || emp.periodicite === undefined || emp.taux === undefined)
	{
		throw new TypeError('Invalid object found instead of empruntData !');
	}

	if (localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp = JSON.parse(localStorage.getItem('simulateurEmpruntslisteEmprunts'));
		listEmp.push(emp);
		localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
	}
	else
	{
		var listEmp = [emp];
		localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
	}

	$('#listeEmprunts').html(listEmprunts());
	$('#listeEmprunts').trigger('create');
	$.mobile.pageContainer.pagecontainer('change', '#pageMesEmprunts', {transition: 'none'});
}

function loadEmprunt(i)
{
	if (i === undefined)
	{
		throw new Error('undefined index to load');
	}
	var listEmp = JSON.parse(localStorage.getItem('simulateurEmpruntslisteEmprunts'));

	if (i >= 0 && i < listEmp.length)
	{
		var emp = listEmp[i];
		if (emp.capital === undefined || emp.echeance === undefined || emp.duree === undefined || emp.periodicite === undefined || emp.taux === undefined)
		{
			throw new TypeError('Invalid object found instead of empruntData !');
		}


		if (emp.capital !== null)
			$('#input-capital').val(emp.capital);
		else
			$('#input-capital').val('');

		if (emp.echeance !== null)
			$('#input-echeance').val(emp.echeance);
		else
			$('#input-echeance').val('');
		if (emp.duree !== null)
			$('#input-duree').val(emp.duree);
		else
			$('#input-duree').val('');

		if (emp.taux !== null)
			$('#input-taux').val(new Decimal(emp.taux).times(100));
		else
			$('#input-taux').val('');

		if (emp.periodicite !== null)
		{
			$('#select-periodicite').val(emp.periodicite);
			//Do not refresh before creation
			try {
				$('#select-periodicite').selectmenu('refresh');
			}catch (e) {}
		}
	$.mobile.pageContainer.pagecontainer('change', '#pageEmprunt', {transition: 'none'});
	computeMissing(currentEmpruntVariation1,currentEmpruntVariation2,currentEmpruntFormData);
	}
	else
	{
		throw new RangeError('Invalid index');
	}
}

function removeEmprunt(i)
{
	if (i === undefined)
	{
		throw new Error('undefined index to remove');
	}
	var listEmp = JSON.parse(localStorage.getItem('simulateurEmpruntslisteEmprunts'));

	if (i >= 0 && i < listEmp.length)
	{
		var emp = listEmp[i];
		if (emp.capital === undefined || emp.echeance === undefined || emp.duree === undefined || emp.periodicite === undefined || emp.taux === undefined)
		{
			throw new TypeError('Invalid object found instead of empruntData !');
		}
		listEmp.splice(i, 1);
		localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
	}
	else
	{
		throw new RangeError('Invalid index');
	}
}

function listEmprunts()
{
	var out = '';
	if (localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp = JSON.parse(localStorage.getItem('simulateurEmpruntslisteEmprunts'));

		out += "<ul data-role='listview' data-split-icon='delete'>";

		for (var i = 0; i < listEmp.length; i++)
		{
			var emp = listEmp[i];
			if (emp.capital === undefined || emp.echeance === undefined || emp.duree === undefined || emp.periodicite === undefined || emp.taux === undefined)
			{
				throw new TypeError('Invalid object found instead of empruntData !');
			}
			var description = Emprunt.formatEmpruntQuery(emp.capital, emp.taux, emp.duree, emp.echeance, emp.periodicite);
			out += "<li style='margin:1em'><a href='#' onclick='loadEmprunt(" + i + ");'>" + description + "</a><a href='#' onclick='removeEmprunt(" + i + ");$(\"#listeEmprunts\").html(listEmprunts());$(\"#listeEmprunts\").trigger(\"create\");'>Supprimer</a></li>";
		}

		out += '</ul>';
	}
	return out;
}

/*Storage for themes*/

function saveTheme(themeSwatch)
{
	if(themeSwatch===undefined)
		throw new Error("Undefined swatch");
	if(themeSwatch!=="a" &&themeSwatch!=="b" && themeSwatch!=="c" && themeSwatch!=="d" && themeSwatch!=="e" && themeSwatch!=="f" && themeSwatch!=="g")
	{
		throw new Error("Bad swatch");
	}
	localStorage.setItem("themeswatch",themeSwatch);
}

function loadTheme()
{
	if(localStorage.themeswatch)
	{
		var themeSwatch=localStorage.getItem('themeswatch');
		if(themeSwatch!=="a" && themeSwatch!=="b" &&themeSwatch!=="c" && themeSwatch!=="d" && themeSwatch!=="e" && themeSwatch!=="f" && themeSwatch!=="g")
		{
			throw new Error("Bad swatch");
		}
		$("#pageEmprunt").removeClass("ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g").addClass("ui-page-theme-"+themeSwatch);
		$("#pagePresentation").removeClass("ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g").addClass("ui-page-theme-"+themeSwatch);
		$("#pageMesEmprunts").removeClass("ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g").addClass("ui-page-theme-"+themeSwatch);
		$("#pageTableaux").removeClass("ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g").addClass("ui-page-theme-"+themeSwatch);
		$("#optionPanel").removeClass("ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g").addClass("ui-page-theme-"+themeSwatch);
//		$(".ui-bar").removeClass("ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f ui-bar-g").addClass("ui-bar-"+themeSwatch);
	}	
}

