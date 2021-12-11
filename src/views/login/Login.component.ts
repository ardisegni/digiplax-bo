import LoginService from '@/services/Login.service';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Mutation } from 'vuex-class';

@Component
export default class LoginComponent extends Vue {
  public username = '';
  public password = '';
  public serverError = '';
  public loading = false;

  private loginService!: LoginService;

  @Mutation('setUserDetails')
  private setUserDetails!: any;

  @Mutation('logout')
  private logout!: any;

  public mounted() {
    this.loginService = new LoginService();
    this.logout();
  }

  public onLoginSubmit() {
    this.serverError = '';
    this.loading = true;
    this.loginService
      .doLogin({
        username: this.username,
        password: this.password
      })
      .subscribe(
        data => {
          this.loading = false;
          this.setUserDetails(data);
          this.$router.push({ name: 'home' });
        },
        error => {
          this.loading = false;
          this.serverError = error.response
            ? error.response.data.errorMsg
            : 'Network Error';
        }
      );
  }
}
