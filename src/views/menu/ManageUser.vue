<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'fullname', order: 'asc' }]"
    :search="search"
    show-select
    class="elevation-1 custom-datatable"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title><v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Dessert username"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.fullname"
                      label="fullname"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.role"
                      label="role"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.counters"
                      label="counters"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.branch"
                      label="branch"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item.raw)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
    <template v-slot:[`item.fullname`]="{ item }">
      <v-chip :color="getColor(item.columns.fullname)">
        {{ item.columns.fullname }}
      </v-chip>
    </template>
    <template v-slot:[`item.glutenfree`]="{ item }">
      <v-checkbox-btn
        v-model="item.columns.glutenfree"
        disabled
      ></v-checkbox-btn>
    </template>
  </v-data-table>
</template>
<script>
  export default {
    data: () => ({
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'User Name',
          align: 'start',
          sortable: false,
          key: 'username',
        },
        { title: 'Full Name', key: 'fullname',style: 'font-size: 14px;' },
        { title: 'Role', key: 'role' },
        { title: 'Counter No', key: 'counters' },
        { title: 'Branch', key: 'branch' },
        { title: 'Actions', key: 'actions', sortable: false },
        { title: 'Gluten-Free', key: 'glutenfree' },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        fullname: 0,
        role: 0,
        counters: 0,
        branch: 0,
      },
      defaultItem: {
        username: '',
        fullname: 0,
        role: 0,
        counters: 0,
        branch: 0,
      },
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },

    created() {
      this.initialize()
    },

    methods: {
      initialize() {
        this.desserts = [
          {
            username: 'admin',
            fullname: 'Administrator',
            role: 'Administrator',
            counters: 24,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'k.seyha',
            fullname: 'Kim Seyha',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'm.theret',
            fullname: 'Muon Tharet',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.bunseang',
            fullname: 'San Bunseang',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.sihado',
            fullname: 'Som Sihado',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'n.risto',
            fullname: 'Nhen Risto',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'o.sokun',
            fullname: 'Ouk Sokun',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.sengty',
            fullname: 'Seang Sengty',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          // {
          //   name: 'Ice cream sandwich',
          //   calories: 237,
          //   fat: 9.0,
          //   carbs: 37,
          //   protein: 4.3,
          //   glutenfree: false,
          // },


        ]
      },

      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
      getColor (calories) {
        if (calories > 400) return 'red'
        else if (calories > 200) return 'orange'
        else return 'green'
      },
    },

  }
</script>
<style scoped>
.custom-datatable {
  font-size: 14px; /* set the desired font size */
}
.custom-datatable .v-data-table-header th {
  font-size: 14px; /* set the font size for table header cells */
}
</style>