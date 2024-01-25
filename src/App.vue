<template>
    <header class="navbar">

        <h1 class="navbar-item">
            <a href="https://t.me/edtunnel">EDtunnel</a>
        </h1>

    </header>

    <main class="section">
        <h1 class="title">CF IP remote Check</h1>

        <div class="columns">

            <div class="column">
                <form @submit.prevent="onSubmit" ref="form">

                    <div class="field">
                        <label class="label">IP</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter server domain or ip" v-model="servDomain">
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
                            <input class="input" type="text" placeholder="Enter host must same sni in cf" v-model="host">
                        </div>
                    </div>


                    <button class="button is-primary">Submit</button>

                </form>
                <br />
                <article class="message is-dark">
                    <div class="message-header">
                        <p>Usage</p>
                        <!-- <button class="delete" aria-label="delete"></button> -->
                    </div>
                    <div class="message-body">

                        <p>
                            这是一个 CF IP 远程检测工具。请输入服务器域名或 IP，选择 <strong>TLS</strong> 选项，并输入托管在 CF CDN 中的 <strong>HOST</strong>
                            主机，然后点击提交按钮进行检测。
                        </p>
                        <p>
                            This is a CF IP remote check tool. Enter the server domain or IP, select the
                            <strong>TLS</strong>
                            option, and enter the host (which must be the same as <strong>SNI</strong> in CF) to proceed
                            with
                            the check.
                        </p>
                    </div>
                </article>


            </div>

            <div class="column">
                <!-- <h5>Returned text:</h5> -->
                <label class="label">INFO</label>
                <!-- <pre><a :href="subscribe_url" target="_blank">{{ subscribe_url }}</a>{{ result }}</pre> -->
                <!-- <h5>Returned JSON data:</h5> -->
                <!-- <pre> -->
                <!-- <table class="table"> -->
                <div class="table-container">
                    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <tbody>
                            <tr v-for="(value, key) in filteredData" :key="key">
                                <td>{{ key }}</td>
                                <td>{{ value }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- </pre> -->

                </div>
                <!-- <small><a :href="subscribe_url" target="_blank">{{ subscribe_url }}</a></small> -->

            </div>

        </div>

    </main>
</template>

<script>
export default {
    data() {
        return {
            servDomain: '',
            host: 'speed.cloudflare.com',
            result: '',
            tls: true,
            filteredData: {}
        }
    },
    mounted() {
        const params = new URLSearchParams(window.location.search)
        // if (params.has('ip')) {
        const ip = params.get('ip') || 'cdn.xn--b6gac.eu.org'
        // }

        // if (params.has('host')) {
        this.host = params.get('host') || "speed.cloudflare.com"

        // }

        // if (params.has('port')) {
        const port = params.has('port') || "443";
        this.servDomain = ip + ':' + port
        // }
        this.tls = params.get('tls') || true

        // if (params.has('tls')) {
        // }
        // if (this.ip && this.host && params.has('port') && this.tls) {
        // 执行提交逻辑
        this.onSubmit()
        // this.$refs.form.submit()
        // }

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
            const translatedKeys = {
                // clientip: "客户端 IP",
                colo: "数据中心",
                h: "主机名",
                ip: "反代 IP",
                loc: "地理位置",
                myip: "我的 IP",
                origin: "回源端口",
                proxyip: "是否PROXYIP",
                reverse: "是否反代",
                tls: "TLS",
                ts: "时间戳",
                warp: "Warp 状态"
            };
            fetch(url, {
                method: "GET"
            })
                .then((response) => {
                    response.json().then((data) => {
                        this.result = '\n\n' + JSON.stringify(data);
                        this.subscribe_url = siteUrl + surl;
                        this.jsonData = data; // 将获取的JSON数据存储到jsonData变量中
                        // 剔除不需要的字段
                        const {
                            City,
                            Country,
                            PostalCode,
                            Region,
                            asOrganization,
                            asn,
                            fl,
                            gateway,
                            http,
                            kex,
                            sliver,
                            sni,
                            uag,
                            visit_scheme
                        } = this.jsonData;

                        // 构建剩余字段的新对象
                        this.filteredData = {
                            // clientip: this.jsonData.clientip,
                            colo: this.jsonData.colo,
                            h: this.jsonData.h,
                            ip: this.jsonData.ip,
                            loc: this.jsonData.loc,
                            myip: this.jsonData.myip,
                            origin: this.jsonData.origin,
                            proxyip: this.jsonData.proxyip,
                            reverse: this.jsonData.reverse,
                            tls: this.jsonData.tls,
                            ts: this.jsonData.ts,
                            warp: this.jsonData.warp
                        };
                        // 构建剩余字段的新对象
                        this.filteredData = Object.keys(data).reduce((acc, key) => {
                            if (translatedKeys.hasOwnProperty(key)) {
                                acc[translatedKeys[key]] = data[key];
                            }
                            return acc;
                        }, {});

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

.table-container {
    width: 100%;
    overflow-x: auto;
}

.table td {
    white-space: nowrap;
}
</style>
