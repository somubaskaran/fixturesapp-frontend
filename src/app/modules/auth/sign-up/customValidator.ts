import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;
        console.log(value);
        const regexp = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9]{8,}$/;

        if (!value) {
            return null;
        }
        const regValid = regexp.test(value);

        return !regValid ? {patternValid:true}: null;
    }
}
export function mobileNumberValidator(): ValidatorFn{
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;
        console.log(value);
    

        if (!value) {
            return null;
        }
        let valid = true;
        console.log(value.toString().length);
        if(value.toString().length < 10){
            valid = false;
        }else{
            return null;
        }
        console.log(valid);
        

        return valid ? null:{max:true};
    }
}