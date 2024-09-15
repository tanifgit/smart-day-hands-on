import {MediaMatcher} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IrisService } from './services/iris.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
    mobileQuery: MediaQueryList;
    title = 'smart-ui';

    constructor(@Inject(DOCUMENT) public document: Document,
        public auth: AuthService,
        public irisService: IrisService,
        changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher,
        private router: Router
    )
    {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener("change",this._mobileQueryListener);

        this.auth.isAuthenticated$.subscribe(
            authResponse => {
                if (authResponse !== false){
                    this.router.navigate(["/home"]);
                }
            }
        )

    }

    private _mobileQueryListener: () => void;

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
      }    
}
