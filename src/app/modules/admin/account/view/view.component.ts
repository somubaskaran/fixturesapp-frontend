import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {  ActivatedRoute,Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { AdminService } from '../../admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { successResponseData } from 'app/core/response-schema';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  roleId: number;
  roles = [
         {id: 1, name: 'Super Admin'},
         {id: 6, name: 'Admin'},
      ];
	serverResponse = new BehaviorSubject<any[]>([]);
	serverResponsePatient = new BehaviorSubject<any[]>([]);
  constructor(
  	private router: Router,
  	private route: ActivatedRoute,
  	private encrypt: EncryptDecryptService,
  	private service: AdminService,
  	private spinner: NgxSpinnerService,
  	) { 
  this.page1.pageNumber = this.requestParam.current;
    this.page1.size = this.requestParam.pasgesize;
    this.pagepatient.pageNumber = this.requestParamPatient.current;
    this.pagepatient.size = this.requestParamPatient.pasgesize;
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
@ViewChild('divToScroll') divToScroll: ElementRef;
  encryptedResponse: successResponseData;
  errorResponse: successResponseData;
  encryptedResponsepatient: successResponseData;
  errorResponsepatient: successResponseData;
  userUuid : string;
  userGrouby : string;
  userDetails : any;
  list: any[] = [];
  specializationList: any[] = [{"id":0,"name":"Cardiology"}];
  locationList : any[] = [{"id":0,"name":"Orlando"}];
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
    total: number = 0;
    page1 = new patientListPageData();
    pagepatient = new patientListPageData();
    requestParamPatient: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        blood_pressure: string;
        pulse: string;
        order: { direction: string; active: string };
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: '',
        pulse: '',
        order: { direction: '', active: '' },
    };
    unitspatient: any;
  listpatient: any[] = [];
  totalpatient: number = 0;
  activepatient: number = 0;
  systemTotalpatient: number = 0;
  inactivepatient: number = 0;
  patientsorting: any;
  ngOnInit(): void {
  	this.getUserDetails();
  }

  onBackPatient(){
    this.router.navigate(['/admin/organization/list']);
  }
  getUserDetails(){
    this.route.queryParams.subscribe(params => {
      this.userUuid = params['userUuid'];
      var sendData = {
        userUuid : this.userUuid,
      }
	      const encryptedRequest = this.encrypt.encryptData(
	            JSON.stringify(sendData)
	        );
	      	this.service.getUserDetails(encryptedRequest).subscribe(
            	(data: any) => {
            		this.userDetails = data.data[0];
            		this.userGrouby = data.data[0].group_by;
            		this.userDetails.department = this.specializationList[this.userDetails.department].name;
            		this.userDetails.region = this.locationList[this.userDetails.region].name;
                this.userDetails.mobile_number = (this.userDetails.mobile_number==null?'-':this.userDetails.mobile_number);
            		this.getStaffList();
            		this.getPatientList();
            	});
      
   		}); 
	}
	tabVal : number = 1;
	DefaultTab : string = 'MyProfile';
	changeTab(tab) {
	    this.tabVal = tab;
	}	
	getStaffList() {
        //this.spinner.show();
        var sendData = {
        	data : this.requestParam,
        	userGroupby : this.userGrouby,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getStaffList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
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
            }
        );
    }
    searchprofile(value){
      if (value.length >= 3 || value.length == 0) {
        this.requestParam.filter = value;
        this.getStaffList();
      }
  }
  onSortPatient(event) {
        const sort = event.sorts[0];
        console.log('Sort Event', sort);
        this.patientsorting = sort;
        this.requestParamPatient.order.active = sort.prop;
        this.requestParamPatient.order.direction = sort.dir;
        this.page1.pageNumber = 0;
        this.getPatientList();
    }
  getPatientList(){
  	//this.spinner.show();
  	var sendData = {
        	data : this.requestParamPatient,
        	userGroupby : this.userGrouby,
        }
    const encryptedRequest = this.encrypt.encryptData(JSON.stringify(sendData));
    this.service.getUserPatientList(encryptedRequest).subscribe((data: any) => {
      /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
      this.encryptedResponsepatient = data;
      this.list = this.encryptedResponsepatient.data.patientDetails;
      this.serverResponsePatient.next(this.list);
      //this.response = this.encryptedResponse.data.patientDetails;
      //this.unitspatient = this.encryptedResponse.data.units;
      console.log(data.data.active);
      this.totalpatient = data.data.total;
      this.systemTotalpatient = data.data.systemTotalvalue;
      this.activepatient = data.data.active;
      this.inactivepatient = data.data.inactive;
      this.pagepatient.totalElements = this.total;
      this.pagepatient.totalPages = this.pagepatient.totalElements / this.pagepatient.size;
      console.log(this.list);
      console.log('somu');
      this.list.forEach((value) => {
        /*if (value.city == '') {
          value.city = '-';
        }*/
        value.totalTime = (value.totalTime==null?0:value.totalTime);
      });
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
  	this.requestParamPatient.current = 0;
  	if (type == 'status') {
      if (value == 'active') {
        this.requestParamPatient.status = "1";
      } else if (value == 'inactive') {
        this.requestParamPatient.status = "0";
      } else {
        this.requestParamPatient.status = ""
      }
      this.getPatientList();
    }else if (type == 'search') {
      if (value.length >= 3 || value.length == 0) {
        this.requestParamPatient.filter = value;
        this.getPatientList();
      }  
    } 
  }
  getServerDataPatient(event?: PageEvent) {
  	
  	//this.divToScroll.nativeElement.scrollTop = 0;
    this.requestParamPatient.current = event.pageIndex;
    this.requestParamPatient.pasgesize = event.pageSize;
    this.getPatientList();
  }
  doctorDetailsExport(puuid) {
        this.spinner.show();
        var sendData = {
            userUuid: this.userUuid,
        };
        console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.doctorDetailsExport(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                // console.log('data', data);
                this.downLoadDoctorsPdfile(data);
                /*this.MessageClass = 'success';
                this.Message = 'Records Downloaded Successfully';
                setTimeout(() => {
                    this.Message = '';
                }, 2000);*/
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                // this.errorResponse = this.encrypt.decryptData(error.error.data);
                // this.encryptedResponse = error.error.data;
            }
        );
    }
    downLoadDoctorsPdfile(data: any) {
        var blob = new Blob([data], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download =
            'Doctors-Details-' +
            moment.utc().local().format('MMM-DD-YYYY-H-mm-ss') +
            '.pdf';
        // document.body.setAttribute('style', 'text-align:center');
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
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