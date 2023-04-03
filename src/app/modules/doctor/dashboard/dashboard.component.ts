import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DoctorService } from 'app/modules/doctor.service';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { successResponseData } from 'app/core/response-schema';
import { DatePipe } from '@angular/common';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexAxisChartSeries,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexGrid,
    ApexStroke,
    ApexMarkers,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill,
} from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export type ChartOptionsline = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../admin/example/dashboard.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('addToDoList') addToDoList: TemplateRef<any>;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public ChartOptionsline: Partial<ChartOptionsline>;
  public ChartOptionsbar: Partial<ChartOptionsBar>;
  toDoForm: FormGroup;
    roleId: number;
	roles = [
			   {id: 2, name: 'Doctor Admin'},
			   {id: 3, name: 'Doctor'},
			   {id: 4, name: 'Finance'},
			   {id: 5, name: 'Staff'},
			];
      requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        blood_pressure: number;
        pulse: number;
        userstatus: string;
        search: string;
        order: { direction: string; active: string };
        startDate : string;
        endDate : string;
        selectCity : string;
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: 5,
        pulse: 5,
        userstatus: '1',
        search: '',
        order: { direction: '', active: '' },
        startDate : '',
        endDate : '',
        selectCity : '',
    };
    alertCount: number = 0;
    todoCount: number = 0;
    thresoldCount : any;
    ActiveInactiveCount = [];
    selectCity = '';
    startDate = '';
    endDate = '';
    patients = [];
    firstday : string = '';
    lastday : string = '';
    todayDate: Date | null;
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    item_type: string;
    due_date: string;
    description: string;
    patient: string;
    todoUuid: string;
    Message: string = '';
    MessageClass: string = '';
    itemTypes = [
        'Appointment reminder',
        'Billing reminder',
        'Patient vitals review',
        'Patient lab results review',
    ];
    link_to_patient = true;
    showPatient = true;
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    patientList: any[] = [];
  constructor(private encrypt: EncryptDecryptService,
  	private router: Router,private service: DoctorService,
    private elements: MatDialog,private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,) { 
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
  }
  userExists(id) {
	  return this.roles.some(function(el) {
	    return el.id === id;
	  }); 
	}
  ngOnInit(): void {
    this.toDoForm = this._formBuilder.group({
            item_type: ['', Validators.required],
            due_date: ['', Validators.required],
            description: ['', Validators.required],
            link_to_patient: [''],
            patient: [''],
        });
    this.todayDate = new Date();
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    this.firstday = moment(new Date(curr.setDate(first)).toUTCString()).format('YYYY/MM/DD');
    this.lastday = moment(new Date(curr.setDate(last)).toUTCString()).format('YYYY/MM/DD');

    var date = new Date();
        this.range = new FormGroup({
            start: new FormControl(
                new Date(date.getFullYear(), date.getMonth(), 1)
            ),
            end: new FormControl(new Date()),
        });

        this.startDate = moment().startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(new Date()).format('YYYY-MM-DD');
        this.requestParam.startDate = this.startDate;
        this.requestParam.endDate = this.endDate;
    this.getNotification();
    this.getTodoCount();
    this.getActiveInactiveCount();
    this.getThresholdCount();
    this.getPatientEnrolled();
    this.getDeviceUsage();
    this.getPatientList();
  }
  dateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        console.log('dateRangeStart.value', dateRangeStart.value);
        console.log('dateRangeEnd.value', dateRangeEnd.value);

        this.startDate = moment(dateRangeStart.value)
            .local()
            .format('YYYY-MM-DD');
        this.endDate = moment(dateRangeEnd.value).local().format('YYYY-MM-DD');
        this.requestParam.startDate = this.startDate;
        this.requestParam.endDate = this.endDate;
        //this.lineCharts();
        this.getActiveInactiveCount();
        this.getPatientEnrolled();
        this.getDeviceUsage();
    }
  getNotification(){
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getAlertNotification(encryptedRequest).subscribe(
        (data: any) => {
          this.alertCount = data.alertCount
        });
  }
  getTodoCount(){
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getTodoCount(encryptedRequest).subscribe(
        (data: any) => {
          this.todoCount = data.todoCount
        });

  }
  onChangeCitySelcted(value) {
        console.log('value', value);
        this.selectCity = value.value;
        this.requestParam.selectCity = value.value;
        //this.getThresholdCount();
        this.getPatientEnrolled();
        this.getDeviceUsage();
        this.getActiveInactiveCount();

  }
  getActiveInactiveCount(){
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getActiveInactiveCount(encryptedRequest).subscribe(
        (data: any) => {
          this.ActiveInactiveCount = data.ActiveInactiveCount;
          var activeLabel = this.ActiveInactiveCount[0]+' Active Patients';
          var inactiveLabel = this.ActiveInactiveCount[1]+' Inactive Patients';
          this.chartOptions = {
            series: this.ActiveInactiveCount,
            labels: ["Active Patients","Inactive Patients"],
            chart: {
              width: 370,
              type: "donut"
            },
            dataLabels: {
              enabled: false
            },
            fill: {
              type: "gradient"
            },
            legend: {
                formatter: function (val, opts) {
                    return opts.w.globals.series[opts.seriesIndex] + ' ' + val;
                },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
        });    
  }
  getPatientEnrolled(){
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getPatientEnrolled(encryptedRequest).subscribe(
        (data: any) => {
          console.log(data);
          this.ChartOptionsline = {
            series: [
              {
                name: "Desktops",
                data: data.PatientEnrolled.patientsCounts
              }
            ],
            chart: {
              height: 250,
              type: "line",
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false,
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            /*title: {
              text: "Product Trends by Month",
              align: "left"
            },*/
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5
              }
            },
            xaxis: {
              categories: data.PatientEnrolled.months
            }
          };
       });
  }
  getDeviceUsage(){
    const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getDeviceUsage(encryptedRequest).subscribe(
        (data: any) => {
          console.log(data);
          this.ChartOptionsbar = {
            series: [
              {
                name: "basic",
                data: data.DeviceUsage.readingCounts
              }
            ],
            chart: {
              type: "bar",
              height: 250,
              toolbar: {
                      show: false,
                    }
            },
            plotOptions: {
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: data.DeviceUsage.months
            }
          };
        });
  }
  onMoveNotification() {
      this.router.navigate(['/doctor/alerts/list']);
   }
  onMoveToDo(){
      this.router.navigate(['/doctor/todo/list']);
  }
  addToDo() {
        this.todayDate = new Date();
        // console.log('thos.', this.todayDate);
        this.link_to_patient = true;
        this.showPatient = true;
        this.toDoForm.controls['patient'].setValidators(Validators.required);
        this.toDoForm.updateValueAndValidity();
        this.getPatientList();

        let dialogRef = this.elements.open(this.addToDoList, {
            width: '450px',
        });
    }
    getPatientList() {
        this.requestParam.userstatus = '1';
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getActivePatientListCities(encryptedRequest).subscribe(
            (data: any) => {
                // console.log(data);
                this.encryptedResponse = data;
                this.patientList = this.encryptedResponse.data.patientDetails;
                 console.log('Patient List', this.patientList);
            },
            (error: any) => {
                // console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                // console.log(this.encryptedResponse);
            }
        );
    }
    cancelPopup() {
        this.elements.closeAll();
        this.toDoForm.reset();
        this.router.navigate(['/doctor/dashboard']);
    }
    link_to_patients(event) {
        // console.log('toggle', event.target.checked);
        // console.log('toDoForm', this.toDoForm.value);
        if (event.target.checked == true) {
            this.showPatient = true;
            this.link_to_patient = true;
            this.toDoForm.controls['patient'].setValidators(
                Validators.required
            );
            this.toDoForm.updateValueAndValidity();
        } else {
            this.toDoForm.controls['patient'].patchValue(null);

            this.showPatient = false;
            this.link_to_patient = false;
            this.toDoForm.get('patient').clearValidators();
            this.toDoForm.get('patient').updateValueAndValidity();
        }
        // this.useDefault = event.checked;
    }
  toDoAddFormSubmit() {
        if (this.toDoForm.valid) {
            this.spinner.show();
            // console.log(this.toDoForm.value.due_date);
            // console.log('valid');

            var datePipe = new DatePipe('en-US');
            var datevalue = datePipe.transform(
                this.toDoForm.value.due_date,
                'yyyy-MM-dd'
            );

            var sendData = {
                data: this.toDoForm.value,
                due_date_value: datevalue,
            };
            // console.log('sendData', sendData);
            const encryptedRequest = this.encrypt.encryptData(
                JSON.stringify(sendData)
            );
            //console.log(encryptedRequest);
            this.service.addToDO(encryptedRequest).subscribe(
                (data: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    //console.log(data);

                    // this.requestParam.status = '-1';
                    this.getTodoCount();
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                    this.elements.closeAll();
                    this.toDoForm.reset();
                    setTimeout(() => {
                        this.Message = '';
                    }, 2000);
                    this.router.navigate(['/doctor/todo/list']);
                },
                (error: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    //console.log(error);
                }
            );
        }
    }
    getThresholdCount(){
      const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
    this.service.getThresholdCount(encryptedRequest).subscribe(
        (data: any) => {
          this.thresoldCount = data.thresoldCount;
        });
    }  
}
