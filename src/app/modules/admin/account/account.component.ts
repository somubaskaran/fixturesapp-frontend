import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { AdminService } from '../admin.service';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
/**
 * An object used to get page information from the server
 */
export class patientListPageData {
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
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  roleId: number;
  roles = [
         {id: 1, name: 'Super Admin'},
         {id: 6, name: 'Admin'},
      ];
  @ViewChild('search', { static: false }) search: ElementRef;
   @ViewChild('userDetailsDialog') userDetailsDialog: TemplateRef<any>;
  addClass: string = 'list';
  encryptedResponse: successResponseData;
  errorResponse: successResponseData;
  response: any[] = [];
  units: any;
  total: number = 0;
  active: number = 0;
  systemTotal: number = 0;
  sorting: any;
  inactive: number = 0;
  selected = 'desc';
  Message : string = '';
  MessageClass : string = '';
  patientDetails
  page = {
    limit: 5,
    count: 0,
    offset: 0,
    orderBy: 'myColumn1',
    orderDir: 'desc'
  };
  isChecked : boolean;
  alertPopup: FuseConfirmationConfig = {
    'title': '',
    'message': '',
    'icon': {
      'color': 'warn',
      'name': '',
      'show': false
    },
    'actions': {
      'cancel': {
        'show': false,
        'label': ''
      },
      'confirm': {
        'color': 'warn',
        'label': '',
        'show': false
      }
    },
    'dismissible': false
  };
  page1 = new patientListPageData();
  isplayedColumns: string[] = ['monthNo', 'ratePerSqm', 'fixedAmount', 'frequnecyOfAssessment', 'typeOfAssesment', 'action'];
  
  columns = [{ prop: 'first_name' }, { name: 'Gender' }, { name: 'Company' }];
  requestParam: {
    'current': number,
    'pasgesize': number,
    'filter': string,
    'status': string,
    "type": string,
    "order": { "direction": string, "active": string }

  } = { "current": 0, "pasgesize": 10, "filter": "", "status": "", "type": "desc", "order": { "direction": "", "active": "" } };
locationList : any[] = [{"id":0,"name":"Orlando"}];
specializationList: any[] = [{"id":0,"name":"Cardiology"}];
  updateUserForm: FormGroup;
  selectDepartment;
    selectlocation;
    selectedtimezone;
    selectdeactiveDays;
    currentUuid;
  constructor(private service: AdminService, private spinner: NgxSpinnerService,private encrypt: EncryptDecryptService, private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private elements: MatDialog,
    private router: Router
    ) {
    this.page1.pageNumber = this.requestParam.current;
    this.page1.size = this.requestParam.pasgesize;
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
  }
  userExists(id) {
    return this.roles.some(function(el) {
      return el.id === id;
    }); 
  }
  ngOnInit(): void {
    this.setPage(this.requestParam.current);
    this.updateUserForm = this._formBuilder.group({
        username: ['',Validators.required],
        useremail: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
        userqualification: ['',Validators.required],
        usernumber: [
                '',
                [Validators.required, Validators.pattern('^[0-9]{10}$')],
            ],
        departmentUser: ['',Validators.required],
        locationUser: ['',Validators.required],
    })
    //this.getList();
    /* this.search.nativeElement.valueChanges
    .debounceTime(1000)
    .subscribe(newValue => {this.requestParam.filter = newValue;this.setPage(this.getList)}); */
  }
  valueChange(newValue) {
    this.requestParam.filter = newValue;
    this.getList();
  }
  getList() {
    //this.spinner.show();
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.requestParam));
    this.service.getOrganizationList(encryptedRequest).subscribe((data: any) => {
      /*setTimeout(() => {
          this.spinner.hide();
      }, 200);*/
      this.encryptedResponse = data;
      this.response = this.encryptedResponse.data.userDetails;
      this.response.forEach((value) => {
        if (value.status == 1) {
          value.status = true;
        }else{
          value.status = false;
        }
        value.region = (value.region != null ? this.locationList[value.region].name:'-');
      });
      this.units = this.encryptedResponse.data.units;
      this.total = this.encryptedResponse.data.additional.total;
      this.systemTotal = this.encryptedResponse.data.additional.systemTotalvalue;
      this.active = this.encryptedResponse.data.additional.systemActivevalue;
      this.inactive = this.encryptedResponse.data.additional.systemInActivevalue;
      this.page1.totalElements = this.total;
      this.page1.totalPages = this.page1.totalElements / this.page1.size;
    },
      (error: any) => {
        /*setTimeout(() => {
            this.spinner.hide();
        }, 200);*/
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.encryptedResponse = error.error.data;
        console.log(this.encryptedResponse);
      });
  }
  filterChange(value, type) {
    console.log(value);
    this.requestParam.current = 0;
    if (type == 'status') {
      if (value == 'active') {
        this.requestParam.status = "1";
      } else if (value == 'inactive') {
        this.requestParam.status = "0";
      } else {
        this.requestParam.status = ""
      }
      this.getList();
    } else if (type == 'type') {
      this.requestParam.type = value;
      this.requestParam.order.active = '';
      this.requestParam.order.direction = '';
      this.getList();
    }/*  else if (type == 'bp') {
      this.requestParam.blood_pressure = value;
    } else if (type == 'pulse') {
      this.requestParam.pulse = value;
    } */ else if (type == 'search') {
      if (value.length >= 3 || value.length == 0) {
          this.requestParam.filter = value
          this.getList();
      }
    }
  }
  setData(data){
    console.log(data);
    var userUuid = data.uuid;
    this.router.navigate(['admin/organization/view'], { queryParams: { userUuid: data.uuid } });
  }
  updateUserProfile(){
    if(this.updateUserForm.valid){
      var sendData = {
        username : this.updateUserForm.value.username,
        useremail : this.updateUserForm.value.useremail,
        userqualification : this.updateUserForm.value.userqualification,
        usernumber : this.updateUserForm.value.usernumber,
        departmentUser : this.updateUserForm.value.departmentUser,
        locationUser : this.updateUserForm.value.locationUser,
        userUuid : this.currentUuid
        /*timezone : this.updateUserForm.value.timezone,
        deactiveDays : this.updateUserForm.value.deactiveDays,
        healthalerts : this.isChecked,*/
      }
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.service.updateUserDetails(encryptedRequest).subscribe((data: any) => {
          console.log(data);
        this.Message = data.msg;
        this.MessageClass = 'success';
        setTimeout(() => {
         this.Message = '';            
        }, 4000);
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
      this.cancelPopup();
    }
  }
  getEditUser(row){
    var sendData = {
        userUuid : row.uuid,
      }
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getUserDetails(encryptedRequest).subscribe(
            (data: any) => {
              let dialogRef = this.elements.open(this.userDetailsDialog, {
                width: '680px',
            });
              //this.updateUserForm.value.username = data.data[0].name;
              this.updateUserForm.controls['username'].setValue(
                        data.data[0].name
                    );
              this.updateUserForm.controls['useremail'].setValue(
                        data.data[0].email_address
                    );
              this.updateUserForm.controls['usernumber'].setValue(
                        data.data[0].mobile_number
                    );
              /*this.updateUserForm.controls['useremail'].disable();
              this.updateUserForm.controls['usernumber'].disable();*/
              this.updateUserForm.controls['userqualification'].setValue(
                        data.data[0].qualification
                    );
              this.updateUserForm.controls['departmentUser'].setValue(
                        data.data[0].department
                    );
              this.updateUserForm.controls['locationUser'].setValue(
                        data.data[0].region
                    );
              this.selectDepartment = (data.data[0].department==null?'':Number(data.data[0].department));
              this.selectlocation = (data.data[0].region==null?'':Number(data.data[0].region));
              this.selectedtimezone = (data.data[0].timezone==null?'':Number(data.data[0].timezone));
              this.selectdeactiveDays = (data.data[0].inactivedays==null?'':Number(data.data[0].inactivedays));
              this.currentUuid = data.data[0].uuid;
        });
  }
  listViewChange(value) {
    console.log(value);
    if (value == 'grid-view') {
      this.addClass = 'grid-view';
    } else if (value == 'list') {
      this.addClass = 'list';
    }
  }
  onSort(event) {
    const sort = event.sorts[0];
    console.log('Sort Event', sort);
    this.sorting = sort;
    this.requestParam.order.active = sort.prop;
    this.requestParam.order.direction = sort.dir;
    this.page1.pageNumber = 0;
    this.getList();
  }
  get Math() {
    return Math;
  }

  setPage(pageInfo) {
    this.page1.pageNumber = pageInfo;
    console.log('ere');
    this.getList();
  }
  getServerData(event?: PageEvent) {
    console.log(event.pageIndex);
    console.log(event.previousPageIndex);
    console.log(event.pageSize);
    this.requestParam.current = event.pageIndex;
    this.requestParam.pasgesize = event.pageSize;
    this.getList();
  }

  addPatient() {

  }
/*  onToggleChange($event) {
    $event.preventDefault();
    //var status = row.status;
    this.alertPopup.title = "Change Status";
    this.alertPopup.message = "Are you sure want to change the status?";
    this.alertPopup.icon.show = true;
    this.alertPopup.icon.name = 'heroicons_outline:exclamation';
    this.alertPopup.icon.color = 'warn';
    this.alertPopup.actions.confirm.show = true;
    this.alertPopup.actions.confirm.label = 'Ok';
    this.alertPopup.actions.confirm.color = 'warn';
    this.alertPopup.actions.confirm.show = true;
    this.alertPopup.actions.cancel.show = true;
    this.alertPopup.actions.cancel.label = 'Cancel';
    this.alertPopup.dismissible = false;
    if(this.isChecked) {
      this._fuseConfirmationService.open(this.alertPopup).afterClosed().subscribe(
        confirmed => { /*if(confirmed) this.isChecked = false;*/
          /*if(confirmed == 'confirmed'){
            if(status=='true'){
              this.isChecked = false;
            }else{
              this.isChecked = true;
            }
          }
        console.log(confirmed); }
      );
    } else {
      //this.isChecked = true;
    }

  }*/
  exporttocsv() {
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.DoctorsFileExport(encryptedRequest).subscribe(
            (data: any) => {
                this.downLoadFile(data);
            },
            (error: any) => {
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
            }
        );
    }
    downLoadFile(data: any) {
        var blob = new Blob([data], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;
        // it forces the name of the downloaded file
        //var patient_id = 2222;
        fileLink.download =
            'Doctors-List-' +
            moment.utc().local().format('MMM-DD-YY-LT') +
            '.csv';
        document.body.setAttribute('style', 'text-align:center');
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
    }
  cancelPopup(){
    this.elements.closeAll();
    return  false;
  }
    changeStatus(row) {
    console.log(row.status);
    this.alertPopup.title = "Change Status";
    this.alertPopup.message = "Are you sure want to change the status?";
    this.alertPopup.icon.show = true;
    this.alertPopup.icon.name = 'heroicons_outline:exclamation';
    this.alertPopup.icon.color = 'warn';
    this.alertPopup.actions.confirm.show = true;
    this.alertPopup.actions.confirm.label = 'Ok';
    this.alertPopup.actions.confirm.color = 'warn';
    this.alertPopup.actions.confirm.show = true;
    this.alertPopup.actions.cancel.show = true;
    this.alertPopup.actions.cancel.label = 'Cancel';
    this.alertPopup.dismissible = false;
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.alertPopup);
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let changeStatusRequest = {
      'uuid': row.uuid,
      'status': true,
      'role_id': role
    };

    /*if (row.status == true) {
      changeStatusRequest.status = false;
    } else {
      changeStatusRequest.status = true;
    }*/
    changeStatusRequest.status = row.status;
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(changeStatusRequest));
        console.log(changeStatusRequest);
        this.service.changeAccountStatus(encryptedRequest).subscribe((data: any) => {
          console.log(data);
          this.getList();
        }, (error: any) => {
          console.log(error);
        });
      } else if (result == 'cancelled') {
        /*console.log(this.list);
        this.list.forEach((value: any) => {
          if (value.uuid === row.uuid) {
            console.log(row.status);
            console.log(value.status);
            value.status = row.status;
          }
        });
        this.serverResponse.next(this.list);*/
      }
      this.getList();
    });
  }
}
