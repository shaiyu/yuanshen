<template>
  <div class="about">
    <single-type-statistics :logs="logs301" :gacha-type="301"></single-type-statistics>
    <single-type-statistics :logs="logs302" :gacha-type="302"></single-type-statistics>
    <single-type-statistics :logs="logs200" :gacha-type="200"></single-type-statistics>
    <single-type-statistics :logs="logs100" :gacha-type="100"></single-type-statistics>
  </div>
</template>

<script>
// @ is an alias to /src
import singleTypeStatistics from "@/components/SingleTypeStatistics";

export default {
  name: "AboutView",
  props: {
    logs100: Array,
    logs200: Array,
    logs301: Array,
    logs302: Array,
  },
  components: { singleTypeStatistics },
  data() {
    return {
    };
  },

  mounted() {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss">
  .about>div{
    margin-bottom: 20px;
  }
</style>