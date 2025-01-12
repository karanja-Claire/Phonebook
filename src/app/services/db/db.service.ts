import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  contacts:any[]=[]
  contactsRef!:AngularFireList<any>;
  private dbpath='/contacts'
  constructor(private db:AngularFireDatabase) {
    this.contactsRef = db.list(this.dbpath)
  }






getAllContacts(){
  return this.contactsRef;
}

addContacts(data:any){
  this.contactsRef.push(data)
}
getContact(id:string){
  return this.db.object(`${this.dbpath}/${id}`)
}
updateContact(id:string, data:any){
  return this.contactsRef.update(id, data)

}
deleteContact(id:string){
  return this.contactsRef.remove(id)
}



}
