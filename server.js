const express = require('express')
const next = require('next')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const port = process.env.PORT || '3000'
const logger = require('morgan')
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { join } = require('path')
const { parse } = require('url')
    
app
.prepare()
.then(() => {
  const server = express()

  // pages
  const index = require('./server/routes/index')

  // logs
  server.use(logger('dev'))

  // configs
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  // pages
  server.get('/', index.index(app))
    
  server.get('*', (req, res) => {
    // setup static files from root like sitemap.xml || robots.txt || favicon.ico
    const parsedUrl = parse(req.url, true)
    const rootStaticFiles = [
      '/robots.txt',
      '/sitemap.xml', 
      '/favicon.ico'
    ]

    if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
      const path = join(__dirname, 'static', parsedUrl.pathname)
      return app.serveStatic(req, res, path)
    }

    // else serve page if not required by server
    return handle(req, res)
  })
    
  if (dev) {
    // if in development don't use cluster api since this causes webpack hot reload to behave erratically
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Development server ready on http://localhost:${port}`)
    })
  } else {
    // cluster api for production only
    server.set('port', port)

    // setup workers for concurrency
    if (cluster.isMaster) {
      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
      }

      // If a worker dies, log it to the console and start another worker.
      cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died.')
        cluster.fork()
      })

      // Log when a worker starts listening
      cluster.on('listening', (worker, address) => {
        console.log('Worker started with PID ' + worker.process.pid + '.')
      })
    } else {
      //Create HTTP server.
      let ns = http.createServer(server)

      // Listen on provided port, on all network interfaces.    
      ns.listen(port)

      ns.on('error', (error) => {
        if (error.syscall !== 'listen') throw error

        const bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
          case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
          default:
            throw error
        }
      })

      ns.on('listening', () => {
        const addr = ns.address()
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port
        debug('Listening on ' + bind)
      })
    }
  }
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})