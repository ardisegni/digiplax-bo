<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer app permanent v-if="!$route.meta.hideDashboard" :mini-variant.sync="mini">
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>

              <v-list-tile-avatar>
                <v-icon>person</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content v-if="userDetails" class="user-name-container">
                <v-list-tile-title>{{userDetails.firstName}} {{userDetails.lastName}}</v-list-tile-title>
                <router-link class="logout-link" :to="{name: 'login'}">Logout</router-link>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile v-for="item in items" :key="item.title" @click.stop="onRouteClick(item)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Getter } from 'vuex-class';
import { UserDetailsModel } from './models/UserDetails.model';
import Component from 'vue-class-component';
import { NavigationGuard } from 'vue-router';

@Component
export default class App extends Vue {
  @Getter('userDetails')
  public userDetails!: UserDetailsModel;

  public mini = false;

  private items: { title: string; icon: string; route: string }[] = [
    { title: 'Home', icon: 'home', route: 'home' },
    { title: 'Plaques', icon: 'dashboard', route: 'plaques' },
    { title: 'Users', icon: 'people', route: 'users' },
    { title: 'Scheduler', icon: 'scheduler', route: 'scheduler' },
    { title: 'Projects', icon: 'business', route: 'projects' }
  ];

  public onRouteClick(item: { title: string; icon: string; route: string }) {
    this.mini = true;
    this.$router.push({ name: item.route });
  }
}
</script>
<style lang="scss">
.v-list--dense .v-list__tile .v-icon {
  width: 50%;
  margin: 0 auto;
  display: block;
}
.logout-link {
  font-size: 12px;
}
.v-list__tile__avatar {
  min-width: 90px !important;
  justify-content: flex-end !important;
}
.user-name-container {
  justify-content: flex-end !important;
  div,
  a {
    text-align: right !important;
    width: 80%;
  }
}
</style>
