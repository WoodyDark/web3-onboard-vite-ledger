<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import Onboard, { type WalletState } from "@web3-onboard/core";
import ledgerModule from "@web3-onboard/ledger";
import ERC20 from "@/erc20.json";
import { ethers } from "ethers";
import { onMounted } from "vue";

const ledger = ledgerModule();

const onboard = Onboard({
  wallets: [ledger],
  chains: [
    {
      id: "0xa",
      label: "Optimism Mainnet",
      rpcUrl: "https://mainnet.optimism.io",
      token: "ETH",
    },
  ],
  appMetadata: {
    description:
      "Trade and hedge future yield with Pendle. Manage your yields based on your risk appetite, get fixed yield or lever up your yield exposure with no liquidation risk.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2800.02 3500"><defs><style>.cls-1{fill:#dedede;}.cls-2{fill:#152e51;}.cls-3{fill:#1e4480;}</style></defs><title>Asset 3</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M1400.3.25c773.18,0,1400,626.79,1400,1400,0,726.77-553.8,1324.2-1262.43,1393.29a774,774,0,0,0-2.53-150.81c-40.68-355.63-321-636.29-676.55-677.39V110.75l-.68-1.62C1024.85,39,1208.05.25,1400.3.25Z" transform="translate(-0.25 -0.25)"/><path class="cls-2" d="M683.76,1965.2V198.75l-.65-1.09a1394.58,1394.58,0,0,1,175-88.53l.68,1.62V1965.31c355.5,41.1,635.87,321.76,676.55,677.39a774,774,0,0,1,2.53,150.81q-67.87,6.63-137.54,6.68c-486,0-914.17-247.65-1165.18-623.63A766.63,766.63,0,0,1,682.81,1965.2Z" transform="translate(-0.25 -0.25)"/><path class="cls-3" d="M1537.84,2793.51c-29.23,359-308.58,659.2-680,701.68-422.5,48.33-804.17-255-852.5-677.5C-23,2570.47,69.16,2337.22,235.12,2176.56c251,376,679.18,623.63,1165.18,623.63Q1469.92,2800.19,1537.84,2793.51Z" transform="translate(-0.25 -0.25)"/><path class="cls-1" d="M683.76,198.75V1965.2h-1a766.63,766.63,0,0,0-447.69,211.36C86.79,1954.39.32,1687.4.32,1400.22c0-511.05,273.84-958.15,682.79-1202.56Z" transform="translate(-0.25 -0.25)"/></g></g></svg>\n',
    logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4388.15 950"><defs><style>.cls-1{fill:#dedede;}.cls-2,.cls-4{fill:#1e4480;}.cls-3{fill:#152e51;}.cls-4{stroke:#1e4480;stroke-miterlimit:10;stroke-width:8px;}</style></defs><title>Asset 4</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="LINE"><path class="cls-1" d="M760.26,380.24c0,197.27-150.32,359.43-342.67,378.18A209.19,209.19,0,0,0,233.15,533.61V30.13l-.13-.3A378.84,378.84,0,0,1,380.26.25C590.13.25,760.26,170.38,760.26,380.24Z" transform="translate(-0.25 -0.25)"/><path class="cls-2" d="M1.62,765A208.7,208.7,0,0,1,64,591C132.13,693,248.35,760.24,380.26,760.24q18.9,0,37.33-1.82C409.66,855.87,333.84,937.35,233,948.88,118.34,962,14.74,879.66,1.62,765Z" transform="translate(-0.25 -0.25)"/><path class="cls-3" d="M233.15,30.13V533.61A209.19,209.19,0,0,1,417.59,758.42q-18.42,1.8-37.33,1.82C248.35,760.24,132.13,693,64,591a208.12,208.12,0,0,1,121.52-57.37h.14V54.2l-.18-.3A378.26,378.26,0,0,1,233,29.83Z" transform="translate(-0.25 -0.25)"/><path class="cls-1" d="M.27,380.24c0-138.67,74.28-260,185.21-326.34l.18.3V533.59h-.14A208.12,208.12,0,0,0,64,591,378.21,378.21,0,0,1,.27,380.24Z" transform="translate(-0.25 -0.25)"/></g><path class="cls-4" d="M1170.58,509.78V667.14h-48.16V281.3H1282c43.68,0,104.72,37,104.72,110.88,0,98.56-70.56,117.6-107,117.6Zm109.76-43.12c19.6,0,58.8-15.68,58.8-74.48,0-42-33-67.76-57.12-67.76H1170.58V466.66Z" transform="translate(-0.25 -0.25)"/><path class="cls-4" d="M1764.18,586.5c0,20.16,9,38.08,44.24,38.08h142.24v42.56H1800c-57.12-1.68-82.88-18.48-84-73.36V281.3h234.64v42.56H1764.18V446.5h173.6v42.56h-173.6Z" transform="translate(-0.25 -0.25)"/><path class="cls-4" d="M2535.85,281.3H2584V667.14h-54.32C2473.13,556.26,2422.17,457.7,2341,339.54v327.6h-48.16V281.3h63.84c80.64,113.68,127.12,201.6,179.2,303Z" transform="translate(-0.25 -0.25)"/><path class="cls-4" d="M2995.05,667.14h-48.16V281.3h127.68c91.84,0,177,65.52,177,193.76,0,129.92-85.12,192.08-177,192.08Zm55.44-42.56c98,0,150.08-51,150.08-149.52,0-97.44-47.6-151.2-150.08-151.2h-55.44V624.58Z" transform="translate(-0.25 -0.25)"/><path class="cls-4" d="M3639,586.5c0,20.16,9,38.08,44.24,38.08H3830v42.56H3674.88c-57.12-1.68-82.88-18.48-84-73.36V281.3H3639Z" transform="translate(-0.25 -0.25)"/><path class="cls-4" d="M4197.92,586.5c0,20.16,9,38.08,44.24,38.08H4384.4v42.56H4233.76c-57.12-1.68-82.88-18.48-84-73.36V281.3H4384.4v42.56H4197.92V446.5h173.6v42.56h-173.6Z" transform="translate(-0.25 -0.25)"/></g></g></svg>\n',
    name: "Pendle",
  },
});
async function init() {
  await onboard.connectWallet();
  const provider = new ethers.providers.Web3Provider(
    onboard.state.get().wallets[0].provider
  );
  sendMoney(provider);
}

async function sendMoney(provider: ethers.providers.Web3Provider) {
  const signer = provider.getSigner();
  const self = onboard.state.get().wallets[0].accounts[0].address;

  signer
    .sendTransaction({
      to: self,
      from: self,
      value: 0,
    })
    .then((response) => {
      console.log("submitted", response);

      response.wait(1).then((res) => {
        console.log("success", res);
      });
    });
}

onMounted(() => {
  init();
});
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
