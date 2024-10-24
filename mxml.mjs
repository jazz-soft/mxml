import {EditorView, basicSetup} from "codemirror"
import {syntaxTree} from '@codemirror/language';
import {xml} from "@codemirror/lang-xml"
import specs from "./specs.cjs"

function MxmlEditor(where) {
  this.editor = new EditorView({
    extensions: [basicSetup, xml({elements: specs.elements})],
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