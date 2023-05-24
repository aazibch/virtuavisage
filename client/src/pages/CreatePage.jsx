import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';

import { preview } from '../assets';
import { getRandomPrompt, downloadImage } from '../utils';
import { Loader, Input, Button, Modal, ArtifactModal } from '../components';
import { apiUrl } from '../constants';
import { useHttp } from '../hooks';
import { generateHttpConfig } from '../utils';
import thunkAuthActions from '../store/auth-actions';
import { uiActions } from '../store/ui';
import { authActions } from '../store/auth';

const validationSchema = yup.object({
  prompt: yup
    .string('Please provide a valid prompt.')
    .required('Please provide a prompt.')
});

const CreatePage = () => {
  const artifact = useSelector((state) => state.auth.artifact);
  const maximizedArtifact = useSelector((state) => state.ui.maximizedArtifact);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.ui.loading);
  const error = useSelector((state) => state.ui.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(authActions.setArtifact(null));
  }, []);

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
    dispatch(thunkAuthActions.generateArtifact(values));
  };

  const saveArtifactToCollectionHandler = async () => {
    const handleResponse = (response) => {
      navigate('/collection');
    };

    dispatch(thunkAuthActions.saveArtifactToCollection(handleResponse));
  };

  const surpriseMeHandler = () => {
    const randomPrompt = getRandomPrompt(formik.values.prompt);
    formik.setFieldValue('prompt', randomPrompt);
  };

  const openMaximizedArtifactHandler = () => {
    dispatch(uiActions.setMaximizedArtifact(artifact));
  };

  const closeMaximizedArtifactHandler = () => {
    dispatch(uiActions.setMaximizedArtifact(null));
  };

  const dismissErrorHandler = () => {
    dispatch(uiActions.setError(null));
  };

  const maximizedArtifactDownloadHandler = (e, base64Artifact) => {
    // get first 24 digits of the base64 artifact representation.
    const id = base64Artifact
      .replace('data:image/png;base64,', '')
      .slice(0, 24);

    downloadImage(id, base64Artifact);
  };

  let maximizedArtifactEl;

  const generateError = !artifact && error;
  const isGenerating = loading && !artifact;
  const saveError = artifact && error;
  const isSaving = loading && artifact;
  const isArtifactMaximized = maximizedArtifact;

  const dismissSaveError = dismissErrorHandler;
  const dismissGenerateError = dismissErrorHandler;

  if (isArtifactMaximized) {
    const modifiedArtifact = {
      artifactUrl: artifact.image,
      prompt: artifact.prompt,
      user: { ...user }
    };

    maximizedArtifactEl = (
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

  let errorEl;

  if (generateError) {
    errorEl = (
      <Modal
        heading="Error"
        content={generateError}
        dismissModalHandler={dismissGenerateError}
      />
    );
  }

  if (saveError) {
    errorEl = (
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
      {errorEl}
      {maximizedArtifactEl}
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

            {(isGenerating || (isSaving && !maximizedArtifact)) && (
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
