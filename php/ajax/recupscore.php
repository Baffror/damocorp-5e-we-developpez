<?php  
include('../acces_bdd.php');

// verification
if( !isset($_POST['nom']) || !ctype_alpha($_POST['nom'])){
	$retour['erreur'] = 'Nom alphnumérique uniquement';
} elseif ( !isset($_POST['duree'],$_POST['nbrClick'],$_POST['nbrVaisseauConstruit'],$_POST['nbrVaisseauDetruit'],$_POST['nbrVaisseauPerdu'],$_POST['recolteManuelMinerai'],$_POST['recolteManuelNrj'],$_POST['recolteManuelArgent'],$_POST['recolteAuto'],$_POST['score']) ){
	$retour['erreur'] = 'Valeures incorrectes';
} else {
	$_POST['nom'] = substr($_POST['nom'], 0, 30);

	$insert = $bdd->prepare('INSERT INTO score SET nom=?,duree=?,nbrClick=?,nbrVaisseauConstruit=?,nbrVaisseauDetruit=?,nbrVaisseauPerdu=?,recolteManuelMinerai=?,recolteManuelNrj=?,recolteManuelArgent=?,recolteAuto=?,score=?,tps=?');
	$insert->bindValue(1, $_POST['nom'], PDO::PARAM_STR);
	$insert->bindValue(2, $_POST['duree'], PDO::PARAM_INT);
	$insert->bindValue(3, $_POST['nbrClick'], PDO::PARAM_INT);
	$insert->bindValue(4, $_POST['nbrVaisseauConstruit'], PDO::PARAM_INT);
	$insert->bindValue(5, $_POST['nbrVaisseauDetruit'], PDO::PARAM_INT);
	$insert->bindValue(6, $_POST['nbrVaisseauPerdu'], PDO::PARAM_INT);
	$insert->bindValue(7, $_POST['recolteManuelMinerai'], PDO::PARAM_INT);
	$insert->bindValue(8, $_POST['recolteManuelNrj'], PDO::PARAM_INT);
	$insert->bindValue(9, $_POST['recolteManuelArgent'], PDO::PARAM_INT);
	$insert->bindValue(10, $_POST['recolteAuto'], PDO::PARAM_INT);
	$insert->bindValue(11, $_POST['score'], PDO::PARAM_INT);
	$insert->bindValue(12, time(), PDO::PARAM_INT);
	$insert->execute();

	$retour['ok'] = 1;
}
// renvoi en Json
header('Content-type: application/json');
echo json_encode($retour);
?>