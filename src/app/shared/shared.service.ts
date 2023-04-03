import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { Subject } from 'rxjs';

@Injectable()
export class SharedService {
    public accessSpecifier: Subject<any> = new Subject<any>();
    access = this.accessSpecifier.asObservable();
    public role: string;
    constructor(
        private encrypt: EncryptDecryptService,
        private _router: Router,
        private currentRoute: ActivatedRoute
    ) {}
    setRedirection() {
        let roleEncryption = localStorage.getItem('accessModifier');
        //console.log(this._router.url);
        if (roleEncryption != null) {
            const role_id = this.encrypt.decryptData(roleEncryption).toString();
            this.role = role_id;
            if (this.role == '2' || this.role == '3' || this.role == '4' || this.role == '5') {
                this.accessSpecifier.next(this.role);
                if (this._router.url == '/') {
                    //this._router.navigateByUrl('/doctor');
                    setTimeout(() => {this._router.navigateByUrl('/doctor')}, 500);
                }
                //this._router.navigateByUrl('/doctor');
                //this._router.navigateByUrl(this._router.url);
            } else if (this.role == '1') {
                this.accessSpecifier.next(this.role);
                if (this._router.url == '/') {
                    //this._router.navigateByUrl('/admin');
                    setTimeout(() => {this._router.navigateByUrl('/admin')}, 500);
                }
                //this._router.navigateByUrl(this._router.url);
            }
        } else {
            this._router.navigateByUrl(this._router.url);
        }
    }
}
