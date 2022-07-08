/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
export const ApplicationSettings: React.FC = () => {
  return (
    <>
      <h2>Application</h2>
      <div className="Settings__item">
        <input type="checkbox" id="application-settings-launch" />
        <label htmlFor="application-settings-launch">Launch at startup</label>
      </div>
    </>
  );
};
