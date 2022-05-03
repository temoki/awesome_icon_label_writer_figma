'use strict';
const fs = require('fs');
const https = require('https'); 

function conv(name, url) {
    https.get(url, (res) => {
        if (res.statusCode === 302) {
            // Redirect
            conv(name, res.headers.location)
            return
        }

        if (res.statusCode === 200) {
            res.setEncoding('utf8')
            var data = ''
            res.on('data', (chunk) => data += chunk)
            res.on('end', () => {
                const json = JSON.parse(data)
                var output = `const ${name} = new Map([`
                Object.keys(json).forEach((iconName) => {
                    const unicode = json[iconName].unicode
                    output += `  ["${unicode}","${iconName}"],`
                })
                output += "])"
                fs.writeFileSync(`${name}.js`, output)
            })
            return
        }

        console.log("Status = " + res.statusCode)
        console.log("Headers = " + res.headers)
    })
}

conv("faIcons6", "https://github.com/FortAwesome/Font-Awesome/raw/6.x/metadata/icons.json")
conv("faIcons5", "https://github.com/FortAwesome/Font-Awesome/raw/5.x/metadata/icons.json")
