import FileUploadComponent from '@/components/file-upload/FileUpload.component';
import { GridHeaderModel } from '@/models/GridHeader.model';
import { PlaqueModel } from '@/models/Plaque.model';
import PlaquesService from '@/services/Plaques.service';
import ProjectsService from '@/services/Projects.service';
import { AxiosError } from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ProjectModel } from './../../models/Project.model';

@Component({
  components: { FileUploadComponent }
})
export default class PlaquesListComponent extends Vue {
  public plaques: PlaqueModel[] = [];
  public headers: GridHeaderModel[] = [];

  public newDialog = false;
  public editDialog = false;
  public uploadFileDialog = false;
  public editedIndex = -1;
  public editedItem: PlaqueModel = {
    donorFirstName: '',
    donorLastName: '',
    honoreeFirstName: '',
    honoreeLastName: '',
    plaqueText: '',
    plaqueHtmlText: ''
  };
  public defaultItem: PlaqueModel = {
    donorFirstName: '',
    donorLastName: '',
    honoreeFirstName: '',
    honoreeLastName: '',
    plaqueText: '',
    plaqueHtmlText: ''
  };
  public search = '';
  public snack = false;
  public snackText = '';
  public snackColor = '';

  public totalUploadedPlaques = 0;
  public countUploadedPlaques = 0;

  public loading = false;

  public projects: ProjectModel[] = [];
  public selectedProjectId: number = -1;

  private plaquesService!: PlaquesService;
  private projectsService!: ProjectsService;

  private uploadedPlaques: PlaqueModel[] = [];

  mounted() {
    this.plaquesService = new PlaquesService();
    this.projectsService = new ProjectsService();

    this.initGrid();
    this.fetchProjects();
  }

  private fetchPlaques(projectId?: number) {
    this.close();
    if (projectId) {
      this.selectedProjectId = projectId;
    }

    if (this.selectedProjectId > -1) {
      this.loading = true;
      this.plaquesService.fetchPlaques(this.selectedProjectId).subscribe(
        data => {
          this.loading = false;
          this.plaques = data;
        },
        () => (this.loading = false)
      );
    }
  }

  private fetchProjects() {
    this.projectsService.fetchProjects().subscribe(data => {
      this.projects = data;
      if (this.projects.length > 0) {
        this.selectedProjectId = this.projects[0].id || -1;
        this.fetchPlaques();
      }
    });
  }

  private initGrid() {
    this.headers = [
      {
        text: 'Identifier',
        value: 'identifier'
      },
      {
        text: 'Donor first name',
        value: 'donorFirstName'
      },
      {
        text: 'Donor last name',
        value: 'donorLastName'
      },
      {
        text: 'Honoree first name',
        value: 'honoreeFirstName'
      },
      {
        text: 'Honoree last name',
        value: 'honoreeLastName'
      },
      {
        text: 'Plaque text',
        value: 'plaqueText'
      }
    ];
  }

  private saveUploadedPlaques() {
    if (this.uploadedPlaques.length > 0) {
      const uploadedPlaque = this.uploadedPlaques[0];
      uploadedPlaque.projectId = this.selectedProjectId;
      this.plaquesService.createOrUpdatePlaque(uploadedPlaque).subscribe(() => {
        this.countUploadedPlaques++;
        this.uploadedPlaques = this.uploadedPlaques.filter(
          (plaque: PlaqueModel) => {
            return plaque.identifier !== uploadedPlaque.identifier;
          }
        );
        this.saveUploadedPlaques();
      });
    } else {
      this.uploadFileDialog = false;
      this.fetchPlaques();

      this.countUploadedPlaques--;
      const hasErrors = this.countUploadedPlaques < this.totalUploadedPlaques;
      this.snack = true;
      this.snackColor = hasErrors ? 'error' : 'success';
      this.snackText = `Uploaded ${this.countUploadedPlaques} plaques out of ${this.totalUploadedPlaques}`;
    }
  }

  public editItem(item: PlaqueModel) {
    this.editedIndex = this.plaques.findIndex(
      plaque => plaque.identifier === item.identifier
    );
    this.editedItem = Object.assign({}, item);
    this.editDialog = true;
  }

  public deleteItem(item: PlaqueModel) {
    const index = this.plaques.indexOf(item);
    if (confirm('Are you sure you want to delete this item?')) {
      if (item.id) {
        this.plaquesService
          .deletePlaque(item.id)
          .subscribe(() => this.fetchPlaques());
      } else {
        this.plaques.splice(index, 1);
      }
    }
  }

  public save(item: PlaqueModel) {
    if (item.identifier) {
      this.editedItem = Object.assign({}, item);
    }

    this.editedIndex = this.plaques.findIndex(
      plaque => plaque.identifier === this.editedItem.identifier
    );

    if (this.editedItem.id) {
      this.plaquesService
        .updatePlaque(this.editedItem, this.editedItem.id || 0)
        .subscribe(
          () => this.onSuccess(this.editedItem.projectId),
          error => this.onError(error)
        );
    } else {
      this.plaquesService
        .createPlaque(this.editedItem)
        .subscribe(
          () => this.onSuccess(this.editedItem.projectId),
          error => this.onError(error)
        );
    }
  }

  private onSuccess(projectId?: number) {
    this.snack = true;
    this.snackColor = 'success';
    this.snackText = 'Data saved';
    this.close();
    this.fetchPlaques(projectId);
  }

  private onError(error: AxiosError) {
    this.snack = true;
    this.snackColor = 'error';
    this.snackText =
      error.response!.data.errorMsg || 'Unexpected error in saving plaque';
  }

  public cancel() {
    this.snack = true;
    this.snackColor = 'error';
    this.snackText = 'Canceled';
    this.fetchPlaques();
  }

  public close() {
    this.newDialog = false;
    this.editDialog = false;
    setTimeout(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    }, 300);
  }

  public onFileUploadSaved(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.uploadedPlaques = [];
    this.countUploadedPlaques = 1;
    this.totalUploadedPlaques = 100;
    this.plaquesService.uploadPlaquesFile(formData).subscribe(data => {
      this.uploadedPlaques = data;
      this.totalUploadedPlaques = data.length;
      this.saveUploadedPlaques();
    });
  }

  public onFileUploadClosed(): void {
    this.uploadFileDialog = false;
  }

  @Watch('selectedProjectId')
  onSelectedProjectIdChange(newVal: number, oldVal: number) {
    this.fetchPlaques();
  }
}
