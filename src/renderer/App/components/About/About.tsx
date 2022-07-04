/* eslint-disable import/prefer-default-export */
export const About: React.FC = () => {
  const appVersion = localStorage.getItem('appVersion');
  return (
    <>
      <div>App version: {appVersion}</div>
      <div>Author: Daniel Febrero</div>
      <div>Co-Author: Aitor</div>
    </>
  );
};
