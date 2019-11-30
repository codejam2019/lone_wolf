module.exports = {
    apps: [{
        name: "weather",
        script: "./server.js",
        max_memory_restart: '100M'
        // instances : "5",
        // exec_mode : "cluster"
    }]
}
