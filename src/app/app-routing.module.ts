import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { ListContactComponent } from './list-contact/list-contact.component';

const routes: Routes = [ 
  { path: 'list', component: ListContactComponent },
 { path: 'contact', component: ContactComponent },
 { path: 'contact/:id', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
