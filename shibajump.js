

	var ctxt;

	var resource_loaded = 0;
	var total_resource = 6;
	
	var max_bullet_size = 40;
	var min_bullet_size = 10;
	var maxfireinterval = 20;
	var minfireinterval = 3;
	var maxhp 			= 500;
	var maxfuel			= 1000;

	var normal_velocity = 22;
	var hyper_velocity  = 34;
	var rocket_velocity = 40;
	

	var imgshiba;
	var imgaltcoin;
	var imgblocks;
	var imgrocketfire;
	var imgbackground;
	var imgexplosion;


	var mp3bgmusic;

	var wavgameover;
	var wavwow ;
	var wavland;
	var wavcollect;
	var wavsaddog;
	var wavtorpedo;
	var wavexplosion;


	var timerinterval = 20;
	var player = {};
	var control_direction = [];


	var altitude_reached = 0;
	var new_height_target = 200;

	
	var blocks 				= [];
	var block_height 		= 0;
	var block_height_gap 	= 100;
	var block_last_x 		= 0;
	var block_index 		= 0;
	var maxblock 			= 150;

	
	
	var tick = 1;


	var bullets 			= [];
	var bullet_index 		= 0;	
	var bullet_size 		= min_bullet_size;
	var maxbullet 			= 13;
	
	var bonuses 			= [];
	var maxbonus 			= 40;
	var bonus_index 		= 0;

	var valdump 			= [];


	var enemies 			= [];
	var maxenemy 			= 40;
	var enemyindex 			= 0;
	var enemytypeupgrade 	= 0;
	var enemytypeupgradetimer = 0;

	var explosion 			= [];
	var maxexplosion 		= 20;
	var explosionindex 		= 0;

	


	function addfuel( x  ){

		player["fuel"] += x;
		if ( player["fuel"] > maxfuel ) {
			player["fuel"] = maxfuel;
		}
	}

	function addhp( x ) {

		player["hp"] += x ;
		if ( player["hp"] > maxhp ) {
			player["hp"] = maxhp;
	
		} else if ( player["hp"] <= 0 ) {

			player["hp"] = 0;
			player["active"] = 0;

		}


	}


	//------
	function addpower( x ) {

		if ( player["hyperon"] == 1 ) {

			valdump[1] += x;
			if ( valdump[1] > max_bullet_size ) {
				valdump[1] = max_bullet_size;	
			}
			if ( valdump[1] < min_bullet_size ) {
				valdump[1] = min_bullet_size;
			}
		} else {
			
			
			bullet_size += x;
			if ( bullet_size > max_bullet_size ) {
				bullet_size = max_bullet_size;	
			}
			if ( bullet_size < min_bullet_size ) {
				bullet_size = min_bullet_size;
			}
	
		}					
	}


	//----
	function checkBonusCollisionWithPlayers( bi ) {

		var diffx = bonuses[bi]["x"] - player["x"];
		var diffy = bonuses[bi]["y"] - player["y"];
		if ( diffx * diffx + diffy * diffy < 3304 ) {
			return 1;
		}
		return 0;
	}


	//-----
	function checkCollisionWithEnemies( bi ) {

		for (var i = 0 ; i < maxenemy ; i++ ) {

			if ( enemies[i]["active"] == 1 ) {
			
				var diffx = enemies[i]["x"] - bullets[bi]["x"] ;
				var diffy = enemies[i]["y"] - bullets[bi]["y"] ;

				if ( diffx * diffx + diffy * diffy < 1024 ) {
					return i;
				}
			}
		}
		return -1;

	}

	//---
	function checkCollisionWithPlayers( ei ) {

		var diffx = enemies[ei]["x"] - player["x"];
		var diffy = enemies[ei]["y"] - player["y"];
		if ( diffx * diffx + diffy * diffy < 2304 ) {
			return 1;
		}
		return 0;
	}


	

	//-------------
	function checkcollisionwithblocks() {

		for ( var i = 0 ; i < maxblock ; i++ ) {

			if ( blocks[i]["active"] == 1 ) {

				if ( player["x"] >= (blocks[i]["x"] - 48) &&
					 player["x"] <= (blocks[i]["x"] + 48) &&
					 player["y"] >= (blocks[i]["y"] - 32) &&
					 player["y"] <= (blocks[i]["y"] ) ) {

					return i;
				}

			}

		}
		return -1;
	}



	//----
	function createblock( x , y ) {

		blocks[block_index]["x"] = x ;
		blocks[block_index]["y"] = y ;
		blocks[block_index]["active"] = 1 ;

		block_index = ( block_index + 1 ) % maxblock ;
	}


	//--
	function createbonuses( x,y,type) {

		bonuses[bonus_index]["x"] = x;
		bonuses[bonus_index]["y"] = y;
		bonuses[bonus_index]["type"] = type;
		bonuses[bonus_index]["active"] = 250;

		bonus_index = (bonus_index + 1) % maxbonus;
	}


	//---
	function createenemies( x,y, type , isboss ) {

		enemies[enemyindex]["x"] = x;
		enemies[enemyindex]["y"] = y;
		enemies[enemyindex]["type"] = type;
		enemies[enemyindex]["active"] = 1;
		enemies[enemyindex]["tx"] = rand(600);
		enemies[enemyindex]["isboss"] = isboss;

		if ( player["rocketon"] ) {
			
			enemies[enemyindex]["rocketon"] = 1;
			enemies[enemyindex]["ty"] = rand(600) + altitude_reached;

		} else {
			enemies[enemyindex]["ty"] = rand(400);
			enemies[enemyindex]["rocketon"] = 0;
		}


		enemies[enemyindex]["frame"] = 0;
		

		if ( type > 13 ) {
			enemies[enemyindex]["life"] = type * 6 ;
		} else if ( type > 10 ) {
			enemies[enemyindex]["life"] = type * 3 ;
		} else if ( type > 5 ) {
			enemies[enemyindex]["life"] = type * 4 ;
		} else {
			enemies[enemyindex]["life"] = type * 3 ;
		}

		if ( isboss	 == 1 ) {
			enemies[enemyindex]["life"] *= 5;
		
		} 


			
		enemyindex = (enemyindex + 1) % maxenemy;
	}



	//------
	function createexplosion( x,y ) {

		explosion[explosionindex]["x"] = x;
		explosion[explosionindex]["y"] = y;
		explosion[explosionindex]["active"] = 1;
		explosion[explosionindex]["frame"] = 0;
		
		explosionindex = ( explosionindex + 1 )  % maxexplosion;
		wavexplosion.play();
	}


	//--------
	function firebullet() {

		bullets[bullet_index]["x"] = player["x"];
		bullets[bullet_index]["y"] = player["y"] - player["screenoffy"];
		
		if ( player["rocketon"] ) {
		
			bullets[bullet_index]["vy"] = -rocket_velocity - 25;
		
		} else {
			bullets[bullet_index]["vy"] = (player["vy"] < -normal_velocity) ? -hyper_velocity - 6: -normal_velocity - 3;
		}

		bullets[bullet_index]["vx"] = player["face"] * 10 - 5;
		
		
		bullets[bullet_index]["active"] = 1;
		bullet_index = (bullet_index + 1) % maxbullet ;
	}

	//--------
	function getenemysrcx( type ) {

		return [4,3,1,0, 9,8,7,6,  5,5,4,3,  2,1,0,0, 6, 0][type];
	}

	function getenemysrcy( type ) {

		return [1,1,1,1, 0,0,0,0,  0,1,0,0,  0,0,0,0, 1, 2][type];
	}


	//----
	function init() {

		var canvas = document.getElementById("cv");
		ctxt = canvas.getContext('2d');

		imgshiba = new Image();
		imgshiba.src = 'images/shiba.png';
		imgshiba.addEventListener('load', function() {

			loadcomplete();

		}, false);		

		imgblocks = new Image();
		imgblocks.src = 'images/blocks.png';
		imgshiba.addEventListener('load', function() {

			loadcomplete();

		}, false);	

		imgbg = new Image();
		imgbg.src = 'images/background.png';
		imgbg.addEventListener('load', function() {

			loadcomplete();
		}, false);		


		imgaltcoin = new Image();
		imgaltcoin.src = 'images/altcoin_64.png';
		imgaltcoin.addEventListener('load', function() {
			loadcomplete();
			
		}, false);

		imgrocketfire = new Image();
		imgrocketfire.src = 'images/rocketfire.png';
		imgrocketfire.addEventListener('load', function() {
			loadcomplete();
			
		}, false);	

		imgexplosion = new Image();
		imgexplosion.src = 'images/explosion.png';
		imgexplosion.addEventListener('load', function() {
			loadcomplete();
			
		}, false);



		wavwow = new Audio('sounds/wow.wav');
		wavland = new Audio('sounds/land.wav');
		wavsaddog = new Audio('sounds/saddog.wav');



		mp3bgmusic = new Audio('sounds/bgmusicfull.mp3');
		mp3bgmusic.loop = true;

		wavgameover = new Audio('sounds/gameover.wav');
		wavcollect = new Audio('sounds/collect.wav');
		wavtorpedo = new Audio('sounds/torpedo.wav');
		wavexplosion = new Audio('sounds/explosion.wav');

		// Create 
		for ( i = 0 ; i < maxblock ; i++ ) {
			blocks[i] = { x:0,y:0,active:0 };
		}
		for ( i = 0 ; i < maxbullet ; i++ ) {
  			bullets[i] = { x : 0 , y : 0 , active: 0};
  		}

		for ( i = 0 ; i < maxbonus ; i++ ) {
  			bonuses[i] = { x:0, y:0 , active:0, type:0 };
  		}

  		for ( i = 0 ; i < maxenemy ; i++ ) {
  			enemies[i] = { 
  							x: 0, 
  							y: 0, 
  							active: 0 , 
  							type : rand(15),
  							tx: 0,
  							ty: 0 
  						};
  		}

  		for ( i = 0 ; i < maxexplosion ; i++ ) {
  			explosion[i] = {x:0,y:0,active:0,frame:0};
  		}


	}



	

	//----
	function int_div( x , y ) {
		return Math.floor( x / y );
	}


	//----
	function keyDownEvent(evt) {
    	
    	//var eType = evt.type; 
		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		if ( keyCode >= 37 && keyCode <= 40 ) {
			control_direction[ keyCode - 37 ] = 1;
		
		} else if ( keyCode == 90 ) {

			if ( player["active"] == 1 ) {
				player["fireon"] = 1;
			}
		}
		
	}


	//----
	function keyUpEvent(evt) {

   		//var eType = evt.type; 
   		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			control_direction[ keyCode - 37 ] = 0;
		
		} else if ( keyCode == 77 ) {

			if ( mp3bgmusic.paused ) {
				mp3bgmusic.play();
			} else {
				mp3bgmusic.pause();
			}
		
		} else if ( keyCode == 80 ) {

			reinit_game();
		
		} else if ( keyCode == 90 ) {

			if ( player["active"] == 1 ) {
				wavwow.play();
				firebullet();
			}
			player["fireon"] = 0;
			
		} 

	}

	//-------
	function loadcomplete() {

		resource_loaded += 1;
		
		if ( resource_loaded == total_resource ) {

			reinit_game();
			setTimeout( onTimer, timerinterval );
		} else {
			loading_screen();
		}
	}

	//--
	function loading_screen() {

		var percent_complete = (resource_loaded * 100.0 / total_resource).toFixed(2);
		ctxt.clearRect( 0,0,600,600 );
		ctxt.fillStyle = "white";
		ctxt.fillText( "Loading Resources . " + percent_complete + "% loaded" , 200, 300);

		
	}


	//---
	function move_enemies(ei) {

		if ( enemies[ei]["rocketon"] ) {

			if ( player["rocketon"] == 0 ) {
				enemies[ei]["ty"] = enemies[ei]["y"] - 600;
			}

			var offy  = enemies[ei]["ty"] - enemies[ei]["y"];
			var offx  = enemies[ei]["tx"] - enemies[ei]["x"];


			if ( offx * offx + offy * offy > 1600 ) {

				enemies[ei]["x"] += offx / 40;
				enemies[ei]["y"] += offy / 40;	
			
			} else {

				enemies[ei]["tx"] = rand(640) - 20;
				enemies[ei]["ty"] = rand(640) - 20 + altitude_reached;

			}

			enemies[ei]["ty"] += player["vy"];
			enemies[ei]["y"]  += player["vy"];

				

		} else {		
			enemies[ei]["y"] += 1;	
			if ( enemies[ei]["y"] > 100 ) {
				enemies[ei]["active"] = 0;
			}
		}
	}


	//----
	function onDraw() {

		var i;
		ctxt.clearRect( 0,0,600,600 );

		camera_y = player["y"] - 300 + player["screenoffy"];



		for ( i = -3 ; i < 6 ; i++ ) {
			for ( j = 0 ; j < 8 ; j++ ) {
				ctxt.drawImage( imgbg , 0 , 0 , 128 , 128 , 
					j * 128 , i * 128 - (camera_y % 128), 128, 128 );
			}
		}

		if ( player["active"] == 1 ) {
		
			for ( i = 0 ; i < maxblock ; i++ ) {

				if ( blocks[i]["active"] == 1 ) {			
					ctxt.drawImage( imgblocks , 0 , 0 , 128 , 64 , 
						blocks[i]["x"] - 32 , blocks[i]["y"]  - camera_y - 16 , 64, 32 );
				}
			}

			if ( player["rocketon"] ) {
				var xframe = 4;
				wavtorpedo.play();

			} else {
				var xframe = player["frame"];
			}

			var yframe = player["face"];
			var xsize  = player["hyperon"] > 0 ? 80 : 64;
			var ysize  = player["hyperon"] > 0 ? 80 : 64;
			

			// Draw Fire
			if ( player["rocketon"] == 1 ) {	
				ctxt.drawImage( imgrocketfire , 96 * (tick % 3) , 0 , 96 , 150 , 
				player["x"] - 48 , player["y"] - camera_y , 96, 150 );
			
			}


			// draw player
			ctxt.drawImage( imgshiba , 128 + xframe * 64 , yframe * 64 , 64 , 64 , 
				player["x"] - xsize/2 , player["y"] - ysize/2 - camera_y   , xsize, ysize );

			

			// Draw bullets
			for ( i = 0 ; i < maxbullet ; i++ ) {
				
				if ( bullets[i]["active"] == 1 ) {
					
					ctxt.drawImage( imgaltcoin, 2*64,64,64,64,
						bullets[i]["x"] - bullet_size/2 , 
						bullets[i]["y"] - bullet_size/2 - camera_y + player["screenoffy"], 
						bullet_size,
						bullet_size   );

				}
			}


			// Draw bonuses
			ctxt.font = "14px Comic Sans MS";
	  		for ( i = 0 ; i < maxbonus ; i++ ) {

				if ( bonuses[i]["active"] > 0 ) {
					
					if ( bonuses[i]["type"] == 0 ) {
						
						ctxt.fillStyle = "#00ff00";
						ctxt.fillText( "Much power" , bonuses[i]["x"] - 32, bonuses[i]["y"]- camera_y);
					
					} else if ( bonuses[i]["type"] == 1 ) {

						ctxt.fillStyle = "#ff0000";
						ctxt.fillText( "Such Health" , bonuses[i]["x"] - 42 , bonuses[i]["y"] - camera_y );
						
					} else if ( bonuses[i]["type"] == 2 ) {

						ctxt.fillStyle = "#ffff00";
						ctxt.fillText( "Wow Fuel" , bonuses[i]["x"] - 32, bonuses[i]["y"] - camera_y);

					} else if ( bonuses[i]["type"] == 3 ) {

						ctxt.fillStyle = "#ffffff";
						ctxt.fillText( "Wow Steroid" , bonuses[i]["x"] - 42, bonuses[i]["y"] - camera_y);
						
					} else if ( bonuses[i]["type"] == 4 ) {

							ctxt.drawImage( imgshiba, 4*64, 4 * 64,64,64,
								bonuses[i]["x"] - 24 , 
								bonuses[i]["y"] - 30 - camera_y, 
								48,
								48   );
					}					

				}
			}

			// Draw enemies
			for ( i = 0 ; i < maxenemy ; i++ ) {

				if ( enemies[i]["active"] == 1 ) {
					
					var isboss = enemies[i]["isboss"];
					var size = isboss? 64 :32  ;
					var halfsize = size/2 ;

					// Draw Fire
					if ( enemies[i]["rocketon"] == 1 ) {	
						ctxt.drawImage( imgrocketfire , 96 * (tick % 3) , 0 , 96 , 150 , 
						enemies[i]["x"] - 48 , 
						enemies[i]["y"] - camera_y + player["screenoffy"] ,
						 96, 150 );
					
					}


					ctxt.drawImage( imgaltcoin, 
						(getenemysrcx( enemies[i]["type"]) + enemies[i]["frame"]) * 64,
						getenemysrcy( enemies[i]["type"]) * 64,
						64,
						64,
						enemies[i]["x"] - halfsize , 
						enemies[i]["y"] - halfsize - camera_y + player["screenoffy"], 
						size,
						size   );

				
				}
			}

			for ( i = 0 ; i < maxexplosion ; i++ ) {

				if ( explosion[i]["active"] == 1 ) {
					
					ctxt.drawImage( imgexplosion, 
						(explosion[i]["frame"] % 6) * 64,
						( Math.floor( explosion[i]["frame"] / 6) ) * 64,
						64,
						64,
						explosion[i]["x"] - 32 , 
						explosion[i]["y"] - 32 - camera_y + player["screenoffy"], 
						64,
						64   );

				}
			}


		} else {

			ctxt.font = "20px Comic Sans MS";
			ctxt.fillText( "Poor shibe. Press P to play again!" ,160, 300 );
		}			


		





		ctxt.fillStyle = "white";
		ctxt.font = "10px Comic Sans MS";
		
		// text
		if ( player["hyperon"]  > 0 ) {
			ctxt.fillText( "Steroid Mode : " +  player["hyperon"]  , 480, 530);
		}

		if ( player["hp"] < 50 ) {
			ctxt.fillStyle = "red";
			ctxt.font = "20px Comic Sans MS";
		}
		ctxt.fillText( "Health : " +  player["hp"] , 480, 545);
		


		ctxt.fillStyle = "white";
		ctxt.font = "10px Comic Sans MS";
		
		ctxt.fillText( "Fuel   : " +  player["fuel"] , 480, 560);
		ctxt.fillText( "Power  : " +  bullet_size , 480, 575);
		ctxt.fillText( "$ : " +  ( -altitude_reached / 2000000.0 ).toFixed(8) , 480, 590);

		if ( -altitude_reached >= 10000000 ) {
			ctxt.fillText( "You won. You can stop anytime now." , 280, 590);

		}
	}



	//----
	function onTimer() {


		var i;

		if ( player["active"] == 1 )  {

			if ( player["y"] < 100 && player["y"] - altitude_reached < 2400 ) {


				// Hit the ground or a block, jump
				var block_i = checkcollisionwithblocks();
				if ( block_i > -1 ) {

					player["vy"] =  (player["hyperon"] > 0) ? -hyper_velocity: -normal_velocity ;
					player["frame"] = 0;
					wavland.play();
				}


				// Check for time to update altitude reached
				if ( player["y"] < altitude_reached ) {
					altitude_reached = player["y"] 
				}
						

				// Remove lower block 
				for ( i = 0 ; i < maxblock ; i++ ) {
					if ( blocks[i]["active"] == 1 ) {


						if ( blocks[i]["y"] > altitude_reached + 600 + (player["hyperon"] > 0 ? 400 : 0) ) {
							

							blocks[i]["active"] = 0;

							var new_x = ( block_last_x + rand(400) - 200 + 600 ) % 600; 
							var new_y = block_height * -block_height_gap;
							createblock(   new_x , new_y );
							release_bonuses( new_x , new_y - 20);

							


							block_last_x = new_x;
							block_height += 1;


						}
					}
				}

				
				i
				
				// Reach new height target
				if ( player["y"] < new_height_target ) {
					
					if ( player["rocketon"] ) {
						new_height_target -= 1400;
					} else {
						new_height_target -= 600;
						
					}

					enemytypeupgradetimer += 1;
					release_enemies( rand(3) );	
					if ( enemytypeupgradetimer % 12 == 0 ) {
						enemytypeupgrade = (enemytypeupgrade + 1) % 17;
					}

				}

				

				if ( player["rocketon"] == 1 ) {
					player["vy"] = -rocket_velocity;
				} else {
					player["vy"] += player["ay"];
				}
				player["y"] += player["vy"];


				if ( player["vy"] < -22 ) {

					player["frame"] = 1;

				} else if ( player["vy"] >= -22  && player["vy"] <= -18 ) {
					player["frame"] = 0;
				
				} else if ( player["vy"] >= -17 && player["vy"] <= -10 ) {
					player["frame"] = 1;
				
				} else if ( player["vy"] >= -9 && player["vy"] <= 5 ) {
					player["frame"] = 2;
				
				} else if ( player["vy"] > 5 ) {
					player["frame"] = 3;
				
				}


				// horizontal navigation			
				if ( control_direction[0] ) {
					player["x"] -= 5;
					player["face"] = 0;

					
				}
				if ( control_direction[2] ) {
					player["x"] += 5;
					player["face"] = 1;

				}
				player["x"] = (player["x"] + 600) % 600;


				// Vertical nav when rocketon
				if ( player["rocketon"] == 1 ) {
					
					if ( control_direction[1] == 1  ) {
					
						player["screenoffy"] += 5;
							

					} else if ( control_direction[3] == 1  ) {
						
						player["screenoffy"] -= 5;
						
					}
				} else {

					if ( player["screenoffy"] != 0 ) {
						// Gradually put back to center if not on rocket and not on center.
						player["screenoffy"] *= 0.8;

					}
				}




				// enemies																																								
				for ( i = 0 ; i < maxenemy ; i++ ) {

					if ( enemies[i]["active"] == 1 ) {
						
						move_enemies(i);

						if ( enemies[i]["type"] == 17 ) {
							enemies[i]["frame"] = (enemies[i]["frame"] + 1 )% 6;
						}
						
						// CRASH
						if ( checkCollisionWithPlayers(i) == 1 ) {
							

							
							createexplosion(player["x"], player["y"] );
							enemies[i]["active"] = 0;
							
							if ( player["hyperon"] == 0 ) {
								addpower(-1);
								addhp(   (enemies[i]["type"] + 1) * -2  );
								wavsaddog.play();
							}
						}

						
					}
				}



				// fire
				if ( tick % player["autofireinterval"] == 1 ) {
					if ( player["fireon"] == 1 ) {
						wavwow.play();
						firebullet();
					}
				}	
				
				//bullet
				for ( i = 0 ; i < maxbullet ; i++ ) {
					
					if ( bullets[i]["active"] == 1 ) {
						
						if ( bullets[i]["vy"] < 20 ) {
							bullets[i]["vy"] += 1 ;
						}
						bullets[i]["y"] += bullets[i]["vy"] ;
						bullets[i]["x"] += bullets[i]["vx"] ;
						
						if ( ( enemy_i = checkCollisionWithEnemies(i) ) != -1 ) {

							bullets[i]["active"] = 0;
							createexplosion( bullets[i]["x"], bullets[i]["y"]);
							
							enemies[enemy_i]["life"] -=  bullet_size + 1;

							if ( enemies[enemy_i]["life"] <= 0 ) {
								
								enemies[enemy_i]["active"] = 0;
								release_bonuses( enemies["x"] , enemies["y"]);

							}
						}
					} 
				}

				// Eat bonus
				for ( i = 0 ; i < maxbonus ; i++ ) {

					if ( bonuses[i]["active"] > 0 ) {
						
						// Eat bonus
						if ( checkBonusCollisionWithPlayers( i ) == 1 ) {

							if ( bonuses[i]["type"] == 0 ) {
								
								addpower(1);
							
							} else if ( bonuses[i]["type"] == 1 ) {
								
								addhp(15);

							} else if ( bonuses[i]["type"] == 2 ) {
								
								addfuel(25);

							} else if ( bonuses[i]["type"] == 3 ) {

								if ( player["hyperon"]  <= 0 ) {
									
									valdump[1] = bullet_size;
									bullet_size = max_bullet_size;
								}
								player["hyperon"] = 600;

							} else if ( bonuses[i]["type"] == 4 ) {

								player["rocketon"] = 1;
								player["fuel"] += 200;
							}
							
							bonuses[i]["active"] = 0;
							wavcollect.play();

						}
					}

				}
				if (player["hyperon"] > 0 ) {
					player["hyperon"]  -= 1 ;
					if ( player["hyperon"]  <= 0 ) {

						bullet_size = valdump[1];
					}
				}

				if ( player["rocketon"] == 1 ) {
					player["fuel"] -= 1;
					if ( player["fuel"] <= 0 ) {
						player["rocketon"] = 0;
					}

				}

				if ( tick % 2 == 1 ) {
					for ( i = 0 ; i < maxexplosion ; i++ ) {

						if ( explosion[i]["active"] == 1 ) {
							
							explosion[i]["frame"] += 1;
							if ( explosion[i]["frame"] >= 15 ) {
								explosion[i]["active"] = 0;
							}
						}
					}
				}



			} else {

				// Game over
				wavgameover.play();
				wavsaddog.play();
				mp3bgmusic.pause();
				mp3bgmusic.currentTime = 0;


				player["active"] = 0;
			}
		}


		


		onDraw();
		tick += 1;

		
		
		setTimeout( onTimer , timerinterval);
		

	}


	//------
	function rand( x ) {

		return Math.floor( Math.random() * x );

	}


	function reinit_game() {

		var i;

		for ( i = 0 ; i < maxblock ; i++ ) {
			blocks[i]["active"] = 0;
		}


		for ( i = 0 ; i < 10 ; i++) {
			createblock( i * 64,0);
		}


		for ( i = 0 ; i < maxenemy ; i++) {
			enemies[i]["active"] = 0;
		}

		// First 3 blocks at the left side to prevent player from jumping from the beginning.
		for ( i = 0 ; i < 3 ; i++ ) {
			createblock( i * 10 , i * -block_height_gap );
		}

		// The next initial 17 blocks
		for ( i = 3 ; i < 20 ; i++ ) {
			
			var x1 = rand(600);
			var x2 = (x1 + 300) % 600;
			createblock( x1 , i * -block_height_gap );
			createblock( x2 , i * -block_height_gap );
		}

		
		player["x"] 				= 300;
		player["y"] 				= 0;
		player["vx"] 				= 0;
		player["vy"] 				= 0;
		player["ax"] 				= 0;
		player["ay"] 				= 1;
		player["face"] 				= 0;
		player["active"] 			= 1;
		player["xframe"] 			= 0;
		player["fireon"] 			= 0;
		player["autofireinterval"] 	= 20;
		player["hyperon"]			= 0;
		player["rocketon"]			= 0;
		player["screenoffy"]		= 0;


		player["hp"]				= 100;
		player["fuel"]				= 50;


		bullet_size = min_bullet_size;
		valdump[1] = min_bullet_size;

		
		altitude_reached  = 0;
		new_height_target = -400;

		enemytypeupgrade = 0;
		enemytypeupgradetimer = 1;

		block_height = i ;
		block_last_x = x2;

		mp3bgmusic.play();
			
	}


	//--------------------------
	function release_bonuses( x, y) {

		// reward bonus
		if ( rand(40) < 1 && altitude_reached < -5000 && player["rocketon"] == 0) {
			
			//Steroid
			createbonuses( x, y  , 3 ) ;
		
		} else if ( rand(35) < 1 && altitude_reached < -10000 && player["rocketon"] == 0 ) {

			// Rocket
			createbonuses( x, y  , 4 ) ;

		}  else if ( rand(30) < 1 && player["rocketon"] == 0  ) {
			
			createbonuses( x, y  ,2) ;
			
		} else if ( rand(25) < 1 ) { 
			
			createbonuses( x, y  , 1) ;
		
		}  else if ( rand(20) < 1 ) { 
			createbonuses( x, y  , 0 ) ;
		}
	}

	//---
	function release_enemies( n ) {

		for ( var i = 0 ; i < n && i < maxenemy; i++ ) {

			var enemytype = enemytypeupgrade;
			if ( enemytypeupgrade > 15 ) {
				enemytype = rand(15);
			}

			createenemies( rand(600), new_height_target - 1200 + rand(1200) , enemytype , 0 ) ;
			
		}

	}




