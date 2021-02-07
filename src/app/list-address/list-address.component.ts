import { Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, Renderer2, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../address.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-list-address',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.css']
})
export class ListAddressComponent implements OnInit {
  @Output() event = new EventEmitter();
  public modalRef!: BsModalRef;
  formAdd!: FormGroup;
  idContact: any;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private service: AddressService,
    private router: Router,
    private modalService: BsModalService) {
   
   }
  @Input() addresses: any;
  @Input() contact: any;

  ngOnInit(): void {
     this.createForm();
  }
  createForm():void
  {
    this.formAdd = this.formBuilder.group({
      idcontact: [0, Validators.required],
      ZipCode: [null, Validators.required],
      idaddress: [0, Validators.required],
      address: [null, Validators.required],
      number: [null, Validators.required],
      state: [null, Validators.required],
      country: [null, Validators.required],
      city: [null, null],
    
    });
  }

  Open(e:any)
  {
    let parametro: any = e;
    this.router.navigate(['address', parametro]);

  }
  Delete(e : any) {
    let novoDataSource: any = "";
    this.service.Delete(e, novoDataSource).subscribe((response: any) => {
      // this.toast.success("Operação concluída com sucesso!");
      // this.isLoading = !this.isLoading;
      this.router.navigate(['contact']);
    },
      (response: any) => {
        // this.isLoading = !this.isLoading;
        // this.toast.error(response.error);
      }
    );
  }
  public openModal(template: TemplateRef<any>, id: any) {
    this.idContact = this.contact;
    this.modalRef = this.modalService.show(template);
  }

  Save(e : any) {
    // this.CleanInputs();
    // if (this.formAdd.invalid) {
    //   this.HighlightErrorsFields();
    //   return;
    // }
      let DataSource: any =this.formAdd.value;;
    this.event.emit({ Source: DataSource });
    this.modalRef.hide();
    }
    
    CleanInputs(): void {
      for (let item in this.formAdd.controls) {
  
        let control = this.formAdd.controls[item];
  
        if (control.invalid) continue;
        let inputElement = this.elRef.nativeElement.querySelector(`[formControlName="${item}"]`);
        this.renderer.removeClass(inputElement, 'is-invalid');
      }
    }
  
    HighlightErrorsFields(): void {
   
      for (let item in this.formAdd.controls) {
        let control = this.formAdd.controls[item];
        if (control.valid) continue;
        let inputElement = this.elRef.nativeElement.querySelector(`[formControlName="${item}"]`);
        this.renderer.addClass(inputElement, 'is-invalid');
      }
  
      }
}

