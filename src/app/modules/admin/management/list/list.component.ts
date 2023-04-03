import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from 'app/modules/doctor.service';
import { AdminService } from 'app/modules/admin/admin.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageEvent } from '@angular/material/paginator';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  roleId: number;
  roles = [
         {id: 1, name: 'Super Admin'},
         {id: 6, name: 'Admin'},
      ];
  @ViewChild("addAdminModal") addAdminModal: TemplateRef<any>;
  sorting: any;
  addAdminForm: FormGroup;

  constructor(private elements: MatDialog,
    private service: DoctorService,
    private spinner: NgxSpinnerService,
    private encrypt: EncryptDecryptService,
    private _formBuilder: FormBuilder,
    private adminservice: AdminService,
    private router: Router,
    )  {
    let roleEncryption = localStorage.getItem('accessModifier');
    let currentPath = localStorage.getItem('path');
        //console.log(this._router.url);
        if (roleEncryption != null) {
            this.roleId = Number(this.encrypt.decryptData(roleEncryption).toString());
            console.log('Current role ID : '+this.roleId);
            
            var value = this.userExists(this.roleId);
            if(value == false){
              this.router.navigateByUrl(currentPath);
            }
        }
      this.page1.pageNumber = this.requestParam.current;
      this.page1.size = this.requestParam.pasgesize;
    }
    userExists(id) {
    return this.roles.some(function(el) {
      return el.id === id;
    }); 
  }
    requestParam: {
      current: number;
      pasgesize: number;
      filter: string;
      status: string;
      type: string;
      order: { direction: string; active: string };
  } = {
      current: 0,
      pasgesize: 10,
      filter: '',
      status: '',
      type: 'desc',
      order: { direction: '', active: '' },
  };
  encryptedResponse: successResponseData;
  serverResponse = new BehaviorSubject<any[]>([]);
  errorResponse: successResponseData;
  response = this.serverResponse.asObservable();
  total: number = 0;
  page1 = new adminManagementPageData();

  list: any[] = [{
    adminRole: "0",
    adminStatus: "1",
    mobilePhone: "1122121212",
    adminEmail: "112@asd.ccc",
    adminName: "ajith",
  },{
    adminRole: "0",
    adminStatus: "0",
    mobilePhone: "1122121212",
    adminEmail: "112@asd.ccc",
    adminName: "jabi",
  }];
  roleList: any[] = [{id:6,name:"Admin"}];
  statusList: any[] = [{id:1,name:"Active"},{id:0,name:"In Active"}];
  selectedRole : number = 6;
  selectedStatus : number = 1;
  Message : string = '';
  MessageClass : string = '';
  uuid : string = '';
  ngOnInit(): void {
    this.getList();
    this.addAdminForm = this._formBuilder.group({
      adminName: ['', Validators.required],
      adminEmail: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern(
        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
      )]],
      mobilePhone: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
      adminRole:['', Validators.required],
      adminStatus:['', Validators.required],

  });
  }
  getList() {
    // this.spinner.show();
 
    //console.log(this.list)

    // this.serverResponse.next(this.list);
    //this.serverResponse.next(this.list);
    //this.spinner.show();
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(this.requestParam)
    );
    this.adminservice.getadminList(encryptedRequest).subscribe(
        (data: any) => {
            /*setTimeout(() => {
                this.spinner.hide();
            }, 200);*/
            this.encryptedResponse = data;
            this.list = this.encryptedResponse.data;
            console.log(this.list);
            this.serverResponse.next(this.list);
            this.total = data.total;
            this.page1.totalElements = this.total; //this.total;
            this.page1.totalPages =
                this.page1.totalElements / this.page1.size;
        },
        (error: any) => {
            /*setTimeout(() => {
                this.spinner.hide();
            }, 200);*/
            console.log(error);
            this.errorResponse = this.encrypt.decryptData(error.error.data);
            this.encryptedResponse = error.error.data;
            console.log(this.encryptedResponse);
        }
    );
}
  handleSearch(searchValue){
    if (searchValue.target.value.length >= 3 || searchValue.target.value.length == 0) {
      this.requestParam.filter = searchValue.target.value
      this.getList();
    }  
  }
  getServerData(event?: PageEvent) {
    this.requestParam.current = event.pageIndex;
    this.requestParam.pasgesize = event.pageSize;
    this.getList();
  }

  addAdmin() {
    this.uuid = '';
    this.selectedRole = 6;
    this.selectedStatus = 1;
  	let dialogRef = this.elements.open(this.addAdminModal,{
      width:'680px'
    });
  }
  editAdmin(row){
    console.log(row);
    this.uuid = row.uuid;
    this.selectedRole = row.role_id;
    this.selectedStatus = row.status_id;
     let dialogRef = this.elements.open(this.addAdminModal,{
      width:'680px'
    });
    this.addAdminForm.controls['adminName'].setValue(
              row.name
          );
    this.addAdminForm.controls['adminEmail'].setValue(
              row.email
          );
    this.addAdminForm.controls['mobilePhone'].setValue(
              row.mobile_number
          );       
  }
  cancelPopup() {
    this.elements.closeAll();
    this.addAdminForm.reset();
}
onSort(event) {
        const sort = event.sorts[0];
        console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParam.order.active = sort.prop;
        this.requestParam.order.direction = sort.dir;
        this.page1.pageNumber = 0;
        //this.getList();
    }
    setPage(pageInfo) {
        this.page1.pageNumber = pageInfo;
      }
addPopup() {
  if (this.addAdminForm.valid) {
      // this.spinner.show();
      var sendData = {
          uuid: '',
          adminName: this.addAdminForm.value.adminName,
          adminEmail: this.addAdminForm.value.adminEmail,
          mobilePhone: this.addAdminForm.value.mobilePhone,
          adminRole: this.addAdminForm.value.adminRole,
          adminStatus: this.addAdminForm.value.adminStatus,
      };
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.adminservice.addAdminDetails(encryptedRequest).subscribe((data: any) => {
          console.log(data);
        this.Message = data.msg;
        this.MessageClass = 'success';
        setTimeout(() => {
         this.Message = '';            
        }, 4000);
        this.cancelPopup();
        this.getList();
      },(error: any) => {
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        console.log(this.errorResponse);
        this.Message = this.errorResponse.msg;
        this.MessageClass = 'error';
        setTimeout(() => {
           this.Message = ""; 
        }, 4000);
      });
  }
}
updatePopup(row){
    if (this.addAdminForm.valid) {
      // this.spinner.show();
      var sendData = {
          uuid: this.uuid,
          adminName: this.addAdminForm.value.adminName,
          adminEmail: this.addAdminForm.value.adminEmail,
          mobilePhone: this.addAdminForm.value.mobilePhone,
          adminRole: this.addAdminForm.value.adminRole,
          adminStatus: this.addAdminForm.value.adminStatus,
      };
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.adminservice.addAdminDetails(encryptedRequest).subscribe((data: any) => {
          console.log(data);
        this.Message = data.msg;
        this.MessageClass = 'success';
        setTimeout(() => {
         this.Message = '';            
        }, 4000);
        this.cancelPopup();
      },(error: any) => {
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        console.log(this.errorResponse);
        this.Message = this.errorResponse.msg;
        this.MessageClass = 'error';
        setTimeout(() => {
           this.Message = ""; 
        }, 4000);
      });
      //this.list.push(sendData.data);
      this.getList();
      //this.cancelPopup();
  }
}
changeStatus(row) {
  console.log(row)
}
}
export class adminManagementPageData {
  // The number of elements in the page
  size: number = 0;
  // The total number of elements
  totalElements: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // The current page number
  pageNumber: number = 0;
  requests: any = '';
}