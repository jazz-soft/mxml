import {EditorView, basicSetup} from "codemirror"
//import {xmlLanguage} from "@codemirror/lang-xml"
import {xml} from "@codemirror/lang-xml"

function MxmlEditor(where) {
  this.editor = new EditorView({
  extensions: [basicSetup, xml()],
    parent: document.getElementById(where)
  });
  this.setText = function(txt) {
    this.editor.dispatch(this.editor.state.update({changes: {
    from: 0, to: this.editor.state.doc.length, insert: txt}, selection: {anchor: 0}
  }));
};

}

window.MxmlEditor = MxmlEditor;