import { GridHeaderModel } from '@/models/GridHeader.model';
import { ProjectModel } from '@/models/Project.model';
import ProjectsService from '@/services/Projects.service';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class ProjectsListComponent extends Vue {
  public projects: ProjectModel[] = [];
  public headers: GridHeaderModel[] = [];

  public serverError = '';

  public editDialog = false;
  public loading = false;
  public editedItem: ProjectModel = {
    name: '',
    timezone: 'Asia/Jerusalem',
    urlParam: ''
  };
  public defaultItem: ProjectModel = {
    name: '',
    timezone: 'Asia/Jerusalem',
    urlParam: ''
  };
  public search: string = '';

  public timezones: Array<string> = [];

  private projectsService!: ProjectsService;

  public mounted() {
    this.projectsService = new ProjectsService();

    this.initGrid();
    this.initTimezones();
    this.fetchProjects();
  }

  private initTimezones() {
    this.timezones = [
      'Asia/Jerusalem',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles'
    ];
  }

  private fetchProjects() {
    this.projectsService.fetchProjects().subscribe(data => {
      this.projects = data;
      this.close();
    });
  }

  private initGrid(): void {
    this.headers = [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Timezone',
        value: 'timezone'
      },
      {
        text: 'URL parameter',
        value: 'urlParam'
      }
    ];
  }

  public editItem(item: ProjectModel) {
    this.serverError = '';
    this.editedItem = Object.assign({}, item);
    this.editDialog = true;
  }

  public deleteItem(item: ProjectModel) {
    const index = this.projects.indexOf(item);
    if (confirm('Are you sure you want to delete this item?')) {
      if (item.id) {
        this.projectsService
          .deleteProject(item.id)
          .subscribe(() => this.fetchProjects());
      } else {
        this.projects.splice(index, 1);
      }
    }
  }

  public save() {
    this.serverError = '';
    if (this.editedItem.id) {
      this.projectsService
        .updateProject(this.editedItem.id, this.editedItem)
        .subscribe(
          () => this.fetchProjects(),
          error => (this.serverError = error.response.data.errorMsg)
        );
    } else {
      this.projectsService
        .createProject(this.editedItem)
        .subscribe(
          () => this.fetchProjects(),
          error => (this.serverError = error.response.data.errorMsg)
        );
    }
  }

  public cancel() {
    this.editedItem = Object.assign({}, this.defaultItem);
    this.fetchProjects();
  }

  public close() {
    this.editDialog = false;
    this.editedItem = Object.assign({}, this.defaultItem);
  }
}
