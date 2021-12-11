import { GridHeaderModel } from '@/models/GridHeader.model';
import { UserDetailsModel } from '@/models/UserDetails.model';
import UsersService from '@/services/Users.service';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class UsersListComponent extends Vue {
  public users: UserDetailsModel[] = [];
  public headers: GridHeaderModel[] = [];

  public editDialog = false;
  public loading = false;
  public editedItem: UserDetailsModel = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    phoneNum: ''
  };
  public defaultItem: UserDetailsModel = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    phoneNum: ''
  };
  public search: string = '';

  private usersService!: UsersService;

  public mounted() {
    this.usersService = new UsersService();

    this.initGrid();
    this.fetchUsers();
  }

  private fetchUsers() {
    this.usersService.fetchUsers().subscribe(data => {
      this.users = data;
      this.close();
    });
  }

  private initGrid(): void {
    this.headers = [
      {
        text: 'First name',
        value: 'firstName'
      },
      {
        text: 'Last name',
        value: 'lastName'
      },
      {
        text: 'Email',
        value: 'emailAddress'
      },
      {
        text: 'Password',
        value: 'password'
      },
      {
        text: 'Phone number',
        value: 'phoneNum'
      }
    ];
  }

  public editItem(item: UserDetailsModel) {
    this.editedItem = Object.assign({}, item);
    this.editDialog = true;
  }

  public deleteItem(item: UserDetailsModel) {
    const index = this.users.indexOf(item);
    if (confirm('Are you sure you want to delete this item?')) {
      if (item.id) {
        this.usersService
          .deleteUser(item.id)
          .subscribe(() => this.fetchUsers());
      } else {
        this.users.splice(index, 1);
      }
    }
  }

  public save() {
    if (this.editedItem.id) {
      this.usersService
        .updateUser(this.editedItem.id, this.editedItem)
        .subscribe(() => this.fetchUsers());
    } else {
      this.usersService
        .createUser(this.editedItem)
        .subscribe(() => this.fetchUsers());
    }
  }

  public cancel() {
    this.editedItem = Object.assign({}, this.defaultItem);
    this.fetchUsers();
  }

  public close() {
    this.editDialog = false;
    this.editedItem = Object.assign({}, this.defaultItem);
  }
}
