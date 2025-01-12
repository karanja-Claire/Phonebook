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


// will be checked later
  addContact(data:any){
    this.contacts.push(data)
  }
  getContacts(){
    return this.contacts
  }
  editContact(data:any, editId:string){

    const index = this.contacts.findIndex((item: any) => item.id === editId);

  // Check if the contact with the given id was found
  if (index !== -1) {
    // Update the contact at the found index with new data
    this.contacts[index] = { ...this.contacts[index], ...data };

    // Optionally, you can log the updated contact list or do other actions
    console.log('Updated contact:', this.contacts[index]);
  } else {
    console.log('Contact not found');
  }
  }
}
