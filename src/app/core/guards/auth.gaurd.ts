import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { Observable } from "rxjs";
import { filter, take, map } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService, private router: Router) { }

    canLoad(): Observable<boolean> {
        return this.authService.currentUser.pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1), // Otherwise the Observable doesn't complete!
            map(isAuthenticated => {

                if (isAuthenticated) {
                    return true;
                } else {
                    this.router.navigateByUrl('/login')
                    return false;
                }
            })
        );
    }
}
