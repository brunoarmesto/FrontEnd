import { escapeRegExp } from '@angular/compiler/src/util';
import { Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

@Injectable({ providedIn: 'root' })

export class ContactComponent implements OnInit {
  form!: FormGroup;
  addresses: any[] = [];
  contact!: any;
  param: any;
  isVisible: boolean = true;
  isVisibleError: boolean = true;
  isDocument: boolean = true;
  isViewFantasy: boolean = true;
  mensagem: any;

   constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private service: ContactService,
    private router: Router) {

    this.route.params.subscribe(r => {
      this.param = r.id;
     
      this.Load();


    });

   }

   getMask(document: any) {
         let inputElement = this.elRef.nativeElement.querySelector(`[formControlName="Document"]`);
    let mascara = document;
    mascara=mascara.replace(/\D/g,"");  
    if(mascara.length > 11)
    {
      mascara=mascara.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
   else
   {
      mascara=mascara.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4")
   }
    inputElement.value = mascara;
  }
  ngOnInit(): void {
    this.createForm();
  }

  checkDocument(): void{
    let novoDataSource: any = this.form.value;

    if(novoDataSource.Document)
    {
      let value = novoDataSource.Document;
      value=value.replace(/\D/g,"");  
      if (value.length == 11)
      {
        
        this.isViewFantasy = true;
        this.isDocument = false;
      }   
      else if (value.length == 14)
      {
        this.isViewFantasy = false;
        this.isDocument = false;
      }
    }
    this.getMask(novoDataSource.Document);
  }

  Load(): void
  { 
    if (this.param)
    {
      this.service.GetById(this.param).subscribe((response: any) => {
        if(response.success)
        {
          this.LoadForm(response.data);
          let value = response.data.document.length
          value=value.replace(/\D/g,"");  
          if(value.length > 14)
          {
            this.isViewFantasy = true;
          }
          
        }
        else{
          this.mensagem = response.message;
          this.isVisibleError = false;

        }
      },
        (response: any) => {
          this.mensagem = response.message;
            this.isVisibleError = false;
        }
      );
    
    }
    else
    {
      this.createForm();
    }
    
}

  createForm(): void {
 
    this.form = this.formBuilder.group({
      Document: [null, Validators.required],
      idcontact: [0, null],
      Name: [null, Validators.required],
      FantasyName: [null,null],
      DateBirth: [null, Validators.required],
      GenderPerson: [null, Validators.required],
      addresses: [null,null]
    });
  }
  LoadForm(e : any): void {
    this.addresses = e.addresses;
    this.contact = e.idcontact;
    let datetime = new Date(e.dateBirth).toLocaleDateString();
    let dateBirth = datetime.substring(6) + "-" + datetime.substr(3, 2) + "-" + datetime.substring(0, 2);
    this.form = this.formBuilder.group({
      Document: [e.document, Validators.required],
      idcontact: [e.idcontact, Validators.required],
      Name: [e.name, Validators.required],
      FantasyName: [e.fantasyName, null],
      DateBirth: [dateBirth, Validators.required],
      GenderPerson: [e.genderPerson, Validators.required],
      addresses: [e.addresses,null]
    });
    this.checkDocument();
  

  }
  
  Save() {
    this.CleanInputs();
    if (this.form.invalid) {
      this.HighlightErrorsFields();
      return;
    }

    let novoDataSource: any = this.form.value;
    novoDataSource.addresses = this.addresses;
    this.service.Save(novoDataSource.idcontact, novoDataSource).subscribe((response: any) => {
      if(response.success)
      {
      this.mensagem = response.message;
      this.isVisible = false;
      this.form.reset();
      this.router.navigate(['list']);
      }
      else{
        this.mensagem = response.message;
        this.isVisibleError = false;

      }
    },
      (response: any) => {
        this.mensagem = response.message;
          this.isVisibleError = false;
      }
    );
  }
  Delete() {
    let novoDataSource: any = this.form.value;
   
    this.service.Delete(novoDataSource.idcontact, novoDataSource).subscribe((response: any) => {

      this.router.navigate(['list']);
    },
      (response: any) => {
        this.mensagem = response.message;
        this.isVisibleError = false;
      }
    );
  }
  CleanInputs(): void {

    for (let item in this.form.controls) {

        let control = this.form.controls[item];
     
      if (control.invalid) continue;
      if (item != 'addresses' && item != 'FantasyName')
      {
        let inputElement = this.elRef.nativeElement.querySelector(`[formControlName="${item}"]`);
        this.renderer.removeClass(inputElement, 'is-invalid');
      }

    }

  }

  HighlightErrorsFields(): void {
 
    for (let item in this.form.controls) {
      let control = this.form.controls[item];
      if (control.valid) continue;
      
      if (item != 'addresses' && item != 'FantasyName')
      {
        let inputElement = this.elRef.nativeElement.querySelector(`[formControlName="${item}"]`);
        this.renderer.addClass(inputElement, 'is-invalid');
        
      }
     
    }

    }

    onEvent(event : any) {
     this.addresses?.push(event.Source);
    
 }
}
