import { app } from './src/app.js'
import { config } from './src/config/index.js'
import { logger } from './src/utils/logger.js'

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
})
