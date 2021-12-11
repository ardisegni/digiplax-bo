import { UserDetailsModel } from '@/models/UserDetails.model';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export default class UsersService {
  private readonly baseUrl = process.env.VUE_APP_ROOT_API;

  public fetchUsers(): Observable<UserDetailsModel[]> {
    return from(
      axios.get<UserDetailsModel[]>(`${this.baseUrl}/api/getUsers`)
    ).pipe(map(response => response.data));
  }

  public createUser(body: UserDetailsModel): Observable<AxiosResponse<void>> {
    return from(axios.post<void>(`${this.baseUrl}/api/createUser`, body));
  }

  public updateUser(
    id: number,
    body: UserDetailsModel
  ): Observable<AxiosResponse<void>> {
    return from(axios.put<void>(`${this.baseUrl}/api/updateUser/${id}`, body));
  }

  public deleteUser(id: number): Observable<AxiosResponse> {
    return from(axios.delete(`${this.baseUrl}/api/deleteUser/${id}`));
  }
}
