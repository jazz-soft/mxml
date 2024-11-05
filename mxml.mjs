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
      if (X.isValid()) {
        if (!self.summary.valid) notify = true;
        self.summary.valid = true;
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
    this.setText(await MXML.unzip(data) || new TextDecoder().decode(data));  
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