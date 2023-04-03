import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { PopupWindowComponent } from 'app/modules/common/popup-window/popup-window.component';
import { DoctorService } from 'app/modules/doctor.service';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { MatInputModule } from '@angular/material/input';
import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as moment from 'moment';
import 'moment-timezone';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
    selector: 'app-patientlist',
    templateUrl: './patientlist.component.html',
    styleUrls: ['./patientlist.component.scss'],
})
export class PatientlistComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 2, name: 'Doctor Admin'},
               {id: 3, name: 'Doctor'},
               {id: 4, name: 'Finance'},
               {id: 5, name: 'Staff'},
            ];
    addClass: string = 'list';
    @ViewChild('search', { static: false }) search: ElementRef;
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    response: any[] = [];
    units: any;
    total: number;
    systemTotal: number;
    pageEvent: PageEvent;
    active: number;
    inactive: number;
    selected = 'desc';
    alertPopup: FuseConfirmationConfig;
    shippingAddressModel = true;
    bloodPressureMonitor = true;
    requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        blood_pressure: number;
        pulse: number;
        order: { direction: string; active: string };
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: 5,
        pulse: 5,
        order: { direction: '', active: '' },
    };

    patientConsentlist = [
        { name: 'yes', checked: false, value: 1 },
        { name: 'no', checked: true, value: 0 },
    ];
    preferredLanguageList = [
        { name: 'English', checked: true, value: 0 },
        { name: 'Spanish', checked: false, value: 1 },
    ];

    cuffList = [
        {
            name: 'Regular cuff',
            checked: true,
            value: 0,
            text: '9" to 17" /22 to 42cm',
        },
        {
            name: 'Large cuff',
            checked: false,
            value: 1,
            text: '17" to 20" /42 to 50cm',
        },
    ];
    placemackerList = [
        { name: 'Yes', checked: false, value: 1 },
        { name: 'No', checked: true, value: 0 },
    ];
    weightScaleSizeList = [
        {
            name: 'Regular',
            checked: false,
            value: 0,
            text: '5 to 297 lbs / 2 - 135 kgs',
        },
        {
            name: 'Large',
            checked: true,
            value: 1,
            text: '11 to 550 lbs / 5 - 250 kgs',
        },
    ];
    chosenItem = this.patientConsentlist[0].name;
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    fourthForm: FormGroup;
    matcher = new MyErrorStateMatcher();

    @ViewChild('firstFormDialog') firstFormDialog: TemplateRef<any>;
    @ViewChild('secondFormDialog') secondFormDialog: TemplateRef<any>;
    @ViewChild('thirdFormDialog') thirdFormDialog: TemplateRef<any>;
    @ViewChild('fourthFormDialog') fourthFormDialog: TemplateRef<any>;
    @ViewChild('patientSummeryDialog') patientSummeryDialog: TemplateRef<any>;
    @ViewChild('multiplepatientDialog') multiplepatientDialog: TemplateRef<any>;

    specializationList: string[] = ['Cardiology'];
    doctorsList: string[] = ['Maniz', 'Kiruba', 'Logesh'];
    stateList: string[] = ['Califorina', 'Aliska', 'Washington'];
    patienName: string;
    DOB: string;
    email: string;
    mobileNumber: string;
    countrycode: string;
    patientConsent: string;
    address: string;
    gender: string;
    MRN: string;
    icdcode: string;
    device_bloob_pressure: string = '';
    device_weight: string;
    department: string;
    location: string;
    fileToUpload: File | null = null;
    tomorrow = new Date();
    oldDate = new Date(1930, 1 - 1, 1);
    Message: string = '';
    MessageClass: string = '';
    public customPatterns = { '0': { pattern: new RegExp('[a-zA-Z]') } };
    syshigh: number;
    disableDeviceModel: boolean = false;
    syslow: number;
    diahigh: number;
    dialow: number;
    averagesyslow: number;
    averagesyshigh: number;
    averagediahigh: number;
    averagedialow: number;
    twentyfourhr: number;
    seventytwohr: number;
    patientDetailData: string;
    constructor(
        private service: DoctorService,
        private encrypt: EncryptDecryptService,
        private elements: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService
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
    }
    userExists(id) {
      return this.roles.some(function(el) {
        return el.id === id;
      }); 
    }
    ngOnInit(): void {
        this.tomorrow.setDate(this.tomorrow.getDate());
        //this.olddate.setDate(this.olddate.getDate());
        this.getList();
        this.getStates();
        this.getDoctors();
        this.disableDeviceModel = false;
        this.firstForm = this._formBuilder.group({
            specialization: [''/*, Validators.required*/],
            doctor: ['', Validators.required],
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
                [],
            ],
            mobileNumber: [
                '',
                [Validators.required, Validators.pattern('^[0-9]{10}$')],
            ],
            homeNumber: [
                '',
                [Validators.pattern('^[0-9]{10}$')],
            ],
            patientConsent: [''],
            mrn: ['', Validators.required],
            gender: ['', Validators.required],
            icdcode: ['I10', Validators.required],
            preferredLanguage: [''],
            /*specialization: [''],
      doctor: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      email: [''],
      mobileNumber: [''],
      homeNumber: [''],
      patientConsent: [''],
      mrn: [''],
      gender:[''],
      icdcode:[''],
      preferredLanguage:['']*/
        });

        this.secondForm = this._formBuilder.group({
            addressline1:  [
                '',[]],
            addressline2: [
                '',[]],
            city: [
                '',[]],
            state: [
                '',[]],
            zip: [
                '',[]],
            shippingAddress: ['', Validators.required],
            shippingaddressline1: [''],
            shippingaddressline2: [''],
            shippingcity: [''],
            shippingstate: [''],
            shippingzip: [''],
            /*addressline1: [''],
      addressline2: [''],
      city: [''],
      state: [''],
      zip: [''],
      shippingAddress: [''],
      shippingaddressline1: [''],
      shippingaddressline2: [''],
      shippingcity: [''],
      shippingstate: [''],
      shippingzip: [''],*/
        });
        this.thirdForm = this._formBuilder.group({
            bloodPressure: [false, Validators.requiredTrue],
            cuff: [''],
            placemacker: [''],
            weightScale: [''],
            weightScaleSize: [''],
            excludeHub: [''],
            excludeHubNumber: [''],
        });
        this.fourthForm = this._formBuilder.group({
            thresholdLater: [''],
            syshigh: [''],
            syslow: [''],
            diahigh: [''],
            dialow: [''],
            averagesyshigh: [''],
            averagesyslow: [''],
            averagediahigh: [''],
            averagedialow: [''],
            twentyfourhr: [''],
            seventytwohr: [''],
            sevendays: [''],
            tenreadings: [''],
        });

        //this.firstForm.controls['firstName'].setValue( 'somu' );
        //this.firstForm.controls['icdcode'].disable();
    }
    trimText(text: string) {
        return text.trim();
    }
    arrayBuffer: any;
    reportUrl: string = '';
    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        if (
            this.fileToUpload.type ==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' /*|| this.fileToUpload.type ==
            'text/csv'*/
        ) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i)
                    arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join('');
                var workbook = XLSX.read(bstr, { type: 'binary' });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                console.log(
                    XLSX.utils.sheet_to_json(worksheet, { raw: true }).length
                );
                if (
                    XLSX.utils.sheet_to_json(worksheet, { raw: true }).length >
                    0
                ) {
                    const formData = new FormData();
                    formData.append('file', files.item(0));
                    this.service.addBulkUpload(formData).subscribe(
                        (data: any) => {
                            console.log(data);
                            if (data.success == true) {
                                if (data.data.error == 0) {
                                    this.MessageClass = 'success';
                                    this.Message = data.msg;
                                    this.reportUrl = data.reportUrl;
                                } else if(data.data.error == data.data.total){
                                    this.MessageClass = 'error';
                                    this.Message =
                                        'Not Inserted kindly check the report';
                                    this.reportUrl = data.reportUrl;
                                } else {
                                    this.MessageClass = 'error';
                                    this.Message =
                                        'Partially Inserted kindly check the report';
                                    this.reportUrl = data.reportUrl;
                                }
                            } else {
                                this.MessageClass = 'error';
                                this.Message = data.msg;
                            }
                            this.elements.closeAll();
                            this.getList();
                            setTimeout(() => {
                                // <<<---using ()=> syntax
                                this.Message = '';
                            }, 6000);
                        },
                        (error: any) => {
                            this.MessageClass = 'error';
                            this.Message = 'Wrong File format';
                            //this.getList();
                            setTimeout(() => {
                                // <<<---using ()=> syntax
                                this.Message = '';
                            }, 6000);
                        }
                    );
                } else {
                    this.MessageClass = 'error';
                    this.Message = 'File is Empty';
                    setTimeout(() => {
                        // <<<---using ()=> syntax
                        this.Message = '';
                    }, 6000);
                }
            };
            fileReader.readAsArrayBuffer(this.fileToUpload);
        } else {
            this.MessageClass = 'error';
            this.Message = 'Wrong File';
            setTimeout(() => {
                // <<<---using ()=> syntax
                this.Message = '';
            }, 6000);
        }
    }
    onBpSingleReadingSys(event) {
        if (this.syshigh == null) {
            this.fourthForm.get('syslow').setValidators([Validators.max(999)]);
            this.fourthForm.get('syslow').updateValueAndValidity();
        } else if (this.syshigh < this.syslow) {
            this.fourthForm
                .get('syslow')
                .setValidators([Validators.max(this.syshigh)]);
            this.fourthForm.get('syslow').updateValueAndValidity();
        } else if (this.syshigh > this.syslow) {
            this.fourthForm.get('syslow').clearValidators();
            this.fourthForm.get('syslow').updateValueAndValidity();
        }
    }
    onBpSingleReadingDia(event) {
        if (this.diahigh == null) {
            this.fourthForm.get('dialow').setValidators([Validators.max(999)]);
            this.fourthForm.get('dialow').updateValueAndValidity();
        } else if (this.diahigh < this.dialow) {
            this.fourthForm
                .get('dialow')
                .setValidators([Validators.max(this.diahigh)]);
            this.fourthForm.get('dialow').updateValueAndValidity();
        } else if (this.diahigh > this.dialow) {
            this.fourthForm.get('dialow').clearValidators();
            this.fourthForm.get('dialow').updateValueAndValidity();
        }
    }
    onBpSingleAverageSys(event) {
        console.log(this.averagesyshigh);
        console.log(this.averagesyslow);
        if (this.averagesyshigh == null) {
            this.fourthForm
                .get('averagesyslow')
                .setValidators([Validators.max(999)]);
            this.fourthForm.get('averagesyslow').updateValueAndValidity();
        } else if (this.averagesyshigh < this.averagesyslow) {
            this.fourthForm
                .get('averagesyslow')
                .setValidators([Validators.max(this.averagesyshigh)]);
            this.fourthForm.get('averagesyslow').updateValueAndValidity();
        } else if (this.averagesyshigh > this.averagesyslow) {
            this.fourthForm.get('averagesyslow').clearValidators();
            this.fourthForm.get('averagesyslow').updateValueAndValidity();
        }
    }
    onBpSingleAverageDia(event) {
        /*console.log(this.averagesyshigh);
    console.log(this.averagesyslow);*/
        if (this.averagediahigh == null) {
            this.fourthForm
                .get('averagedialow')
                .setValidators([Validators.max(999)]);
            this.fourthForm.get('averagedialow').updateValueAndValidity();
        } else if (this.averagediahigh < this.averagedialow) {
            this.fourthForm
                .get('averagedialow')
                .setValidators([Validators.max(this.averagediahigh)]);
            this.fourthForm.get('averagedialow').updateValueAndValidity();
        } else if (this.averagediahigh > this.averagedialow) {
            this.fourthForm.get('averagedialow').clearValidators();
            this.fourthForm.get('averagesyslow').updateValueAndValidity();
        }
    }
    onWeightScale(event) {}
    setData(data) {
        var patientUuid = data.uuid;
        this.router.navigate(['doctor/patient-detail'], {
            queryParams: { patientUuid: data.uuid }, /*skipLocationChange: true*/
        });
        /*const encryptedRequest = this.encrypt.encryptData(JSON.stringify(patientUuid));
    this.service.getPatientDetail(encryptedRequest).subscribe((data: any) => {      
      this.patientDetailData = data.data[0];
      console.log(this.patientDetailData);
      return false;
    },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.encryptedResponse = error.error.data;
        console.log(this.encryptedResponse);
      });*/
    }
    preferredLanguageChange(event) {
        //console.log(event.name, event.value);
        this.preferredLanguageList.forEach((value) => {
            if (value.name == event.name) {
                value.checked = true;
            } else {
                value.checked = false;
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
    /*cuffListChange(event){
    console.log('aaa');
    return false;
    this.patientConsentlist.forEach((value) => {
      if(value.name==event.name){
          value.checked = true;
      }else{
          value.checked = false;
      }
    });
  }*/
    openMultiplePatient() {
        let dialogRef = this.elements.open(this.multiplepatientDialog, {
            width: '600px',
        });
    }
    triggerImage() {
        let element = document.getElementById('file');
        element.click();
        return false;
    }
    shippingAddressChange(event) {
        console.log(event.checked);
        this.shippingAddressModel = event.checked;
        if (event.checked == false) {
            this.secondForm
                .get('shippingaddressline1')
                .setValidators([Validators.required]);
            this.secondForm
                .get('shippingaddressline1')
                .updateValueAndValidity();
            this.secondForm
                .get('shippingaddressline2')
                .setValidators([Validators.required]);
            this.secondForm
                .get('shippingaddressline2')
                .updateValueAndValidity();
            this.secondForm
                .get('shippingcity')
                .setValidators([Validators.required]);
            this.secondForm.get('shippingcity').updateValueAndValidity();
            this.secondForm
                .get('shippingstate')
                .setValidators([Validators.required]);
            this.secondForm.get('shippingstate').updateValueAndValidity();
            this.secondForm
                .get('shippingzip')
                .setValidators([Validators.required]);
            this.secondForm.get('shippingzip').updateValueAndValidity();
        } else {
            this.secondForm.get('shippingaddressline1').clearValidators();
            this.secondForm
                .get('shippingaddressline1')
                .updateValueAndValidity();
            this.secondForm.get('shippingaddressline2').clearValidators();
            this.secondForm
                .get('shippingaddressline2')
                .updateValueAndValidity();
            this.secondForm.get('shippingcity').clearValidators();
            this.secondForm.get('shippingcity').updateValueAndValidity();
            this.secondForm.get('shippingstate').clearValidators();
            this.secondForm.get('shippingstate').updateValueAndValidity();
            this.secondForm.get('shippingzip').clearValidators();
            this.secondForm.get('shippingzip').updateValueAndValidity();
        }
    }
    thresholdLaterChecked: string;
    thresholdLaterChange(event) {
        this.thresholdLaterChecked = event.checked;
    }
    excludeHubChecked: string;
    excludeChange(event) {
        this.excludeHubChecked = event.checked;
        /*if (event.checked == true) {
            this.thirdForm
                .get('excludeHubNumber')
                .setValidators([Validators.required]);
            this.thirdForm.get('excludeHubNumber').updateValueAndValidity();
        }else{
            this.thirdForm.get('excludeHubNumber').clearValidators();
            this.thirdForm
                .get('excludeHubNumber')
                .updateValueAndValidity();
        }*/
    }
    placemackerselected: string;
    placemackerChange(event, listName) {
        this.placemackerselected = event.value;
        console.log(event.name);
        console.log(listName);
        listName.forEach((value) => {
            if (value.name == event.name) {
                value.checked = true;
            } else {
                value.checked = false;
            }
        });
    }
    /*uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }*/
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
    getDoctors() {
        this.service.getDoctors().subscribe(
            (data: any) => {
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
        this.service.getPatientList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                console.log('data', data);
                this.encryptedResponse = data;
                this.response = this.encryptedResponse.data.patientDetails;
                this.units = this.encryptedResponse.data.units;
                this.total = this.encryptedResponse.data.total;
                this.systemTotal = this.encryptedResponse.data.systemTotalvalue;
                this.active = this.encryptedResponse.data.active;
                this.inactive = this.encryptedResponse.data.inactive;
                console.log(this.response);
                this.response.forEach((value) => {
                    value.totalTime = (value.totalTime==null?0:value.totalTime);
                    /*if (value.lastSystolic == null) {
                        value.lastSystolic = 0;
                    }
                    if (value.lastDiastolic == null) {
                        value.lastDiastolic = 0;
                    }*/
                    /*if (value.blood_pressure == null) {
          value.blood_pressure = '-';
        }
        if (value.lhb == null) {
          value.lhb = '-';
        }*/
                });
            },
            (error: any) => {
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }

    filterChange(value, type) {
        console.log(value);
        if (type == 'status') {
            if (value == 'active') {
                this.requestParam.status = '1';
            } else if (value == 'inactive') {
                this.requestParam.status = '0';
            } else {
                this.requestParam.status = '';
            }
            this.getList();
        } else if (type == 'type') {
            this.requestParam.type = value;
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
    getServerData(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
        this.getList();
    }
    addPatient() {
        /*const dialogRef = this.elements.open(PopupWindowComponent, {
      data: {},
      hasBackdrop: false,
      panelClass: 'element-layout-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.agree) {
        setTimeout(() => {
          //this.signInForm.get('agree').setErrors(null);
        });
      } else {
        //this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
      }
      console.log('The dialog was closed');
    });*/
        let dialogRef = this.elements.open(this.firstFormDialog);
        this.shippingAddressModel = true;
        /*dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result !== "no") {
            const enabled = "Y";
            console.log(result);
          } else if (result === "no") {
            console.log("User clicked no.");
          }
        }
      });*/
    }
    cancelPopup() {
        this.elements.closeAll();
        this.firstForm.reset();
        this.secondForm.reset();
        this.thirdForm.reset();
        this.fourthForm.reset();
        this.modelFirstName = '';
        this.modelLastName = '';
        this.modelMrn = '';
        this.modelIcd = 'I10';
        this.modelAddressLine1 = '';
        this.modelAddressLine2 = '';
        this.modelCity = '';
        this.modelZip = '';
        this.modelShippingAddressLine1 = '';
        this.modelShippingAddressLine2 = '';
        this.modelShippingCity = '';
        this.modelShippingZip = '';
        this.modelexcludeHubNumber = '';
    }
    backform: number = 0;
    onfirstFormSubmit() {
        console.log(this.mobileNumber);
        console.log(this.backform);
        if (this.firstForm.valid) {
            console.log(this.firstForm.value);
            this.elements.closeAll();
            let dialogRef = this.elements.open(this.secondFormDialog);
            this.backform++;
            //this.updateDOB(this.firstForm.value.dateOfBirth);
        }
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
    modelexcludeHubNumber: string;
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
        if (modelName == 'modelexcludeHubNumber') {
            this.modelexcludeHubNumber = event.trim();
        }
    }
    /*removeSpaceLastname(event){
    this.modelLastName = this.firstForm.value.lastName.replace(/\s/g, "");
  } 
  removeSpacemrn(event){
    this.modelMrn = this.firstForm.value.mrn.replace(/\s/g, "");
  }
  removeSpaceicd(event){
    this.modelIcd = this.firstForm.value.icdcode.replace(/\s/g, "");
  } */
    /*updateDOB(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    console.log(dateObject.value);
    const stringified = JSON.stringify(dateObject.value);
    const dob = stringified.substring(1, 11);
    console.log(dob);
  }*/
    onSecondFormSubmit() {
        if (this.secondForm.valid) {
            console.log(this.secondForm.value);
            this.elements.closeAll();
            let dialogRef = this.elements.open(this.thirdFormDialog);
            this.backform++;
        }
    }
    onThirdFormSubmit() {
        if (this.thirdForm.valid) {
            this.elements.closeAll();
            let dialogRef = this.elements.open(this.fourthFormDialog);
            this.backform++;
            console.log(this.backform);
        }
    }
    onFourthFormSubmit() {
        if (this.fourthForm.valid) {
            console.log(this.fourthForm.value);
            //console.log(this.stateList[this.secondForm.value.state]);
            this.elements.closeAll();
            let dialogRef = this.elements.open(this.patientSummeryDialog);
            this.backform++;
            console.log(this.backform);
            this.patienName =
                this.firstForm.value.firstName +
                ' ' +
                this.firstForm.value.lastName;
            this.DOB = this.firstForm.value.dateOfBirth.format('MMM DD,YYYY');
            this.email = this.firstForm.value.email;
            this.mobileNumber = this.firstForm.value.mobileNumber;
            this.countrycode = this.firstForm.value.countrycode;
            this.patientConsent =
                (this.firstForm.value.patientConsent == '' ||
                this.firstForm.value.patientConsent == '0'
                    ? 'NO'
                    : 'YES');
            this.address =(this.secondForm.value.addressline1 != undefined ? this.secondForm.value.addressline1 +
                ',' +
                this.secondForm.value.addressline2 : ' ');
                
            var gender = this.getGender(this.firstForm.value.gender);
            this.gender = gender;
            this.MRN = this.firstForm.value.mrn;
            this.icdcode = this.firstForm.value.icdcode;
            this.device_bloob_pressure =
                this.thirdForm.value.cuff == 1 ? 'Large cuff' : 'Regular Cuff';
            this.device_weight =
                this.thirdForm.value.weightScaleSize == 1 ? 'Large' : 'Regular';
            this.department = this.firstForm.value.specialization;
            var state: any = this.stateList[this.secondForm.value.state - 1];
            this.location = state.name;
        }
    }
    getGender(gender) {
        if (gender == '0') {
            return 'male';
        } else if (gender == '1') {
            return 'female';
        }
    }
    emailError: string = '';
    onAddPatient() {
        //var dob = this.firstForm.value.dateOfBirth.format("MMM DD,YYYY");
        var sendData = {
            specialization: this.firstForm.value.specialization,
            doctor: this.firstForm.value.doctor,
            firstName: this.firstForm.value.firstName,
            lastName: this.firstForm.value.lastName,
            dateOfBirth: this.firstForm.value.dateOfBirth.format('YYYY-MM-DD'),
            email: this.firstForm.value.email,
            countrycode : (this.firstForm.value.countrycode != '' ? this.firstForm.value.countrycode : ''),
            mobileNumber: this.firstForm.value.mobileNumber,
            homeNumber: this.firstForm.value.homeNumber,
            patientConsent:
                this.firstForm.value.patientConsent == '' ||
                this.firstForm.value.patientConsent == '0'
                    ? '0'
                    : '1',
            mrn: this.firstForm.value.mrn,
            gender: this.firstForm.value.gender,
            icdcode: this.firstForm.value.icdcode,
            preferredLanguage:
                this.firstForm.value.preferredLanguage == 1 ? '1' : '0',
            addressline1: (this.secondForm.value.addressline1 == undefined ? "" : this.secondForm.value.addressline1),
            addressline2: (this.secondForm.value.addressline2 == undefined ? "" : this.secondForm.value.addressline2),
            city: (this.secondForm.value.city == undefined ? "" : this.secondForm.value.city),
            state: (this.secondForm.value.state == undefined ? "" : this.secondForm.value.state),
            zip: (this.secondForm.value.zip == undefined ? "" : this.secondForm.value.zip),
            shippingAddress:
                this.secondForm.value.shippingAddress == true ? '1' : '0',
            shippingaddressline1: this.secondForm.value.shippingaddressline1,
            shippingaddressline2: this.secondForm.value.shippingaddressline2,
            shippingcity: this.secondForm.value.shippingcity,
            shippingstate: this.secondForm.value.shippingstate,
            shippingzip: this.secondForm.value.shippingzip,
            bloodPressure:
                this.thirdForm.value.bloodPressure == true ? '1' : '0',
            cuff:
                this.thirdForm.value.cuff == ''
                    ? '0'
                    : this.thirdForm.value.cuff,
            excludeHub : this.thirdForm.value.excludeHub == true ? '1' : '0',        
            excludeHubNumber : this.thirdForm.value.excludeHubNumber == undefined ? '' : this.thirdForm.value.excludeHubNumber,
            placemacker:
                this.thirdForm.value.placemacker == ''
                    ? '0'
                    : this.thirdForm.value.placemacker,
            weightScale: this.thirdForm.value.weightScale == true ? '1' : '0',
            weightScaleSize:
                this.thirdForm.value.weightScaleSize == ''
                    ? '0'
                    : this.thirdForm.value.weightScaleSize,
            sevendays: this.fourthForm.value.sevendays == true ? '1' : '0',
            tenreadings: this.fourthForm.value.tenreadings == true ? '1' : '0',
            syshigh: (this.fourthForm.value.syshigh == undefined?'':this.fourthForm.value.syshigh),
            syslow: (this.fourthForm.value.syslow == undefined?'':this.fourthForm.value.syslow),
            diahigh: (this.fourthForm.value.diahigh == undefined?'':this.fourthForm.value.diahigh),
            dialow: (this.fourthForm.value.dialow == undefined?'':this.fourthForm.value.dialow),
            averagesyshigh: (this.fourthForm.value.averagesyshigh == undefined?'':this.fourthForm.value.averagesyshigh),
            averagesyslow: (this.fourthForm.value.averagesyslow == undefined?'':this.fourthForm.value.averagesyslow),
            averagediahigh: (this.fourthForm.value.averagediahigh == undefined?'':this.fourthForm.value.averagediahigh),
            averagedialow: (this.fourthForm.value.averagedialow == undefined?'':this.fourthForm.value.averagedialow),
        };
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.service.addPatient(encryptedRequest).subscribe(
            (data: any) => {
                //var successResponse = this.encrypt.decryptData(data.data);
                if (data.success == true) {
                    this.firstForm.reset();
                    this.secondForm.reset();
                    this.thirdForm.reset();
                    this.fourthForm.reset();
                    this.modelFirstName = '';
                    this.modelLastName = '';
                    this.modelMrn = '';
                    this.modelIcd = 'I10';
                    this.modelAddressLine1 = '';
                    this.modelAddressLine2 = '';
                    this.modelCity = '';
                    this.modelZip = '';
                    this.modelShippingAddressLine1 = '';
                    this.modelShippingAddressLine2 = '';
                    this.modelShippingCity = '';
                    this.modelShippingZip = '';
                    this.modelexcludeHubNumber = '';
                    this.MessageClass = 'success';
                    this.Message = data.msg;
                } else {
                    this.MessageClass = 'error';
                    this.Message = data.msg;
                }
                this.elements.closeAll();
                this.getList();
                setTimeout(() => {
                    // <<<---using ()=> syntax
                    this.Message = '';
                }, 6000);
            },
            (error: any) => {
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                /*setTimeout(()=>{                           // <<<---using ()=> syntax
                this.Message='Email and Mobile Number are Unique';
                this.MessageClass = 'error';
            }, 6000);*/
                this.elements.closeAll();
                let dialogRef = this.elements.open(this.firstFormDialog);
                this.backform = 0;
                this.emailError = 'Email and Mobile Number are Unique';
            }
        );
    }
    back() {
        this.elements.closeAll();
        this.backform--;
        console.log(this.backform);
        if (this.backform == 0) {
            let dialogRef = this.elements.open(this.firstFormDialog);
        } else if (this.backform == 1) {
            let dialogRef = this.elements.open(this.secondFormDialog);
        } else if (this.backform == 2) {
            let dialogRef = this.elements.open(this.thirdFormDialog);
        } else if (this.backform == 3) {
            let dialogRef = this.elements.open(this.fourthFormDialog);
        }
    }
    editForm() {
        this.elements.closeAll();
        let dialogRef = this.elements.open(this.firstFormDialog);
        this.backform = 0;
    }
    exporttocsv() {
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.fileExport(encryptedRequest).subscribe(
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
    recordsexporttocsv() {
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.recordsfileExport(encryptedRequest).subscribe(
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
            'Patient-List-' +
            moment.utc().local().format('MMM-DD-YY-LT') +
            '.csv';
        document.body.setAttribute('style', 'text-align:center');
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
    }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || isSubmitted));
    }
}
