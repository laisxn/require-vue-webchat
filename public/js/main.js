require.config({
    baseUrl : 'js',
    paths : {
        vue : ["vue"],
        jquery : ['jquery-1.8.0.min'],
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
});