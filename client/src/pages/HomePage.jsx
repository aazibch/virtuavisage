import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Loader, Card, ArtifactModal, Modal } from '../components';
import thunkArtifactsActions from '../store/artifacts-actions';
import { uiActions } from '../store/ui';

const Home = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const artifacts = useSelector((state) => state.artifacts.publicArtifacts);
  const maximizedArtifact = useSelector((state) => state.ui.maximizedArtifact);
  const artifactsError = useSelector((state) => state.ui.error);
  const loading = useSelector((state) => state.ui.loading);

  useEffect(() => {
    if (!artifacts) {
      dispatch(thunkArtifactsActions.fetchPublicArtifacts());
    }
  }, [artifacts]);

  const cardClickHandler = (e, id) => {
    const maximizedArtifact = artifacts.find((artifact) => artifact._id === id);
    dispatch(uiActions.setMaximizedArtifact(maximizedArtifact));
  };

  const closeMaximizedArtifactHandler = () => {
    dispatch(uiActions.setMaximizedArtifact(null));
  };

  let errorModal;

  if (artifactsError) {
    errorModal = <Modal heading="Error" content={artifactsError} />;
  }

  let artifactsContent;

  if (artifacts?.length > 0) {
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

  if (artifacts?.length === 0) {
    artifactsContent = (
      <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
        No artifacts found
      </h2>
    );
  }

  let maximizedArtifactModal;

  if (maximizedArtifact) {
    maximizedArtifactModal = (
      <ArtifactModal
        dismissModalHandler={closeMaximizedArtifactHandler}
        artifact={maximizedArtifact}
        belongsToUser={user?._id === maximizedArtifact.user?._id}
        isPublic
      />
    );
  }

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center items-center mt-14">
        <Loader />
      </div>
    );
  }

  if (artifacts) {
    content = (
      <div className="mt-16 grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
        {artifactsContent}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      {maximizedArtifactModal}
      {errorModal}
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Community Artwork
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse through a collection of diverse, visually-appealing artifacts
          generated with the Stable Diffusion image generation model.
        </p>
      </div>
      {content}
    </section>
  );
};

export default Home;
