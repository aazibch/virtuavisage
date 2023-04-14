import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import { preview } from '../assets';
import { getRandomPrompt, downloadImage } from '../utils';
import { Loader, Input, Button, Modal, ArtifactModal } from '../components';
import { apiUrl } from '../constants';
import { useHttp } from '../hooks';
import { generateHttpConfig } from '../utils';

const validationSchema = yup.object({
  prompt: yup
    .string('Please provide a valid prompt.')
    .required('Please provide a prompt.')
});

const CreatePage = () => {
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState(null);
  const [isArtifactMaximized, setIsArtifactMaximized] = useState(null);
  const user = useSelector((state) => state.user);
  const {
    error: generateError,
    isLoading: isGenerating,
    sendRequest: sendGenerateRequest,
    dismissErrorHandler: dismissGenerateError
  } = useHttp();
  const {
    error: saveError,
    isLoading: isSaving,
    sendRequest: sendSaveRequest,
    dismissErrorHandler: dismissSaveError
  } = useHttp();

  const formik = useFormik({
    initialValues: {
      prompt: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      generateArtifact(values);
    }
  });

  const generateArtifact = async (values) => {
    setArtifact(null);
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts`,
      'POST',
      true,
      values
    );

    const handleResponse = (response) => {
      setArtifact({
        image: `data:image/png;base64,${response.data.artifact}`,
        prompt: response.data.prompt
      });
    };

    sendGenerateRequest(requestConfig, handleResponse);
  };

  const saveArtifactToCollectionHandler = async () => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/collection`,
      'POST',
      true,
      { prompt: artifact.prompt, artifact: artifact.image }
    );

    const handleResponse = (response) => {
      navigate('/collection');
    };

    sendSaveRequest(requestConfig, handleResponse);
  };

  const surpriseMeHandler = () => {
    const randomPrompt = getRandomPrompt(formik.values.prompt);
    formik.setFieldValue('prompt', randomPrompt);
  };

  const openMaximizedArtifactHandler = () => {
    setIsArtifactMaximized(true);
  };

  const closeMaximizedArtifactHandler = () => {
    setIsArtifactMaximized(false);
  };

  const maximizedArtifactDownloadHandler = (e, base64Artifact) => {
    // get first 24 digits of the base64 artifact representation.
    const id = base64Artifact
      .replace('data:image/png;base64,', '')
      .slice(0, 24);

    downloadImage(id, base64Artifact);
  };

  let maximizedArtifact;

  if (isArtifactMaximized) {
    const modifiedArtifact = {
      artifactUrl: artifact.image,
      prompt: artifact.prompt,
      user: { ...user }
    };

    maximizedArtifact = (
      <ArtifactModal
        artifact={modifiedArtifact}
        isLoading={isSaving}
        dropdownItems={[
          {
            content: 'Download',
            onClick: (e) =>
              maximizedArtifactDownloadHandler(e, modifiedArtifact.artifactUrl)
          },
          {
            content: 'Save to Collection',
            onClick: saveArtifactToCollectionHandler
          }
        ]}
        dismissModalHandler={closeMaximizedArtifactHandler}
      />
    );
  }

  let error;

  if (generateError) {
    error = (
      <Modal
        heading="Error"
        content={generateError}
        dismissModalHandler={dismissGenerateError}
      />
    );
  }

  if (saveError) {
    error = (
      <Modal
        overlaid
        heading="Error"
        content={saveError}
        dismissModalHandler={dismissSaveError}
      />
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      {error}
      {maximizedArtifact}
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create imaginative and visually appealing images with Stable Diffusion
          and share them with the community.
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-1">
          <Input
            label="Prompt"
            isSurpriseMe
            handleSurpriseMe={surpriseMeHandler}
            error={formik.touched.prompt && formik.errors.prompt}
            input={{
              type: 'text',
              name: 'prompt',
              placeholder: 'A plush toy robot sitting against a yellow wall',
              value: formik.values.prompt,
              onChange: formik.handleChange
            }}
          />

          <div
            onClick={artifact ? openMaximizedArtifactHandler : null}
            className={`relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 max-w-lg p-3 flex justify-center items-center ${
              artifact ? 'cursor-pointer' : 'cursor-auto'
            }`}
          >
            {artifact ? (
              <img
                src={artifact.image}
                alt={artifact.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {(isGenerating || isSaving) && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <Button
            className="mr-1"
            disabled={isGenerating || isSaving}
            type="submit"
            styleType="primary"
          >
            Generate
          </Button>
          {artifact && (
            <Button
              type="button"
              className="mt-3"
              disabled={isSaving}
              onClick={saveArtifactToCollectionHandler}
            >
              Save to Collection
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default CreatePage;
