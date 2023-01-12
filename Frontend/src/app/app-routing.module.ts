import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// customized components
import { SearchComponent } from './components/search/search.component';
import { BookingsComponent } from './components/bookings/bookings.component'

// add my components
const routes: Routes = [
  {path: "search", component: SearchComponent},
  {path: "bookings", component: BookingsComponent},
  {path: "**", redirectTo: "search"} // default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
