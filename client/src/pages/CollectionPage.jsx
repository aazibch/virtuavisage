import { useFormik } from 'formik';
import { Input, Card, Modal, Loader, ArtifactModal } from '../components';
import { useHttp } from '../hooks';
import { useEffect, useState } from 'react';
import { apiUrl } from '../constants';
import { generateHttpConfig } from '../utils';

let searchTimeout = null;

const CollectionPage = () => {
  const [areArtifactsLoading, setAreArtifactsLoading] = useState(true);
  const [artifacts, setArtifacts] = useState(null);
  const [maximizedArtifact, setMaximizedArtifact] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const { error: artifactsError, sendRequest: sendArtifactsRequest } =
    useHttp();

  const formik = useFormik({
    initialValues: {
      searchText: ''
    }
  });

  const {
    values: { searchText: formikSearchText }
  } = formik;

  useEffect(() => {
    const fetchCollectedArtifacts = () => {
      setAreArtifactsLoading(true);

      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/collection`,
        'GET',
        true
      );

      const handleResponse = (response) => {
        setArtifacts(response.data.artifacts);
        setAreArtifactsLoading(false);
      };

      const handleError = () => {
        setAreArtifactsLoading(false);
      };

      sendArtifactsRequest(requestConfig, handleResponse, handleError);
    };

    fetchCollectedArtifacts();
  }, []);

  useEffect(() => {
    if (artifacts) {
      searchTimeout = setTimeout(() => {
        const searchResults = artifacts.filter((item) =>
          item.prompt.toLowerCase().includes(formikSearchText.toLowerCase())
        );

        setSearchResults(searchResults);
      }, 500);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
      }
    };
  }, [formikSearchText]);

  const cardClickHandler = (e, id) => {
    const maximizedArtifact = artifacts.find((artifact) => artifact._id === id);

    setMaximizedArtifact({ ...maximizedArtifact });
  };

  const closeMaximizedArtifactHandler = () => {
    console.log('[closeMaximizedArtifactHandler]');
    setMaximizedArtifact(null);
    console.log('[closeMaximizedArtifactHandler]', maximizedArtifact);
  };

  const postMakePublicHandler = (updatedArtifact) => {
    const artifactIndex = artifacts.findIndex(
      (artifact) => artifact._id === updatedArtifact._id
    );

    const updatedArtifacts = [...artifacts];

    updatedArtifacts[artifactIndex] = updatedArtifact;

    setArtifacts(updatedArtifacts);
    if (maximizedArtifact) {
      console.log('i am run');
      console.log('maximizedArtifact', maximizedArtifact);

      setMaximizedArtifact(updatedArtifact);
    }
  };

  const postRemoveFromPublicHandler = (id) => {
    const artifactIndex = artifacts.findIndex(
      (artifact) => artifact._id === id
    );

    const updatedArtifacts = [...artifacts];

    updatedArtifacts[artifactIndex] = {
      ...updatedArtifacts[artifactIndex],
      isPublic: false
    };

    setArtifacts(updatedArtifacts);
    if (maximizedArtifact) {
      console.log('i am run');
      console.log('maximizedArtifact', maximizedArtifact);
      setMaximizedArtifact(updatedArtifacts[artifactIndex]);
    }
  };

  const postDeleteHandler = (id) => {
    const updatedArtifacts = artifacts.filter(
      (artifact) => artifact._id !== id
    );

    setArtifacts(updatedArtifacts);
    setMaximizedArtifact(null);
  };

  let modal;

  if (maximizedArtifact) {
    modal = (
      <ArtifactModal
        postMakePublicHandler={postMakePublicHandler}
        postRemoveFromPublicHandler={postRemoveFromPublicHandler}
        postDeleteHandler={postDeleteHandler}
        dismissModalHandler={closeMaximizedArtifactHandler}
        artifact={maximizedArtifact}
        belongsToUser={true}
      />
    );
  }

  let errorModal;

  if (artifactsError) {
    errorModal = <Modal heading="Error" content={artifactsError} />;
  }

  let artifactsContent;

  if (searchResults?.length > 0) {
    artifactsContent = searchResults.map((artifact) => (
      <Card
        onClick={(e) => cardClickHandler(e, artifact._id)}
        key={artifact._id}
        id={artifact._id}
        name={artifact.user.name}
        prompt={artifact.prompt}
        artifact={artifact.artifactUrl}
      />
    ));
  }

  if (searchResults?.length === 0) {
    artifactsContent = (
      <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
        No search results founds.
      </h2>
    );
  }

  if (!searchResults && artifacts?.length > 0) {
    artifactsContent = artifacts.map((artifact) => (
      <Card
        onClick={(e) => cardClickHandler(e, artifact._id)}
        key={artifact._id}
        id={artifact._id}
        name={artifact.user.name}
        prompt={artifact.prompt}
        artifact={artifact.artifactUrl}
      />
    ));
  }

  if (!searchResults && artifacts?.length === 0) {
    artifactsContent = (
      <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
        No artifacts found
      </h2>
    );
  }

  let content;

  if (areArtifactsLoading) {
    content = (
      <div className="flex justify-center items-center mt-14">
        <Loader />
      </div>
    );
  }

  if (artifacts) {
    content = (
      <>
        <div className="mt-16">
          <Input
            label="Search Artifacts"
            input={{
              type: 'text',
              name: 'searchText',
              placeholder: 'Search collected artifacts',
              value: formikSearchText,
              onChange: formik.handleChange
            }}
          />
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
          {artifactsContent}
        </div>
      </>
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
      {content}
    </div>
  );
};

export default CollectionPage;
