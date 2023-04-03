import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    TemplateRef,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { DoctorService } from 'app/modules/doctor.service';
import { successResponseData } from 'app/core/response-schema';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
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
export class ListComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 2, name: 'Doctor Admin'},
               {id: 3, name: 'Doctor'},
               {id: 4, name: 'Finance'},
               {id: 5, name: 'Staff'},
            ];
    date = new FormControl(moment());
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild('divToScroll') divToScroll: ElementRef;

    selectCMonthFilter = true;
    selectLastMonthFilter = false;
    select3MonthFilter = false;
    selectYearlyFilter = false;
    selectedReport = true;
    selectedRemovedReport = false;

    constructor(
        private service: DoctorService,
        private encrypt: EncryptDecryptService,
        private _fuseConfirmationService: FuseConfirmationService,
        private elements: MatDialog,
        private _formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
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

        this.page2.pageNumber = this.requestParam.current;
        this.page2.size = this.requestParam.pasgesize;
    }
    userExists(id) {
      return this.roles.some(function(el) {
        return el.id === id;
      }); 
    }
    ColumnMode = ColumnMode;
    SelectionType = SelectionType;

    page = {
        limit: 5,
        count: 0,
        offset: 0,
        orderBy: 'myColumn1',
        orderDir: 'desc',
    };
    page1 = new recordsListPageData();
    page2 = new rrecordsListPageData();

    requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        order: { direction: string; active: string };
        startDate: string;
        endDate: string;
        search: string;
        time_status: string;
        sortby: string;
        selectedArr: any;
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        startDate: '',
        endDate: '',
        search: '',
        time_status: '',
        sortby: '',
        selectedArr: '',
    };

    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();
    rserverResponse = new BehaviorSubject<any[]>([]);
    rresponse = this.rserverResponse.asObservable();
    list: any[] = [];
    rlist: any[] = [];
    total: number = 0;
    rtotal: number = 0;
    sorting: any;

    // alertPopup: FuseConfirmationConfig = {
    //     title: '',
    //     message: '',
    //     icon: {
    //         color: 'warn',
    //         name: '',
    //         show: false,
    //     },
    //     actions: {
    //         cancel: {
    //             show: false,
    //             label: '',
    //         },
    //         confirm: {
    //             color: 'warn',
    //             label: '',
    //             show: false,
    //         },
    //     },
    //     dismissible: false,
    // };
    Message: string = '';
    MessageClass: string = '';

    sortBy = [
        { name: 'paz', value: 'Patient First Name A-Z' },
        { name: 'pza', value: 'Patient First Name Z-A' },
        { name: 'laz', value: 'Patient Last Name A-Z' },
        { name: 'lza', value: 'Patient Last Name Z-A' },
    ];
    todayDate: Date | null;

    ngOnInit(): void {
        this.todayDate = new Date();

        // const fromDate = moment().startOf('month');
        // const toDate = moment(new Date());
        // var date = new Date();
        // this.range = new FormGroup({
        //     start: new FormControl(
        //         new Date(date.getFullYear(), date.getMonth(), 1)
        //     ),
        //     end: new FormControl(new Date()),
        // });

        this.requestParam.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParam.endDate = moment(new Date()).format('YYYY-MM-DD');
        this.setPage(this.requestParam.current);
        this.rsetPage(this.requestParam.current);
    }

    getList() {
        //this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        console.log('this.requestParam', this.requestParam);
        this.service.getRecordsList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.patientsDetails;

                console.log('this.data', data);

                // console.log('page1', this.page1);
                this.serverResponse.next(this.list);
                this.total = this.encryptedResponse.data.systemTotalvalue;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
            },
            (error: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                // console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                //console.log(this.encryptedResponse);
            }
        );
    }

    getServerData(event?: PageEvent) {
        this.divToScroll.nativeElement.scrollTop = 0;

        console.log('event', event);
        console.log('event.pageSize', event.pageSize);
        console.log('event.pageIndex', event.pageIndex);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;

        this.page1.pageNumber = this.requestParam.current;
        this.page1.size = this.requestParam.pasgesize;

        this.getList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        // console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParam.order.active = sort.prop;
        this.requestParam.order.direction = sort.dir;
        this.page1.pageNumber = 0;
        this.getList();
    }
    setPage(pageInfo) {
        console.log('pageinfo', pageInfo);
        this.page1.pageNumber = pageInfo;
        this.getList();
    }

    ronSort(event) {
        const sort = event.sorts[0];
        // console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParam.order.active = sort.prop;
        this.requestParam.order.direction = sort.dir;
        this.page2.pageNumber = 0;
        this.getRemovedPatientList();
    }
    rsetPage(pageInfo) {
        console.log('pageinfo', pageInfo);
        this.page2.pageNumber = pageInfo;
        this.getRemovedPatientList();
    }
    getrServerData(event?: PageEvent) {
        this.divToScroll.nativeElement.scrollTop = 0;
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;

        this.page2.pageNumber = this.requestParam.current;
        this.page2.size = this.requestParam.pasgesize;

        this.getRemovedPatientList();
    }
    rows = [];
    selected = [];
    selectedArr = [];
    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    filterChange(value, type) {
        if (type == 'status') {
            this.requestParam.time_status = value;
            if (this.requestParam.time_status != '') {
                this.requestParam.current = 0;
                // this.page1.pageNumber = this.requestParam.current;
                // this.page1.size = this.requestParam.pasgesize;
                // this.setPage(this.requestParam.current);
                // this.page1.pageNumber = this.requestParam.current;
                // this.page1.size = this.requestParam.pasgesize;
                this.getList();
            }
        }
        if (type == 'sortby') {
            this.requestParam.sortby = value;
            this.getList();
        }
        // if (type == 'billingCode') {
        //     this.requestParam.billingCode = value;
        //     this.getList();
        // }
        if (type == 'search') {
            if (value.length >= 3) {
                this.requestParam.search = value;
                this.getList();
            }
            if (value.length == '') {
                this.requestParam.search = '';
                this.getList();
            }
        }
        // console.log('this.requestParam', this.requestParam);
    }

    resetForm() {
        // console.log('requestParam', this.requestParam);
        // console.log('this.page1', this.page1);
        // this.requestParam.startDate = '';
        // this.requestParam.endDate = '';

        this.selectCMonthFilter = true;
        this.requestParam.time_status = '';
        this.requestParam.sortby = '';
        // this.requestParam.billingCode = '';
        this.requestParam.search = '';
        this.searchInput.nativeElement.value = '';
        // fromInput.value = '';
        // toInput.value = '';
        // this.range.reset();

        // this.range = new FormGroup({
        //     start: new FormControl(moment().startOf('month')),
        //     end: new FormControl(moment(new Date())),
        // });
        // console.log('selectCMonthFilter', this.selectCMonthFilter);
        // console.log('selectLastMonthFilter', this.selectLastMonthFilter);
        // console.log('select3MonthFilter', this.select3MonthFilter);
        // console.log('selectYearlyFilter', this.selectYearlyFilter);
        // var date = new Date();
        // this.range = new FormGroup({
        //     start: new FormControl(
        //         new Date(date.getFullYear(), date.getMonth(), 1)
        //     ),
        //     end: new FormControl(new Date()),
        // });

        this.requestParam.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParam.endDate = moment(new Date()).format('YYYY-MM-DD');

        this.getList();
    }

    // dateRangeChange(
    //     dateRangeStart: HTMLInputElement,
    //     dateRangeEnd: HTMLInputElement
    // ) {
    //     console.log('dateRangeStart.value', dateRangeStart.value);
    //     console.log('dateRangeEnd.value', dateRangeEnd.value);

    //     this.requestParam.startDate = moment(dateRangeStart.value)
    //         .local()
    //         .format('YYYY-MM-DD');

    //     this.requestParam.endDate = moment(dateRangeEnd.value)
    //         .local()
    //         .format('YYYY-MM-DD');
    //     // console.log('this.requestParam.startDate', this.requestParam);

    //     // console.log('this.requestParam', this.requestParam);
    //     this.getList();
    // }
    downLoadFile(data: any) {
        var blob = new Blob([data], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download =
            'Patient-List-' +
            moment.utc().local().format('MMM-DD-YYYY-H-mm-ss') +
            '.csv';
        // document.body.setAttribute('style', 'text-align:center');
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
    }

    exporttocsv() {
        this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.fileExportPatientList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                console.log('data', data);
                this.downLoadFile(data);
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
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
            }
        );
    }

    changeFilters(filterId) {
        console.log('this.filterId', filterId);

        if (filterId == 1) {
            this.selectCMonthFilter = true;
            this.selectLastMonthFilter = false;
            this.select3MonthFilter = false;
            this.selectYearlyFilter = false;

            this.requestParam.startDate = moment()
                .startOf('month')
                .format('YYYY-MM-DD');
            this.requestParam.endDate = moment(new Date()).format('YYYY-MM-DD');
            this.getList();
        }
        if (filterId == 2) {
            this.selectCMonthFilter = false;
            this.selectLastMonthFilter = true;
            this.select3MonthFilter = false;
            this.selectYearlyFilter = false;

            this.requestParam.startDate = moment(new Date())
                .subtract(1, 'months')
                .startOf('month')
                .format('YYYY-MM-DD');
            this.requestParam.endDate = moment(new Date())
                .subtract(1, 'months')
                .endOf('month')
                .format('YYYY-MM-DD');
            this.getList();
        }
        if (filterId == 3) {
            this.selectCMonthFilter = false;
            this.selectLastMonthFilter = false;
            this.select3MonthFilter = true;
            this.selectYearlyFilter = false;
            this.requestParam.startDate = moment(new Date())
                .subtract(3, 'months')
                .startOf('month')
                .format('YYYY-MM-DD');
            this.requestParam.endDate = moment(new Date())
                .subtract(1, 'months')
                .endOf('month')
                .format('YYYY-MM-DD');
            this.getList();
        }
        // if (filterId == 4) {
        //     this.selectCMonthFilter = false;
        //     this.selectLastMonthFilter = false;
        //     this.select3MonthFilter = false;
        //     this.selectYearlyFilter = true;
        // }

        // console.log('selectCMonthFilter', this.selectCMonthFilter);
        // console.log('selectLastMonthFilter', this.selectLastMonthFilter);
        // console.log('select3MonthFilter', this.select3MonthFilter);
        // console.log('selectYearlyFilter', this.selectYearlyFilter);

        // this.periodicVitals = vitalType;
        // if (vitalType == 1) {
        //     this.getPeriodicVitalList();
        // }
        // if (vitalType == 2) {
        //     this.range = new FormGroup({
        //         start: new FormControl(moment().startOf('month')),
        //         end: new FormControl(moment(new Date())),
        //     });

        //     var sendData = {
        //         from: moment().startOf('month').local().format('YYYY-MM-DD'),
        //         to: moment().endOf('month').local().format('YYYY-MM-DD'),
        //     };
        //     this.getGraphReading(sendData);
        //     this.getList(sendData);
        // }
    }

    changemodule(filterId) {
        console.log('this.filterId', filterId);

        this.requestParam.current = 0;

        if (filterId == 1) {
            this.selectedReport = true;
            this.selectedRemovedReport = false;
        }
        if (filterId == 2) {
            this.selectedReport = false;
            this.selectedRemovedReport = true;
            this.getRemovedPatientList();
        }
    }
    
    getRemovedPatientList() {
        this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        console.log('this.requestParam', this.requestParam);
        this.service.getRemovedPatientList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.encryptedResponse = data;
                this.rlist = this.encryptedResponse.data.patientsDetails;

                console.log('this.rlist', this.rlist);
                this.rlist.forEach(function(value){
                    //console.log(value.reason);
                    if(value.reason==3){
                        value.reason_notes = value.reason_notes;
                    }else{
                        var reasonList = [{name: 'Treatment is no longer required',value:0},{name: 'The Patient has moved to a new location',value:1},{name: 'The patient has changed the provider',value:2},{name: 'Others',value:3}];
                        value.reason_notes = reasonList[value.reason].name;
                    }
                });
                this.rserverResponse.next(this.rlist);
                this.rtotal = this.encryptedResponse.data.total;
                this.page2.totalElements = this.rtotal;
                this.page2.totalPages =
                    this.page2.totalElements / this.page2.size;
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

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        this.selectCMonthFilter = false;
        this.selectLastMonthFilter = false;
        this.select3MonthFilter = false;
        this.selectYearlyFilter = true;

        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        // this.date.setValue(ctrlValue);
        console.log('this.date', normalizedYear.year());

        this.requestParam.startDate = moment([normalizedYear.year()])
            .startOf('year')
            .format('YYYY-MM-DD');
        this.requestParam.endDate = moment([normalizedYear.year()])
            .endOf('year')
            .format('YYYY-MM-DD');
        console.log('this.requestParam', this.requestParam);
        this.getList();

        datepicker.close();
    }

    // chosenMonthHandler(
    //     normalizedMonth: Moment,
    //     datepicker: MatDatepicker<Moment>
    // ) {
    //     const ctrlValue = this.date.value;
    //     ctrlValue.month(normalizedMonth.month());
    //     this.date.setValue(ctrlValue);
    //     datepicker.close();
    // }

    downloadFile(puuid) {
        this.spinner.show();
        var sendData = {
            puuid: puuid,
            startDate: this.requestParam.startDate,
            endDate: this.requestParam.endDate,
        };
        console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.getRecordPDF(encryptedRequest).subscribe(
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

export class recordsListPageData {
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

export class rrecordsListPageData {
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
