import gleanIcon from './assets/glean-icon.png'
import './styles/fonts.css'
import './styles/global.css'

const favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/png'
favicon.href = gleanIcon
document.head.appendChild(favicon)
