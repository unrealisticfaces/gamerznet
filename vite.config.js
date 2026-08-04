import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-proxies',
        configureServer(server) {
          server.middlewares.use('/api/igdb', async (req, res) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { search } = JSON.parse(body)
                  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.IGDB_CLIENT_ID}&client_secret=${env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' })
                  const { access_token } = await tokenRes.json()
                  const igdbRes = await fetch('https://api.igdb.com/v4/games', {
                    method: 'POST',
                    headers: {
                      'Client-ID': env.IGDB_CLIENT_ID,
                      'Authorization': `Bearer ${access_token}`,
                      'Content-Type': 'text/plain'
                    },
                    body: `search "${search}"; fields name, cover.url, screenshots.url, summary; limit 1;`
                  })
                  const data = await igdbRes.json()
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (e) {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: e.message }))
                }
              })
            }
          })

          server.middlewares.use('/api/steam', async (req, res) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { search } = JSON.parse(body)
                  const searchRes = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(search)}&l=english&cc=US`)
                  const searchData = await searchRes.json()
                  if (searchData.items && searchData.items.length > 0) {
                    const appId = searchData.items[0].id
                    const detailRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
                    const detailData = await detailRes.json()
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(detailData[appId].data))
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(null))
                  }
                } catch (e) {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: e.message }))
                }
              })
            }
          })

          server.middlewares.use('/api/freetogame', async (req, res) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { search } = JSON.parse(body)
                  const f2pRes = await fetch('https://www.freetogame.com/api/games')
                  const f2pData = await f2pRes.json()
                  const match = f2pData.find(g => g.title.toLowerCase().includes(search.toLowerCase()))
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(match || null))
                } catch (e) {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: e.message }))
                }
              })
            }
          })
        }
      }
    ],
  }
})