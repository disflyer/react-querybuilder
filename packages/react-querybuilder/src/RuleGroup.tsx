import { Fragment, MouseEvent as ReactMouseEvent } from 'react';
import { standardClassnames } from './defaults';
import type { RuleGroupProps } from './types';
import { c, getValidationClassNames } from './utils';

export const RuleGroup = ({
  id,
  path,
  combinator = 'and',
  rules,
  translations,
  schema,
  disabled,
  context,
}: RuleGroupProps) => {
  const {
    classNames,
    combinators,
    controls,
    createRule,
    createRuleGroup,
    onGroupAdd,
    onGroupRemove,
    onPropChange,
    onRuleAdd,
    validationMap,
  } = schema;

  const onCombinatorChange = (value: any) => {
    onPropChange('combinator', value, path);
  };

  const addRule = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newRule = createRule();
    onRuleAdd(newRule, path);
  };

  const addGroup = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newGroup = createRuleGroup();
    onGroupAdd(newGroup, path);
  };

  const removeGroup = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onGroupRemove(path);
  };

  const level = path.length;

  const validationResult = validationMap[id ?? /* istanbul ignore next */ ''];
  const validationClassName = getValidationClassNames(validationResult);
  const outerClassName = c(standardClassnames.ruleGroup, classNames.ruleGroup, validationClassName);

  return (
    <div
      className={outerClassName}
      data-testid="rule-group"
      data-rule-group-id={id}
      data-level={level}
      data-path={JSON.stringify(path)}>
      <div className={c(standardClassnames.header, classNames.header)}>
        <controls.addRuleAction
          label={translations.addRule.label}
          title={translations.addRule.title}
          className={c(standardClassnames.addRule, classNames.addRule)}
          handleOnClick={addRule}
          rules={rules}
          level={level}
          path={path}
          disabled={disabled}
          context={context}
          validation={validationResult}
        />
        <controls.addGroupAction
          label={translations.addGroup.label}
          title={translations.addGroup.title}
          className={c(standardClassnames.addGroup, classNames.addGroup)}
          handleOnClick={addGroup}
          rules={rules}
          level={level}
          path={path}
          disabled={disabled}
          context={context}
          validation={validationResult}
        />
        {path.length >= 1 && (
          <controls.removeGroupAction
            label={translations.removeGroup.label}
            title={translations.removeGroup.title}
            className={c(standardClassnames.removeGroup, classNames.removeGroup)}
            handleOnClick={removeGroup}
            rules={rules}
            level={level}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
          />
        )}
      </div>
      <div className={c(standardClassnames.body, classNames.body)}>
        <div>
          <div className="ruleGroup-combinators-wrapper">
            <controls.combinatorSelector
              options={combinators}
              value={combinator}
              title={translations.combinators.title}
              className={c(standardClassnames.combinators, classNames.combinators)}
              handleOnChange={onCombinatorChange}
              rules={rules}
              level={level}
              path={path}
              disabled={disabled}
              context={context}
              validation={validationResult}
            />
          </div>
        </div>
        <div>
          {rules.map((r, idx) => {
            const thisPath = path.concat([idx]);
            return (
              <Fragment key={thisPath.join('-')}>
                {'rules' in r ? (
                  <controls.ruleGroup
                    id={r.id}
                    schema={schema}
                    path={thisPath}
                    combinator={'combinator' in r ? r.combinator : undefined}
                    translations={translations}
                    rules={r.rules}
                    disabled={disabled}
                    not={!!r.not}
                    context={context}
                  />
                ) : (
                  <controls.rule
                    id={r.id!}
                    field={r.field}
                    value={r.value}
                    operator={r.operator}
                    schema={schema}
                    path={thisPath}
                    disabled={disabled}
                    translations={translations}
                    context={context}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

RuleGroup.displayName = 'RuleGroup';
