:root{
  --negro: #3e3e3e;
}

body {
  background-color: #f7f1e6;
}

.elegante-hero {
  font-family: "GFS Didot", serif;
  font-weight: 400;
  font-style: normal;
  font-size:3rem;
}

.elegante {
  font-family: "GFS Didot", serif;
  font-weight: 400;
  font-style: normal;
  
}

.cursiva {
  font-family: "Monsieur La Doulaise", cursive;
  font-weight: 500;
  font-style: normal;
  font-size: 4rem;
}

.elegante2 {
  font-family: "GFS Didot", serif;
  font-weight: 100;
  font-style: normal;
}
  
/* linea timeline */

.timeline {
  max-width: 90%;
  width: 600px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background-color: black;
  z-index: 0;
}

.timeline-event {
  position: relative;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  background-color: black;
  border-radius: 50%;
  z-index: 1;
  position: relative;
}

.event-icon {
  width: 150px;
  height: auto;
  
}

/* linea debajo de texto */

.subrayado {
  position: relative;
  display: inline-block; /* importante para que la línea tome el ancho del texto */
  padding-bottom: 3px; /* espacio entre texto y línea */
}

.subrayado::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateX(0px);
  width: 100%; /* igual al ancho del texto */
  height: 2px; /*grosor de la linea */
  background-color: var(--negro);
  border-radius: 2px;
}

/* cintas */

.mapa-con-cinta {
  position: relative;
  min-height: 200px;
}

.cinta {
  position: absolute;
  width: 40px; /* ajusta según tus imágenes */
  z-index: 2;
}

/* Posiciones específicas */
.cinta-1 { top: -10px; left: -10px; transform: rotate(0deg); }
.cinta-2 { top: -10px; right: -10px; transform: rotate(70deg); }
.cinta-3 { bottom: -10px; left: -10px; transform: rotate(70deg); }
.cinta-4 { bottom: -10px; right: -10px; transform: rotate(0deg); }

/* colores prohibidos */
.color-box {
  width: 30px;
  height: 30px;
  border: 2px solid #786951;
}

.color1 { background-color: #a52a2a }
.color2 { background-color: #6914b2 }
.color3 { background-color: #088bde }

/* imagenes en mesa de regalos */
.gift-icon {
  height: 100%;         /* o la altura que quieras */
  object-fit: contain;   /* para que no se deformen */
  width: 100%;           /* mantiene responsive dentro del col */
}


.gift-icon:hover {
  transform: scale(1.05);
}


/* botones */

.btn-elegante {
  font-family: 'GFS Didot', serif;
  font-size: 1.1rem;
  padding: 0.6rem 2rem;
  border-radius: 2rem;
  font-weight: normal;
  transition: all 0.3s ease-in-out;
  text-transform: none;
  box-shadow: none;
  background-color: transparent;
  color: var(--negro);
  border: 1px solid var(--negro);
}

.btn-elegante:hover{
  background-color: var(--negro);
  color: #f7f1e6;
}

/* No puedo asistir (link elegante) */
.btn-link-elegante {
  font-family: 'GFS Didot', serif;
  font-size: 1rem;
  color: var(--negro);
  text-decoration: underline;
  transition: color 0.3s;
  display: inline-block;
  margin-top: 1rem;
}
.btn-link-elegante:hover {
  font-size: 1.02rem;
}

/* input de menos pases */

/* 🎨 Estilo para el input de pases */
#numPasesInput {
  font-family: 'GFS Didot', serif;
  width: 100%;
  max-width: 120px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: 700px;
  border: 2px solid #888;
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--negro);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  background-color: transparent;
}

#numPasesInput:focus {
  outline: none;
  border-color: var(--negro);
  box-shadow: 0 0 5px var(--negro);
}

.mensaje-invitado {
  font-family: 'GFS Didot', serif;
  font-size: 1.1rem;
}

/* NAVBAR */

#navbar {
  transition: top 0.3s ease-in-out;
}

nav {
  background-color: rgba(247, 241, 230, 0.3); /* Fondo semitransparente */
  backdrop-filter: blur(7px);                /* Aplicar el desenfoque */
  -webkit-backdrop-filter: blur(10px);        /* Compatibilidad con Safari */
}

html {
  scroll-padding-top: 20px; /* Ajusta este valor a la altura real de tu navbar */
}

