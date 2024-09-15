import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IrisService } from '../services/iris.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    private email: string | undefined
    public isSaved = false;
    public isLoading = true;

    constructor(public auth: AuthService,
        public irisService: IrisService,
        private router: Router
        ) {
            this.auth.user$.subscribe(res => {
                this.email = res?.email;
                this.getPerson();
            })
        }

        getPerson() {
        if (this.email){
            this.irisService.getPatient(this.email).subscribe({next: res => {  
                if (res.total === 0){
                    this.isSaved = false;
                }
                else {
                    this.isSaved = true;
                    sessionStorage.setItem("personId",res.entry[0].resource.id);
                    sessionStorage.setItem("personName",res.entry[0].resource.name[0].given[0]+" "+res.entry[0].resource.name[0].family);
                }
                this.isLoading = false;
            },
            error: err => {
                console.error(JSON.stringify(err));
            }
            });
        }
    }

    open( redirection: String ) {
    this.router.navigate(['forms/'+redirection]);
    }

}
