const fs = require('fs');
const path = require('path');

const getMarkdown = pathToMarkdown => {
    const absPath = path.join(process.cwd(), pathToMarkdown);
    try {
        return fs.readFileSync(absPath).toString();
    } catch (e) {
        console.error('Markdown read error: ', e.message);
        return '';
    }
};

module.exports = (locals, scripts, scriptTags) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" type="text/css" media="all" href="/public/sqcr-demo/css/slides.css"></link>
      </head>
      <body>
        <!-- TODO: self host locally? -->
        <script src="https://remarkjs.com/downloads/remark-latest.min.js"></script>
        <script>
var BLANK_PAGE_URL = '/public/blank.html';
var slideshow = remark.create({
    sourceUrl: "${locals.MARKDOWN_PATH}",
    highlightStyle: "monokai"
});

slideshow.on('showSlide', function (slide) {
    const {
        properties = { iframeURL: null, iframeSelector: null },
        properties: {
            iframeURL,
            iframeSelector
        }
    } = slide;

    if (iframeSelector) {
        const el = document.querySelector(iframeSelector);
        if (el) {
            el.src = iframeURL;
        }
    }
  // Slide is the slide being navigated to
});

slideshow.on('hideSlide', function (slide) {
    // Blank out all iframes
    const iframes = document.querySelectorAll('iframe');
    Array.from(iframes).forEach(el => {
        el.src = BLANK_PAGE_URL;
    })
});
        </script>
      </body>
    </html>
`;
