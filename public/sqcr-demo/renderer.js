module.exports = (locals, scripts, scriptTags) => `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Untitled - osc.js demo</title>
            <meta charset="UTF-8" />
            <link rel="stylesheet" type="text/css" media="all" href="/public/css/grid.css"></link>
            <link rel="stylesheet" type="text/css" media="all" href="/public/css/global.css"></link>
            <link rel="stylesheet" type="text/css" media="all" href="/public/sqcr-demo/styles.css"></link>
            ${scriptTags.join('\n')}
        </head>

        <body>
            SDASDASDASD
        </body>
    </html>
`;
