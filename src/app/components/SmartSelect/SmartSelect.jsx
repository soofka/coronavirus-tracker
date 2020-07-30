import { h, Fragment } from 'preact';

export const SmartSelect = ({
  id,
  label,
  options,
  value,
  setValue,
  withButtons = false,
  reverseButtons = false,
  ...rest
}) => {
  // const optionsKeys = Object.keys(options);
  const currentOptionIndex = options.findIndex((option) => option.value === value);
  const indexMoreThanZero = currentOptionIndex > 0;
  const indexLessThanLength = currentOptionIndex < options.length - 1;
  const hasPreviousOption = reverseButtons ? indexLessThanLength : indexMoreThanZero;
  const hasNextOption = reverseButtons ? indexMoreThanZero : indexLessThanLength;

  const withContainer = (content) => withButtons
    ? <p style={{ display: 'flex', flexWrap: 'wrap' }}><div>{content}</div></p>
    : content;

  return withContainer(
    <>
      {label && <><label for={id}>{label}</label>:&nbsp;</>}
      {withButtons && <button
        onClick={(event) => {
          event.preventDefault();

          if (hasPreviousOption) {
            const newOptionIndex = reverseButtons ? currentOptionIndex + 1 : currentOptionIndex - 1;
            const newOption = options[newOptionIndex];
            setValue(newOption.value);
          }
        }}
        style={{ opacity: hasPreviousOption ? 1 : 0 }}
        disabled={!hasPreviousOption}
      >&laquo;</button>}
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => {
          event.preventDefault();
          setValue(event.target.value);
        }}
        style={withButtons ? { margin: '0px 8px' } : {}}
        {...rest}>
        {options.map((option, index) =>
          <option key={index} value={option.value}>{option.text}</option>)}
      </select>
      {withButtons && <button
        onClick={(event) => {
          event.preventDefault();

          if (hasNextOption) {
            const newOptionIndex = reverseButtons ? currentOptionIndex - 1 : currentOptionIndex + 1;
            const newOption = options[newOptionIndex];
            setValue(newOption.value);
          }
        }}
        style={{ opacity: hasNextOption ? 1 : 0 }}
        disabled={!hasNextOption}
      >&raquo;</button>}
    </>
  );
};
