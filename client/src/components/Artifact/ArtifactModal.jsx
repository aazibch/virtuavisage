import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Modal, Avatar, Loader } from '../';
import { downloadImage } from '../../utils';
import thunkAuthActions from '../../store/auth-actions';
import { uiActions } from '../../store/ui';

const ArtifactModal = ({
  dismissModalHandler,
  artifact,
  belongsToUser,
  dropdownItems
}) => {
  const showDeletionModal = useSelector((state) => state.ui.showDeletionModal);
  const error = useSelector((state) => state.ui.error);
  const isLoading = useSelector((state) => state.ui.loading);
  const modalLoading = useSelector(
    (state) => state.ui.maximizedArtifactLoading
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const makePublicHandler = (e, id) => {
    dispatch(thunkAuthActions.makeArtifactPublic(id));
  };

  const removeFromPublicHandler = (e, id) => {
    if (location.pathname === '/') {
      dispatch(thunkAuthActions.removeArtifactFromPublic(id, true));
    } else {
      dispatch(thunkAuthActions.removeArtifactFromPublic(id));
    }
  };

  const deleteButtonHandler = () => {
    dispatch(uiActions.setShowDeletionModal(true));
  };

  const deleteModalCloseHandler = () => {
    dispatch(uiActions.setShowDeletionModal(false));
  };

  const deleteConfirmHandler = (e) => {
    const { _id: id } = artifact;
    dispatch(uiActions.setShowDeletionModal(false));
    // if (location.pathname === '/collection') {
    //   dispatch(
    //     thunkAuthActions.deleteArtifact(id, () => {
    //       navigate(0);
    //     })
    //   );
    // } else {
    dispatch(thunkAuthActions.deleteArtifact(id));
    // }
  };

  const dismissErrorHandler = () => {
    dispatch(uiActions.setError(null));
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
            <Avatar content={artifact.user?.name[0]} />
            <p className="text-sm">{artifact.user?.name}</p>
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
