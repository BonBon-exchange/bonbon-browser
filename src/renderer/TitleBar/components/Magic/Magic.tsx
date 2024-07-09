const initChat = () => {
  window.titleBar.chat.init();
};

export const Magic = () => {
  return (
    <div className="magic-connector" onClick={initChat}>
      @
    </div>
  );
};
