import React, { useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';
import { v4 } from "uuid";

// Custom Upload Adapter
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const imgRef = ref(storage, `images/event_images/description_images/${v4()}`);
    const snapshot = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { default: url };
  }

  abort() { }
}

// Setup Custom Upload Adapter for CKEditor
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const CustomCKEditor = ({ value, onChange }) => {
  const handleEditorChange = useCallback((event, editor) => {
    const data = editor.getData();
    onChange(data);
  }, [onChange]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={onChange}
      config={{ extraPlugins: [CustomUploadAdapterPlugin] }}
    />
  );
};

export default React.memo(CustomCKEditor);