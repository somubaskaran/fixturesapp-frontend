import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { DoctorService } from 'app/modules/doctor.service';
import { successResponseData } from 'app/core/response-schema';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import 'moment-timezone';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 2, name: 'Doctor Admin'},
               {id: 3, name: 'Doctor'},
               {id: 4, name: 'Finance'},
               {id: 5, name: 'Staff'},
            ];
    rangeAlert = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    // @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild('updateResolve') updateResolve: TemplateRef<any>;

    @ViewChild('searchInputAlert') searchInputAlert: ElementRef;
    @ViewChild('paginatorAlert') paginatorAlert: MatPaginator;
    //alertForm: FormGroup;
    addClass: string = 'list';
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponseAlert = new BehaviorSubject<any[]>([]);
    response = this.serverResponseAlert.asObservable();

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
    alertUuid: string;
    Message: string = '';
    MessageClass: string = '';
    alertlist: any[] = [];
    totalAlert: number = 0;
    alertresolveChecked = false;
    alertunresolveChecked = false;
    alertallChecked = true;
    link_to_patient = true;
    showPatient = true;
    resolvecount: number = 0;
    unresolvecount: number = 0;
    selected = 'desc';
    patientList: any[] = [];
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
    systemTotal: number = 0;
    sorting: any;
    inactive: number = 0;
    page = {
        limit: 5,
        count: 0,
        offset: 0,
        orderBy: 'myColumn1',
        orderDir: 'desc',
    };
    page1 = new alertListPageData();
    ColumnMode = ColumnMode;
    SelectionType = SelectionType;
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
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        order: { direction: '', active: '' },
        startDate: '',
        endDate: '',
        userstatus: '1',
        search: '',
        sortBy: 'desc',
    };
    todayDate: Date;
    updatetodayDate: Date;
    mindate: Date;

    selectedRow: any;
    alertNotes: string;

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
        this.page1.pageNumber = this.requestParamAlert.current;
        this.page1.size = this.requestParamAlert.pasgesize;
    }
    userExists(id) {
      return this.roles.some(function(el) {
        return el.id === id;
      }); 
    }
    ngOnInit(): void {
        this.todayDate = new Date();
        //this.getList()
        this.setPage(this.requestParamAlert.current);
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
    }
    setData(data) {
        console.log(data);
        var patientUuid = data.uuid;
        this.router.navigate(['doctor/patient-detail'], {
            queryParams: { patientUuid: data.patientUuid },
        });
    }
    getList() {
        //this.spinner.show();
        console.log('this.requestParamAlert', this.requestParamAlert);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParamAlert)
        );
        this.service.getAlertList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
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
                this.page1.totalElements = this.totalAlert;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
                // console.log(this.alertlist);
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
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParamAlert.current = event.pageIndex;
        this.requestParamAlert.pasgesize = event.pageSize;
        this.getList();
    }
    onSort(event) {
        const sort = event.sorts[0];
        // console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParamAlert.order.active = sort.prop;
        this.requestParamAlert.order.direction = sort.dir;
        this.page1.pageNumber = 0;
        this.getList();
    }
    setPage(pageInfo) {
        this.requestParamAlert.startDate = moment()
            .startOf('month')
            .format('YYYY-MM-DD');
        this.requestParamAlert.endDate = moment(new Date()).format(
            'YYYY-MM-DD'
        );
        this.page1.pageNumber = pageInfo;
        this.getList();
    }
    rows = [];
    selectedData = [];
    selectedArr : any;
    onSelect({ selected }) {
        //console.log('Select Event', selected );
        //const obj = {5.0: 10, 28.0: 14, 3.0: 6};

//const mapped = Object.keys(obj).map(key => ({type: key, value: selected[key]}));

//console.log(mapped);
        //selected.forEach(function(value){
            this.selectedArr = selected;
        //})
        
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
        this.getList();
    }
    resolveAlerts(){
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.selectedArr)
        );
        this.service.resolveAlerts(encryptedRequest).subscribe(
            (data: any) => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 200);
                this.elements.closeAll();
                this.getList();
                this.MessageClass = 'success';
                this.Message = data.data;
                setTimeout(() => {
                    this.Message = '';
                }, 2000);

         });
    }
    // statusChangeToDo(row) {
    //     //console.log(row);
    //     this.alertPopup.title = 'Change Status';
    //     this.alertPopup.message =
    //         'Are you sure you want to change the status of the selected To-Do item?';
    //     this.alertPopup.icon.show = true;
    //     this.alertPopup.icon.name = 'heroicons_outline:exclamation';
    //     this.alertPopup.icon.color = 'success';
    //     this.alertPopup.actions.confirm.show = true;
    //     this.alertPopup.actions.confirm.label = 'Ok';
    //     this.alertPopup.actions.confirm.color = 'warn';
    //     this.alertPopup.actions.confirm.show = true;
    //     this.alertPopup.actions.cancel.show = true;
    //     this.alertPopup.actions.cancel.label = 'Cancel';
    //     this.alertPopup.dismissible = false;
    //     // Open the dialog and save the reference of it
    //     const dialogRef = this._fuseConfirmationService.open(this.alertPopup);

    //     dialogRef.afterClosed().subscribe((result) => {
    //         if (result == 'confirmed') {
    //             let statusChange = 1;
    //             if (row.todoStatus == 1) {
    //                 statusChange = 0;
    //             }
    //             var sendData = {
    //                 alertUuid: row.alertUuid,
    //                 status: statusChange,
    //             };
    //             const encryptedRequest = this.encrypt.encryptData(
    //                 JSON.stringify(sendData)
    //             );
    //             //console.log(encryptedRequest);
    //             this.service.changeStatusToDo(encryptedRequest).subscribe(
    //                 (data: any) => {
    //                     // console.log('data', data);
    //                     this.getList();
    //                     this.MessageClass = 'success';
    //                     this.Message = data.data;
    //                     setTimeout(() => {
    //                         this.Message = '';
    //                     }, 2000);
    //                 },
    //                 (error: any) => {
    //                     //console.log(error);
    //                 }
    //             );
    //             // console.log('confirm');
    //         } else if (result == 'cancelled') {
    //             // console.log('canceled');
    //         }
    //     });
    // }

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
                this.getList();
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

    cancelPopup() {
        this.elements.closeAll();
        // this.alertForm.reset();
    }
    alertDateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        // console.log(dateRangeStart.value);
        // console.log(dateRangeEnd.value);

        this.requestParamAlert.startDate = dateRangeStart.value;
        this.requestParamAlert.endDate = dateRangeEnd.value;

        var datePipe = new DatePipe('en-US');
        this.requestParamAlert.startDate = datePipe.transform(
            dateRangeStart.value,
            'yyyy-MM-dd'
        );
        this.requestParamAlert.endDate = datePipe.transform(
            dateRangeEnd.value,
            'yyyy-MM-dd'
        );
        // console.log('this.requestParamAlert.startDate', this.requestParamAlert);

        // console.log('this.requestParamAlert', this.requestParamAlert);
        this.getList();
    }
    resetForm(fromInput, toInput) {
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

        this.searchInputAlert.nativeElement.value = '';
        // console.log('searchvalues', this.searchvalues);
        this.getList();
    }
    searchfn(searchValue) {
        this.requestParamAlert.search = searchValue.target.value;
        console.log('search', this.requestParamAlert.search);
        if (this.requestParamAlert.search.length >= 3) {
            this.getList();
        }
        if (this.requestParamAlert.search.length == 0) {
            this.getList();
        }
    }

    altfilterChange(value, type) {
        if (type == 'sortBy') {
            this.requestParamAlert.order.active = '';
            this.requestParamAlert.order.direction = '';
            console.log('requestParamAlert', this.requestParamAlert);
            this.requestParamAlert.sortBy = value;
            if (this.requestParamAlert.sortBy != '') {
                this.getList();
            }
        }
    }
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
