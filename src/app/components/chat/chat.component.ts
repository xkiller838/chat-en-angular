import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;
  usuario: any = {
    nombre: "Manuel",
    uid: ""
  };

  constructor(public _cs: ChatService ) {
    this.usuario = this._cs.getUser();
    this._cs.cargarmensajes()
    .subscribe( () => {

      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);

    });
  }

ngOnInit() {
 this.elemento = document.getElementById('app-mensajes');
}

  enviar_mensaje() {
    console.log(this.mensaje);

    if ( this.mensaje.length === 0) {
      return;
    }

    this._cs.agregarMensaje( this.mensaje,this.usuario.nombre ).then(() => this.mensaje = '' )
    .catch((err) => console.error('erro al enviar mensaje', err));
  }

}
