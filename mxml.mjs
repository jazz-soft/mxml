import {EditorView, basicSetup} from "codemirror"
import {EditorState, Compartment} from "@codemirror/state"
import {syntaxTree} from '@codemirror/language';
import {xml} from "@codemirror/lang-xml"
import MXML from "jazz-mxml";

function watcher(self) {
  return EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      var notify = false;
      var txt = update.state.doc.toString().trim();
      var X = new MXML(txt);
      var type;
      if (X.isValid()) {
        if (X.isPartwise()) type = 'partwise';
        else if (X.isTimewise()) type = 'timewise';
        else if (X.isOpus()) type = 'opus';
        else if (X.isMei()) type = 'mei';
        if (!self.summary.valid || self.summary.type != type) notify = true;
        self.summary.valid = true;
        self.summary.type = type;
      }
      else {
        if (self.summary.valid) notify = true;
        self.summary.valid = false;
      }
      if (notify) self.notify(self.summary);
    }
  });
}

function MxmlEditor(where) {
  const rdonly = new Compartment;
  this.MXML = MXML;
  this.summary = { valid: false };
  this.notify = function() {};
  this.editor = new EditorView({
    extensions: [basicSetup, rdonly.of(EditorState.readOnly.of(false)), xml(), watcher(this)],
    parent: document.getElementById(where)
  });
  this.focus = function() { this.editor.focus(); };
  this.setRdonly = function(b) { this.editor.dispatch({ effects: rdonly.reconfigure(EditorState.readOnly.of(b)) }); };
  this.setText = function(txt) {
    this.editor.dispatch(this.editor.state.update({
      changes: { from: 0, to: this.editor.state.doc.length, insert: txt },
      selection: { anchor: 0 }
    }));
  };
  this.getText = function() {
    return this.editor.state.doc.toString();
  };
  this.loadData = async function(data) {
    var txt, mxl, zip;
    var info = MXML.zipInfo(data);
    if (info) {
      txt = await MXML.unzip(data);
    }
    if (txt) {
      for (var x of info) if (x.name == 'META-INF/container.xml') mxl = true;
      zip = true;
    }
    else {
      txt = new TextDecoder().decode(data);
    }
    this.setText(txt);
    return { mxl: mxl, zip: zip };
  };
  this.part2time = function() {
    var txt = (new MXML(this.getText())).part2time();
    if (txt) this.setText(txt);
  };
  this.time2part = function() {
    var txt = new MXML(this.getText()).time2part();
    if (txt) this.setText(txt);
  };
  this.midi = function() { return new MXML(this.getText()).midi(); };
  this.midi2 = function() { return new MXML(this.getText()).midi2(); };
  this.test = function() {
    var tree = syntaxTree(this.editor.state);
    if (!tree) { console.log('No tree'); return; }
    var cursor = tree.cursor();
    var txt = this.getText();
    while (true) {
      console.log(cursor.name, cursor.from, cursor.to, txt.substring(cursor.from, cursor.to).substring(0, 80));
      if (!cursor.next()) break;
    }
  };
}

window.MxmlEditor = MxmlEditor;