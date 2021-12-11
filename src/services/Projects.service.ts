import { ProjectModel } from '@/models/Project.model';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export default class ProjectsService {
  private readonly baseUrl = process.env.VUE_APP_ROOT_API;

  public fetchProjects(): Observable<ProjectModel[]> {
    return from(
      axios.get<ProjectModel[]>(`${this.baseUrl}/api/getProjects`)
    ).pipe(map(response => response.data));
  }

  public createProject(body: ProjectModel): Observable<AxiosResponse<void>> {
    return from(axios.post<void>(`${this.baseUrl}/api/createProject`, body));
  }

  public updateProject(
    id: number,
    body: ProjectModel
  ): Observable<AxiosResponse<void>> {
    return from(
      axios.put<void>(`${this.baseUrl}/api/updateProject/${id}`, body)
    );
  }

  public deleteProject(id: number): Observable<AxiosResponse> {
    return from(axios.delete(`${this.baseUrl}/api/deleteProject/${id}`));
  }
}
