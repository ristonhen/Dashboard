<template>
  <v-app-bar
      class="indigo"
      color="blue-grey-lighten-5"
  >
    <v-app-bar-nav-icon @click="toggleDrawer"/>
    <v-spacer></v-spacer>
    <!--Message Start  -->
    <div class="text-center">
      <v-menu
        v-model="message"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon
            color="indigo"
            v-bind="props"
          >
            <v-badge content="9+" color="blue">
              <v-icon size="20" color="grey-darken-2" icon="mdi-message-fast-outline"></v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card 
          class="mx-auto"
          max-width="450"
        >
          <v-list
            :items="items"
            item-props
            lines="three"
          >
            <template v-slot:subtitle="{ subtitle }">
              <div v-html="subtitle"></div>
            </template>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <!-- Message End -->
    <v-btn icon>
      <v-badge content="2" color="amber-accent-2" dot>
        <v-icon size="20" color="grey-darken-2" icon="mdi-bell-ring"></v-icon>
      </v-badge>
    </v-btn>
    <!-- IconFullScreen -->
    <v-btn icon @click="toggleFullScreen">
      <v-icon v-if="toggleScreen" size="20" color="grey-darken-2" icon="mdi-arrow-expand-all"></v-icon>
      <v-icon v-else size="18" color="grey-darken-2" icon="mdi-line-scan"></v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon size="20" color="grey-darken-2" icon="mdi-view-grid"></v-icon>
    </v-btn>
    <!-- Menu Icon -->
    <div class="text-center">
      <v-menu
        v-model="profile"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon
            color="indigo"
            v-bind="props"
          >
          <v-icon size="35" color="grey-darken-2" icon="mdi-account-circle-outline"></v-icon>
          </v-btn>
        </template>
        <v-card min-width="250">
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
              title="Risto Nhen"
              subtitle="ristonhen@gmail.com"
            >
              <template v-slot:append>
                <!-- :class="fav ? 'text-red' : ''" , @click="fav = !fav" -->
                <v-btn
                  size="small"
                  variant="text"
                  icon="mdi-menu-down"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list 
            :lines="false"
            density="compact"
            nav
          >
            <v-list-item>
              <v-switch
                v-model="hints"
                color="black"
                label="Dark Mode"
                hide-details
              ></v-switch>
              <v-list-subheader>Profile</v-list-subheader>
              <v-list-item 
                v-for="(item,index) in profiles" 
                :key="index"
                :value="item"
                active-class="bg-blue-grey-darken-2"
                rounded
                :title="item.text"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon" size="small"></v-icon>
                </template>
              </v-list-item>
            </v-list-item>
          </v-list>
          <v-card-actions class="px-5">
            <v-spacer></v-spacer>
            <v-btn
              color="red-darken-4"
              variant="text"
              @click="logout"
            >
              LOG OUT
              <v-icon icon="mdi-logout" class="ps-4"></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>
<script>
import { useAuthStore } from '../store/auth';
export default {
  props: [ 'drawer' ],
  data(){
    return {
      toggleScreen: true,
      fav: true,
      profile: false,
      message: false,
      hints: true,
      profiles: [
        { text: 'Menu Sitting', icon: 'mdi-menu-open' },
        { text: 'Change password', icon: 'mdi-lock-reset' },
        { text: 'Security', icon: 'mdi-security' },
        { text: 'Account sitting', icon: 'mdi-cog-outline' },
      ],
      items: [
        { type: 'subheader', title: 'Today' },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ',
          subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com /images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle: '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle: '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
    }
  },
  methods: {
    toggleDrawer(){
      const newValue = !this.drawer
      this.$emit('toggleDrawer', newValue);
    },
    logout1(){
      const authStore = useAuthStore()
      console.log(authStore.token)
      this.profile = false
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.toggleScreen = false
      } else {
        document.exitFullscreen();
        this.toggleScreen = true
      }
    },
  },
  setup() {
    const authStore = useAuthStore(); // use the auth store in the component
    const useStore  = useAuthStore
    // define the logout function
    const logout = () => {
      console.log(authStore.user) // dispatch a logout action to the store
    };

    return {
      logout,
    };
  },
}
</script>
  