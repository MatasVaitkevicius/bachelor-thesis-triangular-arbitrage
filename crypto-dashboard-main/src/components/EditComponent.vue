<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h3 class="text-center">Update Token</h3>
            <form @submit.prevent="handleUpdateForm">
                <div class="form-group">
                    <label>Symbol</label>
                    <input type="text" class="form-control" v-model="token.symbol" required>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="form-control" v-model="token.name" required>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" class="form-control" v-model="token.address" required>
                </div>
                <div class="form-group">
                    <label>Decimals</label>
                    <input type="number" class="form-control" v-model="token.decimals" required>
                </div>
                <div class="form-group">
                    <label>Image</label>
                    <input type="text" class="form-control" v-model="token.image" required>
                </div>
                <div class="form-group">
                    <button class="btn btn-danger btn-block">Update</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            token: { }
        }
    },
    created() {
        let apiURL = `http://localhost:4000/api/tokens/${this.$route.params.id}`;
        axios.get(apiURL).then((res) => {
            this.token = res.data;
        })
    },
    methods: {
        handleUpdateForm() {
            let apiURL = `http://localhost:4000/api/update-token/${this.$route.params.id}`;
            axios.put(apiURL, this.token).then((res) => {
                console.log(res)
                this.$router.push('/view')
            }).catch(error => {
                console.log(error)
            });
        }
    }
}
</script>