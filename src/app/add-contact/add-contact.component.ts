import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DbService } from '../services/db/db.service';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Icontact } from '../contacts/contacts.component';



@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {
  contactForm!: FormGroup
  ifError: boolean = false
  errorMessage?: string
  IfSuccess: boolean = false
  editMode: boolean = false
  editId!: string
  successMessage: any
  constructor(private fb: FormBuilder, private db: DbService, private location: Location, private router: Router, private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.phoneNumberLengthValidator]],
      physicalAddress: ['', Validators.required],
      bio: ['', Validators.required],
    })
    this.editId = this.activeRoute.snapshot.queryParams['id']

    if (this.editId) {
      this.editMode = true
      this.getContactDetails()
    }
  }
  previous() {

    this.location.back();

  }



  editContactData() {

    this.db.updateContact(this.editId, this.contactForm.value)

    setTimeout(() => {
      this.IfSuccess = true
    }, 1000);
    this.contactForm.reset()
    this.router.navigate([''])
  }

  getContactDetails() {
    this.db.getContact(this.editId).snapshotChanges().subscribe({
      next: (contact: any) => {
        const data: any = contact.payload.toJSON() as Icontact;
        if (data) {
          this.contactForm.patchValue({
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            email: data.email ?? '',
            phoneNumber: data.phoneNumber ?? '',
            physicalAddress: data.physicalAddress ?? '',
            bio: data.bio ?? '',
            deleted: data.deleted,
            selected: data.selected,
            isFavorite: data.isFavorite
          })
        }
      }
    })
  }

  submit() {
    if (this.contactForm.invalid) {
      this.ifError = true
      this.errorMessage = 'Invalid Form'
      setTimeout(() => {
        this.ifError = false;
      }, 4000);

      this.contactForm.markAllAsTouched();

      return;
    }
    var data = {
      id: uuidv4(),
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      email: this.contactForm.value.email,
      phoneNumber: this.contactForm.value.phoneNumber,
      physicalAddress: this.contactForm.value.physicalAddress,
      bio: this.contactForm.value.bio,
      deleted: false,
      selected: false,
      isFavorite: false
    }

    this.db.addContacts(data)
    setTimeout(() => {
      this.IfSuccess = true
    }, 1000);

    this.contactForm.reset()
    this.router.navigate([''])
  }


  uploadExcelSheet() {
    setTimeout(() => {
      this.IfSuccess = true
    }, 1000);
    this.router.navigate([''])

  }

  phoneNumberLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toString();
    if (value && (value.length < 12 || value.length > 12)) {
      return { phoneNumberLength: true };
    }
    return null;
  }

  // Read and parse the Excel file
  readExcel(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);


      const values = Object.values(jsonData);

      values.forEach((record: any) => {
        record.id = uuidv4();  // Generates a unique ID
        record.deleted = false,
          record.selected = false,
          record.isFavorite = false
        this.db.addContacts(record)
      })



    };

    reader.readAsBinaryString(file);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.readExcel(file);
    }
  }

}
