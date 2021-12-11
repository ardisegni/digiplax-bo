import Vue from 'vue';
import Vuex from 'vuex';
import { UserDetailsModel } from './models/UserDetails.model';

Vue.use(Vuex);

export interface RootState {
  isLoggedIn: boolean;
  userDetails: UserDetailsModel;
}

export default new Vuex.Store<RootState>({
  state: {
    isLoggedIn: false,
    userDetails: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      phoneNum: ''
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    userDetails(state) {
      return state.userDetails;
    }
  },
  mutations: {
    setUserDetails(state, userDetails) {
      state.isLoggedIn = true;
      state.userDetails = userDetails;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userDetails = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        phoneNum: ''
      };
    }
  },
  actions: {}
});
