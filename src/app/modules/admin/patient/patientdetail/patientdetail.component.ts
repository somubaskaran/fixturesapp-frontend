import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { DoctorService } from 'app/modules/doctor.service';
import { successResponseData } from 'app/core/response-schema';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageEvent } from '@angular/material/paginator';
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
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';

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

export type ChartOptionsLine = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    tooltip: any; // ApexTooltip;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
};

export const MY_FORMATS = {
    parse: {
        dateInput: 'MMM DD,YYYY',
    },
    display: {
        dateInput: 'MMM DD,YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';

interface Food {
    value: number;
    name: string;
    disabled: boolean;
}
@Component({
    selector: 'app-patientdetail',
    templateUrl: './patientdetail.component.html',
    styleUrls: ['./patientdetail.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class PatientdetailComponent implements OnInit {
    roleId: number;
    roles = [
        { id: 1, name: 'Super Admin' },
        { id: 6, name: 'Admin' },
    ];
    firstForm: FormGroup;

    thresholdForm: FormGroup;
    @ViewChild('updatePatient') updatePatientDialog: TemplateRef<any>;
    @ViewChild('manageLogpopup') manageLog: TemplateRef<any>;
    @ViewChild('manualLogpopup') manualLogPop: TemplateRef<any>;
    // @ViewChild('secondPaginator') secondPaginator: MatPaginator;
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('paginatorTimer') paginatorTimer: MatPaginator;
    @ViewChild('paginatortoDo') paginatortoDo: MatPaginator;
    @ViewChild('messagePatient') messagePatient: TemplateRef<any>;

    @ViewChild('updateToDoList') updateToDoList: TemplateRef<any>;
    @ViewChild('addToDoList') addToDoList: TemplateRef<any>;
    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('thresholdFormDialog') thresholdFormDialog: TemplateRef<any>;
    @ViewChild('myElem') MyProp: ElementRef;
    campaignOne: FormGroup;

    public lineChartData: ChartDataSets[] = [
        { data: [], label: 'Systolic' },
        { data: [], label: 'Diastolic' },
    ];
    public lineChartLabels: Label[] = [];
    public lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
    };
    public lineChartColors: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
        },
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [];
    sendDatareadings = {
        from : '',
        to : ''
    };
    public chartOptionsLine: Partial<ChartOptionsLine>;
    chartOptionsLineEnalbe = false;
    constructor(
        private elements: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private encrypt: EncryptDecryptService,
        private service: DoctorService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private spinner: NgxSpinnerService
    ) {
        let roleEncryption = localStorage.getItem('accessModifier');
        let currentPath = localStorage.getItem('path');
        //console.log(this._router.url);
        if (roleEncryption != null) {
            this.roleId = Number(
                this.encrypt.decryptData(roleEncryption).toString()
            );
            console.log('Current role ID : ' + this.roleId);

            var value = this.userExists(this.roleId);
            if (value == false) {
                this.router.navigateByUrl(currentPath);
            }
        }
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const date = today.getUTCDate();

        this.campaignOne = new FormGroup({
            start: new FormControl(moment(new Date()).subtract(30, 'days')),
            end: new FormControl(moment(new Date())),
        });

        this.pagetodo.pageNumber = this.requestParamtodo.current;
        this.pagetodo.size = this.requestParamtodo.pasgesize;

        this.page1.pageNumber = this.requestParam.current;
        this.page1.size = this.requestParam.pasgesize;

        this.pageAlert1.pageNumber = this.requestParamAlert.current;
        this.pageAlert1.size = this.requestParamAlert.pasgesize;

        var datePipe = new DatePipe('en-US');
        // this.requestParamNotes.startDate = datePipe.transform(
        //     new Date(year, month - 1, date),
        //     'yyyy-MM-dd'
        // );
        // this.requestParamNotes.endDate = datePipe.transform(
        //     new Date(year, month, date),
        //     'yyyy-MM-dd'
        // );

        this.requestParamNotes.startDate = moment(new Date())
            .subtract(30, 'days')
            .format('YYYY-MM-DD');
        this.requestParamNotes.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );
    }
    userExists(id) {
        return this.roles.some(function (el) {
            return el.id === id;
        });
    }
    @ViewChild('search', { static: false }) search: ElementRef;
    addClass: string = 'list';

    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();
    periodicVitalList = new BehaviorSubject<any[]>([]);
    responsess = this.periodicVitalList.asObservable();
    serverResponsetodo = new BehaviorSubject<any[]>([]);
    responsetodo = this.serverResponsetodo.asObservable();

    units: any;
    list: any[] = [];
    total: number = 0;
    active: number = 0;
    selected = 'desc';
    systemTotal: number = 0;
    sorting: any;
    inactive: number = 0;
    patientDetails;
    /*page = {
        limit: 5,
        count: 0,
        offset: 0,
        orderBy: 'myColumn1',
        orderDir: 'desc',
    };*/
    page1 = new patientListPageData();

    columns = [{ prop: 'first_name' }, { name: 'Gender' }, { name: 'Company' }];
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
        month: any;
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
        month: '',
    };

    requestParamNotes: {
        favorites: string;
        startDate: string;
        endDate: string;
        patientUuid: string;
        patientsNotes: string;
    } = {
        favorites: '',
        startDate: '',
        endDate: '',
        patientUuid: '',
        patientsNotes: '1',
    };

    patientUuid: string;
    patientDetailData: any;
    patientDetailDataMt: any;
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    sendDataPDF: any;
    months = [
        {
            code: 1,
            name: 'January',
        },
        { code: 2, name: 'February' },
        {
            code: 3,
            name: 'March',
        },
        { code: 4, name: 'April' },
        { code: 5, name: 'May' },
        { code: 6, name: 'June' },
        { code: 7, name: 'July' },
        { code: 8, name: 'August' },
        { code: 9, name: 'September' },
        { code: 10, name: 'October' },
        { code: 11, name: 'November' },
        { code: 12, name: 'December' },
    ];

    first_name: string = '';
    last_name: string = '';
    Gender: string = '';
    DOB: string = '';
    Age: number;
    MRN: string;
    countryCode: number;
    MobileNumber: number;
    Status: string = '';
    City: string = '';
    stateList: string[];
    fromState: any;
    shippingAddressModel = true;
    shippState: any;
    tab: string = 'basicInfo';
    photo: File;
    created_at: string;
    updated_at: string;
    deviceType: string;
    selectGender: any = 1;
    kitorderdate: string;
    orderprocesseddate: string;
    ordershippeddate: string;
    icd: string;
    tomorrow = new Date();
    preferredLanguageList = [
        { name: 'English', checked: false, value: 0 },
        { name: 'Spanish', checked: true, value: 1 },
    ];
    tyears: any = [];
    monthSelected: any;
    monthSelectedMonthly: any;
    yearSelected: any;
    displayedColumns: string[] = [
        'date',
        'start_time',
        'end_time',
        'total_time',
        'reason',
        'notes',
        'action',
    ];
    displayedColumnsPV: string[] = [
        'Period',
        'Avg Sys(mmHg)/Avg Dia(mmHg)',
        'Highest Lowest Sys(mmHg)',
        'Highest Lowest Dia(mmHg)',
        '# of Readings',
        /*'Avg of Pulse(bpm)',*/
    ];
    // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    // dataSource: any;
    dataSource1 = new MatTableDataSource<any>();

    timeDiff: string;
    totalTimeRecored: string = '00:00:00';
    dateSelected: Date | null;
    todayDate: Date | null;

    alertPopup: FuseConfirmationConfig = {
        title: '',
        message: '',
        icon: {
            color: 'warn',
            name: '',
            show: false,
        },
        actions: {
            cancel: {
                show: false,
                label: '',
            },
            confirm: {
                color: 'warn',
                label: '',
                show: false,
            },
        },
        dismissible: false,
    };

    Message: string = '';
    MessageClass: string = '';
    manualLogForm: FormGroup;
    hr = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    min = [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50',
        '51',
        '52',
        '53',
        '54',
        '55',
        '56',
        '57',
        '58',
        '59',
    ];
    sec = ['AM', 'PM'];
    startHour: string;
    startMin: string;
    startSec: string;
    endHour: string;
    endMin: string;
    endSec: string;
    totalTime: string;
    totalTimeGiven = false;
    firstDayOfMonth: Date | null;
    startbutton = false;
    endbutton = true;
    favorited = false;
    // currentDateAndTime: Date | null;
    datetime1: string;
    datetime2: string;
    favorited_text: string = 'Mark as favorite';
    reasons: string[] = [
        'Review patient vitals',
        'Monitor new therapy efficacy',
        'Current therapy intensification',
        'New therapy initiated',
        'Attempt to re-engage patient',
    ];

    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    patientNotes: any;
    selectedItem: any;
    notesSelected: string = '';
    notesSelectedUuid: string = '';
    insertOpen = true;
    updateOpen = false;
    notes_type: string = '';
    patientsNotes = true;
    specialNotes = false;
    medicationNotes = false;
    orderNotes = false;
    vitals: string = '1';
    todo: string = '0';
    alerts: string = '0';
    notess: string = '';
    showMarkAsFav = false;
    sendtext: string = '';
    defaultTabVital: string = 'mat-button-toggle-checked';

    /* TODO */
    itemTypes = [
        'Appointment reminder',
        'Billing reminder',
        'Patient vitals review',
        'Patient lab results review',
    ];
    item_type: string;
    due_date: string;
    description: string;
    patient: string;
    todoUuid: string;
    openchecked = false;
    closechecked = false;
    allchecked = true;
    opencount: number = 0;
    closecount: number = 0;

    pagetodo = new todoListPageData();
    requestParamtodo: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        order: { direction: string; active: string };
        startDate: string;
        endDate: string;
        userstatus: string;
        search: string;
        patientUuid: string;
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        startDate: '',
        endDate: '',
        userstatus: '1',
        search: '',
        patientUuid: '',
    };
    todayDatetodo: Date;
    updatetodayDate: Date;
    mindate: Date;
    totaltodo: number = 0;

    toDoForm: FormGroup;
    listtodo: any[] = [];
    /* TODO */

    /* Manage Threshold */
    syshigh: number;
    syslow: number;
    diahigh: number;
    dialow: number;
    averagesyslow: number;
    averagesyshigh: number;
    averagediahigh: number;
    averagedialow: number;
    // twentyfourhr: number;
    // seventytwohr: number;
    isDisabled: boolean = false;
    /* Manage Threshold */
    currentCode1 = '';
    currentCode2;
    currentCodeNumber;
    empList: Array<{ name: string; value: number }> = [];

    //Alerts Start

    rangeAlert = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    // @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild('updateResolve') updateResolve: TemplateRef<any>;

    @ViewChild('searchInputAlert') searchInputAlert: ElementRef;
    @ViewChild('paginatorAlert') paginatorAlert: MatPaginator;

    serverResponseAlert = new BehaviorSubject<any[]>([]);
    responseAlert = this.serverResponseAlert.asObservable();
    alertUuid: string;
    alertlist: any[] = [];
    totalAlert: number = 0;
    alertresolveChecked = false;
    alertunresolveChecked = false;
    alertallChecked = true;
    resolvecount: number = 0;
    unresolvecount: number = 0;
    pageAlert = {
        limit: 5,
        count: 0,
        offset: 0,
        orderBy: 'myColumn1',
        orderDir: 'desc',
    };
    pageAlert1 = new alertListPageData();

    requestParamAlert: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        order: { direction: string; active: string };
        startDate: string;
        endDate: string;
        userstatus: string;
        search: string;
        sortBy: string;
        patientUuid: string;
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        startDate: '',
        endDate: '',
        userstatus: '1',
        search: '',
        sortBy: 'desc',
        patientUuid: '',
    };

    selectedRow: any;
    alertNotes: string;

    //Alerts End

    ngOnInit(): void {
        this.tomorrow.setDate(this.tomorrow.getDate());
        this.todayDate = new Date();
        var aa = this.convertHMS(0);
        var arr = aa.split(':');
        //var arr1 = arr.map(function (val) { return val ; });
        console.log(arr);
        this.firstDayOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );
        console.log('firstDayOfMonth', this.firstDayOfMonth);
        this.generateArrayOfYears();
        this.monthSelected = new Date().getMonth() + 1;
        this.monthSelectedMonthly = new Date().getMonth() + 1;
        this.yearSelected = new Date().getFullYear();
        this.MonthList.forEach(function (row) {
            var curMonth = new Date().getMonth() + 1;
            if (curMonth >= row.value) {
                row.disabled = false;
            } else {
                row.disabled = true;
            }
        });
        this.getStates();
        this.firstForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            email: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
            countrycode: [
                '',
                [/*Validators.required*/],
            ],
            mobileNumber: [
                '',
                [Validators.required, Validators.pattern('^[0-9]{10}$')],
            ],
            homeNumber: [
                '',
                [Validators.pattern('^[0-9]{10}$')],
            ],
            addressline1: [''/*, Validators.required*/],
            addressline2: [''/*, Validators.required*/],
            city: [''/*, Validators.required*/],
            state: [''/*, Validators.required*/],
            zip: [''/*, Validators.required*/],
            shippingAddress: [''],
            shippingaddressline1: [''],
            shippingaddressline2: [''],
            shippingcity: [''],
            shippingstate: [''],
            shippingzip: [''],
            /*kitorderdate: [''],
      orderprocesseddate: [''],
      ordershippeddate: [''],*/
            icdcode: [''],
            gender: [''],
            preferredLanguage: [''],
            sevendays: [''],
            tenreadings: [''],
        });
        this.getPatientData();
        this.setPage(this.requestParam.current);
        this.manualLogForm = this._formBuilder.group({
            //confirmManualEntry: ['', Validators.required],
            starttimehour: [{ value: '', disabled: true }, Validators.required],
            starttimemin: [{ value: '', disabled: true }, Validators.required],
            starttimesec: [{ value: '', disabled: true }, Validators.required],
            endtimehour: [{ value: '', disabled: true }, Validators.required],
            endtimemin: [{ value: '', disabled: true }, Validators.required],
            endtimesec: [{ value: '', disabled: true }, Validators.required],
            i_contacted_patient: [
                { value: '', disabled: true },
                Validators.required,
            ],
            reason: [{ value: '', disabled: true }, Validators.required],
            notes: [{ value: '', disabled: true }, Validators.required],
        });
        this.getTimeRecorded();
        // this.currentDateAndTime = new Date();
        // console.log('this.currentDateAndTime', this.currentDateAndTime);
        this.changeTab(1);

        this.getListToDo();

        this.setPagetodo(this.requestParamtodo.current);
        //this.service.apicheck().subscribe((data: any) => {});

        this.thresholdForm = this._formBuilder.group({
            //
            syshigh: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            syslow: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            diahigh: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            dialow: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            averagesyshigh: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            averagesyslow: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            averagediahigh: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            averagedialow: [
                '',
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            // twentyfourhr: [
            //     '',
            //     [Validators.required, Validators.min(0), Validators.max(999)],
            // ],
            // seventytwohr: [
            //     '',
            //     [Validators.required, Validators.min(0), Validators.max(999)],
            // ],
            sevendays: [''],
            tenreadings: [''],
        });

        this.setPageAlert(this.requestParamAlert.current);
        //this.service.apicheck().subscribe((data: any) => {});

        var date = new Date();
        this.rangeAlert = new FormGroup({
            start: new FormControl(
                new Date(date.getFullYear(), date.getMonth(), 1)
            ),
            end: new FormControl(new Date()),
        });

        this.requestParamAlert.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParamAlert.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );
        this.startTimer();

        this.changeVitals(1);
    }
    ngAfterViewInit() {
        //this.changeTab(1);
        setTimeout(() => {
            this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
            console.log('aaaa');
        }, 1000);    
    }
    generateArrayOfYears() {
        var max = new Date().getFullYear();
        var min = max - 2;
        var years = [];

        for (var i = max; i >= min; i--) {
            years.push(i);
        }
        this.tyears = years;
        // console.log('this.tyears', this.tyears);
    }
    getPatientData() {
        this.spinner.show();
        this.route.queryParams.subscribe((params) => {
            this.patientUuid = params['patientUuid'];
            /*var datas = { 
        patientUuid : this.patientUuid
      };*/
            const encryptedRequest = this.encrypt.encryptData(
                JSON.stringify(this.patientUuid)
            );
            this.service.getPatientDetail(encryptedRequest).subscribe(
                (data: any) => {
                    console.log(data);
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    this.patientDetailData = data.data[0];
                    console.log(this.patientDetailData);
                    this.first_name = this.patientDetailData.first_name;
                    this.last_name = this.patientDetailData.last_name;
                    this.Gender = this.patientDetailData.gender;
                    this.MRN = this.patientDetailData.patient_id;
                    this.DOB = moment(this.patientDetailData.date).format(
                        'MMM DD,YYYY'
                    );
                    this.Age = this.patientDetailData.age;
                    this.Status = this.patientDetailData.status;
                    this.MobileNumber = this.patientDetailData.mobile_phone;
                    this.countryCode = this.patientDetailData.country_code;
                    this.City = this.patientDetailData.city;
                    this.created_at = moment(
                        this.patientDetailData.created_at
                    ).format('MMM DD,YYYY');
                    this.updated_at = moment(
                        this.patientDetailData.updated_at
                    ).format('MMM DD,YYYY');
                    this.preferredLanguageList.forEach((value) => {
                        console.log(value.value);
                        if (value.value == this.patientDetailData.language) {
                            value.checked = true;
                        } else {
                            value.checked = false;
                        }
                    });
                    /*aa.forEach((value) => {
        console.log(value);
        return false;
      if(value.date!=null){
          value.date = value.date.format("MMM DD,YYYY");
      }
    });*/
                    /*this.firstForm.patchValue({
          firstName : 'aa',
        });*/
                    this.firstForm.controls['firstName'].setValue(
                        this.patientDetailData.first_name
                    );
                    this.firstForm.controls['lastName'].setValue(
                        this.patientDetailData.last_name
                    );
                    this.firstForm.controls['dateOfBirth'].setValue(
                        this.patientDetailData.date
                    );
                    this.firstForm.controls['email'].setValue(
                        this.patientDetailData.patient_email
                    );
                    this.firstForm.controls['mobileNumber'].setValue(
                        this.patientDetailData.mobile_phone
                    );
                    this.firstForm.controls['countrycode'].setValue(
                        this.patientDetailData.country_code
                    );
                    this.firstForm.controls['homeNumber'].setValue(
                        this.patientDetailData.home_phone
                    );
                    this.firstForm.controls['addressline1'].setValue(
                        this.patientDetailData.address_line_1
                    );
                    this.firstForm.controls['addressline2'].setValue(
                        this.patientDetailData.address_line_2
                    );
                    this.firstForm.controls['city'].setValue(
                        this.patientDetailData.city
                    );
                    this.fromState = Number(this.patientDetailData.state);
                    this.firstForm.controls['zip'].setValue(
                        this.patientDetailData.zip
                    );
                    this.selectGender = this.patientDetailData.genderValue;
                    this.firstForm.controls['shippingaddressline1'].setValue(
                        this.patientDetailData.shipping_address_line1
                    );
                    this.firstForm.controls['shippingaddressline2'].setValue(
                        this.patientDetailData.shipping_address_line2
                    );
                    this.firstForm.controls['shippingcity'].setValue(
                        this.patientDetailData.shipping_city
                    );
                    this.shippState = Number(
                        this.patientDetailData.shipping_state
                    );
                    this.firstForm.controls['shippingzip'].setValue(
                        this.patientDetailData.shipping_zip
                    );
                    this.imgURL = this.patientDetailData.patient_image;
                    this.kitorderdate =
                        this.patientDetailData.order_received_date == '' ||
                        this.patientDetailData.order_received_date == null
                            ? '-'
                            : moment
                                  .unix(
                                      this.patientDetailData.order_received_date
                                  )
                                  .format('MMM DD,YYYY');
                    this.orderprocesseddate =
                        this.patientDetailData.order_processed_date == '' ||
                        this.patientDetailData.order_processed_date == null
                            ? '-'
                            : moment
                                  .unix(
                                      this.patientDetailData
                                          .order_processed_date
                                  )
                                  .format('MMM DD,YYYY');
                    this.ordershippeddate =
                        this.patientDetailData.order_shipping_date == '' ||
                        this.patientDetailData.order_shipping_date == null
                            ? '-'
                            : moment
                                  .unix(
                                      this.patientDetailData.order_shipping_date
                                  )
                                  .format('MMM DD,YYYY');
                    this.icd =
                        this.patientDetailData.icd == null
                            ? '-'
                            : this.patientDetailData.icd;
                    if (this.imgURL) {
                        this.defaultimg = false;
                    } else {
                        this.defaultimg = true;
                    }
                    this.deviceType =
                        this.patientDetailData.device_name == 'Blood pressure'
                            ? 'Blood pressure Monitor'
                            : this.patientDetailData.device_name;
                    this.firstForm.controls['preferredLanguage'].setValue(
                        this.patientDetailData.language
                    );
                    var sevendays =
                        this.patientDetailData.sevendays == 1 ? true : false;
                    var tenreadings =
                        this.patientDetailData.tenreadings == 1 ? true : false;
                    this.firstForm.controls['sevendays'].setValue(sevendays);
                    this.firstForm.controls['tenreadings'].setValue(
                        tenreadings
                    );
                },
                (error: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(
                        error.error.data
                    );
                    this.encryptedResponse = error.error.data;
                    console.log(this.encryptedResponse);
                }
            );
        });
    }
    getStates() {
        this.service.getStates().subscribe(
            (data: any) => {
                console.log(data);
                this.stateList = data.data;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
    onUpdatePatient() {
        let dialogRef = this.elements.open(this.updatePatientDialog, {
            width: '680px',
        });
        this.tab = 'basicInfo';
    }
    onDeletePatient() {
        this.alertPopup.title = 'Remove Patient';
        this.alertPopup.message = 'Are you sure want to remove this Patient?';
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
                this.spinner.show();
                var sendData = {
                    patientUuid: this.patientUuid,
                };
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(sendData)
                );
                //console.log(encryptedRequest);
                this.service.deletePatient(encryptedRequest).subscribe(
                    (data: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        this.router.navigate(['/doctor/patient-list']);
                    },
                    (error: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        //console.log(error);
                    }
                );
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
    }
    onBackPatient() {
        this.router.navigate(['/admin/patient/list']);
    }

    onChangeMonth(event) {
        this.monthSelected = event.value;
        console.log(event.value);
        this.getTimeRecorded();
    }
    onChangeYear(event) {
        this.yearSelected = event.value;
        console.log(event.value);
        this.getTimeRecorded();
    }

    changeStartHour(event) {
        this.startHour = event.value;
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }
    changeStartMin(event) {
        this.startMin = event.value;
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }
    changeStartSec(event) {
        this.startSec = event.value;
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }

    changeEndHour(event) {
        this.endHour = event.value;
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }
    changeEndMin(event) {
        this.endMin = event.value;
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }
    changeEndSec(event) {
        this.endSec = event.value;
        console.log(event.value);
        this.totalTime = this.getTimeDiffForOnChange(
            this.startHour + ':' + this.startMin + ':' + this.startSec,
            this.endHour + ':' + this.endMin + ':' + this.endSec
        );
        console.log('this.totalTime', this.totalTime);
    }

    getTimeDiffForOnChangeForTimer(start, end) {
        const diff = moment.duration(
            moment(end, 'HH:mm:ss').diff(moment(start, 'HH:mm:ss'))
        );
        console.log('diff', diff);

        let hours = '';
        let minutes = '';
        let seconds = '';
        if (diff.hours() > 0) {
            if (diff.hours() < 10) {
                hours = '0' + diff.hours();
            } else {
                hours = diff.hours() + '';
            }
        } else {
            hours = '00';
        }
        if (diff.minutes() > 0) {
            if (diff.minutes() < 10) {
                minutes = '0' + diff.minutes();
            } else {
                minutes = diff.minutes() + '';
            }
        } else {
            minutes = '00';
        }
        if (diff.seconds() > 0) {
            if (diff.seconds() < 10) {
                seconds = '0' + diff.seconds();
            } else {
                seconds = diff.seconds() + '';
            }
        } else {
            seconds = '00';
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    getTimeDiffForOnChange(start, end) {
        const diff = moment.duration(
            moment(end, 'hh:mm:A').diff(moment(start, 'hh:mm:A'))
        );
        console.log('diff', diff);

        let hours = '';
        let minutes = '';
        let seconds = '';
        if (diff.hours() > 0) {
            if (diff.hours() < 10) {
                hours = '0' + diff.hours();
            } else {
                hours = diff.hours() + '';
            }
        } else {
            hours = '00';
        }
        if (diff.minutes() > 0) {
            if (diff.minutes() < 10) {
                minutes = '0' + diff.minutes();
            } else {
                minutes = diff.minutes() + '';
            }
        } else {
            minutes = '00';
        }
        if (diff.seconds() > 0) {
            if (diff.seconds() < 10) {
                seconds = '0' + diff.seconds();
            } else {
                seconds = diff.seconds() + '';
            }
        } else {
            seconds = '00';
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    getTimeRecorded() {
        this.spinner.show();
        var sendData = {
            patientUuid: this.patientUuid,
            month: this.monthSelected,
            year: this.yearSelected,
        };
        console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );

        this.service.getPatientRecordTime(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log('patientDetails', data.data);
                this.totalTimeRecored =
                    data.data.systemTotalvalue == null
                        ? '00:00:00'
                        : data.data.systemTotalvalue;
                this.totalTimeSpend = this.convertSeconds(
                    this.totalTimeRecored
                );
                console.log(this.totalTimeSpend);
                /*var quotient = Math.round( (this.totalTimeSpend / 2400) );
                var remainder = this.totalTimeSpend % 2400;
                console.log(quotient);
                console.log(remainder);*/
                if (this.totalTimeSpend < 1200) {
                    this.currentCode1 = '99457';
                } else if (this.totalTimeSpend < 2400) {
                    this.currentCode1 = '99457';
                    this.currentCode2 = '99458';
                } else {
                    this.currentCode1 = '99457';
                    this.currentCode2 = '99458';
                    var tmpNumber = this.totalTimeSpend - 1200;
                    console.log(tmpNumber);
                    var quotient = Math.floor(tmpNumber / 1200);
                    this.currentCodeNumber = quotient;
                    var remainder = this.totalTimeSpend % 2400;
                    //this.totalTimeSpend = remainder;
                }
                //this.billableTime = this.convertSeconds(this.totalTimeRecored);
                this.billableTime = this.totalTimeSpend;
                var defaultSeconds = 2400;
                this.totalTimeRemaining = defaultSeconds - this.totalTimeSpend;
                this.totalTimeRemaining =
                    this.totalTimeRemaining < 0 ? 0 : this.totalTimeRemaining;
                this.timespend(this.totalTimeSpend);
                this.billaletime(this.totalTimeSpend);
                this.timeremaining(this.totalTimeRemaining);
                if (this.totalTimeSpend >= 3600) {
                    this.colorFill = '#79100c';
                    this.heartValue = -80;
                }else if(this.totalTimeSpend >= 2400){
                    this.colorFill = '#a71a14';
                    this.heartValue = -80;
                }else if(this.totalTimeSpend >= 1200){
                    this.colorFill = '#d7241c';
                    this.heartValue = -80;
                }else{
                    this.heartValue = -((this.totalTimeSpend / 60)*5.4)+30;
                }
                /*if (this.totalTimeSpend >= 2400) {
                    this.startbutton = true;
                } else {
                    this.startbutton = false;
                }*/
                //this.blueColor = ( (this.totalTimeSpend/60) * 3.2);
                data.data.patientDetails.forEach((value) => {
                    // console.log('patientDetails', value);
                    const diff = this.getTimeDiff(
                        value.start_time_format,
                        value.end_time_format
                    );
                    // console.log('diff', diff);
                    if (diff === '   ' || diff === null) {
                        value.total_time = '-';
                    } else {
                        value.total_time = diff;
                    }

                    value.date = moment(Number(value.date * 1000))
                        .local()
                        .format('MMM DD, YYYY');
                    // console.log('diff', diff);
                    // // console.log(
                    // //     `${diff.hours()} Hour ${diff.minutes()} minutes ${diff.seconds()} seconds`
                    // // );
                });
                this.dataSource1.data = data.data.patientDetails;
                // this.dataSource1.paginator = this.paginatorTimer;
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
            }
        );
    }
    /*getQuotientAndRemainder(divisor, dividend) {
        var quotient = (divisor / dividend);
        var remainder = divisor % dividend;
        console.log(remainder);
    }*/
    getTimeDiff(start, end) {
        const diff = moment.duration(
            moment(end, 'HH:mm:ss a').diff(moment(start, 'HH:mm:ss a'))
        );

        let hours = '';
        let minutes = '';
        let seconds = '';
        // console.log(
        //     `${diff.hours()} Hour ${diff.minutes()} minutes ${diff.seconds()} seconds`
        // );
        if (diff.hours() > 0) {
            hours = diff.hours() + ' hours';
        }
        if (diff.minutes() > 0) {
            minutes = diff.minutes() + ' mins';
        }
        if (diff.seconds() > 0) {
            seconds = diff.seconds() + ' secs';
        }
        return hours + ' ' + minutes + ' ' + seconds + ' ';
    }
    manageTime() {
        let dialogRef = this.elements.open(this.manageLog, {
            width: '910px',
        });
        //this.getTimeRecorded();

        setTimeout(() => (this.dataSource1.paginator = this.paginatorTimer));
    }
    manualLog() {
        this.elements.closeAll();

        this.todayDate = new Date();
        this.dateSelected = new Date();

        this.manualLogForm.controls['starttimehour'].disable();
        this.manualLogForm.controls['starttimemin'].disable();
        this.manualLogForm.controls['starttimesec'].disable();
        this.manualLogForm.controls['endtimehour'].disable();
        this.manualLogForm.controls['endtimemin'].disable();
        this.manualLogForm.controls['endtimesec'].disable();
        this.manualLogForm.controls['i_contacted_patient'].disable();
        this.manualLogForm.controls['reason'].disable();
        this.manualLogForm.controls['notes'].disable();

        let dialogRef = this.elements.open(this.manualLogPop, {
            width: '640px',
        });
    }
    confirmManualTimeLog(checkboxx) {
        if (checkboxx.checked == true) {
            console.log('tttt', checkboxx.checked);
            this.manualLogForm.controls['starttimehour'].enable();
            this.manualLogForm.controls['starttimemin'].enable();
            this.manualLogForm.controls['starttimesec'].enable();
            this.manualLogForm.controls['endtimehour'].enable();
            this.manualLogForm.controls['endtimemin'].enable();
            this.manualLogForm.controls['endtimesec'].enable();
            this.manualLogForm.controls['i_contacted_patient'].enable();
            this.manualLogForm.controls['reason'].enable();
            this.manualLogForm.controls['notes'].enable();
        } else {
            this.manualLogForm.controls['starttimehour'].disable();
            this.manualLogForm.controls['starttimemin'].disable();
            this.manualLogForm.controls['starttimesec'].disable();
            this.manualLogForm.controls['endtimehour'].disable();
            this.manualLogForm.controls['endtimemin'].disable();
            this.manualLogForm.controls['endtimesec'].disable();
            this.manualLogForm.controls['i_contacted_patient'].disable();
            this.manualLogForm.controls['reason'].disable();
            this.manualLogForm.controls['notes'].disable();
        }
    }
    onManualFormSubmit() {
        if (this.manualLogForm.valid) {
            if (this.totalTime == '00:00:00') {
                this.totalTimeGiven = true;
                return;
            }
            this.totalTimeGiven = false;
            console.log('valid', this.dateSelected);
            console.log('this.manualLogForm.value', this.manualLogForm.value);
            console.log(
                'this.startHour',
                moment(
                    this.startHour +
                        ':' +
                        this.startMin +
                        ':00 ' +
                        this.startSec,
                    'hh:mm:ss A'
                ).format('HH:mm:ss')
            );
            console.log(
                'YYYY-MM-DD HH:mm:ss',
                moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            );

            this.spinner.show();
            var sendData = {
                patientUuid: this.patientUuid,
                // starttime:
                //     this.startHour + ':' + this.startMin + ':' + this.startSec,
                // endtime: this.endHour + ':' + this.endMin + ':' + this.endSec,
                starttime: moment(
                    this.startHour +
                        ':' +
                        this.startMin +
                        ':00 ' +
                        this.startSec,
                    'hh:mm:ss A'
                ).format('HH:mm:ss'),
                endtime: moment(
                    this.endHour + ':' + this.endMin + ':00 ' + this.endSec,
                    'hh:mm:ss A'
                ).format('HH:mm:ss'),
                totaltime: this.totalTime,
                date: moment(this.dateSelected).local().unix(),
                reason: this.manualLogForm.value.reason,
                notes: this.manualLogForm.value.notes,
                createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            };
            console.log('sendData', sendData);

            //const encryptedRequest = this.encrypt.encryptData(JSON.stringify(formData));
            this.service.insertManualTimeLog(sendData).subscribe(
                (data: any) => {
                    this.totalTime = '00:00:00';
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    // var successResponse = this.encrypt.decryptData(data);
                    // console.log(successResponse);
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                    this.elements.closeAll();
                    this.manualLogForm.reset();
                    let dialogRef = this.elements.open(this.manageLog, {
                        width: '910px',
                    });
                    this.getTimeRecorded();
                    setTimeout(() => {
                        this.Message = '';
                    }, 2000);
                },
                (error: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(
                        error.error.data
                    );
                }
            );
        } else {
            console.log('invalid form');
        }
    }

    deleteTimer(uuid) {
        //console.log(row);
        this.alertPopup.title = 'Remove Time Log';
        this.alertPopup.message = 'Are you sure want to remove this time log?';
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
                this.spinner.show();
                var sendData = {
                    timeLogUuid: uuid,
                };
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(sendData)
                );
                //console.log(encryptedRequest);
                this.service.deleteTimeLog(encryptedRequest).subscribe(
                    (data: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        this.getTimeRecorded();
                        this.MessageClass = 'success';
                        this.Message = data.msg;
                        setTimeout(() => {
                            this.Message = '';
                        }, 2000);
                    },
                    (error: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        //console.log(error);
                    }
                );
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
    }
    radioSelectChange(event, listName) {
        console.log(event);
        listName.forEach((value) => {
            if (value.name == event.name) {
                value.checked = true;
            } else {
                value.checked = false;
            }
        });
    }
    cancelPopup() {
        this.elements.closeAll();
        this.manualLogForm.reset();
        return false;
    }
    cancelPopupManageThreshold() {
        this.elements.closeAll();
        this.thresholdForm.reset();
        return false;
    }
    modelFirstName: string;
    modelLastName: string;
    modelMrn: string;
    modelIcd: string = 'I10';
    modelAddressLine1: string;
    modelAddressLine2: string;
    modelCity: string;
    modelZip: string;
    modelShippingAddressLine1: string;
    modelShippingAddressLine2: string;
    modelShippingCity: string;
    modelShippingZip: string;
    removeSpace(event, modelName) {
        if (modelName == 'modelFirstName') {
            this.modelFirstName = event.trim();
        }
        if (modelName == 'modelLastName') {
            this.modelLastName = event.trim();
        }
        if (modelName == 'modelMrn') {
            this.modelMrn = event.trim();
        }
        if (modelName == 'modelIcd') {
            this.modelIcd = event.trim();
        }
        if (modelName == 'modelAddressLine1') {
            this.modelAddressLine1 = event.trim();
        }
        if (modelName == 'modelAddressLine2') {
            this.modelAddressLine2 = event.trim();
        }
        if (modelName == 'modelCity') {
            this.modelCity = event.trim();
        }
        if (modelName == 'modelZip') {
            this.modelZip = event.trim();
        }
        if (modelName == 'modelShippingAddressLine1') {
            this.modelShippingAddressLine1 = event.trim();
        }
        if (modelName == 'modelShippingAddressLine2') {
            this.modelShippingAddressLine2 = event.trim();
        }
        if (modelName == 'modelShippingCity') {
            this.modelShippingCity = event.trim();
        }
        if (modelName == 'modelShippingZip') {
            this.modelShippingZip = event.trim();
        }
    }
    shippingAddressChange(event) {
        console.log(event.checked);
        this.shippingAddressModel = event.checked;
        if (event.checked == false) {
            this.firstForm
                .get('shippingaddressline1')
                .setValidators([Validators.required]);
            this.firstForm.get('shippingaddressline1').updateValueAndValidity();
            this.firstForm
                .get('shippingaddressline2')
                .setValidators([Validators.required]);
            this.firstForm.get('shippingaddressline2').updateValueAndValidity();
            this.firstForm
                .get('shippingcity')
                .setValidators([Validators.required]);
            this.firstForm.get('shippingcity').updateValueAndValidity();
            this.firstForm
                .get('shippingstate')
                .setValidators([Validators.required]);
            this.firstForm.get('shippingstate').updateValueAndValidity();
            this.firstForm
                .get('shippingzip')
                .setValidators([Validators.required]);
            this.firstForm.get('shippingzip').updateValueAndValidity();
        } else {
            this.firstForm.get('shippingaddressline1').clearValidators();
            this.firstForm.get('shippingaddressline1').updateValueAndValidity();
            this.firstForm.get('shippingaddressline2').clearValidators();
            this.firstForm.get('shippingaddressline2').updateValueAndValidity();
            this.firstForm.get('shippingcity').clearValidators();
            this.firstForm.get('shippingcity').updateValueAndValidity();
            this.firstForm.get('shippingstate').clearValidators();
            this.firstForm.get('shippingstate').updateValueAndValidity();
            this.firstForm.get('shippingzip').clearValidators();
            this.firstForm.get('shippingzip').updateValueAndValidity();
        }
    }

    onValChange(value) {
        console.log(value);
        if (value == 0) {
            this.tab = 'basicInfo';
        } else if (value == 1) {
            this.tab = 'deviceInfo';
        } else if (value == 2) {
            this.tab = 'icdcode';
        }
    }
    onfirstFormSubmit() {
        /*var sendData = {
          "patientUuid": this.patientUuid,
          "firstName": this.firstForm.value.firstName,
          "lastName": this.firstForm.value.lastName,
          "dateOfBirth": moment(this.firstForm.value.dateOfBirth).format("YYYY-MM-DD"),
          "email": this.firstForm.value.email,
          "mobileNumber": this.firstForm.value.mobileNumber,
          "homeNumber": this.firstForm.value.homeNumber,
          "addressline1": this.firstForm.value.addressline1,
          "addressline2": this.firstForm.value.addressline2,
          "city" : this.firstForm.value.city,
          "state" : this.firstForm.value.state,
          "zip" : this.firstForm.value.zip,
          "shippingAddress" : (this.firstForm.value.shippingAddress==true?'1':'0'),
          "shippingaddressline1" : this.firstForm.value.shippingaddressline1,
          "shippingaddressline2" : this.firstForm.value.shippingaddressline2,
          "shippingcity" : this.firstForm.value.shippingcity,
          "shippingstate" : this.firstForm.value.shippingstate,
          "shippingzip" : this.firstForm.value.shippingzip,
      };
      console.log(sendData);*/
        const formData = new FormData();
        if (this.firstForm.valid) {
            this.spinner.show();
            formData.append('patientUuid', this.patientUuid);
            formData.append('firstName', this.firstForm.value.firstName);
            formData.append('lastName', this.firstForm.value.lastName);
            formData.append(
                'dateOfBirth',
                moment(this.firstForm.value.dateOfBirth).format('YYYY-MM-DD')
            );
            formData.append('countryCode', this.firstForm.value.countrycode);
            formData.append('mobileNumber', this.firstForm.value.mobileNumber);
            formData.append('homeNumber', this.firstForm.value.homeNumber);
            formData.append('email', this.firstForm.value.email);
            formData.append('addressline1', this.firstForm.value.addressline1);
            formData.append('addressline2', this.firstForm.value.addressline2);
            formData.append('city', this.firstForm.value.city);
            formData.append('state', this.firstForm.value.state);
            formData.append('zip', this.firstForm.value.zip);
            formData.append(
                'shippingAddress',
                this.firstForm.value.shippingAddress == true ? '1' : '0'
            );
            formData.append(
                'shippingaddressline1',
                this.firstForm.value.shippingaddressline1
            );
            formData.append(
                'shippingaddressline2',
                this.firstForm.value.shippingaddressline2
            );
            formData.append('shippingcity', this.firstForm.value.shippingcity);
            formData.append(
                'shippingstate',
                this.firstForm.value.shippingstate
            );
            formData.append('shippingzip', this.firstForm.value.shippingzip);
            formData.append('photo', this.photo);
            /*var order_received_date = (this.firstForm.value.kitorderdate == null ? '': moment(this.firstForm.value.kitorderdate).format("YYYY-MM-DD"));
        formData.append('order_received_date',order_received_date);
        var order_processed_date = (this.firstForm.value.orderprocesseddate == null ? '': moment(this.firstForm.value.orderprocesseddate).format("YYYY-MM-DD"));
        formData.append('order_processed_date',order_processed_date);
        var order_shipping_date = (this.firstForm.value.ordershippeddate == null ? '': moment(this.firstForm.value.orderprocesseddate).format("YYYY-MM-DD"));
        formData.append('order_shipping_date',order_shipping_date);*/
            formData.append('icdcode', this.firstForm.value.icdcode);
            formData.append('gender', this.firstForm.value.gender);
            var preferredLanguage =
                this.firstForm.value.preferredLanguage == 1 ? '1' : '0';
            formData.append('preferredLanguage', preferredLanguage);
            var sevendays = this.firstForm.value.sevendays == true ? '1' : '0';
            var tenreadings =
                this.firstForm.value.tenreadings == true ? '1' : '0';
            formData.append('sevendays', sevendays);
            formData.append('tenreadings', tenreadings);
            //const encryptedRequest = this.encrypt.encryptData(JSON.stringify(formData));
            this.service.updatePatient(formData).subscribe(
                (data: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    var successResponse = this.encrypt.decryptData(data.data);
                    console.log(successResponse);
                    this.getPatientData();
                    this.elements.closeAll();
                },
                (error: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(
                        error.error.data
                    );
                    /*setTimeout(()=>{                           // <<<---using ()=> syntax
                  this.Message='Email and Mobile Number are Unique';
                  this.MessageClass = 'error';
              }, 6000);*/
                    /*this.elements.closeAll();
              let dialogRef = this.elements.open(this.firstFormDialog);
              this.backform = 0;
              this.emailError = 'Email and Mobile Number are Unique';*/
                }
            );
        }
    }
    imgURL: any;
    defaultimg: boolean = true;
    onSelect(event) {
        /*console.log(files);
    this.file = files.item(0);
    this.image_preview = this.file.name;*/
        const file = event.target.files[0];
        if (file.type == 'image/png' || file.type == 'image/jpeg') {
            this.photo = file;
        } else {
            return false;
        }
        var reader = new FileReader();
        //this.imagePath = event.target.files;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
            if (this.imgURL) {
                this.defaultimg = false;
                console.log(this.defaultimg);
            } else {
                this.defaultimg = true;
            }
        };
    }

    hourHandStyle;
    minuteHandStyle;
    secondHandStyle;

    isRunning = true;
    timerId: any;

    date: Date;
    hour: number = 0;
    minute: number = 0;
    second: number = 0;

    totalTimeSpend: number = 0;
    totalTimeRemaining: number = 0;
    billableTime: number = 0;

    TTminutes: number = 0;
    TTseconds: number = 0;

    BTminutes: number = 0;
    BTseconds: number = 0;

    TRminutes: number = 0;
    TRseconds: number = 0;

    currentDuration: number = 0;
    currentStartTime: string = '';
    currentEndTime: string = '';

    heartValue: number = 0;
    colorFill: string = '#1255A8';
    blueColor: number = 0;
    yelloColor: number = 0;
    pi: number = 3.14;
    AverageSys: string = '';
    AverageDia: string = '';

    selectedMonth: number = new Date().getMonth() + 1;

    MonthList: Food[] = [
        { name: 'January', value: 1, disabled: false },
        { name: 'February', value: 2, disabled: false },
        { name: 'March', value: 3, disabled: false },
        { name: 'April', value: 4, disabled: false },
        { name: 'May', value: 5, disabled: false },
        { name: 'June', value: 6, disabled: false },
        { name: 'July', value: 7, disabled: false },
        { name: 'August', value: 8, disabled: false },
        { name: 'September', value: 9, disabled: false },
        { name: 'October', value: 10, disabled: false },
        { name: 'November', value: 11, disabled: false },
        { name: 'December', value: 12, disabled: false },
    ];
    //aa : number = new Date().getMonth() + 1;
    getGraphReading(value) {
        this.spinner.show();
        console.log('value', value);
        var sendData = {
            patient_id: this.patientUuid,
            month: value,
        };
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getPatientReadingsGraph(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(data);
                console.log(this.lineChartData);
                this.lineChartData[0].data = data.data.systolic;
                this.lineChartData[1].data = data.data.diastolic;
                this.lineChartLabels = data.data.month;
                this.AverageSys = data.data.AverageSys;
                this.AverageDia = data.data.AverageDia;

                this.chartOptionsLineEnalbe = true;
                this.chartOptionsLine = {
                            series: [
                                {
                                    name: 'Systolic',
                                    data: data.data.systolic,
                                    /*data: [
                                        47, 57, 74, 89, 75, 38, 62, 47, 82, 56, 45,
                                        47,
                                    ],*/
                                },
                                {
                                    name: 'Diastolic',
                                    /*data: [
                                        87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45,
                                        47,
                                    ],*/
                                    data: data.data.diastolic,
                                },
                            ],
                            chart: {
                                toolbar: {
                                    show: true,
                                    offsetX: 0,
                                    offsetY: 0,
                                    tools: {
                                      download: true,
                                      selection: false,
                                      zoom: false,
                                      zoomin: false,
                                      zoomout: false,
                                      pan: false,
                                      reset: false,
                                      customIcons: []
                                    },
                                  },  
                                height: 350,
                                type: 'line',
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                width: 5,
                                curve: 'smooth',
                                dashArray: [0, 0, 0],
                            },
                            // title: {
                            //     text: 'Page Statistics',
                            //     align: 'left',
                            // },
                            legend: {
                                tooltipHoverFormatter: function (val, opts) {
                                    return (
                                        val +
                                        ' - <strong>' +
                                        opts.w.globals.series[opts.seriesIndex][
                                            opts.dataPointIndex
                                        ] +
                                        '</strong>'
                                    );
                                },
                            },
                            markers: {
                                size: 0,
                                hover: {
                                    sizeOffset: 6,
                                },
                            },
                            xaxis: {
                                labels: {
                                    trim: false,
                                },
                                /*categories: [
                                    '01 Jan',
                                    '02 Jan',
                                    '03 Jan',
                                    '04 Jan',
                                    '05 Jan',
                                    '06 Jan',
                                    '07 Jan',
                                    '08 Jan',
                                    '09 Jan',
                                    '10 Jan',
                                    '11 Jan',
                                    '12 Jan',
                                ],*/
                                categories: data.data.month,
                            },
                            tooltip: {
                                y: [
                                    {
                                        title: {
                                            formatter: function (val) {
                                                return val;
                                            },
                                        },
                                    },
                                    {
                                        title: {
                                            formatter: function (val) {
                                                return val;
                                            },
                                        },
                                    },
                                    {
                                        title: {
                                            formatter: function (val) {
                                                return val;
                                            },
                                        },
                                    },
                                ],
                            },
                            grid: {
                                borderColor: '#f1f1f1',
                            },
                        };
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }
    onChangeMonthSelcted(value) {
        console.log(value.value);
        this.getGraphReading(value.value);
    }
    animateAnalogClock() {
        /*this.hourHandStyle = {
            transform: `translate3d(-50%, 0, 0) rotate(${
                this.hour * 30 + this.minute * 0.5 + this.second * (0.5 / 60)
            }deg)`,
        };*/

        this.minuteHandStyle = {
            transform: `translate3d(-50%, 0, 0) rotate(${
                this.minute * 6 + this.second * 0.1
            }deg)`,
        };

        this.secondHandStyle = {
            transform: `translate3d(-50%, 0, 0) rotate(${this.second * 6}deg)`,
        };
    }

    getTime() {
        return setInterval(() => {
            /*this.date = new Date();
            this.hour = this.date.getHours();
            this.minute = this.date.getMinutes();
            this.second = this.date.getSeconds();*/
            //this.minute++;
            this.second++;
            if (this.second > 60) {
                this.minute++;
                this.second = 1;
            }
            /*console.log(this.hour);*/
            /*console.log(this.minute);
            console.log(this.second);*/
            this.currentDuration++;
            this.totalTimeSpend++;
            this.billableTime++;
            this.totalTimeRemaining--;
            this.animateAnalogClock();
            this.timespend(this.totalTimeSpend);
            this.billaletime(this.billableTime);
            this.timeremaining(this.totalTimeRemaining);
            if (this.totalTimeSpend >= 3600) {
                this.colorFill = '#79100c';
                this.heartValue = -80;
            }else if(this.totalTimeSpend >= 2400){
                this.colorFill = '#a71a14';
                this.heartValue = -80;
            }else if(this.totalTimeSpend >= 1200){
                this.colorFill = '#d7241c';
                this.heartValue = -80;
            }else{
                this.heartValue = -((this.totalTimeSpend / 60)*5.4)+30;
            }
            //this.yelloColor = ( (this.totalTimeSpend/60) * 3.2);
        }, 1000);
    }
    timespend(value) {
        /*var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";*/
        this.TTminutes = Math.floor((value % 3600) / 60);
        this.TTseconds = value % 60;
        //console.log('minutes:'+minutes+'------'+seconds);
    }
    billaletime(value) {
        this.BTminutes = Math.floor((value % 3600) / 60);
        this.BTseconds = value % 60;
    }
    timeremaining(value) {
        this.TRminutes = Math.floor((value % 3600) / 60);
        this.TRseconds = value % 60;
    }
    format(num: number) {
        return (num + '').length === 1 ? '0' + num : num + '';
    }

    toggle() {
        console.log(this.timerId);
        if (this.isRunning == true) {
            this.isRunning = false;
            clearInterval(this.timerId);
        } else {
            this.isRunning = true;
            this.getTime();
        }

        //this.isRunning = !this.isRunning;
    }
    startTimer() {
        /*var value = moment().unix();
        console.log(value);
        console.log(moment.unix(value).format("hh:mm:ss") );
        return  false;*/
        this.timerId = this.getTime();
        this.startbutton = false;
        this.endbutton = true;
        var value = moment().local().unix();
        this.currentStartTime = moment.unix(value).format('HH:mm:ss');
    }
    pauseTimer() {
        clearInterval(this.timerId);
        this.startbutton = true;
        this.endbutton = false;
        var value = moment().unix();
        this.currentEndTime = moment.unix(value).format('HH:mm:ss');
        var currentTotalTime = this.getTimeDiffForOnChangeForTimer(
            this.currentStartTime,
            this.currentEndTime
        );

        console.log(
            'YYYY-MM-DD HH:mm:ss',
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        );
        var sendData = {
            patientUuid: this.patientUuid,
            starttime: this.currentStartTime,
            endtime: this.currentEndTime,
            totaltime: currentTotalTime,
            date: moment().unix(),
            reason: '',
            notes: '',
            createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        };
        console.log('sendData', sendData);

        //const encryptedRequest = this.encrypt.encryptData(JSON.stringify(formData));
        this.service.insertManualTimeLog(sendData).subscribe(
            (data: any) => {
                // var successResponse = this.encrypt.decryptData(data);
                // console.log(successResponse);
                this.MessageClass = 'success';
                this.Message = data.msg;
                /*this.elements.closeAll();
                    this.manualLogForm.reset();
                    let dialogRef = this.elements.open(this.manageLog, {
                        width: '910px',
                    });*/
                this.getTimeRecorded();
                setTimeout(() => {
                    this.Message = '';
                }, 2000);
            },
            (error: any) => {
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
            }
        );
    }
    convertHMS(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        let hours: number = Math.floor(sec / 3600); // get hours
        let minutes: number = Math.floor((sec - hours * 3600) / 60); // get minutes
        let seconds: number = sec - hours * 3600 - minutes * 60; //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) {
            hours = hours;
        }
        if (minutes < 10) {
            minutes = minutes;
        }
        if (seconds < 10) {
            seconds = seconds;
        }
        return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
    }
    convertSeconds(value) {
        var a = value.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
        //console.log(seconds);
        return seconds;
    }
    getServerData(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
        this.getList(this.sendDatareadings);
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
        /*var sendData = {
                from: moment().startOf('month').local().format('YYYY-MM-DD'),
                to: moment().endOf('month').local().format('YYYY-MM-DD'),
            };
        this.getList(sendData);*/
    }
    getList(value) {
        this.spinner.show();
        this.requestParam.patient_id = this.patientUuid;
        this.requestParam.month = value;
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getPatientReadings(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log('patientReadings');
                console.log(data);
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data;
                this.list.forEach((value) => {
                    value.entry_time = moment
                        .unix(value.entry_time / 1000)
                        .format('DD/MM/YYYY, hh:mm:ss a');
                    value.created = moment
                        .unix(value.created)
                        .local()
                        .format('DD/MM/YYYY, hh:mm:ss a');
                    //moment.utc(value).local().format('MMM DD,YY LT')

                    /*if (value.status == 0) {
                        value.status = 'Task Pending';
                    } else if (value.status == 1) {
                        value.status = 'Ordered';
                    } else if (value.status == 2) {
                        value.status = 'Processed';
                    } else if (value.status == 3) {
                        value.status = 'Shipped';
                    } else if (value.status == 4) {
                        value.status = 'Delivered';
                    }*/
                });
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
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }

    getPeriodicVitalList() {
        // this.requestParam.patient_id = this.patientUuid;

        this.spinner.show();
        let dateTo = moment().format('YYYY-MM-DD');
        let dateTodisplay = moment().format('MM/DD/YYYY');
        let dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');
        let dateFromdisplay = moment().subtract(7, 'd').format('MM/DD/YYYY');
        let lastmonthdateFrom = moment()
            .subtract(1, 'months')
            .format('YYYY-MM-DD');
        let lastquarterdateFrom = moment()
            .subtract(4, 'months')
            .format('YYYY-MM-DD');
        let lastyeardateFrom = moment()
            .subtract(12, 'months')
            .format('YYYY-MM-DD');
        console.log('dateTo', dateTo);

        var sendData = {
            patientUuid: this.patientUuid,
            itration: [
                {
                    from: dateFrom,
                    to: dateTo,
                    displayName: dateFromdisplay + ' to ' + dateTodisplay,
                },
                {
                    from: lastmonthdateFrom,
                    to: dateTo,
                    displayName: 'Last 30 days',
                },
                {
                    from: lastquarterdateFrom,
                    to: dateTo,
                    displayName: 'Last Quarter',
                },
                { from: lastyeardateFrom, to: dateTo, displayName: 'YTD' },
            ],
        };
        this.sendDataPDF = sendData;
        console.log('sendData', sendData);

        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getPeriodicVitalList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(data);
                this.periodicVitalList = data.data;
                console.log('this.periodicVitalList', this.periodicVitalList);
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }
    openNotes() {
        this.insertOpen = true;
        this.datetime1 = '';
        this.datetime2 = '';
        this.showMarkAsFav = false;
        this.notesSelected = '';
        this.notesSelectedUuid = '';
        // this.selectedItem = '';
        // this.addNewNote();
        this.spinner.show();

        this.requestParamNotes.patientUuid = this.patientUuid;
        console.log('this.requestParamNotes', this.requestParamNotes);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParamNotes)
        );

        this.service.getPatientNotes(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log('patientNotes', data.data);
                // this.totalTimeRecored = data.data.systemTotalvalue;

                data.data.patientNotes.forEach((value) => {
                    //console.log('patientDetails', value.datetime * 1000);
                    value.datetime1 = moment(Number(value.datetime * 1000))
                        .local()
                        .format('MMM DD, YYYY');
                    value.datetime2 = moment(Number(value.datetime * 1000))
                        .local()
                        .format('hh:mm A');
                    console.log('value', value);
                    if (this.selectedItem === value.id) {
                        console.log('this.selectedItem', this.selectedItem);
                        console.log('value.id', value.id);
                        this.selectedItemList(value);
                    }
                });

                this.patientNotes = data.data.patientNotes;
                console.log('patientNotes', this.patientNotes);
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
            }
        );
    }
    checkFav(event) {
        // this.notesSelected = '';
        this.requestParamNotes.favorites = event.target.checked;
        // if (event.target.checked == true){
        //     this.requestParam.favorites = event.target.checked;
        // }
        //this.favorites = event.target.checked;
        console.log('favv', event.target.checked);
        this.openNotes();
    }

    dateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        console.log('dateRangeStart.value', dateRangeStart.value);
        console.log('dateRangeEnd.value', dateRangeEnd.value);

        // this.requestParamNotes.startDate = dateRangeStart.value;
        // this.requestParamNotes.endDate = dateRangeEnd.value;

        // var datePipe = new DatePipe('en-US');
        // this.requestParamNotes.startDate = datePipe.transform(
        //     dateRangeStart.value,
        //     'yyyy-MM-dd'
        // );
        // this.requestParamNotes.endDate = datePipe.transform(
        //     dateRangeEnd.value,
        //     'yyyy-MM-dd'
        // );

        this.insertOpen = false;
        this.updateOpen = false;
        this.notesSelectedUuid = '';
        this.selectedItem = '';
        this.requestParamNotes.startDate = moment(dateRangeStart.value)
            .local()
            .format('YYYY-MM-DD');
        this.requestParamNotes.endDate = moment(dateRangeEnd.value)
            .local()
            .format('YYYY-MM-DD');
        this.openNotes();

        // if (dateRangeEnd.value != '' && dateRangeEnd.value != '') {
        //     this.openNotes();
        // }

        // console.log('this.requestParamNotes', this.requestParamNotes);
    }

    resetRange(): void {
        // const today = new Date();
        // const month = today.getMonth();
        // const year = today.getFullYear();
        // const date = today.getUTCDate();
        // console.log(this.requestParamNotes);
        // this.campaignOne = new FormGroup({
        //     start: new FormControl(new Date(year, month, date - 4)),
        //     end: new FormControl(new Date(year, month, date)),
        // });

        // var datePipe = new DatePipe('en-US');
        // this.requestParamNotes.startDate = datePipe.transform(
        //     new Date(year, month, date - 4),
        //     'yyyy-MM-dd'
        // );
        // this.requestParamNotes.endDate = datePipe.transform(
        //     new Date(year, month, date),
        //     'yyyy-MM-dd'
        // );
        this.campaignOne = new FormGroup({
            start: new FormControl(moment(new Date()).subtract(4, 'days')),
            end: new FormControl(moment(new Date())),
        });
        this.requestParamNotes.startDate = moment(new Date())
            .subtract(4, 'days')
            .format('YYYY-MM-DD');
        this.requestParamNotes.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );

        this.insertOpen = false;
        this.updateOpen = false;
        this.openNotes();
        // this.addNewNote();
    }
    listClick(event, notes) {
        console.log('notes', notes);
        this.showMarkAsFav = true;
        this.selectedItem = notes.id;
        this.notesSelected = notes.notes;
        this.notesSelectedUuid = notes.uuid;
        // this.currentDateAndTime = notes.datetimeformat;
        this.datetime1 = notes.datetime1;
        this.datetime2 = notes.datetime2;
        this.insertOpen = false;
        this.updateOpen = true;
        if (notes.favorite == '1') {
            this.favorited = true;
            this.favorited_text = 'Remove favorite';
        }
        if (notes.favorite == '0') {
            this.favorited = false;
            this.favorited_text = 'Mark as favorite';
        }
        console.log('this.notes.favorite', notes.favorite);
        console.log('this.favorited', this.favorited);
    }

    selectedItemList(notes) {
        // console.log('notes notes.datetime1', notes.datetime1);
        // console.log('notes notes.datetime2', notes.datetime2);
        // return;
        this.showMarkAsFav = true;
        this.selectedItem = notes.id;
        this.notesSelected = notes.notes;
        this.notesSelectedUuid = notes.uuid;
        // this.currentDateAndTime = notes.datetimeformat;
        this.datetime1 = notes.datetime1;
        this.datetime2 = notes.datetime2;
        this.insertOpen = false;
        this.updateOpen = true;
        if (notes.favorite == '1') {
            this.favorited = true;
            this.favorited_text = 'Remove favorite';
        }
        if (notes.favorite == '0') {
            this.favorited = false;
            this.favorited_text = 'Mark as favorite';
        }
    }

    deleteNotes(uuid) {
        //console.log(row);
        this.alertPopup.title = 'Remove Notes';
        this.alertPopup.message = 'Are you sure want to remove this notes?';
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
                this.spinner.show();
                var sendData = {
                    notesUuid: uuid,
                };
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(sendData)
                );
                //console.log(encryptedRequest);
                this.service.deletePatientNotes(encryptedRequest).subscribe(
                    (data: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        this.getTimeRecorded();
                        this.MessageClass = 'success';
                        this.Message = data.msg;
                        setTimeout(() => {
                            this.Message = '';
                        }, 2000);
                        this.insertOpen = false;
                        this.updateOpen = false;
                        this.openNotes();
                        // this.addNewNote();
                    },
                    (error: any) => {
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 200);
                        //console.log(error);
                    }
                );
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
    }
    addNewNote() {
        this.insertOpen = true;
        this.updateOpen = false;
        this.showMarkAsFav = false;
        // this.currentDateAndTime = new Date();
        this.datetime1 = moment(new Date()).local().format('MMM DD, YYYY');
        this.datetime2 = moment(new Date()).local().format('hh:mm A');
        this.notesSelected = '';
        this.selectedItem = '';
        this.favorited = false;
        // this.favorited_text = 'Mark as favorite';
        this.notesSelectedUuid = '';
        console.log('datetime1', this.datetime1);
        console.log('datetime2', this.datetime2);
        console.log('notesSelected', this.notesSelected);
        console.log('notesSelected', this.notesSelectedUuid);
    }
    changeFav(event: any) {
        console.log('notesSelectedUuid', this.notesSelectedUuid);
        if (this.notesSelectedUuid == '') {
            this.MessageClass = 'error';
            this.Message = 'Please select notes to mark as favorite';
            setTimeout(() => {
                this.Message = '';
            }, 2000);
            return;
        }
        console.log('event.target.checked', event.target.checked);
        if (event.target.checked == true) {
            this.favorited = event.target.checked;
            this.alertPopup.title = 'Favorite Note';
            this.alertPopup.message =
                'Are you sure want to mark as favorite this note?';
            this.alertPopup.icon.show = true;
            this.alertPopup.icon.name = 'heroicons_outline:exclamation';
            this.alertPopup.icon.color = 'primary';
            this.alertPopup.actions.confirm.show = true;
            this.alertPopup.actions.confirm.label = 'Ok';
            this.alertPopup.actions.confirm.color = 'primary';
            this.alertPopup.actions.confirm.show = true;
            this.alertPopup.actions.cancel.show = true;
            this.alertPopup.actions.cancel.label = 'Cancel';
            this.alertPopup.dismissible = false;
            // Open the dialog and save the reference of it
            const dialogRef = this._fuseConfirmationService.open(
                this.alertPopup
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    var sendData = {
                        notesUuid: this.notesSelectedUuid,
                        favorite: '1',
                    };
                    const encryptedRequest = this.encrypt.encryptData(
                        JSON.stringify(sendData)
                    );
                    //console.log(encryptedRequest);
                    this.service.changeFav(encryptedRequest).subscribe(
                        (data: any) => {
                            this.openNotes();
                            this.MessageClass = 'success';
                            this.Message = data.msg;
                            setTimeout(() => {
                                this.Message = '';
                            }, 2000);
                            this.favorited_text = 'Remove favorite';
                        },
                        (error: any) => {
                            //console.log(error);
                        }
                    );
                    // console.log('confirm');
                } else if (result == 'cancelled') {
                    this.favorited = false;
                    // console.log('canceled');
                }
            });
        } else {
            this.alertPopup.title = 'Remove Favorite Note';
            this.alertPopup.message =
                'Are you sure want to remove favorite this note?';
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
            const dialogRef = this._fuseConfirmationService.open(
                this.alertPopup
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    var sendData = {
                        notesUuid: this.notesSelectedUuid,
                        favorite: '0',
                    };
                    const encryptedRequest = this.encrypt.encryptData(
                        JSON.stringify(sendData)
                    );
                    //console.log(encryptedRequest);
                    this.service.changeFav(encryptedRequest).subscribe(
                        (data: any) => {
                            this.openNotes();
                            this.MessageClass = 'success';
                            this.Message = data.msg;
                            this.favorited_text = 'Mark as favorite';
                            setTimeout(() => {
                                this.Message = '';
                            }, 2000);
                        },
                        (error: any) => {
                            //console.log(error);
                        }
                    );
                    // console.log('confirm');
                } else if (result == 'cancelled') {
                    // console.log('canceled');
                    this.favorited = true;
                }
            });
        }
    }
    cancelNotes() {
        this.selectedItem = '';
        this.insertOpen = false;
        this.updateOpen = false;
        this.openNotes();
        // if (this.notesSelected.trim() != '') {
        //     this.alertPopup.title = 'Cancel';
        //     this.alertPopup.message =
        //         'Are you sure want to remove the entered text?';
        //     this.alertPopup.icon.show = true;
        //     this.alertPopup.icon.name = 'heroicons_outline:exclamation';
        //     this.alertPopup.icon.color = 'warn';
        //     this.alertPopup.actions.confirm.show = true;
        //     this.alertPopup.actions.confirm.label = 'Ok';
        //     this.alertPopup.actions.confirm.color = 'warn';
        //     this.alertPopup.actions.confirm.show = true;
        //     this.alertPopup.actions.cancel.show = true;
        //     this.alertPopup.actions.cancel.label = 'Cancel';
        //     this.alertPopup.dismissible = false;
        //     // Open the dialog and save the reference of it
        //     const dialogRef = this._fuseConfirmationService.open(
        //         this.alertPopup
        //     );

        //     dialogRef.afterClosed().subscribe((result) => {
        //         if (result == 'confirmed') {
        //             console.log('confirm');
        //             // this.notesSelected = '';
        //             this.selectedItem = '';
        //             this.insertOpen = false;
        //             this.updateOpen = false;
        //             this.openNotes();
        //         } else if (result == 'cancelled') {
        //             console.log('canceled');
        //         }
        //     });
        // }
    }
    saveNotes() {
        if (this.notesSelected.trim() == '') {
            this.MessageClass = 'error';
            this.Message = 'Notes should not be empty';
            setTimeout(() => {
                this.Message = '';
            }, 2000);
            return;
        }
        this.spinner.show();
        var sendData = {
            patientUuid: this.patientUuid,
            notesSelected: this.notesSelected.trim(),
            currentDateAndTime: moment(new Date()).local().unix(),
            // favorited: false,
            favorited: this.favorited,
            notesSelectedUuid: this.notesSelectedUuid,
            type: this.requestParamNotes.patientsNotes,
            createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        };
        console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );

        this.service.savePatientNotes(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.MessageClass = 'success';
                this.Message = data.msg;
                setTimeout(() => {
                    this.Message = '';
                }, 2000);

                this.insertOpen = false;
                this.updateOpen = false;
                this.datetime1 = '';
                this.datetime2 = '';
                this.showMarkAsFav = false;
                this.notesSelected = '';
                this.notesSelectedUuid = '';
                this.openNotes();
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
            }
        );
    }
    changeNotes(notes_type) {
        this.insertOpen = false;
        this.updateOpen = false;
        this.showMarkAsFav = false;
        this.notesSelected = '';
        this.notesSelectedUuid = '';
        this.selectedItem = '';
        this.favorited = false;
        this.favorited_text = 'Mark as favorite';
        console.log('notes_type', notes_type);
        this.patientsNotes = false;
        this.specialNotes = false;
        this.medicationNotes = false;
        this.orderNotes = false;
        if (notes_type == '1') {
            this.patientsNotes = true;
        }
        if (notes_type == '2') {
            this.specialNotes = true;
        }
        if (notes_type == '3') {
            this.medicationNotes = true;
        }
        if (notes_type == '4') {
            this.orderNotes = true;
        }
        this.requestParamNotes.patientsNotes = notes_type;
        this.openNotes();
    }
    periodicVitals: number = 1;
    changeVitals(vitalType) {
        this.periodicVitals = vitalType;
        if (vitalType == 1) {
            this.getPeriodicVitalList();
        }
        if (vitalType == 2) {
            this.range = new FormGroup({
                start: new FormControl(moment().startOf('month')),
                end: new FormControl(moment(new Date())),
            });

            var sendData = {
                from: moment().startOf('month').local().format('YYYY-MM-DD'),
                to: moment().endOf('month').local().format('YYYY-MM-DD'),
            };
            this.getGraphReading(sendData);
            this.sendDatareadings.from = moment().startOf('month').local().format('YYYY-MM-DD');
            this.sendDatareadings.to = moment().endOf('month').local().format('YYYY-MM-DD');
            this.getList(this.sendDatareadings);
        }
    }
    selectedState = 'vitals';
    selectedStateAvgMonthlyVital = false;
    selectedStatePeriodicVital = true;
    changeTab(tab) {
        this.insertOpen = true;
        this.updateOpen = false;
        this.vitals = '0';
        this.notess = '0';
        this.todo = '0';
        this.alerts = '0';
        this.defaultTabVital = '';
        this.notesSelectedUuid = '';
        if (tab == '1') {
            this.vitals = '1';
            this.periodicVitals = 2;
            this.changeVitals(1);
        }
        if (tab == '2') {
            this.todo = '1';
        }
        if (tab == '3') {
            this.notess = '1';
            this.openNotes();
        }
        if (tab == '4') {
            this.alerts = '1';
        }
        if (tab == '5') {
            this.sendtext = '';
            let dialogRef = this.elements.open(this.messagePatient, {
                width: '640px',
            });
        }
        console.log('tabs');
    }
    msgPatient(){
        this.sendtext = '';
            let dialogRef = this.elements.open(this.messagePatient, {
                width: '640px',
            });
    }
    sendTextToPatient() {
        console.log('this.sendtext', this.sendtext);

        if (this.sendtext == '' || this.sendtext.trim() == '') {
            this.MessageClass = 'error';
            this.Message = 'Text should not be empty';
            setTimeout(() => {
                this.Message = '';
            }, 2000);
            return;
        }
        this.spinner.show();
        var sendData = {
            patientUuid: this.patientUuid,
            sendtext: this.sendtext,
        };
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        //console.log(encryptedRequest);
        this.service.sendTexts(encryptedRequest).subscribe(
            (data: any) => {
                this.elements.closeAll();
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.MessageClass = 'success';
                this.Message = data.msg;
                setTimeout(() => {
                    this.Message = '';
                }, 2000);
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                //console.log(error);
            }
        );
    }

    /* TODO Start */
    getListToDo() {
        this.spinner.show();

        this.requestParamtodo.patientUuid = this.patientUuid;
        console.log('requestParamtodo', this.requestParamtodo);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParamtodo)
        );
        this.service.getToDoList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.encryptedResponse = data;
                this.listtodo = this.encryptedResponse.data.todoListData;

                console.log('this.listtodo', this.listtodo);
                this.listtodo.forEach((value) => {
                    if (value.todoStatus == 0) {
                        value.status = 'Closed';
                    } else if (value.todoStatus == 1) {
                        value.status = 'Open';
                    }
                });

                this.serverResponsetodo.next(this.listtodo);
                this.totaltodo = this.encryptedResponse.data.total;
                this.opencount = this.encryptedResponse.data.open;
                this.closecount = this.encryptedResponse.data.close;
                this.pagetodo.totalElements = this.encryptedResponse.data.systemTotalvalue;
                this.pagetodo.totalPages =
                    this.pagetodo.totalElements / this.pagetodo.size;
                console.log(this.serverResponsetodo);
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                // console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                //console.log(this.encryptedResponse);
            }
        );
    }

    setPagetodo(pageInfo) {
        this.pagetodo.pageNumber = pageInfo;
        this.getListToDo();
    }

    onSorttodo(event) {
        const sort = event.sorts[0];
        // console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParamtodo.order.active = sort.prop;
        this.requestParamtodo.order.direction = sort.dir;
        this.pagetodo.pageNumber = 0;
        this.getListToDo();
    }

    getServerDatatodo(event?: PageEvent) {
        // console.log(event.pageIndex);
        // console.log(event.previousPageIndex);
        this.requestParamtodo.current = event.pageIndex;
        this.requestParamtodo.pasgesize = event.pageSize;
        this.getListToDo();
    }

    filterChange(value) {
        // console.log(value);
        if (value == 'open') {
            this.allchecked = false;
            this.closechecked = false;
            this.requestParamtodo.status = '1';
        } else if (value == 'close') {
            this.allchecked = false;
            this.openchecked = false;
            this.requestParamtodo.status = '0';
        } else if (value == 'all') {
            this.closechecked = false;
            this.openchecked = false;
            this.requestParamtodo.status = '';
        }
        //console.log('this.requestParam', this.requestParam);
        this.getListToDo();
    }

    deleteToDo(row) {
        //console.log(row);
        this.alertPopup.title = 'Remove Todo';
        this.alertPopup.message = 'Are you sure want to remove this To-Do?';
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
                var sendData = {
                    todoUuid: row.todoUuid,
                };
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(sendData)
                );
                //console.log(encryptedRequest);
                this.service.deleteToDo(encryptedRequest).subscribe(
                    (data: any) => {
                        //console.log(data);
                        this.getListToDo();
                        this.MessageClass = 'success';
                        this.Message = data.msg;
                    },
                    (error: any) => {
                        //console.log(error);
                    }
                );
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
    }

    statusChangeToDo(row) {
        //console.log(row);
        this.alertPopup.title = 'Change Status';
        this.alertPopup.message =
            'Are you sure you want to change the status of the selected To-Do item?';
        this.alertPopup.icon.show = true;
        this.alertPopup.icon.name = 'heroicons_outline:exclamation';
        this.alertPopup.icon.color = 'success';
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
                let statusChange = 1;
                if (row.todoStatus == 1) {
                    statusChange = 0;
                }
                var sendData = {
                    todoUuid: row.todoUuid,
                    status: statusChange,
                };
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(sendData)
                );
                //console.log(encryptedRequest);
                this.service.changeStatusToDo(encryptedRequest).subscribe(
                    (data: any) => {
                        // console.log('data', data);
                        this.getListToDo();
                        this.MessageClass = 'success';
                        this.Message = data.data;
                        setTimeout(() => {
                            this.Message = '';
                        }, 2000);
                    },
                    (error: any) => {
                        //console.log(error);
                    }
                );
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
    }

    addToDo() {
        this.todayDate = new Date();
        // console.log('thos.', this.todayDate);
        // this.link_to_patient = true;
        // this.showPatient = true;
        // this.toDoForm.controls['patient'].setValidators(Validators.required);
        // this.toDoForm.updateValueAndValidity();
        // this.getPatientList();
        this.toDoForm = this._formBuilder.group({
            item_type: ['', Validators.required],
            due_date: ['', Validators.required],
            description: ['', Validators.required],
            patient: [this.patientUuid],
        });

        let dialogRef = this.elements.open(this.addToDoList, {
            width: '450px',
        });
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
                    this.getListToDo();
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                    this.elements.closeAll();
                    this.toDoForm.reset();
                    setTimeout(() => {
                        this.Message = '';
                    }, 2000);
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

    updateToDo(row) {
        this.toDoForm = this._formBuilder.group({
            item_type: ['', Validators.required],
            due_date: ['', Validators.required],
            description: ['', Validators.required],
            patient: [this.patientUuid],
        });

        this.item_type = row.todo_type;
        this.due_date = row.due_date;
        this.description = row.description;
        this.todoUuid = row.todoUuid;
        this.updatetodayDate = new Date(this.due_date);
        this.todayDate = new Date();
        if (this.todayDate < this.updatetodayDate) {
            this.mindate = this.todayDate;
            // console.log('updateBig', this.mindate);
        } else {
            this.mindate = this.updatetodayDate;
            // console.log('updateSmall', this.todayDate);
        }

        let dialogRef = this.elements.open(this.updateToDoList, {
            width: '450px',
        });
    }

    toDoFormSubmit() {
        if (this.toDoForm.valid) {
            this.spinner.show();
            // console.log(this.toDoForm.value.due_date);
            // console.log('valid');

            var datePipe = new DatePipe('en-US');
            var datevalue = datePipe.transform(
                this.toDoForm.value.due_date,
                'yyyy-MM-dd'
            );
            // console.log('datevalue', datevalue);

            var sendData = {
                data: this.toDoForm.value,
                due_date_value: datevalue,
                uuid: this.todoUuid,
            };
            const encryptedRequest = this.encrypt.encryptData(
                JSON.stringify(sendData)
            );
            //console.log(encryptedRequest);
            this.service.updateToDO(encryptedRequest).subscribe(
                (data: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    this.getListToDo();
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                    this.elements.closeAll();
                    this.toDoForm.reset();
                    setTimeout(() => {
                        this.Message = '';
                    }, 2000);
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

    dateRangeChangetodo(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        // console.log(dateRangeStart.value);
        // console.log(dateRangeEnd.value);

        this.requestParamtodo.startDate = dateRangeStart.value;
        this.requestParamtodo.endDate = dateRangeEnd.value;

        var datePipe = new DatePipe('en-US');
        this.requestParamtodo.startDate = datePipe.transform(
            dateRangeStart.value,
            'yyyy-MM-dd'
        );
        this.requestParamtodo.endDate = datePipe.transform(
            dateRangeEnd.value,
            'yyyy-MM-dd'
        );
        this.getListToDo();
    }
    resetForm(fromInput, toInput) {
        console.log('requestParamtodo', this.requestParamtodo);
        this.requestParamtodo.startDate = '';
        this.requestParamtodo.endDate = '';
        this.requestParamtodo.status = '';
        this.requestParamtodo.search = '';
        this.allchecked = true;
        this.openchecked = false;
        this.closechecked = false;
        fromInput.value = '';
        toInput.value = '';
        // this.searchvalues = null;

        this.searchInput.nativeElement.value = '';
        // console.log('searchvalues', this.searchvalues);
        this.getListToDo();
    }
    searchfn(searchValue) {
        this.requestParamtodo.search = searchValue.target.value;
        console.log('search', this.requestParamtodo.search);
        if (this.requestParamtodo.search.length >= 3) {
            this.getListToDo();
        }
        if (this.requestParamtodo.search.length == 0) {
            this.getListToDo();
        }
    }
    /* TODO Start */

    /* manage threshold */

    manageThreshold() {
        this.spinner.show();
        let dialogRef = this.elements.open(this.thresholdFormDialog, {
            width: '680px',
        });
        console.log('this.patientUuid', this.patientUuid);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.patientUuid)
        );
        this.service.getPatientDetail(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.patientDetailDataMt = data.data[0];

                console.log(
                    'this.patientDetailDataMt',
                    this.patientDetailDataMt
                );
                this.syshigh =
                    this.patientDetailDataMt.single_sys_high == 'null'
                        ? ''
                        : this.patientDetailDataMt.single_sys_high;
                this.syslow =
                    this.patientDetailDataMt.single_sys_low == 'null'
                        ? ''
                        : this.patientDetailDataMt.single_sys_low;
                this.diahigh =
                    this.patientDetailDataMt.single_dia_high == 'null'
                        ? ''
                        : this.patientDetailDataMt.single_dia_high;
                this.dialow =
                    this.patientDetailDataMt.single_dia_low == 'null'
                        ? ''
                        : this.patientDetailDataMt.single_dia_low;
                this.averagesyshigh =
                    this.patientDetailDataMt.avg_sys_high == 'null'
                        ? ''
                        : this.patientDetailDataMt.avg_sys_high;
                this.averagesyslow =
                    this.patientDetailDataMt.avg_sys_low == 'null'
                        ? ''
                        : this.patientDetailDataMt.avg_sys_low;
                this.averagediahigh =
                    this.patientDetailDataMt.avg_dia_high == 'null'
                        ? ''
                        : this.patientDetailDataMt.avg_dia_high;
                this.averagedialow =
                    this.patientDetailDataMt.avg_dia_low == 'null'
                        ? ''
                        : this.patientDetailDataMt.avg_dia_low;
                // this.twentyfourhr =
                //     this.patientDetailDataMt.weight_low == 'null'
                //         ? ''
                //         : this.patientDetailDataMt.weight_low;
                // this.seventytwohr =
                //     this.patientDetailDataMt.weight_high == 'null'
                //         ? ''
                //         : this.patientDetailDataMt.weight_high;
                var sevendays =
                    this.patientDetailDataMt.sevendays == 1 ? true : false;
                var tenreadings =
                    this.patientDetailDataMt.tenreadings == 1 ? true : false;
                this.thresholdForm.controls['sevendays'].setValue(sevendays);
                this.thresholdForm.controls['tenreadings'].setValue(
                    tenreadings
                );
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }

    onThresholdFormSubmit() {
        this.isDisabled = true;
        if (this.thresholdForm.valid) {
            this.spinner.show();
            console.log('Valid', this.thresholdForm.value);
            var sendData = {
                data: this.thresholdForm.value,
                patientUuid: this.patientUuid,
            };
            console.log('sendData', sendData);
            const encryptedRequest = this.encrypt.encryptData(
                JSON.stringify(sendData)
            );
            this.service.updatePatientThreshold(encryptedRequest).subscribe(
                (data: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 200);
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                    this.elements.closeAll();
                    setTimeout(() => {
                        this.Message = '';
                        this.isDisabled = false;
                    }, 1000);
                },
                (error: any) => {
                    setTimeout(() => {
                        this.spinner.hide();
                        this.isDisabled = false;
                    }, 200);
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(
                        error.error.data
                    );
                    this.encryptedResponse = error.error.data;
                    console.log(this.encryptedResponse);
                }
            );
        } else {
            console.log('invalid', this.thresholdForm.value);
            this.isDisabled = false;
        }
    }

    onBpSingleReadingSys(event) {
        console.log(this.syshigh);
        console.log(this.syslow);
        if (this.syshigh == null) {
            this.thresholdForm
                .get('syslow')
                .setValidators([Validators.required, Validators.max(999)]);
            this.thresholdForm.get('syslow').updateValueAndValidity();
        } else if (this.syshigh < this.syslow) {
            this.thresholdForm
                .get('syslow')
                .setValidators([
                    Validators.required,
                    Validators.max(this.syshigh),
                ]);
            this.thresholdForm.get('syslow').updateValueAndValidity();
        } else if (this.syslow == null) {
            this.thresholdForm
                .get('syslow')
                .setValidators([Validators.required]);
            this.thresholdForm.get('syslow').updateValueAndValidity();
        } else if (this.syshigh > this.syslow) {
            this.thresholdForm.get('syslow').clearValidators();
            this.thresholdForm.get('syslow').updateValueAndValidity();
        }
    }
    onBpSingleReadingDia(event) {
        if (this.diahigh == null) {
            this.thresholdForm
                .get('dialow')
                .setValidators([Validators.required, Validators.max(999)]);
            this.thresholdForm.get('dialow').updateValueAndValidity();
        } else if (this.diahigh < this.dialow) {
            this.thresholdForm
                .get('dialow')
                .setValidators([
                    Validators.required,
                    Validators.max(this.diahigh),
                ]);
            this.thresholdForm.get('dialow').updateValueAndValidity();
        } else if (this.dialow == null) {
            this.thresholdForm
                .get('dialow')
                .setValidators([Validators.required]);
            this.thresholdForm.get('dialow').updateValueAndValidity();
        } else if (this.diahigh > this.dialow) {
            this.thresholdForm.get('dialow').clearValidators();
            this.thresholdForm.get('dialow').updateValueAndValidity();
        }
    }
    onBpSingleAverageSys(event) {
        console.log(this.averagesyshigh);
        console.log(this.averagesyslow);
        if (this.averagesyshigh == null) {
            this.thresholdForm
                .get('averagesyslow')
                .setValidators([Validators.required, Validators.max(999)]);
            this.thresholdForm.get('averagesyslow').updateValueAndValidity();
        } else if (this.averagesyshigh < this.averagesyslow) {
            this.thresholdForm
                .get('averagesyslow')
                .setValidators([
                    Validators.required,
                    Validators.max(this.averagesyshigh),
                ]);
            this.thresholdForm.get('averagesyslow').updateValueAndValidity();
        } else if (this.averagesyslow == null) {
            this.thresholdForm
                .get('averagesyslow')
                .setValidators([Validators.required]);
            this.thresholdForm.get('averagesyslow').updateValueAndValidity();
        } else if (this.averagesyshigh > this.averagesyslow) {
            this.thresholdForm.get('averagesyslow').clearValidators();
            this.thresholdForm.get('averagesyslow').updateValueAndValidity();
        }
    }
    onBpSingleAverageDia(event) {
        console.log('this.averagediahigh', this.averagediahigh);
        console.log('this.averagedialow', this.averagedialow);
        if (this.averagediahigh == null) {
            this.thresholdForm
                .get('averagedialow')
                .setValidators([Validators.required, Validators.max(999)]);
            this.thresholdForm.get('averagedialow').updateValueAndValidity();
        } else if (this.averagediahigh < this.averagedialow) {
            this.thresholdForm
                .get('averagedialow')
                .setValidators([
                    Validators.required,
                    Validators.max(this.averagediahigh),
                ]);
            this.thresholdForm.get('averagedialow').updateValueAndValidity();
        } else if (this.averagedialow == null) {
            this.thresholdForm
                .get('averagedialow')
                .setValidators([Validators.required]);
            this.thresholdForm.get('averagedialow').updateValueAndValidity();
        } else if (this.averagediahigh > this.averagedialow) {
            this.thresholdForm.get('averagedialow').clearValidators();
            this.thresholdForm.get('averagedialow').updateValueAndValidity();
        }
    }
    validateNum(e): boolean {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    /* manage threshold */

    dateRangeChangePickerForMonthlyVital(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        console.log('dateRangeStart.value', dateRangeStart.value);
        console.log('dateRangeEnd.value', dateRangeEnd.value);

        var sendData = {
            from: moment(dateRangeStart.value).local().format('YYYY-MM-DD'),
            to: moment(dateRangeEnd.value).local().format('YYYY-MM-DD'),
        };
        this.getGraphReading(sendData);
        this.sendDatareadings.from = moment(dateRangeStart.value).local().format('YYYY-MM-DD');
        this.sendDatareadings.to = moment(dateRangeEnd.value).local().format('YYYY-MM-DD');
        this.getList(this.sendDatareadings);
    }

    //Alerts Start

    getListAlert() {
        this.spinner.show();
        this.requestParamAlert.patientUuid = this.patientUuid;
        // console.log('this.requestParamAlert', this.requestParamAlert);
        // return;
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParamAlert)
        );
        this.service.getAlertList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.encryptedResponse = data;
                this.alertlist = this.encryptedResponse.data.alertDetails;

                console.log('this.encryptedResponse', this.encryptedResponse);
                this.alertlist.forEach((value) => {
                    if (value.alertsStatus == 0) {
                        value.status = 'Unresolved';
                    } else if (value.alertsStatus == 1) {
                        value.status = 'Resolved';
                    }
                });

                this.serverResponseAlert.next(this.alertlist);
                this.totalAlert = this.encryptedResponse.data.systemTotalvalue;
                this.resolvecount = this.encryptedResponse.data.resolved;
                this.unresolvecount = this.encryptedResponse.data.unresolved;
                this.pageAlert1.totalElements = this.totalAlert;
                this.pageAlert1.totalPages =
                    this.pageAlert1.totalElements / this.pageAlert1.size;
                // console.log(this.alertlist);
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                // console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                //console.log(this.encryptedResponse);
            }
        );
    }

    getServerDataAlert(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParamAlert.current = event.pageIndex;
        this.requestParamAlert.pasgesize = event.pageSize;
        this.getListAlert();
    }

    onSortAlert(event) {
        const sort = event.sorts[0];
        // console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParamAlert.order.active = sort.prop;
        this.requestParamAlert.order.direction = sort.dir;
        this.pageAlert1.pageNumber = 0;
        this.getListAlert();
    }
    setPageAlert(pageInfo) {
        this.requestParamAlert.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParamAlert.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );
        this.pageAlert1.pageNumber = pageInfo;
        this.getListAlert();
    }
    alertFilterChange(value) {
        // console.log(value);
        if (value == 'resolve') {
            this.alertallChecked = false;
            this.alertunresolveChecked = false;
            this.requestParamAlert.status = '1';
        } else if (value == 'unresolve') {
            this.alertallChecked = false;
            this.alertresolveChecked = false;
            this.requestParamAlert.status = '0';
        } else if (value == 'all') {
            this.alertunresolveChecked = false;
            this.alertresolveChecked = false;
            this.requestParamAlert.status = '';
        }
        //console.log('this.requestParamAlert', this.requestParamAlert);
        this.getListAlert();
    }

    alertDateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        // console.log(dateRangeStart.value);
        // console.log(dateRangeEnd.value);

        // this.requestParamAlert.startDate = dateRangeStart.value;
        // this.requestParamAlert.endDate = dateRangeEnd.value;

        // var datePipe = new DatePipe('en-US');
        // this.requestParamAlert.startDate = datePipe.transform(
        //     dateRangeStart.value,
        //     'yyyy-MM-dd'
        // );
        // this.requestParamAlert.endDate = datePipe.transform(
        //     dateRangeEnd.value,
        //     'yyyy-MM-dd'
        // );

        this.requestParamAlert.startDate = moment(dateRangeStart.value).format(
            'YYYY-MM-DD'
        );

        this.requestParamAlert.endDate = moment(dateRangeEnd.value).format(
            'YYYY-MM-DD'
        );
        // console.log('this.requestParamAlert.startDate', this.requestParamAlert);

        // console.log('this.requestParamAlert', this.requestParamAlert);
        this.getListAlert();
    }
    resetFormAlert(fromInput, toInput) {
        console.log('requestParamAlert', this.requestParamAlert);
        this.requestParamAlert.startDate = '';
        this.requestParamAlert.endDate = '';
        this.requestParamAlert.status = '';
        this.requestParamAlert.search = '';
        this.alertallChecked = true;
        this.alertresolveChecked = false;
        this.alertunresolveChecked = false;
        this.requestParamAlert.sortBy = 'desc';

        var date = new Date();
        this.rangeAlert = new FormGroup({
            start: new FormControl(
                new Date(date.getFullYear(), date.getMonth(), 1)
            ),
            end: new FormControl(new Date()),
        });

        this.requestParamAlert.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParamAlert.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );

        // fromInput.value = '';
        // toInput.value = '';
        // this.searchvalues = null;

        // this.searchInputAlert.nativeElement.value = '';
        // console.log('searchvalues', this.searchvalues);
        this.getListAlert();
    }

    updateAlertDialog(row) {
        console.log('row11', row);
        this.selectedRow = row;
        this.alertNotes = row.notes;

        let dialogRef = this.elements.open(this.updateResolve, {
            width: '450px',
        });
    }

    resolveAct(status, alertUuid) {
        console.log('status', status);
        console.log('alertNotes', this.alertNotes);
        if (this.alertNotes == '' || this.alertNotes == undefined) {
            this.MessageClass = 'error';
            this.Message = 'Notes should not be empty!';
            setTimeout(() => {
                this.Message = '';
            }, 2000);
            return false;
        }

        var sendData = {
            alertUuid: alertUuid,
            status: status,
            alertNotes: this.alertNotes,
        };
        console.log('sendData', sendData);
        // return;
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.changeStatusAlert(encryptedRequest).subscribe(
            (data: any) => {
                // console.log('data', data);
                this.elements.closeAll();
                this.getListAlert();
                this.MessageClass = 'success';
                this.Message = data.data;
                setTimeout(() => {
                    this.Message = '';
                }, 2000);
            },
            (error: any) => {
                //console.log(error);
            }
        );
    }

    searchfnAlert(searchValue) {
        this.requestParamAlert.search = searchValue.target.value;
        console.log('search', this.requestParamAlert.search);
        if (this.requestParamAlert.search.length >= 3) {
            this.getListAlert();
        }
        if (this.requestParamAlert.search.length == 0) {
            this.getListAlert();
        }
    }

    altfilterChange(value, type) {
        if (type == 'sortBy') {
            this.requestParamAlert.order.active = '';
            this.requestParamAlert.order.direction = '';
            this.requestParamAlert.sortBy = value;
            if (this.requestParamAlert.sortBy != '') {
                this.getListAlert();
            }
        }
    }
    //Alerts End
    exportPatientDetails(){
        this.spinner.show();
        var sendData = {
            patientUuid: this.patientUuid,
            itration : this.sendDataPDF.itration
        };
        console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getPatientRecordPDF(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                // console.log('data', data);
                this.downLoadRecordsFile(data);
                this.MessageClass = 'success';
                this.Message = 'Records Downloaded Successfully';
                setTimeout(() => {
                    this.Message = '';
                }, 2000);
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

    downLoadRecordsFile(data: any) {
        var blob = new Blob([data], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download =
            'Patient-Records-' +
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

export class todoListPageData {
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

export class alertListPageData {
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
