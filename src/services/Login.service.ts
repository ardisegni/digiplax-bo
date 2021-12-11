import { LoginRequestModel } from '@/models/requests/LoginRequest.model';
import axios from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetailsModel } from './../models/UserDetails.model';

export default class LoginService {
  private readonly baseUrl = process.env.VUE_APP_ROOT_API;

  doLogin(body: LoginRequestModel): Observable<UserDetailsModel> {
    return from(
      axios.post<UserDetailsModel>(`${this.baseUrl}/auth/login`, body)
    ).pipe(map(response => response.data));
  }
}
