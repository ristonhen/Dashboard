<template>
  <div>
      <v-row no-gutters>
        <v-col 
          v-for="person in team" :key="person.id" 
          class="pa-2"
          cols="12" 
          lg="3" 
          md="4" 
          sm="6" 
          xs="12"
        >
          <v-sheet class="">
            <v-card class="text-xs-center  pt-4" align="center" rounded="md" elevation="9">
              <v-avatar color="surface-variant" size="120">
                <v-img :src="person.avatar"></v-img>
              </v-avatar>
              <v-card-text>
                <div>{{ person.name }}</div>
                <div>{{ person.role }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="grey">
                  <v-icon size="large" color="teal-darken-2" icon="mdi-message-text">
                    </v-icon>
                  <span class="ms-3">message</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
  </div>
</template>
<script>
export default {
    data() {
      return {
        team: [
          { name: 'Risto Nhen', role: 'Web developer', avatar: '/assets/img/photo_love.jpg' },
          { name: 'Sihado Som', role: 'Database designer', avatar: '/assets/img/sihado_som.jpg' },
          { name: 'Sokun Ouk', role: 'Web developer', avatar: '/assets/img/sokun_ouk.jpg' },
          { name: 'Sengty Seang', role: 'Database Admin', avatar: '/assets/img/sengty.jpg' },
          { name: 'Moun Tharet', role: 'Supervisor Team', avatar: '/assets/img/photo_love.jpg' },
          { name: 'Kim Seyha', role: 'Manager Team', avatar: '/assets/img/seyha-kim.jpg' },
          { name: 'Seang Bunseng', role: 'Sales guru', avatar: '/assets/img/bunsreang.jpg' },
          { name: 'Ad name', role: 'Add role', avatar: '/assets/img/avatar.png' },
          { name: 'Seang Bunseng', role: 'Sales guru', avatar: '/assets/img/bunsreang.jpg' },
          { name: 'Ad name', role: 'Add role', avatar: '/assets/img/avatar.png' },
          { name: 'Seang Bunseng', role: 'Sales guru', avatar: '/assets/img/bunsreang.jpg' },
          { name: 'Ad name', role: 'Add role', avatar: '/assets/img/avatar.png' },
        ]
      }
    }
}
</script>
