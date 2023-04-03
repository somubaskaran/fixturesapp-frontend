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
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 1, name: 'Super Admin'},
               {id: 6, name: 'Admin'},
            ];
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('search', { static: false }) search: ElementRef;
    doctorsList: string[] = [];
    constructor(
        private service: DoctorService,
        private encrypt: EncryptDecryptService,
        private _fuseConfirmationService: FuseConfirmationService,
        private elements: MatDialog,
        private _formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router,
    ) {
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
    ColumnMode = ColumnMode;
    SelectionType = SelectionType;

    page = {
        limit: 10,
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
        startDate: string;
        endDate: string;
        search: string;
        time_status: string;
        sortby: string;
        billingCode: string;
        selectedArr: any;
        system: any;
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        startDate: '',
        endDate: '',
        search: '',
        time_status: '',
        sortby: '',
        billingCode: '',
        selectedArr : '',
        system: '',
    };

    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();
    list: any[] = [];
    total: number = 0;
    sorting: any;

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

    ngOnInit(): void {
        this.todayDate = new Date();

        // const fromDate = moment().startOf('month');
        // const toDate = moment(new Date());
        var date = new Date();
        this.range = new FormGroup({
            start: new FormControl(
                new Date(date.getFullYear(), date.getMonth(), 1)
            ),
            end: new FormControl(new Date()),
        });

        this.requestParam.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParam.endDate = moment(new Date()).format('YYYY-MM-DD');
        this.setPage(this.requestParam.current);
        this.getDoctors();
    }
    getDoctors() {
        this.service.getDoctors().subscribe(
            (data: any) => {
                console.log('somu');
                console.log(data);
                this.doctorsList = data.data;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
    getList() {
        //this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        console.log('this.requestParam', this.requestParam);
        this.service.getBillingList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.todoListData;

                console.log('this.list', this.list);
                this.list.forEach((value) => {
                    if (
                        value.billingStatus == 0 ||
                        value.billingStatus == null
                    ) {
                        value.status = 'UnPaid';
                        value.checked = false;
                    } else if (value.billingStatus == 1) {
                        value.status = 'Paid';
                        value.checked = true;
                    }

                    value.totalTimeSumConvertoSeconds = moment(
                        value.totalTimeSum,
                        'HH:mm:ss'
                    ).diff(moment().startOf('day'), 'seconds');

                    value.totalTimeSumConvertoSecondsDub =
                        value.totalTimeSumConvertoSeconds;

                    var items = [];
                    if (value.totalTimeSumConvertoSecondsDub > 1200) {
                        value.timeLoopArr = Math.ceil(
                            value.totalTimeSumConvertoSecondsDub / 1200
                        );

                        var ztragetTimeAchived = '';
                        var zfiveMinTimeRemaining = '';
                        var ztenMinTimeRemaining = '';
                        var zfifteenMinTimeRemaining = '';

                        for (
                            let index = 0;
                            index < value.timeLoopArr;
                            index++
                        ) {
                            if (index == 0) {
                                var colorValue = '';
                                if (
                                    value.totalTimeSumConvertoSecondsDub >= 1200
                                ) {
                                    var colorValue = 'greencode';
                                } else {
                                    if (
                                        value.totalTimeSumConvertoSecondsDub <=
                                        300
                                    ) {
                                        var colorValue = 'yellowcode'; //
                                        //15min remaining
                                        zfifteenMinTimeRemaining = '1';
                                    } else if (
                                        value.totalTimeSumConvertoSecondsDub <=
                                        600
                                    ) {
                                        var colorValue = 'orangecode';
                                        //10min remaining
                                        ztenMinTimeRemaining = '1';
                                    } else if (
                                        value.totalTimeSumConvertoSecondsDub <
                                        1200
                                    ) {
                                        var colorValue = 'redcode';
                                        //5min remaining
                                        zfiveMinTimeRemaining = '1';
                                    } else {
                                        var colorValue = 'greencode';
                                    }
                                }
                                value.timesumArr = {
                                    colorCode: '99457',
                                    color: colorValue,
                                };
                                items.push(value.timesumArr);

                                value.zfifteenMinTimeRemaining =
                                    zfifteenMinTimeRemaining;
                                value.ztenMinTimeRemaining =
                                    ztenMinTimeRemaining;
                                value.zfiveMinTimeRemaining =
                                    zfiveMinTimeRemaining;
                            } else {
                                if (
                                    value.totalTimeSumConvertoSecondsDub >= 1200
                                ) {
                                    var colorValue = 'greencode';
                                    ztragetTimeAchived = '1';
                                } else {
                                    if (
                                        value.totalTimeSumConvertoSecondsDub <=
                                        300
                                    ) {
                                        var colorValue = 'yellowcode'; //
                                        //15min remaining
                                        zfifteenMinTimeRemaining = '1';
                                    } else if (
                                        value.totalTimeSumConvertoSecondsDub <=
                                        600
                                    ) {
                                        var colorValue = 'orangecode';
                                        //10min remaining
                                        ztenMinTimeRemaining = '1';
                                    } else if (
                                        value.totalTimeSumConvertoSecondsDub <
                                        1200
                                    ) {
                                        var colorValue = 'redcode';
                                        //5min remaining
                                        zfiveMinTimeRemaining = '1';
                                    } else {
                                        var colorValue = 'greencode';
                                    }
                                }
                                value.timesumArr = {
                                    colorCode: '99458',
                                    color: colorValue,
                                };
                                items.push(value.timesumArr);

                                value.ztragetTimeAchived = ztragetTimeAchived;
                                value.zfifteenMinTimeRemaining =
                                    zfifteenMinTimeRemaining;
                                value.ztenMinTimeRemaining =
                                    ztenMinTimeRemaining;
                                value.zfiveMinTimeRemaining =
                                    zfiveMinTimeRemaining;
                            }
                            value.items = items;
                            value.totalTimeSumConvertoSecondsDub =
                                value.totalTimeSumConvertoSecondsDub - 1200;
                            console.log(
                                'value.totalTimeSumConvertoSecondsDub',
                                value.totalTimeSumConvertoSecondsDub
                            );
                        }
                    } else {
                        var colorValue = '';
                        if (value.totalTimeSumConvertoSecondsDub >= 1200) {
                            var colorValue = 'greencode';
                        } else {
                            if (value.totalTimeSumConvertoSecondsDub <= 300) {
                                var colorValue = 'yellowcode'; //
                                //15min remaining
                                zfifteenMinTimeRemaining = '1';
                            } else if (
                                value.totalTimeSumConvertoSecondsDub <= 600
                            ) {
                                var colorValue = 'orangecode';
                                //10min remaining
                                ztenMinTimeRemaining = '1';
                            } else if (
                                value.totalTimeSumConvertoSecondsDub <= 1200
                            ) {
                                var colorValue = 'redcode';
                                zfiveMinTimeRemaining = '1';
                                //5min remaining
                            } else {
                                var colorValue = 'greencode';
                            }
                        }
                        value.timesumArr = {
                            colorCode: '99457',
                            color: colorValue,
                        };

                        items.push(value.timesumArr);
                        value.items = items;

                        value.zfifteenMinTimeRemaining =
                            zfifteenMinTimeRemaining;
                        value.ztenMinTimeRemaining = ztenMinTimeRemaining;
                        value.zfiveMinTimeRemaining = zfiveMinTimeRemaining;
                    }
                    const fivethree_date = moment(value.fivethree_date).format(
                        'YYYY-MM-DD'
                    );
                    var checkFiveThree = moment(fivethree_date).isBetween(
                        this.requestParam.startDate,
                        this.requestParam.endDate,
                        'days',
                        '[]'
                    );
                    if (checkFiveThree == true) {
                        value.timesumArr = {
                            colorCode: '99453',
                            color: 'greencode',
                        };
                        items.push(value.timesumArr);
                        value.items = items;
                    }
                    if (value.brs != null) {
                        value.timesumArr = {
                            colorCode: '99454',
                            color: 'greencode',
                        };
                        items.push(value.timesumArr);
                        value.items = items;
                    }
                });

                this.serverResponse.next(this.list);
                this.total = this.encryptedResponse.data.total;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;

                if (this.requestParam.time_status == '5') {
                    const colsAmt = this.list.length;

                    this.list = this.list.filter(function (item) {
                        if (item.zfiveMinTimeRemaining == '1') {
                            console.log('item', item);
                            return true;
                        }
                    });
                    // console.log('this.list', this.list);

                    this.serverResponse.next(this.list);
                } else if (this.requestParam.time_status == '10') {
                    const colsAmt = this.list.length;

                    this.list = this.list.filter(function (item) {
                        if (item.ztenMinTimeRemaining == '1') {
                            console.log('item', item);
                            return true;
                        }
                    });
                    // console.log('this.list', this.list);

                    this.serverResponse.next(this.list);
                } else if (this.requestParam.time_status == '15') {
                    const colsAmt = this.list.length;

                    this.list = this.list.filter(function (item) {
                        if (item.zfifteenMinTimeRemaining == '1') {
                            console.log('item', item);
                            return true;
                        }
                    });
                    // console.log('this.list', this.list);

                    this.serverResponse.next(this.list);
                } else if (this.requestParam.time_status == '20') {
                    const colsAmt = this.list.length;
                    this.list = this.list.filter(function (item) {
                        if (item.ztragetTimeAchived == '1') {
                            console.log('item', item);
                            return true;
                        }
                    });

                    this.serverResponse.next(this.list);
                }
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

    setData(data) {
        this.router.navigate(['admin/patient-detail'], {
            queryParams: { patientUuid: data.patientUuid }, /*skipLocationChange: true*/
        });
    }

    getServerData(event?: PageEvent) {
        // console.log(event.pageIndex);
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
        this.page1.pageNumber = pageInfo;
        this.getList();
    }
    rows = [];
    selected = [];
    selectedArr = [];
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

    // getListForTimeStatus() {
    //     if (this.requestParam.time_status != '') {
    //         console.log('this.requestParam', this.requestParam.time_status);
    //         if (this.requestParam.time_status == '5') {
    //             this.list.forEach((value) => {
    //                 if (value.zfiveMinTimeRemaining == '1') {
    //                     console.log('value', value);
    //                 }
    //             });
    //         } else if (this.requestParam.time_status == '10') {
    //         } else if (this.requestParam.time_status == '15') {
    //         } else if (this.requestParam.time_status == '20') {
    //         }
    //     }
    // }

    filterChange(value, type) {
        if (type == 'status') {
            this.requestParam.time_status = value;
            if (this.requestParam.time_status != '') {
                this.getList();
            }
        }
        if (type == 'sortby') {
            this.requestParam.sortby = value;
            this.getList();
        }
        if (type == 'billingCode') {
            this.requestParam.billingCode = value;
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
        if(type == 'system'){
            this.requestParam.system = value;
            this.getList();
        }
        console.log('this.requestParam', this.requestParam);
    }

    resetForm(fromInput, toInput) {
        console.log('requestParam', this.requestParam);
        // this.requestParam.startDate = '';
        // this.requestParam.endDate = '';
        this.requestParam.time_status = '';
        this.requestParam.sortby = '';
        this.requestParam.billingCode = '';
        this.requestParam.search = '';
        this.searchInput.nativeElement.value = '';
        this.requestParam.system = '';
        // fromInput.value = '';
        // toInput.value = '';
        // this.range.reset();

        // this.range = new FormGroup({
        //     start: new FormControl(moment().startOf('month')),
        //     end: new FormControl(moment(new Date())),
        // });
        var date = new Date();
        this.range = new FormGroup({
            start: new FormControl(
                new Date(date.getFullYear(), date.getMonth(), 1)
            ),
            end: new FormControl(new Date()),
        });

        this.requestParam.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParam.endDate = moment(new Date()).format('YYYY-MM-DD');

        this.getList();
    }

    dateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        console.log('dateRangeStart.value', dateRangeStart.value);
        console.log('dateRangeEnd.value', dateRangeEnd.value);

        this.requestParam.startDate = moment(dateRangeStart.value)
            .local()
            .format('YYYY-MM-DD');

        this.requestParam.endDate = moment(dateRangeEnd.value)
            .local()
            .format('YYYY-MM-DD');
        // console.log('this.requestParam.startDate', this.requestParam);

        // console.log('this.requestParam', this.requestParam);
        this.getList();
    }
    billingsexporttocsv() {
        this.requestParam.selectedArr = [];
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.billingfileExport(encryptedRequest).subscribe(
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
    
    selectedbillingsexporttocsv(){
        if(this.selected.length<=0){
            this.MessageClass = 'error';
            this.Message = 'Please Select Data to export the file';
            setTimeout(() => {
                this.Message = '';
            }, 2000);
            return false;
        }
        this.selectedArr = [];
        this.selected.forEach((value) => {
            this.selectedArr.push(value.billinguuid);
        });
        this.requestParam.selectedArr = this.selectedArr;
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.billingfileExport(encryptedRequest).subscribe(
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
            'Patient-Billing-' +
            moment.utc().local().format('MMM-DD-YY-LT') +
            '.csv';
        //document.body.setAttribute('style', 'text-align:center');
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
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
