import { h, Fragment } from 'preact';

import { isObject, objectHasKey } from 'commons/utils';

export const SmartButtons = ({
  label,
  options,
  value,
  setValue,
  onClick = () => {},
  multichoice = false,
  allowDisableAll = false,
  activeClassName = 'active',
  ...rest
}) => 
  <p {...rest}>
    {label && <>{label}:&nbsp;</>}
    {options.map((option, index) => {
      const active = multichoice
        ? isObject(value) && objectHasKey(value, option.value) && value[option.value] === true
        : value === option.value;

      return (
        <button
          className={active ? activeClassName : ''}
          style={index < options.length - 1 ? { marginRight: '8px' } : {}}
          onClick={(event) => {
            event.preventDefault();
            
            if (multichoice) {
              const newValue = isObject(value) ? { ...value } : {};

              if (active) {
                if (
                  allowDisableAll
                  || Object.values(value).filter((tempValue) => tempValue === true).length > 1
                ) {
                  newValue[option.value] = false;
                  setValue(newValue);
                }
              } else {
                newValue[option.value] = true;
                setValue(newValue);
              }
            } else if (!active) {
              setValue(option.value);
            }
          }}
        >
          {option.text}
        </button>
      );
    })}
  </p>;
