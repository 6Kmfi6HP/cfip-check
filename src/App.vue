<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://t.me/edtunnel">
            <strong>EDtunnel</strong>
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="/">
              {{ $t('nav.home') }}
            </a>

            <a class="navbar-item" href="https://github.com/yourusername/yourrepository">
              {{ $t('nav.github') }}
            </a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light" href="https://t.me/edtunnel">
                  <strong>{{ $t('nav.contact') }}</strong>
                </a>
                <button class="button is-light" @click="toggleLanguage">
                  {{ currentLanguage === 'en' ? '🇨🇳' : '🇺🇸' }}
                </button>
                <button class="button is-light" @click="toggleDarkMode">
                  {{ isDarkMode ? '🌞' : '🌙' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="section">
      <div class="container">
        <h1 class="title">{{ $t('main.title') }}</h1>

        <div class="columns">
          <div class="column">
            <form @submit.prevent="onSubmit" ref="form">
              <div class="field">
                <label class="label">{{ $t('main.ip') }}</label>
                <div class="control">
                  <input class="input" type="text" :placeholder="$t('main.ipPlaceholder')"
                    v-model="servDomain">
                </div>
              </div>

              <div class="field">
                <label class="label">{{ $t('main.tls') }}</label>
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
                <label class="label">{{ $t('main.host') }}</label>
                <div class="control">
                  <input class="input" type="text" :placeholder="$t('main.hostPlaceholder')"
                    v-model="host">
                </div>
              </div>

              <button class="button is-primary" :class="{ 'is-loading': isLoading }" :disabled="isLoading">
                {{ isLoading ? $t('main.checking') : $t('main.submit') }}
              </button>
            </form>
            <br />
            <article class="message is-dark">
              <div class="message-header">
                <p>{{ $t('main.usage') }}</p>
              </div>
              <div class="message-body">
                <p>{{ $t('main.usageText') }}</p>
              </div>
            </article>
          </div>

          <div class="column">
            <div v-if="isLoading" class="notification is-info">
              {{ $t('result.loading') }}
            </div>
            <div v-else-if="errorMessage" class="notification is-danger">
              {{ errorMessage }}
            </div>
            <template v-else-if="Object.keys(filteredData).length > 0">
              <label class="label">{{ $t('result.info') }}</label>
              <div ref="mapContainer" style="height: 300px; margin-bottom: 20px;"></div>
              <div class="table-container">
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <tbody>
                    <tr v-for="(value, key) in filteredData" :key="key">
                      <td>{{ $t(`result.tableHeaders.${key}`) }}</td>
                      <td>{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>{{ $t('footer.description') }}</p>
          <p>
            <a href="https://github.com/yourusername/yourrepository" target="_blank" rel="noopener noreferrer">
              {{ $t('footer.viewOnGithub') }}
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },
  data() {
    return {
      servDomain: '',
      host: 'speed.cloudflare.com',
      result: '',
      tls: true,
      filteredData: {},
      errorMessage: '',
      isLoading: false,
      mapData: null,
      currentLanguage: localStorage.getItem('userLocale') || navigator.language.split('-')[0],
      isDarkMode: false,
      prefersDarkMode: false,
    }
  },
  watch: {
    servDomain: {
      handler(newValue) {
        this.servDomain = newValue.replace(/^(https?:\/\/)/, '');
      },
      immediate: true
    },
    currentLanguage(newLang) {
      localStorage.setItem('userLocale', newLang);
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search)
    const savedData = JSON.parse(localStorage.getItem('lastQuery')) || {}
    
    // 分离 IP 和端口
    let ip = params.get('ip') || savedData.servDomain || '45.84.242.227'
    let port = params.get('port') || savedData.port || "8443"

    // 如果 IP 中已包含端口，则分离它们
    if (ip.includes(':')) {
      const parts = ip.split(':')
      ip = parts[0]
      port = parts[1] || port
    }

    this.servDomain = ip
    this.host = params.get('host') || savedData.host || "speed.cloudflare.com"
    this.tls = params.get('tls') !== null ? params.get('tls') === 'true' : (savedData.tls || true)
    
    // 在 onSubmit 之前设置完整的 servDomain
    this.servDomain = `${ip}:${port}`
    
    this.locale = this.currentLanguage
    
    this.onSubmit()

    // Add this to make the mobile burger menu functional
    document.addEventListener('DOMContentLoaded', () => {
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
          });
        });
      }
    });

    // Check system preference for dark mode
    this.prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial dark mode state
    this.isDarkMode = localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && this.prefersDarkMode);

    // Listen for changes in system color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.handleSystemThemeChange);
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      this.errorMessage = '';
      this.filteredData = {};

      let [ip, port] = this.servDomain.split(':')
      port = port || '443'

      console.log('IP:', ip)
      console.log('Port:', port)
      const url = '/api?ip=' + ip + '&host=' + this.host + '&port=' + port + '&tls=' + this.tls
      const surl = '/?ip=' + ip + '&host=' + this.host + '&port=' + port + '&tls=' + this.tls
      const siteUrl = window.location.origin;
      const translatedKeys = {
        colo: "数据中心",
        h: "主机名",
        ip: "反代 IP",
        loc: "地理位置",
        myip: "我的 IP",
        origin: "回源端口",
        proxyip: "是否PROXYIP",
        reverse: "是否反代",
        ts: "时间戳",
        warp: "Warp 状态"
      };
      fetch(url, {
        method: "GET"
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(async (data) => {
          this.errorMessage = '';
          this.result = '\n\n' + JSON.stringify(data);
          this.subscribe_url = siteUrl + surl;
          this.jsonData = data;
          this.filteredData = await this.processData(data);
          this.mapData = {
            latitude: data.Latitude,
            longitude: data.Longitude
          };
          // Use setTimeout to delay map initialization
          setTimeout(() => this.initMap(), 100);

          // Save query data
          const queryData = {
            servDomain: ip,
            host: this.host,
            tls: this.tls,
            port: port
          }
          localStorage.setItem('lastQuery', JSON.stringify(queryData))
        })
        .catch((err) => {
          console.error(err);
          this.result = '';
          this.filteredData = {};
          this.errorMessage = '检测出错：' + (err.message || '未知错误');
          if (err.message.includes('500')) {
            this.errorMessage += '。服务器内部错误，请稍后再试。';
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async processData(data) {
      const ipsbData = await this.fetchIpsbData(data.ip);
      return {
        'IP': data.ip,
        'Location': ipsbData ? `${ipsbData.country}, ${ipsbData.country_code}` : 'Unknown',
        'DataCenter': data.colo,
        'Origin': data.origin,
        'ProxyIP': data.proxyip,
        'Reverse': data.reverse,
        'Warp': data.warp,
        'ASN': ipsbData ? ipsbData.asn : 'Unknown',
        'Organization': ipsbData ? ipsbData.organization : 'Unknown',
      };
    },
    async fetchIpsbData(ip) {
      try {
        const response = await fetch(`https://api.ip.sb/geoip/${ip}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching data from ip.sb:', error);
        return null;
      }
    },
    initMap() {
      if (!this.mapData || !this.$refs.mapContainer) return;

      const { latitude, longitude } = this.mapData;
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) return;

      // Remove existing map if it exists
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      // Clear the map container
      this.$refs.mapContainer.innerHTML = '';

      // Create a new map instance
      this.map = L.map(this.$refs.mapContainer).setView([lat, lon], 13);
      if (this.isDarkMode) {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB'
        }).addTo(this.map);
      } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
      }

      this.marker = L.marker([lat, lon]).addTo(this.map);

      this.marker.bindPopup(`
        <b>${this.filteredData['Location']}</b><br>
        IP: ${this.filteredData['IP']}<br>
        ASN: ${this.filteredData['ASN']}<br>
        Organization: ${this.filteredData['Organization']}
      `).openPopup();

      // Force a resize of the map
      this.map.invalidateSize();
    },
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'en' ? 'zh' : 'en';
      this.locale = this.currentLanguage;
      localStorage.setItem('userLocale', this.currentLanguage);
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode);
    },
    handleSystemThemeChange(e) {
      if (localStorage.getItem('darkMode') === null) {
        this.isDarkMode = e.matches;
      }
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
    // Remove event listener
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.handleSystemThemeChange);
  }
}
</script>

<style>
/* @import "~leaflet/dist/leaflet.css"; */

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

.button.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

.footer {
  padding: 3rem 1.5rem 3rem;
  background-color: #f5f5f5;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer a {
  color: #3273dc;
}

.footer a:hover {
  color: #363636;
}

/* Custom styles for responsiveness */
.container {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media screen and (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

@media screen and (min-width: 1216px) {
  .container {
    max-width: 1152px;
  }
}

@media screen and (min-width: 1408px) {
  .container {
    max-width: 1344px;
  }
}

/* Other existing styles */
.navbar-item img {
  max-height: 2.5rem;
}

/* Dark mode styles */
.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .navbar {
  background-color: #363636 !important;
}

.dark-mode .footer {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .button.is-light {
  background-color: #363636;
  color: #f5f5f5;
}

.dark-mode .input,
.dark-mode .table {
  background-color: #2c2c2c;
  color: #f5f5f5;
  border-color: #4a4a4a;
}

.dark-mode .table td,
.dark-mode .table th {
  border-color: #4a4a4a;
}

.dark-mode .table.is-striped tbody tr:not(.is-selected):nth-child(even) {
  background-color: #2a2a2a;
}

.dark-mode .message.is-dark {
  background-color: #363636;
}

.dark-mode .message.is-dark .message-header {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .message.is-dark .message-body {
  border-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .notification.is-info {
  background-color: #2160c4;
  color: #fff;
}

.dark-mode .notification.is-danger {
  background-color: #f14668;
  color: #fff;
}

.dark-mode .title,
.dark-mode .label {
  color: #f5f5f5;
}

.dark-mode .leaflet-container {
  background-color: #2c2c2c;
}

/* Fix for hover effect in dark mode */
.dark-mode .table tbody tr:hover {
  background-color: #3a3a3a !important;
  color: #ffffff !important;
}

/* Ensure even rows in striped tables have correct hover effect */
.dark-mode .table.is-striped tbody tr:not(.is-selected):nth-child(even):hover {
  background-color: #3a3a3a !important;
  color: #ffffff !important;
}

/* Add this to your existing styles */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
