<template>
  <div>
     <b-button block variant="primary" large :disabled="buttonDisabled" @click="performAction()">
      <span v-if="isMetaMaskInstalled()">Login with Metamask</span>
      <span v-if="!isMetaMaskInstalled()">{{buttonInstallText}}</span>
      <img src="../assets/metamask-logo.png" class="metamask-logo" />
    </b-button>
  </div>
</template>

<script>
import Web3 from 'web3'
export default ({
  data() {
    return {
      buttonDisabled: false,
      buttonInstallText: "Click here to install Metamask",
      setLoading: false,
    }
  },
  methods: {
    performAction() {
      if (this.isMetaMaskInstalled()) {
        this.connectToMetamask()
      } else {
        window.open('https://metamask.io/')
        window.alert('Please install MetaMask first.');
      }
    },

    //Check if MetaMask extension is installed
    isMetaMaskInstalled() {
      if(window.ethereum === undefined) {
        return false;
      }
      return window.ethereum.isMetaMask;
    },

    async handleAuthenticate(publicAddress, signature) {
     return await fetch(`${process.env.VUE_APP_BACKEND_URL}/auth`, {
			  body: JSON.stringify({ publicAddress, signature }),
			  headers: {
				  'Content-Type': 'application/json',
			  },
			  method: 'POST',
        }).then((response) => response.json());
    },

    async handleSignup(publicAddress) {
      return await fetch(`${process.env.VUE_APP_BACKEND_URL}/users`, {
          body: JSON.stringify({ publicAddress }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).then((response) => response.json());
    },

    async handleSignMessage(publicAddress, nonce) {
        try {
          const signature = await web3.eth.personal.sign(
            `I am signing my one-time nonce: ${nonce}`,
            publicAddress,
            '' // MetaMask will ignore the password argument here
          );
          return {publicAddress, signature}
        }
        catch(err) {
          throw new Error(
				  'You need to sign the message to be able to log in.'
          );
        }
      },

    async handleLoggedIn(accessToken) {
      console.log(accessToken)
    },

    async connectToMetamask() {
        if (!this.web3) {
          try {
            // Request account access if needed
            await window.ethereum.enable();

            // We don't know window.web3 version, so we use our own instance of Web3
            // with the injected provider given by MetaMask
            web3 = new Web3(window.ethereum);
          } catch (error) {
            window.alert('You need to allow MetaMask.');
            return;
          }
        }

        const coinbase = await web3.eth.getCoinbase();
        if (!coinbase) {
          window.alert('Please activate MetaMask first.');
          return;
        }

        const publicAddress = coinbase.toLowerCase();
        // set in store public address
        this.setLoading = true;
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
          )

          const users = await response.json()

          const user = users.length ? await users[0] : await this.handleSignup(publicAddress)

          const auth = await this.handleSignMessage(user.publicAddress, user.nonce)

          const accessToken = await this.handleAuthenticate(auth.publicAddress, auth.signature)

          await this.$store.commit('userAPI/setAccessToken', accessToken.accessToken)

          await this.$store.commit('userAPI/setPublicAddress', publicAddress)

        } catch(err) {
          window.alert(err);
				  this.setLoading = true;
        }

        await this.$router.push('/home')
    }
  }
})
</script>