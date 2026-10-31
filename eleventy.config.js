export default function (eleventyConfig) {
    // Statické soubory se kopírují beze změny
    for (const path of ['images', 'files', 'style.css', 'main.js', 'CNAME', 'robots.txt']) {
        eleventyConfig.addPassthroughCopy(`src/${path}`);
    }

    // Absolutní URL (canonical, Open Graph, sitemap)
    eleventyConfig.addFilter('absolute', (path, base) => new URL(path, base).href);

    return {
        dir: { input: 'src', output: '_site' },
        htmlTemplateEngine: 'njk',
    };
}
