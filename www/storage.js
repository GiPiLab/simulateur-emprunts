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

	if(!window.localStorage)
	{
		alert("Stockage local non disponible, sauvegarde impossible");
		return;
	}

	if (window.localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp = JSON.parse(window.localStorage.getItem('simulateurEmpruntslisteEmprunts'));
		listEmp.push(emp);
		window.localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
	}
	else
	{
		var listEmp = [emp];
		window.localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
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
	if(!window.localStorage)
	{
		alert("Stockage local non disponible, chargement impossible");
		return;
	}
	var listEmp = JSON.parse(window.localStorage.getItem('simulateurEmpruntslisteEmprunts'));

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
	$('#formEmprunt').submit();
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
	if(!window.localStorage)
	{
		alert("Stockage local non disponible, chargement impossible");
		return;
	}
	var listEmp = JSON.parse(window.localStorage.getItem('simulateurEmpruntslisteEmprunts'));

	if (i >= 0 && i < listEmp.length)
	{
		var emp = listEmp[i];
		if (emp.capital === undefined || emp.echeance === undefined || emp.duree === undefined || emp.periodicite === undefined || emp.taux === undefined)
		{
			throw new TypeError('Invalid object found instead of empruntData !');
		}
		listEmp.splice(i, 1);
		window.localStorage.setItem('simulateurEmpruntslisteEmprunts', JSON.stringify(listEmp));
	}
	else
	{
		throw new RangeError('Invalid index');
	}
}

function listEmprunts()
{
	var out = '';
	if(!window.localStorage)
	{
		alert("Stockage local non disponible, chargement impossible");
		return;
	}
	if (window.localStorage.simulateurEmpruntslisteEmprunts)
	{
		var listEmp = JSON.parse(window.localStorage.getItem('simulateurEmpruntslisteEmprunts'));

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
	if(!window.localStorage)
	{
		alert("Stockage local non disponible, enregistrement impossible");
		return;
	}
	window.localStorage.setItem("themeswatch",themeSwatch);
}

function loadTheme()
{
	if(window.localStorage.themeswatch)
	{
		var themeSwatch=window.localStorage.getItem('themeswatch');
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

function mustTauxBeRefreshed()
{
	if(window.localStorage.tauxRefreshDate)
	{
		var lastRefresh=window.localStorage.getItem("tauxRefreshDate");
		//Check if we are tomorrow
		if(Date.compare(Date.today(),Date.parse(lastRefresh))==1)
		{
			window.localStorage.setItem("tauxRefreshDate",Date.today().toString());
			return true;
		}
		else
		{
			return false;
		}
	}

	else
	{
		window.localStorage.setItem("tauxRefreshDate",Date.today().toString());
		return true;
	}
}


function saveLastTaux(resultFromAjax)
{
	window.localStorage.setItem("lastTaux",resultFromAjax);
}


function loadLastTaux()
{
	if(window.localStorage.lastTaux)
	{
		return window.localStorage.getItem("lastTaux");
	}
	else
	{
		return false;
	}	

}





