var tablero;//id del canvas 
var ctx;
var FPS = 50;

var anchoFila = 50;
var altoFila = 50;
//distintos elementos para dibujar escenario
var muro = "grey";
var camino = "brown";

var puerta = "blue";
var llave = "gold";
//obejto  
var jugador;
var imagenAntorcha =[];

var camara;

var tilemaps;
var enemigo =[];

//para el escenario
var escenario =
[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
	[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,],
	[0,2,2,0,0,0,2,0,0,0,2,0,0,0,0,0,2,0,2,2,0,],
	[0,2,0,0,0,0,2,0,0,0,2,0,0,0,0,0,2,0,0,2,0,],
	[0,2,2,3,0,2,2,2,2,2,2,2,2,0,0,0,2,0,0,2,0,],
	[0,2,0,0,0,0,2,0,0,2,0,0,2,0,0,0,2,2,2,2,1,],
	[0,2,2,2,2,2,2,0,0,2,0,0,2,2,2,2,2,0,0,2,0,],
	[0,2,0,0,0,0,2,0,0,2,0,0,2,0,0,0,2,0,0,2,0,],
	[0,2,0,0,0,0,2,2,2,2,2,2,2,0,0,0,2,0,0,2,0,],
	[0,2,2,2,0,0,2,0,2,0,0,0,2,2,2,2,2,2,2,2,0,],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
];

//var objCamara = function(x,y,tamX,tamY)
//{
//	this.dibuja = function()
//	{
//			for(y = 0;y < 11;y++)
//		{
//			for(x = 0;x < 21;x++)
//			{
//				//ctx.fillStyle = color;
//				//ctx.fillRect(x*anchoFila,y*altoFila,anchoFila,altoFila);
//				var cuadro = escenario[y][x]; //representa todo el escenario posicio y e x
//				ctx.drawImage(tilemaps,cuadro*32,0,32,32,anchoFila*x,altoFila*y,anchoFila,altoFila);
//			}
//		}
//	}
//}


//cuando carga el index y recarga
function cargar()
{
	tablero = document.getElementById('tablero');
	ctx = tablero.getContext('2d');

	tilemaps = new Image();
	tilemaps.src='../assets/tilemap.png';

	//creamos al objeto jugador 
	jugador = new player();


	//creamos la antorcha 
	imagenAntorcha = new antorcha(1,1);

	//creamos enemigo
	enemigo.push(new malo(4,6));
	enemigo.push(new malo(8,1));
	enemigo.push(new malo(14,6));

	//lectura del teclado
	document.addEventListener('keydown',function(tecla)
	{
		if(tecla.keyCode == 38)//arriba
		{
			jugador.arriba();
			console.log("ariiba")
		}
		if(tecla.keyCode == 40)//abajo
		{
			jugador.abajo();
			console.log("abajo")
		}
		if(tecla.keyCode == 37)//izquierda
		{
			jugador.izquierda();
			console.log("izk")
		}
		if(tecla.keyCode == 39)//derecha
		{
			jugador.derecha();
			console.log("dere")
		}
	})

	setInterval(function()
	{
		principal();
	},1000/FPS);
	console.log("Empezando");
}

//la funcion principal logica del juego
function principal()
{
	borrarCanvas();
	dibujarEscenario();
	jugador.dibuja();
	imagenAntorcha.dibuja();

	for(c=0; c<enemigo.length;c++)
	{
		enemigo[c].movimiento();
		enemigo[c].dibuja();
	}
}

//borrar el canvas
function borrarCanvas()
{
	width = 1024;
	height = 520;
}

//dibujamos escenario
function dibujarEscenario()
{
	for(y = 0;y < 11;y++)
	{
		for(x = 0;x < 21;x++)
		{
			//ctx.fillStyle = color;
			//ctx.fillRect(x*anchoFila,y*altoFila,anchoFila,altoFila);
			var cuadro = escenario[y][x]; //representa todo el escenario posicio y e x
			ctx.drawImage(tilemaps,cuadro*32,0,32,32,anchoFila*x,altoFila*y,anchoFila,altoFila);
		}
	}
}

//poner animacion antorcha
var antorcha =function(x,y)
{
	this.x =x;
	this.y=y;

	this.retraso = 10;
	this.contador = 0;
	this.fotogramas =0; //0-a 3
	this.cambiaFotograma = function()
	{
		if(this.fotogramas < 3)
		{
			this.fotogramas++;
		}
		else
		{
			this.fotogramas = 0;
		}
	}
	this.dibuja = function()
	{
		if(this.contador < this.retraso)
		{
			this.contador++;
		}
		else
		{
			this.contador = 0;
			this.cambiaFotograma();
		}
		ctx.drawImage(tilemaps,this.fotogramas*32,64,32,32,this.x*anchoFila,this.y*altoFila,anchoFila,altoFila);
	}
}
//Objeto jugador
var player = function(x,y)
{
	this.x=3;
	this.y=9;
	this.color = "red";
	this.llave = false;

	this.dibuja = function()
	{
		//ctx.fillStyle = this.color;
		//ctx.fillRect(this.x*anchoFila,this.y*altoFila,anchoFila,altoFila);
		ctx.drawImage(tilemaps,32,32,32,32,this.x*anchoFila,this.y*altoFila,anchoFila,altoFila);
	}

	//margenes o colisiones
	this.margenes = function(x,y)
	{
		var colision = false;
		if(escenario[y][x] == 0)
		{
			colision = true;
		}
		return colision;
	}
	//movimiento player
	this.arriba = function()//arriba
	{
		if(this.margenes(this.x,this.y-1)==false)
		{
			this.y--;
			this.logicaObjetos();
		}
	}
	this.abajo = function()//abajo
	{
		if(this.margenes(this.x,this.y+1)==false)
		{
			this.y++;
			this.logicaObjetos();
		}
	}
	this.izquierda = function()//izquierda
	{
		if(this.margenes(this.x-1,this.y)==false)
		{
			this.x--;
			this.logicaObjetos();
		}
	}
	this.derecha = function()//derecha
	{
		if(this.margenes(this.x+1,this.y)==false)
		{
			this.x++;
			this.logicaObjetos();
		}
	}

		//victoria
	this.victoria = function()
	{
		alert("Abres la puerta Maquina¡¡¡ te atreves a pasar");
		this.x = 3;
		this.y = 9;
		this.llave = false;
		escenario[4][3] = 3;
	}
	//derrota
	this.derrota = function()
	{
		alert("Te han cazado y estas muertoooo ¡¡¡¡¡");
		this.x = 3;
		this.y = 9;
		this.llave = false;
		escenario[4][3] = 3;
	}

	//obtiene la llave y evento puerta 
	this.logicaObjetos = function()
	{
		var objeto = escenario[this.y][this.x];
		//obtiene llave
		if(objeto == 3)
		{
			this.llave = true;
			escenario[this.y][this.x] = 2;
			alert("Consiguiste la llave Maquina ¡¡¡¡¡");
		}
			//pasa puerta 
		if(objeto == 1)
		{
			if(this.llave == true)
			{
				this.victoria();
			}
			else
			{
				alert("Te falta la llave Tonto ¡¡¡¡ ");
			}
		}
	}
	//hacer que el enemigo nos mate
	this.enemigoChoca = function(x,y)
	{
		if(this.x == x && this.y == y)
		{
			this.derrota();
		}
	}
}

//objeto enemigo 
var malo = function(x,y)
{
	this.x = x;
	this.y = y;
	console.log("enemigo creado");

	this.direccion = Math.floor(Math.random()*4);

	this.retraso = 50;
	this.fotogramas=0;

	this.dibuja = function()
	{
		//ctx.fillStyle = this.color;
		//ctx.fillRect(this.x*anchoFila,this.y*altoFila,anchoFila,altoFila);
		ctx.drawImage(tilemaps,0,32,32,32,this.x*anchoFila,this.y*altoFila,anchoFila,altoFila);
	}

	this.enemigoColision = function(x,y)
	{
		var colisiona = false;
		if(escenario[y][x]==0)
		{
			colisiona = true;
		}
		return colisiona;
	}

	this.movimiento = function()
	{
		jugador.enemigoChoca(this.x,this.y);
		if(this.contador < this.retraso)
		{
			this.contador++;
		}
		else
		{
			this.contador=0;
			//arriba
			if(this.direccion == 0)
			{
				if(this.enemigoColision(this.x,this.y-1)==false)
				{
					this.y--; //arriba
				}
				else
				{
					this.direccion = Math.floor(Math.random()*4);
				}
			}
			//abajo
			if(this.direccion == 1)
			{
				if(this.enemigoColision(this.x,this.y+1)==false)
				{
					this.y++; //arriba
				}
				else
				{
					this.direccion = Math.floor(Math.random()*4);
				}
			}
			//izquierda
			if(this.direccion == 2)
			{
				if(this.enemigoColision(this.x-1,this.y)==false)
				{
					this.x--; //arriba
				}
				else
				{
					this.direccion = Math.floor(Math.random()*4);
				}
			}
			//derecha
			if(this.direccion == 3)
			{
				if(this.enemigoColision(this.x+1,this.y)==false)
				{
					this.x++; //arriba
				}
				else
				{
					this.direccion = Math.floor(Math.random()*4);
				}
			}
		}
	}
}

