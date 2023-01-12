import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// customized components
import { SearchComponent } from './components/search/search.component';
import { BookingsComponent } from './components/bookings/bookings.component'
import { ResultsComponent } from './components/results/results.component' 

// import ReactiveFormsModule
import { ReactiveFormsModule } from '@angular/forms';

// import HttpClientModule 1. import HttpClientModule 2. declare in imports
import { HttpClientModule } from '@angular/common/http';

// two-ways data binding
import { FormsModule } from '@angular/forms';

// import mdb-tab
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// autocomplete
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// import google-map
import { GoogleMapsModule } from '@angular/google-maps'

// import service
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BookingsComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    GoogleMapsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
