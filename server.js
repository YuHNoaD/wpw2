const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = parsedUrl.pathname;

    if (pathname === '/emailList' || pathname.endsWith('/emailList')) {
        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk.toString(); });
        req.on('end', () => {
            const params = querystring.parse(bodyStr);
            const action = parsedUrl.searchParams.get('action') || params.action || 'add';

            if (action === 'join') {
                res.writeHead(302, { 'Location': '/index.html' });
                return res.end();
            }

            const firstName = params.firstName || 'Joel';
            const lastName = params.lastName || 'Murach';
            const email = params.email || 'joel@murach.com';
            const dob = params.dob || '';
            const hearAbout = params.hearAbout || 'Search engine';
            const announcements = Array.isArray(params.announcements) ? params.announcements.join(', ') : (params.announcements || 'None');
            const contactBy = params.contactBy || 'Email or postal mail';

            let thanksPath = path.join(__dirname, 'src', 'main', 'webapp', 'thanks.jsp');
            if (!fs.existsSync(thanksPath)) {
                thanksPath = path.join(__dirname, 'thanks.jsp');
            }
            if (!fs.existsSync(thanksPath)) {
                thanksPath = path.join(__dirname, 'src', 'main', 'webapp', 'thanks.html');
            }

            if (fs.existsSync(thanksPath)) {
                let html = fs.readFileSync(thanksPath, 'utf8');
                html = html.replace(/<%@ page.*%>/gi, '');
                html = html.replace(/\$\{user\.firstName\}/g, firstName);
                html = html.replace(/\$\{user\.lastName\}/g, lastName);
                html = html.replace(/\$\{user\.email\}/g, email);
                html = html.replace(/\$\{firstName\}/g, firstName);
                html = html.replace(/\$\{lastName\}/g, lastName);
                html = html.replace(/\$\{email\}/g, email);
                html = html.replace(/\$\{dob\}/g, dob);
                html = html.replace(/\$\{hearAbout\}/g, hearAbout);
                html = html.replace(/\$\{announcements\}/g, announcements);
                html = html.replace(/\$\{contactBy\}/g, contactBy);

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(html);
            }

            res.writeHead(302, { 'Location': '/thanks.html' });
            return res.end();
        });
        return;
    }

    if (pathname === '/' || pathname === '/ch02email' || pathname === '/ch02email/') {
        pathname = '/index.html';
    }

    let filePath = path.join(__dirname, 'src', 'main', 'webapp', pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, pathname);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.jsp': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Server Error');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
