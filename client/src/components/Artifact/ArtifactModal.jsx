import { Modal, Avatar, Loader } from '../';

const ArtifactModal = ({
  dismissModalHandler,
  dropdownItems,
  artifact,
  isLoading
}) => {
  return (
    <Modal
      dismissModalHandler={dismissModalHandler}
      dropdownItems={dropdownItems}
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
            {isLoading && (
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
  );
};

export default ArtifactModal;
