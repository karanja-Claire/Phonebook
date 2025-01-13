import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Icontact } from '../contacts/contacts.component';
import { DbService } from '../services/db/db.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss']
})
export class ViewContactComponent {
  editId!:string
  contactDetails:any
  IfSuccess:boolean =false
  ifError: boolean = false
  errorMessage?: string
  constructor(private fb: FormBuilder, private db: DbService, private location: Location, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(){
    this.editId = this.activeRoute.snapshot.queryParams['id']
    this.getContactDetails()
  }

    getContactDetails() {
      this.db.getContact(this.editId).snapshotChanges().subscribe({
        next: (contact: any) => {
          const data: any = contact.payload.toJSON() as Icontact;
          if (data) {
            this.contactDetails = data
          }




        }
      })
    }

    previous() {

      this.location.back();

    }
    edit(data: any) {
      this.editId = data.key

      this.router.navigate(['/add_contact'], { queryParams: { id:  this.editId}});

    }

    deleteContacts(data:any) {
      data.deleted = true

      this.db.updateContact(data.key, data)

      setTimeout(() => {
        this.IfSuccess = true
      }, 1000);

    }
}
