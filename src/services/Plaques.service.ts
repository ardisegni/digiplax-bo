import { PlaqueModel } from '@/models/Plaque.model';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduledPlaqueModel } from '@/models/ScheduledPlaque.model';

export default class PlaquesService {
  private readonly baseUrl = process.env.VUE_APP_ROOT_API;

  fetchPlaques(projectId: number): Observable<PlaqueModel[]> {
    return from(
      axios.get<PlaqueModel[]>(`${this.baseUrl}/api/getPlaques`, {
        params: { project: projectId }
      })
    ).pipe(map(response => response.data));
  }

  createPlaque(body: PlaqueModel): Observable<AxiosResponse<void>> {
    return from(axios.post<void>(`${this.baseUrl}/api/createPlaque`, body));
  }

  updatePlaque(
    body: PlaqueModel,
    pathVariable: number
  ): Observable<AxiosResponse<void>> {
    return from(
      axios.put<void>(`${this.baseUrl}/api/updatePlaque/${pathVariable}`, body)
    );
  }

  deletePlaque(id: number): Observable<AxiosResponse> {
    return from(axios.delete(`${this.baseUrl}/api/deletePlaque/${id}`));
  }

  uploadPlaquesFile(formData: FormData): Observable<PlaqueModel[]> {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    return from(
      axios.post<PlaqueModel[]>(
        `${this.baseUrl}/api/uploadPlaquesFile`,
        formData,
        config
      )
    ).pipe(map(response => response.data));
  }

  createOrUpdatePlaque(body: PlaqueModel): Observable<PlaqueModel> {
    return from(
      axios.post<PlaqueModel>(`${this.baseUrl}/api/createOrUpdatePlaque`, body)
    ).pipe(map(response => response.data));
  }

  fetchActiveScheduledPlaques(): Observable<ScheduledPlaqueModel[]> {
    return from(
      axios.get<ScheduledPlaqueModel[]>(
        `${this.baseUrl}/api/getActiveScheduledPlaques`
      )
    ).pipe(map(response => response.data));
  }

  fetchPastScheduledPlaques(): Observable<ScheduledPlaqueModel[]> {
    return from(
      axios.get<ScheduledPlaqueModel[]>(
        `${this.baseUrl}/api/getPastScheduledPlaques`
      )
    ).pipe(map(response => response.data));
  }

  schedulePlaque(body: ScheduledPlaqueModel): Observable<AxiosResponse<void>> {
    return from(axios.post<void>(`${this.baseUrl}/api/schedulePlaque`, body));
  }

  updateScheduledPlaque(
    body: ScheduledPlaqueModel,
    pathVariable: number
  ): Observable<AxiosResponse<void>> {
    return from(
      axios.put<void>(
        `${this.baseUrl}/api/updateScheduledPlaque/${pathVariable}`,
        body
      )
    );
  }

  deleteScheduledPlaque(id: number): Observable<AxiosResponse> {
    return from(
      axios.delete(`${this.baseUrl}/api/deleteScheduledPlaque/${id}`)
    );
  }
}
