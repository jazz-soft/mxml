import {EditorView, basicSetup} from "codemirror"
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
        if (!self.summary.valid) notify = true;
        self.summary.valid = true;
        if (X.isPartwise()) type = 'partwise';
        else if (X.isTimewise()) type = 'timewise';
        else if (X.isOpus()) type = 'opus';
        else if (X.isMei()) type = 'mei';
        if (self.summary.type != type) notify = true;
        self.summary.type = type;
        if (self.summary.zip != self.zip) notify = true;
        self.summary.zip = self.zip;
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
  this.summary = { valid: false };
  this.notify = function() {};
  this.editor = new EditorView({
    extensions: [basicSetup, xml(), watcher(this)],
    parent: document.getElementById(where)
  });
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
    var txt = await MXML.unzip(data);
    if (txt) this.zip = true;
    else {
      this.zip = true;
      txt = new TextDecoder().decode(data);
    }
    this.setText(txt);  
  };
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