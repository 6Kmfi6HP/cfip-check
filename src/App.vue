<template>
    <header class="navbar">
        <h1 class="navbar-item">3Kmfi6HP</h1>
    </header>

    <main class="section">
        <h1 class="title">EDtunnel cf ip remote check</h1>

        <div class="columns">

            <div class="column">
                <form @submit.prevent="onSubmit">

                    <div class="field">
                        <label class="label">server</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter server domain or ip" v-model="servDomain">
                        </div>
                    </div>

<div class="field">
                    <label class="label">tls</label>
                    <div class="control">
                        <label>
                            <input type="radio" name="tls" value="true" v-model="tls" checked/> 
                            true
                   
                            <input type="radio" name="tls" value="false" v-model="tls" />
                            false
                        </label>
                    </div>
                </div>

                    <div class="field">
                        <label class="label">host</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter host must same sni in cf"
                                v-model="host">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">port</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter server port" v-model="port">
                        </div>
                    </div>

                    <button class="button is-primary">Submit</button>

                </form>
            </div>

            <div class="column">
                <h5>Returned text:</h5>
                <pre><a :href="subscribe_url" target="_blank">{{ subscribe_url }}</a>{{ result }}</pre>

            </div>

        </div>

    </main>
</template>
  
<script>
export default {
    data() {
        return {
            servDomain: 'cdn.xn--b6gac.eu.org',
            port: '443',
            host: 'speed.cloudflare.com',
            result: '',
            tls: true
        }
    },

    methods: {
        onSubmit() {
          // ?ip=1.1.1.1&port=443&tls=true&host=cloudflare.com
            const url = '/api?ip='+this.servDomain +'&host=' + this.host + '&port=' + this.port +'&tls='+ this.tls
            // get site url 
            const siteUrl = window.location.origin;

            fetch(url, {
                method: "GET"
            })
                .then((response) => {
                    response.text().then((data) => {
                        this.result = data;
                        // this.subscribe_url = siteUrl + url + '&format=base64';
                        console.log("data" + data)
                    });
                })
                .catch((err) => {
                    console.error(err);
                    this.result = err;
                });
        },

    }
}

</script>
    
<style>
.margin-bottom {
    margin-bottom: 15px;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

pre {
    white-space: pre-wrap;
}
</style>
