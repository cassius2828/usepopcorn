const ErrorMessage = ({ message }) => {
  return (
    <div className="error">
      <p>{message}</p>
      <span>📛</span>
    </div>
  );
};

export default ErrorMessage;