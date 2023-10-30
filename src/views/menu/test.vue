<template>
  <v-app>
    <v-select
      label="Select"
      v-model="selectedBranch"
      :items="branchData"
      item-title="branch_name"
      item-value="branch_id"
    ></v-select>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      selectedBranch: null,
      branchData: [
        {
          branch_id: 1,
          branch_name: 'TNM KP',
        },
        {
          branch_id: 2,
          branch_name: 'TNM KPS',
        },
        {
          branch_id: 4,
          branch_name: 'NNT KK',
        },
      ],
    };
  },
};
</script>