require.config({
    baseUrl : 'js',
    paths : {
        vue : ["https://cdn.jsdelivr.net/npm/vue/dist/vue", "vue"],
        jquery : ["http://libs.baidu.com/jquery/2.0.3/jquery", 'jquery-1.8.0.min'],
        ws: ["socket"]
    },
    shim: {
        ws: {
            deps: ["jquery", "vue"],
            exports: "ws"
        },
        vue: {
            deps: ["jquery"],
            exports: "vue"
        }
    }
})