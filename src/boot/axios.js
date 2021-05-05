import { createApp } from 'vue'
import axios from 'axios'
const app = createApp()

app.use('$axios', axios)