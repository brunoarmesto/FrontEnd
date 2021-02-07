import { Component, ElementRef, Injectable, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {
  isVisible: boolean = true;
  isVisibleError: boolean = true;
  
  form!: FormGroup;
  contacts: any[] = [];
  param: any;
  mensagem: any;
  
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private service: ContactService,
    private router: Router) {
   
   }

  ngOnInit(): void {
    this.service.GetAll().subscribe((response: any) => {
      if(response.success)
      {
        this.contacts = response.data;
        
      }
      else
      {
          this.mensagem = response.message;
          this.isVisibleError = false;
      }
    
    },
      (response: any) => {

      }
    );
  }
  Open(e: any): void{
    this.router.navigate(['/contact', e]);

  }
}
