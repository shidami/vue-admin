const path = require('path');
module.exports = {
      // 部署应用时的基本URL.
    publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/': '/',
    // build时构建文件的目录,构建时传入 --no-clean 可关闭该行为.
    outputDir: 'dist',
     // build时放置生成的静态资源(js、css、img、fonts)的(相对于 outputDir 的)目录.
    assetsDir: '',
    // 指定生成的index.html的输出路径(相对于 outputDir),也可以是一个绝对路径.
    indexPath: 'index.html',
    // 默认在生成的静态资源文件名中包含hash以控制缓存.
    filenameHashing: true,
    // 构建多页面应用,页面的配置.
    // pages: {
    //  index: {
    //    // page的入口.
     //    entry: 'src/index/main.js',
    //    // 模板来源.
    //    template: 'public/index.html',
    //    // 在dist/index.html的输出.
    //    filename: 'index.html',
    //    // 当使用title选项时,template中的title标签需要是<title><%= htmlWebpackPlugin.options.title %></title>.
    //    title: 'Index Page',
    //    // 在这个页面中包含的块，默认情况下会包含.
    //    // 提取出来的通用 chunk 和 vendor chunk.
    //    chunks: ['chunk-vendors', 'chunk-common', 'index']
    //  },
    //  // 当使用只有入口的字符串格式时,模板会被推导为`public/subpage.html`,并且如果找不到的话,就回退到 `public/index.html`.
    //  // 输出文件名会被推导为`subpage.html`.
    //  subpage: 'src/subpage/main.js'
    // },
    // 是否在开发环境下通过eslint-loader在每次保存时lint代码(在生产构建时禁用 eslint-loader).
    lintOnSave: false,
    // 是否使用包含运行时编译器的Vue构建版本.
    runtimeCompiler: false,
    // Babel显式转译列表.
    transpileDependencies: [],
    // 如果你不需要生产环境的source map,可以将其设置为 false 以加速生产环境构建.
    productionSourceMap: true,
    // 设置生成的HTML中<link rel="stylesheet">和<script>标签的crossorigin属性(注:仅影响构建时注入的标签).
    crossorigin: '',
    // 在生成的HTML中的<link rel="stylesheet">和<script>标签上启用Subresource Integrity(SRI).
    integrity: false,
    // 如果这个值是一个对象,则会通过 webpack-merge 合并到最终的配置中.
    // 如果你需要基于环境有条件地配置行为,或者想要直接修改配置,那就换成一个函数(该函数会在环境变量被设置之后懒执行).该方法的第一个参数会收到已经解析好的配置.在函数内,你可以直接修改配置,或者返回一个将会被合并的对象.
    configureWebpack: (config) => {
        config.resolve = { // 配置解析别名
          extensions: ['.js', '.json', '.vue'],
          alias: {
              //runtime模式下指向vue.runtime.common.js,不能用vue.component
            'vue' : 'vue/dist/vue.js',
            '@': path.resolve(__dirname, './src'),
            'public': path.resolve(__dirname, './public'),
            'components': path.resolve(__dirname, './src/components'),
            'assets': path.resolve(__dirname, './src/assets'),
            'api': path.resolve(__dirname, './src/api'),
            'views': path.resolve(__dirname, './src/views'),
            'styles': path.resolve(__dirname, './src/styles')
          }
        }
    },
    // 对内部的webpack配置(比如修改、增加Loader选项)(链式操作).
    chainWebpack: config => {
		const svgRule = config.module.rule("svg")
		svgRule.uses.clear()
		svgRule
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]",
				include: ["./src/icon"]
			})
	},
    // css的处理.
     css: {
        // 当为true时,css文件名可省略module默认为false.
        requireModuleExtension: true,
        // 是否将组件中的CSS提取至一个独立的CSS文件中,当作为一个库构建时,你也可以将其设置为false免得用户自己导入CSS
        // 默认生产环境下是true,开发环境下是false.
        extract: false,
        // 是否为CSS开启source map.设置为true之后可能会影响构建的性能.
        sourceMap: false,
        // 向CSS相关的loader传递选项(支持:css-loader postcss-loader sass-loader less-loader stylus-loader).
        loaderOptions: { 
            scss:{
                prependData: `@import "./src/styles/main.scss";`
            } 
        }
    },
    // 所有webpack-dev-server的选项都支持.
    devServer: {
        proxy: {
            '/api': {
                target: 'http://www.web-jshtml.cn/productapi/token',
                changeOrigin:true,//允许跨域
                pathRewrite: {
                  '^/api': ''
                }
            }
        }
    },
    // 是否为Babel或TypeScript使用thread-loader.
    parallel: require('os').cpus().length > 1,
    // 向PWA插件传递选项.
    pwa: {},
    // 可以用来传递任何第三方插件选项.
    pluginOptions: {}
    }
    
