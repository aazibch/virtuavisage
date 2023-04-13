import { useState } from 'react';
import { Modal, Avatar, Loader } from '../';
import { useHttp } from '../../hooks';
import { generateHttpConfig } from '../../utils';
import { apiUrl } from '../../constants';

const ArtifactModal = ({
  dismissModalHandler,
  artifact,
  belongsToUser,
  dropdownItems,
  isLoading,
  postMakePublicHandler,
  postRemoveFromPublicHandler,
  postDeleteHandler,
  saveToCollectionHandler
}) => {
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const {
    error,
    isLoading: modalLoading,
    sendRequest,
    dismissErrorHandler
  } = useHttp();

  const makePublicHandler = (e, id) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/public`,
      'POST',
      true,
      { id }
    );

    const handleResponse = (response) => {
      postMakePublicHandler(response.data.artifact);
    };

    sendRequest(requestConfig, handleResponse);
  };

  const removeFromPublicHandler = (e, id) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/public/${id}`,
      'DELETE',
      true
    );

    const handleResponse = (response) => {
      postRemoveFromPublicHandler(id);
    };

    sendRequest(requestConfig, handleResponse);
  };

  const deleteButtonHandler = () => {
    setShowDeletionModal(true);
  };

  const deleteModalCloseHandler = () => {
    setShowDeletionModal(false);
  };

  const deleteConfirmHandler = (e) => {
    const { _id: id } = artifact;
    setShowDeletionModal(false);
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/collection/${id}`,
      'DELETE',
      true
    );

    const handleResponse = (response) => {
      postDeleteHandler(id);
    };

    sendRequest(requestConfig, handleResponse);
  };

  const downloadHandler = (e, artifactId, artifactUrl) => {
    downloadImage(artifactId, artifactUrl);
  };

  let modalDropdownItems = [];

  if (dropdownItems) {
    modalDropdownItems = [...dropdownItems];
  } else {
    if (belongsToUser) {
      modalDropdownItems.push({
        content: artifact.isPublic ? 'Remove From Public' : 'Make Public',
        onClick: artifact.isPublic
          ? (e) => removeFromPublicHandler(e, artifact._id)
          : (e) => makePublicHandler(e, artifact._id)
      });
    }

    modalDropdownItems.push({
      content: 'Download',
      onClick: (e) => downloadHandler(e, artifact._id, artifact.artifactUrl)
    });

    if (belongsToUser) {
      modalDropdownItems.push({
        content: 'Delete',
        onClick: deleteButtonHandler
      });
    }
  }

  let errorModal;

  if (error) {
    errorModal = (
      <Modal
        overlaid
        heading="Error"
        content={error}
        dismissModalHandler={dismissErrorHandler}
      />
    );
  }

  let deletionModal;

  if (showDeletionModal) {
    deletionModal = (
      <Modal
        overlaid
        heading="Deletion Confirmation"
        contentType="deletionPrompt"
        content="Are you sure you want to delete this artifact?"
        dismissModalHandler={deleteModalCloseHandler}
        confirmModalHandler={deleteConfirmHandler}
      />
    );
  }

  return (
    <>
      {errorModal}
      {deletionModal}
      <Modal
        disableClick={isLoading || modalLoading}
        dismissModalHandler={dismissModalHandler}
        dropdownItems={modalDropdownItems}
        headerContent={
          <div className="flex items-center gap-2">
            <Avatar content={artifact.user.name[0]} />
            <p className="text-sm">{artifact.user.name}</p>
          </div>
        }
        contentType="artifact"
        content={
          <>
            <div
              className={`relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 flex justify-center items-center`}
            >
              <img
                src={artifact.artifactUrl}
                alt={artifact.prompt}
                className="w-full h-full object-contain"
              />
              {(isLoading || modalLoading) && (
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
            </div>

            <div className="mb-2">
              <p className="mt-5">{artifact.prompt}</p>
            </div>
            {artifact.isPublic && (
              <span className="border rounded-md bg-gray-500 px-2 py-1 text-white text-sm">
                Public
              </span>
            )}
          </>
        }
      />
    </>
  );
};

export default ArtifactModal;
