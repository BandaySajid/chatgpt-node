let Gpt;
if (typeof require === 'function' && typeof require.resolve === 'function') {
    // CommonJS module system (Node.js)
    const GptModule = require('./lib/Gpt.js');
    Gpt = GptModule.default || GptModule;
} else {
    // ECMAScript module system (ESM)
    import('./lib/Gpt.js').then((GptModule) => {
        Gpt = GptModule.default || GptModule;
    });
}

export default Gpt;
