<?php  
include('php/acces_bdd.php');

function tps_ecoule($tps){
    $cpt = 0;
    $tps_ecoule = "";
    // Jour
    if ( floor($tps/86400) >= 1 ){
        $tps_ecoule .= floor($tps/86400)."j ";
        $tps = $tps%86400;
        $cpt++;
    }
    // Heure
    if ( floor($tps/3600) >= 1 || $cpt > 0 ){
        $tps_ecoule .= floor($tps/3600)."h ";
        $tps = $tps%3600;
        $cpt++;
    }
    // Minutes
    if ( floor($tps/60) >= 1 || $cpt > 0 ){
        $tps_ecoule .= floor($tps/60)."m ";
        $tps = $tps%60;
    }
    // Secondes
    $tps_ecoule .= $tps."s ";
    return $tps_ecoule;
}
function page(){
	global $nb;
	if ( $nb > 0 ){
		echo '<div>Page : ';
		for($i=0;$i<=$nb;$i++){
			echo '- <a href="classement.php?page='.$i.'">'.$i.'</a> ';
		}
		echo '</div>';
	}
}

// tri order
$verifOrder = array('nom','duree','nbrClick','nbrVaisseauConstruit','nbrVaisseauDetruit','nbrVaisseauPerdu','recolteManuelMinerai','recolteManuelNrj','recolteManuelArgent','recolteAuto','score','tps');
if ( isset($_GET['order']) && in_array($_GET['order'],$verifOrder) ){
	$order = $_GET['order'];
} else {
	$order = 'tps';
}

//sens du tri
$verifSens = array('ASC','DESC');
if ( isset($_GET['sens']) && in_array($_GET['sens'],$verifSens) ){
	$sens = $_GET['sens'];
	($_GET['sens']=='DESC') ? $lienSens = 'ASC' : $lienSens = 'DESC';;
} else {
	$sens = 'DESC';
	$lienSens = 'ASC';
}

// prepare le muti-page
$sql = '';
$result = $bdd->query('SELECT COUNT(*) AS nb FROM score');
$nb = $result->fetch();
$nb = floor($nb['nb']/100);


//tri par page
if ( isset($_GET['page']) ){
	$limitInf = round($_GET['page'])*100;
	$limitSup = round($_GET['page'])*100+100;
	$page = round($_GET['page']);
} else {
	$limitInf = 0;
	$limitSup = 100;
	$page = 0;
}

// requete d'affichage
$res = $bdd->query('SELECT * FROM score ORDER BY '.$order.' '.$sens.' LIMIT '.$limitInf.','.$limitSup);
$res = $res->fetchAll(PDO::FETCH_ASSOC);

?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Damocorp Expansion</title>
  <link rel="stylesheet" href="css/g.css">
  <link rel="icon" type="image/png" href="favicon.png" />
</head>
<?php
page();
?>
<body>
	<div style="text-align:center;"><input type="submit" value="relancer une partie" onClick="window.location='index.html';" /></div>
	<table>
		<tr>
			<th><a href="classement.php?order=nom&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Nom</a></th>
			<th><a href="classement.php?order=duree&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Temps de jeu</a></th>
			<th><a href="classement.php?order=nbrClick&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Nombre de clic</a></th>
			<th><a href="classement.php?order=nbrVaisseauConstruit&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Vaisseau Construit</a></th>
			<th><a href="classement.php?order=nbrVaisseauDetruit&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Vaisseau Détruit</a></th>
			<th><a href="classement.php?order=nbrVaisseauPerdu&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Vaisseau Perdu</a></th>
			<th><a href="classement.php?order=recolteManuelMinerai&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Recolte de minerai</a></th>
			<th><a href="classement.php?order=recolteManuelNrj&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Recolte d'énergie</a></th>
			<th><a href="classement.php?order=recolteManuelArgent&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Recolte d'argent</a></th>
			<th><a href="classement.php?order=recolteAuto&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Recolte automatique</a></th>
			<th><a href="classement.php?order=score&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Score final</a></th>
			<th><a href="classement.php?order=tps&sens=<?php echo $lienSens; ?>&page=<?php echo $page; ?>">Date</a></th>
		</tr>
		<?php
		foreach ($res as $key => $value) {
			echo '
			<tr>
				<td>'.$res[$key]['nom'].'</td>
				<td>'.tps_ecoule($res[$key]['duree']).'</td>
				<td>'.$res[$key]['nbrClick'].'</td>
				<td>'.$res[$key]['nbrVaisseauConstruit'].'</td>
				<td>'.$res[$key]['nbrVaisseauDetruit'].'</td>
				<td>'.$res[$key]['nbrVaisseauPerdu'].'</td>
				<td>'.$res[$key]['recolteManuelMinerai'].'</td>
				<td>'.$res[$key]['recolteManuelNrj'].'</td>
				<td>'.$res[$key]['recolteManuelArgent'].'</td>
				<td>'.$res[$key]['recolteAuto'].'</td>
				<td>'.$res[$key]['score'].'</td>
				<td>'.date('\L\e d-m-Y à H:i',$res[$key]['tps']).'</td>
			</tr>';
		}
		?>
	</table>
	<div style="text-align:center;"><input type="submit" value="relancer une partie" onClick="window.location='index.html';" /></div>
<?php
page();
?>
</body>
</html>