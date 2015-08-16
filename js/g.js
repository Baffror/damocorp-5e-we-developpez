/*************************************** FONCTION *********************************************/
function affRetour(mess,laclass){
	if ( $('#reponse').length === 1 ){ $('#reponse').remove(); }
	if ( laclass === undefined ){ var laclass = 'good'; } else { var laclass = 'bad'; }
	$('body').prepend('<div id="reponse" class="'+laclass+'">'+mess+'</div>');
	$("#reponse").css('top', $(window).scrollTop() + 'px');
	setTimeout(function(){$('#reponse').fadeOut(2000,function(){$('#reponse').remove();});},4000);
}
/*************************************** VARIABLE *********************************************/
var elem,ctx = false;                     // le canvas
var windowHeight = window.innerHeight;    // hauteur fenetre
var windowWidth = window.innerWidth;      // largeur fenetre
var asteroide = new Array();              // tableau des objets astéroides
var posMouseX,posMouseY,cursor=false;     // position et état souris
var clickObject;                          // Click astéroide, station etc...
var keyClickObject;					      // Key de l'objet cliqué
var station;                              // affichage de la sation
var minerai=0,nrj=0,argent=0;             // variable des ressource
var tmp;                                  // Variable de sauvegarde temporaire
var tauxRecolte=1;						  // Taux de récolte des astéroides
var palierUpRecolte=10;					  // Palier pour activer le up récolte
var tauxAutoRecolte=0;					  // Taux d'auto récolte.
var palierUpAutoRecolte=1;			  	  // Palier pour upgrader l'auto récolte
var tauxConstruction=1;					  // taux de construction des vaisseaux
var palierUpTauxConstruction=100;		  // Cout du palier pour créer plusieurs vaisseaux simultanément
var nbrVaisseauDefense=0;				  // nombre de vaisseau en défense
var nbrVaisseauAttaque=0;				  // nombre de vaisseau en attaque
var countTime= Math.round(+new Date()/1000);// nombre de fois ou la boucle est effectué
var pdvStation=50000;					  // point de vie de la station
var endGame=false;						  // Fin de game ?
var autoRecolteInterval,ennemyIncoming,ennemyAttaque // Interval
var textMachineAEcrire=''				  // Pour l'effet machine à écrire.
var currentChar = 1;				  	  // Pour l'effet machine à écrire.
var htmltag = false;				  	  // Pour l'effet machine à écrire.
var cible = '';				  	  // Pour l'effet machine à écrire.
/*************************************** FONCTION ******************************************/
function loop(){

    // efface le canvas
    ctx.clearRect(0,0,windowWidth,windowHeight);

    // affichage des astéroides
    for ( key in asteroide ){
        asteroide[key].move();
        asteroide[key].draw();
    }

    // affiche la sation
    station.draw();

    // interaction souris
    interactCursor();

    // relance la boucle si la partie n'est pas finie
    if (!endGame){
    	window.requestAnimFrame(loop);
    } else {
    	finDuJeu();
    }
}
// equivalent javascript de la fonction php number_format
function number_format(number, decimals, dec_point, thousands_sep) {
    decimals=0;dec_point=',';thousands_sep=' ';
    number = (number+'').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function affRetour(mess,laclass){
    if ( $('#reponse').length === 1 ){ $('#reponse').remove(); }
    if ( laclass === undefined ){ var laclass = 'reponseG'; } else { var laclass = 'reponseB'; }
    $('body').prepend('<div id="reponse" class="'+laclass+'">'+mess+'</div>');
    $("#reponse").css('top', $(window).scrollTop() + 'px');
    setTimeout(function(){$('#reponse').fadeOut(2000,function(){$('#reponse').remove();});},4000);
}
function genereAsteroide(){
    var rand = Math.random();
    if ( rand < 0.3 ){
        var tmp = new affImg('img/sprite_game.png',150,50,50,50,-50,-50);
    } else if ( rand > 0.3 && rand < 0.6 ){
        var tmp = new affImg('img/sprite_game.png',200,50,50,50,-50,-50);
    } else {
        var tmp = new affImg('img/sprite_game.png',250,50,50,50,-50,-50);
    }
    asteroide.push(tmp);
    tmp.resetPosition();
}
function interactCursor(){
    
    cursor = false;
    // Les astéroides
    for ( key in asteroide ){
        if ( posMouseX > asteroide[key].posx && posMouseX < asteroide[key].posx+asteroide[key].affWidth && posMouseY > asteroide[key].posy && posMouseY < asteroide[key].posy+asteroide[key].affHeight ){
            cursor = true;
            clickObject = 'asteroide';
            keyClickObject = key;
            break;
        }
    }

    if ( cursor ){
        $('#canvas').css({'cursor':'pointer'});
    } else {
        $('#canvas').css({'cursor':'auto'});
    }
}
function interactClick(){
    // clic sur un astéroide
    
    if ( cursor && clickObject=='asteroide' ){
        // stock les positions de l'astéroides
        var x = asteroide[keyClickObject].posx+asteroide[keyClickObject].width;
        var y = asteroide[keyClickObject].posy-asteroide[keyClickObject].height/2;
        // affiche le gain sur l'écran
        affResultClick(x,y,'green','+'+tauxRecolte);
        // ajoute la récolte et actualise l'affichage
        if( asteroide[keyClickObject].srcX === 150 ){
        	minerai += tauxRecolte;
        } else if( asteroide[keyClickObject].srcX === 200 ){
        	nrj += tauxRecolte;
        } else {
        	argent += tauxRecolte;
        }
        actualiseStock();
    }
    
}
function actualiseStock(){

    // mets à jour l'affichage
    $('#minerai').html(number_format(minerai,',','.',' '));
    $('#nrj').html(number_format(nrj,',','.',' '));
    $('#argent').html(number_format(argent,',','.',' '));

    // si l'argent dépasse le palier on active le up récolte
    if( argent >= palierUpRecolte ){
    	$('#imgRecolte').attr('src','img/uprecolte.gif');
    }
}
function affResultClick(x,y,color,chiffre){
	$('#affResultClick').css({'top':y+'px','left':x+'px','color':color,'opacity':100,'display':'block'});
	$('#affResultClick').html(chiffre);
	$('#affResultClick').fadeIn(250,function(){$('#affResultClick').fadeOut(250)});
}
function autoRecolte(){

	if ( tauxAutoRecolte > 0 ){
		minerai+=tauxAutoRecolte;
		nrj+=tauxAutoRecolte;
		argent+=tauxAutoRecolte;
		actualiseStock();
	}
}
function fermerTout(){
	if ( $('#popTopMenu').css('display') == 'block' ){
		$('#popTopMenu').fadeOut(250);
	}
	if ( $('#popTopMenu2').css('display') == 'block' ){
		$('#popTopMenu2').fadeOut(250);
	}
}
function actualiseFlotte(){
	$('#nbrVaisseauDefense').html(number_format(nbrVaisseauDefense,',','.',' '));
	$('#nbrVaisseauAttaque').html(number_format(nbrVaisseauAttaque,',','.',' '));
}
function addVaisseauAttaque(){
	// calcul le temps écoulé
	var diff = Math.round(+new Date()/1000)-countTime;
	// ajoute le nombre de vaisseau
	var nbr = Math.floor(Math.random()*diff/30)
	nbr+=100000;
	if (nbr>0){
		nbrVaisseauAttaque+=nbr;
		// mets à jours l'affichage
		actualiseFlotte();
	}

}
function explosion(id,top,left){
	$('body').append('<img id="explosion'+id+'" src="img/explosion.gif" style="display:none;position:absolute;z-index:-1;width:36px;height:50px;" src="explosion.gif width="36" height="50" />');
	$('#explosion'+id).css({'top':top+'px','left':left+'px'});
	$('#explosion'+id).fadeIn(1000,function(){$('#explosion'+id).fadeOut(1000);})
}
function combattre(){

	var id = Math.round(+new Date()/1000)+'A';
	explosion(id,45,60);
	explosion(id+'B',45,windowWidth-85);


	// si la flotte en défense est supérieur à l'attaque = 20-60/100
	if ( nbrVaisseauDefense >= nbrVaisseauAttaque ){
		// % de perte
		var perte = Math.random()*100;
		if ( perte > 60 ){ perte=60; } else if ( perte < 20 ) { perte =20; }

		nbrVaisseauDefense -= Math.floor(nbrVaisseauDefense*perte/100);
		nbrVaisseauAttaque = 0;

		//actualise l'affichage
		actualiseFlotte();

	// si la flotte en défense est inférieur à l'attaque = 100/40-80
	} else if ( nbrVaisseauDefense < nbrVaisseauAttaque && nbrVaisseauDefense>0 ){
		// % de perte
		var perte = Math.random()*100;
		if ( perte > 80 ){ perte=80; } else if ( perte < 40 ) { perte =40; }

		nbrVaisseauDefense = 0;
		nbrVaisseauAttaque -= Math.floor(nbrVaisseauAttaque*perte/100);

		//actualise l'affichage
		actualiseFlotte();

	}
}
function pertePdv(){
	if ( nbrVaisseauAttaque > 0 ){
		// degat recu par la flotte ennemie
		var degat = Math.ceil(nbrVaisseauAttaque*Math.random());
		pdvStation -= degat;
		// fin de game ?
		if ( pdvStation < 0 ){
			endGame = true;
			pdvStation = 0;
		}
		//explosion
		explosion(degat,windowHeight/2+25,windowWidth/2-15);
		// update affichage pdv
		$('#affPdvStation').html(number_format(pdvStation,',','.','.'));
		// update barre de vie
		var pourcentVie = Math.round(pdvStation/50000*100);
		$('#pdvStation').css({'width':pourcentVie+'px'})

	}
}
function finDuJeu(){
	// on stop les intervals
	clearInterval(autoRecolteInterval);
	clearInterval(ennemyIncoming);
	clearInterval(ennemyAttaque);

	// récupération du texte
	textMachineAEcrire = $('#textMechant').html();
	$('#textMechant').html('');
	// reinitisalise les variable
	currentChar = 1;
	htmltag = false;
	cible='textMechant';
	// cree l'animation + effet machie à ecrire
	$('#affFinDeGameMechant').animate({'left':'+=505'},300,function(){
		machine('textMechant');
		setTimeout(function(){

			// récupération du texte
			textMachineAEcrire = $('#textGentil').html();
			$('#textGentil').html('');
			// reinitisalise les variable
			currentChar = 1;
			htmltag = false;
			cible='textGentil';
			// cree l'animation + effet machie à ecrire
			$('#affFinDeGameGentil').animate({'left':'-=505'},300,function(){
				machine('textGentil');
				setTimeout(function(){
					$('#textGentil').html($('#textGentil').html()+'<input id="envoyeScore" type="submit" value="Affimartif" /> <input id="pasEnvoyeScore" type="submit" value="Négatif" />');
				},10000);
			});

		},10000)
	});

}
function machine(){
	var str = textMachineAEcrire.substr(0, currentChar);
	
	var last = str.substr(str.length -1, str.length);
	if(last != '<' && last != '>' & last != '/') {
	    $('#'+cible).html(str);
	}
	currentChar++;
	if(currentChar <= textMachineAEcrire.length){
	    if(last == '<') {
	        htmltag = true;
	    } else if(last == '>') {
	        htmltag = false;
	    }
	    if(htmltag) {
	        setTimeout(machine, 1);
	    } else {
	        setTimeout(machine, 50);
	    }
	}
}
/************************************* OBJET ******************************************/
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function(callback){
        window.setTimeout(callback, 1000/30);
    };
})();
var affImg = function(s,sX,sY,w,h,x,y){

    this.img = new Image();
    this.img.src = s;

    this.srcX = sX;
    this.srcY = sY;
    this.width = w;
    this.height = h;
    this.posx = x-this.width/2;
    this.posy = y-this.height/2;
    this.affWidth=w;
    this.affHeight=h;
    this.angle=false;
}
affImg.prototype.draw = function(){
    ctx.drawImage(this.img,this.srcX,this.srcY,this.width,this.height,this.posx,this.posy,this.affWidth,this.affHeight);
}
affImg.prototype.move = function(){

    this.posx+=this.sensX;
    this.posy+=this.sensY;

    // relance l'astéroide s'il sort de la zone
    if ( this.posx > windowWidth+250 || this.posy > windowHeight+250 || this.posx < -250 || this.posy < -250 ){
        this.resetPosition();
    }
}
affImg.prototype.resetPosition = function(){

    // vitesse de déplacement
    this.sensX=Math.random();
    if ( this.sensX < 0.1 ){ this.sensX = 0.1; }
    this.sensY=Math.random();
    if ( this.sensY < 0.1 ){ this.sensY = 0.1; }

    var rand = Math.random();
    // l'astéroide viens du haut
    if ( rand <= 0.25 ){

        this.posx= Math.floor(Math.random()*windowWidth);
        this.posy=-50;
        // l'astéroide part vers la gauche
        if ( this.posx > windowWidth/2){
            this.sensX--;
        }

    // l'astéroide viens de la droite
    } else if ( rand > 0.25 && rand <= 0.50 ){

        this.posx= windowWidth+50;
        this.posy= Math.floor(Math.random()*windowHeight);

        // l'astéroide part vers le haut et va vers la gauche
        this.sensX--;
        if ( this.posy > windowHeight/2){
            this.sensY--;
        }

    // l'astéroide viens du bas
    } else if ( rand > 0.25 && rand <= 0.50 ){

        this.posx= Math.floor(Math.random()*windowWidth);
        this.posy=windowHeight+50;
        // l'astéroide part vers le haut et va vers la gauche
        this.sensY--;
        if ( this.posx > windowWidth/2){
            this.sensX--;
        }

    // l'astéroide viens de la gauche
    } else {

        this.posx= -50;
        this.posy=Math.floor(Math.random()*windowHeight);
        // l'astéroide part vers le haut et va vers la gauche
        if ( this.posy > windowHeight/2){
            this.sensX--;
        }


    }

    // modifie la taille des astéroide
    rand = Math.random();
    var scale = (rand*5+5)/10;
    this.affWidth = this.width*scale;
    this.affHeight = this.height*scale;

    // modifie le type de l'astéroide
    if ( rand < 0.3 ){
        this.srcX=150;
    } else if ( rand > 0.3 && rand < 0.6 ){
        this.srcX=200;
    } else {
        this.srcX=250;
    }
}
/***************************************** JQUERY *********************************************/
$(document).ready(function(){

    // Ajout du canvas
    $('body').prepend('<canvas id="canvas" width="'+windowWidth+'" height="'+windowHeight+'"></canvas>');
    // Elem + ctx
    elem = document.getElementById('canvas');
    ctx = elem.getContext('2d');

    /***************************** Menu *********************************/
    $('#menu').css({'top':(windowHeight-50)+'px','left':(windowWidth/2-160)+'px'});
    //flotte ennemi à droite
    $('.flotteennemie').css({'left':(windowWidth-165+50)+'px'});
    // nombre flotte ennemi à droite
    $('#nbrVaisseauAttaque').css({'left':(windowWidth-41-65)+'px'});
    // barre PDV de la station
    $('#pdvStation').css({'top':(windowHeight/2+40)+'px','left':(windowWidth/2-50)+'px'});
    $('#nbrPdvStation').css({'top':(windowHeight/2+40)+'px','left':(windowWidth/2-50)+'px'});
    // message de fin de l'ennemi
    $('#affFinDeGameMechant').css({'top':(windowHeight/2-75)+'px','left':'-505px'});
    $('#affFinDeGameGentil').css({'top':(windowHeight/2-75)+'px','left':(windowWidth)+'px'});
    /***************************** PREPARATION OBJET AFFICHAGE *********************************/
    // ajout de X astéroide
    for (var i=0; i<10; i++) {
        genereAsteroide();
    };
    // prépare l'affichage de la station
    station = new affImg('img/sprite_game.png',0,50,100,100,(windowWidth/2),(windowHeight/2));
    // prépare l'affichage du champ de force
    affImgChanpDeForce = new affImg('img/sprite_game.png',300,50,100,100,0,0);
    // prépare l'affichage de la navette de récupération astéroide
    affImgNavetteRecuperation = new affImg('img/sprite_game.png',150,100,50,50,0,0);
    // prépare l'affichage des lumières rouges
    affLumiere = new affImg('img/sprite_game.png',150,150,50,50,0,0);
    // prépare l'affichage de l'explosion'
    affExplosion = new affImg('img/sprite_game.png',0,200,50,50,0,0);

    //lancement de la boucle
    loop();

    /***************************** Click action ******************************/
    // si on lic sur le canvas, on désaffiche toute fenêtre potentiellement ouverte
    $('#canvas').click(function(){
    	fermerTout();
    });
    			/******************* UP TAUX RECOLTE ********************/
    // Upgrader le taux de récolte
    $('#imgRecolte').click(function(){
    	if( $(this).attr('src') == 'img/uprecolte.gif' ){
    		if ( argent >= palierUpRecolte ){
    			//soustraire le montant et mettre à jour l'affichage
    			argent -= palierUpRecolte;
    			actualiseStock();
    			//augmente le taux de récolte
    			tauxRecolte++;
    			// nouveau pallier
    			palierUpRecolte=tauxRecolte*tauxRecolte/2*10;
    			// Mets à jour l'image d'upgrade du palier
    			$('#imgRecolte').attr('src','img/uprecolteinactif.png');
    			// mets à jour l'affichae du taux de récolte
    			$('#affTauxRecolte').html(tauxRecolte);
    		}
    	}
    });
    			/******************* UP AUTO RECOLTE ********************/
    // bouton upgrade récolte auto
    $('#boutonStation').click(function(){
    	fermerTout();
    	// recadre le block par rapport à la taille écran
    	var height= $('#popTopMenu').height();
    	$('#popTopMenu').css({'top':(windowHeight-height-55)+'px','left':(windowWidth/2-160)+'px'});

    	// change l'image si le UP est disponible
    	if ( minerai >= palierUpAutoRecolte && nrj >= palierUpAutoRecolte && argent >=palierUpAutoRecolte ){
    		$('#imgUpAutoRecolte').attr({'src':'img/uprecolte.gif'});
    	} else {
    		$('#imgUpAutoRecolte').attr({'src':'img/uprecolteinactif.png'});
    	}

    	//Mets à jour le taux d'auto recolte
    	$('#tauxAutoRecolte').html(tauxAutoRecolte);

    	// mets à jour les cout
    	$('#coutMineraiAutoRecolte').html(palierUpAutoRecolte);
    	$('#coutNrjAutoRecolte').html(palierUpAutoRecolte);
    	$('#coutArgentAutoRecolte').html(palierUpAutoRecolte);

    	// affiche ou cache le block
    	if( $('#popTopMenu').css('display') == 'none'){
    		$('#popTopMenu').fadeIn(250);
    	} else {
    		$('#popTopMenu').fadeOut(250);
    	}
    });
    $('#imgUpAutoRecolte').click(function(){
    	if ( minerai >= palierUpAutoRecolte && nrj >= palierUpAutoRecolte && argent >= palierUpAutoRecolte ){
    		// mise à jour des ressouces
    		minerai -= palierUpAutoRecolte;
    		nrj -= palierUpAutoRecolte;
    		actualiseStock();
    		// mise à jour du palier
    		palierUpAutoRecolte=(tauxAutoRecolte+1)*(tauxAutoRecolte+1);
    		// mise à jour du taux
    		tauxAutoRecolte+=1;
    		// ferme la fenêtre ( nécessaire pour actualiser les données, système à revoir )
    		$('#popTopMenu').fadeOut(250);
    	}
    });
    			/******************* CONSTRUCTION VAISSEAU ********************/
    $('#boutonFlotte').click(function(){
    	var coutMinerai = tauxConstruction*50;
    	var coutNrj = tauxConstruction*29;
    	var coutArgent = tauxConstruction*9;
    	if ( coutMinerai <= minerai && coutNrj <= nrj && coutArgent <= argent ){
    		nbrVaisseauDefense+=tauxConstruction;
    		minerai-=coutMinerai;
    		nrj-=coutNrj;
    		argent-=coutArgent;
    		actualiseStock();
    		actualiseFlotte();
    	}
    });
    			/******************* UP TAUX CONSTRUCTION VAISSEAU ********************/
    // bouton upgrade récolte auto
    $('#boutonUpFlotte').click(function(){
    	fermerTout();
    	// recadre le block par rapport à la taille écran
    	var height= $('#popTopMenu2').height();
    	$('#popTopMenu2').css({'top':(windowHeight-height-55)+'px','left':(windowWidth/2-160)+'px'});

    	// change l'image si le UP est disponible
    	if ( minerai >= palierUpTauxConstruction && nrj >= palierUpTauxConstruction ){
    		$('#imgUpTauxConstructionDefense').attr({'src':'img/uprecolte.gif'});
    	} else {
    		$('#imgUpTauxConstructionDefense').attr({'src':'img/uprecolteinactif.png'});
    	}

    	//Mets à jour le taux d'auto recolte
    	$('#tauxConstructionDefense').html(tauxConstruction);

    	// mets à jour les cout
    	$('#coutMineraiUpTauxConstructionDefense').html(palierUpTauxConstruction);
    	$('#coutNrjUpTauxConstructionDefense').html(palierUpTauxConstruction);

    	// affiche ou cache le block
    	if( $('#popTopMenu2').css('display') == 'none'){
    		$('#popTopMenu2').fadeIn(250);
    	} else {
    		$('#popTopMenu2').fadeOut(250);
    	}
    });
    $('#imgUpTauxConstructionDefense').click(function(){
    	if ( minerai >= palierUpAutoRecolte && nrj >= palierUpAutoRecolte && argent >=palierUpAutoRecolte ){
    		// mise à jour des ressouces
    		argent -= palierUpAutoRecolte;
    		minerai -= palierUpAutoRecolte;
    		nrj -= palierUpAutoRecolte;
    		actualiseStock();
    		// mise à jour du palier
    		palierUpAutoRecolte=(tauxConstruction+4)*(tauxConstruction+4);
    		// mise à jour du taux
    		tauxConstruction+=1;
    		// ferme la fenêtre ( nécessaire pour actualiser les données, système à revoir )
    		$('#popTopMenu2').fadeOut(250);
    	}
    });
    			/******************* BOUTON ATTAQUE ENNEMIE ********************/
    $('#boutonAttaque').click(function(){
    	combattre();
    });	
    /***************************** INTERVAL *********************************/
    autoRecolteInterval = setInterval(autoRecolte,5000);
    ennemyIncoming = setInterval(addVaisseauAttaque,1000);
    ennemyAttaque = setInterval(pertePdv,5000);
    /***************************** EVENEMENT *********************************/
    // curseur sur les objets
    document.getElementById('canvas').addEventListener('mousemove',function(e){posMouseX=e.pageX;posMouseY=e.pageY;},false);
    // clic sur un astéroide   
    document.getElementById('canvas').addEventListener('click',interactClick,false);
    // Fermeture du popup
    $('fermerPopop').click(function(){
        $('#fondPopup').remove();
    });
});
