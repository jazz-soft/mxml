const fs = require('fs');
const {XMLParser, XMLBuilder} = require('fast-xml-parser');

var i;
var body = [];
body.push("const p2t = '" + read_xml('parttime.xsl') + "';");
body.push("const t2p = '" + read_xml('timepart.xsl') + "';");

const lines = fs.readFileSync('specs.txt', 'utf8').split(/\r?\n/);
for (i = 0; i < lines.length; i++) if (lines[i] == '<BODY>') lines[i] = body.join('\n');
fs.writeFileSync('../specs.cjs', lines.join('\n'), 'utf8');

function read_xml(fname) {
  const data = fs.readFileSync(fname, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false });
  const builder = new XMLBuilder({ ignoreAttributes: false });
  return builder.build(parser.parse(data));
}