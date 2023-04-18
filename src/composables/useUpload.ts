import { ref } from 'vue';

export const useUpload = () => {
  const currentFile = ref<File>();
  const inputElement = ref();

  const handleFileChange = async (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.files === null) {
      return;
    }
    [currentFile.value] = target.files;
  };
  return {
    handleFileChange,
    currentFile,
    inputElement
  };
};
