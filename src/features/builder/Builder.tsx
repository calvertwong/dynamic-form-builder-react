
import { AppContext } from 'contexts/AppContext';
import { useContext } from 'react';
import { TextInput } from '@molecules/textInput/TextInput';
import { Paragraph } from '@atoms/paragraph/Paragprah';
import { TField, TFinalJson } from './Builder.types';

export const Builder = () => {
  const { finalJson } = useContext(AppContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
      {finalJson.map((item: TFinalJson, questionIndex: number) => (
        <div key={`question-${questionIndex}`} >
          {/* Render the question */}
          <Paragraph>{item.question}</Paragraph>
          <br />
          {/* Render each field */}
          {item.fields.map((field: TField, fieldIndex: number) => (
            <div key={`field-${fieldIndex}`} style={{ marginLeft: 24 }}>
              {/* Render label and fieldName using TextInput */}
              <TextInput
                label={field.label || 'No Label'}
                value={field.fieldName}
                onChange={() => { }}
              />

              <Paragraph>
                Required: {field.required ? 'Yes' : 'No'}
              </Paragraph>

              <br />

              <Paragraph>Type: {field.type}</Paragraph>
              <br />
              <br />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
