import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Input, Card, Modal, Loader, ArtifactModal } from '../components';
import thunkAuthActions from '../store/auth-actions';
import { uiActions } from '../store/ui';

let searchTimeout = null;

const CollectionPage = () => {
  const areArtifactsLoading = useSelector((state) => state.ui.loading);
  const artifactsError = useSelector((state) => state.ui.error);
  const artifacts = useSelector((state) => state.auth.collectedArtifacts);
  const maximizedArtifact = useSelector((state) => state.ui.maximizedArtifact);
  const [searchResults, setSearchResults] = useState(null);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      searchText: ''
    }
  });

  const {
    values: { searchText: formikSearchText }
  } = formik;

  useEffect(() => {
    if (!artifacts) {
      dispatch(thunkAuthActions.fetchCollectedArtifacts());
    }
  }, [artifacts]);

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

    dispatch(uiActions.setMaximizedArtifact(maximizedArtifact));
  };

  const closeMaximizedArtifactHandler = () => {
    dispatch(uiActions.setMaximizedArtifact(null));
  };

  let modal;

  if (maximizedArtifact) {
    modal = (
      <ArtifactModal
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
    artifactsContent = searchResults.map((artifact) => {
      return (
        <Card
          onClick={(e) => cardClickHandler(e, artifact._id)}
          key={artifact._id}
          id={artifact._id}
          name={artifact.user.name}
          prompt={artifact.prompt}
          artifact={artifact.artifactUrl}
        />
      );
    });
  }

  if (searchResults?.length === 0) {
    artifactsContent = (
      <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
        No search results founds.
      </h2>
    );
  }

  console.log('searchResults', searchResults);

  if (!searchResults && artifacts) {
    console.log('rendering new artifacts content.');
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

  if (!searchResults && !artifacts) {
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
        <div className="mt-16 mb-5">
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
