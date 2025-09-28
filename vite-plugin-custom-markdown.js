import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import Handlebars from 'handlebars';
import { sync as globSync } from 'glob';

const md = new MarkdownIt();
const __dirname = new URL('.', import.meta.url).pathname;

// A single helper function to build an HTML page from a markdown file path
function buildHtmlFromMd(mdPath) {
  if (!existsSync(mdPath)) return null;

  const markdownContent = readFileSync(mdPath, 'utf-8');
  const { attributes, body } = fm(markdownContent);
  const contentHtml = md.render(body);

  const layoutPath = resolve(__dirname, attributes.layout.replace('../', ''));
  if (!existsSync(layoutPath)) {
      throw new Error(`Layout file not found for ${mdPath}: ${layoutPath}`);
  }
  const layoutFileContent = readFileSync(layoutPath, 'utf-8');
  
  const template = Handlebars.compile(layoutFileContent);

  const context = { ...attributes, body: contentHtml };
  return template(context);
}

export default function customMarkdownPlugin() {
  return {
    name: 'custom-markdown-plugin',

    // This hook runs once at the start of the build process (npm run build)
    buildStart() {
      // Find all markdown files in the blog directory
      const mdFiles = globSync('blog/*.md');
      
      mdFiles.forEach(mdFile => {
        const finalHtml = buildHtmlFromMd(resolve(__dirname, mdFile));
        if (finalHtml) {
          // Tell Vite to create a new HTML file in the final build output
          this.emitFile({
            type: 'asset',
            fileName: mdFile.replace('.md', '.html'), // e.g., blog/how-to-vod-review.html
            source: finalHtml
          });
        }
      });
    },

    // This hook handles the live development server (npm run dev)
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        if (url.startsWith('/blog/') && url.endsWith('.html')) {
          const mdPath = resolve(__dirname, `.${url.replace(/\.html$/, '.md')}`);
          try {
            const finalHtml = buildHtmlFromMd(mdPath);
            if (finalHtml) {
              res.setHeader('Content-Type', 'text/html');
              res.end(finalHtml);
              return; // Stop the request here
            }
          } catch (e) {
            console.error(`Error serving ${url}:`, e);
            res.statusCode = 500;
            res.end('Server error');
            return;
          }
        }
        next(); // Continue to other middlewares if not a blog post
      });
    }
  };
}

