import { Component, ViewChild } from '@angular/core';
import { DbService } from '../services/db/db.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

export interface Icontact {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  physicalAddress: string,
  bio:any,
  deleted:boolean,
  isFavourite:boolean,
  selected:boolean

}


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  contactForm!: FormGroup
  ifError: boolean = false
  errorMessage?: string
  IfSuccess: boolean = false
  contactData: any[] = []
  searchQuery: string = '';
  selectAll: boolean = false;  // Tracks the "Select All" checkbox state
  isGridView = false;  // Default is list view

  editMode: boolean = false
  editId!: string

  successMessage: any
  ContactBook:any[] = []
  filteredContacts:any[]=[]
  originalContactBook:any[]=[]
  constructor(private fb: FormBuilder, private db: DbService, private router:Router) { }
  ngOnInit(): void {

    this.getAllContactData()


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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.readExcel(file);
    }
  }

  // Read and parse the Excel file
  readExcel(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Get the first sheet in the workbook
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);  // 'header: 1' gives you an array of rows


      const values = Object.values(jsonData);

      values.forEach((record:any)=>{
        record.id = uuidv4();  // Generates a unique ID
        record.deleted=false,
        record.selected= false,
        record.isFavorite =false
      })


      this.contactData.push(...values)

    };

    // Read the file as binary string
    reader.readAsBinaryString(file);
  }

  getContactData() {
    this.contactData = this.db.getContacts()
  }

  deleteContacts(data: any) {
    data.deleted = true

    this.db.updateContact(data.key, data)

    setTimeout(() => {
      this.IfSuccess = true
    }, 1000);

  }




  filteredContactData() {
    if (!this.searchQuery) {
      return this.contactData; // Return all contacts if no search query
    }
    const lowercasedQuery = this.searchQuery.toLowerCase();

    return this.ContactBook
      .filter(contact =>
        contact.firstName.toLowerCase().includes(lowercasedQuery) ||
        contact.lastName.toLowerCase().includes(lowercasedQuery) ||
        contact.email.toLowerCase().includes(lowercasedQuery) ||
        contact.phoneNumber ||
        contact.physicalAddress.toLowerCase().includes(lowercasedQuery)
      )
      // sort alphabetically
      .sort((a, b) => {
        const nameA = `${a.firstName.trim()} ${a.lastName.trim()}`.toLowerCase();
        const nameB = `${b.firstName.trim()} ${b.lastName.trim()}`.toLowerCase();
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });


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



  // export html data into excel


    exportTableToExcel(): void {
      const tableElement = document.getElementById('contactsData');

    const tableClone = tableElement?.cloneNode(true) as HTMLElement;

    const rows = tableClone.querySelectorAll('tr');
    rows.forEach((row) => {
      const buttonsCell = row.querySelector('td.export-hide');
      if (buttonsCell) {
        buttonsCell.remove();
      }

    });
    rows.forEach((row) => {

    const headers = row.querySelector('th.export-hide');
    if (headers) {
      headers.remove();
    }
  });

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableClone);

    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const file: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    const filename = 'contacts_data.xlsx'; // filename

    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
  }




  getAllContactData() {
    this.db.getAllContacts().snapshotChanges().subscribe({
      next: (data: any) => {
        this.originalContactBook = data.map((e: any) => {
          return {
            key: e.payload.key,
            ...e.payload.val(),
          };
        });
        this.ContactBook = [...this.originalContactBook]; // Initially set ContactBook to the full list
        this.ContactBook.sort((a: any, b: any) => {
          const nameA = a.firstName.toLowerCase();
          const nameB = b.firstName.toLowerCase();

          if (nameA < nameB) {
            return -1; // Sort `a` before `b`
          } else if (nameA > nameB) {
            return 1; // Sort `a` after `b`
          }
          return 0; // Names are equal
        });     },
      error: () => {},
      complete: () => {}
    });
  }

  // Filter contacts based on search query
  filterContacts() {
    // If the search query is empty, reset the ContactBook to the original list
    if (!this.searchQuery) {
      this.ContactBook = [...this.originalContactBook];  // Reset to original list
      return;
    }

    // Convert the search query to lowercase for case-insensitive search
    const lowerCaseQuery = this.searchQuery.toLowerCase();

    this.ContactBook = this.originalContactBook.filter(contact => {
      // Check if the contact's firstName (or any other property) includes the search query
      return contact.firstName.toLowerCase().includes(lowerCaseQuery) ||
             contact.lastName.toLowerCase().includes(lowerCaseQuery) ||
             contact.email.toLowerCase().includes(lowerCaseQuery); // You can add more fields here
    });
  }
}

