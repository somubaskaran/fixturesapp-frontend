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
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('search', { static: false }) search: ElementRef;
    constructor(
        private service: DoctorService,
        private encrypt: EncryptDecryptService,
        private _fuseConfirmationService: FuseConfirmationService,
        private elements: MatDialog,
        private _formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) {
        this.page1.pageNumber = this.requestParam.current;
        this.page1.size = this.requestParam.pasgesize;
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
    page1 = new billingListPageData();

    requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        order: { direction: string; active: string };
        search: string;
        sortby: string;
        colorCodeValue: string;
    } = {
        current: 0,
        pasgesize: 5,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        search: '',
        sortby: 'desc',
        colorCodeValue: '',
    };

    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();
    list: any[] = [];
    total: number = 0;
    sorting: any;
    dateRange: number = 0;

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

    sortBy = [
        { name: 'paz', value: 'Patient First Name A-Z' },
        { name: 'pza', value: 'Patient First Name Z-A' },
        { name: 'laz', value: 'Patient Last Name A-Z' },
        { name: 'lza', value: 'Patient Last Name Z-A' },
    ];
    todayDate: Date | null;
    todayDateDisplay: string = '';

    ngOnInit(): void {
        this.todayDate = new Date();
        this.todayDateDisplay = moment(new Date()).format('MMM DD,YYYY');

        // const fromDate = moment().startOf('month');
        // const toDate = moment(new Date());
        // var date = new Date();
        // this.range = new FormGroup({
        //     start: new FormControl(
        //         new Date(date.getFullYear(), date.getMonth(), 1)
        //     ),
        //     end: new FormControl(new Date()),
        // });

        this.setPage(this.requestParam.current);
    }

    getList() {
        this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        console.log('this.requestParam', this.requestParam);
        this.service.getReadingStatusList(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.patientsDetails;

                console.log('this.list', this.list);

                this.list.forEach((value) => {
                    console.log('value', value);
                    value.readingNeeded = 16 - value.fivefour_count;
                    value.expectedDate = moment(value.fivefour_date)
                        .add(30, 'days')
                        .format('MMM DD,YYYY');

                    value.currentDateFormat = moment(new Date()).format(
                        'YYYY-MM-DD'
                    );
                    value.expectedDate_format = moment(
                        value.expectedDate
                    ).format('YYYY-MM-DD');

                    var start = moment(value.expectedDate_format, 'YYYY-MM-DD');
                    var end = moment(value.currentDateFormat, 'YYYY-MM-DD');
                    value.daysRemaining = moment
                        .duration(start.diff(end))
                        .asDays();

                    value.daysRemaining =
                        value.daysRemaining < 0 ? '0' : value.daysRemaining;

                    value.daysRemainingCountForBar = 30 - value.daysRemaining;

                    value.colorValue =
                        value.daysRemaining - value.readingNeeded;
                    // value.colorCode = 'colorCode';
                    if (value.readingNeeded == 0 || value.colorValue > 8) {
                        value.colorCode = '#28C76F';
                        value.colorCodeClass = 'greenCode';
                    } else if (value.colorValue < 5) {
                        value.colorCode = '#EA5455';
                        value.colorCodeClass = 'redCode';
                    } else if (value.colorValue <= 8 && value.colorValue >= 5) {
                        value.colorCode = '#FDAB5D';
                        value.colorCodeClass = 'orangeCode';
                    }
                });

                // console.log('page1', this.page1);
                this.serverResponse.next(this.list);
                this.total = this.encryptedResponse.data.total;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
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

    getServerData(event?: PageEvent) {
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
    rows = [];
    selected = [];
    // selectedArr = [];
    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    patientPaidStatus(row) {
        console.log('checked row', row);
        // return;

        this.spinner.show();
        var billStatus = '0';
        if (row.billingStatus == '0') {
            billStatus = '1';
        }
        var sendData = {
            billingUuid: row.billinguuid,
            billingStatus: billStatus,
        };
        // console.log('sendData', sendData);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.updatePaidStatus(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.MessageClass = 'success';
                this.Message = data.msg;
                setTimeout(() => {
                    this.Message = '';
                }, 2000);
                this.getList();
            },
            (error: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                //console.log(error);
            }
        );
    }

    filterChange(value, type) {
        if (type == 'colorCodeValue') {
            this.requestParam.colorCodeValue = value;
            this.getList();
        }
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
    }

    resetForm() {
        this.requestParam.colorCodeValue = '';
        this.requestParam.search = '';
        this.searchInput.nativeElement.value = '';
        this.getList();
    }
}

export class billingListPageData {
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
