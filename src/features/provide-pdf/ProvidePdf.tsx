import { FileInput } from '@molecules/fileInput/FileInput';
import { NumberInput } from '@molecules/numberInput/NumberInput';
import { TextInput } from '@molecules/textInput/TextInput';
import { useContext, useState } from 'react';
import styles from './ProvidePdf.module.scss';
import { axiosInstance } from 'network/axiosInstance';
import { AppContext } from 'contexts/AppContext';

export const ProvidePdf = () => {
  const [numOfQuestions, setNumOfQuestions] = useState<number | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const { setFinalJson, setCurrentRoute } = useContext(AppContext);

  const numOfQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (/^\d*$/.test(value)) {
      setNumOfQuestions(Number(event.target.value));
    }

    if (value === '') {
      setNumOfQuestions(undefined);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const collectQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const existedQuestion = selectedQuestions.some(item => item === value);

    if (!existedQuestion) {
      setSelectedQuestions([...selectedQuestions, value]);
    }
  };

  const submitPdf = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (selectedFile !== null && selectedQuestions.length > 0) {
      formData.append('singlePdf', selectedFile);
      formData.append('questions', JSON.stringify(selectedQuestions));

      try {
        const response = await axiosInstance.post('/parse-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setFinalJson(response.data.finalJson);
          setCurrentRoute('builder');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  return (
    <div className={styles['providePdf__container']}>
      <div className={styles['providePdf__contents']}>
        <FileInput onChange={handleFileChange} label='Upload file' />

        <br />

        <NumberInput onChange={numOfQuestionsChange} value={numOfQuestions} label='Enter number of questions' />
      </div>

      <div className={styles['providePdf__collectQuestionContainer']}>
        {
          Array.from({ length: numOfQuestions ?? 0 }).map((_, index: number) => (
            <TextInput
              key={`question_${index}`}
              label={`Question ${index + 1}`}
              value={selectedQuestions[index] || ''}
              onChange={collectQuestions}
            />
          ))
        }
      </div>

      <br />

      <button type='button' onClick={submitPdf}>Submit</button>

      <br />
    </div>
  );
};