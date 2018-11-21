import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Mensaje } from '../interface/mensaje.interface';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {
    nombre: "",
    uid: ""
  };



  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => {
      console.log('estado del usuario', user);

      if (user) {
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      }
    });
  }

  login(proveedor: string) {

    if (proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((data: any) => {
        console.log("Login", data);
        this.usuario.nombre = data.user.displayName;
        this.usuario.uid = data.user.uid;
      }).catch(err => console.log(err));
    }

  }

  logout() {
    this.usuario = [{}];
    this.afAuth.auth.signOut();
  }

  cargarmensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));

    return this.itemsCollection.valueChanges().map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = [];
      for (let mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
      return this.chats;
    });

  }

  agregarMensaje(texto: string, userName: string) {

    let mensaje: Mensaje = {
      nombre: userName,
      mensaje: texto,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add(mensaje);
  }

  getUser() {
    return this.usuario;
  }
}

