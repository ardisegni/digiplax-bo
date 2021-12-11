import { GridHeaderModel } from '@/models/GridHeader.model';
import { PlaqueModel } from '@/models/Plaque.model';
import { ScheduledPlaqueModel } from '@/models/ScheduledPlaque.model';
import PlaquesService from '@/services/Plaques.service';
import ProjectsService from '@/services/Projects.service';
import { debounceTime } from 'rxjs/operators';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ProjectModel } from './../../models/Project.model';

@Component
export default class SchedulerComponent extends Vue {
  private activeScheduledPlaques: ScheduledPlaqueModel[] = [];
  private pastScheduledPlaques: ScheduledPlaqueModel[] = [];

  public headers: GridHeaderModel[] = [];
  public tabs: Array<{ title: string; key: string }> = [];
  public activeTab = null;

  public editDialog = false;
  public loading = false;
  public saving = false;
  public editedItem: ScheduledPlaqueModel = {
    dateFrom: null,
    timeFrom: '',
    dateTo: null,
    timeTo: '',
    plaque: undefined
  };
  public defaultItem: ScheduledPlaqueModel = {
    dateFrom: null,
    timeFrom: '',
    dateTo: null,
    timeTo: ''
  };
  public search: string = '';

  public dateFromMenu = false;
  public timeFromMenu = false;
  public dateToMenu = false;
  public timeToMenu = false;
  public searchPlaque = '';

  public projects: ProjectModel[] = [];
  public selectedProjectId: number = -1;

  public plaques: PlaqueModel[] = [];

  public serverError = '';

  private plaquesService!: PlaquesService;
  private projectsService!: ProjectsService;

  public mounted() {
    this.plaquesService = new PlaquesService();
    this.projectsService = new ProjectsService();

    this.initTabs();
    this.initGrid();
    this.fetchScheduledPlaques();
    this.fetchProjects();
  }

  private fetchProjects() {
    this.projectsService.fetchProjects().subscribe(data => {
      this.projects = data;
      if (this.projects.length > 0) {
        this.selectedProjectId = this.projects[0].id || -1;
      }
    });
  }

  private initTabs() {
    this.tabs = [
      { title: 'Active scheduled tabs', key: 'active' },
      { title: 'Past scheduled tabs', key: 'past' }
    ];
  }

  private fetchScheduledPlaques() {
    this.fetchActivePlaques();
    this.fetchPastPlaques();
  }

  private fetchActivePlaques() {
    this.loading = true;
    this.plaquesService.fetchActiveScheduledPlaques().subscribe(
      data => {
        this.loading = false;
        this.activeScheduledPlaques = data;
      },
      () => (this.loading = false)
    );
  }

  private fetchPastPlaques() {
    this.loading = true;
    this.plaquesService.fetchPastScheduledPlaques().subscribe(
      data => {
        this.loading = false;
        this.pastScheduledPlaques = data;
      },
      () => (this.loading = false)
    );
  }

  public onTabChange(activeTab: string) {
    if (activeTab === 'active') {
      this.fetchActivePlaques();
    } else {
      this.fetchPastPlaques();
    }
  }

  private initGrid(): void {
    this.headers = [
      {
        text: 'Project',
        value: 'plaque.projectName'
      },
      {
        text: 'From date',
        value: 'dateFrom'
      },
      {
        text: 'To date',
        value: 'dateTo'
      },
      {
        text: 'Plaque text',
        value: 'plaque.plaqueText'
      }
    ];
  }

  public editItem(item: ScheduledPlaqueModel) {
    this.editedItem = Object.assign(
      {},
      {
        ...item,
        dateFrom: this.$options.filters!.formatDate(item.dateFrom),
        dateTo: this.$options.filters!.formatDate(item.dateTo),
        timeFrom: this.$options.filters!.formatTime(item.dateFrom),
        timeTo: this.$options.filters!.formatTime(item.dateTo)
      }
    );

    if (item.plaque) {
      this.selectedProjectId = item.plaque.projectId || -1;
      this.plaques = [item.plaque];
    }

    this.editDialog = true;
  }

  public deleteItem(item: ScheduledPlaqueModel) {
    if (confirm('Are you sure you want to delete this item?')) {
      if (item.id) {
        this.loading = true;
        this.plaquesService.deleteScheduledPlaque(item.id).subscribe(
          () => {
            this.loading = false;
            this.fetchScheduledPlaques();
          },
          error => {
            this.loading = false;
            this.serverError = error.response.data.errorMsg;
          }
        );
      }
    }
  }

  public save() {
    const dateFrom = new Date(
      this.editedItem.dateFrom + ' ' + this.editedItem.timeFrom + ':00'
    );
    const dateTo = new Date(
      this.editedItem.dateTo + ' ' + this.editedItem.timeTo + ':00'
    );

    this.saving = true;
    if (this.editedItem.id) {
      this.plaquesService
        .updateScheduledPlaque(
          { ...this.editedItem, dateFrom, dateTo },
          this.editedItem.id
        )
        .subscribe(
          () => {
            this.saving = false;
            this.editDialog = false;
            this.fetchScheduledPlaques();
          },
          error => {
            this.saving = false;
            this.serverError = error.response.data.errorMsg;
          }
        );
    } else {
      this.plaquesService
        .schedulePlaque({ ...this.editedItem, dateFrom, dateTo })
        .subscribe(
          () => {
            this.saving = false;
            this.editDialog = false;
            this.fetchScheduledPlaques();
          },
          error => {
            this.saving = false;
            this.serverError = error.response.data.errorMsg;
          }
        );
    }
  }

  public cancel() {
    this.editedItem = Object.assign({}, this.defaultItem);
    this.fetchScheduledPlaques();
  }

  public close() {
    this.editDialog = false;
    this.editedItem = Object.assign({}, this.defaultItem);
  }

  @Watch('searchPlaque')
  public onSearchPlaqueChange(value?: string) {
    if (!value) {
      return;
    }

    this.fetchPlaques();
  }

  private fetchPlaques() {
    if (this.selectedProjectId == -1) {
      this.plaques = [];
      return;
    }

    this.loading = true;
    this.plaquesService
      .fetchPlaques(this.selectedProjectId)
      .pipe(debounceTime(200))
      .subscribe(
        data => {
          this.loading = false;
          this.plaques = data;
        },
        () => (this.loading = false)
      );
  }

  @Watch('selectedProjectId')
  public onSelectedProjectIdChange(newVal: number, oldVal: number) {
    this.editedItem.plaque = undefined;
    this.fetchPlaques();
  }
}
