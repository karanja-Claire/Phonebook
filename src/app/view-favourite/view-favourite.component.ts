import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../services/db/db.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-favourite',
  templateUrl: './view-favourite.component.html',
  styleUrls: ['./view-favourite.component.scss']
})
export class ViewFavouriteComponent {
  ContactBook:any[] = []
  contactData:any[]=[]
  contactViewData:any
  IfSuccess:boolean =false
  editId!:string
  selectAll: boolean = false;  // Tracks the "Select All" checkbox state

  constructor(private fb: FormBuilder, private db: DbService, private router:Router,private location: Location,) { }
  ngOnInit(): void {

    this.getAllContactData()


  }

  getContactData() {
    this.contactData = this.db.getContacts()
  }

  deleteContacts(data:any) {
    data.deleted = true

    this.db.updateContact(data.key, data)

    setTimeout(() => {
      this.IfSuccess = true
    }, 1000);

  }
   // Method to toggle selection for all rows
   toggleAll(event: any) {
    const checked = event.checked;
    this.ContactBook.forEach(contact => {
      contact.selected = checked;
    });
  }

  // Method to check if all rows are selected or not (for the "Select All" checkbox)
  onSelectionChange() {
    const allSelected = this.ContactBook.every(contact => contact.selected);
    this.selectAll = allSelected;
  }

  get selectedContactsCount(): number {
    return this.ContactBook.filter(contact => contact.selected).length;
  }
  deleteSelected() {
    this.ContactBook.forEach((item: any) => {
      if (item.selected) {
        item.deleted = true;
        this.db.updateContact(item.key, item); // Update database before removing
      }
    });



  }
    edit(data: any) {

      this.editId = data.key

      this.router.navigate(['add_contact'], { queryParams: { id:  this.editId}});

    }
    markFavourite(data: any) {
      if(data.isFavorite == true){
        data.isFavorite = false
      }else{
        data.isFavorite = true

      }
      this.db.updateContact(data.key, data)

      setTimeout(() => {
        this.IfSuccess = true
      }, 1000);

    }



  getAllContactData(){
    this.db.getAllContacts().snapshotChanges().subscribe({
      next:(data:any)=>{
        const contactData = data.map((e: any) => {
          return {
            key: e.payload.key,
            ...e.payload.val(),
          };
        });

        this.ContactBook = contactData.filter((data: any) => data.isFavorite === true);


      },
      error:()=>{},
      complete:()=>{}
    })
  }
  previous() {

    this.location.back();

  }
}
