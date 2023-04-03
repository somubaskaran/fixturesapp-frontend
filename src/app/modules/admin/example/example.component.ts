import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    styleUrls: ['./dashboard.scss'],

    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent implements OnInit
{
    role:string;
    message:string;
    /**
     * Constructor
     */
    constructor(private _userService:UserService,private encrypt:EncryptDecryptService)
    {
        console.log('herer');
    }
    ngOnInit(){
        let roleEncryption = localStorage.getItem('accessModifier');
        const role_id =  this.encrypt.decryptData(roleEncryption).toString();
        console.log(role_id);
        this.role = role_id;
        if(this.role == '2'){
            this.message = 'You are logged in as doctor';
        }else if(this.role == '1'){
            this.message = 'You are logged in as admin';
        }
    }
}
