import { Input, Card, Modal, Avatar, Loader } from '../components';
import { useHttp } from '../hooks';
import { useEffect, useState } from 'react';
import { apiUrl } from '../constants';
import { generateHttpConfig, downloadImage } from '../utils';

const CollectionPage = () => {
  const [artifacts, setArtifacts] = useState(null);
  const [maximizedArtifact, setMaximizedArtifact] = useState();
  const [searchText, setSearchText] = useState('');
  const {
    error: artifactsError,
    isLoading: areArtifactsLoading,
    sendRequest: sendArtifactsRequest,
    dismissErrorHandler: dismissArtifactsErrorHandler
  } = useHttp();
  const {
    error: maximizedArtifactError,
    isLoading: isMaximizedArtifactLoading,
    sendRequest: sendMaximizedArtifactRequest,
    dismissErrorHandler: dismissMaximizedArtifactError
  } = useHttp();

  useEffect(() => {
    const fetchCollectedArtifacts = () => {
      const requestConfig = {
        url: `${apiUrl}/v1/artifacts/collection`,
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const handleResponse = (response) => {
        setArtifacts(response.data.artifacts);
      };

      sendArtifactsRequest(requestConfig, handleResponse);
    };

    fetchCollectedArtifacts();
  }, []);

  const cardClickHandler = (e, id) => {
    const maximizedArtifact = artifacts.find((artifact) => artifact._id === id);

    setMaximizedArtifact({ ...maximizedArtifact });
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };

  const makePublicClickHandler = (e, id) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/public`,
      'POST',
      true,
      { id }
    );

    const handleResponse = (response) => {
      const artifactIndex = artifacts.findIndex(
        (artifact) => artifact._id === response.data.artifact._id
      );

      const updatedArtifacts = [...artifacts];

      updatedArtifacts[artifactIndex] = response.data.artifact;

      setArtifacts(updatedArtifacts);
      setMaximizedArtifact(response.data.artifact);
    };

    sendMaximizedArtifactRequest(requestConfig, handleResponse);
  };

  const removeFromPublicClickHandler = (e, id) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/public/${id}`,
      'DELETE',
      true
    );

    const handleResponse = (response) => {
      const artifactIndex = artifacts.findIndex(
        (artifact) => artifact._id === id
      );

      const updatedArtifacts = [...artifacts];

      updatedArtifacts[artifactIndex] = {
        ...updatedArtifacts[artifactIndex],
        isPublic: false
      };

      setArtifacts(updatedArtifacts);
      setMaximizedArtifact(updatedArtifacts[artifactIndex]);
    };

    sendMaximizedArtifactRequest(requestConfig, handleResponse);
  };

  const downloadClickHandler = (e, artifactId, artifactUrl) => {
    downloadImage(artifactId, artifactUrl);
  };

  const deleteClickHandler = (e, id) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/artifacts/collection/${id}`,
      'DELETE',
      true
    );

    const handleResponse = (response) => {
      const updatedArtifacts = artifacts.filter(
        (artifact) => artifact._id !== id
      );

      setArtifacts(updatedArtifacts);
      setMaximizedArtifact(null);
    };

    sendMaximizedArtifactRequest(requestConfig, handleResponse);
  };

  const closeMaximizedArtifactHandler = () => {
    setMaximizedArtifact(null);
  };

  let modal;

  if (maximizedArtifact) {
    modal = (
      <Modal
        dismissModalHandler={closeMaximizedArtifactHandler}
        dropdownItems={[
          {
            content: maximizedArtifact.isPublic
              ? 'Remove From Public'
              : 'Make Public',
            onClick: maximizedArtifact.isPublic
              ? (e) => removeFromPublicClickHandler(e, maximizedArtifact._id)
              : (e) => makePublicClickHandler(e, maximizedArtifact._id)
          },
          {
            content: 'Download',
            onClick: (e) =>
              downloadClickHandler(
                e,
                maximizedArtifact._id,
                maximizedArtifact.artifactUrl
              )
          },
          {
            content: 'Delete',
            onClick: (e) => deleteClickHandler(e, maximizedArtifact._id)
          }
        ]}
        headerContent={
          <div className="flex items-center gap-2">
            <Avatar content={maximizedArtifact.user.name[0]} />
            <p className="text-sm">{maximizedArtifact.user.name}</p>
          </div>
        }
        contentType="artifact"
        content={
          <>
            <div
              className={`relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 flex justify-center items-center`}
            >
              <img
                src={maximizedArtifact.artifactUrl}
                alt={maximizedArtifact.prompt}
                className="w-full h-full object-contain"
              />
              {isMaximizedArtifactLoading && (
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
            </div>

            <div className="mb-2">
              <p className="mt-5">{maximizedArtifact.prompt}</p>
            </div>
            {maximizedArtifact.isPublic && (
              <span className="border rounded-md bg-gray-500 px-2 py-1 text-white text-sm">
                Public
              </span>
            )}
          </>
        }
      />
    );
  }

  let errorModal;

  if (artifactsError) {
    errorModal = (
      <Modal
        modalZindex="40"
        backdropZindex="30"
        heading="Error"
        content={artifactsError}
        dismissModalHandler={dismissArtifactsErrorHandler}
      />
    );
  }

  if (maximizedArtifactError) {
    errorModal = (
      <Modal
        modalZindex="40"
        backdropZindex="30"
        heading="Error"
        content={maximizedArtifactError}
        dismissModalHandler={dismissMaximizedArtifactError}
      />
    );
  }

  return (
    <div>
      {modal}
      {errorModal}
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Collection
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          All your collected artifacts in one place.
        </p>
      </div>
      <div className="mt-16">
        <Input
          label="Search Artifacts"
          input={{
            type: 'text',
            name: 'text',
            placeholder: 'Search collected artifacts',
            value: searchText,
            onChange: handleSearchChange
          }}
        />
      </div>
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
        {artifacts ? (
          artifacts.map((artifact) => (
            <Card
              onClick={(e) => cardClickHandler(e, artifact._id)}
              key={artifact._id}
              id={artifact._id}
              name={artifact.user.name}
              prompt={artifact.prompt}
              artifact={artifact.artifactUrl}
            />
          ))
        ) : (
          <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
            No posts found
          </h2>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
