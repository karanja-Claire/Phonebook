import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireAuthModule} from "@angular/fire/compat/auth";
import { AngularFireDatabaseModule} from "@angular/fire/compat/database";
import { AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { firebaseConfig } from './constants/constants';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ViewFavouriteComponent } from './view-favourite/view-favourite.component';
import { ViewContactComponent } from './view-contact/view-contact.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    FilterPipe,
    AddContactComponent,
    ViewFavouriteComponent,
    ViewContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  providers: [importProvidersFrom([AngularFireModule.initializeApp(firebaseConfig),AngularFireAuthModule,AngularFireDatabaseModule,AngularFirestoreModule])],
  bootstrap: [AppComponent]
})
export class AppModule { }
