import { Component, ElementRef, OnInit ,ViewChild,TemplateRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { DoctorService } from 'app/modules/doctor.service';
import { successResponseData } from 'app/core/response-schema';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseValidators } from '@fuse/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { mobileNumberValidator, passwordValidator } from './customValidator';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  roleId: number;
  roles = [
         {id: 2, name: 'Doctor Admin'},
         {id: 3, name: 'Doctor'},
         {id: 4, name: 'Finance'},
         {id: 5, name: 'Staff'},
      ];
  //@ViewChild('search', { static: false }) search: ElementRef;
  @ViewChild('changepasswordDialog') changepasswordDialog: TemplateRef<any>;
  @ViewChild('inviteMemberDialog') inviteMemberDialog: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  serverResponse = new BehaviorSubject<any[]>([]);
  response = this.serverResponse.asObservable();

  specializationList: any[] = [{"id":0,"name":"Cardiology"}];
  locationList : any[] = [{"id":0,"name":"Orlando"}];
  timezoneList: any[] = [{"id":0,"name":"HST  Hawaii Standard Time  UTC-10.00"},{"id":1,"name":"AKST  Alaska Standard Time  UTC-09.00"},{"id":2,"name":"PST  Pasific Standard Time  UTC-08.00"},{"id":3,"name":"MST  Mountain Standard Time  UTC-07.00"},{"id":4,"name":"CST  Central Standard Time  UTC-06.00"},{"id":5,"name":"EST  Easteran Standard Time  UTC-05.00"}];
  daysList: any[] = [{"id":0,"name":"7 Days"},{"id":1,"name":"14 Days"},{"id":2,"name":"21 Days"}];
  doctorcheckedList = [{"id":1,"label":"Patient List","value":false},
                  {"id":2,"label":"To-Do","value":false},
                  {"id":3,"label":"Alerts","value":false},
                  {"id":4,"label":"Billing","value":false},
                  {"id":5,"label":"Reports","value":false}];
  /*defautcheckedList = [{"id":1,"label":"Patient List","value":false},
                  {"id":2,"label":"To-Do","value":false},
                  {"id":3,"label":"Alerts","value":false},
                  {"id":4,"label":"Billing","value":false},
                  {"id":5,"label":"Billing","value":false}];*/
  constructor(
    private elements: MatDialog,
    private spinner: NgxSpinnerService,
    private encrypt: EncryptDecryptService,
    private service: DoctorService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private router: Router
  ) {
    let roleEncryption = localStorage.getItem('accessModifier');
      let currentPath = localStorage.getItem('path');
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
  firstForm: FormGroup;
  passwordForm: FormGroup;
  updateUserForm: FormGroup;
  page1 = new patientListPageData();

    requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        blood_pressure: string;
        pulse: string;
        order: { direction: string; active: string };
        patient_id: string;
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: '',
        pulse: '',
        order: { direction: '', active: '' },
        patient_id: '',
    };
    sorting: any;
    list: any[] = [];
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    total: number = 0;
    Message : string = '';
    MessageClass : string = '';
    invitedList : any[];
    selectDepartment;
    selectlocation;
    selectedtimezone;
    selectdeactiveDays;
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
  ngOnInit(): void {
    this.setPage(this.requestParam.current);
    this.firstForm = this._formBuilder.group({
            memberName: ['',Validators.required],
            memberEmail: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
            location: ['',Validators.required],
            department: ['',Validators.required],
            providerid: ['']
        });
    this.passwordForm = this._formBuilder.group({
          oldPassword: ['',Validators.required],
          newPassword: ['',[Validators.required,passwordValidator()]],
          confirmPassord: ['',Validators.required],
         },
          {
              validators: FuseValidators.mustMatch(
                  'newPassword',
                  'confirmPassord'
              ),
          });
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
        usernumber: ['',Validators.required],
        departmentUser: ['',Validators.required],
        locationUser: ['',Validators.required],
        timezone: ['',Validators.required],
        deactiveDays: ['',Validators.required],
    })
    this.getInvetedMembers();
    this.getUserDetails();
    this.getCheckList();
  }
  onChangePassword(){
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
      var sendData = {
        oldPassword : this.passwordForm.value.oldPassword,
        newPassword : this.passwordForm.value.newPassword,
        confirmPassord : this.passwordForm.value.confirmPassord,
      }
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.service.userChangePassword(encryptedRequest).subscribe((data: any) => {
          this.cancelPopup();
          this.Message = data.msg;
          this.MessageClass = 'success';
          setTimeout(() => {
                      // <<<---using ()=> syntax
           this.Message = '';            
          }, 4000);
      },(error: any) => {
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.Message = this.errorResponse.msg;
        this.MessageClass = 'error';
        setTimeout(() => {
           this.Message = ""; 
        }, 4000);
      });
    }
  }
  oninviteSubmit(){
    if (this.firstForm.valid && this.ckeckError=='') {
      console.log(this.firstForm.value); 
      var sendData = {
        memberName : this.firstForm.value.memberName,
        memberEmail : this.firstForm.value.memberEmail,
        location : this.firstForm.value.location,
        department : this.firstForm.value.department,
        role : this.selectValue,
      }
      
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.service.addUserProfile(encryptedRequest).subscribe((data: any) => {
        console.log(data);
        this.cancelPopup();
        this.Message = 'Invited Successfully';
        this.MessageClass = 'success';
        this.getInvetedMembers();
        setTimeout(() => {
                    // <<<---using ()=> syntax
         this.Message = '';            
        }, 4000);
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
  updateUserProfile(){
    if(this.updateUserForm.valid){
      var sendData = {
        username : this.updateUserForm.value.username,
        useremail : this.updateUserForm.value.useremail,
        userqualification : this.updateUserForm.value.userqualification,
        usernumber : this.updateUserForm.value.usernumber,
        departmentUser : this.updateUserForm.value.departmentUser,
        locationUser : this.updateUserForm.value.locationUser,
        timezone : this.updateUserForm.value.timezone,
        deactiveDays : this.updateUserForm.value.deactiveDays,
        healthalerts : this.isChecked,
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
  getServerData(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
        this.getList();
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
    setPage(pageInfo) {
        this.page1.pageNumber = pageInfo;
        this.getList();
    }
  getInvetedMembers(){
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getInvetedMembers(encryptedRequest).subscribe(
            (data: any) => {
              console.log(data.data);
              this.invitedList = data.data;
              this.invitedList.forEach((value)=>{
                value.region = this.locationList[value.region].name;
                value.department = this.specializationList[value.department].name;
              });
        });
  }
  
  getUserDetails(){
      var sendData = {
      }
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getUserDetails(encryptedRequest).subscribe(
            (data: any) => {
              console.log(data.data);
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
              this.updateUserForm.controls['useremail'].disable();
              this.updateUserForm.controls['usernumber'].disable();
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
              this.isChecked = (data.data[0].healthalerts==null?'':Number(data.data[0].healthalerts));
              console.log(data.data[0].department);
        });
  }
    getList() {
        //this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getStaffList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                console.log(this.encryptedResponse.data);
                this.encryptedResponse.data.forEach((value)=>{
                  value.region = this.locationList[value.region].name;
                  value.department = this.specializationList[value.department].name;
                  /*if(value.role_id==2){
                    value.role_id = 'Finance';
                  }else if(value.role_id==3){
                    value.role_id = 'Doctor';
                  }else if(value.role_id==4){
                    value.role_id = 'Finance';
                  }else if(value.role_id==5){
                    value.role_id = 'Care Team Staff';
                  }*/
                });
                this.list = this.encryptedResponse.data;
                this.serverResponse.next(this.list);
                //this.response = this.encryptedResponse.data.patientDetails;
                /*console.log(data.total);
                console.log('aaaaaaaaaaa');*/
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
  tabVal : number = 1;
  DefaultTab : string = 'MyProfile'
  changeTab(tab) {
    this.tabVal = tab;
  }
  openChangePassword() {
      let dialogRef = this.elements.open(this.changepasswordDialog, {
          width: '380px',
      });
  }
  openInviteMember(){
    let dialogRef = this.elements.open(this.inviteMemberDialog, {
          width: '725px',
      });
  }
  cancelPopup(){
    this.elements.closeAll();
    this.firstForm.reset();
    this.passwordForm.reset();
    return  false;
  }
  isChecked: any = 0;
  checkValue(event: any){
   this.isChecked = Number(event);
}
  providerIdCheck : boolean = true;
  adminchecked : boolean = true;
  doctorchecked : boolean = false;
  financechecked : boolean = false;
  staffchecked : boolean = false;
  selectValue : number = 2;
  doctorId = false;
  ckeckError = '';
  //checkboxValue : boolean = true;
  filterChange(value){
    /*console.log(this.adminchecked);
    console.log(this.doctorchecked);
    console.log(this.financechecked);
    console.log(this.staffchecked);*/
    if(this.adminchecked == false && this.doctorchecked == false && this.financechecked == false && this.staffchecked == false) {
      this.ckeckError='error';
    }else{
      this.ckeckError='';
    }
    if (value == 'admin') {
        this.adminchecked = true;
        this.doctorchecked = false;
        this.financechecked = false;
        this.staffchecked = false;
        this.selectValue = 2;
        this.doctorId = false;
    } else if(value == 'doctor'){
        this.doctorchecked = true;
        this.adminchecked = false;
        this.financechecked = false;
        this.staffchecked = false;
        this.selectValue = 3;
        this.doctorId = true;
    } else if(value == 'finance'){
        this.financechecked = true;
        this.adminchecked = false;
        this.doctorchecked = false;
        this.staffchecked = false;
        this.selectValue = 4;
        this.doctorId = false;
    } else if(value == 'staff'){
      this.staffchecked = true;
        this.adminchecked = false;
        this.doctorchecked = false;
        this.financechecked = false;
        this.selectValue = 5;
        this.doctorId = false;
    }
    if(this.doctorId==true){
      this.firstForm
          .get('providerid')
          .setValidators([Validators.required]);
      this.firstForm.get('providerid').updateValueAndValidity();
    }else{
        this.firstForm.get('providerid').clearValidators();
            this.firstForm.get('providerid').updateValueAndValidity();   
    }
  }
  modelmemberName : string;
  modelmemberEmail : string;
  removeSpace(event, modelName) {
        if (modelName == 'modelmemberName') {
            this.modelmemberName = event.trim();
        }
        if (modelName == 'modelmemberEmail') {
            this.modelmemberEmail = event.trim();
        }
    }
  reInviteDelete(data,item){
    var sendData = {
        data : data,
        item : item,
      }
    if(data=='delete'){
      this.alertPopup.title = "Remove user";
      this.alertPopup.message = "Are you sure want to remove the invited user?";
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
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'confirmed') {
          this.reInviteDeletecallFunction(sendData);
        } else if (result == 'cancelled') {
          console.log('cancelled');
        }
      });
    }else{
      this.reInviteDeletecallFunction(sendData);
    }
    return false;
    
    
  }
  reInviteDeletecallFunction(sendData){
    this.spinner.show();   
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
      this.service.reInviteDelete(encryptedRequest).subscribe(
          (data: any) => {
          this.Message = data.msg;
          this.MessageClass = 'success';
          setTimeout(() => {
            this.Message = '';            
          }, 4000);
          this.getInvetedMembers();
         this.spinner.hide(); 
      });
  }
  searchprofile(value){
    if (value.length >= 3 || value.length == 0) {
      this.requestParam.filter = value;
      this.getList();
    }  
  }
  tab1: string = 'active';
  tab2: string ='';
  tab3: string = '';
  roleBlock1 : string = 'show';
  roleBlock2 : string = 'hide';
  roleBlock3 : string = 'hide';
  currentRoleId : number = 3;
  toggleEvent(currentRoleId,event){
    this.currentRoleId = currentRoleId;
    this.tab1 = (event=='tab1'?'active':'');
    this.roleBlock1 = (event=='tab1'?'show':'hide');
    this.tab2 = (event=='tab2'?'active':'');
    this.roleBlock2 = (event=='tab2'?'show':'hide');
    this.tab3 = (event=='tab3'?'active':'');
    this.roleBlock3 = (event=='tab3'?'show':'hide');
    //this.getCheckList();
  }
  getCheckList(){
    this.spinner.show();
    var sendData = {
        role_id : this.currentRoleId,
      }
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
    this.service.getCheckList(encryptedRequest).subscribe(
          (data: any) => {
            if(data.list.length>0){
              var getList = data.list[0].check_list;
              const obj = JSON.parse(getList);
              /*obj.forEach(function (argument) {
                this.doctorcheckedList
                console.log(argument.id);
              })*/
              for (let i = 0; i < obj.length; i++) {
                this.doctorcheckedList[i].value = obj[i].value;
              }
            }else{
              this.doctorcheckedList = [{"id":1,"label":"Patient List","value":false},
                  {"id":2,"label":"To-Do","value":false},
                  {"id":3,"label":"Alerts","value":false},
                  {"id":4,"label":"Billing","value":false},
                  {"id":5,"label":"Reports","value":false}];
                console.log(this.doctorcheckedList);
            }
            setTimeout(() => {
                this.spinner.hide();
            }, 200);   
      },(error: any) => {
            setTimeout(() => {
                this.spinner.hide();
            }, 200);
        });
  }
  ChangeRole() {
    this.spinner.show();
    var sendData = {
        role_id : this.currentRoleId,
        checkList : JSON.stringify(this.doctorcheckedList)
      }
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
    this.service.updateCheckList(encryptedRequest).subscribe(
          (data: any) => {
          this.spinner.hide();
          this.Message = data.msg;
          this.MessageClass = 'success';
          setTimeout(() => {
            this.Message = '';            
          }, 4000);
          this.getInvetedMembers();
          
      });
  }
}

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