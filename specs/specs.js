const fs = require('fs');
const {XMLParser} = require('fast-xml-parser');

var i, k, A;
var body = [];
var Elem = {};
var Attr = {};
var AttrG = {};

const parser = new XMLParser({ ignoreAttributes: false });
const xml = parser.parse(fs.readFileSync('musicxml.xsd', 'utf8'));

traverse(xml, function(x) { delete x['xs:annotation']});
traverse(xml, collect('xs:element', Elem));
traverse(xml, collect('xs:attribute', Attr));
traverse(xml, collect('xs:attributeGroup', AttrG));

body.push('const elements = [');
A = [];
for (k of Object.keys(Elem)) A.push(make_elem(k));
body.push(A.join(',\n'));
body.push('];');

body.push('const attributes = [');
A = [];
for (k of Object.keys(Attr)) A.push(make_attr(k));
body.push(A.join(',\n'));
body.push('];');

const lines = fs.readFileSync('specs.txt', 'utf8').split(/\r?\n/);
for (i = 0; i < lines.length; i++) if (lines[i] == '<BODY>') lines[i] = body.join('\n');
//console.log(lines.join('\n'));
fs.writeFileSync('../specs.cjs', lines.join('\n'), 'utf8');

function traverse(x, f) {
  if (Array.isArray(x)) for (var y of x) traverse(y, f);
  else if (typeof x == 'object') {
    f(x);
    for (var k of Object.keys(x)) traverse(x[k], f);
  }
}
function collect(name, arr) {
  function fun(x) {
    var name = x['@_name'];
    if (!name) return;
    if (!arr[name]) arr[name] = [];
    arr[name].push(x);
  }
  return function(x) {
    var y = x[name];
    if (Array.isArray(y)) for (var z of y) fun(z);
    else if (typeof y == 'object') fun(y);
  };
}

function make_elem(k) {
  var x = Elem[k][0];
  var s ='{name:"' + k + '"';
  if (x['@_final']) s += ',top:true';
  s += '}';
  return s;
}
function make_attr(k) {
  //var x = Attr[k];
  return '{name:"' + k + '"}'
}