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
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 2, name: 'Doctor Admin'},
               {id: 3, name: 'Doctor'},
               {id: 4, name: 'Finance'},
               {id: 5, name: 'Staff'},
            ];
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
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
    }
    userExists(id) {
      return this.roles.some(function(el) {
        return el.id === id;
      }); 
    }
    // @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild('updateToDoList') updateToDoList: TemplateRef<any>;
    @ViewChild('addToDoList') addToDoList: TemplateRef<any>;

    @ViewChild('searchInput') searchInput: ElementRef;
    toDoForm: FormGroup;
    addClass: string = 'list';
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();

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
    Message: string = '';
    MessageClass: string = '';
    list: any[] = [];
    total: number = 0;
    openchecked = false;
    closechecked = false;
    allchecked = true;
    link_to_patient = true;
    showPatient = true;
    opencount: number = 0;
    closecount: number = 0;
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
    page1 = new todoListPageData();

    requestParam: {
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
    };
    todayDate: Date;
    updatetodayDate: Date;
    mindate: Date;
    //searchvalues: string = '';

    ngOnInit(): void {
        //this.getList()
        this.setPage(this.requestParam.current);
        //this.service.apicheck().subscribe((data: any) => {});

        this.toDoForm = this._formBuilder.group({
            item_type: ['', Validators.required],
            due_date: ['', Validators.required],
            description: ['', Validators.required],
            link_to_patient: [''],
            patient: [''],
        });
    }

    getList() {
        //this.spinner.show();
        // console.log('this.requestParam', this.requestParam);
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getToDoList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.todoListData;

                console.log(data);
                this.list.forEach((value) => {
                    if (value.todoStatus == 0) {
                        value.status = 'Closed';
                    } else if (value.todoStatus == 1) {
                        value.status = 'Open';
                    }
                });

                this.serverResponse.next(this.list);
                this.total = this.encryptedResponse.data.total;
                this.opencount = this.encryptedResponse.data.open;
                this.closecount = this.encryptedResponse.data.close;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
                // console.log(this.list);
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
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
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
    listViewChange(value) {
        // console.log(value);
        if (value == 'grid-view') {
            this.addClass = 'grid-view';
        } else if (value == 'list') {
            this.addClass = 'list';
        }
    }
    filterChange(value) {
        // console.log(value);
        if (value == 'open') {
            this.allchecked = false;
            this.closechecked = false;
            this.requestParam.status = '1';
        } else if (value == 'close') {
            this.allchecked = false;
            this.openchecked = false;
            this.requestParam.status = '0';
        } else if (value == 'all') {
            this.closechecked = false;
            this.openchecked = false;
            this.requestParam.status = '';
        }
        //console.log('this.requestParam', this.requestParam);
        this.getList();
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
                        this.getList();
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
                // console.log('confirm');
            } else if (result == 'cancelled') {
                // console.log('canceled');
            }
        });
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
                    this.getList();
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
        this.getPatientList();
        // this.spinner.show();
        // console.log(row);
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

        // console.log('updatetodayDate', this.updatetodayDate);
        if (row.patientUuid != null) {
            this.link_to_patient = true;
            this.showPatient = true;
            this.patient = row.patientUuid;
        } else {
            this.link_to_patient = false;
            this.showPatient = false;
            this.patient = '';
        }
        // console.log('patientUuid', row.patientUuid);
        // console.log(this.link_to_patient);

        let dialogRef = this.elements.open(this.updateToDoList, {
            width: '450px',
        });
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
    getPatientList() {
        this.requestParam.userstatus = '1';
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getActivePatientList(encryptedRequest).subscribe(
            (data: any) => {
                // console.log(data);
                this.encryptedResponse = data;
                this.patientList = this.encryptedResponse.data.patientDetails;
                // console.log('Patient List', this.patientList);
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
                    //console.log(data);

                    // this.requestParam.status = '-1';
                    // this.requestParam.status;
                    this.getList();
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
    dateRangeChange(
        dateRangeStart: HTMLInputElement,
        dateRangeEnd: HTMLInputElement
    ) {
        // console.log(dateRangeStart.value);
        // console.log(dateRangeEnd.value);

        this.requestParam.startDate = dateRangeStart.value;
        this.requestParam.endDate = dateRangeEnd.value;

        var datePipe = new DatePipe('en-US');
        this.requestParam.startDate = datePipe.transform(
            dateRangeStart.value,
            'yyyy-MM-dd'
        );
        this.requestParam.endDate = datePipe.transform(
            dateRangeEnd.value,
            'yyyy-MM-dd'
        );
        // console.log('this.requestParam.startDate', this.requestParam);

        // console.log('this.requestParam', this.requestParam);
        this.getList();
    }
    resetForm(fromInput, toInput) {
        console.log('requestParam', this.requestParam);
        this.requestParam.startDate = '';
        this.requestParam.endDate = '';
        this.requestParam.status = '';
        this.requestParam.search = '';
        this.allchecked = true;
        this.openchecked = false;
        this.closechecked = false;
        fromInput.value = '';
        toInput.value = '';
        // this.searchvalues = null;

        this.searchInput.nativeElement.value = '';
        // console.log('searchvalues', this.searchvalues);
        this.getList();
    }
    searchfn(searchValue) {
        this.requestParam.search = searchValue.target.value;
        console.log('search', this.requestParam.search);
        if (this.requestParam.search.length >= 3) {
            this.getList();
        }
        if (this.requestParam.search.length == 0) {
            this.getList();
        }
    }
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
