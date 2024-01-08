const path = require('path')

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    //告诉jest 哪些文件拓展名需要测试
    moduleFileExtensions: [
        'js',
    ],
    // 是否显示覆盖率报告
    collectCoverage: false,
    // 这将用于配置覆盖结果的最低阈值强制
    coverageThreshold: {
        global: {
            statements: 90, // 保证每个语句都执行了
            functions: 90, // 保证每个函数都调用了
            branches: 90, // 保证每个 if 等分支代码都执行了
        },
    },
    //从正则表达式到允许根资源的模块名称或模块名称数组的映射
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    //通过一个默认地址给浏览器环境
    testURL: 'http://localhost/',
    //转换/翻译测试问题
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
    },
    //快照
    snapshotSerializers: ['<rootDir>/node_modules/'],
    //运行一些代码以配置或设置测试框架的模块的路径列表
    setupFiles: ['<rootDir>/test/unit/setup'],
    //Jest应该输出其覆盖范围文件的目录。
    coverageDirectory: '<rootDir>/test/unit/coverage',
    //匹配需要从中收集覆盖信息的文件
    collectCoverageFrom: [
        'src/**/*.{js}',
        '!**/node_modules/**'
    ]
}