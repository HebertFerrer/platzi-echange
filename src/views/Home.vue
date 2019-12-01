<template>
  <div>
    <px-assets-table :assets="assets" v-if="!isLoading" />
    <bounce-loader
      :loading="isLoading"
      color="#68d391"
      :size="100"
    ></bounce-loader>
  </div>
</template>

<script>
import PxAssetsTable from '@/components/PxAssetsTable';
import api from '@/api.js';

export default {
  name: 'Home',

  components: { PxAssetsTable },

  data() {
    return {
      assets: [],
      isLoading: false,
    };
  },

  created() {
    this.isLoading = true;

    api
      .getAssets()
      .then(assets => (this.assets = assets))
      .finally(() => (this.isLoading = false));
  },
};
</script>
