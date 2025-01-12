import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ViewFavouriteComponent } from './view-favourite/view-favourite.component';
import { ViewContactComponent } from './view-contact/view-contact.component';


const routes: Routes = [
  {path:'', component:ContactsComponent},
  {path:'add_contact', component:AddContactComponent},
  {path:'favourites', component:ViewFavouriteComponent},
  {path:'view_contact', component:ViewContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
