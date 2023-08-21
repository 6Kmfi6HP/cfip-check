<template>
 <header class="navbar">

  <h1 class="navbar-item">
    <a href="https://github.com/3Kmfi6HP">3Kmfi6HP</a> 
  </h1>

</header>

    <main class="section">
        <h1 class="title">Deta.app cf ip remote check</h1>

        <div class="columns">

            <div class="column">
                <form @submit.prevent="onSubmit">

                    <div class="field">
                        <label class="label">server</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter server domain or ip"
                                v-model="servDomain">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">tls</label>
                        <div class="control">
                            <label>
                                <input type="radio" name="tls" value="true" v-model="tls" checked />
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
                servDomain: 'cdn.xn--b6gac.eu.org:443',
                host: 'speed.cloudflare.com',
                result: '',
                tls: true
            }
        },
        mounted() {
            const params = new URLSearchParams(window.location.search)
            if (params.has('ip')) {
                this.ip = params.get('ip')
            }

            if (params.has('host')) {
                this.host = params.get('host')
            }

            if (params.has('port')) {
                this.port = params.get('port')
            }

            if (params.has('tls')) {
                this.tls = params.get('tls')
            }
            if (this.ip && this.host && this.port && this.tls) {
                // 执行提交逻辑
                this.onSubmit()
            }
        },
        methods: {
            onSubmit() {
                let parts = this.servDomain.split(':')

                let ip = parts[0]
                let port = parts[1] || 443

                console.log('IP:', ip)
                console.log('Port:', port)
                // ?ip=1.1.1.1&port=443&tls=true&host=cloudflare.com
                const url = '/api?ip=' + ip + '&host=' + this.host + '&port=' + port + '&tls=' + this.tls
                const surl = '/?ip=' + ip + '&host=' + this.host + '&port=' + port + '&tls=' + this.tls
                // get site url 
                const siteUrl = window.location.origin;

                fetch(url, {
                    method: "GET"
                })
                    .then((response) => {
                        response.text().then((data) => {
                            this.result = '\n\n' + data;
                            this.subscribe_url = siteUrl + surl;
                            console.log("data" + data + url)
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