import { MouseEvent as ReactMouseEvent, useRef } from 'react';
import { standardClassnames } from './defaults';
import type { Field, RuleProps, RuleType } from './types';
import { c, getParentPath, getValidationClassNames } from './utils';

export const Rule = ({
  id,
  path,
  field,
  operator,
  value,
  translations,
  schema,
  disabled,
  context,
}: RuleProps) => {
  const {
    classNames,
    controls,
    fields,
    fieldMap,
    getInputType,
    getOperators,
    getValueEditorType,
    getValues,
    moveRule,
    onPropChange,
    onRuleRemove,
    autoSelectField,
    showCloneButtons,
    validationMap,
  } = schema;

  const dndRef = useRef<HTMLDivElement>(null);

  const generateOnChangeHandler =
    (prop: Exclude<keyof RuleType, 'id' | 'path'>) => (value: any) => {
      onPropChange(prop, value, path);
    };

  const cloneRule = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newPath = [...getParentPath(path), path[path.length - 1] + 1];
    moveRule(path, newPath, true);
  };

  const removeRule = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onRuleRemove(path);
  };

  const fieldData = fieldMap?.[field] ?? ({} as Field);
  const inputType = fieldData.inputType ?? getInputType(field, operator);
  const operators = fieldData.operators ?? getOperators(field);
  const valueEditorType = fieldData.valueEditorType ?? getValueEditorType(field, operator);
  const values = fieldData.values ?? getValues(field, operator);
  const level = path.length;

  const validationResult =
    validationMap[id ?? /* istanbul ignore next */ ''] ??
    (typeof fieldData.validator === 'function'
      ? fieldData.validator({ id, field, operator, value })
      : null);
  const validationClassName = getValidationClassNames(validationResult);
  const outerClassName = c(standardClassnames.rule, classNames.rule, validationClassName);

  return (
    <div
      ref={dndRef}
      data-testid="rule"
      className={outerClassName}
      data-rule-id={id}
      data-level={level}
      data-path={JSON.stringify(path)}>
      <controls.fieldSelector
        options={fields}
        title={translations.fields.title}
        value={field}
        operator={operator}
        className={c(standardClassnames.fields, classNames.fields)}
        handleOnChange={generateOnChangeHandler('field')}
        level={level}
        path={path}
        disabled={disabled}
        context={context}
        validation={validationResult}
      />
      {(autoSelectField || fieldData.name !== '~') && (
        <>
          <controls.operatorSelector
            field={field}
            fieldData={fieldData}
            title={translations.operators.title}
            options={operators}
            value={operator}
            className={c(standardClassnames.operators, classNames.operators)}
            handleOnChange={generateOnChangeHandler('operator')}
            level={level}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
          />
          <controls.valueEditor
            field={field}
            fieldData={fieldData}
            title={translations.value.title}
            operator={operator}
            value={value}
            type={valueEditorType}
            inputType={inputType}
            values={values}
            className={c(standardClassnames.value, classNames.value)}
            handleOnChange={generateOnChangeHandler('value')}
            level={level}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
          />
        </>
      )}
      {showCloneButtons && (
        <controls.cloneRuleAction
          label={translations.cloneRule.label}
          title={translations.cloneRule.title}
          className={c(standardClassnames.cloneRule, classNames.cloneRule)}
          handleOnClick={cloneRule}
          level={level}
          path={path}
          disabled={disabled}
          context={context}
          validation={validationResult}
        />
      )}
      <controls.removeRuleAction
        label={translations.removeRule.label}
        title={translations.removeRule.title}
        className={c(standardClassnames.removeRule, classNames.removeRule)}
        handleOnClick={removeRule}
        level={level}
        path={path}
        disabled={disabled}
        context={context}
        validation={validationResult}
      />
    </div>
  );
};

Rule.displayName = 'Rule';
