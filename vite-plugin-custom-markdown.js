import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import Handlebars from 'handlebars';

const md = new MarkdownIt();
const __dirname = new URL('.', import.meta.url).pathname;

export default function customMarkdownPlugin() {
  return {
    name: 'custom-markdown-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (url.startsWith('/blog/') && url.endsWith('.html')) {
          try {
            const mdPath = resolve(__dirname, `.${url.replace(/\.html$/, '.md')}`);

            if (existsSync(mdPath)) {
              const markdownContent = readFileSync(mdPath, 'utf-8');
              const { attributes, body } = fm(markdownContent);
              const contentHtml = md.render(body);

              // 1. Read the layout file's content
              const layoutPath = resolve(__dirname, attributes.layout.replace('../', ''));
              const layoutFileContent = readFileSync(layoutPath, 'utf-8');
              
              // 2. Compile the layout using Handlebars
              const template = Handlebars.compile(layoutFileContent);

              // 3. Create the data object for the template
              const context = {
                ...attributes, // This includes title, author, date, etc.
                body: contentHtml // Use 'body' key for {{{body}}}
              };

              // 4. Generate the final HTML by executing the template with the data
              const finalHtml = template(context);

              res.setHeader('Content-Type', 'text/html');
              res.end(finalHtml);
              return;
            }
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end('Server error');
            return;
          }
        }
        next();
      });
    }
  };
}

