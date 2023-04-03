import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { AdminService } from '../../admin.service';
import { DoctorService } from 'app/modules/doctor.service';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
import * as XLSX from 'xlsx';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-kitting-list',
  templateUrl: './kitting-list.component.html',
  styleUrls: ['./kitting-list.component.scss']
})
export class KittingListComponent implements OnInit {
  roleId: number;
  roles = [
         {id: 1, name: 'Super Admin'},
         {id: 6, name: 'Admin'},
      ];
 @ViewChild('search', { static: false }) search: ElementRef;
  addClass: string = 'list';
  encryptedResponse: successResponseData;
  errorResponse: successResponseData;
  serverResponse = new BehaviorSubject<any[]>([]);
  response = this.serverResponse.asObservable();

  units: any;
  list: any[] = [];
  total: number = 0;
  active: number = 0;
  selected = 'desc';
  EditHubNumber = '';
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
  systemTotal: number = 0;
  sorting: any;
  inactive: number = 0;
  patientDetails
  page = {
    limit: 5,
    count: 0,
    offset: 0,
    orderBy: 'myColumn1',
    orderDir: 'desc'
  };
  show_check = false;
  page1 = new patientListPageData();
  selectedStatus : string = '0';
  columns = [{ prop: 'first_name' }, { name: 'Gender' }, { name: 'Company' }];
  requestParam: {
    'current': number,
    'pasgesize': number,
    'filter': string,
    'status': string,
    "type": string,
    "blood_pressure": string,
    "pulse": string,
    "order": { "direction": string, "active": string }
  } = { "current": 0, "pasgesize": 10, "filter": "", "status": "", "type": "desc", 'blood_pressure': '', 'pulse': '', "order": { "direction": "", "active": "" } };
  kittingError : string = ''
  @ViewChild("firstFormDialog") firstFormDialog: TemplateRef<any>;
  kittingForm: FormGroup;
  constructor(private service: AdminService, private docService: DoctorService,private encrypt: EncryptDecryptService, 	  private _fuseConfirmationService: FuseConfirmationService,
  		private elements: MatDialog,private _formBuilder: FormBuilder,private spinner: NgxSpinnerService,private router: Router) {
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
  ngOnInit(): void {
    this.setPage(this.requestParam.current);
    this.getDeviceType();
    //this.getList();
    /* this.search.nativeElement.valueChanges
    .debounceTime(1000)
    .subscribe(newValue => {this.requestParam.filter = newValue;this.setPage(this.getList)}); */

    this.kittingForm = this._formBuilder.group({
        hub_serial: ['', Validators.required],
        bt_address: ['', Validators.required],
        device_serial: ['', Validators.required],
        sensor_type: ['', Validators.required],
        device_model: ['', Validators.required],
        manufacturers: [''],
        trackinglink: ['']
    });
  }
  valueChange(newValue) {
    this.requestParam.filter = newValue;
    this.getList();
  }
  getList() {
    //this.spinner.show();
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.requestParam));
    this.docService.getKittingList(encryptedRequest).subscribe((data: any) => {
      /*setTimeout(() => {
          this.spinner.hide();
      }, 200);*/
      this.encryptedResponse = data;
      this.list = this.encryptedResponse.data.kittingDetails;
      console.log(this.list);
      this.list.forEach((value) => {
        /*if (value.status == 0) {
          value.status = 'Task Pending';
        }else if(value.status == 1){
          value.status = 'Send';
        }*/
        this.selectedStatus = value.status;
        /*value.hub = ( (value.hub==null || value.hub=='') ? 'N/A' : value.hub);
        value.bt_address = ( (value.bt_address==null || value.bt_address=='') ? 'N/A' : value.bt_address);
        value.device_model = ( (value.device_model==null || value.device_model=='') ? 'N/A' : value.device_model);
        value.tracking_id = ( (value.tracking_id==null || value.tracking_id=='') ? 'N/A' : value.tracking_id);*/
      });
      this.serverResponse.next(this.list);
      //this.response = this.encryptedResponse.data.patientDetails;
      this.units = this.encryptedResponse.data.units;
      this.total = this.encryptedResponse.data.total;
      this.systemTotal = this.encryptedResponse.data.systemTotalvalue;
      this.active = this.encryptedResponse.data.active;
      this.inactive = this.encryptedResponse.data.inactive;
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
    } else if (type == 'bp') {
      this.requestParam.blood_pressure = value;
      this.getList();
    } else if (type == 'pulse') {
      this.requestParam.pulse = value;
      this.getList();
    } else if (type == 'search') {
      if (value.length >= 3 || value.length == 0) {
        this.requestParam.filter = value;
        this.getList();
      }
    }
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
  KitpatientName : string;
  KitpatientId : string;
  KitPatientEmail : string;
  KitPatientMobile : string;
  KitPatientAddressLine1 : string;
  KitPatientAddressLine2 : string;
  KitCity : string;
  KitState : string;
  KitZip : string;
  kittingUuid : string;
  KitHub : string;
  KitBtAddress : string;
  KitDeviceModel : string;
  KitDeviceSerial : string;
  KitTrackId : string;
  KitManufacturers : string;
  device_type : number;
  device_model : number;
  disableDeviceModel : boolean = false;
  disableDeviceType : boolean = false;
  disableSerialNumber: boolean = false;
  disableBtAddress : boolean = false;
  disableHubSerialNumber : boolean = false;
  CurentStatus : number;
  patientUuid : string;
  addKitting(row) {
  	console.log(row);
    this.kittingError = '';
    this.patientUuid = row.patient_uuid;
  	this.KitpatientName = row.first_name+' '+row.last_name;
    this.KitpatientId = row.patient_id;
    this.KitPatientEmail = row.patient_email;
    this.KitPatientMobile = row.mobile_phone;
    this.KitPatientAddressLine1 = row.address_line_1;
    this.KitPatientAddressLine2 = row.address_line_2;
    this.KitCity = row.city;
    this.KitState = row.state;
    this.KitZip = row.zip;
    this.kittingUuid = row.kittingUuid;
    this.KitHub = (row.hub=='N/A' ? '' : row.hub );
    this.KitBtAddress = (row.bt_address=='N/A' ? '' : row.bt_address );
    this.KitDeviceModel = (row.device_model=='N/A' ? '' : row.device_model );
    this.KitDeviceSerial = (row.device_serial=='N/A' ? '' : row.device_serial );
    this.device_type =(row.device_type== null ? null:  Number(row.device_type) );
    this.ChangedeviceType(row.device_type);
    this.device_model =(row.device_model== null ? null:  Number(row.device_model) );
    this.KitTrackId = (row.tracking_id== 'N/A' ? '':  row.tracking_id );
    this.KitManufacturers = (row.manufacturers== 'N/A' ? '':  row.manufacturers );
    console.log(this.device_type);
    this.CurentStatus = row.status;
    if(row.status>1){
      this.show_check = false;
      this.disableDeviceModel = true;
      this.disableDeviceType = true;
      this.kittingForm.controls['hub_serial'].disable();
      this.kittingForm.controls['bt_address'].disable();
      this.kittingForm.controls['device_serial'].disable();
      this.kittingForm.controls['manufacturers'].disable();
    }else{
      this.disableDeviceModel = false;
      this.disableDeviceType = false;
      this.kittingForm.controls['hub_serial'].enable();
      this.kittingForm.controls['bt_address'].enable();
      this.kittingForm.controls['device_serial'].enable();
      this.kittingForm.controls['manufacturers'].enable();
      if(row.exclude_hub==1){
        this.kittingForm.controls['hub_serial'].disable();
        this.show_check = true;
      }else{
         this.kittingForm.controls['hub_serial'].enable();
        this.show_check = false;
      }
    }
  	let dialogRef = this.elements.open(this.firstFormDialog);
  }
  sendData : any;
  deviceModelText : string = '';
  kittingFormSubmit(){
    if (this.kittingForm.valid) {
      this.spinner.show();
      if(this.CurentStatus>1){
        this.sendData = {
          "patientUuid": this.patientUuid,
          "kittingUuid": this.kittingUuid,
          "hub_serial": this.KitHub,
          "bt_address": this.KitBtAddress,
          "device_serial": this.KitDeviceSerial,
          "sensor_type": this.kittingForm.value.sensor_type,
          "device_model": this.kittingForm.value.device_model,
          "manufacturers": this.kittingForm.value.manufacturers,
          "trackinglink": this.kittingForm.value.trackinglink,
        };
      }else{
        this.sendData = {
          "patientUuid": this.patientUuid,
          "kittingUuid": this.kittingUuid,
          "hub_serial": this.kittingForm.value.hub_serial,
          "bt_address": this.kittingForm.value.bt_address,
          "device_serial": this.kittingForm.value.device_serial,
          "sensor_type": this.kittingForm.value.sensor_type,
          "device_model": this.kittingForm.value.device_model,
          "manufacturers": this.kittingForm.value.manufacturers,
          "trackinglink": this.kittingForm.value.trackinglink,
        };
      }
      const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.sendData));
      if(this.CurentStatus<2){
        /*var ApiDeviceData = [
          {
              "btAddress": "666666666545",
              "deviceModel": "TS28B",
              "deviceParameters": [
                  {
                      "parameter": "unit",
                      "value": "dFahr"
                  }
              ],
              "deviceSerialNumber": "34144471"
          }
      ]*/
      
      this.deviceModels.forEach((value: any) => {
          if (value.id == this.kittingForm.value.device_model) {
            this.deviceModelText = value.model_name;
          }
        });
      var ApiDeviceData = [
          {
              "btAddress": this.kittingForm.value.bt_address,
              "deviceModel": this.deviceModelText,
              "deviceSerialNumber": this.kittingForm.value.device_serial,
          }
      ]
      /*this.docService.ApiAddDevice(ApiDeviceData).subscribe((data: any) => {
        if(data['created']){*/
            var ApiKittingData = {
              "hub": this.kittingForm.value.hub_serial,
              "devices" : [
                this.kittingForm.value.bt_address,
              ]
            }
          this.docService.ApiAddKitting(ApiKittingData).subscribe((data: any) => {
            this.spinner.hide();
            if(data['addedToHub']){
              this.docService.addKitting(encryptedRequest).subscribe((data: any) => {
                this.elements.closeAll();
                this.getList();

              },
              (error: any) => {
                this.spinner.hide();
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
              });
            }else{
              this.spinner.hide();
              console.log('Not addedToHub successfully');    
              this.kittingError = 'Not added to Hub successfully';
            }
          });
        /*}else{
          this.spinner.hide();
          console.log('Device Not Created successfully');
          this.kittingError = 'Device Not Created Successfully Kindly check the Hub and Device Details.';
        }
      });*/
     }else{
           this.spinner.hide();
           this.docService.addKitting(encryptedRequest).subscribe((data: any) => {
            this.elements.closeAll();
            this.getList();

          },
          (error: any) => {
            console.log(error);
            this.errorResponse = this.encrypt.decryptData(error.error.data);
          });
        }
     }
  }
  cancelPopup(){
  	this.elements.closeAll();
    this.kittingForm.reset();
  }
  deleteKitting(row){
    this.alertPopup.title = "Remove Device";
    this.alertPopup.message = "Are you sure want to remove the device?"; 
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
      console.log(result);
      if (result == 'confirmed') {
        var btAddress = row.bt_address;
        this.docService.ApideleteDevice(btAddress).subscribe((data: any) => {
            console.log(data);
            if(data['success']){
              var sendData = {
                  "kittingUuid" : row.kittingUuid,
                }
              const encryptedRequest = this.encrypt.encryptData(JSON.stringify(sendData));
              this.docService.RemoveKiting(encryptedRequest).subscribe((data: any) => {
                  console.log(data['data']);
                  this.getList();
                },
                (error: any) => {
                  console.log(error);
                  this.errorResponse = this.encrypt.decryptData(error.error.data);
                });  
            }
          },
          (error: any) => {
            console.log(error);
          });
        console.log('confirm');
      } else if (result == 'cancelled') {
        console.log('canceled');
      }

    });
    
  }
  deviceTypes : any;
  getDeviceType(){
      this.docService.getDeviceType().subscribe((data: any) => {
        this.deviceTypes = data['data'];
        console.log(this.deviceTypes);
      },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
      });
  }
  deviceModels : any;
  ChangedeviceType(value){
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(value));
    this.docService.getDeviceModel(encryptedRequest).subscribe((data: any) => {
        this.deviceModels = data['data'];
        console.log(this.deviceModels);
      },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
      });
  }
  ChangedeviceModel(value){
    console.log(value.value);
  }
  UpdateKitingStatus(value,row){
    var kittingUuid = row.kittingUuid;
    var patient_uuid = row.patient_uuid;
    var data = {
      "status": value,
      "kittingUuid" : kittingUuid,
      "patient_uuid" : patient_uuid
    }
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(data));
    this.docService.UpdateKitingStatus(encryptedRequest).subscribe((data: any) => {
        //this.deviceModels = data['data'];
        console.log(data['data']);
      },
      (error: any) => {
        console.log(error);
        alert('Cannot change the status to Processed without kitting');
        this.setPage(this.requestParam.current);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
      });
  }
  changeEditHubNumber(event){
    console.log(event.checked);
    if(event.checked==true){
      this.kittingForm.controls['hub_serial'].enable();
    }else{
      this.kittingForm.controls['hub_serial'].disable();
    }
  }
  /*changeStatus(row) {
    console.log(row);
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
      'status': 0,
      'role_id': role
    };

    if (row.status == 1) {
      changeStatusRequest.status = 0;
    } else {
      changeStatusRequest.status = 1;
    } 
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(changeStatusRequest));
        this.service.changeStatus(encryptedRequest).subscribe((data: any) => {
          console.log(data);
          this.getList();
        }, (error: any) => {
          console.log(error);
        });
      } else if (result == 'cancelled') {
        console.log(this.list);
        this.list.forEach((value: any) => {
          if (value.uuid === row.uuid) {
            console.log(row.status);
            console.log(value.status);
            value.status = row.status;
          }
        });
        this.serverResponse.next(this.list);
      }

    });
  }*/

  /*exporttocsv(){
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.requestParam));
    this.service.fileExport(encryptedRequest).subscribe((data: any) => {
      this.downLoadFile(data);
    },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.encryptedResponse = error.error.data;
      });
  }*/
  /*recordsexporttocsv(){
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.requestParam));
    this.service.recordsfileExport(encryptedRequest).pipe(first()).subscribe((data: any) => {
      console.log(data);
      return false;
      this.downLoadFile(data);
    },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.encryptedResponse = error.error.data;
      });
  }*/
  /*downLoadFile(data: any) {
     var blob = new Blob([data], { type: 'text/csv' });
     var url = window.URL.createObjectURL(blob);
     // create <a> tag dinamically
     var fileLink = document.createElement('a');
     fileLink.href = url;
     // it forces the name of the downloaded file
     //var patient_id = 2222;
     fileLink.download = "Patient-List-"+moment.utc().local().format('MMM-DD-YY-LT')+'.csv';
      document.body.setAttribute("style", "text-align:center");
     document.body.appendChild(fileLink);
     fileLink.click();
     //window.open(url);
   }*/
   //downLoadFile(data: any) {
     /*this.excelService.generateExcel();*/
     
    /*const blob = new Blob([data], { type: 'application/octet-stream' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);*/
  //}

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