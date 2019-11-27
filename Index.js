/* Declaration of Variables
==================================*/
const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const btnEmpezar = document.getElementById('btnEmpezar');
const ULTIMO_NIVEL = 10;

/* Prototypal Classes Declaration
==================================*/
class Juego {
  constructor() {
    /*Run my methods*/
    this.inicializar = this.inicializar.bind(this);
    this.inicializar();
    this.generarSecuencia();
    setTimeout(() => this.siguienteNivel(), 500);
    // no se usan los parentesis en una funcion si esta dentro de un SETTIMEOUT()
    // debido a que es un llamado a la referencia no una invocacion
  }

  inicializar() {
    //Metodo que se ejecuta cuando empieza el juego/////////
    // Nota: es conveniente colocar desde el constructor del objeto la función bind, para evitar
    // que en las futuras iteraciones la referencia this se dirija a Window en
    // lugar de al objeto (en este caso el juego).
    this.siguienteNivel = this.siguienteNivel.bind(this);
    this.elegirColor = this.elegirColor.bind(this); //  con el metodo bind() //ahora el this esta atado al this de la clase prototipo juego
    this.toggleBtnEmpezar(); // toggle es como un switch que prende y apaga o muestra y desaparece algo , en este caso es perfecto para el boton de empezar.
    this.nivel = 1;
    this.colores = {
      celeste,
      violeta,
      naranja,
      verde
    };
  }

  toggleBtnEmpezar() {
    // esta funcion lo que hace es desaparecer el boton cuando lo presionamos pero volverlo a traer cuando se reinicia el juego
    if (btnEmpezar.classList.contains('hide')) {
      // contains siginifica que si contiene el atributo que se le esta pasando por parametro en este caso ('hide')
      btnEmpezar.classList.remove('hide');
    } else {
      btnEmpezar.classList.add('hide');
    }
  }

  generarSecuencia() {
    this.secuencia = new Array(ULTIMO_NIVEL)
      .fill(0)
      .map(n => Math.floor(Math.random() * 4));
  }
  // aqui creamos la secuencia del juego,
  // lo que hara este codigo es crear un nuevo array con 10 posiciones
  // las cuales les damos el valor de 0 a cada una con la funcion fill().
  //seguido de eso pasamos la funcion map() que nos crea un nuevo array apartir de ese
  // lo metemos en la variable n() la cual lleva dentro una funcion que parsea aleatoriamente el
  // resultado de cada posicion , dando un valor random entre 0 y 3 lo que seria la secuencia de los colores del juego.

  siguienteNivel() {
    this.subnivel = 0;
    this.iluminarSecuencia();
    this.agregarEventosClick();
  }

  transformarNumeroAColor(numero) {
    //Pedimos como parametro un numero aleatorio entre 0 y 4 que viene de this.secuencia()
    switch (numero) {
      case 0:
        return 'celeste';
      case 1:
        return 'violeta';
      case 2:
        return 'naranja';
      case 3:
        return 'verde';
      //el case no hace falta porque el return hace que no se ejecute
    }
  }

  transformarColorANumero(color) {
    switch (color) {
      case 'celeste':
        return 0;
      case 'violeta':
        return 1;
      case 'naranja':
        return 2;
      case 'verde':
        return 3;
    }
  }

  /*aplicamos i < this.nivel porque el numero del nivel
    corresponde al numero de elementos que el usuario
    modificara y tendra que seguir */
  iluminarSecuencia() {
    for (let i = 0; i < this.nivel; i++) {
      // en los ciclos for conviene mas utilizar let que var ya que nos puede ayudar a evitar errores en nuestro codigo
      let color = this.transformarNumeroAColor(this.secuencia[i]); // Ej: const color = "verde"
      setTimeout(() => this.iluminarColor(color), 1000 * i);
      //colocar x * i nos permite acumular tiempo en función del for
    }
  }

  iluminarColor(color) {
    //Colocando la clase que ilumina el color
    this.colores[color].classList.add('light');
    setTimeout(() => this.apagarColor(color), 350);
  }

  apagarColor(color) {
    //Quitando la clase que ilumina el color
    this.colores[color].classList.remove('light');
  }

  agregarEventosClick() {
    //agregando un manejador de eventos
    this.colores.celeste.addEventListener('click', this.elegirColor);
    this.colores.verde.addEventListener('click', this.elegirColor);
    this.colores.violeta.addEventListener('click', this.elegirColor);
    this.colores.naranja.addEventListener('click', this.elegirColor);
  }

  eliminarEventosClick() {
    this.colores.celeste.removeEventListener('click', this.elegirColor);
    this.colores.verde.removeEventListener('click', this.elegirColor);
    this.colores.violeta.removeEventListener('click', this.elegirColor);
    this.colores.naranja.removeEventListener('click', this.elegirColor);
  }

  //los metodos que se llaman en el event listener suelen tener en la funcion un parametro ev o event
  elegirColor(ev) {
    // este es el algoritmo clave del juego , es toda la logica
    const nombreColor = event.target.dataset.color; // aqui conservamos en una variable el color que escogio el usuario
    const numeroColor = this.transformarColorANumero(nombreColor);
    this.iluminarColor(nombreColor);
    if (numeroColor === this.secuencia[this.subnivel]) {
      // Necesito aclarar porque se usan las cajas y el this.subnivel en esta linea!!!
      this.subnivel++;
      if (this.subnivel == this.nivel) {
        this.nivel++;
        this.eliminarEventosClick();
        if (this.nivel == ULTIMO_NIVEL + 1) {
          this.ganoElJuego();
        } else {
          setTimeout(this.siguienteNivel, 1500);
        }
      }
    } else {
      this.perdioElJuego();
    }
  }

  ganoElJuego() {
    swal('You Win!!', 'Acabas de Pasar al siguiente nivel', 'success').then(
      this.inicializar
    );
  }

  perdioElJuego() {
    swal('Game Over :(', 'error').then(() => {
      this.eliminarEventosClick();
      this.inicializar();
    });
  }
}

// Declarando funciones
function empezarJuego() {
  window.juego = new Juego();
}
