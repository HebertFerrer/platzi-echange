<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader
        :loading="isLoading"
        color="#68d391"
        :size="100"
      ></bounce-loader>
    </div>

    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleChange"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                v-model="convertValue"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                class="
                  text-center
                  bg-white
                  focus:outline-none
                  focus:shadow-outline
                  border border-gray-300
                  rounded-lg py-2
                  px-4 block w-full
                  appearance-none leading-normal
                "
              />
            </label>
          </div>

          <span class="text-xl">
            {{ convertedValue }} {{ fromUsd ? asset.symbol : 'USD' }}
          </span>
        </div>
      </div>

      <line-chart
        class="my-10"
        :min="min"
        :max="max"
        :data="chartData"
        :colors="['orange']"
      ></line-chart>

      <h3 class="text-xl my-10">Mejores ofertas de cambio</h3>
      <table>
        <tr
          class="border-b"
          v-for="market in markets"
          :key="`${market.exhangeId}-${market.priceUsd}`"
        >
          <td>
            <b>{{ market.exchangeId }}</b>
          </td>
          <td>{{ market.priceUsd | dollar }}</td>
          <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
          <td>
            <px-button
              v-if="!market.url"
              :is-loading="market.isLoading"
              @custom-click="getWebPage(market)"
            >
              Obtener Link
            </px-button>
            <a
              :href="market.url"
              class="hover:underline text-green-600"
              target="_blank"
              v-else
              >{{ market.url }}</a
            >
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import PxButton from '@/components/PxButton';
import api from '@/api.js';

export default {
  name: 'CoinDetail',

  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      isLoading: false,
      fromUsd: true,
      convertValue: null,
    };
  },

  components: { PxButton },

  created() {
    this.getCoin();
  },

  methods: {
    getCoin() {
      const id = this.$route.params.id;

      this.isLoading = true;
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .finally(() => (this.isLoading = false));
    },

    getWebPage(market) {
      this.$set(market, 'isLoading', true);

      api
        .getExchange(market.exchangeId)
        .then(res => {
          this.$set(market, 'url', res.exchangeUrl);
        })
        .finally(() => {
          this.$set(market, 'isLoading', false);
        });
    },

    toggleChange() {
      this.fromUsd = !this.fromUsd;
    },
  },

  watch: {
    $route() {
      this.getCoin();
    },
  },

  computed: {
    convertedValue() {
      if (!this.convertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      return result.toFixed(4);
    },

    min() {
      return Math.min(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2)),
      );
    },

    max() {
      return Math.max(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2)),
      );
    },

    avg() {
      const prices = this.history.map(h => parseFloat(h.priceUsd));
      return (prices.reduce((a, b) => a + b) / prices.length).toFixed(2);
    },

    chartData() {
      return this.history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)]);
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
