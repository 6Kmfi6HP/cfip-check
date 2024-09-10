export const messages = {
    en: {
      nav: {
        home: 'Home',
        github: 'GitHub',
        contact: 'Contact',
      },
      main: {
        title: 'CF IP Remote Check',
        ip: 'IP',
        ipPlaceholder: 'Enter server domain or ip',
        tls: 'TLS',
        host: 'Host',
        hostPlaceholder: 'Enter host must same sni in cf',
        submit: 'Submit',
        checking: 'Checking...',
        usage: 'Usage',
        usageText: 'This is a CF IP remote check tool. Enter the server domain or IP, select the TLS option, and enter the host (which must be the same as SNI in CF) to proceed with the check.',
      },
      result: {
        info: 'INFO',
        loading: 'Checking, please wait...',
        tableHeaders: {
          IP: 'IP',
          Location: 'Location',
          DataCenter: 'Data Center',
          Origin: 'Origin',
          ProxyIP: 'Proxy IP',
          Reverse: 'Reverse',
          Warp: 'Warp',
          ASN: 'ASN',
          Organization: 'Organization'
        }
      },
      footer: {
        description: 'CF IP Remote Check by EDtunnel.',
        viewOnGithub: 'View on GitHub',
      },
    },
    zh: {
      nav: {
        home: '首页',
        github: 'GitHub',
        contact: '联系',
      },
      main: {
        title: 'CF IP 远程检测',
        ip: 'IP',
        ipPlaceholder: '输入服务器域名或 IP',
        tls: 'TLS',
        host: '主机',
        hostPlaceholder: '输入与 CF 中 SNI 相同的主机',
        submit: '提交',
        checking: '检测中...',
        usage: '使用说明',
        usageText: '这是一个 CF IP 远程检测工具。请输入服务器域名或 IP，选择 TLS 选项，并输入托管在 CF CDN 中的 HOST 主机，然后点击提交按钮进行检测。',
      },
      result: {
        info: '信息',
        loading: '正在检测中，请稍候...',
        tableHeaders: {
          IP: 'IP',
          Location: '位置',
          DataCenter: '数据中心',
          Origin: '源站',
          ProxyIP: '代理 IP',
          Reverse: '反向代理',
          Warp: 'Warp',
          ASN: 'ASN',
          Organization: '组织'
        }
      },
      footer: {
        description: 'CF IP 远程检测由 EDtunnel 提供。',
        viewOnGithub: '在 GitHub 上查看',
      },
    },
  }