<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th :class="order">
          <span class="underline cursor-pointer" @click="reverseAssetsOrder()"
            >Ranking</span
          >
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            type="text"
            placeholder="Buscar..."
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
        v-for="asset in filteredAssets"
        :key="asset.id"
      >
        <td>
          <img
            class="w-6 h-6"
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            alt="asset.name"
          />
        </td>
        <td>
          <b>#{{ asset.rank }}</b>
        </td>
        <td>
          <router-link
            :to="{ name: 'coin-detail', params: { id: asset.id } }"
            class="hover:underline text-green-600"
          >
            {{ asset.name }}
            <small class="text-gray-500">{{ asset.symbol }}</small>
          </router-link>
        </td>
        <td>{{ asset.priceUsd | dollar }}</td>
        <td>{{ asset.marketCapUsd | dollar }}</td>
        <td
          :class="
            asset.changePercent24Hr.includes('-')
              ? 'text-red-600'
              : 'text-green-600'
          "
        >
          {{ asset.changePercent24Hr | percent }}
        </td>
        <td class="hidden sm:block">
          <px-button @custom-click="click(asset.id)">
            Detalle
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from '@/components/PxButton';

export default {
  name: 'PxAssetsTable',

  components: { PxButton },

  data() {
    return {
      filter: '',
      order: 'up',
    };
  },

  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    filteredAssets() {
      return this.assets.filter(
        a =>
          a.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          a.symbol.toLowerCase().includes(this.filter.toLowerCase()),
      );
    },
  },

  methods: {
    click(id) {
      this.$router.push({ name: 'coin-detail', params: { id } });
    },

    reverseAssetsOrder() {
      this.assets - this.assets.reverse();
      this.order = this.order == 'up' ? 'down' : 'up';
    },
  },
};
</script>

<style scoped>
.up::before {
  content: '👆';
}

.down::before {
  content: '👇';
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
