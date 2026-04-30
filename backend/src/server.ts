import createApp from './app.js'

const PORT = parseInt(process.env.PORT || '3001', 10)

const app = createApp()

app.listen(PORT, () => {
  console.log(`Minesweeper API server running on http://localhost:${PORT}`)
})
