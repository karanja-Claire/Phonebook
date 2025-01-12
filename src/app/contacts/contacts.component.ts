import { Component, ViewChild } from '@angular/core';
import { DbService } from '../services/db/db.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

interface contact {
  id:string,
  firstName:string,
  lastName:string,
email:string,
phoneNumber:string,
physicalAddress:string,

}


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
   contactForm!: FormGroup
    ifError:boolean = false
    errorMessage?:string
    IfSuccess:boolean = false
    contactData:any[]=[]
    searchQuery: string = '';
    selectAll: boolean = false;  // Tracks the "Select All" checkbox state
    isGridView = false;  // Default is list view
    displayForm:boolean = false
  displayTable:boolean = true
  editMode:boolean = false
  editId!:string
  previewContactData:boolean = false
  contactViewData:any
  previewUrl: string | ArrayBuffer | null = null;

    constructor(private fb: FormBuilder, private db:DbService) { }
    ngOnInit(): void {
      this.contactForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required,Validators.email]],
        phoneNumber: ['', [Validators.required, this.phoneNumberLengthValidator]],
        physicalAddress: ['', Validators.required],
        bio: ['', Validators.required],

      })
      const storedImage = localStorage.getItem('uploadedImage');
      if (storedImage) {
        this.previewUrl = storedImage;
      }

    }


    displayProductForm(){
      // hide table
      this.displayForm =true
      this.displayTable = false
      this.previewContactData = false
    }
    viewContacts(){
      this.displayForm = false
      this.previewContactData = false
      this.displayTable = true
    }
    previewData(data:any){
      this.displayForm = false
      this.previewContactData = true
      this.displayTable = false
      this.contactViewData = data
    }

    edit(data:any){
      this.displayForm = true
      this.displayTable=false
      this.editMode = true
      this.contactForm.patchValue({
        firstName:data.firstName,
        lastName:data.lastName,
        email:data.email,
        phoneNumber:data.phoneNumber,
        physicalAddress:data.physicalAddress,
        bio:data.bio,
        deleted:data.deleted,
        selected:data.selected
      })
      this.editId = data.id
    }

    editContactData(){

      this.db.editContact(this.contactForm.value, this.editId)

      this.displayTable = true
      this.displayForm = false
      setTimeout(() => {
        this.IfSuccess = true
      }, 1000);
    }



    submit(){
      if(this.contactForm.invalid){
        this.ifError=true
        this.errorMessage = 'Invalid Form'
        setTimeout(() => {
          this.ifError = false;
        }, 4000);

        this.contactForm.markAllAsTouched();

        return;
      }
      var data={
        id:Date.now(),
        firstName:this.contactForm.value.firstName,
        lastName:this.contactForm.value.lastName,
        email:this.contactForm.value.email,
        phoneNumber:this.contactForm.value.phoneNumber,
        physicalAddress:this.contactForm.value.physicalAddress,
        bio:this.contactForm.value.bio,
        deleted:false,
        selected:false
      }
      setTimeout(() => {
        this.IfSuccess = true
      }, 1000);

      this.db.addContact(data)
      this.getContactData()
      this.displayTable = true
      this.displayForm  =false
      this.contactForm.reset()
    }


    phoneNumberLengthValidator(control: AbstractControl): ValidationErrors | null {
      const value = control.value?.toString(); // Convert to string to check length
      if (value && (value.length < 12 || value.length > 12)) {
        return { phoneNumberLength: true }; // Custom error key
      }
      return null;
    }
    getContactData(){
      this.contactData = this.db.getContacts()
    }

    deleteContact(id:string){
      this.contactData.findIndex((item:any)=>{

        if(item.id == id){
        item.deleted = true

        }
      })

    }




    filteredContactData() {
      if (!this.searchQuery) {
        return this.contactData; // Return all contacts if no search query
      }
      const lowercasedQuery = this.searchQuery.toLowerCase();

      return this.contactData
        .filter(contact =>
          contact.firstName.toLowerCase().includes(lowercasedQuery) ||
          contact.lastName.toLowerCase().includes(lowercasedQuery) ||
          contact.email.toLowerCase().includes(lowercasedQuery) ||
          contact.phoneNumber ||
          contact.physicalAddress.toLowerCase().includes(lowercasedQuery)
        )
        // sort alphabetically
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
    }


     // Method to toggle selection for all rows
  toggleAll(event: any) {
    const checked = event.checked;
    this.contactData.forEach(contact => {
      contact.selected = checked;
    });
  }

  // Method to check if all rows are selected or not (for the "Select All" checkbox)
  onSelectionChange() {
    const allSelected = this.contactData.every(contact => contact.selected);
    this.selectAll = allSelected;
  }

  get selectedContactsCount(): number {
    return this.contactData.filter(contact => contact.selected).length;
  }
  deleteSelected() {
    this.contactData = this.contactData.filter(contact => !contact.selected);
    this.contactData.forEach((item:any)=>{
      if(item.selected){
        item.deleted =true
      }
    })
  }

  // file management
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        if (this.previewUrl) {
          localStorage.setItem('uploadedImage', this.previewUrl.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  }
}

