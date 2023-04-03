import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
    @ViewChild('helpAndSupport') helpAndSupport: TemplateRef<any>;
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User = {
        avatar: '',
        name: '',
        id: '',
        email_address: '',
        status: '',
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private encrypt: EncryptDecryptService,
        private elements: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        /* this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                console.log(user);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }); */
        // this._userService.get().subscribe((user: User) => {
        //     this.user = user;
        //     //this.user.avatar = 'assets/images/avatars/' + this.user.avatar;
        //     this.user.avatar = 'assets/images/avatars/profile.jpg';
        //     //console.log(this.user);
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status,
        });
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }

    showhelpandsupport(){
        let dialogRef = this.elements.open(this.helpAndSupport, {
            width: '450px',
        });
    }
    cancelPopup() {
        this.elements.closeAll();
    }
    setProfile(){
        this._router.navigate(['doctor/userprofile']);
    }
}
