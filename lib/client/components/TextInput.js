module.exports = ({ intent, rounded, size, ...props }) => {
  const classNameList = _.compact(['pt-input', props.className]);
  if (intent) classNameList.push(`pt-intent-${intent}`);
  if (rounded) classNameList.push('pt-round');
  if (size) classNameList.push(`pt-${size}`);
  const className = classNameList.join(' ');

  return (
    <input {...props}
      type="text"
      dir="auto"
      className={className}
    />
  );
};
