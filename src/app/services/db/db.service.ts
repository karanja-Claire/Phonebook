import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  contacts:any[]=[]



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
