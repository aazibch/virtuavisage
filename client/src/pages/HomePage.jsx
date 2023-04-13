import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader, Card, ArtifactModal, Modal } from '../components';
import { apiUrl } from '../constants';
import { generateHttpConfig } from '../utils';
import { useHttp } from '../hooks';

const Home = () => {
  const [areArtifactsLoading, setAreArtifactsLoading] = useState(false);
  const [artifacts, setArtifacts] = useState(null);
  const [maximizedArtifact, setMaximizedArtifact] = useState(null);

  const user = useSelector((state) => state.user);
  const { error: artifactsError, sendRequest: sendArtifactsRequest } =
    useHttp();

  useEffect(() => {
    const getArtifacts = async () => {
      setAreArtifactsLoading(true);
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/public`,
        'GET'
      );

      const handleResponse = (response) => {
        setArtifacts(response.data.artifacts);
        setAreArtifactsLoading(false);
      };

      const handleError = (error) => {
        setAreArtifactsLoading(false);
      };

      sendArtifactsRequest(requestConfig, handleResponse, handleError);
    };

    getArtifacts();
  }, []);

  const cardClickHandler = (e, id) => {
    const maximizedArtifact = artifacts.find((artifact) => artifact._id === id);

    setMaximizedArtifact({ ...maximizedArtifact });
  };

  const closeMaximizedArtifactHandler = () => {
    setMaximizedArtifact(null);
  };

  const postRemoveFromPublicHandler = (id) => {
    const updatedArtifacts = artifacts.filter(
      (artifact) => artifact._id !== id
    );

    setArtifacts(updatedArtifacts);
    setMaximizedArtifact(null);
  };

  const postDeleteHandler = (id) => {
    const updatedArtifacts = artifacts.filter(
      (artifact) => artifact._id !== id
    );

    setArtifacts(updatedArtifacts);
    setMaximizedArtifact(null);
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
        postRemoveFromPublicHandler={postRemoveFromPublicHandler}
        postDeleteHandler={postDeleteHandler}
        dismissModalHandler={closeMaximizedArtifactHandler}
        artifact={maximizedArtifact}
        belongsToUser={user?._id === maximizedArtifact.user._id}
      />
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
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse through a collection of imaginative and visually appealing
          artifacts generated with Stable Diffusion.
        </p>
      </div>
      {content}
    </section>
  );
};

export default Home;
