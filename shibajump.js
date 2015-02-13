

	

function Shibajump() {


	this.init = function() {

		var sj = this;
		if (window.top !== window.self) {
			window.top.location.replace(window.self.location.href);
		}
		document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
		
		this.cvwidth 				= 600;
		this.cvheight 				= 600;
		this.resource_loaded 		= 0;
		this.total_resource 		= 6;
		this.max_bullet_size 		= 40;
		this.min_bullet_size 		= 10;
		this.maxfireinterval 		= 20;
		this.minfireinterval 		= 3;
		this.maxhp 					= 500;
		this.maxfuel				= 1000;
		this.normal_velocity 		= 22;
		this.hyper_velocity  		= 34;
		this.rocket_velocity 		= 40;
		this.timerinterval 			= 20;
		this.player 				= {};
		this.control_direction 		= [];
		this.altitude_reached 		= 0;
		this.new_height_target 		= 200;
		this.block_height 			= 0;
		this.block_height_gap 		= 100;
		this.block_last_x 			= 0;
		this.block_index 			= 0;
		this.maxblock 				= 150;
		this.tick 					= 1;
		this.bullet_index 			= 0;	
		this.bullet_size 			= this.min_bullet_size;
		this.maxbullet 				= 13;
		this.maxbonus 				= 40;
		this.bonus_index 			= 0;
		this.valdump 				= [];
		this.maxenemy 				= 40;
		this.enemyindex 			= 0;
		this.enemytypeupgrade 		= 0;
		this.enemytypeupgradetimer = 0;
		this.maxexplosion 			= 20;
		this.explosionindex 		= 0;
		this.camera 				= {};
		
		var canvas = document.getElementById("cv");
		this.ctxt = canvas.getContext('2d');

		this.imgshiba = new Image();
		this.imgshiba.src = 'images/shiba.png';
		this.imgshiba.addEventListener('load', function() {

			sj.loadcomplete();

		}, false);		

		this.imgblocks = new Image();
		this.imgblocks.src = 'images/blocks.png';
		this.imgshiba.addEventListener('load', function() {

			sj.loadcomplete();

		}, false);	

		this.imgbg = new Image();
		this.imgbg.src = 'images/background.png';
		this.imgbg.addEventListener('load', function() {

			sj.loadcomplete();
		}, false);		


		this.imgaltcoin = new Image();
		this.imgaltcoin.src = 'images/altcoin_64.png';
		this.imgaltcoin.addEventListener('load', function() {
			sj.loadcomplete();
			
		}, false);

		this.imgrocketfire = new Image();
		this.imgrocketfire.src = 'images/rocketfire.png';
		this.imgrocketfire.addEventListener('load', function() {
			sj.loadcomplete();
			
		}, false);	

		this.imgexplosion = new Image();
		this.imgexplosion.src = 'images/explosion.png';
		this.imgexplosion.addEventListener('load', function() {
			sj.loadcomplete();
			
		}, false);



		this.wavwow 		= new Audio('sounds/wow.wav');
		this.wavland 		= new Audio('sounds/land.wav');
		this.wavsaddog 		= new Audio('sounds/saddog.wav');
		this.mp3bgmusic 	= new Audio('sounds/bgmusicfull.mp3');
		this.mp3bgmusic.loop = true;
		this.wavgameover 	= new Audio('sounds/gameover.wav');
		this.wavcollect 	= new Audio('sounds/collect.wav');
		this.wavtorpedo 	= new Audio('sounds/torpedo.wav');
		this.wavexplosion 	= new Audio('sounds/explosion.wav');

		// Create 
		this.blocks 				= [];
		for ( i = 0 ; i < this.maxblock ; i++ ) {
			this.blocks[i] = { x:0,y:0,active:0 };
		}


		this.bullets 				= [];
		for ( i = 0 ; i < this.maxbullet ; i++ ) {
  			this.bullets[i] = { x : 0 , y : 0 , active: 0};
  		}

  		this.bonuses 				= [];
		for ( i = 0 ; i < this.maxbonus ; i++ ) {
  			this.bonuses[i] = { x:0, y:0 , active:0, type:0 };
  		}

  		this.enemies 				= [];
		for ( i = 0 ; i < this.maxenemy ; i++ ) {
  			this.enemies[i] = { 
  							x: 0, 
  							y: 0, 
  							active: 0 , 
  							type : this.rand(15),
  							tx: 0,
  							ty: 0 
  						};
  		}


  		this.explosion 				= [];
		for ( i = 0 ; i < this.maxexplosion ; i++ ) {
  			this.explosion[i] = {x:0,y:0,active:0,frame:0};
  		}

  		document.addEventListener("keydown" , function( evt ) {
			sj.keyDownEvent(evt);
		}, false );	

		
		document.addEventListener("keyup"   , function( evt ) {
			sj.keyUpEvent(evt);
		}, false );	

		
		/*
		canvas.addEventListener("touchstart", function( evt) {
			sj.touchStartEvent(evt);
		}, false);

		canvas.addEventListener("touchmove", function( evt) {
			sj.touchMoveEvent(evt);
		}, false);
		
		canvas.addEventListener("touchend", function( evt) {
			sj.touchEndEvent(evt);
		}, false);
		*/



	}





	//----------------------------------
	this.addfuel = function( x  ){

		this.player.fuel += x;
		if ( this.player.fuel > this.maxfuel ) {
			this.player.fuel = this.maxfuel;
		}
	}

	//-------------------------
	this.addhp = function( x ) {

		this.player.hp += x ;
		if ( this.player.hp > this.maxhp ) {
			this.player.hp = this.maxhp;
	
		} else if ( this.player.hp <= 0 ) {
			this.player.hp = 0;
			this.player.active = 0;
		}
	}

	//------
	this.addpower = function( x ) {

		if ( this.player.hyperon == 1 ) {

			this.valdump[1] += x;
			if ( this.valdump[1] > this.max_bullet_size ) {
				this.valdump[1] = this.max_bullet_size;	
			}
			if ( this.valdump[1] < this.min_bullet_size ) {
				this.valdump[1] = this.min_bullet_size;
			}
		} else {
			
			
			this.bullet_size += x;
			if ( this.bullet_size > this.max_bullet_size ) {
				this.bullet_size = this.max_bullet_size;	
			}
			if ( this.bullet_size < this.min_bullet_size ) {
				this.bullet_size = this.min_bullet_size;
			}
	
		}					
	}


	//----
	this.checkBonusCollisionWithPlayers = function( bi ) {

		var diffx = this.bonuses[bi].x - this.player.x;
		var diffy = this.bonuses[bi].y - this.player.y;
		if ( diffx * diffx + diffy * diffy < 3304 ) {
			return 1;
		}
		return 0;
	}


	//-----
	this.checkCollisionWithEnemies = function( bi ) {

		for (var i = 0 ; i < this.maxenemy ; i++ ) {

			if ( this.enemies[i].active == 1 ) {
			
				var diffx = this.enemies[i].x - this.bullets[bi].x ;
				var diffy = this.enemies[i].y - this.bullets[bi].y ;

				if ( diffx * diffx + diffy * diffy < 1024 ) {
					return i;
				}
			}
		}
		return -1;

	}

	//---
	this.checkCollisionWithPlayers = function( ei ) {

		var diffx = this.enemies[ei].x - this.player.x;
		var diffy = this.enemies[ei].y - this.player.y;
		if ( diffx * diffx + diffy * diffy < 2304 ) {
			return 1;
		}
		return 0;
	}


	

	//-------------
	this.checkcollisionwithblocks = function() {

		for ( var i = 0 ; i < this.maxblock ; i++ ) {

			if ( this.blocks[i].active == 1 ) {

				if ( this.player.x >= ( this.blocks[i].x - 48) &&
					 this.player.x <= ( this.blocks[i].x + 48) &&
					 this.player.y >= ( this.blocks[i].y - 32) &&
					 this.player.y <= ( this.blocks[i].y ) ) {

					return i;
				}

			}

		}
		return -1;
	}



	//----
	this.createblock = function( x , y ) {

		this.blocks[this.block_index].x = x ;
		this.blocks[this.block_index].y = y ;
		this.blocks[this.block_index].active = 1 ;

		this.block_index = ( this.block_index + 1 ) % this.maxblock ;
	}


	//--
	this.createbonuses = function( x,y,type) {

		this.bonuses[this.bonus_index].x = x;
		this.bonuses[this.bonus_index].y = y;
		this.bonuses[this.bonus_index].type = type;
		this.bonuses[this.bonus_index].active = 250;

		this.bonus_index = ( this.bonus_index + 1) % this.maxbonus;
	}


	//---
	this.createenemies = function( x,y, type , isboss ) {

		this.enemies[this.enemyindex].x = x;
		this.enemies[this.enemyindex].y = y;
		this.enemies[this.enemyindex].type = type;
		this.enemies[this.enemyindex].active = 1;
		this.enemies[this.enemyindex].tx = this.rand(600);
		this.enemies[this.enemyindex].isboss = isboss;

		if ( this.player.rocketon ) {
			
			this.enemies[this.enemyindex].rocketon = 1;
			this.enemies[this.enemyindex].ty = this.rand(600) + this.altitude_reached;

		} else {
			this.enemies[this.enemyindex].ty = this.rand(400);
			this.enemies[this.enemyindex].rocketon = 0;
		}


		this.enemies[this.enemyindex].frame = 0;
		

		if ( type > 13 ) {
			this.enemies[this.enemyindex]["life"] = type * 6 ;
		} else if ( type > 10 ) {
			this.enemies[this.enemyindex]["life"] = type * 3 ;
		} else if ( type > 5 ) {
			this.enemies[this.enemyindex]["life"] = type * 4 ;
		} else {
			this.enemies[this.enemyindex]["life"] = type * 3 ;
		}

		if ( isboss	 == 1 ) {
			this.enemies[this.enemyindex]["life"] *= 5;
		
		} 


			
		this.enemyindex = (this.enemyindex + 1) % this.maxenemy;
	}



	//------
	this.createexplosion = function( x,y ) {

		this.explosion[this.explosionindex].x = x;
		this.explosion[this.explosionindex].y = y;
		this.explosion[this.explosionindex].active = 1;
		this.explosion[this.explosionindex].frame = 0;
		
		this.explosionindex = ( this.explosionindex + 1 )  % this.maxexplosion;
		this.wavexplosion.play();
	}


	//--------
	this.firebullet = function() {

		this.bullets[ this.bullet_index].x = this.player.x;
		this.bullets[ this.bullet_index].y = this.player.y - this.player.screenoffy;
		if ( this.player.rocketon ) {
		
			this.bullets[ this.bullet_index].vy = - this.rocket_velocity - 25;
		
		} else {
			this.bullets[ this.bullet_index].vy = ( this.player.vy < - this.normal_velocity) ? - this.hyper_velocity - 6: - this.normal_velocity - 3;
		}
		this.bullets[ this.bullet_index].vx = this.player.face * 10 - 5;
		this.bullets[ this.bullet_index].active = 1;
		this.bullet_index = ( this.bullet_index + 1) % this.maxbullet ;
	}

	//--------
	this.getenemysrcx = function( type ) {

		return [4,3,1,0, 9,8,7,6,  5,5,4,3,  2,1,0,0, 6, 0][type];
	}

	this.getenemysrcy = function( type ) {

		return [1,1,1,1, 0,0,0,0,  0,1,0,0,  0,0,0,0, 1, 2][type];
	}


	
	//----
	this.int_div = function( x , y ) {
		return ( x / y ) >> 0;
	}


	//----
	this.keyDownEvent = function(evt) {
    	
    	//var eType = evt.type; 
		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		if ( keyCode >= 37 && keyCode <= 40 ) {
			this.control_direction[ keyCode - 37 ] = 1;
		
		} else if ( keyCode == 90 ) {

			if ( this.player.active == 1 ) {
				this.player.fireon = 1;
			}
		}
		
	}


	//----
	this.keyUpEvent = function(evt) {

   		//var eType = evt.type; 
   		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			this.control_direction[ keyCode - 37 ] = 0;
		
		} else if ( keyCode == 77 ) {

			if ( this.mp3bgmusic.paused ) {
				this.mp3bgmusic.play();
			} else {
				this.mp3bgmusic.pause();
			}
		
		} else if ( keyCode == 80 ) {

			this.reinit_game();
		
		} else if ( keyCode == 90 ) {

			if ( this.player.active == 1 ) {
				this.wavwow.play();
				this.firebullet();
			}
			this.player.fireon = 0;
			
		} 

	}

	//-------
	this.loadcomplete = function() {

		var sj = this;
		this.resource_loaded += 1;
		
		if ( this.resource_loaded == this.total_resource ) {

			this.reinit_game();
			setTimeout( function() {
				
				sj.onTimer();

			}, this.timerinterval );
		} else {
			this.loading_screen();
		}
	}



	//--
	this.loading_screen = function() {

		var percent_complete = ( this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
		this.ctxt.clearRect( 0,0,600,600 );
		this.ctxt.fillStyle = "white";
		this.ctxt.fillText( "Loading Resources . " + percent_complete + "% loaded" , 200, 300);

		
	}


	//---
	this.move_enemies = function(ei) {

		if ( this.enemies[ei].rocketon ) {

			if ( this.player.rocketon == 0 ) {
				this.enemies[ei].ty = this.enemies[ei].y - 600;
			}

			var offy  = this.enemies[ei].ty - this.enemies[ei].y;
			var offx  = this.enemies[ei].tx - this.enemies[ei].x;


			if ( offx * offx + offy * offy > 1600 ) {

				this.enemies[ei].x += offx / 40 >> 0;
				this.enemies[ei].y += offy / 40 >> 0;	
			
			} else {

				this.enemies[ei].tx = this.rand(640) - 20;
				this.enemies[ei].ty = this.rand(640) - 20 + this.altitude_reached;

			}

			this.enemies[ei].ty += this.player.vy;
			this.enemies[ei].y  += this.player.vy;

				

		} else {		
			this.enemies[ei].y += 1;	
			if ( this.enemies[ei].y > 100 ) {
				this.enemies[ei].active = 0;
			}
		}
	}




	//----
	this.onDraw = function() {

		var i;
		this.ctxt.clearRect( 0,0, this.cvwidth , this.cvheight );

		for ( i = -3 ; i < 6 ; i++ ) {
			for ( j = 0 ; j < 8 ; j++ ) {
				this.ctxt.drawImage( this.imgbg , 
					0 , 0 , 128 , 128 , 
						j * 128 , 
						i * 128 - (this.camera.y % 128), 
						128, 128 );
			}
		}


		if ( this.player.active == 1 ) {
		
			for ( i = 0 ; i < this.maxblock ; i++ ) {

				if ( this.blocks[i].active == 1 ) {			
					this.ctxt.drawImage( this.imgblocks , 
								0 , 
								0 , 
								128 , 64 , 
						this.blocks[i].x - 32 , 
						this.blocks[i].y  - this.camera.y - 16 , 
						64, 32 );
				}
			}


			if ( this.player.rocketon ) {
				var xframe = 4;
				this.wavtorpedo.play();

			} else {
				var xframe = this.player.frame;
			}

			var yframe = this.player.face;
			var xsize  = this.player.hyperon > 0 ? 80 : 64;
			var ysize  = this.player.hyperon > 0 ? 80 : 64;
			

			// Draw Fire
			if ( this.player.rocketon == 1 ) {	
				this.ctxt.drawImage( this.imgrocketfire , 
								96 * ( this.tick % 3) , 
								0 , 
								96 , 
								150 , 
					this.player.x - 48 , 
					this.player.y - this.camera.y , 96, 150 );
			
			}


			// draw player
			this.ctxt.drawImage( this.imgshiba , 
						128 + xframe * 64 , 
						yframe * 64 , 64 , 64 , 
					this.player.x - xsize/2 , 
					this.player.y - ysize/2 - this.camera.y   , 
					xsize, ysize );

			

			// Draw bullets
			for ( i = 0 ; i < this.maxbullet ; i++ ) {
				
				if ( this.bullets[i].active == 1 ) {
					
					this.ctxt.drawImage( this.imgaltcoin, 2*64,64,64,64,
						this.bullets[i].x - this.bullet_size/2 , 
						this.bullets[i].y - this.bullet_size/2 - this.camera.y + this.player.screenoffy, 
						this.bullet_size,
						this.bullet_size   );

				}
			}


			// Draw bonuses
			this.ctxt.font = "14px Comic Sans MS";
	  		for ( i = 0 ; i < this.maxbonus ; i++ ) {

				if ( this.bonuses[i].active > 0 ) {
					
					if ( this.bonuses[i].type == 0 ) {
						
						this.ctxt.fillStyle = "#00ff00";
						this.ctxt.fillText( "Much power" , this.bonuses[i].x - 32, this.bonuses[i].y- this.camera.y);
					
					} else if ( this.bonuses[i].type == 1 ) {

						this.ctxt.fillStyle = "#ff0000";
						this.ctxt.fillText( "Such Health" , this.bonuses[i].x - 42 , this.bonuses[i].y - this.camera.y );
						
					} else if ( this.bonuses[i].type == 2 ) {

						this.ctxt.fillStyle = "#ffff00";
						this.ctxt.fillText( "Wow Fuel" , this.bonuses[i].x - 32, this.bonuses[i].y - this.camera.y);

					} else if ( this.bonuses[i].type == 3 ) {

						this.ctxt.fillStyle = "#ffffff";
						this.ctxt.fillText( "Wow Steroid" , this.bonuses[i].x - 42, this.bonuses[i].y - this.camera.y);
						
					} else if ( this.bonuses[i].type == 4 ) {

						this.ctxt.drawImage( this.imgshiba, 4*64, 4 * 64,64,64,
								this.bonuses[i].x - 24 , 
								this.bonuses[i].y - 30 - this.camera.y, 
								48,
								48   );
					}					

				}
			}

			// Draw enemies
			for ( i = 0 ; i < this.maxenemy ; i++ ) {

				if ( this.enemies[i].active == 1 ) {
					
					var isboss = this.enemies[i].isboss;
					var size = isboss? 64 :32  ;
					var halfsize = size/2 ;

					// Draw Fire
					if ( this.enemies[i].rocketon == 1 ) {	
						this.ctxt.drawImage( this.imgrocketfire , 96 * (this.tick % 3) , 0 , 96 , 150 , 
						this.enemies[i].x - 48 , 
						this.enemies[i].y - this.camera.y + this.player.screenoffy ,
						 96, 150 );
					
					}


					this.ctxt.drawImage( this.imgaltcoin, 
						( this.getenemysrcx( this.enemies[i].type) + this.enemies[i].frame) * 64,
						  this.getenemysrcy(  this.enemies[i].type) * 64,
						64,
						64,
						this.enemies[i].x - halfsize , 
						this.enemies[i].y - halfsize - this.camera.y + this.player.screenoffy, 
						size,
						size   );

				
				}
			}

			for ( i = 0 ; i < this.maxexplosion ; i++ ) {

				if ( this.explosion[i].active == 1 ) {
					
					this.ctxt.drawImage( this.imgexplosion, 
						( this.explosion[i].frame % 6) * 64,
						(( this.explosion[i].frame / 6) >> 0 ) * 64,
						64,
						64,
						this.explosion[i].x - 32 , 
						this.explosion[i].y - 32 - this.camera.y + this.player.screenoffy, 
						64,
						64   );

				}
			}


		} else {
			this.ctxt.fillStyle = "white";
			this.ctxt.font = "20px Comic Sans MS";
			this.ctxt.fillText( "Poor shibe. Press P to play again!" ,160, 300 );
		}			


		
		this.ctxt.fillStyle = "white";
		this.ctxt.font = "10px Comic Sans MS";
		
		// text
		if ( this.player.hyperon  > 0 ) {
			this.ctxt.fillText( "Steroid Mode : " +  this.player.hyperon  , 480, 530);
		}

		if ( this.player.hp < 50 ) {
			this.ctxt.fillStyle = "red";
			this.ctxt.font = "20px Comic Sans MS";
		}
		this.ctxt.fillText( "Health : " +  this.player.hp , 480, 545);
		


		this.ctxt.fillStyle = "white";
		this.ctxt.font = "10px Comic Sans MS";
		
		this.ctxt.fillText( "Fuel   : " +  this.player.fuel , 480, 560);
		this.ctxt.fillText( "Power  : " +  this.bullet_size , 480, 575);
		this.ctxt.fillText( "$ : " +  ( -this.altitude_reached / 2000000.0 ).toFixed(8) , 480, 590);

		if ( -this.altitude_reached >= 2000000 ) {
			this.ctxt.fillText( "You won. You can stop anytime now." , 280, 590);

		}


		

	}



	//----
	this.onTimer = function() {


		var i;
		var sj = this;

		if ( this.player.active == 1 )  {

			if ( this.player.y < 100 && this.player.y - this.altitude_reached < 2400 ) {


				// Hit the ground or a block, jump
				var block_i = this.checkcollisionwithblocks();
				if ( block_i > -1 ) {

					this.player.vy =  ( this.player.hyperon > 0) ? -this.hyper_velocity: -this.normal_velocity ;
					this.player.frame = 0;
					this.wavland.play();
				}


				// Check for time to update altitude reached
				if ( this.player.y < this.altitude_reached ) {
					this.altitude_reached = this.player.y 
				}
						

				// Remove lower block 
				for ( i = 0 ; i < this.maxblock ; i++ ) {
					if ( this.blocks[i].active == 1 ) {


						if ( this.blocks[i].y > this.altitude_reached + 600 + ( this.player.hyperon > 0 ? 400 : 0) ) {
							

							this.blocks[i].active = 0;

							var new_x = ( this.block_last_x + this.rand(400) - 200 + 600 ) % 600; 
							var new_y =   this.block_height * -this.block_height_gap;
							this.createblock(   new_x , new_y );
							this.release_bonuses( new_x , new_y - 20);

							


							this.block_last_x = new_x;
							this.block_height += 1;


						}
					}
				}

				
				i
				
				// Reach new height target
				if ( this.player.y < this.new_height_target ) {
					
					if ( this.player.rocketon ) {
						this.new_height_target -= 1400;
					} else {
						this.new_height_target -= 600;
						
					}

					this.enemytypeupgradetimer += 1;
					this.release_enemies( this.rand(3) );	
					if ( this.enemytypeupgradetimer % 12 == 0 ) {
						this.enemytypeupgrade = ( this.enemytypeupgrade + 1) % 17;
					}

				}

				

				if ( this.player.rocketon == 1 ) {
					this.player.vy = -this.rocket_velocity;
				} else {
					this.player.vy += this.player.ay;
				}
				this.player.y += this.player.vy;


				if ( this.player.vy < -22 ) {

					this.player.frame = 1;

				} else if ( this.player.vy >= -22  && this.player.vy <= -18 ) {
					this.player.frame = 0;
				
				} else if ( this.player.vy >= -17 && this.player.vy <= -10 ) {
					this.player.frame = 1;
				
				} else if ( this.player.vy >= -9 && this.player.vy <= 5 ) {
					this.player.frame = 2;
				
				} else if ( this.player.vy > 5 ) {
					this.player.frame = 3;
				
				}


				// horizontal navigation			
				if ( this.control_direction[0] ) {
					this.player.x -= 5;
					this.player.face = 0;

					
				}
				if ( this.control_direction[2] ) {
					this.player.x += 5;
					this.player.face = 1;

				}
				this.player.x = ( this.player.x + 600) % 600;


				// Vertical nav when rocketon
				if ( this.player.rocketon == 1 ) {
					
					if ( this.control_direction[1] == 1  ) {
					
						this.player.screenoffy += 5;
							

					} else if ( this.control_direction[3] == 1  ) {
						
						this.player.screenoffy -= 5;
						
					}
				} else {

					if ( this.player.screenoffy != 0 ) {
						// Gradually put back to center if not on rocket and not on center.
						this.player.screenoffy *= 0.8;

					}
				}




				// enemies																																								
				for ( i = 0 ; i < this.maxenemy ; i++ ) {

					if ( this.enemies[i].active == 1 ) {
						
						this.move_enemies(i);

						if ( this.enemies[i].type == 17 ) {
							this.enemies[i].frame = ( this.enemies[i].frame + 1 )% 6;
						}
						
						// CRASH
						if ( this.checkCollisionWithPlayers(i) == 1 ) {
							

							
							this.createexplosion( this.player.x, this.player.y );
							this.enemies[i].active = 0;
							
							if ( this.player.hyperon == 0 ) {
								this.addpower(-1);
								this.addhp(   ( this.enemies[i].type + 1) * -2  );
								this.wavsaddog.play();
							}
						}

						
					}
				}



				// fire
				if ( this.tick % this.player.autofireinterval == 1 ) {
					if ( this.player.fireon == 1 ) {
						this.wavwow.play();
						this.firebullet();
					}
				}	
				
				//bullet
				for ( i = 0 ; i < this.maxbullet ; i++ ) {
					
					if ( this.bullets[i].active == 1 ) {
						
						if ( this.bullets[i].vy < 20 ) {
							this.bullets[i].vy += 1 ;
						}
						this.bullets[i].y += this.bullets[i].vy ;
						this.bullets[i].x += this.bullets[i].vx ;
						
						if ( ( enemy_i = this.checkCollisionWithEnemies(i) ) != -1 ) {

							this.bullets[i].active = 0;
							this.createexplosion( this.bullets[i].x, this.bullets[i].y);
							
							this.enemies[enemy_i].life -=  this.bullet_size + 1;

							if ( this.enemies[enemy_i].life <= 0 ) {
								
								this.enemies[enemy_i].active = 0;
								this.release_bonuses( this.enemies[enemy_i].x , this.enemies[enemy_i].y);

							}
						}
					} 
				}

				// Eat bonus
				for ( i = 0 ; i < this.maxbonus ; i++ ) {

					if ( this.bonuses[i].active > 0 ) {
						
						// Eat bonus
						if ( this.checkBonusCollisionWithPlayers( i ) == 1 ) {

							if ( this.bonuses[i].type == 0 ) {
								
								this.addpower(1);
							
							} else if ( this.bonuses[i].type == 1 ) {
								
								this.addhp(15);

							} else if ( this.bonuses[i].type == 2 ) {
								
								this.addfuel(25);

							} else if ( this.bonuses[i].type == 3 ) {

								if ( this.player.hyperon  <= 0 ) {
									
									this.valdump[1] = this.bullet_size;
									this.bullet_size = this.max_bullet_size;
								}
								this.player.hyperon = 600;

							} else if ( this.bonuses[i].type == 4 ) {

								this.player.rocketon = 1;
								this.player.fuel += 200;
							}
							
							this.bonuses[i].active = 0;
							this.wavcollect.play();

						}
					}

				}
				if ( this.player.hyperon > 0 ) {
					this.player.hyperon  -= 1 ;
					if ( this.player.hyperon  <= 0 ) {

						this.bullet_size = this.valdump[1];
					}
				}

				if ( this.player.rocketon == 1 ) {
					this.player.fuel -= 1;
					if ( this.player.fuel <= 0 ) {
						this.player.rocketon = 0;
					}

				}

				if ( this.tick % 2 == 1 ) {
					for ( i = 0 ; i < this.maxexplosion ; i++ ) {

						if ( this.explosion[i].active == 1 ) {
							
							this.explosion[i].frame += 1;
							if ( this.explosion[i].frame >= 15 ) {
								this.explosion[i].active = 0;
							}
						}
					}
				}



			} else {

				// Game over
				this.wavgameover.play();
				this.wavsaddog.play();
				this.mp3bgmusic.pause();
				this.mp3bgmusic.currentTime = 0;
				this.player.active = 0;
			}
		}



		this.camera.target_y = this.player.y - this.cvheight * 3/5 + this.player.screenoffy;
		this.camera.y 		+= ( ( this.camera.target_y - this.camera.y ) / 10 >> 0  );


		this.onDraw();
		this.tick += 1;

		
			
		setTimeout( function() {
			sj.onTimer();
		}, this.timerinterval);
		

	}


	//------
	this.rand = function( x ) {

		return Math.floor( Math.random() * x );

	}


	this.reinit_game = function() {

		var i;

		for ( i = 0 ; i < this.maxblock ; i++ ) {
			this.blocks[i].active = 0;
		}


		for ( i = 0 ; i < 10 ; i++) {
			this.createblock( i * 64,0);
		}


		for ( i = 0 ; i < this.maxenemy ; i++) {
			this.enemies[i].active = 0;
		}

		// First 3 blocks at the left side to prevent player from jumping from the beginning.
		for ( i = 0 ; i < 3 ; i++ ) {
			this.createblock( i * 10 , i * -this.block_height_gap );
		}

		// The next initial 17 blocks
		for ( i = 3 ; i < 20 ; i++ ) {
			
			var x1 = this.rand(600);
			var x2 = (x1 + 300) % 600;
			this.createblock( x1 , i * -this.block_height_gap );
			this.createblock( x2 , i * -this.block_height_gap );
		}

		
		this.player.x 					= 300;
		this.player.y 					= 0;
		this.player.vx 					= 0;
		this.player.vy 					= 0;
		this.player.ax 					= 0;
		this.player.ay 					= 1;
		this.player.face 				= 0;
		this.player.active 				= 1;
		this.player.xframe 				= 0;
		this.player.fireon 				= 0;
		this.player.autofireinterval 	= 20;
		this.player.hyperon				= 0;
		this.player.rocketon			= 0;
		this.player.screenoffy			= 0;
		this.player.hp					= 100;
		this.player.fuel				= 50;
		this.bullet_size 				= this.min_bullet_size;
		this.valdump[1] 				= this.min_bullet_size;
		this.altitude_reached  			= 0;
		this.new_height_target 			= -400;
		this.enemytypeupgrade 			= 0;
		this.enemytypeupgradetimer 		= 1;
		this.block_height 				= i ;
		this.block_last_x 				= x2;
		this.camera.y 					= 0;
		this.camera.target_y 			= 0;

		this.mp3bgmusic.play();

			
	}


	//--------------------------
	this.release_bonuses = function( x, y) {

		// reward bonus
		if ( this.rand(40) < 1 && this.altitude_reached < -5000 && this.player.rocketon == 0) {
			
			//Steroid
			this.createbonuses( x, y  , 3 ) ;
		
		} else if ( this.rand(35) < 1 && this.altitude_reached < -10000 && this.player.rocketon == 0 ) {

			// Rocket
			this.createbonuses( x, y  , 4 ) ;

		}  else if ( this.rand(30) < 1 && this.player.rocketon == 0  ) {
			
			this.createbonuses( x, y  ,2) ;
			
		} else if ( this.rand(25) < 1 ) { 
			
			this.createbonuses( x, y  , 1) ;
		
		}  else if ( this.rand(20) < 1 ) { 
			this.createbonuses( x, y  , 0 ) ;
		}
	}

	//---
	this.release_enemies = function( n ) {

		for ( var i = 0 ; i < n && i < this.maxenemy; i++ ) {

			var enemytype = this.enemytypeupgrade;
			if ( this.enemytypeupgrade > 15 ) {
				enemytype = this.rand(15);
			}

			this.createenemies( this.rand(600), this.new_height_target - 1200 + this.rand(1200) , enemytype , 0 ) ;
			
		}

	}

	//---------
	this.touchEndEvent = function( evt ) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var touch   = touches[0];

		if ( this.player.active == 0 ) {
			this.reinit_game();
		}
		
	}

	this.touchMoveEvent = function( evt ) {
		evt.preventDefault();
		
		
		
	}

	this.touchStartEvent = function( evt ) {
		evt.preventDefault();
		
		
		
	}	


}

//---------------------------------------
function main() {

	sj = new Shibajump();
	sj.init();
}




	

	


	


	




