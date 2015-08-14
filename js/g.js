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
var station;                              // affichage de la sation
var champDeForce=false;                   // affiche le champ de force autour de l'astéroide au clic
var cptAffChampDeForce=0;                 // variable du champ de force
var minerai,nrj,argent;                   // variable des ressource
var tmp;                                  // Variable de sauvegarde temporaire

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

    // relance la boucle
    window.requestAnimFrame(loop);
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
function clignotte(id){
    $('#'+id).delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1).delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1);
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

    // La station
    if ( posMouseX > windowWidth/2-50 && posMouseX < windowWidth/2+50 && posMouseY > windowHeight/2-50 && posMouseY < windowHeight/2+50 ){
        cursor = true;
        clickObject='station';
    }
    // Les astéroides
    for ( key in asteroide ){
        if ( posMouseX > asteroide[key].posx && posMouseX < asteroide[key].posx+asteroide[key].affWidth && posMouseY > asteroide[key].posy && posMouseY < asteroide[key].posy+asteroide[key].affHeight ){
            cursor = true;
            clickObject = key;
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
    if ( cursor && !champDeForce && clickObject!='station' ){
        // stock l'astéroide cliqué
        champDeForce = clickObject;

        if ( asteroide[champDeForce].srcX === 150 ){
            var typeAsteroide='minerai';
        } else if ( asteroide[champDeForce].srcX === 200 ){
            var typeAsteroide='nrj';
        } else {
            var typeAsteroide='argent';
        }

    }
}
function addRecolte(qt,type){
    // ajoute la quantité récolté
    switch (type){
        case 'minerai':
            var actuel = minerai+parseInt(qt);
            break;
        case 'nrj':
            var actuel = nrj+parseInt(qt);
            break;
        case 'argent':
            var actuel = argent+parseInt(qt);
            break;
    }
    
    // Montre le bénéfice et l'efface ensuite
    var date = new Date();
    var id = 'div'+date.getTime();
    if (qt>=0){ var color='green';var sym='+ '; } else { var color='red';var sym='- '; }
    $('#ress'+type).append('<div id="'+id+'" style="color:'+color+';">Scan...</div>');

    

    // efface le bénéfice et reset l'astéroide
    setTimeout(function(){
        $('#'+id).fadeOut(1000,function(){
            $('#'+id).html(sym+number_format(qt,0,',',' '));
            $('#'+type).html(number_format(actuel,0,',',' '));
            $('#'+id).fadeIn(1000,function(){
                setTimeout(function(){
                    $('#'+id).remove();
                    asteroide[champDeForce].resetPosition();
                    champDeForce=false;
                },1000);
            });
        });
    },2000);

}
function actualiseStock(){
    // mets à jour l'affichage
    $('#minerai').html(number_format(minerai));
    $('#nrj').html(number_format(nrj));
    $('#argent').html(number_format(argent));
}
/******************************************** OBJET ************************************************/
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

    if ( !champDeForce || champDeForce && asteroide[champDeForce].posx!==this.posx ){
        this.posx+=this.sensX;
        this.posy+=this.sensY;

        // relance l'astéroide s'il sort de la zone
        if ( this.posx > windowWidth+250 || this.posy > windowHeight+250 || this.posx < -250 || this.posy < -250 ){
            this.resetPosition();
        }
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
/******************************************** JQUERY ************************************************/
$(document).ready(function(){

    // Ajout du canvas
    $('body').prepend('<canvas id="canvas" width="'+windowWidth+'" height="'+windowHeight+'"></canvas>');
    // Elem + ctx
    elem = document.getElementById('canvas');
    ctx = elem.getContext('2d');

    // stock les ressources dans des variables
    minerai = parseInt($('#minerai').html());
    nrj = parseInt($('#nrj').html());
    argent = parseInt($('#argent').html());
    // mets en forme l'affichage
    $('#minerai').html(number_format(minerai,0,',',' '));
    $('#nrj').html(number_format(nrj,0,',',' '));
    $('#argent').html(number_format(argent,0,',',' '));
    /***************************** Menu *********************************/
    $('#menu').css({'top':(windowHeight-50)+'px','left':(windowWidth/2-160)+'px'});
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
